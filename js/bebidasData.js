// =======================================================
// bebidasData.js: Catálogo de Bebidas (Hardcodeado, sin DB)
// =======================================================
// El precio de cada producto NO vive acá (salvo los vinos): vive en
// preciosBebidas.js, referenciado por "categoriaPrecio". dataLoader.js
// es quien le "pega" el precio final a cada uno.
//
// "categoria"      → nombre para agrupar visualmente en el acordeón
// "categoriaPrecio" → clave para buscar el precio en preciosBebidas.js

const allBebidas = [
    // --- Gaseosas línea Pepsi ---
    { id: 101, nombre: "Pepsi",              categoria: "Gaseosas Línea Pepsi", categoriaPrecio: "Gaseosa", tamaño: "1.5L", imagen: "pepsi",        tipo: "bebida" },
    { id: 102, nombre: "7up",                categoria: "Gaseosas Línea Pepsi", categoriaPrecio: "Gaseosa", tamaño: "1.5L", imagen: "7up",          tipo: "bebida" },
    { id: 103, nombre: "Mirinda",            categoria: "Gaseosas Línea Pepsi", categoriaPrecio: "Gaseosa", tamaño: "1.5L", imagen: "mirinda",      tipo: "bebida" },
    { id: 104, nombre: "Paso de los Toros",  categoria: "Gaseosas Línea Pepsi", categoriaPrecio: "Gaseosa", tamaño: "1.5L", imagen: "paso_toros",   tipo: "bebida" },

    // --- Agua saborizada Levite ---
    { id: 105, nombre: "Levite Manzana",     categoria: "Agua Saborizada Levite", categoriaPrecio: "Agua Saborizada", tamaño: "1.5L", imagen: "levite_manzana", tipo: "bebida" },
    { id: 106, nombre: "Levite Pomelo",      categoria: "Agua Saborizada Levite", categoriaPrecio: "Agua Saborizada", tamaño: "1.5L", imagen: "levite_pomelo",  tipo: "bebida" },
    { id: 107, nombre: "Levite Naranja",     categoria: "Agua Saborizada Levite", categoriaPrecio: "Agua Saborizada", tamaño: "1.5L", imagen: "levite_naranja", tipo: "bebida" },

    // --- Agua ---
    { id: 108, nombre: "Agua Mineral",         categoria: "Agua", categoriaPrecio: "Agua", tamaño: "1.5L", imagen: "agua",     tipo: "bebida" },
    { id: 109, nombre: "Agua Mineral con Gas", categoria: "Agua", categoriaPrecio: "Agua", tamaño: "1.5L", imagen: "agua_gas", tipo: "bebida" },

    // --- Gaseosas chicas línea Pepsi ---
    { id: 110, nombre: "Pepsi Chica",              categoria: "Gaseosas Chicas", categoriaPrecio: "Gaseosa Chica", tamaño: "500ml", imagen: "pepsi_chica",      tipo: "bebida" },
    { id: 111, nombre: "7up Chica",                categoria: "Gaseosas Chicas", categoriaPrecio: "Gaseosa Chica", tamaño: "500ml", imagen: "7up_chica",        tipo: "bebida" },
    { id: 112, nombre: "Mirinda Chica",            categoria: "Gaseosas Chicas", categoriaPrecio: "Gaseosa Chica", tamaño: "500ml", imagen: "mirinda_chica",    tipo: "bebida" },
    { id: 113, nombre: "Paso de los Toros Chica",  categoria: "Gaseosas Chicas", categoriaPrecio: "Gaseosa Chica", tamaño: "500ml", imagen: "paso_toros_chica", tipo: "bebida" },

    // --- Agua chica ---
    { id: 114, nombre: "Agua Mineral Chica",         categoria: "Agua Chica", categoriaPrecio: "Agua Chica", tamaño: "500ml", imagen: "agua_chica",     tipo: "bebida" },
    { id: 115, nombre: "Agua Mineral con Gas Chica", categoria: "Agua Chica", categoriaPrecio: "Agua Chica", tamaño: "500ml", imagen: "agua_gas_chica", tipo: "bebida" },

    // --- Cerveza económica (botella 1L) ---
    { id: 116, nombre: "Brahma", categoria: "Cerveza", categoriaPrecio: "Cerveza Barata", tamaño: "1L", imagen: "brahma", tipo: "bebida" },
    { id: 117, nombre: "Andes",  categoria: "Cerveza", categoriaPrecio: "Cerveza Barata", tamaño: "1L", imagen: "andes",  tipo: "bebida" },

    // --- Cerveza premium (botella 1L) ---
    { id: 118, nombre: "Stella Artois",           categoria: "Cerveza", categoriaPrecio: "Cerveza Cara", tamaño: "1L", imagen: "stella_artois",   tipo: "bebida" },
    { id: 119, nombre: "Corona",                  categoria: "Cerveza", categoriaPrecio: "Cerveza Cara", tamaño: "1L", imagen: "corona",          tipo: "bebida" },
    { id: 120, nombre: "Patagonia Amber Lager",   categoria: "Cerveza", categoriaPrecio: "Cerveza Cara", tamaño: "1L", imagen: "patagonia_amber", tipo: "bebida" },
    { id: 121, nombre: "Patagonia 24/7",          categoria: "Cerveza", categoriaPrecio: "Cerveza Cara", tamaño: "1L", imagen: "patagonia_247",   tipo: "bebida" },

    // --- Cerveza en lata / porrón ---
    { id: 122, nombre: "Brahma Lata",        categoria: "Cerveza", categoriaPrecio: "Cerveza Lata Barata",      tamaño: "Lata",   imagen: "brahma_lata",   tipo: "bebida" },
    { id: 123, nombre: "Quilmes Lata",       categoria: "Cerveza", categoriaPrecio: "Cerveza Lata Barata",      tamaño: "Lata",   imagen: "quilmes_lata",  tipo: "bebida" },
    { id: 124, nombre: "Stella Artois Lata", categoria: "Cerveza", categoriaPrecio: "Cerveza Lata/Porrón Cara", tamaño: "Lata",   imagen: "stella_lata",   tipo: "bebida" },
    { id: 125, nombre: "Corona Porrón",      categoria: "Cerveza", categoriaPrecio: "Cerveza Lata/Porrón Cara", tamaño: "Porrón", imagen: "corona_porron", tipo: "bebida" },

    // --- Vinos: cada uno con su propio precio (no comparten categoría de precio) ---
    // precioLocal = precio actual del vino. precioLlevar = mitad, redondeado a $500.
    { id: 126, nombre: "Perro Callejero",                 categoria: "Vinos", tamaño: "750ml", precioLlevar: 5000, precioLocal: 9500, imagen: "perro_callejero", tipo: "bebida" },
    { id: 127, nombre: "Emilia",                          categoria: "Vinos", tamaño: "750ml", precioLlevar: 4500, precioLocal: 9000, imagen: "emilia",          tipo: "bebida" },
    { id: 128, nombre: "Benjamín",                        categoria: "Vinos", tamaño: "750ml", precioLlevar: 3500, precioLocal: 7000, imagen: "benjamin",        tipo: "bebida" },
    { id: 129, nombre: "Cosecha Tardía",                  categoria: "Vinos", tamaño: "750ml", precioLlevar: 3500, precioLocal: 6500, imagen: "cosecha_tardia",  tipo: "bebida" },
    { id: 130, nombre: "Norton",                          categoria: "Vinos", tamaño: "750ml", precioLlevar: 3500, precioLocal: 6500, imagen: "norton",          tipo: "bebida" },
    { id: 131, nombre: "López",                           categoria: "Vinos", tamaño: "750ml", precioLlevar: 3000, precioLocal: 6000, imagen: "lopez",           tipo: "bebida" },
    { id: 132, nombre: "Novecento",                       categoria: "Vinos", tamaño: "750ml", precioLlevar: 3000, precioLocal: 5500, imagen: "novecento",       tipo: "bebida" },
    { id: 133, nombre: "Vasco Viejo",                     categoria: "Vinos", tamaño: "750ml", precioLlevar: 2000, precioLocal: 4000, imagen: "vasco_viejo",     tipo: "bebida" },
    { id: 134, nombre: "Michel Torino (Vino de la Casa)", categoria: "Vinos", tamaño: "750ml", precioLlevar: 2000, precioLocal: 4000, imagen: "michel_torino",   tipo: "bebida" },
];

export { allBebidas };
