// =======================================================
// pizzaData.js: Catálogo de Sabores (carta real del local)
// =======================================================
// Ordenado alfabéticamente. Cada sabor tiene un "id" único
// para no depender del nombre exacto como identificador.
//
// ⚠️ Descripciones marcadas con "revisar" son mi mejor estimación —
// no tengo la receta exacta de esos sabores, confirmalas o corregilas.

const allSabores = [
    { id: 1,  nombre: "Aceitunas",                    descripcion: "Muzzarella y aceitunas verdes.",                       imagen: "aceitunas",         tipo: "sabor" },
    { id: 2,  nombre: "Acelga con Salsa Blanca",       descripcion: "Acelga con salsa blanca cremosa.",            imagen: "acelga",            tipo: "sabor" },
    { id: 3,  nombre: "Anchoas",                       descripcion: "Muzzarella salsa de tomate y filetos de anchoa.",                      imagen: "anchoas",           tipo: "sabor" },
    { id: 4,  nombre: "Atún",                          descripcion: "Muzzarella y atún.",                                   imagen: "atun",              tipo: "sabor" },
    { id: 5,  nombre: "Berenjenas",                    descripcion: "Muzzarella y berenjenas al escabeche.",                   imagen: "berenjenas",        tipo: "sabor" },
    { id: 6,  nombre: "Bolognesa",                     descripcion: "Muzzarella y salsa bolognesa con queso provolone.",                        imagen: "bolognesa",         tipo: "sabor" },
    { id: 7,  nombre: "Bondiola",                      descripcion: "Muzzarella y bondiola.",                      imagen: "bondiola",          tipo: "sabor" },
    { id: 8,  nombre: "Calabresa",                     descripcion: "Muzzarella y calabresa.",                    imagen: "calabresa",         tipo: "sabor" },
    { id: 9,  nombre: "Cebolla de Verdeo",             descripcion: "Muzzarella y cebolla de verdeo.",                      imagen: "cebolla_verdeo",    tipo: "sabor" },
    { id: 10, nombre: "Cebolla de Verdeo a la Crema",  descripcion: "Cebolla de verdeo con un toque de crema.",             imagen: "cebolla_verdeo_crema", tipo: "sabor" },
    { id: 11, nombre: "Champignon",                    descripcion: "Muzzarella y champignones.",                 imagen: "champignon",        tipo: "sabor" },
    { id: 12, nombre: "Choclo",                        descripcion: "Muzzarella y choclo cremoso.",                         imagen: "choclo",            tipo: "sabor" },
    { id: 13, nombre: "4 Quesos",                      descripcion: "Muzzarella, roquefort, provolone y parmesano.",        imagen: "cuatro_quesos",     tipo: "sabor" },
    { id: 14, nombre: "Fugazzeta",                     descripcion: "Muzzarella y mucha cebolla.",                          imagen: "fugazzeta",         tipo: "sabor" },
    { id: 15, nombre: "Fugazzeta a la Crema",          descripcion: "Fugazzeta con un toque de crema.",                     imagen: "fugazzeta_crema",   tipo: "sabor" },
    { id: 16, nombre: "Huevo Frito",                   descripcion: "Muzzarella y huevo frito.",                            imagen: "huevo_frito",       tipo: "sabor" },
    { id: 17, nombre: "Huevo Rallado",                 descripcion: "Muzzarella y huevo duro rallado.",                     imagen: "huevo_rallado",     tipo: "sabor" },
    { id: 18, nombre: "Jamón",                         descripcion: "Muzzarella y jamón cocido.",                           imagen: "jamon",             tipo: "sabor" },
    { id: 19, nombre: "Jamón y Ananá",                 descripcion: "Muzzarella, jamón y ananá.",                           imagen: "jamon_anana",       tipo: "sabor" },
    { id: 20, nombre: "Jamón y Morrón",                descripcion: "La clásica combinación de jamón y morrón.",            imagen: "jamon_morron",      tipo: "sabor" },
    { id: 21, nombre: "Muzzarella",                    descripcion: "Salsa de tomate y muzzarella.",                        imagen: "muzzarella",        tipo: "sabor" },
    { id: 22, nombre: "Napolitana",                    descripcion: "Muzzarella, jamon y tomate.",                 imagen: "napolitana",        tipo: "sabor" },
    { id: 23, nombre: "Palmitos",                      descripcion: "Muzzarella y palmitos con salsa golf.",                               imagen: "palmitos",          tipo: "sabor" },
    { id: 24, nombre: "Panceta",                       descripcion: "Muzzarella y panceta.",                        imagen: "panceta",           tipo: "sabor" },
    { id: 25, nombre: "Papas Pay",                     descripcion: "Muzzarella y papas pay crocantes.",                   imagen: "papas_pay",         tipo: "sabor" },
    { id: 26, nombre: "Pollo",                         descripcion: "Muzzarella y pollo condimentado.",                                  imagen: "pollo",             tipo: "sabor" },
    { id: 27, nombre: "Pollo a la Mostaza",            descripcion: "Muzzarella, pollo y salsa de mostaza.",                imagen: "pollo_mostaza",     tipo: "sabor" },
    { id: 28, nombre: "Provenzal",                     descripcion: "Muzzarella con ajo y perejil.",                        imagen: "provenzal",         tipo: "sabor" },
    { id: 29, nombre: "Provolone",                     descripcion: "Muzzarella y provolone gratinado.",                    imagen: "provolone",         tipo: "sabor" },
    { id: 30, nombre: "Roquefort",                     descripcion: "Muzzarella y queso azul intenso.",                     imagen: "roquefort",         tipo: "sabor" },
    { id: 31, nombre: "Rúcula",                        descripcion: "Muzzarella y rúcula fresca y queso provolone.",                          imagen: "rucula",            tipo: "sabor" },
    { id: 32, nombre: "Salchichas",                    descripcion: "Muzzarella y salchichas.",                             imagen: "salchichas",        tipo: "sabor" },
    { id: 33, nombre: "Salsa Cancha",                  descripcion: "Muzzarella con salsa de tomate y ajo.",                         imagen: "salsa_cancha",      tipo: "sabor" }, // ⚠️ revisar receta exacta
    { id: 34, nombre: "Salsa Criolla",                 descripcion: "Muzzarella con salsa criolla (morrón, cebolla).", imagen: "salsa_criolla",  tipo: "sabor" },
    { id: 35, nombre: "Salsa Mixta",                   descripcion: "Muzzarella con salsa blanca y salsa de tomate.",                          imagen: "salsa_mixta",       tipo: "sabor" }, // ⚠️ revisar receta exacta
    { id: 36, nombre: "Tomate y Albahaca",             descripcion: "Muzzarella con Toamte y albahaca.",                imagen: "tomate_albahaca",   tipo: "sabor" },
    { id: 37, nombre: "Tropical",                      descripcion: "Muzzarella, jamón, huevo rallado, morron y aceitunas.",     imagen: "tropical",          tipo: "sabor" }, // ⚠️ revisar receta exacta (¿se superpone con Jamón y Ananá?)
];

export { allSabores };
