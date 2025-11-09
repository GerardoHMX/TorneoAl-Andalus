// --- carousel.js ---
// Funcionalidad del carrusel de cards

/**
 * Inicializa el carrusel con las cards proporcionadas
 * @param {Array} cards - Array de objetos con propiedades: { title, text, image?, bgColor?, textColor? }
 */
export function initCarousel(cards = []) {
    const carouselContainer = document.getElementById('carousel-container');
    const carouselTrack = document.getElementById('carousel-track');
    const prevButton = document.getElementById('carousel-prev');
    const nextButton = document.getElementById('carousel-next');
    const indicatorsContainer = document.getElementById('carousel-indicators');

    if (!carouselContainer || !carouselTrack) return;

    let currentIndex = 0;
    const totalCards = cards.length;

    // Si no hay cards, usar datos de ejemplo
    const carouselCards = cards.length > 0 ? cards : getDefaultCards();

    // Obtener número de cards visibles según el tamaño de pantalla
    function getVisibleCardsCount() {
        const width = window.innerWidth;
        if (width >= 1024) return 3; // lg: 3 cards
        if (width >= 768) return 2;   // md: 2 cards
        return 1;                      // sm: 1 card
    }

    // Renderizar cards
    function renderCards() {
        carouselTrack.innerHTML = '';
        carouselCards.forEach((card, index) => {
            const cardElement = createCardElement(card, index);
            carouselTrack.appendChild(cardElement);
        });
    }

    // Crear elemento de card
    function createCardElement(card, index) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'carousel-card flex-shrink-0 w-full md:w-1/2 lg:w-1/3 px-4';
        cardDiv.setAttribute('data-index', index);

        const bgColor = card.bgColor || 'bg-brand-blue';
        const textColor = card.textColor || 'text-white';

        let imageHTML = '';
        if (card.image) {
            imageHTML = `
                <div class="w-full h-48 overflow-hidden rounded-t-lg">
                    <img src="${card.image}" alt="${card.title || ''}" class="w-full h-full object-cover">
                </div>
            `;
        }

        cardDiv.innerHTML = `
            <div class="${bgColor} ${textColor} rounded-brand shadow-brand-lg overflow-hidden h-full flex flex-col">
                ${imageHTML}
                <div class="p-8 flex-1 flex flex-col justify-center">
                    <div class="text-center">
                        ${card.title ? `<h3 class="text-2xl font-bold mb-3">${card.title}</h3>` : ''}
                    </div>
                    <div>
                        ${card.text ? `<p class="text-base leading-relaxed">${card.text}</p>` : ''}
                    </div>
                </div>
            </div>
        `;

        return cardDiv;
    }

    // Renderizar indicadores
    function renderIndicators() {
        if (!indicatorsContainer) return;
        
        indicatorsContainer.innerHTML = '';
        carouselCards.forEach((_, index) => {
            const indicator = document.createElement('button');
            indicator.className = `carousel-indicator w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-brand-blue w-8' : 'bg-gray-300 hover:bg-gray-400'
            }`;
            indicator.setAttribute('aria-label', `Ir a slide ${index + 1}`);
            indicator.addEventListener('click', () => goToSlide(index));
            indicatorsContainer.appendChild(indicator);
        });
    }

    // Ir a slide específico (con soporte infinito)
    function goToSlide(index) {
        // Hacer el carrusel infinito: si el índice es negativo, ir al último
        // Si es mayor que el total, volver al primero
        if (index < 0) {
            currentIndex = carouselCards.length - 1;
        } else if (index >= carouselCards.length) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }
        updateCarousel();
    }

    // Actualizar carrusel
    function updateCarousel() {
        const visibleCards = getVisibleCardsCount();
        // Calcular el desplazamiento basado en el número de cards visibles
        // En móvil: 100% por card, en tablet: 50% por card, en desktop: 33.33% por card
        const cardWidth = 100 / visibleCards;
        const offset = -currentIndex * cardWidth;
        carouselTrack.style.transform = `translateX(${offset}%)`;

        // Actualizar indicadores
        if (indicatorsContainer) {
            const indicators = indicatorsContainer.querySelectorAll('.carousel-indicator');
            indicators.forEach((indicator, index) => {
                if (index === currentIndex) {
                    indicator.classList.remove('bg-gray-300', 'w-3');
                    indicator.classList.add('bg-brand-blue', 'w-8');
                } else {
                    indicator.classList.remove('bg-brand-blue', 'w-8');
                    indicator.classList.add('bg-gray-300', 'w-3');
                }
            });
        }

        // Actualizar botones (nunca se deshabilitan en modo infinito)
        if (prevButton) {
            prevButton.disabled = false;
            prevButton.classList.remove('opacity-50', 'cursor-not-allowed');
        }

        if (nextButton) {
            nextButton.disabled = false;
            nextButton.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    }

    // Navegación anterior (infinito: si está en el primero, va al último)
    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    // Navegación siguiente (infinito: si está en el último, va al primero)
    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    // Auto-play opcional (comentado por defecto)
    let autoPlayInterval = null;
    function startAutoPlay(interval = 5000) {
        stopAutoPlay();
        autoPlayInterval = setInterval(() => {
            // En modo infinito, siempre puede avanzar
            nextSlide();
        }, interval);
    }

    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    }

    // Event listeners
    if (prevButton) {
        prevButton.addEventListener('click', prevSlide);
    }

    if (nextButton) {
        nextButton.addEventListener('click', nextSlide);
    }

    // Pausar auto-play al hacer hover
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopAutoPlay);
        carouselContainer.addEventListener('mouseleave', () => {
            // Descomentar para activar auto-play
            // startAutoPlay();
        });
    }

    // Navegación con teclado
    document.addEventListener('keydown', (e) => {
        if (carouselContainer.contains(document.activeElement) || 
            document.activeElement === prevButton || 
            document.activeElement === nextButton) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevSlide();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextSlide();
            }
        }
    });

    // Inicializar
    renderCards();
    renderIndicators();
    updateCarousel();

    // Manejar redimensionamiento de ventana
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateCarousel();
        }, 250);
    });

    // Retornar funciones públicas si es necesario
    return {
        goToSlide,
        nextSlide,
        prevSlide,
        startAutoPlay,
        stopAutoPlay
    };
}

/**
 * Cards por defecto si no se proporcionan datos
 */
function getDefaultCards() {
    return [
        {
            title: 'Bienvenidos al Torneo',
            text: 'Participa en la competición más emocionante del año. Demuestra tu talento y espíritu deportivo.',
            bgColor: 'bg-brand-blue',
            textColor: 'text-white'
        },
        {
            title: 'Fair Play',
            text: 'El respeto y la deportividad son valores fundamentales en nuestro torneo. Juega limpio y disfruta.',
            bgColor: 'bg-brand-green',
            textColor: 'text-white'
        },
        {
            title: 'Premios y Reconocimientos',
            text: 'Los mejores equipos y jugadores serán reconocidos con trofeos y medallas especiales.',
            bgColor: 'bg-brand-gold',
            textColor: 'text-brand-text-dark'
        },
        {
            title: 'Comunidad Deportiva',
            text: 'Únete a una comunidad que valora el deporte, la amistad y el compañerismo.',
            bgColor: 'bg-brand-red',
            textColor: 'text-white'
        }
    ];
}

