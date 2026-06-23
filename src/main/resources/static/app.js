console.log("✅ app.js cargado correctamente");

/* =========================
   VARIABLES GLOBALES
========================= */
const secciones = document.querySelectorAll(".seccion");

const tablaHabitaciones = document.getElementById("tablaHabitaciones");
const tablaClientes = document.getElementById("tablaClientes");
const tablaReservas = document.getElementById("tablaReservas");
const tablaDashboard = document.getElementById("tablaDashboard");
const tablaAgenda = document.getElementById("tablaAgenda");
const reservaCliente = document.getElementById("reservaCliente");
const reservaHabitacion = document.getElementById("reservaHabitacion");
const fechaIngreso = document.getElementById("fechaIngreso");
const fechaSalida = document.getElementById("fechaSalida");


/* =========================
   NAVEGACIÓN
========================= */
function mostrarSeccion(id) {
    secciones.forEach(s => s.style.display = "none");
    document.getElementById(id).style.display = "block";

    if (id === "reservas") {
        cargarHabitaciones();
    }
}

/* =========================
   LOGIN / LOGOUT
========================= */
function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("/api/clientes/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })
    .then(r => r.json())
    .then(data => {
        localStorage.setItem("usuario", data.email);
        localStorage.setItem("rol", data.rol);
        localStorage.setItem("clienteId", data.id);

        document.getElementById("usuarioLogueado").innerText =
            `${data.nombre} (${data.rol})`;

        mostrarSeccion("inicio");
        cargarHabitaciones();
        cargarClientes();
        cargarReservas();
        cargarAgenda();
    })
    .catch(() => {
        document.getElementById("mensajeLogin").innerText =
            "Credenciales incorrectas";
    });
}

function cerrarSesion() {
    localStorage.clear();
    location.reload();
}

/* =========================
   HABITACIONES
========================= */
function guardarHabitacion() {
    fetch("/api/habitaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            numero: numero.value,
            tipo: tipo.value,
            precio: precio.value
        })
    }).then(() => {
        numero.value = "";
        tipo.value = "";
        precio.value = "";
        cargarHabitaciones();
    });
}

function cargarHabitaciones() {
    fetch("/api/habitaciones")
        .then(r => r.json())
        .then(data => {
            tablaHabitaciones.innerHTML = "";

            data.forEach(h => {
                const estadoClase =
                    h.estado === "DISPONIBLE" ? "estado-disponible" : "estado-ocupada";

                const estadoIcono =
                    h.estado === "DISPONIBLE" ? "🟢" : "🔴";

                tablaHabitaciones.innerHTML += `
                    <tr>
                        <td>${h.numero}</td>
                        <td>${h.tipo}</td>
                        <td>$${h.precio}</td>
                        <td class="${estadoClase}">
                            ${estadoIcono} ${h.estado}
                        </td>
                    </tr>
                `;
            });
        });
}

function buscarHabitaciones() {
    const inicio = fechaIngreso.value;
    const fin = fechaSalida.value;


    if (!inicio || !fin) {
        alert("Seleccione fechas");
        return;
    }

    fetch(`/api/disponibilidad/avanzada?inicio=${inicio}&fin=${fin}`)
        .then(r => r.json())
        .then(data => {
            reservaHabitacion.innerHTML =
                `<option value="">Seleccione habitación</option>`;

            data.forEach(h => {
                reservaHabitacion.innerHTML += `
                    <option value="${h.id}">
                        Hab ${h.numero} - ${h.tipo} ($${h.precio})
                    </option>
                `;
            });
        });
}

/* =========================
   CLIENTES
========================= */
function guardarCliente() {
    fetch("/api/clientes/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nombre: nombreCliente.value,
            email: emailCliente.value,
            password: passwordCliente.value
        })
    }).then(() => {
        nombreCliente.value = "";
        emailCliente.value = "";
        passwordCliente.value = "";
        cargarClientes();
    });
}

function cargarClientes() {
    fetch("/api/clientes")
        .then(r => r.json())
        .then(data => {
            tablaClientes.innerHTML = "";
            reservaCliente.innerHTML = `<option value="">Seleccione cliente</option>`;

            data.forEach(c => {
                tablaClientes.innerHTML += `
                    <tr>
                        <td>${c.id}</td>
                        <td>${c.nombre}</td>
                        <td>${c.email}</td>
                    </tr>
                `;

                reservaCliente.innerHTML += `
                    <option value="${c.id}">
                        ${c.nombre} (${c.email})
                    </option>
                `;
            });
        });
}

/* =========================
   RESERVAS
========================= */
function crearReserva() {
    const clienteId = localStorage.getItem("clienteId");
    const habitacionId = reservaHabitacion.value;
    const ingreso = fechaIngreso.value;
    const salida = fechaSalida.value;


    if (!habitacionId || !ingreso || !salida) {
        alert("Completa todos los campos");
        return;
    }

    if (!confirm("¿Confirmar reserva?")) return;

    fetch("/api/reservas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            clienteId,
            habitacionId,
            fechaIngreso: ingreso,
            fechaSalida: salida
        })
    })
    .then(() => {
        alert(  `📧 CORREO SIMULADO\n\nReserva CONFIRMADA\nHabitación ${habitacionId}`
        );
        cargarReservas();
        cargarHabitaciones();
        cargarDashboard();
        cargarAgenda();
    });
}
function cargarReservas() {
    fetch("/api/reservas")
        .then(r => r.json())
        .then(data => {
            tablaReservas.innerHTML = "";

            data.forEach(r => {
                tablaReservas.innerHTML += `
                <tr>
                    <td>${r.id}</td>
                    <td>${r.habitacion.numero}</td>
                    <td>${r.fechaIngreso}</td>
                    <td>${r.fechaSalida}</td>
                    <td class="${r.estado.toLowerCase()}">${r.estado}</td>
                    <td>
                        <button class="btn-cancelar"
                            onclick="cancelarReserva(${r.id})">
                            Cancelar
                        </button>
                    </td>
                </tr>`;
            });
        });
}

function cancelarReserva(id) {
    if (!confirm("¿Cancelar esta reserva?")) return;

    fetch(`/api/reservas/${id}`, { method: "DELETE" })
        .then(() => {
            alert(
                `📧 CORREO SIMULADO\n\nReserva CANCELADA\nID ${id}`
            );
            cargarReservas();
            cargarHabitaciones();
        });
}

/* =========================
   DASHBOARD
========================= */
function cargarDashboard() {
    fetch("/api/reservas")
        .then(r => r.json())
        .then(data => {
            tablaDashboard.innerHTML = "";
            let activas = 0;
            let canceladas = 0;

            data.forEach(r => {
                if (r.estado === "ACTIVA") activas++;
                if (r.estado === "CANCELADA") canceladas++;

                tablaDashboard.innerHTML += `
                <tr>
                    <td>${r.id}</td>
                    <td>${r.habitacion.numero}</td>
                    <td>${r.fechaIngreso}</td>
                    <td>${r.fechaSalida}</td>
                    <td>${r.estado}</td>
                </tr>`;
            });

            totalReservas.innerText = data.length;
            reservasActivas.innerText = activas;
            reservasCanceladas.innerText = canceladas;
        });
}

/* =========================
   AGENDA
========================= */
function cargarAgenda() {
    fetch("/api/reservas")
        .then(r => r.json())
        .then(data => {
            tablaAgenda.innerHTML = "";
            data.forEach(r => {
                tablaAgenda.innerHTML += `
                <tr>
                    <td>${r.habitacion.numero}</td>
                    <td>${r.fechaIngreso}</td>
                    <td>${r.fechaSalida}</td>
                    <td>${r.cliente.email}</td>
                </tr>`;
            });
        });
}

/* =========================
   ON LOAD
========================= */
window.onload = () => {
    mostrarSeccion("login");
};