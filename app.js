const KEY='adhkari2',today=new Date().toISOString().slice(0,10);
let S={font:1,counter:0,vib:true,auto:false,intro:0,day:today,p:{}};
try{Object.assign(S,JSON.parse(localStorage.getItem(KEY)||'{}'))}catch(e){}
if(S.day!==today){['morning','evening','post'].forEach(k=>delete S.p[k]);S.day=today}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
const $=s=>document.querySelector(s),app=$('#app');
const rem=(k,i,n)=>(S.p[k]&&S.p[k][i]!==undefined)?S.p[k][i]:n;
const setRem=(k,i,v)=>{(S.p[k]=S.p[k]||{})[i]=v;save()};
const doneCount=k=>D[k].items.filter((x,i)=>rem(k,i,x.n)===0).length;
const buzz=()=>{if(S.vib&&navigator.vibrate)try{navigator.vibrate(15)}catch(e){}};
function fontBar(){return '<div class="tools">حجم الخط:'+FS.map((f,i)=>`<button class="chip ${S.font===i?'on':''}" data-act="font" data-i="${i}">${f[0]}</button>`).join('')+'</div>'}
function applyFont(){document.documentElement.style.setProperty('--fs',FS[S.font][1])}
function home(){
 const m=doneCount('morning'),e=doneCount('evening'),p=doneCount('post'),np=D.post.items.length;
 const st=(k,c)=>c===D[k].items.length?'<b class="ok">مكتملة ✓</b>':'<b>غير مكتملة</b>';
 return `<div class="top"><h1>أذكاري</h1></div><p class="sub">رفيقك اليومي لذكر الله</p>
 <section class="ward"><h2>وردك اليومي</h2><div>أذكار الصباح ${st('morning',m)}</div><div>أذكار المساء ${st('evening',e)}</div><div>أذكار ما بعد الصلاة <b>${Math.round(p/np*100)}%</b></div></section>
 <div class="grid">`+[...Object.entries(D).map(([k,v])=>[k,v.ic,v.title,v.desc]),['tasbeeh','📿','التسبيحات','اختر تسبيحة وسبّح بعداد خاص'],['counter','🔢','عداد التسبيح','عداد حر لأي ذكر تريده']].map(a=>`<button class="tile" data-go="${a[0]}"><div class="ic">${a[1]}</div><h3>${a[2]}</h3><p>${a[3]}</p></button>`).join('')+'</div>'}
function head(t,sub){return `<div class="top"><button class="back" data-go="home">→ الرئيسية</button></div><h2>${t}</h2><p class="sub">${sub||''}</p>`}
function list(k){
 const d=D[k],c=doneCount(k),n=d.items.length;
 return head(d.title,d.sub)+`<div>أكملت ${c} من ${n} ذكرًا</div><div class="bar"><i style="width:${c/n*100}%"></i></div>`+fontBar()+
 `<div class="tools"><button class="chip ${S.auto?'on':''}" data-act="auto">الانتقال التلقائي: ${S.auto?'مفعّل':'معطّل'}</button><button class="chip" data-act="resetsec" data-k="${k}">إعادة الأذكار من البداية</button></div>`+
 d.items.map((x,i)=>{const r=rem(k,i,x.n);return `<article class="zk ${r===0?'done':''}" id="z${i}"><p class="t">${x.t}</p><div class="meta"><span>عدد مرات التكرار: ${x.n}</span><span>المتبقي: <b>${r}</b></span></div><button class="tap" data-act="tap" data-k="${k}" data-i="${i}" ${r===0?'aria-label="مكتمل"':''}>${r===0?'✓ تم إكمال الذكر':'اضغط للتكرار'}</button><div class="row"><button data-act="reset" data-k="${k}" data-i="${i}">إعادة العداد</button></div><details><summary>مصدر الذكر وفضله</summary>${x.f?`<p>الفضل: ${x.f}</p>`:''}<p>المصدر: ${x.s}</p></details></article>`}).join('')}
function tasbeeh(){
 return head('التسبيحات','اختر تسبيحة وسبّح بها')+fontBar()+'<div class="grid">'+TS.map((x,i)=>`<button class="tile" data-go="tasbeeh-${i}"><p class="t" style="font-family:Amiri,serif;font-size:1.3rem;color:var(--tx);line-height:1.9">${x[0]}</p><p>${x[1]?'العدد: '+x[1]:'دون عدد مفروض'} · ${(S.p.ts||{})[i]||0}</p></button>`).join('')+'</div>'}
function tsOne(i){
 const x=TS[i],c=(S.p.ts||{})[i]||0,tg=(S.p.tt||{})[i]||x[1]||0;
 return `<div class="top"><button class="back" data-go="tasbeeh">→ التسبيحات</button></div><div class="pad"><p class="t">${x[0]}</p><div class="big" id="v">${c}</div><button class="round" data-act="ts" data-i="${i}" aria-label="سبّح">سبّح</button><div class="ctr"><label>العدد المستهدف <input type="number" min="0" value="${tg||''}" data-act="target" data-i="${i}"></label><button class="chip" data-act="tsreset" data-i="${i}">إعادة العداد</button></div><p class="sub" id="tg">${tg?(c>=tg?'بلغت العدد المستهدف ✓':'المتبقي: '+(tg-c)):''}</p></div>`}
function counter(){
 return head('عداد التسبيح','سبّح بما شئت')+`<div class="pad"><div class="big" id="v">${String(S.counter).padStart(3,'0')}</div><button class="round" data-act="cnt" aria-label="زِد">+</button><div class="ctr"><button class="chip" data-act="creset">إعادة التصفير</button><button class="chip" data-act="cundo">تراجع</button><button class="chip ${S.vib?'on':''}" data-act="vib">الاهتزاز: ${S.vib?'مفعّل':'معطّل'}</button></div></div>`}
function route(){
 const h=(location.hash||'#home').slice(1);let html,base=h;
 if(D[h])html=list(h);else if(h==='tasbeeh')html=tasbeeh();else if(/^tasbeeh-\d+$/.test(h)&&TS[+h.split('-')[1]]){html=tsOne(+h.split('-')[1]);base='tasbeeh'}else if(h==='counter')html=counter();else{html=home();base='home'}
 app.innerHTML=html;window.scrollTo(0,0);S.last=h;save();
 $('#nav').innerHTML=NAV.map(n=>`<a href="#${n[0]}" class="${n[0]===base?'cur':''}"><span>${n[1]}</span>${n[2]}</a>`).join('')}
function refresh(){const y=scrollY;route();scrollTo(0,y)}
app.addEventListener('click',e=>{
 const g=e.target.closest('[data-go]');if(g){location.hash=g.dataset.go;return}
 const b=e.target.closest('[data-act]');if(!b)return;const a=b.dataset.act,k=b.dataset.k,i=+b.dataset.i;
 if(a==='font'){S.font=i;applyFont();save();refresh()}
 else if(a==='auto'){S.auto=!S.auto;save();refresh()}
 else if(a==='tap'){const it=D[k].items[i],r=rem(k,i,it.n);if(r>0){setRem(k,i,r-1);buzz();refresh();if(r-1===0&&S.auto){const z=document.getElementById('z'+(i+1));if(z)z.scrollIntoView({behavior:'smooth',block:'center'})}}}
 else if(a==='reset'){setRem(k,i,D[k].items[i].n);refresh()}
 else if(a==='resetsec'){if(confirm('إعادة تقدم هذا القسم من البداية؟')){delete S.p[k];save();route()}}
 else if(a==='ts'){const t=S.p.ts=S.p.ts||{};t[i]=(t[i]||0)+1;save();buzz();$('#v').textContent=t[i];tgUp(i)}
 else if(a==='tsreset'){(S.p.ts=S.p.ts||{})[i]=0;save();refresh()}
 else if(a==='cnt'){S.counter++;save();buzz();$('#v').textContent=String(S.counter).padStart(3,'0')}
 else if(a==='cundo'){if(S.counter>0)S.counter--;save();$('#v').textContent=String(S.counter).padStart(3,'0')}
 else if(a==='creset'){S.counter=0;save();$('#v').textContent='000'}
 else if(a==='vib'){S.vib=!S.vib;save();refresh()}});
app.addEventListener('change',e=>{const t=e.target;if(t.dataset.act==='target'){(S.p.tt=S.p.tt||{})[t.dataset.i]=+t.value||0;save();tgUp(+t.dataset.i)}});
function tgUp(i){const c=(S.p.ts||{})[i]||0,tg=(S.p.tt||{})[i]||TS[i][1]||0,el=$('#tg');if(el)el.textContent=tg?(c>=tg?'بلغت العدد المستهدف ✓':'المتبقي: '+(tg-c)):''}
addEventListener('hashchange',route);
applyFont();
/* intro: shown once, skippable */
const intro=$('#intro');
const hideIntro=()=>{intro.hidden=true;intro.style.display='none'};
function endIntro(){S.intro=1;save();intro.classList.add('out');setTimeout(hideIntro,800)}
const go=()=>{$('#nm').classList.add('burst');setTimeout(endIntro,900)};
$('#sk').onclick=endIntro;$('#go').onclick=go;$('#nm').onclick=go;
if(!S.intro){intro.hidden=false;$('#ph').textContent=PH[Math.floor(Math.random()*PH.length)]}
else hideIntro();
if(location.hash===''&&S.last&&S.last!=='home'&&S.intro)location.hash=S.last;
route();
