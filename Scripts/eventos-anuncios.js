document.addEventListener('DOMContentLoaded', () => {
    const novedadesGrid = document.querySelector('#novedades .grid-container');
    const eventosGrid = document.querySelector('#eventos .grid-container');

    const novedadesFilters = document.querySelectorAll('#novedades .filter-btn');
    const eventosFilters = document.querySelectorAll('#eventos .filter-btn');

    // Cargar eventos y anuncios desde localStorage
    // Esta línea es la clave: lee directamente de 'fiscalproEvents'
    let allEventsAndAnnouncements = JSON.parse(localStorage.getItem('fiscalproEvents')) || [];

    // Función para renderizar las tarjetas en la página
    function renderContent(filterType = 'all', filterCategory = null) {
        novedadesGrid.innerHTML = ''; // Limpiar grids antes de renderizar
        eventosGrid.innerHTML = '';

        const novedadesItems = [];
        const eventosItems = [];

        // Filtrar y separar por tipo (anuncios/novedades y eventos)
        allEventsAndAnnouncements.forEach(item => {
            // Solo mostrar elementos "Activos"
            if (item.status === 'Activo') {
                if (item.type === 'Anuncio' || item.type === 'Novedad') {
                    novedadesItems.push(item);
                } else if (['Webinar', 'Seminario', 'Taller', 'Conferencia'].includes(item.type)) {
                    eventosItems.push(item);
                }
            }
        });

        // Ordenar: Novedades por fecha descendente, Eventos por fecha ascendente (próximos primero)
        novedadesItems.sort((a, b) => new Date(b.date) - new Date(a.date));
        eventosItems.sort((a, b) => new Date(a.date) - new Date(b.date));


        // Renderizar Novedades
        const filteredNovedades = novedadesItems.filter(item => {
            if (filterType === 'all' || filterType === 'Novedades') {
                if (filterCategory && filterCategory !== 'all') {
                    // Si tienes una lógica para categorías de novedades, va aquí.
                    // Por ejemplo: return item.category === filterCategory;
                    return true;
                }
                return true;
            }
            return false;
        });

        if (filteredNovedades.length === 0) {
            novedadesGrid.innerHTML = `
                <div class="no-items-message">
                    <i class="fas fa-box-open"></i>
                    <p>No hay novedades o anuncios disponibles en este momento.</p>
                </div>`;
        } else {
            filteredNovedades.forEach(item => {
                const card = document.createElement('div');
                card.classList.add('news-card');
                card.dataset.type = item.type;
                card.innerHTML = `
                    ${item.image ? `<img src="${item.image}" alt="${item.title}" class="news-image">` : ''}
                    <div class="news-content">
                        <span class="news-meta">
                            <i class="fas fa-calendar-alt"></i> ${item.date} 
                            ${item.time ? `<i class="fas fa-clock"></i> ${item.time}` : ''}
                            <i class="fas fa-tag"></i> ${item.type}
                        </span>
                        <h3>${item.title}</h3>
                        <p>${item.description}</p>
                        <a href="${item.url}" class="read-more-btn" target="_blank">Más Información <i class="fas fa-arrow-right"></i></a>
                    </div>
                `;
                novedadesGrid.appendChild(card);
            });
        }

        // Renderizar Eventos
        const filteredEventos = eventosItems.filter(item => {
            if (filterType === 'all' || filterType === 'Eventos') {
                if (filterCategory && filterCategory !== 'all') {
                    return item.type === filterCategory;
                }
                return true;
            }
            return false;
        });

        if (filteredEventos.length === 0) {
            eventosGrid.innerHTML = `
                <div class="no-items-message">
                    <i class="fas fa-calendar-times"></i>
                    <p>No hay próximos eventos o seminarios programados.</p>
                </div>`;
        } else {
            filteredEventos.forEach(item => {
                const card = document.createElement('div');
                card.classList.add('event-card');
                card.dataset.type = item.type;
                card.innerHTML = `
                    ${item.image ? `<img src="${item.image}" alt="${item.title}" class="event-image">` : ''}
                    <div class="event-content">
                        <span class="event-meta">
                            <i class="fas fa-calendar-day"></i> ${item.date} 
                            ${item.time ? `<i class="fas fa-clock"></i> ${item.time}` : ''}
                            <i class="fas fa-tag"></i> ${item.type}
                        </span>
                        <h3>${item.title}</h3>
                        <p>${item.description}</p>
                        <a href="${item.url}" class="register-btn" target="_blank">Inscríbete / Ver Más <i class="fas fa-external-link-alt"></i></a>
                    </div>
                `;
                eventosGrid.appendChild(card);
            });
        }
    }

    // Manejo de filtros para Novedades
    novedadesFilters.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            novedadesFilters.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            const filter = e.target.dataset.filter;
            renderContent('Novedades', filter);
        });
    });

    // Manejo de filtros para Eventos
    eventosFilters.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            eventosFilters.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            const filter = e.target.dataset.filter;
            renderContent('Eventos', filter);
        });
    });

    // Función para manejar el evento de actualización de localStorage
    function handleLocalStorageUpdate() {
        allEventsAndAnnouncements = JSON.parse(localStorage.getItem('fiscalproEvents')) || [];
        const currentNovedadesFilter = document.querySelector('#novedades .filter-btn.active')?.dataset.filter || 'all';
        const currentEventosFilter = document.querySelector('#eventos .filter-btn.active')?.dataset.filter || 'all';

        if (novedadesFilters.length > 0 && Array.from(novedadesFilters).some(btn => btn.classList.contains('active') && btn.dataset.filter !== 'all')) {
            renderContent('Novedades', currentNovedadesFilter);
        } else if (eventosFilters.length > 0 && Array.from(eventosFilters).some(btn => btn.classList.contains('active') && btn.dataset.filter !== 'all')) {
            renderContent('Eventos', currentEventosFilter);
        } else {
            renderContent('all', 'all');
        }
    }

    // Escuchar el evento personalizado de localStorageUpdate desde el admin panel
    window.addEventListener('localStorageUpdate', handleLocalStorageUpdate);

    // Renderizar el contenido inicial al cargar la página
    renderContent('all', 'all');
});