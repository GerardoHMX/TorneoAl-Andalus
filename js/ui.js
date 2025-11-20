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
            const key = `${m.CICLO || 'SIN_CICLO'}_${m.GRUPO}`;
            if (!equiposPorCicloGrupo[key]) {
                equiposPorCicloGrupo[key] = {
                    ciclo: m.CICLO || 'SIN_CICLO',
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
                                            <img src="${convertGoogleDriveUrl(convertGoogleDriveUrl(equipo.LOGO))}" alt="${equipo.EQUIPO}" class="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 object-contain mb-4" onerror="this.style.display='none'">
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
                            ${m.LLOGO ? `<img src="${convertGoogleDriveUrl(convertGoogleDriveUrl(m.LLOGO))}" alt="${m.LOCAL}" class="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16  object-contain mb-2 md:mb-3" onerror="this.style.display='none'">` : ''}
                            <div class="text-xs sm:text-sm md:text-md font-bold text-gray-800 uppercase text-center">${m.LOCAL}</div>
                        </div>
                        <div class="text-5xl font-bold text-gray-800 flex justify-center items-center gap-2 flex-shrink-0">
                           <span class="text-3xl">${m.LSCORE || '0'}</span> <span class="text-3xl text-brand-gold">:</span> <span class="text-3xl">${m.VSCORE || '0'}</span>
                        </div>
                        <div class="flex flex-col items-center flex-1">
                            ${m.VLOGO ? `<img src="${convertGoogleDriveUrl(convertGoogleDriveUrl(m.VLOGO))}" alt="${m.VISITANTE}" class="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16  object-contain mb-2 md:mb-3" onerror="this.style.display='none'">` : ''}
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
                            ${m.LLOGO ? `<img src="${convertGoogleDriveUrl(convertGoogleDriveUrl(m.LLOGO))}" alt="${m.LOCAL}" class="w-20 h-20 object-contain mb-3" onerror="this.style.display='none'">` : ''}
                            <div class="text-sm font-bold text-gray-800 uppercase text-center">${m.LOCAL}</div>
                        </div>
                        <div class="text-3xl font-bold text-gray-800">
                            ${m.LSCORE || '0'} <span class="text-3xl text-brand-gold">:</span> ${m.VSCORE || '0'}
                        </div>
                        <div class="flex flex-col items-center flex-1">
                            ${m.VLOGO ? `<img src="${convertGoogleDriveUrl(convertGoogleDriveUrl(m.VLOGO))}" alt="${m.VISITANTE}" class="w-20 h-20 object-contain mb-3" onerror="this.style.display='none'">` : ''}
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
                                ${m.LLOGO ? `<img src="${convertGoogleDriveUrl(convertGoogleDriveUrl(m.LLOGO))}" alt="${m.LOCAL}" class="w-20 h-20 object-contain mb-3" onerror="this.style.display='none'">` : ''}
                                <div class="text-sm sm:text-md md:text-lg font-bold text-gray-800 uppercase text-center">${m.LOCAL}</div>
                            </div>
                            <div class="text-3xl font-bold text-gray-800">
                                ${m.LSCORE || '0'} <span class="text-3xl text-brand-gold">:</span> ${m.VSCORE || '0'}
                            </div>
                            <div class="flex flex-col items-center flex-1">
                                ${m.VLOGO ? `<img src="${convertGoogleDriveUrl(convertGoogleDriveUrl(m.VLOGO))}" alt="${m.VISITANTE}" class="w-20 h-20 object-contain mb-3" onerror="this.style.display='none'">` : ''}
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
                            ${m.LOGO ? `<img src="${convertGoogleDriveUrl(convertGoogleDriveUrl(m.LOGO))}" alt="${m.EQUIPOS}" class="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 object-contain" onerror="this.style.display='none'">` : ''}
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
                            ${equipo.LOGO ? `<img src="${convertGoogleDriveUrl(convertGoogleDriveUrl(equipo.LOGO))}" alt="${equipo.EQUIPOS}" class="w-8 h-8 object-contain" style="min-width: 32px; min-height: 32px;" onerror="this.style.display='none'">` : ''}
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
                        ${equipo.LOGO ? `<img src="${convertGoogleDriveUrl(convertGoogleDriveUrl(equipo.LOGO))}" alt="${equipo.EQUIPOS}" class="w-8 h-8 object-contain" style="min-width: 32px; min-height: 32px;" onerror="this.style.display='none'">` : ''}
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
export function tablaLideresGoleadores(list, ciclo, otros = []) {
    const div = document.getElementById("goleadores" + ciclo);
    if (!div) return;
    div.classList.add("mb-6", "mt-6");

    // Filtrar lideres para no mostrar registros incompletos
    const lideres = list.filter(lider => 
        lider.CICLO === ciclo && 
        lider.CICLO !== undefined && 
        lider.CICLO !== "" &&
        lider.JUGADOR !== undefined && 
        lider.JUGADOR !== ""
    );

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
        <div class="flex items-center justify-between gap-2">                
            <h4 class="text-3xl font-bold text-brand-gold mb-2 flex items-center gap-2">
                ${ciclo}
            </h4>
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
                        <img src="${convertGoogleDriveUrl(convertGoogleDriveUrl(imagenAvatar))}" alt="${lider.JUGADOR}" class="h-full object-cover object-center">
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
                        <img src="${convertGoogleDriveUrl(convertGoogleDriveUrl(imagenAvatar))}" alt="Posición ${i + 1}" class="h-full object-cover object-center">
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
    const goleadoresCiclo = listOrdered.filter(lider => lider.CICLO === ciclo);

    if (goleadoresCiclo.length > 0) {
        html += `
            <div class="rounded-brand overflow-hidden shadow-lg mt-8">
                <div class="overflow-x-auto">
                    <table class="w-full min-w-full" style="border-collapse: collapse;">
                        <thead>
                            <tr style="background-color: #B30000; color: white;">
                                <th class="font-bold uppercase py-2 px-2 md:py-4 md:px-4 text-xs sm:text-sm md:text-md lg:text-lg" style="text-align: left; padding-left: 1rem;">CICLO</th>
                                <th class="font-bold uppercase py-2 px-2 md:py-4 md:px-4 text-xs sm:text-sm md:text-md lg:text-lg" style="text-align: left; padding-left: 1rem;">EQUIPO</th>
                                <th class="font-bold uppercase py-2 px-2 md:py-4 md:px-4 text-xs sm:text-sm md:text-md lg:text-lg" style="text-align: left; padding-left: 1rem;">CURSO</th>
                                <th class="font-bold uppercase py-2 px-2 md:py-4 md:px-4 text-xs sm:text-sm md:text-md lg:text-lg" style="text-align: left; padding-left: 1rem;">JUGADOR</th>
                                <th class="font-bold uppercase py-2 px-2 md:py-4 md:px-4 text-xs sm:text-sm md:text-md lg:text-lg" style="text-align: center; padding-right: 1rem;">GOLES</th>
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
                                <th class="font-bold uppercase py-2 px-2 md:py-4 md:px-4 text-xs sm:text-sm md:text-md lg:text-lg" style="text-align: left; padding-left: 1rem;">CICLO</th>
                                <th class="font-bold uppercase py-2 px-2 md:py-4 md:px-4 text-xs sm:text-sm md:text-md lg:text-lg" style="text-align: left; padding-left: 1rem;">EQUIPO</th>
                                <th class="font-bold uppercase py-2 px-2 md:py-4 md:px-4 text-xs sm:text-sm md:text-md lg:text-lg" style="text-align: left; padding-left: 1rem;">CURSO</th>
                                <th class="font-bold uppercase py-2 px-2 md:py-4 md:px-4 text-xs sm:text-sm md:text-md lg:text-lg" style="text-align: left; padding-left: 1rem;">JUGADOR</th>
                                <th class="font-bold uppercase py-2 px-2 md:py-4 md:px-4 text-xs sm:text-sm md:text-md lg:text-lg" style="text-align: center; padding-right: 1rem;">GOLES</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="bg-white border-gray-100 border border-b">
                                <td colspan="5" class="py-8 px-4 text-center">
                                    <p class="text-gray-700 text-xs sm:text-sm md:text-md lg:text-lg">${ciclo === "ESO" ? "Aún no hay partidos jugados, pronto conoceremos a los primeros líderes de goleo." : "Todavía no se registran partidos. ¡Los goleadores aparecerán en cuanto ruede el balón!"}</p>
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
export function tablaSancionados(list, ciclo) {
    const div = document.getElementById("sancionados" + ciclo);
    if (!div) return;
    div.classList.add("overflow-x-auto", "mb-6", "mt-6");
    
    // Filtrar sancionados para no mostrar registros incompletos
    const sancionados = list.filter(sancionado => 
        sancionado.CICLO === ciclo && 
        sancionado.CICLO !== undefined && 
        sancionado.CICLO !== "" &&
        sancionado.JUGADOR === ciclo && 
        sancionado.JUGADOR !== undefined && 
        sancionado.JUGADOR !== ""
    );

    // Construir la tabla siempre, con o sin datos
    let html = `
        <div class="mb-6">
            <div class="flex items-center justify-between gap-2">                
                <h4 class="text-3xl font-bold text-brand-gold mb-2 flex items-center gap-2">
                    ${ciclo}
                </h4>
            </div>
            <div class="rounded-brand overflow-hidden shadow-lg">
                <div class="overflow-x-auto">
                    <table class="w-full min-w-full" style="border-collapse: collapse;">
                        <thead>
                            <tr style="background-color: #B30000; color: white;">
                                <th class="font-bold uppercase py-2 px-2 md:py-4 md:px-4 text-xs sm:text-sm md:text-md lg:text-lg" style="text-align: left; padding-left: 1rem;">EQUIPO</th>
                                <th class="font-bold uppercase py-2 px-2 md:py-4 md:px-4 text-xs sm:text-sm md:text-md lg:text-lg" style="text-align: left; padding-left: 1rem;">CURSO</th>
                                <th class="font-bold uppercase py-2 px-2 md:py-4 md:px-4 text-xs sm:text-sm md:text-md lg:text-lg" style="text-align: left; padding-left: 1rem;">JUGADOR</th>
                                <th class="font-bold uppercase py-2 px-2 md:py-4 md:px-4 text-xs sm:text-sm md:text-md lg:text-lg" style="text-align: center;">ROJAS</th>
                                <th class="font-bold uppercase py-2 px-2 md:py-4 md:px-4 text-xs sm:text-sm md:text-md lg:text-lg" style="text-align: center;">AMARILLAS</th>
                                <th class="font-bold uppercase py-2 px-2 md:py-4 md:px-4 text-xs sm:text-sm md:text-md lg:text-lg" style="text-align: center; padding-left: 1rem; padding-right: 1rem;">P. SUSPENDIDOS</th>
                            </tr>
                        </thead>
                        <tbody>
    `;

    if (sancionados.length === 0) {
        // Mostrar mensaje como celda con colspan cuando no hay datos
        html += `
                            <tr class="bg-white border-gray-100 border border-b">
                                <td colspan="6" class="py-8 px-4 text-center">
                                    <p class="text-gray-700 text-xs sm:text-sm md:text-md lg:text-lg">${ciclo === "ESO" ? "Parece que el juego limpio va ganando, no hay sanciones registradas." : "Todo en orden, ningún jugador ha sido sancionado hasta el momento."}</p>
                                </td>
                            </tr>
        `;
    } else {
        // Mostrar datos de sancionados
        sancionados.forEach((sancionado) => {
            html += `
                <tr class="bg-white border-gray-100 border border-b">
                    <td class="py-2 px-2 md:py-4 md:px-4" style="text-align: left; padding-left: 1rem;">
                        <span class="font-medium uppercase text-xs sm:text-sm md:text-md lg:text-lg" >${sancionado.EQUIPO || '-'}</span>
                    </td>
                    <td class="py-2 px-2 md:py-4 md:px-4" style="text-align: left; padding-left: 1rem;">
                        <span class="font-medium text-xs sm:text-sm md:text-md lg:text-lg" >${sancionado.CURSO || '-'}</span>
                    </td>
                    <td class="py-2 px-2 md:py-4 md:px-4" style="text-align: left; padding-left: 1rem;">
                        <span class="font-medium text-xs sm:text-sm md:text-md lg:text-lg" >${sancionado.JUGADOR || '-'}</span>
                    </td>
                    <td class="py-2 px-2 md:py-4 md:px-4 text-center font-medium text-xs sm:text-sm md:text-md lg:text-lg" >${sancionado.TROJAS || 0}</td>
                    <td class="py-2 px-2 md:py-4 md:px-4 text-center font-medium text-xs sm:text-sm md:text-md lg:text-lg" >${sancionado.TAMARILLAS || 0}</td>
                    <td class="py-2 px-2 md:py-4 md:px-4 text-center font-medium text-xs sm:text-sm md:text-md lg:text-lg" >
                        <span class="text-xs sm:text-sm md:text-md lg:text-lg" >${sancionado.JUSTIFICACION || '-'}</span>
                    </td>
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

    div.innerHTML = noticias
        .map(
            (noticia, index) => noticia.PUBLICAR === "SI" ? `
            <article class="bg-transparent shadow-lg ring-1 ring-black/5 rounded-brand overflow-hidden hover:shadow-xl transition-shadow duration-300 ${index === -1 ? "md:col-span-2 lg:col-span-3" : ""}">
                <img src="${convertGoogleDriveUrl(convertGoogleDriveUrl(noticia.IMAGEN))}" class="w-full h-64 sm:h-96 object-cover" loading="lazy" alt="${noticia.TITULO}" onerror="this.style.display='none'" />
                <div class="p-6">
                    <div class="flex items-center justify-between">
                        <span class="text-sm font-medium bg-gray-100 px-3 py-1 rounded-brand">${noticia.FECHA}</span>
                        <span class="text-sm font-medium bg-gray-100 px-3 py-1 rounded-brand">${noticia.CREDITOS}</span>
                    </div>
                    <h3 class="text-xl font-bold mt-3 mb-3">${noticia.TITULO}</h3>
                    <p class="mb-4 text-md leading-relaxed">${noticia.CONTENIDO}</p>
                </div>
            </article>
        ` : '',
        )
        .join("");
}

// --- RENDER BRACKET --- 
export function renderBracket(clasificacion, ciclo) {
    const div = document.getElementById("bracket" + ciclo);
    if (!div) return;
    div.classList.add("mb-10", "mt-6", "overflow-x-auto");
    if (clasificacion.length === 0) {
        div.innerHTML = '<p class="text-gray-500 text-center">No hay datos de clasificación disponibles</p>'
        return
    }

    // Group teams by round and ciclo
    const grupos = {};
    clasificacion.forEach((equipo) => {
        const key = equipo.RONDA;
        if (!grupos[key]) grupos[key] = [];
        if (equipo.CICLO === ciclo) {
            grupos[key].push(equipo);
        }
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
                    html += `
            <div class="bg-transparent shadow-lg ring-1 ring-black/5 overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-brand-gold rounded-brand p-3 lg:p-4 min-w-[240px] w-[300px]">
                <div class="text-center font-bold text-xl mb-3 lg:mb-4 tracking-wide">Grupo ${grupo} - <span class="text-brand-gold text-xl">${ciclo}</span></div>
                <div class="lg:space-y-2">
            `;
                    gruposOrganizados[grupo].forEach((equipo) => {
                        if (equipo && equipo.EQUIPOS !== undefined && equipo.EQUIPOS !== "") {
                            html += `
                    <div class="flex items-center justify-between py-2 lg:py-3 px-2 border-b border-brand-red last:border-0">
                        <div class="flex items-center gap-3">
                         ${equipo.LOGO ? `<img src="${convertGoogleDriveUrl(convertGoogleDriveUrl(equipo.LOGO))}" alt="${equipo.EQUIPOS}" class="w-8 h-8 object-contain">` : ''}
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
                })

            html += "</div>"
        }

        // Column 2: SEMIFINAL y TERCER PUESTO
        if (grupos.SEMIFINAL || grupos.TERCERPUSTO) {
            html += '<div class="flex flex-col gap-12 justify-center">'

            for (let i = 0; i < grupos.SEMIFINAL.length; i += 2) {
                const equipos = grupos.SEMIFINAL[i];

                html += `
                <div class="bg-transparent shadow-lg ring-1 ring-black/5 overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-brand-gold rounded-brand p-4 min-w-[240px] w-[300px]">
                    <div class="text-center font-bold text-xl mb-4 tracking-wide">Semifinal - <span class="text-brand-gold text-xl">${ciclo}</span></div>
                    <div class="space-y-2">
                `;

                if (equipos && equipos.LOCAL !== undefined && equipos.VISITANTE !== undefined) {
                    html += `
                    <div class="flex items-center justify-between py-2 px-2">
                        <div class="flex items-center gap-2">
                        ${equipos.LLOGO ? `<img src="${convertGoogleDriveUrl(convertGoogleDriveUrl(equipos.LLOGO))}" alt="${equipos.LOCAL}" class="w-6 h-6 object-contain">` : ''}
                        <span class="font-medium text-sm">${equipos.LOCAL}</span>
                        </div>
                        <span class="font-bold text-sm">${equipos.LSCORE}</span>
                    </div>
                    `;
                    html += `
                    <div class="flex items-center justify-between py-2 px-2 border-t border-brand-blue">
                        <div class="flex items-center gap-2">
                        ${equipos.VLOGO ? `<img src="${convertGoogleDriveUrl(convertGoogleDriveUrl(equipos.VLOGO))}" alt="${equipos.VISITANTE}" class="w-6 h-6 object-contain">` : ''}
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
            }

            for (let i = 0; i < grupos.TERCERPUSTO.length; i += 2) {
                const equipos = grupos.TERCERPUSTO[i]

                html += `
            <div class="bg-transparent shadow-lg ring-1 ring-black/5 overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-brand-gold rounded-brand p-4 min-w-[240px] w-[300px]">
              <div class="text-center font-bold text-xl mb-4 tracking-wide">Tercer Puesto - <span class="text-brand-gold text-xl">${ciclo}</span></div>
              <div class="space-y-2">
          `;

                if (equipos && equipos.LOCAL !== undefined && equipos.VISITANTE !== undefined) {
                    html += `
                <div class="flex items-center justify-between py-2 px-2">
                  <div class="flex items-center gap-2">
                    ${equipos.LLOGO ? `<img src="${convertGoogleDriveUrl(convertGoogleDriveUrl(equipos.LLOGO))}" alt="${equipos.LOCAL}" class="w-6 h-6 object-contain">` : ''}
                    <span class="font-medium text-sm">${equipos.LOCAL}</span>
                  </div>
                  <span class="font-bold text-sm">${equipos.LSCORE}</span>
                </div>
              `;

                    html += `
                <div class="flex items-center justify-between py-2 px-2 border-t border-brand-blue">
                  <div class="flex items-center gap-2">
                    ${equipos.VLOGO ? `<img src="${convertGoogleDriveUrl(convertGoogleDriveUrl(equipos.VLOGO))}" alt="${equipos.VISITANTE}" class="w-6 h-6 object-contain">` : ''}
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
            }

            html += "</div>";
        }


        // Column 4: FINAL
        if (grupos.FINAL) {
            html += '<div class="flex items-center justify-center">'

            const equipos = grupos.FINAL[0]
            const fechaFinal = equipos?.DIA + "/" + equipos?.MES + "/" + equipos?.ANIO;

            html += `
          <div class="bg-transparent shadow-lg ring-1 ring-black/5 overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-brand-gold rounded-brand p-4 min-w-[240px] w-[300px]">
            <div class="text-center font-bold text-xl mb-4 tracking-wide">Final - <span class="text-brand-gold text-xl">${ciclo}</span></div>
            <div class="space-y-2">
        `;

            if (equipos) {
                html += `
              <div class="flex items-center justify-between py-2 px-2">
                <div class="flex items-center gap-2">
                  <!--<img src="${equipos.LOGOL}" alt="${equipos.LOCAL}" class="w-6 h-6 object-contain">-->
                  <span class="font-medium text-sm">${equipos.LOCAL}</span>
                </div>
                <span class="font-bold text-sm">${equipos.LSCORE}</span>
              </div>
            `;

                html += `
              <div class="flex items-center justify-between py-2 px-2 border-t border-brand-gold">
                <div class="flex items-center gap-2">
                  <!--<img src="${equipos.LOGOV}" alt="${equipos.VISITANTE}" class="w-6 h-6 object-contain">-->
                  <span class="font-medium text-sm">${equipos.VISITANTE}</span>
                </div>
                <span class="font-bold text-sm">${equipos.VSCORE}</span>
              </div>
            `;
            }

            html += `
            </div>
            <div class="text-center text-sm font-medium mt-4 pt-4 border-t border-brand-gold">${fechaFinal}</div>
          </div>
        `;

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
    if (!div) return;
    div.classList.add("mb-6", "mt-6");

    if (!partidos || partidos.length === 0) {
        div.innerHTML = `
            <div class="text-center py-12">
                <p class="text-gray-900 text-lg mb-2">No hay partidos programados para esta semana.</p>
                <p class="text-gray-600 text-sm">Intenta cambiar la semana o el filtro de ciclo.</p>
            </div>
        `;
        return;
    }

    // Agrupar partidos por fecha
    const partidosPorFecha = {};
    partidos.forEach(partido => {
        const fechaKey = `${partido.DIA}-${partido.MES}-${partido.ANIO || new Date().getFullYear()}`;
        if (!partidosPorFecha[fechaKey]) {
            partidosPorFecha[fechaKey] = [];
        }
        partidosPorFecha[fechaKey].push(partido);
    });

    // Ordenar fechas
    const fechasOrdenadas = Object.keys(partidosPorFecha).sort((a, b) => {
        const [diaA, mesA, anioA] = a.split('-').map(Number);
        const [diaB, mesB, anioB] = b.split('-').map(Number);
        const fechaA = new Date(anioA, mesA - 1, diaA);
        const fechaB = new Date(anioB, mesB - 1, diaB);
        return fechaA - fechaB;
    });

    let html = '';

    fechasOrdenadas.forEach(fechaKey => {
        const [dia, mes, anio] = fechaKey.split('-').map(Number);
        const mesNombre = meses[mes - 1] || mes;
        const diaFormateado = String(dia).padStart(2, '0');
        const fechaFormateada = `${diaFormateado} ${mesNombre}`;
        
        // Obtener día de la semana
        const fecha = new Date(anio, mes - 1, dia);        
        const diaSemana = diasSemana[fecha.getDay()];
        const partidosDelDia = partidosPorFecha[fechaKey];
        
        html += `
            <div class="md:container mx-auto mb-8">
                <h4 class="text-2xl font-bold text-brand-blue mb-4 flex items-center gap-2">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    ${diaSemana} ${fechaFormateada}
                </h4>
                <div class="grid ${partidosDelDia.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-4 lg:gap-6">
        `;

        partidosDelDia.forEach(partido => {
            // Determinar el tipo de partido según el grupo
            let tipoPartido = "Fase de Grupos";
            if (partido.GRUPO === "SEMIFINAL") {
                tipoPartido = "Semifinal";
            } else if (partido.GRUPO === "3RPUESTO") {
                tipoPartido = "Tercer Puesto";
            } else if (partido.GRUPO === "1RPUESTO") {
                tipoPartido = "Final";
            } else if (partido.GRUPO && ["A", "B", "C", "D"].includes(partido.GRUPO)) {
                tipoPartido = `Grupo ${partido.GRUPO}`;
            }

            html += `
                <div class="rounded-brand p-4 lg:p-6 bg-white shadow-lg ring-1 ring-black/5 border border-gray-200 hover:shadow-brand-md transition-shadow overflow-hidden">
                    <div class="text-center text-sm sm:text-md md:text-lg font-bold text-gray-800 uppercase tracking-wider mb-4">
                        ${tipoPartido} ${partido.CICLO ? `- ${partido.CICLO}` : ''}
                    </div>
                    <div class="flex flex-col lg:flex-row items-center justify-between gap-2 lg:gap-4 mb-2 lg:mb-4">
                        <div class="flex flex-col items-center flex-1">
                            ${partido.LLOGO ? `<img src="${convertGoogleDriveUrl(convertGoogleDriveUrl(partido.LLOGO))}" alt="${partido.LOCAL}" class="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 object-contain mb-2" onerror="this.style.display='none'">` : ''}
                            <div class="text-sm sm:text-md md:text-lg font-bold text-gray-800 uppercase text-center">${partido.LOCAL || 'Por definir'}</div>
                        </div>
                        <div class="text-3xl font-bold text-gray-800 flex items-center gap-2">
                            <span class="text-4xl text-brand-gold">VS</span>
                        </div>
                        <div class="flex flex-col items-center flex-1">
                            ${partido.VLOGO ? `<img src="${convertGoogleDriveUrl(convertGoogleDriveUrl(partido.VLOGO))}" alt="${partido.VISITANTE}" class="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 object-contain mb-2" onerror="this.style.display='none'">` : ''}
                            <div class="text-sm sm:text-md md:text-lg font-bold text-gray-800 uppercase text-center">${partido.VISITANTE || 'Por definir'}</div>
                        </div>
                    </div>
                    <div class="text-center text-sm sm:text-md md:text-lg text-gray-600 mt-4 pt-4 border-t border-gray-200">
                        ${partido.HORA ? `${partido.HORA}` : 'Hora por confirmar'}
                    </div>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;
    });

    div.innerHTML = html;
}

// Función para convertir URLs de Google Drive
const convertGoogleDriveUrl = (url) => {
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