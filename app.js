/* RIFAS VIP PERÚ - versión privada local */

const STORAGE_KEY = "rifas_vip_peru_tickets_v2";
const COUNTER_KEY = "rifas_vip_peru_counter_v2";

let tickets = loadTickets();
let currentTicket = null;
let scanner = null;

function show(id) {
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  const target = document.getElementById(id);
  if (!target) return;
  target.classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });

  if (id === "tickets") renderTickets();
  if (id === "ticket") renderCurrentTicket();
  if (id === "verify") resetScannerUI();
}

function money(n) {
  return "S/ " + Number(n || 0).toFixed(2);
}

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[c]));
}

function loadTickets() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : [];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function saveTickets() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
}

function nextCode() {
  let n = Number(localStorage.getItem(COUNTER_KEY) || "1");
  const code = "VIP-" + String(n).padStart(6, "0");
  localStorage.setItem(COUNTER_KEY, String(n + 1));
  return code;
}

function normalizeNumbers(value) {
  const raw = String(value || "")
    .split(/[,;\s]+/)
    .map(x => x.trim())
    .filter(Boolean);

  const nums = [];
  const seen = new Set();

  for (const item of raw) {
    const n = Number(item);
    if (!Number.isInteger(n) || n < 1 || n > 9999) continue;
    const formatted = String(n).padStart(4, "0");
    if (!seen.has(formatted)) {
      seen.add(formatted);
      nums.push(formatted);
    }
  }

  return nums.sort((a,b) => Number(a) - Number(b));
}

function createTicket() {
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const email = document.getElementById("email").value.trim();
  const raffle = document.getElementById("raffleName").value.trim() || "RIFAS VIP PERÚ";
  const prize = document.getElementById("prize").value.trim();
  const drawDate = document.getElementById("drawDate").value;
  const numbers = normalizeNumbers(document.getElementById("numbersInput").value);
  const price = Number(document.getElementById("price").value || 0);

  if (!name) return alert("Introduce el nombre del participante.");
  if (!phone) return alert("Introduce el WhatsApp.");
  if (!numbers.length) return alert("Introduce al menos un número válido.");
  if (!Number.isFinite(price) || price < 0) return alert("El precio no es válido.");

  const duplicated = numbers.filter(num =>
    tickets.some(t => t.numbers.includes(num))
  );

  if (duplicated.length) {
    return alert("Estos números ya están registrados: " + duplicated.join(", "));
  }

  const ticket = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random(),
    code: nextCode(),
    raffle,
    prize,
    drawDate,
    participant: { name, phone, email },
    numbers,
    pricePerNumber: price,
    total: numbers.length * price,
    createdAt: new Date().toISOString(),
    status: "VALIDO"
  };

  tickets.push(ticket);
  saveTickets();
  currentTicket = ticket;
  show("ticket");
}

function renderCurrentTicket() {
  if (!currentTicket) return;

  document.getElementById("ticketNumbers").textContent =
    currentTicket.numbers.join(" • ");

  document.getElementById("ticketData").innerHTML = `
    <p><strong>Ticket</strong><br>${esc(currentTicket.code)}</p>
    <p><strong>Participante</strong><br>${esc(currentTicket.participant.name)}</p>
    <p><strong>WhatsApp</strong><br>${esc(currentTicket.participant.phone)}</p>
    ${currentTicket.participant.email ? `<p><strong>Email</strong><br>${esc(currentTicket.participant.email)}</p>` : ""}
    <p><strong>Rifa</strong><br>${esc(currentTicket.raffle)}</p>
    <p><strong>Premio</strong><br>${esc(currentTicket.prize || "—")}</p>
    <p><strong>Sorteo</strong><br>${esc(formatDate(currentTicket.drawDate))}</p>
    <p><strong>Total</strong><br>${money(currentTicket.total)}</p>
  `;

  document.getElementById("ticketCode").textContent = currentTicket.code;

  const qr = document.getElementById("qrcode");
  qr.innerHTML = "";

  if (typeof QRCode !== "undefined") {
    new QRCode(qr, {
      text: currentTicket.code,
      width: 220,
      height: 220,
      correctLevel: QRCode.CorrectLevel.H
    });
  } else {
    qr.textContent = "No se pudo cargar el generador QR.";
  }
}

function formatDate(value) {
  if (!value) return "No indicada";
  const d = new Date(value + "T00:00:00");
  return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString("es-PE");
}

function renderTickets() {
  const list = document.getElementById("ticketsList");
  const query = document.getElementById("ticketSearch").value.trim().toLowerCase();

  const filtered = tickets.filter(t => {
    if (!query) return true;
    return [
      t.code,
      t.participant.name,
      t.participant.phone,
      ...t.numbers
    ].join(" ").toLowerCase().includes(query);
  }).slice().reverse();

  if (!filtered.length) {
    list.innerHTML = `<div class="empty">No se encontraron tickets.</div>`;
    return;
  }

  list.innerHTML = filtered.map(t => `
    <article class="ticket-row">
      <div>
        <strong>${esc(t.code)}</strong>
        <span>${esc(t.participant.name)}</span>
        <small>Números: ${esc(t.numbers.join(", "))}</small>
      </div>
      <div class="row-actions">
        <b>${money(t.total)}</b>
        <button class="primary" onclick="openTicket('${esc(t.id)}')">Ver</button>
        <button class="ghost danger" onclick="deleteTicket('${esc(t.id)}')">Eliminar</button>
      </div>
    </article>
  `).join("");
}

function openTicket(id) {
  const found = tickets.find(t => String(t.id) === String(id));
  if (!found) return alert("Ticket no encontrado.");
  currentTicket = found;
  show("ticket");
}

function verifyManual() {
  const code = document.getElementById("verifyCode").value.trim().toUpperCase();
  verifyCode(code);
}

function verifyCode(code) {
  const result = tickets.find(t => t.code.toUpperCase() === code);
  const box = document.getElementById("verifyResult");

  if (!result) {
    box.className = "verify-result invalid";
    box.innerHTML = "<strong>❌ TICKET NO ENCONTRADO</strong>";
    return;
  }

  if (result.status !== "VALIDO") {
    box.className = "verify-result invalid";
    box.innerHTML = `<strong>❌ TICKET NO VÁLIDO</strong><p>${esc(result.code)}</p>`;
    return;
  }

  box.className = "verify-result valid";
  box.innerHTML = `
    <strong>✅ TICKET VÁLIDO</strong>
    <p><b>${esc(result.code)}</b></p>
    <p>${esc(result.participant.name)}</p>
    <p>Números: ${esc(result.numbers.join(", "))}</p>
  `;
}

function resetScannerUI() {
  document.getElementById("verifyResult").innerHTML = "";
}

async function startScanner() {
  if (typeof Html5Qrcode === "undefined") {
    alert("El lector QR todavía no está disponible. Comprueba tu conexión a internet.");
    return;
  }

  if (scanner) return;

  scanner = new Html5Qrcode("reader");

  try {
    await scanner.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: { width: 230, height: 230 } },
      async decodedText => {
        await stopScanner();
        verifyCode(decodedText.trim());
      },
      () => {}
    );
  } catch (error) {
    scanner = null;
    alert("No se pudo abrir la cámara. Comprueba que el navegador tenga permiso para usarla.");
  }
}

async function stopScanner() {
  if (!scanner) return;
  try { await scanner.stop(); } catch {}
  try { scanner.clear(); } catch {}
  scanner = null;
}

function shareWhatsApp() {
  if (!currentTicket) return;

  const text = `🎟️ RIFAS VIP PERÚ

Ticket: ${currentTicket.code}
Participante: ${currentTicket.participant.name}
Número(s): ${currentTicket.numbers.join(", ")}
Premio: ${currentTicket.prize || "—"}
Sorteo: ${formatDate(currentTicket.drawDate)}

✅ Ticket registrado correctamente.`;

  window.open("https://wa.me/?text=" + encodeURIComponent(text), "_blank");
}

function clearCreateForm() {
  ["name","phone","email","prize","numbersInput"].forEach(id => {
    document.getElementById(id).value = "";
  });
  document.getElementById("raffleName").value = "RIFAS VIP PERÚ";
  document.getElementById("price").value = "10";
  document.getElementById("drawDate").value = "";
}

function deleteTicket(id) {
  const ticket = tickets.find(t => String(t.id) === String(id));
  if (!ticket) return;

  if (!confirm("¿Eliminar " + ticket.code + "?")) return;

  tickets = tickets.filter(t => String(t.id) !== String(id));
  saveTickets();
  renderTickets();
}

function deleteAllTickets() {
  if (!tickets.length) return alert("No hay tickets.");

  const confirmation = prompt("Escribe BORRAR para eliminar todos los tickets.");
  if (confirmation !== "BORRAR") return;

  tickets = [];
  saveTickets();
  renderTickets();
  alert("Todos los tickets fueron eliminados.");
}

function exportTickets() {
  if (!tickets.length) return alert("No hay tickets para exportar.");

  const blob = new Blob([JSON.stringify(tickets, null, 2)], {
    type: "application/json"
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "rifas-vip-peru-backup.json";
  a.click();
  URL.revokeObjectURL(url);
}

function importTickets(file) {
  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    try {
      const imported = JSON.parse(reader.result);
      if (!Array.isArray(imported)) throw new Error();

      const existingIds = new Set(tickets.map(t => String(t.id)));
      const fresh = imported.filter(t => t && t.code && !existingIds.has(String(t.id)));

      tickets = tickets.concat(fresh);
      saveTickets();
      renderTickets();

      alert(`Se importaron ${fresh.length} tickets.`);
    } catch {
      alert("El archivo no es una copia válida de RIFAS VIP PERÚ.");
    }
  };

  reader.readAsText(file);
}

function drawWinner() {
  const entries = tickets.flatMap(t => t.numbers.map(number => ({ number, ticket: t })));
  const winnerBox = document.getElementById("winner");

  if (!entries.length) {
    winnerBox.innerHTML = "<strong>No hay números registrados.</strong>";
    return;
  }

  const winner = entries[Math.floor(Math.random() * entries.length)];

  winnerBox.innerHTML = `
    <small>GANADOR</small>
    <strong>${esc(winner.number)}</strong>
    <p>${esc(winner.ticket.participant.name)}</p>
    <span>Ticket ${esc(winner.ticket.code)}</span>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("drawDate").min = new Date().toISOString().split("T")[0];
});
