
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

    // --- Datos de ejemplo predeterminados ---
    // Estos se usarán para inicializar localStorage si está vacío
    const defaultEventsAndAnnouncements = [
        {
                    id: '1721000000001',
                    type: 'Webinar',
                    title: 'Webinar Gratuito: Novedades Tributarias 2025',
                    description: 'Exploraremos los cambios más importantes en la legislación tributaria para el año 2025 y cómo afectarán a tu empresa. ¡No te lo pierdas!',
                    date: '2025-08-15',
                    time: '10:00',
                    image: 'https://www.godaddy.com/resources/es/wp-content/uploads/sites/9/2022/05/body_webinar.png?size=3840x0',
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
                    image: 'https://img.properati.com/eyJidWNrZXQiOiJwcmQtbGlmdWxsY29ubmVjdC1iYWNrZW5kLWIyYi1pbWFnZXMiLCJrZXkiOiJwcm9wZXJ0aWVzLzAxOTc4ZTQ0LTYxMjctNzY2Yi1hOGUxLTljYmYxOGE4N2I3OC8wMTk3OGU0Ni1kNTI2LTczMDctYjNjZS0zYjYyZjY2ZWRmMmUuanBnIiwiYnJhbmQiOiJwcm9wZXJhdGkiLCJlZGl0cyI6eyJyb3RhdGUiOm51bGwsInJlc2l6ZSI6eyJ3aWR0aCI6MzIwLCJoZWlnaHQiOjI0MCwiZml0IjoiY292ZXIifX19',
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
                    image: 'https://mundogeo.com/wp-content/uploads/2022/10/04145006/curso-no-mundogeo-e-droneshow-202211-710x400.jpg',
                    url: 'https://ejemplo.com/seminario-auditoria',
                    status: 'Activo'
                }
        
    ];


    let events = JSON.parse(localStorage.getItem('fiscalproEvents')) || defaultEventsAndAnnouncements;

    // Asegurarse de que defaultEventsAndAnnouncements se guarden en localStorage si no existen
    if (localStorage.getItem('fiscalproEvents') === null || events.length === 0) {
        localStorage.setItem('fiscalproEvents', JSON.stringify(defaultEventsAndAnnouncements));
        events = defaultEventsAndAnnouncements; 
    }

    let currentEventIdToDelete = null;
    let currentPage = 0;
    const itemsPerPage = 5;

    // Guarda los eventos en localStorage y activa el re-renderizado
    function saveEvents() {
        localStorage.setItem('fiscalproEvents', JSON.stringify(events));
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

        // Ordenar por fecha, los más recientes primero (en el admin, esto suele ser útil)
        filteredEvents.sort((a, b) => new Date(b.date) - new Date(a.date));

        const startIndex = currentPage * itemsPerPage;
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
                    <td><span class="status-badge status-${event.status.toLowerCase()}">${event.status}</span></td>
                    <td class="actions">
                        <button class="btn btn-primary btn-edit" data-id="${event.id}">Editar</button>
                        <button class="btn btn-danger btn-delete" data-id="${event.id}">Eliminar</button>
                    </td>
                `;
            });
        }
        updatePagination(filteredEvents.length);
    }

    // Actualiza la información de paginación
    function updatePagination(totalItems) {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        prevPageBtn.disabled = currentPage === 0;
        nextPageBtn.disabled = currentPage >= (totalPages - 1) || totalItems === 0;
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
            // Valores por defecto para nuevo ítem
            eventTypeInput.value = ''; 
            eventStatusInput.value = 'Activo';
            eventDateInput.value = new Date().toISOString().slice(0, 10); 
        }
        eventModal.style.display = 'flex';
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

        if (!title || !description || !date || !type || !status) {
            showAlert('Por favor, completa todos los campos obligatorios.', 'warning');
            return;
        }

        if (id) {
            // Editar evento/anuncio existente
            const eventIndex = events.findIndex(event => event.id === id);
            if (eventIndex > -1) {
                events[eventIndex] = { id, type, title, description, date, time, image, url, status };
                showAlert('Evento/Anuncio actualizado exitosamente.', 'success');
            } else {
                showAlert('Error: Evento/Anuncio no encontrado para actualizar.', 'danger');
            }
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

        saveEvents(); // Guarda en localStorage y re-renderiza
        closeModal();
    });

    // Delegación de eventos para botones de editar/eliminar en la tabla
    eventsTableBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-edit')) {
            const id = e.target.dataset.id;
            const eventToEdit = events.find(event => event.id === id);
            if (eventToEdit) {
                openModal(eventToEdit);
            }
        } else if (e.target.classList.contains('btn-delete')) {
            currentEventIdToDelete = e.target.dataset.id;
            const eventToDelete = events.find(e => e.id === currentEventIdToDelete);
            confirmMessage.textContent = `¿Estás seguro de que deseas eliminar "${eventToDelete ? eventToDelete.title : 'este ítem'}"?`;
            confirmModal.style.display = 'flex';
        }
    });

    // --- Funciones de Búsqueda y Filtro ---
    searchBtn.addEventListener('click', () => {
        currentPage = 0; // Volver a la primera página en una nueva búsqueda
        renderEvents();
    });

    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            currentPage = 0; // Volver a la primera página en una nueva búsqueda
            renderEvents();
        }
    });

    typeFilter.addEventListener('change', () => {
        currentPage = 0; // Volver a la primera página en un nuevo filtro
        renderEvents();
    });

    statusFilter.addEventListener('change', () => {
        currentPage = 0; // Volver a la primera página en un nuevo filtro
        renderEvents();
    });

    // --- Funciones de Paginación ---
    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 0) {
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

        if (currentPage < totalPages - 1) { // totalPages - 1 porque currentPage es 0-indexed
            currentPage++;
            renderEvents();
        }
    });

    // Funciones del Modal de Confirmación de Eliminación
    confirmDeleteBtn.addEventListener('click', () => {
        if (currentEventIdToDelete) {
            events = events.filter(event => event.id !== currentEventIdToDelete);
            showAlert('Evento/Anuncio eliminado exitosamente.', 'danger');
            currentEventIdToDelete = null; // Resetear

            // Ajustar la página actual si es necesario después de eliminar
            const searchTerm = searchInput.value.toLowerCase();
            const filterType = typeFilter.value;
            const filterStatus = statusFilter.value;
            const totalItemsAfterDelete = events.filter(event => {
                const matchesSearch = event.title.toLowerCase().includes(searchTerm) || event.description.toLowerCase().includes(searchTerm);
                const matchesType = filterType === '' || event.type === filterType;
                const matchesStatus = filterStatus === '' || event.status === filterStatus;
                return matchesSearch && matchesType && matchesStatus;
            }).length;
            const totalPagesAfterDelete = Math.ceil(totalItemsAfterDelete / itemsPerPage);

            if (currentPage >= totalPagesAfterDelete && totalPagesAfterDelete > 0) {
                currentPage = totalPagesAfterDelete - 1; // Ajustar a 0-indexed
            } else if (totalPagesAfterDelete === 0) {
                currentPage = 0; // Si no hay más elementos, vuelve a la página 0
            }

            saveEvents(); // Guarda en localStorage y re-renderiza
            confirmModal.style.display = 'none';
        }
    });

    cancelDeleteBtn.addEventListener('click', () => {
        confirmModal.style.display = 'none';
        currentEventIdToDelete = null;
    });

    // Otros Controles del Modal
    addEventBtn.addEventListener('click', () => openModal());
    cancelBtn.addEventListener('click', closeModal);
    closeButtons.forEach(btn => btn.addEventListener('click', closeModal));

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
        const adminContainer = document.querySelector('.admin-container');
        if (!adminContainer) {
            console.error("No se encontró el elemento .admin-container para mostrar la alerta.");
            return;
        }
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.textContent = message;
        adminContainer.prepend(alertDiv);

        setTimeout(() => {
            alertDiv.classList.add('hide');
            alertDiv.addEventListener('transitionend', () => alertDiv.remove());
        }, 3000);
    }

    // Iniciar la renderización de eventos al cargar la página
    renderEvents();
});
