// URLS de las hojas de calculo
export const URLS = {
    CLASIFICACION: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRskeRn-mtzkR4JaGndzuwt_akX4SzWyF2IepdDiB7XA6LAUTgSNPGoypoaFbrsBzQDmgC2KjC4r8NY/pub?gid=2030682955&single=true&output=csv",
    EQUIPOS: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRskeRn-mtzkR4JaGndzuwt_akX4SzWyF2IepdDiB7XA6LAUTgSNPGoypoaFbrsBzQDmgC2KjC4r8NY/pub?gid=1653489379&single=true&output=csv",
    LIDERES: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRskeRn-mtzkR4JaGndzuwt_akX4SzWyF2IepdDiB7XA6LAUTgSNPGoypoaFbrsBzQDmgC2KjC4r8NY/pub?gid=1140378341&single=true&output=csv",
    SANCIONES: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRskeRn-mtzkR4JaGndzuwt_akX4SzWyF2IepdDiB7XA6LAUTgSNPGoypoaFbrsBzQDmgC2KjC4r8NY/pub?gid=440116157&single=true&output=csv",
    NOTICIAS: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRskeRn-mtzkR4JaGndzuwt_akX4SzWyF2IepdDiB7XA6LAUTgSNPGoypoaFbrsBzQDmgC2KjC4r8NY/pub?gid=1757087324&single=true&output=csv",
    OTROS: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRskeRn-mtzkR4JaGndzuwt_akX4SzWyF2IepdDiB7XA6LAUTgSNPGoypoaFbrsBzQDmgC2KjC4r8NY/pub?gid=2051372861&single=true&output=csv",
    GALERIA: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRskeRn-mtzkR4JaGndzuwt_akX4SzWyF2IepdDiB7XA6LAUTgSNPGoypoaFbrsBzQDmgC2KjC4r8NY/pub?gid=1528902819&single=true&output=csv",
    CONFIGURACION: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRskeRn-mtzkR4JaGndzuwt_akX4SzWyF2IepdDiB7XA6LAUTgSNPGoypoaFbrsBzQDmgC2KjC4r8NY/pub?gid=894153727&single=true&output=csv",
    FEEDBACK: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRskeRn-mtzkR4JaGndzuwt_akX4SzWyF2IepdDiB7XA6LAUTgSNPGoypoaFbrsBzQDmgC2KjC4r8NY/pubhtml?gid=891194236&single=true"
};

async function testURLs() {
    for (const [k, url] of Object.entries(URLS)) {
        try {
            const r = await fetch(url, { cache: 'no-store' });
            if (!r.ok) {
                const txt = await r.text();
                console.warn("Respuesta:", txt.slice(0, 150));
            }
        } catch (e) {
            console.error(`⚠️ Error al conectar con ${k}:`, e.message);
        }
    }
}

// testURLs();

// Función para obtener y parsear CSV
export async function fetchCSV(url, isConfiguracion = false) {
    const r = await fetch(url, { cache: "no-store" });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const text = await r.text();
    return csvToObjects(text, isConfiguracion);
}

// Función para obtener las filas sin parsear (solo para CONFIGURACION)
export async function fetchCSVRows(url) {
    const r = await fetch(url, { cache: "no-store" });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const text = await r.text();
    return csvToRows(text);
}

// Convierte CSV a array de filas (sin convertir a objetos)
function csvToRows(csv) {
    const rows = [];
    let currentRow = [];
    let currentField = '';
    let insideQuotes = false;
    
    // Recorrer el texto carácter por carácter
    for (let i = 0; i < csv.length; i++) {
        const char = csv[i];
        const nextChar = csv[i + 1];
        
        if (char === '"') {
            if (insideQuotes && nextChar === '"') {
                currentField += '"';
                i++;
            } else {
                insideQuotes = !insideQuotes;
            }
        } else if (char === ',' && !insideQuotes) {
            currentRow.push(currentField.trim());
            currentField = '';
        } else if ((char === '\n' || (char === '\r' && nextChar !== '\n')) && !insideQuotes) {
            if (char === '\r' && nextChar === '\n') {
                i++;
            }
            currentRow.push(currentField.trim());
            currentField = '';
            if (currentRow.length > 0 && currentRow.some(field => field !== '')) {
                rows.push(currentRow);
            }
            currentRow = [];
        } else {
            currentField += char;
        }
    }
    
    if (currentField.trim() !== '' || currentRow.length > 0) {
        currentRow.push(currentField.trim());
        if (currentRow.length > 0 && currentRow.some(field => field !== '')) {
            rows.push(currentRow);
        }
    }
    
    return rows;
}

// Convierte CSV a array de objetos, respetando comillas y saltos de línea dentro de campos
function csvToObjects(csv, isConfiguracion = false) {
    const rows = [];
    let currentRow = [];
    let currentField = '';
    let insideQuotes = false;
    
    // Recorrer el texto carácter por carácter
    for (let i = 0; i < csv.length; i++) {
        const char = csv[i];
        const nextChar = csv[i + 1];
        const prevChar = csv[i - 1];
        
        if (char === '"') {
            if (insideQuotes && nextChar === '"') {
                // Comilla escapada (dobles comillas)
                currentField += '"';
                i++; // Saltar la siguiente comilla
            } else {
                // Toggle del estado de comillas
                insideQuotes = !insideQuotes;
            }
        } else if (char === ',' && !insideQuotes) {
            // Separador de campo (solo si no estamos dentro de comillas)
            currentRow.push(currentField.trim());
            currentField = '';
        } else if ((char === '\n' || (char === '\r' && nextChar !== '\n')) && !insideQuotes) {
            // Salto de línea que marca el final de una fila (solo si no estamos dentro de comillas)
            // Si es \r\n, el siguiente carácter será \n y lo saltaremos
            if (char === '\r' && nextChar === '\n') {
                i++; // Saltar el \n siguiente
            }
            // Agregar el último campo de la fila
            currentRow.push(currentField.trim());
            currentField = '';
            // Agregar la fila completa al array de filas
            if (currentRow.length > 0 && currentRow.some(field => field !== '')) {
                rows.push(currentRow);
            }
            currentRow = [];
        } else {
            // Cualquier otro carácter (incluyendo saltos de línea dentro de comillas)
            currentField += char;
        }
    }
    
    // Agregar la última fila si hay contenido pendiente
    if (currentField.trim() !== '' || currentRow.length > 0) {
        currentRow.push(currentField.trim());
        if (currentRow.length > 0 && currentRow.some(field => field !== '')) {
            rows.push(currentRow);
        }
    }
    
    // Obtener headers y datos según la estructura esperada
    let headers, dataRows;
    
    if (isConfiguracion) {
        // Para CONFIGURACION: las filas 1-2 están agrupadas (instrucciones)
        // Los headers están en la fila 3 (index 2), datos desde fila 4 (index 3)
        if (rows.length > 2) {
            headers = rows[2]; // tercera fila = fila 3 (index 2) con headers: CAMPO, TIPO, DESCRIPCION, VALOR
            dataRows = rows.slice(3); // desde la fila 4 en adelante
        } else {
            headers = rows[0] || [];
            dataRows = rows.slice(1);
        }
    } else {
        // Para todas las demás hojas: headers en fila 3 (index 2), datos desde fila 4 (index 3)
        headers = rows[2]; // tercera fila = fila 3 (index 2)
        dataRows = rows.slice(3); // desde la fila 4 en adelante
    }

    return dataRows.map(r =>
        Object.fromEntries(headers.map((h, i) => [h ? h.trim() : `col_${i}`, r[i] ?? ""]))
    );
}

// Carga todas las hojas en paralelo
export async function loadAllData() {
    // Usar Promise.allSettled para que las otras hojas se carguen aunque OTROS falle
    const results = await Promise.allSettled([
        fetchCSV(URLS.CLASIFICACION),
        fetchCSV(URLS.EQUIPOS),
        fetchCSV(URLS.LIDERES),
        fetchCSV(URLS.SANCIONES),
        fetchCSV(URLS.NOTICIAS),
        URLS.OTROS ? fetchCSV(URLS.OTROS).catch(() => []) : Promise.resolve([]),
        URLS.GALERIA ? fetchCSV(URLS.GALERIA).catch(() => []) : Promise.resolve([]),
        URLS.CONFIGURACION ? fetchCSV(URLS.CONFIGURACION, true).catch(() => []) : Promise.resolve([]),
    ]);

    // Procesar resultados, usando array vacío si alguna falla
    const [
        CLASIFICACION,
        EQUIPOS,
        LIDERES,
        SANCIONES,
        NOTICIAS,
        OTROS,
        GALERIA,
        CONFIGURACION
    ] = results.map((result, index) => {
        if (result.status === 'fulfilled') {
            return result.value;
        } else {
            const sheetNames = ['CLASIFICACION', 'EQUIPOS', 'LIDERES', 'SANCIONES', 'NOTICIAS', 'OTROS', 'GALERIA', 'CONFIGURACION'];
            console.warn(`No se logro cargar la hoja ${sheetNames[index]}:`, result.reason?.message || result.reason);
            return [];
        }
    });

    return { CLASIFICACION, EQUIPOS, LIDERES, SANCIONES, NOTICIAS, OTROS: OTROS || [], GALERIA: GALERIA || [], CONFIGURACION: CONFIGURACION || [] };
}

/** Obtiene un valor de la hoja CONFIGURACION (columnas CAMPO / VALOR). Case-insensitive. */
export async function getConfigValueFromSheet(key) {
    if (!URLS.CONFIGURACION) return '';
    let rows = [];
    try {
        rows = await fetchCSVRows(URLS.CONFIGURACION);
    } catch {
        return '';
    }
    if (!rows || rows.length < 4) return '';
    const headers = rows[1];
    const campoIndex = headers.findIndex(h => h && h.toUpperCase().trim() === 'CAMPO');
    const valorIndex = headers.findIndex(h => h && h.toUpperCase().trim() === 'VALOR');
    if (campoIndex === -1 || valorIndex === -1) return '';
    const keyUpper = (key || '').toString().trim().toUpperCase();
    for (let i = 3; i < rows.length; i++) {
        const row = rows[i];
        const campo = (row[campoIndex] || '').trim().toUpperCase();
        if (campo !== keyUpper) continue;
        let valor = (row[valorIndex] || '').trim();
        if (!valor) valor = 'Sin Datos';
        return valor === 'Sin Datos' ? '' : valor;
    }
    return '';
}
