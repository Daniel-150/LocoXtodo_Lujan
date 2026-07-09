// =======================================================
// postresData.js: Catálogo de Postres (Hardcodeado, sin DB)
// =======================================================
// Mismo patrón que bebidasData.js: el precio no vive acá, se busca
// en preciosBebidas.js a través de "categoriaPrecio".

const allPostres = [
    { id: 201, nombre: "Tiramisú",    categoria: "Postres", categoriaPrecio: "Postres", tamaño: "Porción", imagen: "tiramisu",   tipo: "postre" },
    { id: 202, nombre: "Postre Oreo", categoria: "Postres", categoriaPrecio: "Postres", tamaño: "Porción", imagen: "oreo",       tipo: "postre" },
    { id: 203, nombre: "Chocotorta",  categoria: "Postres", categoriaPrecio: "Postres", tamaño: "Porción", imagen: "chocotorta", tipo: "postre" },
    { id: 204, nombre: "Cheesecake",  categoria: "Postres", categoriaPrecio: "Postres", tamaño: "Porción", imagen: "cheesecake", tipo: "postre" },
    { id: 205, nombre: "Flan",        categoria: "Postres", categoriaPrecio: "Postres", tamaño: "Porción", imagen: "flan",       tipo: "postre" },
];

export { allPostres };
