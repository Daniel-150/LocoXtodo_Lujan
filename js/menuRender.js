import { allSabores, allBebidas } from './dataLoader.js';

// Inicializamos el contador local de consumo de la mesa
let consumoMesa = {};

export function renderizarMenuSalon() {
    // 1. RENDER PIZZAS (Ilustrativo - Pizza Libre)
    const grillaPizzas = document.getElementById('grilla-pizzas');
    grillaPizzas.innerHTML = allSabores.map(sabor => `
        <div class="col-6 col-md-3">
            <div class="card h-100 text-center border-0 shadow-sm p-2 rounded-3">
                <img src="img/${sabor.imagen}.jpeg" class="rounded-circle mx-auto my-2" style="width: 70px; height: 70px; object-fit: cover;" onerror="this.src='img/muzzarela.jpeg'">
                <div class="card-body p-1">
                    <strong class="d-block text-dark small">${sabor.nombre}</strong>
                    <p class="text-muted card-text style-ingredients m-0 text-truncate-2" style="font-size: 0.75rem;">${sabor.descripcion}</p>
                </div>
            </div>
        </div>
    `).join('');

    // 2. RENDER BEBIDAS GENERALES (Línea Pepsi, Aguas, Cervezas)
    const categoriasBebidas = document.getElementById('categorias-bebidas');
    const bebidasComunes = allBebidas.filter(b => b.categoria !== 'Vinos' && b.categoria !== 'Postres');
    
    // Agrupamos dinámicamente por la propiedad .categoria para armar los bloques
    const agrupadas = bebidasComunes.reduce((acc, b) => {
        acc[b.categoria] = acc[b.categoria] || [];
        acc[b.categoria].push(b);
        return acc;
    }, {});

    categoriasBebidas.innerHTML = Object.keys(agrupadas).map(cat => `
        <h5 class="fw-bold text-secondary mt-3 border-bottom pb-1">${cat}</h5>
        <div class="row g-2 mb-3">
            ${agrupadas[cat].map(b => `
                <div class="col-12 col-md-6">
                    <div class="d-flex justify-content-between align-items-center p-2 border rounded bg-white shadow-sm">
                        <div class="d-flex align-items-center gap-2">
                            <img src="img/${b.imagen}.jpeg" style="width: 40px; height: 40px; object-fit: cover; border-radius: 6px;" onerror="this.src='img/agua.jpeg'">
                            <div>
                                <strong class="text-dark d-block" style="font-size: 0.9rem;">${b.nombre}</strong>
                                <small class="text-muted" style="font-size: 0.75rem;">Tamaño: ${b.tamaño}</small>
                            </div>
                        </div>
                        <div class="d-flex align-items-center gap-3">
                            <span class="fw-bold text-success" style="font-size: 0.95rem;">$${b.precioLocal}</span>
                            <div class="btn-group btn-group-sm border rounded">
                                <button class="btn btn-light px-2" onclick="modificarConsumoMesa(${b.id}, -1)">-</button>
                                <span class="px-2 bg-white fw-bold d-flex align-items-center" id="cant-mesa-${b.id}">0</span>
                                <button class="btn btn-light px-2" onclick="modificarConsumoMesa(${b.id}, 1)">+</button>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `).join('');

    // 3. RENDER VINOS PREMIUM
    const grillaVinos = document.getElementById('grilla-vinos');
    const losVinos = allBebidas.filter(b => b.categoria === 'Vinos');
    
    grillaVinos.innerHTML = losVinos.map(v => `
        <div class="col-12 col-md-6">
            <div class="card card-vino h-100 shadow-sm">
                <div class="row g-0 h-100">
                    <div class="col-4 position-relative bg-light d-flex align-items-center justify-content-center">
                        <img src="img/${v.imagen}.jpeg" class="img-fluid p-2" style="max-height: 140px; object-fit: contain;" onerror="this.src='img/benjamin.jpeg'">
                    </div>
                    <div class="col-8">
                        <div class="card-body p-3 d-flex flex-column justify-content-between h-100">
                            <div>
                                <span class="badge badge-cepa mb-1">Cepa Recomendada</span>
                                <h6 class="fw-bold text-dark mb-1">${v.nombre}</h6>
                                <p class="text-muted small mb-2" style="font-size: 0.75rem; line-height: 1.2;">
                                    Excelente cuerpo. Ideal para resaltar los sabores intensos de nuestra pizza libre.
                                </p>
                            </div>
                            <div class="d-flex justify-content-between align-items-center mt-2">
                                <span class="fw-extrabold text-success h5 mb-0">$${v.precioLocal}</span>
                                <div class="btn-group btn-group-sm border rounded">
                                    <button class="btn btn-light" onclick="modificarConsumoMesa(${v.id}, -1)">-</button>
                                    <span class="px-3 bg-white fw-bold d-flex align-items-center" id="cant-mesa-${v.id}">0</span>
                                    <button class="btn btn-light" onclick="modificarConsumoMesa(${v.id}, 1)">+</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    // 4. RENDER POSTRES TENTADORES
    const grillaPostres = document.getElementById('grilla-postres');
    const losPostres = allBebidas.filter(b => b.categoria === 'Postres');

    grillaPostres.innerHTML = losPostres.map(p => `
        <div class="col-12 col-md-4">
            <div class="card card-postre h-100 bg-white">
                <img src="img/${p.imagen}.jpeg" class="card-img-top" onerror="this.src='img/tiramisu.jpeg'">
                <div class="card-body p-3 d-flex flex-column justify-content-between">
                    <div>
                        <h6 class="fw-bold text-dark mb-1">${p.nombre}</h6>
                        <small class="text-muted d-block mb-2" style="font-size: 0.8rem;">Elaboración casera y artesanal por porción.</small>
                    </div>
                    <div class="d-flex justify-content-between align-items-center mt-2">
                        <span class="fw-bold text-success h5 mb-0">$${p.precioLocal}</span>
                        <div class="btn-group btn-group-sm border rounded">
                            <button class="btn btn-light" onclick="modificarConsumoMesa(${p.id}, -1)">-</button>
                            <span class="px-3 bg-white fw-bold d-flex align-items-center" id="cant-mesa-${p.id}">0</span>
                            <button class="btn btn-light" onclick="modificarConsumoMesa(${p.id}, 1)">+</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Lógica del contador dinámico del presupuesto de mesa
window.modificarConsumoMesa = function(id, cambio) {
    consumoMesa[id] = (consumoMesa[id] || 0) + cambio;
    if (consumoMesa[id] < 0) consumoMesa[id] = 0;
    
    // Sincronizamos el contador visual de la tarjeta
    document.getElementById(`cant-mesa-${id}`).textContent = consumoMesa[id];
    
    // Calculamos el total acumulado de la mesa
    let totalMesa = 0;
    allBebidas.forEach(prod => {
        const cant = consumoMesa[prod.id] || 0;
        totalMesa += cant * prod.precioLocal;
    });
    
    document.getElementById('total-presupuesto-mesa').textContent = `$${totalMesa.toLocaleString('es-AR')}`;
};