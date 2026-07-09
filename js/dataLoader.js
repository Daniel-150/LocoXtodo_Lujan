// =======================================================
// dataLoader.js: Punto único de datos del menú
// =======================================================
// Combina sabores, bebidas y postres, y les "pega" el precio final
// (precioLlevar / precioLocal) a cada bebida y postre. No tiene
// lógica de carga: al ser datos locales, están disponibles apenas
// se importan.

import { allSabores } from './pizzaData.js';
import { allBebidas as bebidasSinPrecio } from './bebidasData.js';
import { allPostres } from './postresData.js';
import { PRECIOS_POR_CATEGORIA } from './preciosBebidas.js';

/**
 * Le asigna el precio final a cada producto (bebida o postre):
 * - Si el producto ya trae su propio precioLlevar/precioLocal (como
 *   los vinos, que no comparten categoría de precio), se respeta tal cual.
 * - Si no, se busca en la tabla central por su "categoriaPrecio".
 */
function resolverPrecios(productos) {
    return productos.map(producto => {
        if (producto.precioLlevar !== undefined && producto.precioLocal !== undefined) {
            return producto;
        }

        const tier = PRECIOS_POR_CATEGORIA[producto.categoriaPrecio];
        if (!tier) {
            console.warn(`No se encontró precio para la categoría "${producto.categoriaPrecio}" del producto "${producto.nombre}".`);
            return { ...producto, precioLlevar: 0, precioLocal: 0 };
        }

        return { ...producto, precioLlevar: tier.precioLlevar, precioLocal: tier.precioLocal };
    });
}

// Bebidas y postres comparten el mismo acordeón/carrito en esta página,
// así que se combinan en una sola lista ya con los precios resueltos.
const allBebidas = resolverPrecios([...bebidasSinPrecio, ...allPostres]);

// Dos niveles de precio de pizza: la muzzarella pura (4/4 muzzarella y
// nada más) es más barata que cualquier otra combinación ("especial"),
// incluso si tiene 3/4 muzza y solo 1/4 de otro sabor.
const PRECIO_MUZZA_PURA = 14000;
const PRECIO_PIZZA_ESPECIAL = 16000;

const ALL_PRODUCTOS = [
    { nombre: "Pizza de Muzzarella", tamaño: "entera", precioBase: PRECIO_MUZZA_PURA, tipo: "pizza_base" },
    { nombre: "Pizza Especial", tamaño: "entera", precioBase: PRECIO_PIZZA_ESPECIAL, tipo: "pizza_base" },
    ...allBebidas
];

export { allSabores, allBebidas, ALL_PRODUCTOS, PRECIO_MUZZA_PURA, PRECIO_PIZZA_ESPECIAL };
