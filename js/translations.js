// Sistema de traducciones para el sitio Torneo Al-Ándalus
// Soporta español (es) e inglés (en)

// Idioma actual (se inicializa según el idioma del navegador)
export let currentLanguage = "es";

// Arrays de meses en español
const mesesNombresES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
                         "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

// Arrays de meses en inglés
const mesesNombresEN = ["January", "February", "March", "April", "May", "June", 
                        "July", "August", "September", "October", "November", "December"];

// Arrays de días en español
const diasSemanaES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

// Arrays de días en inglés
const diasSemanaEN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Función helper para obtener array de meses según idioma
function getMesesNombres(lang = currentLanguage) {
    return lang === 'en' ? mesesNombresEN : mesesNombresES;
}

// Función helper para obtener array de días según idioma
function getDiasSemana(lang = currentLanguage) {
    return lang === 'en' ? diasSemanaEN : diasSemanaES;
}

// Objeto con todas las traducciones
const translations = {
  es: {
    // Hero Section
    hero_title: "TORNEO DE FÚTBOL SALA",
    hero_subtitle: "Competición escolar que promueve...",

     // Menú
     inicio: "Inicio",
     equipos: "Equipos",
     jornadas: "Jornadas",
     clasificacion: "Clasificación",
     semifinalESO: "Semifinal ESO",
     tercerFinalPuestoESO: "Tercer Final Puesto ESO",
     semifinalBCH: "Semifinal BCH",
     tercerFinalPuestoBCH: "Tercer Final Puesto BCH",
     clasificacionGrupal: "Clasificación",
     bracket: "Bracket",
     goleadoresSection: "Líderes",
     sancionadosSection: "Sancionados",
     lideresESO: "Líderes ESO",
     lideresBCH: "Líderes BCH",
     resultadosSection: "Resultados",
     noticiasSection: "Noticias",
     proximosPartidos: "Próximos Partidos",
     carouselSection: "Carousel",
     accordionSection: "Accordion",
     galeriaSection: "Galería",
    
    // Títulos de Secciones
    section_bases_title: "Bases del Torneo",
    section_podium_title: "Podio",
    section_next_matches_title: "Próximos Partidos",
    section_teams_title: "Equipos participantes",
    section_journeys_title: "Jornadas",
    section_classification_title: "Clasificación",
    section_group_classification_title: "Clasificación",
    section_bracket_title: "Bracket",
    section_top_scorers_title: "Líderes Goleadores",
    section_sanctioned_title: "Sancionados",
    section_results_title: "Resultados",
    section_news_title: "Noticias",
    section_gallery_title: "Galería",
    
    // Filtros
    course: "Curso:",
    filter_all: "TODOS",
    filter_eso: "ESO",
    filter_bch: "BCH",

    // Grupos
    group: "Grupo",    
    team_participant_description: "Equipo participante",

    // Partidos
    match_date: "Fecha",
    match_time: "Hora",
    match_phase: "Fase",
    match_group: "Grupo",
    match_local: "Local",
    match_visitor: "Visitante",
    match_score: "Resultado",
    match_result: "Resultado",
    match_status: "Estado",
    match_status_jugado: "Jugado",
    match_status_pendiente: "Pendiente",
    match_status_cancelado: "Cancelado",

    table_position_description: "Posición",
    table_played_description: "Partidos Jugados",
    table_points_description: "Puntos",
    table_won_description: "Partidos Ganados",
    table_drawn_description: "Partidos Empatados",
    table_lost_description: "Partidos Perdidos",
    table_goals_for_description: "Goles a Favor",
    table_goals_against_description: "Goles en Contra",
    table_goals_diff_description: "Diferencia de Goles",
    table_fair_play_description: "Juego limpio",

    quarter_finals: "Cuartos de Final",
    semifinals: "Semifinales",
    final: "Final",
    third_and_fourth_place: "Tercer Puesto",
    
    table_no_sanctions: "No hay sanciones registradas para este curso.",
    table_no_sanctions_play_clean: "Todo en orden, ningún jugador ha sido sancionado hasta el momento.",
    table_no_sanctions_no_sanctions: "No hay sanciones registradas para este curso.",

    table_no_scorers: "No hay goleadores registrados para este curso.",
    table_no_sanctions_description_eso: "Parece que el juego limpio va ganando, no hay sanciones registradas.",
    table_no_sanctions_play_clean: "Todo en orden, ningún jugador ha sido sancionado hasta el momento.",
    table_no_sanctions: "No hay sanciones registradas para este curso.",

    msg_no_classification_data: "No hay datos de clasificación disponibles",
    msg_no_matches: "No hay partidos programados para los próximos días.",
    msg_no_matches_description: "Los partidos se mostrarán automáticamente cuando estén programados.",
    msg_no_gallery_description: "La galería estará disponible pronto con imágenes y videos del torneo.",
    msg_no_news_description: "Las noticias estarán disponibles pronto con las últimas noticias del torneo.",
    msg_read_more: "Continuar leyendo →",

    hour_to_confirm: "Hora por confirmar",
    to_define: "Por definir",

    feedback_title: "¿Cómo fue tu experiencia?",
    feedback_rating: "Valoración",
    feedback_comment: "Comentario (opcional)",
    feedback_submit: "Enviar",
    feedback_submit_sent: "Enviado",
    feedback_comment_placeholder: "Escribe aquí…",
    feedback_submit_placeholder: "Enviar",
    feedback_message_rating: "Elige una valoración.",
    feedback_message_error_server: "La valoración no está conectada al servidor. Gracias por tu intención.",
    feedback_message_success: "¡Gracias por tu valoración!",

    // Navegación
    noticia: "Noticia",
    close: "Cerrar",
    nav_previous: "Anterior",
    nav_next: "Siguiente",
    nav_loading: "Cargando...",

    primer_puesto: "Primer puesto",
    segundo_puesto: "Segundo puesto",
    tercer_puesto: "Tercer puesto",
    goles_description: "Goles",

    // Encabezados de Tablas
    table_team: "Equipo",
    table_points: "PTS",
    table_played: "PJ",
    table_won: "PG",
    table_drawn: "PE",
    table_lost: "PP",
    table_goals_diff: "DG",
    table_goals_for: "GF",
    table_fair_play: "FPY",
    table_goals_against: "GC",
    table_position: "Pos",
    table_player: "Jugador",
    table_goals: "Goles",
    table_course: "Curso",
    table_red_cards: "Rojas",
    table_yellow_cards: "Amarillas",
    table_suspended: "Suspendidas",
    table_sanction_type: "Tipo",
    table_sanction_duration: "Duración",
    table_local: "Local",
    table_visitor: "Visitante",
    table_score: "Resultado",
    table_date: "Fecha",
    table_time: "Hora",
    table_phase: "Fase",
    table_group_phase: "Fase de Grupos",
    table_semifinals: "Semifinales",
    table_third_fourth: "Tercer y Cuarto Puesto",
    table_final: "Final",
    table_ciclo: "Ciclo",
    table_team_name: "Equipo",

    table_no_scorers: "No hay goleadores registrados para este curso.",
    table_no_scorers_yet: "Aún no hay partidos jugados, pronto conoceremos a los primeros líderes de goleo.",
    table_no_scorers_registered_yet: "Todavía no se registran partidos. ¡Los goleadores aparecerán en cuanto ruede el balón!",
    table_no_scorers_registered: "No hay goleadores registrados para este curso.",

    // Mensajes del Sistema
    msg_no_data: "No hay datos disponibles",
    msg_no_matches: "No hay partidos programados",
    msg_no_news: "No hay noticias disponibles",
    msg_no_gallery: "No hay imágenes en la galería",
    msg_loading_error: "Error al cargar los datos",
    
    // Footer
    footer_tournament_title: "Torneo escolar de Fútbol Sala",
    footer_made_by: "Realizado por",
    footer_license: "bajo licencia"
  },
  en: {
    // Hero Section
    hero_title: "FOOTBALL TOURNAMENT",
    hero_subtitle: "School competition that promotes...",

    // Menú
    inicio: "Home",
    equipos: "Teams",
    jornadas: "Matchdays",
    clasificacion: "Classification",
    semifinalESO: "Semifinal ESO",
    tercerFinalPuestoESO: "Third Final Place ESO",
    semifinalBCH: "Semifinal BCH",
    tercerFinalPuestoBCH: "Third Final Place BCH",
    clasificacionGrupal: "Classification",
    bracket: "Bracket",
    goleadoresSection: "Scorers",
    sancionadosSection: "Sanctioned",
    lideresESO: "Top Scorers ESO",
    lideresBCH: "Top Scorers BCH",
    resultadosSection: "Results",
    noticiasSection: "News",
    proximosPartidos: "Upcoming Matches",
    carouselSection: "Carousel",
    accordionSection: "Accordion",
    galeriaSection: "Galería",
    
    // Títulos de Secciones
    section_bases_title: "Tournament Rules",
    section_podium_title: "Podium",
    section_next_matches_title: "Upcoming Matches",
    section_teams_title: "Participating Teams",
    section_journeys_title: "Matchdays",
    section_classification_title: "Group Classification",
    section_group_classification_title: "Group Classification",
    section_bracket_title: "Bracket",
    section_top_scorers_title: "Scorers",
    section_sanctioned_title: "Sanctioned Players",
    section_results_title: "Results",
    section_news_title: "News",
    section_gallery_title: "Gallery",
    
    // Filtros
    course: "Course:",
    filter_all: "ALL",
    filter_eso: "ESO",
    filter_bch: "BCH",

    // Grupos
    group: "Group",
    team_participant_description: "Team participating", 

    // Partidos
    match_date: "Date",
    match_time: "Time",
    match_phase: "Phase",
    match_group: "Group",
    match_local: "Local",
    match_visitor: "Visitor",
    match_score: "Score",
    match_result: "Result",
    match_status: "Status",
    match_status_jugado: "Played",
    match_status_pendiente: "Pending",
    match_status_cancelado: "Cancelled",

    table_position_description: "Position",
    table_played_description: "Played",
    table_points_description: "Points",
    table_won_description: "Won",
    table_drawn_description: "Drawn",
    table_lost_description: "Lost",
    table_goals_for_description: "Goals for",
    table_goals_against_description: "Goals against",
    table_goals_diff_description: "Goal difference",
    table_fair_play_description: "Fair play",

    quarter_finals: "Quarterfinals",
    semifinals: "Semifinals",
    final: "Final",
    third_and_fourth_place: "Third Place",

    table_no_sanctions: "No sanctions registered for this course.",
    table_no_sanctions_play_clean: "All in order, no player has been sanctioned yet.",
    table_no_sanctions_no_sanctions: "No sanctions registered for this course.",

    msg_no_classification_data: "No classification data available",
    msg_no_matches: "No matches scheduled",
    msg_no_matches_description: "Matches will be displayed automatically when scheduled.",
    msg_no_gallery_description: "The gallery will be available soon with images and videos of the tournament.",
    msg_no_news_description: "The news will be available soon with the latest news of the tournament.",
    msg_read_more: "Read more →",

    hour_to_confirm: "Hour to confirm",
    to_define: "To define",

    feedback_title: "How was your experience?",
    feedback_rating: "Rating",
    feedback_comment: "Comment (optional)",
    feedback_submit: "Submit",
    feedback_submit_sent: "Sent",
    feedback_comment_placeholder: "Write here…",
    feedback_submit_placeholder: "Submit",
    feedback_message_rating: "Choose a rating.",
    feedback_message_error_server: "The rating is not connected to the server. Thank you for your intention.",
    feedback_message_success: "Thank you for your rating!",

    // Navegación
    noticia: "News",
    nav_previous: "Previous",
    nav_next: "Next",
    nav_loading: "Loading...",

    primer_puesto: "First place",
    segundo_puesto: "Second place",
    tercer_puesto: "Third place",
    goles_description: "Goals",
    
    // Encabezados de Tablas
    table_team: "Team",
    table_points: "PTS",
    table_played: "MP",
    table_won: "W",
    table_drawn: "D",
    table_lost: "L",
    table_goals_diff: "GD",
    table_goals_for: "GF",
    table_fair_play:"FPY",
    table_goals_against: "GA",
    table_position: "Pos",
    table_player: "Player",
    table_goals: "Goals",
    table_course: "Course",
    table_red_cards: "Red Cards",
    table_yellow_cards: "Yellow Cards",
    table_suspended: "Suspended",
    table_sanction_type: "Type",
    table_sanction_duration: "Duration",
    table_local: "Home",
    table_visitor: "Away",
    table_score: "Score",
    table_date: "Date",
    table_time: "Time",
    table_phase: "Phase",
    table_group_phase: "Group Phase",
    table_semifinals: "Semifinals",
    table_third_fourth: "Third and Fourth Place",
    table_final: "Final",
    table_ciclo: "Cycle",
    table_team_name: "Team",
    table_no_scorers: "No scorers registered for this course.",
    table_no_scorers_yet: "No matches played yet, soon we will know the first goal scorers.",
    table_no_scorers_registered_yet: "No matches registered yet. The goal scorers will appear as soon as the ball rolls.",
    table_no_scorers_registered: "No scorers registered for this course.",

    // Mensajes del Sistema
    msg_no_data: "No data available",
    msg_no_matches: "No matches scheduled",
    msg_no_news: "No news available",
    msg_no_gallery: "No images in gallery",
    msg_loading_error: "Error loading data",
    
    // Footer
    footer_tournament_title: "School Football Tournament",
    footer_made_by: "Made by",
    footer_license: "is licensed under"
  }
};

// Función para obtener traducción
export function translate(key, params = {}) {
  let text = translations[currentLanguage]?.[key] || 
             translations["es"]?.[key] || 
             key;
  
  // Interpolar parámetros si existen (ej: {group}, {cycle})
  if (params && typeof text === 'string') {
    Object.keys(params).forEach(param => {
      text = text.replace(new RegExp(`\\{${param}\\}`, 'g'), params[param]);
    });
  }
  
  return text;
}

// Función para cambiar idioma
export function changeLanguage(lang) {
  if (lang !== 'es' && lang !== 'en') {
    console.warn(`Idioma no soportado: ${lang}. Usando español por defecto.`);
    lang = 'es';
  }
  currentLanguage = lang;
  setCurrentLanguage(lang);
}

// Función para establecer idioma
export function setCurrentLanguage(lang) {
  if (lang !== 'es' && lang !== 'en') {
    console.warn(`Idioma no soportado: ${lang}. Usando español por defecto.`);
    lang = 'es';
  }
  currentLanguage = lang;
  document.documentElement.lang = lang;
  // Actualizar todos los textos en la página
  updateAllTranslations();
}

// Función para actualizar todos los textos traducidos en la página
export function updateAllTranslations() {
  
  document.querySelectorAll('[data-translate]').forEach(el => {
    const key = el.getAttribute('data-translate');
    const translatedText = translate(key);
    if (translatedText) {
      el.textContent = translatedText;
    }
    // Si retorna null/undefined, el texto original en español se mantiene
  });

  document.documentElement.lang = currentLanguage;
  
  document.querySelectorAll('[data-translate-placeholder]').forEach(el => {
    const key = el.getAttribute('data-translate-placeholder');
    const translatedText = translate(key);
    if (translatedText) {
      el.placeholder = translatedText;
    }
  });

  document.querySelectorAll('[data-translate-title]').forEach(el => {
    const key = el.getAttribute('data-translate-title');
    const translatedText = translate(key);
    if (translatedText) {
      el.title = translatedText;
    }
  });

  document.querySelectorAll('[data-translate-aria-label]').forEach(el => {
    const key = el.getAttribute('data-translate-aria-label');
    const translatedText = translate(key);
    if (translatedText) {
      el.setAttribute('aria-label', translatedText);
    }
  });

  // Actualizar elementos con fechas formateadas (meses y días de la semana)
  document.querySelectorAll('[data-date]').forEach(el => {
    const fechaKey = el.getAttribute('data-date');
    if (!fechaKey) return;
    
    try {
      const [dia, mes, anio] = fechaKey.split('-').map(Number);
      
      // Validar valores
      if (isNaN(mes) || isNaN(dia) || mes < 1 || mes > 12) {
        console.warn('Fecha inválida:', fechaKey);
        return;
      }
      
      const mesesNombres = getMesesNombres();
      const mesNombre = mesesNombres[mes - 1] || mes;
      const diaFormateado = String(dia).padStart(2, '0');
      const fechaFormateada = `${diaFormateado} ${mesNombre}`;

      // Obtener día de la semana
      const fecha = new Date(anio, mes - 1, dia);
      if (isNaN(fecha.getTime())) {
        console.warn('Fecha inválida para crear objeto Date:', anio, mes, dia);
        return;
      }
      
      const diasSemana = getDiasSemana();
      const diaSemana = diasSemana[fecha.getDay()] || 'Desconocido';
      
      // Actualizar el texto del elemento, preservando el SVG si existe
      const svg = el.querySelector('svg');
      const nuevoTexto = `${diaSemana} ${fechaFormateada}`;
      
      if (svg) {
        // Buscar el nodo de texto después del SVG
        const childNodes = Array.from(el.childNodes);
        const svgIndex = childNodes.indexOf(svg);
        
        // Buscar el siguiente nodo de texto después del SVG
        let textNodeAfterSvg = null;
        for (let i = svgIndex + 1; i < childNodes.length; i++) {
          if (childNodes[i].nodeType === Node.TEXT_NODE && childNodes[i].textContent.trim()) {
            textNodeAfterSvg = childNodes[i];
            break;
          }
        }
        
        if (textNodeAfterSvg) {
          // Actualizar el nodo de texto existente (preservar espacios iniciales si existen)
          const textoActual = textNodeAfterSvg.textContent;
          const tieneEspacioInicial = textoActual.startsWith(' ');
          textNodeAfterSvg.textContent = tieneEspacioInicial ? ` ${nuevoTexto}` : nuevoTexto;
        } else {
          // Si no hay nodo de texto después del SVG, crear uno nuevo con espacio inicial
          el.insertBefore(document.createTextNode(` ${nuevoTexto}`), svg.nextSibling);
        }
      } else {
        // Si no tiene SVG, actualizar todo el contenido de texto
        el.textContent = nuevoTexto;
      }
    } catch (error) {
      console.error('Error al actualizar fecha:', fechaKey, error);
    }
  });
}

// Inicializar idioma al cargar
document.addEventListener('DOMContentLoaded', () => {
  // Detectar idioma del navegador o usar español por defecto
  const browserLang = navigator.language || navigator.userLanguage;
  const defaultLang = browserLang.startsWith('en') ? 'en' : 'es';
  setCurrentLanguage(defaultLang);
  
  // Añadir event listeners para el selector de idioma
  document.querySelectorAll('[data-lang]').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const lang = button.getAttribute('data-lang');
      changeLanguage(lang);
      
      // Actualizar estado visual de los botones
      document.querySelectorAll('[data-lang]').forEach(btn => {
        btn.classList.remove('active', 'bg-brand-blue', 'text-white');
        btn.classList.add('text-gray-600');
      });
      button.classList.add('active', 'bg-brand-blue', 'text-white');
      button.classList.remove('text-gray-600');
    });
  });
});
