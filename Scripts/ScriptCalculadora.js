    
    let historialCalculos = [];
    
    // Cambiar entre pestañas
    function cambiarPestana(idPestana) {
    
    document.querySelectorAll('.contenido-pestana').forEach(contenido => {
        contenido.classList.remove('activa');
    });
    
    document.querySelectorAll('.pestana').forEach(pestana => {
        pestana.classList.remove('activa');
    });
    
    document.getElementById(idPestana).classList.add('activa');
    event.currentTarget.classList.add('activa');
    }
    
    // calcular impuestos segun el tipo de persona
    function calcularImpuesto() {
    const pestanaActiva = document.querySelector('.contenido-pestana.activa').id;
    let resultado;
    
    if (pestanaActiva === 'persona-natural') {
        resultado = calcularPersonaNatural();
    } else {
        resultado = calcularEmpresa();
    }
    
    mostrarResultado(resultado);
    guardarEnHistorial(resultado);
    }
    
    // calculo para Persona Natural
    function calcularPersonaNatural() {
    const tipo = document.getElementById("tipoImpuestoPN").value;
    const ingresos = parseFloat(document.getElementById("ingresosAnuales").value);
    const gastos = parseFloat(document.getElementById("gastosDeducibles").value) || 0;
    const regimen = document.getElementById("regimenPN").value;
    
    if (isNaN(ingresos)) {
        alert("Por favor ingrese un monto válido para ingresos");
        return null;
    }
    
    const baseImponible = ingresos - gastos;
    let impuesto = 0;
    let detalles = [];
    
    switch(tipo) {
        case "renta":
        if (regimen === "general") {
            // Escalones para renta general
            if (baseImponible <= 23000) {
            impuesto = 0;
            detalles.push({ concepto: "Exonerado", monto: 0 });
            } else if (baseImponible <= 92000) {
              impuesto = baseImponible * 0.08;
            detalles.push({ concepto: "8% sobre excedente", monto: impuesto });
            } else if (baseImponible <= 350000) {
              impuesto = 5520 + (baseImponible - 92000) * 0.14;
            detalles.push(
                { concepto: "8% hasta S/92,000", monto: 5520 },
                { concepto: "14% sobre excedente", monto: (baseImponible - 92000) * 0.14 }
            );
            } else {
              impuesto = 41400 + (baseImponible - 350000) * 0.30;
            detalles.push(
                { concepto: "8% hasta S/92,000", monto: 5520 },
                { concepto: "14% hasta S/350,000", monto: 35880 },
                { concepto: "30% sobre excedente", monto: (baseImponible - 350000) * 0.30 }
            );
            }
        } else if (regimen === "mype") {
            impuesto = baseImponible * 0.015; 
            detalles.push({ concepto: "Tasa MYPE (1.5%)", monto: impuesto });
        } else {
            // Renta 4ta
            impuesto = baseImponible * 0.065; 
            detalles.push({ concepto: "Renta 4ta (6.5%)", monto: impuesto });
        }
        break;
        
        case "iva":
          impuesto = baseImponible * 0.18;
        detalles.push({ concepto: "IVA (18%)", monto: impuesto });
        break;
        
        case "predial":
          impuesto = baseImponible * 0.02;
        detalles.push({ concepto: "Predial (2%)", monto: impuesto });
        break;
    }
    
    return {
        tipo: "Persona Natural - " + tipo.toUpperCase(),
        baseImponible: baseImponible,
        impuesto: impuesto,
        detalles: detalles,
        fecha: new Date().toLocaleString(),
        regimen: regimen
    };
    }
    
    // Cálculo para Empresa
    function calcularEmpresa() {
    const tipo = document.getElementById("tipoImpuestoEmp").value;
    const utilidad = parseFloat(document.getElementById("utilidadNeta").value);
    const regimen = document.getElementById("regimenEmp").value;
    const empleados = parseInt(document.getElementById("empleados").value) || 0;
    
    if (isNaN(utilidad)) {
        alert("Por favor ingrese un monto válido para utilidad");
        return null;
    }
    
    let impuesto = 0;
    let detalles = [];
    
    switch(tipo) {
        case "renta":
        if (regimen === "general") {
            impuesto = utilidad * 0.29; 
            detalles.push({ concepto: "Renta General (29.5%)", monto: impuesto });
        } else if (regimen === "mype") {
            impuesto = utilidad * 0.015; 
            detalles.push({ concepto: "Tasa MYPE (1.5%)", monto: impuesto });
        } else {
            impuesto = utilidad * 0.15; 
            detalles.push({ concepto: "Renta Exportadores (15%)", monto: impuesto });
        }
        break;
        
        case "iva":
        
          const ivaVentas = utilidad * 1.18 * 0.18;
        // Suponiendo 60% de compras
          const ivaCompras = utilidad * 0.6 * 0.18; 
        impuesto = ivaVentas - ivaCompras;
        
        detalles.push(
            { concepto: "IVA Ventas (18%)", monto: ivaVentas },
            { concepto: "Crédito Fiscal (60%)", monto: -ivaCompras }
        );
        break;
        
        case "detracciones":
        
          impuesto = utilidad * 0.12;
        detalles.push({ concepto: "Detracciones (12%)", monto: impuesto });
        break;
    }
    
    if (empleados > 5) {
        const beneficio = impuesto * 0.02 * empleados;
        detalles.push({ concepto: "Beneficio por empleados", monto: -beneficio });
        impuesto -= beneficio;
    }
    
    return {
        tipo: "Empresa - " + tipo.toUpperCase(),
        baseImponible: utilidad,
        impuesto: impuesto,
        detalles: detalles,
        fecha: new Date().toLocaleString(),
        regimen: regimen,
        empleados: empleados
    };
    }
    
    
    function mostrarResultado(resultado) {
    if (!resultado) return;
    
    const divResultado = document.getElementById("resultado");
    const divDesglose = document.getElementById("desglose-impuesto");
    const divTotal = document.getElementById("monto-total");
    
    document.getElementById("titulo-resultado").textContent = resultado.tipo;
    divDesglose.innerHTML = "";
    
    divDesglose.innerHTML += `
        <div class="item-desglose">
        <span>Base Imponible:</span>
        <span>S/${resultado.baseImponible.toFixed(2)}</span>
    </div>
    `;
    
      // mostrar los detalles del calculo
    resultado.detalles.forEach(item => {
        divDesglose.innerHTML += `
        <div class="item-desglose">
            <span>${item.concepto}:</span>
            <span>${item.monto >= 0 ? 'S/' : '-S/'}${Math.abs(item.monto).toFixed(2)}</span>
        </div>
        `;
    });

      // mostrar total
    divTotal.innerHTML = `
        <div>Total a Pagar:</div>
        <div>S/${resultado.impuesto.toFixed(2)}</div>
    `;
    
    divResultado.style.display = "block";
    }
    
    // historial
    function guardarEnHistorial(resultado) {
    if (!resultado) return;
    
    historialCalculos.unshift(resultado);
    if (historialCalculos.length > 5) {
        historialCalculos.pop();
    }
    
    actualizarHistorial();
    }
    
    // actualizar historial
    function actualizarHistorial() {
        const listaHistorial = document.getElementById("lista-historial");
        listaHistorial.innerHTML = "";
        
        historialCalculos.forEach((item, index) => {
        const elementoHistorial = document.createElement("div");
        elementoHistorial.className = "item-historial";
        elementoHistorial.innerHTML = `
        <strong>${item.tipo}</strong>
        <div>S/${item.impuesto.toFixed(2)} - ${item.fecha}</div>
        `;
        elementoHistorial.onclick = () => mostrarResultado(item);
        listaHistorial.appendChild(elementoHistorial);
    });
    }
    
    // inicializacion
    document.addEventListener("DOMContentLoaded", () => {
    historialCalculos = [
        {
        tipo: "Persona Natural - RENTA",
        baseImponible: 50000,
        impuesto: 4000,
        detalles: [{ concepto: "8% sobre excedente", monto: 4000 }],
        fecha: "30/06/2025, 10:30",
        regimen: "general"
        }
    ];
    actualizarHistorial();
    });