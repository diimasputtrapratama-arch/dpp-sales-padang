const $=i=>document.getElementById(i);
let S,T='h';
const R=n=>'Rp '+Math.round(n).toLocaleString('id-ID'),ph=()=>S.sales||'sales';
const cov=()=>S.area.filter(a=>a.c);
const logo=()=>S.logo?`<img class="lg" src="${E(S.logo)}" alt="">`:`<div class="lg">${E(S.brand.split(/[\s-]+/).filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase())}</div>`;
const banner=()=>S.verified?'':'<div class="warn" style="margin:10px 0">Data harga dan biaya di halaman ini masih contoh dan belum dikonfirmasi. Tanyakan sales untuk angka terbaru.</div>';
function wa(t){return S.wa?'https://wa.me/'+S.wa.replace(/\D/g,'')+'?text='+encodeURIComponent(t):'#'}
function sheet(h){$('shc').innerHTML=h;$('sh').classList.add('o')}
$('sh').onclick=e=>{if(e.target.id==='sh')$('sh').classList.remove('o')};
const ev=t=>fetch('/api/event',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({t}),keepalive:true}).catch(()=>{});
function order(i){const p=S.paket[i]||S.paket[0],D={n:'',w:'',a:'',c:S.area[0]?S.area[0].n:'',ll:null,ok:false};let st=1;
 const AL='ABCDEFGHJKLMNPQRSTUVWXYZ23456789',code='DPP-'+[...crypto.getRandomValues(new Uint8Array(6))].map(x=>AL[x%32]).join('');
 const msg=()=>{let t=S.tpl.replace(/{sales}/g,ph()).replace(/{nama}/g,D.n).replace(/{paket}/g,p.n+' '+p.s).replace(/{harga}/g,p.h.toLocaleString('id-ID')).replace(/{alamat}/g,D.a).replace(/{area}/g,D.c).replace(/{wa}/g,D.w)+'\nKode pesanan: '+code;if(D.ll)t+='\nLokasi: https://maps.google.com/?q='+D.ll.join(',');return t};
 const bad=()=>st===1?(!D.n.trim()||D.w.replace(/\D/g,'').length<9?'Isi nama dan nomor WhatsApp yang benar.':''):st===2?(!D.a.trim()?'Alamat belum diisi.':''):(!D.ok?'Centang persetujuan terlebih dulu.':'');
 function geo(){if(!navigator.geolocation){$('gm').textContent='Peramban tidak mendukung lokasi. Isi alamat manual.';return}
  $('gm').textContent='Mengambil lokasi…';
  navigator.geolocation.getCurrentPosition(async pos=>{D.ll=[pos.coords.latitude.toFixed(6),pos.coords.longitude.toFixed(6)];
   try{const r=await fetch('https://nominatim.openstreetmap.org/reverse?format=jsonv2&accept-language=id&lat='+D.ll[0]+'&lon='+D.ll[1]);const j=await r.json(),ad=j.address||{};
    D.a=j.display_name||('Koordinat '+D.ll.join(', '));
    const h=[ad.suburb,ad.city_district,ad.village,ad.county].filter(Boolean).join(' ').toLowerCase(),m=S.area.find(a=>h.includes(a.n.toLowerCase()));if(m)D.c=m.n;
    $('oa').value=D.a;$('oc').value=D.c;$('gm').textContent='Alamat terisi dari lokasimu. Periksa dan sesuaikan bila perlu.'}
   catch(e){D.a='Koordinat '+D.ll.join(', ');$('oa').value=D.a;$('gm').textContent='Alamat otomatis gagal, koordinat terisi. Lengkapi manual.'}},
  err=>{$('gm').textContent=err.code===1?'Izin lokasi ditolak. Isi alamat manual.':'Lokasi tidak tersedia. Isi alamat manual.'},{enableHighAccuracy:true,timeout:12000})}
 function draw(){const L=['Data diri','Lokasi','Konfirmasi'];
  sheet(`<h3>Pesan paket ${E(p.n)}</h3><div class="stp">${L.map((x,k)=>`<span class="${k+1<=st?'on':''}">${k+1}. ${x}</span>`).join('')}</div>`+(st===1?`<label>Nama</label><input id="on" autocomplete="name" value="${E(D.n)}"><label>No. WhatsApp</label><input id="ow" inputmode="tel" autocomplete="tel" value="${E(D.w)}">`:st===2?`<label>Alamat pemasangan</label><textarea id="oa" rows="2" placeholder="Ketik manual atau pakai lokasi">${E(D.a)}</textarea><button class="btn b2 bw" id="gl" type="button">Gunakan lokasi saya</button><div class="mu" id="gm" style="margin:6px 0 10px"></div><label>Kecamatan</label><select id="oc">${S.area.map(a=>`<option ${a.n===D.c?'selected':''}>${E(a.n)}</option>`).join('')}</select>`:`<div class="cd" style="margin:8px 0"><b>${E(D.n)}</b> · ${E(D.w)}<div class="mu">${E(D.a)}, Kec. ${E(D.c)}</div><div class="mu">${E(p.n)} ${E(p.s)} · ${R(p.h)}/bulan</div><div class="mu">Kode pesanan: <b>${code}</b></div></div><label style="display:flex;gap:8px;align-items:flex-start;color:var(--tx)"><input type="checkbox" id="ok" style="width:auto;margin-top:4px" ${D.ok?'checked':''}> Saya setuju data ini disimpan untuk keperluan pendaftaran dan dihubungi lewat WhatsApp.</label>`)+`<div class="mu" id="oe" style="color:var(--ac);min-height:20px;margin-top:6px"></div><div class="row">${st>1?'<button class="btn b2" id="bk">Kembali</button>':''}${st<3?'<button class="btn" id="nx">Lanjut</button>':'<a class="btn" id="og" href="#" target="_blank" rel="noopener">Kirim ke WhatsApp</a>'}</div>`);
  if(st===1){$('on').oninput=e=>D.n=e.target.value;$('ow').oninput=e=>D.w=e.target.value}
  if(st===2){$('oa').oninput=e=>D.a=e.target.value;$('oc').onchange=e=>D.c=e.target.value;$('gl').onclick=geo}
  if(st===3)$('ok').onchange=e=>D.ok=e.target.checked;
  if($('bk'))$('bk').onclick=()=>{st--;draw()};
  if($('nx'))$('nx').onclick=()=>{const e=bad();if(e){$('oe').textContent=e;return}st++;draw()};
  if($('og'))$('og').onclick=e=>{const x=bad();if(!S.wa){e.preventDefault();$('oe').textContent='Nomor WhatsApp sales belum diatur.';return}if(x){e.preventDefault();$('oe').textContent=x;return}
   fetch('/api/lead',{method:'POST',headers:{'Content-Type':'application/json'},keepalive:true,body:JSON.stringify({code,nama:D.n,wa:D.w,alamat:D.a,area:D.c,paket:p.n+' '+p.s,lat:D.ll?D.ll[0]:'',lng:D.ll?D.ll[1]:''})}).catch(()=>{});$('og').href=wa(msg())}}
 draw()}
function ask(){sheet(`<h3>Kirim pesan ke ${E(ph())}</h3><label>Pertanyaanmu</label><textarea id="q" rows="3" placeholder="Tulis pertanyaan"></textarea>
 <a class="btn bw" id="qg" href="#" target="_blank" rel="noopener">Kirim ke WhatsApp</a>`);$('qg').onclick=()=>{ev('ask');$('qg').href=wa('Halo '+ph()+', saya mau tanya: '+$('q').value)}}
function chk(){if($('ck').value)ev('area');const a=S.area.find(x=>x.n===$('ck').value);$('cr').innerHTML=a?(a.c?`<span class="pill">Area ${E(a.n)} sudah terjangkau</span><p class="mu">Ketersediaan di titik rumahmu tetap dikonfirmasi lewat survei.</p>`:`<span class="pill n">Belum terjangkau</span><p class="mu">Kamu bisa tanya sales soal daftar tunggu.</p>`):''}
function pkc(p,i){return `<div class="cd">${p.img?`<img class="pi" src="${E(p.img)}" alt="Paket ${E(p.n)}">`:art(p,i)}<div class="row" style="align-items:center"><div><h3>${E(p.n)}</h3><div class="mu">${E(p.s)}</div></div><div class="price" style="text-align:right">${R(p.h)}<div class="mu" style="font-weight:400">/bulan</div></div></div><p class="mu" style="margin:8px 0">${E(p.d)}</p><button class="btn bw" onclick="order(${i})">Pesan paket ini</button></div>`}
const V={
h(){return `<div class="top">${logo()}<div><h1 style="font-size:18px">${E(S.brand)}</h1><div class="mu">Konsultan layanan internet fiber · Padang</div></div></div>
 <div class="cd hero"><span class="pill">Padang · Fiber</span><h1 style="margin:10px 0 8px">Internet rumah yang jelas sejak awal.</h1><p style="margin:0 0 14px">Cek area, pilih paket, hitung biaya, lalu pesan langsung lewat WhatsApp.</p><button class="btn" onclick="go('l')">Lihat paket</button></div>
 <div class="cd"><h3>Cek ketersediaan</h3><select id="ck" onchange="chk()"><option value="">Pilih kecamatan</option>${S.area.map(a=>`<option>${E(a.n)}</option>`).join('')}</select><div id="cr"></div>
 <div class="mu">${cov().length} dari ${S.area.length} kecamatan sudah terjangkau. <a href="#" onclick="go('c');return false" style="color:var(--ac)">Lihat cakupan</a></div></div>
 <div class="cd"><h3>Penasihat paket</h3><label>Jumlah perangkat</label><select id="ad" onchange="adv()"><option value="3">1–3 perangkat</option><option value="6">4–6 perangkat</option><option value="10">7–10 perangkat</option><option value="15">Lebih dari 10</option></select><label>Pemakaian utama</label><select id="au" onchange="adv()"><option value="3">Browsing dan media sosial</option><option value="8">Streaming film HD</option><option value="6">Kerja dan video call</option><option value="12">Gaming dan unduh besar</option></select><div id="ar"></div></div><h2>Paket WiFi</h2>${banner()}${S.paket.map(pkc).join('')}
 <h2>Pertanyaan umum</h2>${S.faq.map(f=>`<details><summary>${E(f[0])}</summary><p class="mu">${E(f[1])}</p></details>`).join('')}
 <button class="btn bw b2" style="margin-top:16px" onclick="ask()">Kirim pesan ke sales</button>
 <p class="mu" style="margin-top:18px">Situs ini dikelola sales mandiri, bukan situs resmi penyedia layanan. Harga, promo, dan ketersediaan mengikuti ketentuan resmi dan dikonfirmasi saat pendaftaran.</p>`},
l(){return `<h1>Layanan &amp; Produk</h1><p class="mu">Pilih kecepatan sesuai jumlah perangkat dan kebutuhan di rumah.</p>${banner()}${S.paket.map(pkc).join('')}
 <div class="cd"><h3>Lacak pesanan</h3><p class="mu" style="margin:4px 0 8px">Masukkan kode pesanan dan 4 digit terakhir nomor WA.</p><input id="tc" placeholder="DPP-XXXXXX" autocapitalize="characters"><input id="tt" placeholder="4 digit terakhir WA" inputmode="numeric" maxlength="4"><button class="btn bw" onclick="track()">Cek status</button><div id="tr" style="margin-top:10px"></div></div><div class="cd"><h3>Rincian biaya</h3><div class="mu">Biaya pasang: <b>${R(S.inst)}</b><br>PPN: <b>${S.ppn}%</b> dari tarif bulanan<br>Jatuh tempo: <b>${E(S.tempo)}</b></div></div>`},
c(){return `<h1>Cakupan Wilayah</h1><p class="mu">Area yang sudah dilayani ditandai hijau. Posisi lingkaran bersifat perkiraan.</p><div id="mp" style="height:320px;border-radius:16px;overflow:hidden;margin:12px 0;background:var(--br)"></div><button class="btn b2 bw" id="ml">Cek lokasi saya</button><div id="mr" class="mu" style="margin:8px 0 12px"></div>
 <div class="tiles">${cov().map((a,i)=>`<div class="tile" style="animation-delay:${i*60}ms">${E(a.n)}<div class="mu" style="color:var(--ok)">Terjangkau</div></div>`).join('')||'<div class="mu">Belum ada area terdaftar.</div>'}</div>
 <div class="warn" style="margin-top:14px">Lingkaran di peta hanya perkiraan area, bukan batas jaringan resmi. Sales tidak menjanjikan pemasangan di luar jangkauan dan kebijakan perusahaan penyedia layanan. Kepastian akhir lewat survei.</div>`},
s(){return `<h1>Simulasi Biaya</h1><p class="mu">Perkiraan tagihan, bukan penawaran resmi.</p>${banner()}
 <div class="cd"><label>Paket</label><select id="sp" onchange="sim()">${S.paket.map((p,i)=>`<option value="${i}">${E(p.n)} ${E(p.s)}</option>`).join('')}</select>
 <label>Terlambat bayar: <b id="slv">0 bulan</b></label><input id="sl" type="range" min="0" max="6" value="0" oninput="sim()"><div id="sr"></div></div>
 <h2>Pembayaran &amp; kewajiban</h2><div class="cd">${S.bayar.map(b=>`<p style="margin:0 0 8px">• ${E(b)}</p>`).join('')}<div class="mu">Jatuh tempo: ${E(S.tempo)} · Denda: ${R(S.denda)} per bulan terlambat</div></div>`}};
function sim(){const p=S.paket[$('sp').value],m=+$('sl').value||0,b=p.h*(1+S.ppn/100),d=S.denda*m;$('slv').textContent=m+' bulan';
 const w='Halo '+ph()+', simulasi paket '+p.n+' '+p.s+': tagihan bulanan '+R(b)+', tagihan pertama + pasang '+R(b+S.inst)+(m?', denda '+m+' bulan '+R(d):'')+'. Mohon konfirmasi resmi.';
 $('sr').innerHTML=`<div class="mu" style="margin-top:8px">Tagihan bulanan (termasuk PPN ${S.ppn}%)</div><div class="price" style="font-size:30px" id="tt2">${R(pv)}</div><div class="mu">Tagihan pertama + biaya pasang: <b>${R(b+S.inst)}</b></div>${m?`<div class="mu">Denda ${m} bulan: <b>${R(d)}</b> · Total tunggakan: <b>${R(b*m+d)}</b></div>`:''}<a class="btn bw" style="margin-top:12px" target="_blank" rel="noopener" href="${wa(w)}">Kirim hitungan ke WhatsApp</a>`;cu($('tt2'),b)}
let pv=0,cuT;function cu(el,to){cancelAnimationFrame(cuT);const f=pv,t0=performance.now();pv=to;const st=n=>{const k=Math.min(1,(n-t0)/300);el.textContent=R(f+(to-f)*(1-Math.pow(1-k,3)));if(k<1)cuT=requestAnimationFrame(st)};cuT=requestAnimationFrame(st)}
const IC={h:'<path d="M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z"/>',l:'<rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/>',c:'<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.800-7 11-7 11z"/><circle cx="12" cy="10" r="2.500"/>',s:'<rect x="5" y="3" width="14" height="18" rx="2.500"/><path d="M8 7h8M8 12h2M12 12h2M16 12h0M8 16h2M12 16h2M16 16h0"/>'};
function nav(){$('nv').innerHTML=[['h','Beranda'],['l','Layanan'],['c','Cakupan'],['s','Simulasi']].map(x=>`<button class="${T===x[0]?'on':''}" onclick="go('${x[0]}')"><svg viewBox="0 0 24 24">${IC[x[0]]}</svg><span>${x[1]}</span></button>`).join('')}
function rr(){const y=scrollY;$('app').innerHTML=`<div class="v">${V[T]()}</div>`;if(T==='s')sim();scrollTo(0,y);rv()}
function go(t){T=t;nav();$('app').innerHTML=`<div class="v">${V[t]()}</div>`;if(t==='s')sim();scrollTo(0,0);$('sh').classList.remove('o');$('nv').classList.remove('min');rv();if(t==='s')ev('sim');if(t==='h')adv();if(t==='c')mapInit()}
let io,ly=0;
function rv(){if(!('IntersectionObserver' in window))return;io&&io.disconnect();io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in2');io.unobserve(e.target)}}),{threshold:.08});
 document.querySelectorAll('#app .cd,#app h2').forEach(e=>{e.classList.add('rv');io.observe(e)})}
addEventListener('scroll',()=>{const y=scrollY;if(y>ly+6&&y>90)$('nv').classList.add('min');else if(y<ly-6||y<40)$('nv').classList.remove('min');ly=y},{passive:true});
const t0=Date.now();
fetch('/api/site').then(r=>r.json()).then(d=>{S=d;setTimeout(()=>{go('h');$('ld').style.opacity=0;setTimeout(()=>$('ld').remove(),400)},Math.max(0,700-(Date.now()-t0)))}).catch(()=>{$('ld').innerHTML='<div class="mu">Gagal memuat. Muat ulang halaman.</div>'});

const TS=['Diterima','Dihubungi','Survei','Jadwal pasang','Terpasang'];
const CENT={'Padang Barat':[-0.9525,100.351],'Padang Timur':[-0.9485,100.368],'Padang Utara':[-0.918,100.357],'Padang Selatan':[-0.983,100.370],'Nanggalo':[-0.893,100.370],'Kuranji':[-0.900,100.395],'Pauh':[-0.940,100.440],'Koto Tangah':[-0.845,100.360],'Lubuk Begalung':[-1.005,100.385],'Lubuk Kilangan':[-1.000,100.440],'Bungus Teluk Kabung':[-1.080,100.400]};
function adv(){const n=+$('ad').value*+$('au').value*.6,k=[...S.paket].map((p,i)=>[parseInt(p.s)||0,i]).sort((a,b)=>a[0]-b[0]),h=k.find(x=>x[0]>=n)||k[k.length-1],p=S.paket[h[1]];
 $('ar').innerHTML=`<div style="margin-top:10px"><span class="pill">Rekomendasi</span><h3 style="margin:6px 0 2px">${E(p.n)} · ${E(p.s)}</h3><div class="mu">Perkiraan kebutuhan sekitar ${Math.ceil(n)} Mbps saat semua perangkat aktif bersamaan.</div><button class="btn bw" style="margin-top:10px" onclick="order(${h[1]})">Pesan paket ini</button></div>`}
async function track(){const c=$('tc').value.trim().toUpperCase(),t=$('tt').value.replace(/\D/g,'');$('tr').textContent='Memeriksa…';
 try{const r=await fetch('/api/track?code='+encodeURIComponent(c)+'&tel='+t),j=await r.json();if(!r.ok)throw new Error(j.error);const x=TS.indexOf(j.status);
  $('tr').innerHTML=`<h3>${E(j.status)}</h3><div class="mu">${E(j.paket)} · ${E(j.area)}</div>${x<0?'':'<div class="tl">'+TS.map((s,k)=>`<span class="${k<=x?'on':''}">${s}</span>`).join('')+'</div>'}`}catch(e){$('tr').textContent=e.message||'Gagal memeriksa'}}
function lf(cb){if(window.L)return cb();const l=document.createElement('link');l.rel='stylesheet';l.href='https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';document.head.append(l);const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';s.onload=cb;s.onerror=()=>{if($('mp'))$('mp').innerHTML='<p class="mu" style="padding:14px">Peta gagal dimuat. Periksa koneksi.</p>'};document.head.append(s)}
function mapInit(){lf(()=>{const el=$('mp');if(!el)return;const m=L.map(el,{scrollWheelZoom:false}).setView([-0.95,100.39],11);
 L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'© OpenStreetMap'}).addTo(m);
 const cs=cov().filter(a=>CENT[a.n]);cs.forEach(a=>L.circle(CENT[a.n],{radius:2200,color:'#16704d',weight:2,fillOpacity:.25}).addTo(m).bindTooltip(a.n));
 $('ml').onclick=()=>{if(!navigator.geolocation){$('mr').textContent='Peramban tidak mendukung lokasi.';return}$('mr').textContent='Mengambil lokasi…';
  navigator.geolocation.getCurrentPosition(pos=>{const q=[pos.coords.latitude,pos.coords.longitude];L.circleMarker(q,{radius:8,color:'#b4442f',fillOpacity:1}).addTo(m);m.setView(q,13);
   const n=cs.map(a=>[L.latLng(q).distanceTo(CENT[a.n]),a.n]).sort((a,b)=>a[0]-b[0])[0];
   $('mr').textContent=n&&n[0]<3500?'Lokasimu dekat area '+n[1]+' yang terjangkau. Kepastian akhir lewat survei.':'Lokasimu belum terlihat di area terjangkau. Tanyakan sales soal kemungkinannya.'},
  e=>{$('mr').textContent=e.code===1?'Izin lokasi ditolak.':'Lokasi tidak tersedia.'},{enableHighAccuracy:true,timeout:12000})}})}
