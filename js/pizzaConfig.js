// =======================================================
// pizzaConfig.js: Lógica del Configurador y Carrito
// =======================================================

import { allSabores, allBebidas, PRECIO_MUZZA_PURA, PRECIO_PIZZA_ESPECIAL } from './dataLoader.js'; 

// 1. VARIABLES GLOBALES
const PROMO_DESCUENTO_POR_PIZZA_ADICIONAL = 1000; // Se descuenta 1 vez por cada pizza después de la primera
let pizzaActual = []; 
let currentCart = [];
let pizzaEditandoId = null; // Guarda el ID de la pizza que se está editando
let listaPizzasExpandida = false; // Si el acordeón de "Pizzas en tu pedido" está desplegado
let totalPedidoActual = 0; // Total calculado en irAlCheckout, lo usa enviarPedidoDefinitivo

// ⚠️ EDITAR: Reemplazar por el número real de WhatsApp de la pizzería.
// Formato: código de país + número, todo junto, sin "+", espacios ni guiones.
// Ejemplo Argentina: 54 9 11 2345-6789 → "5491123456789"
const NUMERO_WHATSAPP_PIZZERIA = "5492323527915";

/**
 * Calcula subtotal, descuento de la promo multipizza y total de las
 * pizzas que ya están en el carrito, separando muzza pura de especiales
 * porque cada tipo tiene su propio precio base y su propia escalera de
 * descuento. Se usa tanto para el cuadrito debajo de "Pizzas en tu
 * pedido" como para el total del checkout.
 */
function calcularResumenPizzas() {
    const pizzas = currentCart.filter(item => item.tipo === 'pizza');
    const muzzaCantidad = pizzas.filter(p => esMuzzaPura(p.sabores)).length;
    const especialCantidad = pizzas.length - muzzaCantidad;

    const muzza = calcularResumenGrupo(muzzaCantidad, PRECIO_MUZZA_PURA);
    const especial = calcularResumenGrupo(especialCantidad, PRECIO_PIZZA_ESPECIAL);

    return {
        cantidad: pizzas.length,
        subtotal: muzza.subtotal + especial.subtotal,
        descuento: muzza.descuento + especial.descuento,
        total: muzza.total + especial.total,
        muzza,
        especial
    };
}

/**
 * Muestra un mensajito flotante (toast) que se desvanece solo, en vez
 * de un alert() nativo que bloquea la pantalla hasta que el cliente
 * apreta OK. tipo: 'exito' (verde) o 'error' (rojo).
 */
function mostrarMensaje(texto, tipo = 'exito') {
    const contenedor = document.getElementById('toast-container');
    if (!contenedor) return;

    const toast = document.createElement('div');
    toast.className = `toast-mensaje toast-${tipo}`;
    toast.textContent = texto;
    contenedor.appendChild(toast);

    // Forzamos un frame antes de agregar la clase, para que la transición de entrada se vea
    requestAnimationFrame(() => toast.classList.add('toast-mostrar'));

    setTimeout(() => {
        toast.classList.remove('toast-mostrar');
        setTimeout(() => toast.remove(), 300); // Esperamos a que termine el fade-out antes de sacarlo del DOM
    }, 2200);
}

/**
 * Una pizza es "muzza pura" solo si tiene un único sabor, Muzzarella,
 * ocupando los 4 cuartos completos. Cualquier otra combinación —incluso
 * 3/4 muzza + 1/4 de otro sabor— es "especial".
 */
function esMuzzaPura(sabores) {
    return sabores.length === 1 && sabores[0].sabor === 'Muzzarella' && sabores[0].cuartos === 4;
}

/**
 * Devuelve el precio base que corresponde a una combinación de sabores.
 */
function calcularPrecioPizza(sabores) {
    return esMuzzaPura(sabores) ? PRECIO_MUZZA_PURA : PRECIO_PIZZA_ESPECIAL;
}

/**
 * Nombre de producto legible según el tipo de pizza.
 */
function nombrePizza(sabores) {
    return esMuzzaPura(sabores)
        ? 'Pizza de Muzzarella'
        : `Pizza Especial (${sabores.length} sabor${sabores.length > 1 ? 'es' : ''})`;
}

/**
 * Calcula subtotal, descuento y total de un grupo de pizzas del mismo
 * precio base. El descuento de la promo (-$1000 acumulado) se calcula
 * de forma independiente para cada grupo (muzza pura vs especial).
 */
function calcularResumenGrupo(cantidad, precioBase) {
    const subtotal = precioBase * cantidad;
    const descuento = cantidad > 1 ? PROMO_DESCUENTO_POR_PIZZA_ADICIONAL * (cantidad - 1) : 0;
    const total = subtotal - descuento;
    return { cantidad, subtotal, descuento, total };
}
function fraccionTexto(cuartos) {
    switch (cuartos) {
        case 1: return "1/4";
        case 2: return "1/2";
        case 3: return "3/4";
        case 4: return "Entera";
        default: return `${cuartos}/4`;
    }
}

/**
 * Suma los cuartos ya asignados entre todos los sabores elegidos.
 * Una pizza completa siempre debe sumar 4.
 */
function totalCuartosAsignados() {
    return pizzaActual.reduce((acc, item) => acc + item.cuartos, 0);
}

/**
 * Da vuelta un array de sabores (con sus cuartos) en un texto legible,
 * ej: "1/2 Jamón, 1/4 Huevo Rallado, 1/4 Berenjena".
 */
function formatearSabores(sabores) {
    return sabores.map(item => `${fraccionTexto(item.cuartos)} ${item.sabor}`).join(', ');
}

/**
 * Habilita o bloquea los botones de guardar según si la pizza actual
 * ya tiene sus 4 cuartos asignados.
 */
function actualizarEstadoBotonGuardar() {
    const listo = totalCuartosAsignados() === 4;
    ['btn-add-another', 'btn-save-edit'].forEach(id => {
        const btn = document.getElementById(id);
        if (!btn) return;
        btn.disabled = !listo;
        btn.style.opacity = listo ? '1' : '0.5';
        btn.style.cursor = listo ? 'pointer' : 'not-allowed';
    });
}

/**
 * Ajusta dinámicamente la altura máxima de la lista de sabores
 * para que coincida con la columna del resumen (tanto en PC como en celular).
 */
function ajustarAlturaSabores() {
    const saboresContainer = document.getElementById('sabores-list-container');
    const resumenColumna = document.getElementById('resumen-columna');
    
    if (!saboresContainer || !resumenColumna) return;

    const alturaResumen = resumenColumna.offsetHeight;
    saboresContainer.style.maxHeight = `${alturaResumen}px`;
}

/**
 * Inicializa el configurador: dibuja la grilla de sabores y conecta el buscador.
 */
function initializeConfigurator() {
    const saboresContainer = document.getElementById('sabores-list-container');
    if (!saboresContainer) return;

    if (!allSabores || allSabores.length === 0) {
        saboresContainer.innerHTML = "<p>No hay sabores disponibles.</p>";
        return;
    }

    const htmlContent = allSabores.map(createSaborCard).join('');
    saboresContainer.innerHTML = htmlContent;

    const searchInput = document.getElementById('sabor-search');
    if (searchInput) {
        searchInput.addEventListener('input', filterSabores);
    }

    setTimeout(ajustarAlturaSabores, 50);
    window.addEventListener('resize', ajustarAlturaSabores);
}

/**
 * Genera el HTML de la tarjeta de un sabor (Versión accesible y compacta).
 * Si el sabor está elegido, en vez del ícono +/✔ muestra un stepper
 * para asignarle cuartos (1/4, 1/2, 3/4 o Entera).
 */
function createSaborCard(sabor) {
    const elegido = pizzaActual.find(item => item.sabor === sabor.nombre);

    if (!elegido) {
        return `
            <div class="sabor-card-mini" onclick="toggleSabor('${sabor.nombre}')">
                <span class="sabor-name">${sabor.nombre}</span>
                <span class="sabor-status-icon">+</span>
            </div>
        `;
    }

    return `
        <div class="sabor-card-mini selected">
            <span class="sabor-name">${sabor.nombre}</span>
            <div class="cuartos-stepper">
                <button type="button" class="btn-cuarto" onclick="decrementarCuartos('${sabor.nombre}')">−</button>
                <span class="cuartos-label">${fraccionTexto(elegido.cuartos)}</span>
                <button type="button" class="btn-cuarto" onclick="incrementarCuartos('${sabor.nombre}')">+</button>
            </div>
        </div>
    `;
}

/**
 * Vuelve a dibujar toda la grilla de sabores (más simple y robusto que
 * parchear tarjeta por tarjeta, ahora que cada una puede tener un stepper).
 * Si había texto en el buscador, se lo vuelve a aplicar.
 */
function refrescarGrillaSabores() {
    const saboresContainer = document.getElementById('sabores-list-container');
    if (!saboresContainer) return;

    saboresContainer.innerHTML = allSabores.map(createSaborCard).join('');

    const searchInput = document.getElementById('sabor-search');
    if (searchInput && searchInput.value) {
        filterSabores({ target: searchInput });
    }
}

/**
 * Limpia todos los sabores seleccionados de la pizza actual.
 */
window.limpiarPizza = function() {
    pizzaActual = [];
    updatePizzaSummary();
    refrescarGrillaSabores();
};

/**
 * Agrega un sabor nuevo (con 1/4 por defecto) o lo saca por completo
 * si ya estaba elegido (liberando los cuartos que tenía asignados).
 */
window.toggleSabor = function(nombreSabor) {
    const index = pizzaActual.findIndex(item => item.sabor === nombreSabor);

    if (index > -1) {
        pizzaActual.splice(index, 1);
    } else {
        if (totalCuartosAsignados() >= 4) {
            mostrarMensaje("Ya asignaste los 4 cuartos de la pizza. Sacá algún sabor o bajale cuartos para agregar otro.", 'error');
            return;
        }
        pizzaActual.push({ sabor: nombreSabor, cuartos: 1 });
    }

    updatePizzaSummary();
    refrescarGrillaSabores();
};

/**
 * Sube en 1/4 la porción de un sabor ya elegido, si queda espacio.
 */
window.incrementarCuartos = function(nombreSabor) {
    const item = pizzaActual.find(s => s.sabor === nombreSabor);
    if (!item) return;

    if (totalCuartosAsignados() >= 4) {
        mostrarMensaje("Ya están los 4 cuartos asignados. Bajale a otro sabor para subirle a este.", 'error');
        return;
    }

    item.cuartos += 1;
    updatePizzaSummary();
    refrescarGrillaSabores();
};

/**
 * Baja en 1/4 la porción de un sabor. Si ya estaba en 1/4, bajar lo saca
 * de la pizza por completo (mismo efecto que tocar el ❌).
 */
window.decrementarCuartos = function(nombreSabor) {
    const item = pizzaActual.find(s => s.sabor === nombreSabor);
    if (!item) return;

    if (item.cuartos <= 1) {
        window.toggleSabor(nombreSabor);
        return;
    }

    item.cuartos -= 1;
    updatePizzaSummary();
    refrescarGrillaSabores();
};

/**
 * Actualiza el resumen lateral de la pizza con textos legibles para todo público.
 */
function updatePizzaSummary() {
    const summaryContainer = document.getElementById('pizza-summary-list');
    if (!summaryContainer) return;

    summaryContainer.innerHTML = '';
    
    pizzaActual.forEach(item => {
        const listItem = document.createElement('li');
        listItem.className = "list-group-item d-flex justify-content-between align-items-center selected-sabor-item";
        listItem.innerHTML = `
            <span class="resumen-sabor-name">${fraccionTexto(item.cuartos)} ${item.sabor}</span> 
            <button onclick="toggleSabor('${item.sabor}')" class="btn btn-sm p-1 text-danger btn-eliminar-sabor">❌</button>
        `;
        summaryContainer.appendChild(listItem);
    });
    
    if (pizzaActual.length === 0) {
        summaryContainer.innerHTML = '<li class="list-group-item text-muted text-center py-2" style="font-size: 0.9rem;">Elige tus sabores</li>';
    }
    
    const totalCuartos = totalCuartosAsignados();
    const statusLabel = document.getElementById('summary-status');
    if (statusLabel) {
        statusLabel.textContent = totalCuartos === 4
            ? '(Pizza completa ✔)'
            : `(${totalCuartos}/4 cuartos asignados)`;
    }

    actualizarEstadoBotonGuardar();
    ajustarAlturaSabores();
}

/**
 * Lógica interna para empaquetar la pizza y meterla al array del carrito.
 * Devuelve true si se guardó (o si no había nada que guardar), false si
 * la pizza actual está incompleta y por lo tanto no se pudo guardar.
 */
function guardarPizzaEnCarrito() {
    if (pizzaActual.length === 0) return true;

    if (totalCuartosAsignados() !== 4) {
        mostrarMensaje(`Te faltan asignar ${4 - totalCuartosAsignados()}/4 de la pizza actual antes de continuar.`, 'error');
        return false;
    }

    const nuevaPizza = {
        id: Date.now(),
        tipo: 'pizza',
        nombreProducto: nombrePizza(pizzaActual),
        sabores: pizzaActual.map(item => ({ ...item })),
        precioUnidad: calcularPrecioPizza(pizzaActual),
        cantidad: 1
    };

    currentCart.push(nuevaPizza);
    
    pizzaActual = [];
    updatePizzaSummary();
    refrescarGrillaSabores();
    renderPizzasArmadas();
    updateCartDisplay();
    return true;
}

/**
 * Agrega la pizza actual al carrito y limpia la pantalla para poder armar otra.
 */
window.agregarOtraPizza = function() {
    if (pizzaActual.length === 0) {
        mostrarMensaje("¡Selecciona al menos un sabor para tu pizza!", 'error');
        return;
    }
    
    if (guardarPizzaEnCarrito()) {
        mostrarMensaje("¡Pizza guardada! Podés armar la siguiente.", 'exito');
    }
};

/**
 * Agrega la pizza actual y desplaza al usuario a la sección de bebidas con suavidad.
 */
window.avanzarABebidas = function() {
    if (pizzaActual.length > 0 && !guardarPizzaEnCarrito()) {
        return;
    }
    
    const section = document.getElementById('bebidas-section');
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
};

/**
 * Arma el HTML del cuadrito de presupuesto: un solo total combinado
 * (muzza + especiales), con la promo ya aplicada. El desglose por tipo
 * se reserva para el modal final de checkout.
 */
function generarHTMLPresupuesto(resumen) {
    if (resumen.cantidad === 0) return '';

    const lineaDescuento = resumen.descuento > 0
        ? `<div class="text-success" style="font-size: 0.8rem;">Promo aplicada: -$${resumen.descuento}</div>`
        : '';

    return `
        <div class="d-flex justify-content-between align-items-center">
            <span class="fw-bold" style="font-size: 0.95rem;">🍕 Total (${resumen.cantidad})</span>
            <span class="fw-bold text-success" style="font-size: 1.15rem;">$${resumen.total}</span>
        </div>
        ${lineaDescuento}
    `;
}

/**
 * Renderiza el listado sutil de pizzas ya armadas abajo en el resumen
 */
function renderPizzasArmadas() {
    const container = document.getElementById('pizzas-armadas-container');
    const lista = document.getElementById('pizzas-armadas-lista');
    if (!container || !lista) return;

    const pizzasEnCart = currentCart.filter(item => item.tipo === 'pizza');

    if (pizzasEnCart.length === 0) {
        container.style.display = 'none';
        lista.innerHTML = '';
        listaPizzasExpandida = false; // Que la próxima vez arranque colapsada de nuevo
        const presupuestoEl = document.getElementById('presupuesto-pizzas');
        if (presupuestoEl) presupuestoEl.innerHTML = '';
        return;
    }

    container.style.display = 'block';

    // A partir de la 2da pizza, se colapsa: solo se ve la primera + un botón de despliegue.
    // Así la lista nunca empuja el botón "Guardar" ni el cuadrito de presupuesto fuera de vista.
    const debeColapsar = pizzasEnCart.length > 1 && !listaPizzasExpandida;
    const pizzasAMostrar = debeColapsar ? pizzasEnCart.slice(0, 1) : pizzasEnCart;

    let html = pizzasAMostrar.map((pizza, index) => `
        <div class="d-flex justify-content-between align-items-center bg-white border rounded p-2 mb-1" style="font-size: 0.8rem;">
            <div style="max-width: 70%; overflow: hidden;">
                <strong class="d-block text-primary">Pizza #${index + 1}</strong>
                <small class="text-muted text-truncate d-block">${formatearSabores(pizza.sabores)}</small>
            </div>
            <div class="d-flex gap-1">
                <button onclick="editarPizza(${pizza.id})" class="btn btn-sm btn-outline-secondary p-1" title="Editar">✏️</button>
                <button onclick="eliminarPizzaDelCart(${pizza.id})" class="btn btn-sm btn-outline-danger p-1" title="Eliminar">🗑️</button>
            </div>
        </div>
    `).join('');

    if (pizzasEnCart.length > 1) {
        html += debeColapsar
            ? `<button type="button" class="btn-desplegar-pizzas" onclick="toggleListaPizzas()">Ver las ${pizzasEnCart.length - 1} pizzas restantes <span class="flecha">▾</span></button>`
            : `<button type="button" class="btn-desplegar-pizzas" onclick="toggleListaPizzas()">Ocultar <span class="flecha">▴</span></button>`;
    }

    lista.innerHTML = html;

    const resumen = calcularResumenPizzas();
    const presupuestoEl = document.getElementById('presupuesto-pizzas');
    if (presupuestoEl) {
        presupuestoEl.innerHTML = generarHTMLPresupuesto(resumen);
    }
    
    ajustarAlturaSabores();
}

/**
 * Abre o cierra el acordeón de "Pizzas en tu pedido".
 */
window.toggleListaPizzas = function() {
    listaPizzasExpandida = !listaPizzasExpandida;
    renderPizzasArmadas();
};

/**
 * Saca una pizza ya armada del carrito de fondo y la vuelve a cargar en el configurador activo
 */
window.editarPizza = function(id) {
    if (pizzaActual.length > 0 && !confirm("Estás armando una pizza. ¿Querés descartarla para editar la pizza seleccionada?")) {
        return;
    }

    const pizzaAEditar = currentCart.find(item => item.id === id);
    if (!pizzaAEditar) return;

    pizzaActual = pizzaAEditar.sabores.map(item => ({ ...item }));
    pizzaEditandoId = id;
    currentCart = currentCart.filter(item => item.id !== id);

    document.getElementById('btn-save-edit').style.display = 'block';

    updatePizzaSummary();
    refrescarGrillaSabores();
    renderPizzasArmadas();
    updateCartDisplay();
};

/**
 * Guarda los cambios de la pizza que se bajó a editar
 */
window.guardarEdicion = function() {
    if (pizzaActual.length === 0) {
        mostrarMensaje("La pizza debe tener al menos un sabor.", 'error');
        return;
    }

    if (totalCuartosAsignados() !== 4) {
        mostrarMensaje(`Te faltan asignar ${4 - totalCuartosAsignados()}/4 de la pizza antes de guardar los cambios.`, 'error');
        return;
    }

    const pizzaModificada = {
        id: pizzaEditandoId || Date.now(),
        tipo: 'pizza',
        nombreProducto: nombrePizza(pizzaActual),
        sabores: pizzaActual.map(item => ({ ...item })),
        precioUnidad: calcularPrecioPizza(pizzaActual),
        cantidad: 1
    };

    currentCart.push(pizzaModificada);
    
    pizzaActual = [];
    pizzaEditandoId = null;
    document.getElementById('btn-save-edit').style.display = 'none';

    updatePizzaSummary();
    refrescarGrillaSabores();
    renderPizzasArmadas();
    updateCartDisplay();
    mostrarMensaje("Cambios guardados con éxito.", 'exito');
};

/**
 * Elimina por completo una pizza del pedido de fondo
 */
window.eliminarPizzaDelCart = function(id) {
    currentCart = currentCart.filter(item => item.id !== id);
    renderPizzasArmadas();
    updateCartDisplay();
};

/**
 * Lógica del buscador de sabores
 */
function filterSabores(event) {
    const searchTerm = event.target.value.toLowerCase();
    const cards = document.querySelectorAll('.sabor-card-mini');

    cards.forEach(card => {
        const nombre = card.querySelector('.sabor-name').textContent.toLowerCase();
        card.style.display = nombre.includes(searchTerm) ? 'flex' : 'none';
    });
}

// =======================================================
// SECCIÓN: BEBIDAS (LÓGICA INTERACTIVA DE CANTIDADES)
// =======================================================

/**
 * Muestra las bebidas en acordeones. 
 * El botón cambia dinámicamente a [-] Cantidad [+] si ya se agregó al menos una.
 */
/**
 * Muestra las bebidas en acordeones. 
 * Modificado: Ahora detecta cuál acordeón estaba abierto antes del renderizado
 * para mantenerlo desplegado y evitar que se cierre de forma molesta.
 */
window.showBebidasSection = function() {
    const container = document.getElementById('accordionBebidas');
    if (!container || !allBebidas) return;

    // --- TRUCO: DETECTAR CUÁL ACORDEÓN ESTABA ABIERTO ANTES DE BORRAR EL HTML ---
    let indexAbierto = null;
    const itemsExistentes = container.querySelectorAll('.accordion-collapse');
    itemsExistentes.forEach((item, idx) => {
        if (item.classList.contains('show')) {
            indexAbierto = idx; // Guardamos el número de índice del colapsable que está a la vista
        }
    });
    // --------------------------------------------------------------------------

    const porCategoria = {
        "Gaseosas": [],
        "Aguas y Saborizadas": [],
        "Cervezas": [],
        "Vinos": [],
        "Postres": []
    };

    allBebidas.forEach(b => {
        const catOriginal = (b.categoria || '').toLowerCase();
        if (catOriginal.includes('gaseosa') || catOriginal.includes('cola')) porCategoria["Gaseosas"].push(b);
        else if (catOriginal.includes('agua') || catOriginal.includes('saborizada')) porCategoria["Aguas y Saborizadas"].push(b);
        else if (catOriginal.includes('cerveza') || catOriginal.includes('birra')) porCategoria["Cervezas"].push(b);
        else if (catOriginal.includes('vino')) porCategoria["Vinos"].push(b);
        else if (catOriginal.includes('postre')) porCategoria["Postres"].push(b);
        else {
            console.warn(`Categoría de producto no reconocida ("${b.categoria}"), se metió en "Gaseosas" por defecto:`, b.nombre);
            porCategoria["Gaseosas"].push(b);
        }
    });

    container.innerHTML = Object.keys(porCategoria).map((categoria, index) => {
        const listaProductos = porCategoria[categoria];
        if (listaProductos.length === 0) return ''; 

        const idCollapse = `collapse-${index}`;
        const idHeading = `heading-${index}`;

        // --- VALIDACIÓN DE ESTADO PERSISTENTE ---
        // Si este índice coincide con el que estaba abierto, le quitamos 'collapsed' al botón y le sumamos 'show' al panel
        const esElAbierto = index === indexAbierto;
        const btnClaseCollapsed = esElAbierto ? '' : 'collapsed';
        const panelClaseShow = esElAbierto ? 'show' : '';
        // ----------------------------------------

        return `
            <div class="accordion-item mb-2 border rounded shadow-sm" style="overflow: hidden;">
                <h2 class="accordion-header" id="${idHeading}">
                    <button class="accordion-button ${btnClaseCollapsed} fw-bold text-dark" type="button" 
                            data-bs-toggle="collapse" data-bs-target="#${idCollapse}" 
                            style="background-color: #fff9f5; font-size: 1.1rem; padding: 15px;">
                        ${categoria} <span class="badge bg-secondary ms-2 text-white" style="font-size: 0.8rem;">opciones</span>
                    </button>
                </h2>
                <div id="${idCollapse}" class="accordion-collapse collapse ${panelClaseShow}" data-bs-parent="#accordionBebidas">
                    <div class="accordion-body bg-white p-2">
                        <div class="list-group list-group-flush">
                            ${listaProductos.map(b => {
                                const itemEnCarrito = currentCart.find(item => item.tipo === 'bebida' && item.bebidaId === b.id);
                                const cantidad = itemEnCarrito ? itemEnCarrito.cantidad : 0;

                                let botonHTML = '';
                                if (cantidad > 0) {
                                    botonHTML = `
                                        <div class="d-flex align-items-center bg-light border rounded-pill px-2 py-1 shadow-sm">
                                            <button class="btn btn-sm btn-link text-danger fw-bold p-0 px-2 text-decoration-none" 
                                                    onclick="restarBebidaFromCart(${itemEnCarrito.id})" style="font-size: 1.1rem; line-height: 1;">
                                                -
                                            </button>
                                            <span class="fw-bold text-dark px-2" style="font-size: 0.95rem; min-width: 20px; text-align: center;">
                                                ${cantidad}
                                            </span>
                                            <button class="btn btn-sm btn-link text-success fw-bold p-0 px-2 text-decoration-none" 
                                                    onclick="addBebidaToCart(${b.id})" style="font-size: 1.1rem; line-height: 1;">
                                                +
                                            </button>
                                        </div>
                                    `;
                                } else {
                                    botonHTML = `
                                        <button class="btn btn-sm btn-outline-primary px-3 fw-bold" 
                                                onclick="addBebidaToCart(${b.id})" 
                                                style="border-radius: 20px; font-size: 0.85rem; padding: 6px 12px;">
                                            + Añadir
                                        </button>
                                    `;
                                }

                                return `
                                    <div class="list-group-item d-flex justify-content-between align-items-center py-3 border-bottom-0">
                                        <div style="max-width: 60%;">
                                            <h6 class="mb-0 fw-bold text-dark" style="font-size: 1rem;">${b.nombre}</h6>
                                            <small class="text-muted d-block" style="font-size: 0.85rem;">Tamaño: ${b.tamaño || 'Individual'}</small>
                                            <strong class="text-success" style="font-size: 1rem;">$${b.precioLlevar}</strong>
                                        </div>
                                        <div class="contenedor-control-bebida">
                                            ${botonHTML}
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
};

/**
 * Agrega una unidad de la bebida agrupando en el carrito.
 */
window.addBebidaToCart = function(id) {
    const bebida = allBebidas.find(b => b.id == id);
    if (!bebida) return;

    const bExistente = currentCart.find(item => item.tipo === 'bebida' && item.bebidaId === id);

    if (bExistente) {
        bExistente.cantidad += 1;
        bExistente.precioUnidad = bExistente.precioBase * bExistente.cantidad;
    } else {
        currentCart.push({
            id: Date.now(),
            bebidaId: id,
            tipo: 'bebida',
            nombre: bebida.nombre,
            tamaño: bebida.tamaño,
            nombreProducto: `${bebida.nombre} (${bebida.tamaño || 'Individual'})`,
            precioBase: bebida.precioLlevar,
            precioUnidad: bebida.precioLlevar,
            cantidad: 1
        });
    }

    updateCartDisplay();
    showBebidasSection(); 
};

/**
 * Resta una unidad de la bebida en el carrito.
 */
window.restarBebidaFromCart = function(idUnico) {
    const item = currentCart.find(i => i.id === idUnico);
    if (!item) return;

    if (item.cantidad > 1) {
        item.cantidad -= 1;
        item.precioUnidad = item.precioBase * item.cantidad;
    } else {
        currentCart = currentCart.filter(i => i.id !== idUnico);
    }

    updateCartDisplay();
    showBebidasSection(); 
};

/**
 * Elimina la línea completa de una bebida.
 */
window.removeBebidaFromCart = function(itemId) {
    currentCart = currentCart.filter(item => item.id !== itemId);
    updateCartDisplay();
    showBebidasSection(); 
};

// =======================================================
// SECCIÓN: RENDERS DE DETALLES GENERALES Y CHECKOUT
// =======================================================

/**
 * Renderiza el desglose completo del pedido lateral en la app.
 */
window.updateCartDisplay = function() {
    const cartContainer = document.getElementById('cart-items-container'); 
    const cartCountElement = document.getElementById('cart-count');
    
    if (cartCountElement) cartCountElement.textContent = currentCart.length;
    if (!cartContainer) return;

    if (currentCart.length === 0) {
        cartContainer.innerHTML = '<p class="text-muted text-center my-3">No hay productos en tu pedido.</p>';
        return;
    }

    cartContainer.innerHTML = currentCart.map(item => {
        if (item.tipo === 'pizza') {
            return `
                <div class="d-flex justify-content-between align-items-center p-2 mb-2 border rounded bg-white shadow-sm">
                    <div>
                        <strong class="text-dark">${item.nombreProducto}</strong>
                        <small class="text-muted d-block" style="font-size: 0.8rem;">Sabores: ${formatearSabores(item.sabores)}</small>
                    </div>
                    <div class="d-flex align-items-center gap-3">
                        <span class="fw-bold text-success">$${item.precioUnidad}</span>
                        <button onclick="eliminarPizzaDelCart(${item.id})" class="btn btn-sm text-danger p-1">🗑️</button>
                    </div>
                </div>
            `;
        } else if (item.tipo === 'bebida') {
            return `
                <div class="d-flex justify-content-between align-items-center p-2 mb-2 border rounded bg-white shadow-sm">
                    <div>
                        <strong class="text-dark">
                            <span class="badge bg-secondary me-1">${item.cantidad}x</span> ${item.nombre}
                        </strong>
                        <small class="text-muted d-block" style="font-size: 0.8rem;">Tamaño: ${item.tamaño || 'Individual'}</small>
                    </div>
                    <div class="d-flex align-items-center gap-2">
                        <span class="fw-bold text-success me-2">$${item.precioUnidad}</span>
                        <button onclick="restarBebidaFromCart(${item.id})" class="btn btn-sm btn-outline-secondary px-2 py-0" style="font-size: 0.85rem; border-radius: 5px;">-</button>
                        <button onclick="addBebidaToCart(${item.bebidaId})" class="btn btn-sm btn-outline-secondary px-2 py-0" style="font-size: 0.85rem; border-radius: 5px;">+</button>
                        <button onclick="removeBebidaFromCart(${item.id})" class="btn btn-sm text-danger p-1 ms-1">🗑️</button>
                    </div>
                </div>
            `;
        }
        return '';
    }).join('');
};

/**
 * Muestra u oculta el campo de la hora según la elección del cliente.
 */
window.toggleSelectorHora = function(mostrar) {
    const container = document.getElementById('selector-hora-container');
    const inputTime = document.getElementById('user-time');
    
    if (!container) return;

    if (mostrar) {
        container.style.display = 'block';
        if (inputTime && !inputTime.value) {
            const ahora = new Date();
            const horas = String(ahora.getHours()).padStart(2, '0');
            const minutos = String(ahora.getMinutes()).padStart(2, '0');
            inputTime.value = `${horas}:${minutos}`;
        }
    } else {
        container.style.display = 'none';
    }
};

/**
 * Abre el Modal Resumen Final validando la persistencia de datos.
 */
window.irAlCheckout = function() {
    if (pizzaActual.length > 0 && !guardarPizzaEnCarrito()) {
        return;
    }

    if (currentCart.length === 0) {
        mostrarMensaje("Tu carrito está vacío. ¡Armá tu pizza o sumá una bebida para continuar!", 'error');
        return;
    }

    const nameInput = document.getElementById('user-name');
    if (!nameInput || nameInput.value.trim() === "") {
        mostrarMensaje("Por favor, ingresá tu nombre para saber a quién entregarle el pedido.", 'error');
        nameInput.focus();
        return;
    }

    const esProgramado = document.getElementById('retiro-programado').checked;
    let horarioFinal = "Lo antes posible (10-15 min)";

    if (esProgramado) {
        const timeInput = document.getElementById('user-time');
        if (timeInput && timeInput.value) {
            horarioFinal = `A las ${timeInput.value} hs`;
        } else {
            mostrarMensaje("Por favor, selecciona a qué hora pasarás a retirar.", 'error');
            return;
        }
    }

    document.getElementById('lbl-resumen-cliente').textContent = nameInput.value.trim();
    document.getElementById('lbl-resumen-horario').textContent = horarioFinal;

    const listaContenedor = document.getElementById('resumen-productos-lista');
    let totalAcumulado = 0;
    
    let htmlProductos = currentCart.map(item => {
        const precioItem = item.precioUnidad || 0;
        totalAcumulado += precioItem;

        const detallesSabores = item.tipo === 'pizza' 
            ? `<small class="text-muted d-block" style="font-size: 0.8rem; line-height: 1.1;">Sabores: ${formatearSabores(item.sabores)}</small>` 
            : '';

        const prefijoCantidad = item.tipo === 'bebida' ? `<span class="text-muted">${item.cantidad}x </span>` : '';

        return `
            <div class="d-flex justify-content-between align-items-start mb-2 border-bottom pb-1" style="font-size: 0.95rem;">
                <div style="max-width: 75%;">
                    <span class="fw-bold text-dark">${prefijoCantidad}${item.nombreProducto || item.nombre}</span>
                    ${detallesSabores}
                </div>
                <span class="fw-bold text-secondary">$${precioItem}</span>
            </div>
        `;
    }).join('');

    const resumenPizzas = calcularResumenPizzas();
    if (resumenPizzas.muzza.descuento > 0) {
        htmlProductos += `
            <div class="d-flex justify-content-between align-items-center text-success" style="font-size: 0.9rem;">
                <span>Promo Muzzarella (${resumenPizzas.muzza.cantidad} pizzas)</span>
                <span>-$${resumenPizzas.muzza.descuento}</span>
            </div>
        `;
    }
    if (resumenPizzas.especial.descuento > 0) {
        htmlProductos += `
            <div class="d-flex justify-content-between align-items-center text-success" style="font-size: 0.9rem;">
                <span>Promo Especiales (${resumenPizzas.especial.cantidad} pizzas)</span>
                <span>-$${resumenPizzas.especial.descuento}</span>
            </div>
        `;
    }
    totalAcumulado -= resumenPizzas.descuento;
    totalPedidoActual = totalAcumulado;

    listaContenedor.innerHTML = htmlProductos;

    document.getElementById('lbl-resumen-total').textContent = `$${totalAcumulado}`;

    const resumenModal = new bootstrap.Modal(document.getElementById('resumenPedidoModal'));
    resumenModal.show();
};

/**
 * Arma el texto plano del pedido (sin HTML) para mandar por WhatsApp,
 * con el mismo detalle que ve el cliente en el modal de confirmación.
 */
function construirMensajeWhatsApp(cliente, horario) {
    const lineas = [];
    lineas.push('🍕 *Nuevo pedido - Loco X Todo*');
    lineas.push('');
    lineas.push(`*Cliente:* ${cliente}`);
    lineas.push(`*Retiro:* ${horario}`);
    lineas.push('');
    lineas.push('*Pedido:*');

    currentCart.forEach(item => {
        const precioItem = item.precioUnidad || 0;
        if (item.tipo === 'pizza') {
            lineas.push(`- ${item.nombreProducto}: ${formatearSabores(item.sabores)} — $${precioItem}`);
        } else {
            lineas.push(`- ${item.cantidad}x ${item.nombreProducto || item.nombre} — $${precioItem}`);
        }
    });

    const resumenPizzas = calcularResumenPizzas();
    if (resumenPizzas.muzza.descuento > 0) {
        lineas.push(`Promo Muzzarella (${resumenPizzas.muzza.cantidad} pizzas): -$${resumenPizzas.muzza.descuento}`);
    }
    if (resumenPizzas.especial.descuento > 0) {
        lineas.push(`Promo Especiales (${resumenPizzas.especial.cantidad} pizzas): -$${resumenPizzas.especial.descuento}`);
    }

    lineas.push('');
    lineas.push(`*Total: $${totalPedidoActual}*`);

    return lineas.join('\n');
}

/**
 * Acción final del Modal de Confirmación: arma el pedido en texto,
 * abre WhatsApp con todo pre-cargado y limpia el carrito (el pedido
 * ya "salió" hacia la pizzería).
 */
window.enviarPedidoDefinitivo = function() {
    const cliente = document.getElementById('lbl-resumen-cliente').textContent;
    const horario = document.getElementById('lbl-resumen-horario').textContent;

    const mensaje = construirMensajeWhatsApp(cliente, horario);
    const url = `https://wa.me/${NUMERO_WHATSAPP_PIZZERIA}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');

    const modalEl = document.getElementById('resumenPedidoModal');
    const modalInstancia = bootstrap.Modal.getInstance(modalEl);
    if (modalInstancia) modalInstancia.hide();

    mostrarMensaje(`¡Pedido de ${cliente} enviado por WhatsApp!`, 'exito');

    currentCart = [];
    updateCartDisplay();
    renderPizzasArmadas();
};

// =======================================================
// INITIALIZATION EXECUTION
// =======================================================
initializeConfigurator();
showBebidasSection();