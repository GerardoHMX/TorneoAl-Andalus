// --- accordion-init.js ---

import { convertGoogleDriveUrl } from './ui.js';

const accordionData = [
    {
        text: `
            <div class="flex-1 flex flex-col gap-3 items-center justify-center"> 
                <img src="img/logoTorneo.png" alt="Al-Ándalus" class="w-60 md:w-80 object-contain"> 
                <h3 class="text-brand-gold text-md font-bold">2025-2026</h3>  
            </div>
        `,
        title: 'Torneo escolar',
    },
    {
        text: `
            <div class="flex-1 flex flex-col gap-3 items-center justify-center"> 
                <img src="${convertGoogleDriveUrl('https://drive.google.com/file/d/1wUqSjzfL4POj_t5pC0_RDkLlsgbyDqXT/view?usp=sharing')}" alt="Al-Ándalus" class="w-60 md:w-80 object-contain"> 
                <h3 class="text-brand-gold text-md font-bold">Cartel del Torneo escolar</h3>  
            </div>
        `,
        title: 'Cartel del Torneo escolar',
    },
    {
        title: 'Descripción del torneo',
        text: `
            <div class="flex-1 flex flex-col gap-10 mt-4" >
                <div class="text-gray-800 text-mdleading-5" >
                    Torneo organizado por el Departamento de Educación Física del <span class="text-brand-blue text-md font-bold" >Colegio San Francisco de Asís</span>, dirigido a estudiantes de ESO y Bachillerato.
                </div>
                <div class="text-gray-800 text-mdleading-5" >
                    Más que una competición, el torneo fomenta la <span class="text-brand-blue text-md font-bold" >inclusión, el respeto y la práctica deportiva saludable</span> en un ambiente escolar lleno de compañerismo y alegría.
                </div>                    
            </div>
        `
    },
    {
        title: 'Participantes',
        text: `
            <div class="flex-1 flex flex-col gap-7" >
                <div class="text-gray-800 text-mdmt-2 leading-5" >
                    Abierto a todo el alumnado de <span class="text-brand-blue text-md font-bold" >ESO y Bachillerato</span>.
                    Equipos mixtos sin distinción de género.
                </div> 
                <div class="text-gray-800 text-mdleading-5" >
                    <span class="text-md font-semibold leading-5 text-gray-800" >Equipos</span>
                    <ul class="mt-2">
                        <li class="text-gray-800 text-mdleading-5" >                                
                            Hasta <span class="text-brand-blue text-md font-bold" >seis jugadores</span> por equipo.
                        </li>
                        <li class="text-gray-800 text-mdleading-5" >                                
                            Hasta <span class="text-brand-blue text-md font-bold" >dos capitanes</span> por equipo.
                        </li>
                    </ul>
                </div> 
                <div class="text-gray-800 text-mdleading-5" >
                    <span class="text-md font-semibold leading-5 text-gray-800" >Inscripción</span>
                    <div class="mt-2 text-gray-800 text-md leading-5" > 
                        Entregar hoja de inscripción al profesorado de Educación Física. La fecha límite de inscripción es el <span class="text-brand-blue text-md font-bold" >11 de noviembre de 2025</span>.                            
                    </div>
                </div>
            </div>
        `
    },
    {
        title: 'Calendario',
        text: `
            <div class="flex-1 flex flex-col gap-8 mt-4" >
                <div class="text-gray-800 text-md font-bold" ><span class="text-brand-blue text-mdleading-5" >Inicio:</span> 25 de noviembre de 2025.</div>
                <div class="text-gray-800 text-md font-bold" ><span class="text-brand-blue text-mdleading-5" >Final:</span> 19 de febrero de 2026.</div>
                <div class="text-gray-800 text-md font-bold" ><span class="text-brand-blue text-mdleading-5" >Entrega de trofeos:</span> 20 de febrero (Día de Andalucía).</div>
                <div class="text-gray-800 text-md leading-5" >Partidos en los <span class="text-brand-blue text-md font-bold" >recreos</span> (nov–feb).</div>
                <div class="text-gray-800 text-md mt-2 leading-5" >
                    <span class="text-brand-blue text-md font-bold" >*</span> En caso de lluvia, las finales podrán posponerse a la primera semana posterior a Semana Blanca.
                </div>
            </div>
        `
    },
    {
        title: 'Sistema de competición',
        text: `
            <div class="flex-1 flex flex-col gap-8 mt-4" >
                <div class="text-gray-800 text-mdleading-5" >
                    Fase de grupos <span class="text-brand-blue text-md font-bold" >(A, B, C y D)</span> a partido único.
                </div>
                <div class="text-gray-800 text-mdleading-5" >
                    Pasan los dos primeros de cada grupo a <span class="text-brand-blue text-mdleading-5" >cuartos</span>, luego <span class="text-brand-blue text-mdleading-5" >semifinales</span>, <span
                        class="text-brand-blue text-mdleading-5" >3.º-4.º</span> y <span class="text-brand-blue text-mdleading-5" >final</span>.
                </div>
                <div class="text-gray-800 text-mdleading-5" >
                    Puntuación: <span class="text-brand-blue text-md font-bold" >3</span> victoria · <span class="text-brand-blue text-md font-bold" >1</span> empate · <span
                        class="text-gray-600 text-md" style="text-brand-blue text-md font-bold">0</span> derrota.
                </div>
                <div class="text-gray-800 text-mdleading-5" >
                    Partidos arbitrados por profesorado.
                </div> 
            </div>
        `
    },
    {
        title: 'Normas de juego',
        text: `
            <div class="flex-1 flex flex-col gap-6" >  
                <div class="text-gray-800 text-mdleading-5" >
                    Dos tiempos de <span class="text-brand-blue text-mdleading-5" >12′</span> (descanso 1′).
                </div>
                <div class="text-gray-800 text-mdleading-5" >
                    Saques de banda y córner <span class="text-brand-blue text-mdleading-5" >con las manos</span>.
                </div>
                <div class="text-gray-800 text-mdleading-5" >
                    Sin <span class="text-brand-blue text-mdleading-5" >cesión al portero</span> y sin <span class="text-brand-blue text-mdleading-5" >fuera de juego</span>.
                </div>
                <div class="text-gray-800 text-mdleading-5" >
                    Faltas directas con <span class="text-brand-blue text-mdleading-5" >5 pasos</span>; a la 6.ª, <span class="text-brand-blue text-mdleading-5" >doble penalti</span>.
                </div>
                <div class="text-gray-800 text-mdleading-5" >
                    Equipación: <span class="text-brand-blue text-mdleading-5" >camiseta blanca</span> y otra de <span class="text-brand-blue text-mdleading-5" >color</span>. Sin equipación adecuada,
                    no se juega.
                </div>
            </div>
        `
    },
    {
        title: 'Fair Play y disciplina',
        text: `
            <div class="flex-1 flex flex-col gap-6 mt-2" >  
                <div class="text-gray-800 text-mdleading-5" >
                    Se valora respeto al árbitro, rival y normas; evitar simulaciones y pérdida de tiempo.
                </div>
                <div class="text-gray-800 text-mdleading-5" >
                    Conductas antideportivas pueden suponer <span class="text-brand-blue text-md font-bold" >0 puntos de Fair Play</span>, <span class="text-brand-blue text-md font-bold" >partido por
                        0-2</span> o <span class="text-brand-blue text-md font-bold" >exclusión</span>.
                </div>
                <div class="text-gray-800 text-mdleading-5" >
                    Acumulación de 2 amarillas o 1 roja: <span class="text-brand-blue text-md font-bold" >un partido</span> de sanción. Dos rojas: <span class="text-brand-blue text-md font-bold" >expulsión
                        del torneo</span>.
                </div>
                <div class="text-gray-800 text-mdleading-5" >
                    Sanciones disciplinarias del centro pueden inhabilitar la participación.
                </div> 
            </div>
        `
    },
    {
        title: 'Premios y Reconocimientos',
        text: `
            <div class="flex-1 flex flex-col gap-6 justify-center items-center mt-4" >  
                <div class="text-gray-800 text-lg font-bold" > 🥇 Campeón </div>
                <div class="text-gray-800 text-lg font-bold" > 🥈 Subcampeón </div>
                <div class="text-gray-800 text-lg font-bold" > 🥉 Tercer puesto </div>
                <div class="text-gray-800 text-lg font-bold" > ⚽ Máximo goleador </div>
                <div class="text-gray-800 text-lg font-bold" > 🏅 Fair Play</div>
            </div>
        `
    },
    // {
    //     title: '5nta Edición',
    //     text: `
    //         <div class="flex-1 flex flex-col gap-3">
    //             <h3 class="text-2xl md:text-3xl text-brand-blue font-bold text-center mb-3">Torneo escolar de Fútbol Sala</h3>
    //             <div class="flex flex-row flex-wrap items-center justify-center gap-3">
    //                 <img src="img/logo.png" alt="Al-Ándalus" class="w-40 md:w-50 h-40 md:h-50">
    //                 <div class="flex flex-col gap-1 items-end">
    //                     <h1 class="text-4xl sm:text-5xl text-brand-red">Al-Ándalus</h1>
    //                     <h3 class="text-brand-gold text-md font-bold">2025-2026</h3>
    //                 </div>
    //             </div>
    //         </div>
    //     `
    // }
];

// Función para inicializar el acordeón
function initializeAccordion() {
    const accordionContainer = document.getElementById('basesAccordion');
    if (!accordionContainer) return;

    accordionContainer.innerHTML = '';

    accordionData.forEach((item, index) => {
        const accordionItem = document.createElement('div');
        accordionItem.className = 'accordion-item';

        const itemId = `accordion-item-${index}`;
        const headerId = `accordion-header-${index}`;
        const collapseId = `accordion-collapse-${index}`;

        // Determinar si es el primer elemento (se muestra abierto)
        const isFirst = index === 0;
        const showClass = isFirst ? 'show' : '';
        const collapsedClass = isFirst ? '' : 'collapsed';
        const ariaExpanded = isFirst ? 'true' : 'false';

        accordionItem.innerHTML = `
            <h3 class="accordion-header" id="${headerId}">
                <button 
                    class="accordion-button ${collapsedClass}" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#${collapseId}" 
                    aria-expanded="${ariaExpanded}" 
                    aria-controls="${collapseId}">
                    ${item.title}
                </button>
            </h3>
            <div 
                id="${collapseId}" 
                class="accordion-collapse collapse ${showClass}" 
                aria-labelledby="${headerId}" 
                data-bs-parent="#basesAccordion">
                <div class="accordion-body" >
                    ${item.text}
                </div>
            </div>
        `;

        accordionContainer.appendChild(accordionItem);
    });
}

// Inicializar cuando el DOM y Bootstrap estén listos
function initAccordionWhenReady() {
    // Verificar que Bootstrap esté disponible
    if (typeof bootstrap === 'undefined') {
        // Si Bootstrap no está disponible, esperar un poco más
        setTimeout(initAccordionWhenReady, 100);
        return;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeAccordion);
    } else {
        // El DOM ya está listo
        initializeAccordion();
    }
}

// Iniciar la verificación
initAccordionWhenReady();

