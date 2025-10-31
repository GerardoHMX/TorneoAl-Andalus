// --- ui.js ---
// Funciones de renderizado de cada sección del Torneo Al-Ándalus

// --- Jornadas ---
export function renderJornadas(list) {
    const tbody = document.getElementById("jornadas-body");
    if (!tbody) return;
    tbody.innerHTML = list.map((m, i) => {
        const [local, visitante] = (m.localVisitante || " - ").split(" vs ");
        const [gLocal, gVisit, estado] = (m.marcadorEstado || "0-0 Finalizado").split(" ");
        return `
      <tr data-i="${i}">
        <td>${m.fechaHora}</td>
        <td>${m.grupo}</td>
        <td>${local}</td>
        <td>${visitante}</td>
        <td>${gLocal}-${gVisit}</td>
        <td>${estado}</td>
      </tr>
    `;
    }).join("");
}

// --- Clasificación con puntos congelados cuando termina la fase de grupos ---
export function renderClasificacion(list) {
    const grupos = ["A", "B", "C", "D"];

    // Si STATE existe y los grupos están cerrados, no recalculamos
    const gruposCerrados = window.STATE?.gruposCerrados ?? false;

    grupos.forEach(g => {
        const cuerpo = document.querySelector(`#grupo-${g} tbody`);
        if (!cuerpo) return;

        const sub = list.filter(r => r.grupo === g);
        if (sub.length === 0) {
            cuerpo.innerHTML = `<tr><td colspan="11">Sin datos</td></tr>`;
            return;
        }

        // Si los grupos no están cerrados, ordenamos normalmente
        if (!gruposCerrados) {
            sub.sort((a, b) => b.Ptos - a.Ptos || b.DG - a.DG || b.GF - a.GF);
            sub.forEach((r, i) => (r.pos = i + 1));
        }

        cuerpo.innerHTML = sub.map(r => `
      <tr class="${r.pos === 1 ? 'leader' : ''}">
        <td>${r.pos || "-"}</td>
        <td>${r.equipo}</td>
        <td>${r.PJ || 0}</td><td>${r.G || 0}</td><td>${r.E || 0}</td><td>${r.P || 0}</td>
        <td>${r.GF || 0}</td><td>${r.GC || 0}</td><td>${r.DG || 0}</td>
        <!-- 👇 esta línea es la clave -->
        <td>${gruposCerrados ? `<strong>${r.Ptos}</strong>` : (r.Ptos || 0)}</td>
        <td>${r.FP || 0}</td>
      </tr>
    `).join("");
    });
}


// --- Goleadores ---
export function renderGoleadores(list) {
    const el = document.getElementById("goleadores-body");
    if (!el) return;
    el.innerHTML = list.map(p => `
    <tr>
      <td>${p.jugador}</td>
      <td>${p.equipo}</td>
      <td>${p.goles}</td>
    </tr>
  `).join("");
}

// --- Sancionados ---
export function renderSancionados(list) {
    const el = document.getElementById("sancionados-body");
    if (!el) return;
    el.innerHTML = list.map(p => `
    <tr>
      <td>${p.jugador}</td>
      <td>${p.equipo}</td>
      <td>${p.tipo}</td>
      <td>${p.partidosRestantes}</td>
      <td>${p.motivo}</td>
    </tr>
  `).join("");
}

// --- Noticias ---
export function renderNoticias(list) {
    const el = document.getElementById("noticias-list");
    if (!el) return;
    el.innerHTML = list.map(n => `
    <li>
      <strong>${n.fecha} — ${n.titulo}</strong><br>
      ${n.cuerpo}
    </li>
  `).join("");
}

// --- Bracket ---
export function renderBracket(list) {
    const el = document.getElementById("bracket-body");
    if (!el) return;
    el.innerHTML = list.map(b => `
    <tr>
      <td>${b.fase}</td>
      <td>${b.clave}</td>
      <td>${b.equipo1}</td>
      <td>${b.equipo2}</td>
      <td>${b.g1 ?? "-"}-${b.g2 ?? "-"}</td>
      <td>${b.estado}</td>
    </tr>
  `).join("");
}
