const fs=require('fs'),vm=require('vm'),assert=require('assert');
const f=require('path').join(__dirname,'..','index.html'),html=fs.readFileSync(f,'utf8');
let script=html.split('<script>')[1].split('</script>')[0];
script=script.replace(/\s+render\(\);\s+\}\)\(\);\s*$/, '\n      globalThis.TEST={parse,detect,generate,clean,render,loadExample}; render();\n    })();');
class El{constructor(id=''){this.id=id;this.value='';this.checked=false;this.dataset={};this.style={};this.classList={add(){},remove(){}};this.listeners={};this.textContent='';this.open=false;this.hidden=false;}append(){}appendChild(){}setAttribute(k,v){this[k]=v}addEventListener(k,cb){this.listeners[k]=cb}focus(){}select(){}setSelectionRange(){}close(){this.open=false}showModal(){this.open=true}}
const elems={};const get=id=>elems[id]??(elems[id]=new El(id));
for(const id of ['trim','blanks'])get(id).checked=true;
get('source').value='auto';get('case').value='none';get('dialect').value='sqlserver';get('table-name').value='MyTable';
// Minimal document stub to run pure transformations without browser or network.
const doc={getElementById:get,createElement:()=>new El(),querySelectorAll:(s)=>s==='.format'?[]:[],};
const ctx={document:doc,window:{isSecureContext:false},navigator:{},console};vm.createContext(ctx);
vm.runInContext(script,ctx,{timeout:2000});
const fixture=JSON.parse(fs.readFileSync(require('path').join(__dirname,'test-cases.json'),'utf8'));
let passed=0;
for(const t of fixture){
  get('input').value=t.input;get('source').value=t.source;get('headers').checked=!!t.headers;get('table-name').value=t.table||'MyTable';
  const kind=t.source==='auto'?ctx.TEST.detect(t.input).kind:t.source;
  const rows=ctx.TEST.clean(ctx.TEST.parse(t.input,kind));const actual=ctx.TEST.generate(rows,t.target);
  try{assert.strictEqual(actual,t.expected);passed++;console.log('PASS',t.name)}catch(e){console.error('FAIL',t.name,'actual:',JSON.stringify(actual),'expected:',JSON.stringify(t.expected));process.exitCode=1}
}
// one-row SQL INSERT shouldn't misleadingly show No Data if headers unchecked
get('headers').checked=false;get('table-name').value='Employees';assert.match(ctx.TEST.generate([['101','Alice','NY']],'insert'),/VALUES/);
// when header checked but no data, actionable error
get('headers').checked=true;assert.throws(()=>ctx.TEST.generate([['ID','Name']],'insert'),/No data rows found/);
// ensure no remote code or storage
for(const bad of [/\bfetch\s*\(/,/\bXMLHttpRequest\b/,/\blocalStorage\b/,/\bsessionStorage\b/,/<script[^>]+src=/i,/@import\s/i])assert.ok(!bad.test(html),`Unexpected external/storage token ${bad}`);
console.log(passed+'/'+fixture.length+' fixtures passed; security text checks passed');
