const form = document.getElementById('formSuscripcion');
const mensaje = document.getElementById('mensaje');

// Elementos del modal
const modal = document.getElementById("modalExito");
const cerrarModal = document.getElementById("cerrarModal");
const botonAceptar = document.getElementById("botonAceptar");

form.addEventListener('submit', function (e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const apellidos = document.getElementById('apellidos').value.trim();
    const nacionalidad = document.getElementById('nacionalidad').value.trim();
    const edad = document.getElementById('edad').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const correo = document.getElementById('correo').value.trim();

    const campos = [nombre, apellidos, nacionalidad, edad, telefono, correo];

    // Validación
    if (campos.includes("") || isNaN(edad) || edad <= 0) {
        mostrarMensaje("⚠️ Por favor completa todos los campos correctamente.", "error");
        return;
    }

    if (!correo.includes("@") || !correo.includes(".")) {
        mostrarMensaje("❌ El correo electrónico no es válido.", "error");
        return;
    }

    // Mostrar ventana modal
    mostrarModal();
    console.log("Datos enviados:", { nombre, apellidos, nacionalidad, edad, telefono, correo });
    form.reset();
});

function mostrarMensaje(texto, tipo) {
    mensaje.textContent = texto;
    mensaje.className = `ventana-flotante ${tipo}`;
    mensaje.style.display = 'block';
    setTimeout(() => {
        mensaje.style.display = 'none';
    }, 4000);
}

function mostrarModal() {
    modal.style.display = "flex";
}

// Cerrar modal al hacer clic en el botón o en la "X"
cerrarModal.addEventListener("click", () => {
    modal.style.display = "none";
});

botonAceptar.addEventListener("click", () => {
    modal.style.display = "none";
});

