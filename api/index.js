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
const sU=u=>typeof u==='string'&&/^\/(uploads|assets)\/[\w.-]+$/.test(u)?u:'';
const str=(v,n=300)=>String(v??'').slice(0,n),num=v=>Math.max(0,Math.min(1e9,+v||0));
function clean(b){if(!b||!Array.isArray(b.paket)||!Array.isArray(b.area))throw new Error('Data tidak valid');
 return{brand:str(b.brand,80),sales:str(b.sales,60),wa:str(b.wa,20).replace(/\D/g,''),logo:sU(b.logo)||'/assets/logo.svg',verified:!!b.verified,ppn:num(b.ppn),inst:num(b.inst),denda:num(b.denda),tempo:str(b.tempo,100),tpl:str(b.tpl,800),footer:str(b.footer,300),links:Object.fromEntries(['web','app','ig','tt','x'].map(k=>[k,/^https:\/\/\S{3,190}$/.test(str(b.links&&b.links[k],200))?str(b.links[k],200):''])),galeri:(Array.isArray(b.galeri)?b.galeri:[]).slice(0,12).map(sU).filter(Boolean),
 paket:b.paket.slice(0,12).map(x=>({n:str(x.n,40),s:str(x.s,30),h:num(x.h),d:str(x.d,200),...(sU(x.img)?{img:x.img}:{})})),
 area:b.area.slice(0,60).map(x=>({n:str(x.n,60),c:x.c?1:0})),
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
  if(path.startsWith('/api/admin/')){
   if(!valid(cookie(q).sid))return J(401,{error:'Belum login'});
   if(path==='/api/admin/stats'&&m==='GET'){const h=await r('HGETALL','stats')||[],st={};for(let i=0;i<h.length;i+=2)st[h[i]]=+h[i+1];
    const cs=(await r('LRANGE','leads',0,49))||[];const L=cs.length?(await r('MGET',...cs.map(x=>'lead:'+x))).filter(Boolean).map(x=>JSON.parse(x)):[];const rc=(await r('LRANGE','reviews',0,29))||[],RV=rc.length?(await r('MGET',...rc.map(x=>'review:'+x))).filter(Boolean).map(x=>JSON.parse(x)):[];return J(200,{stats:st,leads:L,reviews:RV})}
   if(path==='/api/admin/lead'&&m==='PUT'){const k='lead:'+str(b.code,12),v=await r('GET',k);if(!v||!['Diterima','Dihubungi','Survei','Jadwal pasang','Terpasang','Batal'].includes(b.status))return J(400,{error:'Data tidak valid'});const L=JSON.parse(v);L.status=b.status;await r('SET',k,JSON.stringify(L));return J(200,{ok:1})}
   if(path==='/api/admin/review'&&m==='PUT'){const k='review:'+str(b.code,12),v=await r('GET',k);if(!v)return J(400,{error:'Data tidak valid'});const x=JSON.parse(v);x.hidden=!!b.hidden;await r('SET',k,JSON.stringify(x));return J(200,{ok:1})}
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
