// Funciones de renderizado de cada sección del Torneo Al-Ándalus

const grupos = ["A", "B", "C", "D"];
const ciclos = ['ESO', 'BCH'];
const brandColors = ["brand-red", "brand-orange", "brand-gold", "brand-green", "brand-blue"];
const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const diasSemana = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const maxTeamsPerGroups = 4;
const juegos = 6;
const temsPerGroup = 4;

// --- TABLA DE EQUIPOS ---
export function tablaEquipos(list, ciclo, grupoFiltro = "TODOS") {
    const div = document.getElementById("equipos" + ciclo);
    if (!div) return;

    // Organizar equipos por ciclo y grupo
    const equiposPorCicloGrupo = {};

    list.forEach((m) => {
        if (grupos.includes(m.GRUPO) && m.EQUIPO && m.EQUIPO.trim() !== "" && m.CICLO === ciclo) {
            // Filtrar por grupo si se especifica
            if (grupoFiltro !== "TODOS" && m.GRUPO !== grupoFiltro) {
                return;
            }
            const key = `${m.CICLO || ''}_${m.GRUPO}`;
            if (!equiposPorCicloGrupo[key]) {
                equiposPorCicloGrupo[key] = {
                    ciclo: m.CICLO || '',
                    grupo: m.GRUPO,
                    equipos: []
                };
            }
            equiposPorCicloGrupo[key].equipos.push(m);
        }
    });

    // Generar HTML agrupado por ciclo y grupo
    let html = '';

    // Si hay un filtro de grupo específico, solo mostrar ese grupo
    const gruposAMostrar = grupoFiltro !== "TODOS"
        ? [grupoFiltro]
        : grupos.filter(g => {
            const key = `${ciclo}_${g}`;
            return equiposPorCicloGrupo[key] && equiposPorCicloGrupo[key].equipos.length > 0;
        });

    if (gruposAMostrar.length > 0) {
        gruposAMostrar.forEach((grupo) => {
            const key = `${ciclo}_${grupo}`;
            const data = equiposPorCicloGrupo[key];
            if (data && data.equipos.length > 0) {
                html += `
                    <div class="w-full mb-6">
                        <div class="text-3xl font-bold py-3 font-bold mb-6">
                            <div class="flex items-center gap-2">
                                <h4 class="text-3xl font-bold text-brand-gold flex items-center gap-2">${ciclo}</h4>
                                <h4 class="text-3xl font-bold text-brand-red flex items-center gap-2">Grupo ${grupo}</h4>                                
                            </div>
                        </div>
                        <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            ${data.equipos.map((equipo, index) => `
                                <div class="p-6 bg-transparent shadow-lg ring-1 ring-black/5 border border-gray-200 rounded-brand hover:shadow-brand-md transition-shadow overflow-hidden">
                                    <div class="flex flex-col items-center text-center">
                                        ${equipo.LOGO ? `
                                            <img src="${convertGoogleDriveUrl(equipo.LOGO)}" alt="${equipo.EQUIPO}" class="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 object-contain mb-4" onerror="this.style.display='none'">
                                        ` : `
                                            <div class="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-${brandColors[index]} rounded-full flex items-center justify-center mb-4">                                                
                                            </div>
                                        `}
                                        <h5 class="text-sm sm:text-md md:text-lg font-bold text-brand-text-dark mb-3 uppercase">
                                            ${equipo.EQUIPO}
                                        </h5>
                                        <p class="text-xs md:text-sm text-gray-600 leading-relaxed">
                                            Equipo participante del Grupo ${grupo} en la categoría ${ciclo}.
                                        </p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }
        });
    }

    // Si hay equipos sin ciclo definido, mostrarlos al final
    Object.keys(equiposPorCicloGrupo).forEach(key => {
        if (!key.startsWith('ESO_') && !key.startsWith('BCH_')) {
            const data = equiposPorCicloGrupo[key];
            html += `
                <div class="w-full mb-6">
                    <div class="text-3xl font-bold px-4 py-3 font-bold mb-6">
                        <div class="flex items-center gap-2">
                            <h4 class="text-3xl font-bold text-brand-gold flex items-center gap-2">${data.ciclo}</h4>    
                            <h4 class="text-3xl font-bold text-brand-red flex items-center gap-2">Grupo ${data.grupo}</h4>                            
                        </div>
                    </div>
                    <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        ${data.equipos.map(equipo => `
                            <div class="bg-transparent shadow-lg ring-1 ring-black/5 border border-gray-200 rounded-brand p-6 hover:shadow-brand-lg transition-all duration-300 hover:scale-105">
                                <div class="flex flex-col items-center text-center">
                                    ${equipo.LOGO ? `
                                        <img src="${equipo.LOGO}" alt="${equipo.EQUIPO}" class="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 object-contain mb-4" onerror="this.style.display='none'">
                                    ` : `
                                        <div class="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                            <span class="text-4xl">⚽</span>
                                        </div>
                                    `}
                                    <h5 class="text-sm sm:text-md md:text-lg font-bold text-brand-text-dark mb-3 uppercase">
                                        ${equipo.EQUIPO}
                                    </h5>
                                    <p class="text-xs md:text-sm text-gray-600 leading-relaxed">
                                        Equipo participante del Grupo ${data.grupo} en la categoría ${data.ciclo}. 
                                        Compitiendo en el Torneo Al-Ándalus 2025-2026.
                                    </p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
    });

    div.innerHTML = html;
}

// --- TABLA DE RESULTADOS FASE DE GRUPOS RONDA INICIAL---
export function tablaResultadosFaseDeGrupos(list, ciclo) {
    const div = document.getElementById("faseDeGrupos" + ciclo);
    if (!div) return;
    div.classList.add("mb-6", "mt-6");
    let grupo = "A";
    let cardsPerGroup = [];
    let cardsGroup = [];

    list.map((m, i) => {
        if (grupos.includes(m.GRUPO)) {
            grupo = m.GRUPO;
        }
        if (grupos.includes(m.GRUPO) && m.GRUPO === grupo && m.CICLO === ciclo) {
            // Formatear fecha
            const mesNombre = meses[parseInt(m.MES) - 1] || m.MES;
            const diaFormateado = String(m.DIA).padStart(2, '0');
            const fechaFormateada = `${diaFormateado} ${mesNombre}`;

            cardsPerGroup.push(`                
                <!-- Match Card ${i} -->
                <div class="rounded-brand p-2 sm:p-6 md:p-8 bg-gray-100 bg-transparent shadow-lg ring-1 ring-black/5 border border-gray-200 rounded-brand hover:shadow-brand-md transition-shadow overflow-hidden ">
                    <div class="flex flex-col md:flex-row items-center justify-between gap-2 md:gap-6 mb-6">
                        <div class="flex flex-col items-center flex-1">
                            ${m.LLOGO ? `<img src="${convertGoogleDriveUrl(m.LLOGO)}" alt="${m.LOCAL}" class="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16  object-contain mb-2 md:mb-3 transition-transform duration-300 hover:scale-150" onerror="this.style.display='none'">` : ''}
                            <div class="text-xs sm:text-sm md:text-md font-bold text-gray-800 uppercase text-center">${m.LOCAL}</div>
                        </div>
                        <div class="text-5xl font-bold text-gray-800 flex justify-center items-center gap-2 flex-shrink-0">
                           <span class="text-3xl">${m.LSCORE || '0'}</span> <span class="text-3xl text-brand-gold">:</span> <span class="text-3xl">${m.VSCORE || '0'}</span>
                        </div>
                        <div class="flex flex-col items-center flex-1">
                            ${m.VLOGO ? `<img src="${convertGoogleDriveUrl(m.VLOGO)}" alt="${m.VISITANTE}" class="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16  object-contain mb-2 md:mb-3 transition-transform duration-300 hover:scale-150" onerror="this.style.display='none'">` : ''}
                            <div class="text-xs sm:text-sm md:text-md font-bold text-gray-800 uppercase text-center">${m.VISITANTE}</div>
                        </div>
                    </div>
                    <div class="text-center text-xs md:text-sm text-gray-600 mt-6">
                        GRUPO ${m.GRUPO} - ${fechaFormateada}, ${m.HORA + 'am' || '00:00pm'}
                    </div>
                </div>
            `);
        }
        if (cardsPerGroup.length === juegos && grupos.includes(m.GRUPO)) {
            const html = `
                <div class="w-full mb-6">
                    <div class="text-3xl font-bold py-3 font-bold mb-6">
                        <div class="flex items-center gap-2">
                            <h4 class="text-3xl font-bold text-brand-gold flex items-center gap-2">${m.CICLO}</h4>
                            <h4 class="text-3xl font-bold text-brand-red flex items-center gap-2">Grupo ${m.GRUPO}</h4>                            
                        </div>
                    </div>
                    <div class="grid grid grid-cols-2 lg:grid-cols-3 gap-6" id="cards-per-group-${m.GRUPO}">
                        ${cardsPerGroup.map(card => card).join("")}
                    </div>
                </div>
                `;
            cardsPerGroup = [];
            grupo = m.GRUPO;
            cardsGroup.push(html);
        }
    });

    div.innerHTML = cardsGroup.map(card => card).join("");
}

// --- TABLA DE RESULTADOS SEMIFINAL ---
export function tablaResultadosSemifinal(list, ciclo) {
    const div = document.getElementById("semifinal" + ciclo);
    if (!div) return;
    div.classList.add("mb-6", "mt-6");
    const grupos = ["SEMIFINAL"];
    const juegos = 2;
    let grupo = "SEMIFINAL";
    let cardsPerGroup = [];
    let cardsGroup = [];

    list.map((m, i) => {
        if (grupos.includes(m.GRUPO)) {
            grupo = m.GRUPO;
        }
        if (grupos.includes(m.GRUPO) && m.GRUPO === grupo && m.CICLO === ciclo) {
            // Formatear fecha
            const meses = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
            const mesNombre = meses[parseInt(m.MES) - 1] || m.MES;
            const diaFormateado = String(m.DIA).padStart(2, '0');
            const fechaFormateada = `${diaFormateado} ${mesNombre}`;

            cardsPerGroup.push(`                
                <!-- Match Card ${i} -->
                <div class="p-8 bg-transparent shadow-lg ring-1 ring-black/5 border border-gray-200 rounded-brand hover:shadow-brand-md transition-shadow overflow-hidden" style="background-color: #F5F5F5;">                   
                    <div class="flex items-center justify-between gap-6 mb-6">
                        <div class="flex flex-col items-center flex-1">
                            ${m.LLOGO ? `<img src="${convertGoogleDriveUrl(m.LLOGO)}" alt="${m.LOCAL}" class="w-20 h-20 object-contain mb-3" onerror="this.style.display='none'">` : ''}
                            <div class="text-sm font-bold text-gray-800 uppercase text-center">${m.LOCAL}</div>
                        </div>
                        <div class="text-3xl font-bold text-gray-800">
                            ${m.LSCORE || '0'} <span class="text-3xl text-brand-gold">:</span> ${m.VSCORE || '0'}
                        </div>
                        <div class="flex flex-col items-center flex-1">
                            ${m.VLOGO ? `<img src="${convertGoogleDriveUrl(m.VLOGO)}" alt="${m.VISITANTE}" class="w-20 h-20 object-contain mb-3" onerror="this.style.display='none'">` : ''}
                            <div class="text-sm font-bold text-gray-800 uppercase text-center">${m.VISITANTE}</div>
                        </div>
                    </div>
                    <div class="text-center text-xs md:text-sm text-gray-600 mt-6">
                       Semifinal - ${fechaFormateada}, ${m.HORA + 'am' || '00:00pm'}
                    </div>
                </div>
            `);
        }
        if (cardsPerGroup.length === juegos && grupos.includes(m.GRUPO)) {
            const html = `
                <div class="mb-6" >
                    <div class="flex flex-row items-center gap-2">
                        <h4 class="text-3xl font-bold text-brand-gold mb-6 flex items-center gap-2">${m.CICLO}</h4>
                        <h4 class="text-3xl font-bold text-brand-red mb-6 flex items-center gap-2">
                            Semifinal
                        </h4> 
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-6" id="cards-per-group-${m.GRUPO}">
                        ${cardsPerGroup.map(card => card).join("")}
                    </div>
                </div>
                `;
            cardsPerGroup = [];
            grupo = m.GRUPO;
            cardsGroup.push(html);
        }
    });

    div.innerHTML = cardsGroup.map(card => card).join("");
}

// --- TABLA DE RESULTADOS TERCER PUESTO ---
export function tablaResultadosTercerFinalPuesto(list, ciclo) {
    const div = document.getElementById("tercerFinalPuesto" + ciclo);
    if (!div) return;
    div.classList.add("mb-6", "mt-6");
    const grupos = ["3RPUESTO", "1RPUESTO"];
    const juegos = 1;
    let cardsGroup = [];

    div.classList.add("grid", "grid-cols-1", "md:grid-cols-2", "gap-6");

    // Procesar cada tipo de partido por separado
    grupos.forEach(tipoGrupo => {
        let cardsPerGroup = [];

        list.forEach((m, i) => {
            // Filtrar por ciclo y tipo de grupo específico
            if (m.GRUPO === tipoGrupo && m.CICLO === ciclo) {
                // Formatear fecha
                const mesNombre = meses[parseInt(m.MES) - 1] || m.MES;
                const diaFormateado = String(m.DIA).padStart(2, '0');
                const fechaFormateada = `${diaFormateado} ${mesNombre}`;

                cardsPerGroup.push(`                
                    <!-- Match Card ${i} -->
                    <div class="p-8 bg-transparent shadow-lg ring-1 ring-black/5 border border-gray-200 rounded-brand hover:shadow-brand-md transition-shadow overflow-hidden" style="background-color: #F5F5F5;">
                        <div class="flex items-center justify-between gap-6 mb-6">
                            <div class="flex flex-col items-center flex-1">
                                ${m.LLOGO ? `<img src="${convertGoogleDriveUrl(m.LLOGO)}" alt="${m.LOCAL}" class="w-20 h-20 object-contain mb-3" onerror="this.style.display='none'">` : ''}
                                <div class="text-sm sm:text-md md:text-lg font-bold text-gray-800 uppercase text-center">${m.LOCAL}</div>
                            </div>
                            <div class="text-3xl font-bold text-gray-800">
                                ${m.LSCORE || '0'} <span class="text-3xl text-brand-gold">:</span> ${m.VSCORE || '0'}
                            </div>
                            <div class="flex flex-col items-center flex-1">
                                ${m.VLOGO ? `<img src="${convertGoogleDriveUrl(m.VLOGO)}" alt="${m.VISITANTE}" class="w-20 h-20 object-contain mb-3" onerror="this.style.display='none'">` : ''}
                                <div class="text-sm sm:text-md md:text-lg font-bold text-gray-800 uppercase text-center">${m.VISITANTE}</div>
                            </div>
                        </div>
                        <div class="text-center text-xs md:text-sm text-gray-600 mt-6">
                           ${m.GRUPO === "3RPUESTO" ? "Tercer Puesto" : "Primer Puesto"} - ${fechaFormateada}, ${m.HORA + 'am' || '00:00pm'}
                        </div>
                    </div>
                `);
            }
        });

        // Si hay partidos de este tipo, crear el HTML correspondiente
        if (cardsPerGroup.length > 0) {
            const html = `
                <div class="mb-6" >
                    <div class="flex flex-row items-center gap-2">
                        <h4 class="text-3xl font-bold text-brand-gold mb-6 flex items-center gap-2">${ciclo}</h4>
                        <h4 class="text-3xl font-bold text-brand-red mb-6 flex items-center gap-2">
                            ${tipoGrupo === "3RPUESTO" ? "Tercer Puesto" : "Primer Puesto"}
                        </h4>                        
                    </div>
                    <div class="grid grid-cols-1" id="cards-per-group-${tipoGrupo}">
                        ${cardsPerGroup.map(card => card).join("")}
                    </div>
                </div>
                `;
            cardsGroup.push(html);
        }
    });

    div.innerHTML = cardsGroup.map(card => card).join("");
}

// --- TABLA DE CLASIFICACIÓN INDIVIDUAL ---
export function tablaClasificacion(list, ciclo) {
    const div = document.getElementById("clasificacion" + ciclo);
    if (!div) return;
    div.classList.add("overflow-x-auto", "mb-6", "mt-6");
    let grupo = "A";
    let cardsPerGroup = [];
    let cardsGroup = [];

    list.map((m, i) => {
        if (m.EQUIPOS !== undefined && m.EQUIPOS.trim() !== "" && m.CICLO === ciclo) {
            if (grupos.includes(m.GRUPO)) {
                grupo = m.GRUPO;
            }
            if (grupos.includes(m.GRUPO) && m.GRUPO === grupo) {
                cardsPerGroup.push(`                
                    <!-- Team Card ${i} -->
                    <div class="p-3 md:p-6 bg-transparent shadow-lg ring-1 ring-black/5 border border-gray-200 rounded-brand hover:shadow-brand-md transition-shadow overflow-hidden">
                        <div class="flex items-center justify-center mb-6 gap-1">
                            ${m.LOGO ? `<img src="${convertGoogleDriveUrl(m.LOGO)}" alt="${m.EQUIPOS}" class="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 object-contain" onerror="this.style.display='none'">` : ''}
                            <div class="text-xs sm:text-sm md:text-md lg:text-lg font-bold flex-1">${m.EQUIPOS}</div>
                        </div>
                        <div class="grid grid-cols-2 gap-y-2 md:gap-y-4 gap-x-6 md:gap-x-8">
                            <div class="flex justify-between">
                                <span class="text-gray-500 text-xs sm:text-sm md:text-md lg:text-lg lg:text-lg">PTS:</span>
                                <div class="text-gray-900 font-bold text-xs sm:text-sm md:text-md lg:text-lg">${m.PUNTOS}</div>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-500 text-xs sm:text-sm md:text-md lg:text-lg">G:</span>
                                <div class="text-gray-900 font-bold text-xs sm:text-sm md:text-md lg:text-lg">${m.GANADOS}</div>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-500 text-xs sm:text-sm md:text-md lg:text-lg">E:</span>
                                <div class="text-gray-900 font-bold text-xs sm:text-sm md:text-md lg:text-lg">${m.EMPATADOS}</div>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-500 text-xs sm:text-sm md:text-md lg:text-lg">P:</span>
                                <div class="text-gray-900 font-bold text-xs sm:text-sm md:text-md lg:text-lg">${m.PERDIDOS}</div>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-500 text-xs sm:text-sm md:text-md lg:text-lg">GF:</span>
                                <div class="ttext-gray-900 font-bold text-xs sm:text-sm md:text-md lg:text-lg">${m.GOLESAFAVOR}</div>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-500 text-xs sm:text-sm md:text-md lg:text-lg">GC:</span>
                                <div class="text-gray-900 font-bold text-xs sm:text-sm md:text-md lg:text-lg">${m.GOLESENCONTRA}</div>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-500 text-xs sm:text-sm md:text-md lg:text-lg">DIF:</span>
                                <div class="text-gray-900 font-bold text-xs sm:text-sm md:text-md lg:text-lg">${m.DIFERENCIADEGOLES}</div>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-500 text-xs sm:text-sm md:text-md lg:text-lg">FP:</span>
                                <div class="text-gray-900 font-bold text-xs sm:text-sm md:text-md lg:text-lg">${m.FAIRPLAY}</div>
                            </div>
                        </div>
                        <div class="mt-4 pt-3 border-t border-brand-blue flex justify-between items-center">
                            <span class="text-gray-900 font-bold text-xs sm:text-sm md:text-md lg:text-lg">Total:</span>
                            <div class="text-gray-900 font-bold text-xs sm:text-sm md:text-md lg:text-lg">${m.TOTAL}</div>
                        </div>
                    </div> 
                `);
            }
            if (cardsPerGroup.length === temsPerGroup && grupos.includes(m.GRUPO)) {
                const html = `
                <div class="mb-6">
                    <div class="text-3xl font-bold py-3 font-bold mb-6">
                        <div class="flex items-center gap-2">
                            <h4 class="text-3xl font-bold text-brand-gold flex items-center gap-2">${m.CICLO}</h4>    
                            <h4 class="text-3xl font-bold text-brand-red flex items-center gap-2">Grupo ${m.GRUPO}</h4> 
                        </div>
                    </div>
                    <div class="grid grid-cols-2 lg:grid-cols-4 gap-6" id="points-per-team-${m.GRUPO}">
                        ${cardsPerGroup.map(card => card).join("")}
                    </div>
                </div>
                `;
                cardsPerGroup = [];
                cardsGroup.push(html);
            }
        }
    });

    div.innerHTML = cardsGroup.map(card => card).join("");
}

// --- TABLA DE CLASIFICACIÓN GRUPAL ---
export function tablaClasificacionGrupal(list, ciclo) {
    const div = document.getElementById("clasificacionGrupal" + ciclo);
    if (!div) return;
    div.classList.add("overflow-x-auto", "mb-6", "mt-6");

    // Filtrar equipos por ciclo y Ordenar lista por puntos de forma descendente y luego por diferencia de goles de forma descendente
    const equipos = list
        .filter(m => m.EQUIPOS !== undefined && m.EQUIPOS.trim() !== "" && m.EQUIPOS !== "EQUIPOS" && m.CICLO === ciclo)
        .sort((a, b) => {
            if (b.PUNTOS !== a.PUNTOS) {
                return b.PUNTOS - a.PUNTOS;
            }
            return b.DIFERENCIADEGOLES - a.DIFERENCIADEGOLES;
        })
        .map(m => ({
            ...m,
            PJ: (parseInt(m.GANADOS) || 0) + (parseInt(m.EMPATADOS) || 0) + (parseInt(m.PERDIDOS) || 0), //PJ
            PUNTOS: parseInt(m.PUNTOS) || 0, //PTS
            GANADOS: parseInt(m.GANADOS) || 0, //PG
            EMPATADOS: parseInt(m.EMPATADOS) || 0, //PE
            PERDIDOS: parseInt(m.PERDIDOS) || 0, //PP
            GOLESAFAVOR: parseInt(m.GOLESAFAVOR) || 0, //GF
            GOLESENCONTRA: parseInt(m.GOLESENCONTRA) || 0, //GC
            DIFERENCIADEGOLES: parseInt(m.DIFERENCIADEGOLES) || 0, //DG
            FAIRPLAY: parseInt(m.FAIRPLAY) || 0, //FPY
            TOTAL: parseInt(m.TOTAL) || 0,//TOTAL
        }));

    if (equipos.length === 0) {
        div.innerHTML = '<p class="text-gray-500 text-center">No hay datos de clasificación grupal disponibles</p>';
        return;
    }

    // Agrupar equipos por grupo
    const equiposPorGrupo = {};
    equipos.forEach(equipo => {
        if (grupos.includes(equipo.GRUPO)) {
            if (!equiposPorGrupo[equipo.GRUPO]) {
                equiposPorGrupo[equipo.GRUPO] = [];
            }
            equiposPorGrupo[equipo.GRUPO].push(equipo);
        }
    });

    // Ordenar equipos dentro de cada grupo por puntos (descendente) y luego por diferencia de goles (descendente)
    Object.keys(equiposPorGrupo).forEach(grupo => {
        equiposPorGrupo[grupo].sort((a, b) => {
            if (b.PUNTOS !== a.PUNTOS) {
                return b.PUNTOS - a.PUNTOS;
            }
            return b.DIFERENCIADEGOLES - a.DIFERENCIADEGOLES;
        });
    });

    // Construir HTML para cada grupo
    let html = '';

    grupos.forEach(grupo => {
        if (!equiposPorGrupo[grupo] || equiposPorGrupo[grupo].length === 0) {
            return;
        }

        html += `
            <div class="mb-8">
                <div class="flex items-center justify-between gap-2 mb-4">                
                    <h4 class="text-3xl font-bold text-brand-gold flex items-center gap-2">
                        ${ciclo} - Grupo ${grupo}
                    </h4>
                </div>
                <div class="rounded-brand overflow-hidden shadow-lg">
                    <div class="overflow-x-auto">
                        <table class="w-full min-w-full" style="border-collapse: collapse;">
                            <thead>
                                <tr style="background-color: #B30000; color: white;">
                                    <th class="font-bold uppercase py-2 px-2 md:py-4 md:px-4 text-xs sm:text-sm md:text-md lg:text-lg" style="text-align: left; padding-left: 1rem;">POS</th>
                                    <th class="font-bold uppercase py-2 px-2 md:py-4 md:px-4 text-xs sm:text-sm md:text-md lg:text-lg" style="text-align: left; padding-left: 1rem;">EQUIPO</th>
                                    <th class="font-bold uppercase py-2 px-2 md:py-4 md:px-4 text-xs sm:text-sm md:text-md lg:text-lg" style="text-align: center;">PJ</th>
                                    <th class="font-bold uppercase py-2 px-2 md:py-4 md:px-4 text-xs sm:text-sm md:text-md lg:text-lg" style="text-align: center;">PTS</th>
                                    <th class="font-bold uppercase py-2 px-2 md:py-4 md:px-4 text-xs sm:text-sm md:text-md lg:text-lg" style="text-align: center;">PG</th>
                                    <th class="font-bold uppercase py-2 px-2 md:py-4 md:px-4 text-xs sm:text-sm md:text-md lg:text-lg" style="text-align: center;">PE</th>
                                    <th class="font-bold uppercase py-2 px-2 md:py-4 md:px-4 text-xs sm:text-sm md:text-md lg:text-lg" style="text-align: center;">PP</th>
                                    <th class="font-bold uppercase py-2 px-2 md:py-4 md:px-4 text-xs sm:text-sm md:text-md lg:text-lg" style="text-align: center;">GF</th>
                                    <th class="font-bold uppercase py-2 px-2 md:py-4 md:px-4 text-xs sm:text-sm md:text-md lg:text-lg" style="text-align: center;">GC</th>
                                    <th class="font-bold uppercase py-2 px-2 md:py-4 md:px-4 text-xs sm:text-sm md:text-md lg:text-lg" style="text-align: center;">DG</th>
                                    <th class="font-bold uppercase py-2 px-2 md:py-4 md:px-4 text-xs sm:text-sm md:text-md lg:text-lg" style="text-align: center;">FPY</th>
                                    <th class="font-bold uppercase py-2 px-2 md:py-4 md:px-4 text-xs sm:text-sm md:text-md lg:text-lg" style="text-align: center; padding-right: 1rem;">TOTAL</th>
                                </tr>
                            </thead>
                            <tbody>
        `;

        equiposPorGrupo[grupo].forEach((equipo, index) => {
            const pos = equipo.PJ > 0 ? String(index + 1).padStart(2, '0') : '';
            const dgFormatted = equipo.DIFERENCIADEGOLES >= 0 ? `+${equipo.DIFERENCIADEGOLES}` : `${equipo.DIFERENCIADEGOLES}`;

            html += `
                <tr class="bg-white border-gray-100 border border-b">
                    <td class="py-2 px-2 md:py-4 md:px-4 font-medium" style="text-align: left; padding-left: 1rem; color: #333333;">${pos}</td>
                    <td class="py-2 px-2 md:py-4 md:px-4" style="text-align: left; padding-left: 1rem;">
                        <div class="flex items-center gap-3">
                            ${equipo.LOGO ? `<img src="${convertGoogleDriveUrl(equipo.LOGO)}" alt="${equipo.EQUIPOS}" class="w-8 h-8 object-contain transition-transform duration-300 hover:scale-150" style="min-width: 32px; min-height: 32px;" onerror="this.style.display='none'">` : ''}
                            <span class="font-medium uppercase text-xs sm:text-sm md:text-md lg:text-lg">${equipo.EQUIPOS}</span>
                        </div>
                    </td>
                    <td class="py-2 px-2 md:py-4 md:px-4 text-center font-medium text-xs sm:text-sm md:text-md lg:text-lg">${equipo.PJ}</td>
                    <td class="py-2 px-2 md:py-4 md:px-4 text-center font-medium text-xs sm:text-sm md:text-md lg:text-lg">${equipo.PUNTOS}</td>
                    <td class="py-2 px-2 md:py-4 md:px-4 text-center font-medium text-xs sm:text-sm md:text-md lg:text-lg">${equipo.GANADOS}</td>
                    <td class="py-2 px-2 md:py-4 md:px-4 text-center font-medium text-xs sm:text-sm md:text-md lg:text-lg">${equipo.EMPATADOS}</td>
                    <td class="py-2 px-2 md:py-4 md:px-4 text-center font-medium text-xs sm:text-sm md:text-md lg:text-lg">${equipo.PERDIDOS}</td>
                    <td class="py-2 px-2 md:py-4 md:px-4 text-center font-medium text-xs sm:text-sm md:text-md lg:text-lg">${equipo.GOLESAFAVOR}</td>
                    <td class="py-2 px-2 md:py-4 md:px-4 text-center font-medium text-xs sm:text-sm md:text-md lg:text-lg">${equipo.GOLESENCONTRA}</td>
                    <td class="py-2 px-2 md:py-4 md:px-4 text-center font-medium text-xs sm:text-sm md:text-md lg:text-lg">${dgFormatted}</td>
                    <td class="py-2 px-2 md:py-4 md:px-4 text-center font-medium text-xs sm:text-sm md:text-md lg:text-lg">${equipo.FAIRPLAY}</td>
                    <td class="py-2 px-2 md:py-4 md:px-4 text-center font-medium text-xs sm:text-sm md:text-md lg:text-lg" style="color: #333333; padding-right: 1rem;">${equipo.TOTAL}</td>
                </tr>
            `;
        });

        html += `
                            </tbody>
                        </table>
                    </div>
                    <div class="bg-gray-100 py-2 px-2 md:py-4 md:px-4 border-t border-gray-300">
                        <div class="flex flex-wrap gap-x-6 gap-y-1 justify-center">
                            <span class="text-xs text-gray-600"><strong class="text-xs">Pos:</strong> Posición</span>
                            <span class="text-xs text-gray-600"><strong class="text-xs">PJ:</strong> Partidos Jugados</span>
                            <span class="text-xs text-gray-600"><strong class="text-xs">PTS:</strong> Puntos</span>
                            <span class="text-xs text-gray-600"><strong class="text-xs">PG:</strong> Partidos Ganados</span>
                            <span class="text-xs text-gray-600"><strong class="text-xs">PE:</strong> Partidos Empatados</span>
                            <span class="text-xs text-gray-600"><strong class="text-xs">PP:</strong> Partidos Perdidos</span>
                            <span class="text-xs text-gray-600"><strong class="text-xs">GF:</strong> Goles a Favor</span>
                            <span class="text-xs text-gray-600"><strong class="text-xs">GC:</strong> Goles en Contra</span>
                            <span class="text-xs text-gray-600"><strong class="text-xs">DG:</strong> Diferencia de Goles</span>
                            <span class="text-xs text-gray-600"><strong class="text-xs">FPY:</strong> Fair Play</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    if (html === '') {
        div.innerHTML = '<p class="text-gray-500 text-center">No hay datos de clasificación grupal disponibles</p>';
        return;
    }

    div.innerHTML = html;
}

// --- TABLA DE RESULTADOS ---
export function tablaResultados(list, ciclo) {
    const div = document.getElementById("resultados" + ciclo);
    if (!div) return;
    div.classList.add("overflow-x-auto", "mb-6", "mt-6");
    const equipos = list
        .filter(m => m.EQUIPOS !== undefined && m.EQUIPOS.trim() !== "" && m.EQUIPOS !== "EQUIPOS" && m.CICLO === ciclo)
        .map(m => ({
            ...m,
            PJ: (parseInt(m.GANADOS) || 0) + (parseInt(m.EMPATADOS) || 0) + (parseInt(m.PERDIDOS) || 0), // Partidos Jugados
            PTS: parseInt(m.PUNTOS) || 0, // Puntos
            PG: parseInt(m.GANADOS) || 0, // Partidos Ganados
            PE: parseInt(m.EMPATADOS) || 0, // Empates
            PP: parseInt(m.PERDIDOS) || 0, // Perdidos
            GF: parseInt(m.GOLESAFAVOR) || 0, // Goles a favor
            GC: parseInt(m.GOLESENCONTRA) || 0, // Goles en contra
            DG: parseInt(m.DIFERENCIADEGOLES) || 0, // Diferencia de goles
        }));

    if (equipos.length === 0) {
        div.innerHTML = '<p class="text-gray-500 text-center">No hay datos de resultados disponibles</p>';
        return;
    }

    // Ordenar por puntos (descendente) y luego por diferencia de goles (descendente)
    equipos.sort((a, b) => {
        if (b.PTS !== a.PTS) {
            return b.PTS - a.PTS;
        }
        return b.DG - a.DG;
    });

    // Construir la tabla
    let html = `
        <div class="rounded-brand overflow-hidden shadow-lg">
            <div class="overflow-x-auto">
                <div class="flex items-center justify-between gap-2">                
                    <h4 class="text-3xl font-bold text-brand-gold mb-2 flex items-center gap-2">
                        ${ciclo}
                    </h4>
                </div>
                <table class="w-full min-w-full" style="border-collapse: collapse;">
                    <thead>
                        <tr style="background-color: #B30000; color: white;">
                            <th class="font-bold uppercase py-2 px-2 md:py-4 md:px-4 text-xs sm:text-sm md:text-md lg:text-lg" style="text-align: left; padding-left: 1rem;">POS</th>
                            <th class="font-bold uppercase py-2 px-2 md:py-4 md:px-4 text-xs sm:text-sm md:text-md lg:text-lg" style="text-align: left; padding-left: 1rem;">Equipo</th>
                            <th class="font-bold uppercase py-2 px-2 md:py-4 md:px-4 text-xs sm:text-sm md:text-md lg:text-lg" style="text-align: center;">PJ</th> <!-- Partidos Jugados -->
                            <th class="font-bold uppercase py-2 px-2 md:py-4 md:px-4 text-xs sm:text-sm md:text-md lg:text-lg" style="text-align: center;">PG</th> <!-- Partidos Ganados -->
                            <th class="font-bold uppercase py-2 px-2 md:py-4 md:px-4 text-xs sm:text-sm md:text-md lg:text-lg" style="text-align: center;">PE</th> <!-- Empates -->
                            <th class="font-bold uppercase py-2 px-2 md:py-4 md:px-4 text-xs sm:text-sm md:text-md lg:text-lg" style="text-align: center;">PP</th> <!-- Partidos Perdidos -->
                            <th class="font-bold uppercase py-2 px-2 md:py-4 md:px-4 text-xs sm:text-sm md:text-md lg:text-lg" style="text-align: center;">GF</th> <!-- Goles a favor -->
                            <th class="font-bold uppercase py-2 px-2 md:py-4 md:px-4 text-xs sm:text-sm md:text-md lg:text-lg" style="text-align: center;">GC</th> <!-- Goles en contra -->
                            <th class="font-bold uppercase py-2 px-2 md:py-4 md:px-4 text-xs sm:text-sm md:text-md lg:text-lg" style="text-align: center;">DG</th> <!-- Diferencia de goles -->
                            <th class="font-bold uppercase py-2 px-2 md:py-4 md:px-4 text-xs sm:text-sm md:text-md lg:text-lg" style="text-align: center; padding-right: 1rem;">PTS</th> <!-- Puntos -->
                        </tr>
                    </thead>
                    <tbody>
    `;

    equipos.forEach((equipo, index) => {
        const pos = equipo.PJ > 0 ? String(index + 1).padStart(2, '0') : '';
        const dgFormatted = equipo.DG >= 0 ? `+${equipo.DG}` : `${equipo.DG}`;

        html += `
            <tr class="bg-white bg-white border-gray-100 border border-b">
                <td class="py-2 px-2 md:py-4 md:px-4 font-medium" style="text-align: left; padding-left: 1rem; color: #333333;">${pos}</td>
                <td class="py-2 px-2 md:py-4 md:px-4" style="text-align: left; padding-left: 1rem;">
                    <div class="flex items-center gap-3">
                        ${equipo.LOGO ? `<img src="${convertGoogleDriveUrl(equipo.LOGO)}" alt="${equipo.EQUIPOS}" class="w-8 h-8 object-contain transition-transform duration-300 hover:scale-150" style="min-width: 32px; min-height: 32px;" onerror="this.style.display='none'">` : ''}
                        <span class="font-medium uppercase text-xs sm:text-sm md:text-md lg:text-lg" >${equipo.EQUIPOS}</span>
                    </div>
                </td>
                <td class="py-2 px-2 md:py-4 md:px-4 text-center font-medium text-xs sm:text-sm md:text-md lg:text-lg" >${equipo.PJ}</td> <!-- Partidos Jugados -->
                <td class="py-2 px-2 md:py-4 md:px-4 text-center font-medium text-xs sm:text-sm md:text-md lg:text-lg" >${equipo.PG}</td> <!-- Partidos Ganados -->
                <td class="py-2 px-2 md:py-4 md:px-4 text-center font-medium text-xs sm:text-sm md:text-md lg:text-lg" >${equipo.PE}</td> <!-- Empates -->
                <td class="py-2 px-2 md:py-4 md:px-4 text-center font-medium text-xs sm:text-sm md:text-md lg:text-lg" >${equipo.PP}</td> <!-- Partidos Perdidos -->
                <td class="py-2 px-2 md:py-4 md:px-4 text-center font-medium text-xs sm:text-sm md:text-md lg:text-lg" >${equipo.GF}</td> <!-- Goles a favor -->
                <td class="py-2 px-2 md:py-4 md:px-4 text-center font-medium text-xs sm:text-sm md:text-md lg:text-lg" >${equipo.GC}</td> <!-- Goles en contra -->
                <td class="py-2 px-2 md:py-4 md:px-4 text-center font-medium text-xs sm:text-sm md:text-md lg:text-lg" >${dgFormatted}</td> <!-- Diferencia de goles -->
                <td class="py-2 px-2 md:py-4 md:px-4 text-center font-medium text-xs sm:text-sm md:text-md lg:text-lg" style="color: #333333; padding-right: 1rem;">${equipo.PTS}</td> <!-- Puntos -->
            </tr>
        `;
    });

    html += `
                    </tbody>
                </table>
            </div>
            <div class="bg-gray-100 py-2 px-2 md:py-4 md:px-4 border-t border-gray-300">
                <div class="flex flex-wrap gap-x-6 gap-y-1 justify-center">
                    <span class="text-xs text-gray-600"><strong class="text-xs">Pos:</strong> Posición</span>
                    <span class="text-xs text-gray-600"><strong class="text-xs">PJ:</strong> Partidos Jugados</span>
                    <span class="text-xs text-gray-600"><strong class="text-xs">PG:</strong> Partidos Ganados</span>
                    <span class="text-xs text-gray-600"><strong class="text-xs">PE:</strong> Partidos Empatados</span>
                    <span class="text-xs text-gray-600"><strong class="text-xs">PP:</strong> Partidos Perdidos</span>
                    <span class="text-xs text-gray-600"><strong class="text-xs">GF:</strong> Goles a Favor</span>
                    <span class="text-xs text-gray-600"><strong class="text-xs">GC:</strong> Goles en Contra</span>
                    <span class="text-xs text-gray-600"><strong class="text-xs">DG:</strong> Diferencia de Goles</span>
                    <span class="text-xs text-gray-600"><strong class="text-xs">PTS:</strong> Puntos</span>
                </div>
            </div>
        </div>
    `;

    div.innerHTML = html;
}

// --- TABLA DE LIDERES GOLEADORES ---
export function tablaLideresGoleadores(list, ciclo, otros = [], cursoFiltro = "TODOS") {
    const div = document.getElementById("goleadores" + ciclo);
    if (!div) return;
    div.classList.add("mb-6", "mt-6");

    // Filtrar lideres para no mostrar registros incompletos
    let lideres = list.filter(lider =>
        lider.CICLO === ciclo &&
        lider.CICLO !== undefined &&
        lider.CICLO !== "" &&
        lider.JUGADOR !== undefined &&
        lider.JUGADOR !== ""
    );

    // Obtener cursos únicos para el select
    const cursosUnicos = [...new Set(lideres.map(l => l.CURSO).filter(c => c && c !== ""))].sort();

    // Aplicar filtro de curso si no es "TODOS"
    if (cursoFiltro !== "TODOS") {
        lideres = lideres.filter(lider => lider.CURSO === cursoFiltro);
    }

    // Función auxiliar para obtener la imagen según CICLO y POSICION
    const obtenerImagenPorPosicion = (ciclo, posicion) => {
        if (!otros || otros.length === 0) {
            return null;
        }

        // Buscar la imagen - verificar diferentes formatos posibles de los nombres de columnas
        const imagenData = otros.find(item => {
            const cicloMatch = (item.CICLO || item.ciclo || '').trim().toUpperCase() === ciclo.toUpperCase();
            const posicionMatch = parseInt(item.POSICION || item.posicion || item.POSICION || 0) === posicion;
            return cicloMatch && posicionMatch;
        });

        if (imagenData) {
            const urlImagen = imagenData.AVATARPOSICIONES || imagenData.avatarposiciones || imagenData.AVATARPOSICION || imagenData.avatarposicion;
            return urlImagen || null;
        }
        return null;
    };

    //Ordenar la lista por goles de forma descendente
    const listOrdered = lideres.sort((a, b) => (parseInt(b.GOLES) || 0) - (parseInt(a.GOLES) || 0));
    let liderCiclo = "";
    let index = 0;

    // Primera parte: Top 3 goleadores en tarjetas (siempre se muestran)
    let html = `                
    <div>
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">                
            <h4 class="text-3xl font-bold text-brand-gold mb-2 flex items-center gap-2">
                ${ciclo}
            </h4>
            <div class="flex items-center gap-2">
                <label for="filtro-curso-goleadores-${ciclo}" class="font-bold text-xs sm:text-sm md:text-md lg:text-lg uppercase whitespace-nowrap">Curso:</label>
                <select id="filtro-curso-goleadores-${ciclo}" class="px-4 py-2 border border-gray-300 rounded-brand bg-white text-gray-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent cursor-pointer" data-ciclo="${ciclo}" data-tipo="goleadores">
                    <option value="TODOS" ${cursoFiltro === "TODOS" ? "selected" : ""}>TODOS</option>
                    ${cursosUnicos.map(curso => `<option value="${curso}" ${cursoFiltro === curso ? "selected" : ""}>${curso}</option>`).join("")}
                </select>
            </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" id="lideres${ciclo}">        
    `;

    // Mostrar hasta 3 tarjetas, incluso si no hay datos
    for (let i = 0; i < 3; i++) {
        const lider = listOrdered[i];
        const imagenAvatar = obtenerImagenPorPosicion(ciclo, i + 1);

        if (lider) {
            html += `
            <div class="flex flex-col bg-white shadow-lg overflow-hidden rounded-brand hover:shadow-brand-lg transition-shadow border-b-2" style="border-bottom-color: var(--brand-gold);">
                <div class="w-full h-16 md:h-28 lg:h-32 flex items-center justify-center overflow-hidden">
                    ${imagenAvatar ? `
                        <img src="${convertGoogleDriveUrl(imagenAvatar)}" alt="${lider.JUGADOR}" class="h-full object-cover object-center">
                    ` : `
                        <div class="w-full h-full flex items-center justify-center">
                            <span class="text-gray-400 text-lg">${lider.JUGADOR || ''}</span>
                        </div>
                    `}
                </div> 
                <div class="relative flex flex-col items-center justify-center py-2 px-3" >                    
                    <div class="absolute top-0 left-0 right-0 h-0.5 bg-brand-blue"></div>
                    <div class="flex flex-col items-center gap-1">
                        <h5 class="text-lg font-bold text-brand-blue text-center">
                            ${lider.JUGADOR || ''}
                        </h5>
                        <p class="text-sm text-gray-600 text-center">
                            ${lider.EQUIPO || ''}
                        </p>
                        <p class="text-sm text-gray-600 text-center">
                            ${i == 0 ? 'Primer' : i == 1 ? 'Segundo' : i == 2 ? 'Tercero' : ''} Puesto  ${lider.GOLES ? lider.GOLES + ' Goles' : '0 Goles'} 
                        </p>
                    </div>                    
                </div>
            </div> 
            `;
        } else {
            // Mostrar tarjeta vacía si no hay datos para esta posición
            html += `
            <div class="flex flex-col bg-white shadow-lg overflow-hidden rounded-brand border-b-2" style="border-bottom-color: var(--brand-gold); opacity: 0.5;">
                <div class="w-full h-16 md:h-28 lg:h-32 flex items-center justify-center overflow-hidden">
                    ${imagenAvatar ? `
                        <img src="${convertGoogleDriveUrl(imagenAvatar)}" alt="Posición ${i + 1}" class="h-full object-cover object-center">
                    ` : `
                        <div class="w-full h-full flex items-center justify-center">
                            <span class="text-gray-400 text-lg">-</span>
                        </div>
                    `}
                </div> 
                <div class="relative flex flex-col items-center justify-center py-2 px-3" >                    
                    <div class="absolute top-0 left-0 right-0 h-0.5 bg-brand-blue"></div>
                    <div class="flex flex-col items-center gap-1">
                        <h5 class="text-lg font-bold text-brand-blue text-center">
                            -
                        </h5>
                        <p class="text-sm text-gray-600 text-center">
                            -
                        </p>
                        <p class="text-sm text-gray-600 text-center">
                            ${i == 0 ? 'Primer' : i == 1 ? 'Segundo' : i == 2 ? 'Tercero' : ''} Puesto
                        </p>
                    </div>                    
                </div>
            </div> 
            `;
        }
    }

    html += '</div>';

    // Segunda parte: Tabla completa con todos los goleadores o mensaje si no hay datos
    const goleadoresCiclo = listOrdered;

    if (goleadoresCiclo.length > 0) {
        html += `
            <div class="rounded-brand overflow-hidden shadow-lg mt-8">
                <div class="overflow-x-auto">
                    <table class="w-full min-w-full" style="border-collapse: collapse;">
                        <thead>
                            <tr style="background-color: #B30000; color: white;">
                                <th class="font-bold uppercase py-2 px-2 md:py-4 md:px-4 text-xs sm:text-sm md:text-md lg:text-lg" style="width: 25%; text-align: left; padding-left: 1rem;">CICLO</th>
                                <th class="font-bold uppercase py-2 px-2 md:py-4 md:px-4 text-xs sm:text-sm md:text-md lg:text-lg" style="width: 25%; text-align: left; padding-left: 1rem;">EQUIPO</th>
                                <th class="font-bold uppercase py-2 px-2 md:py-4 md:px-4 text-xs sm:text-sm md:text-md lg:text-lg" style="width: 25%; text-align: left; padding-left: 1rem;">CURSO</th>
                                <th class="font-bold uppercase py-2 px-2 md:py-4 md:px-4 text-xs sm:text-sm md:text-md lg:text-lg" style="width: 25%; text-align: left; padding-left: 1rem;">JUGADOR</th>
                                <th class="font-bold uppercase py-2 px-2 md:py-4 md:px-4 text-xs sm:text-sm md:text-md lg:text-lg" style="width: 25%; text-align: center; padding-right: 1rem;">GOLES</th>
                            </tr>
                        </thead>
                        <tbody>
        `;

        goleadoresCiclo.forEach((lider) => {
            html += `
                <tr class="bg-white border-gray-100 border border-b">
                    <td class="py-2 px-2 md:py-4 md:px-4" style="text-align: left; padding-left: 1rem;">
                        <span class="font-medium uppercase text-xs sm:text-sm md:text-md lg:text-lg">${lider.CICLO || ''}</span>
                    </td>
                    <td class="py-2 px-2 md:py-4 md:px-4" style="text-align: left; padding-left: 1rem;">
                        <span class="font-medium uppercase text-xs sm:text-sm md:text-md lg:text-lg">${lider.EQUIPO || ''}</span>
                    </td>
                    <td class="py-2 px-2 md:py-4 md:px-4" style="text-align: left; padding-left: 1rem;">
                        <span class="font-medium text-xs sm:text-sm md:text-md lg:text-lg">${lider.CURSO || ''}</span>
                    </td>
                    <td class="py-2 px-2 md:py-4 md:px-4" style="text-align: left; padding-left: 1rem;">
                        <span class="font-medium text-xs sm:text-sm md:text-md lg:text-lg">${lider.JUGADOR || ''}</span>
                    </td>
                    <td class="py-2 px-2 md:py-4 md:px-4 text-center font-medium text-xs sm:text-sm md:text-md lg:text-lg" style="padding-right: 1rem;">${lider.GOLES || 0}</td>
                </tr>
            `;
        });

        html += `
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    } else {
        // Mostrar tabla con encabezados y mensaje como celda con colspan
        html += `
            <div class="rounded-brand overflow-hidden shadow-lg mt-8">
                <div class="overflow-x-auto">
                    <table class="w-full min-w-full" style="border-collapse: collapse;">
                        <thead>
                            <tr style="background-color: #B30000; color: white;">
                                <th class="font-bold uppercase py-2 px-2 md:py-4 md:px-4 text-xs sm:text-sm md:text-md lg:text-lg" style="width: 25%; text-align: left; padding-left: 1rem;">CICLO</th>
                                <th class="font-bold uppercase py-2 px-2 md:py-4 md:px-4 text-xs sm:text-sm md:text-md lg:text-lg" style="width: 25%; text-align: left; padding-left: 1rem;">EQUIPO</th>
                                <th class="font-bold uppercase py-2 px-2 md:py-4 md:px-4 text-xs sm:text-sm md:text-md lg:text-lg" style="width: 25%; text-align: left; padding-left: 1rem;">CURSO</th>
                                <th class="font-bold uppercase py-2 px-2 md:py-4 md:px-4 text-xs sm:text-sm md:text-md lg:text-lg" style="width: 25%; text-align: left; padding-left: 1rem;">JUGADOR</th>
                                <th class="font-bold uppercase py-2 px-2 md:py-4 md:px-4 text-xs sm:text-sm md:text-md lg:text-lg" style="width: 25%; text-align: center; padding-right: 1rem;">GOLES</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="bg-white border-gray-100 border border-b">
                                <td colspan="5" class="py-8 px-4 text-center">
                                    <p class="text-gray-700 text-xs sm:text-sm md:text-md lg:text-lg">${cursoFiltro !== "TODOS" ? "No hay goleadores registrados para este curso." : (ciclo === "ESO" ? "Aún no hay partidos jugados, pronto conoceremos a los primeros líderes de goleo." : "Todavía no se registran partidos. ¡Los goleadores aparecerán en cuanto ruede el balón!")}</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    html += '</div>';
    div.innerHTML = html;
}

// --- TABLA DE SANCIONADOS ---
export function tablaSancionados(list, ciclo, cursoFiltro = "TODOS") {
    const div = document.getElementById("sancionados" + ciclo);
    if (!div) return;
    div.classList.add("overflow-x-auto", "mb-6", "mt-6");

    // Filtrar sancionados para no mostrar registros incompletos
    let sancionados = list.filter(sancionado =>
        sancionado.CICLO === ciclo &&
        sancionado.CICLO !== undefined &&
        sancionado.CICLO !== "" &&
        sancionado.JUGADOR !== undefined &&
        sancionado.JUGADOR !== ""
    );

    // Obtener cursos únicos para el select
    const cursosUnicos = [...new Set(sancionados.map(s => s.CURSO).filter(c => c && c !== ""))].sort();

    // Aplicar filtro de curso si no es "TODOS"
    if (cursoFiltro !== "TODOS") {
        sancionados = sancionados.filter(sancionado => sancionado.CURSO === cursoFiltro);
    }

    // Construir la tabla siempre, con o sin datos
    let html = `
        <div class="mb-6">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">                
                <h4 class="text-3xl font-bold text-brand-gold mb-2 flex items-center gap-2">
                    ${ciclo}
                </h4>
                <div class="flex items-center gap-2">
                    <label for="filtro-curso-${ciclo}" class="font-bold text-xs sm:text-sm md:text-md lg:text-lg uppercase whitespace-nowrap">Curso:</label>
                    <select id="filtro-curso-${ciclo}" class="px-4 py-2 border border-gray-300 rounded-brand bg-white text-gray-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent cursor-pointer" data-ciclo="${ciclo}">
                        <option value="TODOS" ${cursoFiltro === "TODOS" ? "selected" : ""}>TODOS</option>
                        ${cursosUnicos.map(curso => `<option value="${curso}" ${cursoFiltro === curso ? "selected" : ""}>${curso}</option>`).join("")}
                    </select>
                </div>
            </div>
            <div class="rounded-brand overflow-hidden shadow-lg">
                <div class="overflow-scroll max-h-[32rem]">
                    <table class="w-full" style="border-collapse: collapse;">
                        <thead>
                            <tr style="background-color: #B30000; color: white;">
                                <th class="font-bold uppercase py-2 px-2 md:py-4 md:px-4 text-xs sm:text-sm md:text-md lg:text-lg" style="width: 16%; text-align: left; padding-left: 1rem;">EQUIPO</th>
                                <th class="font-bold uppercase py-2 px-2 md:py-4 md:px-4 text-xs sm:text-sm md:text-md lg:text-lg" style="width: 20%; text-align: left; ">CURSO</th>
                                <th class="font-bold uppercase py-2 px-2 md:py-4 md:px-4 text-xs sm:text-sm md:text-md lg:text-lg" style="width: 12%; text-align: left; ">JUGADOR</th>
                                <th class="font-bold uppercase py-2 px-2 md:py-4 md:px-4 text-xs sm:text-sm md:text-md lg:text-lg" style="width: 16%; text-align: center;">ROJAS</th>
                                <th class="font-bold uppercase py-2 px-2 md:py-4 md:px-4 text-xs sm:text-sm md:text-md lg:text-lg" style="width: 16%; text-align: center;">AMARILLAS</th>
                                <th class="font-bold uppercase py-2 px-2 md:py-4 md:px-4 text-xs sm:text-sm md:text-md lg:text-lg" style="width: 16%; text-align: center;">SUSPENDIDOS</th>
                            </tr>
                        </thead>
                        <tbody>
    `;

    if (sancionados.length === 0) {
        // Mostrar mensaje como celda con colspan cuando no hay datos
        html += `
                            <tr class="bg-white border-gray-100 border border-b">
                                <td colspan="6" class="py-8 px-4 text-center">
                                    <p class="text-gray-700 text-xs sm:text-sm md:text-md lg:text-lg">${cursoFiltro !== "TODOS" ? "No hay sanciones registradas para este curso." : (ciclo === "ESO" ? "Parece que el juego limpio va ganando, no hay sanciones registradas." : "Todo en orden, ningún jugador ha sido sancionado hasta el momento.")}</p>
                                </td>
                            </tr>
        `;
    } else {
        // Mostrar datos de sancionados
        sancionados.forEach((sancionado) => {
            html += `
                <tr class="bg-white border-gray-100 border border-b">
                    <td class="py-2 px-2 md:py-4 md:px-4 font-medium text-xs sm:text-sm md:text-md lg:text-lg uppercase" >${sancionado.EQUIPO || '-'}</td>
                    <td class="py-2 px-2 md:py-4 md:px-4 font-medium text-xs sm:text-sm md:text-md lg:text-lg uppercase" >${sancionado.CURSO || '-'}</td>
                    <td class="py-2 px-2 md:py-4 md:px-4 font-medium text-xs sm:text-sm md:text-md lg:text-lg uppercase" >${sancionado.JUGADOR || ''}</td>
                    <td class="py-2 px-2 md:py-4 md:px-4 text-center font-medium text-xs sm:text-sm md:text-md lg:text-lg" >${sancionado.TROJAS || 0}</td>
                    <td class="py-2 px-2 md:py-4 md:px-4 text-center font-medium text-xs sm:text-sm md:text-md lg:text-lg" >${sancionado.TAMARILLAS || 0}</td>
                    <td class="py-2 px-2 md:py-4 md:px-4 text-center font-medium text-xs sm:text-sm md:text-md lg:text-lg" >${sancionado.JUSTIFICACION || 0}</td>
                </tr>
            `;
        });
    }

    html += `
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    div.innerHTML = html;
}

// --- RENDER NOTICIAS ---
export function renderNoticias(noticias) {
    const div = document.getElementById("noticias");
    if (!div) return;

    if (noticias.length === 0 || noticias.every(noticia => noticia.PUBLICAR !== "SI")) {
        div.innerHTML = '<p class="text-gray-700 col-span-full text-center">Parece que el Torneo Escolar todavía no da titulares… ¡pero pronto los habrá!</p>'
        return
    }

    // Filtrar noticias publicadas primero
    const noticiasPublicadas = noticias.filter(n => n.PUBLICAR === "SI");

    div.innerHTML = noticiasPublicadas
        .map(
            (noticia, index) => `
            <article class="noticia-card bg-transparent shadow-lg ring-1 ring-black/5 rounded-brand overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer ${index === -1 ? "md:col-span-2 lg:col-span-3" : ""}" data-noticia-index="${index}">
                <img src="${convertGoogleDriveUrl(noticia.IMAGEN)}" class="w-full h-64 md:h-90 lg:h-96 object-contain" loading="lazy" alt="${noticia.TITULO}" onerror="this.style.display='none'" />
                <div class="p-6">
                    <div class="flex items-center justify-between">
                        <span class="text-xs sm:text-sm font-medium bg-gray-100 px-3 py-1 rounded-brand">${noticia.FECHA}</span>
                        <span class="text-xs sm:text-sm font-medium bg-gray-100 px-3 py-1 rounded-brand">${noticia.CREDITOS}</span>
                    </div>
                    <h3 class="text-sm md:text-lg lg:text-xl font-bold mt-3 mb-3">${noticia.TITULO}</h3>
                    ${(() => {
                    const contenidoLimpio = (noticia.CONTENIDO || '').replace(/^"/, '').replace(/"$/, '').replace(/\n/g, ' ');
                    const contenidoTruncado = contenidoLimpio.length > 80
                        ? contenidoLimpio.substring(0, 80) + '...'
                        : contenidoLimpio;
                    const necesitaTruncar = contenidoLimpio.length > 80;
                    return `
                            <p class="mb-4 text-xs sm:text-sm leading-relaxed">${contenidoTruncado}</p>
                            ${necesitaTruncar ? '<div class="flex justify-end mt-2"><span class="text-xs sm:text-sm font-medium bg-gray-100 px-3 py-1 rounded-brand text-brand-blue hover:text-brand-red">Continuar leyendo →</span></div>' : ''}
                        `;
                })()}
                </div>
            </article>
        `
        )
        .join("");

    // Agregar event listeners para abrir el diálogo
    div.querySelectorAll('.noticia-card').forEach((card, index) => {
        card.addEventListener('click', () => {
            mostrarDetalleNoticia(noticiasPublicadas[index]);
        });
    });
}

// --- MOSTRAR DETALLE NOTICIA EN DIALOG ---
export function mostrarDetalleNoticia(noticia) {
    console.log('Mostrando detalle de noticia:', noticia);

    // Crear o obtener el diálogo
    let dialogContainer = document.getElementById('noticia-dialog-container');
    if (!dialogContainer) {
        dialogContainer = document.createElement('div');
        dialogContainer.id = 'noticia-dialog-container';
        document.body.appendChild(dialogContainer);
    }

    // Obtener imágenes adicionales (IMAGEN2, IMAGEN3, etc. hasta IMAGEN6)
    const imagenes = [];
    if (noticia.IMAGEN) imagenes.push(noticia.IMAGEN);
    for (let i = 2; i <= 6; i++) {
        const campoImagen = `IMAGEN${i}`;
        if (noticia[campoImagen] && noticia[campoImagen].trim() !== '') {
            imagenes.push(noticia[campoImagen]);
        }
    }

    // Limpiar contenido previo
    const contenidoLimpio = (noticia.CONTENIDO || '').replace(/^"/, '').replace(/"$/, '');

    // Generar HTML de imágenes según la distribución
    let imagenesHTML = '';
    if (imagenes.length > 0) { 

        if (imagenes.length === 1) { 
            // Una sola imagen: ocupar todo el espacio
            imagenesHTML += `
            <div class="grid gap-4">
                <div class="grid gap-4">
                    <img src="${convertGoogleDriveUrl(imagenes[0])}" alt="${noticia.TITULO}" class="h-80 md:h-auto max-w-full object-cover rounded-brand " onerror="this.style.display='none'" />
                </div>
            `;
        } else if (imagenes.length === 2) {
            // Dos imágenes
            imagenesHTML += `
            <div class="grid md:grid-cols-2 gap-4">
                <div class="grid gap-4">
                    <img src="${convertGoogleDriveUrl(imagenes[0])}" alt="${noticia.TITULO}" class="h-80 object-cover rounded-brand " onerror="this.style.display='none'" />                
                </div>
                <div class="grid gap-4">
                    <img src="${convertGoogleDriveUrl(imagenes[1])}" alt="${noticia.TITULO}" class="h-80 max-w-full object-cover rounded-brand " onerror="this.style.display='none'" />
                </div>
            `;
        } else if (imagenes.length === 3) {
            // Tres imágenes
            imagenesHTML += `
            <div class="grid grid-cols-2 gap-4">
                <div class="flex gap-4">
                    <img src="${convertGoogleDriveUrl(imagenes[0])}" alt="${noticia.TITULO}" class="h-80 object-cover rounded-brand " onerror="this.style.display='none'" />                    
                </div>
                <div class="grid gap-4">
                    <img src="${convertGoogleDriveUrl(imagenes[1])}" alt="${noticia.TITULO}" class="h-auto max-w-full object-cover rounded-brand " onerror="this.style.display='none'" />
                    <img src="${convertGoogleDriveUrl(imagenes[2])}" alt="${noticia.TITULO}" class="h-60 object-cover rounded-brand " onerror="this.style.display='none'" />                    
                </div>
            `;
        } else if (imagenes.length === 4) {
            // Cuatro imágenes
            imagenesHTML += `
            <div class="grid grid-cols-2 gap-4">
                <div class="grid gap-4">
                    <img src="${convertGoogleDriveUrl(imagenes[0])}" alt="${noticia.TITULO}" class="h-80 object-cover rounded-brand " onerror="this.style.display='none'" />               
                    <img src="${convertGoogleDriveUrl(imagenes[1])}" alt="${noticia.TITULO}" class="h-auto max-w-full object-cover rounded-brand " onerror="this.style.display='none'" />
                </div>
                <div class="grid gap-4">
                    <img src="${convertGoogleDriveUrl(imagenes[2])}" alt="${noticia.TITULO}" class="h-auto max-w-full object-cover rounded-brand " onerror="this.style.display='none'" />                 
                    <img src="${convertGoogleDriveUrl(imagenes[3])}" alt="${noticia.TITULO}" class="h-80 object-cover rounded-brand " onerror="this.style.display='none'" />
                </div>
            `;
        } else if (imagenes.length === 5) {
            // Cinco imágenes: una arriba, dos en medio, dos abajo
            imagenesHTML += `
            <div class="grid grid-cols-2 gap-4">
                <div class="grid gap-4 ">
                    <img src="${convertGoogleDriveUrl(imagenes[0])}" alt="${noticia.TITULO}" class="h-80 h-auto max-w-full object-cover rounded-brand " onerror="this.style.display='none'" />                 
                    <img src="${convertGoogleDriveUrl(imagenes[1])}" alt="${noticia.TITULO}" class="h-80 h-auto max-w-full object-cover rounded-brand " onerror="this.style.display='none'" />
                </div>
                <div class="grid gap-3">
                    <img src="${convertGoogleDriveUrl(imagenes[2])}" alt="${noticia.TITULO}" class="h-40 h-auto max-w-full object-cover rounded-brand " onerror="this.style.display='none'" />                
                    <img src="${convertGoogleDriveUrl(imagenes[3])}" alt="${noticia.TITULO}" class="h-80 h-auto max-w-full object-cover rounded-brand " onerror="this.style.display='none'" />
                    <img src="${convertGoogleDriveUrl(imagenes[4])}" alt="${noticia.TITULO}" class="h-40 h-auto max-w-full object-cover rounded-brand " onerror="this.style.display='none'" />
                </div>
            `;
        }

        imagenesHTML += '</div>';
    }

    // Limpiar cualquier listener previo
    const existingBackdrop = dialogContainer.querySelector('[data-dialog-backdrop="noticia-dialog"]');
    if (existingBackdrop) {
        existingBackdrop.replaceWith(existingBackdrop.cloneNode(true));
    }

    // Construir el HTML del diálogo con estructura Material Tailwind
    dialogContainer.innerHTML = `
        <div id="noticia-dialog-backdrop" data-dialog-backdrop="noticia-dialog"
            class="fixed inset-0 z-[9999] grid h-screen w-screen place-items-center bg-gray-500 bg-opacity-75 backdrop-blur-sm transition-opacity duration-300"
            style="opacity: 0; pointer-events: none;" >
            <div id="noticia-dialog-box" data-dialog="noticia-dialog"
                class="relative m-4 p-0 w-full max-w-6xl rounded-lg bg-white shadow-lg transition-all duration-300"
                style="opacity: 0; transform: translateY(-56px); pointer-events: none;" >
                <div class="noticia-dialog-content overflow-y-auto">
                    <div class="noticia-dialog-header">
                        <h3 class="text-sm md:text-lg lg:text-xl font-bold m-auto px-6">Noticia</h3>
                        <button data-dialog-close="true"  class="noticia-dialog-close mr-6" aria-label="Cerrar" type="button" >
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div class="noticia-dialog-body p-6 md:p-10">                       
                        <div class="flex flex-col lg:flex-row items-start justify-center gap-8">
                            <div class="flex flex-col items-start justify-center gap-10 flex-1">
                                <div class="flex flex-col sm:flex-row items-center justify-start gap-6">
                                    <span class="text-xs sm:text-sm font-medium py-1">${noticia.FECHA || ''}</span>
                                    <span class="text-xs sm:text-sm font-medium py-1">${noticia.CREDITOS || ''}</span>
                                </div>
                                <h3 class="text-sm md:text-lg lg:text-xl font-bold">${noticia.TITULO || ''}</h3>
                                <div class="text-xs sm:text-sm leading-relaxed">${contenidoLimpio.replace(/\n/g, '<br>')}</div>
                            </div>
                            <div class="flex-1 my-auto mx-auto">
                                ${imagenesHTML}
                            </div>                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Abrir el diálogo directamente aplicando estilos inline
    requestAnimationFrame(() => {
        const backdropElement = document.getElementById('noticia-dialog-backdrop');
        const dialogElement = document.getElementById('noticia-dialog-box');

        if (!dialogElement || !backdropElement) {
            console.error('No se encontraron los elementos del diálogo');
            return;
        }

        // Función para cerrar el diálogo
        const closeDialog = () => {
            backdropElement.style.opacity = '0';
            backdropElement.style.pointerEvents = 'none';
            dialogElement.style.opacity = '0';
            dialogElement.style.transform = 'translateY(-56px)';
            dialogElement.style.pointerEvents = 'none';
        };

        // Mostrar el backdrop
        backdropElement.style.opacity = '1';
        backdropElement.style.pointerEvents = 'auto';
        backdropElement.style.zIndex = '9999';

        // Mostrar el diálogo
        dialogElement.style.opacity = '1';
        dialogElement.style.transform = 'translateY(0)';
        dialogElement.style.pointerEvents = 'auto';
        dialogElement.style.zIndex = '10000';

        // Prevenir que el clic en el diálogo cierre el modal
        dialogElement.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Agregar event listener para cerrar al hacer clic en el backdrop
        backdropElement.addEventListener('click', (e) => {
            if (e.target === backdropElement) {
                closeDialog();
            }
        });

        // Agregar event listener para cerrar con el botón
        const closeButton = dialogElement.querySelector('[data-dialog-close="true"]');
        if (closeButton) {
            closeButton.addEventListener('click', (e) => {
                e.stopPropagation();
                closeDialog();
            });
        }

        // Cerrar con Escape
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                closeDialog();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    });
}

// --- RENDER BRACKET --- 
export function renderBracket(clasificacion) {
    const div = document.getElementById("bracket-container");
    if (!div) return;
    div.classList.add("mb-10", "mt-6", "overflow-x-auto");
    if (clasificacion.length === 0) {
        div.innerHTML = '<p class="text-gray-500 text-center">No hay datos de clasificación disponibles</p>'
        return
    }

    // Group teams by round (sin filtrar por ciclo)
    const grupos = {};
    clasificacion.forEach((equipo) => {
        const key = equipo.RONDA;
        if (!grupos[key]) grupos[key] = [];
        grupos[key].push(equipo);
    });

    // Create tournament bracket layout
    let html = '<div class="min-w-max py-2">'

    // Check if we have bracket data
    const hasBracket = grupos.CUARTOS || grupos.SEMIFINAL || grupos.FINAL || grupos.TERCERPUSTO

    if (hasBracket) {
        // Full bracket layout with connecting lines
        html += '<div class="flex gap-8 items-center justify-center">'

        // Column 1: Initial Groups (Left side)
        if (grupos.INICIAL) {
            html += '<div class="flex flex-col gap-6">'

            const gruposOrganizados = {}
            grupos.INICIAL.forEach((equipo) => {
                const grupo = equipo.GRUPO;
                if (!gruposOrganizados[grupo]) gruposOrganizados[grupo] = []
                gruposOrganizados[grupo].push(equipo)
            })

            Object.keys(gruposOrganizados)
                .sort()
                .forEach((grupo) => {
                    // Agrupar por ciclo dentro de cada grupo
                    const equiposPorCiclo = {};
                    gruposOrganizados[grupo].forEach((equipo) => {
                        const ciclo = equipo.CICLO || '';
                        if (!equiposPorCiclo[ciclo]) equiposPorCiclo[ciclo] = [];
                        equiposPorCiclo[ciclo].push(equipo);
                    });

                    Object.keys(equiposPorCiclo).forEach((ciclo) => {
                        html += `
            <div class="bg-transparent shadow-lg ring-1 ring-black/5 overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-brand-gold rounded-brand p-3 lg:p-4 min-w-[240px] w-[300px]">
                <div class="text-center font-bold text-xl mb-3 lg:mb-4 tracking-wide">Grupo ${grupo} - <span class="text-brand-gold text-xl">${ciclo}</span></div>
                <div class="lg:space-y-2">
            `;
                        equiposPorCiclo[ciclo].forEach((equipo) => {
                            if (equipo && equipo.EQUIPOS !== undefined && equipo.EQUIPOS !== "") {
                                html += `
                    <div class="flex items-center justify-between py-2 lg:py-3 px-2 border-b border-brand-red last:border-0">
                        <div class="flex items-center gap-3">
                         ${equipo.GLOGO ? `<img src="${convertGoogleDriveUrl(equipo.GLOGO)}" alt="${equipo.EQUIPOS}" class="w-8 h-8 object-contain transition-transform duration-300 hover:scale-150">` : ''}
                        <span class="font-semibold text-sm">${equipo.EQUIPOS}</span>
                        </div>
                        <span class="font-bold text-tournament-red">${equipo.PUNTOS}</span>
                    </div>
                    `;
                            }
                        })
                        html += `
              </div>
            </div>
            `;
                    });
                })

            html += "</div>"
        }

        // Column 2: CUARTOS DE FINAL
        if (grupos.CUARTOS) {
            html += '<div class="flex flex-col gap-12 justify-center">'

            // Agrupar cuartos de final por ciclo
            const cuartosPorCiclo = {};
            grupos.CUARTOS?.forEach((equipo) => {
                const ciclo = equipo.CICLO || '';
                if (!cuartosPorCiclo[ciclo]) cuartosPorCiclo[ciclo] = [];
                cuartosPorCiclo[ciclo].push(equipo);
            });

            Object.keys(cuartosPorCiclo).forEach((ciclo) => {
                cuartosPorCiclo[ciclo].forEach((equipos) => {
                    html += `
                <div class="bg-transparent shadow-lg ring-1 ring-black/5 overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-brand-gold rounded-brand p-4 min-w-[240px] w-[300px]">
                    <div class="text-center font-bold text-xl mb-4 tracking-wide">Cuartos de Final - <span class="text-brand-gold text-xl">${ciclo}</span></div>
                    <div class="space-y-2">
                `;

                    if (equipos && equipos.LOCAL !== undefined && equipos.VISITANTE !== undefined) {
                        html += `
                    <div class="flex items-center justify-between py-2 px-2">
                        <div class="flex items-center gap-2">
                        ${equipos.LLOGO ? `<img src="${convertGoogleDriveUrl(equipos.LLOGO)}" alt="${equipos.LOCAL}" class="w-8 h-8 object-contain transition-transform duration-300 hover:scale-150">` : ''}
                        <span class="font-medium text-sm">${equipos.LOCAL}</span>
                        </div>
                        <span class="font-bold text-sm">${equipos.LSCORE}</span>
                    </div>
                    `;
                        html += `
                    <div class="flex items-center justify-between py-2 px-2 border-t border-brand-blue">
                        <div class="flex items-center gap-2">
                        ${equipos.VLOGO ? `<img src="${convertGoogleDriveUrl(equipos.VLOGO)}" alt="${equipos.VISITANTE}" class="w-8 h-8 object-contain transition-transform duration-300 hover:scale-150">` : ''}
                        <span class="font-medium text-sm">${equipos.VISITANTE}</span>
                        </div>
                        <span class="font-bold text-sm">${equipos.VSCORE}</span>
                    </div>
                    `;
                    }

                    html += `
                    </div>            
                </div>
                `;
                });
            });
 
            html += "</div>";
        }

        // Column 2: SEMIFINAL 
        if (grupos.SEMIFINAL) {
            html += '<div class="flex flex-col gap-12 justify-center">'

            // Agrupar semifinales por ciclo
            const semifinalesPorCiclo = {};
            grupos.SEMIFINAL?.forEach((equipo) => {
                const ciclo = equipo.CICLO || '';
                if (!semifinalesPorCiclo[ciclo]) semifinalesPorCiclo[ciclo] = [];
                semifinalesPorCiclo[ciclo].push(equipo);
            });

            Object.keys(semifinalesPorCiclo).forEach((ciclo) => {
                semifinalesPorCiclo[ciclo].forEach((equipos) => {
                    html += `
                <div class="bg-transparent shadow-lg ring-1 ring-black/5 overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-brand-gold rounded-brand p-4 min-w-[240px] w-[300px]">
                    <div class="text-center font-bold text-xl mb-4 tracking-wide">Semifinal <span class="text-brand-gold text-xl">${ciclo}</span></div>
                    <div class="space-y-2">
                `;

                    if (equipos && equipos.LOCAL !== undefined && equipos.VISITANTE !== undefined) {
                        html += `
                    <div class="flex items-center justify-between py-2 px-2">
                        <div class="flex items-center gap-2">
                        ${equipos.LLOGO ? `<img src="${convertGoogleDriveUrl(equipos.LLOGO)}" alt="${equipos.LOCAL}" class="w-8 h-8 object-contain transition-transform duration-300 hover:scale-150">` : ''}
                        <span class="font-medium text-sm">${equipos.LOCAL}</span>
                        </div>
                        <span class="font-bold text-sm">${equipos.LSCORE}</span>
                    </div>
                    `;
                        html += `
                    <div class="flex items-center justify-between py-2 px-2 border-t border-brand-blue">
                        <div class="flex items-center gap-2">
                        ${equipos.VLOGO ? `<img src="${convertGoogleDriveUrl(equipos.VLOGO)}" alt="${equipos.VISITANTE}" class="w-8 h-8 object-contain transition-transform duration-300 hover:scale-150">` : ''}
                        <span class="font-medium text-sm">${equipos.VISITANTE}</span>
                        </div>
                        <span class="font-bold text-sm">${equipos.VSCORE}</span>
                    </div>
                    `;
                    }

                    html += `
                    </div>            
                </div>
                `;
                });
            });

            html += "</div>";
        }

        // Column 4: FINAL y TERCER PUESTO
        if (grupos.FINAL || grupos.TERCERPUSTO) {
            html += '<div class="flex flex-col gap-12 items-center justify-center">'

            // Agrupar finales por ciclo
            const finalesPorCiclo = {};
            grupos.FINAL.forEach((equipo) => {
                const ciclo = equipo.CICLO || '';
                if (!finalesPorCiclo[ciclo]) finalesPorCiclo[ciclo] = [];
                finalesPorCiclo[ciclo].push(equipo);
            });

            Object.keys(finalesPorCiclo).forEach((ciclo) => {
                finalesPorCiclo[ciclo].forEach((equipos) => {

                    html += `
          <div class="bg-transparent shadow-lg ring-1 ring-black/5 overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-brand-gold rounded-brand p-4 min-w-[240px] w-[300px]">
            <div class="text-center font-bold text-xl mb-4 tracking-wide">Final <span class="text-brand-gold text-xl">${ciclo}</span></div>
            <div class="space-y-2">
        `;

                    if (equipos) {
                        html += `
              <div class="flex items-center justify-between py-2 px-2">
                <div class="flex items-center gap-2">
                ${equipos.LLOGO ? `<img src="${convertGoogleDriveUrl(equipos.LLOGO)}" alt="${equipos.LOCAL}" class="w-8 h-8 object-contain transition-transform duration-300 hover:scale-150">` : ''}
                  <span class="font-medium text-sm">${equipos.LOCAL}</span>
                </div>
                <span class="font-bold text-sm">${equipos.LSCORE}</span>
              </div>
            `;

                        html += `
              <div class="flex items-center justify-between py-2 px-2 border-t border-brand-gold">
                <div class="flex items-center gap-2">
                ${equipos.VLOGO ? `<img src="${convertGoogleDriveUrl(equipos.VLOGO)}" alt="${equipos.VISITANTE}" class="w-8 h-8 object-contain transition-transform duration-300 hover:scale-150">` : ''}
                  <span class="font-medium text-sm">${equipos.VISITANTE}</span>
                </div>
                <span class="font-bold text-sm">${equipos.VSCORE}</span>
              </div>
            `;
                    }

                    html += `
            </div>            
          </div>
        `;
                });
            });

            // Agrupar terceros puestos por ciclo
            const tercerosPorCiclo = {};
            grupos.TERCERPUSTO?.forEach((equipo) => {
                const ciclo = equipo.CICLO || '';
                if (!tercerosPorCiclo[ciclo]) tercerosPorCiclo[ciclo] = [];
                tercerosPorCiclo[ciclo].push(equipo);
            });

            Object.keys(tercerosPorCiclo).forEach((ciclo) => {
                tercerosPorCiclo[ciclo].forEach((equipos) => {
                    html += `
            <div class="bg-transparent shadow-lg ring-1 ring-black/5 overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-brand-gold rounded-brand p-4 min-w-[240px] w-[300px]">
              <div class="text-center font-bold text-xl mb-4 tracking-wide">Tercer Puesto <span class="text-brand-gold text-xl">${ciclo}</span></div>
              <div class="space-y-2">
          `;

                    if (equipos && equipos.LOCAL !== undefined && equipos.VISITANTE !== undefined) {
                        html += `
                <div class="flex items-center justify-between py-2 px-2">
                  <div class="flex items-center gap-2">
                    ${equipos.LLOGO ? `<img src="${convertGoogleDriveUrl(equipos.LLOGO)}" alt="${equipos.LOCAL}" class="w-8 h-8 object-contain transition-transform duration-300 hover:scale-150">` : ''}
                    <span class="font-medium text-sm">${equipos.LOCAL}</span>
                  </div>
                  <span class="font-bold text-sm">${equipos.LSCORE}</span>
                </div>
              `;

                        html += `
                <div class="flex items-center justify-between py-2 px-2 border-t border-brand-blue">
                  <div class="flex items-center gap-2">
                    ${equipos.VLOGO ? `<img src="${convertGoogleDriveUrl(equipos.VLOGO)}" alt="${equipos.VISITANTE}" class="w-8 h-8 object-contain transition-transform duration-300 hover:scale-150">` : ''}
                    <span class="font-medium text-sm">${equipos.VISITANTE}</span>
                  </div>
                  <span class="font-bold text-sm">${equipos.VSCORE}</span>
                </div>
              `;
                    }

                    html += `
              </div>            
            </div>
          `;
                });
            });

            html += "</div>";
        }

        html += "</div>";
    }
    html += "</div>";
    div.innerHTML = html;
}

// --- RENDER PRÓXIMOS PARTIDOS ---
export function renderProximosPartidos(partidos) {
    const div = document.getElementById("proximosPartidos-container");
    if (!div) {
        console.warn('No se encontró el elemento proximosPartidos-container');
        return;
    }
    div.classList.add("mb-6", "mt-6");

    // Validar que partidos sea un array válido
    if (!Array.isArray(partidos) || partidos.length === 0) {
        div.innerHTML = `
            <div class="text-center py-12">
                <p class="text-gray-900 text-lg mb-2">No hay partidos programados para los próximos días.</p>
                <p class="text-gray-600 text-sm">Los partidos se mostrarán automáticamente cuando estén programados.</p>
            </div>
        `;
        return;
    }

    // Filtrar partidos válidos (que tengan DIA y MES)
    const partidosValidos = partidos.filter(partido => {
        return partido && partido.DIA && partido.MES && partido.LOCAL && partido.VISITANTE;
    });

    if (partidosValidos.length === 0) {
        div.innerHTML = `
            <div class="text-center py-12">
                <p class="text-gray-900 text-lg mb-2">No hay partidos programados para los próximos días.</p>
                <p class="text-gray-600 text-sm">Los partidos se mostrarán automáticamente cuando estén programados.</p>
            </div>
        `;
        return;
    }

    // Agrupar partidos por fecha
    const partidosPorFecha = {};
    partidosValidos.forEach(partido => {
        try {
            const anio = partido.ANIO ? parseInt(partido.ANIO) : new Date().getFullYear();
            const mes = parseInt(partido.MES);
            const dia = parseInt(partido.DIA);
            
            // Validar que los valores sean números válidos
            if (isNaN(mes) || isNaN(dia) || mes < 1 || mes > 12 || dia < 1 || dia > 31) {
                console.warn('Fecha inválida en partido:', partido);
                return;
            }
            
            const fechaKey = `${dia}-${mes}-${anio}`;
            if (!partidosPorFecha[fechaKey]) {
                partidosPorFecha[fechaKey] = [];
            }
            partidosPorFecha[fechaKey].push(partido);
        } catch (error) {
            console.warn('Error al procesar partido:', partido, error);
        }
    });

    // Verificar que hay partidos agrupados
    const fechasKeys = Object.keys(partidosPorFecha);
    if (fechasKeys.length === 0) {
        div.innerHTML = `
            <div class="text-center py-12">
                <p class="text-gray-900 text-lg mb-2">No hay partidos programados para los próximos días.</p>
                <p class="text-gray-600 text-sm">Los partidos se mostrarán automáticamente cuando estén programados.</p>
            </div>
        `;
        return;
    }

    // Ordenar fechas
    const fechasOrdenadas = fechasKeys.sort((a, b) => {
        try {
            const [diaA, mesA, anioA] = a.split('-').map(Number);
            const [diaB, mesB, anioB] = b.split('-').map(Number);
            const fechaA = new Date(anioA, mesA - 1, diaA);
            const fechaB = new Date(anioB, mesB - 1, diaB);
            return fechaA - fechaB;
        } catch (error) {
            console.warn('Error al ordenar fechas:', error);
            return 0;
        }
    });

    let html = '';

    if(fechasOrdenadas.length > 1){
        div.classList.add("grid", "grid-cols-2", "gap-4");
    }

    fechasOrdenadas.forEach(fechaKey => {
        try {
            const [dia, mes, anio] = fechaKey.split('-').map(Number);
            
            // Validar valores
            if (isNaN(mes) || isNaN(dia) || mes < 1 || mes > 12) {
                console.warn('Fecha inválida:', fechaKey);
                return;
            }
            
            const mesNombre = meses[mes - 1] || mes;
            const diaFormateado = String(dia).padStart(2, '0');
            const fechaFormateada = `${diaFormateado} ${mesNombre}`;

            // Obtener día de la semana
            const fecha = new Date(anio, mes - 1, dia);
            if (isNaN(fecha.getTime())) {
                console.warn('Fecha inválida para crear objeto Date:', anio, mes, dia);
                return;
            }
            
            const diaSemana = diasSemana[fecha.getDay()] || 'Desconocido';
            const partidosDelDia = partidosPorFecha[fechaKey];

            if (!partidosDelDia || partidosDelDia.length === 0) {
                return;
            }
            if(partidosDelDia.length > 1){
                div.classList.remove("grid", "grid-cols-2", "gap-4");
            }

            html += `
                <div class="md:container mx-auto mb-8">
                    <h4 class="text-2xl font-bold text-brand-blue mb-4 flex items-center gap-2">
                        <svg class="w-6 h-6 hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        ${diaSemana} ${fechaFormateada}
                    </h4>
                    <div class="grid ${partidosDelDia.length > 1 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} gap-4 lg:gap-6">
            `;

            partidosDelDia.forEach(partido => {
                // Determinar el tipo de partido según el grupo
                let tipoPartido = "";
                if (partido.GRUPO === "SEMIFINAL") {
                    tipoPartido = "Semifinal";
                } else if (partido.GRUPO === "3RPUESTO") {
                    tipoPartido = "Tercer Puesto";
                } else if (partido.GRUPO === "1RPUESTO") {
                    tipoPartido = "Final";
                } else if (partido.GRUPO && ["A", "B", "C", "D"].includes(partido.GRUPO)) {
                    tipoPartido = `Grupo ${partido.GRUPO}`;
                }

                const local = (partido.LOCAL || 'Por definir').trim();
                const visitante = (partido.VISITANTE || 'Por definir').trim();
                const hora = partido.HORA ? String(partido.HORA).trim() : 'Hora por confirmar';
                const fecha = partido.DIA ? String(partido.DIA).trim() + "/" + String(partido.MES).trim() + "/" + String(partido.ANIO).trim() : '';
                const ciclo = partido.CICLO ? String(partido.CICLO).trim() : '';

                html += `
                    <div class="rounded-brand p-2 sm:p-6 md:p-8 bg-white shadow-lg ring-1 ring-black/5 border border-gray-200 hover:shadow-brand-md transition-shadow overflow-hidden">                      
                        <div class="flex flex-col lg:flex-row items-center justify-between gap-2 lg:gap-4 mb-2 lg:mb-4">
                            <div class="flex flex-col items-center flex-1">
                                ${partido.LLOGO ? `<img src="${convertGoogleDriveUrl(partido.LLOGO)}" alt="${local}" class="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 object-contain mb-2 transition-transform duration-300 hover:scale-150" onerror="this.style.display='none'">` : ''}
                                <div class="text-xs sm:text-sm md:text-md font-bold text-gray-800 uppercase text-center">${local}</div>
                            </div>
                            <div class="text-3xl font-bold text-gray-800 flex items-center gap-2">
                                <span class="text-4xl text-brand-gold">VS</span>
                            </div>
                            <div class="flex flex-col items-center flex-1">
                                ${partido.VLOGO ? `<img src="${convertGoogleDriveUrl(partido.VLOGO)}" alt="${visitante}" class="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 object-contain mb-2 transition-transform duration-300 hover:scale-150" onerror="this.style.display='none'">` : ''}
                                <div class="text-xs sm:text-sm md:text-md font-bold text-gray-800 uppercase text-center">${visitante}</div>
                            </div>
                        </div>
                        <div class="text-center mt-2 sm:mt-4 pt-2 sm:pt-4 border-t border-gray-200 uppercase flex flex-row flex-wrap justify-center items-center gap-2 lg:gap-4">
                           <span class="text-xs sm:text-sm md:text-md text-gray-600">${tipoPartido} ${ciclo ? `${ciclo}` : ''}</span>   
                           <span class="text-xs sm:text-sm md:text-md text-brand-red ">${fecha.length > 0 ? `${fecha}` : ''}</span>   
                           <span class="text-xs sm:text-sm md:text-md text-gray-600 ">${hora.length > 0 ? `${hora} hrs` : ''}</span>
                        </div>
                    </div>
                `;
            });

            html += `
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Error al renderizar fecha:', fechaKey, error);
        }
    });

    if (html.trim() === '') {
        div.innerHTML = `
            <div class="text-center py-12">
                <p class="text-gray-900 text-lg mb-2">No hay partidos programados para los próximos días.</p>
                <p class="text-gray-600 text-sm">Los partidos se mostrarán automáticamente cuando estén programados.</p>
            </div>
        `;
    } else {
        div.innerHTML = html;
    }
}

// Función para convertir URLs de Google Drive
export const convertGoogleDriveUrl = (url) => {
    if (!url) return url;

    // Si ya es una URL directa o no es de Google Drive, devolverla tal cual
    if (!url.includes('drive.google.com')) return url;

    // Extraer el ID del archivo de diferentes formatos de URL de Google Drive
    let fileId = null;

    // Formato: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
    const match1 = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match1) {
        fileId = match1[1];
    }

    // Formato: https://drive.google.com/open?id=FILE_ID
    const match2 = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (match2 && !fileId) {
        fileId = match2[1];
    }

    // Si encontramos un ID, usar formato de thumbnail que es más confiable
    if (fileId) {
        // Usar thumbnail con tamaño grande (w1000 = ancho de 1000px, puedes aumentar)
        return `https://drive.google.com/thumbnail?id=${fileId}&sz=w2000`;
    }

    // Si no se puede convertir, devolver la URL original
    return url;
};

// --- RENDER GALERÍA ---
export function renderGalería(galeriaItems = []) {
    const div = document.getElementById("galeria");
    if (!div) return;

    // Filtrar elementos publicados (similar a noticias)
    const galeriaPublicada = galeriaItems.filter(item => item.PUBLICAR === "SI");

    if (galeriaPublicada.length === 0) {
        div.innerHTML = '<p class="text-gray-700 col-span-full text-center">La galería estará disponible pronto con imágenes y videos del torneo.</p>';
        return;
    }

    // Renderizar elementos de galería
    div.innerHTML = galeriaPublicada
        .map((item, index) => {
            if(item.PUBLICAR !== "SI") return '';
            // Determinar si es video o imagen basado en el tipo o la URL
            const esVideo = item.TIPO === 'VIDEO' || item.TIPO === 'video' || 
                           (item.URL && (item.URL.includes('/file/d/') || item.URL.includes('youtube.com') || item.URL.includes('youtu.be')));
            
            if (esVideo) {
                // Extraer ID del video de Google Drive
                let videoId = null;
                if (item.URL) {
                    const match = item.URL.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
                    if (match) {
                        videoId = match[1];
                    }
                }

                if (videoId) {
                    return `
                        <div class="galeria-item bg-white shadow-lg ring-1 ring-black/5 rounded-brand overflow-hidden hover:shadow-xl transition-shadow duration-300 bg-gray-100">
                            <div class="w-full max-w-full mx-auto aspect-video">
                                <iframe
                                    class="w-full h-full border-0"
                                    src="https://drive.google.com/file/d/${videoId}/preview"
                                    allow="autoplay; fullscreen"
                                    allowfullscreen
                                ></iframe>
                            </div>
                            ${item.TITULO || item.FECHA ? `
                                <div class="px-4">
                                    ${item.FECHA ? `<span class="text-xs sm:text-sm font-medium rounded-brand mr-2 inline-block">${item.FECHA}</span>` : ''}
                                    ${item.TITULO ? `<h4 class="text-sm md:text-base font-bold text-brand-blue ${item.FECHA ? 'mr-2 ' : ''}">${item.TITULO}</h4>` : ''}
                                    ${item.DESCRIPCION ? `<p class="text-xs md:text-sm text-gray-600 mt-2">${item.DESCRIPCION}</p>` : ''}
                                </div>
                            ` : ''}
                        </div>
                    `;
                }
            }

            // Es una imagen
            const imagenUrl = item.URL || item.IMAGEN || '';
            if (!imagenUrl) return '';

            return `
                <div class="galeria-item bg-white shadow-lg ring-1 ring-black/5 rounded-brand overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer bg-gray-100" data-galeria-index="${index}">
                    <img 
                        src="${convertGoogleDriveUrl(imagenUrl)}" 
                        class="w-full h-64 md:h-80 lg:h-96 object-cover transition-transform duration-300 hover:scale-105" 
                        loading="lazy" 
                        alt="${item.TITULO || 'Imagen de galería'}" 
                        onerror="this.style.display='none'" 
                    />
                    ${item.TITULO || item.FECHA || item.DESCRIPCION ? `
                        <div class="px-4">
                            ${item.FECHA ? `<span class="text-xs sm:text-sm font-medium rounded-brand mr-2 inline-block">${item.FECHA}</span>` : ''}
                            ${item.TITULO ? `<h4 class="text-sm md:text-base font-bold text-brand-blue ${item.FECHA ? 'mr-2' : ''}">${item.TITULO}</h4>` : ''}
                            ${item.DESCRIPCION ? `<p class="text-xs md:text-sm text-gray-600 mt-2">${item.DESCRIPCION}</p>` : ''}
                        </div>
                    ` : ''}
                </div>
            `;
        })
        .filter(html => html !== '') // Filtrar elementos vacíos
        .join('');

    // Agregar event listeners para abrir imágenes en modal (opcional, similar a noticias)
    div.querySelectorAll('.galeria-item[data-galeria-index]').forEach((item, index) => {
        const galeriaItem = galeriaPublicada[index];
        if (galeriaItem && !galeriaItem.URL?.includes('/file/d/')) {
            item.addEventListener('click', () => {
                mostrarDetalleGalería(galeriaItem);
            });
        }
    });
}

// --- MOSTRAR DETALLE GALERÍA EN DIALOG (opcional) ---
function mostrarDetalleGalería(item) {
    // Crear o obtener el diálogo
    let dialogContainer = document.getElementById('galeria-dialog-container');
    if (!dialogContainer) {
        dialogContainer = document.createElement('div');
        dialogContainer.id = 'galeria-dialog-container';
        document.body.appendChild(dialogContainer);
    }

    const imagenUrl = item.URL || item.IMAGEN || '';
    if (!imagenUrl) return;

    const contenidoLimpio = (item.DESCRIPCION || '').replace(/^"/, '').replace(/"$/, '');

    dialogContainer.innerHTML = `
        <dialog data-dialog="galeria-dialog" class="open:flex flex-col w-full max-w-4xl rounded-brand p-0">
            <div class="noticia-dialog-content">
                <div class="noticia-dialog-header">
                    <h3 class="text-xl md:text-2xl font-bold">${item.TITULO || 'Galería'}</h3>
                    <button class="noticia-dialog-close" onclick="this.closest('dialog').close()" aria-label="Cerrar">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div class="noticia-dialog-body" style="overflow-y: auto;">
                    <div class="p-4">
                        ${item.FECHA ? `<span class="text-xs sm:text-sm font-medium bg-gray-100 px-3 py-1 rounded-brand mb-4 inline-block">${item.FECHA}</span>` : ''}
                        <img 
                            src="${convertGoogleDriveUrl(imagenUrl)}" 
                            alt="${item.TITULO || 'Imagen de galería'}" 
                            class="w-full h-auto max-h-[70vh] object-contain rounded-brand mb-4" 
                            onerror="this.style.display='none'" 
                        />
                        ${contenidoLimpio ? `<p class="text-sm md:text-base text-gray-700 leading-relaxed">${contenidoLimpio}</p>` : ''}
                    </div>
                </div>
            </div>
        </dialog>
    `;

    const dialog = dialogContainer.querySelector('dialog');
    if (dialog) {
        dialog.showModal();
        
        // Cerrar al hacer clic fuera del diálogo
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) {
                dialog.close();
            }
        });
    }
}