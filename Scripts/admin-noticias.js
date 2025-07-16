document.addEventListener("DOMContentLoaded", () => {
    // Obtener elementos del DOM
    const newsTableBody = document.getElementById("newsTableBody");
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");
    const categoryFilter = document.getElementById("categoryFilter");
    const addNewsBtn = document.getElementById("addNewsBtn");
    const newsModal = document.getElementById("newsModal");
    const confirmModal = document.getElementById("confirmModal");
    const closeBtns = document.querySelectorAll(".close");
    const cancelBtn = document.getElementById("cancelBtn");
    const newsForm = document.getElementById("newsForm");
    const prevPageBtn = document.getElementById("prevPage");
    const nextPageBtn = document.getElementById("nextPage");
    const pageInfo = document.getElementById("pageInfo");
    
    // Variables para paginación
    let currentPage = 1;
    const itemsPerPage = 5;
    let filteredNoticias = [];
    
    // Cargar noticias desde localStorage o usar las predeterminadas
    let noticias = JSON.parse(localStorage.getItem('noticias')) || [
        {
            id: 1,
            titulo: "Nuevas modificaciones en el régimen tributario para PYMES 2025",
            descripcion: "Análisis detallado de los cambios que beneficiarán a las pequeñas y medianas empresas este año fiscal.",
            categoria: "Tributación",
            fecha: "2025-06-05",
            imagen: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
            url: "https://actualidadempresarial.pe/noticia/estos-son-los-cambios-tributarios-que-entraron-en-vigencia-en-peru-este-2025-que-impacto-tendran/36d9abf5-b3c8-4d1f-8271-bef8548b2925/1"
        },
        {
            id: 2,
            titulo: "Actualización en los montos de ESSALUD y AFP para el segundo semestre",
            descripcion: "Conozca los nuevos topes y porcentajes aplicables a partir de julio 2025 y cómo afectan su planilla.",
            categoria: "Tributación",
            fecha: "2025-05-30",
            imagen: "../Imagenes/blog4.png",
            url: "https://www.infobae.com/peru/2025/01/03/suben-aportes-a-essalud-por-nuevo-sueldo-minimo-en-peru-de-s1130-cuanto-les-quedara-de-salario/"
        },
        
    ];
    
    // Inicializar la tabla
    updateNewsTable();
    
    // Event Listeners
    searchBtn.addEventListener("click", applyFilters);
    searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") applyFilters();
    });
    
    categoryFilter.addEventListener("change", applyFilters);
    
    addNewsBtn.addEventListener("click", () => {
        openNewsModal();
    });
    
    closeBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            newsModal.style.display = "none";
            confirmModal.style.display = "none";
        });
    });
    
    cancelBtn.addEventListener("click", () => {
        newsModal.style.display = "none";
    });
    
    newsForm.addEventListener("submit", (e) => {
        e.preventDefault();
        saveNews();
    });
    
    prevPageBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            updateNewsTable();
        }
    });
    
    nextPageBtn.addEventListener("click", () => {
        const totalPages = Math.ceil(filteredNoticias.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            updateNewsTable();
        }
    });
    
    // Funciones
    function applyFilters() {
        currentPage = 1;
        const searchTerm = searchInput.value.toLowerCase();
        const category = categoryFilter.value;
        
        filteredNoticias = noticias.filter(noticia => {
            const matchesSearch = noticia.titulo.toLowerCase().includes(searchTerm) || 
                                noticia.descripcion.toLowerCase().includes(searchTerm);
            const matchesCategory = category === "" || noticia.categoria === category;
            
            return matchesSearch && matchesCategory;
        });
        
        updateNewsTable();
    }
    
    function updateNewsTable() {
        newsTableBody.innerHTML = "";
        
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedNoticias = filteredNoticias.slice(startIndex, endIndex);
        
        if (paginatedNoticias.length === 0) {
            newsTableBody.innerHTML = `<tr><td colspan="4" style="text-align: center;">No se encontraron noticias</td></tr>`;
        } else {
            paginatedNoticias.forEach(noticia => {
                const row = document.createElement("tr");
                
                row.innerHTML = `
                    <td>${noticia.titulo}</td>
                    <td>${noticia.categoria}</td>
                    <td>${formatDate(noticia.fecha)}</td>
                    <td class="actions-cell">
                        <button class="btn btn-primary edit-btn" data-id="${noticia.id}">Editar</button>
                        <button class="btn btn-danger delete-btn" data-id="${noticia.id}">Eliminar</button>
                    </td>
                `;
                
                newsTableBody.appendChild(row);
            });
            
            // Agregar event listeners a los botones de editar y eliminar
            document.querySelectorAll(".edit-btn").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    const id = parseInt(e.target.getAttribute("data-id"));
                    editNews(id);
                });
            });
            
            document.querySelectorAll(".delete-btn").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    const id = parseInt(e.target.getAttribute("data-id"));
                    confirmDelete(id);
                });
            });
        }
        
        // Actualizar controles de paginación
        updatePaginationControls();
    }
    
    function updatePaginationControls() {
        const totalPages = Math.ceil(filteredNoticias.length / itemsPerPage);
        pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
        
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
    }
    
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    }
    
    function openNewsModal(noticia = null) {
        const modalTitle = document.getElementById("modalTitle");
        const form = document.getElementById("newsForm");
        
        if (noticia) {
            modalTitle.textContent = "Editar Noticia";
            document.getElementById("newsId").value = noticia.id;
            document.getElementById("newsTitle").value = noticia.titulo;
            document.getElementById("newsCategory").value = noticia.categoria;
            document.getElementById("newsDate").value = noticia.fecha;
            document.getElementById("newsImage").value = noticia.imagen || "";
            document.getElementById("newsDescription").value = noticia.descripcion;
            document.getElementById("newsUrl").value = noticia.url;
        } else {
            modalTitle.textContent = "Agregar Nueva Noticia";
            form.reset();
            document.getElementById("newsDate").value = new Date().toISOString().split('T')[0];
        }
        
        newsModal.style.display = "block";
    }
    
    function editNews(id) {
        const noticia = noticias.find(n => n.id === id);
        if (noticia) {
            openNewsModal(noticia);
        }
    }
    
    function confirmDelete(id) {
        const noticia = noticias.find(n => n.id === id);
        if (noticia) {
            document.getElementById("confirmMessage").textContent = 
                `¿Estás seguro de que deseas eliminar la noticia "${noticia.titulo}"?`;
            
            const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
            
            // Remover cualquier event listener previo
            confirmDeleteBtn.replaceWith(confirmDeleteBtn.cloneNode(true));
            
            document.getElementById("confirmDeleteBtn").addEventListener("click", () => {
                deleteNews(id);
                confirmModal.style.display = "none";
            });
            
            document.getElementById("cancelDeleteBtn").addEventListener("click", () => {
                confirmModal.style.display = "none";
            });
            
            confirmModal.style.display = "block";
        }
    }
    
    function deleteNews(id) {
        noticias = noticias.filter(n => n.id !== id);
        saveToLocalStorage();
        applyFilters();
    }
    
    function saveNews() {
        const id = document.getElementById("newsId").value;
        const titulo = document.getElementById("newsTitle").value;
        const categoria = document.getElementById("newsCategory").value;
        const fecha = document.getElementById("newsDate").value;
        const imagen = document.getElementById("newsImage").value;
        const descripcion = document.getElementById("newsDescription").value;
        const url = document.getElementById("newsUrl").value;
        
        if (id) {
            // Editar noticia existente
            const index = noticias.findIndex(n => n.id === parseInt(id));
            if (index !== -1) {
                noticias[index] = {
                    id: parseInt(id),
                    titulo,
                    categoria,
                    fecha,
                    imagen,
                    descripcion,
                    url
                };
            }
        } else {
            // Agregar nueva noticia
            const newId = noticias.length > 0 ? Math.max(...noticias.map(n => n.id)) + 1 : 1;
            noticias.push({
                id: newId,
                titulo,
                categoria,
                fecha,
                imagen,
                descripcion,
                url
            });
        }
        
        saveToLocalStorage();
        newsModal.style.display = "none";
        applyFilters();
    }
    
    function saveToLocalStorage() {
        localStorage.setItem('noticias', JSON.stringify(noticias));
        // También actualizar el archivo ScriptsBlogs.js para que use estas noticias
        updateBlogScript();
    }
    
    function updateBlogScript() {
        // Esta función actualizaría el archivo ScriptsBlogs.js con las noticias actualizadas
        
        console.log("Noticias actualizadas. En un entorno real, aquí se actualizaría el archivo ScriptsBlogs.js");
    }
    
    // Inicializar filtros
    filteredNoticias = [...noticias];
    updateNewsTable();
});