        document.addEventListener('DOMContentLoaded', function() {
            
            const formulario = document.getElementById('formularioOutsourcing');
            const nombreInput = document.getElementById('nombre');
            const nombreStatus = document.getElementById('nombreStatus');
            const emailInput = document.getElementById('email');
            const emailStatus = document.getElementById('emailStatus');
            const telefonoInput = document.getElementById('telefono');
            const telefonoStatus = document.getElementById('telefonoStatus');
            const servicioSelect = document.getElementById('servicio');
            const servicioStatus = document.getElementById('servicioStatus');
            const mensajeTextarea = document.getElementById('mensaje');
            const contadorCaracteres = document.getElementById('contador');
            const btnEnviar = document.getElementById('btnEnviar');
            const btnHero = document.getElementById('btnHero');
            const modal = document.getElementById('modalConfirmacion');
            const btnCerrarModal = document.getElementById('btnCerrarModal');
            const cerrarModalSpan = document.querySelector('.cerrar-modal');
            const servicioSeleccionado = document.getElementById('servicioSeleccionado');
            
            // validacion con ckeck
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
                if (telefono === '' || /^[0-9]{7,15}$/.test(telefono)) {
                    telefonoStatus.textContent = telefono ? '✓' : '';
                    telefonoStatus.style.color = '#4CAF50';
                } else {
                    telefonoStatus.textContent = '✗';
                    telefonoStatus.style.color = '#F44336';
                }
            });
            
            servicioSelect.addEventListener('change', function() {
                if (this.value !== '') {
                    servicioStatus.textContent = '✓';
                    servicioStatus.style.color = '#4CAF50';
                } else {
                    servicioStatus.textContent = '✗';
                    servicioStatus.style.color = '#F44336';
                }
            });
            
            mensajeTextarea.addEventListener('input', function() {
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
            
            // Efecto hover para tarjetas de servicio
            const serviceCards = document.querySelectorAll('.service-card');
            serviceCards.forEach(card => {
                card.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-10px)';
                    this.style.boxShadow = '0 8px 25px rgba(0, 174, 255, 0.2)';
                });
                
                card.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0)';
                    this.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
                });
            });
            
            // Efecto hover para tarjetas de beneficios
            const benefitCards = document.querySelectorAll('.benefit-card');
            benefitCards.forEach(card => {
                card.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-5px)';
                    this.style.boxShadow = '0 10px 20px rgba(0, 174, 255, 0.1)';
                });
                
                card.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0)';
                    this.style.boxShadow = 'none';
                });
            });
            
            //envio del formulario}
            formulario.addEventListener('submit', function(e) {
                e.preventDefault();
                
                if (!validarFormulario()) {
                    return;
                }
                
                const servicioTexto = servicioSelect.options[servicioSelect.selectedIndex].text;
                servicioSeleccionado.textContent = servicioTexto;
                mostrarModalConfirmacion();
            });
            
            // validación formulario lleno
            function validarFormulario() {
                let valido = true;
                
                if (nombreInput.value.trim().length < 3) {
                    alert('Por favor ingrese un nombre válido (mínimo 3 caracteres)');
                    nombreInput.focus();
                    valido = false;
                }
                
                const email = emailInput.value.trim();
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    alert('Por favor ingrese un email válido');
                    emailInput.focus();
                    valido = false;
                }
                
                const telefono = telefonoInput.value.trim();
                if (telefono && !/^[0-9]{7,15}$/.test(telefono)) {
                    alert('Por favor ingrese un número de teléfono válido (7-15 dígitos) o déjelo vacío');
                    telefonoInput.focus();
                    valido = false;
                }
                
                if (servicioSelect.value === '') {
                    alert('Por favor seleccione un servicio de interés');
                    servicioSelect.focus();
                    valido = false;
                }
                
                return valido;
            }
            
            // modal de confirmación
            function mostrarModalConfirmacion() {
                modal.style.display = 'block';
            }
            
            // Cerrar modal 
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
            
            //  resetear 
            function resetearIndicadores() {
                nombreStatus.textContent = '';
                emailStatus.textContent = '';
                telefonoStatus.textContent = '';
                servicioStatus.textContent = '';
                contadorCaracteres.textContent = '0';
                contadorCaracteres.style.color = '#4CAF50';
            }
            
            btnHero.addEventListener('click', function(e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
            
            // mejorar accesibilidad del menu
            document.querySelectorAll('.main-menu a, .cont-menu a').forEach(enlace => {
                enlace.addEventListener('focus', function() {
                    this.style.outline = '2px solid #00aeff';
                });
                
                enlace.addEventListener('blur', function() {
                    this.style.outline = 'none';
                });
            });
        });