document.addEventListener("DOMContentLoaded", () => {
    // ======================
    // 1. CARGAR NOTICIAS
    // ======================
    const noticias = JSON.parse(localStorage.getItem('noticias')) || [
        
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
    {
        id: 3,
        titulo: "FiscalPro establece alianza estratégica con SUNAT para capacitaciones",
        descripcion: "Nuestros clientes tendrán acceso exclusivo a talleres con funcionarios tributarios este trimestre.",
        categoria: "Planillas",
        fecha: "2025-05-28",
        imagen: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
        url: "https://www.perucontable.com/.../sunat-y-gremios.../"
    },
    {
        id: 4,
        titulo: "Cambios en los plazos para declaraciones juradas anuales",
        descripcion: "Nuevos calendarios tributarios: fechas clave que toda empresa debe conocer para evitar multas.",
        categoria: "Tributación",
        fecha: "2025-05-22",
        imagen: "../Imagenes/blog5.png",
        url: "https://www.sunat.gob.pe/orientacion/cronogramas/2025/cRenta2024.html"
    },
    {
        id: 5,
        titulo: "¿Está preparada tu empresa para una auditoría tributaria?",
        descripcion: "Conozca los pasos esenciales para afrontar una auditoría de SUNAT sin complicaciones.",
        categoria: "Consultoría",
        fecha: "2025-05-20",
        imagen: "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
        url: "https://www.megavalbusiness.com/post/an%C3%A1lisis-previo-a-una-auditoria-tributaria-por-sunat"
    },
    {
        id: 6,
        titulo: "Nueva plataforma digital para envío de comprobantes electrónicos",
        descripcion: "Guía paso a paso para migrar al nuevo sistema de SUNAT que agilizará tus procesos contables.",
        categoria: "Tecnología",
        fecha: "2025-05-18",
        imagen: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
        url: "https://cpe.sunat.gob.pe/sistema_emision/see_sol"
    },
    {
        id: 7,
        titulo: "Cambios en la normativa tributaria para 2025",
        descripcion: "Descubra cómo los nuevos cambios fiscales afectarán a su empresa y cómo prepararse para ellos de manera efectiva.",
        categoria: "Tributación",
        fecha: "2025-05-15",
        imagen: "../Imagenes/blog1.png",
        url: "https://eef.com.pe/site/blog/cambios-tributarios-a-tener-en-cuenta-en-el-a%C3%B1o-2025"
    },
    {
        id: 8,
        titulo: "¿Cómo atraer y retener talento en un entorno laboral cambiante?",
        descripcion: "Estrategias clave para construir equipos sólidos y reducir la rotación en tu empresa.",
        categoria: "Recursos Humanos",
        fecha: "2025-05-05",
        imagen: "../Imagenes/blog3.jpg",
        url: "https://www.endalia.com/news/9-estrategias-de-retencion-del-talento-humano-para-tu-organizacion/"
    },
    {
        id: 9,
        titulo: "Ventajas de automatizar el proceso de planillas en tu empresa",
        descripcion: "Descubra cómo la tecnología puede reducir tiempos, errores y costos al gestionar nóminas.",
        categoria: "Planillas",
        fecha: "2025-05-01",
        imagen: "../Imagenes/blog6.jpg",
        url: "https://www.endalia.com/news/la-automatizacion-de-nominas-ventajas-y-mejores-practicas/"
    },
    {
        id: 10,
        titulo: "5 claves para una gestión eficiente de planillas",
        descripcion: "Aprenda a optimizar sus procesos de nómina y evitar errores costosos con estas estrategias comprobadas.",
        categoria: "Planillas",
        fecha: "2025-04-28",
        imagen: "../Imagenes/blog2.jpg",
        url: "https://www.buk.pe/blog/estrategias-para-optimizar-el-calculo-de-la-planilla"
    }
];

    // ======================
    // 2. ELEMENTOS DEL DOM
    // ======================
    const contenedorNoticias = document.getElementById('contenedor-noticias');
    const inputBuscar = document.getElementById('buscador');
    const btnBuscar = document.getElementById('btnBuscar');
    const resultadosBusqueda = document.getElementById('resultados');
    const categoryFilter = document.createElement('select');

    // ======================
    // 3. INICIALIZACIÓN
    // ======================
    initCategoryFilter(); // Configurar filtro de categorías
    renderizarNoticias(noticias); // Mostrar todas las noticias al cargar

    // ======================
    // 4. FUNCIONES PRINCIPALES
    // ======================

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
                ? `<li class="no-results">No se encontraron noticias</li>`
                : `<div class="no-noticias">No hay noticias disponibles</div>`;
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

    // ======================
    // 5. EVENT LISTENERS
    // ======================
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

// ======================
// 6. ESTILOS DINÁMICOS
// ======================
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent 
document.head.appendChild(dynamicStyles);