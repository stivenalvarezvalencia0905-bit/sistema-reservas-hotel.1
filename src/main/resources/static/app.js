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

// 📆 Vista del calendario (mensual o semanal)
let vistaActual = "MENSUAL";

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

        // 1️⃣ Guardar usuario completo
        sessionStorage.setItem("usuario", JSON.stringify(data));
       
        // 2️⃣ Mostrar nombre arriba
        document.getElementById("usuarioLogueado").innerText =
            `${data.nombre} (${data.rol})`;

        // 3️⃣ Aplicar permisos por rol 
        aplicarRol();

        // 4️⃣ Entrar al sistema
        mostrarSeccion("inicio");

    })
    .catch(() => {
        document.getElementById("mensajeLogin").innerText =
            "Credenciales incorrectas";
    });
}

function cerrarSesion() {
    sessionStorage.clear();   // 🔐 limpia la sesión actual
    location.reload();        // 🔄 vuelve al login
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
                    <td>
                        <span class="badge badge-${h.estado.toLowerCase()}">
                            ${h.estado}
                        </span>
                    </td>
                </tr>`;
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

function seleccionarHabitacion(id) {
    mostrarSeccion("reservas");
    reservaHabitacion.value = id;
}

function cargarTarjetasHabitaciones() {
    const contenedor = document.getElementById("cardsHabitaciones");
    if (!contenedor) {
        console.warn("⚠ cardsHabitaciones no existe en el DOM");
        return;
    }

    fetch("/api/habitaciones")
        .then(r => r.json())
        .then(data => {
            contenedor.innerHTML = "";

            if (data.length === 0) {
                contenedor.innerHTML = "<p>No hay habitaciones registradas</p>";
                return;
            }

            data.forEach(h => {
                contenedor.innerHTML += `
                <div class="card-habitacion">
                    <img src="/img/habitacion${h.id % 3 + 1}.jpg" alt="Habitación">

                    <div class="card-body">
                        <h3>Habitación ${h.numero}</h3>
                        <p>Tipo: ${h.tipo}</p>

                        <span class="badge badge-${h.estado.toLowerCase()}">
                            ${h.estado}
                        </span>

                        <div class="card-precio">
                            $${h.precio} / noche
                        </div>

                        ${
                            h.estado === "DISPONIBLE"
                            ? `<button class="btn-reservar"
                                onclick="seleccionarHabitacion(${h.id})">
                                Reservar
                              </button>`
                            : ""
                        }
                    </div>
                </div>`;
            });
        })
        .catch(err => {
            console.error("Error cargando tarjetas:", err);
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
    const usuario = JSON.parse(sessionStorage.getItem("usuario"));
    if (!usuario) {
        alert("Sesión no válida");
        return;
    }

    const clienteId = usuario.id;
    const habitacionId = Number(reservaHabitacion.value);

    const fechaIngresoInput = document.getElementById("fechaIngreso");
    const fechaSalidaInput = document.getElementById("fechaSalida");

    if (!fechaIngresoInput || !fechaSalidaInput) {
        alert("Inputs de fecha no encontrados");
        return;
    }

    const ingreso = fechaIngresoInput.value;
    const salida = fechaSalidaInput.value;

    if (!habitacionId || !ingreso || !salida) {
        alert("Completa todos los campos");
        return;
    }

    if (salida <= ingreso) {
        alert("La fecha de salida debe ser posterior al ingreso");
        return;
    }

    if (!confirm("¿Confirmar reserva?")) return;

    fetch("/api/reservas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            clienteId: clienteId,
            habitacionId: habitacionId,
            fechaIngreso: ingreso,
            fechaSalida: salida
        })
    })
    .then(r => {
        if (!r.ok) throw new Error("Error al crear reserva");
        return r.text(); 
    })
    .then(() => {
        alert("Reserva confirmada");
        cargarReservas();
        cargarHabitaciones();
        cargarDashboard();
        cargarAgenda();
    })
    .catch(err => {
        console.error(err);
        alert("Error creando la reserva");
    });
}

function cargarReservas() {
    fetch("/api/reservas")
        .then(r => r.json())
        .then(data => {
            tablaReservas.innerHTML = "";

            if (data.length === 0) {
                tablaReservas.innerHTML = `
                    <tr>
                        <td colspan="6">No hay reservas registradas</td>
                    </tr>`;
                return;
            }

            data.forEach(r => {
                tablaReservas.innerHTML += `
                <tr>
                    <td>${r.id}</td>
                    <td>${r.habitacion.numero}</td>
                    <td>${r.fechaIngreso}</td>
                    <td>${r.fechaSalida}</td>
                    <td>
                        <span class="badge badge-${r.estado.toLowerCase()}">
                            ${r.estado}
                        </span>
                    </td>
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

function mostrarAgenda(reservas) {
    const tabla = document.getElementById("tablaAgenda");
    tabla.innerHTML = ""; // limpiar tabla

    reservas.forEach(r => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${r.habitacion.numero}</td>
            <td>${r.fechaIngreso}</td>
            <td>${r.fechaSalida}</td>
            <td>${r.cliente.nombre}</td>
        `;

        fila.onclick = () => {
            alert(
                `📅 Detalle de reserva\n\n` +
                `Habitación: ${r.habitacion.numero}\n` +
                `Cliente: ${r.cliente.nombre}\n` +
                `Ingreso: ${r.fechaIngreso}\n` +
                `Salida: ${r.fechaSalida}`
            );
        };

        tabla.appendChild(fila);
    });
}

function aplicarRol() {
    const usuario = JSON.parse(sessionStorage.getItem("usuario"));
    if (!usuario) return;

    const rol = usuario.rol;

    /* =========================
       OCULTAR TODO POR DEFECTO
    ========================= */
    ocultar("btnGuardarHabitacion");
    ocultar("btnGuardarCliente");
    ocultar("dashboard");

    ocultar("formHabitaciones");
    ocultar("tablaHabitacionesWrapper");
    ocultar("habitacionesCards");

    ocultar("clientes");
    ocultar("reservas");
    ocultar("agenda");

    /* =========================
       ADMIN
    ========================= */
    if (rol === "ADMIN") {
        mostrar("dashboard");
        mostrar("clientes");
        mostrar("habitaciones");
        mostrar("reservas");
        mostrar("agenda");

        mostrar("formHabitaciones");
        mostrar("tablaHabitacionesWrapper");
        ocultar("habitacionesCards");

        mostrar("btnGuardarHabitacion");
        mostrar("btnGuardarCliente");
    }

    /* =========================
       RECEPCIONISTA
    ========================= */
    if (rol === "RECEPCIONISTA") {
        mostrar("dashboard"); // ✅ AJUSTE CLAVE

        mostrar("habitaciones");
        mostrar("clientes");
        mostrar("reservas");
        mostrar("agenda");

        mostrar("tablaHabitacionesWrapper");
        ocultar("formHabitaciones");
        ocultar("habitacionesCards");
    }

    /* =========================
       CLIENTE
    ========================= */
    if (rol === "CLIENTE") {
        mostrar("habitaciones");
        mostrar("reservas");

        ocultar("tablaHabitacionesWrapper");
        ocultar("formHabitaciones");
        mostrar("habitacionesCards");
    }
}

function ocultar(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
}

function mostrar(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = "block";
}

function mostrar(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = "block";
}

function cargarCalendario() {

    if (vistaActual === "MENSUAL") {
        const valor = document.getElementById("mesCalendario").value;
        if (!valor) {
            alert("Seleccione un mes");
            return;
        }

        const [anio, mes] = valor.split("-");

        fetch(`/api/reservas/calendario-mensual?mes=${parseInt(mes)}&anio=${parseInt(anio)}`)
            .then(r => r.json())
            .then(data => {
                if (data.length === 0) {
                    alert("No hay reservas en este mes");
                }
                mostrarAgenda(data);
            });

    } else {
        const semana = document.getElementById("semanaCalendario").value;
        if (!semana) {
            alert("Seleccione una semana");
            return;
        }

        // 🧠 convertir semana ISO a fecha real
        const [anio, week] = semana.split("-W");
        const primerDia = new Date(anio, 0, 1 + (week - 1) * 7);
        const inicio = new Date(primerDia);
        const fin = new Date(primerDia);
        fin.setDate(inicio.getDate() + 6);

        fetch(`/api/reservas/entre-fechas?inicio=${inicio.toISOString().slice(0,10)}&fin=${fin.toISOString().slice(0,10)}`)
            .then(r => r.json())
            .then(data => {
                if (data.length === 0) {
                    alert("No hay reservas en esta semana");
                }
                mostrarAgenda(data);
            });
    }
}

function construirCalendario(reservas, mes, anio) {
    const tabla = document.getElementById("tablaAgenda");
    tabla.innerHTML = "";

    const diasMes = new Date(anio, mes, 0).getDate();

    const habitaciones = {};

    reservas.forEach(r => {
        const hab = r.habitacion.numero;
        if (!habitaciones[hab]) habitaciones[hab] = [];
        habitaciones[hab].push(r);
    });

    Object.keys(habitaciones).forEach(numero => {
        let fila = `<tr><td>Hab ${numero}</td>`;

        for (let d = 1; d <= diasMes; d++) {
            const fecha = `${anio}-${mes.padStart(2,"0")}-${String(d).padStart(2,"0")}`;

            let estado = "disponible";

            habitaciones[numero].forEach(r => {
                if (fecha >= r.fechaIngreso && fecha <= r.fechaSalida) {
                    estado = "ocupada";
                }
            });

            fila += `<td class="${estado}"></td>`;
        }

        fila += "</tr>";
        tabla.innerHTML += fila;
    });
}
function vistaMensual() {
    vistaActual = "MENSUAL";
    document.getElementById("mesCalendario").style.display = "block";
    document.getElementById("semanaCalendario").style.display = "none";
}

function vistaSemanal() {
    vistaActual = "SEMANAL";
    document.getElementById("mesCalendario").style.display = "none";
    document.getElementById("semanaCalendario").style.display = "block";

}

/* =========================
   ON LOAD
========================= */
window.onload = () => {
    mostrarSeccion("login");
    vistaMensual(); // sincroniza inputs
    cargarTarjetasHabitaciones();
};