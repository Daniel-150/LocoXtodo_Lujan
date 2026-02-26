// =======================================================
// dataLoader.js: Carga de Datos Local (Seguro y Rápido)
// =======================================================

/**
 * DATOS LOCALES: 
 * Al guardarlos aquí, tu página funcionará siempre.
 */

const allSabores = [
    { nombre: "Muzzarella", descripcion: "Salsa de tomate, muzzarella, aceitunas.", imagen: "muzza", tipo: "sabor" },
    { nombre: "Fugazzetta", descripcion: "Muzzarella y mucha cebolla.", imagen: "fuga", tipo: "sabor" },
    { nombre: "Napolitana", descripcion: "Muzzarella, rodajas de tomate y ajo.", imagen: "napo", tipo: "sabor" },
    { nombre: "Calabresa", descripcion: "Muzzarella y longaniza de primera.", imagen: "cala", tipo: "sabor" },
    { nombre: "Roquefort", descripcion: "Muzzarella y queso azul intenso.", imagen: "roquefort", tipo: "sabor" },
    { nombre: "Jamón y Morrón", descripcion: "La clásica combinación.", imagen: "jamon", tipo: "sabor" }
];

const allBebidas = [
    { id: 101, nombre: "Coca Cola", tamaño: "1.5L", precio: 2500, imagen: "coca.jpg", tipo: "bebida" },
    { id: 102, nombre: "Cerveza Quilmes", tamaño: "1L", precio: 3000, imagen: "quilmes.jpg", tipo: "bebida" },
    { id: 103, nombre: "Agua Mineral", tamaño: "500ml", precio: 1200, imagen: "agua.jpg", tipo: "bebida" }
];

const ALL_PRODUCTOS = [
    { nombre: "Pizza Especial", tamaño: "entera", precioBase: 13000, tipo: "pizza_base" },
    ...allBebidas
];

const PIZZA_PRECIO_BASE = 13000;

// MODIFICACIÓN DE SEGURIDAD PARA EVITAR BUCLES
let yaCargado = false; 

async function loadPizzaData() {
    if (yaCargado) return; 
    
    console.log("Cargando datos locales...");
    yaCargado = true; 

    try {
        // Un pequeño delay para asegurar que el DOM esté listo
        setTimeout(() => {
            if (typeof window.initializeConfigurator === 'function') {
                window.initializeConfigurator();
                console.log("¡Configurador inicializado!");
            } else {
                console.warn("initializeConfigurator no detectado todavía.");
            }
        }, 100);

    } catch (error) {
        console.error('Error al cargar datos:', error);
        const container = document.getElementById('sabores-list-container');
        if (container) container.innerHTML = '<p class="text-danger">Error al cargar el menú.</p>';
    }
}

// Iniciar la carga manualmente
loadPizzaData();

// EXPORTACIÓN IMPORTANTE (Esto es lo que fallaba)
export { allSabores, allBebidas, ALL_PRODUCTOS, PIZZA_PRECIO_BASE };