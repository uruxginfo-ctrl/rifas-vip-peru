const SUPABASE_URL="https://gcqzloiwwbdaawblfahb.supabase.co";
const SUPABASE_KEY="sb_publishable_33-zrsDiD1kCqaTn_6SGIA_Qf-2WHEM";
const db=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
const RAFFLE_ID="2a41d581-7488-4df6-8489-f06ca3f915b0";
let selected=new Set(), currentOrder=null, currentBuyer=null, rafflePrice=10, currentPaymentMethod='yape';

function show(id){
  document.querySelectorAll('.view').forEach(x=>x.classList.remove('active'));
  const target=document.getElementById(id); if(!target)return;
  target.classList.add('active'); window.scrollTo({top:0,behavior:'smooth'});
  if(id==='numbers')loadNumbers();
  if(id==='data')syncCheckout();
  if(id==='admin')loadAdmin();
  if(id==='adminLogin')checkExistingSession();
}
function money(n){return 'S/ '+Number(n||0).toFixed(2)}
function msg(id,text,type=''){const el=document.getElementById(id);if(el){el.textContent=text;el.className='page-msg '+type}}
function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function formatNum(n){return String(n).padStart(4,'0')}

let totalTickets = 2000;
let visibleNumbers = 100;
let soldNumbers = new Set();

async function loadNumbers(){
const grid = document.getElementById('grid');

if(!grid) return;

grid.innerHTML =
'<p class="loading">Cargando números...</p>';

msg('numbersMsg','');

const {data:raffle,error:raffleError} = await db
.from('raffles')
.select('ticket_price,total_tickets')
.eq('id',RAFFLE_ID)
.single();

if(raffleError){
grid.innerHTML = '';

msg(
'numbersMsg',
'No se pudo conectar con la rifa.',
'error'
);

return;
}

rafflePrice = Number(
raffle.ticket_price || 10
);

totalTickets = Number(
raffle.total_tickets || 2000
);

const {data,error} = await db
.from('tickets')
.select('number,status')
.eq('raffle_id',RAFFLE_ID)
.order('number',{ascending:true});

if(error){
grid.innerHTML = '';

msg(
'numbersMsg',
'No se pudieron cargar los números.',
'error'
);

return;
}

soldNumbers = new Set(
(data || [])
.filter(t =>
t.status === 'sold' ||
t.status === 'reserved' ||
t.status === 'winner'
)
.map(t => Number(t.number))
);

visibleNumbers = Math.min(
100,
totalTickets
);

renderNumbers();

const priceLabel =
document.getElementById(
'rafflePriceLabel'
);

if(priceLabel){
priceLabel.textContent =
money(rafflePrice);
}

renderSelection();
}


function renderNumbers(){

const grid =
document.getElementById('grid');

if(!grid) return;

grid.innerHTML = '';

const limit =
Math.min(
visibleNumbers,
totalTickets
);

for(
let i = 1;
i <= limit;
i++
){

const b =
document.createElement('button');

b.textContent =
formatNum(i);

b.className =
'num';

if(soldNumbers.has(i)){

b.classList.add('sold');

b.disabled = true;

b.title =
'Número no disponible';

}else{

b.onclick = function(){

toggleNumber(i);

};

}

grid.appendChild(b);
}

const loadMoreBtn =
document.getElementById(
'loadMoreBtn'
);

if(loadMoreBtn){

if(
visibleNumbers <
totalTickets
){

loadMoreBtn.style.display =
'block';

loadMoreBtn.textContent =
`Ver más números (${Math.min(
100,
totalTickets -
visibleNumbers
)})`;

}else{

loadMoreBtn.style.display =
'none';

}

}

}


function loadMoreNumbers(){

if(
visibleNumbers >=
totalTickets
){
return;
}

visibleNumbers =
Math.min(
visibleNumbers + 100,
totalTickets
);

renderNumbers();

renderSelection();

}

function toggleNumber(n){
  if(selected.has(n))selected.delete(n); else if(selected.size<20)selected.add(n); else {msg('numbersMsg','Puedes elegir un máximo de 20 números.','error');return}
  msg('numbersMsg',''); renderSelection();
}
function renderSelection(){
  const nums=[...selected].sort((a,b)=>a-b); document.getElementById('chosen').textContent=nums.map(formatNum).join(', ')||'—'; document.getElementById('total').textContent='Total '+money(nums.length*rafflePrice); document.getElementById('continueBtn').disabled=!nums.length;
  document.querySelectorAll('.num').forEach(b=>{const n=Number(b.textContent);const s=selected.has(n);b.classList.toggle('selected',s);b.style.backgroundColor=s?'#c000ff':'';b.style.borderColor=s?'#ff2bd6':'';b.style.color=s?'#fff':'';b.style.boxShadow=s?'0 0 12px #c000ff':''});
}
function syncCheckout(){
  const nums=[...selected].sort((a,b)=>a-b); document.getElementById('checkoutNumbers').textContent=nums.map(formatNum).join(', ')||'—'; document.getElementById('checkoutTotal').textContent=money(nums.length*rafflePrice);
}
async function createOrder(){
  if(!selected.size){msg('orderMsg','Selecciona al menos un número.','error');return}
  const name=document.getElementById('name').value.trim(),phone=document.getElementById('phone').value.trim(),email=document.getElementById('email').value.trim();
  const paymentEl=document.querySelector('input[name="paymentMethod"]:checked'); currentPaymentMethod=paymentEl?paymentEl.value:'yape';
  if(name.length<2||phone.length<6){msg('orderMsg','Completa nombre y WhatsApp.','error');return}
  msg('orderMsg','Creando reserva…');
  const {data,error}=await db.rpc('create_raffle_order',{p_raffle_id:RAFFLE_ID,p_numbers:[...selected],p_name:name,p_email:email||null,p_phone:phone});
  if(error){msg('orderMsg',error.message||'No se pudo crear el pedido.','error');await loadNumbers();return}
  currentOrder=data; currentBuyer={name,phone,email}; document.getElementById('orderId').textContent=data.order_id; document.getElementById('paymentAmount').textContent=money(data.amount); document.getElementById('selectedPaymentMethod').textContent=currentPaymentMethod==='plin'?'Plin':'Yape'; document.getElementById('paymentInstructions').textContent='Realiza el pago por '+(currentPaymentMethod==='plin'?'Plin':'Yape')+' y conserva tu comprobante. El administrador confirmará el pedido después de verificar el pago.'; msg('orderMsg',''); show('payment');
}
function copyPaymentNumber(){
  const number='+51969888423';
  navigator.clipboard?.writeText(number).then(()=>{
    const b=document.querySelector('.copy-payment');
    if(b){const old=b.textContent;b.textContent='¡Copiado!';setTimeout(()=>b.textContent=old,1400)}
  }).catch(()=>{});
}

async function checkCurrentOrder(){
  if(!currentOrder||!currentBuyer){msg('paymentMsg','No hay un pedido activo.','error');return}
  msg('paymentMsg','Comprobando…');
  const {data,error}=await db.rpc('get_raffle_order_status',{p_order_id:currentOrder.order_id,p_phone:currentBuyer.phone});
  if(error){msg('paymentMsg','No se pudo consultar el pedido.','error');return}
  if(data.status==='paid'){await makeTicketFromStatus(data);return}
  if(data.status==='pending'){msg('paymentMsg','El pago todavía no ha sido confirmado.','');return}
  msg('paymentMsg','Este pedido ya no está pendiente.','error');
}
async function makeTicketFromStatus(statusData){
  const nums=(statusData.tickets||[]).map(t=>t.number).sort((a,b)=>a-b); if(!nums.length){msg('paymentMsg','El pago figura confirmado, pero aún no hay tickets disponibles.','error');return}
  document.getElementById('ticketNumbers').textContent=nums.map(formatNum).join(' • ');
  document.getElementById('ticketData').innerHTML='<b>Nombre</b><span>'+esc(statusData.buyer_name)+'</span><b>WhatsApp</b><span>'+esc(statusData.buyer_phone)+'</span><b>Email</b><span>'+esc(statusData.buyer_email||'—')+'</span><b>Total</b><span>'+money(statusData.amount)+'</span>';
  document.getElementById('ticketCode').textContent='RVP-'+String(statusData.order_id).slice(0,8).toUpperCase();
  const q=document.getElementById('qrcode');q.innerHTML='';new QRCode(q,{text:location.href.split('#')[0]+'?ticket='+encodeURIComponent(statusData.order_id),width:150,height:150}); show('ticket');
}

async function checkExistingSession(){const {data}=await db.auth.getSession(); if(data.session)show('admin')}
async function adminLogin(){
  const email=document.getElementById('adminEmail').value.trim(),password=document.getElementById('adminPassword').value;
  if(!email||!password){msg('loginMsg','Introduce email y contraseña.','error');return}
  msg('loginMsg','Entrando…');
  const {data,error}=await db.auth.signInWithPassword({email,password});
  if(error){msg('loginMsg',error.message||'No se pudo iniciar sesión.','error');return}
  const {data:isAdmin,error:adminError}=await db.rpc('is_raffle_admin');
  if(adminError||!isAdmin){await db.auth.signOut();msg('loginMsg','Esta cuenta no está autorizada como administrador.','error');return}
  msg('loginMsg','');show('admin');
}
async function adminLogout(){await db.auth.signOut();show('home')}
async function loadAdmin(){
  const {data:session}=await db.auth.getSession(); if(!session.session){show('adminLogin');return}
  msg('adminMsg','Cargando panel…');
  const {data,error}=await db.rpc('get_raffle_admin_data',{p_raffle_id:RAFFLE_ID});
  if(error){msg('adminMsg',error.message||'No autorizado.','error');return}
  const raffle=data.raffle,tickets=data.tickets||[],orders=data.orders||[]; const sold=tickets.filter(x=>x.status==='sold'||x.status==='winner').length; const reserved=tickets.filter(x=>x.status==='reserved').length;
  document.getElementById('stats').innerHTML='<div class="stat"><small>Total</small><b>'+raffle.total_tickets+'</b></div><div class="stat"><small>Vendidos</small><b>'+sold+'</b></div><div class="stat"><small>Reservados</small><b>'+reserved+'</b></div><div class="stat"><small>Ingresos</small><b>'+money(sold*Number(raffle.ticket_price))+'</b></div>';
  document.getElementById('soldList').innerHTML=tickets.map(t=>'<p><b>'+formatNum(t.number)+'</b> '+esc(t.buyer_name||'Reserva')+' <small>'+esc(t.status)+'</small>'+(t.status==='reserved'&&t.payment_reference?'<button class="mini" onclick="confirmPayment(\''+esc(t.payment_reference)+'\')">Confirmar pago</button>':'')+'</p>').join('')||'<p>No hay reservas ni ventas.</p>';
  document.getElementById('ordersList').innerHTML=orders.map(o=>'<p><b>'+esc(o.payment_status)+'</b> '+esc(o.buyer_name)+' <span class="order-amount">'+money(o.amount)+'</span><br><small>'+esc(o.id)+'</small>'+(o.payment_status==='pending'?'<button class="mini" onclick="confirmPayment(\''+esc(o.id)+'\')">Confirmar pago</button>':'')+'</p>').join('')||'<p>No hay pedidos.</p>';
  document.getElementById('winner').innerHTML=raffle.winner_ticket_id?'<b>Sorteo realizado</b>':'—';msg('adminMsg','');
}
async function confirmPayment(orderId){
  if(!confirm('¿Confirmar que este pedido ha sido pagado?'))return;
  const {error}=await db.rpc('confirm_raffle_order',{p_order_id:orderId,p_payment_reference:'MANUAL-'+new Date().toISOString()});
  if(error){msg('adminMsg',error.message||'No se pudo confirmar.','error');return}
  msg('adminMsg','Pago confirmado correctamente.','success');await loadAdmin();
}
async function draw(){
  if(!confirm('El sorteo es irreversible. ¿Quieres realizarlo ahora?'))return;
  const {data,error}=await db.rpc('draw_raffle',{p_raffle_id:RAFFLE_ID});
  if(error){msg('adminMsg',error.message||'No se pudo realizar el sorteo.','error');return}
  document.getElementById('winner').innerHTML=formatNum(data.number)+'<small>'+esc(data.buyer_name)+'</small>';msg('adminMsg','Sorteo realizado correctamente.','success');
}
function shareWhatsApp(){const text='Mi ticket de RIFAS VIP PERÚ: '+document.getElementById('ticketNumbers').textContent+' — '+document.getElementById('ticketCode').textContent;window.open('https://wa.me/?text='+encodeURIComponent(text),'_blank')}

db.auth.onAuthStateChange((event,session)=>{if(event==='SIGNED_OUT'&&document.getElementById('admin').classList.contains('active'))show('home')});
loadNumbers();
