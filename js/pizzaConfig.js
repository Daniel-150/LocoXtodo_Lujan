// =======================================================
// pizzaConfig.js: Lógica del Configurador de Pizza
// =======================================================

import { allSabores } from './dataLoader.js'; // Importamos los sabores cargados

// Constantes de diseño y límites
const MAX_SABORES = 4;
let pizzaActual = []; // Array que guarda los sabores seleccionados para la pizza actual

/**
 * Función que genera el HTML de la tarjeta de un solo sabor.
 * @param {Object} sabor - El objeto sabor con nombre, descripcion, etc.
 */
function createSaborCard(sabor) {
    // Usaremos el estilo de tarjeta que diseñamos (HTML simple para el Multiple Choice)
    return `
        <div class="sabor-card" data-nombre="${sabor.nombre}" onclick="toggleSabor('${sabor.nombre}')">
            <img src="assets/images/sabores/${sabor.imagen}.jpg" alt="${sabor.nombre}">
            <div class="sabor-info">
                <h5>${sabor.nombre}</h5>
                <p>${sabor.descripcion}</p>
            </div>
            <button class="btn btn-sm btn-select-sabor ${pizzaActual.includes(sabor.nombre) ? 'btn-primary-cta' : 'btn-secondary'}">
                ${pizzaActual.includes(sabor.nombre) ? '✔' : 'Seleccionar'}
            </button>
        </div>
    `;
}

/**
 * Inicializa el configurador: carga la lista de sabores en el HTML.
 */
window.initializeConfigurator = function() {
    const saboresContainer = document.getElementById('sabores-list-container');
    const htmlContent = allSabores.map(createSaborCard).join('');
    saboresContainer.innerHTML = htmlContent;

    // Conectar el evento de búsqueda
    document.getElementById('sabor-search').addEventListener('input', filterSabores);
};

/**
 * Maneja la selección/deselección de un sabor (la función principal de interacción).
 * @param {string} nombreSabor - Nombre del sabor clicado.
 */
window.toggleSabor = function(nombreSabor) {
    const index = pizzaActual.indexOf(nombreSabor);

    if (index > -1) {
        // Deseleccionar: Si el sabor ya está, lo quitamos
        pizzaActual.splice(index, 1);
    } else if (pizzaActual.length < MAX_SABORES) {
        // Seleccionar: Si quedan espacios, lo añadimos
        pizzaActual.push(nombreSabor);
    } else {
        // Límite alcanzado
        alert(`¡Solo puedes elegir ${MAX_SABORES} sabores por pizza!`);
        return;
    }

    // Actualizamos el HTML después del cambio
    updatePizzaSummary(); 
    updateSaborCards(); // Para que los botones se vean actualizados (✔ o Seleccionar)
};


/**
 * Actualiza la columna derecha del resumen de la pizza.
 */
function updatePizzaSummary() {
    const summaryContainer = document.getElementById('pizza-summary-list');
    summaryContainer.innerHTML = '';
    
    // Llenar los 4 espacios de la pizza
    for (let i = 0; i < MAX_SABORES; i++) {
        const sabor = pizzaActual[i];
        const displayNombre = sabor || '(Vacío)';
        const isSelected = sabor ? 'selected' : '';

        // Crear elemento de lista para el resumen
        const listItem = document.createElement('li');
        listItem.className = `list-group-item ${isSelected}`;
        listItem.innerHTML = `
            ${i + 1}. ${displayNombre} 
            ${sabor ? `<button onclick="toggleSabor('${sabor}')" class="btn btn-sm btn-link text-danger">❌</button>` : ''}
        `;
        summaryContainer.appendChild(listItem);
    }
    
    // Actualizar el estado del límite
    document.getElementById('summary-status').textContent = 
        `(${pizzaActual.length} de ${MAX_SABORES} sabores)`;
}


/**
 * Filtra los sabores al escribir en la barra de búsqueda (JS puro).
 */
function filterSabores(event) {
    const searchTerm = event.target.value.toLowerCase();
    const cards = document.querySelectorAll('.sabor-card');

    cards.forEach(card => {
        const nombre = card.getAttribute('data-nombre').toLowerCase();
        if (nombre.includes(searchTerm)) {
            card.style.display = 'flex'; // Mostrar tarjeta
        } else {
            card.style.display = 'none'; // Ocultar tarjeta
        }
    });
}


/**
 * Actualiza visualmente los botones de las tarjetas (Seleccionar vs. ✔).
 */
function updateSaborCards() {
    const cards = document.querySelectorAll('.sabor-card');
    cards.forEach(card => {
        const nombre = card.getAttribute('data-nombre');
        const button = card.querySelector('.btn-select-sabor');

        if (pizzaActual.includes(nombre)) {
            button.classList.remove('btn-secondary');
            button.classList.add('btn-primary-cta');
            button.textContent = '✔';
        } else {
            button.classList.remove('btn-primary-cta');
            button.classList.add('btn-secondary');
            button.textContent = 'Seleccionar';
        }
    });
}



// js/pizzaConfig.js
// ... (Tus imports y variables como MAX_SABORES, pizzaActual, etc.) ...
import { allSabores, allBebidas, PIZZA_PRECIO_BASE, ALL_PRODUCTOS } from './dataLoader.js'; 

//const MAX_SABORES = 4;
//let pizzaActual = []; 

// Variable global que contendrá todos los ítems del pedido (pizzas, bebidas, etc.)
// Cada ítem será un objeto { id, tipo, nombre, cantidad, precioUnidad, ... }
let currentCart = [];

/**
 * Calcula el precio total de un grupo de pizzas con descuento por cantidad.
 * Regla: 1000 AR$ de descuento por cada pizza entera extra del mismo tipo.
 * @param {Array} pizzas - Array de objetos pizza (ej: todas las 'Pizza Muzzarella').
 * @param {number} precioBaseUnidad - Precio base de 1 unidad.
 * @returns {number} Precio total con descuento.
 */
function calculatePizzaGroupTotal(pizzas, precioBaseUnidad) {
    const cantidad = pizzas.length;
    let totalBruto = cantidad * precioBaseUnidad;
    let descuento = 0;

    // Solo aplicamos descuentos a partir de la 2da pizza
    if (cantidad >= 2) {
        // La fórmula es (cantidad - 1) * 1000
        // Ejemplo: 2 pizzas -> (2 - 1) * 1000 = 1000 (total $19000)
        // Ejemplo: 3 pizzas -> (3 - 1) * 1000 = 2000 (total $28000)
        descuento = (cantidad - 1) * 1000;
    }

    return totalBruto - descuento;
}



/**
 * Añade la pizza actualmente seleccionada al carrito de compras.
 * Esta función es llamada por los botones del configurador.
 */
window.addToCart = function(isContinuing) {
    // 1. Validar la selección de sabores
    if (pizzaActual.length === 0) {
        alert("¡Debes seleccionar al menos un sabor!");
        return;
    }

    // Por ahora, asumimos que siempre se añade una "Pizza Especial" entera 
    // (ya que es la que soporta los 4 sabores). Necesitarás un selector de tipo/tamaño.
    const productInfo = ALL_PRODUCTOS.find(p => p.nombre.includes('Especial') && p.tamaño === 'entera');

    if (!productInfo) {
        console.error("No se encontró el precio base de la Pizza Especial Entera.");
        alert("Error: No se pudo obtener el precio base de la pizza.");
        return;
    }
    
    // 2. Crear el objeto Pizza
    const newPizza = {
        id: Date.now(), // ID único para el ítem en el carrito
        tipo: 'pizza',
        nombreProducto: productInfo.nombre, // 'Pizza Especial'
        sabores: [...pizzaActual], // Copia de los sabores seleccionados
        precioUnidad: productInfo.precioBase, // Ej: 13000
        tamaño: productInfo.tamaño, // 'entera'
        cantidad: 1 // Siempre se añade una unidad a la vez
    };

    // 3. Añadir al carrito
    currentCart.push(newPizza);
    
    // 4. Limpiar la selección actual para la siguiente pizza
    pizzaActual = [];
    updatePizzaSummary(); 
    updateSaborCards();

    // 5. Mostrar mensaje de éxito y actualizar la visualización del carrito
    alert(`Pizza ${newPizza.sabores.join(', ')} añadida al carrito!`);
    
    // Aquí se llamaría a la función para cargar el Paso 2 (Bebidas) o el Paso 3 (Checkout)
    updateCartDisplay(); 
    
    if (!isContinuing) {
        // Si el usuario eligió "IR A PAGAR"
        // window.location.href = '#checkout-section'; 
    }
};

// js/pizzaConfig.js

/**
 * Recalcula el total del carrito y actualiza el ícono en el header.
 */
window.updateCartDisplay = function() {
    let totalPizzas = 0;
    let totalBebidas = 0;
    let totalItems = 0;

    // Agrupar pizzas por tipo (Muzzarella, Especial) y tamaño (entera)
    const groupedPizzas = currentCart
        .filter(item => item.tipo === 'pizza')
        .reduce((acc, pizza) => {
            const key = pizza.nombreProducto;
            if (!acc[key]) acc[key] = [];
            acc[key].push(pizza);
            return acc;
        }, {});

    // Calcular el total de las pizzas aplicando los descuentos por grupo
    for (const key in groupedPizzas) {
        const pizzas = groupedPizzas[key];
        const precioBase = pizzas[0].precioUnidad; // Precio base de la unidad
        totalPizzas += calculatePizzaGroupTotal(pizzas, precioBase);
    }
    
    // Calcular el total de las bebidas (simplificado por ahora)
    currentCart
        .filter(item => item.tipo !== 'pizza')
        .forEach(item => {
            totalBebidas += item.precioUnidad * item.cantidad;
        });

    const totalFinal = totalPizzas + totalBebidas;
    
    // Contar items totales en el carrito
    totalItems = currentCart.length;

    // Actualizar el ícono del carrito en el header
    document.getElementById('cart-count').textContent = totalItems;
    
    console.log(`Carrito actualizado. Total: ${totalFinal}`);
};



// js/pizzaConfig.js

/**
 * Genera el HTML para una sola tarjeta de bebida.
 */
function createBebidaCard(bebida) {
    return `
        <div class="bebida-card card mb-3">
            <div class="row g-0">
                <div class="col-md-4">
                    <img src="assets/images/bebidas/${bebida.imagen}" class="img-fluid rounded-start" alt="${bebida.nombre}">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title">${bebida.nombre}</h5>
                        <p class="card-text text-secondary">${bebida.tamaño}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="price-tag">$${bebida.precio.toLocaleString('es-AR')}</span>
                            <button 
                                class="btn-secondary add-to-cart-btn" 
                                onclick="addBebidaToCart('${bebida.id}', '${bebida.nombre}')">
                                + Añadir
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Muestra la sección de bebidas y carga el catálogo.
 */
window.showBebidasSection = function() {
    const bebidasContainer = document.getElementById('bebidas-list-container');
    
    // 1. Mostrar la sección en el DOM
    document.getElementById('bebidas-section').style.display = 'block';

    // 2. Ocultar la sección del configurador de pizza (opcional, pero mejora el flujo)
    // document.getElementById('pedido-section').style.display = 'none';

    // 3. Generar el contenido de las tarjetas
    const htmlContent = allBebidas.map(createBebidaCard).join('');
    bebidasContainer.innerHTML = htmlContent;

    // 4. Agregar listeners a los botones de navegación
    document.getElementById('btn-finish-order').onclick = () => { /* Lógica para ir al checkout */ };
    document.getElementById('btn-keep-buying-pizzas').onclick = () => { 
        document.getElementById('bebidas-section').style.display = 'none';
        document.getElementById('pedido-section').style.display = 'block'; 
        // Desplazarse al inicio de la sección de pizza si es necesario
    };
};



// js/pizzaConfig.js (dentro de window.addToCart = function(isContinuing) { ... })

// ... (después de updateCartDisplay) ...
    
    // 5. Mostrar mensaje de éxito y actualizar la visualización del carrito
    alert(`Pizza ${newPizza.sabores.join(', ')} añadida al carrito!`);
    updateCartDisplay(); 
    
    // 6. Lógica de Navegación
    if (isContinuing) {
        // Si el usuario eligió "AÑADIR AL CARRITO Y CONTINUAR"
        showBebidasSection(); // <-- ¡NUEVA FUNCIÓN LLAMADA AQUÍ!
    } else {
        // Si el usuario eligió "IR A PAGAR"
        // Aquí se llamaría a la función para cargar el Checkout
    };


// js/pizzaConfig.js

/**
 * Añade una bebida al carrito y actualiza la visualización.
 */
window.addBebidaToCart = function(bebidaId, bebidaNombre) {
    const productInfo = allBebidas.find(b => b.id == bebidaId);

    if (productInfo) {
        const newBebida = {
            id: Date.now() + Math.random(), // ID único
            tipo: 'bebida',
            nombreProducto: productInfo.nombre,
            precioUnidad: productInfo.precio,
            cantidad: 1 // Por defecto, añade 1 unidad
        };
        
        currentCart.push(newBebida);
        updateCartDisplay(); 
        
        // Pequeño feedback visual
        alert(`${bebidaNombre} añadida. Total en carrito: ${currentCart.length} ítems.`);

    } else {
        console.error('ID de bebida no encontrado:', bebidaId);
    }
};