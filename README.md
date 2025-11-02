# V Torneo Fútbol Sala Al-Ándalus — Colegio San Francisco de Asís

## 🎯 Objetivo
Sitio web estático (HTML, CSS y JS) que muestra en tiempo real los datos del **V Torneo Al-Ándalus** actualizados automáticamente desde **Google Sheets**.  
Debe ser **responsive**, accesible y compatible con móviles, tabletas y ordenadores.

---

## 🧩 Prioridad (de mayor a menor)

### 🥇 P0 — Imprescindible
1. Crear y publicar **Google Sheets** con pestañas (CSV público):
   - `jornadas`
   - `clasificacion`
   - `goleadores`
   - `sancionados`
   - `noticias`
2. Conectar cada hoja con `fetch()` y mostrarla en la web.
3. Diseño responsive (mobile-first).
4. Navbar con secciones: Jornadas, Clasificación, Goleadores, Sancionados, Noticias & Imágenes.
5. Accesibilidad básica (`aria`, foco visible, navegación con teclado).
6. Lazy-loading en imágenes y videos.
7. Identidad visual (logo, colores del torneo).
8. Aviso sobre uso de imágenes del alumnado.

### 🥈 P1 — Importante
1. Sección **Reglamento y Fair Play**.
2. **Cuadro de eliminatorias** (bracket) con cuartos, semis y final.
3. Búsqueda/filtrado por grupo, equipo o fecha.
4. Indicadores de “EN JUEGO” o próximos partidos.
5. Guardar pestaña activa en `localStorage`.
6. Metadatos SEO básicos (title, description, og:image).
7. Opción modo claro/oscuro (según sistema).

### 🥉 P2 — Mejoras futuras
1. Estadísticas y gráficos.
2. Exportar tablas (CSV/PNG).
3. Versión PWA (offline).
4. Contador de visitas o analítica sin cookies.

---

## 🗂️ Estructura de datos (Google Sheets)

| Hoja | Columnas requeridas |
|------|---------------------|
| **equipos** | id, nombre, etapa, grupo |
| **jornadas** | fecha, hora, grupo, local, visitante, gLocal, gVisit, estado, cancha, árbitro |
| **clasificacion** | grupo, equipo, PJ, G, E, P, GF, GC, DG, Ptos, FP |
| **goleadores** | jugador, equipo, goles |
| **sancionados** | jugador, equipo, tipo(A/R), partidosRestantes, motivo |
| **bracket** | fase, clave, equipo1, equipo2, g1, g2, estado |
| **noticias** | fecha, titulo, cuerpo, url, mediaType(img/video), creditos |

> Publicar cada pestaña como CSV (`Archivo > Compartir > Publicar en la web`) y pegar su URL en `app.js → URLS`.

---

## 📚 Contenido por sección

- **JORNADAS** → calendario, marcador y estado (Pendiente/Jugado/En juego)  
- **CLASIFICACIÓN** → grupos A–D, puntos y fair play  
- **GOLEADORES** → ranking de máximos anotadores  
- **SANCIONADOS** → lista de jugadores suspendidos  
- **NOTICIAS & IMÁGENES** → crónicas, fotos y videos del torneo  
- **REGLAMENTO (P1)** → normas, valores y sistema de fair play  

---

## 💻 Diseño y UX

- **Mobile-first**, uso de CSS Grid/Flex.
- **Tipografía legible** y contraste AA.
- **Componentes**: `.card`, `.table`, `.badge`, `.tag`.
- **Sticky header** y navegación simple.
- **Foco visible** y soporte de teclado.

---

## ⚡ Rendimiento
- Lazy loading (`loading="lazy"`) en imágenes y vídeos.
- Cache-busting con `?v=${Date.now()}`.
- Archivos minificados (`.min.css`, `.min.js`) para producción.

---

## 🔎 SEO y redes
- `<title>`, `<meta name="description">`
- Open Graph (`og:title`, `og:description`, `og:image`)
- URL pública (GitHub Pages o Netlify)

---

## 🔒 Privacidad
- No mostrar datos personales de menores sin autorización.
- Evitar incluir correos o números en las hojas.
- Publicar las hojas con visibilidad “quien tenga el enlace”.

---

## 🏗️ Estructura del proyecto

/
├─ index.html
├─ styles.css
├─ app.js
├─ /assets # logos, imágenes, og-image
└─ /docs # licencias, política de imágenes


---

## ⚙️ Flujo de actualización
1. Profesorado actualiza los datos en Google Sheets.  
2. La hoja publicada (CSV) se actualiza automáticamente.  
3. La web obtiene los datos en cada carga con `fetch()` → se muestran actualizados.

---

## ✅ Checklist antes de publicar (P0)

- [ ] Navbar con 5 secciones funcionales  
- [ ] Datos reales desde Google Sheets  
- [ ] Diseño responsive y accesible  
- [ ] Noticias con al menos 1 imagen o vídeo  
- [ ] Aviso de uso de imágenes de alumnado  
- [ ] SEO básico (título, descripción, imagen)  

---

## 🗓️ Cronograma sugerido

| Día | Tareas |
|-----|---------|
| 1–2 | Crear Sheets y conectar Jornadas + Clasificación |
| 3 | Añadir Goleadores y Sancionados |
| 4 | Crear Noticias & Imágenes |
| 5 | Ajustar diseño responsive y publicar en GitHub Pages |

---

## 🧾 Criterios de evaluación
- Datos correctos y actualizados automáticamente.  
- Navegación clara y rápida.  
- Código ordenado, comentado y sin errores.  
- Diseño visible y legible en móvil, tablet y PC.  
- Cumplimiento de normas del torneo (según PDF oficial).

---

**Autor:** Alumno de 1º Bachillerato — Colegio San Francisco de Asís  
**Proyecto escolar:** V Torneo Fútbol Sala Al-Ándalus  
**Tecnologías:** HTML5 · CSS3 · JavaScript (ES6) · Google Sheets CSV  
