// =======================================================
// pizzaData.js: Catálogo de Sabores (Hardcodeado, sin DB)
// =======================================================
// Ordenado alfabéticamente. Cada sabor tiene un "id" único
// para no depender del nombre exacto como identificador.

const allSabores = [
    { id: 1,  nombre: "Aceituna",               descripcion: "Muzzarella y aceitunas verdes.",                      imagen: "aceituna",        tipo: "sabor" },
    { id: 2,  nombre: "Acelga con Salsa Blanca", descripcion: "Acelga salteada con salsa blanca cremosa.",           imagen: "acelga",          tipo: "sabor" },
    { id: 3,  nombre: "Anchoas",                 descripcion: "Muzzarella y filetos de anchoa.",                     imagen: "anchoas",         tipo: "sabor" },
    { id: 4,  nombre: "Atún",                    descripcion: "Muzzarella y atún.",                                  imagen: "atun",            tipo: "sabor" },
    { id: 5,  nombre: "Berenjena",               descripcion: "Muzzarella y berenjenas grilladas.",                  imagen: "berenjena",       tipo: "sabor" },
    { id: 6,  nombre: "Boloñesa",                descripcion: "Muzzarella y salsa boloñesa.",                        imagen: "bolonesa",        tipo: "sabor" },
    { id: 7,  nombre: "Bondiola",                descripcion: "Muzzarella y bondiola braseada.",                     imagen: "bondiola",        tipo: "sabor" },
    { id: 8,  nombre: "Calabresa",               descripcion: "Muzzarella y longaniza calabresa.",                   imagen: "calabresa",       tipo: "sabor" },
    { id: 9,  nombre: "Champiñones",             descripcion: "Muzzarella y champiñones salteados.",                 imagen: "champinones",     tipo: "sabor" },
    { id: 10, nombre: "Choclo",                  descripcion: "Muzzarella y choclo cremoso.",                        imagen: "choclo",          tipo: "sabor" },
    { id: 11, nombre: "Criolla",                 descripcion: "Muzzarella, morrón, cebolla y tomate.",               imagen: "criolla",         tipo: "sabor" },
    { id: 12, nombre: "Cuatro Quesos",           descripcion: "Muzzarella, roquefort, provolone y parmesano.",       imagen: "cuatro_quesos",   tipo: "sabor" },
    { id: 13, nombre: "Faina",                   descripcion: "Torta de harina de garbanzo, acompañamiento clásico.",imagen: "faina",           tipo: "sabor" }, // ⚠️ No es sabor de pizza, es un acompañamiento
    { id: 14, nombre: "Fugazzeta",               descripcion: "Muzzarella y mucha cebolla.",                         imagen: "fugazzeta",       tipo: "sabor" },
    { id: 15, nombre: "Fugazzeta a la Crema",    descripcion: "Fugazzeta con un toque de crema.",                    imagen: "fugazzeta_crema", tipo: "sabor" },
    { id: 16, nombre: "Huevo Frito",             descripcion: "Muzzarella y huevo frito.",                           imagen: "huevo_frito",     tipo: "sabor" },
    { id: 17, nombre: "Huevo Rallado",           descripcion: "Muzzarella y huevo duro rallado.",                    imagen: "huevo_rallado",   tipo: "sabor" },
    { id: 18, nombre: "Jamón",                   descripcion: "Muzzarella y jamón cocido.",                          imagen: "jamon",           tipo: "sabor" },
    { id: 19, nombre: "Jamón y Ananá",           descripcion: "Muzzarella, jamón y ananá.",                          imagen: "jamon_anana",     tipo: "sabor" },
    { id: 20, nombre: "Jamón y Morrón",          descripcion: "La clásica combinación de jamón y morrón.",           imagen: "jamon_morron",    tipo: "sabor" },
    { id: 21, nombre: "Muzzarella",              descripcion: "Salsa de tomate, muzzarella y aceitunas.",            imagen: "muzzarella",      tipo: "sabor" },
    { id: 22, nombre: "Napolitana",              descripcion: "Muzzarella, rodajas de tomate y ajo.",                imagen: "napolitana",      tipo: "sabor" },
    { id: 23, nombre: "Panceta",                 descripcion: "Muzzarella y panceta ahumada.",                       imagen: "panceta",         tipo: "sabor" },
    { id: 24, nombre: "Papas Pay",               descripcion: "Muzzarella y papas paja crocantes.",                  imagen: "papas_pay",       tipo: "sabor" },
    { id: 25, nombre: "Pollo",                   descripcion: "Muzzarella y pollo.",                                 imagen: "pollo",           tipo: "sabor" },
    { id: 26, nombre: "Pollo a la Mostaza",      descripcion: "Muzzarella, pollo y salsa de mostaza.",               imagen: "pollo_mostaza",   tipo: "sabor" },
    { id: 27, nombre: "Provolone",               descripcion: "Muzzarella y provolone gratinado.",                   imagen: "provolone",       tipo: "sabor" },
    { id: 28, nombre: "Roquefort",               descripcion: "Muzzarella y queso azul intenso.",                    imagen: "roquefort",       tipo: "sabor" },
    { id: 29, nombre: "Rúcula",                  descripcion: "Muzzarella y rúcula fresca.",                         imagen: "rucula",          tipo: "sabor" },
    { id: 30, nombre: "Tomate y Albahaca",       descripcion: "Tomate fresco, muzzarella y albahaca.",               imagen: "tomate_albahaca", tipo: "sabor" },
    { id: 31, nombre: "Tomate y Provenzal",      descripcion: "Tomate, muzzarella y ajo provenzal.",                 imagen: "tomate_provenzal",tipo: "sabor" },
    { id: 32, nombre: "Verdeo",                  descripcion: "Muzzarella y cebolla de verdeo.",                     imagen: "verdeo",          tipo: "sabor" },
    { id: 33, nombre: "Verdeo a la Crema",       descripcion: "Verdeo con un toque de crema.",                       imagen: "verdeo_crema",    tipo: "sabor" },
];

export { allSabores };
