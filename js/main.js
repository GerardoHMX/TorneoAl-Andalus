// --- main.js ---
import { loadAllData } from "./data.js";
import {
    renderJornadas,
    renderClasificacion,
    renderGoleadores,
    renderSancionados,
    renderNoticias,
    renderBracket
} from "./ui.js";


// Estado general
let STATE = { filtros: { etapa: "" }, data: null };
let semanaOffset = 0;

// --- control de semana ---
function getWeekRange(offset = 0) {
    const now = new Date();
    now.setDate(now.getDate() + offset * 7);
    const day = now.getDay() === 0 ? 7 : now.getDay();
    const start = new Date(now);
    start.setDate(now.getDate() - (day - 1));
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return { start, end };
}

function filtraPorSemana(list) {
    const { start, end } = getWeekRange(semanaOffset);
    return list.filter(m => {
        if (!m.fechaHora) return false;
        const d = new Date(m.fechaHora.replace(" ", "T"));
        return !isNaN(d) && d >= start && d <= end;
    });
}


// --- carga inicial ---
async function init() {
    STATE.data = await loadAllData();
    updateUI();
}

// --- actualización de interfaz ---
function updateUI() {
    if (!STATE.data) return;

    const { jornadas, clasificacion, goleadores, sancionados, noticias, bracket } = STATE.data;

    const etapaSel = STATE.filtros.etapa;
    const jEtapa = etapaSel ? jornadas.filter(j => j.etapa === etapaSel) : jornadas;
    const semFil = filtraPorSemana(jEtapa);

    // Determinar si la fase de grupos ha terminado
    const gruposTerminados = jEtapa.every(j => j.estado === "Finalizado");

    // Si todos los partidos están finalizados, congelamos la clasificación
    if (gruposTerminados && !STATE.gruposCerrados) {
        console.log("✅ Fase de grupos finalizada — puntos congelados");
        STATE.gruposCerrados = true;
    }


    // Jornadas y Clasificación
    renderJornadas(semFil);
    renderClasificacion(clasificacion);

    // Goleadores, sancionados, noticias y bracket
    renderGoleadores(goleadores);
    renderSancionados(sancionados);
    renderNoticias(noticias);
    renderBracket(bracket);

    // Etiqueta de la semana
    const { start, end } = getWeekRange(semanaOffset);
    const label = document.getElementById("semana-label");
    if (label) {
        label.textContent = `Del ${start.toLocaleDateString("es-ES", { day: "2-digit", month: "short" })} al ${end.toLocaleDateString("es-ES", { day: "2-digit", month: "short" })}`;
    }

    document.getElementById("app-status").textContent = "Datos cargados ✅";
}


// --- eventos ---
window.addEventListener("load", () => {
    document.getElementById("semana-prev").onclick = () => { semanaOffset--; updateUI(); };
    document.getElementById("semana-next").onclick = () => { semanaOffset++; updateUI(); };
    document.getElementById("f-etapa").onchange = e => { STATE.filtros.etapa = e.target.value; updateUI(); };
    init();
});
