// --- main.js ---
import { loadAllData } from "./data.js";
import {
    tablaEquipos,
    tablaResultadosFaseDeGrupos,
    tablaResultadosSemifinal,
    tablaResultadosTercerPuesto,
    tablaResultadosFinal,
    tablaClasificacion,
    tablaLideresGoleadores,
    tablaSancionados,
    renderNoticias,
    renderClasificacion
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

init();

// --- carga inicial ---
async function init() {
    STATE.data = await loadAllData();
    updateUI();
}

// --- actualización de interfaz ---
function updateUI() {
    if (!STATE.data) return;

    const { CLASIFICACION, EQUIPOS, LIDERES, SANCIONES, NOTICIAS } = STATE.data;

    // Jornadas y Clasificación
    tablaEquipos(STATE.data.EQUIPOS);
    tablaResultadosFaseDeGrupos(STATE.data.CLASIFICACION);
    tablaResultadosSemifinal(STATE.data.CLASIFICACION);
    tablaResultadosTercerPuesto(STATE.data.CLASIFICACION);
    tablaResultadosFinal(STATE.data.CLASIFICACION);
    tablaClasificacion(STATE.data.CLASIFICACION);
    renderClasificacion(STATE.data.CLASIFICACION, "ESO");
    renderClasificacion(STATE.data.CLASIFICACION, "BCH");
    tablaLideresGoleadores(STATE.data.LIDERES, "ESO");
    tablaLideresGoleadores(STATE.data.LIDERES, "BCH");
    tablaSancionados(STATE.data.SANCIONES, "ESO");
    tablaSancionados(STATE.data.SANCIONES, "BCH");
    renderNoticias(STATE.data.NOTICIAS);

    // Etiqueta de la semana
    const { start, end } = getWeekRange(semanaOffset);
    const label = document.getElementById("semana-label");
    if (label) {
        label.textContent = `Del ${start.toLocaleDateString("es-ES", { day: "2-digit", month: "short" })} al ${end.toLocaleDateString("es-ES", { day: "2-digit", month: "short" })}`;
    }
 
}