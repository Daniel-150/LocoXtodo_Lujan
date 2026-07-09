// ==========================================================================
// salon-menu.js: Lógica interactiva para el Menú Salón (Optimizado)
// ==========================================================================
import { allSabores, allBebidas } from './dataLoader.js';

// --- CONFIGURACIÓN DE RUTAS DE IMÁGENES ---
const RUTA_FOTOS = 'assets/images/';
const EXTENSION_FOTOS = '.jpg';

// --- SELECTORES DEL DOM ---
const saboresContainer = document.getElementById('sabores-carousel-container');
const gaseosasContainer = document.getElementById('gaseosas-carousel-container');
const aguasContainer = document.getElementById('aguas-carousel-container');
const cervezasContainer = document.getElementById('cervezas-carousel-container');
const vinosContainer = document.getElementById('vinos-carousel-container');
const postresContainer = document.getElementById('postres-carousel-container');
const searchInput = document.getElementById('menu-search');

// --- SEPARACIÓN FINA Y SEGURA DE CATEGORÍAS (Evita problemas de Mayúsculas/Minúsculas) ---
const soloGaseosas = allBebidas.filter(p => p.tipo === 'bebida' && p.categoria.toLowerCase().includes('gaseosa'));
const soloAguas = allBebidas.filter(p => p.tipo === 'bebida' && p.categoria.toLowerCase().includes('agua'));
const soloCervezas = allBebidas.filter(p => p.tipo === 'bebida' && p.categoria.toLowerCase().includes('cerveza'));
const soloVinos = allBebidas.filter(p => p.tipo === 'bebida' && p.categoria.toLowerCase() === 'vinos');
const soloPostres = allBebidas.filter(p => p.tipo === 'postre');

/**
 * Renderiza los sabores en su carrusel (Evitando bucles)
 */
function renderSabores(sabores) {
    if (!saboresContainer) return;
    saboresContainer.innerHTML = '';
    
    if (sabores.length === 0) {
        saboresContainer.innerHTML = '<p class="text-muted p-3">No se encontraron sabores.</p>';
        return;
    }

    sabores.forEach(sabor => {
        const esMuzza = sabor.nombre.toLowerCase() === 'muzzarella';
        const badgeClass = esMuzza ? 'bg-danger' : 'bg-warning text-dark';
        const badgeText = esMuzza ? 'Clásica' : 'Especial';

        const card = document.createElement('div');
        card.className = 'item-card bg-white shadow-sm';
        card.innerHTML = `
            <div class="item-img-container">
                <img src="${RUTA_FOTOS}${sabor.imagen}${EXTENSION_FOTOS}" alt="${sabor.nombre}" 
                     onerror="this.onerror=null; this.src='https://placehold.co/220x140?text=🍕';">
            </div>
            <div class="item-details">
                <div class="d-flex flex-column mb-1">
                    <div class="d-flex justify-content-between align-items-start mb-1">
                        <h6 class="fw-bold mb-0 text-uppercase text-truncate" style="max-width: 70%;">${sabor.nombre}</h6>
                        <span class="badge ${badgeClass} ms-1" style="font-size: 0.65rem;">${badgeText}</span>
                    </div>
                </div>
                <p class="text-muted mb-0 item-desc">${sabor.descripcion}</p>
            </div>
        `;
        saboresContainer.appendChild(card);
    });
}

/**
 * Renderiza los productos con precio (Bebidas, Cervezas, Vinos y Postres)
 */
function renderProductosConPrecio(productos, contenedor, mensajeVacio = "No disponible") {
    if (!contenedor) return;
    contenedor.innerHTML = '';
    
    if (productos.length === 0) {
        contenedor.innerHTML = `<p class="text-muted p-3">${mensajeVacio}</p>`;
        return;
    }

    productos.forEach(prod => {
        const precioFormateado = new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            maximumFractionDigits: 0
        }).format(prod.precioLocal);

        // Selección dinámica de emojis para el placeholder gris temporal
        let emojiPlaceholder = '🥤';
        const catLower = prod.categoria.toLowerCase();
        if (catLower.includes('vino')) emojiPlaceholder = '🍷';
        else if (catLower.includes('cerveza')) emojiPlaceholder = '🍺';
        else if (catLower.includes('agua')) emojiPlaceholder = '💧';
        else if (prod.tipo === 'postre') emojiPlaceholder = '🍰';

        const card = document.createElement('div');
        const claseBordeVino = catLower === 'vinos' ? 'border-start border-danger border-3' : '';
        card.className = `item-card bg-white shadow-sm text-center ${claseBordeVino}`;
        
        card.innerHTML = `
            <div class="item-img-container">
                <img src="${RUTA_FOTOS}${prod.imagen}${EXTENSION_FOTOS}" alt="${prod.nombre}" 
                     onerror="this.onerror=null; this.src='https://placehold.co/170x110?text=${emojiPlaceholder}';">
            </div>
            <div class="item-details d-flex flex-column align-items-center w-100">
                <h6 class="fw-bold mb-1 text-truncate w-100">${prod.nombre} <small class="text-muted d-block fw-normal">${prod.tamaño || ''}</small></h6>
                <span class="price-tag">${precioFormateado}</span>
            </div>
        `;
        contenedor.appendChild(card);
    });
}

/**
 * Filtra dinámicamente todo el menú basándose en el buscador
 */
function filtrarMenu() {
    let terminoBusqueda = searchInput ? searchInput.value.toLowerCase().trim() : '';

    // --- TRADUCTOR DE LUNFARDO PARA LA MUZZARELLA ---
    // Si el cliente busca "muzza", "muza" o "muzarela", lo transformamos internamente
    // en "muzzarella" para que el .includes() haga match perfecto.
    if (terminoBusqueda === 'muzza' || terminoBusqueda === 'muza' || terminoBusqueda === 'muzarela') {
        terminoBusqueda = 'muzzarella';
    }

    renderSabores(allSabores.filter(s => s.nombre.toLowerCase().includes(terminoBusqueda) || s.descripcion.toLowerCase().includes(terminoBusqueda)));
    renderProductosConPrecio(soloGaseosas.filter(b => b.nombre.toLowerCase().includes(terminoBusqueda)), gaseosasContainer, "No se encontraron gaseosas.");
    renderProductosConPrecio(soloAguas.filter(a => a.nombre.toLowerCase().includes(terminoBusqueda)), aguasContainer, "No se encontraron aguas.");
    renderProductosConPrecio(soloCervezas.filter(c => c.nombre.toLowerCase().includes(terminoBusqueda)), cervezasContainer, "No se encontraron cervezas.");
    renderProductosConPrecio(soloVinos.filter(v => v.nombre.toLowerCase().includes(terminoBusqueda)), vinosContainer, "No se encontraron vinos.");
    renderProductosConPrecio(soloPostres.filter(p => p.nombre.toLowerCase().includes(terminoBusqueda)), postresContainer, "No se encontraron postres.");
}

// --- ESCUCHADORES DE EVENTOS E INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', () => {
    if (searchInput) {
        searchInput.addEventListener('input', filtrarMenu);
    }
    
    renderSabores(allSabores);
    renderProductosConPrecio(soloGaseosas, gaseosasContainer);
    renderProductosConPrecio(soloAguas, aguasContainer);
    renderProductosConPrecio(soloCervezas, cervezasContainer);
    renderProductosConPrecio(soloVinos, vinosContainer);
    renderProductosConPrecio(soloPostres, postresContainer);
});