// =======================================================
// RESERVAS PARA GRUPOS (+12 personas) - Loco X Todo
// =======================================================
// ⚠️ EDITAR: mismo número que NUMERO_WHATSAPP_PIZZERIA en js/pizzaConfig.js
const NUMERO_WHATSAPP_RESERVAS = "5492323527915"; // formato: 549 + código de área + número, sin espacios ni símbolos

// ----- Reglas de horario -----
const MIN_PERSONAS = 12; // "más de 11 personas"

const TURNOS = {
    manana: {
        label: "Mañana",
        aperturaLocal: "11:30",
        cierreLocal: "16:00",
        inicioReserva: "11:30", // desde cuándo se puede reservar
        finReserva: "14:00",    // hasta cuándo se puede reservar
    },
    noche: {
        label: "Noche",
        aperturaLocal: "19:00",
        cierreLocal: "00:00",
        inicioReserva: "19:00",
        finReserva: "22:30",
    },
};

const PASO_MINUTOS = 30;
const TOLERANCIA_MINUTOS = 20;

// ----- Helpers -----
function hhmmAMinutos(hhmm) {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
}

function minutosAHHMM(mins) {
    const h = Math.floor(mins / 60) % 24;
    const m = mins % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

// Genera los horarios disponibles (cada 30 min) para un turno dado
function generarHorarios(turnoKey) {
    const turno = TURNOS[turnoKey];
    const inicio = hhmmAMinutos(turno.inicioReserva);
    const fin = hhmmAMinutos(turno.finReserva);
    const horarios = [];
    for (let m = inicio; m <= fin; m += PASO_MINUTOS) {
        horarios.push(minutosAHHMM(m));
    }
    return horarios;
}

function esLunes(fecha) {
    // getDay(): 0 = domingo, 1 = lunes ...
    return fecha.getDay() === 1;
}

function mostrarAlerta(mensaje, tipo = "danger") {
    const cont = document.getElementById("reserva-alertas");
    if (!cont) return;
    cont.innerHTML = `
        <div class="alert alert-${tipo} py-2 px-3" role="alert" style="font-size: 0.9rem;">
            ${mensaje}
        </div>`;
}

function limpiarAlerta() {
    const cont = document.getElementById("reserva-alertas");
    if (cont) cont.innerHTML = "";
}

// ----- Inicialización -----
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-reservas");
    if (!form) return; // la sección de reservas no está en esta página

    const inputFecha = document.getElementById("reserva-fecha");
    const notaFecha = document.getElementById("reserva-fecha-nota");
    const radiosTurno = document.querySelectorAll('input[name="reservaTurno"]');
    const avisoLunes = document.getElementById("turno-manana-bloqueada");
    const selectHora = document.getElementById("reserva-hora");
    const inputPersonas = document.getElementById("reserva-personas");
    const radiosMas = document.querySelectorAll('input[name="reservaPosibleMas"]');
    const contMasPersonas = document.getElementById("mas-personas-container");
    const inputPersonasMax = document.getElementById("reserva-personas-max");

    let fpInstance = null;

    // --- Flatpickr para la fecha (bloquea fechas pasadas) ---
    if (window.flatpickr) {
        fpInstance = flatpickr(inputFecha, {
            dateFormat: "d/m/Y",
            minDate: "today",
            locale: {
                firstDayOfWeek: 1,
                weekdays: {
                    shorthand: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
                    longhand: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
                },
                months: {
                    shorthand: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
                    longhand: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
                },
            },
            onChange: actualizarSegunFecha,
        });
    }

    function turnoSeleccionado() {
        return document.querySelector('input[name="reservaTurno"]:checked').value;
    }

    // Chequea si el día elegido es lunes y bloquea el turno mañana
    function actualizarSegunFecha(selectedDates) {
        const fecha = selectedDates && selectedDates[0];
        const esLunesSeleccionado = fecha ? esLunes(fecha) : false;
        const radioManana = document.getElementById("turno-manana");
        const radioNoche = document.getElementById("turno-noche");

        radioManana.disabled = esLunesSeleccionado;
        avisoLunes.style.display = esLunesSeleccionado ? "block" : "none";

        if (esLunesSeleccionado && turnoSeleccionado() === "manana") {
            radioNoche.checked = true;
        }

        actualizarHorarios();
    }

    // Regenera el <select> de horarios según el turno activo
    function actualizarHorarios() {
        const turno = turnoSeleccionado();
        const horarios = generarHorarios(turno);
        selectHora.innerHTML = horarios
            .map((h) => `<option value="${h}">${h} hs</option>`)
            .join("");
    }

    radiosTurno.forEach((r) => r.addEventListener("change", actualizarHorarios));

    radiosMas.forEach((r) =>
        r.addEventListener("change", () => {
            const activo = document.getElementById("mas-si").checked;
            contMasPersonas.style.display = activo ? "block" : "none";
        })
    );

    // Inicializar horarios al cargar
    actualizarHorarios();

    // --- Envío del formulario ---
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        limpiarAlerta();

        const nombre = document.getElementById("reserva-nombre").value.trim();
        const fechaTexto = inputFecha.value.trim();
        const fechaObj = fpInstance && fpInstance.selectedDates[0];
        const turno = turnoSeleccionado();
        const hora = selectHora.value;
        const personas = parseInt(inputPersonas.value, 10);
        const posibleMas = document.querySelector('input[name="reservaPosibleMas"]:checked').value;
        const personasMax = inputPersonasMax.value ? parseInt(inputPersonasMax.value, 10) : null;

        // --- Validaciones ---
        if (!nombre) {
            mostrarAlerta("Por favor, ingresá el nombre para la reserva.");
            return;
        }
        if (!fechaTexto || !fechaObj) {
            mostrarAlerta("Por favor, elegí una fecha para la reserva.");
            return;
        }
        if (esLunes(fechaObj) && turno === "manana") {
            mostrarAlerta("Los lunes a la mañana permanecemos cerrados. Elegí el turno noche.");
            return;
        }
        if (!hora) {
            mostrarAlerta("Por favor, elegí un horario.");
            return;
        }
        if (!personas || personas < MIN_PERSONAS) {
            mostrarAlerta(`Las reservas de grupo son para más de 12 personas (mínimo ${MIN_PERSONAS}).`);
            return;
        }
        if (posibleMas === "si" && personasMax && personasMax < personas) {
            mostrarAlerta("La cantidad máxima estimada no puede ser menor a la cantidad de personas confirmadas.");
            return;
        }

        // --- Armado del mensaje ---
        const lineaMas =
            posibleMas === "si"
                ? `Sí${personasMax ? ` (hasta aprox. ${personasMax} personas)` : ""}`
                : "No";

        const mensaje = [
            "🍕 *RESERVA PARA GRUPO - Loco X Todo*",
            "",
            `👤 *Nombre:* ${nombre}`,
            `📅 *Fecha:* ${fechaTexto}`,
            `🕒 *Turno:* ${TURNOS[turno].label}`,
            `⏰ *Horario de llegada:* ${hora} hs (tolerancia de ${TOLERANCIA_MINUTOS} min)`,
            `👥 *Cantidad de personas:* ${personas}`,
            `➕ *¿Posibilidad de más personas?:* ${lineaMas}`,
        ].join("\n");

        const url = `https://wa.me/${NUMERO_WHATSAPP_RESERVAS}?text=${encodeURIComponent(mensaje)}`;
        window.open(url, "_blank", "noopener");

        mostrarAlerta("¡Listo! Te llevamos a WhatsApp para confirmar tu reserva.", "success");
        form.reset();
        contMasPersonas.style.display = "none";
        actualizarHorarios();
    });
});
