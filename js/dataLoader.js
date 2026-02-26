// =======================================================
// dataLoader.js: Carga de Datos Local (Seguro y Rápido)
// =======================================================

/**
 * DATOS LOCALES: 
 * Al guardarlos aquí, tu página funcionará siempre, incluso sin internet.
 * Ideal para tu portfolio en GitHub Pages.
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

/**
 * Función que simula la carga de datos.
 * Mantenemos la estructura para no romper el resto de tu app.
 */
async function loadPizzaData() {
    console.log("Iniciando carga de datos locales...");
    
    try {
        // Simulamos una pequeña espera para que se vea el "Cargando..." un milisegundo
        setTimeout(() => {
            console.log('Datos de sabores cargados:', allSabores.length);
            
            // Verificamos si la función existe en el window antes de llamarla
            if (typeof window.initializeConfigurator === 'function') {
                window.initializeConfigurator();
            } else {
                console.warn("initializeConfigurator aún no está disponible.");
            }
        }, 100);

    } catch (error) {
        console.error('Error al procesar datos:', error);
        const container = document.getElementById('pedido-list-container');
        if (container) container.innerHTML = '<p class="text-danger">Error al cargar el menú.</p>';
    }
}

// Iniciar la carga
document.addEventListener('DOMContentLoaded', loadPizzaData);

// Exportar para pizzaConfig.js
export { allSabores, allBebidas, ALL_PRODUCTOS, PIZZA_PRECIO_BASE };