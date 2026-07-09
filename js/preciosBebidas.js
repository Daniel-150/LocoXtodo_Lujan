// =======================================================
// preciosBebidas.js: Tabla central de precios por categoría
// =======================================================
// Cambiar un precio acá actualiza automáticamente a todos los
// productos de esa categoría (bebidas y postres). Los vinos NO
// están acá porque cada uno tiene su propio precio individual
// (se define directo en bebidasData.js).
//
// precioLlevar = pedido para retirar (lo que usa esta página)
// precioLocal  = consumo en el salón (para el futuro menú aparte)

const PRECIOS_POR_CATEGORIA = {
    "Gaseosa":                   { precioLlevar: 3500, precioLocal: 7000 },
    "Agua Saborizada":           { precioLlevar: 3500, precioLocal: 7000 },
    "Gaseosa Chica":             { precioLlevar: 2000, precioLocal: 3500 },
    "Agua":                      { precioLlevar: 2500, precioLocal: 5000 },
    "Agua Chica":                { precioLlevar: 1500, precioLocal: 3000 },
    "Cerveza Barata":            { precioLlevar: 3500, precioLocal: 7000 },
    "Cerveza Cara":              { precioLlevar: 4500, precioLocal: 9000 },
    "Cerveza Lata Barata":       { precioLlevar: 2500, precioLocal: 4000 },
    "Cerveza Lata/Porrón Cara":  { precioLlevar: 3000, precioLocal: 5000 },
    "Postres":                   { precioLlevar: 3500, precioLocal: 5000 },
};

export { PRECIOS_POR_CATEGORIA };
