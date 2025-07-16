

document.addEventListener('DOMContentLoaded', () => {
    const novedadesGrid = document.querySelector('#novedades .grid-container');
    const eventosGrid = document.querySelector('#eventos .grid-container');

    const novedadesFilters = document.querySelectorAll('#novedades .filter-btn');
    const eventosFilters = document.querySelectorAll('#eventos .filter-btn');

    let allEventsAndAnnouncements = []; 

    // Función para cargar los datos desde localStorage
    function loadEventsAndAnnouncementsFromLocalStorage() {
        allEventsAndAnnouncements = JSON.parse(localStorage.getItem('fiscalproEvents')) || [];
        
        if (allEventsAndAnnouncements.length === 0) {
            
            allEventsAndAnnouncements = [
                {
                    id: '1721000000001',
                    type: 'Webinar',
                    title: 'Webinar Gratuito: Novedades Tributarias 2025',
                    description: 'Exploraremos los cambios más importantes en la legislación tributaria para el año 2025 y cómo afectarán a tu empresa. ¡No te lo pierdas!',
                    date: '2025-08-15',
                    time: '10:00',
                    image: 'https://images.unsplash.com/photo-1542744173-8e47263bb7fc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                    url: 'https://zoom.us/webinar/novedades-tributarias',
                    status: 'Activo'
                },
                {
                    id: '1721000000002',
                    type: 'Anuncio',
                    title: '¡Nueva Oficina en Miraflores!',
                    description: 'Nos complace anunciar la apertura de nuestra nueva sede en el corazón de Miraflores para una mejor atención a nuestros clientes.',
                    date: '2025-07-20',
                    time: '',
                    image: 'https://images.unsplash.com/photo-1555421062-81787c805a86?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                    url: 'https://fiscalpro.com/contacto#miraflores',
                    status: 'Activo'
                },
                {
                    id: '1721000000003',
                    type: 'Novedad',
                    title: 'Actualización en Normativa Fiscal: Cambios en el IGV',
                    description: 'Infórmate sobre las últimas modificaciones en la Ley del Impuesto General a las Ventas y cómo cumplir con las nuevas disposiciones para evitar sanciones.',
                    date: '2025-07-20',
                    time: '',
                    image: 'https://images.unsplash.com/photo-1579621970795-87facc2f976d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                    url: 'https://ejemplo.com/igv-cambios',
                    status: 'Activo'
                },
                {
                    id: '1721000000004',
                    type: 'Seminario',
                    title: 'Seminario Presencial: Estrategias de Auditoría Financiera',
                    description: 'Únete a nuestro seminario interactivo para dominar las metodologías modernas de auditoría y mejorar la transparencia de tus estados financieros.',
                    date: '2025-09-05',
                    time: '09:00',
                    image: 'https://images.unsplash.com/photo-1555421062-81787c805a86?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                    url: 'https://ejemplo.com/seminario-auditoria',
                    status: 'Activo'
                }
            ];
        }
    }

    // Función para renderizar las tarjetas en la página
    function renderContent() {
        if (!novedadesGrid || !eventosGrid) {
            console.warn("Elementos #novedades .grid-container o #eventos .grid-container no encontrados. Asegúrate de que el HTML está cargado correctamente.");
            return;
        }

        loadEventsAndAnnouncementsFromLocalStorage(); 

        novedadesGrid.innerHTML = ''; 
        eventosGrid.innerHTML = '';

        const novedadesItems = [];
        const eventosItems = [];

        // Obtener el filtro activo actual para novedades
        const activeNovedadesFilterBtn = document.querySelector('#novedades .filter-btn.active');
        const currentNovedadesFilter = activeNovedadesFilterBtn ? activeNovedadesFilterBtn.dataset.filter : 'all';

        // Obtener el filtro activo actual para eventos
        const activeEventosFilterBtn = document.querySelector('#eventos .filter-btn.active');
        const currentEventosFilter = activeEventosFilterBtn ? activeEventosFilterBtn.dataset.filter : 'all';


        // Filtrar y separar por tipo (anuncios/novedades y eventos)
        allEventsAndAnnouncements.forEach(item => {
            if (item.status === 'Activo') { 
                if (item.type === 'Anuncio' || item.type === 'Novedad') {
                    novedadesItems.push(item);
                } else if (['Webinar', 'Seminario', 'Taller', 'Conferencia'].includes(item.type)) {
                    eventosItems.push(item);
                }
            }
        });

        // Ordenar: Novedades por fecha descendente (más reciente primero)
        novedadesItems.sort((a, b) => new Date(b.date) - new Date(a.date));
        // Eventos por fecha ascendente (próximos primero)
        eventosItems.sort((a, b) => new Date(a.date) - new Date(b.date));


        // Renderizar Novedades
        const filteredNovedades = novedadesItems.filter(item => {
            if (currentNovedadesFilter === 'all') return true;
            return item.type === currentNovedadesFilter;
        });

        if (filteredNovedades.length === 0) {
            novedadesGrid.innerHTML = `
                <div class="no-items-message">
                    <i class="fas fa-box-open"></i>
                    <p>No hay novedades o anuncios disponibles para el filtro seleccionado.</p>
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
            if (currentEventosFilter === 'all') return true;
            return item.type === currentEventosFilter;
        });

        if (filteredEventos.length === 0) {
            eventosGrid.innerHTML = `
                <div class="no-items-message">
                    <i class="fas fa-calendar-times"></i>
                    <p>No hay próximos eventos o seminarios programados para el filtro seleccionado.</p>
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
            renderContent(); 
        });
    });

    // Manejo de filtros para Eventos
    eventosFilters.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            eventosFilters.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            renderContent(); 
        });
    });

    // Función para manejar el evento de actualización de localStorage
    function handleLocalStorageUpdate() {

        renderContent();
    }

    // Escuchar el evento personalizado 'localStorageUpdate' desde el admin panel
    window.addEventListener('localStorageUpdate', handleLocalStorageUpdate);


    renderContent();
});
