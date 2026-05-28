// ═══════════════════════════════════════════════════════════════
// WATX COMPILER — Pipeline Orchestrator
// Compiles WATX → Real WebAssembly Binary
// ═══════════════════════════════════════════════════════════════
//
// DESIGN: Zero implicit coercion.
// All type conversions must be explicit in WATX source.
// The compiler never inserts i32.trunc_f32_s or f32.convert_i32_s
// on behalf of the programmer. If types don't match, the Wasm
// validator will reject the binary — which is correct behavior.
//
// Modules:
//   compiler-parser.js   — Stage 1: tokenize, parseSexpr, ParseError
//   compiler-stages.js   — Stages 2-4: resolveIncludes, expandMacros, checkTypes
//   compiler-codegen.js  — Stages 5-6: lowerIR, generateWasm, disassembleWasm
//   compiler.js (this)   — Pipeline glue: compile(), formatSexpr(), formatLowered()
//

// --- Full Compiler Pipeline ---
function compile(source, vfs = new Map()) {
  const stages = [];
  let currentStage = 'PARSE';
  
  try {
    // Stage 1: Parse
    currentStage = 'PARSE';
    const tokens = tokenize(source, '<main>');
    const ast = parseSexpr(tokens, source);
    stages.push({ name: 'PARSE', success: true });
    
    // Stage 2: Include
    currentStage = 'INCLUDE';
    const included = resolveIncludes(ast, vfs);
    stages.push({ name: 'INCLUDE', success: true });
    
    // Stage 3: Expand
    currentStage = 'EXPAND';
    const expanded = expandMacros(included);
    stages.push({ name: 'EXPAND', success: true });
    
    // Stage 4: Check
    currentStage = 'CHECK';
    const checkResult = checkTypes(expanded);
    stages.push({ name: 'CHECK', success: true, warnings: checkResult.warnings });
    
    // Stage 5: Lower
    currentStage = 'LOWER';
    const lowered = lowerIR(expanded, checkResult);
    stages.push({ name: 'LOWER', success: true });
    
    // Stage 6: Emit WASM Binary
    currentStage = 'EMIT';
    const wasmResult = generateWasm(expanded, lowered, checkResult);
    stages.push({ name: 'EMIT', success: true });
    
    const wasmText = disassembleWasm(wasmResult);
    
    // Log compilation summary for debugging
    console.log(`[WATX] Compiled successfully: ${wasmResult.binary.length} bytes, ${wasmResult.importDecls.length} imports, ${wasmResult.funcDecls.length} user funcs`);
    console.log(`[WATX] Function index map: imports[0..${wasmResult.importDecls.length - 1}] builtins[${wasmResult.importDecls.length}..${wasmResult.importDecls.length + 2}] user[${wasmResult.importDecls.length + 3}..${wasmResult.importDecls.length + 3 + wasmResult.funcDecls.length - 1}]`);
    console.log(`[WATX] User functions:`, wasmResult.funcDecls.map((name, i) => `  [${wasmResult.importDecls.length + 3 + i}] ${name}`).join('\n'));
    
    return {
      success: true,
      wasmBinary: wasmResult.binary,
      wasmText,
      importMeta: wasmResult.importDecls,
      stages,
      expanded: formatSexpr(expanded),
      lowered: formatLowered(lowered),
      diagnostics: checkResult.warnings.map(w => ({ type: 'warning', ...w })),
    };
  } catch (e) {
    console.error(`[WATX] Compilation failed at stage ${currentStage}:`, e.message);
    stages.push({ name: currentStage, success: false, error: e.message });
    return {
      success: false,
      error: e.message,
      errorLine: e.line || 0,
      errorCol: e.col || 0,
      stages,
      diagnostics: [{ type: 'error', msg: e.message, line: e.line || 0, col: e.col || 0 }],
    };
  }
}

function formatSexpr(forms, indent = 0) {
  const pad = '  '.repeat(indent);
  let out = '';
  for (const form of forms) {
    if (Array.isArray(form)) {
      if (form.length <= 4 && !form.some(f => Array.isArray(f))) {
        out += pad + '(' + form.map(f => f?.value || String(f)).join(' ') + ')\n';
      } else {
        out += pad + '(' + (form[0]?.value || '') + '\n';
        for (let i = 1; i < form.length; i++) {
          if (Array.isArray(form[i])) {
            out += formatSexpr([form[i]], indent + 1);
          } else {
            out += '  '.repeat(indent + 1) + (form[i]?.value || String(form[i])) + '\n';
          }
        }
        out += pad + ')\n';
      }
    } else if (form?.type === 'layout-lowered') {
      out += pad + `; layout ${form.name} (${form.totalSize} bytes)\n`;
      for (const f of form.fields) {
        out += pad + `;   ${f.name}: ${f.type} @ offset ${f.offset}\n`;
      }
    } else {
      out += pad + (form?.value || String(form)) + '\n';
    }
  }
  return out;
}

function formatLowered(forms) {
  let out = ';; === Lowered IR ===\n\n';
  for (const form of forms) {
    if (form?.type === 'layout-lowered') {
      out += `;; Layout: ${form.name} (total: ${form.totalSize} bytes)\n`;
      for (const f of form.fields) {
        out += `;;   .${f.name} : ${f.type} @ offset ${f.offset} (${f.size} bytes)\n`;
      }
      out += '\n';
    }
  }
  out += formatSexpr(forms.filter(f => !f?.type?.startsWith('layout')));
  return out;
}