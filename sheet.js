/* ============ МІНІ-ТАБЛИЦЯ: обчислення формул ============ */
/* Без DOM. Підтримує: числа (десяткова кома або крапка), посилання з $, діапазони, + - * / ( ) %,
   функції ROUND, SUM, AVERAGE, MEDIAN, MIN, MAX з роздільником аргументів «;».
   Помилки як в українському Excel: #ЗНАЧЕННЯ!, #ДІЛЕННЯ/0!. */
const SHEET=(()=>{
  const ERRTXT={V:'#ЗНАЧЕННЯ!',D:'#ДІЛЕННЯ/0!'};
  class FErr extends Error{ constructor(code,info){ super(code); this.code=code; this.info=info; } }
  const colN=c=>c.split('').reduce((n,ch)=>n*26+ch.charCodeAt(0)-64,0);
  const colL=n=>{ let s=''; while(n>0){ n--; s=String.fromCharCode(65+n%26)+s; n=Math.floor(n/26); } return s; };
  const REF=/(\$?)([A-Z]{1,2})(\$?)(\d+)/g;
  const parseRef=r=>{ const m=/^(\$?)([A-Z]{1,2})(\$?)(\d+)$/.exec(r); return {ca:!!m[1],c:colN(m[2]),ra:!!m[3],r:+m[4]}; };
  // великі літери, без пробілів; кириличні двійники латинських літер (А, В, С, Е…) замінюємо на латинські
  const CYR={'А':'A','В':'B','С':'C','Е':'E','К':'K','М':'M','Н':'H','О':'O','Р':'P','Т':'T','Х':'X','І':'I'};
  const normF=s=>String(s).toUpperCase().replace(/\s+/g,'').replace(/[АВСЕКМНОРТХІ]/g,ch=>CYR[ch]);

  // зсув формули під час копіювання: відносні частини рухаються, частини з $ стоять
  function shiftF(src,dr,dc){
    return normF(src).replace(REF,(m,ca,c,ra,r)=>{
      const nc=ca?colN(c):colN(c)+dc, nr=ra?+r:+r+dr;
      if(nc<1||nr<1) return '#REF!';
      return ca+colL(nc)+ra+nr; });
  }

  function tokenize(s){
    const out=[]; let i=0;
    while(i<s.length){
      const rest=s.slice(i); let m;
      if((m=/^\$?[A-Z]{1,2}\$?\d+/.exec(rest))){ out.push({t:'ref',v:m[0]}); }
      else if((m=/^\d+(?:[.,]\d+)?/.exec(rest))){ out.push({t:'num',v:parseFloat(m[0].replace(',','.'))}); }
      else if((m=/^[A-Z][A-Z0-9.]*/.exec(rest))){ out.push({t:'name',v:m[0]}); }
      else if((m=/^[-+*\/();:%]/.exec(rest))){ out.push({t:m[0]}); }
      else if(rest[0]===','){ throw new FErr('SEP'); }
      else throw new FErr('SYN');
      i+=m[0].length;
    }
    return out;
  }
  function parse(src){
    let s=normF(src); if(/[А-ЯЁІЇЄҐ]/.test(s)) throw new FErr('CYR'); if(s[0]!=='=') throw new FErr('NOEQ'); s=s.slice(1); if(!s) throw new FErr('SYN');
    if(s.includes('#REF!')) throw new FErr('REF');
    const tk=tokenize(s); let p=0;
    const peek=()=>tk[p], eat=t=>{ if(!tk[p]||tk[p].t!==t) throw new FErr('SYN'); return tk[p++]; };
    function expr(){ let a=term(); while(peek()&&(peek().t==='+'||peek().t==='-')){ const op=tk[p++].t; a={k:'bin',op,a,b:term()}; } return a; }
    function term(){ let a=unary(); while(peek()&&(peek().t==='*'||peek().t==='/')){ const op=tk[p++].t; a={k:'bin',op,a,b:unary()}; } return a; }
    function unary(){ if(peek()&&peek().t==='-'){ p++; return {k:'neg',a:unary()}; } if(peek()&&peek().t==='+'){ p++; return unary(); } return postfix(); }
    function postfix(){ let a=primary(); while(peek()&&peek().t==='%'){ p++; a={k:'pct',a}; } return a; }
    function primary(){
      const t=peek(); if(!t) throw new FErr('SYN');
      if(t.t==='num'){ p++; return {k:'num',v:t.v}; }
      if(t.t==='ref'){ p++; if(peek()&&peek().t===':'){ p++; const b=eat('ref'); return {k:'range',a:t.v,b:b.v}; } return {k:'ref',v:t.v}; }
      if(t.t==='name'){ p++; eat('('); const args=[]; if(peek()&&peek().t!==')'){ args.push(expr()); while(peek()&&peek().t===';'){ p++; args.push(expr()); } } eat(')'); return {k:'fn',name:t.v,args}; }
      if(t.t==='('){ p++; const a=expr(); eat(')'); return a; }
      throw new FErr('SYN');
    }
    const ast=expr(); if(p<tk.length) throw new FErr('SYN'); return ast;
  }

  const round=(x,n)=>{ const f=Math.pow(10,n); const y=x*f; return (y<0?-1:1)*Math.round(Math.abs(y)+1e-9)/f; };
  // cells: {A1: число | 'текст' | '=формула'}; повертає функцію значення клітинки
  function evaluator(cells){
    const cache={}, stack=new Set();
    function cell(addr){
      if(addr in cache){ if(cache[addr] instanceof FErr) throw cache[addr]; return cache[addr]; }
      if(stack.has(addr)) throw new FErr('CIRC');
      const raw=cells[addr]; let v;
      if(raw===undefined||raw===null||raw==='') v=null;
      else if(typeof raw==='number') v=raw;
      else if(String(raw)[0]==='='){ stack.add(addr); try{ v=ev(parse(raw)); }catch(e){ stack.delete(addr); if(!(e instanceof FErr)) throw e; cache[addr]=e; throw e; } stack.delete(addr); }
      else v=String(raw);
      cache[addr]=v; return v;
    }
    const num=v=>{ if(v===null) return 0; if(typeof v==='number') return v; throw new FErr('V'); };
    const clean=r=>r.replace(/\$/g,'');
    function rangeVals(a,b){ const A=parseRef(a),B=parseRef(b),out=[];
      for(let r=Math.min(A.r,B.r);r<=Math.max(A.r,B.r);r++) for(let c=Math.min(A.c,B.c);c<=Math.max(A.c,B.c);c++){ const v=cell(colL(c)+r); if(typeof v==='number') out.push(v); }
      return out; }
    function ev(n){
      switch(n.k){
        case 'num': return n.v;
        case 'ref': return cell(clean(n.v));
        case 'range': throw new FErr('SYN');
        case 'neg': return -num(ev(n.a));
        case 'pct': return num(ev(n.a))/100;
        case 'bin': { const a=num(ev(n.a)), b=num(ev(n.b));
          if(n.op==='+') return a+b; if(n.op==='-') return a-b; if(n.op==='*') return a*b;
          if(b===0) throw new FErr('D'); return a/b; }
        case 'fn': {
          const nums=()=>{ const out=[]; for(const a of n.args){ if(a.k==='range') out.push(...rangeVals(a.a,a.b)); else if(a.k==='ref'){ const v=cell(clean(a.v)); if(typeof v==='number') out.push(v); } else out.push(num(ev(a))); } return out; };
          if(n.name==='ROUND'){ if(n.args.length!==2) throw new FErr('ARGS','ROUND'); return round(num(ev(n.args[0])),num(ev(n.args[1]))); }
          if(!['SUM','AVERAGE','MEDIAN','MIN','MAX'].includes(n.name)) throw new FErr('FN',n.name);
          if(!n.args.length) throw new FErr('ARGS',n.name);
          const v=nums();
          if(n.name==='SUM') return v.reduce((s,x)=>s+x,0);
          if(n.name==='MIN') return v.length?Math.min(...v):0;
          if(n.name==='MAX') return v.length?Math.max(...v):0;
          if(!v.length) throw new FErr('D');
          if(n.name==='AVERAGE') return v.reduce((s,x)=>s+x,0)/v.length;
          const s=v.slice().sort((x,y)=>x-y), m=s.length>>1; return s.length%2?s[m]:(s[m-1]+s[m])/2;
        }
      }
      throw new FErr('SYN');
    }
    return addr=>{ try{ return cell(addr); }catch(e){ if(e instanceof FErr) return e; throw e; } };
  }

  function fmt(v,f){
    if(v instanceof FErr) return ERRTXT[v.code]||'#ПОМИЛКА';
    if(v===null) return ''; if(typeof v==='string') return v;
    const fix=(x,n)=>round(x,n).toFixed(n).replace('.',',');
    if(f==='0') return fix(v,0); if(f==='0.0') return fix(v,1); if(f==='0.00') return fix(v,2);
    if(f==='0%') return fix(v*100,0)+'%'; if(f==='0.0%') return fix(v*100,1)+'%';
    return String(parseFloat(v.toPrecision(10))).replace('.',',');
  }
  // клітинки діапазону «C4:E8» у порядку рядок за рядком
  function rangeCells(rng){ const [a,b]=rng.split(':'); const A=parseRef(a),B=parseRef(b||a),out=[];
    for(let r=A.r;r<=B.r;r++) for(let c=A.c;c<=B.c;c++) out.push(colL(c)+r); return out; }
  // вписати формулу в target і скопіювати на діапазон fill
  function fillFormula(cells,target,fill,formula){
    const T=parseRef(target), out=Object.assign({},cells);
    for(const a of rangeCells(fill||target)){ const A=parseRef(a); out[a]=shiftF(formula,A.r-T.r,A.c-T.c); if(out[a][0]!=='=') out[a]='='+out[a]; }
    return out;
  }
  return {FErr,ERRTXT,parse,evaluator,shiftF,fmt,normF,rangeCells,fillFormula,parseRef,colL,colN};
})();
if(typeof module!=='undefined') module.exports=SHEET;
