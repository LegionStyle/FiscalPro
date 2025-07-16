        document.addEventListener('DOMContentLoaded', function() {
            
            const formulario = document.getElementById('formularioPlanillas');
            const empresaInput = document.getElementById('empresa');
            const empresaStatus = document.getElementById('empresaStatus');
            const rucInput = document.getElementById('ruc');
            const rucStatus = document.getElementById('rucStatus');
            const contactoInput = document.getElementById('contacto');
            const contactoStatus = document.getElementById('contactoStatus');
            const emailInput = document.getElementById('email');
            const emailStatus = document.getElementById('emailStatus');
            const telefonoInput = document.getElementById('telefono');
            const telefonoStatus = document.getElementById('telefonoStatus');
            const planillaSelect = document.getElementById('tipo-planilla');
            const planillaStatus = document.getElementById('planillaStatus');
            const empleadosInput = document.getElementById('empleados');
            const empleadosStatus = document.getElementById('empleadosStatus');
            const adjuntoInput = document.getElementById('adjunto');
            const fileInfo = document.getElementById('fileInfo');
            const comentariosTextarea = document.getElementById('comentarios');
            const contadorCaracteres = document.getElementById('contador');
            const btnEnviar = document.getElementById('btnEnviar');
            const modal = document.getElementById('modalConfirmacion');
            const btnCerrarModal = document.getElementById('btnCerrarModal');
            const cerrarModalSpan = document.querySelector('.cerrar-modal');
            const mensajeConfirmacion = document.getElementById('mensajeConfirmacion');
            
            // Ckeck de validacion
            rucInput.addEventListener('input', function() {
                const ruc = this.value.trim();
                if (ruc.length === 11 && /^\d+$/.test(ruc)) {
                    rucStatus.textContent = '✓';
                    rucStatus.style.color = '#4CAF50';
                } else {
                    rucStatus.textContent = '✗';
                    rucStatus.style.color = '#F44336';
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
            
            contactoInput.addEventListener('input', function() {
                const contacto = this.value.trim();
                if (contacto.length >= 3) {
                    contactoStatus.textContent = '✓';
                    contactoStatus.style.color = '#4CAF50';
                } else {
                    contactoStatus.textContent = '✗';
                    contactoStatus.style.color = '#F44336';
                }
            });
            
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
            
            planillaSelect.addEventListener('change', function() {
                if (this.value !== '') {
                    planillaStatus.textContent = '✓';
                    planillaStatus.style.color = '#4CAF50';
                } else {
                    planillaStatus.textContent = '✗';
                    planillaStatus.style.color = '#F44336';
                }
            });
            
            empleadosInput.addEventListener('input', function() {
                const empleados = this.value.trim();
                if (empleados > 0) {
                    empleadosStatus.textContent = '✓';
                    empleadosStatus.style.color = '#4CAF50';
                } else {
                    empleadosStatus.textContent = '✗';
                    empleadosStatus.style.color = '#F44336';
                }
            });
            
            // Mostrar información del archivo adjunto
            adjuntoInput.addEventListener('change', function() {
                if (this.files.length > 0) {
                    const file = this.files[0];
                    const fileSize = (file.size / 1024 / 1024).toFixed(2); // MB
                    
                    if (file.size > 5 * 1024 * 1024) { // 5MB limite
                        fileInfo.innerHTML = `<span style="color: #F44336;">El archivo es demasiado grande (${fileSize} MB). Máximo 5MB permitido.</span>`;
                        this.value = ''; 
                    } else if (!['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(file.type)) {
                        fileInfo.innerHTML = `<span style="color: #F44336;">Formato no permitido. Solo PDF o Excel.</span>`;
                        this.value = ''; 
                    } else {
                        fileInfo.innerHTML = `Archivo seleccionado: ${file.name} (${fileSize} MB)`;
                    }
                } else {
                    fileInfo.innerHTML = '';
                }
            });
            
            // contador de caracteres para comentarios
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
            
            // envio del formulario
            formulario.addEventListener('submit', function(e) {
                e.preventDefault();
                
                if (!validarFormulario()) {
                    return;
                }
                mostrarModalConfirmacion();
            });
            
            // validación del formulario
            function validarFormulario() {
                let valido = true;
                
                if (empresaInput.value.trim().length < 3) {
                    alert('Por favor ingrese un nombre de empresa válido (mínimo 3 caracteres)');
                    empresaInput.focus();
                    valido = false;
                }
                
                const ruc = rucInput.value.trim();
                if (ruc.length !== 11 || !/^\d+$/.test(ruc)) {
                    alert('El RUC debe tener exactamente 11 dígitos numéricos');
                    rucInput.focus();
                    valido = false;
                }
                
                if (contactoInput.value.trim().length < 3) {
                    alert('Por favor ingrese un nombre de contacto válido (mínimo 3 caracteres)');
                    contactoInput.focus();
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
                
                if (planillaSelect.value === '') {
                    alert('Por favor seleccione un tipo de planilla');
                    planillaSelect.focus();
                    valido = false;
                }
                
                if (empleadosInput.value <= 0) {
                    alert('Por favor ingrese un número válido de empleados (mínimo 1)');
                    empleadosInput.focus();
                    valido = false;
                }
                
                return valido;
            }
            
            // Mostrar modal de confirmación
            function mostrarModalConfirmacion() {
                const tipoPlanilla = planillaSelect.options[planillaSelect.selectedIndex].text;
                const numEmpleados = empleadosInput.value;
                
                mensajeConfirmacion.innerHTML = `
                    <p>Gracias <strong>${contactoInput.value}</strong> por contactar con FiscalPro.</p>
                    <p>Hemos recibido tu solicitud para el servicio de <strong>${tipoPlanilla}</strong>.</p>
                    <p>Para una empresa con <strong>${numEmpleados} empleados</strong>.</p>
                    <p>Nos pondremos en contacto contigo en un plazo máximo de 24 horas.</p>
                `;
                
                modal.style.display = 'block';
            }
            
            // Cerrar modal 
            cerrarModalSpan.addEventListener('click', function() {
                modal.style.display = 'none';
            });
            
            btnCerrarModal.addEventListener('click', function() {
                modal.style.display = 'none';
            });
            
            window.addEventListener('click', function(event) {
                if (event.target === modal) {
                    modal.style.display = 'none';
                }
            });
            
            // Limpiar formulario
            document.getElementById('btnLimpiar').addEventListener('click', function() {
                empresaStatus.textContent = '';
                rucStatus.textContent = '';
                contactoStatus.textContent = '';
                emailStatus.textContent = '';
                telefonoStatus.textContent = '';
                planillaStatus.textContent = '';
                empleadosStatus.textContent = '';
                fileInfo.innerHTML = '';
                contadorCaracteres.textContent = '0';
                contadorCaracteres.style.color = '#4CAF50';
            });
            
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
            
            // mejorar accesibilidad del menú
            document.querySelectorAll('.main-menu a, .cont-menu a').forEach(enlace => {
                enlace.addEventListener('focus', function() {
                    this.style.outline = '2px solid #00aeff';
                });
                
                enlace.addEventListener('blur', function() {
                    this.style.outline = 'none';
                });
            });
        });