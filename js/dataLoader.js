// =======================================================
// dataLoader.js: Carga de Datos desde Google Sheets (JSON)
// =======================================================

// !!! MUY IMPORTANTE: La URL DEBE terminar en output=json y apuntar a una URL válida.
const DATA_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQslem2QSxQVorpfXGxSw90U9UvH6Ng1mFIP0G6inFAgDXFhaTbLc1cVgckOM1surHHWf9iMI0r85tr/pub?output=json'; 

// Array global para almacenar los datos
let allSabores = [];
let allBebidas = [];
let ALL_PRODUCTOS = []; // Variable global para todos los ítems de precio (pizzas base y bebidas)
let PIZZA_PRECIO_BASE = 0; // Variable global para el precio base (Ej: Pizza Especial Entera)

/**
 * Función principal para obtener los datos de la hoja de cálculo.
 */
async function loadPizzaData() {
    try {
        const response = await fetch(DATA_SHEET_URL);
        
        // 🛑 CORRECCIÓN 1: Manejar el error de recibir HTML
        // Si la URL es incorrecta, Google devuelve HTML. Verificamos el estado.
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        // Usamos .text() primero para depuración si falla, pero mantenemos .json()
        const data = await response.json(); 
        
        // 🛑 CORRECCIÓN 2: Ajustar Filtros por 'sabor' y separar 'bebida'
        // Tu hoja tiene 'tipo: sabor', no 'tipo: pizza'.
        allSabores = data
            .filter(item => item.tipo === 'sabor')
            .sort((a, b) => a.nombre.localeCompare(b.nombre));
            
        // 🛑 CORRECCIÓN 3: Separar TODOS los productos con precio (bases y bebidas)
        // Usamos !== 'sabor' para incluir bebidas y bases de pizza.
        ALL_PRODUCTOS = data.filter(item => item.tipo !== 'sabor');
        
        // 🛑 CORRECCIÓN 4: Extraer Bebidas y Precio Base
        allBebidas = ALL_PRODUCTOS.filter(item => item.tipo === 'bebida');
        
        const pizzaBaseItem = ALL_PRODUCTOS.find(item => item.nombre.includes('Especial') && item.tipo === 'pizza_base');
        PIZZA_PRECIO_BASE = pizzaBaseItem ? pizzaBaseItem.precioBase : 13000; // Valor por defecto para evitar errores
        
        console.log('Datos de sabores cargados:', allSabores.length);
        console.log('Datos de bebidas cargados:', allBebidas.length);
        console.log('Precio base de pizza especial:', PIZZA_PRECIO_BASE);

        // Llamamos a la función que inicia el configurador una vez que los datos están listos
        initializeConfigurator(allSabores); // Pasamos allSabores si initializeConfigurator lo necesita

    } catch (error) {
        console.error('Error al cargar datos desde Google Sheets:', error);
        // Mostrar un mensaje de error al usuario
        document.getElementById('pedido-list-container').innerHTML = 
            '<p class="text-danger">No se pudieron cargar los sabores. Por favor, intenta más tarde.</p>';
    }
}

// Iniciar la carga de datos tan pronto como la página se cargue
document.addEventListener('DOMContentLoaded', loadPizzaData);

// 🛑 CORRECCIÓN 5: Exportar todas las variables necesarias
// Exportar las variables para usarlas en otros archivos JS
export { allSabores, allBebidas, ALL_PRODUCTOS, PIZZA_PRECIO_BASE };