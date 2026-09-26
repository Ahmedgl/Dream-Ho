
const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
const money=n=>n==null||n===''?'—':Number(n).toLocaleString('en-US')+' EGP';
const WA_SVG='<svg viewBox="0 0 32 32" width="15" height="15"><path fill="#25D366" d="M16.001 3C9.383 3 4 8.383 4 15c0 2.386.703 4.605 1.918 6.464L4 29l7.75-1.868A11.94 11.94 0 0016 27c6.617 0 12-5.383 12-12S22.618 3 16.001 3zm.001 21.818c-1.94 0-3.76-.51-5.34-1.4l-.383-.219-4.598 1.107 1.127-4.482-.245-.397A9.77 9.77 0 015.818 15c0-5.615 4.567-10.182 10.183-10.182 5.615 0 10.182 4.567 10.182 10.182s-4.567 10.182-10.182 10.182zm5.579-7.62c-.306-.153-1.809-.892-2.089-.994-.28-.102-.484-.153-.688.153-.204.306-.789.994-.967 1.198-.178.204-.357.229-.663.076-.306-.153-1.293-.477-2.463-1.522-.911-.812-1.527-1.815-1.705-2.121-.178-.306-.019-.472.134-.624.138-.137.306-.357.459-.535.153-.178.204-.306.306-.51.102-.204.051-.382-.026-.535-.076-.153-.688-1.658-.943-2.27-.248-.596-.5-.516-.688-.526l-.586-.01c-.204 0-.535.076-.815.382-.28.306-1.068 1.044-1.068 2.546 0 1.502 1.093 2.955 1.245 3.159.153.204 2.15 3.283 5.209 4.603.728.314 1.296.502 1.739.642.731.232 1.396.199 1.922.121.586-.087 1.809-.74 2.064-1.454.255-.714.255-1.325.178-1.454-.076-.128-.28-.204-.586-.357z"/></svg>';
function waHref(phone){let d=String(phone||'').replace(/[٠-٩]/g,x=>String('٠١٢٣٤٥٦٧٨٩'.indexOf(x))).replace(/\D/g,'');if(!d)return'';if(d.startsWith('0'))d='2'+d;else if(!d.startsWith('20'))d='20'+d;return'https://wa.me/'+d}
function waBtn(phone){return phone?` <a class="wa-btn" href="${waHref(phone)}" target="_blank" rel="noopener" title="مراسلة واتساب">${WA_SVG}</a>`:''}
const KEY='dream_house_static_v1', AUTH='dream_house_auth_v1';
let props=[],clients=[];
const EMPTY_DB=()=>({properties:[],clients:[],seq:1});
function db(){
  try{
    const raw=localStorage.getItem(KEY);
    if(!raw)return EMPTY_DB();
    const d=JSON.parse(raw);
    return {
      properties:Array.isArray(d.properties)?d.properties:[],
      clients:Array.isArray(d.clients)?d.clients:[],
      seq:Number(d.seq)||1
    };
  }catch{return EMPTY_DB();}
}
function saveDB(d){
  try{localStorage.setItem(KEY,JSON.stringify(d));return true}
  catch(err){toast('مساحة التخزين ممتلئة. احذف صورًا قديمة أو استخدم النسخة الاحتياطية.');return false}
}
function showLogin(){$('#app').classList.add('hidden');$('#login').classList.remove('hidden')}
function showApp(){$('#login').classList.add('hidden');$('#app').classList.remove('hidden');loadAll()}
function toast(t){const x=$('#toast');x.textContent=t;x.classList.add('show');clearTimeout(window.__toast);window.__toast=setTimeout(()=>x.classList.remove('show'),2400)}
function auth(){return sessionStorage.getItem(AUTH)==='1'}
function boot(){if(auth()){showApp()}else showLogin()}
boot();
const togglePassword=$('#togglePassword');
if(togglePassword) togglePassword.onclick=()=>{const p=$('#password');const show=p.type==='password';p.type=show?'text':'password';togglePassword.textContent=show?'◌':'◉';};
$('#loginForm').onsubmit=e=>{e.preventDefault();$('#loginError').textContent='';const btn=document.querySelector('.login-submit');if(btn){btn.disabled=true;btn.classList.add('is-loading');setTimeout(()=>btn.classList.remove('is-loading'),500)}if($('#username').value.trim()==='admin'&&$('#password').value==='112203'){sessionStorage.setItem(AUTH,'1');$('#who').textContent='Engineer Ahmed Galal';showApp()}else{if(btn)btn.disabled=false;$('#loginError').textContent='Incorrect username or password'}};
$('#logout').onclick=()=>{sessionStorage.removeItem(AUTH);showLogin()};
const titles={dashboard:'لوحة المكتب',properties:'إدارة العقارات',clients:'إدارة العملاء',reports:'البيانات و PDF'};
$$('.nav button').forEach(b=>b.onclick=()=>{$$('.section').forEach(x=>x.classList.remove('active'));$('#'+b.dataset.page).classList.add('active');$$('.nav button').forEach(x=>x.classList.toggle('active',x===b));$('#pageTitle').textContent=titles[b.dataset.page];if(b.dataset.page==='dashboard')renderDash();if(b.dataset.page==='properties')loadProps();if(b.dataset.page==='clients')loadClients()});
function loadAll(){renderDash();loadProps();loadClients()}
function renderDash(){const d=db();props=d.properties;clients=d.clients;$('#sp').textContent=props.length;$('#sa').textContent=props.filter(x=>x.status==='متاح').length;$('#sc').textContent=clients.length;$('#sf').textContent=clients.filter(x=>x.status==='متابعة').length;$('#dashProps').innerHTML=props.slice(-6).reverse().map(x=>`<tr><td>${esc(x.name)}</td><td>${esc(x.area)}</td><td>${x.size||'—'} م²</td><td>${money(x.price)}</td><td><span class="badge ${x.status!=='متاح'?'red':''}">${esc(x.status)}</span></td></tr>`).join('')||'<tr><td colspan="5">لا توجد بيانات</td></tr>';$('#dashClients').innerHTML=clients.slice(-6).reverse().map(x=>`<tr><td>${esc(x.name)}</td><td>${esc(x.phone)}</td><td>${esc(x.need||'—')}</td></tr>`).join('')||'<tr><td colspan="3">لا توجد بيانات</td></tr>'}
let timer;function scheduleProps(){clearTimeout(timer);timer=setTimeout(loadProps,120)}['q','area','minPrice','maxPrice','minSize','maxSize','rooms','status'].forEach(id=>{const e=$('#'+id);if(e)e.addEventListener(e.tagName==='SELECT'?'change':'input',scheduleProps)});
function quickArea(v){$('#area').value=v;loadProps()}function quickPrice(v){$('#maxPrice').value=v;loadProps()}function clearFilters(){['q','area','minPrice','maxPrice','minSize','maxSize','rooms','status'].forEach(id=>$('#'+id).value='');loadProps()}
function loadProps(){const d=db();let p=d.properties;const q=$('#q').value.trim().toLowerCase(),area=$('#area').value.trim().toLowerCase(),minP=Number($('#minPrice').value)||0,maxP=Number($('#maxPrice').value)||Infinity,minS=Number($('#minSize').value)||0,maxS=Number($('#maxSize').value)||Infinity,rooms=Number($('#rooms').value)||0,status=$('#status').value;p=p.filter(x=>(!q||[x.name,x.code,x.area,x.type,x.notes].join(' ').toLowerCase().includes(q))&&(!area||String(x.area).toLowerCase().includes(area))&&Number(x.price||0)>=minP&&Number(x.price||0)<=maxP&&Number(x.size||0)>=minS&&Number(x.size||0)<=maxS&&(!rooms||Number(x.rooms||0)===rooms)&&(!status||x.status===status));props=p;$('#propertyGrid').innerHTML=p.map(x=>`<article class="card property">${x.image_url?`<img src="${x.image_url}" alt="${esc(x.name)}">`:'<div class="ph">DREAM HOUSE</div>'}<div class="body"><div class="code">${esc(x.code||'PROPERTY')}</div><h4>${esc(x.name)}</h4><div class="muted">${esc(x.area)} • ${x.size||'—'} م² • الدور ${esc(x.floor||'—')}</div><div class="muted">${x.rooms||'—'} غرف • ${x.baths||'—'} حمام • ${esc(x.finish||'—')}</div><div class="price">${money(x.price)}</div><span class="badge ${x.status!=='متاح'?'red':''}">${esc(x.status)}</span><div class="actions"><button class="btn dark" onclick="editProperty(${x.id})">تعديل</button><button class="btn danger" onclick="deleteProperty(${x.id})">حذف</button></div></div></article>`).join('')||'<div class="panel empty" style="grid-column:1/-1">لا توجد عقارات مطابقة للبحث</div>'}
$('#cq').addEventListener('input',loadClients);function loadClients(){const q=$('#cq').value.trim().toLowerCase();clients=db().clients.filter(x=>[x.name,x.phone,x.area,x.need].join(' ').toLowerCase().includes(q));$('#clientBody').innerHTML=clients.map(x=>`<tr><td><b>${esc(x.name)}</b></td><td><div class="phone-cell">${esc(x.phone)}${waBtn(x.phone)}</div></td><td>${esc(x.need||'—')}</td><td>${esc(x.area||'—')}</td><td>${money(x.budget)}</td><td><span class="badge gold">${esc(x.status)}</span></td><td><button class="btn soft" onclick="matchClient(${x.id})">مطابقة</button> <button class="btn dark" onclick="editClient(${x.id})">تعديل</button> <button class="btn danger" onclick="deleteClient(${x.id})">حذف</button></td></tr>`).join('')||'<tr><td colspan="7" style="text-align:center">لا توجد بيانات</td></tr>';const cm=$('#clientCards');if(cm)cm.innerHTML=clients.map(x=>`<article class="client-mobile-card"><div class="client-mobile-top"><div><div class="client-mobile-name">${esc(x.name)}</div><div class="client-mobile-phone">${esc(x.phone||'—')}</div></div><span class="badge gold">${esc(x.status||'جديد')}</span></div><div class="client-mobile-grid"><div><span>الطلب</span><b>${esc(x.need||'—')}</b></div><div><span>المنطقة</span><b>${esc(x.area||'—')}</b></div><div><span>الميزانية</span><b>${money(x.budget)}</b></div></div><div class="client-mobile-actions">${x.phone?`<a class="wa-mobile" href="${waHref(x.phone)}" target="_blank" rel="noopener">${WA_SVG} واتساب</a>`:''}<button class="btn dark" onclick="matchClient(${x.id})">مطابقة عقار</button><button class="btn soft" onclick="editClient(${x.id})">تعديل</button><button class="btn danger" onclick="deleteClient(${x.id})">حذف</button></div></article>`).join('')||'<div class="empty">لا توجد بيانات عملاء</div>'}
function openProperty(x=null){$('#pmTitle').textContent=x?'تعديل العقار':'إضافة عقار';$('#pf').reset();$('#pf [name=id]').value=x?.id||'';if(x)Object.keys(x).forEach(k=>{const e=$(`#pf [name="${k}"]`);if(e&&k!=='image_url')e.value=x[k]??''});$('#propertyModal').classList.add('show')}
function openClient(x=null){$('#cmTitle').textContent=x?'تعديل العميل':'إضافة عميل';$('#cf').reset();$('#cf [name=id]').value=x?.id||'';if(x)Object.keys(x).forEach(k=>{const e=$(`#cf [name="${k}"]`);if(e)e.value=x[k]??''});$('#clientModal').classList.add('show')}
function closeModal(id){$('#'+id).classList.remove('show')}
function editProperty(id){const x=db().properties.find(p=>p.id===id);if(x)openProperty(x)}function editClient(id){const x=db().clients.find(p=>p.id===id);if(x)openClient(x)}
function readImage(file){
  return new Promise((resolve,reject)=>{
    if(!file||!file.size)return resolve('');
    if(file.size>12*1024*1024)return reject(new Error('الصورة كبيرة جدًا — اختار صورة أقل من 12MB'));
    const r=new FileReader();
    r.onerror=()=>reject(new Error('تعذر قراءة الصورة'));
    r.onload=()=>{
      const img=new Image();
      img.onload=()=>{
        const max=1400, scale=Math.min(1,max/Math.max(img.width,img.height));
        const c=document.createElement('canvas');
        c.width=Math.max(1,Math.round(img.width*scale));
        c.height=Math.max(1,Math.round(img.height*scale));
        const ctx=c.getContext('2d',{alpha:false});
        ctx.drawImage(img,0,0,c.width,c.height);
        const out=c.toDataURL('image/jpeg',0.78);
        resolve(out);
      };
      img.onerror=()=>reject(new Error('الصورة غير صالحة'));
      img.src=r.result;
    };
    r.readAsDataURL(file);
  });
}
$('#pf').onsubmit=async e=>{e.preventDefault();try{const f=e.target,fd=new FormData(f),d=db(),id=fd.get('id');let image='';const file=f.querySelector('[name=image]').files[0];if(file)image=await readImage(file);let x=Object.fromEntries(fd.entries());delete x.id;delete x.image;x.size=Number(x.size)||0;x.price=Number(x.price)||0;x.rooms=Number(x.rooms)||0;x.baths=Number(x.baths)||0;if(image)x.image_url=image;let item;if(id){const i=d.properties.findIndex(p=>p.id===Number(id));item={...d.properties[i],...x};d.properties[i]=item}else{item={...x,id:Date.now(),code:x.code||'DH-'+String(d.seq++).padStart(4,'0'),createdAt:new Date().toISOString()};d.properties.push(item)}if(!saveDB(d))return;closeModal('propertyModal');toast('تم حفظ العقار بنجاح');loadAll()}catch(err){toast(err.message)}};
$('#cf').onsubmit=e=>{e.preventDefault();const f=e.target,d=db(),id=f.id.value,x=Object.fromEntries(new FormData(f).entries());delete x.id;x.budget=Number(x.budget)||0;x.min_size=Number(x.min_size)||0;x.max_size=Number(x.max_size)||0;x.rooms=Number(x.rooms)||0;if(id){const i=d.clients.findIndex(p=>p.id===Number(id));d.clients[i]={...d.clients[i],...x}}else d.clients.push({...x,id:Date.now(),createdAt:new Date().toISOString()});if(!saveDB(d))return;closeModal('clientModal');toast('تم حفظ العميل بنجاح');loadAll()};
function deleteProperty(id){if(!confirm('حذف هذا العقار نهائياً؟'))return;const d=db();d.properties=d.properties.filter(x=>x.id!==id);if(!saveDB(d))return;toast('تم حذف العقار');loadAll()}
function deleteClient(id){if(!confirm('حذف هذا العميل نهائياً؟'))return;const d=db();d.clients=d.clients.filter(x=>x.id!==id);if(!saveDB(d))return;toast('تم حذف العميل');loadAll()}
function matchClient(id){const c=db().clients.find(x=>x.id===id);if(!c)return;$$('.nav button').forEach(b=>b.classList.toggle('active',b.dataset.page==='properties'));$$('.section').forEach(x=>x.classList.remove('active'));$('#properties').classList.add('active');$('#pageTitle').textContent='العقارات المطابقة';$('#area').value=c.area||'';$('#maxPrice').value=c.budget||'';$('#minSize').value=c.min_size||'';$('#maxSize').value=c.max_size||'';$('#rooms').value=c.rooms||'';loadProps();toast('تم تطبيق شروط العميل على البحث')}
function report(type){
  const d=db(), p=d.properties, c=d.clients, now=new Date();
  const stamp=now.toLocaleString('ar-EG');
  const reportNo='DH-'+now.getFullYear()+String(now.getMonth()+1).padStart(2,'0')+String(now.getDate()).padStart(2,'0')+'-'+String(Date.now()).slice(-5);
  const waLink=(phone)=>waHref(phone);
  const clientCards=c.map(x=>`<article class="client-card"><div class="card-top"><span class="mini-label">عميل</span><span class="status">${esc(x.status||'جديد')}</span></div><div class="client-name">${esc(x.name)}</div><div class="client-phone">${esc(x.phone||'—')}</div><div class="client-details"><div><span>الطلب</span><b>${esc(x.need||'—')}</b></div><div><span>المنطقة</span><b>${esc(x.area||'—')}</b></div><div><span>الميزانية</span><b>${money(x.budget)}</b></div></div>${x.phone?`<a class="wa-link" href="${waLink(x.phone)}" target="_blank" rel="noopener">${WA_SVG}<span>فتح محادثة واتساب</span></a>`:''}${x.notes?`<div class="notes">${esc(x.notes)}</div>`:''}</article>`).join('');
  const propertyCards=p.map(x=>`<article class="property-card">${x.image_url?`<img class="property-photo" src="${x.image_url}" alt="${esc(x.name)}">`:''}<div class="property-title"><span class="mini-label">${esc(x.code||'عقار')}</span><span class="status">${esc(x.status||'متاح')}</span></div><h3>${esc(x.name)}</h3><div class="property-price">${money(x.price)}</div><div class="property-details"><span><b>${x.size||'—'}</b>م²</span><span><b>${x.rooms||'—'}</b>غرف</span><span><b>${x.baths||'—'}</b>حمام</span><span>الدور <b>${esc(x.floor||'—')}</b></span></div><div class="property-area">${esc(x.area||'—')} • ${esc(x.finish||'—')}</div>${x.owner?`<div class="owner">المالك: <b>${esc(x.owner)}</b>${x.phone?` • ${esc(x.phone)}`:''}</div>`:''}${x.notes?`<div class="notes">${esc(x.notes)}</div>`:''}</article>`).join('');
  let body='';
  if(type!=='clients') body+=`<section><div class="section-title"><span>01</span><div><h2>بيان العقارات</h2><p>قائمة العقارات المسجلة في DREAM HOUSE</p></div></div><div class="property-grid-pdf">${propertyCards||'<div class="empty-pdf">لا توجد عقارات مسجلة</div>'}</div></section>`;
  if(type==='all') body+='<div class="page-break"></div>';
  if(type!=='properties') body+=`<section><div class="section-title"><span>02</span><div><h2>بيان العملاء</h2><p>بيانات العملاء وطلبات الشراء والمتابعة</p></div></div><div class="client-grid-pdf">${clientCards||'<div class="empty-pdf">لا يوجد عملاء مسجلون</div>'}</div></section>`;
  const html=`<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>DREAM HOUSE • ${reportNo}</title><style>
@page{size:A4 portrait;margin:9mm}*{box-sizing:border-box}body{font-family:Arial,Tahoma,sans-serif;color:#172238;margin:0;background:#eef3f8;font-size:12px;line-height:1.7}.report{max-width:980px;margin:auto;background:#fff;min-height:100vh;padding:0 0 22px;box-shadow:0 0 0 1px #dfe6ef,0 18px 60px rgba(40,58,92,.08)}.head{padding:24px 28px 21px;display:flex;justify-content:space-between;align-items:center;background:linear-gradient(135deg,#071321,#102342 62%,#1e3560);border-radius:0 0 22px 22px;position:relative;overflow:hidden}.head:after{content:'';position:absolute;inset:-30%;background:radial-gradient(circle at 78% 40%,rgba(110,136,255,.22),transparent 30%);pointer-events:none}.brand{font:900 30px Arial;letter-spacing:2px;color:#fff;position:relative;z-index:2}.eng{color:#aab9d2;font-size:9px;letter-spacing:.8px;margin-top:5px;position:relative;z-index:2}.phone{font-size:18px;font-weight:900;color:#e0bf78;position:relative;z-index:2}.meta{color:#6d7c91;font-size:9px;display:flex;justify-content:space-between;padding:11px 28px 13px;border-bottom:1px solid #e4eaf2}.section{padding:0 28px}.section-title{display:flex;gap:11px;align-items:center;margin:18px 0 11px}.section-title>span{width:32px;height:32px;border-radius:10px;display:grid;place-items:center;background:linear-gradient(135deg,#557cff,#7560db);color:#fff;font-weight:900}.section-title h2{font-size:21px;margin:0}.section-title p{margin:2px 0 0;color:#68778c;font-size:10px}.property-grid-pdf{display:grid;grid-template-columns:repeat(2,1fr);gap:13px}.property-card,.client-card{border:1px solid #dbe3ed;border-radius:15px;background:linear-gradient(145deg,#fff,#f8fbff);padding:16px;break-inside:avoid;box-shadow:0 7px 22px rgba(50,70,100,.055);position:relative;overflow:hidden}.property-card:before,.client-card:before{content:'';position:absolute;right:0;top:0;width:3px;height:100%;background:linear-gradient(#6f83ff,#63ded0)}.property-photo{width:100%;height:150px;object-fit:cover;border-radius:11px;margin-bottom:12px}.property-title,.card-top{display:flex;justify-content:space-between;align-items:center}.mini-label{font-size:8px;font-weight:900;letter-spacing:1px;color:#6680d6}.status{font-size:8px;font-weight:800;padding:4px 8px;border-radius:20px;background:#e9fbf1;color:#268a64}.property-card h3{font-size:19px;margin:7px 0 2px}.property-price{font-size:19px;font-weight:900;color:#263e72;margin:4px 0 9px}.property-details{display:grid;grid-template-columns:repeat(4,1fr);gap:5px}.property-details span{background:#f1f5fb;border-radius:9px;padding:8px 6px;text-align:center;font-size:9px;color:#738096}.property-details b{display:block;font-size:11px;color:#26344b}.property-area{font-size:10px;color:#64738a;margin-top:8px}.owner,.notes{font-size:9px;color:#68768b;margin-top:7px;padding-top:7px;border-top:1px dashed #dbe3ee}.client-grid-pdf{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}.client-card{min-height:140px}.client-name{font-size:20px;font-weight:900;color:#17233a;margin-top:8px}.client-phone{font-size:14px;font-weight:800;color:#4c66a7;margin-top:1px;direction:ltr;text-align:right}.client-details{display:grid;grid-template-columns:1.3fr 1fr 1fr;gap:6px;margin:10px 0}.client-details div{background:#f5f7fb;border-radius:9px;padding:7px}.client-details span{display:block;color:#7a879b;font-size:8px;margin-bottom:2px}.client-details b{font-size:10px;color:#2a3850}.wa-link{display:inline-flex;align-items:center;gap:7px;text-decoration:none;background:#e9fbf1;color:#128653;border:1px solid #cdeedd;border-radius:10px;padding:8px 11px;font-size:10px;font-weight:900}.wa-link svg{width:16px;height:16px}.empty-pdf{padding:25px;text-align:center;color:#7d8999}.page-break{page-break-before:always;height:1px}.foot{margin:24px 28px 0;border-top:1px solid #dce4ef;padding:10px 0;color:#728097;font-size:8px;display:flex;justify-content:space-between}.foot span:last-child{color:#526ab4;font-weight:800}.dlbar{position:sticky;top:0;background:rgba(255,255,255,.96);display:flex;justify-content:flex-end;align-items:center;gap:10px;padding:9px 0;margin-bottom:7px;z-index:5}.hint{font-size:10px;color:#738198}.dlbtn{background:linear-gradient(135deg,#4f7cff,#715ed8);color:#fff;border:0;border-radius:11px;padding:11px 20px;font-size:13px;font-weight:900;cursor:pointer}@media print{body{background:#fff}.report{max-width:none;box-shadow:none}.dlbar{display:none}.property-card,.client-card{box-shadow:none}}
</style></head><body><div class="dlbar"><button class="dlbtn" onclick="window.print()">حفظ كملف PDF / طباعة</button><span class="hint">اختر «حفظ كـ PDF» من نافذة الطباعة</span></div><div class="report"><div class="head"><div><div class="brand">DREAM HOUSE</div><div class="eng">المهندس أحمد جلال • نظام إدارة العقارات</div></div><div class="phone">01035032020</div></div><div class="meta"><span>رقم البيان: ${reportNo}</span><span>${stamp}</span></div>${body}<div class="foot"><span>المهندس أحمد جلال</span><span>01035032020 • DREAM HOUSE</span></div></div><script>window.addEventListener('load',()=>setTimeout(()=>window.print(),500))<\/script></body></html>`;
  const w=window.open('about:blank','_blank');
  if(!w){toast('تعذر فتح تقرير PDF. اسمح بفتح النوافذ المنبثقة ثم حاول مرة أخرى.');return}
  try{
    w.document.open();
    w.document.write(html);
    w.document.close();
  }catch(err){
    try{w.close()}catch{}
    toast('تعذر تجهيز التقرير. حاول مرة أخرى.');
  }
}

// Quality-of-life safeguards
document.addEventListener('keydown',e=>{
  if(e.key==='Escape') document.querySelectorAll('.modal.show').forEach(m=>m.classList.remove('show'));
});
document.querySelectorAll('.modal').forEach(m=>{
  m.addEventListener('click',e=>{if(e.target===m)m.classList.remove('show')});
});
window.addEventListener('storage',e=>{
  if(e.key===KEY){try{loadAll()}catch{}}
});

function backupData(){
  const blob=new Blob([JSON.stringify(db(),null,2)],{type:'application/json'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download='DREAM_HOUSE_Backup_'+new Date().toISOString().slice(0,10)+'.json';
  document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  toast('تم تنزيل النسخة الاحتياطية');
}
function restoreData(input){
  const file=input.files?.[0]; if(!file)return;
  const r=new FileReader();
  r.onload=()=>{
    try{
      const d=JSON.parse(r.result);
      if(!Array.isArray(d.properties)||!Array.isArray(d.clients))throw new Error();
      d.seq=Number(d.seq)||1;
      if(confirm('سيتم استبدال البيانات الحالية بهذه النسخة. هل تريد المتابعة؟')){
        if(!saveDB(d))return;
        loadAll();toast('تم استرجاع البيانات بنجاح');
      }
    }catch{toast('ملف النسخة الاحتياطية غير صالح')}
    input.value='';
  };
  r.onerror=()=>{toast('تعذر قراءة ملف النسخة الاحتياطية');input.value=''};
  r.readAsText(file);
}


// Ultra 3D micro-interactions: subtle, desktop-only, touch-safe.
(function(){
  const fine = window.matchMedia && window.matchMedia('(pointer:fine)').matches;
  if(!fine) return;
  const selectors = '.stat,.premium-panel,.property,.report-card,.client-mobile-card';
  function bind(root=document){
    root.querySelectorAll?.(selectors).forEach(el=>{
      if(el.dataset.tiltBound) return; el.dataset.tiltBound='1';
      el.addEventListener('pointermove', e=>{
        const r=el.getBoundingClientRect(), x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
        const rx=Math.max(-4,Math.min(4,-y*6)), ry=Math.max(-5,Math.min(5,x*7));
        el.style.transform=`perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-3px)`;
      });
      el.addEventListener('pointerleave', ()=>{el.style.transform='';});
    });
  }
  bind();
  const mo=new MutationObserver(()=>bind()); mo.observe(document.body,{childList:true,subtree:true});
})();

// DREAM HOUSE MASTER 3D micro-interactions — desktop only, never blocks touch.
(function(){
  const fine = matchMedia('(pointer:fine)').matches;
  if(!fine) return;
  const hero = document.querySelector('.hero3d');
  const cards = [...document.querySelectorAll('.stat, .property, .report-card')];
  const tilt = (el, strength=7) => {
    if(!el) return;
    el.addEventListener('pointermove', e=>{
      const r=el.getBoundingClientRect(), x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
      el.style.transform=`perspective(1200px) rotateX(${(-y*strength).toFixed(2)}deg) rotateY(${(x*strength).toFixed(2)}deg) translateZ(7px)`;
    });
    el.addEventListener('pointerleave',()=>{el.style.transform=''});
  };
  tilt(hero,2.4);
  cards.forEach(c=>tilt(c,3.2));
})();

// SIGNATURE 3D — restrained pointer depth for desktop, disabled on touch.
(function(){
  const fine=window.matchMedia&&matchMedia('(pointer:fine)').matches;
  if(!fine) return;
  const shell=document.querySelector('.login-shell');
  const visual=document.querySelector('.showcase-visual');
  if(shell){
    shell.addEventListener('pointermove',e=>{
      const r=shell.getBoundingClientRect(), x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
      shell.style.transform=`perspective(1600px) rotateX(${(-y*1.15).toFixed(2)}deg) rotateY(${(x*1.4).toFixed(2)}deg)`;
    });
    shell.addEventListener('pointerleave',()=>shell.style.transform='');
  }
  if(visual){
    visual.addEventListener('pointermove',e=>{
      const r=visual.getBoundingClientRect(), x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
      visual.style.transform=`translateX(50%) rotateX(${(-y*1.2).toFixed(2)}deg) rotateY(${(x*1.6).toFixed(2)}deg)`;
    });
    visual.addEventListener('pointerleave',()=>visual.style.transform='translateX(50%)');
  }
})();


// SIGNATURE ULTIMATE — iOS-inspired SVG navigation icons.
(function(){
 const icons={
  dashboard:'<path d="M4 11.5 12 5l8 6.5"/><path d="M6.5 10.5V19h11v-8.5"/><path d="M10 19v-5h4v5"/>',
  properties:'<rect x="4" y="5" width="16" height="14" rx="2"/><path d="M8 19v-6h8v6M8 9h.01M12 9h.01M16 9h.01"/>',
  clients:'<circle cx="12" cy="8" r="3"/><path d="M5 19c.8-3.2 3.1-5 7-5s6.2 1.8 7 5"/>',
  reports:'<path d="M6 19V9M12 19V5M18 19v-7"/><path d="M4 19h16"/>',
  logout:'<path d="M9 5H5v14h4"/><path d="M13 8l4 4-4 4M9 12h8"/>'
 };
 document.querySelectorAll('.nav button').forEach(btn=>{
   const key=btn.dataset.page;
   if(!icons[key]||btn.querySelector('.nav-icon'))return;
   const label=btn.textContent.trim();
   btn.innerHTML='<span class="nav-icon"><svg viewBox="0 0 24 24" aria-hidden="true">'+icons[key]+'</svg></span><span>'+label+'</span>';
 });
 const out=document.querySelector('#logout');
 if(out&&!out.querySelector('.logout-icon')){const label=out.textContent.trim();out.innerHTML='<span class="logout-icon"><svg viewBox="0 0 24 24" aria-hidden="true">'+icons.logout+'</svg></span><span>'+label+'</span>'}
})();

// APEX polish: keep the authentication surface English-only and icon-first.
(function(){
  const t=document.querySelector('#togglePassword');
  if(t){
    t.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="2.5"/></svg>';
    t.onclick=()=>{const p=document.querySelector('#password');const show=p.type==='password';p.type=show?'text':'password';t.classList.toggle('is-open',show)};
  }
})();
