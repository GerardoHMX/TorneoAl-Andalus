# Resumen del Sitio Web - Torneo Al-Ándalus

## Objetivo del Sitio

El sitio web del **Torneo Escolar de Fútbol Sala Al-Ándalus** tiene como objetivo principal proporcionar una plataforma digital completa para gestionar y visualizar toda la información relacionada con el torneo deportivo del Colegio San Francisco de Asís. 

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
   - Presentación visual del torneo con el nombre "Al-Ándalus 2025-2026"
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

### 9. **Líderes Goleadores**
   - Ranking de los jugadores con más goles
   - Filtrado por ciclo educativo
   - Filtrado adicional por curso dentro de cada ciclo

### 10. **Sancionados**
    - Listado de jugadores sancionados
    - Información sobre el tipo de sanción y duración
    - Filtrado por ciclo y curso

### 11. **Resultados**
    - Historial completo de resultados de todos los partidos
    - Filtrado por ciclo educativo
    - Información detallada de cada encuentro

### 12. **Noticias**
    - Sección de noticias y actualizaciones del torneo
    - Navegación por fecha con botones anterior/siguiente
    - Visualización en formato de tarjetas con imágenes
    - Diálogo modal para ver noticias completas
    - **Imágenes**: Las imágenes se almacenan en Google Drive con acceso público y se referencian desde Google Sheets

### 13. **Galería**
    - Galería de imágenes del torneo
    - Navegación por fecha
    - Soporte para diferentes tipos de contenido multimedia
    - Visualización en grid responsive
    - **Imágenes**: Las imágenes se almacenan en Google Drive con acceso público y se referencian desde Google Sheets

### 14. **Footer**
    - Información de contacto del colegio
    - Enlaces a redes sociales
    - Créditos y licencia del proyecto

---

## Cómo Funciona Este Sitio

### Arquitectura Técnica

El sitio utiliza una arquitectura **SPA (Single Page Application)** con las siguientes características:

#### **Frontend**
- **HTML5**: Estructura semántica del sitio
- **CSS3**: Estilos personalizados con variables CSS y diseño responsive
- **Tailwind CSS**: Framework de utilidades para diseño rápido y consistente
- **Bootstrap 5**: Componentes UI (tabs, acordeón, modales)
- **JavaScript ES6+**: Lógica de aplicación con módulos ES6

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
- **Ventajas**: 
  - No requiere almacenamiento propio en el servidor
  - Fácil gestión y actualización de imágenes desde Google Drive
  - Escalable sin límites de almacenamiento del sitio web

#### 3. **Filtrado y Visualización**

- **Filtros dinámicos**: Los usuarios pueden filtrar contenido por ciclo (ESO/BCH), grupo (A/B/C/D), curso, etc.
- **Estado de la aplicación**: Se mantiene un objeto `STATE` que gestiona los filtros activos y los datos cargados
- **Renderizado condicional**: Las secciones se muestran u ocultan según la configuración en la hoja "OTROS"

#### 4. **Navegación Inteligente**

- **Navegación por fechas**: 
  - Próximos partidos: Busca automáticamente días laborales con partidos programados
  - Noticias: Navega por días con noticias publicadas
  - Galería: Navega por días con contenido publicado
  
- **Smooth Scroll**: Navegación suave entre secciones con offset para el header fijo

#### 5. **Responsive Design**

- **Mobile First**: Diseño optimizado primero para móviles
- **Breakpoints**: 
  - Móvil: < 768px (acordeón para bases, menú hamburguesa)
  - Tablet/Desktop: ≥ 768px (carrusel para bases, menú horizontal)
- **Adaptación de componentes**: Los componentes se adaptan según el tamaño de pantalla

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
- **Parsing CSV robusto**: Maneja comillas, saltos de línea y caracteres especiales en CSV
- **Gestión de errores**: Si una hoja falla al cargar, el sitio continúa funcionando con las demás
- **Optimización de rendimiento**: Uso de `requestAnimationFrame` para actualizaciones suaves del DOM
- **Google Analytics**: Sistema de tracking y análisis de visitas integrado
  - Monitoreo de tráfico, páginas más visitadas y comportamiento de usuarios
  - ID configurable desde la hoja CONFIGURACION (`GA_TRACKING_ID`)
  - Se actualiza dinámicamente sin necesidad de modificar código
- **Sistema multilenguaje**: Soporte completo para español e inglés
  - Traducciones almacenadas en objeto JavaScript (`js/translations.js`)
  - Cambio de idioma dinámico sin recargar la página
  - Formateo de fechas según idioma (meses y días de la semana traducidos)
  - Interpolación de parámetros en traducciones (`{group}`, `{cycle}`)
- **Personalización dinámica**: Configuración del sitio desde Google Sheets
  - Sin necesidad de modificar código para cambiar nombre del torneo, información del colegio, etc.
  - Actualización automática de meta tags, footer, header según configuración

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

1. **Sin Backend**: No requiere servidor propio, todo funciona desde GitHub Pages
2. **Fácil actualización**: Los administradores solo necesitan actualizar Google Sheets y subir imágenes a Google Drive
3. **Personalización sin código**: El sitio se puede personalizar completamente desde la hoja CONFIGURACION sin modificar código
4. **Multilenguaje integrado**: Soporte completo para múltiples idiomas con cambio dinámico
5. **Tiempo real**: Los datos se actualizan automáticamente cada 5 minutos
6. **Escalable**: Fácil agregar nuevas secciones o funcionalidades
7. **Mantenible**: Código modular y bien organizado con separación clara entre configuración y traducciones
8. **Accesible**: Funciona en cualquier dispositivo con navegador moderno
9. **Gestión de imágenes simplificada**: Las imágenes se gestionan desde Google Drive sin necesidad de servidor de archivos propio
10. **Sin límites de almacenamiento**: Google Drive proporciona almacenamiento ilimitado para las imágenes del proyecto
11. **Reutilizable**: El sitio puede reutilizarse para múltiples ciclos escolares solo actualizando Google Sheets

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

**Soluciones Propuestas:**

1. **Crear una guía visual paso a paso** con capturas de pantalla detalladas del proceso de subida y configuración de permisos **Implementado**
2. **Desarrollar un script de Google Apps Script** que automatice la configuración de permisos públicos al subir imágenes a una carpeta específica
3. **Implementar un formulario de Google Forms** que permita subir imágenes directamente y que automáticamente configure los permisos y genere el enlace
4. **Crear una interfaz web simple** (página HTML con JavaScript) que permita arrastrar y soltar imágenes y que automáticamente las suba a Drive y configure permisos mediante la API de Google Drive
5. **Usar un servicio alternativo** como Imgur, Cloudinary o un bucket de almacenamiento con interfaz más simple, aunque esto requeriría cambios en la arquitectura

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

**Soluciones Propuestas:**

1. **Crear un formulario de Google Forms** con campos de texto multilínea para cada campo de la noticia, que automáticamente formatee y agregue las comillas necesarias al insertar en Sheets
2. **Desarrollar una aplicación web simple** (interfaz de administración) con un editor de texto enriquecido (WYSIWYG) que permita escribir noticias con formato y que automáticamente las publique en Google Sheets con el formato correcto
3. **Usar Google Apps Script** para crear un editor personalizado dentro de Google Sheets que muestre un diálogo con campos de texto más grandes y formato
4. **Implementar validación automática** en Google Sheets mediante fórmulas o scripts que verifiquen que el contenido tenga las comillas correctas antes de guardar
5. **Modificar el parser CSV** del sitio para que sea más tolerante y maneje texto sin comillas o con comillas mal colocadas
6. **Usar Google Docs** como editor y sincronizar automáticamente con Sheets mediante Apps Script

### 3. **Riesgo de Modificación Accidental de Datos**

**Limitación:**
- Los usuarios con acceso de edición a Google Sheets pueden mover, eliminar o modificar accidentalmente datos críticos o secciones completas
- No hay protección contra cambios accidentales en la estructura de las hojas
- Un error puede afectar múltiples secciones del sitio simultáneamente
- No hay sistema de versionado o historial fácil de restaurar

**Impacto:**
- Pérdida de datos o corrupción de información
- Sitio web roto o con información incorrecta
- Necesidad de restaurar desde backups manuales
- Pérdida de tiempo y confianza en el sistema

**Soluciones Propuestas:**

1. **Implementar protección de rangos en Google Sheets:**
   - Proteger las filas de encabezado (columnas, estructura)
   - Proteger columnas críticas (IDs, fechas, referencias)
   - Permitir edición solo en rangos específicos de datos

2. **Crear hojas de cálculo separadas por nivel de riesgo:**
   - **Hoja de solo lectura**: Estructura, configuración (OTROS)
   - **Hoja de edición controlada**: Datos principales (CLASIFICACION, EQUIPOS)
   - **Hoja de edición libre**: Contenido dinámico (NOTICIAS, GALERIA)

3. **Implementar validación de datos:**
   - Usar validación de datos de Google Sheets para campos críticos
   - Crear reglas que prevengan valores inválidos
   - Validar formatos de fechas, URLs, números

4. **Configurar permisos granulares:**
   - Crear diferentes niveles de acceso (lectura, edición limitada, administrador)
   - Asignar permisos específicos por hoja según el rol del usuario
   - Usar grupos de Google Workspace para gestionar permisos

5. **Implementar sistema de backups automáticos:**
   - Usar Google Apps Script para crear backups diarios automáticos
   - Guardar versiones en una carpeta de Google Drive separada
   - Crear un script que permita restaurar versiones anteriores fácilmente

6. **Agregar validación en el frontend:**
   - Verificar la estructura de datos antes de renderizar
   - Mostrar mensajes de error claros si faltan datos críticos
   - Implementar un modo de "modo seguro" que use datos en caché si detecta errores

7. **Crear una interfaz de administración protegida:**
   - Desarrollar una aplicación web que actúe como intermediario
   - Validar todos los cambios antes de aplicarlos a Sheets
   - Mantener un log de cambios y quién los hizo
   - Requerir confirmación para operaciones destructivas

8. **Documentar procedimientos de recuperación:**
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

## Tecnologías Utilizadas

- **HTML5**: Estructura
- **CSS3**: Estilos personalizados
- **Tailwind CSS 3.4.17**: Framework de utilidades
- **Bootstrap 5.3.0**: Componentes UI
- **JavaScript ES6+**: Lógica de aplicación con módulos ES6
- **Google Sheets API (CSV)**: Fuente de datos y referencias de imágenes
- **Google Drive**: Almacenamiento de imágenes con acceso público
- **Material Tailwind**: Componentes de diálogo
- **Google Fonts**: Tipografías (Pattaya, Roboto)
- **Google Analytics**: Sistema de tracking y análisis de visitas
  - Implementado para monitorear el tráfico del sitio
  - ID configurable desde la hoja CONFIGURACION (`GA_TRACKING_ID`)
  - Permite analizar comportamiento de usuarios, páginas más visitadas, y métricas de uso
  - Se actualiza dinámicamente sin necesidad de modificar código

---

## Sistema de Personalización y Multilenguaje

### Personalización del Sitio

El sitio incluye un sistema completo de personalización que permite modificar elementos clave sin editar código:

**Hoja CONFIGURACION en Google Sheets:**
- Estructura especial: Filas 1-2 contienen instrucciones/agrupaciones, Fila 3 tiene los headers (CAMPO | TIPO | DESCRIPCIÓN | VALOR), Datos desde fila 4
- Campos configurables:
  - `TORNEO_NOMBRE`: Nombre del torneo
  - `TORNEO_ANIO`: Año escolar
  - `TORNEO_DESCRIPCION`: Descripción breve
  - `COLEGIO_NOMBRE`: Nombre completo del colegio
  - `COLEGIO_TELEFONO1`, `COLEGIO_TELEFONO2`: Teléfonos de contacto
  - `COLEGIO_EMAIL`: Email de contacto
  - `COLEGIO_DIRECCION`, `COLEGIO_LOCALIDAD`, `COLEGIO_PROVINCIA`: Dirección física
  - `COLEGIO_URL`: Sitio web del colegio
  - `COLEGIO_LOGO_URL`: URL del logo del colegio
  - `REDES_INSTAGRAM_URL`: URL de Instagram
  - `GA_TRACKING_ID`: ID de Google Analytics (para tracking y análisis de visitas)

**Implementación:**
- Función `loadConfig()` en `js/main.js` carga y parsea la hoja CONFIGURACION
- Función `getConfigValue(key)` obtiene valores de configuración
- Función `applyConfig()` actualiza elementos del DOM con atributos `data-config`
- Los valores se aplican automáticamente a hero section, footer, header, meta tags

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

*Documento generado el 24 de enero de 2026*  
*Última actualización: 25 de enero de 2026 - Sistema de personalización y multilenguaje implementado*
