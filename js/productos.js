// Datos de los productos (fuente: lista de precios Octubre 2026, sin precios).
// Para sumar un producto, copiá un bloque y cambiá los datos.
const productos = [
    {
        "id": "mesa-stella",
        "combina": ["silla-allure", "silla-elise", "silla-gisele"],
        "categoria": "mesas",
        "etiqueta": "Mesas",
        "nombre": "Mesa Stella",
        "descripcion": "El diseño de formas orgánicas combina belleza con funcionalidad, distinción para realzar el comedor.",
        "specs": [
            [
                "Terminación de la mesa",
                "Laca blanca - Vidrio blanco Fendi"
            ],
            [
                "Medidas (m)",
                "1,35 x 1,15 (5 personas)"
            ],
            [
                "Terminación de la base",
                "Laca tono almendra"
            ],
            [
                "Estructura de la base",
                "Multilaminado enchapado Roble"
            ]
        ]
    },
    {
        "id": "mesa-stella-para-marmol",
        "categoria": "mesas",
        "etiqueta": "Mesas",
        "nombre": "Mesa Stella para mármol",
        "descripcion": "El mármol veteado y la madera curva se unen en una pieza sublime que refleja distinción y armonía en cada detalle.",
        "specs": [
            [
                "Terminación de la mesa",
                "Permite colocar diferentes piedras (no incluidas)"
            ],
            [
                "Medidas (m)",
                "1,65 x 1,40 (6 personas)"
            ],
            [
                "Terminación de la base",
                "Laca tono almendra"
            ],
            [
                "Estructura de la base",
                "Multilaminado enchapado Roble"
            ],
            [
                "Base",
                "Estructura de multilaminado - Contraenchapado en Roble"
            ],
            [
                "Contratapa",
                "Fibropanel de densidad media"
            ]
        ]
    },
    {
        "id": "mesa-stella-drink",
        "combina": ["poltrona-gisele"],
        "categoria": "mesas",
        "etiqueta": "Mesas",
        "nombre": "Mesa Stella Drink",
        "descripcion": "Diseño orgánico: la elegancia y el confort del lujo silencioso.",
        "specs": [
            [
                "Terminación de la mesa",
                "Laca tono Perla"
            ],
            [
                "Medidas (m)",
                "1,35 x 1,15, altura 0,69 (4 personas)"
            ],
            [
                "Terminación de la base",
                "Laca tono Perla"
            ],
            [
                "Estructura de la base",
                "Multilaminado enchapado Roble"
            ]
        ]
    },
    {
        "id": "mesa-giulia",
        "combina": ["silla-elise", "silla-sophia", "silla-gisele"],
        "zoomMiniatura": 2,
        "categoria": "mesas",
        "etiqueta": "Mesas",
        "nombre": "Mesa Giulia",
        "descripcion": "La geometría de las patas la convierte en una mesa de estilo contemporáneo, original y con estilo.",
        "specs": [
            [
                "Terminación de la mesa",
                "Laca blanca - Vidrio blanco Fendi"
            ],
            [
                "Medidas (m)",
                "1,80 x 1,10 (6 personas)"
            ],
            [
                "Terminación de las patas",
                "Laca tono almendra"
            ],
            [
                "Estructura de la mesa",
                "Madera de Roble"
            ]
        ]
    },
    {
        "id": "mesa-ornella",
        "combina": ["silla-sophia", "silla-jolie", "silla-gisele", "silla-margot"],
        "categoria": "mesas",
        "etiqueta": "Mesas",
        "nombre": "Mesa Ornella",
        "descripcion": "Una verdadera obra de arte que invita a la convivencia, aporta elegancia y sofisticación.",
        "specs": [
            [
                "Terminación de la mesa",
                "Laca blanca - Vidrio blanco Fendi"
            ],
            [
                "Medidas (m)",
                "2,00 x 1,10 (8 personas) y 2,50 x 1,20 (8 personas)"
            ],
            [
                "Terminación de las patas",
                "Laca tono almendra"
            ],
            [
                "Estructura de la mesa",
                "Multilaminado enchapado Roble"
            ]
        ]
    },
    {
        "id": "mesa-ornella-polimero",
        "combina": ["silla-sophia", "silla-gisele", "silla-jolie"],
        "categoria": "mesas",
        "etiqueta": "Mesas",
        "nombre": "Mesa Ornella PP",
        "subtitulo": "imitación mármol",
        "descripcion": "Una verdadera obra de arte que invita a la convivencia, aporta elegancia y sofisticación.",
        "specs": [
            [
                "Terminación de la mesa",
                "Placa de PP Nero Black o Rochedo"
            ],
            [
                "Medidas (m)",
                "2,00 x 1,10 (8 personas) y 2,50 x 1,20 (8 personas)"
            ],
            [
                "Terminación de las patas",
                "Laca tono almendra"
            ],
            [
                "Estructura de la mesa",
                "Multilaminado enchapado Roble"
            ]
        ]
    },
    {
        "id": "mesa-folha",
        "combina": ["silla-sophia", "silla-gisele", "silla-margot"],
        "categoria": "mesas",
        "etiqueta": "Mesas",
        "nombre": "Mesa Folha",
        "descripcion": "Arte y naturaleza: su acabado a poro abierto en forma de hoja, preserva la textura viva de la madera, elegancia y refinamiento.",
        "specs": [
            [
                "Terminación de la mesa",
                "Laca antimancha - Tono almendra"
            ],
            [
                "Medidas (m)",
                "2,00 x 1,20"
            ],
            [
                "Terminación de la base",
                "Laca tono almendra"
            ],
            [
                "Estructura de la base",
                "Multilaminado enchapado Roble"
            ]
        ]
    },
    {
        "id": "mesa-agora",
        "combina": ["silla-sophia", "silla-elise", "silla-jolie", "silla-aike", "silla-margot", "silla-gisele"],
        "categoria": "mesas",
        "etiqueta": "Mesas",
        "nombre": "Mesa Ágora",
        "descripcion": "Nuevo estándar del lujo contemporáneo: presencia escultural para espacios que hablan de éxito y serenidad.",
        "colores": [
            { "nombre": "Almendra", "archivo": "mesa-agora-almendra", "fondo": "#D8C6AA" },
            { "nombre": "Ébano", "archivo": "mesa-agora-ebano", "fondo": "#2E2622" }
        ],
        "specs": [
            [
                "Terminación de la mesa",
                "Laca antimancha - Tono almendra o ébano"
            ],
            [
                "Medidas (m)",
                "1,60 x 1,60 (6 personas)"
            ],
            [
                "Terminación de la base",
                "Laca tono almendra o ébano"
            ],
            [
                "Estructura de la base",
                "Multilaminado enchapado Roble"
            ]
        ]
    },
    {
        "id": "mesa-adriana-slim",
        "combina": ["silla-sophia", "silla-aike"],
        "oculto": true,
        "categoria": "mesas",
        "etiqueta": "Mesas",
        "nombre": "Mesa Adriana Slim",
        "descripcion": "Materiales y formas se fusionan en perfecta armonía, se adapta con versatilidad a diferentes espacios y gustos.",
        "specs": [
            [
                "Terminación de la mesa",
                "Laca antimancha - Tono almendra"
            ],
            [
                "Medidas (m)",
                "2,20 x 1,10 (8 personas) y 2,50 x 1,20 (8 personas)"
            ],
            [
                "Terminación de la base",
                "Laca tono almendra"
            ],
            [
                "Estructura de la base",
                "Multilaminado enchapado Roble"
            ]
        ]
    },
    {
        "id": "mesa-allegra",
        "combina": ["silla-gisele", "silla-jolie", "silla-sophia"],
        "categoria": "mesas",
        "etiqueta": "Mesas",
        "nombre": "Mesa Allegra",
        "descripcion": "El mayor exponente del diseño orgánico minimalista, por su geometría de notable belleza, aporta ligereza y refinamiento.",
        "colores": [
            { "nombre": "Almendra", "archivo": "mesa-allegra-almendra", "fondo": "#D8C6AA" },
            { "nombre": "Ébano", "archivo": "mesa-allegra-ebano", "fondo": "#2E2622" }
        ],
        "specs": [
            [
                "Terminación de la mesa",
                "Laca antimancha - Tono almendra o ébano"
            ],
            [
                "Medidas (m)",
                "2,50 x 1,30 (8 personas)"
            ],
            [
                "Terminación de la base",
                "Laca tono almendra o ébano"
            ],
            [
                "Estructura de la base",
                "Multilaminado enchapado Roble"
            ]
        ]
    },
    {
        "id": "mesa-allegra-para-marmol",
        "categoria": "mesas",
        "etiqueta": "Mesas",
        "nombre": "Mesa Allegra para mármol",
        "descripcion": "Una declaración de lujo silencioso donde la exclusividad reside en la armonía de sus formas y materiales, mármol y madera.",
        "specs": [
            [
                "Terminación de la mesa",
                "Permite colocar diferentes piedras (no incluidas)"
            ],
            [
                "Medidas (m)",
                "2,50 x 1,30 (8 personas)"
            ],
            [
                "Terminación de la base",
                "Laca tono almendra"
            ],
            [
                "Estructura de la base",
                "Multilaminado enchapado Roble"
            ],
            [
                "Base",
                "Estructura de multilaminado - Contraenchapado en Roble"
            ],
            [
                "Contratapa",
                "Fibropanel de densidad media"
            ]
        ]
    },
    {
        "id": "mesa-adriana",
        "combina": ["silla-aike", "silla-sophia", "silla-jolie", "silla-elise"],
        "zoomMiniatura": 2,
        "categoria": "mesas",
        "etiqueta": "Mesas",
        "nombre": "Mesa Adriana",
        "descripcion": "Es la expresión estilística que combina la elegancia de la tradición, con la evolución formal del diseño moderno.",
        "specs": [
            [
                "Terminación de la mesa",
                "Laca antimancha - Tono almendra"
            ],
            [
                "Medidas (m)",
                "3,00 x 1,30 (10-12 personas) y 3,60 x 1,35 (12-14 personas)"
            ],
            [
                "Terminación de las bases",
                "Laca tono almendra o ébano"
            ],
            [
                "Estructura de la base",
                "Multilaminado enchapado Roble"
            ]
        ]
    },
    {
        "id": "mesa-adriana-vidrio-titanium",
        "combina": ["silla-jolie"],
        "oculto": true,
        "categoria": "mesas",
        "etiqueta": "Mesas",
        "nombre": "Mesa Adriana vidrio titanium",
        "descripcion": "Una verdadera obra de arte, su gran tamaño invita a la convivencia, aporta elegancia y sofisticación.",
        "specs": [
            [
                "Terminación de la mesa",
                "Extremos con laca - Vidrio central: Titanium"
            ],
            [
                "Medidas (m)",
                "3,60 x 1,35 (12-14 personas)"
            ],
            [
                "Terminación de las bases",
                "Gris Titanium - Almendra - Ébano"
            ],
            [
                "Estructura de la mesa",
                "Multilaminado enchapado Roble"
            ]
        ]
    },
    {
        "id": "silla-allure",
        "categoria": "sillas",
        "etiqueta": "Sillas",
        "nombre": "Silla Allure",
        "descripcion": "Con un lenguaje contemporáneo y minimalista, pero a la vez elegante y sensual.",
        "colores": [
            { "nombre": "Beige 1029", "archivo": "silla-allure", "muestra": "img/telas/tela-beige-1029.jpg" }
        ],
        "specs": [
            [
                "Tejido - Material",
                "Beige 1029 - Poliéster"
            ],
            [
                "Medidas (cm)",
                "53 x 58 x 90"
            ],
            [
                "Acabado de la madera",
                "Laca tono almendra"
            ],
            [
                "Estructura de la silla",
                "Madera de Roble"
            ]
        ]
    },
    {
        "id": "silla-elise",
        "categoria": "sillas",
        "etiqueta": "Sillas",
        "nombre": "Silla Elise",
        "descripcion": "Combina comodidad, solidez y elegancia atemporal. Notable comodidad por su respaldo ergonómico en arco.",
        "colores": [
            { "nombre": "Beige 1029", "archivo": "silla-elise", "muestra": "img/telas/tela-beige-1029.jpg" }
        ],
        "specs": [
            [
                "Tejido - Material",
                "Light Beige - Poliéster"
            ],
            [
                "Medidas (cm)",
                "54 x 61 x 85"
            ],
            [
                "Acabado de la madera",
                "Laca tono almendra"
            ],
            [
                "Estructura de la silla",
                "Madera de Roble"
            ]
        ]
    },
    {
        "id": "silla-sophia",
        "categoria": "sillas",
        "etiqueta": "Sillas",
        "nombre": "Silla Sophia",
        "descripcion": "Sus líneas circulares, armoniosas y envolventes, consiguen un lenguaje contemporáneo, un diseño sofisticado y elegante.",
        "colores": [
            { "nombre": "Beige 1029", "archivo": "silla-sophia-beige", "muestra": "img/telas/tela-beige-1029.jpg" },
            { "nombre": "Klee Gray 1032", "fotos": ["silla-sophia-gris", "silla-sophia-gris-2", "silla-sophia-gris-4"], "muestra": "img/telas/tela-gris-1032.jpg" }
        ],
        "specs": [
            [
                "Tejido - Material",
                "Beige 1029 - Klee Gray 1032"
            ],
            [
                "Medidas (cm)",
                "55 x 52 x 76"
            ],
            [
                "Acabado de la madera",
                "Laca tono almendra"
            ],
            [
                "Estructura de la silla",
                "Madera de Roble"
            ]
        ]
    },
    {
        "id": "silla-jolie",
        "categoria": "sillas",
        "etiqueta": "Sillas",
        "nombre": "Silla Jolie",
        "descripcion": "Creada para ser la protagonista del salón: asiento y respaldo acolchados, combina comodidad y elegancia.",
        "colores": [
            { "nombre": "Almendra · Beige 1029", "archivo": "silla-jolie", "muestra": "img/telas/tela-beige-1029.jpg" },
            { "nombre": "Almendra · Klee Gray 1032", "fotos": ["silla-jolie-gris", "silla-jolie-gris-3", "silla-jolie-gris-2"], "muestra": "img/telas/tela-gris-1032.jpg" },
            { "nombre": "Ébano · Beige 1029", "fotos": ["silla-jolie-ebano", "silla-jolie-ebano-3", "silla-jolie-ebano-2"], "muestra": "img/telas/tela-beige-1029.jpg" }
        ],
        "specs": [
            [
                "Tejido - Material",
                "Beige 1029 - Klee Gray 1032"
            ],
            [
                "Medidas (cm)",
                "61 x 59 x 78"
            ],
            [
                "Acabado de la madera",
                "Laca tono almendra o ébano"
            ],
            [
                "Estructura de la silla",
                "Madera de Roble"
            ]
        ]
    },
    {
        "id": "silla-gisele",
        "categoria": "sillas",
        "etiqueta": "Sillas",
        "nombre": "Silla Gisele",
        "descripcion": "Una silla elegante por sus líneas curvas, esbeltas patas redondeadas y respaldo circular.",
        "colores": [
            { "nombre": "Almendra · Beige 1029", "fotos": ["silla-gisele-beige", "silla-gisele-beige-2", "silla-gisele-beige-3"], "muestra": "img/telas/tela-beige-1029.jpg" },
            { "nombre": "Almendra · Klee Gray 1032", "fotos": ["silla-gisele-gris", "silla-gisele-gris-2", "silla-gisele-gris-3"], "muestra": "img/telas/tela-gris-1032.jpg" },
            { "nombre": "Ébano · Beige 1029", "archivo": "silla-gisele", "muestra": "img/telas/tela-beige-1029.jpg" }
        ],
        "specs": [
            [
                "Tejido - Material",
                "Beige 1029 - Klee Gray 1032"
            ],
            [
                "Medidas (cm)",
                "55 x 59 x 79"
            ],
            [
                "Acabado de la madera",
                "Laca tono almendra"
            ],
            [
                "Estructura de la silla",
                "Madera de Roble"
            ]
        ]
    },
    {
        "id": "silla-aike",
        "categoria": "sillas",
        "etiqueta": "Sillas",
        "nombre": "Silla Aike",
        "descripcion": "Líneas refinadas, formas suaves con bordes redondeados para llevar una expresión de comodidad y belleza.",
        "colores": [
            { "nombre": "Beige 1029", "fotos": ["silla-aike", "silla-aike-beige-2", "silla-aike-beige-3"], "muestra": "img/telas/tela-beige-1029.jpg" },
            { "nombre": "Klee Gray 1032", "fotos": ["silla-aike-2", "silla-aike-gris-2", "silla-aike-gris-3"], "muestra": "img/telas/tela-gris-1032.jpg" }
        ],
        "specs": [
            [
                "Tejido - Material",
                "Beige 1029 - Klee Gray 1032"
            ],
            [
                "Medidas (cm)",
                "62 x 59 x 79"
            ],
            [
                "Acabado de la madera",
                "Laca tono almendra"
            ],
            [
                "Estructura de la silla",
                "Madera de Roble"
            ]
        ]
    },
    {
        "id": "silla-margot",
        "categoria": "sillas",
        "etiqueta": "Sillas",
        "nombre": "Silla Margot",
        "descripcion": "Es una silla extremadamente elegante. El diseño y la calidad reflejan el distinguido diseño italiano. La reedición de un clásico.",
        "colores": [
            { "nombre": "Beige 1029", "archivo": "silla-margot", "muestra": "img/telas/tela-beige-1029.jpg" }
        ],
        "specs": [
            [
                "Tejido - Material",
                "Light Beige 1030 - Poliéster"
            ],
            [
                "Medidas (cm)",
                "53 x 61 x 82"
            ],
            [
                "Acabado de la madera",
                "Laca tono almendra"
            ],
            [
                "Estructura de la silla",
                "Madera de Roble"
            ]
        ]
    },
    {
        "id": "banqueta-jolie",
        "categoria": "banquetas",
        "etiqueta": "Banquetas",
        "nombre": "Banqueta Jolie",
        "descripcion": "Un icono del diseño aplicado al confort. La suavidad y ergonomía garantizan una experiencia inigualable.",
        "colores": [
            { "nombre": "Almendra · Beige 1029", "archivo": "banqueta-jolie-beige", "muestra": "img/telas/tela-beige-1029.jpg" },
            { "nombre": "Almendra · Klee Gray 1032", "archivo": "banqueta-jolie-gris", "muestra": "img/telas/tela-gris-1032.jpg" },
            { "nombre": "Ébano · Beige 1029", "fotos": ["banqueta-jolie-ebano", "banqueta-jolie-ebano-2"], "muestra": "img/telas/tela-beige-1029.jpg" }
        ],
        "specs": [
            [
                "Tejido - Material",
                "Beige 1029 - Klee Gray 1032"
            ],
            [
                "Medidas (cm)",
                "60 x 57 x 94, altura de asiento 60"
            ],
            [
                "Acabado de la madera",
                "Laca tono almendra o ébano"
            ],
            [
                "Estructura de la silla",
                "Madera de Roble"
            ]
        ]
    },
    {
        "id": "banqueta-gisele",
        "categoria": "banquetas",
        "etiqueta": "Banquetas",
        "nombre": "Banqueta Gisele",
        "descripcion": "Diseño refinado y fuerte personalidad. Con sus líneas depuradas, cómodo asiento y respaldo envolvente.",
        "colores": [
            { "nombre": "Almendra · Beige 1029", "fotos": ["banqueta-gisele", "banqueta-gisele-2", "banqueta-gisele-beige-3"], "muestra": "img/telas/tela-beige-1029.jpg" },
            { "nombre": "Almendra · Klee Gray 1032", "fotos": ["banqueta-gisele-gris", "banqueta-gisele-gris-2", "banqueta-gisele-gris-3"], "muestra": "img/telas/tela-gris-1032.jpg" },
            { "nombre": "Ébano · Beige 1029", "fotos": ["banqueta-gisele-ebano","banqueta-gisele-ebano-2","banqueta-gisele-ebano-3"], "muestra": "img/telas/tela-beige-1029.jpg" }
        ],
        "specs": [
            [
                "Tejido - Material",
                "Beige 1029 - Klee Gray 1032"
            ],
            [
                "Medidas (cm)",
                "51 x 52 x 90, altura de asiento 60"
            ],
            [
                "Acabado de la madera",
                "Laca tono almendra o ébano"
            ],
            [
                "Estructura de la silla",
                "Madera de Roble"
            ]
        ]
    },
    {
        "id": "poltrona-gisele",
        "categoria": "poltronas",
        "etiqueta": "Poltronas",
        "nombre": "Poltrona Gisele",
        "descripcion": "Armonía visual y confort supremo: la exclusividad encuentra su forma.",
        "colores": [
            { "nombre": "Beige 1029", "archivo": "poltrona-gisele", "muestra": "img/telas/tela-beige-1029.jpg" }
        ],
        "specs": [
            [
                "Tejido - Material",
                "Beige 1029 - Poliéster"
            ],
            [
                "Medidas (cm)",
                "70 x 68 x 79, altura de asiento 44"
            ],
            [
                "Acabado de la madera",
                "Laca tono almendra"
            ],
            [
                "Estructura de la silla",
                "Madera de Roble"
            ]
        ]
    },
    {
        "id": "poltrona-nest",
        "combina": ["puff-nest"],
        "categoria": "poltronas",
        "etiqueta": "Poltronas",
        "nombre": "Poltrona Nest",
        "descripcion": "Sólida estructura, apoyabrazos de líneas limpias enmarcan un delicado respaldo de esterilla, cojines de cuero de tacto suave.",
        "specs": [
            [
                "Tejido - Material",
                "Cuero natural - Tono 710"
            ],
            [
                "Medidas (cm)",
                "69 x 68 x 81"
            ],
            [
                "Acabado de la madera",
                "Laca tono cacao"
            ],
            [
                "Estructura del sillón",
                "Madera de Roble"
            ]
        ]
    },
    {
        "id": "poltrona-bubble-con-reposapies",
        "categoria": "poltronas",
        "etiqueta": "Poltronas",
        "nombre": "Poltrona Bubble con reposapiés",
        "descripcion": "Con sus delicados pies de roble, asiento mullido y respaldo de diseño envolvente resulta cómodo y acogedor.",
        "specs": [
            [
                "Tejido - Material",
                "Pana - Light Cream - Poliéster"
            ],
            [
                "Medidas (cm)",
                "71 x 71 x 77, altura de asiento 43"
            ],
            [
                "Acabado de las patas",
                "Laca tono almendra"
            ],
            [
                "Estructura de la silla",
                "Madera de Roble"
            ]
        ]
    },
    {
        "id": "poltrona-dolphin-giratoria",
        "categoria": "poltronas",
        "etiqueta": "Poltronas",
        "nombre": "Poltrona Dolphin giratoria",
        "descripcion": "Su confort se caracteriza por el respaldo envolvente y el asiento circular de acolchado suave. Giratoria, con apoyabrazos.",
        "specs": [
            [
                "Tejido - Material",
                "Pana - Light Cream - Poliéster"
            ],
            [
                "Medidas (cm)",
                "68 x 80 x 98, altura de asiento 60"
            ],
            [
                "Acabado de la madera",
                "Laca tono almendra"
            ],
            [
                "Estructura de la silla",
                "Madera de Roble"
            ]
        ]
    },
    {
        "id": "puff-nest",
        "categoria": "complementos",
        "etiqueta": "Complementos",
        "nombre": "Puff Nest",
        "descripcion": "Funciona también como un asiento auxiliar, transforma la poltrona Nest en una experiencia de confort absoluta.",
        "specs": [
            [
                "Tejido - Material",
                "Cuero natural - Tono 710"
            ],
            [
                "Medidas (cm)",
                "51 x 45 x 42"
            ],
            [
                "Acabado de la madera",
                "Laca tono cacao"
            ],
            [
                "Estructura del sillón",
                "Madera de Roble"
            ]
        ]
    },
    {
        "id": "mesa-de-centro-y-puff-harmonie",
        "combina": ["poltrona-dolphin-giratoria", "poltrona-bubble-con-reposapies"],
        "categoria": "complementos",
        "etiqueta": "Complementos",
        "nombre": "Mesa de centro y puff Harmonie",
        "descripcion": "Elegantes elementos funcionales que aportan practicidad y una estética muy distintiva.",
        "specs": [
            [
                "Terminación de la mesa",
                "Laca antimancha - Tono almendra"
            ],
            [
                "Medidas (cm)",
                "Mesa: Ø 65, altura 45 - Puff: 71 x 78, altura 39"
            ],
            [
                "Terminación del puff",
                "Pana - Light Cream - Poliéster"
            ],
            [
                "Estructura de la mesa",
                "Multilaminado enchapado Roble"
            ]
        ]
    },
    {
        "id": "mesitas-laterales-minion",
        "combina": ["poltrona-bubble-con-reposapies", "poltrona-dolphin-giratoria"],
        "categoria": "complementos",
        "etiqueta": "Complementos",
        "nombre": "Mesitas laterales Minion",
        "descripcion": "Juego de mesitas auxiliares para aportar soluciones atractivas.",
        "specs": [
            [
                "Terminación de la mesa",
                "Laca antimancha - Tono almendra"
            ],
            [
                "Medidas (cm)",
                "Diámetro 50 - Altura 45 o 62"
            ],
            [
                "Terminación de la base",
                "Laca tono almendra"
            ],
            [
                "Estructura de la mesa",
                "Multilaminado enchapado Roble"
            ]
        ]
    }
];
