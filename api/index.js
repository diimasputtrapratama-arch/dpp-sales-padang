// Vercel Function: seluruh API. Penyimpanan: Upstash Redis (REST), tanpa dependensi.
const c=require('crypto'),DEF=require('../site.default.json');
const RU=process.env.UPSTASH_REDIS_REST_URL||process.env.KV_REST_API_URL,RT=process.env.UPSTASH_REDIS_REST_TOKEN||process.env.KV_REST_API_TOKEN;
const PASS=process.env.ADMIN_PASSWORD||'',SEC=process.env.SESSION_SECRET||'';
const r=(...a)=>fetch(RU,{method:'POST',headers:{Authorization:'Bearer '+RT},body:JSON.stringify(a)}).then(x=>x.json()).then(j=>{if(j.error)throw new Error(j.error);return j.result});
const rl=async(k,max,win)=>{const n=await r('INCR',k);if(n===1)await r('EXPIRE',k,win);return n>max};
const sign=s=>c.createHmac('sha256',SEC).update(s).digest('base64url');
const mk=()=>{const e=String(Date.now()+288e5);return e+'.'+sign(e)};
const valid=t=>{if(!t||!SEC)return false;const[e,g]=t.split('.');if(!g||+e<Date.now())return false;const a=Buffer.from(sign(e)),b=Buffer.from(g);return a.length===b.length&&c.timingSafeEqual(a,b)};
const same=(a,b)=>c.timingSafeEqual(c.createHash('sha256').update(a).digest(),c.createHash('sha256').update(b).digest());
const cookie=q=>Object.fromEntries((q.headers.cookie||'').split(';').map(x=>x.trim().split('=')).filter(x=>x[0]&&x[1]));
const DEFCONF="Terima kasih! Pendaftaran kerabatmu sudah kami terima. Insentif dicairkan setelah WiFi kerabatmu berstatus aktif dan pembayaran pertama lunas.";
const nwp=x=>{x=String(x||'').replace(/\D/g,'');return x.startsWith('0')?'62'+x.slice(1):x},okWa=x=>/^(08\d{8,12}|62\d{9,13})$/.test(String(x||'').replace(/\D/g,''));
const RFD=s=>Object.assign({on:true,months:3,needInstalled:false,confirm:DEFCONF},s);
const getRf=async()=>{const v=await r('GET','site');return RFD(v?JSON.parse(v).ref:null)};
const findLead=async n=>{const cs=(await r('LRANGE','leads',0,499))||[];if(!cs.length)return null;return(await r('MGET',...cs.map(x=>'lead:'+x))).filter(Boolean).map(x=>JSON.parse(x)).find(x=>nwp(x.wa)===n&&x.status!=='Batal')||null};
const mkr=n=>{const e=String(Date.now()+6048e5);return n+'.'+e+'.'+sign('r'+n+'.'+e)};
const vr=t=>{if(!t||!SEC)return null;const[n,e,g]=t.split('.');if(!g||+e<Date.now())return null;const a=Buffer.from(sign('r'+n+'.'+e)),b=Buffer.from(g);return a.length===b.length&&c.timingSafeEqual(a,b)?n:null};
const RCK=n=>'rid='+mkr(n)+'; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=604800';
const sU=u=>typeof u==='string'&&/^\/(uploads|assets)\/[\w.-]+$/.test(u)?u:'';
const str=(v,n=300)=>String(v??'').slice(0,n),num=v=>Math.max(0,Math.min(1e9,+v||0));
function clean(b){if(!b||!Array.isArray(b.paket)||!Array.isArray(b.area))throw new Error('Data tidak valid');
 return{brand:str(b.brand,80),sales:str(b.sales,60),wa:str(b.wa,20).replace(/\D/g,''),logo:sU(b.logo)||'/assets/logo.svg',verified:!!b.verified,ppn:num(b.ppn),inst:num(b.inst),denda:num(b.denda),tempo:str(b.tempo,100),tpl:str(b.tpl,800),ref:{on:!(b.ref&&b.ref.on===false),months:Math.max(1,Math.min(24,+(b.ref&&b.ref.months)||3)),terms:((b.ref&&Array.isArray(b.ref.terms))?b.ref.terms:[]).slice(0,10).map(x=>str(x,200)).filter(Boolean),needInstalled:!!(b.ref&&b.ref.needInstalled),confirm:str(b.ref&&b.ref.confirm,400)||DEFCONF},footer:str(b.footer,300),links:Object.fromEntries(['web','app','ig','tt','x'].map(k=>[k,/^https:\/\/\S{3,190}$/.test(str(b.links&&b.links[k],200))?str(b.links[k],200):''])),galeri:(Array.isArray(b.galeri)?b.galeri:[]).slice(0,12).map(sU).filter(Boolean),
 adm:num(b.adm),footerUrl:/^https:\/\/\S{3,190}$/.test(str(b.footerUrl,200))?str(b.footerUrl,200):'',biaya:(Array.isArray(b.biaya)?b.biaya:[]).slice(0,20).map(x=>[str(x[0],60),str(x[1],60),str(x[2],200)]).filter(x=>x[0]),
 paket:b.paket.slice(0,12).map(x=>({n:str(x.n,40),s:str(x.s,30),h:num(x.h),inc:!!x.inc,ln:str(x.ln,30),d:str(x.d,200),rw:{m1:num((x.rw||{m1:20000}).m1),m2:num((x.rw||{m2:20000}).m2),m3:num((x.rw||{m3:50000}).m3)},...(sU(x.img)?{img:x.img}:{})})),
 prov:str(b.prov,60),kab:str(b.kab,60),lines:(Array.isArray(b.lines)?b.lines:[]).slice(0,10).map(x=>str(x,30)).filter(Boolean),
 area:b.area.slice(0,300).map(x=>{const la=parseFloat(x.lat),ln=parseFloat(x.lng),ok=Math.abs(la)<=90&&Math.abs(ln)<=180;return{n:str(x.n,90),c:x.c?1:0,lvl:x.lvl==='desa'?'desa':'kec',kec:str(x.kec,60),kab:str(x.kab,60),prov:str(x.prov,60),lat:ok?+la.toFixed(5):'',lng:ok?+ln.toFixed(5):'',r:Math.min(50000,num(x.r))}}),
 bayar:(Array.isArray(b.bayar)?b.bayar:[]).slice(0,12).map(x=>str(x,300)),
 faq:(Array.isArray(b.faq)?b.faq:[]).slice(0,20).map(x=>[str(x[0],200),str(x[1],500)])}}
module.exports=async(q,s)=>{
 const u=new URL(q.url,'http://x'),path=u.pathname,m=q.method,ip=(q.headers['x-forwarded-for']||'x').split(',')[0].trim();
 const J=(code,o,h={})=>{s.statusCode=code;s.setHeader('Content-Type','application/json');s.setHeader('Cache-Control','no-store');for(const k in h)s.setHeader(k,h[k]);s.end(JSON.stringify(o))};
 try{
  if(!RU||!RT)return J(503,{error:'Database belum dipasang (Upstash Redis)'});
  if(path==='/api/site'&&m==='GET'){const v=await r('GET','site');return J(200,v?JSON.parse(v):DEF)}
  if(path==='/api/img'||path.startsWith('/uploads/')||(path==='/api'&&u.searchParams.get('id'))){
   const id=(u.searchParams.get('id')||path.split('/').pop()).replace(/\.\w+$/,'');if(!/^[a-f0-9]{16}$/.test(id))return J(404,{error:'x'});
   const v=await r('GET','img:'+id);if(!v)return J(404,{error:'x'});const[ct,b]=v.split('|');
   s.statusCode=200;s.setHeader('Content-Type',ct);s.setHeader('Cache-Control','public, max-age=31536000, immutable');return s.end(Buffer.from(b,'base64'))}
  if(m!=='GET'&&!/json/.test(q.headers['content-type']||''))return J(400,{error:'Permintaan tidak valid'});
  let b=q.body||{};if(typeof b==='string')b=JSON.parse(b);
  if(path==='/api/lead'&&m==='POST'){
   if(await rl('rl:l:'+ip,20,3600))return J(429,{error:'Terlalu banyak permintaan'});
   const code=/^DPP-[A-Z0-9]{6}$/.test(b.code)?b.code:'DPP-'+c.randomBytes(3).toString('hex').toUpperCase();
   const rec={code,t:Date.now(),status:'Diterima',nama:str(b.nama,80),wa:str(b.wa,25),alamat:str(b.alamat,400),area:str(b.area,60),paket:str(b.paket,80),lat:str(b.lat,12),lng:str(b.lng,12)};
   if(await r('SET','lead:'+code,JSON.stringify(rec),'NX')!=='OK')return J(409,{error:'Kode sudah ada'});
   await r('LPUSH','leads',code);await r('LTRIM','leads',0,499);await r('HINCRBY','stats','lead',1);return J(200,{ok:1,code})}
  if(path==='/api/track'&&m==='GET'){
   const cd=str(u.searchParams.get('code'),12).toUpperCase(),tel=str(u.searchParams.get('tel'),20).replace(/\D/g,'');
   if(await rl('rl:t:'+ip,30,3600))return J(429,{error:'Terlalu banyak permintaan'});
   const v=/^DPP-[A-Z0-9]{6}$/.test(cd)&&tel.length>=4?await r('GET','lead:'+cd):null,L=v&&JSON.parse(v);
   if(!L||String(L.wa).replace(/\D/g,'').slice(-4)!==tel.slice(-4))return J(404,{error:'Pesanan tidak ditemukan atau 4 digit nomor tidak cocok'});
   return J(200,{status:L.status,paket:L.paket,area:L.area,t:L.t})}
  if(path==='/api/reviews'&&m==='GET'){const cs=(await r('LRANGE','reviews',0,49))||[];
   return J(200,cs.length?(await r('MGET',...cs.map(x=>'review:'+x))).filter(Boolean).map(x=>JSON.parse(x)).filter(x=>!x.hidden).map(x=>({n:x.n,c:'DPP-••'+String(x.code).slice(-4),a:x.a,r:x.r,t:x.t,d:x.d})):[])}
  if(path==='/api/review'&&m==='POST'){
   if(await rl('rl:r:'+ip,5,3600))return J(429,{error:'Terlalu banyak permintaan'});
   const cd=str(b.code,12).toUpperCase(),nw=x=>{x=String(x||'').replace(/\D/g,'');return x.startsWith('0')?'62'+x.slice(1):x};
   const v=/^DPP-[A-Z0-9]{6}$/.test(cd)?await r('GET','lead:'+cd):null,L=v&&JSON.parse(v);
   if(!L||nw(b.wa).length<9||nw(L.wa)!==nw(b.wa))return J(403,{error:'Kode atau nomor WhatsApp tidak cocok dengan pesanan'});
   if(L.status!=='Terpasang')return J(403,{error:'Ulasan dibuka setelah layanan terpasang'});
   const rt=Math.round(+b.rating),t=str(b.text,400).trim();if(!(rt>=1&&rt<=5)||t.length<10)return J(400,{error:'Ulasan tidak valid'});
   if(await r('SET','review:'+cd,JSON.stringify({code:cd,n:str(L.nama,80).split(' ')[0],a:L.area,r:rt,t,d:Date.now()}),'NX')!=='OK')return J(409,{error:'Pesanan ini sudah memberi ulasan'});
   await r('LPUSH','reviews',cd);await r('LTRIM','reviews',0,199);return J(200,{ok:1})}
  if(path==='/api/event'&&m==='POST'){
   if(await rl('rl:e:'+ip,300,3600))return J(429,{error:'Terlalu banyak permintaan'});
   if(['area','sim','ask'].includes(b.t))await r('HINCRBY','stats',b.t,1);return J(200,{ok:1})}
  if(path==='/api/admin/login'&&m==='POST'){
   if(!PASS||!SEC)return J(503,{error:'ADMIN_PASSWORD dan SESSION_SECRET belum diatur di Vercel'});
   if((+await r('GET','bad:'+ip)||0)>=5)return J(429,{error:'Terlalu banyak percobaan. Coba lagi nanti.'});
   if(!same(str(b.password,200),PASS)){if(await r('INCR','bad:'+ip)===1)await r('EXPIRE','bad:'+ip,900);return J(403,{error:'Password salah'})}
   return J(200,{ok:1},{'Set-Cookie':'sid='+mk()+'; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=28800'})}
  if(path==='/api/admin/logout'&&m==='POST')return J(200,{ok:1},{'Set-Cookie':'sid=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0'});
  if(path.startsWith('/api/ref/')){
   if(path==='/api/ref/logout'&&m==='POST')return J(200,{ok:1},{'Set-Cookie':'rid=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0'});
   const cf=await getRf();if(!cf.on)return J(403,{error:'Program referral sedang tidak dibuka'});
   if(path==='/api/ref/register'&&m==='POST'){
    if(await rl('rl:rg:'+ip,10,3600))return J(429,{error:'Terlalu banyak percobaan'});
    const n=nwp(b.wa),pw=String(b.password||''),cd=str(b.code,12).toUpperCase();
    if(!okWa(b.wa)||pw.length<8||pw.length>100)return J(400,{error:'Nomor WA atau kata sandi (minimal 8 karakter) tidak valid'});
    const v=/^DPP-[A-Z0-9]{6}$/.test(cd)?await r('GET','lead:'+cd):null,L=v&&JSON.parse(v);
    if(!L||nwp(L.wa)!==n||L.status==='Batal')return J(403,{error:'Kode pesanan tidak cocok dengan nomor WhatsApp'});
    if(cf.needInstalled&&L.status!=='Terpasang')return J(403,{error:'Program dibuka untuk pelanggan yang sudah terpasang'});
    const salt=c.randomBytes(16).toString('hex');
    if(await r('SET','refuser:'+n,JSON.stringify({salt,h:c.scryptSync(pw,salt,32).toString('hex'),name:L.nama,t:Date.now()}),'NX')!=='OK')return J(409,{error:'Nomor ini sudah punya akun. Silakan masuk.'});
    return J(200,{ok:1},{'Set-Cookie':RCK(n)})}
   if(path==='/api/ref/login'&&m==='POST'){
    const n=nwp(b.wa);if((+await r('GET','bad:r:'+n)||0)>=5||await rl('rl:lg:'+ip,30,3600))return J(429,{error:'Terlalu banyak percobaan. Coba lagi nanti.'});
    const v=await r('GET','refuser:'+n),U=v&&JSON.parse(v),hx=U&&c.scryptSync(String(b.password||''),U.salt,32).toString('hex');
    if(!U||!c.timingSafeEqual(Buffer.from(hx),Buffer.from(U.h))){if(await r('INCR','bad:r:'+n)===1)await r('EXPIRE','bad:r:'+n,900);return J(403,{error:'Nomor atau kata sandi salah'})}
    return J(200,{ok:1},{'Set-Cookie':RCK(n)})}
   const n=vr(cookie(q).rid);if(!n)return J(401,{error:'Belum masuk'});
   if(path==='/api/ref/me'&&m==='GET'){const U=JSON.parse((await r('GET','refuser:'+n))||'{}'),ids=(await r('LRANGE','refsby:'+n,0,99))||[];
    return J(200,{name:U.name,list:ids.length?(await r('MGET',...ids.map(i=>'ref:'+i))).filter(Boolean).map(x=>JSON.parse(x)).map(x=>({id:x.id,referee_name:x.referee_name,referee_phone:x.referee_phone,paket:x.paket,status:x.status,first_paid:x.first_paid,months_ok:x.months_ok,ms:x.ms||[],reward_amount:x.reward_amount,ew:'••••'+String(x.referrer_ewallet||'').slice(-4),created_at:x.created_at,updated_at:x.updated_at})):[]})}
   if(path==='/api/ref/create'&&m==='POST'){
    if(await rl('rl:rc:'+n,10,3600))return J(429,{error:'Terlalu banyak pendaftaran. Coba lagi nanti.'});
    const rn=str(b.referee_name,80).trim(),ad=str(b.installation_address,400).trim(),ew=str(b.referrer_ewallet,100).trim();
    if(!rn||ad.length<10||ew.length<4)return J(400,{error:'Lengkapi nama, alamat (minimal 10 karakter), dan e-wallet/rekening'});
    if(!okWa(b.referee_phone))return J(400,{error:'Nomor WhatsApp harus diawali 08 atau 62'});
    const p=nwp(b.referee_phone);if(p===n)return J(400,{error:'Tidak bisa mendaftarkan nomor sendiri'});
    if(await findLead(p))return J(409,{error:'Nomor ini sudah terdaftar sebagai pemesan'});
    const site=JSON.parse((await r('GET','site'))||'null')||DEF,pk=(site.paket||[]).find(x=>x.n===str(b.paket,40));if(!pk)return J(400,{error:'Pilih paket layanan'});
    const w=Object.assign({m1:20000,m2:20000,m3:50000},pk.rw),ms=[['m1','Terdaftar dan terpasang'],['m2','Pembayaran pertama sukses'],['m3','Berlangganan '+cf.months+' bulan sukses']].map(x=>({k:x[0],label:x[1],amt:num(w[x[0]]),paid:false,at:0}));
    const id=await r('INCR','refid'),now=Date.now(),U=JSON.parse((await r('GET','refuser:'+n))||'{}');
    if(await r('SET','refphone:'+p,String(id),'NX')!=='OK')return J(409,{error:'Nomor calon pelanggan ini sudah didaftarkan'});
    await r('SET','ref:'+id,JSON.stringify({id,referrer_name:U.name||'',referrer_phone:n,referrer_ewallet:ew,referee_name:rn,referee_phone:p,installation_address:ad,lat:str(b.lat,12),lng:str(b.lng,12),paket:pk.n,ms,status:'PENDING_ODP',first_paid:false,months_ok:false,reward_amount:ms.reduce((s,m)=>s+m.amt,0),note:'',created_at:now,updated_at:now}));
    await r('LPUSH','refs',id);await r('LTRIM','refs',0,999);await r('LPUSH','refsby:'+n,id);return J(200,{ok:1,id,message:cf.confirm})}
   return J(404,{error:'Tidak ditemukan'})}
  if(path.startsWith('/api/admin/')){
   if(!valid(cookie(q).sid))return J(401,{error:'Belum login'});
   if(path==='/api/admin/stats'&&m==='GET'){const h=await r('HGETALL','stats')||[],st={};for(let i=0;i<h.length;i+=2)st[h[i]]=+h[i+1];
    const cs=(await r('LRANGE','leads',0,49))||[];const L=cs.length?(await r('MGET',...cs.map(x=>'lead:'+x))).filter(Boolean).map(x=>JSON.parse(x)):[];const rc=(await r('LRANGE','reviews',0,29))||[],RV=rc.length?(await r('MGET',...rc.map(x=>'review:'+x))).filter(Boolean).map(x=>JSON.parse(x)):[];return J(200,{stats:st,leads:L,reviews:RV})}
   if(path==='/api/admin/lead'&&m==='PUT'){const k='lead:'+str(b.code,12),v=await r('GET',k);if(!v||!['Diterima','Dihubungi','Survei','Jadwal pasang','Terpasang','Batal'].includes(b.status))return J(400,{error:'Data tidak valid'});const L=JSON.parse(v);L.status=b.status;await r('SET',k,JSON.stringify(L));return J(200,{ok:1})}
   if(path==='/api/admin/review'&&m==='PUT'){const k='review:'+str(b.code,12),v=await r('GET',k);if(!v)return J(400,{error:'Data tidak valid'});const x=JSON.parse(v);x.hidden=!!b.hidden;await r('SET',k,JSON.stringify(x));return J(200,{ok:1})}
   if(path==='/api/admin/refs'&&m==='GET'){const ids=(await r('LRANGE','refs',0,199))||[];return J(200,{refs:ids.length?(await r('MGET',...ids.map(i=>'ref:'+i))).filter(Boolean).map(x=>JSON.parse(x)):[]})}
   if(path==='/api/admin/ref'&&m==='PUT'){const k='ref:'+(+b.id||0),v=await r('GET',k);if(!v)return J(400,{error:'Data tidak valid'});const x=JSON.parse(v);
    if(b.months_ok!=null)x.months_ok=!!b.months_ok;if(b.note!=null)x.note=str(b.note,300);if(b.first_paid!=null)x.first_paid=!!b.first_paid;
    if(b.paid&&x.ms){const st=b.status||x.status,ins=['INSTALLED_ACTIVE','PAID_REWARD'].includes(st),el={m1:ins,m2:ins&&x.first_paid,m3:ins&&x.months_ok};
     for(const m of x.ms){if(b.paid[m.k]==null)continue;const v=!!b.paid[m.k];if(v&&!m.paid){if(!el[m.k])return J(400,{error:'Syarat "'+m.label+'" belum terpenuhi'});m.paid=true;m.at=Date.now()}else if(!v){m.paid=false;m.at=0}}}
    if(b.status&&b.status!==x.status){const T={PENDING_ODP:['SURVEY','INSTALLED_ACTIVE','REJECTED'],SURVEY:['PENDING_ODP','INSTALLED_ACTIVE','REJECTED'],INSTALLED_ACTIVE:['SURVEY','PAID_REWARD','REJECTED'],PAID_REWARD:[],REJECTED:['PENDING_ODP']};
     if(!(T[x.status]||[]).includes(b.status))return J(400,{error:'Perubahan status dari '+x.status+' ke '+b.status+' tidak diizinkan'});
     if(b.status==='PAID_REWARD'&&!(x.ms||[]).every(m=>m.paid))return J(400,{error:'Semua reward harus berstatus ditransfer dulu'});x.status=b.status}
    x.updated_at=Date.now();await r('SET',k,JSON.stringify(x));return J(200,{ok:1,ref:x})}
   if(path==='/api/admin/site'&&m==='PUT'){await r('SET','site',JSON.stringify(clean(b)));return J(200,{ok:1})}
   if(path==='/api/admin/upload'&&m==='POST'){
    const x=/^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/=]+)$/.exec(b.data||'');if(!x)return J(400,{error:'Format harus PNG, JPG, atau WebP'});
    if(Buffer.from(x[2],'base64').length>6e5)return J(413,{error:'Gambar terlalu besar (maks 600 KB)'});
    const id=c.randomBytes(8).toString('hex');await r('SET','img:'+id,'image/'+x[1]+'|'+x[2]);
    return J(200,{url:'/uploads/'+id+'.'+({png:'png',jpeg:'jpg',webp:'webp'})[x[1]]})}
  }
  return J(404,{error:'Tidak ditemukan'})
 }catch(e){J(500,{error:'Kesalahan server'})}
};
