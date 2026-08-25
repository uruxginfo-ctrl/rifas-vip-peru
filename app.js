const ACCESS_CODE="VIP2026";
const KEY_TICKETS="rvip_tickets_v4";
const KEY_CONFIG="rvip_config_v4";
const state={tickets:[],selected:new Set(),visible:100,sold:new Set(),config:{count:1500,price:10},wheelRotation:0};

const $=id=>document.getElementById(id);
const money=n=>"S/ "+Number(n||0).toFixed(2);
const pad=n=>String(n).padStart(4,"0");
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));

function load(){
  try{state.tickets=JSON.parse(localStorage.getItem(KEY_TICKETS)||"[]")}catch{state.tickets=[]}
  try{state.config={...state.config,...JSON.parse(localStorage.getItem(KEY_CONFIG)||"{}")}}catch{}
  $("numberCount").value=String(state.config.count);
  $("price").value=state.config.price;
  $("raffleName").value="RIFAS VIP PERÚ";
  renderNumbers();
  renderTickets();
}
function save(){localStorage.setItem(KEY_TICKETS,JSON.stringify(state.tickets));localStorage.setItem(KEY_CONFIG,JSON.stringify(state.config))}
function allSold(){const s=new Set();state.tickets.forEach(t=>(t.numbers||[]).forEach(n=>s.add(Number(n))));return s}
function showView(id){
  document.querySelectorAll(".view").forEach(v=>v.classList.toggle("active",v.id===id));
  document.querySelectorAll(".nav-btn").forEach(b=>b.classList.toggle("active",b.dataset.view===id));
  if(id==="tickets")renderTickets();
  if(id==="generator")renderNumbers();
}
document.querySelectorAll(".nav-btn").forEach(b=>b.addEventListener("click",()=>showView(b.dataset.view)));

function renderNumbers(){
  const total=Number($("numberCount").value||1500);state.config.count=total;state.sold=allSold();
  const grid=$("numberGrid");const end=Math.min(state.visible,total);grid.innerHTML="";
  for(let i=1;i<=end;i++){
    const b=document.createElement("button");b.className="num"+(state.selected.has(i)?" selected":"")+(state.sold.has(i)?" sold":"");b.textContent=pad(i);b.disabled=state.sold.has(i);
    b.onclick=()=>toggleNum(i);grid.appendChild(b);
  }
  $("moreNumbers").style.display=end<total?"block":"none";
  updateSelected();
}
function toggleNum(n){if(state.selected.has(n))state.selected.delete(n);else state.selected.add(n);renderNumbers()}
$("moreNumbers").onclick=()=>{state.visible=Math.min(state.visible+100,Number($("numberCount").value));renderNumbers()};
$("numberCount").onchange=()=>{state.config.count=Number($("numberCount").value);state.visible=100;state.selected.clear();save();renderNumbers()};
$("price").oninput=()=>{state.config.price=Number($("price").value||0);updateSelected()};

function updateSelected(){
  const arr=[...state.selected].sort((a,b)=>a-b);$("selectedCount").textContent=`(${arr.length})`;
  $("selectedList").innerHTML=arr.length?arr.map(n=>`<span class="chip">${pad(n)} <button data-remove="${n}">×</button></span>`).join(""):"<span class='muted'>No has seleccionado números.</span>";
  document.querySelectorAll("[data-remove]").forEach(x=>x.onclick=()=>{state.selected.delete(Number(x.dataset.remove));renderNumbers()});
  $("total").textContent=money(arr.length*Number($("price").value||0));
}
$("clearSelection").onclick=()=>{state.selected.clear();renderNumbers()};

function resetForm(){["name","dni","phone","email","prize"].forEach(id=>$(id).value="");$("drawDate").value="";state.selected.clear();state.visible=100;renderNumbers()}
$("generateBtn").onclick=()=>{
  const name=$("name").value.trim(),dni=$("dni").value.trim(),nums=[...state.selected].sort((a,b)=>a-b);
  if(!name||!dni){alert("Completa nombre y DNI.");return}
  if(!/^\d{8}$/.test(dni)){alert("El DNI debe tener 8 dígitos.");return}
  if(!nums.length){alert("Selecciona al menos un número.");return}
  const ticket={id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),code:"VIP-"+String(state.tickets.length+1).padStart(6,"0"),name,dni,phone:$("phone").value.trim(),email:$("email").value.trim(),raffle:$("raffleName").value.trim()||"RIFAS VIP PERÚ",prize:$("prize").value.trim(),date:$("drawDate").value,price:Number($("price").value||0),numbers:nums,created:new Date().toISOString()};
  state.tickets.unshift(ticket);save();renderNumbers();renderTicketPreview(ticket);resetForm();renderTickets();
  window.scrollTo({top:document.body.scrollHeight,behavior:"smooth"});
};

function renderTicketPreview(t){
  $("ticketResult").innerHTML=`<div class="ticket-preview"><div class="ticket-layout"><div><div class="ticket-logo">RIFAS <b>VIP</b> <small>PERÚ</small></div><div class="ticket-prize">${esc(t.prize||"PREMIO VIP")}</div><p class="muted">TU SUERTE, TU PREMIO, TU MOMENTO</p></div><div class="ticket-info"><div><small>Números</small><strong>${t.numbers.map(pad).join(", ")}</strong></div><div><small>Participante</small><strong>${esc(t.name)}</strong></div><div><small>DNI</small><strong>${esc(t.dni)}</strong></div><div><small>WhatsApp</small><strong>${esc(t.phone||"—")}</strong></div><div><small>Fecha del sorteo</small><strong>${esc(t.date||"—")}</strong></div></div><div><div id="qr-${t.id}" class="qr-box"></div><div class="ticket-code">${esc(t.code)}</div></div></div></div>`;
  const target=$(`qr-${t.id}`);if(window.QRCode) new QRCode(target,{text:JSON.stringify({code:t.code,numbers:t.numbers,raffle:t.raffle}),width:160,height:160,colorDark:"#111",colorLight:"#fff",correctLevel:QRCode.CorrectLevel.M});
}
function renderTickets(){
  const q=($("ticketSearch")?.value||"").toLowerCase().trim(), list=$("ticketsList");if(!list)return;
  const filtered=state.tickets.filter(t=>[t.code,t.name,t.dni,t.phone,...(t.numbers||[]).map(pad),...(t.numbers||[])].join(" ").toLowerCase().includes(q));
  list.innerHTML=filtered.length?filtered.map(t=>`<div class="ticket-row"><div><strong>${esc(t.code)}</strong><small>${esc(t.name)} · DNI ${esc(t.dni)}<br>Números: ${t.numbers.map(pad).join(", ")}</small></div><div><strong>${money(t.numbers.length*t.price)}</strong><div class="row-actions"><button class="btn ghost" data-view-ticket="${t.id}">Ver</button><button class="btn danger" data-delete-ticket="${t.id}">Eliminar</button></div></div></div>`).join(""):"<p class='muted'>No hay tickets guardados.</p>";
  document.querySelectorAll("[data-delete-ticket]").forEach(b=>b.onclick=()=>{if(confirm("¿Eliminar este ticket?")){state.tickets=state.tickets.filter(t=>t.id!==b.dataset.deleteTicket);save();renderTickets();renderNumbers()}});
  document.querySelectorAll("[data-view-ticket]").forEach(b=>b.onclick=()=>{const t=state.tickets.find(x=>x.id===b.dataset.viewTicket);if(t){showView("generator");renderTicketPreview(t)}});
}
$("ticketSearch").oninput=renderTickets;

$("verifyBtn").onclick=()=>{const code=$("verifyCode").value.trim().toUpperCase(),t=state.tickets.find(x=>x.code===code);$("verifyResult").innerHTML=t?`<div class="verified"><b>✓ TICKET VÁLIDO</b><p><strong>${esc(t.code)}</strong> · ${esc(t.name)} · DNI ${esc(t.dni)}</p><p>Números: ${t.numbers.map(pad).join(", ")}</p><p>Premio: ${esc(t.prize||"—")}</p></div>`:`<div class="notfound">✕ No se encontró ese ticket.</div>`};

$("exportBtn").onclick=()=>{const blob=new Blob([JSON.stringify({tickets:state.tickets,config:state.config},null,2)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="rifas-vip-copia.json";a.click();URL.revokeObjectURL(a.href)};
$("importInput").onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const d=JSON.parse(r.result);if(!Array.isArray(d.tickets))throw 0;state.tickets=d.tickets;state.config={...state.config,...(d.config||{})};save();load();alert("Copia importada correctamente.")}catch{alert("El archivo no es válido.")}};r.readAsText(f)};
$("deleteAllBtn").onclick=()=>{if(confirm("¿Eliminar TODOS los tickets guardados?")){state.tickets=[];save();renderTickets();renderNumbers()}};

function drawWinners(){
  const nums=[...allSold()].sort((a,b)=>a-b);if(nums.length<3){alert("Necesitas al menos 3 números registrados en tickets.");return}
  const chosen=[];while(chosen.length<3){const n=nums[Math.floor(Math.random()*nums.length)];if(!chosen.includes(n))chosen.push(n)}
  $("winner1").textContent=pad(chosen[0]);$("winner2").textContent=pad(chosen[1]);$("winner3").textContent=pad(chosen[2]);
}
$("spinBtn").onclick=()=>{const wheel=$("wheel");state.wheelRotation+=1440+Math.floor(Math.random()*720);wheel.style.transform=`rotate(${state.wheelRotation}deg)`;setTimeout(drawWinners,4100)};
$("clearWinners").onclick=()=>["winner1","winner2","winner3"].forEach(id=>$(id).textContent="—");

$("loginBtn").onclick=login;$("accessCode").onkeydown=e=>{if(e.key==="Enter")login()};
function login(){if($("accessCode").value===ACCESS_CODE){sessionStorage.setItem("rvip_auth","1");$("loginView").classList.add("hidden");$("appView").classList.remove("hidden");load()}else $("loginMsg").textContent="Código incorrecto."}
$("logoutBtn").onclick=()=>{sessionStorage.removeItem("rvip_auth");location.reload()};
if(sessionStorage.getItem("rvip_auth")==="1"){ $("loginView").classList.add("hidden");$("appView").classList.remove("hidden");load() }
