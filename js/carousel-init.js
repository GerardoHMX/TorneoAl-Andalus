// --- carousel-init.js ---
// Inicialización del carrusel

import { initCarousel } from './carousel.js';

// Esperar a que el DOM esté completamente cargado
function initializeCarousel() {
    const carouselCards = [
        {
            text: `
                <div class="flex-1 flex flex-col gap-3">
                    <h3 class="text-2xl md:text-3xl text-brand-blue font-bold text-center mb-3">Torneo escolar de Fútbol Sala</h3>
                    <div class="flex flex-row flex-wrap items-center justify-center gap-3">
                        <img src="img/logo.png" alt="Al-Ándalus" class="w-40 md:w-50 h-40 md:h-50">
                        <div class="flex flex-col gap-1 items-end">
                            <h1 class="text-4xl sm:text-5xl text-brand-red">Al-Ándalus</h1>
                            <h3 class="text-brand-gold text-md font-bold">2025-2026</h3>
                        </div>
                    </div>             
                </div>
            `,
            bgColor: 'bg-brand-white',
            textColor: 'text-brand-blue'
        },
        {
            text: `
                <div class="flex-1 flex flex-col gap-10 mt-4">
                    <div class="text-md font-bold">
                        Torneo organizado por el Departamento de Educación Física del <span class="text-brand-blue text-md  font-bold">Colegio San Francisco de Asís</span>, dirigido a estudiantes de ESO y Bachillerato.
                    </div>
                    <div class="text-md font-bold">
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
                    <div class="text-md font-bold mt-2">
                        Abierto a todo el alumnado de <span class="text-brand-blue text-md font-bold">ESO y Bachillerato</span>.
                        Equipos mixtos sin distinción de género.
                    </div> 
                    <div class="text-md font-bold">
                        <h3 class="text-xl md:text-2xl font-bold text-center mb-3">Equipos</h3>
                        <ul class="mt-2 text-md">
                            <li>                                
                                Hasta <span class="text-brand-blue text-md font-bold">seis jugadores</span> por equipo.
                            </li>
                            <li>                                
                                Hasta <span class="text-brand-blue text-md font-bold">dos capitanes</span> por equipo.
                            </li>
                        </ul>
                    </div> 
                    <div class="text-md font-bold">
                        <h3 class="text-xl md:text-2xl font-bold text-center mb-3">Inscripción</h3>
                        <div class="mt-2 text-md"> 
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
                <div class="text-md font-bold"><span class="text-brand-blue text-md font-bold">Inicio:</span> 25 de noviembre de 2025.</div>
                <div class="text-md font-bold"><span class="text-brand-blue text-md font-bold">Final:</span> 19 de febrero de 2026.</div>
                <div class="text-md font-bold"><span class="text-brand-blue text-md font-bold">Entrega de trofeos:</span> 20 de febrero (Día de Andalucía).</div>
                <div class="text-md font-bold">Partidos en los <span class="text-brand-blue text-md font-bold">recreos</span> (nov–feb).</div>
                <div class="text-md mt-2">
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
                    <div class="text-md font-bold">
                        Fase de grupos <span class="text-brand-blue text-md font-bold">(A, B, C y D)</span> a partido único.
                    </div>
                    <div class="text-md font-bold">
                        Pasan los dos primeros de cada grupo a <span class="text-brand-blue text-md font-bold">cuartos</span>, luego <span class="text-brand-blue text-md font-bold">semifinales</span>, <span
                            class="text-brand-blue text-md font-bold">3.º-4.º</span> y <span class="text-brand-blue text-md font-bold">final</span>.
                    </div>
                    <div class="text-md font-bold">
                        Puntuación: <span class="text-brand-blue text-md font-bold">3</span> victoria · <span class="text-brand-blue text-md font-bold">1</span> empate · <span
                            class="text-brand-white text-md font-blue">0</span> derrota.
                    </div>
                    <div class="text-md font-bold">
                        <span>Partidos arbitrados por profesorado.</span>
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
                    <div class="text-md font-bold">
                        <span>Dos tiempos de <span class="text-brand-blue text-md font-bold">12′</span> (descanso 1′).</span>
                    </div>
                    <div class="text-md font-bold">
                        <span>Saques de banda y córner <span class="text-brand-blue text-md font-bold">con las manos</span>.</span>
                    </div>
                    <div class="text-md font-bold">
                        <span>Sin <span class="text-brand-blue text-md font-bold">cesión al portero</span> y sin <span class="text-brand-blue text-md font-bold">fuera de juego</span>.</span>
                    </div>
                    <div class="text-md font-bold">
                        <span>Faltas directas con <span class="text-brand-blue text-md font-bold">5 pasos</span>; a la 6.ª, <span class="text-brand-blue text-md font-bold">doble penalti</span>.</span>
                    </div>
                    <div class="text-md font-bold">
                        <span>Equipación: <span class="text-brand-blue text-md font-bold">camiseta blanca</span> y otra de <span class="text-brand-blue text-md font-bold">color</span>. Sin equipación adecuada,
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
                    <div class="text-md font-bold">
                        Se valora respeto al árbitro, rival y normas; evitar simulaciones y pérdida de tiempo.
                    </div>
                    <div class="text-md font-bold">
                        Conductas antideportivas pueden suponer <span class="text-brand-blue text-md font-bold">0 puntos de Fair Play</span>, <span class="text-brand-blue text-md font-bold">partido por
                            0-2</span> o <span class="text-brand-blue text-md font-bold">exclusión</span>.
                    </div>
                    <div class="text-md font-bold">
                        Acumulación de 2 amarillas o 1 roja: <span class="text-brand-blue text-md font-bold">un partido</span> de sanción. Dos rojas: <span class="text-brand-blue text-md font-bold">expulsión
                            del torneo</span>.
                    </div>
                    <div class="text-md font-bold">
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
        },
        {
            text: `
                <div class="flex-1 flex flex-col gap-3">
                    <h3 class="text-2xl md:text-3xl text-brand-blue font-bold text-center mb-3">Torneo escolar de Fútbol Sala</h3>
                    <div class="flex flex-row flex-wrap items-center justify-center gap-3">
                        <img src="img/logo.png" alt="Al-Ándalus" class="w-40 md:w-50 h-40 md:h-50">
                        <div class="flex flex-col gap-1 items-end">
                            <h1 class="text-4xl sm:text-5xl text-brand-red">Al-Ándalus</h1>
                            <h3 class="text-brand-gold text-md font-bold">2025-2026</h3>
                        </div>
                    </div>             
                </div>
            `,
            bgColor: 'bg-brand-white',
            textColor: 'text-brand-blue'
        }
    ];

    // Inicializar el carrusel
    initCarousel(carouselCards);
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCarousel);
} else {
    // El DOM ya está listo
    initializeCarousel();
}

