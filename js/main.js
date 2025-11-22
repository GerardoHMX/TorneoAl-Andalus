// --- main.js ---
import { loadAllData } from "./data.js";
import {
    tablaEquipos,
    tablaResultadosFaseDeGrupos,
    tablaResultadosSemifinal,
    tablaResultadosTercerFinalPuesto, 
    tablaClasificacion,
    tablaClasificacionGrupal,
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
        clasificacionGrupal: "TODOS",
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
let diaOffsetProximosPartidos = 0; // Offset en días para navegación día por día

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

// --- Encontrar los días relevantes para próximos partidos ---
// Retorna un objeto con { diaInicio, diaFin } que representa el día actual y el siguiente
// Si es sábado/domingo o no hay partidos, busca el siguiente día más próximo con partidos
// offsetDias: permite navegar día por día (0 = hoy, 1 = mañana, -1 = ayer, etc.)
function encontrarDiasRelevantes(clasificacion, ciclo, offsetDias = 0) {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    // Aplicar offset para navegación día por día
    const fechaBase = new Date(hoy);
    fechaBase.setDate(hoy.getDate() + offsetDias);
    fechaBase.setHours(0, 0, 0, 0);
    
    const diaSemana = fechaBase.getDay(); // 0 = domingo, 6 = sábado
    
    console.log('encontrarDiasRelevantes iniciado:', {
        hoy: hoy.toLocaleDateString('es-ES'),
        fechaBase: fechaBase.toLocaleDateString('es-ES'),
        offsetDias,
        diaSemana,
        totalPartidos: clasificacion?.length || 0
    });
    
    // Función auxiliar para verificar si un partido es válido
    // Único criterio: debe tener equipos definidos (LOCAL y VISITANTE)
    // NO considera el ciclo para buscar días
    const esPartidoValido = (partido) => {
        if (!partido || !partido.DIA || !partido.MES) return false;
        
        try {
            const anio = partido.ANIO ? parseInt(partido.ANIO) : new Date().getFullYear();
            const mes = parseInt(partido.MES);
            const dia = parseInt(partido.DIA);
            
            // Validar valores numéricos
            if (isNaN(mes) || isNaN(dia) || mes < 1 || mes > 12 || dia < 1 || dia > 31) {
                return false;
            }
            
            const fechaPartido = new Date(anio, mes - 1, dia);
            fechaPartido.setHours(0, 0, 0, 0);
            
            if (isNaN(fechaPartido.getTime())) {
                return false;
            }
            
            // Único criterio: verificar que tenga equipos definidos
            const tieneEquipos = partido.LOCAL && String(partido.LOCAL).trim() !== '' &&
                                 partido.VISITANTE && String(partido.VISITANTE).trim() !== '';
            
            return tieneEquipos;
        } catch (error) {
            return false;
        }
    };
    
    // Función para verificar si hay partidos en un día específico (sin considerar ciclo)
    const hayPartidosEnDia = (fecha) => {
        return clasificacion.some(partido => {
            if (!esPartidoValido(partido)) return false;
            
            const anio = partido.ANIO ? parseInt(partido.ANIO) : new Date().getFullYear();
            const mes = parseInt(partido.MES) - 1;
            const dia = parseInt(partido.DIA);
            const fechaPartido = new Date(anio, mes, dia);
            fechaPartido.setHours(0, 0, 0, 0);
            
            return fechaPartido.getTime() === fecha.getTime();
        });
    };
    
    // Función para verificar si un día es sábado o domingo
    const esFinDeSemana = (fecha) => {
        const diaSemanaFecha = fecha.getDay();
        return diaSemanaFecha === 0 || diaSemanaFecha === 6; // 0 = domingo, 6 = sábado
    };
    
    // Función para encontrar el siguiente día laboral (lunes a viernes)
    const siguienteDiaLaboral = (fecha) => {
        const siguiente = new Date(fecha);
        siguiente.setDate(fecha.getDate() + 1);
        
        const diaSemana = siguiente.getDay();
        
        // Si es sábado (6), saltar al lunes (sumar 2 días)
        if (diaSemana === 6) {
            siguiente.setDate(siguiente.getDate() + 2);
        }
        // Si es domingo (0), saltar al lunes (sumar 1 día)
        else if (diaSemana === 0) {
            siguiente.setDate(siguiente.getDate() + 1);
        }
        
        return siguiente;
    };
    
    // Función para encontrar el siguiente día laboral con partidos hacia adelante
    const siguienteDiaConPartidos = (fechaInicio) => {
        let fechaBusqueda = siguienteDiaLaboral(fechaInicio);
        let diasBuscados = 0;
        const maxDias = 60; // Buscar hasta 2 meses adelante
        
        while (diasBuscados < maxDias) {
            if (!esFinDeSemana(fechaBusqueda) && hayPartidosEnDia(fechaBusqueda)) {
                return fechaBusqueda;
            }
            fechaBusqueda = siguienteDiaLaboral(fechaBusqueda);
            diasBuscados++;
        }
        
        // Si no se encuentra, retornar el siguiente día laboral como fallback
        return siguienteDiaLaboral(fechaInicio);
    };
    
    // Función para encontrar el día laboral anterior con partidos hacia atrás
    const anteriorDiaConPartidos = (fechaInicio) => {
        let fechaBusqueda = new Date(fechaInicio);
        fechaBusqueda.setDate(fechaInicio.getDate() - 1);
        let diasBuscados = 0;
        const maxDias = 60; // Buscar hasta 2 meses atrás
        
        while (diasBuscados < maxDias) {
            // Si es fin de semana, retroceder al viernes anterior
            if (esFinDeSemana(fechaBusqueda)) {
                const diaSemana = fechaBusqueda.getDay();
                if (diaSemana === 0) { // Domingo
                    fechaBusqueda.setDate(fechaBusqueda.getDate() - 2);
                } else if (diaSemana === 6) { // Sábado
                    fechaBusqueda.setDate(fechaBusqueda.getDate() - 1);
                }
            }
            
            if (!esFinDeSemana(fechaBusqueda) && hayPartidosEnDia(fechaBusqueda)) {
                return fechaBusqueda;
            }
            
            fechaBusqueda.setDate(fechaBusqueda.getDate() - 1);
            diasBuscados++;
        }
        
        // Si no se encuentra, retornar el día anterior como fallback
        fechaBusqueda = new Date(fechaInicio);
        fechaBusqueda.setDate(fechaInicio.getDate() - 1);
        if (esFinDeSemana(fechaBusqueda)) {
            const diaSemana = fechaBusqueda.getDay();
            if (diaSemana === 0) {
                fechaBusqueda.setDate(fechaBusqueda.getDate() - 2);
            } else if (diaSemana === 6) {
                fechaBusqueda.setDate(fechaBusqueda.getDate() - 1);
            }
        }
        return fechaBusqueda;
    };
    
    // Si hay offset (navegación manual), buscar días con partidos
    if (offsetDias !== 0) {
        let diaInicio;
        
        if (offsetDias > 0) {
            // Avanzar: buscar el siguiente día con partidos
            // Empezar desde hoy + offset días
            let fechaBusqueda = new Date(fechaBase);
            if (esFinDeSemana(fechaBusqueda)) {
                fechaBusqueda = siguienteDiaLaboral(fechaBusqueda);
            }
            
            // Buscar el día correspondiente al offset
            for (let i = 0; i < offsetDias; i++) {
                fechaBusqueda = siguienteDiaConPartidos(fechaBusqueda);
            }
            
            diaInicio = fechaBusqueda;
            
            // Si es avanzar, mostrar 2 días: el consultado y el siguiente con partidos
            const diaFin = siguienteDiaConPartidos(diaInicio);
            return { diaInicio, diaFin };
        } else {
            // Retroceder: buscar el día anterior con partidos
            let fechaBusqueda = new Date(fechaBase);
            if (esFinDeSemana(fechaBusqueda)) {
                fechaBusqueda = anteriorDiaConPartidos(fechaBusqueda);
            }
            
            // Buscar el día correspondiente al offset (negativo)
            for (let i = 0; i < Math.abs(offsetDias); i++) {
                fechaBusqueda = anteriorDiaConPartidos(fechaBusqueda);
            }
            
            diaInicio = fechaBusqueda;
            
            // Si es retroceder, mostrar solo 1 día: el consultado
            return { diaInicio, diaFin: diaInicio };
        }
    }
    
    // Si es sábado (6) o domingo (0), buscar el siguiente día laboral más próximo con partidos
    if (diaSemana === 0 || diaSemana === 6) {
        let fechaBusqueda = siguienteDiaLaboral(fechaBase);
        let diasBuscados = 0;
        const maxDias = 14; // Buscar hasta 2 semanas adelante
        
        while (diasBuscados < maxDias) {
            // Verificar que no sea fin de semana
            if (!esFinDeSemana(fechaBusqueda) && hayPartidosEnDia(fechaBusqueda)) {
                // Siempre retornar el día encontrado y el siguiente día laboral
                const diaFin = siguienteDiaLaboral(fechaBusqueda);
                return { diaInicio: fechaBusqueda, diaFin };
            }
            
            fechaBusqueda = siguienteDiaLaboral(fechaBusqueda);
            diasBuscados++;
        }
        
        // Si no se encontró ningún día con partidos, usar el siguiente lunes y martes como fallback
        const diaInicio = siguienteDiaLaboral(fechaBase);
        const diaFin = siguienteDiaLaboral(diaInicio);
        return { diaInicio, diaFin };
    }
    
    // Si es día laboral, verificar si hay partidos en fechaBase
    if (hayPartidosEnDia(fechaBase)) {
        const manana = siguienteDiaLaboral(fechaBase);
        
        // Siempre retornar fechaBase y el siguiente día laboral
        return { diaInicio: fechaBase, diaFin: manana };
    }
    
    // Si no hay partidos en fechaBase, buscar el siguiente día laboral más próximo con partidos
    let fechaBusqueda = siguienteDiaLaboral(fechaBase);
    let diasBuscados = 0;
    const maxDias = 14;
    
    while (diasBuscados < maxDias) {
        // Verificar que no sea fin de semana
        if (!esFinDeSemana(fechaBusqueda) && hayPartidosEnDia(fechaBusqueda)) {
            // Siempre retornar el día encontrado y el siguiente día laboral
            const diaFin = siguienteDiaLaboral(fechaBusqueda);
            return { diaInicio: fechaBusqueda, diaFin };
        }
        
        fechaBusqueda = siguienteDiaLaboral(fechaBusqueda);
        diasBuscados++;
    }
    
    // Fallback: usar el siguiente lunes y martes
    const diaInicio = siguienteDiaLaboral(fechaBase);
    const diaFin = siguienteDiaLaboral(diaInicio);
    return { diaInicio, diaFin };
}

// --- Filtrar próximos partidos por ciclo, equipos y rango de fechas ---
function filtrarProximosPartidos(clasificacion, ciclo, diaInicio, diaFin) {
    if (!clasificacion || !Array.isArray(clasificacion) || clasificacion.length === 0) {
        console.warn('filtrarProximosPartidos: clasificacion vacía o inválida');
        return [];
    }

    // Si no se proporcionan días, calcularlos
    if (!diaInicio || !diaFin) {
        const dias = encontrarDiasRelevantes(clasificacion, ciclo);
        diaInicio = dias.diaInicio;
        diaFin = dias.diaFin;
    }
    
    // Asegurar que las fechas estén normalizadas
    diaInicio.setHours(0, 0, 0, 0);
    diaFin.setHours(0, 0, 0, 0);

    console.log('Filtrando partidos:', {
        diaInicio: diaInicio.toLocaleDateString('es-ES'),
        diaFin: diaFin.toLocaleDateString('es-ES'),
        totalPartidos: clasificacion.length
    });

    // Filtrar partidos que:
    // 1. Tengan fecha válida (DIA, MES, ANIO)
    // 2. Estén en el rango de días seleccionados (diaInicio y diaFin, inclusive)
    // 3. Tengan equipos definidos (LOCAL y VISITANTE)
    
    const partidosFiltrados = clasificacion.filter(partido => {
        // Verificar que tenga datos básicos y fecha
        if (!partido || !partido.DIA || !partido.MES) return false;
        
        try {
            // Construir fecha del partido
            const anio = partido.ANIO ? parseInt(partido.ANIO) : new Date().getFullYear();
            const mes = parseInt(partido.MES);
            const dia = parseInt(partido.DIA);
            
            // Validar que los valores sean números válidos
            if (isNaN(mes) || isNaN(dia) || mes < 1 || mes > 12 || dia < 1 || dia > 31) {
                return false;
            }
            
            const fechaPartido = new Date(anio, mes - 1, dia); // Los meses en JS son 0-indexed
            fechaPartido.setHours(0, 0, 0, 0);
            
            // Validar que la fecha sea válida
            if (isNaN(fechaPartido.getTime())) {
                return false;
            }

            // Verificar que esté en el rango de días seleccionados (inclusive)
            const estaEnRango = fechaPartido.getTime() >= diaInicio.getTime() && 
                               fechaPartido.getTime() <= diaFin.getTime();
            
            // Verificar que tenga equipos definidos
            const tieneEquipos = partido.LOCAL && String(partido.LOCAL).trim() !== '' &&
                                 partido.VISITANTE && String(partido.VISITANTE).trim() !== '';
            
            const cumple = estaEnRango && tieneEquipos;
            
            // Debug: Log detallado para partidos que están en rango pero no cumplen todos los criterios
            if (estaEnRango && !cumple) {
                console.log('Partido descartado:', {
                    fecha: fechaPartido.toLocaleDateString('es-ES'),
                    local: partido.LOCAL,
                    visitante: partido.VISITANTE,
                    estaEnRango,
                    tieneEquipos
                });
            }
            
            return cumple;
        } catch (error) {
            console.warn('Error al filtrar partido:', partido, error);
            return false;
        }
    });

    console.log('Partidos filtrados encontrados:', partidosFiltrados.length);
    return partidosFiltrados;
}

// --- Función para validar valor booleano ---
function esVerdadero(valor) {
    const valorStr = (valor || '').toString().trim().toUpperCase();
    return valorStr === 'SI';
}

// --- Función para encontrar elemento por ID ---
function encontrarElementoPorId(id) {
    if (!id) return null;
    
    // Buscar directamente con el ID proporcionado
    const elemento = document.getElementById(id);
    return elemento;
}

// --- Función para generar navegación dinámica ---
function generarNavegacion(otros = []) {
    if (!otros || otros.length === 0) {
        console.warn('No hay datos de OTROS para generar la navegación');
        return;
    }

    // Filtrar secciones que deben aparecer en el menú (MENU = "SI")
    const seccionesEnMenu = otros.filter((item, index) => {
        // Intentar diferentes variaciones de nombres de columnas (case-insensitive)
        const keys = Object.keys(item);
        const menuKey = keys.find(k => k.toUpperCase() === 'MENU') || keys.find(k => k.toLowerCase() === 'menu');
        const seccionKey = keys.find(k => k.toUpperCase() === 'SECCION') || keys.find(k => k.toLowerCase() === 'seccion');
        const nombreKey = keys.find(k => k.toUpperCase() === 'NOMBRE') || keys.find(k => k.toLowerCase() === 'nombre');
        
        const menu = menuKey ? (item[menuKey] || '').toString().trim() : '';
        const seccion = seccionKey ? (item[seccionKey] || '').toString().trim() : '';
        const nombre = nombreKey ? (item[nombreKey] || '').toString().trim() : '';
        
        const estaEnMenu = esVerdadero(menu);
        
        return estaEnMenu && seccion && nombre && nombre !== '-';
    });

    // Ordenar por algún campo si existe (por ejemplo, ORDEN), o mantener el orden original
    seccionesEnMenu.sort((a, b) => {
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);
        const ordenKeyA = keysA.find(k => k.toUpperCase() === 'ORDEN') || keysA.find(k => k.toLowerCase() === 'orden');
        const ordenKeyB = keysB.find(k => k.toUpperCase() === 'ORDEN') || keysB.find(k => k.toLowerCase() === 'orden');
        
        const ordenA = ordenKeyA ? parseInt(a[ordenKeyA] || '0') || 0 : 0;
        const ordenB = ordenKeyB ? parseInt(b[ordenKeyB] || '0') || 0 : 0;
        return ordenA - ordenB;
    });

    // Generar navegación Desktop
    const desktopNav = document.getElementById('desktopNav');
    if (desktopNav) {
        desktopNav.innerHTML = seccionesEnMenu.map(item => {
            // Obtener las keys de cada item individualmente
            const keys = Object.keys(item);
            const seccionKey = keys.find(k => k.toUpperCase() === 'SECCION') || keys.find(k => k.toLowerCase() === 'seccion');
            const nombreKey = keys.find(k => k.toUpperCase() === 'NOMBRE') || keys.find(k => k.toLowerCase() === 'nombre');
            
            const seccion = seccionKey ? (item[seccionKey] || '').toString().trim() : '';
            const nombre = nombreKey ? (item[nombreKey] || '').toString().trim() : '';
            
            if (!seccion || !nombre || nombre === '-') return '';                        
            const href = '#' + seccion;
            return `<a href="${href}" class="text-sm md:text-md xl:text-lg font-medium text-brand-text-dark hover:text-brand-red transition-colors">${nombre.toUpperCase()}</a>`;
        }).join('');
        
    } else {
        console.error('No se encontró el elemento desktopNav');
    }

    // Generar navegación móvil
    const mobileNav = document.getElementById('mobileNav');
    if (mobileNav) {
        mobileNav.innerHTML = seccionesEnMenu.map(item => {
            // Obtener las keys de cada item individualmente
            const keys = Object.keys(item);
            const seccionKey = keys.find(k => k.toUpperCase() === 'SECCION') || keys.find(k => k.toLowerCase() === 'seccion');
            const nombreKey = keys.find(k => k.toUpperCase() === 'NOMBRE') || keys.find(k => k.toLowerCase() === 'nombre');
            
            const seccion = seccionKey ? (item[seccionKey] || '').toString().trim() : '';
            const nombre = nombreKey ? (item[nombreKey] || '').toString().trim() : '';
            
            if (!seccion || !nombre || nombre === '-') return '';            
            const href = '#' + seccion;
            return `<a href="${href}" class="text-base font-medium text-brand-text-dark hover:text-brand-red transition-colors">${nombre.toUpperCase()}</a>`;
        }).join('');
        
    } else {
        console.error(' No se encontró el elemento mobileNav');
    }

    // Re-inicializar los event listeners para smooth scroll después de generar la navegación
    inicializarSmoothScroll();
}

// --- Función para controlar visibilidad de secciones en la UI ---
function controlarVisibilidadSecciones(otros = []) {
    if (!otros || otros.length === 0) {
        console.warn('No hay datos de OTROS para controlar la visibilidad');
        return;
    }

    // Crear un mapa de secciones con su estado de visibilidad
    const mapaSecciones = {};
    otros.forEach((item, index) => {
        // Intentar diferentes variaciones de nombres de columnas (case-insensitive)
        const keys = Object.keys(item);
        const seccionKey = keys.find(k => k.toUpperCase() === 'SECCION') || keys.find(k => k.toLowerCase() === 'seccion');
        const visibleKey = keys.find(k => k.toUpperCase() === 'VISIBLE') || keys.find(k => k.toLowerCase() === 'visible');
        
        const seccion = seccionKey ? (item[seccionKey] || '').toString().trim() : '';
        const visible = visibleKey ? (item[visibleKey] || '').toString().trim() : '';
        
        if (seccion) {
            let seccionId = seccion.trim().replace(/^["']|["']$/g, '');            
            if (seccionId) {
                mapaSecciones[seccionId] = esVerdadero(visible);
            }
        }
    });

    // Mostrar u ocultar cada sección según su estado VISIBLE
    Object.keys(mapaSecciones).forEach(seccionId => {
        const elemento = encontrarElementoPorId(seccionId);
        if (elemento) {
            const debeSerVisible = mapaSecciones[seccionId];
            if (debeSerVisible) {
                // Mostrar la sección: remover clase hidden
                elemento.classList.remove('hidden');
            } else {
                // Ocultar la sección: agregar clase hidden
                elemento.classList.add('hidden');
            }
        } else {
            // Mostrar warning para ayudar a depurar
            console.warn(`⚠ No se encontró el elemento con ID: "${seccionId}"`);
        }
    });
}

// --- Función para inicializar smooth scroll ---
function inicializarSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// --- carga inicial ---
async function init() {

    preloader();
    
    STATE.data = await loadAllData();
    
    requestAnimationFrame(() => {
        // Generar navegación dinámica desde la hoja OTROS (basada en MENU)
        generarNavegacion(STATE.data.OTROS);
        
        initCicloSelectors();
        // updateUI se encargará de controlar la visibilidad al final, después de renderizar todas las secciones
        updateUI();
    });

    // Auto recarga cada 5 minutos
    setInterval(() => {
        loadAllData().then(d => {
            STATE.data = d;
            updateUI();
        });
    }, 5 * 60 * 1000);
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

    const { CLASIFICACION, EQUIPOS, LIDERES, SANCIONES, NOTICIAS, OTROS } = STATE.data;
    const ciclos = STATE.ciclosSeleccionados;

    // Actualizar navegación si hay datos de OTROS (basada en MENU)
    if (OTROS && OTROS.length > 0) {
        generarNavegacion(OTROS);
    }

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
        ["faseDeGrupos", "semifinal", "tercerFinalPuesto"].forEach(tipo => {
            const otroDiv = document.getElementById(`${tipo}${otroCiclo}`);
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
        const otroDiv = document.getElementById("clasificacion" + otroCiclo);
        if (otroDiv) {
            otroDiv.innerHTML = "";
            otroDiv.classList.remove("overflow-x-auto", "mb-6", "mt-6");
        }
    }

    // Clasificación Grupal
    if (ciclos.clasificacionGrupal === "TODOS") {
        tablaClasificacionGrupal(STATE.data.CLASIFICACION, "ESO");
        tablaClasificacionGrupal(STATE.data.CLASIFICACION, "BCH");
    } else {
        tablaClasificacionGrupal(STATE.data.CLASIFICACION, ciclos.clasificacionGrupal);
        const otroCiclo = ciclos.clasificacionGrupal === "ESO" ? "BCH" : "ESO";
        const otroDiv = document.getElementById("clasificacionGrupal" + otroCiclo);
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
        const otroDiv = document.getElementById("resultados" + otroCiclo);
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
        const otroDiv = document.getElementById("bracket" + otroCiclo);
        if (otroDiv) {
            otroDiv.innerHTML = "";            
            otroDiv.classList.remove("overflow-x-auto", "mb-6", "mt-6");
        }
    }

    // Líderes Goleadores
    if (ciclos.goleadores === "TODOS") {
        tablaLideresGoleadores(STATE.data.LIDERES, "ESO", STATE.data.OTROS);
        tablaLideresGoleadores(STATE.data.LIDERES, "BCH", STATE.data.OTROS);
    } else {
        tablaLideresGoleadores(STATE.data.LIDERES, ciclos.goleadores, STATE.data.OTROS);
        const otroCiclo = ciclos.goleadores === "ESO" ? "BCH" : "ESO";
        const otroDiv = document.getElementById("goleadores" + otroCiclo);
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
        const otroDiv = document.getElementById("sancionados" + otroCiclo);
        if (otroDiv) {
            otroDiv.innerHTML = "";
            otroDiv.classList.remove("mb-6", "mt-6");
        }
    }
    
    renderNoticias(STATE.data.NOTICIAS);

    actualizarGruposDisponibles(ciclos.equipos);

    // Próximos Partidos
    // Primero encontrar los días relevantes usando el offset de días
    // Usar "TODOS" como ciclo ya que no filtramos por ciclo
    const { diaInicio, diaFin } = encontrarDiasRelevantes(
        STATE.data.CLASIFICACION, 
        "TODOS",
        diaOffsetProximosPartidos
    );
    
    // Debug: Log de los días encontrados
    console.log('Días encontrados:', {
        diaInicio: diaInicio.toLocaleDateString('es-ES'),
        diaFin: diaFin.toLocaleDateString('es-ES'),
        offsetDias: diaOffsetProximosPartidos,
        totalPartidos: STATE.data.CLASIFICACION?.length || 0
    });
    
    // Filtrar partidos por equipos definidos y rango de fechas
    const partidosFiltrados = filtrarProximosPartidos(
        STATE.data.CLASIFICACION,
        null, // No se usa el ciclo para filtrar
        diaInicio,
        diaFin
    );
    
    // Debug: Log de partidos filtrados
    console.log('Partidos filtrados:', {
        cantidad: partidosFiltrados.length,
        partidos: partidosFiltrados.map(p => ({
            fecha: `${p.DIA}/${p.MES}/${p.ANIO || new Date().getFullYear()}`,
            local: p.LOCAL,
            visitante: p.VISITANTE,
            ciclo: p.CICLO
        }))
    });
    
    renderProximosPartidos(partidosFiltrados);

    // Etiqueta de los días para próximos partidos
    const label = document.getElementById("semana-label");
    if (label) {
        const diaInicioNum = String(diaInicio.getDate()).padStart(2, '0');
        const mesInicio = String(diaInicio.getMonth() + 1).padStart(2, '0');
        const anioInicio = diaInicio.getFullYear();
        
        // Si es retroceder (offset negativo) o es el mismo día, mostrar solo el día inicial
        if (diaOffsetProximosPartidos < 0 || diaInicio.getTime() === diaFin.getTime()) {
            label.textContent = `${diaInicioNum}/${mesInicio}/${anioInicio}`;
        } else {
            // Si es avanzar (offset positivo) o modo automático, mostrar rango de 2 días
            const diaFinNum = String(diaFin.getDate()).padStart(2, '0');
            const mesFin = String(diaFin.getMonth() + 1).padStart(2, '0');
            const anioFin = diaFin.getFullYear();
            label.textContent = `${diaInicioNum}/${mesInicio}/${anioInicio} - ${diaFinNum}/${mesFin}/${anioFin}`;
        }
    }

    // Controlar visibilidad de secciones después de que todas se hayan renderizado
    // Usar requestAnimationFrame para asegurar que el DOM se haya actualizado
    if (OTROS && OTROS.length > 0) {
        requestAnimationFrame(() => {
            controlarVisibilidadSecciones(OTROS);
            // Ocultar preloader solo después de que todo esté completamente actualizado
            if (esCargaInicial) {
                ocultarPreloader();
                esCargaInicial = false;
            }
        });
    } else {
        // Si no hay datos de OTROS, ocultar preloader igualmente
        if (esCargaInicial) {
            requestAnimationFrame(() => {
                ocultarPreloader();
                esCargaInicial = false;
            });
        }
    }
 
}

// --- Función para actualizar ciclo seleccionado ---
function actualizarCiclo(seccion, ciclo) {
    STATE.ciclosSeleccionados[seccion] = ciclo;
    if (seccion === "equipos") {
        actualizarGruposDisponibles(ciclo);
    }
    // Resetear el offset de días cuando se cambia el ciclo de próximos partidos
    if (seccion === "proximosPartidos") {
        diaOffsetProximosPartidos = 0;
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
        { id: 'selector-clasificacion-grupal', seccion: 'clasificacionGrupal' },
        { id: 'selector-bracket', seccion: 'bracket' },
        { id: 'selector-goleadores', seccion: 'goleadores' },
        { id: 'selector-sancionados', seccion: 'sancionados' },
        { id: 'selector-resultados', seccion: 'resultados' }
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
    
    // Event listeners para navegación día por día en próximos partidos
    const semanaAnterior = document.getElementById("semana-anterior");
    const semanaSiguiente = document.getElementById("semana-siguiente");

    if (semanaAnterior) {
        semanaAnterior.addEventListener('click', () => {
            diaOffsetProximosPartidos--; // Retroceder un día
            updateUI();
        });
    }

    if (semanaSiguiente) {
        semanaSiguiente.addEventListener('click', () => {
            diaOffsetProximosPartidos++; // Avanzar un día
            updateUI();
        });
    }
}

// Variable para controlar si es la carga inicial
let esCargaInicial = true;

function preloader() {
    const preloader = document.getElementById("preloader");
    if (preloader) {
        preloader.style.display = "flex";
        preloader.style.opacity = "1";
    }
}

function ocultarPreloader() {
    const preloader = document.getElementById("preloader");
    if (preloader) {
        preloader.style.opacity = "0";
        setTimeout(() => {
            preloader.style.display = "none";
        }, 500);
    }
}