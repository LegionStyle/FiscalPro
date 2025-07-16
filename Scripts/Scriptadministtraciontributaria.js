    document.addEventListener('DOMContentLoaded', function() {
            const formulario = document.getElementById('formularioTributario');
            const entradaRuc = document.getElementById('ruc');
            const estadoRuc = document.getElementById('estado-ruc');
            const entradaCorreo = document.getElementById('correo');
            const estadoCorreo = document.getElementById('estado-correo');
            const entradaTelefono = document.getElementById('telefono');
            const estadoTelefono = document.getElementById('estado-telefono');
            const areaComentarios = document.getElementById('comentarios');
            const contadorCaracteres = document.getElementById('contador');
            const botonEnviar = document.getElementById('boton-enviar');
            const modal = document.getElementById('modal-confirmacion');
            const botonCerrarModal = document.getElementById('boton-cerrar-modal');
            const spanCerrarModal = document.querySelector('.cerrar-modal');
            
            // validacion
            entradaRuc.addEventListener('input', function() {
                const ruc = this.value.trim();
                if (ruc.length === 11 && /^\d+$/.test(ruc)) {
                    estadoRuc.textContent = '✓';
                    estadoRuc.style.color = '#4CAF50';
                } else {
                    estadoRuc.textContent = '✗';
                    estadoRuc.style.color = '#F44336';
                }
            }); 
            
            entradaCorreo.addEventListener('input', function() {
                const correo = this.value.trim();
                if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
                    estadoCorreo.textContent = '✓';
                    estadoCorreo.style.color = '#4CAF50';
                } else {
                    estadoCorreo.textContent = '✗';
                    estadoCorreo.style.color = '#F44336';
                }
            });
            
            entradaTelefono.addEventListener('input', function() {
                const telefono = this.value.trim();
                if (/^[0-9]{7,15}$/.test(telefono)) {
                    estadoTelefono.textContent = '✓';
                    estadoTelefono.style.color = '#4CAF50';
                } else {
                    estadoTelefono.textContent = '✗';
                    estadoTelefono.style.color = '#F44336';
                }
            });
            
            areaComentarios.addEventListener('input', function() {
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
                
                // validacion final 
                if (!validarFormulario()) {
                    return;
                }
                
                mostrarModalConfirmacion();
            });
            
            //  comprobacion de formulario lleno
            function validarFormulario() {
                let esValido = true;
                

                if (document.getElementById('empresa').value.trim() === '') {
                    alert('Por favor ingrese el nombre de la empresa');
                    esValido = false;
                }
                

                const ruc = entradaRuc.value.trim();
                if (ruc.length !== 11 || !/^\d+$/.test(ruc)) {
                    alert('El RUC debe tener exactamente 11 dígitos numéricos');
                    esValido = false;
                }
                

                if (document.getElementById('nombre').value.trim() === '') {
                    alert('Por favor ingrese su nombre completo');
                    esValido = false;
                }
                

                const correo = entradaCorreo.value.trim();
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
                    alert('Por favor ingrese un email válido');
                    esValido = false;
                }
                

                const telefono = entradaTelefono.value.trim();
                if (!/^[0-9]{7,15}$/.test(telefono)) {
                    alert('Por favor ingrese un número de teléfono válido (7-15 dígitos)');
                    esValido = false;
                }
                
                if (document.getElementById('servicio').value === '') {
                    alert('Por favor seleccione un servicio tributario');
                    esValido = false;
                }
                
                return esValido;
            }
            
            function mostrarModalConfirmacion() {
                const servicioSeleccionado = document.getElementById('servicio');
                const nombreServicio = servicioSeleccionado.options[servicioSeleccionado.selectedIndex].text;
                
                document.getElementById('mensaje-confirmacion').innerHTML = `
                    <p>Gracias <strong>${document.getElementById('nombre').value}</strong> por contactar con FiscalPro.</p>
                    <p>Hemos recibido tu solicitud para el servicio de <strong>${nombreServicio}</strong>.</p>
                    <p>Nos pondremos en contacto contigo en un plazo máximo de 24 horas.</p>
                `;
                
                modal.style.display = 'block';
            }
            
            // cerrar modal
            spanCerrarModal.addEventListener('click', function() {
                modal.style.display = 'none';
            });
            
            botonCerrarModal.addEventListener('click', function() {
                modal.style.display = 'none';
            });
            
            window.addEventListener('click', function(evento) {
                if (evento.target === modal) {
                    modal.style.display = 'none';
                }
            });
            
            // limpiar formulario
            document.getElementById('boton-limpiar').addEventListener('click', function() {
                estadoRuc.textContent = '';
                estadoCorreo.textContent = '';
                estadoTelefono.textContent = '';
                contadorCaracteres.textContent = '0';
                contadorCaracteres.style.color = '#4CAF50';
            });
            
            // efecto hover mejorado 
            const botones = document.querySelectorAll('input[type="submit"], input[type="reset"]');
            botones.forEach(boton => {
                boton.addEventListener('mouseenter', function() {
                    this.style.transform = 'scale(1.05)';
                    this.style.transition = 'transform 0.3s ease';
                });
                
                boton.addEventListener('mouseleave', function() {
                    this.style.transform = 'scale(1)';
                });
            });
            
            document.querySelectorAll('.menu-principal a, .contenido-menu a').forEach(enlace => {
                enlace.addEventListener('focus', function() {
                    this.style.outline = '2px solid #00aeff';
                });
                
                enlace.addEventListener('blur', function() {
                    this.style.outline = 'none';
                });
            });
        });