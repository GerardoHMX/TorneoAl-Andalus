# Resumen del Sitio Web

## Objetivo del Sitio

El sitio web del **Torneo Escolar de Fútbol Sala** tiene como objetivo principal proporcionar una plataforma digital completa para gestionar y visualizar toda la información relacionada con el torneo deportivo del Colegio San Francisco de Asís. 

Sus objetivos específicos incluyen:

- **Centralizar la información del torneo**: Ofrecer un punto único de acceso para toda la información relacionada con el torneo (partidos, equipos, clasificaciones, resultados, etc.)
- **Facilitar el seguimiento en tiempo real**: Permitir a estudiantes, profesores y familias consultar resultados, próximos partidos y clasificaciones actualizadas
- **Promover la participación y el Fair Play**: Fomentar el espíritu deportivo y la participación mediante la visualización de estadísticas, noticias y galería de imágenes
- **Automatizar la gestión de datos**: Utilizar Google Sheets como fuente de datos para facilitar la actualización sin necesidad de modificar código
- **Proporcionar una experiencia responsive**: Funcionar correctamente en dispositivos móviles, tablets y escritorio

---

## Secciones del Sitio

El sitio está organizado en las siguientes secciones principales:

### 1. **Inicio (Hero Section)**
   - Presentación visual del torneo con el nombre del torneo
   - Diseño con fondo rojo característico del colegio

### 2. **Bases del Torneo**
   - Información sobre las reglas y normativas del torneo
   - Presentada mediante carrusel en pantallas grandes y acordeón en móviles
   - Contenido dinámico cargado desde Google Sheets

### 3. **Próximos Partidos**
   - Visualización de los partidos programados para los próximos días
   - Navegación día por día con botones anterior/siguiente
   - Filtrado automático que muestra solo días laborales con partidos programados

### 4. **Equipos Participantes**
   - Listado completo de todos los equipos del torneo
   - Filtros por ciclo educativo (ESO, BCH, TODOS)
   - Filtros por grupo (A, B, C, D, TODOS)
   - Información detallada de cada equipo

### 5. **Jornadas**
   - Visualización de todas las jornadas del torneo
   - Separación por fases: Fase de Grupos, Semifinales, Tercer y Cuarto Puesto
   - Filtrado por ciclo (ESO, BCH, TODOS)

### 6. **Clasificación**
   - Tabla de clasificación general por ciclo
   - Estadísticas de puntos, partidos jugados, ganados, empatados y perdidos
   - Diferencia de goles

### 7. **Clasificación Grupal**
   - Clasificación organizada por grupos (A, B, C, D)
   - Permite ver el rendimiento de equipos dentro de su grupo específico

### 8. **Bracket**
   - Visualización del árbol de eliminación del torneo
   - Muestra el progreso de los equipos hacia la final

### 9. **Podio**
   - Visualización de los tres equipos ganadores del torneo
   - Muestra el primer, segundo y tercer puesto con sus logos y nombres
   - Los datos se obtienen de la hoja CLASIFICACION:
     - Primer y segundo puesto: Desde registros con `GRUPO: "1RPUESTO"` (campos `GANA`, `GLOGO`, `PIERDE`, `PLOGO`)
     - Tercer puesto: Desde registros con `GRUPO: "3RPUESTO"` (campos `GANA`, `GLOGO`)

### 10. **Líderes Goleadores**
   - Ranking de los jugadores con más goles
   - Filtrado por ciclo educativo
   - Filtrado adicional por curso dentro de cada ciclo

### 11. **Sancionados**
    - Listado de jugadores sancionados
    - Información sobre el tipo de sanción y duración
    - Filtrado por ciclo y curso

### 12. **Resultados**
    - Historial completo de resultados de todos los partidos
    - Filtrado por ciclo educativo
    - Información detallada de cada encuentro

### 13. **Noticias**
    - Sección de noticias y actualizaciones del torneo
    - Navegación por fecha con botones anterior/siguiente
    - Visualización en formato de tarjetas con imágenes
    - Diálogo modal para ver noticias completas
    - **Imágenes**: Las imágenes se almacenan en Google Drive con acceso público y se referencian desde Google Sheets

### 14. **Galería**
    - Galería de imágenes del torneo
    - Navegación por fecha
    - Soporte para diferentes tipos de contenido multimedia
    - Visualización en grid responsive
    - **Imágenes**: Las imágenes se almacenan en Google Drive con acceso público y se referencian desde Google Sheets

### 15. **Footer**
    - Información de contacto del colegio
    - Enlaces a redes sociales
    - Créditos y licencia del proyecto

---

## Cómo Funciona Este Sitio

### Arquitectura Técnica

El sitio utiliza una arquitectura **SPA (Single Page Application)** con las siguientes características:

#### **Frontend**
- **HTML5**: Estructura semántica del sitio (~588 líneas)
- **CSS3**: Estilos personalizados con variables CSS y diseño responsive
  - Variables CSS personalizadas (colores, sombras, transiciones, border-radius)
  - Fuentes personalizadas LaLiga (6 variantes tipográficas)
  - Tamaño de fuente base fijo: `16px` para consistencia dev/producción
- **Tailwind CSS 3.4.17**: Framework de utilidades con configuración personalizada
  - Breakpoint personalizado `desktopNav: 1135px` para navegación
  - Sistema extendido de colores de marca (7 colores + variantes)
  - Sombras personalizadas: `brand-sm`, `brand-md`, `brand-lg`
  - Border radius personalizado: `0px` (bordes cuadrados)
  - Scripts de compilación: `npm run build-css` (producción), `npm run watch-css` (desarrollo)
- **Bootstrap 5.3.0**: Componentes UI (tabs, acordeón, modales)
- **JavaScript ES6+**: Lógica de aplicación modular (~5,872 líneas total)
  - 7 módulos independientes con responsabilidades claras
  - Sistema de imports/exports ES6
  - Código organizado por funcionalidad

#### **Fuente de Datos**
- **Google Sheets**: Todas las hojas de cálculo están alojadas en Google Sheets y se exportan como CSV
- **CSV Parsing**: El sitio parsea los archivos CSV directamente desde URLs públicas de Google Sheets
- **Actualización automática**: Los datos se recargan automáticamente cada 5 minutos
- **Hoja CONFIGURACION**: Hoja especial para personalización del sitio
  - Estructura: Filas 1-2 agrupadas/instrucciones, Fila 3 headers (CAMPO | TIPO | DESCRIPCIÓN | VALOR), Datos desde fila 4
  - Permite personalizar nombre del torneo, información del colegio, URLs, Google Analytics ID
  - Se parsea de forma especial para manejar la estructura con filas agrupadas
- **Google Drive**: Las imágenes (fotos de noticias, galería, logos, etc.) se almacenan en Google Drive
  - Las imágenes se configuran con **acceso público** (cualquier usuario de Internet con el enlace puede verlas)
  - Los enlaces de las imágenes se almacenan en las columnas correspondientes de Google Sheets
  - El sitio consume estas URLs directamente desde Google Sheets para mostrar las imágenes
  - Función `convertGoogleDriveUrl()` convierte automáticamente URLs de Google Drive al formato de visualización directa

#### **Arquitectura de Código JavaScript**

El código JavaScript está altamente modularizado en 7 módulos independientes (~5,872 líneas):

**1. `data.js` (231 líneas) - Gestión de Datos**
- Definición de URLs de las hojas de Google Sheets
- Parser CSV robusto con manejo de:
  - Comillas dobles escapadas (`""`)
  - Saltos de línea dentro de campos entre comillas
  - Estructura especial de hoja CONFIGURACION
- Funciones principales:
  - `fetchCSV(url, isConfiguracion)`: Obtiene y parsea CSV a objetos
  - `fetchCSVRows(url)`: Obtiene CSV como array de filas sin parsear
  - `csvToObjects(csv, isConfiguracion)`: Convierte CSV a array de objetos JavaScript
  - `csvToRows(csv)`: Convierte CSV a array de filas
  - `loadAllData()`: Carga todas las hojas en paralelo con manejo de errores
  - `getConfigValueFromSheet(key)`: Obtiene valores de configuración (case-insensitive)

**2. `ui.js` (2,112 líneas) - Renderizado de Secciones**
- Renderizado de todas las secciones del sitio
- Funciones de renderizado por sección:
  - `tablaEquipos()`: Renderiza equipos participantes
  - `tablaResultadosFaseDeGrupos()`: Renderiza resultados de fase de grupos
  - `tablaResultadosSemifinal()`: Renderiza semifinales
  - `tablaResultadosTercerFinalPuesto()`: Renderiza tercer y cuarto puesto
  - `tablaClasificacion()`: Renderiza tabla de clasificación general
  - `tablaClasificacionGrupal()`: Renderiza clasificación por grupos
  - `tablaLideresGoleadores()`: Renderiza tabla de goleadores
  - `tablaSancionados()`: Renderiza listado de sancionados
  - `tablaResultados()`: Renderiza historial de resultados
  - `renderProximosPartidos()`: Renderiza próximos partidos
  - `renderBracket()`: Renderiza árbol de eliminación
  - `renderPodio()`: Renderiza podio de ganadores
  - `renderNoticias()`: Renderiza sección de noticias
  - `renderGalería()`: Renderiza galería de imágenes
- Función `convertGoogleDriveUrl()`: Convierte URLs de Google Drive a formato visualizable

**3. `main.js` (2,143 líneas) - Orquestación y Lógica Principal**
- Gestión del estado global de la aplicación
- Carga inicial de datos y configuración
- Event listeners y manejo de interactividad
- Funciones de navegación y filtrado
- Aplicación de configuración dinámica
- Control de auto-refresh (cada 5 minutos)
- Gestión de preloader
- Sistema de navegación día por día (próximos partidos, noticias, galería)

**4. `translations.js` (519 líneas) - Sistema Multilenguaje**
- Objeto `translations` con todas las traducciones (ES/EN)
- Variable `currentLanguage` para idioma activo
- Arrays de meses y días traducibles
- Funciones principales:
  - `translate(key, params)`: Obtiene traducción con interpolación
  - `changeLanguage(lang)`: Cambia idioma dinámicamente
  - `setCurrentLanguage(lang)`: Establece idioma y actualiza página
  - `updateAllTranslations()`: Actualiza todos los textos traducibles
  - `getMesesNombres(lang)`: Obtiene array de meses según idioma
  - `getDiasSemana(lang)`: Obtiene array de días según idioma

**5. `carousel.js` (298 líneas) - Lógica del Carrusel**
- Implementación del carrusel de bases del torneo
- Navegación entre slides
- Responsive design adaptado a diferentes pantallas

**6. `carousel-init.js` (256 líneas) - Inicialización del Carrusel**
- Inicialización del carrusel de bases
- Configuración de eventos y controles
- Integración con Bootstrap

**7. `accordion-init.js` (313 líneas) - Inicialización del Acordeón**
- Inicialización del acordeón de bases (vista móvil)
- Configuración de eventos de expansión/colapso
- Integración con Bootstrap

### Flujo de Funcionamiento

#### 1. **Carga Inicial**
```
Usuario accede al sitio
    ↓
Preloader muestra animación de balón
    ↓
JavaScript carga datos desde Google Sheets (CSV)
    ↓
Se parsean los datos CSV a objetos JavaScript
    ↓
Se carga configuración desde hoja "CONFIGURACION" y se convierte a objeto plano
    ↓
Se aplica configuración a elementos del DOM (nombre torneo, información colegio, etc.)
    ↓
Se detecta idioma del navegador o se usa español por defecto
    ↓
Se aplican traducciones según idioma detectado
    ↓
Se genera la navegación dinámicamente desde la hoja "OTROS"
    ↓
Se renderizan todas las secciones con los datos
    ↓
Se actualizan todas las traducciones en elementos dinámicos
    ↓
Se controla la visibilidad de secciones según configuración
    ↓
Preloader se oculta
```

#### 2. **Gestión de Datos**

El sitio carga datos desde múltiples hojas de Google Sheets:

- **CONFIGURACION**: Configuración personalizable del sitio (nombre torneo, información colegio, URLs, Google Analytics)
  - Estructura especial: Filas 1-2 agrupadas/instrucciones, Fila 3 headers, Datos desde fila 4
  - Se convierte a objeto plano `STATE.config` para acceso rápido
  - Se aplica dinámicamente a elementos del DOM con atributos `data-config`
- **CLASIFICACION**: Partidos, resultados, jornadas
- **EQUIPOS**: Información de equipos participantes
- **LIDERES**: Estadísticas de goleadores
- **SANCIONES**: Listado de sancionados
- **NOTICIAS**: Contenido de noticias (incluye URLs de imágenes desde Google Drive)
- **OTROS**: Configuración de navegación y visibilidad de secciones
- **GALERIA**: Elementos multimedia de la galería (incluye URLs de imágenes desde Google Drive)

#### **Gestión de Imágenes**

- **Almacenamiento**: Todas las imágenes se suben a **Google Drive**
- **Permisos**: Las imágenes se configuran con **acceso público** (cualquier usuario de Internet con el enlace puede verlas)
- **Integración**: Los enlaces de las imágenes se almacenan en las columnas correspondientes de Google Sheets (por ejemplo, columna URL en NOTICIAS y GALERIA)
- **Consumo**: El sitio web consume directamente estos enlaces desde Google Sheets para mostrar las imágenes en las secciones correspondientes
- **Conversión automática**: Función `convertGoogleDriveUrl()` transforma URLs de Google Drive a formato directo:
  - Entrada: `https://drive.google.com/file/d/FILE_ID/view`
  - Salida: `https://drive.google.com/uc?export=view&id=FILE_ID`
- **Ventajas**:
  - No requiere almacenamiento propio en el servidor
  - Fácil gestión y actualización de imágenes desde Google Drive
  - Escalable sin límites de almacenamiento del sitio web
  - Conversión automática de URLs para compatibilidad

#### **Estructura de Hojas de Google Sheets**

Todas las hojas siguen una estructura estándar excepto CONFIGURACION:

**Estructura estándar (CLASIFICACION, EQUIPOS, LIDERES, SANCIONES, NOTICIAS, OTROS, GALERIA):**
- **Fila 1-2**: Instrucciones o información adicional (se ignoran en el parser)
- **Fila 3**: Headers de columnas (CAMPO1, CAMPO2, etc.)
- **Fila 4 en adelante**: Datos reales

**Estructura especial de CONFIGURACION:**
- **Fila 1-2**: Instrucciones/agrupaciones (se ignoran)
- **Fila 3**: Headers especiales (CAMPO | TIPO | DESCRIPCIÓN | VALOR)
- **Fila 4 en adelante**: Configuración del sitio
- **Parser especial**: `fetchCSV(url, isConfiguracion = true)` maneja esta estructura diferente
- **Conversión a objeto**: Los datos se convierten a objeto plano `STATE.config` con claves en minúsculas
  - Ejemplo: `TORNEO_NOMBRE` → `STATE.config['torneo_nombre']`

**Carga de datos:**
- **Paralela**: Todas las hojas se cargan simultáneamente con `Promise.allSettled()`
- **Resiliente**: Si una hoja falla, las demás continúan cargando
- **Auto-refresh**: Recarga completa cada 5 minutos sin necesidad de recargar la página

**Hoja FEEDBACK (valoraciones de visitantes):**
- No se lee como CSV desde el sitio; se escribe desde un Google Apps Script al recibir el envío del widget.
- Estructura (columnas):
  - **FECHA_HORA**: Fecha y hora del envío (ISO).
  - **VALORACION**: Número del 1 al 5.
  - **TIPO**: `estrellas` o `caritas`.
  - **COMENTARIO**: Texto opcional que escribe el usuario.
- El sitio envía los datos mediante un formulario POST a la URL del Web App (configurable con `FEEDBACK_SCRIPT_URL` en CONFIGURACION). Ver archivo `docs/FEEDBACK_APPS_SCRIPT.md` para el código del script.

#### 3. **Filtrado y Visualización**

- **Filtros dinámicos**: Los usuarios pueden filtrar contenido por ciclo (ESO/BCH), grupo (A/B/C/D), curso, etc.
- **Estado de la aplicación**: Se mantiene un objeto `STATE` global que gestiona:
  - `filtros.etapa`: Filtro de etapa actual
  - `data`: Todos los datos cargados desde Google Sheets
  - `config`: Configuración del sitio como objeto plano (acceso rápido)
  - `ciclosSeleccionados`: Ciclo seleccionado por cada sección (equipos, jornadas, clasificación, etc.)
  - `grupoSeleccionado`: Grupo seleccionado (para equipos)
  - `cursoSeleccionado`: Curso seleccionado (para sancionados y goleadores por ciclo)
- **Offsets de navegación temporal**:
  - `diaOffsetProximosPartidos`: Navegación día a día en próximos partidos
  - `diaOffsetNoticias`: Navegación día a día en noticias
  - `diaOffsetGaleria`: Navegación día a día en galería
- **Renderizado condicional**: Las secciones se muestran u ocultan según la configuración en la hoja "OTROS"

#### 4. **Navegación Inteligente**

- **Navegación por fechas con lógica inteligente**:
  - **Próximos partidos**:
    - Busca automáticamente días laborales (lunes-viernes) con partidos programados
    - Salta fines de semana automáticamente
    - Si no hay partidos en el día actual, busca el siguiente día laboral con partidos
    - Función `encontrarDiasRelevantes(clasificacion, ciclo, offsetDias)` gestiona la lógica
    - Valida fechas y verifica que los partidos tengan equipos definidos (LOCAL y VISITANTE)
  - **Noticias**:
    - Navega por días con noticias publicadas
    - Sistema de offset para retroceder/avanzar día a día
  - **Galería**:
    - Navega por días con contenido publicado
    - Sistema de offset para retroceder/avanzar día a día
- **Smooth Scroll**: Navegación suave entre secciones con offset para el header fijo
- **Navegación dinámica desde Google Sheets**:
  - Los enlaces del menú se generan desde la hoja "OTROS"
  - Control de visibilidad y orden de secciones desde la hoja "OTROS"

#### 5. **Responsive Design**

- **Mobile First**: Diseño optimizado primero para móviles
- **Breakpoints Tailwind CSS**:
  - Móvil: < 768px (acordeón para bases, menú hamburguesa)
  - Tablet/Desktop: ≥ 768px (carrusel para bases)
  - **Breakpoint personalizado `desktopNav`**: 1135px para navegación de escritorio
    - Menú horizontal desde 1135px
    - Menú hamburguesa hasta 1134px
- **Adaptación de componentes**: Los componentes se adaptan según el tamaño de pantalla
- **Sistema de estilos responsive**:
  - Uso de clases Tailwind con prefijos responsive (`sm:`, `md:`, `lg:`, `desktopNav:`)
  - Grid responsive que se adapta automáticamente (2 columnas móvil, 4 columnas desktop)
  - Tipografía escalable según dispositivo

#### 6. **Google Analytics y Tracking**

- **Sistema de análisis integrado**: El sitio utiliza Google Analytics para monitorear y analizar el tráfico
- **Configuración dinámica**: El ID de Google Analytics se configura desde la hoja CONFIGURACION (`GA_TRACKING_ID`)
- **Métricas disponibles**:
  - Número de visitantes y sesiones
  - Páginas más visitadas
  - Tiempo de permanencia en el sitio
  - Dispositivos y navegadores utilizados
  - Ubicación geográfica de los visitantes
- **Actualización sin código**: El ID se actualiza automáticamente desde Google Sheets sin necesidad de modificar código
- **Privacidad**: Cumple con las políticas de privacidad de Google Analytics

#### 7. **Características Especiales**

- **Preloader animado**: Muestra un balón de fútbol animado durante la carga
- **Auto-refresh**: Recarga automática de datos cada 5 minutos sin recargar la página
- **Parsing CSV robusto y avanzado**:
  - Parser personalizado que recorre carácter por carácter
  - Manejo de comillas dobles escapadas (`""` dentro de campos)
  - Respeta saltos de línea (`\n`, `\r\n`) dentro de campos entre comillas
  - Lógica especial para hoja CONFIGURACION (estructura diferente: headers en fila 3, datos desde fila 4)
  - Funciones separadas: `csvToObjects()` para conversión a objetos, `csvToRows()` para array de filas
  - Manejo robusto de diferentes formatos de final de línea (Windows, Unix, Mac)
- **Gestión de errores resiliente**:
  - `Promise.allSettled()` para carga paralela de hojas
  - Si una hoja falla al cargar, el sitio continúa funcionando con las demás
  - Mensajes de advertencia en consola sin romper la aplicación
- **Optimización de rendimiento**: Uso de `requestAnimationFrame` para actualizaciones suaves del DOM
- **Google Analytics**: Sistema de tracking y análisis de visitas integrado
  - Monitoreo de tráfico, páginas más visitadas y comportamiento de usuarios
  - ID configurable desde la hoja CONFIGURACION (`GA_TRACKING_ID`)
  - Se actualiza dinámicamente sin necesidad de modificar código
- **Sistema multilenguaje completo**: Soporte para español e inglés
  - Traducciones almacenadas en objeto JavaScript (`js/translations.js`, 519 líneas)
  - Cambio de idioma dinámico sin recargar la página
  - Formateo de fechas según idioma (meses y días de la semana traducidos)
  - Interpolación de parámetros en traducciones (`{group}`, `{cycle}`)
  - Detección automática del idioma del navegador al cargar
  - Selector de idioma ES/EN en el header
- **Personalización dinámica completa**: Configuración del sitio desde Google Sheets
  - Sin necesidad de modificar código para cambiar nombre del torneo, información del colegio, etc.
  - Actualización automática de meta tags, footer, header según configuración
  - Favicons construidos automáticamente desde `COLEGIO_URL` + rutas hardcodeadas:
    - Favicon 32x32: `{COLEGIO_URL}/wp-content/uploads/2023/03/cropped-favicon-32x32.png`
    - Favicon 192x192: `{COLEGIO_URL}/wp-content/uploads/2023/03/cropped-favicon-192x192.png`
    - Apple Touch Icon: `{COLEGIO_URL}/wp-content/uploads/2023/03/cropped-favicon-180x180.png`
  - Función `applyConfig()` aplica configuración a elementos con atributo `data-config`
- **Gestión de URLs de Google Drive**:
  - Función `convertGoogleDriveUrl()` convierte URLs de Google Drive al formato directo
  - Manejo automático de IDs de archivo para visualización correcta
  - Facilita la integración de imágenes desde Google Drive

### Interactividad

- **Event Listeners**: Gestión de eventos para filtros, navegación y modales
- **Estado reactivo**: Cambios en filtros actualizan inmediatamente la UI
- **Modales**: Diálogos para ver detalles completos de noticias
- **Tabs Bootstrap**: Navegación entre diferentes vistas (ESO/BCH/TODOS)
- **Selector de idioma**: Botones ES/EN en el header para cambiar idioma dinámicamente
  - Actualiza todos los textos traducibles sin recargar la página
  - Preserva el estado de la aplicación (filtros, sección visible)
  - Formatea fechas según el idioma seleccionado

### Personalización y Configuración

- **Navegación dinámica**: La barra de navegación se genera desde la hoja "OTROS" según el campo MENU
- **Visibilidad de secciones**: Cada sección puede mostrarse u ocultarse desde Google Sheets
- **Orden de secciones**: Controlado por el campo ORDEN en la hoja "OTROS"
- **Configuración del sitio**: Hoja "CONFIGURACION" permite personalizar:
  - Nombre del torneo y año escolar
  - Información del colegio (nombre, teléfonos, email, dirección)
  - URLs (sitio web del colegio, logo, redes sociales)
  - ID de Google Analytics
  - Todos estos valores se actualizan dinámicamente sin modificar código
- **Sistema multilenguaje**: Soporte completo para español e inglés
  - Selector de idioma en el header (botones ES/EN)
  - Traducciones automáticas de todos los textos de interfaz
  - Formateo de fechas según idioma seleccionado
  - Detección automática del idioma del navegador al cargar

---

## Ventajas de esta Arquitectura

1. **Sin Backend**: No requiere servidor propio, todo funciona desde GitHub Pages o hosting estático
2. **Fácil actualización**: Los administradores solo necesitan actualizar Google Sheets y subir imágenes a Google Drive
3. **Personalización completa sin código**:
   - Configuración del sitio desde hoja CONFIGURACION
   - Favicons construidos automáticamente desde URL del colegio
   - Logos y branding personalizables
   - Google Analytics configurable
4. **Multilenguaje integrado**: Soporte completo para español e inglés con cambio dinámico
5. **Tiempo real**: Los datos se actualizan automáticamente cada 5 minutos
6. **Escalable**: Fácil agregar nuevas secciones o funcionalidades
7. **Código altamente modular**:
   - 7 módulos JavaScript independientes
   - Separación clara de responsabilidades
   - Fácil mantenimiento y testing
8. **Accesible y responsive**:
   - Mobile-first design
   - Funciona en cualquier dispositivo moderno
   - Breakpoints personalizados para experiencia óptima
9. **Gestión de imágenes simplificada**:
   - Almacenamiento en Google Drive sin límites
   - Función automática de conversión de URLs
   - Sin necesidad de servidor de archivos propio
10. **Parser CSV robusto**:
    - Maneja comillas escapadas y saltos de línea
    - Gestión resiliente de errores
    - Estructura especial para hoja CONFIGURACION
11. **Sistema de estilos consistente**:
    - Variables CSS personalizadas
    - Tailwind CSS con configuración extendida
    - Fuentes personalizadas LaLiga
12. **Reutilizable**: El sitio puede reutilizarse para múltiples ciclos escolares solo actualizando Google Sheets
13. **Analítica integrada**: Google Analytics configurable para monitorear tráfico y comportamiento
14. **Navegación inteligente**: Lógica avanzada para encontrar días laborales con contenido
15. **Performance optimizado**:
    - CSS minificado con tree-shaking
    - Fuentes con font-display: swap
    - requestAnimationFrame para animaciones suaves

---

## Limitaciones y Riesgos Identificados

A pesar de las ventajas del sistema actual, se han identificado algunas limitaciones y riesgos que pueden dificultar su uso para algunos administradores:

### 1. **Gestión de Imágenes en Google Drive**

**Limitación:**
- Subir imágenes a Google Drive y configurar el acceso público no es intuitivo para algunos administradores
- El proceso requiere múltiples pasos: subir la imagen, obtener el enlace, configurar permisos públicos y copiar el ID del archivo para generar la URL correcta
- Los administradores pueden cometer errores al configurar los permisos, resultando en imágenes que no se muestran en el sitio

**Impacto:** 
- Puede generar frustración en los administradores menos técnicos
- Imágenes rotas o no visibles en el sitio si los permisos no están configurados correctamente
- Necesidad de capacitación adicional para el personal administrativo

**Soluciones implementadas:**

1. **Crear una guía visual paso a paso** con capturas de pantalla detalladas del proceso de subida y configuración de permisos **Implementado**

**Soluciones Propuestas:**

1. **Desarrollar un script de Google Apps Script** que automatice la configuración de permisos públicos al subir imágenes a una carpeta específica
2. **Implementar un formulario de Google Forms** que permita subir imágenes directamente y que automáticamente configure los permisos y genere el enlace
3. **Usar un servicio alternativo** como Imgur, Cloudinary o un bucket de almacenamiento con interfaz más simple, aunque esto requeriría cambios en la arquitectura

### 2. **Edición de Texto en Celdas de Google Sheets**

**Limitación:**
- Redactar el texto completo de una noticia dentro de una celda de Google Sheets es incómodo y poco intuitivo
- La interfaz de Google Sheets no está diseñada para editar textos largos con formato
- No hay herramientas de edición de texto avanzadas (formato, listas, enlaces, etc.)
- El texto de la columna CONTENIDO debe estar entre comillas, lo cual es fácil de olvidar y puede causar errores de parsing

**Impacto:**
- Dificultad para crear contenido de calidad
- Errores de formato que afectan la visualización
- Riesgo de romper el parsing CSV si se olvidan las comillas
- Contenido difícil de revisar y editar

**Soluciones implementadas:**
1. **Implementar validación automática** en Google Sheets mediante fórmulas o scripts que verifiquen que el contenido tenga las comillas correctas antes de guardar
   
**Soluciones Propuestas:**

1. **Crear un formulario de Google Forms** con campos de texto multilínea para cada campo de la noticia, que automáticamente formatee y agregue las comillas necesarias al insertar en Sheets
2. **Desarrollar una aplicación web simple** (interfaz de administración) con un editor de texto enriquecido (WYSIWYG) que permita escribir noticias con formato y que automáticamente las publique en Google Sheets con el formato correcto
3. **Usar Google Apps Script** para crear un editor personalizado dentro de Google Sheets que muestre un diálogo con campos de texto más grandes y formato
4. **Modificar el parser CSV** del sitio para que sea más tolerante y maneje texto sin comillas o con comillas mal colocadas
5. **Usar Google Docs** como editor y sincronizar automáticamente con Sheets mediante Apps Script

### 3. **Riesgo de Modificación Accidental de Datos**

**Limitación:**
- Los usuarios con acceso de edición a Google Sheets pueden mover, eliminar o modificar accidentalmente datos críticos o secciones completas
- Protección limitada contra cambios accidentales en la estructura de las hojas
- Un error puede afectar múltiples secciones del sitio simultáneamente
- No hay sistema de versionado o historial fácil de restaurar

**Impacto:**
- Pérdida de datos o corrupción de información
- Sitio web roto o con información incorrecta
- Necesidad de restaurar desde backups manuales
- Pérdida de tiempo y confianza en el sistema

**Soluciones implementadas:**

1. **Implementar protección de rangos en Google Sheets:**
   - Proteger las filas de encabezado (columnas, estructura)
   - Proteger columnas críticas (IDs, fechas, referencias)
   - Permitir edición solo en rangos específicos de datos

2. **Crear hojas de cálculo separadas por nivel de riesgo:**
   - **Hoja de solo lectura**: Estructura, configuración (OTROS)
   - **Hoja de edición controlada**: Datos principales (CLASIFICACION, EQUIPOS)
   - **Hoja de edición libre**: Contenido dinámico (NOTICIAS, GALERIA)

3. **Historial de versiones**
   - Google Sheets ya guarda historial.
   - **Uso:**
      Archivo → Historial de versiones
      Restaurar versiones anteriores
   - **Recomendación:**
      Nombrar versiones importantes

4. **Implementar validación de datos:**
   - Usar validación de datos de Google Sheets para campos críticos
   - Crear reglas que prevengan valores inválidos
     - Listas controladas desde hoja LISTAS
       - Uso: campos con valores predefinidos.
     - Validación para texto entre comillas (CSV)
       - Uso: campos de texto que se exportan a CSV.
     - Protección de celdas con fórmulas
       - Uso: columnas calculadas o automáticas.
   - Validar formatos de:
      - fechas, 
      - URLs, 
      - números enteros positivos,
      - validación de meses (1–12),
      - Validación de días (1–31),

**Soluciones pendientes por aplicar:**

1. **Configurar permisos granulares:**
   - Crear diferentes niveles de acceso (lectura, edición limitada, administrador)
     - Sólo existe la del desarrollador y la del administrador
   - Asignar permisos específicos por hoja según el rol del usuario
   - Usar grupos de Google Workspace para gestionar permisos

2. **Implementar sistema de backups automáticos:**
   - Usar Google Apps Script para crear backups diarios automáticos
   - Guardar versiones en una carpeta de Google Drive separada
   - Crear un script que permita restaurar versiones anteriores fácilmente

3. **Agregar validación en el frontend:**
   - Verificar la estructura de datos antes de renderizar
   - Mostrar mensajes de error claros si faltan datos críticos
   - Implementar un modo de "modo seguro" que use datos en caché si detecta errores

4. **Crear una interfaz de administración protegida:**
   - Desarrollar una aplicación web que actúe como intermediario
   - Validar todos los cambios antes de aplicarlos a Sheets
   - Mantener un log de cambios y quién los hizo
   - Requerir confirmación para operaciones destructivas

5. **Documentar procedimientos de recuperación:**
   - Crear guías claras sobre cómo restaurar desde backups
   - Documentar la estructura esperada de cada hoja
   - Proporcionar plantillas de recuperación

### 4. **Recomendación General: Interfaz de Administración Dedicada**

**Solución Integral Propuesta:**

Desarrollar una **interfaz de administración web dedicada** que:

- **Simplifique la carga de imágenes**: Permita arrastrar y soltar imágenes, las suba automáticamente a Drive y configure permisos
- **Proporcione un editor de texto enriquecido**: Para crear noticias con formato sin preocuparse por comillas o formato CSV
- **Valide todos los datos**: Antes de guardarlos en Sheets, previniendo errores
- **Muestre vista previa**: Permita ver cómo se verá el contenido antes de publicarlo
- **Implemente permisos y auditoría**: Registre quién hizo qué cambios y cuándo
- **Facilite la gestión**: Interfaz intuitiva específica para las necesidades del torneo

Esta solución mantendría Google Sheets como fuente de datos (manteniendo la ventaja de fácil acceso), pero añadiría una capa de abstracción que simplifica las operaciones comunes y reduce los riesgos.

---

## Compilación y Build Process

El proyecto utiliza **Tailwind CSS** con un proceso de compilación personalizado para generar el CSS optimizado.

### Requisitos Previos

- **Node.js** y **npm** instalados en el sistema

### Instalación de Dependencias

```bash
npm install
```

**Dependencias de desarrollo instaladas:**
- `tailwindcss ^3.4.17`: Framework de CSS utility-first
- `autoprefixer ^10.4.20`: Plugin PostCSS para agregar prefijos de navegador
- `postcss ^8.4.47`: Herramienta de transformación de CSS

### Scripts de Compilación

**1. Build para Producción (CSS minificado):**
```bash
npm run build-css
```
- Lee: `src/input.css`
- Genera: `dist/output.css` (minificado)
- Incluye solo las clases utilizadas en el proyecto (tree-shaking)
- Optimizado para producción con tamaño reducido

**2. Modo Desarrollo (Watch mode):**
```bash
npm run watch-css
```
- Observa cambios en `src/input.css` y archivos HTML/JS
- Regenera `dist/output.css` automáticamente al detectar cambios
- Ideal para desarrollo con hot-reload manual

### Configuración de Tailwind

**Archivo `tailwind.config.js`:**
- **Content paths**: Define dónde buscar clases (`index.html`, `js/**/*.js`, `./**/*.html`)
- **Safelist**: Lista de clases que siempre se incluyen (generadas dinámicamente)
- **Theme.extend**:
  - **Screens**: Breakpoint `desktopNav: '1135px'`
  - **Colors**: Sistema de colores de marca con variantes
  - **FontSize**: Tamaño `text-md` personalizado
  - **BorderRadius**: `brand` con valor `0px`
  - **BoxShadow**: Sombras `brand-sm`, `brand-md`, `brand-lg`

### Deployment

El archivo `dist/output.css` generado se enlaza en `index.html`:
```html
<link rel="stylesheet" href="dist/output.css">
```

El sitio es estático y puede desplegarse en:
- **GitHub Pages** (hosting gratuito)
- Cualquier servidor de archivos estáticos
- CDNs (Netlify, Vercel, etc.)

---

## Tecnologías Utilizadas

### Frontend Core

- **HTML5**: Estructura semántica (~588 líneas)
  - Etiquetas semánticas (header, nav, section, footer)
  - Meta tags configurables dinámicamente
  - Favicon dinámico desde Google Sheets

- **CSS3**: Estilos personalizados con variables CSS
  - Variables CSS personalizadas (`:root`)
  - Fuentes personalizadas LaLiga (6 variantes)
  - Sistema de sombras, colores y transiciones
  - Font-face declarations para fuentes locales

- **Tailwind CSS 3.4.17**: Framework utility-first
  - Configuración personalizada (`tailwind.config.js`)
  - Breakpoints personalizados (`desktopNav: 1135px`)
  - Sistema extendido de colores de marca
  - Tree-shaking para CSS optimizado
  - PostCSS + Autoprefixer

- **Bootstrap 5.3.0**: Componentes de interfaz
  - Sistema de tabs para filtros por ciclo
  - Acordeón para bases del torneo (vista móvil)
  - Modales para noticias completas
  - Grid system como complemento a Tailwind

### JavaScript

- **JavaScript ES6+**: Lógica de aplicación modular (~5,872 líneas)
  - 7 módulos independientes con ES6 imports/exports
  - Promesas y async/await para operaciones asíncronas
  - Arrow functions y destructuring
  - Template literals para generación de HTML
  - Spread operator y array methods modernos

### Tipografías

- **Fuentes Personalizadas LaLiga** (locales en `/fonts/`):
  - **LaLiga Headline VF**: Variable font para títulos
  - **LaLiga Headline STD Bold**: Títulos en negrita
  - **LaLiga Players**: Fuente decorativa
  - **LaLiga Text Regular**: Texto general
  - **LaLiga Text Bold**: Texto en negrita
  - **Font LaLiga**: Fuente de iconos
  - Formatos: `.woff`, `.woff2`, `.otf`, `.eot`
  - Font-display: swap para optimizar carga

- **Google Fonts** (CDN):
  - **Pattaya**: Fuente decorativa para hero section
  - **Roboto**: Fuente secundaria de respaldo
  - Preconnect para optimización de carga

### Fuentes de Datos

- **Google Sheets API (CSV export)**: Fuente de datos principal
  - 8 hojas de cálculo con datos estructurados
  - Export como CSV público desde URLs específicas
  - Parser CSV personalizado robusto
  - Actualización automática cada 5 minutos

- **Google Drive**: Almacenamiento de imágenes
  - Acceso público configurado por imagen
  - URLs almacenadas en Google Sheets
  - Función de conversión de URLs automática
  - Sin límites de almacenamiento

### Analítica y Tracking

- **Google Analytics**: Sistema de análisis de tráfico
  - ID configurable desde hoja CONFIGURACION (`GA_TRACKING_ID`)
  - Monitoreo de visitantes, sesiones y comportamiento
  - Análisis de dispositivos y ubicaciones
  - Páginas más visitadas y tiempo de permanencia
  - Actualización dinámica sin modificar código

### Componentes UI

- **Material Tailwind**: Componentes de diálogo avanzados
  - Modales personalizables
  - Diseño Material Design

### Herramientas de Desarrollo

- **Node.js + npm**: Gestión de dependencias y build
  - Scripts de compilación de Tailwind CSS
  - Dependencias: `tailwindcss`, `postcss`, `autoprefixer`

- **Git + GitHub**: Control de versiones y deployment
  - GitHub Pages para hosting gratuito
  - Workflow de desarrollo colaborativo

---

## Sistema de Personalización y Multilenguaje

### Personalización del Sitio

El sitio incluye un sistema completo de personalización que permite modificar elementos clave sin editar código:

**Hoja CONFIGURACION en Google Sheets:**
- Estructura especial: Filas 1-2 contienen instrucciones/agrupaciones, Fila 3 tiene los headers (CAMPO | TIPO | DESCRIPCIÓN | VALOR), Datos desde fila 4
- Campos configurables:

  **Información del Torneo:**
  - `TORNEO_NOMBRE`: Nombre del torneo
  - `TORNEO_ANIO`: Año escolar
  - `TORNEO_DESCRIPCION`: Descripción breve
  - `TORNEO_LOGO_URL`: URL de logo del torneo

  **Información del Colegio:**
  - `COLEGIO_NOMBRE`: Nombre completo del colegio
  - `COLEGIO_TELEFONO1`, `COLEGIO_TELEFONO2`: Teléfonos de contacto
  - `COLEGIO_EMAIL`: Email de contacto
  - `COLEGIO_DIRECCION`, `COLEGIO_LOCALIDAD`, `COLEGIO_PROVINCIA`: Dirección física
  - `COLEGIO_URL`: Sitio web del colegio (también se usa para construir rutas de favicons hardcodeados)
  - `COLEGIO_LOGO_URL`: URL del logo del colegio
  - `COLEGIO_MAPS_URL`: URL de Google Maps

  **Redes Sociales:**
  - `REDES_INSTAGRAM_URL`: URL de Instagram

  **Analítica:**
  - `GA_TRACKING_ID`: ID de Google Analytics (para tracking y análisis de visitas)

  **Widget de valoración:**
  - `FEEDBACK_SCRIPT_URL`: URL del Web App de Google Apps Script que recibe las valoraciones y las escribe en la hoja FEEDBACK (ver sección «Widget de valoración y hoja FEEDBACK»)

**Implementación:**

**Carga y parseo:**
- Función `loadConfig()` en `js/main.js` carga y parsea la hoja CONFIGURACION
- Parser especial `fetchCSV(URLS.CONFIGURACION, true)` maneja estructura con filas agrupadas
- Conversión a objeto plano `STATE.config` para acceso rápido
- Función `getConfigValue(key)` obtiene valores (case-insensitive)

**Aplicación al DOM:**
- Función `applyConfig()` busca elementos con atributo `data-config`
- Mapeo automático de configuración a elementos HTML:
  ```html
  <!-- Ejemplo de uso en HTML -->
  <img src="#" data-config="colegio-logo" alt="Logo">
  <a href="#" data-config="colegio-link">Sitio Web</a>
  <span data-config="torneo-nombre">Nombre del Torneo</span>
  ```
- Los valores se aplican automáticamente a:
  - Hero section (nombre y descripción del torneo)
  - Footer (información de contacto, redes sociales)
  - Header (logo del colegio, enlaces)
  - Meta tags (Open Graph, descripción, título)
  - Favicons (construidos desde `COLEGIO_URL` + rutas hardcodeadas en el código)
  - Google Analytics (tracking ID)

**Nota sobre Favicons:**
Los favicons NO son configurables como campos independientes. Se construyen automáticamente en el código JavaScript:
```javascript
// Desde COLEGIO_URL se construyen las rutas hardcodeadas:
{COLEGIO_URL}/wp-content/uploads/2023/03/cropped-favicon-32x32.png
{COLEGIO_URL}/wp-content/uploads/2023/03/cropped-favicon-192x192.png
{COLEGIO_URL}/wp-content/uploads/2023/03/cropped-favicon-180x180.png
```

### Sistema Multilenguaje

El sitio incluye soporte completo para español e inglés:

**Archivo `js/translations.js`:**
- Objeto `translations` con todas las traducciones (español e inglés)
- Variable `currentLanguage` que almacena el idioma actual
- Funciones:
  - `translate(key, params)`: Obtiene traducción con soporte para interpolación de parámetros
  - `changeLanguage(lang)`: Cambia el idioma del sitio
  - `setCurrentLanguage(lang)`: Establece el idioma y actualiza la página
  - `updateAllTranslations()`: Actualiza todos los textos traducibles en la página
- Arrays de meses y días traducibles (`mesesNombresES/EN`, `diasSemanaES/EN`)
- Funciones helper `getMesesNombres(lang)` y `getDiasSemana(lang)` exportables

**Atributos `data-translate`:**
- Todos los elementos traducibles tienen el atributo `data-translate="clave_traduccion"`
- El texto en español está como contenido por defecto del elemento HTML
- `updateAllTranslations()` actualiza dinámicamente el texto según el idioma seleccionado
- Funciona tanto para elementos estáticos (HTML) como dinámicos (generados por JavaScript)

**Selector de Idioma:**
- Botones ES/EN en el header
- Cambio dinámico sin recargar la página
- Detección automática del idioma del navegador al cargar
- Formateo de fechas según idioma seleccionado

**Separación Personalización-Traducciones:**
- **CONFIGURACION**: Valores personalizables específicos del torneo/colegio (NO se traducen)
- **TRADUCCIONES**: Textos de interfaz estándar que se traducen (títulos, botones, etiquetas)
- Sistemas completamente independientes

---

## Variables CSS Personalizadas y Sistema de Estilos

El sitio utiliza un sistema robusto de variables CSS definidas en `:root` para garantizar consistencia visual.

### Variables de Color

```css
--brand-red: #c62828
--brand-orange: #ff5722
--brand-gold: #e5af24
--brand-green: #2e7d32
--brand-blue: #1565c0
--brand-gray: #bababa
--brand-white: #ffffff
--bg-light: #f8f9fa
--bg-dark: #212529
```

### Variables de Sombras

```css
--shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.08)
--shadow-md: 0 4px 8px rgba(0, 0, 0, 0.12)
--shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.16)
```

### Variables de Efectos

```css
--transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)
--border-radius: 0px  /* Bordes cuadrados para diseño moderno */
```

### Tipografía Base

```css
:root {
    font-size: 16px;  /* Base fija para rem consistente en dev/producción */
}

*, ::before, ::after {
    font-family: 'LaLiga Text', 'Roboto', sans-serif;
    font-size: 1.125rem;  /* 18px - optimizado para legibilidad */
    letter-spacing: 0.1em;
    line-height: 1.1;
}
```

### Configuración Tailwind CSS Extendida

**Colores personalizados:**
- Sistema de colores de marca con variantes (`brand-red-100`, `brand-red-200`, etc.)
- 7 colores principales + variantes específicas

**Sombras personalizadas:**
- `brand-sm`: Sombra sutil para elementos elevados
- `brand-md`: Sombra media para cards y componentes
- `brand-lg`: Sombra grande para modales y overlays

**Border Radius:**
- `brand`: 0px (bordes cuadrados consistentes con el diseño)

**Breakpoints:**
- `desktopNav: 1135px`: Punto de corte específico para menú de navegación

**Font Size:**
- `text-md`: 1rem (equivalente a `text-base`, añadido para consistencia semántica)

### Beneficios del Sistema de Variables

1. **Consistencia visual**: Todos los colores y sombras se usan desde variables centralizadas
2. **Fácil personalización**: Cambiar un color de marca requiere modificar solo una variable
3. **Modo oscuro preparado**: Las variables facilitan implementar temas alternativos en el futuro
4. **Rendimiento**: Variables CSS nativas tienen mejor rendimiento que Sass/LESS
5. **Combinación perfecta**: Variables CSS + Tailwind CSS para máxima flexibilidad

---

## Estadísticas del Proyecto

### Líneas de Código

- **JavaScript**: ~5,872 líneas
  - `main.js`: 2,143 líneas
  - `ui.js`: 2,112 líneas
  - `translations.js`: 519 líneas
  - `accordion-init.js`: 313 líneas
  - `carousel.js`: 298 líneas
  - `carousel-init.js`: 256 líneas
  - `data.js`: 231 líneas

- **HTML**: ~588 líneas
  - Estructura semántica completa
  - Atributos dinámicos (`data-config`, `data-translate`)

- **CSS**: Archivo `styles.css` + `dist/output.css` compilado
  - Variables CSS personalizadas
  - Font-face declarations (6 fuentes LaLiga)
  - Estilos base y utilidades

### Archivos de Configuración

- `tailwind.config.js`: Configuración de Tailwind CSS
- `postcss.config.js`: Configuración de PostCSS
- `package.json`: Dependencias y scripts de build

### Recursos Multimedia

- **Fuentes**: 7 archivos de fuentes LaLiga (`.woff`, `.woff2`, `.otf`, `.eot`)
- **Imágenes locales**: Logo, patrones, podio, perfiles
- **Imágenes remotas**: Google Drive (logos de equipos, noticias, galería)

---

*Documento actualizado el 8 de febrero de 2026*  
