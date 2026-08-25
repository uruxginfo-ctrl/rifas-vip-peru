const PRICE=10, TOTAL=1500, STORAGE="rvip_tickets_v3", SOLD_STORAGE="rvip_sold_v3";
const sold=new Set(JSON.parse(localStorage.getItem(SOLD_STORAGE)||"[24,38,72,91,113,145,201,250,333,404,505,606,707,808,909,999]"));
let selected=new Set(), tickets=JSON.parse(localStorage.getItem(STORAGE)||"[]"), cameraStream=null, scanTimer=null;

const $=id=>document.getElementById(id);
const money=n=>`S/ ${n.toFixed(2)}`;
const pad=n=>String(n).padStart(4,"0");
function toast(msg){const t=$("toast");t.textContent=msg;t.classList.add("show");clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.classList.remove("show"),2400)}
function go(id){document.getElementById(id)?.scrollIntoView({behavior:"smooth",block:"start"});document.querySelectorAll(".nav-link").forEach(b=>b.classList.toggle("active",b.dataset.go===id))}
document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>go(b.dataset.go)));
window.addEventListener("scroll",()=>{const sections=["inicio","generar","tickets","verificar","sorteo"];let active="inicio";for(const id of sections){const el=$(id);if(el&&window.scrollY+130>=el.offsetTop)active=id}document.querySelectorAll(".nav-link").forEach(b=>b.classList.toggle("active",b.dataset.go===active))});
$("menuBtn").addEventListener("click",()=>toast("Usa la barra inferior para navegar"));

function renderNumbers(filter=""){
 const grid=$("numberGrid"); grid.innerHTML="";
 const f=String(filter).trim();
 for(let n=1;n<=TOTAL;n++){
   if(f&&!String(n).includes(f))continue;
   const b=document.createElement("button"); b.className="num"+(sold.has(n)?" sold":"")+(selected.has(n)?" selected":"");
   b.textContent=pad(n); b.title=sold.has(n)?"Número vendido":`Seleccionar ${pad(n)}`;
   b.disabled=sold.has(n);
   b.addEventListener("click",()=>{
     if(selected.has(n))selected.delete(n);
     else if(selected.size>=10){toast("Puedes seleccionar hasta 10 números por ticket");return}
     else selected.add(n);
     renderNumbers($("numberSearch").value);updateSelection();
   });
   grid.appendChild(b);
 }
 updateSelection();
}
function updateSelection(){$("selectedCount").textContent=selected.size;$("totalPrice").textContent=money(selected.size*PRICE)}
$("numberSearch").addEventListener("input",e=>renderNumbers(e.target.value));
$("clearBtn").addEventListener("click",()=>{selected.clear();$("numberSearch").value="";renderNumbers()});
$("randomBtn").addEventListener("click",()=>{
 selected.clear();const candidates=[];for(let n=1;n<=TOTAL;n++)if(!sold.has(n))candidates.push(n);
 for(let i=candidates.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[candidates[i],candidates[j]]=[candidates[j],candidates[i]]}
 candidates.slice(0,Math.min(3,10)).forEach(n=>selected.add(n));renderNumbers($("numberSearch").value);toast("Hemos elegido números disponibles al azar");
});

function ticketId(){return "RVIP-"+new Date().toISOString().slice(0,10).replaceAll("-","")+"-"+Math.random().toString(36).slice(2,9).toUpperCase()}
function formatDate(v){const d=new Date(v);return isNaN(d)?"—":d.toLocaleDateString("es-PE",{day:"2-digit",month:"2-digit",year:"numeric"})}
function save(){localStorage.setItem(STORAGE,JSON.stringify(tickets));localStorage.setItem(SOLD_STORAGE,JSON.stringify([...sold]))}
function buildQr(text){
 const q=$("qrcode");q.innerHTML="";
 if(window.QRCode){new QRCode(q,{text, width:120,height:120,colorDark:"#111111",colorLight:"#ffffff",correctLevel:QRCode.CorrectLevel.M})}
 else {q.innerHTML=`<div style="font:700 10px Arial;color:#111;text-align:center">QR<br>${text.slice(-8)}</div>`}
}
function showTicket(t){
 $("ticketWrap").hidden=false;
 $("ticketNums").textContent=t.nums.map(pad).join(", ");
 $("ticketName").textContent=t.name||"—"; $("ticketPhone").textContent=t.phone||"—"; $("ticketPrize").textContent=t.prize||"—";
 $("ticketDate").textContent=formatDate(t.drawDate); $("ticketId").textContent=t.id; buildQr(t.id);
 $("ticketWrap").scrollIntoView({behavior:"smooth",block:"center"});
}
$("generateBtn").addEventListener("click",()=>{
 if(!selected.size){toast("Selecciona al menos un número");return}
 const t={id:ticketId(),nums:[...selected].sort((a,b)=>a-b),name:$("name").value.trim(),phone:$("phone").value.trim(),email:$("email").value.trim(),raffle:$("raffle").value.trim(),prize:$("prize").value.trim(),drawDate:$("drawDate").value,createdAt:new Date().toISOString(),total:selected.size*PRICE};
 if(!t.name||!t.phone||!t.prize){toast("Completa nombre, WhatsApp y premio");return}
 tickets.unshift(t);t.nums.forEach(n=>sold.add(n));selected.clear();save();renderNumbers();renderTickets();showTicket(t);toast("Ticket generado correctamente");
});
$("printBtn").addEventListener("click",()=>window.print());

function renderTickets(){
 $("ticketCount").textContent=tickets.length;
 const box=$("ticketList");box.innerHTML="";
 if(!tickets.length){box.innerHTML='<div class="empty">Todavía no tienes tickets. Genera tu primer ticket arriba.</div>';return}
 tickets.forEach(t=>{
  const el=document.createElement("article");el.className="ticket-mini";
  el.innerHTML=`<span class="tag">GENERADO</span><h3>${escapeHtml(t.prize)}</h3><p><b>Números:</b> <strong>${t.nums.map(pad).join(", ")}</strong></p><p><b>Sorteo:</b> ${formatDate(t.drawDate)}</p><p><b>Total:</b> ${money(t.total)}</p><button class="small-btn">VER TICKET</button>`;
  el.querySelector("button").addEventListener("click",()=>showTicket(t));box.appendChild(el);
 });
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}

function findTicket(id){return tickets.find(t=>t.id.toLowerCase()===id.toLowerCase().trim())}
function verify(id,quiet=false){
 const t=findTicket(id);
 const box=$("verifyResult");box.hidden=false;
 if(t){box.className="verify-result ok";box.innerHTML=`<b>✓ TICKET AUTÉNTICO</b><br>${escapeHtml(t.name)} · ${t.nums.map(pad).join(", ")}<br>Premio: ${escapeHtml(t.prize)} · Sorteo: ${formatDate(t.drawDate)}`;if(!quiet)toast("Ticket verificado correctamente")}
 else {box.className="verify-result bad";box.innerHTML="<b>✕ NO ENCONTRADO</b><br>No existe un ticket con ese identificador en este dispositivo.";if(!quiet)toast("No encontramos ese ticket")}
}
$("verifyBtn").addEventListener("click",()=>verify($("verifyId").value));
$("verifyId").addEventListener("keydown",e=>{if(e.key==="Enter")verify($("verifyId").value)});
$("cameraBtn").addEventListener("click",startCamera);
$("stopCamera").addEventListener("click",stopCamera);

async function startCamera(){
 if(!navigator.mediaDevices?.getUserMedia){toast("Tu navegador no permite acceder a la cámara");return}
 try{
  cameraStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:"environment"}}});
  const video=$("camera");video.srcObject=cameraStream;video.style.display="block";await video.play();
  $("cameraBtn").classList.add("hidden");$("stopCamera").classList.remove("hidden");$("cameraHint").textContent="Buscando código QR…";
  if("BarcodeDetector" in window){
   const detector=new BarcodeDetector({formats:["qr_code"]});
   scanTimer=setInterval(async()=>{if(video.readyState<2)return;try{const codes=await detector.detect(video);if(codes.length){const value=codes[0].rawValue;stopCamera();$("verifyId").value=value;verify(value)}}catch{}},400);
  }else toast("Escáner automático no disponible; introduce el ID manualmente");
 }catch(e){toast("No se pudo abrir la cámara. Revisa los permisos del navegador.")}
}
function stopCamera(){if(scanTimer)clearInterval(scanTimer);scanTimer=null;if(cameraStream){cameraStream.getTracks().forEach(t=>t.stop());cameraStream=null}const v=$("camera");v.srcObject=null;v.style.display="none";$("cameraBtn").classList.remove("hidden");$("stopCamera").classList.add("hidden");$("cameraHint").textContent="Apunta la cámara al código QR del ticket."}

function targetDate(){return new Date($("drawDate").value||"2026-12-31T20:00:00")}
function updateCountdown(){
 const diff=Math.max(0,targetDate()-new Date());const s=Math.floor(diff/1000);
 const d=Math.floor(s/86400),h=Math.floor(s%86400/3600),m=Math.floor(s%3600/60),sec=s%60;
 $("days").textContent=String(d).padStart(3,"0");$("hours").textContent=String(h).padStart(2,"0");$("mins").textContent=String(m).padStart(2,"0");$("secs").textContent=String(sec).padStart(2,"0");
 $("drawNote").textContent=sold.size?`${sold.size} número(s) vendidos · listos para el sorteo`:"Aún no hay números vendidos";
}
$("drawDate").addEventListener("change",updateCountdown);
$("drawBtn").addEventListener("click",()=>{
 const candidates=[...sold].filter(n=>n>=1&&n<=TOTAL);
 if(!candidates.length){toast("No hay números vendidos para sortear");return}
 const n=candidates[Math.floor(Math.random()*candidates.length)];
 const w=$("winner");w.hidden=false;w.innerHTML=`<span>NÚMERO GANADOR</span><br><b>${pad(n)}</b><br><small>Resultado generado a partir de los números vendidos en este dispositivo.</small>`;w.scrollIntoView({behavior:"smooth",block:"center"});
});

$("loginBtn").addEventListener("click",()=>{
 const email=$("loginEmail").value.trim(),pass=$("loginPass").value;
 if(!email||!pass){toast("Introduce Gmail y contraseña");return}
 toast("Acceso de demostración activado");go("generar");
});
renderNumbers();renderTickets();updateCountdown();setInterval(updateCountdown,1000);
window.addEventListener("beforeunload",stopCamera);
