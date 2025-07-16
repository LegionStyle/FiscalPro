document.addEventListener("DOMContentLoaded", () => {
    
    // 1. CARGAR NOTICIAS
    const noticias = JSON.parse(localStorage.getItem('noticias')) || [
        
    
];

    
    // 2. ELEMENTOS DEL DOM
    
    const contenedorNoticias = document.getElementById('contenedor-noticias');
    const inputBuscar = document.getElementById('buscador');
    const btnBuscar = document.getElementById('btnBuscar');
    const resultadosBusqueda = document.getElementById('resultados');
    const categoryFilter = document.createElement('select');

    
    // 3. INICIALIZACIÓN
    
    initCategoryFilter(); 
    renderizarNoticias(noticias); 

    
    // 4. FUNCIONES PRINCIPALES
    

    // Configurar filtro de categorías
    function initCategoryFilter() {
        categoryFilter.id = 'categoryFilter';
        categoryFilter.innerHTML = `
            <option value="">Todas las categorías</option>
            <option value="Tributación">Tributación</option>
            <option value="Planillas">Planillas</option>
            <option value="Consultoría">Consultoría</option>
            <option value="Tecnología">Tecnología</option>
            <option value="Recursos Humanos">Recursos Humanos</option>
        `;
        document.querySelector('.busqueda-container').appendChild(categoryFilter);
        categoryFilter.addEventListener('change', aplicarFiltros);
    }

    // Renderizar noticias en el contenedor principal o en resultados de búsqueda
    function renderizarNoticias(noticiasAMostrar, esBusqueda = false) {
        const contenedor = esBusqueda ? resultadosBusqueda : contenedorNoticias;
        contenedor.innerHTML = '';

        if (noticiasAMostrar.length === 0) {
            contenedor.innerHTML = esBusqueda 
                ? `<li class="no-results"></li>`
                : `<div class="no-noticias"></div>`;
            return;
        }

        noticiasAMostrar.forEach(noticia => {
            const noticiaHTML = `
                <article class="article-card">
                    <img src="${noticia.imagen}" alt="${noticia.titulo}" class="article-image">
                    <div class="article-content">
                        <div class="article-meta">
                            <span class="article-date">${formatearFecha(noticia.fecha)}</span>
                            <span class="article-category">${noticia.categoria}</span>
                        </div>
                        <h3 class="article-title">${noticia.titulo}</h3>
                        <p class="article-excerpt">${noticia.descripcion}</p>
                        <a href="${noticia.url}" target="_blank" class="read-more">Leer más →</a>
                    </div>
                </article>
            `;
            contenedor.insertAdjacentHTML('beforeend', noticiaHTML);
        });
    }

    // Aplicar búsqueda y filtros
    function aplicarFiltros() {
        const termino = inputBuscar.value.trim().toLowerCase();
        const categoria = categoryFilter.value;

        const encontradas = noticias.filter(noticia => {
            const coincideTexto = termino 
                ? noticia.titulo.toLowerCase().includes(termino) || 
                  noticia.descripcion.toLowerCase().includes(termino)
                : true;
            
            const coincideCategoria = categoria 
                ? noticia.categoria === categoria 
                : true;

            return coincideTexto && coincideCategoria;
        });

        if (termino || categoria) {
            renderizarNoticias(encontradas, true); // Mostrar en resultados de búsqueda
        } else {
            renderizarNoticias(noticias); // Mostrar todas
            resultadosBusqueda.innerHTML = '';
        }
    }

    // Formatear fecha
    function formatearFecha(fechaString) {
        const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(fechaString).toLocaleDateString('es-ES', opciones);
    }

    
    // 5. EVENT LISTENERS
    
    btnBuscar.addEventListener('click', aplicarFiltros);
    inputBuscar.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') aplicarFiltros();
    });

    // Sincronización con el panel de administración
    window.addEventListener('storage', (e) => {
        if (e.key === 'noticias') {
            const noticiasActualizadas = JSON.parse(e.newValue);
            renderizarNoticias(noticiasActualizadas);
        }
    });

    // Actualizar al volver de admin
    window.addEventListener('pageshow', () => {
        const noticiasActualizadas = JSON.parse(localStorage.getItem('noticias')) || noticias;
        renderizarNoticias(noticiasActualizadas);
    });
});


// 6. ESTILOS DINAMICOS

const dynamicStyles = document.createElement('style');
dynamicStyles.textContent 
document.head.appendChild(dynamicStyles);
