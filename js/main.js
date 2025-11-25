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
    renderGalería,
    renderBracket,
    renderProximosPartidos
} from "./ui.js";


// Estado general
let     STATE = { 
        filtros: { etapa: "" }, 
        data: null,
        ciclosSeleccionados: {
            equipos: "TODOS",
            jornadas: "TODOS",
            clasificacion: "TODOS",
            clasificacionGrupal: "TODOS",
            goleadores: "TODOS",
            sancionados: "TODOS",
            resultados: "TODOS",
            proximosPartidos: "TODOS"
        },
        grupoSeleccionado: {
            equipos: "TODOS"
        },
        cursoSeleccionado: {
            sancionadosESO: "TODOS",
            sancionadosBCH: "TODOS",
            goleadoresESO: "TODOS",
            goleadoresBCH: "TODOS"
        }
    };
let semanaOffset = 0;
let diaOffsetProximosPartidos = 0; // Offset en días para navegación día por día
let diaOffsetNoticias = 0; // Offset en días para navegación día por día en noticias
let diaOffsetGaleria = 0; // Offset en días para navegación día por día en galería

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

// --- Encontrar días relevantes para noticias ---
// Retorna un objeto con { diaInicio, diaFin } que representa el día actual o el día según el offset
// Ignora fines de semana (solo lunes-viernes) y busca días con noticias publicadas
// offsetDias: permite navegar día por día (0 = hoy, 1 = mañana, -1 = ayer, etc.)
function encontrarDiasRelevantesNoticias(noticias, offsetDias = 0) {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    // Aplicar offset para navegación día por día
    const fechaBase = new Date(hoy);
    fechaBase.setDate(hoy.getDate() + offsetDias);
    fechaBase.setHours(0, 0, 0, 0);
    
    const diaSemana = fechaBase.getDay(); // 0 = domingo, 6 = sábado
    
    // Filtrar solo noticias publicadas
    const noticiasPublicadas = noticias.filter(n => n.PUBLICAR === "SI");
    
    // Función auxiliar para parsear fecha de noticia
    // Formato esperado: DD/MM/YYYY o DD/MM/YY
    const parsearFechaNoticia = (fechaStr) => {
        if (!fechaStr || typeof fechaStr !== 'string') return null;
        
        const fechaLimpia = fechaStr.trim();
        // Intentar formato DD/MM/YYYY o DD/MM/YY
        const partes = fechaLimpia.split('/');
        if (partes.length !== 3) return null;
        
        try {
            const dia = parseInt(partes[0]);
            const mes = parseInt(partes[1]);
            let anio = parseInt(partes[2]);
            
            // Si el año tiene 2 dígitos, asumir 2000+
            if (anio < 100) {
                anio += 2000;
            }
            
            if (isNaN(dia) || isNaN(mes) || isNaN(anio) || mes < 1 || mes > 12 || dia < 1 || dia > 31) {
                return null;
            }
            
            const fecha = new Date(anio, mes - 1, dia);
            fecha.setHours(0, 0, 0, 0);
            
            if (isNaN(fecha.getTime())) {
                return null;
            }
            
            return fecha;
        } catch (error) {
            return null;
        }
    };
    
    // Función para verificar si hay noticias en un día específico
    const hayNoticiasEnDia = (fecha) => {
        return noticiasPublicadas.some(noticia => {
            const fechaNoticia = parsearFechaNoticia(noticia.FECHA);
            if (!fechaNoticia) return false;
            return fechaNoticia.getTime() === fecha.getTime();
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
    
    // Función para encontrar el siguiente día laboral con noticias hacia adelante
    const siguienteDiaConNoticias = (fechaInicio) => {
        let fechaBusqueda = siguienteDiaLaboral(fechaInicio);
        let diasBuscados = 0;
        const maxDias = 60; // Buscar hasta 2 meses adelante
        
        while (diasBuscados < maxDias) {
            if (!esFinDeSemana(fechaBusqueda) && hayNoticiasEnDia(fechaBusqueda)) {
                return fechaBusqueda;
            }
            fechaBusqueda = siguienteDiaLaboral(fechaBusqueda);
            diasBuscados++;
        }
        
        // Si no se encuentra, retornar el siguiente día laboral como fallback
        return siguienteDiaLaboral(fechaInicio);
    };
    
    // Función para encontrar el día laboral anterior con noticias hacia atrás
    const anteriorDiaConNoticias = (fechaInicio) => {
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
            
            if (!esFinDeSemana(fechaBusqueda) && hayNoticiasEnDia(fechaBusqueda)) {
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
    
    // Si hay offset (navegación manual), buscar días con noticias
    if (offsetDias !== 0) {
        let diaInicio;
        
        if (offsetDias > 0) {
            // Avanzar: buscar el siguiente día con noticias
            let fechaBusqueda = new Date(fechaBase);
            if (esFinDeSemana(fechaBusqueda)) {
                fechaBusqueda = siguienteDiaLaboral(fechaBusqueda);
            }
            
            // Buscar el día correspondiente al offset
            for (let i = 0; i < offsetDias; i++) {
                fechaBusqueda = siguienteDiaConNoticias(fechaBusqueda);
            }
            
            diaInicio = fechaBusqueda;
            // Mostrar solo el día consultado
            return { diaInicio, diaFin: diaInicio };
        } else {
            // Retroceder: buscar el día anterior con noticias
            let fechaBusqueda = new Date(fechaBase);
            if (esFinDeSemana(fechaBusqueda)) {
                fechaBusqueda = anteriorDiaConNoticias(fechaBusqueda);
            }
            
            // Buscar el día correspondiente al offset (negativo)
            for (let i = 0; i < Math.abs(offsetDias); i++) {
                fechaBusqueda = anteriorDiaConNoticias(fechaBusqueda);
            }
            
            diaInicio = fechaBusqueda;
            // Mostrar solo el día consultado
            return { diaInicio, diaFin: diaInicio };
        }
    }
    
    // Si es sábado (6) o domingo (0), buscar el siguiente día laboral más próximo con noticias
    if (diaSemana === 0 || diaSemana === 6) {
        let fechaBusqueda = siguienteDiaLaboral(fechaBase);
        let diasBuscados = 0;
        const maxDias = 14; // Buscar hasta 2 semanas adelante
        
        while (diasBuscados < maxDias) {
            if (!esFinDeSemana(fechaBusqueda) && hayNoticiasEnDia(fechaBusqueda)) {
                return { diaInicio: fechaBusqueda, diaFin: fechaBusqueda };
            }
            
            fechaBusqueda = siguienteDiaLaboral(fechaBusqueda);
            diasBuscados++;
        }
        
        // Si no se encontró ningún día con noticias, usar el siguiente lunes como fallback
        const diaInicio = siguienteDiaLaboral(fechaBase);
        return { diaInicio, diaFin: diaInicio };
    }
    
    // Si es día laboral, verificar si hay noticias en fechaBase
    if (hayNoticiasEnDia(fechaBase)) {
        return { diaInicio: fechaBase, diaFin: fechaBase };
    }
    
    // Si no hay noticias en fechaBase, buscar el día más reciente con noticias
    // Primero buscar hacia adelante (futuro) y encontrar el día más lejano con noticias
    let fechaBusqueda = siguienteDiaLaboral(fechaBase);
    let diasBuscados = 0;
    const maxDias = 60; // Buscar hasta 2 meses adelante
    let diaMasRecienteConNoticias = null;
    
    while (diasBuscados < maxDias) {
        if (!esFinDeSemana(fechaBusqueda) && hayNoticiasEnDia(fechaBusqueda)) {
            // Guardar el día más reciente encontrado (el último que encontremos será el más lejano)
            diaMasRecienteConNoticias = new Date(fechaBusqueda);
        }
        fechaBusqueda = siguienteDiaLaboral(fechaBusqueda);
        diasBuscados++;
    }
    
    // Si se encontró un día con noticias en el futuro, retornarlo
    if (diaMasRecienteConNoticias) {
        return { diaInicio: diaMasRecienteConNoticias, diaFin: diaMasRecienteConNoticias };
    }
    
    // Si no se encontró en el futuro, buscar hacia atrás (pasado) y encontrar el más reciente
    fechaBusqueda = new Date(fechaBase);
    fechaBusqueda.setDate(fechaBase.getDate() - 1);
    diasBuscados = 0;
    
    while (diasBuscados < maxDias) {
        // Si es fin de semana, retroceder al viernes anterior
        if (esFinDeSemana(fechaBusqueda)) {
            const diaSemana = fechaBusqueda.getDay();
            if (diaSemana === 0) {
                fechaBusqueda.setDate(fechaBusqueda.getDate() - 2);
            } else if (diaSemana === 6) {
                fechaBusqueda.setDate(fechaBusqueda.getDate() - 1);
            }
        }
        
        if (!esFinDeSemana(fechaBusqueda) && hayNoticiasEnDia(fechaBusqueda)) {
            // El primer día que encontremos hacia atrás será el más reciente
            diaMasRecienteConNoticias = new Date(fechaBusqueda);
            break;
        }
        
        fechaBusqueda.setDate(fechaBusqueda.getDate() - 1);
        diasBuscados++;
    }
    
    // Si se encontró un día con noticias en el pasado, retornarlo
    if (diaMasRecienteConNoticias) {
        return { diaInicio: diaMasRecienteConNoticias, diaFin: diaMasRecienteConNoticias };
    }
    
    // Fallback: usar el siguiente lunes
    const diaInicio = siguienteDiaLaboral(fechaBase);
    return { diaInicio, diaFin: diaInicio };
}

// --- Filtrar noticias por fecha ---
function filtrarNoticiasPorFecha(noticias, diaInicio, diaFin) {
    if (!noticias || !Array.isArray(noticias) || noticias.length === 0) {
        return [];
    }
    
    // Filtrar solo noticias publicadas
    const noticiasPublicadas = noticias.filter(n => n.PUBLICAR === "SI");
    
    // Asegurar que las fechas estén normalizadas
    diaInicio.setHours(0, 0, 0, 0);
    diaFin.setHours(0, 0, 0, 0);
    
    // Función auxiliar para parsear fecha de noticia
    const parsearFechaNoticia = (fechaStr) => {
        if (!fechaStr || typeof fechaStr !== 'string') return null;
        
        const fechaLimpia = fechaStr.trim();
        const partes = fechaLimpia.split('/');
        if (partes.length !== 3) return null;
        
        try {
            const dia = parseInt(partes[0]);
            const mes = parseInt(partes[1]);
            let anio = parseInt(partes[2]);
            
            if (anio < 100) {
                anio += 2000;
            }
            
            if (isNaN(dia) || isNaN(mes) || isNaN(anio) || mes < 1 || mes > 12 || dia < 1 || dia > 31) {
                return null;
            }
            
            const fecha = new Date(anio, mes - 1, dia);
            fecha.setHours(0, 0, 0, 0);
            
            if (isNaN(fecha.getTime())) {
                return null;
            }
            
            return fecha;
        } catch (error) {
            return null;
        }
    };
    
    // Filtrar noticias que estén en el rango de fechas (inclusive)
    const noticiasFiltradas = noticiasPublicadas.filter(noticia => {
        const fechaNoticia = parsearFechaNoticia(noticia.FECHA);
        if (!fechaNoticia) { 
            return false;
        }
        
        // Verificar que esté en el rango de días seleccionados (inclusive)
        const estaEnRango = fechaNoticia.getTime() >= diaInicio.getTime() && 
                           fechaNoticia.getTime() <= diaFin.getTime(); 
        
        return estaEnRango;
    });
    
    // Si solo hay 1 noticia en el día seleccionado, buscar 2 noticias adicionales anteriores
    if (noticiasFiltradas.length === 1) {
        // Función para encontrar el día laboral anterior
        const anteriorDiaLaboral = (fecha) => {
            const anterior = new Date(fecha);
            anterior.setDate(fecha.getDate() - 1);
            
            const diaSemana = anterior.getDay();
            
            // Si es domingo (0), retroceder al viernes (restar 2 días)
            if (diaSemana === 0) {
                anterior.setDate(anterior.getDate() - 2);
            }
            // Si es sábado (6), retroceder al viernes (restar 1 día)
            else if (diaSemana === 6) {
                anterior.setDate(anterior.getDate() - 1);
            }
            
            return anterior;
        };
        
        // Función para verificar si un día es sábado o domingo
        const esFinDeSemana = (fecha) => {
            const diaSemanaFecha = fecha.getDay();
            return diaSemanaFecha === 0 || diaSemanaFecha === 6;
        };
        
        // Buscar 2 noticias adicionales anteriores
        let fechaBusqueda = anteriorDiaLaboral(diaInicio);
        let noticiasAdicionales = [];
        let diasBuscados = 0;
        const maxDias = 60; // Buscar hasta 2 meses atrás
        
        while (noticiasAdicionales.length < 2 && diasBuscados < maxDias) {
            // Buscar todas las noticias de este día
            const noticiasDelDia = noticiasPublicadas.filter(noticia => {
                const fechaNoticia = parsearFechaNoticia(noticia.FECHA);
                if (!fechaNoticia) return false;
                
                fechaNoticia.setHours(0, 0, 0, 0);
                return fechaNoticia.getTime() === fechaBusqueda.getTime();
            });
            
            // Agregar las noticias encontradas (máximo 2 en total)
            if (noticiasDelDia.length > 0) {
                const espacioDisponible = 2 - noticiasAdicionales.length;
                noticiasAdicionales.push(...noticiasDelDia.slice(0, espacioDisponible));
            }
            
            // Si ya tenemos 2 noticias, salir
            if (noticiasAdicionales.length >= 2) {
                break;
            }
            
            // Retroceder al día laboral anterior
            fechaBusqueda = anteriorDiaLaboral(fechaBusqueda);
            diasBuscados++;
        }
        
        // Ordenar todas las noticias por fecha (más antiguas primero)
        const todasLasNoticias = [...noticiasAdicionales, ...noticiasFiltradas];
        todasLasNoticias.sort((a, b) => {
            const fechaA = parsearFechaNoticia(a.FECHA);
            const fechaB = parsearFechaNoticia(b.FECHA);
            if (!fechaA || !fechaB) return 0;
            return fechaA.getTime() - fechaB.getTime();
        });
        
        console.log('Noticias adicionales encontradas:', {
            noticiasOriginales: noticiasFiltradas.length,
            noticiasAdicionales: noticiasAdicionales.length,
            total: todasLasNoticias.length
        });
        
        return todasLasNoticias;
    }
    
    console.log('Filtrado de noticias:', {
        totalPublicadas: noticiasPublicadas.length,
        filtradas: noticiasFiltradas.length,
        diaInicio: diaInicio.toLocaleDateString('es-ES'),
        diaFin: diaFin.toLocaleDateString('es-ES')
    });
    
    return noticiasFiltradas;
}

// --- Encontrar días relevantes para galería ---
// Retorna un objeto con { diaInicio, diaFin } que representa el día actual o el día según el offset
// Ignora fines de semana (solo lunes-viernes) y busca días con elementos de galería publicados
// offsetDias: permite navegar día por día (0 = hoy, 1 = mañana, -1 = ayer, etc.)
function encontrarDiasRelevantesGaleria(galeria, offsetDias = 0) {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    // Aplicar offset para navegación día por día
    const fechaBase = new Date(hoy);
    fechaBase.setDate(hoy.getDate() + offsetDias);
    fechaBase.setHours(0, 0, 0, 0);
    
    const diaSemana = fechaBase.getDay(); // 0 = domingo, 6 = sábado
    
    // Filtrar solo elementos publicados
    const galeriaPublicada = galeria.filter(g => g.PUBLICAR === "SI");
    
    // Función auxiliar para parsear fecha de galería
    // Formato esperado: DD/MM/YYYY o DD/MM/YY
    const parsearFechaGaleria = (fechaStr) => {
        if (!fechaStr || typeof fechaStr !== 'string') return null;
        
        const fechaLimpia = fechaStr.trim();
        const partes = fechaLimpia.split('/');
        if (partes.length !== 3) return null;
        
        try {
            const dia = parseInt(partes[0]);
            const mes = parseInt(partes[1]);
            let anio = parseInt(partes[2]);
            
            if (anio < 100) {
                anio += 2000;
            }
            
            if (isNaN(dia) || isNaN(mes) || isNaN(anio) || mes < 1 || mes > 12 || dia < 1 || dia > 31) {
                return null;
            }
            
            const fecha = new Date(anio, mes - 1, dia);
            fecha.setHours(0, 0, 0, 0);
            
            if (isNaN(fecha.getTime())) {
                return null;
            }
            
            return fecha;
        } catch (error) {
            return null;
        }
    };
    
    // Función para verificar si hay elementos de galería en un día específico
    const hayGaleriaEnDia = (fecha) => {
        return galeriaPublicada.some(item => {
            const fechaItem = parsearFechaGaleria(item.FECHA);
            if (!fechaItem) return false;
            return fechaItem.getTime() === fecha.getTime();
        });
    };
    
    // Función para verificar si un día es sábado o domingo
    const esFinDeSemana = (fecha) => {
        const diaSemanaFecha = fecha.getDay();
        return diaSemanaFecha === 0 || diaSemanaFecha === 6;
    };
    
    // Función para encontrar el siguiente día laboral (lunes a viernes)
    const siguienteDiaLaboral = (fecha) => {
        const siguiente = new Date(fecha);
        siguiente.setDate(fecha.getDate() + 1);
        
        const diaSemana = siguiente.getDay();
        
        if (diaSemana === 6) {
            siguiente.setDate(siguiente.getDate() + 2);
        } else if (diaSemana === 0) {
            siguiente.setDate(siguiente.getDate() + 1);
        }
        
        return siguiente;
    };
    
    // Función para encontrar el siguiente día laboral con galería hacia adelante
    const siguienteDiaConGaleria = (fechaInicio) => {
        let fechaBusqueda = siguienteDiaLaboral(fechaInicio);
        let diasBuscados = 0;
        const maxDias = 60;
        
        while (diasBuscados < maxDias) {
            if (!esFinDeSemana(fechaBusqueda) && hayGaleriaEnDia(fechaBusqueda)) {
                return fechaBusqueda;
            }
            fechaBusqueda = siguienteDiaLaboral(fechaBusqueda);
            diasBuscados++;
        }
        
        return siguienteDiaLaboral(fechaInicio);
    };
    
    // Función para encontrar el día laboral anterior con galería hacia atrás
    const anteriorDiaConGaleria = (fechaInicio) => {
        let fechaBusqueda = new Date(fechaInicio);
        fechaBusqueda.setDate(fechaInicio.getDate() - 1);
        let diasBuscados = 0;
        const maxDias = 60;
        
        while (diasBuscados < maxDias) {
            if (esFinDeSemana(fechaBusqueda)) {
                const diaSemana = fechaBusqueda.getDay();
                if (diaSemana === 0) {
                    fechaBusqueda.setDate(fechaBusqueda.getDate() - 2);
                } else if (diaSemana === 6) {
                    fechaBusqueda.setDate(fechaBusqueda.getDate() - 1);
                }
            }
            
            if (!esFinDeSemana(fechaBusqueda) && hayGaleriaEnDia(fechaBusqueda)) {
                return fechaBusqueda;
            }
            
            fechaBusqueda.setDate(fechaBusqueda.getDate() - 1);
            diasBuscados++;
        }
        
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
    
    // Si hay offset (navegación manual), buscar días con galería
    if (offsetDias !== 0) {
        let diaInicio;
        
        if (offsetDias > 0) {
            let fechaBusqueda = new Date(fechaBase);
            if (esFinDeSemana(fechaBusqueda)) {
                fechaBusqueda = siguienteDiaLaboral(fechaBusqueda);
            }
            
            for (let i = 0; i < offsetDias; i++) {
                fechaBusqueda = siguienteDiaConGaleria(fechaBusqueda);
            }
            
            diaInicio = fechaBusqueda;
            return { diaInicio, diaFin: diaInicio };
        } else {
            let fechaBusqueda = new Date(fechaBase);
            if (esFinDeSemana(fechaBusqueda)) {
                fechaBusqueda = anteriorDiaConGaleria(fechaBusqueda);
            }
            
            for (let i = 0; i < Math.abs(offsetDias); i++) {
                fechaBusqueda = anteriorDiaConGaleria(fechaBusqueda);
            }
            
            diaInicio = fechaBusqueda;
            return { diaInicio, diaFin: diaInicio };
        }
    }
    
    // Si es sábado (6) o domingo (0), buscar el siguiente día laboral más próximo con galería
    if (diaSemana === 0 || diaSemana === 6) {
        let fechaBusqueda = siguienteDiaLaboral(fechaBase);
        let diasBuscados = 0;
        const maxDias = 14;
        
        while (diasBuscados < maxDias) {
            if (!esFinDeSemana(fechaBusqueda) && hayGaleriaEnDia(fechaBusqueda)) {
                return { diaInicio: fechaBusqueda, diaFin: fechaBusqueda };
            }
            
            fechaBusqueda = siguienteDiaLaboral(fechaBusqueda);
            diasBuscados++;
        }
        
        const diaInicio = siguienteDiaLaboral(fechaBase);
        return { diaInicio, diaFin: diaInicio };
    }
    
    // Si es día laboral, verificar si hay galería en fechaBase
    if (hayGaleriaEnDia(fechaBase)) {
        return { diaInicio: fechaBase, diaFin: fechaBase };
    }
    
    // Si no hay galería en fechaBase, buscar el día más reciente con galería
    let fechaBusqueda = siguienteDiaLaboral(fechaBase);
    let diasBuscados = 0;
    const maxDias = 60;
    let diaMasRecienteConGaleria = null;
    
    while (diasBuscados < maxDias) {
        if (!esFinDeSemana(fechaBusqueda) && hayGaleriaEnDia(fechaBusqueda)) {
            diaMasRecienteConGaleria = new Date(fechaBusqueda);
        }
        fechaBusqueda = siguienteDiaLaboral(fechaBusqueda);
        diasBuscados++;
    }
    
    if (diaMasRecienteConGaleria) {
        return { diaInicio: diaMasRecienteConGaleria, diaFin: diaMasRecienteConGaleria };
    }
    
    // Buscar hacia atrás
    fechaBusqueda = new Date(fechaBase);
    fechaBusqueda.setDate(fechaBase.getDate() - 1);
    diasBuscados = 0;
    
    while (diasBuscados < maxDias) {
        if (esFinDeSemana(fechaBusqueda)) {
            const diaSemana = fechaBusqueda.getDay();
            if (diaSemana === 0) {
                fechaBusqueda.setDate(fechaBusqueda.getDate() - 2);
            } else if (diaSemana === 6) {
                fechaBusqueda.setDate(fechaBusqueda.getDate() - 1);
            }
        }
        
        if (!esFinDeSemana(fechaBusqueda) && hayGaleriaEnDia(fechaBusqueda)) {
            diaMasRecienteConGaleria = new Date(fechaBusqueda);
            break;
        }
        
        fechaBusqueda.setDate(fechaBusqueda.getDate() - 1);
        diasBuscados++;
    }
    
    if (diaMasRecienteConGaleria) {
        return { diaInicio: diaMasRecienteConGaleria, diaFin: diaMasRecienteConGaleria };
    }
    
    const diaInicio = siguienteDiaLaboral(fechaBase);
    return { diaInicio, diaFin: diaInicio };
}

// --- Filtrar galería por fecha ---
function filtrarGaleriaPorFecha(galeria, diaInicio, diaFin) {
    if (!galeria || !Array.isArray(galeria) || galeria.length === 0) {
        return [];
    }
    
    // Filtrar solo elementos publicados
    const galeriaPublicada = galeria.filter(g => g.PUBLICAR === "SI");
    
    // Asegurar que las fechas estén normalizadas
    diaInicio.setHours(0, 0, 0, 0);
    diaFin.setHours(0, 0, 0, 0);
    
    // Función auxiliar para parsear fecha de galería
    const parsearFechaGaleria = (fechaStr) => {
        if (!fechaStr || typeof fechaStr !== 'string') return null;
        
        const fechaLimpia = fechaStr.trim();
        const partes = fechaLimpia.split('/');
        if (partes.length !== 3) return null;
        
        try {
            const dia = parseInt(partes[0]);
            const mes = parseInt(partes[1]);
            let anio = parseInt(partes[2]);
            
            if (anio < 100) {
                anio += 2000;
            }
            
            if (isNaN(dia) || isNaN(mes) || isNaN(anio) || mes < 1 || mes > 12 || dia < 1 || dia > 31) {
                return null;
            }
            
            const fecha = new Date(anio, mes - 1, dia);
            fecha.setHours(0, 0, 0, 0);
            
            if (isNaN(fecha.getTime())) {
                return null;
            }
            
            return fecha;
        } catch (error) {
            return null;
        }
    };
    
    // Filtrar elementos que estén en el rango de fechas (inclusive)
    const galeriaFiltrada = galeriaPublicada.filter(item => {
        const fechaItem = parsearFechaGaleria(item.FECHA);
        if (!fechaItem) {
            return false;
        }
        
        const estaEnRango = fechaItem.getTime() >= diaInicio.getTime() && 
                           fechaItem.getTime() <= diaFin.getTime();
        
        return estaEnRango;
    });
    
    // Si solo hay 1 elemento en el día seleccionado, buscar 2 elementos adicionales anteriores
    if (galeriaFiltrada.length === 1) {
        const anteriorDiaLaboral = (fecha) => {
            const anterior = new Date(fecha);
            anterior.setDate(fecha.getDate() - 1);
            
            const diaSemana = anterior.getDay();
            
            if (diaSemana === 0) {
                anterior.setDate(anterior.getDate() - 2);
            } else if (diaSemana === 6) {
                anterior.setDate(anterior.getDate() - 1);
            }
            
            return anterior;
        };
        
        let fechaBusqueda = anteriorDiaLaboral(diaInicio);
        let elementosAdicionales = [];
        let diasBuscados = 0;
        const maxDias = 60;
        
        while (elementosAdicionales.length < 2 && diasBuscados < maxDias) {
            const elementosDelDia = galeriaPublicada.filter(item => {
                const fechaItem = parsearFechaGaleria(item.FECHA);
                if (!fechaItem) return false;
                
                fechaItem.setHours(0, 0, 0, 0);
                return fechaItem.getTime() === fechaBusqueda.getTime();
            });
            
            if (elementosDelDia.length > 0) {
                const espacioDisponible = 2 - elementosAdicionales.length;
                elementosAdicionales.push(...elementosDelDia.slice(0, espacioDisponible));
            }
            
            if (elementosAdicionales.length >= 2) {
                break;
            }
            
            fechaBusqueda = anteriorDiaLaboral(fechaBusqueda);
            diasBuscados++;
        }
        
        const todosLosElementos = [...elementosAdicionales, ...galeriaFiltrada];
        todosLosElementos.sort((a, b) => {
            const fechaA = parsearFechaGaleria(a.FECHA);
            const fechaB = parsearFechaGaleria(b.FECHA);
            if (!fechaA || !fechaB) return 0;
            return fechaA.getTime() - fechaB.getTime();
        });
        
        return todosLosElementos;
    }
    
    return galeriaFiltrada;
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

    // Bracket - mostrar todo sin filtrar por ciclo
    renderBracket(STATE.data.CLASIFICACION);

    // Líderes Goleadores
    if (ciclos.goleadores === "TODOS") {
        tablaLideresGoleadores(STATE.data.LIDERES, "ESO", STATE.data.OTROS, STATE.cursoSeleccionado.goleadoresESO);
        tablaLideresGoleadores(STATE.data.LIDERES, "BCH", STATE.data.OTROS, STATE.cursoSeleccionado.goleadoresBCH);
    } else {
        const cursoFiltro = ciclos.goleadores === "ESO" ? STATE.cursoSeleccionado.goleadoresESO : STATE.cursoSeleccionado.goleadoresBCH;
        tablaLideresGoleadores(STATE.data.LIDERES, ciclos.goleadores, STATE.data.OTROS, cursoFiltro);
        const otroCiclo = ciclos.goleadores === "ESO" ? "BCH" : "ESO";
        const otroDiv = document.getElementById("goleadores" + otroCiclo);
        if (otroDiv) {
            otroDiv.innerHTML = "";
            otroDiv.classList.remove("mb-6", "mt-6");
        }
    }

    // Sancionados
    if (ciclos.sancionados === "TODOS") {
        tablaSancionados(STATE.data.SANCIONES, "ESO", STATE.cursoSeleccionado.sancionadosESO);
        tablaSancionados(STATE.data.SANCIONES, "BCH", STATE.cursoSeleccionado.sancionadosBCH);
    } else {
        const cursoFiltro = ciclos.sancionados === "ESO" ? STATE.cursoSeleccionado.sancionadosESO : STATE.cursoSeleccionado.sancionadosBCH;
        tablaSancionados(STATE.data.SANCIONES, ciclos.sancionados, cursoFiltro);
        const otroCiclo = ciclos.sancionados === "ESO" ? "BCH" : "ESO";
        const otroDiv = document.getElementById("sancionados" + otroCiclo);
        if (otroDiv) {
            otroDiv.innerHTML = "";
            otroDiv.classList.remove("mb-6", "mt-6");
        }
    }
    
    // Noticias con paginador por fecha
    // Encontrar los días relevantes usando el offset de días
    const { diaInicio: diaInicioNoticias, diaFin: diaFinNoticias } = encontrarDiasRelevantesNoticias(
        STATE.data.NOTICIAS || [],
        diaOffsetNoticias
    );
    
    // Debug: Log de los días encontrados y noticias disponibles
    console.log('Noticias - Días encontrados:', {
        diaInicio: diaInicioNoticias.toLocaleDateString('es-ES'),
        diaFin: diaFinNoticias.toLocaleDateString('es-ES'),
        offsetDias: diaOffsetNoticias,
        totalNoticias: STATE.data.NOTICIAS?.length || 0,
        noticiasPublicadas: STATE.data.NOTICIAS?.filter(n => n.PUBLICAR === "SI").length || 0
    });
    
    // Filtrar noticias por fecha
    const noticiasFiltradas = filtrarNoticiasPorFecha(
        STATE.data.NOTICIAS || [],
        diaInicioNoticias,
        diaFinNoticias
    );
    
    // Debug: Log de noticias filtradas
    console.log('Noticias filtradas:', {
        cantidad: noticiasFiltradas.length,
        noticias: noticiasFiltradas.map(n => ({
            fecha: n.FECHA,
            titulo: n.TITULO
        }))
    });
    
    renderNoticias(noticiasFiltradas);
    
    // Etiqueta de la fecha para noticias
    const labelNoticias = document.getElementById("noticias-fecha-label");
    if (labelNoticias) {
        const diaInicioNum = String(diaInicioNoticias.getDate()).padStart(2, '0');
        const mesInicio = String(diaInicioNoticias.getMonth() + 1).padStart(2, '0');
        const anioInicio = diaInicioNoticias.getFullYear();
        labelNoticias.textContent = `${diaInicioNum}/${mesInicio}/${anioInicio}`;
    }
    
    // Galería con paginador por fecha
    // Encontrar los días relevantes usando el offset de días
    const { diaInicio: diaInicioGaleria, diaFin: diaFinGaleria } = encontrarDiasRelevantesGaleria(
        STATE.data.GALERIA || [],
        diaOffsetGaleria
    );
    
    // Filtrar galería por fecha
    const galeriaFiltrada = filtrarGaleriaPorFecha(
        STATE.data.GALERIA || [],
        diaInicioGaleria,
        diaFinGaleria
    );
    
    // Renderizar galería desde la hoja GALERIA de Google Sheets
    // Columnas esperadas: FECHA, TIPO, PUBLICAR, URL, TITULO
    renderGalería(galeriaFiltrada);
    
    // Etiqueta de la fecha para galería
    const labelGaleria = document.getElementById("galeria-fecha-label");
    if (labelGaleria) {
        const diaInicioNum = String(diaInicioGaleria.getDate()).padStart(2, '0');
        const mesInicio = String(diaInicioGaleria.getMonth() + 1).padStart(2, '0');
        const anioInicio = diaInicioGaleria.getFullYear();
        labelGaleria.textContent = `${diaInicioNum}/${mesInicio}/${anioInicio}`;
    }

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

// --- Función para actualizar curso seleccionado en sancionados ---
function actualizarCursoSancionados(ciclo, curso) {
    if (ciclo === "ESO") {
        STATE.cursoSeleccionado.sancionadosESO = curso;
    } else if (ciclo === "BCH") {
        STATE.cursoSeleccionado.sancionadosBCH = curso;
    }
    updateUI();
}

// --- Función para actualizar curso seleccionado en goleadores ---
function actualizarCursoGoleadores(ciclo, curso) {
    if (ciclo === "ESO") {
        STATE.cursoSeleccionado.goleadoresESO = curso;
    } else if (ciclo === "BCH") {
        STATE.cursoSeleccionado.goleadoresBCH = curso;
    }
    updateUI();
}

// --- Inicializar selectores de curso para sancionados y goleadores ---
function initCursoSelectors() {
    // Los selects se crean dinámicamente, así que usamos delegación de eventos
    document.addEventListener('change', (e) => {
        if (e.target && e.target.id) {
            const tipo = e.target.getAttribute('data-tipo');
            const ciclo = e.target.getAttribute('data-ciclo');
            const curso = e.target.value;
            
            if (ciclo && (ciclo === "ESO" || ciclo === "BCH")) {
                if (tipo === "goleadores") {
                    actualizarCursoGoleadores(ciclo, curso);
                } else if (e.target.id.startsWith('filtro-curso-') && !tipo) {
                    // Para sancionados (sin atributo data-tipo)
                    actualizarCursoSancionados(ciclo, curso);
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
    
    // Inicializar selectores de curso para sancionados
    initCursoSelectors();
    
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
    
    // Event listeners para navegación día por día en noticias
    const noticiasAnterior = document.getElementById("noticias-anterior");
    const noticiasSiguiente = document.getElementById("noticias-siguiente");

    if (noticiasAnterior) {
        noticiasAnterior.addEventListener('click', () => {
            diaOffsetNoticias--; // Retroceder un día
            updateUI();
        });
    }

    if (noticiasSiguiente) {
        noticiasSiguiente.addEventListener('click', () => {
            diaOffsetNoticias++; // Avanzar un día
            updateUI();
        });
    }
    
    // Event listeners para navegación día por día en galería
    const galeriaAnterior = document.getElementById("galeria-anterior");
    const galeriaSiguiente = document.getElementById("galeria-siguiente");

    if (galeriaAnterior) {
        galeriaAnterior.addEventListener('click', () => {
            diaOffsetGaleria--; // Retroceder un día
            updateUI();
        });
    }

    if (galeriaSiguiente) {
        galeriaSiguiente.addEventListener('click', () => {
            diaOffsetGaleria++; // Avanzar un día
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