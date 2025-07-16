        document.addEventListener('DOMContentLoaded', function() {

            const formulario = document.getElementById('formularioContacto');
            const nombreInput = document.getElementById('nombre');
            const nombreStatus = document.getElementById('nombreStatus');
            const emailInput = document.getElementById('email');
            const emailStatus = document.getElementById('emailStatus');
            const asuntoSelect = document.getElementById('asunto');
            const asuntoStatus = document.getElementById('asuntoStatus');
            const mensajeTextarea = document.getElementById('mensaje');
            const contadorCaracteres = document.getElementById('contador');
            const btnEnviar = document.getElementById('btnEnviar');
            const modal = document.getElementById('modalConfirmacion');
            const btnCerrarModal = document.getElementById('btnCerrarModal');
            const cerrarModalSpan = document.querySelector('.cerrar-modal');
            
            // validacion con check
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
            
            asuntoSelect.addEventListener('change', function() {
                if (this.value !== '') {
                    asuntoStatus.textContent = '✓';
                    asuntoStatus.style.color = '#4CAF50';
                } else {
                    asuntoStatus.textContent = '✗';
                    asuntoStatus.style.color = '#F44336';
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
            
            formulario.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // validacion enviar
                if (!validarFormulario()) {
                    return;
                }
                mostrarModalConfirmacion();
            });
            
            //  comprobacion de formulario lleno
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
                
                if (asuntoSelect.value === '') {
                    alert('Por favor seleccione un asunto');
                    asuntoSelect.focus();
                    valido = false;
                }
                
                if (mensajeTextarea.value.trim().length < 10) {
                    alert('Por favor ingrese un mensaje más detallado (mínimo 10 caracteres)');
                    mensajeTextarea.focus();
                    valido = false;
                }
                
                return valido;
            }
            
            // Mostrar modal de confirmación
            function mostrarModalConfirmacion() {
                modal.style.display = 'block';
            }
            
            // cerrar el  modal 
            cerrarModalSpan.addEventListener('click', function() {
                modal.style.display = 'none';
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
            
            // limpiar formulario
            function resetearIndicadores() {
                nombreStatus.textContent = '';
                emailStatus.textContent = '';
                asuntoStatus.textContent = '';
                contadorCaracteres.textContent = '0';
                contadorCaracteres.style.color = '#4CAF50';
            }
            
            // efecto hover para mejorar botones
            const botones = document.querySelectorAll('.boton-enviar, .cta-button');
            botones.forEach(boton => {
                boton.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-2px)';
                    this.style.transition = 'transform 0.3s ease';
                });
                
                boton.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0)';
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