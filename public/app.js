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
function order(i){const p=S.paket[i]||S.paket[0];
 sheet(`<h3>Pesan paket ${E(p.n)}</h3><p class="mu">Pesanan dikirim ke WhatsApp ${E(ph())} dengan format siap pakai.</p>
 <label>Nama</label><input id="on" autocomplete="name"><label>No. WhatsApp</label><input id="ow" inputmode="tel" autocomplete="tel">
 <label>Alamat pemasangan</label><textarea id="oa" rows="2" placeholder="Ketik manual atau pakai lokasi"></textarea>
 <button class="btn b2 bw" id="gl" type="button">Gunakan lokasi saya</button><div class="mu" id="gm" style="margin:6px 0 10px"></div>
 <label>Kecamatan</label><select id="oc">${S.area.map(a=>`<option>${E(a.n)}</option>`).join('')}</select>
 <div class="mu" id="oe" style="color:var(--ac);min-height:20px"></div><a class="btn bw" id="og" href="#" target="_blank" rel="noopener">Kirim ke WhatsApp</a>`);
 let ll=null;
 $('gl').onclick=()=>{if(!navigator.geolocation){$('gm').textContent='Peramban tidak mendukung lokasi. Isi alamat manual.';return}
  $('gm').textContent='Mengambil lokasi…';
  navigator.geolocation.getCurrentPosition(async pos=>{ll=[pos.coords.latitude.toFixed(6),pos.coords.longitude.toFixed(6)];
   try{const r=await fetch('https://nominatim.openstreetmap.org/reverse?format=jsonv2&accept-language=id&lat='+ll[0]+'&lon='+ll[1]);const j=await r.json(),ad=j.address||{};
    $('oa').value=j.display_name||('Koordinat '+ll.join(', '));
    const h=[ad.suburb,ad.city_district,ad.village,ad.county].filter(Boolean).join(' ').toLowerCase(),m=S.area.find(a=>h.includes(a.n.toLowerCase()));if(m)$('oc').value=m.n;
    $('gm').textContent='Alamat terisi dari lokasimu. Periksa dan sesuaikan bila perlu.'}
   catch(e){$('oa').value='Koordinat '+ll.join(', ');$('gm').textContent='Alamat otomatis gagal, koordinat terisi. Lengkapi manual.'}},
  err=>{$('gm').textContent=err.code===1?'Izin lokasi ditolak. Isi alamat manual.':'Lokasi tidak tersedia. Isi alamat manual.'},{enableHighAccuracy:true,timeout:12000})};
 $('og').onclick=e=>{const n=$('on').value.trim(),w=$('ow').value.trim(),a=$('oa').value.trim();
  if(!S.wa){e.preventDefault();$('oe').textContent='Nomor WhatsApp sales belum diatur.';return}
  if(!n||w.replace(/\D/g,'').length<9||!a){e.preventDefault();$('oe').textContent='Lengkapi nama, nomor WA, dan alamat.';return}
  fetch('/api/lead',{method:'POST',headers:{'Content-Type':'application/json'},keepalive:true,body:JSON.stringify({nama:n,wa:w,alamat:a,area:$('oc').value,paket:p.n+' '+p.s,lat:ll?ll[0]:'',lng:ll?ll[1]:''})}).catch(()=>{});
  let t=S.tpl.replace(/{sales}/g,ph()).replace(/{nama}/g,n).replace(/{paket}/g,p.n+' '+p.s).replace(/{harga}/g,p.h.toLocaleString('id-ID')).replace(/{alamat}/g,a).replace(/{area}/g,$('oc').value).replace(/{wa}/g,w);
  if(ll)t+='\nLokasi: https://maps.google.com/?q='+ll.join(',');$('og').href=wa(t)}}
function ask(){sheet(`<h3>Kirim pesan ke ${E(ph())}</h3><label>Pertanyaanmu</label><textarea id="q" rows="3" placeholder="Tulis pertanyaan"></textarea>
 <a class="btn bw" id="qg" href="#" target="_blank" rel="noopener">Kirim ke WhatsApp</a>`);$('qg').onclick=()=>{ev('ask');$('qg').href=wa('Halo '+ph()+', saya mau tanya: '+$('q').value)}}
function chk(){if($('ck').value)ev('area');const a=S.area.find(x=>x.n===$('ck').value);$('cr').innerHTML=a?(a.c?`<span class="pill">Area ${E(a.n)} sudah terjangkau</span><p class="mu">Ketersediaan di titik rumahmu tetap dikonfirmasi lewat survei.</p>`:`<span class="pill n">Belum terjangkau</span><p class="mu">Kamu bisa tanya sales soal daftar tunggu.</p>`):''}
function pkc(p,i){return `<div class="cd">${p.img?`<img class="pi" src="${E(p.img)}" alt="Paket ${E(p.n)}">`:art(p,i)}<div class="row" style="align-items:center"><div><h3>${E(p.n)}</h3><div class="mu">${E(p.s)}</div></div><div class="price" style="text-align:right">${R(p.h)}<div class="mu" style="font-weight:400">/bulan</div></div></div><p class="mu" style="margin:8px 0">${E(p.d)}</p><button class="btn bw" onclick="order(${i})">Pesan paket ini</button></div>`}
const V={
h(){return `<div class="top">${logo()}<div><h1 style="font-size:18px">${E(S.brand)}</h1><div class="mu">Konsultan layanan internet fiber · Padang</div></div></div>
 <div class="cd hero"><span class="pill">Padang · Fiber</span><h1 style="margin:10px 0 8px">Internet rumah yang jelas sejak awal.</h1><p style="margin:0 0 14px">Cek area, pilih paket, hitung biaya, lalu pesan langsung lewat WhatsApp.</p><button class="btn" onclick="go('l')">Lihat paket</button></div>
 <div class="cd"><h3>Cek ketersediaan</h3><select id="ck" onchange="chk()"><option value="">Pilih kecamatan</option>${S.area.map(a=>`<option>${E(a.n)}</option>`).join('')}</select><div id="cr"></div>
 <div class="mu">${cov().length} dari ${S.area.length} kecamatan sudah terjangkau. <a href="#" onclick="go('c');return false" style="color:var(--ac)">Lihat cakupan</a></div></div>
 <h2>Paket WiFi</h2>${banner()}${S.paket.map(pkc).join('')}
 <h2>Pertanyaan umum</h2>${S.faq.map(f=>`<details><summary>${E(f[0])}</summary><p class="mu">${E(f[1])}</p></details>`).join('')}
 <button class="btn bw b2" style="margin-top:16px" onclick="ask()">Kirim pesan ke sales</button>
 <p class="mu" style="margin-top:18px">Situs ini dikelola sales mandiri, bukan situs resmi penyedia layanan. Harga, promo, dan ketersediaan mengikuti ketentuan resmi dan dikonfirmasi saat pendaftaran.</p>`},
l(){return `<h1>Layanan &amp; Produk</h1><p class="mu">Pilih kecepatan sesuai jumlah perangkat dan kebutuhan di rumah.</p>${banner()}${S.paket.map(pkc).join('')}
 <div class="cd"><h3>Rincian biaya</h3><div class="mu">Biaya pasang: <b>${R(S.inst)}</b><br>PPN: <b>${S.ppn}%</b> dari tarif bulanan<br>Jatuh tempo: <b>${E(S.tempo)}</b></div></div>`},
c(){return `<h1>Cakupan Wilayah</h1><p class="mu">Hanya area yang sudah dilayani sales ini yang ditampilkan.</p>
 <div class="tiles">${cov().map((a,i)=>`<div class="tile" style="animation-delay:${i*60}ms">${E(a.n)}<div class="mu" style="color:var(--ok)">Terjangkau</div></div>`).join('')||'<div class="mu">Belum ada area terdaftar.</div>'}</div>
 <div class="warn" style="margin-top:14px">Ini peta skematis kecamatan, bukan peta titik jaringan. Sales tidak menjanjikan pemasangan di luar jangkauan dan kebijakan perusahaan penyedia layanan. Kepastian akhir lewat survei.</div>`},
s(){return `<h1>Simulasi Biaya</h1><p class="mu">Perkiraan tagihan, bukan penawaran resmi.</p>${banner()}
 <div class="cd"><label>Paket</label><select id="sp" onchange="sim()">${S.paket.map((p,i)=>`<option value="${i}">${E(p.n)} ${E(p.s)}</option>`).join('')}</select>
 <label>Terlambat bayar (bulan)</label><input id="sl" type="number" min="0" value="0" oninput="sim()"><div id="sr"></div></div>
 <h2>Pembayaran &amp; kewajiban</h2><div class="cd">${S.bayar.map(b=>`<p style="margin:0 0 8px">• ${E(b)}</p>`).join('')}<div class="mu">Jatuh tempo: ${E(S.tempo)} · Denda: ${R(S.denda)} per bulan terlambat</div></div>`}};
function sim(){const p=S.paket[$('sp').value],m=Math.max(0,+$('sl').value||0),b=p.h*(1+S.ppn/100),d=S.denda*m;
 $('sr').innerHTML=`<div class="mu" style="margin-top:6px">Tarif ${R(p.h)} + PPN ${S.ppn}%</div><h3>Tagihan bulanan ${R(b)}</h3><div class="mu">Tagihan pertama + biaya pasang: <b>${R(b+S.inst)}</b></div>${m?`<div class="mu">Denda ${m} bulan: <b>${R(d)}</b> · Total bila terlambat: <b>${R(b*m+d)}</b></div>`:''}`}
const IC={h:'<path d="M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z"/>',l:'<rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/>',c:'<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.800-7 11-7 11z"/><circle cx="12" cy="10" r="2.500"/>',s:'<rect x="5" y="3" width="14" height="18" rx="2.500"/><path d="M8 7h8M8 12h2M12 12h2M16 12h0M8 16h2M12 16h2M16 16h0"/>'};
function nav(){$('nv').innerHTML=[['h','Beranda'],['l','Layanan'],['c','Cakupan'],['s','Simulasi']].map(x=>`<button class="${T===x[0]?'on':''}" onclick="go('${x[0]}')"><svg viewBox="0 0 24 24">${IC[x[0]]}</svg><span>${x[1]}</span></button>`).join('')}
function rr(){const y=scrollY;$('app').innerHTML=`<div class="v">${V[T]()}</div>`;if(T==='s')sim();scrollTo(0,y);rv()}
function go(t){T=t;nav();$('app').innerHTML=`<div class="v">${V[t]()}</div>`;if(t==='s')sim();scrollTo(0,0);$('sh').classList.remove('o');$('nv').classList.remove('min');rv();if(t==='s')ev('sim')}
let io,ly=0;
function rv(){if(!('IntersectionObserver' in window))return;io&&io.disconnect();io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in2');io.unobserve(e.target)}}),{threshold:.08});
 document.querySelectorAll('#app .cd,#app h2').forEach(e=>{e.classList.add('rv');io.observe(e)})}
addEventListener('scroll',()=>{const y=scrollY;if(y>ly+6&&y>90)$('nv').classList.add('min');else if(y<ly-6||y<40)$('nv').classList.remove('min');ly=y},{passive:true});
const t0=Date.now();
fetch('/api/site').then(r=>r.json()).then(d=>{S=d;setTimeout(()=>{go('h');$('ld').style.opacity=0;setTimeout(()=>$('ld').remove(),400)},Math.max(0,700-(Date.now()-t0)))}).catch(()=>{$('ld').innerHTML='<div class="mu">Gagal memuat. Muat ulang halaman.</div>'});
