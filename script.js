const $=id=>document.getElementById(id);
const KEY='oracasinoJackpotData', SETTINGS='oracasinoSettings';
const nowText=()=>new Date().toLocaleString('id-ID',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false});
const stamp=()=>new Date().toISOString();
const seed=[
 {id:crypto.randomUUID(),phone:'0853-4223-1719',type:'Jackpot Utama',amount:0,status:'MENUNGGU DEPOSIT',deposit:'Belum Deposit',room:'Berjalan',created:'2026-11-04T14:20:10',updated:'2026-11-04T14:20:10'},
 {id:crypto.randomUUID(),phone:'0895-3386-****',type:'Jackpot Harian',amount:50000,status:'BERHASIL',deposit:'Sudah Deposit',room:'Berjalan',created:'2026-11-04T13:43:53',updated:'2026-11-04T13:43:53'},
 {id:crypto.randomUUID(),phone:'0857-9733-****',type:'Jackpot Mingguan',amount:100000,status:'PROSES',deposit:'Belum Deposit',room:'Belum Berjalan',created:'2026-11-04T13:30:22',updated:'2026-11-04T13:30:22'},
 {id:crypto.randomUUID(),phone:'0831-4044-****',type:'Jackpot Bulanan',amount:100000,status:'BERHASIL',deposit:'Sudah Deposit',room:'Selesai',created:'2026-11-04T12:50:15',updated:'2026-11-04T12:50:15'},
 {id:crypto.randomUUID(),phone:'0813-6677-****',type:'Jackpot Utama',amount:50000,status:'DITOLAK',deposit:'Belum Deposit',room:'Belum Berjalan',created:'2026-11-04T12:30:40',updated:'2026-11-04T12:30:40'}
];
let members=JSON.parse(localStorage.getItem(KEY)||'null')||seed;
let settings=JSON.parse(localStorage.getItem(SETTINGS)||'null')||{admin:'Admin',site:'ORACASINO',notify:true};
let page=1, pageSize=5;
function save(){localStorage.setItem(KEY,JSON.stringify(members));renderAll()}
function rupiah(n){return 'Rp '+Number(n||0).toLocaleString('id-ID')}
function parseAmount(v){return Number(String(v).replace(/[^\d]/g,''))||0}
function dateFmt(v){return new Date(v).toLocaleString('id-ID',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',hour12:false})}
function statusClass(s){return s==='BERHASIL'?'s-success':s==='PROSES'?'s-process':s==='DITOLAK'?'s-reject':'s-wait'}
function toast(msg){$('toast').textContent=msg;$('toast').classList.add('show');setTimeout(()=>$('toast').classList.remove('show'),2400)}
function safe(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function actions(m){return `<button class="action-btn detail-btn" data-edit="${m.id}"><i class="fa-solid fa-eye"></i> Detail</button><button class="action-btn delete-btn" data-delete="${m.id}"><i class="fa-solid fa-trash"></i> Hapus</button>`}
function row(m,i){return `<tr><td>${i+1}</td><td>${safe(m.phone)}</td><td>${safe(m.type)}</td><td>${rupiah(m.amount)}</td><td><span class="status ${statusClass(m.status)}">${safe(m.status)}</span></td><td>${dateFmt(m.created)}</td><td>${actions(m)}</td></tr>`}
function filtered(){let q=$('searchInput')?.value.toLowerCase()||'',t=$('filterType')?.value||'',s=$('filterStatus')?.value||'';return [...members].sort((a,b)=>new Date(b.created)-new Date(a.created)).filter(m=>m.phone.toLowerCase().includes(q)&&(!t||m.type===t)&&(!s||m.status===s))}
function renderTable(){let data=filtered(),pages=Math.max(1,Math.ceil(data.length/pageSize));page=Math.min(page,pages);let shown=data.slice((page-1)*pageSize,page*pageSize);$('memberRows').innerHTML=shown.map((m,i)=>row(m,(page-1)*pageSize+i)).join('')||'<tr><td colspan="7">Tidak ada data member.</td></tr>';$('recordCount').textContent=`${data.length} member`; $('pageInfo').textContent=`${page} / ${pages}`;$('prevPage').disabled=page<=1;$('nextPage').disabled=page>=pages}
function renderWarnings(){let pending=members.filter(m=>m.deposit==='Belum Deposit'&&m.room==='Berjalan');$('warningPanel').style.display=settings.notify?'flex':'none';if(!pending.length){$('warningText').textContent='Tidak ada member yang menunggu deposit sementara room berjalan.';$('viewRoomBtn').disabled=true;return}$('viewRoomBtn').disabled=false;$('warningText').innerHTML=pending.map(m=>`Nomor <strong>${safe(m.phone)}</strong> sudah diajukan untuk menerima JP, namun <strong>BELUM MELAKUKAN DEPOSIT</strong> dan <strong>ROOM JP SUDAH BERJALAN!</strong>`).join('<br>')}
function renderAll(){renderTable();renderWarnings();$('allMemberRows').innerHTML=members.map((m,i)=>row(m,i)).join('')||'<tr><td colspan="7">Belum ada member.</td></tr>';$('historyRows').innerHTML=[...members].sort((a,b)=>new Date(b.updated)-new Date(a.updated)).map((m,i)=>`<tr><td>${i+1}</td><td>${safe(m.phone)}</td><td>${safe(m.type)}</td><td>${rupiah(m.amount)}</td><td>${safe(m.status)}</td><td>${safe(m.room)}</td><td>${dateFmt(m.updated)}</td></tr>`).join('');$('statsCards').innerHTML=[['Total Member',members.length],['Menunggu Deposit',members.filter(m=>m.deposit==='Belum Deposit').length],['Room Berjalan',members.filter(m=>m.room==='Berjalan').length],['Berhasil',members.filter(m=>m.status==='BERHASIL').length]].map(x=>`<div class="stat-card">${x[0]}<b>${x[1]}</b></div>`).join('')}
function updateClock(){let d=new Date();$('dateNow').textContent=d.toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'});$('timeNow').textContent=d.toLocaleTimeString('id-ID',{hour12:false})}
function openEdit(id){let m=members.find(x=>x.id===id);if(!m)return;$('editId').value=m.id;$('editPhone').value=m.phone;$('editType').value=m.type;$('editAmount').value=m.amount;$('editStatus').value=m.status;$('editDeposit').value=m.deposit;$('editRoom').value=m.room;$('modalTitle').textContent='Detail & Edit Member';$('modalBackdrop').classList.add('show')}
function closeModal(){$('modalBackdrop').classList.remove('show')}
function switchPage(name){document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));$('page-'+name).classList.add('active');document.querySelectorAll('.nav-link[data-page]').forEach(b=>b.classList.toggle('active',b.dataset.page===name));if(name==='dashboard')renderTable()}
$('memberForm').addEventListener('submit',e=>{e.preventDefault();let phone=$('phoneInput').value.trim();let digits=phone.replace(/\D/g,'');if(digits.length<9||digits.length>16){toast('Nomor WhatsApp harus berisi 9–16 digit.');return}if(members.some(m=>m.phone===phone)){toast('Nomor tersebut sudah terdaftar.');return}let status=$('statusInput').value;members.unshift({id:crypto.randomUUID(),phone,type:$('typeInput').value,amount:parseAmount($('amountInput').value),status,deposit:status==='BERHASIL'?'Sudah Deposit':'Belum Deposit',room:'Berjalan',created:stamp(),updated:stamp()});$('memberForm').reset();$('amountInput').value='0';page=1;save();toast('Pengajuan member berhasil disimpan.')});
$('amountInput').addEventListener('blur',e=>{e.target.value=rupiah(parseAmount(e.target.value))});
$('searchInput').addEventListener('input',()=>{page=1;renderTable()});$('filterType').addEventListener('change',()=>{page=1;renderTable()});$('filterStatus').addEventListener('change',()=>{page=1;renderTable()});$('prevPage').onclick=()=>{page=Math.max(1,page-1);renderTable()};$('nextPage').onclick=()=>{page++;renderTable()};
document.addEventListener('click',e=>{let edit=e.target.closest('[data-edit]'),del=e.target.closest('[data-delete]');if(edit)openEdit(edit.dataset.edit);if(del){let m=members.find(x=>x.id===del.dataset.delete);if(m&&confirm(`Hapus data ${m.phone}?`)){members=members.filter(x=>x.id!==m.id);save();toast('Data member dihapus.')}}});
$('editForm').addEventListener('submit',e=>{e.preventDefault();let m=members.find(x=>x.id===$('editId').value);if(!m)return;let digits=$('editPhone').value.replace(/\D/g,'');if(digits.length<9||digits.length>16){toast('Nomor WhatsApp tidak valid.');return}Object.assign(m,{phone:$('editPhone').value.trim(),type:$('editType').value,amount:parseAmount($('editAmount').value),status:$('editStatus').value,deposit:$('editDeposit').value,room:$('editRoom').value,updated:stamp()});save();closeModal();toast('Perubahan member tersimpan.')});
$('closeModal').onclick=$('cancelEdit').onclick=closeModal;$('modalBackdrop').addEventListener('click',e=>{if(e.target===$('modalBackdrop'))closeModal()});
document.querySelectorAll('.nav-link[data-page]').forEach(b=>b.addEventListener('click',()=>switchPage(b.dataset.page)));
$('goDashboard').onclick=()=>switchPage('dashboard');
$('viewRoomBtn').onclick=()=>{
  alert('Kasih goceng dulu ke @nayya');
};
$('settingsForm').addEventListener('submit',e=>{e.preventDefault();settings={admin:$('adminNameInput').value.trim()||'Admin',site:$('siteNameInput').value.trim()||'ORACASINO',notify:$('notifySetting').checked};localStorage.setItem(SETTINGS,JSON.stringify(settings));$('adminNameTop').textContent=settings.admin;document.querySelector('.brand-name').textContent=settings.site;renderWarnings();toast('Pengaturan berhasil disimpan.')});
$('adminMenu').onclick=()=>switchPage('settings');$('logoutBtn').onclick=()=>{if(confirm('Keluar dari dashboard demo?'))toast('Sesi demo ditutup. Muat ulang halaman untuk masuk kembali.')};
function init(){ $('adminNameInput').value=settings.admin;$('siteNameInput').value=settings.site;$('notifySetting').checked=settings.notify;$('adminNameTop').textContent=settings.admin;document.querySelector('.brand-name').textContent=settings.site;updateClock();setInterval(updateClock,1000);renderAll()}

function scalePortraitCanvas(){
  if(window.innerWidth<=900){
    const scale=window.innerWidth/1536;
    document.documentElement.style.setProperty('--mobile-zoom',String(scale));
  }else{
    document.documentElement.style.setProperty('--mobile-zoom','1');
  }
}
window.addEventListener('resize',scalePortraitCanvas);
scalePortraitCanvas();

init();
