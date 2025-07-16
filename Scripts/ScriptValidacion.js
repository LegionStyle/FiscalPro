        // datos iniciales 
        const RUC_VALIDOS = ['20123456789', '20456789123', '20678912345']; 
        let facturaActual = null;

        // funciones principales
        function procesarFactura(archivo) {
            // mostrar mensaje de carga
            const areaCarga = document.getElementById('area-carga');
            areaCarga.innerHTML = '<p>Procesando factura...</p>';
            
            // simulación de lectura de datos 
            setTimeout(() => {
                facturaActual = {
                    nombre: archivo.name,
                    ruc: generarRUCValidoAleatorio(),
                    fecha: new Date().toLocaleDateString(),
                    monto: (Math.random() * 1000).toFixed(2),
                    tipo: archivo.type.includes('pdf') ? 'Factura Electrónica' : 'Factura Escaneada',
                    valido: true
                };

                // Validar RUC
                facturaActual.valido = RUC_VALIDOS.includes(facturaActual.ruc);

                // Restaurar área de carga
                areaCarga.innerHTML = `
                    <input type="file" id="entrada-factura" accept="image/*,.pdf" hidden>
                    <button class="btn" onclick="document.getElementById('entrada-factura').click()">
                        📄 Seleccionar Factura
                    </button>
                    <p>o arrástrala aquí</p>
                `;
                
                // Reasignar eventos
                document.getElementById('entrada-factura').addEventListener('change', manejarSeleccionArchivo);
                configurarArrastreYSoltar();

                mostrarResultados();
            }, 1500);
        }

        function mostrarResultados() {
            const divResultado = document.getElementById('resultado-validacion');
            const divDatos = document.getElementById('datos-factura');
            
            divDatos.innerHTML = `
                <div><strong>Archivo:</strong> ${facturaActual.nombre}</div>
                <div><strong>RUC Emisor:</strong> ${facturaActual.ruc}</div>
                <div class="${facturaActual.valido ? 'valido' : 'invalido'}">
                    <strong>Estado:</strong> ${facturaActual.valido ? 'VÁLIDO' : 'INVÁLIDO'}
                </div>
                <div><strong>Fecha Emisión:</strong> ${facturaActual.fecha}</div>
                <div><strong>Monto:</strong> S/${facturaActual.monto}</div>
                <div><strong>Tipo:</strong> ${facturaActual.tipo}</div>
            `;

            divResultado.style.display = 'block';
            
            // asignar eventos a los botones
            document.getElementById('btn-guardar').onclick = guardarValidacion;
            document.getElementById('btn-nueva').onclick = () => {
                document.getElementById('resultado-validacion').style.display = 'none';
            };
        }

        function guardarValidacion() {
            // obtener historial existente
            const historial = JSON.parse(localStorage.getItem('historialFacturas') || '[]');
            
            // añadir nueva validación
            historial.unshift({
                ...facturaActual,
                fechaValidacion: new Date().toLocaleString()
            });

            // guardar en localStorage (máx. 10 registros)
            localStorage.setItem('historialFacturas', JSON.stringify(historial.slice(0, 10)));
            alert('Validación guardada en historial');
            cargarHistorial();
        }

        function cargarHistorial() {
            const historial = JSON.parse(localStorage.getItem('historialFacturas') || '[]');
            const lista = document.getElementById('lista-historial');
            
            lista.innerHTML = historial.length === 0 
                ? '<p>No hay validaciones recientes</p>'
                : historial.map(item => `
                    <div class="item-historial">
                        <strong>${item.ruc}</strong> - ${item.fecha}
                        <br>${item.nombre} - ${item.valido ? '✅ Válido' : '❌ Inválido'}
                        <br><small>Validado el: ${item.fechaValidacion}</small>
                    </div>
                `).join('');
        }

        // Funciones auxiliares
        function generarRUCValidoAleatorio() {
            
            return Math.random() < 0.8 
                ? RUC_VALIDOS[Math.floor(Math.random() * RUC_VALIDOS.length)]
                : '20' + Math.floor(Math.random() * 100000000).toString().padStart(9, '0');
        }

        function manejarSeleccionArchivo(e) {
            if (e.target.files.length > 0) procesarFactura(e.target.files[0]);
        }

        function configurarArrastreYSoltar() {
            const areaCarga = document.getElementById('area-carga');
            
            // prevenir comportamientos por defecto
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(nombreEvento => {
                areaCarga.addEventListener(nombreEvento, prevenirComportamientos, false);
            });

            function prevenirComportamientos(e) {
                e.preventDefault();
                e.stopPropagation();
            }

            // resaltar area de carga
            ['dragenter', 'dragover'].forEach(nombreEvento => {
                areaCarga.addEventListener(nombreEvento, resaltar, false);
            });

            ['dragleave', 'drop'].forEach(nombreEvento => {
                areaCarga.addEventListener(nombreEvento, quitarResaltado, false);
            });

            function resaltar() {
                areaCarga.style.borderColor = '#00eeff';
                areaCarga.style.backgroundColor = 'rgba(0, 174, 255, 0.1)';
            }

            function quitarResaltado() {
                areaCarga.style.borderColor = '#00aeff';
                areaCarga.style.backgroundColor = 'transparent';
            }

            // manejar archivos soltados
            areaCarga.addEventListener('drop', manejarSoltado, false);

            function manejarSoltado(e) {
                const dt = e.dataTransfer;
                const archivos = dt.files;
                if (archivos.length > 0) procesarFactura(archivos[0]);
            }
        }

        // inicializar 
        document.addEventListener('DOMContentLoaded', () => {
            // configurar eventos
            document.getElementById('entrada-factura').addEventListener('change', manejarSeleccionArchivo);
            configurarArrastreYSoltar();

            // cargar historial
            cargarHistorial();
        });