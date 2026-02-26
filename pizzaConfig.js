// =======================================================
// pizzaConfig.js: Lógica del Configurador y Carrito
// =======================================================

// 1. UNIFICAMOS IMPORTS (Solo al principio del archivo)
import { allSabores, allBebidas, ALL_PRODUCTOS } from './dataLoader.js'; 

// 2. VARIABLES GLOBALES
const MAX_SABORES = 4;
let pizzaActual = []; // Sabores de la pizza que estás armando ahora
let currentCart = [];  // Todos los productos (pizzas terminadas y bebidas)

/**
 * Inicializa el configurador al cargar la página.
 */
window.initializeConfigurator = function() {
    const saboresContainer = document.getElementById('sabores-list-container');
    if (!saboresContainer) return;

    // Si dataLoader falló, allSabores estará vacío. 
    // Mostramos un mensaje si no hay datos.
    if (!allSabores || allSabores.length === 0) {
        saboresContainer.innerHTML = "<p>Error al cargar sabores. Verifica la conexión con el Excel.</p>";
        return;
    }

    const htmlContent = allSabores.map(createSaborCard).join('');
    saboresContainer.innerHTML = htmlContent;

    // Conectar buscador
    const searchInput = document.getElementById('sabor-search');
    if (searchInput) searchInput.addEventListener('input', filterSabores);
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
 * Actualiza el resumen visual (la lista de 1, 2, 3, 4).
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
    
    document.getElementById('summary-status').textContent = `(${pizzaActual.length} de ${MAX_SABORES} sabores)`;
}

/**
 * Añade la pizza armada al carrito.
 */
window.addToCart = function(isContinuing) {
    if (pizzaActual.length === 0) {
        alert("¡Selecciona al menos un sabor!");
        return;
    }

    const productInfo = ALL_PRODUCTOS.find(p => p.nombre.includes('Especial') && p.tamaño === 'entera');

    const newPizza = {
        id: Date.now(),
        tipo: 'pizza',
        nombreProducto: productInfo ? productInfo.nombre : 'Pizza Especial',
        sabores: [...pizzaActual],
        precioUnidad: productInfo ? productInfo.precioBase : 13000,
        cantidad: 1
    };

    currentCart.push(newPizza);
    
    // Resetear para la próxima
    pizzaActual = [];
    updatePizzaSummary(); 
    updateSaborCards();
    updateCartDisplay(); 

    alert("¡Pizza añadida!");
    
    if (isContinuing) {
        showBebidasSection();
    }
};

/**
 * Calcula totales y actualiza el contador del carrito.
 */
window.updateCartDisplay = function() {
    const totalItems = currentCart.length;
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) cartCountElement.textContent = totalItems;
    
    console.log("Items en carrito:", currentCart);
};

/**
 * Filtro de búsqueda.
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
            button.classList.replace('btn-secondary', 'btn-primary-cta');
            button.textContent = '✔';
        } else {
            button.classList.replace('btn-primary-cta', 'btn-secondary');
            button.textContent = 'Seleccionar';
        }
    });
}

/**
 * Sección de Bebidas.
 */
window.showBebidasSection = function() {
    const section = document.getElementById('bebidas-section');
    const container = document.getElementById('bebidas-list-container');
    if (section) section.style.display = 'block';

    if (container && allBebidas) {
        container.innerHTML = allBebidas.map(b => `
            <div class="bebida-card">
                <h5>${b.nombre}</h5>
                <p>$${b.precio}</p>
                <button onclick="addBebidaToCart('${b.id}', '${b.nombre}')">Añadir</button>
            </div>
        `).join('');
    }
};

window.addBebidaToCart = function(id, nombre) {
    const bebida = allBebidas.find(b => b.id == id);
    if (bebida) {
        currentCart.push({ ...bebida, tipo: 'bebida', id: Date.now() });
        updateCartDisplay();
        alert(`${nombre} añadida.`);
    }
};