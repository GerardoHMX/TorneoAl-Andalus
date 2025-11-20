// URLS de las hojas de calculo
export const URLS = {
    CLASIFICACION: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRskeRn-mtzkR4JaGndzuwt_akX4SzWyF2IepdDiB7XA6LAUTgSNPGoypoaFbrsBzQDmgC2KjC4r8NY/pub?gid=2030682955&single=true&output=csv",
    EQUIPOS: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRskeRn-mtzkR4JaGndzuwt_akX4SzWyF2IepdDiB7XA6LAUTgSNPGoypoaFbrsBzQDmgC2KjC4r8NY/pub?gid=1653489379&single=true&output=csv",
    LIDERES: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRskeRn-mtzkR4JaGndzuwt_akX4SzWyF2IepdDiB7XA6LAUTgSNPGoypoaFbrsBzQDmgC2KjC4r8NY/pub?gid=1140378341&single=true&output=csv",
    SANCIONES: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRskeRn-mtzkR4JaGndzuwt_akX4SzWyF2IepdDiB7XA6LAUTgSNPGoypoaFbrsBzQDmgC2KjC4r8NY/pub?gid=440116157&single=true&output=csv",
    NOTICIAS: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRskeRn-mtzkR4JaGndzuwt_akX4SzWyF2IepdDiB7XA6LAUTgSNPGoypoaFbrsBzQDmgC2KjC4r8NY/pub?gid=1757087324&single=true&output=csv",
    OTROS: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRskeRn-mtzkR4JaGndzuwt_akX4SzWyF2IepdDiB7XA6LAUTgSNPGoypoaFbrsBzQDmgC2KjC4r8NY/pub?gid=2051372861&single=true&output=csv",
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
export async function fetchCSV(url) {
    const r = await fetch(url, { cache: "no-store" });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const text = await r.text();
    return csvToObjects(text);
}

// Convierte CSV a array de objetos
function csvToObjects(csv) {
    const rows = csv
        .trim()
        .split(/\r?\n/)
        .map(r => r.split(",").map(c => c.trim()));
    const headers = rows[2]; // tercera fila = fila 3 (index 2)
    const dataRows = rows.slice(3); // desde la fila 4 en adelante

    return dataRows.map(r =>
        Object.fromEntries(headers.map((h, i) => [h, r[i] ?? ""]))
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
    ]);

    // Procesar resultados, usando array vacío si alguna falla
    const [
        CLASIFICACION,
        EQUIPOS,
        LIDERES,
        SANCIONES,
        NOTICIAS,
        OTROS
    ] = results.map((result, index) => {
        if (result.status === 'fulfilled') {
            return result.value;
        } else {
            const sheetNames = ['CLASIFICACION', 'EQUIPOS', 'LIDERES', 'SANCIONES', 'NOTICIAS', 'OTROS'];
            console.warn(`No se logro cargar la hoja ${sheetNames[index]}:`, result.reason?.message || result.reason);
            return [];
        }
    });

    return { CLASIFICACION, EQUIPOS, LIDERES, SANCIONES, NOTICIAS, OTROS: OTROS || [] };
}
