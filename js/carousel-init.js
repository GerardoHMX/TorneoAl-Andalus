// --- carousel-init.js ---
// Inicialización del carrusel

import { initCarousel } from './carousel.js';
import { convertGoogleDriveUrl } from './ui.js';
import { fetchCSV, URLS, getConfigValueFromSheet } from './data.js';

// Función auxiliar para verificar si un valor es "SI"
function esVerdadero(valor) {
    const valorStr = (valor || '').toString().trim().toUpperCase();
    return valorStr === 'SI';
}

// Función para verificar la visibilidad de la sección desde OTROS
async function verificarVisibilidadSeccion(seccionId) {
    try {
        if (!URLS.OTROS) {
            console.warn('No hay URL para OTROS, se asume visible');
            return true;
        }

        const otros = await fetchCSV(URLS.OTROS);
        if (!otros || otros.length === 0) {
            console.warn('No hay datos de OTROS, se asume visible');
            return true;
        }

        // Buscar la sección en los datos de OTROS
        for (const item of otros) {
            const keys = Object.keys(item);
            const seccionKey = keys.find(k => k.toUpperCase() === 'SECCION') || keys.find(k => k.toLowerCase() === 'seccion');
            const visibleKey = keys.find(k => k.toUpperCase() === 'VISIBLE') || keys.find(k => k.toLowerCase() === 'visible');
            
            const seccion = seccionKey ? (item[seccionKey] || '').toString().trim() : '';
            const visible = visibleKey ? (item[visibleKey] || '').toString().trim() : '';
            
            if (seccion) {
                let itemSeccionId = seccion.trim().replace(/^["']|["']$/g, '');
                if (itemSeccionId === seccionId) {
                    return esVerdadero(visible);
                }
            }
        }

        // Si no se encuentra la sección en OTROS, se asume visible por defecto
        console.log(`⚠️ Sección "${seccionId}" no encontrada en OTROS, se asume visible`);
        return true;
    } catch (error) {
        console.error('Error al verificar visibilidad:', error);
        // En caso de error, se asume visible para no bloquear la inicialización
        return true;
    }
}

async function initializeCarousel() {
    // Verificar visibilidad desde los datos de OTROS
    const esVisible = await verificarVisibilidadSeccion('carouselSection');
    const carouselContainer = document.getElementById('carouselSection');
    if (!esVisible) {
        if (carouselContainer) {
            carouselContainer.style.display = 'none';
            return;
        }
    }

    // Logo del colegio desde hoja CONFIGURACION (COLEGIO_LOGO_URL)
    const colegioLogoUrlRaw = await getConfigValueFromSheet('COLEGIO_LOGO_URL');
    const colegioLogoUrl = colegioLogoUrlRaw ? convertGoogleDriveUrl(colegioLogoUrlRaw) : '';
    const logoCard1 = colegioLogoUrl || convertGoogleDriveUrl('https://drive.google.com/file/d/1NefYP3OCHQ7kie9qQgmy1yUOEnZXvvCA/view?usp=sharing');
    const logoCard2 = colegioLogoUrl || convertGoogleDriveUrl('https://drive.google.com/file/d/1wUqSjzfL4POj_t5pC0_RDkLlsgbyDqXT/view?usp=sharing');

    const carouselCards = [
        {
            text: `
                <div class="flex-1 flex flex-col gap-3 items-center justify-center"> 
                    <img src="${logoCard1}" alt="Al-Ándalus" class="w-60 md:w-80 object-contain" onerror="this.style.display='none'"> 
                    <h3 class="text-brand-gold text-md font-bold">2025-2026</h3>  
                </div>
            `,
            bgColor: 'bg-brand-white',
            textColor: 'text-brand-blue',
            title: 'Torneo escolar',
        },
        {
            text: `
                <div class="flex-1 flex flex-col gap-3 items-center justify-center"> 
                    <img src="${logoCard2}" alt="Al-Ándalus" class="w-60 md:w-80 object-contain" onerror="this.style.display='none'"> 
                    <h3 class="text-brand-gold text-md font-bold">Cartel del Torneo escolar</h3>  
                </div>
            `,
            bgColor: 'bg-brand-white',
            textColor: 'text-brand-blue',
            title: 'Cartel del Torneo escolar',
        },
        {
            text: `
                <div class="flex-1 flex flex-col gap-10 mt-4">
                    <div class="text-md font-bold leading-5">
                        Torneo organizado por el Departamento de Educación Física del <span class="text-brand-blue text-md  font-bold">Colegio San Francisco de Asís</span>, dirigido a estudiantes de ESO y Bachillerato.
                    </div>
                    <div class="text-md font-bold leading-5">
                        Más que una competición, el torneo fomenta la <span class="text-brand-blue text-md  font-bold">inclusión, el respeto y la práctica deportiva saludable</span> en un ambiente escolar lleno de compañerismo y alegría.
                    </div>                    
                </div>
            `,
            bgColor: 'bg-brand-white',
            textColor: 'text-gray-700',
            title: 'Descripción del torneo',
        },
        {
            title: 'Participantes',
            text: `
                <div class="flex-1 flex flex-col gap-7">
                    <div class="text-md font-bold mt-2 leading-5">
                        Abierto a todo el alumnado de <span class="text-brand-blue text-md font-bold">ESO y Bachillerato</span>.
                        Equipos mixtos sin distinción de género.
                    </div> 
                    <div class="text-md font-bold leading-5">
                        <h3 class="text-xl md:text-2xl font-bold text-center mb-3 leading-5">Equipos</h3>
                        <ul class="mt-2">
                            <li class="text-md font-bold leading-5">                                
                                Hasta <span class="text-brand-blue text-md font-bold">seis jugadores</span> por equipo.
                            </li>
                            <li class="text-md font-bold leading-5">                                
                                Hasta <span class="text-brand-blue text-md font-bold">dos capitanes</span> por equipo.
                            </li>
                        </ul>
                    </div> 
                    <div class="text-md font-bold leading-5">
                        <h3 class="text-xl md:text-2xl font-bold text-center mb-3">Inscripción</h3>
                        <div class="mt-2 text-md leading-5"> 
                            Entregar hoja de inscripción al profesorado de Educación Física. La fecha límite de inscripción es el <span class="text-brand-blue text-md font-bold">11 de noviembre de 2025</span>.                            
                        </div>
                    </div>
                </div>
            `,
            bgColor: 'bg-brand-white',
            textColor: 'text-gray-700'
        },
        {
            title: 'Calendario',
            text: `
            <div class="flex-1 flex flex-col gap-8 mt-4">
                <div class="text-md font-bold"><span class="text-brand-blue text-md font-bold leading-5">Inicio:</span> 25 de noviembre de 2025.</div>
                <div class="text-md font-bold"><span class="text-brand-blue text-md font-bold leading-5">Final:</span> 19 de febrero de 2026.</div>
                <div class="text-md font-bold"><span class="text-brand-blue text-md font-bold leading-5">Entrega de trofeos:</span> 20 de febrero (Día de Andalucía).</div>
                <div class="text-md font-bold leading-5">Partidos en los <span class="text-brand-blue text-md font-bold">recreos</span> (nov–feb).</div>
                <div class="text-md mt-2 leading-5">
                    <span class="text-brand-blue text-md font-bold">*</span> En caso de lluvia, las finales podrán posponerse a la primera semana posterior a Semana Blanca.
                </div>
            </div>
            `,
            bgColor: 'bg-brand-white',
            textColor: 'text-gray-700'
        },
        {
            title: 'Sistema de competición',
            text: `
                <div class="flex-1 flex flex-col gap-8 mt-4">
                    <div class="text-md font-bold leading-5">
                        Fase de grupos <span class="text-brand-blue text-md font-bold">(A, B, C y D)</span> a partido único.
                    </div>
                    <div class="text-md font-bold leading-5">
                        Pasan los dos primeros de cada grupo a <span class="text-brand-blue text-md font-bold leading-5">cuartos</span>, luego <span class="text-brand-blue text-md font-bold leading-5">semifinales</span>, <span
                            class="text-brand-blue text-md font-bold leading-5">3.º-4.º</span> y <span class="text-brand-blue text-md font-bold leading-5">final</span>.
                    </div>
                    <div class="text-md font-bold leading-5">
                        Puntuación: <span class="text-brand-blue text-md font-bold">3</span> victoria · <span class="text-brand-blue text-md font-bold">1</span> empate · <span
                            class="text-brand-blue text-md font-bold">0</span> derrota.
                    </div>
                    <div class="text-md font-bold leading-5">
                        Partidos arbitrados por profesorado.
                    </div> 
                </div>
            `,
            bgColor: 'bg-brand-white',
            textColor: 'text-gray-700'
        },
        {
            title: 'Normas de juego',
            text: `
                <div class="flex-1 flex flex-col gap-6">  
                    <div class="text-md font-bold leading-5">
                        <span class="text-md font-bold leading-5">Dos tiempos de <span class="text-brand-blue text-md font-bold leading-5">12′</span> (descanso 1′).</span>
                    </div>
                    <div class="text-md font-bold leading-5">
                        <span class="text-md font-bold leading-5">Saques de banda y córner <span class="text-brand-blue text-md font-bold leading-5">con las manos</span>.</span>
                    </div>
                    <div class="text-md font-bold leading-5">
                        <span class="text-md font-bold leading-5">Sin <span class="text-brand-blue text-md font-bold leading-5">cesión al portero</span> y sin <span class="text-brand-blue text-md font-bold leading-5">fuera de juego</span>.</span>
                    </div>
                    <div class="text-md font-bold leading-5">
                        <span class="text-md font-bold leading-5">Faltas directas con <span class="text-brand-blue text-md font-bold leading-5">5 pasos</span>; a la 6.ª, <span class="text-brand-blue text-md font-bold leading-5">doble penalti</span>.</span>
                    </div>
                    <div class="text-md font-bold leading-5">
                        <span class="text-md font-bold leading-5">Equipación: <span class="text-brand-blue text-md font-bold leading-5">camiseta blanca</span> y otra de <span class="text-brand-blue text-md font-bold leading-5">color</span>. Sin equipación adecuada,
                            no se juega.</span>
                    </div>
                </div>
            `,
            bgColor: 'bg-brand-white',
            textColor: 'text-gray-700'
        },
        {
            title: 'Fair Play y disciplina',
            text: `
                <div class="flex-1 flex flex-col gap-6 mt-2">  
                    <div class="text-md font-bold leading-5">
                        Se valora respeto al árbitro, rival y normas; evitar simulaciones y pérdida de tiempo.
                    </div>
                    <div class="text-md font-bold leading-5">
                        Conductas antideportivas pueden suponer <span class="text-brand-blue text-md font-bold">0 puntos de Fair Play</span>, <span class="text-brand-blue text-md font-bold">partido por
                            0-2</span> o <span class="text-brand-blue text-md font-bold">exclusión</span>.
                    </div>
                    <div class="text-md font-bold leading-5">
                        Acumulación de 2 amarillas o 1 roja: <span class="text-brand-blue text-md font-bold">un partido</span> de sanción. Dos rojas: <span class="text-brand-blue text-md font-bold">expulsión
                            del torneo</span>.
                    </div>
                    <div class="text-md font-bold leading-5">
                        Sanciones disciplinarias del centro pueden inhabilitar la participación.
                    </div> 
                </div>
            `,
            bgColor: 'bg-brand-white',
            textColor: 'text-gray-700'
        },
        {
            title: 'Premios y Reconocimientos',
            text: `
            <div class="flex-1 flex flex-col gap-6 justify-center items-center mt-4">  
                <div class="text-lg font-bold"> 🥇 Campeón </div>
                <div class="text-lg font-bold"> 🥈 Subcampeón </div>
                <div class="text-lg font-bold"> 🥉 Tercer puesto </div>
                <div class="text-lg font-bold"> ⚽ Máximo goleador </div>
                <div class="text-lg font-bold"> 🏅 Fair Play</div>
            </p>
            `,
            bgColor: 'bg-brand-white',
            textColor: 'text-gray-700'
        }
    ];

    // Inicializar el carrusel
    initCarousel(carouselCards);
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initializeCarousel();
    });
} else {
    // El DOM ya está listo
    initializeCarousel();
}

