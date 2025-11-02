// Funciones de renderizado de cada sección del Torneo Al-Ándalus

const grupos = ["A", "B", "C", "D"];
const maxTeamsPerGroups = 4;
const juegos = 6;
const temsPerGroup = 4;

// --- EQUIPOS ---
export function tablaEquipos(list) {
    const div = document.getElementById("equipos");
    if (!div) return; 
    let grupo = "A";
    let temsPerGroup = [];
    let cardGroup = [];
    let allGroups = [];

    list.map((m, i) => {
        if(grupos.includes(m.GRUPO)){
            grupo = m.GRUPO;
        }
        if(grupos.includes(m.GRUPO) && m.GRUPO === grupo){
            temsPerGroup.push(`
                <li class="flex items-center gap-2"> <!-- Item ${i} -->
                    <span class="text-brand-gold">⚽</span>
                    <div class="editable-cell flex-1">${m.EQUIPO}</div>
                </li>
            `);
        }
        if(temsPerGroup.length === maxTeamsPerGroups && grupos.includes(m.GRUPO)){
                const html = `
                <!-- Match Team ${m.GRUPO} -->
                <div class="bg-white shadow-brand-sm border border-gray-200 rounded-brand p-6 hover:shadow-brand-lg transition-shadow">
                    <div class="flex items-center justify-between gap-2">
                        <h4 class="text-3xl font-bold text-brand-red mb-6 flex items-center gap-2">
                            Grupo
                            <span class="bg-brand-red text-white text-2xl w-8 h-8 rounded-full flex items-center justify-center">
                                ${m.GRUPO}
                            </span>
                        </h4>                  
                        <h4 class="text-3xl font-bold text-gray-500 mb-6 flex items-center gap-2">
                            ${m.CICLO}
                        </h4>
                    </div>
                    <ul class="space-y-2 text-brand-text-dark" id="tems-per-group-${m.GRUPO}">
                        ${temsPerGroup.map(item => item).join("")}
                    </ul>
                </div>
                `;
                
                grupo = m.GRUPO;
                cardGroup.push(html);
                allGroups.push(cardGroup);

                temsPerGroup = [];
                cardGroup = [];
        } 
    }); 
    
    div.innerHTML = allGroups.map(group => group).join("");
}

// --- TABLA DE RESULTADOS FASE DE GRUPOS RONDA INICIAL---
export function tablaResultadosFaseDeGrupos(list) {
    const div = document.getElementById("fase-de-grupos");
    if (!div) return;
    let grupo = "A";
    let cardsPerGroup = [];
    let cardsGroup = [];    

    list.map((m, i) => {
        if(grupos.includes(m.GRUPO)){
            grupo = m.GRUPO;
        }
        if(grupos.includes(m.GRUPO) && m.GRUPO === grupo){
            cardsPerGroup.push(`                
                <!-- Match Card ${i} -->
                <div class="p-6 border border-gray-200 rounded-brand">
                    <div class="flex flex-row justify-between gap-2 text-xs text-brand-text-light mb-3">
                        <div class="flex flex-row gap-2">
                            <div class="text-sm tex-gray-700">Día:</div>
                            <div class="text-sm tex-gray-700 font-bold">${m.DIA+ "/" + m.MES + "/" + m.ANIO}</div>
                        </div>
                        <div class="flex flex-row gap-2">
                            <div class="text-sm tex-gray-700">Hora:</div> 
                            <div class="text-sm tex-gray-700 font-bold">${m.HORA}</div> 
                        </div>                     
                    </div> 
                    <div class="space-y-2">
                        <div class="flex flex-row justify-between items-center gap-6"> 
                            <div class="font-medium flex-1 text-left">${m.LOCAL}</div>
                        </div>
                        <div class="flex items-center justify-center gap-2 bg-brand-bg-light rounded-lg px-6 py-2">
                            <div class="editable-cell w-8 text-center font-bold">${m.LSCORE}</div>
                            <span class="text-brand-text-light">-</span>
                            <div class="editable-cell w-8 text-center font-bold">${m.VSCORE}</div>
                        </div>  
                        <div class="flex flex-row justify-between items-center gap-6"> 
                            <div class="font-medium flex-1 text-right">${m.VISITANTE}</div>
                        </div> 
                    </div>
                </div>
            `);
        }
        if(cardsPerGroup.length === juegos && grupos.includes(m.GRUPO)){
                const html = `
                <div class="bg-white shadow-brand-sm border border-gray-200 rounded-brand hover:shadow-brand-md transition-shadow overflow-hidden p-6 mb-6" >
                    <div class="flex flex-row justify-between items-center">
                        <h4 class="text-3xl font-bold text-brand-red mb-6 flex items-center gap-2">
                            Grupo
                            <span class="bg-brand-red text-white text-2xl w-8 h-8 rounded-full flex items-center justify-center">
                                ${m.GRUPO}
                            </span>
                        </h4>
                        <h4 class="text-3xl font-bold text-gray-500 mb-6 flex items-center gap-2">
                            ${m.CICLO}
                        </h4>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="cards-per-group-${m.GRUPO}">
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
export function tablaResultadosSemifinal(list) {
    const div = document.getElementById("semifinal");
    if (!div) return;
    const grupos = ["SEMIFINAL"];
    const juegos = 2;
    let grupo = "SEMIFINAL";
    let cardsPerGroup = [];
    let cardsGroup = [];

    list.map((m, i) => {
        if(grupos.includes(m.GRUPO)){
            grupo = m.GRUPO;
        }
        if(grupos.includes(m.GRUPO) && m.GRUPO === grupo){
            cardsPerGroup.push(`                
                <!-- Match Card ${i} -->
                <div class="p-6 border border-gray-200 rounded-brand">
                    <div class="flex flex-row justify-between gap-2 text-xs text-brand-text-light mb-3">
                        <div class="flex flex-row gap-2">
                            <div class="text-sm tex-gray-700">Día:</div>
                            <div class="text-sm tex-gray-700 font-bold">${m.DIA+ "/" + m.MES + "/" + m.ANIO}</div>
                        </div>
                        <div class="flex flex-row gap-2">
                            <div class="text-sm tex-gray-700">Hora:</div> 
                            <div class="text-sm tex-gray-700 font-bold">${m.HORA}</div> 
                        </div>                     
                    </div> 
                    <div class="space-y-2">
                        <div class="flex flex-row justify-between items-center gap-6"> 
                            <div class="font-medium flex-1 text-left">${m.LOCAL}</div>
                        </div>
                        <div class="flex items-center justify-center gap-2 bg-brand-bg-light rounded-lg px-6 py-2">
                            <div class="editable-cell w-8 text-center font-bold">${m.LSCORE}</div>
                            <span class="text-brand-text-light">-</span>
                            <div class="editable-cell w-8 text-center font-bold">${m.VSCORE}</div>
                        </div>  
                        <div class="flex flex-row justify-between items-center gap-6"> 
                            <div class="font-medium flex-1 text-right">${m.VISITANTE}</div>
                        </div> 
                    </div>
                </div>
            `);
        }
        if(cardsPerGroup.length === juegos && grupos.includes(m.GRUPO)){
                const html = `
                <div class="bg-white shadow-brand-sm border border-gray-200 rounded-brand hover:shadow-brand-md transition-shadow overflow-hidden p-6 mb-6" >
                    <div class="flex flex-row justify-between items-center">
                        <h4 class="text-3xl font-bold text-brand-red mb-6 flex items-center gap-2">
                            ${m.GRUPO}
                        </h4>
                        <h4 class="text-3xl font-bold text-gray-500 mb-6 flex items-center gap-2">
                            ${m.CICLO}
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
export function tablaResultadosTercerPuesto(list) {
    const div = document.getElementById("tercer-puesto");
    if (!div) return;
    const grupos = ["3RPUESTO"];
    const juegos = 1;
    let grupo = "3RPUESTO";
    let cardsPerGroup = [];
    let cardsGroup = [];

    div.classList.add("grid", "grid-cols-1", "md:grid-cols-2", "gap-6"); 

    list.map((m, i) => {
        if(grupos.includes(m.GRUPO)){
            grupo = m.GRUPO;
        }
        if(grupos.includes(m.GRUPO) && m.GRUPO === grupo){
            cardsPerGroup.push(`                
                <!-- Match Card ${i} -->
                <div class="p-6">
                    <div class="flex flex-row justify-between gap-2 text-xs text-brand-text-light mb-3">
                        <div class="flex flex-row gap-2">
                            <div class="text-sm tex-gray-700">Día:</div>
                            <div class="text-sm tex-gray-700 font-bold">${m.DIA+ "/" + m.MES + "/" + m.ANIO}</div>
                        </div>
                        <div class="flex flex-row gap-2">
                            <div class="text-sm tex-gray-700">Hora:</div> 
                            <div class="text-sm tex-gray-700 font-bold">${m.HORA}</div> 
                        </div>                     
                    </div> 
                    <div class="space-y-2">
                        <div class="flex flex-row justify-between items-center gap-6"> 
                            <div class="font-medium flex-1 text-left">${m.LOCAL}</div>
                        </div>
                        <div class="flex items-center justify-center gap-2 bg-brand-bg-light rounded-lg px-6 py-2">
                            <div class="editable-cell w-8 text-center font-bold">${m.LSCORE}</div>
                            <span class="text-brand-text-light">-</span>
                            <div class="editable-cell w-8 text-center font-bold">${m.VSCORE}</div>
                        </div>  
                        <div class="flex flex-row justify-between items-center gap-6"> 
                            <div class="font-medium flex-1 text-right">${m.VISITANTE}</div>
                        </div> 
                    </div>
                </div>
            `);
        }
        if(cardsPerGroup.length === juegos && grupos.includes(m.GRUPO)){
                const html = `
                <div class="bg-white shadow-brand-sm border border-gray-200 rounded-brand hover:shadow-brand-md transition-shadow overflow-hidden p-6 mb-6" >
                    <div class="flex flex-row justify-between items-center">
                        <h4 class="text-3xl font-bold text-brand-red mb-6 flex items-center gap-2">
                            TERCER PUESTO
                        </h4>
                        <h4 class="text-3xl font-bold text-gray-500 mb-6 flex items-center gap-2">
                            ${m.CICLO}
                        </h4>
                    </div>
                    <div class="grid grid-cols-1" id="cards-per-group-${m.GRUPO}">
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

// --- TABLA DE RESULTADOS FINAL ---
export function tablaResultadosFinal(list) {
    const div = document.getElementById("final");
    if (!div) return;
    const grupos = ["1RPUESTO"];
    const juegos = 1;
    let grupo = "1RPUESTO";
    let cardsPerGroup = [];
    let cardsGroup = [];

    div.classList.add("grid", "grid-cols-1", "md:grid-cols-2", "gap-6", "mt-6"); 

    list.map((m, i) => {
        if(grupos.includes(m.GRUPO)){
            grupo = m.GRUPO;
        }
        if(grupos.includes(m.GRUPO) && m.GRUPO === grupo){
            cardsPerGroup.push(`                
                <!-- Match Card ${i} -->
                <div class="p-6">
                    <div class="flex flex-row justify-between gap-2 text-xs text-brand-text-light mb-3">
                        <div class="flex flex-row gap-2">
                            <div class="text-sm tex-gray-700">Día:</div>
                            <div class="text-sm tex-gray-700 font-bold">${m.DIA+ "/" + m.MES + "/" + m.ANIO}</div>
                        </div>
                        <div class="flex flex-row gap-2">
                            <div class="text-sm tex-gray-700">Hora:</div> 
                            <div class="text-sm tex-gray-700 font-bold">${m.HORA}</div> 
                        </div>                     
                    </div> 
                    <div class="space-y-2">
                        <div class="flex flex-row justify-between items-center gap-6"> 
                            <div class="font-medium flex-1 text-left">${m.LOCAL}</div>
                        </div>
                        <div class="flex items-center justify-center gap-2 bg-brand-bg-light rounded-lg px-6 py-2">
                            <div class="editable-cell w-8 text-center font-bold">${m.LSCORE}</div>
                            <span class="text-brand-text-light">-</span>
                            <div class="editable-cell w-8 text-center font-bold">${m.VSCORE}</div>
                        </div>  
                        <div class="flex flex-row justify-between items-center gap-6"> 
                            <div class="font-medium flex-1 text-right">${m.VISITANTE}</div>
                        </div> 
                    </div>
                </div>
            `);
        }
        if(cardsPerGroup.length === juegos && grupos.includes(m.GRUPO)){
                const html = `
                <div class="bg-white shadow-brand-sm border border-gray-200 rounded-brand hover:shadow-brand-md transition-shadow overflow-hidden p-6 mb-6" >
                    <div class="flex flex-row justify-between items-center">
                        <h4 class="text-3xl font-bold text-brand-red mb-6 flex items-center gap-2">
                            Final
                        </h4>
                        <h4 class="text-3xl font-bold text-gray-500 mb-6 flex items-center gap-2">
                            ${m.CICLO}
                        </h4>
                    </div>
                    <div class="grid grid-cols-1" id="cards-per-group-${m.GRUPO}">
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

// --- TABLA DE CLASIFICACIÓN ---
export function tablaClasificacion(list) {
    const div = document.getElementById("clasificacion");
    if (!div) return;
    let grupo = "A";
    let cardsPerGroup = [];
    let cardsGroup = [];    

    list.map((m, i) => {
        if(m.EQUIPOS !== undefined && m.EQUIPOS.trim() !== ""){ 
            if(grupos.includes(m.GRUPO)){
                grupo = m.GRUPO;
            }
            if(grupos.includes(m.GRUPO) && m.GRUPO === grupo){
                cardsPerGroup.push(`                
                    <!-- Team Card ${i} -->
                    <div class="border border-gray-200 rounded-brand p-6">
                        <div class="flex items-center mb-6">
                            <div class="text-lg font-bold flex-1">${m.EQUIPOS}</div>
                        </div>
                        <div class="grid grid-cols-2 gap-2 gap-x-8">
                            <div class="flex justify-between">
                                <span class="text-gray-500 text-lg">PTS:</span>
                                <div class="text-gray-900 font-bold text-lg">${m.PUNTOS}</div>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-500 text-lg">G:</span>
                                <div class="text-gray-900 font-bold text-lg">${m.GANADOS}</div>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-500 text-lg">E:</span>
                                <div class="text-gray-900 font-bold text-lg">${m.EMPATADOS}</div>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-500 text-lg">P:</span>
                                <div class="text-gray-900 font-bold text-lg">${m.PERDIDOS}</div>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-500 text-lg">GF:</span>
                                <div class="ttext-gray-900 font-bold text-lg">${m.GOLESAFAVOR}</div>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-500 text-lg">GC:</span>
                                <div class="text-gray-900 font-bold text-lg">${m.GOLESENCONTRA}</div>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-500 text-lg">DIF:</span>
                                <div class="text-gray-900 font-bold text-lg">${m.DIFERENCIADEGOLES}</div>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-500 text-lg">FP:</span>
                                <div class="text-gray-900 font-bold text-lg">${m.FAIRPLAY}</div>
                            </div>
                        </div>
                        <div class="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center">
                            <span class="text-gray-500 text-lg">Total:</span>
                            <div class="text-gray-900 font-bold text-lg">${m.TOTAL}</div>
                        </div>
                    </div> 
                `);
            }
            if(cardsPerGroup.length === temsPerGroup && grupos.includes(m.GRUPO)){
                const html = `
                <div class="bg-white shadow-brand-sm border border-gray-200 rounded-brand overflow-hidden hover:shadow-brand-md transition-shadow mb-6">
                    <div class="bg-brand-gold text-3xl font-bold px-4 py-3 font-bold"> Grupo ${m.GRUPO} ${m.CICLO} </div>                     
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6" id="points-per-team-${m.GRUPO}">
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

// --- TABLA DE LIDERES GOLEADORES ---
export function tablaLideresGoleadores(list, ciclo) {
    const div = document.getElementById("goleadores-" + ciclo);
    if (!div) return;

    if (list.length === 0) {
        div.innerHTML = '<p class="text-gray-500 text-center">No hay datos de lideres de goleo.</p>'
        return
    }

    let html = `                
    <div class="bg-white shadow-brand-sm border border-gray-200 rounded-brand p-6 hover:shadow-brand-lg transition-shadow">
        <div class="flex items-center justify-between gap-2">                
            <h4 class="text-3xl font-bold text-gray-500 mb-2 flex items-center gap-2">
                ${ciclo}
            </h4>
        </div>
        <div class="grid grid-cols-3 gap-4" id="lideres-${ciclo}">        
    `;  

    list.forEach((lider) => {
        if(lider.CICLO === ciclo){
            html += `
            <div class="grid grid-cols-1 items-center gap-2 gap-x-8 p-6 border border-gray-200 rounded-brand">
                <div class="flex">
                    <div class="text-gray-900 font-bold text-lg">${lider.JUGADOR}</div>
                </div>
                <div class="flex gap-2">
                    <span class="text-gray-500 text-lg">GOLES:</span>
                    <div class="text-gray-900 font-bold text-lg">${lider.GOLES}</div>
                </div>
                <div class="flex">  
                    <div class="text-gray-900 font-bold text-lg">${lider.EQUIPO}</div> 
                </div>
            </div> 
            `; 
        }
    });    

    html += '</ul></div>';
    div.innerHTML = html;
}

// --- TABLA DE SANCIONADOS ---
export function tablaSancionados(list, ciclo) {
    const div = document.getElementById("sancionados-" + ciclo);
    if (!div) return;

    if (list.length === 0) {
        div.innerHTML = '<p class="text-gray-500 text-center">No hay datos de lideres de goleo.</p>'
        return
    }

    let html = `                
    <div class="bg-white shadow-brand-sm border border-gray-200 rounded-brand p-6 hover:shadow-brand-lg transition-shadow">
        <div class="flex items-center justify-between gap-2">                
            <h4 class="text-3xl font-bold text-gray-500 mb-2 flex items-center gap-2">
                ${ciclo}
            </h4>
        </div>
        <div class="grid grid-cols-3 gap-4" id="lideres-${ciclo}">        
    `;  

    list.forEach((sancionado) => {
        if(sancionado.CICLO === ciclo){
            html += `
            <div class="grid grid-cols-1 items-center gap-2 gap-x-8 p-6 border border-gray-200 rounded-brand">
                <div class="flex">
                    <div class="text-gray-900 font-bold text-lg">${sancionado.JUGADOR}</div>
                </div>
                <div class="flex gap-2 ">
                    <span class="text-lg bg-gray-500 text-white p-x-2">&nbsp;</span>    
                    <span class="text-lg text-gray-900">FALTAS:</span>
                    <div class="text-gray-900 font-bold text-lg">${sancionado.FALTAS}</div>
                </div>
                <div class="flex gap-2 ">
                    <span class="text-lg bg-yellow-500 p-x-2">&nbsp;</span>    
                    <span class="text-lg text-gray-900">AMARILLAS:</span>
                    <div class="text-gray-900 font-bold text-lg">${sancionado.TAMARILLAS}</div>
                </div>
                <div class="flex gap-2 ">
                    <span class="text-lg bg-red-500 p-x-2">&nbsp;</span>
                    <span class="text-lg text-gray-900">ROJAS:</span>
                    <div class="text-gray-900 font-bold text-lg">${sancionado.TROJAS}</div>
                </div>
                <div class="flex">  
                    <div class="text-gray-900 font-bold text-lg">${sancionado.EQUIPO}</div> 
                </div>
            </div> 
            `; 
        }
    });    

    html += '</ul></div>';
    div.innerHTML = html;
}

// --- Noticias ---
export function renderNoticias(noticias) {


    const container = document.getElementById("noticias")

    if (noticias.length === 0) {
        container.innerHTML = '<p class="text-gray-500 col-span-full text-center">No hay noticias disponibles</p>'
        return
    }

    container.innerHTML = noticias
        .map(
        (noticia, index) => `
            <article class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 ${index === 0 ? "md:col-span-2 lg:col-span-3" : ""}">
                <img src="${convertGoogleDriveUrl(convertGoogleDriveUrl(noticia.IMAGEN))}" class="w-full ${index === 0 ? "h-64 sm:h-96" : "h-48"} object-cover" loading="lazy" alt="${noticia.TITULO}" onerror="this.style.display='none'" />
                <div class="p-6">
                    <h3 class="text-xl font-bold mb-3 text-tournament-dark hover:text-tournament-red transition-colors">${noticia.TITULO}</h3>
                    <p class="text-gray-600 mb-4 leading-relaxed">${noticia.CONTENIDO}</p>
                    <div class="flex items-center justify-between">
                        <span class="text-sm font-medium text-tournament-dark bg-gray-100 px-3 py-1 rounded-full">${noticia.FECHA}</span>
                        <span class="text-sm font-semibold text-white bg-tournament-red px-4 py-1 rounded-full">${noticia.CREDITOS}</span>
                    </div>
                </div>
            </article>
        `,
        )
        .join("");
}

// --- Bracket --- 
export function renderClasificacion(clasificacion, ciclo) {
    const container = document.getElementById("clasificacion-" + ciclo)
  
    if (clasificacion.length === 0) {
      container.innerHTML = '<p class="text-gray-500 text-center">No hay datos de clasificación disponibles</p>'
      return
    }
  
    // Group teams by round and ciclo
    const grupos = {};
    clasificacion.forEach((equipo) => {
      const key = equipo.RONDA;
      if (!grupos[key]) grupos[key] = [];
      if(equipo.CICLO === ciclo){
        grupos[key].push(equipo);
      }
    });
  
    // Create tournament bracket layout
    let html = '<div class="min-w-max">'
  
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
            <div class="bg-white border-2 border-brand-gold rounded-xl p-4 min-w-[240px] w-[300px] shadow-md">
                <div class="text-center font-bold text-xl mb-4 tracking-wide">Grupo ${grupo}</div>
                <div class="space-y-2">
            `;
            gruposOrganizados[grupo].forEach((equipo) => {
                if (equipo && equipo.EQUIPOS !== undefined && equipo.EQUIPOS !== "") {
                    html += `
                    <div class="flex items-center justify-between py-3 px-2 border-b border-gray-100 last:border-0">
                        <div class="flex items-center gap-3">
                        <!--<img src="${equipo.LOGO}" alt="${equipo.EQUIPOS}" class="w-8 h-8 object-contain">-->
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
          <div class="bg-white border-2 border-brand-gold rounded-xl p-4 min-w-[240px] w-[300px] shadow-md">
            <div class="text-center font-bold text-xl mb-4 tracking-wide">Semifinal</div>
            <div class="space-y-2">
        `;
  
        if (equipos && equipos.LOCAL !== undefined && equipos.VISITANTE !== undefined) {
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
              <div class="flex items-center justify-between py-2 px-2 border-t border-gray-200">
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
          </div>
        `;
        }

        for (let i = 0; i < grupos.TERCERPUSTO.length; i += 2) {
            const equipos = grupos.TERCERPUSTO[i]
    
            html += `
            <div class="bg-white border-2 border-brand-gold rounded-xl p-4 min-w-[240px] w-[300px] shadow-md">
              <div class="text-center font-bold text-xl mb-4 tracking-wide">Tercer Puesto</div>
              <div class="space-y-2">
          `;
    
            if (equipos && equipos.LOCAL !== undefined && equipos.VISITANTE !== undefined) {
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
                <div class="flex items-center justify-between py-2 px-2 border-t border-gray-200">
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
          <div class="bg-white border-2 border-brand-gold rounded-xl p-4 min-w-[240px] w-[300px] shadow-md">
            <div class="text-center font-bold text-xl mb-4 tracking-wide">Final</div>
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
              <div class="flex items-center justify-between py-2 px-2 border-t border-gray-200">
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
    container.innerHTML = html;
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