/**
 * URLs para la hoja de calculo:
 * equipos: https://docs.google.com/spreadsheets/d/e/2PACX-1vRskeRn-mtzkR4JaGndzuwt_akX4SzWyF2IepdDiB7XA6LAUTgSNPGoypoaFbrsBzQDmgC2KjC4r8NY/pub?gid=1252401549&single=true&output=csv
 * jornadas: https://docs.google.com/spreadsheets/d/e/2PACX-1vRskeRn-mtzkR4JaGndzuwt_akX4SzWyF2IepdDiB7XA6LAUTgSNPGoypoaFbrsBzQDmgC2KjC4r8NY/pub?gid=0&single=true&output=csv
 * clasificacion: https://docs.google.com/spreadsheets/d/e/2PACX-1vRskeRn-mtzkR4JaGndzuwt_akX4SzWyF2IepdDiB7XA6LAUTgSNPGoypoaFbrsBzQDmgC2KjC4r8NY/pub?gid=2076767012&single=true&output=csv
 * goleadores: https://docs.google.com/spreadsheets/d/e/2PACX-1vRskeRn-mtzkR4JaGndzuwt_akX4SzWyF2IepdDiB7XA6LAUTgSNPGoypoaFbrsBzQDmgC2KjC4r8NY/pub?gid=1140378341&single=true&output=csv
 * sanciones: https://docs.google.com/spreadsheets/d/e/2PACX-1vRskeRn-mtzkR4JaGndzuwt_akX4SzWyF2IepdDiB7XA6LAUTgSNPGoypoaFbrsBzQDmgC2KjC4r8NY/pub?gid=440116157&single=true&output=csv
 * noticias: https://docs.google.com/spreadsheets/d/e/2PACX-1vRskeRn-mtzkR4JaGndzuwt_akX4SzWyF2IepdDiB7XA6LAUTgSNPGoypoaFbrsBzQDmgC2KjC4r8NY/pub?gid=1757087324&single=true&output=csv
 * bracket: https://docs.google.com/spreadsheets/d/e/2PACX-1vRskeRn-mtzkR4JaGndzuwt_akX4SzWyF2IepdDiB7XA6LAUTgSNPGoypoaFbrsBzQDmgC2KjC4r8NY/pub?gid=1720400726&single=true&output=csv
 */

// URLS de las hojas de cálculo publicadas como CSV
const URLS = {
    equipos: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRskeRn-mtzkR4JaGndzuwt_akX4SzWyF2IepdDiB7XA6LAUTgSNPGoypoaFbrsBzQDmgC2KjC4r8NY/pub?gid=1252401549&single=true&output=csv",
    jornadas: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRskeRn-mtzkR4JaGndzuwt_akX4SzWyF2IepdDiB7XA6LAUTgSNPGoypoaFbrsBzQDmgC2KjC4r8NY/pub?gid=0&single=true&output=csv",
    clasificacion: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRskeRn-mtzkR4JaGndzuwt_akX4SzWyF2IepdDiB7XA6LAUTgSNPGoypoaFbrsBzQDmgC2KjC4r8NY/pub?gid=2076767012&single=true&output=csv",
    goleadores: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRskeRn-mtzkR4JaGndzuwt_akX4SzWyF2IepdDiB7XA6LAUTgSNPGoypoaFbrsBzQDmgC2KjC4r8NY/pub?gid=1140378341&single=true&output=csv",
    sancionados: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRskeRn-mtzkR4JaGndzuwt_akX4SzWyF2IepdDiB7XA6LAUTgSNPGoypoaFbrsBzQDmgC2KjC4r8NY/pub?gid=440116157&single=true&output=csv",
    noticias: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRskeRn-mtzkR4JaGndzuwt_akX4SzWyF2IepdDiB7XA6LAUTgSNPGoypoaFbrsBzQDmgC2KjC4r8NY/pub?gid=1757087324&single=true&output=csv",
    bracket: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRskeRn-mtzkR4JaGndzuwt_akX4SzWyF2IepdDiB7XA6LAUTgSNPGoypoaFbrsBzQDmgC2KjC4r8NY/pub?gid=1720400726&single=true&output=csv"
}; 

async function testURLs(){
  for (const [k,url] of Object.entries(URLS)){
    try{
      const r=await fetch(url,{cache:'no-store'});
      console.log(`${k}: ${r.status} → ${r.ok ? "✅ OK" : "❌ FALLA"}`);
      if(!r.ok){
        const txt = await r.text();
        console.warn("Respuesta:", txt.slice(0,150));
      }
    }catch(e){
      console.error(`⚠️ Error al conectar con ${k}:`, e.message);
    }
  }
}
testURLs();

const STATE = { filtros: { grupo: "", etapa: "" }, data: null };

// Función para obtener y parsear CSV desde una URL
async function fetchCSV(url) {
    const r = await fetch(url, { cache: "no-store" });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const text = await r.text();
    return csvToObjects(text);
}

// Función para convertir CSV a array de objetos
function csvToObjects(csv) {
    const rows = csv.trim().split(/\r?\n/).map(r => r.split(",").map(c => c.trim()));
    const headers = rows.shift();
    return rows.map(r => Object.fromEntries(headers.map((h, i) => [h, r[i] ?? ""])));
}

function renderJornadas(list) {
    list = sortList(list, 'j');
    const el = document.getElementById("jornadas-body");
    el.innerHTML = list.map((m, i) => `
    <tr data-i="${i}">
      <td>${m.fecha}</td><td>${m.hora}</td><td>${m.grupo}</td>
      <td>${m.local}</td><td>${m.visitante}</td>
      <td>${m.gLocal}-${m.gVisit}</td><td>${m.estado}</td>
    </tr>`).join("");

    // evento de clic
    [...el.querySelectorAll("tr")].forEach((row, i) => {
        row.onclick = () => showMatchDetail(list[i]);
    });
}

function showMatchDetail(m) {
    document.getElementById("m-partido").textContent = `${m.local} vs ${m.visitante}`;
    document.getElementById("m-grupo").textContent = m.grupo || "-";
    document.getElementById("m-marcador").textContent = `${m.gLocal}-${m.gVisit}`;
    document.getElementById("m-cancha").textContent = m.cancha || "No especificada";
    document.getElementById("m-arbitro").textContent = m.árbitro || m.arbitro || "Sin datos";
    document.getElementById("m-estado").textContent = m.estado;
    document.getElementById("modal").classList.remove("hidden");
}
document.getElementById("close-modal").onclick = () => {
    document.getElementById("modal").classList.add("hidden");
};


function renderClasificacion(list) {
    const el = document.getElementById("clasificacion-body");
    el.innerHTML = list.map(r => `
    <tr class="${r.pos == 1 ? 'leader' : ''}">
      <td>${r.pos == 1 ? '🥇 1' : r.pos || ''}</td>
      <td>${r.grupo || '-'}</td>
      <td>${r.equipo}</td>
      <td>${r.PJ || 0}</td>
      <td>${r.G || 0}</td>
      <td>${r.E || 0}</td>
      <td>${r.P || 0}</td>
      <td>${r.GF || 0}</td>
      <td>${r.GC || 0}</td>
      <td>${r.DG || 0}</td>
      <td>${r.Ptos || 0}</td>
    </tr>`).join("");
}


function renderGoleadores(list) {
    const el = document.getElementById("goleadores-body");
    el.innerHTML = list.map(x => `<tr><td>${x.jugador}</td><td>${x.equipo}</td><td>${x.goles}</td></tr>`).join("");
}

function renderSancionados(list) {
    const el = document.getElementById("sancionados-body");
    el.innerHTML = list.map(x => `<tr><td>${x.jugador}</td><td>${x.equipo}</td><td>${x.tipo}</td><td>${x.partidosRestantes}</td><td>${x.motivo}</td></tr>`).join("");
}

function renderNoticias(list) {
    const el = document.getElementById("noticias-list");
    el.innerHTML = list.map(n => `<li><strong>${n.fecha} — ${n.titulo}</strong><br>${n.cuerpo}</li>`).join("");
}

function renderBracket(list) {
    const el = document.getElementById("bracket-body");
    el.innerHTML = list.map(b => `<tr><td>${b.fase}</td><td>${b.clave}</td><td>${b.equipo1}</td><td>${b.equipo2}</td><td>${b.g1 ?? "-"}-${b.g2 ?? "-"}</td><td>${b.estado}</td></tr>`).join("");
}



document.addEventListener("change", (e) => {
    if (e.target.id === "f-grupo") { STATE.filtros.grupo = e.target.value; updateUI(); }
    if (e.target.id === "f-etapa") { STATE.filtros.etapa = e.target.value; updateUI(); }
});

// Función principal para cargar datos y renderizar
async function loadData() {
    const [equipos, jornadas, clasificacion, goleadores, sancionados, noticias, bracket] =
        await Promise.all([
            fetchCSV(URLS.equipos),
            fetchCSV(URLS.jornadas),
            fetchCSV(URLS.clasificacion),
            fetchCSV(URLS.goleadores),
            fetchCSV(URLS.sancionados),
            fetchCSV(URLS.noticias),
            fetchCSV(URLS.bracket),
        ]);

    STATE.data = { equipos, jornadas, clasificacion, goleadores, sancionados, noticias, bracket };

    renderGoleadores(goleadores);
    renderSancionados(sancionados);
    renderNoticias(noticias);
    renderBracket(bracket);

    updateUI();
}


// Carga datos al iniciar
loadData().catch(err => {
    console.error("Fallo cargando datos:", err);
    document.getElementById("app-status").textContent = "⚠️ Error al cargar datos.";
});

// Recarga automática cada 5 minutos
setInterval(() => {
    console.log("⟳ Actualizando datos...");
    loadData();
}, 5 * 60 * 1000);


// Cálculo automático de clasificación desde jornadas 
function tablaDesdePartidos(j) {
    const t = new Map(), upd = (e, gf, gc, w = 0, d = 0, l = 0, p = 0) => {
        const x = t.get(e) || { equipo: e, PJ: 0, G: 0, E: 0, P: 0, GF: 0, GC: 0, DG: 0, Ptos: 0 };
        x.PJ++; x.G += w; x.E += d; x.P += l; x.GF += +gf; x.GC += +gc; x.DG = x.GF - x.GC; x.Ptos += p; t.set(e, x);
    };
    j.filter(m => m.estado === 'Finalizado').forEach(m => {
        const a = +m.gLocal, b = +m.gVisit;
        if (a > b) { upd(m.local, a, b, 1, 0, 0, 3); upd(m.visitante, b, a, 0, 0, 1, 0); }
        else if (a < b) { upd(m.local, a, b, 0, 0, 1, 0); upd(m.visitante, b, a, 1, 0, 0, 3); }
        else { upd(m.local, a, b, 0, 1, 0, 1); upd(m.visitante, b, a, 0, 1, 0, 1); }
    });
    return [...t.values()].sort((x, y) => y.Ptos - x.Ptos || y.DG - x.DG || y.GF - x.GF);
}

function filtraJornadas(list) {
    const { grupo, etapa } = STATE.filtros;
    return list.filter(m => {
        const okG = !grupo || m.grupo === grupo;
        if (!etapa) return okG;
        // etapa por equipos (busca en DATA.equipos)
        const ne = (name) => STATE.data.equipos.find(x => x.nombre === name)?.etapa;
        return okG && (ne(m.local) === etapa || ne(m.visitante) === etapa);
    });
}

function tablaDesdePartidosPorGrupo(j) {
    const porG = new Map();
    j.filter(x => x.estado === "Finalizado").forEach(m => {
        const g = m.grupo || "-";
        if (!porG.has(g)) porG.set(g, new Map());
        const t = porG.get(g);
        const add = (e, gf, gc, p) => {
            const x = t.get(e) || { grupo: g, equipo: e, PJ: 0, G: 0, E: 0, P: 0, GF: 0, GC: 0, DG: 0, Ptos: 0 };
            x.PJ++; x.GF += +gf; x.GC += +gc; x.DG = x.GF - x.GC; x.Ptos += p;
            t.set(e, x);
        };
        const a = +m.gLocal, b = +m.gVisit;
        if (a > b) { add(m.local, a, b, 3); add(m.visitante, b, a, 0); porG.get(g).get(m.local).G = (porG.get(g).get(m.local).G || 0) + 1; porG.get(g).get(m.visitante).P = (porG.get(g).get(m.visitante).P || 0) + 1; }
        else if (a < b) { add(m.local, a, b, 0); add(m.visitante, b, a, 3); porG.get(g).get(m.visitante).G = (porG.get(g).get(m.visitante).G || 0) + 1; porG.get(g).get(m.local).P = (porG.get(g).get(m.local).P || 0) + 1; }
        else { add(m.local, a, b, 1); add(m.visitante, b, a, 1); porG.get(g).get(m.local).E = (porG.get(g).get(m.local).E || 0) + 1; porG.get(g).get(m.visitante).E = (porG.get(g).get(m.visitante).E || 0) + 1; }
    });
    // aplanar y ordenar por grupo
    const out = [];
    for (const [g, tab] of porG) {
        out.push(...[...tab.values()].sort((x, y) => y.Ptos - x.Ptos || y.DG - x.DG || y.GF - x.GF || x.equipo.localeCompare(y.equipo)));
    }
    return out;
}

function rankByGroup(rows) {
    const byG = new Map();
    rows.forEach(r => {
        const g = r.grupo || "-";
        if (!byG.has(g)) byG.set(g, []);
        byG.get(g).push({ ...r });
    });
    const out = [];
    for (const [g, list] of byG) {
        list.sort((a, b) => b.Ptos - a.Ptos || b.DG - a.DG || b.GF - a.GF || a.equipo.localeCompare(b.equipo));
        list.forEach((r, i) => r.pos = i + 1);
        out.push(...list); // líder queda 1º del grupo
    }
    return out;
}

const PAG = { j: { page: 1, size: 5 } };  // 5 partidos por página

function getPaged(list, t) {
    const { page, size } = PAG[t];
    const ini = (page - 1) * size, fin = ini + size;
    return list.slice(ini, fin);
}

function changePageJ(dir) {
    const total = Math.ceil(filtraJornadas(STATE.data.jornadas).length / PAG.j.size);
    PAG.j.page = Math.min(Math.max(PAG.j.page + dir, 1), total || 1);
    updateUI();
}
document.getElementById("prev-j").onclick = () => changePageJ(-1);
document.getElementById("next-j").onclick = () => changePageJ(1);


function updateUI() {
    if (!STATE.data) return;
    const { jornadas, clasificacion } = STATE.data;

    const jFil = filtraJornadas(jornadas);
    const paged = getPaged(jFil, 'j');
    renderJornadas(paged);

    const auto = tablaDesdePartidosPorGrupo(jFil);
    renderClasificacion(rankByGroup(auto.length ? auto : clasificacion));

    const total = Math.ceil(jFil.length / PAG.j.size);
    document.getElementById("pagina-j").textContent = `${PAG.j.page}/${total || 1}`;
    document.getElementById("app-status").textContent = "Datos cargados ✅";
}



const SORT = { j: { k: 'fecha', dir: 1 }, c: { k: 'Ptos', dir: -1 } };
document.addEventListener('click', (e) => {
    const th = e.target.closest('th[data-t][data-k]'); if (!th) return;
    const t = th.dataset.t, k = th.dataset.k;
    SORT[t].dir = (SORT[t].k === k ? -SORT[t].dir : 1);
    SORT[t].k = k;
    updateUI();
});

function sortList(list, t) {
    const { k, dir } = SORT[t];
    return [...list].sort((a, b) => {
        const val = (obj) => {
            if (k.includes(',')) { // marcador gLocal,gVisit
                const [g1, g2] = k.split(',');
                const d = (+obj[g1]) - (+obj[g2]);
                return [+(obj[g1] ?? 0), +(obj[g2] ?? 0), d];
            }
            const x = obj[k]; return isFinite(x) ? +x : String(x || '');
        };
        const A = val(a), B = val(b);
        return (A > B ? 1 : A < B ? -1 : 0) * dir;
    });
}

