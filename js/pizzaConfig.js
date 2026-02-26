// =======================================================
// pizzaConfig.js: Lógica del Configurador y Carrito
// =======================================================

import { allSabores, allBebidas, ALL_PRODUCTOS } from './dataLoader.js'; 

// 1. VARIABLES GLOBALES
const MAX_SABORES = 4;
let pizzaActual = []; 
let currentCart = [];
let configuradorInicializado = false; // CANDADO 1: Variable de control

/**
 * Inicializa el configurador.
 */
window.initializeConfigurator = function() {
    const saboresContainer = document.getElementById('sabores-list-container');
    if (!saboresContainer) return;

    // CANDADO 2: Si ya hay contenido o la variable es true, abortamos la carga
    if (configuradorInicializado || saboresContainer.querySelectorAll('.sabor-card').length > 0) {
        console.log("Configurador ya detectado. Abortando duplicación.");
        return;
    }

    // Marcamos como inicializado
    configuradorInicializado = true;

    if (!allSabores || allSabores.length === 0) {
        saboresContainer.innerHTML = "<p>No hay sabores disponibles.</p>";
        return;
    }

    // Generamos el HTML
    const htmlContent = allSabores.map(createSaborCard).join('');
    saboresContainer.innerHTML = htmlContent;

    // Conectar el buscador
    const searchInput = document.getElementById('sabor-search');
    if (searchInput) {
        searchInput.addEventListener('input', filterSabores);
    }
};

/**
 * Genera el HTML de la tarjeta de un sabor.
 */
function createSaborCard(sabor) {
    const isSelected = pizzaActual.includes(sabor.nombre);
    return `
        <div class="sabor-card" data-nombre="${sabor.nombre}" onclick="toggleSabor('${sabor.nombre}')">
            <img src="assets/images/sabores/${sabor.imagen}.jpg" alt="${sabor.nombre}" onerror="this.src='assets/images/default-pizza.png'">
            <div class="sabor-info">
                <h5>${sabor.nombre}</h5>
                <p>${sabor.descripcion}</p>
            </div>
            <button class="btn btn-sm btn-select-sabor ${isSelected ? 'btn-primary-cta' : 'btn-secondary'}">
                ${isSelected ? '✔' : 'Seleccionar'}
            </button>
        </div>
    `;
}

/**
 * Selecciona o deselecciona un sabor.
 */
window.toggleSabor = function(nombreSabor) {
    const index = pizzaActual.indexOf(nombreSabor);

    if (index > -1) {
        pizzaActual.splice(index, 1);
    } else if (pizzaActual.length < MAX_SABORES) {
        pizzaActual.push(nombreSabor);
    } else {
        alert(`¡Solo puedes elegir hasta ${MAX_SABORES} sabores!`);
        return;
    }

    updatePizzaSummary(); 
    updateSaborCards(); 
};

/**
 * Actualiza el resumen lateral de la pizza.
 */
function updatePizzaSummary() {
    const summaryContainer = document.getElementById('pizza-summary-list');
    if (!summaryContainer) return;

    summaryContainer.innerHTML = '';
    
    for (let i = 0; i < MAX_SABORES; i++) {
        const sabor = pizzaActual[i];
        const listItem = document.createElement('li');
        listItem.className = `list-group-item ${sabor ? 'selected' : ''}`;
        listItem.innerHTML = `
            ${i + 1}. ${sabor || '(Vacío)'} 
            ${sabor ? `<button onclick="toggleSabor('${sabor}')" class="btn btn-sm btn-link text-danger">❌</button>` : ''}
        `;
        summaryContainer.appendChild(listItem);
    }
    
    const statusLabel = document.getElementById('summary-status');
    if (statusLabel) statusLabel.textContent = `(${pizzaActual.length} de ${MAX_SABORES} sabores)`;
}

/**
 * Añade la pizza al carrito.
 */
window.addToCart = function(isContinuing) {
    if (pizzaActual.length === 0) {
        alert("¡Selecciona al menos un sabor!");
        return;
    }

    const productInfo = ALL_PRODUCTOS.find(p => p.nombre.includes('Especial'));

    const newPizza = {
        id: Date.now(),
        tipo: 'pizza',
        nombreProducto: 'Pizza Especial',
        sabores: [...pizzaActual],
        precioUnidad: productInfo ? productInfo.precioBase : 13000,
        cantidad: 1
    };

    currentCart.push(newPizza);
    
    // Limpiar selección
    pizzaActual = [];
    updatePizzaSummary(); 
    updateSaborCards();
    updateCartDisplay(); 

    alert("¡Pizza añadida al carrito!");
    
    if (isContinuing) {
        showBebidasSection();
    }
};

/**
 * Actualiza el contador del carrito en el header.
 */
window.updateCartDisplay = function() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) cartCountElement.textContent = currentCart.length;
};

/**
 * Lógica del buscador de sabores.
 */
function filterSabores(event) {
    const searchTerm = event.target.value.toLowerCase();
    const cards = document.querySelectorAll('.sabor-card');

    cards.forEach(card => {
        const nombre = card.getAttribute('data-nombre').toLowerCase();
        card.style.display = nombre.includes(searchTerm) ? 'flex' : 'none';
    });
}

/**
 * Refresca visualmente los botones de las tarjetas.
 */
function updateSaborCards() {
    const cards = document.querySelectorAll('.sabor-card');
    cards.forEach(card => {
        const nombre = card.getAttribute('data-nombre');
        const button = card.querySelector('.btn-select-sabor');
        if (!button) return;

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

/**
 * Muestra las bebidas.
 */
window.showBebidasSection = function() {
    const section = document.getElementById('bebidas-section');
    const container = document.getElementById('bebidas-list-container');
    if (section) section.style.display = 'block';

    if (container && allBebidas) {
        container.innerHTML = allBebidas.map(b => `
            <div class="card p-2 mb-2">
                <h6>${b.nombre} (${b.tamaño})</h6>
                <p>$${b.precio}</p>
                <button class="btn btn-sm btn-outline-primary" onclick="addBebidaToCart(${b.id}, '${b.nombre}')">+ Añadir</button>
            </div>
        `).join('');
    }
    // Scroll suave hasta la sección de bebidas
    section.scrollIntoView({ behavior: 'smooth' });
};

window.addBebidaToCart = function(id, nombre) {
    const bebida = allBebidas.find(b => b.id == id);
    if (bebida) {
        currentCart.push({ ...bebida, tipo: 'bebida', id: Date.now() });
        updateCartDisplay();
        alert(`${nombre} añadida.`);
    }
};