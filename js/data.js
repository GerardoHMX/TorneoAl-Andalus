/**
 * URLs para la hoja de calculo:
 * equipos: https://docs.google.com/spreadsheets/d/e/2PACX-1vRskeRn-mtzkR4JaGndzuwt_akX4SzWyF2IepdDiB7XA6LAUTgSNPGoypoaFbrsBzQDmgC2KjC4r8NY/pub?gid=1252401549&single=true&output=csv
 * jornadas: https://docs.google.com/spreadsheets/d/e/2PACX-1vRskeRn-mtzkR4JaGndzuwt_akX4SzWyF2IepdDiB7XA6LAUTgSNPGoypoaFbrsBzQDmgC2KjC4r8NY/pub?gid=0&single=true&output=csv
 * clasificacion: https://docs.google.com/spreadsheets/d/e/2PACX-1vRskeRn-mtzkR4JaGndzuwt_akX4SzWyF2IepdDiB7XA6LAUTgSNPGoypoaFbrsBzQDmgC2KjC4r8NY/pub?gid=2076767012&single=true&output=csv
 * goleadores: https://docs.google.com/spreadsheets/d/e/2PACX-1vRskeRn-mtzkR4JaGndzuwt_akX4SzWyF2IepdDiB7XA6LAUTgSNPGoypoaFbrsBzQDmgC2KjC4r8NY/pub?gid=1140378341&single=true&output=csv
 * sanciones: https://docs.google.com/spreadsheets/d/e/2PACX-1vRskeRn-mtzkR4JaGndzuwt_akX4SzWyF2IepdDiB7XA6LAUTgSNPGoypoaFbrsBzQDmgC2KjC4r8NY/pub?gid=440116157&single=true&output=csv
 * noticias: https://docs.google.com/spreadsheets/d/e/2PACX-1vRskeRn-mtzkR4JaGndzuwt_akX4SzWyF2IepdDiB7XA6LAUTgSNPGoypoaFbrsBzQDmgC2KjC4r8NY/pub?gid=1757087324&single=true&output=csv
 * bracket: https://docs.google.com/spreadsheets/d/e/2PACX-1vRskeRn-mtzkR4JaGndzuwt_akX4SzWyF2IepdDiB7XA6LAUTgSNPGoypoaFbrsBzQDmgC2KjC4r8NY/pub?gid=1720400726&single=true&output=csv
 */

// URLS de las hojas de calculo
export const URLS = {
    equipos: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRskeRn-mtzkR4JaGndzuwt_akX4SzWyF2IepdDiB7XA6LAUTgSNPGoypoaFbrsBzQDmgC2KjC4r8NY/pub?gid=1252401549&single=true&output=csv",
    jornadas: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRskeRn-mtzkR4JaGndzuwt_akX4SzWyF2IepdDiB7XA6LAUTgSNPGoypoaFbrsBzQDmgC2KjC4r8NY/pub?gid=0&single=true&output=csv",
    clasificacion: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRskeRn-mtzkR4JaGndzuwt_akX4SzWyF2IepdDiB7XA6LAUTgSNPGoypoaFbrsBzQDmgC2KjC4r8NY/pub?gid=2076767012&single=true&output=csv",
    goleadores: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRskeRn-mtzkR4JaGndzuwt_akX4SzWyF2IepdDiB7XA6LAUTgSNPGoypoaFbrsBzQDmgC2KjC4r8NY/pub?gid=1140378341&single=true&output=csv",
    sancionados: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRskeRn-mtzkR4JaGndzuwt_akX4SzWyF2IepdDiB7XA6LAUTgSNPGoypoaFbrsBzQDmgC2KjC4r8NY/pub?gid=440116157&single=true&output=csv",
    noticias: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRskeRn-mtzkR4JaGndzuwt_akX4SzWyF2IepdDiB7XA6LAUTgSNPGoypoaFbrsBzQDmgC2KjC4r8NY/pub?gid=1757087324&single=true&output=csv",
    bracket: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRskeRn-mtzkR4JaGndzuwt_akX4SzWyF2IepdDiB7XA6LAUTgSNPGoypoaFbrsBzQDmgC2KjC4r8NY/pub?gid=1720400726&single=true&output=csv"
};


async function testURLs() {
    for (const [k, url] of Object.entries(URLS)) {
        try {
            const r = await fetch(url, { cache: 'no-store' });
            console.log(`${k}: ${r.status} → ${r.ok ? "✅ OK" : "❌ FALLA"}`);
            if (!r.ok) {
                const txt = await r.text();
                console.warn("Respuesta:", txt.slice(0, 150));
            }
        } catch (e) {
            console.error(`⚠️ Error al conectar con ${k}:`, e.message);
        }
    }
}
testURLs()


;

// Función para obtener y parsear CSV
export async function fetchCSV(url) {
    const r = await fetch(url, { cache: "no-store" });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const text = await r.text();
    return csvToObjects(text);
}

// Convierte CSV a array de objetos
function csvToObjects(csv) {
    const rows = csv.trim().split(/\r?\n/).map(r => r.split(",").map(c => c.trim()));
    const headers = rows.shift();
    return rows.map(r => Object.fromEntries(headers.map((h, i) => [h, r[i] ?? ""])));
}

// Carga todas las hojas en paralelo
export async function loadAllData() {
    const [
        equipos, jornadas, clasificacion, goleadores, sancionados, noticias, bracket
    ] = await Promise.all([
        fetchCSV(URLS.equipos),
        fetchCSV(URLS.jornadas),
        fetchCSV(URLS.clasificacion),
        fetchCSV(URLS.goleadores),
        fetchCSV(URLS.sancionados),
        fetchCSV(URLS.noticias),
        fetchCSV(URLS.bracket)
    ]);
    return { equipos, jornadas, clasificacion, goleadores, sancionados, noticias, bracket };
}

// Auto recarga cada 5 minutos
setInterval(() => {
    loadAllData().then(d => {
        STATE.data = d;
        updateUI();
    });
}, 5 * 60 * 1000);
