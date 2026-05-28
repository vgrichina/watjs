// ═══════════════════════════════════════════════════════════════
// WATX COMPILER — Stages 2-4: Include, Macro, Type Checker
// ═══════════════════════════════════════════════════════════════

// --- Stage 2: Include Resolver ---
function resolveIncludes(forms, vfs, included = new Set(), filename = '<main>') {
  const result = [];
  for (const form of forms) {
    if (Array.isArray(form) && form.length >= 2 && form[0]?.value === 'include') {
      const path = form[1]?.value?.replace(/"/g, '') || '';
      if (included.has(path)) continue;
      if (!vfs.has(path)) {
        result.push(form);
        continue;
      }
      included.add(path);
      const src = vfs.get(path);
      const tokens = tokenize(src, path);
      const subForms = parseSexpr(tokens);
      const resolved = resolveIncludes(subForms, vfs, included, path);
      result.push(...resolved);
    } else {
      result.push(form);
    }
  }
  return result;
}

// --- Stage 3: Macro Expander ---
function expandMacros(forms) {
  const macros = new Map();
  let gensymCounter = 0;
  
  function gensym(base) { return `$__gs_${base}_${gensymCounter++}`; }
  
  function collectMacros(formList) {
    const out = [];
    for (const form of formList) {
      if (Array.isArray(form) && form[0]?.value === 'defmacro') {
        const sig = form[1];
        if (Array.isArray(sig)) {
          const name = sig[0]?.value || sig[0];
          const params = sig.slice(1).map(p => p?.value || p);
          const body = form.slice(2);
          macros.set(typeof name === 'string' ? name : name, { params, body });
        }
      } else {
        out.push(form);
      }
    }
    return out;
  }
  
  function interpolateName(template, bindings) {
    let result = template;
    for (const [k, v] of Object.entries(bindings)) {
      const val = typeof v === 'string' ? v : (v?.value || String(v));
      result = result.replace(new RegExp(`\\{[^}]*${k.replace('$', '\\$')}[^}]*\\}`, 'g'), (match) => {
        let r = match.slice(1, -1);
        for (const [bk, bv] of Object.entries(bindings)) {
          const bval = typeof bv === 'string' ? bv : (bv?.value || String(bv));
          r = r.replace(bk, bval.replace('$', ''));
        }
        return '$' + r;
      });
    }
    return result;
  }
  
  function substitute(template, bindings) {
    if (Array.isArray(template)) {
      if (template[0]?.value === 'begin') {
        return template.slice(1).flatMap(t => {
          const r = substitute(t, bindings);
          return Array.isArray(r) && r._isBegin ? r : [r];
        });
      }
      const result = template.map(t => substitute(t, bindings));
      result._meta = template._meta;
      return result;
    }
    if (template?.type === 'symbol') {
      const val = template.value;
      if (bindings[val] !== undefined) return bindings[val];
      if (val.includes('{')) {
        const newVal = interpolateName(val, bindings);
        return { ...template, value: newVal };
      }
      return template;
    }
    return template;
  }
  
  function expandForm(form) {
    if (!Array.isArray(form)) return form;
    const head = form[0]?.value;
    if (head && macros.has(head)) {
      const macro = macros.get(head);
      const args = form.slice(1);
      const bindings = {};
      macro.params.forEach((p, i) => { bindings[p] = args[i]; });
      const expanded = macro.body.map(b => substitute(b, bindings));
      if (expanded.length === 1) return expandForm(expanded[0]);
      const result = expanded.flatMap(e => Array.isArray(e) && e._isBegin ? e : [expandForm(e)]);
      result._isBegin = true;
      return result;
    }
    const result = form.map(f => expandForm(f));
    result._meta = form._meta;
    return result;
  }
  
  let expanded = collectMacros(forms);
  expanded = expanded.flatMap(f => {
    const r = expandForm(f);
    return Array.isArray(r) && r._isBegin ? r : [r];
  });
  return expanded;
}

// --- Stage 4: Bidirectional Type/Region Checker ---
function checkTypes(forms) {
  var errors = [], warnings = [];
  var layouts = new Map(), functions = new Map(), regions = new Set(["static"]), importSigs = new Map();
  function loc(form) {
    if (Array.isArray(form) && form._meta) return { line: form._meta.line || 0, col: form._meta.col || 0 };
    if (form && form.line) return { line: form.line, col: form.col || 0 };
    return { line: 0, col: 0 };
  }
  function addError(msg, form) { var l = loc(form); errors.push({ msg: msg, line: l.line, col: l.col }); }
  function addWarning(msg, form) { var l = loc(form); warnings.push({ msg: msg, line: l.line, col: l.col }); }
  for (var fi = 0; fi < forms.length; fi++) { var form = forms[fi];
    if (!Array.isArray(form)) continue; var head = form[0] && form[0].value;
    if (head === "layout") { var name = form[1] && form[1].value; if (name) { var fields = [];
      for (var i = 2; i < form.length; i++) { if (Array.isArray(form[i]) && form[i][0] && form[i][0].value === "field") {
        var fname = form[i][1] && form[i][1].value, ftype = (form[i][2] && form[i][2].value) || "i32";
        if (fname) { if (["i32","i64","f32","f64","u8","ptr","weak"].indexOf(ftype)===-1) addWarning("Layout "+name+": field "+fname+" has unknown type "+ftype, form[i]); fields.push({ name: fname, type: ftype }); } } }
      if (layouts.has(name)) addWarning("Duplicate layout: "+name, form); layouts.set(name, fields); } }
    if (head === "func") { var name = form[1] && form[1].value; if (name) { var params = [], results = [], hasEffects = false;
      for (var i = 2; i < form.length; i++) { if (Array.isArray(form[i])) { var kind = form[i][0] && form[i][0].value;
        if (kind === "param") { var pn = form[i][1] && form[i][1].value, pt = (form[i][2] && form[i][2].value) || pn;
          if (pn && pn.charAt(0)==="$") params.push({name:pn,type:pt}); else params.push({name:null,type:pn}); }
        else if (kind === "result") { for (var j=1;j<form[i].length;j++) results.push((form[i][j]&&form[i][j].value)||"i32"); }
        else if (kind === "effects") hasEffects = true; } }
      if (!hasEffects && name.indexOf("$__")!==0) addWarning("Function "+name+" missing (effects ...) clause", form);
      functions.set(name, {form:form,params:params,results:results,hasEffects:hasEffects}); } }
    if (head === "wasm-import") { var sig = form[3];
      if (Array.isArray(sig) && sig[0] && sig[0].value === "func") { var funcName=(sig[1]&&sig[1].value)||"",ip=[],ir=[];
        for (var i=2;i<sig.length;i++) { if (Array.isArray(sig[i])) { var k2=sig[i][0]&&sig[i][0].value;
          if (k2==="param") { for (var j=1;j<sig[i].length;j++) ip.push((sig[i][j]&&sig[i][j].value)||"i32"); }
          else if (k2==="result") { for (var j=1;j<sig[i].length;j++) ir.push((sig[i][j]&&sig[i][j].value)||"i32"); } } }
        importSigs.set(funcName, {params:ip,results:ir}); } }
    if (head === "with-region") { var rn = form[1]&&form[1].value; if(rn) regions.add(rn); }
  }
  function stackType(t) { if(typeof t==="number"){if(t===0x7f)return"i32";if(t===0x7e)return"i64";if(t===0x7d)return"f32";if(t===0x7c)return"f64";}
    if(t==="ptr"||t==="weak"||t==="u8"||t==="region-handle")return"i32"; return t||"i32"; }
  function checkFuncBody(funcInfo) { var form=funcInfo.form,params=funcInfo.params,results=funcInfo.results;
    var localEnv = new Map(); for(var pi=0;pi<params.length;pi++) if(params[pi].name) localEnv.set(params[pi].name,stackType(params[pi].type));
    var bodyExprs = []; for(var i=2;i<form.length;i++){if(Array.isArray(form[i])){var k=form[i][0]&&form[i][0].value;if(k==="param"||k==="result"||k==="effects")continue;}bodyExprs.push(form[i]);}
    function synthesize(expr) { if(!Array.isArray(expr)){if(expr&&expr.type==="number")return String(expr.value).indexOf(".")>=0?"f32":"i32";if(expr&&expr.type==="symbol")return localEnv.has(expr.value)?localEnv.get(expr.value):"i32";return"i32";}
      var hd=expr[0]&&expr[0].value;if(!hd)return"i32";if(hd.indexOf("i32.")===0)return"i32";if(hd.indexOf("i64.")===0)return"i64";if(hd.indexOf("f32.")===0)return"f32";if(hd.indexOf("f64.")===0)return"f64";
      if(["f32.convert_i32_s","f32.convert_i32_u","f32.demote_f64","f32.reinterpret_i32"].indexOf(hd)>=0)return"f32";
      if(["i32.trunc_f32_s","i32.trunc_f32_u","i32.reinterpret_f32","i32.wrap_i64"].indexOf(hd)>=0)return"i32";
      if(hd==="i64.extend_i32_s")return"i64";if(hd==="f64.promote_f32")return"f64";
      if(hd==="call"){var fn=expr[1]&&expr[1].value;var im=importSigs.get(fn);if(im&&im.results.length>0)return stackType(im.results[0]);var uf=functions.get(fn);if(uf&&uf.results.length>0)return stackType(uf.results[0]);return"i32";}
      if(hd==="local.get"){var n=expr[1]&&expr[1].value;return(n&&localEnv.has(n))?localEnv.get(n):"i32";}
      if(hd==="load.field"||hd==="load.elem"){var ln=expr[1]&&expr[1].value,fn=expr[2]&&expr[2].value,lo=layouts.get(ln);if(lo){var f;for(var x=0;x<lo.length;x++)if(lo[x].name===fn){f=lo[x];break;}if(f)return stackType(f.type);}return"i32";}
      if(hd==="let"){var nm=expr[1]&&expr[1].value;if(expr.length>=4&&expr[2]&&expr[2].type==="symbol"&&["i32","i64","f32","f64","u8","ptr","weak"].indexOf(expr[2].value)>=0){var dt=stackType(expr[2].value);if(nm)localEnv.set(nm,dt);return dt;}if(nm&&expr[2]){var it=synthesize(expr[2]);localEnv.set(nm,it);return it;}return"i32";}
      if(hd==="if"){if(expr[1]&&expr[1].type==="symbol"&&["i32","i64","f32","f64"].indexOf(expr[1].value)>=0)return stackType(expr[1].value);return"i32";}
      if(hd==="select")return expr.length>=3?synthesize(expr[1]):"i32";
      if(hd==="region.alloc"||hd==="set!"||hd==="local.set"||hd==="store.field"||hd==="store.elem")return"i32";
      if(hd==="block"||hd==="loop"||hd==="begin"||hd==="with-region")return expr.length>=2?synthesize(expr[expr.length-1]):"i32";
      if(["nop","drop","br","br_if","return"].indexOf(hd)>=0)return"i32";return"i32";}
    function checkExpr(expr,expected,context){var actual=synthesize(expr);if(actual!==expected)addWarning("Type mismatch in "+context+": expected "+expected+", got "+actual,expr);}
    function walkExpr(expr){if(!Array.isArray(expr))return;var hd=expr[0]&&expr[0].value;if(!hd)return;
      if(hd==="let"){var nm=expr[1]&&expr[1].value;if(expr.length>=4&&expr[2]&&expr[2].type==="symbol"&&["i32","i64","f32","f64","u8","ptr","weak"].indexOf(expr[2].value)>=0){var dt=stackType(expr[2].value);if(nm)localEnv.set(nm,dt);checkExpr(expr[3],dt,"let "+nm+" init");walkExpr(expr[3]);}else if(nm&&expr[2]){localEnv.set(nm,synthesize(expr[2]));walkExpr(expr[2]);}return;}
      if(hd==="set!"||hd==="local.set"){var nm=expr[1]&&expr[1].value;if(nm&&localEnv.has(nm)&&expr[2]){checkExpr(expr[2],localEnv.get(nm),"set! "+nm);walkExpr(expr[2]);}return;}
      if(hd==="call"){var fn=expr[1]&&expr[1].value;var ep=null;var im=importSigs.get(fn);if(im)ep=im.params;else{var uf=functions.get(fn);if(uf)ep=uf.params.map(function(p){return p.type});}if(ep){var args=expr.slice(2);for(var ai=0;ai<Math.min(args.length,ep.length);ai++)checkExpr(args[ai],stackType(ep[ai]),"call "+fn+" arg "+ai);if(args.length!==ep.length)addWarning("call "+fn+": expected "+ep.length+" args, got "+args.length,expr);}for(var i=2;i<expr.length;i++)walkExpr(expr[i]);return;}
      if(hd==="store.field"){var ln=expr[1]&&expr[1].value,fn=expr[2]&&expr[2].value,lo=layouts.get(ln);if(lo){var f;for(var x=0;x<lo.length;x++)if(lo[x].name===fn){f=lo[x];break;}if(f&&expr[4])checkExpr(expr[4],stackType(f.type),"store.field "+ln+"."+fn);if(!f)addWarning("Unknown field "+fn+" in layout "+ln,expr);}else if(ln)addWarning("Unknown layout "+ln,expr);for(var i=3;i<expr.length;i++)walkExpr(expr[i]);return;}
      if(hd==="store.elem"){var ln=expr[1]&&expr[1].value,fn=expr[2]&&expr[2].value,lo=layouts.get(ln);if(lo){var f;for(var x=0;x<lo.length;x++)if(lo[x].name===fn){f=lo[x];break;}if(f&&expr[5])checkExpr(expr[5],stackType(f.type),"store.elem "+ln+"."+fn);}for(var i=3;i<expr.length;i++)walkExpr(expr[i]);return;}
      if(hd==="load.field"){var ln=expr[1]&&expr[1].value,fn=expr[2]&&expr[2].value,lo=layouts.get(ln);if(!lo&&ln)addWarning("Unknown layout "+ln,expr);else if(lo&&fn){var found=false;for(var x=0;x<lo.length;x++)if(lo[x].name===fn){found=true;break;}if(!found)addWarning("Unknown field "+fn+" in layout "+ln,expr);}for(var i=3;i<expr.length;i++)walkExpr(expr[i]);return;}
      if(hd==="if"){var ci=1;if(expr[1]&&expr[1].type==="symbol"&&["i32","i64","f32","f64"].indexOf(expr[1].value)>=0)ci=2;if(expr[ci]){checkExpr(expr[ci],"i32","if condition");walkExpr(expr[ci]);}for(var i=ci+1;i<expr.length;i++)if(Array.isArray(expr[i]))walkExpr(expr[i]);return;}
      if(hd==="with-region"){for(var i=3;i<expr.length;i++)if(Array.isArray(expr[i]))walkExpr(expr[i]);return;}
      if(hd==="begin"||hd==="block"){for(var i=1;i<expr.length;i++)walkExpr(expr[i]);return;}
      if(hd==="loop"){for(var i=2;i<expr.length;i++)walkExpr(expr[i]);return;}
      if(hd==="br_if"){var hl=expr[1]&&expr[1].type==="symbol"&&expr[1].value&&expr[1].value.charAt(0)==="$";var cond=hl?expr[2]:expr[1];if(cond){checkExpr(cond,"i32","br_if condition");walkExpr(cond);}return;}
      if(hd==="return"){if(expr[1]&&results.length>0){checkExpr(expr[1],stackType(results[0]),"return value");walkExpr(expr[1]);}return;}
      for(var i=1;i<expr.length;i++)if(Array.isArray(expr[i]))walkExpr(expr[i]);}
    if(results.length>0&&bodyExprs.length>0){var lastExpr=bodyExprs[bodyExprs.length-1],lastType=synthesize(lastExpr),expectedResult=stackType(results[0]);
      if(lastType!==expectedResult)addWarning("Function "+(funcInfo.params.length?form[1].value:"??")+": body produces "+lastType+", declared result is "+expectedResult,lastExpr);}
    for(var bi=0;bi<bodyExprs.length;bi++)walkExpr(bodyExprs[bi]);
  }
  for(var entry of functions){var name=entry[0],funcInfo=entry[1];
    try{checkFuncBody(funcInfo);}catch(e){console.warn("[WATX checker] Error checking "+name+":",e.message);addWarning("Type checker internal error in "+name+": "+e.message,funcInfo.form);}}
  if(errors.length>0)console.log("[WATX checker] "+errors.length+" error(s), "+warnings.length+" warning(s)");
  var foldedWarnings=errors.map(function(e){var r={};for(var k in e)r[k]=e[k];r.msg="[TYPE ERROR] "+e.msg;r.isTypeError=true;return r;}).concat(warnings);
  return {errors:errors,warnings:foldedWarnings,layouts:layouts,functions:functions,regions:regions,importSigs:importSigs};
}