// --- main.js ---
import { loadAllData } from "./data.js";
import {
    tablaEquipos,
    tablaResultadosFaseDeGrupos,
    tablaResultadosSemifinal,
    tablaResultadosTercerFinalPuesto, 
    tablaClasificacion,
    tablaResultados,
    tablaLideresGoleadores,
    tablaSancionados,
    renderNoticias,
    renderBracket,
    renderProximosPartidos
} from "./ui.js";


// Estado general
let STATE = { 
    filtros: { etapa: "" }, 
    data: null,
    ciclosSeleccionados: {
        equipos: "TODOS",
        jornadas: "TODOS",
        clasificacion: "TODOS",
        bracket: "TODOS",
        goleadores: "TODOS",
        sancionados: "TODOS",
        resultados: "TODOS",
        proximosPartidos: "TODOS"
    },
    grupoSeleccionado: {
        equipos: "TODOS"
    }
};
let semanaOffset = 0;
let semanaOffsetProximosPartidos = 0;

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

// --- Encontrar la semana del partido más cercano a la fecha actual ---
function encontrarSemanaPartidoMasCercano(clasificacion) {
    if (!clasificacion || clasificacion.length === 0) return 0;

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    let partidoMasCercano = null;
    let fechaMasCercana = null;

    // Buscar el partido más cercano sin marcador
    clasificacion.forEach(partido => {
        // Verificar que tenga fecha y equipos
        if (!partido.DIA || !partido.MES || !partido.LOCAL || !partido.VISITANTE) return;
        
        // Verificar que no tenga marcador (es un partido futuro)
        const sinMarcador = (!partido.LSCORE || partido.LSCORE === '0' || partido.LSCORE === '') && 
                           (!partido.VSCORE || partido.VSCORE === '0' || partido.VSCORE === '');
        if (!sinMarcador) return;

        // Construir fecha del partido
        const anio = partido.ANIO ? parseInt(partido.ANIO) : new Date().getFullYear();
        const mes = parseInt(partido.MES) - 1; // Los meses en JS son 0-indexed
        const dia = parseInt(partido.DIA);
        const fechaPartido = new Date(anio, mes, dia);
        fechaPartido.setHours(0, 0, 0, 0);

        // Solo considerar partidos futuros o de hoy
        if (fechaPartido >= hoy) {
            if (!fechaMasCercana || fechaPartido < fechaMasCercana) {
                fechaMasCercana = fechaPartido;
                partidoMasCercano = partido;
            }
        }
    });

    if (!fechaMasCercana) return 0;

    // Calcular en qué semana está el partido más cercano
    const hoySemana = getWeekRange(0);
    const fechaPartido = fechaMasCercana;
    
    // Si el partido está en la semana actual o futura
    if (fechaPartido >= hoySemana.start) {
        const diffDias = Math.floor((fechaPartido - hoySemana.start) / (1000 * 60 * 60 * 24));
        const offset = Math.floor(diffDias / 7);
        return offset;
    }

    return 0;
}

// --- Filtrar próximos partidos por semana y ciclo ---
function filtrarProximosPartidos(clasificacion, semanaOffset, ciclo) {
    if (!clasificacion || clasificacion.length === 0) return [];

    const { start, end } = getWeekRange(semanaOffset);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    // Filtrar partidos que:
    // 1. Tengan fecha válida (DIA, MES, ANIO)
    // 2. Estén en el futuro o sean de la semana seleccionada
    // 3. No tengan marcador (LSCORE y VSCORE vacíos o 0)
    // 4. Coincidan con el ciclo seleccionado (si no es TODOS)
    
    return clasificacion.filter(partido => {
        // Verificar que tenga fecha
        if (!partido.DIA || !partido.MES) return false;
        
        // Construir fecha del partido
        const anio = partido.ANIO ? parseInt(partido.ANIO) : new Date().getFullYear();
        const mes = parseInt(partido.MES) - 1; // Los meses en JS son 0-indexed
        const dia = parseInt(partido.DIA);
        const fechaPartido = new Date(anio, mes, dia);
        fechaPartido.setHours(0, 0, 0, 0);

        // Verificar que esté en el rango de la semana seleccionada
        const estaEnSemana = fechaPartido >= start && fechaPartido <= end;
        // Verificar que no tenga marcador (es un partido futuro)
        const sinMarcador = (!partido.LSCORE || partido.LSCORE === '0' || partido.LSCORE === '') && 
                           (!partido.VSCORE || partido.VSCORE === '0' || partido.VSCORE === '');

        // Verificar ciclo
        const coincideCiclo = ciclo === "TODOS" || partido.CICLO === ciclo;
        // Verificar que tenga equipos definidos
        const tieneEquipos = partido.LOCAL && partido.VISITANTE;
        return estaEnSemana && sinMarcador && coincideCiclo && tieneEquipos;
    });
}

// --- carga inicial ---
async function init() {
    STATE.data = await loadAllData();
    
    // Encontrar la semana con el partido más cercano y establecer el offset inicial
    if (STATE.data && STATE.data.CLASIFICACION) {
        semanaOffsetProximosPartidos = encontrarSemanaPartidoMasCercano(STATE.data.CLASIFICACION);
    }
    
    requestAnimationFrame(() => {
        initCicloSelectors();
        updateUI();
    });
}

// Esperar a que el DOM esté completamente cargado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    requestAnimationFrame(init);
}

// --- actualización de interfaz ---
function updateUI() {
    if (!STATE.data) return;

    const { CLASIFICACION, EQUIPOS, LIDERES, SANCIONES, NOTICIAS } = STATE.data;
    const ciclos = STATE.ciclosSeleccionados;

    // Equipos
    const grupoEquipos = STATE.grupoSeleccionado.equipos || "TODOS";
    if (ciclos.equipos === "TODOS") {
        tablaEquipos(STATE.data.EQUIPOS, "ESO", grupoEquipos);
        tablaEquipos(STATE.data.EQUIPOS, "BCH", grupoEquipos);
    } else {
        tablaEquipos(STATE.data.EQUIPOS, ciclos.equipos, grupoEquipos);
        const otroCiclo = ciclos.equipos === "ESO" ? "BCH" : "ESO";
        const otroDiv = document.getElementById("equipos-" + otroCiclo);
        if (otroDiv) otroDiv.innerHTML = "";
    }
    
    // Jornadas
    if (ciclos.jornadas === "TODOS") {
        tablaResultadosFaseDeGrupos(STATE.data.CLASIFICACION, "ESO");
        tablaResultadosFaseDeGrupos(STATE.data.CLASIFICACION, "BCH");
        tablaResultadosSemifinal(STATE.data.CLASIFICACION, "ESO");
        tablaResultadosSemifinal(STATE.data.CLASIFICACION, "BCH");
        tablaResultadosTercerFinalPuesto(STATE.data.CLASIFICACION, "ESO");
        tablaResultadosTercerFinalPuesto(STATE.data.CLASIFICACION, "BCH");
    } else {
        tablaResultadosFaseDeGrupos(STATE.data.CLASIFICACION, ciclos.jornadas);
        tablaResultadosSemifinal(STATE.data.CLASIFICACION, ciclos.jornadas);
        tablaResultadosTercerFinalPuesto(STATE.data.CLASIFICACION, ciclos.jornadas);
        const otroCiclo = ciclos.jornadas === "ESO" ? "BCH" : "ESO";
        ["fase-de-grupos", "semifinal", "tercer-final-puesto"].forEach(tipo => {
            const otroDiv = document.getElementById(`${tipo}-${otroCiclo}`);
            if (otroDiv) {
                otroDiv.innerHTML = "";
                // Quitar clases que se agregan para mostrar la sección
                otroDiv.classList.remove("mb-6", "mt-6", "grid", "grid-cols-1", "md:grid-cols-2", "gap-6", "overflow-x-auto");
            }
        });
    }

    // Clasificación
    if (ciclos.clasificacion === "TODOS") {
        tablaClasificacion(STATE.data.CLASIFICACION, "ESO");
        tablaClasificacion(STATE.data.CLASIFICACION, "BCH");
    } else {
        tablaClasificacion(STATE.data.CLASIFICACION, ciclos.clasificacion);
        const otroCiclo = ciclos.clasificacion === "ESO" ? "BCH" : "ESO";
        const otroDiv = document.getElementById("clasificacion-" + otroCiclo);
        if (otroDiv) {
            otroDiv.innerHTML = "";
            otroDiv.classList.remove("overflow-x-auto", "mb-6", "mt-6");
        }
    }

    // Resultados
    if (ciclos.resultados === "TODOS") {
        tablaResultados(STATE.data.CLASIFICACION, "ESO");
        tablaResultados(STATE.data.CLASIFICACION, "BCH");
    } else {
        tablaResultados(STATE.data.CLASIFICACION, ciclos.resultados);
        // Limpiar el otro contenedor
        const otroCiclo = ciclos.resultados === "ESO" ? "BCH" : "ESO";
        const otroDiv = document.getElementById("resultados-" + otroCiclo);
        if (otroDiv) {
            otroDiv.innerHTML = "";
            otroDiv.classList.remove("overflow-x-auto", "mb-6", "mt-6");
        }
    }

    // Bracket
    if (ciclos.bracket === "TODOS") {
        renderBracket(STATE.data.CLASIFICACION, "ESO");
        renderBracket(STATE.data.CLASIFICACION, "BCH");
    } else {
        renderBracket(STATE.data.CLASIFICACION, ciclos.bracket);
        const otroCiclo = ciclos.bracket === "ESO" ? "BCH" : "ESO";
        const otroDiv = document.getElementById("bracket-" + otroCiclo);
        if (otroDiv) {
            otroDiv.innerHTML = "";
            otroDiv.classList.remove("mb-6", "mt-6");
        }
    }

    // Líderes Goleadores
    if (ciclos.goleadores === "TODOS") {
        tablaLideresGoleadores(STATE.data.LIDERES, "ESO");
        tablaLideresGoleadores(STATE.data.LIDERES, "BCH");
    } else {
        tablaLideresGoleadores(STATE.data.LIDERES, ciclos.goleadores);
        const otroCiclo = ciclos.goleadores === "ESO" ? "BCH" : "ESO";
        const otroDiv = document.getElementById("goleadores-" + otroCiclo);
        if (otroDiv) {
            otroDiv.innerHTML = "";
            otroDiv.classList.remove("mb-6", "mt-6");
        }
    }

    // Sancionados
    if (ciclos.sancionados === "TODOS") {
        tablaSancionados(STATE.data.SANCIONES, "ESO");
        tablaSancionados(STATE.data.SANCIONES, "BCH");
    } else {
        tablaSancionados(STATE.data.SANCIONES, ciclos.sancionados);
        const otroCiclo = ciclos.sancionados === "ESO" ? "BCH" : "ESO";
        const otroDiv = document.getElementById("sancionados-" + otroCiclo);
        if (otroDiv) {
            otroDiv.innerHTML = "";
            otroDiv.classList.remove("mb-6", "mt-6");
        }
    }
    
    renderNoticias(STATE.data.NOTICIAS);

    actualizarGruposDisponibles(ciclos.equipos);

    // Próximos Partidos
    const partidosFiltrados = filtrarProximosPartidos(
        STATE.data.CLASIFICACION,
        semanaOffsetProximosPartidos,
        ciclos.proximosPartidos
    );
    renderProximosPartidos(partidosFiltrados);

    // Etiqueta de la semana para próximos partidos
    const { start, end } = getWeekRange(semanaOffsetProximosPartidos);
    const label = document.getElementById("semana-label");
    if (label) {
        const diasSemana = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];
        const diaSemana = diasSemana[start.getDay()];
        const dia = String(start.getDate()).padStart(2, '0');
        const mes = String(start.getMonth() + 1).padStart(2, '0');
        label.textContent = `${dia}/${mes} ${diaSemana}`;
    }
 
}

// --- Función para actualizar ciclo seleccionado ---
function actualizarCiclo(seccion, ciclo) {
    STATE.ciclosSeleccionados[seccion] = ciclo;
    if (seccion === "equipos") {
        actualizarGruposDisponibles(ciclo);
    }
    updateUI();
}

// --- Función para actualizar grupo seleccionado ---
function actualizarGrupo(seccion, grupo) {
    STATE.grupoSeleccionado[seccion] = grupo;
    updateUI();
}

// --- Función para actualizar grupos disponibles según el ciclo ---
function actualizarGruposDisponibles(ciclo) {
    if (!STATE.data || !STATE.data.EQUIPOS) return;
    
    const selectorGrupos = document.getElementById("selector-grupos-equipos");
    if (!selectorGrupos) return;
    
    const gruposValidos = ["A", "B", "C", "D"];    
    const gruposDisponibles = new Set();
    STATE.data.EQUIPOS.forEach(equipo => {
        if (equipo.GRUPO && gruposValidos.includes(equipo.GRUPO)) {
            if (ciclo === "TODOS" || equipo.CICLO === ciclo) {
                gruposDisponibles.add(equipo.GRUPO);
            }
        }
    });
    
    const botonesGrupos = selectorGrupos.querySelectorAll('button[data-grupo]');
    botonesGrupos.forEach(boton => {
        const grupo = boton.getAttribute('data-grupo');
        if (grupo === "TODOS") {
            boton.parentElement.style.display = "flex";
        } else {
            if (gruposDisponibles.has(grupo)) {
                boton.parentElement.style.display = "flex";
            } else {
                boton.parentElement.style.display = "none";
                if (STATE.grupoSeleccionado.equipos === grupo) {
                    STATE.grupoSeleccionado.equipos = "TODOS";
                    botonesGrupos.forEach(btn => {
                        btn.classList.remove('active');
                        if (btn.getAttribute('data-grupo') === "TODOS") {
                            btn.classList.add('active');
                        }
                    });
                }
            }
        }
    });
}

// --- Inicializar selectores de ciclo ---
function initCicloSelectors() {
    const selectors = [
        { id: 'selector-equipos', seccion: 'equipos' },
        { id: 'selector-jornadas', seccion: 'jornadas' },
        { id: 'selector-clasificacion', seccion: 'clasificacion' },
        { id: 'selector-bracket', seccion: 'bracket' },
        { id: 'selector-goleadores', seccion: 'goleadores' },
        { id: 'selector-sancionados', seccion: 'sancionados' },
        { id: 'selector-resultados', seccion: 'resultados' },
        { id: 'selector-proximos-partidos', seccion: 'proximosPartidos' }
    ];

    selectors.forEach(({ id, seccion }) => {
        const navTabs = document.getElementById(id);
        if (navTabs) {
            const buttons = navTabs.querySelectorAll('button[data-ciclo]');
            buttons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const ciclo = button.getAttribute('data-ciclo');
                    
                    buttons.forEach(btn => {
                        btn.classList.remove('active');
                    });
                    
                    button.classList.add('active');
                    actualizarCiclo(seccion, ciclo);
                });
            });
        }
    });

    // Inicializar selector de grupos para equipos
    const selectorGrupos = document.getElementById('selector-grupos-equipos');
    if (selectorGrupos) {
        const buttons = selectorGrupos.querySelectorAll('button[data-grupo]');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const grupo = button.getAttribute('data-grupo');                
                buttons.forEach(btn => {
                    btn.classList.remove('active');
                });
                
                button.classList.add('active');
                actualizarGrupo('equipos', grupo);
            });
        });
    }
    
    // Event listeners para navegación de semanas en próximos partidos
    const semanaAnterior = document.getElementById("semana-anterior");
    const semanaSiguiente = document.getElementById("semana-siguiente");

    if (semanaAnterior) {
        semanaAnterior.addEventListener('click', () => {
            semanaOffsetProximosPartidos--;
            updateUI();
        });
    }

    if (semanaSiguiente) {
        semanaSiguiente.addEventListener('click', () => {
            semanaOffsetProximosPartidos++;
            updateUI();
        });
    }
}