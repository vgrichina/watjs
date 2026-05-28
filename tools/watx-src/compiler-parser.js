// ═══════════════════════════════════════════════════════════════
// WATX COMPILER — Stage 1: Parser
// S-expression reader with position tracking
// ═══════════════════════════════════════════════════════════════

class ParseError extends Error {
  constructor(msg, line, col, file) {
    super(msg);
    this.line = line;
    this.col = col;
    this.file = file || '<main>';
  }
}

function tokenize(source, filename) {
  const tokens = [];
  let i = 0, line = 1, col = 1;
  while (i < source.length) {
    const ch = source[i];
    if (ch === '\n') { line++; col = 1; i++; continue; }
    if (ch === ' ' || ch === '\t' || ch === '\r') { col++; i++; continue; }
    if (ch === ';' && source[i+1] === ';') {
      const start = i;
      while (i < source.length && source[i] !== '\n') i++;
      tokens.push({ type: 'comment', value: source.slice(start, i), line, col, file: filename });
      continue;
    }
    if (ch === '(') { tokens.push({ type: 'lparen', value: '(', line, col, file: filename }); i++; col++; continue; }
    if (ch === ')') { tokens.push({ type: 'rparen', value: ')', line, col, file: filename }); i++; col++; continue; }
    if (ch === '"') {
      let str = '"';
      const startCol = col;
      i++; col++;
      while (i < source.length && source[i] !== '"') {
        if (source[i] === '\\') { str += source[i]; i++; col++; }
        str += source[i]; i++; col++;
      }
      if (i < source.length) { str += '"'; i++; col++; }
      tokens.push({ type: 'string', value: str, line, col: startCol, file: filename });
      continue;
    }
    if (/[0-9]/.test(ch) || (ch === '-' && /[0-9]/.test(source[i+1]))) {
      let num = '';
      const startCol = col;
      while (i < source.length && /[0-9.\-xXa-fA-F]/.test(source[i])) { num += source[i]; i++; col++; }
      tokens.push({ type: 'number', value: num, line, col: startCol, file: filename });
      continue;
    }
    if (/[a-zA-Z_$\-\.{}\+\*\/\<\>\=\!\&\|\^\~\%\?\@\#]/.test(ch)) {
      let sym = '';
      const startCol = col;
      while (i < source.length && /[a-zA-Z0-9_$\-\.{}\+\*\/\<\>\=\!\&\|\^\~\%\?\@\#]/.test(source[i])) { sym += source[i]; i++; col++; }
      tokens.push({ type: 'symbol', value: sym, line, col: startCol, file: filename });
      continue;
    }
    i++; col++;
  }
  return tokens;
}

// Pre-scan source for paren balance and return diagnostic info
function preScanParenBalance(source, filename) {
  let depth = 0;
  let maxDepth = 0;
  let maxDepthLine = 0;
  let i = 0, line = 1;
  let inComment = false;
  const lineInfo = [];
  let lineOpens = 0, lineCloses = 0, lineDepthStart = 0;
  
  lineDepthStart = 0;
  
  while (i < source.length) {
    const ch = source[i];
    
    if (ch === '\n') {
      lineInfo.push({ line, depthStart: lineDepthStart, depthEnd: depth, opens: lineOpens, closes: lineCloses });
      line++;
      lineOpens = 0;
      lineCloses = 0;
      lineDepthStart = depth;
      inComment = false;
      i++;
      continue;
    }
    
    if (inComment) { i++; continue; }
    
    if (ch === ';' && i + 1 < source.length && source[i + 1] === ';') {
      inComment = true;
      i++;
      continue;
    }
    
    if (ch === '"' && !inComment) {
      i++;
      while (i < source.length && source[i] !== '"') {
        if (source[i] === '\\') i++;
        i++;
      }
      if (i < source.length) i++;
      continue;
    }
    
    if (ch === '(') {
      depth++;
      lineOpens++;
      if (depth > maxDepth) { maxDepth = depth; maxDepthLine = line; }
    } else if (ch === ')') {
      depth--;
      lineCloses++;
      if (depth < 0) {
        return { balanced: false, extraClose: true, line, depth, lineInfo };
      }
    }
    
    i++;
  }
  lineInfo.push({ line, depthStart: lineDepthStart, depthEnd: depth, opens: lineOpens, closes: lineCloses });
  
  return { balanced: depth === 0, depth, maxDepth, maxDepthLine, lineInfo };
}

// originalSource is optional — pass it for better diagnostics on paren errors
function parseSexpr(tokens, originalSource) {
  let pos = 0;
  function parseOne() {
    if (pos >= tokens.length) throw new ParseError('Unexpected end of input', 0, 0);
    const tok = tokens[pos];
    if (tok.type === 'comment') { pos++; return parseOne(); }
    if (tok.type === 'lparen') {
      pos++;
      const list = [];
      list._meta = { line: tok.line, col: tok.col, file: tok.file };
      while (pos < tokens.length && tokens[pos].type !== 'rparen') {
        if (tokens[pos].type === 'comment') { pos++; continue; }
        list.push(parseOne());
      }
      if (pos >= tokens.length) {
        let diagMsg = 'Unmatched (';
        try {
          const errorLine = tok.line;
          if (originalSource) {
            const scan = preScanParenBalance(originalSource, tok.file || '<main>');
            const li = scan.lineInfo;
            const sourceLines = originalSource.split('\n');
            
            diagMsg += ' at line ' + errorLine + ', col ' + tok.col;
            diagMsg += '\n' + scan.depth + ' unclosed paren(s) at EOF';
            diagMsg += '\nMax nesting depth: ' + scan.maxDepth + ' at line ' + scan.maxDepthLine;
            
            const topLevelEnds = [];
            for (let j = 0; j < li.length; j++) {
              if (li[j].depthEnd === 0 && li[j].depthStart > 0) {
                topLevelEnds.push(li[j].line);
              }
            }
            const lastClosed = topLevelEnds.length > 0 ? topLevelEnds[topLevelEnds.length - 1] : 0;
            diagMsg += '\nLast closed top-level form ends at line: ' + lastClosed;
            
            diagMsg += '\n\n=== Paren depth trace (from line ' + errorLine + ') ===\n';
            diagMsg += 'D=depth_before → depth_after | Line# | Source\n\n';
            let shown = 0;
            for (let j = 0; j < li.length && shown < 100; j++) {
              if (li[j].line >= errorLine) {
                const srcLine = sourceLines[li[j].line - 1] || '';
                const truncSrc = srcLine.length > 70 ? srcLine.substring(0, 67) + '...' : srcLine;
                let flag = '';
                if (li[j].depthEnd === 0) flag = ' ◄◄ TOP-LEVEL (depth=0)';
                else if (li[j].depthEnd === 1 && li[j].depthStart > 1) flag = ' ◄ back to func-level';
                else if (li[j].opens > 0 && li[j].closes === 0 && li[j].opens > 1) flag = ' ⚠ opens only (+' + li[j].opens + ')';
                diagMsg += 'D' + String(li[j].depthStart).padStart(2) + '→' + String(li[j].depthEnd).padStart(2) + ' L' + String(li[j].line).padStart(5) + ' │ ' + truncSrc + flag + '\n';
                shown++;
              }
            }
            
            diagMsg += '\n=== Last 30 lines of file ===\n';
            const startIdx = Math.max(0, li.length - 30);
            for (let j = startIdx; j < li.length; j++) {
              const srcLine = sourceLines[li[j].line - 1] || '';
              const truncSrc = srcLine.length > 70 ? srcLine.substring(0, 67) + '...' : srcLine;
              let flag = '';
              if (li[j].depthEnd === 0) flag = ' ◄◄ TOP-LEVEL';
              diagMsg += 'D' + String(li[j].depthStart).padStart(2) + '→' + String(li[j].depthEnd).padStart(2) + ' L' + String(li[j].line).padStart(5) + ' │ ' + truncSrc + flag + '\n';
            }
            
            diagMsg += '\nFinal depth: ' + scan.depth + ' (need ' + scan.depth + ' more closing parens)\n';
          } else {
            diagMsg += ' (opened at line ' + errorLine + ', col ' + tok.col + ')';
            let d = 0;
            const allTokenLines = [];
            let curLine = 1, lineOpen = 0, lineClose = 0;
            for (let ti = 0; ti < tokens.length; ti++) {
              const t = tokens[ti];
              while (curLine < t.line) {
                allTokenLines.push({ line: curLine, open: lineOpen, close: lineClose, depth: d });
                curLine++; lineOpen = 0; lineClose = 0;
              }
              if (t.type === 'lparen') { d++; lineOpen++; }
              else if (t.type === 'rparen') { d--; lineClose++; }
            }
            allTokenLines.push({ line: curLine, open: lineOpen, close: lineClose, depth: d });
            
            diagMsg += '\n\n=== Last 100 lines with paren depth ===\n';
            const startShow = Math.max(0, allTokenLines.length - 100);
            for (let li = startShow; li < allTokenLines.length; li++) {
              const info = allTokenLines[li];
              const depthBefore = info.depth - info.open + info.close;
              const marker = (info.line === errorLine) ? ' <<<< UNMATCHED' : '';
              diagMsg += 'D=' + String(depthBefore).padStart(3) + ' →D' + String(info.depth).padStart(3) + ' | L' + String(info.line).padStart(5) + marker + '\n';
            }
            diagMsg += '\nFinal depth: ' + d + '\n';
          }
        } catch(diagErr) {
          diagMsg += ' (diagnostic generation failed: ' + diagErr.message + ')';
        }
        throw new ParseError(diagMsg, tok.line, tok.col);
      }
      pos++;
      return list;
    }
    if (tok.type === 'rparen') throw new ParseError('Unexpected ) — extra closing paren', tok.line, tok.col);
    pos++;
    return { type: tok.type, value: tok.value, line: tok.line, col: tok.col, file: tok.file };
  }
  const forms = [];
  while (pos < tokens.length) {
    if (tokens[pos].type === 'comment') { pos++; continue; }
    forms.push(parseOne());
  }
  return forms;
}