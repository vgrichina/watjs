// ═══════════════════════════════════════════════════════════════
// WATX COMPILER — Stages 5-6: Lowering & WASM Binary Code Gen
//
// ZERO IMPLICIT COERCION: This code generator never inserts
// type conversion instructions. All conversions must be explicit
// in the WATX source (i32.trunc_f32_s, f32.convert_i32_s, etc.)
// ═══════════════════════════════════════════════════════════════

// --- Stage 5: Lowering ---
function lowerIR(forms, checkResult) {
  const lowered = [];
  const { layouts } = checkResult;
  
  function sizeOfType(t) {
    if (t === 'i32' || t === 'f32') return 4;
    if (t === 'i64' || t === 'f64') return 8;
    if (t === 'u8') return 1;
    if (t?.startsWith && t.startsWith('ptr')) return 4;
    return 4;
  }
  
  function lowerForm(form) {
    if (!Array.isArray(form)) return form;
    const head = form[0]?.value;
    
    if (head === 'layout') {
      const name = form[1]?.value;
      let offset = 0;
      const fields = [];
      for (let i = 2; i < form.length; i++) {
        if (Array.isArray(form[i]) && form[i][0]?.value === 'field') {
          const fname = form[i][1]?.value;
          const ftype = form[i][2]?.value || 'i32';
          const size = sizeOfType(ftype);
          fields.push({ name: fname, type: ftype, offset, size });
          offset += size;
        }
      }
      return { type: 'layout-lowered', name, fields, totalSize: offset };
    }
    
    return form.map(f => lowerForm(f));
  }
  
  return forms.map(lowerForm);
}


// --- Wasm Binary Encoding Helpers ---

function encodeULEB128(value) {
  const bytes = [];
  value = value >>> 0;
  do {
    let byte = value & 0x7f;
    value >>>= 7;
    if (value !== 0) byte |= 0x80;
    bytes.push(byte);
  } while (value !== 0);
  return bytes;
}

function encodeSLEB128(value) {
  const bytes = [];
  let more = true;
  while (more) {
    let byte = value & 0x7f;
    value >>= 7;
    if ((value === 0 && (byte & 0x40) === 0) || (value === -1 && (byte & 0x40) !== 0)) {
      more = false;
    } else {
      byte |= 0x80;
    }
    bytes.push(byte);
  }
  return bytes;
}

// BigInt-based SLEB128 — required for i64 constants beyond 32 bits (e.g. NaN-box
// tag patterns like 0xFFF8000000000000). The 32-bit encoder above silently
// truncates those.
function encodeSLEB128Big(value) {
  value = BigInt(value);
  const bytes = [];
  let more = true;
  while (more) {
    let byte = Number(value & 0x7fn);
    value >>= 7n;
    if ((value === 0n && (byte & 0x40) === 0) || (value === -1n && (byte & 0x40) !== 0)) {
      more = false;
    } else {
      byte |= 0x80;
    }
    bytes.push(byte);
  }
  return bytes;
}
// Parse an integer literal (decimal or 0x hex, optional sign) as a BigInt,
// normalized to the signed two's-complement i64 value so SLEB128 stays <= 10
// bytes (e.g. 0xFFF8000000000000 -> -2251799813685248).
function parseI64Literal(s) {
  s = String(s).trim();
  let v;
  try { v = BigInt(s); } catch (_) { return 0n; }
  const MOD = 1n << 64n;
  v = ((v % MOD) + MOD) % MOD;        // wrap into [0, 2^64)
  if (v >= (1n << 63n)) v -= MOD;     // to signed
  return v;
}

function encodeF32(value) {
  const buf = new ArrayBuffer(4);
  new Float32Array(buf)[0] = value;
  return [...new Uint8Array(buf)];
}

function encodeString(str) {
  const encoded = new TextEncoder().encode(str);
  return [...encodeULEB128(encoded.length), ...encoded];
}

function encodeSection(id, content) {
  return [id, ...encodeULEB128(content.length), ...content];
}

function encodeVector(items) {
  return [...encodeULEB128(items.length), ...items.flat()];
}

// Wasm opcodes
const OP = {
  unreachable: 0x00, nop: 0x01, block: 0x02, loop: 0x03, if_: 0x04, else_: 0x05, end: 0x0b,
  br: 0x0c, br_if: 0x0d, return_: 0x0f, call: 0x10, drop: 0x1a, select: 0x1b,
  local_get: 0x20, local_set: 0x21, local_tee: 0x22,
  global_get: 0x23, global_set: 0x24,
  i32_load: 0x28, i64_load: 0x29, f32_load: 0x2a, f64_load: 0x2b,
  i32_load8_s: 0x2c, i32_load8_u: 0x2d, i32_load16_s: 0x2e, i32_load16_u: 0x2f,
  i32_store: 0x36, i64_store: 0x37, f32_store: 0x38, f64_store: 0x39,
  i32_store8: 0x3a, i32_store16: 0x3b,
  memory_size: 0x3f, memory_grow: 0x40,
  i32_const: 0x41, i64_const: 0x42, f32_const: 0x43, f64_const: 0x44,
  i32_eqz: 0x45, i32_eq: 0x46, i32_ne: 0x47, i32_lt_s: 0x48, i32_lt_u: 0x49,
  i32_gt_s: 0x4a, i32_gt_u: 0x4b, i32_le_s: 0x4c, i32_le_u: 0x4d, i32_ge_s: 0x4e, i32_ge_u: 0x4f,
  f32_eq: 0x5b, f32_ne: 0x5c, f32_lt: 0x5d, f32_gt: 0x5e, f32_le: 0x5f, f32_ge: 0x60,
  i32_add: 0x6a, i32_sub: 0x6b, i32_mul: 0x6c, i32_div_s: 0x6d, i32_div_u: 0x6e,
  i32_rem_s: 0x6f, i32_rem_u: 0x70,
  i32_and: 0x71, i32_or: 0x72, i32_xor: 0x73, i32_shl: 0x74, i32_shr_s: 0x75, i32_shr_u: 0x76,
  f32_add: 0x92, f32_sub: 0x93, f32_mul: 0x94, f32_div: 0x95,
  f32_abs: 0x8b, f32_neg: 0x8c, f32_ceil: 0x8d, f32_floor: 0x8e, f32_sqrt: 0x91,
  i32_trunc_f32_s: 0xa8, i32_trunc_f32_u: 0xa9,
  f32_convert_i32_s: 0xb2, f32_convert_i32_u: 0xb3,
  f64_promote_f32: 0xbb, f32_demote_f64: 0xb6,
  i32_wrap_i64: 0xa7, i64_extend_i32_s: 0xac,
  f64_add: 0xa0, f64_sub: 0xa1, f64_mul: 0xa2, f64_div: 0xa3,
  f64_convert_i32_s: 0xb7,
  i32_reinterpret_f32: 0xbc, f32_reinterpret_i32: 0xbe,
  // --- watjs extensions: full i64 + f64 op set (additive) ---
  i32_clz: 0x67, i32_ctz: 0x68, i32_popcnt: 0x69, i32_rotl: 0x77, i32_rotr: 0x78,
  i64_eqz: 0x50, i64_eq: 0x51, i64_ne: 0x52, i64_lt_s: 0x53, i64_lt_u: 0x54,
  i64_gt_s: 0x55, i64_gt_u: 0x56, i64_le_s: 0x57, i64_le_u: 0x58, i64_ge_s: 0x59, i64_ge_u: 0x5a,
  i64_add: 0x7c, i64_sub: 0x7d, i64_mul: 0x7e, i64_div_s: 0x7f, i64_div_u: 0x80,
  i64_rem_s: 0x81, i64_rem_u: 0x82, i64_and: 0x83, i64_or: 0x84, i64_xor: 0x85,
  i64_shl: 0x86, i64_shr_s: 0x87, i64_shr_u: 0x88, i64_rotl: 0x89, i64_rotr: 0x8a,
  f64_eq: 0x61, f64_ne: 0x62, f64_lt: 0x63, f64_gt: 0x64, f64_le: 0x65, f64_ge: 0x66,
  f64_abs: 0x99, f64_neg: 0x9a, f64_ceil: 0x9b, f64_floor: 0x9c, f64_trunc: 0x9d,
  f64_nearest: 0x9e, f64_sqrt: 0x9f, f64_min: 0x98, f64_max: 0x97, f64_copysign: 0xa6,
  i32_trunc_f64_s: 0xaa, i32_trunc_f64_u: 0xab,
  i64_extend_i32_u: 0xad, i64_trunc_f32_s: 0xae, i64_trunc_f32_u: 0xaf,
  i64_trunc_f64_s: 0xb0, i64_trunc_f64_u: 0xb1,
  f32_convert_i64_s: 0xb4, f32_convert_i64_u: 0xb5,
  f64_convert_i32_u: 0xb8, f64_convert_i64_s: 0xb9, f64_convert_i64_u: 0xba,
  i64_reinterpret_f64: 0xbd, f64_reinterpret_i64: 0xbf,
};

const VALTYPE = { i32: 0x7f, i64: 0x7e, f32: 0x7d, f64: 0x7c, void: 0x40 };

const BUILTIN_REGION_ENTER = '$__region_enter';
const BUILTIN_REGION_ALLOC = '$__region_alloc';
const BUILTIN_REGION_EXIT = '$__region_exit';


function generateWasm(forms, loweredForms, checkResult) {
  const layoutInfo = new Map();
  for (const f of loweredForms) {
    if (f?.type === 'layout-lowered') {
      layoutInfo.set(f.name, f);
    }
  }

  // --- watjs: cstring data pool ---
  // (cstring "txt") interns a [i32 len][utf8 bytes] blob in linear memory at a
  // compile-assigned offset (base DATA_BASE) and compiles to i32.const <ptr>.
  // The engine treats that pointer as a JS string heap object (Str layout).
  const DATA_BASE = 1024;
  const dataPool = { bytes: [], map: new Map() };
  function unescapeStr(raw) {
    // raw includes surrounding quotes; strip and process escapes
    let s = raw;
    if (s[0] === '"') s = s.slice(1, s[s.length - 1] === '"' ? -1 : s.length);
    let out = '';
    for (let i = 0; i < s.length; i++) {
      if (s[i] === '\\' && i + 1 < s.length) {
        const n = s[++i];
        out += n === 'n' ? '\n' : n === 't' ? '\t' : n === 'r' ? '\r'
             : n === '0' ? '\0' : n === '\\' ? '\\' : n === '"' ? '"' : n;
      } else out += s[i];
    }
    return out;
  }
  function internCString(raw) {
    const text = unescapeStr(raw);
    if (dataPool.map.has(text)) return dataPool.map.get(text);
    const utf8 = [...new TextEncoder().encode(text)];
    const offset = DATA_BASE + dataPool.bytes.length;
    // [i32 len LE][bytes]
    dataPool.bytes.push(utf8.length & 0xff, (utf8.length >> 8) & 0xff,
                        (utf8.length >> 16) & 0xff, (utf8.length >> 24) & 0xff);
    dataPool.bytes.push(...utf8);
    while (dataPool.bytes.length & 3) dataPool.bytes.push(0); // 4-byte align next
    dataPool.map.set(text, offset);
    return offset;
  }
  
  // Collect imports
  const importDecls = [];
  for (const form of forms) {
    if (Array.isArray(form) && form[0]?.value === 'wasm-import') {
      const mod = (form[1]?.value || '').replace(/"/g, '');
      const name = (form[2]?.value || '').replace(/"/g, '');
      const sig = form[3];
      if (Array.isArray(sig) && sig[0]?.value === 'func') {
        const funcName = sig[1]?.value || `$${name}`;
        const params = [];
        const results = [];
        for (let i = 2; i < sig.length; i++) {
          if (Array.isArray(sig[i])) {
            const kind = sig[i][0]?.value;
            if (kind === 'param') {
              for (let j = 1; j < sig[i].length; j++) {
                const t = sig[i][j]?.value;
                params.push(t === 'f32' ? VALTYPE.f32 : t === 'f64' ? VALTYPE.f64 : t === 'i64' ? VALTYPE.i64 : VALTYPE.i32);
              }
            } else if (kind === 'result') {
              for (let j = 1; j < sig[i].length; j++) {
                const t = sig[i][j]?.value;
                results.push(t === 'f32' ? VALTYPE.f32 : t === 'f64' ? VALTYPE.f64 : t === 'i64' ? VALTYPE.i64 : VALTYPE.i32);
              }
            }
          }
        }
        importDecls.push({ module: mod, name, funcName, params, results });
      }
    }
  }
  
  // Collect function declarations
  const funcDecls = [];
  for (const form of forms) {
    if (Array.isArray(form) && form[0]?.value === 'func') {
      const name = form[1]?.value;
      if (!name) continue;
      const params = [];
      const results = [];
      const locals = [];
      const body = [];
      let effectsClause = null;
      
      for (let i = 2; i < form.length; i++) {
        if (Array.isArray(form[i])) {
          const kind = form[i][0]?.value;
          if (kind === 'param') {
            const pname = form[i][1]?.value;
            const ptype = form[i][2]?.value || form[i][1]?.value;
            if (pname && pname.startsWith('$')) {
              params.push({ name: pname, type: ptype });
            } else {
              params.push({ name: null, type: pname });
            }
          } else if (kind === 'result') {
            for (let j = 1; j < form[i].length; j++) {
              results.push(form[i][j]?.value || 'i32');
            }
          } else if (kind === 'effects') {
            effectsClause = form[i];
          } else {
            body.push(form[i]);
          }
        } else {
          body.push(form[i]);
        }
      }
      
      funcDecls.push({ name, params, results, locals, body, effectsClause });
    }
  }
  
  // Collect exports
  const exportDecls = [];
  for (const form of forms) {
    if (Array.isArray(form) && form[0]?.value === 'wasm-export') {
      const exportName = (form[1]?.value || '').replace(/"/g, '');
      const funcRef = form[2]?.value || '';
      exportDecls.push({ exportName, funcRef });
    }
  }
  
  // Collect region declarations
  const regionDecls = [];
  for (const form of forms) {
    if (Array.isArray(form)) {
      const h = form[0]?.value;
      if (h === 'region.declare-static' || h === 'region.declare-bump' || h === 'region.declare-rc') {
        const rname = form[1]?.value;
        const sizeForm = form[2];
        let size = 4096;
        if (Array.isArray(sizeForm) && sizeForm[0]?.value === 'size') {
          size = parseInt(sizeForm[1]?.value) || 4096;
        } else if (sizeForm?.type === 'number') {
          size = parseInt(sizeForm.value) || 4096;
        }
        regionDecls.push({ name: rname, kind: h.split('-').pop(), size });
      }
    }
  }

  // Build function index map:
  // imports first, then 3 builtins (region_enter, region_alloc, region_exit), then user funcs
  const funcIndexMap = new Map();
  let idx = 0;
  for (const imp of importDecls) {
    funcIndexMap.set(imp.funcName, idx++);
  }
  const builtinStartIdx = idx;
  funcIndexMap.set(BUILTIN_REGION_ENTER, idx++);
  funcIndexMap.set(BUILTIN_REGION_ALLOC, idx++);
  funcIndexMap.set(BUILTIN_REGION_EXIT, idx++);
  const userFuncStartIdx = idx;
  const funcNames = [];
  for (const fd of funcDecls) {
    funcIndexMap.set(fd.name, idx++);
    funcNames.push(fd.name);
  }

  // ── Check if an expression produces a value on the Wasm stack ──
  // Returns false for void-returning calls, void if/block/loop, br, br_if, return, nop
  function exprProducesValue(expr, func) {
    if (!expr) return false;
    if (!Array.isArray(expr)) {
      // Literals and variable references always produce a value
      if (expr.type === 'number' || expr.type === 'string') return true;
      if (expr.type === 'symbol') return true; // local.get or literal
      return false;
    }
    const head = expr[0]?.value;
    if (!head) return false;
    
    // Constants always produce values
    if (head === 'i32.const' || head === 'f32.const' || head === 'i64.const' || head === 'f64.const') return true;
    
    // Arithmetic, comparison, unary, conversion ops produce values
    const valueOps = [
      'i32.add','i32.sub','i32.mul','i32.div_s','i32.div_u','i32.rem_s','i32.rem_u',
      'i32.and','i32.or','i32.xor','i32.shl','i32.shr_s','i32.shr_u',
      'i32.eq','i32.ne','i32.lt_s','i32.lt_u','i32.gt_s','i32.gt_u','i32.le_s','i32.le_u','i32.ge_s','i32.ge_u',
      'f32.add','f32.sub','f32.mul','f32.div','f32.eq','f32.ne','f32.lt','f32.gt','f32.le','f32.ge',
      'f64.add','f64.sub','f64.mul','f64.div',
      'i32.eqz','f32.neg','f32.abs','f32.ceil','f32.floor','f32.sqrt',
      'i32.trunc_f32_s','i32.trunc_f32_u','f32.convert_i32_s','f32.convert_i32_u',
      'f64.promote_f32','f32.demote_f64','i32.wrap_i64','i64.extend_i32_s',
      'f64.convert_i32_s','i32.reinterpret_f32','f32.reinterpret_i32',
      'local.get','local.tee','global.get',
      'let', 'set!', 'local.set', // these push i32.const 0 in our compiler
      'store.field','store.elem','i32.store','f32.store','i32.store8','global.set', // push i32.const 0
      'load.field','load.elem','i32.load','f32.load','i32.load8_u',
      'size-of','offset-of',
      'select','memory.size','memory.grow',
      'region.alloc',
      // watjs extensions
      'i32.rotl','i32.rotr','i32.clz','i32.ctz','i32.popcnt',
      'i64.add','i64.sub','i64.mul','i64.div_s','i64.div_u','i64.rem_s','i64.rem_u',
      'i64.and','i64.or','i64.xor','i64.shl','i64.shr_s','i64.shr_u','i64.rotl','i64.rotr',
      'i64.eqz','i64.eq','i64.ne','i64.lt_s','i64.lt_u','i64.gt_s','i64.gt_u',
      'i64.le_s','i64.le_u','i64.ge_s','i64.ge_u',
      'f64.eq','f64.ne','f64.lt','f64.gt','f64.le','f64.ge','f64.min','f64.max','f64.copysign',
      'f64.abs','f64.neg','f64.ceil','f64.floor','f64.trunc','f64.nearest','f64.sqrt',
      'i64.load','f64.load',
      'i32.trunc_f64_s','i32.trunc_f64_u','i64.extend_i32_u',
      'i64.trunc_f32_s','i64.trunc_f32_u','i64.trunc_f64_s','i64.trunc_f64_u',
      'f32.convert_i64_s','f32.convert_i64_u','f64.convert_i32_u',
      'f64.convert_i64_s','f64.convert_i64_u',
      'i64.reinterpret_f64','f64.reinterpret_i64',
      'i32.load16_u','i32.load16_s','i32.load8_s','cstring',
      'i64.store','f64.store','i32.store16',
    ];
    if (valueOps.includes(head)) return true;
    
    // call — depends on whether function has results
    if (head === 'call') {
      const funcName = expr[1]?.value;
      // Check imports
      for (const imp of importDecls) {
        if (imp.funcName === funcName) return imp.results.length > 0;
      }
      // Check builtins
      if (funcName === BUILTIN_REGION_ENTER || funcName === BUILTIN_REGION_ALLOC) return true;
      if (funcName === BUILTIN_REGION_EXIT) return false;
      // Check user functions
      for (const fd of funcDecls) {
        if (fd.name === funcName) return fd.results.length > 0;
      }
      return false; // unknown
    }
    
    // if — produces value only if it has a non-void block type AND branches produce values
    if (head === 'if') {
      // Has explicit type annotation?
      if (expr[1]?.type === 'symbol' && ['i32','i64','f32','f64'].includes(expr[1].value)) return true;
      // Has both then and else branches?
      let condIdx = 1;
      let thenE = null, elseE = null;
      let restIdx = condIdx + 1;
      
      if (restIdx < expr.length) {
        if (Array.isArray(expr[restIdx]) && expr[restIdx][0]?.value === 'then') {
          thenE = expr[restIdx].length === 2 ? expr[restIdx][1] : expr[restIdx][expr[restIdx].length - 1];
        } else {
          thenE = expr[restIdx];
        }
        restIdx++;
      }
      if (restIdx < expr.length) {
        if (expr[restIdx]?.value === 'else') {
          restIdx++;
          if (restIdx < expr.length) { elseE = expr[restIdx]; }
        } else if (Array.isArray(expr[restIdx]) && expr[restIdx][0]?.value === 'else') {
          elseE = expr[restIdx].length === 2 ? expr[restIdx][1] : expr[restIdx][expr[restIdx].length - 1];
        } else {
          elseE = expr[restIdx];
        }
      }
      // Only produces a value if BOTH branches exist AND both produce values
      if (!thenE || !elseE) return false;
      return exprProducesValue(thenE, func) && exprProducesValue(elseE, func);
    }
    
    // block / loop — void in our compiler
    if (head === 'block' || head === 'loop') return false;
    
    // br / br_if / return / nop — no value
    if (head === 'br' || head === 'br_if' || head === 'return' || head === 'nop') return false;
    
    // drop — void
    if (head === 'drop') return false;
    
    // begin — produces value of last expression
    if (head === 'begin') {
      if (expr.length < 2) return false;
      return exprProducesValue(expr[expr.length - 1], func);
    }
    
    // with-region — produces value of last body expression
    if (head === 'with-region') {
      if (expr.length < 4) return false;
      return exprProducesValue(expr[expr.length - 1], func);
    }
    
    // Fallback: assume it produces a value (to be safe about dropping)
    return true;
  }

  // ── Compile function body to Wasm bytecode ──
  function compileExpr(expr, func, depth) {
    if (!expr) return [];
    const bytes = [];
    
    if (!Array.isArray(expr)) {
      if (expr.type === 'number') {
        const val = expr.value;
        if (val.includes('.') || val.includes('e') || val.includes('E')) {
          bytes.push(OP.f32_const, ...encodeF32(parseFloat(val)));
        } else {
          const n = parseInt(val);
          bytes.push(OP.i32_const, ...encodeSLEB128(n));
        }
        return bytes;
      }
      if (expr.type === 'symbol') {
        // Variable reference — look up local index
        const localIdx = func.localMap.get(expr.value);
        if (localIdx !== undefined) {
          bytes.push(OP.local_get, ...encodeULEB128(localIdx));
          return bytes;
        }
        // Could be a numeric literal that tokenized as symbol
        if (/^-?[0-9]/.test(expr.value)) {
          const n = parseInt(expr.value);
          bytes.push(OP.i32_const, ...encodeSLEB128(n));
          return bytes;
        }
        // Unknown symbol — push 0 as fallback
        bytes.push(OP.i32_const, ...encodeSLEB128(0));
        return bytes;
      }
      if (expr.type === 'string') {
        // String literal — store in data segment, push pointer
        bytes.push(OP.i32_const, ...encodeSLEB128(0));
        return bytes;
      }
      return bytes;
    }

    const head = expr[0]?.value;
    if (!head) return bytes;

    // ── (cstring "text") → pointer to interned [len][bytes] blob ──
    if (head === 'cstring') {
      const raw = expr[1]?.value || '""';
      const ptr = internCString(raw);
      bytes.push(OP.i32_const, ...encodeSLEB128(ptr));
      return bytes;
    }

    // ── i32 const ──
    if (head === 'i32.const') {
      const val = parseInt(expr[1]?.value || '0');
      bytes.push(OP.i32_const, ...encodeSLEB128(val));
      return bytes;
    }
    
    // ── f32 const ──
    if (head === 'f32.const') {
      const val = parseFloat(expr[1]?.value || '0');
      bytes.push(OP.f32_const, ...encodeF32(val));
      return bytes;
    }
    
    // ── i64.const ── (BigInt-encoded: full 64-bit range)
    if (head === 'i64.const') {
      const val = parseI64Literal(expr[1]?.value || '0');
      bytes.push(OP.i64_const, ...encodeSLEB128Big(val));
      return bytes;
    }
    
    // ── f64.const ──
    if (head === 'f64.const') {
      const val = parseFloat(expr[1]?.value || '0');
      // f64 encoding
      const buf = new ArrayBuffer(8);
      new Float64Array(buf)[0] = val;
      bytes.push(OP.f64_const, ...new Uint8Array(buf));
      return bytes;
    }

    // ── Arithmetic / comparison ops ──
    const binaryOps = {
      'i32.add': OP.i32_add, 'i32.sub': OP.i32_sub, 'i32.mul': OP.i32_mul,
      'i32.div_s': OP.i32_div_s, 'i32.div_u': OP.i32_div_u,
      'i32.rem_s': OP.i32_rem_s, 'i32.rem_u': OP.i32_rem_u,
      'i32.and': OP.i32_and, 'i32.or': OP.i32_or, 'i32.xor': OP.i32_xor,
      'i32.shl': OP.i32_shl, 'i32.shr_s': OP.i32_shr_s, 'i32.shr_u': OP.i32_shr_u,
      'i32.eq': OP.i32_eq, 'i32.ne': OP.i32_ne,
      'i32.lt_s': OP.i32_lt_s, 'i32.lt_u': OP.i32_lt_u,
      'i32.gt_s': OP.i32_gt_s, 'i32.gt_u': OP.i32_gt_u,
      'i32.le_s': OP.i32_le_s, 'i32.le_u': OP.i32_le_u,
      'i32.ge_s': OP.i32_ge_s, 'i32.ge_u': OP.i32_ge_u,
      'f32.add': OP.f32_add, 'f32.sub': OP.f32_sub,
      'f32.mul': OP.f32_mul, 'f32.div': OP.f32_div,
      'f32.eq': OP.f32_eq, 'f32.ne': OP.f32_ne,
      'f32.lt': OP.f32_lt, 'f32.gt': OP.f32_gt,
      'f32.le': OP.f32_le, 'f32.ge': OP.f32_ge,
      'f64.add': OP.f64_add, 'f64.sub': OP.f64_sub,
      'f64.mul': OP.f64_mul, 'f64.div': OP.f64_div,
      'f64.eq': OP.f64_eq, 'f64.ne': OP.f64_ne, 'f64.lt': OP.f64_lt,
      'f64.gt': OP.f64_gt, 'f64.le': OP.f64_le, 'f64.ge': OP.f64_ge,
      'f64.min': OP.f64_min, 'f64.max': OP.f64_max, 'f64.copysign': OP.f64_copysign,
      'i32.rotl': OP.i32_rotl, 'i32.rotr': OP.i32_rotr,
      'i64.add': OP.i64_add, 'i64.sub': OP.i64_sub, 'i64.mul': OP.i64_mul,
      'i64.div_s': OP.i64_div_s, 'i64.div_u': OP.i64_div_u,
      'i64.rem_s': OP.i64_rem_s, 'i64.rem_u': OP.i64_rem_u,
      'i64.and': OP.i64_and, 'i64.or': OP.i64_or, 'i64.xor': OP.i64_xor,
      'i64.shl': OP.i64_shl, 'i64.shr_s': OP.i64_shr_s, 'i64.shr_u': OP.i64_shr_u,
      'i64.rotl': OP.i64_rotl, 'i64.rotr': OP.i64_rotr,
      'i64.eq': OP.i64_eq, 'i64.ne': OP.i64_ne,
      'i64.lt_s': OP.i64_lt_s, 'i64.lt_u': OP.i64_lt_u,
      'i64.gt_s': OP.i64_gt_s, 'i64.gt_u': OP.i64_gt_u,
      'i64.le_s': OP.i64_le_s, 'i64.le_u': OP.i64_le_u,
      'i64.ge_s': OP.i64_ge_s, 'i64.ge_u': OP.i64_ge_u,
    };

    if (binaryOps[head]) {
      bytes.push(...compileExpr(expr[1], func, depth));
      bytes.push(...compileExpr(expr[2], func, depth));
      bytes.push(binaryOps[head]);
      return bytes;
    }
    
    // ── Unary ops ──
    const unaryOps = {
      'i32.eqz': OP.i32_eqz, 'i64.eqz': OP.i64_eqz,
      'i32.clz': OP.i32_clz, 'i32.ctz': OP.i32_ctz, 'i32.popcnt': OP.i32_popcnt,
      'f32.neg': OP.f32_neg, 'f32.abs': OP.f32_abs,
      'f32.ceil': OP.f32_ceil, 'f32.floor': OP.f32_floor, 'f32.sqrt': OP.f32_sqrt,
      'f64.abs': OP.f64_abs, 'f64.neg': OP.f64_neg, 'f64.ceil': OP.f64_ceil,
      'f64.floor': OP.f64_floor, 'f64.trunc': OP.f64_trunc, 'f64.nearest': OP.f64_nearest,
      'f64.sqrt': OP.f64_sqrt,
    };
    
    if (unaryOps[head]) {
      bytes.push(...compileExpr(expr[1], func, depth));
      bytes.push(unaryOps[head]);
      return bytes;
    }
    
    // ── Type conversions ──
    const convOps = {
      'i32.trunc_f32_s': OP.i32_trunc_f32_s, 'i32.trunc_f32_u': OP.i32_trunc_f32_u,
      'f32.convert_i32_s': OP.f32_convert_i32_s, 'f32.convert_i32_u': OP.f32_convert_i32_u,
      'f64.promote_f32': OP.f64_promote_f32, 'f32.demote_f64': OP.f32_demote_f64,
      'i32.wrap_i64': OP.i32_wrap_i64, 'i64.extend_i32_s': OP.i64_extend_i32_s,
      'f64.convert_i32_s': OP.f64_convert_i32_s,
      'i32.reinterpret_f32': OP.i32_reinterpret_f32, 'f32.reinterpret_i32': OP.f32_reinterpret_i32,
      'i32.trunc_f64_s': OP.i32_trunc_f64_s, 'i32.trunc_f64_u': OP.i32_trunc_f64_u,
      'i64.extend_i32_u': OP.i64_extend_i32_u,
      'i64.trunc_f32_s': OP.i64_trunc_f32_s, 'i64.trunc_f32_u': OP.i64_trunc_f32_u,
      'i64.trunc_f64_s': OP.i64_trunc_f64_s, 'i64.trunc_f64_u': OP.i64_trunc_f64_u,
      'f32.convert_i64_s': OP.f32_convert_i64_s, 'f32.convert_i64_u': OP.f32_convert_i64_u,
      'f64.convert_i32_u': OP.f64_convert_i32_u,
      'f64.convert_i64_s': OP.f64_convert_i64_s, 'f64.convert_i64_u': OP.f64_convert_i64_u,
      'i64.reinterpret_f64': OP.i64_reinterpret_f64, 'f64.reinterpret_i64': OP.f64_reinterpret_i64,
    };
    
    if (convOps[head]) {
      bytes.push(...compileExpr(expr[1], func, depth));
      bytes.push(convOps[head]);
      return bytes;
    }

    // ── local.get / local.set / local.tee ──
    if (head === 'local.get') {
      const name = expr[1]?.value;
      const localIdx = func.localMap.get(name);
      if (localIdx !== undefined) {
        bytes.push(OP.local_get, ...encodeULEB128(localIdx));
      } else {
        bytes.push(OP.i32_const, ...encodeSLEB128(0));
      }
      return bytes;
    }
    
    if (head === 'local.set' || head === 'set!') {
      const name = expr[1]?.value;
      const localIdx = func.localMap.get(name);
      if (localIdx !== undefined && expr[2]) {
        bytes.push(...compileExpr(expr[2], func, depth));
        bytes.push(OP.local_set, ...encodeULEB128(localIdx));
        // set!/local.set evaluates to 0 for expression contexts
        bytes.push(OP.i32_const, ...encodeSLEB128(0));
      } else {
        bytes.push(OP.i32_const, ...encodeSLEB128(0));
      }
      return bytes;
    }
    
    // ── let — local variable binding ──
    if (head === 'let') {
      const name = expr[1]?.value;
      let initExpr, declaredType;
      
      // (let $name type init) or (let $name init)
      if (expr.length >= 4 && expr[2]?.type === 'symbol' && 
          ['i32','i64','f32','f64','u8','ptr','weak'].includes(expr[2].value)) {
        declaredType = expr[2].value;
        initExpr = expr[3];
      } else {
        initExpr = expr[2];
      }
      
      if (name && func.localMap.has(name) && initExpr) {
        const localIdx = func.localMap.get(name);
        bytes.push(...compileExpr(initExpr, func, depth));
        bytes.push(OP.local_tee, ...encodeULEB128(localIdx));
      } else {
        bytes.push(OP.i32_const, ...encodeSLEB128(0));
      }
      return bytes;
    }

    // ── call ──
    if (head === 'call') {
      const funcName = expr[1]?.value;
      const callIdx = funcIndexMap.get(funcName);
      if (callIdx !== undefined) {
        for (let i = 2; i < expr.length; i++) {
          bytes.push(...compileExpr(expr[i], func, depth));
        }
        bytes.push(OP.call, ...encodeULEB128(callIdx));
      } else {
        // Unknown function — emit unreachable
        console.warn(`[WATX codegen] Unknown function: ${funcName}`);
        bytes.push(OP.unreachable);
      }
      return bytes;
    }

    // ── if ──
    if (head === 'if') {
      // (if cond then) or (if cond then else alt) or (if type cond then else alt)
      let explicitResultType = null;
      let condIdx = 1;
      
      // Check for explicit type annotation: (if f32 cond then else alt)
      if (expr[1]?.type === 'symbol' && ['i32','i64','f32','f64'].includes(expr[1].value)) {
        explicitResultType = expr[1].value;
        condIdx = 2;
      }
      
      const condExpr = expr[condIdx];
      
      // Find then/else branches
      let thenExpr = null, elseExpr = null;
      let restIdx = condIdx + 1;
      
      // Look for then branch
      if (restIdx < expr.length) {
        if (Array.isArray(expr[restIdx]) && expr[restIdx][0]?.value === 'then') {
          thenExpr = expr[restIdx].length === 2 ? expr[restIdx][1] : { _multi: expr[restIdx].slice(1) };
        } else {
          thenExpr = expr[restIdx];
        }
        restIdx++;
      }
      
      // Look for else branch
      if (restIdx < expr.length) {
        if (expr[restIdx]?.value === 'else' || expr[restIdx]?.type === 'symbol' && expr[restIdx]?.value === 'else') {
          // bare 'else' keyword — next expr is the else body
          restIdx++;
          if (restIdx < expr.length) {
            elseExpr = expr[restIdx];
            restIdx++;
          }
        } else if (Array.isArray(expr[restIdx]) && expr[restIdx][0]?.value === 'else') {
          elseExpr = expr[restIdx].length === 2 ? expr[restIdx][1] : { _multi: expr[restIdx].slice(1) };
          restIdx++;
        } else {
          // Positional: 4th element (after cond, then) is the else
          elseExpr = expr[restIdx];
          restIdx++;
        }
      }
      
      // Determine block type by checking if branches actually produce values
      let blockType = VALTYPE.void;
      if (explicitResultType) {
        blockType = VALTYPE[explicitResultType] || VALTYPE.i32;
      } else if (thenExpr && elseExpr) {
        // Check if branches produce values — only then use i32 block type
        const thenLastExpr = thenExpr._multi ? thenExpr._multi[thenExpr._multi.length - 1] : thenExpr;
        const elseLastExpr = elseExpr._multi ? elseExpr._multi[elseExpr._multi.length - 1] : elseExpr;
        const thenProduces = exprProducesValue(thenLastExpr, func);
        const elseProduces = exprProducesValue(elseLastExpr, func);
        if (thenProduces && elseProduces) {
          blockType = VALTYPE.i32; // both branches produce values — treat as i32 expression
        }
        // else: one or both branches are void — keep blockType as void
      }
      
      const isVoidIf = (blockType === VALTYPE.void);
      
      // Emit: condition, if, then-body, [else, else-body], end
      bytes.push(...compileExpr(condExpr, func, depth));
      bytes.push(OP.if_, blockType);
      
      // Push a sentinel label for the if-block scope so that br/br_if
      // depth calculations correctly count through intervening if blocks
      func.blockLabels.push('__if__');
      
      if (thenExpr) {
        if (thenExpr._multi) {
          const multi = thenExpr._multi;
          for (let mi = 0; mi < multi.length; mi++) {
            bytes.push(...compileExpr(multi[mi], func, depth + 1));
            // Drop intermediate values (only keep last if non-void block)
            if (mi < multi.length - 1 && exprProducesValue(multi[mi], func)) {
              bytes.push(OP.drop);
            } else if (mi === multi.length - 1 && isVoidIf && exprProducesValue(multi[mi], func)) {
              bytes.push(OP.drop);
            }
          }
        } else {
          bytes.push(...compileExpr(thenExpr, func, depth + 1));
          if (isVoidIf && exprProducesValue(thenExpr, func)) {
            bytes.push(OP.drop);
          }
        }
      }
      
      if (elseExpr) {
        bytes.push(OP.else_);
        if (elseExpr._multi) {
          const multi = elseExpr._multi;
          for (let mi = 0; mi < multi.length; mi++) {
            bytes.push(...compileExpr(multi[mi], func, depth + 1));
            // Drop intermediate values (only keep last if non-void block)
            if (mi < multi.length - 1 && exprProducesValue(multi[mi], func)) {
              bytes.push(OP.drop);
            } else if (mi === multi.length - 1 && isVoidIf && exprProducesValue(multi[mi], func)) {
              bytes.push(OP.drop);
            }
          }
        } else {
          bytes.push(...compileExpr(elseExpr, func, depth + 1));
          if (isVoidIf && exprProducesValue(elseExpr, func)) {
            bytes.push(OP.drop);
          }
        }
      }
      
      func.blockLabels.pop();
      bytes.push(OP.end);
      return bytes;
    }

    // ── block ──
    if (head === 'block') {
      const label = expr[1]?.value?.startsWith('$') ? expr[1].value : null;
      const bodyStart = label ? 2 : 1;
      
      if (label) func.blockLabels.push(label);
      
      bytes.push(OP.block, VALTYPE.void);
      for (let i = bodyStart; i < expr.length; i++) {
        bytes.push(...compileExpr(expr[i], func, depth + 1));
        // Blocks are always void — drop any value left on stack
        if (exprProducesValue(expr[i], func)) {
          bytes.push(OP.drop);
        }
      }
      bytes.push(OP.end);
      
      if (label) func.blockLabels.pop();
      return bytes;
    }

    // ── loop ──
    if (head === 'loop') {
      const label = expr[1]?.value?.startsWith('$') ? expr[1].value : null;
      const bodyStart = label ? 2 : 1;
      
      if (label) func.blockLabels.push(label);
      
      bytes.push(OP.loop, VALTYPE.void);
      for (let i = bodyStart; i < expr.length; i++) {
        bytes.push(...compileExpr(expr[i], func, depth + 1));
        // Loops are always void — drop any value left on stack
        if (exprProducesValue(expr[i], func)) {
          bytes.push(OP.drop);
        }
      }
      bytes.push(OP.end);
      
      if (label) func.blockLabels.pop();
      return bytes;
    }

    // ── br / br_if ──
    if (head === 'br') {
      const label = expr[1]?.value;
      let labelDepth = 0;
      if (label?.startsWith('$')) {
        const idx = func.blockLabels.lastIndexOf(label);
        if (idx >= 0) labelDepth = func.blockLabels.length - 1 - idx;
      } else {
        labelDepth = parseInt(label) || 0;
      }
      bytes.push(OP.br, ...encodeULEB128(labelDepth));
      return bytes;
    }
    
    if (head === 'br_if') {
      let label, condExpr;
      if (expr[1]?.type === 'symbol' && expr[1]?.value?.startsWith('$') && expr.length > 2) {
        label = expr[1].value;
        condExpr = expr[2];
      } else {
        label = '0';
        condExpr = expr[1];
      }
      
      let labelDepth = 0;
      if (label?.startsWith('$')) {
        const idx = func.blockLabels.lastIndexOf(label);
        if (idx >= 0) labelDepth = func.blockLabels.length - 1 - idx;
      } else {
        labelDepth = parseInt(label) || 0;
      }
      
      bytes.push(...compileExpr(condExpr, func, depth));
      bytes.push(OP.br_if, ...encodeULEB128(labelDepth));
      return bytes;
    }

    // ── return ──
    if (head === 'return') {
      if (expr[1]) {
        bytes.push(...compileExpr(expr[1], func, depth));
      }
      bytes.push(OP.return_);
      return bytes;
    }

    // ── drop ──
    if (head === 'drop') {
      if (expr[1]) bytes.push(...compileExpr(expr[1], func, depth));
      bytes.push(OP.drop);
      return bytes;
    }
    
    // ── nop ──
    if (head === 'nop') {
      bytes.push(OP.nop);
      return bytes;
    }

    // ── select ──
    if (head === 'select') {
      bytes.push(...compileExpr(expr[1], func, depth));
      bytes.push(...compileExpr(expr[2], func, depth));
      bytes.push(...compileExpr(expr[3], func, depth));
      bytes.push(OP.select);
      return bytes;
    }
    
    // ── memory.size / memory.grow ──
    if (head === 'memory.size') {
      bytes.push(OP.memory_size, 0x00);
      return bytes;
    }
    if (head === 'memory.grow') {
      bytes.push(...compileExpr(expr[1], func, depth));
      bytes.push(OP.memory_grow, 0x00);
      return bytes;
    }

    // ── begin — sequence of expressions ──
    if (head === 'begin') {
      for (let i = 1; i < expr.length; i++) {
        bytes.push(...compileExpr(expr[i], func, depth));
        // Drop intermediate values (only keep last)
        if (i < expr.length - 1 && exprProducesValue(expr[i], func)) {
          bytes.push(OP.drop);
        }
      }
      return bytes;
    }

    // ── with-region ──
    if (head === 'with-region') {
      const regionName = expr[1]?.value;
      const regionSpec = expr[2];
      let regionSize = 4096;
      
      if (Array.isArray(regionSpec)) {
        const kind = regionSpec[0]?.value;
        if (regionSpec[1]) {
          regionSize = parseInt(regionSpec[1]?.value) || 4096;
        }
      } else if (regionSpec?.type === 'number') {
        regionSize = parseInt(regionSpec.value) || 4096;
      }
      
      // Call region_enter(size) → handle
      bytes.push(OP.i32_const, ...encodeSLEB128(regionSize));
      bytes.push(OP.call, ...encodeULEB128(funcIndexMap.get(BUILTIN_REGION_ENTER)));
      bytes.push(OP.drop); // drop the handle for now
      
      // Compile body
      for (let i = 3; i < expr.length; i++) {
        bytes.push(...compileExpr(expr[i], func, depth));
        if (i < expr.length - 1 && exprProducesValue(expr[i], func)) bytes.push(OP.drop);
      }
      
      // Call region_exit()
      bytes.push(OP.call, ...encodeULEB128(funcIndexMap.get(BUILTIN_REGION_EXIT)));
      
      return bytes;
    }

    // ── region.alloc ──
    if (head === 'region.alloc') {
      const layoutName = expr[2]?.value;
      const info = layoutInfo.get(layoutName);
      const size = info ? info.totalSize : 16;
      
      bytes.push(OP.i32_const, ...encodeSLEB128(size));
      bytes.push(OP.call, ...encodeULEB128(funcIndexMap.get(BUILTIN_REGION_ALLOC)));
      return bytes;
    }

    // ── store.field ──
    if (head === 'store.field') {
      const layoutName = expr[1]?.value;
      const fieldName = expr[2]?.value;
      const ptrExpr = expr[3];
      const valExpr = expr[4];
      
      const info = layoutInfo.get(layoutName);
      let offset = 0;
      let fieldType = 'i32';
      if (info) {
        const field = info.fields.find(f => f.name === fieldName);
        if (field) { offset = field.offset; fieldType = field.type; }
      }
      
      // ptr + offset
      bytes.push(...compileExpr(ptrExpr, func, depth));
      if (offset > 0) {
        bytes.push(OP.i32_const, ...encodeSLEB128(offset));
        bytes.push(OP.i32_add);
      }
      
      // value
      bytes.push(...compileExpr(valExpr, func, depth));
      
      // store based on type
      if (fieldType === 'f32') {
        bytes.push(OP.f32_store, 0x02, 0x00);
      } else if (fieldType === 'f64') {
        bytes.push(OP.f64_store, 0x03, 0x00);
      } else if (fieldType === 'u8') {
        bytes.push(OP.i32_store8, 0x00, 0x00);
      } else if (fieldType === 'i64') {
        bytes.push(OP.i64_store, 0x03, 0x00);
      } else {
        bytes.push(OP.i32_store, 0x02, 0x00);
      }
      
      // store.field evaluates to 0
      bytes.push(OP.i32_const, ...encodeSLEB128(0));
      return bytes;
    }

    // ── load.field ──
    if (head === 'load.field') {
      const layoutName = expr[1]?.value;
      const fieldName = expr[2]?.value;
      const ptrExpr = expr[3];
      
      const info = layoutInfo.get(layoutName);
      let offset = 0;
      let fieldType = 'i32';
      if (info) {
        const field = info.fields.find(f => f.name === fieldName);
        if (field) { offset = field.offset; fieldType = field.type; }
      }
      
      bytes.push(...compileExpr(ptrExpr, func, depth));
      if (offset > 0) {
        bytes.push(OP.i32_const, ...encodeSLEB128(offset));
        bytes.push(OP.i32_add);
      }
      
      if (fieldType === 'f32') {
        bytes.push(OP.f32_load, 0x02, 0x00);
      } else if (fieldType === 'f64') {
        bytes.push(OP.f64_load, 0x03, 0x00);
      } else if (fieldType === 'u8') {
        bytes.push(OP.i32_load8_u, 0x00, 0x00);
      } else if (fieldType === 'i64') {
        bytes.push(OP.i64_load, 0x03, 0x00);
      } else {
        bytes.push(OP.i32_load, 0x02, 0x00);
      }
      return bytes;
    }

    // ── store.elem — array element store ──
    if (head === 'store.elem') {
      const layoutName = expr[1]?.value;
      const fieldName = expr[2]?.value;
      const baseExpr = expr[3];
      const indexExpr = expr[4];
      const valExpr = expr[5];
      
      const info = layoutInfo.get(layoutName);
      let fieldOffset = 0;
      let fieldType = 'i32';
      let structSize = 16;
      if (info) {
        structSize = info.totalSize;
        const field = info.fields.find(f => f.name === fieldName);
        if (field) { fieldOffset = field.offset; fieldType = field.type; }
      }
      
      // base + index * structSize + fieldOffset
      bytes.push(...compileExpr(baseExpr, func, depth));
      bytes.push(...compileExpr(indexExpr, func, depth));
      bytes.push(OP.i32_const, ...encodeSLEB128(structSize));
      bytes.push(OP.i32_mul);
      bytes.push(OP.i32_add);
      if (fieldOffset > 0) {
        bytes.push(OP.i32_const, ...encodeSLEB128(fieldOffset));
        bytes.push(OP.i32_add);
      }
      
      bytes.push(...compileExpr(valExpr, func, depth));
      
      if (fieldType === 'f32') {
        bytes.push(OP.f32_store, 0x02, 0x00);
      } else if (fieldType === 'f64') {
        bytes.push(OP.f64_store, 0x03, 0x00);
      } else if (fieldType === 'u8') {
        bytes.push(OP.i32_store8, 0x00, 0x00);
      } else {
        bytes.push(OP.i32_store, 0x02, 0x00);
      }
      
      bytes.push(OP.i32_const, ...encodeSLEB128(0));
      return bytes;
    }

    // ── load.elem — array element load ──
    if (head === 'load.elem') {
      const layoutName = expr[1]?.value;
      const fieldName = expr[2]?.value;
      const baseExpr = expr[3];
      const indexExpr = expr[4];
      
      const info = layoutInfo.get(layoutName);
      let fieldOffset = 0;
      let fieldType = 'i32';
      let structSize = 16;
      if (info) {
        structSize = info.totalSize;
        const field = info.fields.find(f => f.name === fieldName);
        if (field) { fieldOffset = field.offset; fieldType = field.type; }
      }
      
      bytes.push(...compileExpr(baseExpr, func, depth));
      bytes.push(...compileExpr(indexExpr, func, depth));
      bytes.push(OP.i32_const, ...encodeSLEB128(structSize));
      bytes.push(OP.i32_mul);
      bytes.push(OP.i32_add);
      if (fieldOffset > 0) {
        bytes.push(OP.i32_const, ...encodeSLEB128(fieldOffset));
        bytes.push(OP.i32_add);
      }
      
      if (fieldType === 'f32') {
        bytes.push(OP.f32_load, 0x02, 0x00);
      } else if (fieldType === 'f64') {
        bytes.push(OP.f64_load, 0x03, 0x00);
      } else if (fieldType === 'u8') {
        bytes.push(OP.i32_load8_u, 0x00, 0x00);
      } else {
        bytes.push(OP.i32_load, 0x02, 0x00);
      }
      return bytes;
    }

    // ── size-of ──
    if (head === 'size-of') {
      const layoutName = expr[1]?.value;
      const info = layoutInfo.get(layoutName);
      const size = info ? info.totalSize : 4;
      bytes.push(OP.i32_const, ...encodeSLEB128(size));
      return bytes;
    }

    // ── offset-of ──
    if (head === 'offset-of') {
      const layoutName = expr[1]?.value;
      const fieldName = expr[2]?.value;
      const info = layoutInfo.get(layoutName);
      let offset = 0;
      if (info) {
        const field = info.fields.find(f => f.name === fieldName);
        if (field) offset = field.offset;
      }
      bytes.push(OP.i32_const, ...encodeSLEB128(offset));
      return bytes;
    }

    // ── i32.load / i32.store / f32.load / f32.store / i32.load8_u / i32.store8 ──
    if (head === 'i32.load') {
      bytes.push(...compileExpr(expr[1], func, depth));
      bytes.push(OP.i32_load, 0x02, 0x00);
      return bytes;
    }
    if (head === 'i32.store') {
      bytes.push(...compileExpr(expr[1], func, depth));
      bytes.push(...compileExpr(expr[2], func, depth));
      bytes.push(OP.i32_store, 0x02, 0x00);
      bytes.push(OP.i32_const, ...encodeSLEB128(0));
      return bytes;
    }
    if (head === 'f32.load') {
      bytes.push(...compileExpr(expr[1], func, depth));
      bytes.push(OP.f32_load, 0x02, 0x00);
      return bytes;
    }
    if (head === 'f32.store') {
      bytes.push(...compileExpr(expr[1], func, depth));
      bytes.push(...compileExpr(expr[2], func, depth));
      bytes.push(OP.f32_store, 0x02, 0x00);
      bytes.push(OP.i32_const, ...encodeSLEB128(0));
      return bytes;
    }
    if (head === 'i32.load8_u') {
      bytes.push(...compileExpr(expr[1], func, depth));
      bytes.push(OP.i32_load8_u, 0x00, 0x00);
      return bytes;
    }
    if (head === 'i32.store8') {
      bytes.push(...compileExpr(expr[1], func, depth));
      bytes.push(...compileExpr(expr[2], func, depth));
      bytes.push(OP.i32_store8, 0x00, 0x00);
      bytes.push(OP.i32_const, ...encodeSLEB128(0));
      return bytes;
    }
    // ── watjs: i64 / f64 / 16-bit loads & stores ──
    {
      const loads = {
        'i64.load':     [OP.i64_load, 0x03],
        'f64.load':     [OP.f64_load, 0x03],
        'i32.load16_u': [OP.i32_load16_u, 0x01],
        'i32.load16_s': [OP.i32_load16_s, 0x01],
        'i32.load8_s':  [OP.i32_load8_s, 0x00],
      };
      if (loads[head]) {
        bytes.push(...compileExpr(expr[1], func, depth));
        bytes.push(loads[head][0], loads[head][1], 0x00);
        return bytes;
      }
      const stores = {
        'i64.store':   [OP.i64_store, 0x03],
        'f64.store':   [OP.f64_store, 0x03],
        'i32.store16': [OP.i32_store16, 0x01],
      };
      if (stores[head]) {
        bytes.push(...compileExpr(expr[1], func, depth));
        bytes.push(...compileExpr(expr[2], func, depth));
        bytes.push(stores[head][0], stores[head][1], 0x00);
        bytes.push(OP.i32_const, ...encodeSLEB128(0)); // stores yield i32 0
        return bytes;
      }
    }

    // ── global.get / global.set ──
    if (head === 'global.get') {
      const name = expr[1]?.value;
      const globalIdx = name === '$bump_ptr' ? 0 : name === '$region_save' ? 1 : 0;
      bytes.push(OP.global_get, ...encodeULEB128(globalIdx));
      return bytes;
    }
    if (head === 'global.set') {
      const name = expr[1]?.value;
      const globalIdx = name === '$bump_ptr' ? 0 : name === '$region_save' ? 1 : 0;
      bytes.push(...compileExpr(expr[2], func, depth));
      bytes.push(OP.global_set, ...encodeULEB128(globalIdx));
      bytes.push(OP.i32_const, ...encodeSLEB128(0));
      return bytes;
    }

    // ── Fallback: try to compile all sub-expressions ──
    for (let i = 1; i < expr.length; i++) {
      bytes.push(...compileExpr(expr[i], func, depth));
      if (i < expr.length - 1 && exprProducesValue(expr[i], func)) bytes.push(OP.drop);
    }
    return bytes;
  }

  // ── Infer the Wasm type produced by an expression ──
  function inferExprType(expr) {
    if (!expr) return 'i32';
    if (!Array.isArray(expr)) {
      if (expr.type === 'number') {
        const val = expr.value;
        if (val.includes('.') || val.includes('e') || val.includes('E')) return 'f32';
        return 'i32';
      }
      return 'i32'; // symbol references — conservative default
    }
    const hd = expr[0]?.value;
    if (!hd) return 'i32';

    // f32 constants
    if (hd === 'f32.const') return 'f32';
    if (hd === 'f64.const') return 'f64';
    if (hd === 'i64.const') return 'i64';
    if (hd === 'i32.const') return 'i32';

    // f32 arithmetic/unary ops produce f32
    const f32Ops = new Set([
      'f32.add','f32.sub','f32.mul','f32.div',
      'f32.neg','f32.abs','f32.ceil','f32.floor','f32.sqrt',
      'f32.convert_i32_s','f32.convert_i32_u',
      'f32.demote_f64','f32.reinterpret_i32',
      'f32.load',
    ]);
    if (f32Ops.has(hd)) return 'f32';

    // f64 ops produce f64
    const f64Ops = new Set([
      'f64.add','f64.sub','f64.mul','f64.div',
      'f64.promote_f32','f64.convert_i32_s',
      'f64.load',
      'f64.min','f64.max','f64.copysign',
      'f64.abs','f64.neg','f64.ceil','f64.floor','f64.trunc','f64.nearest','f64.sqrt',
      'f64.convert_i32_u','f64.convert_i64_s','f64.convert_i64_u','f64.reinterpret_i64',
    ]);
    if (f64Ops.has(hd)) return 'f64';

    // i64 ops (value-producing, non-comparison)
    const i64Ops = new Set([
      'i64.extend_i32_s','i64.extend_i32_u','i64.load',
      'i64.add','i64.sub','i64.mul','i64.div_s','i64.div_u','i64.rem_s','i64.rem_u',
      'i64.and','i64.or','i64.xor','i64.shl','i64.shr_s','i64.shr_u','i64.rotl','i64.rotr',
      'i64.trunc_f32_s','i64.trunc_f32_u','i64.trunc_f64_s','i64.trunc_f64_u',
      'i64.reinterpret_f64',
    ]);
    if (i64Ops.has(hd)) return 'i64';

    // Comparison ops always return i32 (even f32.lt, f64.lt, i64.lt_s, etc.)
    const cmpOps = new Set([
      'i32.eq','i32.ne','i32.lt_s','i32.lt_u','i32.gt_s','i32.gt_u',
      'i32.le_s','i32.le_u','i32.ge_s','i32.ge_u','i32.eqz',
      'f32.eq','f32.ne','f32.lt','f32.gt','f32.le','f32.ge',
      'f64.eq','f64.ne','f64.lt','f64.gt','f64.le','f64.ge',
      'i64.eqz','i64.eq','i64.ne','i64.lt_s','i64.lt_u','i64.gt_s','i64.gt_u',
      'i64.le_s','i64.le_u','i64.ge_s','i64.ge_u',
    ]);
    if (cmpOps.has(hd)) return 'i32';

    // i32 arithmetic
    const i32Ops = new Set([
      'i32.add','i32.sub','i32.mul','i32.div_s','i32.div_u',
      'i32.rem_s','i32.rem_u','i32.and','i32.or','i32.xor',
      'i32.shl','i32.shr_s','i32.shr_u',
      'i32.trunc_f32_s','i32.trunc_f32_u',
      'i32.wrap_i64','i32.reinterpret_f32',
      'i32.load','i32.load8_u','i32.load8_s','i32.load16_s','i32.load16_u',
    ]);
    if (i32Ops.has(hd)) return 'i32';

    // Call — look up function return type
    if (hd === 'call') {
      const funcName = expr[1]?.value;
      // Check imports
      for (const imp of importDecls) {
        if (imp.funcName === funcName) {
          if (imp.results.length > 0) {
            const rt = imp.results[0];
            if (rt === VALTYPE.f32) return 'f32';
            if (rt === VALTYPE.f64) return 'f64';
            if (rt === VALTYPE.i64) return 'i64';
            return 'i32';
          }
          return 'i32';
        }
      }
      // Check user functions
      for (const fd of funcDecls) {
        if (fd.name === funcName) {
          if (fd.results.length > 0) {
            const rt = fd.results[0];
            if (rt === 'f32') return 'f32';
            if (rt === 'f64') return 'f64';
            if (rt === 'i64') return 'i64';
            return 'i32';
          }
          return 'i32';
        }
      }
      return 'i32';
    }

    // if with explicit type: (if f32 cond then else alt)
    if (hd === 'if') {
      if (expr[1]?.type === 'symbol' && ['i32','i64','f32','f64'].includes(expr[1].value)) {
        return expr[1].value;
      }
      return 'i32';
    }

    // select inherits type from its operands
    if (hd === 'select') {
      return inferExprType(expr[1]);
    }

    // load.field — look up layout field type
    if (hd === 'load.field') {
      const lname = expr[1]?.value;
      const fname = expr[2]?.value;
      const info = layoutInfo.get(lname);
      if (info) {
        const field = info.fields.find(f => f.name === fname);
        if (field) {
          const ft = field.type;
          if (ft === 'f32') return 'f32';
          if (ft === 'f64') return 'f64';
          if (ft === 'i64') return 'i64';
        }
      }
      return 'i32';
    }

    // load.elem — look up layout field type
    if (hd === 'load.elem') {
      const lname = expr[1]?.value;
      const fname = expr[2]?.value;
      const info = layoutInfo.get(lname);
      if (info) {
        const field = info.fields.find(f => f.name === fname);
        if (field) {
          const ft = field.type;
          if (ft === 'f32') return 'f32';
          if (ft === 'f64') return 'f64';
          if (ft === 'i64') return 'i64';
        }
      }
      return 'i32';
    }

    // begin — type of last expr
    if (hd === 'begin' && expr.length >= 2) {
      return inferExprType(expr[expr.length - 1]);
    }

    return 'i32'; // conservative default
  }

  // ── Pre-scan function bodies for local variable declarations ──
  function collectLocals(body) {
    const locals = [];
    const seen = new Set();
    
    function walk(expr) {
      if (!Array.isArray(expr)) return;
      const hd = expr[0]?.value;
      
      if (hd === 'let') {
        const name = expr[1]?.value;
        if (name && !seen.has(name)) {
          seen.add(name);
          // Determine type: explicit annotation takes priority
          let type = null;
          if (expr.length >= 4 && expr[2]?.type === 'symbol' && 
              ['i32','i64','f32','f64','u8','ptr','weak'].includes(expr[2].value)) {
            type = expr[2].value;
          }
          // If no explicit type, infer from init expression
          if (!type) {
            const initExpr = expr[2];
            type = inferExprType(initExpr);
          }
          // Map physical types
          if (type === 'u8' || type === 'ptr' || type === 'weak') type = 'i32';
          locals.push({ name, type });
        }
      }
      
      for (let i = 0; i < expr.length; i++) {
        if (Array.isArray(expr[i])) walk(expr[i]);
      }
    }
    
    for (const e of body) walk(e);
    return locals;
  }

  // ── Build type section ──
  // Type signatures: collect unique types for imports + builtins + user funcs
  const typeSigs = [];
  const typeMap = new Map(); // signature string → type index
  
  function getTypeIdx(params, results) {
    const key = `(${params.join(',')})=>(${results.join(',')})`;
    if (typeMap.has(key)) return typeMap.get(key);
    const idx = typeSigs.length;
    typeSigs.push({ params, results });
    typeMap.set(key, idx);
    return idx;
  }

  // Import type indices
  const importTypeIdxs = importDecls.map(imp => getTypeIdx(imp.params, imp.results));
  
  // Builtin type indices
  const builtinRegionEnterType = getTypeIdx([VALTYPE.i32], [VALTYPE.i32]);
  const builtinRegionAllocType = getTypeIdx([VALTYPE.i32], [VALTYPE.i32]);
  const builtinRegionExitType = getTypeIdx([], []);
  
  // User function type indices
  const userFuncInfo = funcDecls.map(fd => {
    const params = fd.params.map(p => {
      const t = p.type;
      return t === 'f32' ? VALTYPE.f32 : t === 'f64' ? VALTYPE.f64 : t === 'i64' ? VALTYPE.i64 : VALTYPE.i32;
    });
    const results = fd.results.map(r => {
      return r === 'f32' ? VALTYPE.f32 : r === 'f64' ? VALTYPE.f64 : r === 'i64' ? VALTYPE.i64 : VALTYPE.i32;
    });
    
    // Collect locals
    const declaredLocals = collectLocals(fd.body);
    
    // Build local map (params first, then locals)
    const localMap = new Map();
    fd.params.forEach((p, i) => {
      if (p.name) localMap.set(p.name, i);
    });
    declaredLocals.forEach((l, i) => {
      if (!localMap.has(l.name)) {
        localMap.set(l.name, fd.params.length + i);
      }
    });
    
    return {
      typeIdx: getTypeIdx(params, results),
      params,
      results,
      locals: declaredLocals,
      localMap,
      body: fd.body,
      name: fd.name,
      blockLabels: [],
    };
  });

  // ── Emit binary sections ──
  const allBytes = [];
  
  // Magic + Version
  allBytes.push(0x00, 0x61, 0x73, 0x6d); // \0asm
  allBytes.push(0x01, 0x00, 0x00, 0x00); // version 1
  
  // Section 1: Type section
  {
    const content = [];
    content.push(...encodeULEB128(typeSigs.length));
    for (const sig of typeSigs) {
      content.push(0x60); // func type marker
      content.push(...encodeULEB128(sig.params.length));
      for (const p of sig.params) content.push(p);
      content.push(...encodeULEB128(sig.results.length));
      for (const r of sig.results) content.push(r);
    }
    allBytes.push(...encodeSection(1, content));
  }
  
  // Section 2: Import section
  {
    const content = [];
    content.push(...encodeULEB128(importDecls.length));
    for (let i = 0; i < importDecls.length; i++) {
      const imp = importDecls[i];
      content.push(...encodeString(imp.module));
      content.push(...encodeString(imp.name));
      content.push(0x00); // import kind = func
      content.push(...encodeULEB128(importTypeIdxs[i]));
    }
    allBytes.push(...encodeSection(2, content));
  }
  
  // Section 3: Function section (declares type index for each function)
  {
    const numFuncs = 3 + userFuncInfo.length; // builtins + user
    const content = [];
    content.push(...encodeULEB128(numFuncs));
    content.push(...encodeULEB128(builtinRegionEnterType));
    content.push(...encodeULEB128(builtinRegionAllocType));
    content.push(...encodeULEB128(builtinRegionExitType));
    for (const ufi of userFuncInfo) {
      content.push(...encodeULEB128(ufi.typeIdx));
    }
    allBytes.push(...encodeSection(3, content));
  }
  
  // Section 5: Memory section
  {
    const content = [];
    content.push(...encodeULEB128(1)); // 1 memory
    content.push(0x01); // has max
    content.push(...encodeULEB128(16)); // initial: 16 pages (1MB)
    content.push(...encodeULEB128(16384)); // max: 16384 pages (1GB); grows lazily via memory.grow (no GC yet, so large-string/array builds need headroom)
    allBytes.push(...encodeSection(5, content));
  }
  
  // Section 6: Global section
  {
    const content = [];
    content.push(...encodeULEB128(2)); // 2 globals
    // $bump_ptr: mut i32 = 1024
    content.push(VALTYPE.i32, 0x01); // type, mutable
    content.push(OP.i32_const, ...encodeSLEB128(1024), OP.end);
    // $region_save: mut i32 = 0
    content.push(VALTYPE.i32, 0x01);
    content.push(OP.i32_const, ...encodeSLEB128(0), OP.end);
    allBytes.push(...encodeSection(6, content));
  }
  
  // Section 7: Export section
  {
    const content = [];
    const exports = [];
    
    // Export memory
    exports.push({ name: 'memory', kind: 0x02, idx: 0 });
    
    // Export user-declared exports
    for (const exp of exportDecls) {
      const fIdx = funcIndexMap.get(exp.funcRef);
      if (fIdx !== undefined) {
        exports.push({ name: exp.exportName, kind: 0x00, idx: fIdx });
      }
    }
    
    content.push(...encodeULEB128(exports.length));
    for (const exp of exports) {
      content.push(...encodeString(exp.name));
      content.push(exp.kind);
      content.push(...encodeULEB128(exp.idx));
    }
    allBytes.push(...encodeSection(7, content));
  }
  
  // Section 10: Code section
  {
    const funcBodies = [];
    
    // Builtin: $__region_enter(size: i32) → i32
    // Saves bump_ptr, returns current bump_ptr
    {
      const body = [];
      body.push(OP.global_get, 0x00); // $bump_ptr
      body.push(OP.global_get, 0x00); // $bump_ptr (save)
      body.push(OP.global_set, 0x01); // $region_save = $bump_ptr
      body.push(OP.end);
      const encoded = [0x00, ...body]; // 0 locals, body
      funcBodies.push([...encodeULEB128(encoded.length), ...encoded]);
    }
    
    // Builtin: $__region_alloc(size: i32) → i32
    // Bump allocator: returns current ptr, advances by size (aligned to 4)
    {
      const body = [];
      // local 0 = size param
      // result = current $bump_ptr
      body.push(OP.global_get, 0x00); // current $bump_ptr → result
      body.push(OP.global_get, 0x00); // current $bump_ptr
      body.push(OP.local_get, 0x00); // size
      // Align size to 4 bytes: (size + 3) & ~3
      body.push(OP.i32_const, 0x03);
      body.push(OP.i32_add);
      body.push(OP.i32_const, 0x7c); // -4 in signed LEB128 = 0xFFFFFFFC = ~3
      body.push(OP.i32_and);
      body.push(OP.i32_add); // new_ptr = old_ptr + aligned_size
      body.push(OP.global_set, 0x00); // $bump_ptr = new_ptr
      body.push(OP.end);
      const encoded = [0x00, ...body];
      funcBodies.push([...encodeULEB128(encoded.length), ...encoded]);
    }
    
    // Builtin: $__region_exit()
    // Restores bump_ptr from region_save
    {
      const body = [];
      body.push(OP.global_get, 0x01); // $region_save
      body.push(OP.global_set, 0x00); // $bump_ptr = $region_save
      body.push(OP.end);
      const encoded = [0x00, ...body];
      funcBodies.push([...encodeULEB128(encoded.length), ...encoded]);
    }
    
    // User functions
    for (const ufi of userFuncInfo) {
      const bodyBytes = [];
      
      const isVoidFunc = ufi.results.length === 0;
      
      for (let i = 0; i < ufi.body.length; i++) {
        bodyBytes.push(...compileExpr(ufi.body[i], ufi, 0));
        const isLast = (i === ufi.body.length - 1);
        if (!isLast && exprProducesValue(ufi.body[i], ufi)) {
          // Drop intermediate values — not the return value
          bodyBytes.push(OP.drop);
        } else if (isLast && isVoidFunc && exprProducesValue(ufi.body[i], ufi)) {
          // Void function: drop the last expression's value too
          bodyBytes.push(OP.drop);
        }
      }
      
      // If function has no body, push appropriate default
      if (ufi.body.length === 0) {
        if (ufi.results.length > 0) {
          const rt = ufi.results[0];
          if (rt === 'f32') bodyBytes.push(OP.f32_const, ...encodeF32(0));
          else if (rt === 'f64') bodyBytes.push(OP.f64_const, 0,0,0,0,0,0,0,0);
          else bodyBytes.push(OP.i32_const, 0x00);
        }
      }
      
      bodyBytes.push(OP.end);
      
      // Encode locals — MUST preserve declaration order to match localMap indices.
      // Grouping by type (as before) reorders locals and breaks index assignments.
      // Use run-length encoding of consecutive same-type locals instead.
      const localGroups = [];
      if (ufi.locals.length > 0) {
        let currentVt = ufi.locals[0].type === 'f32' ? VALTYPE.f32 : ufi.locals[0].type === 'f64' ? VALTYPE.f64 : ufi.locals[0].type === 'i64' ? VALTYPE.i64 : VALTYPE.i32;
        let count = 1;
        for (let li = 1; li < ufi.locals.length; li++) {
          const vt = ufi.locals[li].type === 'f32' ? VALTYPE.f32 : ufi.locals[li].type === 'f64' ? VALTYPE.f64 : ufi.locals[li].type === 'i64' ? VALTYPE.i64 : VALTYPE.i32;
          if (vt === currentVt) {
            count++;
          } else {
            localGroups.push([...encodeULEB128(count), currentVt]);
            currentVt = vt;
            count = 1;
          }
        }
        localGroups.push([...encodeULEB128(count), currentVt]);
      }
      
      const localSection = [...encodeULEB128(localGroups.length), ...localGroups.flat()];
      const funcBody = [...localSection, ...bodyBytes];
      funcBodies.push([...encodeULEB128(funcBody.length), ...funcBody]);
    }
    
    const content = [...encodeULEB128(funcBodies.length), ...funcBodies.flat()];
    allBytes.push(...encodeSection(10, content));
  }

  // Section 11: Data section (watjs cstring pool) — must follow code section
  if (dataPool.bytes.length > 0) {
    const content = [];
    content.push(...encodeULEB128(1));            // 1 data segment
    content.push(0x00);                           // active, memory 0
    content.push(OP.i32_const, ...encodeSLEB128(DATA_BASE), OP.end); // offset expr
    content.push(...encodeULEB128(dataPool.bytes.length));
    content.push(...dataPool.bytes);
    allBytes.push(...encodeSection(11, content));
  }

  const binary = new Uint8Array(allBytes);
  return {
    binary,
    importDecls,
    exportDecls,
    funcDecls: funcNames,
    layoutInfo,
  };
}


// ── WAT-like disassembly for display ──

function disassembleWasm(wasmResult) {
  const { binary, importDecls, exportDecls, funcDecls, layoutInfo } = wasmResult;
  let out = ';; ═══ WASM Binary Output ═══\n';
  out += `;; Size: ${binary.length} bytes\n`;
  out += `;; Module: ${binary.length < 1024 ? binary.length + 'B' : (binary.length/1024).toFixed(1) + 'KB'}\n`;
  out += ';; Zero implicit coercion — all type conversions explicit in source\n\n';
  
  out += '(module\n';
  out += '  (memory (export "memory") 4 16)  ;; 256KB initial, 1MB max\n\n';
  out += '  (global $bump_ptr (mut i32) (i32.const 1024))\n';
  out += '  (global $region_save (mut i32) (i32.const 0))\n\n';
  
  for (const [name, info] of layoutInfo) {
    out += `  ;; layout ${name} (${info.totalSize} bytes)\n`;
    for (const f of info.fields) {
      out += `  ;;   .${f.name} : ${f.type} @ offset ${f.offset}\n`;
    }
    out += '\n';
  }
  
  for (const imp of importDecls) {
    const params = imp.params.map(p => p === 0x7f ? 'i32' : p === 0x7d ? 'f32' : p === 0x7e ? 'i64' : 'f64').join(' ');
    const results = imp.results.map(p => p === 0x7f ? 'i32' : p === 0x7d ? 'f32' : p === 0x7e ? 'i64' : 'f64').join(' ');
    out += `  (import "${imp.module}" "${imp.name}" (func ${imp.funcName}`;
    if (params) out += ` (param ${params})`;
    if (results) out += ` (result ${results})`;
    out += '))\n';
  }
  out += '\n';
  
  out += '  ;; ── builtin region management ──\n';
  out += '  (func $__region_enter (param i32) (result i32) ...)\n';
  out += '  (func $__region_alloc (param i32) (result i32) ...)\n';
  out += '  (func $__region_exit ...)\n\n';
  
  out += '  ;; ── user functions ──\n';
  for (const name of funcDecls) {
    out += `  (func ${name} ...)\n`;
  }
  out += '\n';
  
  for (const exp of exportDecls) {
    out += `  (export "${exp.exportName}" (func ${exp.funcRef}))\n`;
  }
  out += '  (export "memory" (memory 0))\n';
  
  out += ')\n\n';
  
  out += ';; ═══ Hex Dump (first 512 bytes) ═══\n';
  const limit = Math.min(binary.length, 512);
  for (let i = 0; i < limit; i += 16) {
    const hex = [];
    const ascii = [];
    for (let j = 0; j < 16 && i+j < limit; j++) {
      const b = binary[i+j];
      hex.push(b.toString(16).padStart(2, '0'));
      ascii.push(b >= 32 && b < 127 ? String.fromCharCode(b) : '.');
    }
    out += `;; ${i.toString(16).padStart(6, '0')}  ${hex.join(' ').padEnd(48)}  ${ascii.join('')}\n`;
  }
  if (binary.length > limit) {
    out += `;; ... (${binary.length - limit} more bytes)\n`;
  }
  
  return out;
}