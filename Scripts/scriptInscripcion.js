document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const formulario = document.getElementById('formularioAuditoria');
    const pasosFormulario = document.querySelectorAll('.paso-formulario');
    const pasosProgreso = document.querySelectorAll('.paso');
    const botonesSiguiente = document.querySelectorAll('.boton-siguiente');
    const botonesAnterior = document.querySelectorAll('.boton-anterior');
    const selectorTipoAuditoria = document.getElementById('tipo_auditoria');
    const selectorAlcance = document.getElementById('alcance_auditoria');
    const inputFechaInicio = document.getElementById('fecha_inicio');
    const inputFechaFin = document.getElementById('fecha_fin');
    const checkboxTerminos = document.getElementById('acepto_terminos');
    const botonFinalizar = document.getElementById('boton-finalizar');
    const botonConsultarSunat = document.getElementById('boton-consultar-sunat');

    inicializarFormulario();

    function inicializarFormulario() {
        // Establecer fechas mínimas
        const hoy = new Date();
        const fechaMinima = new Date(hoy);
        fechaMinima.setDate(hoy.getDate() + 7);
        
        inputFechaInicio.min = formatearFecha(fechaMinima);
        inputFechaFin.min = formatearFecha(fechaMinima);

        // Configurar eventos
        configurarEventos();

        // Mostrar primer paso
        mostrarPaso(1);
    }

    function configurarEventos() {
        // Navegación entre pasos
        botonesSiguiente.forEach(boton => boton.addEventListener('click', manejarSiguientePaso));
        botonesAnterior.forEach(boton => boton.addEventListener('click', manejarAnteriorPaso));

        // Cambios que afectan el resumen
        selectorTipoAuditoria.addEventListener('change', actualizarResumen);
        selectorAlcance.addEventListener('change', manejarCambioAlcance);
        inputFechaInicio.addEventListener('change', manejarCambioFecha);
        inputFechaFin.addEventListener('change', actualizarResumen);
        document.getElementById('tamano_empresa').addEventListener('change', actualizarResumen);
        document.getElementById('facturacion_anual').addEventListener('change', actualizarResumen);

        // Métodos de pago
        document.querySelectorAll('.metodo-pago').forEach(metodo => {
            metodo.addEventListener('click', manejarClickMetodoPago);
        });

        // Validación de tarjeta en tiempo real
        if (document.getElementById('numero_tarjeta')) {
            document.getElementById('numero_tarjeta').addEventListener('input', formatearNumeroTarjeta);
            document.getElementById('expiracion_tarjeta').addEventListener('input', formatearExpiracionTarjeta);
        }

        // Términos y condiciones
        document.getElementById('ver-terminos').addEventListener('click', mostrarModalTerminos);
        document.getElementById('boton-aceptar-terminos').addEventListener('click', aceptarTerminos);
        document.querySelector('.cerrar-modal').addEventListener('click', ocultarModalTerminos);

        // Consulta SUNAT
        if (botonConsultarSunat) {
            botonConsultarSunat.addEventListener('click', consultarSunat);
        }

        // Finalizar
        if (botonFinalizar) {
            botonFinalizar.addEventListener('click', () => {
                window.location.href = 'index.html';
            });
        }

        // Envío del formulario
        formulario.addEventListener('submit', manejarEnvioFormulario);
    }

    function manejarSiguientePaso(evento) {
        evento.preventDefault();
        const pasoActual = this.closest('.paso-formulario');
        const numeroPasoActual = parseInt(pasoActual.dataset.paso);
        const siguientePaso = numeroPasoActual + 1;

        if (validarPaso(numeroPasoActual)) {
            mostrarPaso(siguientePaso);
        }
    }

    function manejarAnteriorPaso(evento) {
        evento.preventDefault();
        const pasoActual = this.closest('.paso-formulario');
        const numeroPasoActual = parseInt(pasoActual.dataset.paso);
        const pasoAnterior = numeroPasoActual - 1;

        mostrarPaso(pasoAnterior);
    }

    function mostrarPaso(numeroPaso) {
        // Ocultar todos los pasos
        pasosFormulario.forEach(paso => paso.classList.remove('activo'));
        
        // Mostrar paso actual
        document.querySelector(`.paso-formulario[data-paso="${numeroPaso}"]`).classList.add('activo');
        
        // Actualizar progreso
        actualizarPasosProgreso(numeroPaso);
        
        // Scroll al inicio
        window.scrollTo({ top: formulario.offsetTop - 100, behavior: 'smooth' });
    }

    function actualizarPasosProgreso(pasoActivo) {
        pasosProgreso.forEach(paso => {
            paso.classList.toggle('activo', paso.dataset.paso <= pasoActivo);
        });
    }

    function validarPaso(numeroPaso) {
        const paso = document.querySelector(`.paso-formulario[data-paso="${numeroPaso}"]`);
        let esValido = true;
        
        // Validar campos requeridos
        const camposRequeridos = paso.querySelectorAll('[required]');
        camposRequeridos.forEach(campo => {
            if (!campo.value.trim()) {
                campo.style.borderColor = '#ff5555';
                esValido = false;
                if (esValido === false) campo.focus();
            } else {
                campo.style.borderColor = '';
            }
        });

        // Validaciones específicas por paso
        switch(numeroPaso) {
            case 1:
                // Validación adicional para paso 1 si es necesaria
                break;
            case 2:
                // Validación adicional para paso 2 si es necesaria
                break;
            case 3:
                esValido = validarPasoPago() && esValido;
                break;
        }

        if (!esValido) {
            alert('Por favor complete todos los campos requeridos');
        }

        return esValido;
    }

    function validarPasoPago() {
        let esValido = true;
        
        // Validar método de pago seleccionado
        const metodoPago = document.querySelector('input[name="metodo_pago"]:checked');
        if (!metodoPago) {
            alert('Por favor seleccione un método de pago');
            esValido = false;
        } else if (metodoPago.value === 'tarjeta') {
            esValido = validarTarjetaCredito();
        }
        
        // Validar términos y condiciones
        if (!checkboxTerminos.checked) {
            alert('Debe aceptar los términos y condiciones');
            esValido = false;
        }
        
        return esValido;
    }

    function validarTarjetaCredito() {
        const numeroTarjeta = document.getElementById('numero_tarjeta').value.replace(/\s/g, '');
        const nombreTarjeta = document.getElementById('nombre_tarjeta').value.trim();
        const expiracionTarjeta = document.getElementById('expiracion_tarjeta').value.trim();
        const cvvTarjeta = document.getElementById('cvv_tarjeta').value.trim();
        
        let esValido = true;
        
        // Validar número de tarjeta (13-16 dígitos)
        if (!/^\d{13,16}$/.test(numeroTarjeta)) {
            marcarInvalido('numero_tarjeta');
            esValido = false;
        }
        
        // Validar nombre en tarjeta (mínimo 3 caracteres)
        if (nombreTarjeta.length < 3) {
            marcarInvalido('nombre_tarjeta');
            esValido = false;
        }
        
        // Validar fecha de expiración (MM/AA)
        if (!/^\d{2}\/\d{2}$/.test(expiracionTarjeta)) {
            marcarInvalido('expiracion_tarjeta');
            esValido = false;
        }
        
        // Validar CVV (3-4 dígitos)
        if (!/^\d{3,4}$/.test(cvvTarjeta)) {
            marcarInvalido('cvv_tarjeta');
            esValido = false;
        }
        
        if (!esValido) {
            alert('Por favor complete correctamente los datos de la tarjeta');
        }
        
        return esValido;
    }

    function marcarInvalido(idCampo) {
        const campo = document.getElementById(idCampo);
        if (campo) {
            campo.style.borderColor = '#ff5555';
            campo.focus();
        }
    }

    // fechas de inicio y fin
    function manejarCambioAlcance() {
        const mostrarCamposFecha = this.value === 'especifico';
        document.getElementById('grupo-fecha-inicio').style.display = mostrarCamposFecha ? 'block' : 'none';
        document.getElementById('grupo-fecha-fin').style.display = mostrarCamposFecha ? 'block' : 'none';
        actualizarResumen();
    }

    function manejarCambioFecha() {
        if (this.value) {
            const fecha = new Date(this.value);
            fecha.setDate(fecha.getDate() + 1);
            inputFechaFin.min = formatearFecha(fecha);
        }
        actualizarResumen();
    }

    function actualizarResumen() {
        // Actualizar tipo y alcance
        actualizarCampoResumen('resumen-tipo', selectorTipoAuditoria);
        actualizarCampoResumen('resumen-alcance', selectorAlcance);
        
        // Actualizar período
        actualizarResumenPeriodo();
        
        // Calcular y actualizar total estimado
        actualizarTotalEstimado();
    }

    function actualizarCampoResumen(idCampo, elementoSelect) {
        const campo = document.getElementById(idCampo);
        if (campo) {
            campo.textContent = elementoSelect.value ? 
                elementoSelect.options[elementoSelect.selectedIndex].text : 'No seleccionado';
        }
    }

    function actualizarResumenPeriodo() {
        const campoPeriodo = document.getElementById('resumen-periodo');
        if (!campoPeriodo) return;
        
        if (selectorAlcance.value === 'especifico') {
            const valorFechaInicio = inputFechaInicio.value;
            const valorFechaFin = inputFechaFin.value;
            
            if (valorFechaInicio && valorFechaFin) {
                campoPeriodo.textContent = `Del ${formatearFechaParaMostrar(valorFechaInicio)} al ${formatearFechaParaMostrar(valorFechaFin)}`;
            } else {
                campoPeriodo.textContent = 'Período específico (fechas no definidas)';
            }
        } else if (selectorAlcance.value) {
            campoPeriodo.textContent = selectorAlcance.options[selectorAlcance.selectedIndex].text;
        } else {
            campoPeriodo.textContent = 'No definido';
        }
    }

    function actualizarTotalEstimado() {
        const campoTotal = document.getElementById('resumen-total');
        if (!campoTotal) return;
        
        // Precios base por tipo de auditoría
        const preciosBase = {
            financiera: 2500,
            fiscal: 1800,
            operacional: 3200,
            cumplimiento: 2100,
            especial: 4000,
            sistemas: 3500
        };
        
        // Factores de ajuste
        const factoresTamano = {
            pequena: 1,
            mediana: 1.3,
            grande: 1.7
        };
        
        const factoresFacturacion = {
            menos_500k: 1,
            '500k-1m': 1.2,
            '1m-5m': 1.5,
            mas_5m: 2
        };
        
        let total = 0;
        
        if (selectorTipoAuditoria.value && preciosBase[selectorTipoAuditoria.value]) {
            total = preciosBase[selectorTipoAuditoria.value];
            
            // Ajustar por tamaño de empresa
            const tamanoEmpresa = document.getElementById('tamano_empresa').value;
            if (tamanoEmpresa && factoresTamano[tamanoEmpresa]) {
                total *= factoresTamano[tamanoEmpresa];
            }
            
            // Ajustar por facturación
            const facturacion = document.getElementById('facturacion_anual').value;
            if (facturacion && factoresFacturacion[facturacion]) {
                total *= factoresFacturacion[facturacion];
            }
        }
        
        campoTotal.textContent = `S/ ${total.toFixed(2)}`;
    }

    function manejarClickMetodoPago(evento) {
        const elementoMetodo = evento.currentTarget;
        const metodo = elementoMetodo.getAttribute('onclick').match(/'([^']+)'/)[1];
        seleccionarMetodoPago(metodo);
    }

    function seleccionarMetodoPago(metodo) {
        // Desmarcar todos los métodos
        document.querySelectorAll('.metodo-pago').forEach(elemento => {
            elemento.classList.remove('seleccionado');
        });
        
        // Ocultar todos los detalles
        document.querySelectorAll('.detalles-pago').forEach(elemento => {
            elemento.style.display = 'none';
        });
        
        // Marcar el seleccionado
        const metodoSeleccionado = document.querySelector(`.metodo-pago[onclick*="${metodo}"]`);
        if (metodoSeleccionado) {
            metodoSeleccionado.classList.add('seleccionado');
        }
        
        // Mostrar detalles correspondientes
        const elementoDetalles = document.getElementById(`detalles-${metodo}`);
        if (elementoDetalles) {
            elementoDetalles.style.display = 'block';
        }
        
        // Marcar el radio button
        const radioBoton = document.getElementById(`pago_${metodo}`);
        if (radioBoton) {
            radioBoton.checked = true;
        }
    }

    function formatearNumeroTarjeta(evento) {
        let valor = evento.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        let formateado = valor.replace(/(\d{4})/g, '$1 ').trim();
        evento.target.value = formateado;
    }

    function formatearExpiracionTarjeta(evento) {
        let valor = evento.target.value.replace(/[^0-9]/g, '');
        if (valor.length > 2) {
            valor = valor.substring(0, 2) + '/' + valor.substring(2, 4);
        }
        evento.target.value = valor;
    }

    function consultarSunat() {
        const ruc = document.getElementById('ruc').value.trim();
        
        if (!ruc) {
            alert('Por favor ingrese un RUC');
            return;
        }
        
        if (!/^\d{11}$/.test(ruc)) {
            alert('El RUC debe tener 11 dígitos');
            return;
        }
        
        // Simular consulta a SUNAT
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Consultando...';
        this.disabled = true;
        
        setTimeout(() => {
            // Datos de ejemplo (en una implementación real, esto sería una llamada API)
            const datosEmpresa = {
                razonSocial: 'EMPRESA DEMO SAC',
                estado: 'ACTIVO',
                direccion: 'CAL. LOS EJEMPLOS 123 - LIMA - LIMA - LIMA'
            };
            
            document.getElementById('razon_social').value = datosEmpresa.razonSocial;
            
            this.innerHTML = '<i class="fas fa-check"></i> Consultado';
            
            // Mostrar alerta con los datos
            alert(`Razón Social: ${datosEmpresa.razonSocial}\nEstado: ${datosEmpresa.estado}\nDirección: ${datosEmpresa.direccion}`);
            
            // Restablecer botón después de 2 segundos
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-search"></i> Consultar SUNAT';
                this.disabled = false;
            }, 2000);
        }, 1500);
    }

    function mostrarModalTerminos(evento) {
        evento.preventDefault();
        document.getElementById('modal-terminos').style.display = 'block';
    }

    function ocultarModalTerminos() {
        document.getElementById('modal-terminos').style.display = 'none';
    }

    function aceptarTerminos() {
        checkboxTerminos.checked = true;
        ocultarModalTerminos();
    }

    function manejarEnvioFormulario(evento) {
        evento.preventDefault();
        
        if (validarFormulario()) {     
            mostrarPaso(4);
        }
    }

    function validarFormulario() {
        // Validar todos los pasos antes de enviar
        for (let i = 1; i <= 3; i++) {
            if (!validarPaso(i)) {
                mostrarPaso(i);
                return false;
            }
        }
        return true;
    }

    // Funciones auxiliares
    function formatearFecha(fecha) {
        const d = new Date(fecha);
        let mes = '' + (d.getMonth() + 1);
        let dia = '' + d.getDate();
        const año = d.getFullYear();
        
        if (mes.length < 2) mes = '0' + mes;
        if (dia.length < 2) dia = '0' + dia;
        
        return [año, mes, dia].join('-');
    }

    function formatearFechaParaMostrar(fechaStr) {
        const opciones = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(fechaStr).toLocaleDateString('es-PE', opciones);
    }
});