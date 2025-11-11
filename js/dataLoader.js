// =======================================================
// dataLoader.js: Carga de Datos desde Google Sheets (JSON/CSV)
// =======================================================

// !!! MUY IMPORTANTE: Reemplaza esta URL con la que obtengas al publicar
//    tu Google Sheet (Archivo > Compartir > Publicar en la web > Formato CSV o JSON).
const DATA_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQslem2QSxQVorpfXGxSw90U9UvH6Ng1mFIP0G6inFAgDXFhaTbLc1cVgckOM1surHHWf9iMI0r85tr/pub?output=csv'; 

// Array global para almacenar los sabores y precios cargados
let allSabores = [];
let allBebidas = [];

/**
 * Función principal para obtener los datos de la hoja de cálculo.
 */
async function loadPizzaData() {
    try {
        // Usamos fetch() para obtener los datos de la URL pública
        const response = await fetch(DATA_SHEET_URL);
        
        // Asumimos que la hoja se publica como JSON para simplificar
        // Si usas CSV, necesitarás una librería para parsearlo
        const data = await response.json(); 

        // Suponiendo que la estructura JSON es un array de objetos:
        // {nombre: "Muzzarella", precio: 500, categoria: "Clásica"}
        
        // Aquí deberás separar los datos en las listas de sabores y bebidas
        allSabores = data.filter(item => item.tipo === 'pizza').sort((a, b) => a.nombre.localeCompare(b.nombre));
        allBebidas = data.filter(item => item.tipo !== 'pizza');

        console.log('Datos de pizza cargados:', allSabores.length);
        console.log('Datos de bebidas cargados:', allBebidas.length);

        // Llamamos a la función que inicia el configurador una vez que los datos están listos
        initializeConfigurator(); 

    } catch (error) {
        console.error('Error al cargar datos desde Google Sheets:', error);
        // Mostrar un mensaje de error al usuario
        document.getElementById('pedido-list-container').innerHTML = 
            '<p class="text-danger">No se pudieron cargar los sabores. Por favor, intenta más tarde.</p>';
    }
}

// Iniciar la carga de datos tan pronto como la página se cargue
document.addEventListener('DOMContentLoaded', loadPizzaData);

// Exportar las variables para usarlas en otros archivos JS
export { allSabores, allBebidas };


// js/pizzaConfig.js (Añadir a la función updatePizzaSummary)

/**
 * Actualiza la columna derecha del resumen de la pizza y habilita los botones.
 */
function updatePizzaSummary() {
    // ... (Tu código para actualizar la lista de sabores seleccionados aquí) ...
    
    // --- Lógica de Habilitación de Botones ---
    const isReady = pizzaActual.length > 0; // ¿Hay al menos 1 sabor seleccionado?

    document.getElementById('btn-add-to-cart-continue').disabled = !isReady;
    document.getElementById('btn-go-to-checkout').disabled = !isReady;

    // ... (El resto del código de la función) ...
}

// Asegúrate de que esta función se llama al inicio para validar el estado inicial
// y cada vez que se llama a window.toggleSabor.