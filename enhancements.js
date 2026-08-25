(function(){
  const style=document.createElement('style');
  style.textContent=`
  /* RIFAS VIP — mejoras visuales y funcionales */
  .ticket-premium{position:relative;overflow:hidden;margin-top:20px;border:1px solid rgba(205,74,255,.7);border-radius:24px;background:linear-gradient(135deg,#090611 0%,#160923 48%,#09050f 100%);box-shadow:0 30px 90px rgba(0,0,0,.55),0 0 50px rgba(170,45,255,.16)}
  .ticket-premium:before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 15% 15%,rgba(255,42,178,.16),transparent 32%),radial-gradient(circle at 85% 85%,rgba(123,44,255,.18),transparent 35%);pointer-events:none}
  .ticket-premium-head{position:relative;display:flex;justify-content:space-between;align-items:center;padding:22px 26px;border-bottom:1px solid rgba(255,255,255,.08)}
  .ticket-premium-brand{font-size:22px;font-weight:900;letter-spacing:-1px}.ticket-premium-brand b{color:#f02ab2}.ticket-premium-brand small{font-size:7px;background:#f02ab2;padding:4px 6px;border-radius:4px;margin-left:5px;vertical-align:middle}
  .ticket-status{font-size:8px;letter-spacing:1.5px;color:#61f48a;border:1px solid rgba(69,242,123,.25);padding:8px 11px;border-radius:999px}.ticket-status i{display:inline-block;width:6px;height:6px;background:#45f27b;border-radius:50%;margin-right:6px;box-shadow:0 0 9px #45f27b}
  .ticket-premium-body{position:relative;display:grid;grid-template-columns:minmax(230px,.85fr) minmax(300px,1.35fr) 190px;min-height:315px}
  .ticket-prize-zone{padding:26px;display:flex;flex-direction:column;justify-content:center;border-right:1px dashed rgba(255,255,255,.12)}
  .ticket-prize-image-wrap{height:150px;border-radius:16px;overflow:hidden;border:1px solid rgba(190,67,255,.45);background:linear-gradient(145deg,#1a0c2b,#08050f);margin-bottom:18px;display:grid;place-items:center}
  .ticket-prize-image-wrap img{width:100%;height:100%;object-fit:cover}.ticket-no-image{color:#756a81;font-size:9px;letter-spacing:1.5px;text-transform:uppercase;text-align:center}
  .ticket-prize-label{font-size:8px;letter-spacing:2px;color:#9c8bab}.ticket-premium-prize{margin:5px 0 0;font-size:24px;line-height:1.05;font-weight:900;text-transform:uppercase;background:linear-gradient(90deg,#fff,#d9a7ff,#f02ab2);-webkit-background-clip:text;background-clip:text;color:transparent}
  .ticket-data-zone{padding:26px}.ticket-data-title{font-size:9px;letter-spacing:2px;color:#9d8bad;margin-bottom:14px}.ticket-data-grid{display:grid;grid-template-columns:1fr 1fr;gap:0;border:1px solid rgba(255,255,255,.08);border-radius:14px;overflow:hidden}.ticket-data-grid div{padding:12px;border-bottom:1px solid rgba(255,255,255,.06)}.ticket-data-grid div:nth-last-child(-n+2){border-bottom:0}.ticket-data-grid small{display:block;font-size:7px;letter-spacing:1.3px;color:#776b84;text-transform:uppercase}.ticket-data-grid strong{display:block;margin-top:5px;font-size:11px;word-break:break-word}.ticket-numbers{margin-top:15px;padding:14px;border-radius:14px;background:linear-gradient(100deg,rgba(123,44,255,.16),rgba(240,42,178,.08));border:1px solid rgba(169,67,255,.25)}.ticket-numbers small{font-size:7px;color:#9989a7;letter-spacing:1.5px}.ticket-number-list{display:block;margin-top:7px;font-size:18px;font-weight:900;letter-spacing:2px;color:#fff}
  .ticket-qr-zone{position:relative;padding:24px 18px;display:flex;flex-direction:column;align-items:center;justify-content:center;border-left:1px dashed rgba(255,255,255,.12)}.ticket-qr-zone:before,.ticket-qr-zone:after{content:"";position:absolute;left:-9px;width:18px;height:18px;border-radius:50%;background:#05030a;border:1px solid rgba(205,74,255,.35)}.ticket-qr-zone:before{top:-10px}.ticket-qr-zone:after{bottom:-10px}.ticket-qr-card{padding:12px;background:#fff;border-radius:15px;box-shadow:0 12px 35px rgba(0,0,0,.35)}.ticket-qr-card canvas,.ticket-qr-card img{display:block}.ticket-code-big{margin-top:12px;font-size:13px;font-weight:900;letter-spacing:2px;color:#fff}.ticket-scan-note{margin-top:5px;font-size:7px;color:#766b80;text-align:center;letter-spacing:1px}.ticket-premium-foot{position:relative;display:flex;justify-content:space-between;gap:15px;padding:12px 26px;border-top:1px solid rgba(255,255,255,.08);font-size:7px;letter-spacing:1.2px;color:#6f647a}.ticket-premium-foot b{color:#b999ca}
  .verify-tools{margin-top:18px;display:flex;gap:10px;align-items:center}.camera-btn{min-height:48px;border:1px solid #8f38f5;border-radius:11px;background:linear-gradient(100deg,#251040,#160b25);color:#fff;font-weight:900;font-size:10px;padding:0 18px}.camera-btn:hover{border-color:#f02ab2;box-shadow:0 0 25px rgba(240,42,178,.15)}.camera-status{font-size:9px;color:#8d8099}.camera-panel{display:none;margin-top:16px;padding:16px;border:1px solid #4d2d68;border-radius:15px;background:#08050f}.camera-panel.active{display:block}.camera-panel-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}.camera-panel-head b{font-size:10px}.camera-close{border:0;background:none;color:#ff7190;font-size:9px;font-weight:800}.qr-reader{width:100%;max-width:430px;margin:auto;overflow:hidden;border-radius:12px}.qr-reader video{border-radius:12px}.camera-hint{font-size:8px;color:#756b80;text-align:center;margin-top:9px}
  .draw-stage-card{position:relative;overflow:hidden}.draw-stage-card:after{content:"";position:absolute;inset:auto 10% 6% 10%;height:35px;background:radial-gradient(ellipse,rgba(170,50,255,.28),transparent 70%);filter:blur(10px);pointer-events:none}.wheel.spinning{filter:drop-shadow(0 0 22px rgba(179,54,255,.35))}.winner.reveal{animation:winnerReveal .7s ease both}.winner.pending b{opacity:.3}.draw-countdown{margin-top:10px;text-align:center;color:#a994b8;font-size:9px;letter-spacing:1.2px;min-height:14px}.draw-stage-card .spin:disabled{opacity:.55;cursor:not-allowed;transform:none!important}
  @keyframes winnerReveal{0%{opacity:0;transform:translateY(10px) scale(.94)}60%{opacity:1;transform:translateY(-2px) scale(1.04)}100%{opacity:1;transform:none}}
  @media(max-width:900px){.ticket-premium-body{grid-template-columns:1fr}.ticket-prize-zone,.ticket-qr-zone{border:0;border-bottom:1px dashed rgba(255,255,255,.12)}.ticket-qr-zone:before,.ticket-qr-zone:after{display:none}.ticket-data-grid div:nth-last-child(-n+2){border-bottom:1px solid rgba(255,255,255,.06)}.ticket-data-grid div:last-child{border-bottom:0}.ticket-premium-head,.ticket-premium-foot{padding-left:18px;padding-right:18px}.verify-tools{flex-direction:column;align-items:stretch}}
  `;
  document.head.appendChild(style);

  // Indicadores verdes: parpadeo permanente para mostrar estado activo.
  function activateGreenBlink(){
    document.querySelectorAll('.logout i,.private-badge i,.live-status i,.security-note span,.ticket-status i').forEach(el=>el.classList.add('green-blink'));
  }
  activateGreenBlink();
  new MutationObserver(activateGreenBlink).observe(document.body,{childList:true,subtree:true});

  function buildTicket(t){
    const image=t.prizeImage?`<div class="ticket-prize-image-wrap"><img src="${t.prizeImage}" alt="Premio de la rifa"></div>`:`<div class="ticket-prize-image-wrap"><div class="ticket-no-image">Premio VIP<br>Imagen no añadida</div></div>`;
    return `<div class="ticket-premium"><div class="ticket-premium-head"><div class="ticket-premium-brand">RIFAS <b>VIP</b><small>PERÚ</small></div><div class="ticket-status"><i></i>TICKET AUTÉNTICO</div></div><div class="ticket-premium-body"><div class="ticket-prize-zone">${image}<span class="ticket-prize-label">PREMIO PRINCIPAL</span><strong class="ticket-premium-prize">${esc(t.prize||"PREMIO VIP")}</strong></div><div class="ticket-data-zone"><div class="ticket-data-title">COMPROBANTE DE PARTICIPACIÓN</div><div class="ticket-data-grid"><div><small>Participante</small><strong>${esc(t.name)}</strong></div><div><small>DNI</small><strong>${esc(t.dni)}</strong></div><div><small>WhatsApp</small><strong>${esc(t.phone||"—")}</strong></div><div><small>Sorteo</small><strong>${esc(t.date||"—")}</strong></div><div><small>Rifa</small><strong>${esc(t.raffle)}</strong></div><div><small>Importe</small><strong>${money(t.numbers.length*t.price)}</strong></div></div><div class="ticket-numbers"><small>NÚMEROS PARTICIPANTES</small><strong class="ticket-number-list">${t.numbers.map(pad).join(" · ")}</strong></div></div><div class="ticket-qr-zone"><div class="ticket-qr-card"><div id="qr-${t.id}"></div></div><div class="ticket-code-big">${esc(t.code)}</div><div class="ticket-scan-note">ESCANEA PARA VERIFICAR</div></div></div><div class="ticket-premium-foot"><span>RIFAS VIP PERÚ · CONTROL DE PARTICIPACIONES</span><b>GUARDA ESTE TICKET</b></div></div>`;
  }

  window.renderTicketPreview=function(t){
    const target=document.getElementById('ticketResult');
    if(!target)return;
    target.innerHTML=buildTicket(t);
    const qr=document.getElementById(`qr-${t.id}`);
    if(window.QRCode&&qr)new QRCode(qr,{text:JSON.stringify({code:t.code,numbers:t.numbers,raffle:t.raffle}),width:156,height:156,colorDark:'#111',colorLight:'#fff',correctLevel:QRCode.CorrectLevel.M});
  };

  function addCameraUI(){
    const box=document.querySelector('#verify .verify-box');
    if(!box||document.getElementById('cameraVerifyBtn'))return;
    const tools=document.createElement('div');tools.className='verify-tools';
    tools.innerHTML='<button id="cameraVerifyBtn" class="camera-btn" type="button">▣  ESCANEAR CON CÁMARA</button><span id="cameraStatus" class="camera-status">Lee el QR del ticket automáticamente.</span>';
    const panel=document.createElement('div');panel.id='cameraPanel';panel.className='camera-panel';panel.innerHTML='<div class="camera-panel-head"><b>ESCÁNER DE TICKET</b><button id="cameraClose" class="camera-close" type="button">CERRAR</button></div><div id="qr-reader" class="qr-reader"></div><div class="camera-hint">Apunta la cámara al código QR del ticket y manténlo dentro del marco.</div>';
    box.appendChild(tools);box.appendChild(panel);
    let scanner=null;
    const close=async()=>{if(scanner){try{await scanner.stop();}catch{}try{await scanner.clear();}catch{}scanner=null;}panel.classList.remove('active');$('cameraStatus').textContent='Lee el QR del ticket automáticamente.';};
    $('cameraClose').onclick=close;
    $('cameraVerifyBtn').onclick=async()=>{
      if(typeof Html5Qrcode==='undefined'){ $('cameraStatus').textContent='No se pudo cargar el escáner. Actualiza la página e inténtalo de nuevo.'; return; }
      panel.classList.add('active');$('cameraStatus').textContent='Solicitando acceso a la cámara…';
      scanner=new Html5Qrcode('qr-reader');
      try{
        await scanner.start({facingMode:'environment'},{fps:10,qrbox:{width:240,height:240}},async text=>{
          let code=text.trim();try{const data=JSON.parse(text);if(data.code)code=data.code;}catch{}
          $('verifyCode').value=code.toUpperCase();$('verifyBtn').click();$('cameraStatus').textContent='Ticket escaneado.';await close();
        },()=>{});
        $('cameraStatus').textContent='Cámara activa · apunta al QR.';
      }catch(e){panel.classList.remove('active');$('cameraStatus').textContent='No se pudo abrir la cámara. Revisa el permiso del navegador.';}
    };
  }

  function setupDraw(){
    const root=document.getElementById('draw');
    if(!root || root.dataset.casinoReady==='1') return;
    root.dataset.casinoReady='1';
    const ids=[3,2,1];
    const chosen={};
    let available=null;
    const cd=document.getElementById('drawCountdown');
    const setOfficial=(n,v)=>{const e=document.getElementById('officialWinner'+n);if(e)e.textContent=v};
    const setWinner=(n,v)=>{const e=document.getElementById('winner'+n);if(e)e.textContent=v};
    ids.forEach(n=>{setWinner(n,'—');setOfficial(n,'—')});
    const setLeverState=(n,disabled)=>{const b=document.getElementById('lever'+n);const row=b?.closest('.casino-prize-row');if(b)b.disabled=disabled;if(row)row.classList.toggle('locked',disabled)};
    setLeverState(3,false);setLeverState(2,true);setLeverState(1,true);
    function getAvailable(){
      const nums=[...allSold()].sort((a,b)=>a-b);
      if(nums.length<3){alert('Necesitas al menos 3 números registrados en tickets.');return null;}
      return nums;
    }
    function pick(){
      if(!available) available=getAvailable();
      if(!available) return null;
      const remaining=available.filter(n=>!Object.values(chosen).includes(n));
      if(!remaining.length)return null;
      return remaining[Math.floor(Math.random()*remaining.length)];
    }
    function pull(n){
      const btn=document.getElementById('lever'+n);if(!btn||btn.disabled)return;
      const num=pick();if(num===null)return;
      btn.disabled=true;btn.classList.add('pulling');
      const row=btn.closest('.casino-prize-row');
      if(cd)cd.textContent='Generando número…';
      setTimeout(()=>{
        chosen[n]=num;const val=pad(num);setWinner(n,val);setOfficial(n,val);row?.classList.remove('locked');row?.classList.add('revealed');btn.classList.remove('pulling');
        if(n===3){setLeverState(2,false);if(cd)cd.textContent='Tercer premio generado · continúa con el segundo premio.'}
        else if(n===2){setLeverState(1,false);if(cd)cd.textContent='Segundo premio generado · continúa con el primer premio.'}
        else {if(cd)cd.textContent='SORTEO COMPLETADO · LOS 3 PREMIOS HAN SIDO GENERADOS';}
      },650);
    }
    [3,2,1].forEach(n=>{const b=document.getElementById('lever'+n);if(b)b.onclick=()=>pull(n)});
    const clear=document.getElementById('clearWinners');
    if(clear)clear.onclick=()=>{
      Object.keys(chosen).forEach(k=>delete chosen[k]);available=null;
      ids.forEach(n=>{setWinner(n,'—');setOfficial(n,'—');const row=document.querySelector(`.casino-prize-row[data-prize="${n}"]`);row?.classList.remove('revealed');});
      setLeverState(3,false);setLeverState(2,true);setLeverState(1,true);if(cd)cd.textContent='';
    };
  }

  const originalShowView=window.showView;
  window.showView=function(id){if(typeof originalShowView==='function')originalShowView(id);if(id==='verify')addCameraUI();if(id==='draw')setupDraw();};
  document.addEventListener('DOMContentLoaded',()=>{addCameraUI();setupDraw();});
  setTimeout(()=>{addCameraUI();setupDraw();},500);
})();
