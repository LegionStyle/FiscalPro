        document.addEventListener('DOMContentLoaded', function() {
            
            const formulario = document.getElementById('formularioReclutamiento');
            const empresaInput = document.getElementById('empresa');
            const empresaStatus = document.getElementById('empresaStatus');
            const rucInput = document.getElementById('ruc');
            const rucStatus = document.getElementById('rucStatus');
            const sitioWebInput = document.getElementById('sitio_web');
            const webStatus = document.getElementById('webStatus');
            const nombreInput = document.getElementById('nombre_contacto');
            const nombreStatus = document.getElementById('nombreStatus');
            const cargoInput = document.getElementById('cargo');
            const cargoStatus = document.getElementById('cargoStatus');
            const emailInput = document.getElementById('email');
            const emailStatus = document.getElementById('emailStatus');
            const telefonoInput = document.getElementById('telefono');
            const telefonoStatus = document.getElementById('telefonoStatus');
            const tituloPuestoInput = document.getElementById('titulo_puesto');
            const puestoStatus = document.getElementById('puestoStatus');
            const numVacantesInput = document.getElementById('num_vacantes');
            const vacantesStatus = document.getElementById('vacantesStatus');
            const tipoServicioSelect = document.getElementById('tipo_servicio');
            const servicioStatus = document.getElementById('servicioStatus');
            const comentariosTextarea = document.getElementById('comentarios_adicionales');
            const contadorCaracteres = document.getElementById('contador');
            const btnEnviar = document.getElementById('btnEnviar');
            const modal = document.getElementById('modalConfirmacion');
            const btnCerrarModal = document.getElementById('btnCerrarModal');
            const cerrarModalSpan = document.querySelector('.cerrar-modal');
            const servicioSeleccionado = document.getElementById('servicioSeleccionado');
            
            //validaciones
            empresaInput.addEventListener('input', function() {
                const empresa = this.value.trim();
                if (empresa.length >= 3) {
                    empresaStatus.textContent = '✓';
                    empresaStatus.style.color = '#4CAF50';
                } else {
                    empresaStatus.textContent = '✗';
                    empresaStatus.style.color = '#F44336';
                }
            });
            
            
            rucInput.addEventListener('input', function() {
                const ruc = this.value.trim();
                if (ruc === '' || (ruc.length === 11 && /^\d+$/.test(ruc))) {
                    rucStatus.textContent = ruc ? '✓' : '';
                    rucStatus.style.color = '#4CAF50';
                } else {
                    rucStatus.textContent = '✗';
                    rucStatus.style.color = '#F44336';
                }
            });
            
            
            sitioWebInput.addEventListener('input', function() {
                const web = this.value.trim();
                if (web === '' || /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(web)) {
                    webStatus.textContent = web ? '✓' : '';
                    webStatus.style.color = '#4CAF50';
                } else {
                    webStatus.textContent = '✗';
                    webStatus.style.color = '#F44336';
                }
            });
            
            
            nombreInput.addEventListener('input', function() {
                const nombre = this.value.trim();
                if (nombre.length >= 3) {
                    nombreStatus.textContent = '✓';
                    nombreStatus.style.color = '#4CAF50';
                } else {
                    nombreStatus.textContent = '✗';
                    nombreStatus.style.color = '#F44336';
                }
            });
            
            
            cargoInput.addEventListener('input', function() {
                const cargo = this.value.trim();
                if (cargo.length >= 3) {
                    cargoStatus.textContent = '✓';
                    cargoStatus.style.color = '#4CAF50';
                } else {
                    cargoStatus.textContent = '✗';
                    cargoStatus.style.color = '#F44336';
                }
            });
            
            
            emailInput.addEventListener('input', function() {
                const email = this.value.trim();
                if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    emailStatus.textContent = '✓';
                    emailStatus.style.color = '#4CAF50';
                } else {
                    emailStatus.textContent = '✗';
                    emailStatus.style.color = '#F44336';
                }
            });
            
            
            telefonoInput.addEventListener('input', function() {
                const telefono = this.value.trim();
                if (/^[0-9]{7,15}$/.test(telefono)) {
                    telefonoStatus.textContent = '✓';
                    telefonoStatus.style.color = '#4CAF50';
                } else {
                    telefonoStatus.textContent = '✗';
                    telefonoStatus.style.color = '#F44336';
                }
            });
            
            
            tituloPuestoInput.addEventListener('input', function() {
                const titulo = this.value.trim();
                if (titulo.length >= 3) {
                    puestoStatus.textContent = '✓';
                    puestoStatus.style.color = '#4CAF50';
                } else {
                    puestoStatus.textContent = '✗';
                    puestoStatus.style.color = '#F44336';
                }
            });
            
            
            numVacantesInput.addEventListener('input', function() {
                const vacantes = this.value.trim();
                if (vacantes > 0) {
                    vacantesStatus.textContent = '✓';
                    vacantesStatus.style.color = '#4CAF50';
                } else {
                    vacantesStatus.textContent = '✗';
                    vacantesStatus.style.color = '#F44336';
                }
            });
            
            
            tipoServicioSelect.addEventListener('change', function() {
                if (this.value !== '') {
                    servicioStatus.textContent = '✓';
                    servicioStatus.style.color = '#4CAF50';
                } else {
                    servicioStatus.textContent = '✗';
                    servicioStatus.style.color = '#F44336';
                }
            });
            
            
            comentariosTextarea.addEventListener('input', function() {
                const longitud = this.value.length;
                contadorCaracteres.textContent = longitud;
                
                if (longitud > 500) {
                    this.value = this.value.substring(0, 500);
                    contadorCaracteres.textContent = 500;
                    contadorCaracteres.style.color = '#F44336';
                } else if (longitud > 400) {
                    contadorCaracteres.style.color = '#FF9800';
                } else {
                    contadorCaracteres.style.color = '#4CAF50';
                }
            });
            
            // Manejo del envío del formulario
            formulario.addEventListener('submit', function(e) {
                e.preventDefault();
                
                
                if (!validarFormulario()) {
                    return;
                }
                
                const servicioTexto = tipoServicioSelect.options[tipoServicioSelect.selectedIndex].text;
                servicioSeleccionado.textContent = servicioTexto;
                
                mostrarModalConfirmacion();
            });
            
            // validacion de formulario
            function validarFormulario() {
                let valido = true; 
                
                if (empresaInput.value.trim().length < 3) {
                    alert('Por favor ingrese un nombre de empresa válido (mínimo 3 caracteres)');
                    empresaInput.focus();
                    valido = false;
                }
                
                const ruc = rucInput.value.trim();
                if (ruc && (ruc.length !== 11 || !/^\d+$/.test(ruc))) {
                    alert('El RUC debe tener exactamente 11 dígitos numéricos o dejarse vacío');
                    rucInput.focus();
                    valido = false;
                }
                
                const web = sitioWebInput.value.trim();
                if (web && !/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(web)) {
                    alert('Por favor ingrese una URL válida o deje el campo vacío');
                    sitioWebInput.focus();
                    valido = false;
                }
                
                if (nombreInput.value.trim().length < 3) {
                    alert('Por favor ingrese un nombre válido (mínimo 3 caracteres)');
                    nombreInput.focus();
                    valido = false;
                }
                
                if (cargoInput.value.trim().length < 3) {
                    alert('Por favor ingrese un cargo válido (mínimo 3 caracteres)');
                    cargoInput.focus();
                    valido = false;
                }
                
                const email = emailInput.value.trim();
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    alert('Por favor ingrese un email válido');
                    emailInput.focus();
                    valido = false;
                }
                
                const telefono = telefonoInput.value.trim();
                if (!/^[0-9]{7,15}$/.test(telefono)) {
                    alert('Por favor ingrese un número de teléfono válido (7-15 dígitos)');
                    telefonoInput.focus();
                    valido = false;
                }
                
                if (tituloPuestoInput.value.trim().length < 3) {
                    alert('Por favor ingrese un título de puesto válido (mínimo 3 caracteres)');
                    tituloPuestoInput.focus();
                    valido = false;
                }
                
                if (numVacantesInput.value < 1) {
                    alert('Por favor ingrese un número válido de vacantes (mínimo 1)');
                    numVacantesInput.focus();
                    valido = false;
                }
                
                if (tipoServicioSelect.value === '') {
                    alert('Por favor seleccione un tipo de servicio');
                    tipoServicioSelect.focus();
                    valido = false;
                }
                
                return valido;
            }
            
            // Mostrar modal de confirmación
            function mostrarModalConfirmacion() {
                modal.style.display = 'block';
            }
            
            cerrarModalSpan.addEventListener('click', function() {
                modal.style.display = 'none';
                formulario.reset();
                resetearIndicadores();
            });
            
            btnCerrarModal.addEventListener('click', function() {
                modal.style.display = 'none';
                formulario.reset();
                resetearIndicadores();
            });
            
            window.addEventListener('click', function(event) {
                if (event.target === modal) {
                    modal.style.display = 'none';
                    formulario.reset();
                    resetearIndicadores();
                }
            });
            
            // Función para resetear indicadores
            function resetearIndicadores() {
                empresaStatus.textContent = '';
                rucStatus.textContent = '';
                webStatus.textContent = '';
                nombreStatus.textContent = '';
                cargoStatus.textContent = '';
                emailStatus.textContent = '';
                telefonoStatus.textContent = '';
                puestoStatus.textContent = '';
                vacantesStatus.textContent = '';
                servicioStatus.textContent = '';
                contadorCaracteres.textContent = '0';
                contadorCaracteres.style.color = '#4CAF50';
            }
            
            // Efecto hover para el botón de enviar
            btnEnviar.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.05)';
                this.style.transition = 'transform 0.3s ease';
            });
            
            btnEnviar.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
            
            // Mejorar accesibilidad del menú
            document.querySelectorAll('.main-menu a, .cont-menu a').forEach(enlace => {
                enlace.addEventListener('focus', function() {
                    this.style.outline = '2px solid #00aeff';
                });
                
                enlace.addEventListener('blur', function() {
                    this.style.outline = 'none';
                });
            });
        });