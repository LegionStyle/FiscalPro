document.addEventListener('DOMContentLoaded', () => {
    const eventsTableBody = document.getElementById('eventsTableBody');
    const addEventBtn = document.getElementById('addEventBtn');
    const eventModal = document.getElementById('eventModal');
    const closeButtons = document.querySelectorAll('.close');
    const eventForm = document.getElementById('eventForm');
    const eventIdInput = document.getElementById('eventId');
    const eventTypeInput = document.getElementById('eventType');
    const eventTitleInput = document.getElementById('eventTitle');
    const eventDescriptionInput = document.getElementById('eventDescription');
    const eventDateInput = document.getElementById('eventDate');
    const eventTimeInput = document.getElementById('eventTime');
    const eventImageInput = document.getElementById('eventImage');
    const eventUrlInput = document.getElementById('eventUrl');
    const eventStatusInput = document.getElementById('eventStatus');
    const modalTitle = document.getElementById('modalTitle');
    const cancelBtn = document.getElementById('cancelBtn');

    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const typeFilter = document.getElementById('typeFilter');
    const statusFilter = document.getElementById('statusFilter');

    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageInfoSpan = document.getElementById('pageInfo');

    const confirmModal = document.getElementById('confirmModal');
    const confirmMessage = document.getElementById('confirmMessage');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');

    // --- Datos de ejemplo para inicializar si localStorage está vacío ---
    const defaultEvents = [
        {
            id: '1721000000001',
            type: 'Webinar',
            title: 'Webinar Gratuito: Novedades Tributarias 2025',
            description: 'Exploraremos los cambios más importantes en la legislación tributaria para el año 2025 y cómo afectarán a tu empresa. ¡No te lo pierdas!',
            date: '2025-08-15',
            time: '10:00',
            image: 'https://images.unsplash.com/photo-1542744173-8e47263bb7fc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Imagen de ejemplo
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
            image: 'https://images.unsplash.com/photo-1555421062-81787c805a86?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Imagen de ejemplo
            url: 'https://fiscalpro.com/contacto#miraflores',
            status: 'Activo'
        },
        
    ];

    // Cargar eventos y anuncios desde localStorage, o usar los datos por defecto si está vacío
    
    let events = JSON.parse(localStorage.getItem('fiscalproEvents')) || defaultEvents;
    
    if (localStorage.getItem('fiscalproEvents') === null) {
        localStorage.setItem('fiscalproEvents', JSON.stringify(defaultEvents));
    }


    let currentEventIdToDelete = null;
    let currentPage = 1;
    const itemsPerPage = 5;

    

    // Guarda los eventos en localStorage y actualiza la página del blog de eventos
    function saveEvents() {
        localStorage.setItem('fiscalproEvents', JSON.stringify(events));
        // Disparar un evento para que la página de eventos/anuncios se actualice si está abierta
        window.dispatchEvent(new Event('localStorageUpdate'));
        renderEvents(); 
    }

    // Renderiza la tabla de eventos/anuncios
    function renderEvents() {
        const searchTerm = searchInput.value.toLowerCase();
        const filterType = typeFilter.value;
        const filterStatus = statusFilter.value;

        const filteredEvents = events.filter(event => {
            const matchesSearch = event.title.toLowerCase().includes(searchTerm) ||
                                  event.description.toLowerCase().includes(searchTerm);
            const matchesType = filterType === '' || event.type === filterType;
            const matchesStatus = filterStatus === '' || event.status === filterStatus;
            return matchesSearch && matchesType && matchesStatus;
        });

        // Ordenar por fecha, los más recientes primero
        filteredEvents.sort((a, b) => new Date(b.date) - new Date(a.date));

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedEvents = filteredEvents.slice(startIndex, endIndex);

        eventsTableBody.innerHTML = ''; // Limpiar la tabla

        if (paginatedEvents.length === 0) {
            eventsTableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #ddd; padding: 20px;">No hay eventos o anuncios para mostrar.</td></tr>`;
        } else {
            paginatedEvents.forEach(event => {
                const row = eventsTableBody.insertRow();
                row.innerHTML = `
                    <td>${event.type}</td>
                    <td>${event.title}</td>
                    <td>${event.date} ${event.time ? `(${event.time})` : ''}</td>
                    <td><span class="status-badge status-${event.status}">${event.status}</span></td>
                    <td class="actions">
                        <button class="btn btn-primary btn-edit" data-id="${event.id}">Editar</button>
                        <button class="btn btn-danger btn-delete" data-id="${event.id}">Eliminar</button>
                    </td>
                `;
            });
        }

        updatePagination(filteredEvents.length);
    }

    // Abre el modal para añadir/editar
    function openModal(event = null) {
        eventForm.reset(); // Limpiar formulario
        eventIdInput.value = ''; // Resetear ID

        if (event) {
            // Modo edición
            modalTitle.textContent = 'Editar Evento/Anuncio';
            eventIdInput.value = event.id;
            eventTypeInput.value = event.type;
            eventTitleInput.value = event.title;
            eventDescriptionInput.value = event.description;
            eventDateInput.value = event.date;
            eventTimeInput.value = event.time || '';
            eventImageInput.value = event.image || '';
            eventUrlInput.value = event.url;
            eventStatusInput.value = event.status;
        } else {
            // Modo añadir
            modalTitle.textContent = 'Agregar Nuevo Evento/Anuncio';
            // Valores por defecto
            eventTypeInput.value = ''; 
            eventStatusInput.value = 'Activo';
            // Establecer la fecha actual por defecto para la nueva entrada
            eventDateInput.value = new Date().toISOString().slice(0, 10); 
        }
        eventModal.style.display = 'flex'; // Usar flex para centrado
    }

    // Cierra el modal
    function closeModal() {
        eventModal.style.display = 'none';
        eventForm.reset();
        eventIdInput.value = '';
    }

    // Gestiona el envío del formulario (añadir/editar)
    eventForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const id = eventIdInput.value;
        const type = eventTypeInput.value;
        const title = eventTitleInput.value;
        const description = eventDescriptionInput.value;
        const date = eventDateInput.value;
        const time = eventTimeInput.value;
        const image = eventImageInput.value;
        const url = eventUrlInput.value;
        const status = eventStatusInput.value;

        if (id) {
            // Editar evento/anuncio existente
            const eventIndex = events.findIndex(event => event.id === id);
            if (eventIndex > -1) {
                events[eventIndex] = { id, type, title, description, date, time, image, url, status };
            }
            showAlert('Evento/Anuncio actualizado exitosamente.', 'success');
        } else {
            // Añadir nuevo evento/anuncio
            const newEvent = {
                id: Date.now().toString(), // ID único basado en la marca de tiempo
                type,
                title,
                description,
                date,
                time,
                image,
                url,
                status
            };
            events.push(newEvent);
            showAlert('Nuevo evento/anuncio agregado exitosamente.', 'success');
        }

        saveEvents();
        closeModal();
    });

    // Delegación de eventos para botones de editar/eliminar
    eventsTableBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-edit')) {
            const id = e.target.dataset.id;
            const eventToEdit = events.find(event => event.id === id);
            if (eventToEdit) {
                openModal(eventToEdit);
            }
        } else if (e.target.classList.contains('btn-delete')) {
            currentEventIdToDelete = e.target.dataset.id;
            confirmMessage.textContent = `¿Estás seguro de que deseas eliminar "${events.find(e => e.id === currentEventIdToDelete)?.title}"?`;
            confirmModal.style.display = 'flex';
        }
    });

    // --- Funciones de Búsqueda y Filtro ---
    searchBtn.addEventListener('click', () => {
        currentPage = 1; 
        renderEvents();
    });

    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            currentPage = 1; 
            renderEvents();
        }
    });

    typeFilter.addEventListener('change', () => {
        currentPage = 1; 
        renderEvents();
    });

    statusFilter.addEventListener('change', () => {
        currentPage = 1; 
        renderEvents();
    });

    // --- Funciones de Paginación ---
    function updatePagination(totalItems) {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        pageInfoSpan.textContent = `Página ${currentPage} de ${totalPages || 1}`;
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages || totalItems === 0;
    }

    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderEvents();
        }
    });

    nextPageBtn.addEventListener('click', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filterType = typeFilter.value;
        const filterStatus = statusFilter.value;
        const filteredEvents = events.filter(event => {
            const matchesSearch = event.title.toLowerCase().includes(searchTerm) ||
                                event.description.toLowerCase().includes(searchTerm);
            const matchesType = filterType === '' || event.type === filterType;
            const matchesStatus = filterStatus === '' || event.status === filterStatus;
            return matchesSearch && matchesType && matchesStatus;
        });
        const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);

        if (currentPage < totalPages) {
            currentPage++;
            renderEvents();
        }
    });

    //  Funciones del Modal de Confirmación de Eliminacion
    confirmDeleteBtn.addEventListener('click', () => {
        if (currentEventIdToDelete) {
            events = events.filter(event => event.id !== currentEventIdToDelete);
            saveEvents();
            showAlert('Evento/Anuncio eliminado exitosamente.', 'danger');
            currentEventIdToDelete = null; // Resetear
            confirmModal.style.display = 'none';
             // Ajustar la página actual si es necesario después de eliminar
            const totalItemsAfterDelete = events.filter(event => {
                const searchTerm = searchInput.value.toLowerCase();
                const filterType = typeFilter.value;
                const matchesSearch = event.title.toLowerCase().includes(searchTerm) || event.description.toLowerCase().includes(searchTerm);
                const matchesType = filterType === '' || event.type === filterType;
                return matchesSearch && matchesType;
            }).length;
            const totalPagesAfterDelete = Math.ceil(totalItemsAfterDelete / itemsPerPage);
            if (currentPage > totalPagesAfterDelete && currentPage > 1) {
                currentPage = totalPagesAfterDelete;
            }
            renderEvents(); 
        }
    });

    cancelDeleteBtn.addEventListener('click', () => {
        confirmModal.style.display = 'none';
        currentEventIdToDelete = null;
    });

    //  Otros Controles del Modal 
    addEventBtn.addEventListener('click', () => openModal());
    cancelBtn.addEventListener('click', closeModal);
    closeButtons.forEach(btn => btn.addEventListener('click', closeModal)); // Cierra ambos modales

    window.addEventListener('click', (e) => {
        if (e.target === eventModal) {
            closeModal();
        }
        if (e.target === confirmModal) {
            confirmModal.style.display = 'none';
            currentEventIdToDelete = null;
        }
    });

    // Función para mostrar alertas temporales
    function showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.textContent = message;
        document.querySelector('.admin-container').prepend(alertDiv);

        setTimeout(() => {
            alertDiv.classList.add('hide');
            alertDiv.addEventListener('transitionend', () => alertDiv.remove());
        }, 3000);
    }
    
    // Iniciar la renderización de eventos al cargar la página
    renderEvents();
});