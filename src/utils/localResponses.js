/*
|--------------------------------------------------------------------------
| NORMALIZAR TEXTO
|--------------------------------------------------------------------------
*/

const normalizeText = (text) => {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[¿?¡!.,;:()[\]{}]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
};

/*
|--------------------------------------------------------------------------
| RESPUESTAS LOCALES
|--------------------------------------------------------------------------
|
| Cada tema puede tener hasta 4 respuestas.
| Se selecciona una de ellas de forma aleatoria.
|
*/

const LOCAL_RESPONSES = [

    /*
    |--------------------------------------------------------------------------
    | IDENTIDAD
    |--------------------------------------------------------------------------
    */

    {
        category: "identidad",
        keywords: [
            "quien es jorge",
            "quien es jorge patricio",
            "quien es santamaria",
            "quien es santamaria cherrez",
            "presentame a jorge",
            "hablame de jorge",
            "sobre jorge",
        ],
        responses: [
            "Jorge Patricio Santamaría Cherrez es Ingeniero en Sistemas y Máster en Ingeniería de Software.",
            "Jorge Patricio Santamaría Cherrez es un profesional de Ingeniería de Software, con formación en Ingeniería en Sistemas y un Máster en esta área.",
            "Jorge es Ingeniero en Sistemas por la Universidad Indoamérica y Máster en Ingeniería de Software y Sistemas Informáticos por la UNIR.",
            "Jorge Patricio Santamaría Cherrez cuenta con formación en Ingeniería en Sistemas y un Máster en Ingeniería de Software y Sistemas Informáticos."
        ]
    },

    /*
    |--------------------------------------------------------------------------
    | FORMACIÓN
    |--------------------------------------------------------------------------
    */

    {
        category: "formacion",
        keywords: [
            "donde estudio",
            "en que universidad",
        ],
        responses: [
            "Jorge estudió Ingeniería en Sistemas en la Universidad Indoamérica, Ecuador. Posteriormente realizó un Máster en Ingeniería de Software y Sistemas Informáticos en la UNIR, España.",
            "Su formación universitaria comenzó con Ingeniería en Sistemas en la Universidad Indoamérica y continuó con un Máster en Ingeniería de Software y Sistemas Informáticos en la UNIR.",
            "Jorge cursó Ingeniería en Sistemas en Ecuador y posteriormente realizó un Máster en Ingeniería de Software y Sistemas Informáticos en España.",
            "A nivel universitario, Jorge estudió Ingeniería en Sistemas en la Universidad Indoamérica y después obtuvo un Máster en Ingeniería de Software y Sistemas Informáticos en la UNIR."
        ]
    },

    {
        category: "formacion",
        keywords: [
            "que estudio",
            "que carrera estudio",
            "ingenieria",
        ],
        responses: [
            "Jorge estudió Ingeniería en Sistemas en la Universidad Indoamérica, Ecuador.",
            "La carrera universitaria de Jorge es Ingeniería en Sistemas.",
            "Jorge es Ingeniero en Sistemas, titulado por la Universidad Indoamérica.",
            "Su formación de grado corresponde a Ingeniería en Sistemas en la Universidad Indoamérica, Ecuador."
        ]
    },

    {
        category: "formacion",
        keywords: [
            "master",
            "maestria",
            "posgrado",
            "que master tiene",
        ],
        responses: [
            "Jorge realizó un Máster en Ingeniería de Software y Sistemas Informáticos en la Universidad Internacional de La Rioja (UNIR), España.",
            "Jorge tiene un Máster en Ingeniería de Software y Sistemas Informáticos realizado en la UNIR.",
            "A nivel de posgrado, Jorge cuenta con un Máster en Ingeniería de Software y Sistemas Informáticos por la UNIR, España.",
            "Jorge continuó su formación con un Máster en Ingeniería de Software y Sistemas Informáticos en la Universidad Internacional de La Rioja."
        ]
    },

    {
        category: "formacion",
        keywords: [
            "formacion",
            "formacion academica",
            "educacion",
            "trayectoria academica",
        ],
        responses: [
            "La formación académica de Jorge incluye Ingeniería en Sistemas por la Universidad Indoamérica y un Máster en Ingeniería de Software y Sistemas Informáticos por la UNIR, España.",
            "Jorge tiene formación de grado en Ingeniería en Sistemas y formación de posgrado en Ingeniería de Software y Sistemas Informáticos.",
            "Su trayectoria académica comprende una Ingeniería en Sistemas en Ecuador y un Máster en Ingeniería de Software y Sistemas Informáticos en España.",
            "En cuanto a formación académica, Jorge cuenta con una Ingeniería en Sistemas y posteriormente realizó un Máster especializado en Ingeniería de Software y Sistemas Informáticos."
        ]
    },

    /*
    |--------------------------------------------------------------------------
    | NOTAS
    |--------------------------------------------------------------------------
    */

    {
        category: "notas",
        keywords: [
            "promedio ingenieria",
            "nota ingenieria",
            "promedio universidad",
        ],
        responses: [
            "Jorge obtuvo un promedio de 9 en Ingeniería en Sistemas.",
            "En Ingeniería en Sistemas, Jorge obtuvo un promedio final de 9.",
            "La nota promedio de Jorge en Ingeniería en Sistemas fue de 9.",
            "Jorge terminó su Ingeniería en Sistemas con un promedio de 9."
        ]
    },

    {
        category: "notas",
        keywords: [
            "promedio master",
            "nota master",
            "promedio posgrado",
        ],
        responses: [
            "Jorge obtuvo un promedio de 8.68 en el Máster en Ingeniería de Software y Sistemas Informáticos.",
            "En su Máster, Jorge obtuvo un promedio de 8.68.",
            "La media final de Jorge en el Máster en Ingeniería de Software y Sistemas Informáticos fue de 8.68.",
            "Jorge completó su Máster con un promedio de 8.68."
        ]
    },

    {
        category: "notas",
        keywords: [
            "promedio",
            "notas",
            "nota",
            "calificacion",
            "calificaciones",
        ],
        responses: [
            "Jorge obtuvo un promedio de 9 en Ingeniería en Sistemas y un promedio de 8.68 en el Máster en Ingeniería de Software y Sistemas Informáticos.",
            "En su formación universitaria, Jorge obtuvo un 9 de promedio en Ingeniería en Sistemas y 8.68 en el Máster.",
            "Sus promedios registrados son 9 en Ingeniería en Sistemas y 8.68 en el Máster en Ingeniería de Software y Sistemas Informáticos.",
            "Jorge obtuvo excelentes resultados académicos: 9 en su Ingeniería en Sistemas y 8.68 en su Máster."
        ]
    },

    /*
    |--------------------------------------------------------------------------
    | TECNOLOGÍAS
    |--------------------------------------------------------------------------
    */

    {
        category: "tecnologias",
        keywords: [
            "frontend",
            "front end",
            "react",
            "javascript",
        ],
        responses: [
            "En frontend, Jorge trabaja principalmente con React y JavaScript.",
            "Para desarrollo frontend, Jorge utiliza principalmente React y JavaScript.",
            "Jorge tiene experiencia en frontend utilizando React y JavaScript.",
            "En la parte visual de sus proyectos, Jorge trabaja con React y JavaScript."
        ]
    },

    {
        category: "tecnologias",
        keywords: [
            "backend",
            "back end",
            "django",
            "java",
        ],
        responses: [
            "En backend, Jorge trabaja principalmente con Django y Java.",
            "Para el desarrollo backend, Jorge utiliza Django y Java.",
            "Jorge cuenta con experiencia en backend utilizando Django y Java.",
            "En el lado del servidor, Jorge trabaja principalmente con Django y Java."
        ]
    },

    {
        category: "tecnologias",
        keywords: [
            "base de datos",
            "bases de datos",
            "postgresql",
            "mysql",
        ],
        responses: [
            "Jorge trabaja con PostgreSQL y MySQL.",
            "En bases de datos, Jorge utiliza principalmente PostgreSQL y MySQL.",
            "Jorge tiene experiencia trabajando con PostgreSQL y MySQL.",
            "Entre las tecnologías de bases de datos que utiliza Jorge están PostgreSQL y MySQL."
        ]
    },

    {
        category: "tecnologias",
        keywords: [
            "deploy",
            "deployment",
            "despliegue",
            "hosting",
        ],
        responses: [
            "Para despliegue, Jorge trabaja con servicios como Render, Vercel y AWS.",
            "Jorge utiliza Render, Vercel y AWS para desplegar sus aplicaciones.",
            "En cuanto a deployment, Jorge trabaja con plataformas como Render, Vercel y AWS.",
            "Para publicar sus proyectos, Jorge utiliza servicios como Render, Vercel y AWS."
        ]
    },

    {
        category: "tecnologias",
        keywords: [
            "tecnologias",
            "tecnologia",
            "stack",
            "herramientas",
            "lenguajes",
        ],
        responses: [
            "Jorge trabaja principalmente con React, JavaScript, Django, Java, PostgreSQL y MySQL. También utiliza Render, Vercel y AWS.",
            "Su stack incluye React y JavaScript en frontend, Django y Java en backend, además de PostgreSQL y MySQL.",
            "Entre las principales tecnologías de Jorge están React, JavaScript, Django, Java, PostgreSQL y MySQL, junto con Render, Vercel y AWS.",
            "Jorge cuenta con experiencia en frontend, backend, bases de datos y deployment utilizando React, JavaScript, Django, Java, PostgreSQL, MySQL, Render, Vercel y AWS."
        ]
    },

    /*
    |--------------------------------------------------------------------------
    | PROYECTOS
    |--------------------------------------------------------------------------
    */

    {
        category: "proyectos",
        keywords: [
            "portfolio",
            "portafolio",
            "portfolio react",
        ],
        responses: [
            "Jorge cuenta con un portfolio desarrollado con React para mostrar su formación, tecnologías y proyectos.",
            "Su portfolio está desarrollado con React y reúne información sobre su perfil profesional y sus proyectos.",
            "Jorge tiene un portfolio web creado con React donde presenta su experiencia, formación y proyectos.",
            "El portfolio de Jorge es una aplicación desarrollada con React para presentar su perfil profesional."
        ]
    },

    {
        category: "proyectos",
        keywords: [
            "quiz",
            "quiz ecuador",
            "quiz sobre ecuador",
        ],
        responses: [
            "Uno de los proyectos de Jorge es un Quiz sobre Ecuador.",
            "Jorge desarrolló un proyecto de preguntas y respuestas relacionado con Ecuador.",
            "Entre sus proyectos se encuentra un Quiz dedicado a temas relacionados con Ecuador.",
            "Jorge cuenta con una aplicación tipo Quiz enfocada en Ecuador."
        ]
    },

    {
        category: "proyectos",
        keywords: [
            "clima",
            "app clima",
            "aplicacion clima",
        ],
        responses: [
            "Jorge desarrolló una aplicación del clima que permite consultar información meteorológica.",
            "Entre sus proyectos está una aplicación para consultar información del clima.",
            "Jorge cuenta con una app meteorológica desarrollada como parte de sus proyectos.",
            "Uno de sus proyectos es una aplicación del clima que muestra información meteorológica."
        ]
    },

    {
        category: "proyectos",
        keywords: [
            "chatbot",
            "chat bot",
            "sasha",
        ],
        responses: [
            "Jorge desarrolló un chatbot y Sasha funciona como asistente virtual de su portfolio.",
            "Entre sus proyectos se encuentra este chatbot, donde Sasha actúa como asistente virtual.",
            "Jorge cuenta con un proyecto de chatbot integrado en su portfolio.",
            "Sasha forma parte del proyecto de chatbot desarrollado para el portfolio de Jorge."
        ]
    },

    {
        category: "proyectos",
        keywords: [
            "ajedrez",
            "chess",
        ],
        responses: [
            "Jorge cuenta con un proyecto relacionado con el juego de ajedrez.",
            "Entre sus proyectos se encuentra una aplicación relacionada con ajedrez.",
            "Jorge desarrolló también un proyecto basado en el juego de ajedrez.",
            "Otro de sus proyectos está relacionado con ajedrez."
        ]
    },

    {
        category: "proyectos",
        keywords: [
            "ecommerce",
            "e-commerce",
            "tienda",
            "tienda online",
            "comercio electronico",
        ],
        responses: [
            "Jorge desarrolló un e-commerce utilizando React en frontend y Django en backend.",
            "Entre sus proyectos está una tienda online desarrollada con React y Django.",
            "Jorge cuenta con un proyecto de comercio electrónico utilizando React y Django.",
            "Su proyecto e-commerce combina React para el frontend y Django para el backend."
        ]
    },

    {
        category: "proyectos",
        keywords: [
            "proyectos",
            "proyecto",
            "que proyectos tiene",
            "que ha desarrollado",
            "aplicaciones",
        ],
        responses: [
            "Entre los proyectos de Jorge se encuentran su Portfolio React, un Quiz sobre Ecuador, una aplicación del clima, un chatbot, un proyecto de ajedrez y un e-commerce con React y Django.",
            "Jorge ha desarrollado proyectos como un portfolio, un Quiz sobre Ecuador, una aplicación del clima, un chatbot, un proyecto de ajedrez y un e-commerce.",
            "Su portafolio de proyectos incluye aplicaciones web, un chatbot, una app del clima, un Quiz sobre Ecuador, ajedrez y un e-commerce.",
            "Entre sus principales proyectos destacan su portfolio React, Quiz sobre Ecuador, aplicación meteorológica, chatbot, ajedrez y e-commerce."
        ]
    },

    /*
    |--------------------------------------------------------------------------
    | CERTIFICACIONES
    |--------------------------------------------------------------------------
    */

    {
        category: "certificaciones",
        keywords: [
            "mcp",
            "certificacion mcp",
        ],
        responses: [
            "Jorge cuenta con una certificación relacionada con MCP de Anthropic, obtenida en 2026.",
            "En 2026, Jorge obtuvo una certificación relacionada con MCP de Anthropic.",
            "Jorge tiene una certificación de MCP asociada a Anthropic.",
            "Entre sus certificaciones se encuentra una relacionada con MCP de Anthropic, obtenida en 2026."
        ]
    },

    {
        category: "certificaciones",
        keywords: [
            "linux",
            "certificacion linux",
        ],
        responses: [
            "Jorge cuenta con una certificación de Linux realizada en Udemy en 2024.",
            "En 2024, Jorge realizó una certificación de Linux en Udemy.",
            "Jorge tiene formación certificada en Linux mediante Udemy.",
            "Entre sus certificaciones se encuentra una relacionada con Linux, realizada en Udemy en 2024."
        ]
    },

    {
        category: "certificaciones",
        keywords: [
            "fundamentals of ai",
            "fundamentos de ia",
            "ibm",
        ],
        responses: [
            "Jorge cuenta con la certificación Fundamentals of AI de IBM, obtenida en 2025.",
            "En 2025, Jorge obtuvo Fundamentals of AI de IBM.",
            "Jorge tiene una certificación de Fundamentals of AI otorgada por IBM.",
            "Entre sus certificaciones está Fundamentals of AI de IBM, correspondiente a 2025."
        ]
    },

    {
        category: "certificaciones",
        keywords: [
            "az 900",
            "az-900",
            "azure",
        ],
        responses: [
            "Jorge cuenta con la certificación AZ-900 de UNIR, obtenida en 2023.",
            "En 2023, Jorge obtuvo la certificación AZ-900 de UNIR.",
            "Jorge tiene la certificación AZ-900 relacionada con Azure.",
            "Entre sus certificaciones se encuentra AZ-900, obtenida mediante UNIR en 2023."
        ]
    },

    {
        category: "certificaciones",
        keywords: [
            "claude api",
            "certificacion claude",
        ],
        responses: [
            "Jorge cuenta con una certificación relacionada con Claude API de Anthropic, obtenida en 2026.",
            "En 2026, Jorge obtuvo una certificación relacionada con Claude API de Anthropic.",
            "Jorge tiene una certificación relacionada con Claude API.",
            "Entre sus certificaciones está una relacionada con Claude API de Anthropic, correspondiente a 2026."
        ]
    },

    {
        category: "certificaciones",
        keywords: [
            "certificaciones",
            "certificados",
            "certificacion",
            "que certificaciones tiene",
        ],
        responses: [
            "Jorge cuenta con certificaciones relacionadas con MCP, Linux, Fundamentals of AI, AZ-900 y Claude API.",
            "Entre las certificaciones de Jorge se encuentran MCP, Linux, Fundamentals of AI, AZ-900 y Claude API.",
            "Jorge tiene certificaciones en áreas como MCP, Linux, inteligencia artificial, Azure y Claude API.",
            "Su formación complementaria incluye certificaciones de MCP, Linux, Fundamentals of AI, AZ-900 y Claude API."
        ]
    },

    /*
    |--------------------------------------------------------------------------
    | INTERESES
    |--------------------------------------------------------------------------
    */

    {
        category: "intereses",
        keywords: [
            "lectura",
            "leer",
            "libros",
            "libro",
            "dan brown",
        ],
        responses: [
            "A Jorge le gusta la lectura, especialmente las obras del escritor Dan Brown.",
            "Uno de los intereses de Jorge es la lectura, y disfruta especialmente de los libros de Dan Brown.",
            "Jorge tiene interés por la lectura y entre sus autores favoritos destaca Dan Brown.",
            "En cuanto a lectura, Jorge muestra especial interés por las obras de Dan Brown."
        ]
    },

    {
        category: "intereses",
        keywords: [
            "musica",
            "que musica le gusta",
        ],
        responses: [
            "La música es uno de los intereses de Jorge.",
            "Jorge también tiene interés por la música.",
            "Entre las aficiones de Jorge se encuentra la música.",
            "La música forma parte de los intereses personales registrados de Jorge."
        ]
    },

    {
        category: "intereses",
        keywords: [
            "intereses",
            "hobbies",
            "pasatiempos",
            "aficiones",
            "que le gusta",
        ],
        responses: [
            "Entre los intereses de Jorge están la lectura, especialmente las obras de Dan Brown, y la música.",
            "Jorge disfruta de la lectura, particularmente de los libros de Dan Brown, y también tiene interés por la música.",
            "Sus principales intereses registrados son la lectura y la música, destacando especialmente su gusto por Dan Brown.",
            "Entre sus intereses se encuentran la literatura, especialmente Dan Brown, y la música."
        ]
    },

    /*
    |--------------------------------------------------------------------------
    | CONTACTO
    |--------------------------------------------------------------------------
    */

    {
        category: "contacto",
        keywords: [
            "contacto",
            "contactar",
            "contactarme",
            "comunicarme",
            "hablar con jorge",
            "contactar a jorge",
            "como contacto",
            "como contactar",
        ],
        responses: [
            'Puedes contactar a Jorge desde la sección "Contacto" de su portfolio.',
            'Para comunicarte con Jorge, utiliza la sección "Contacto" de su portfolio.',
            'Si quieres contactar a Jorge, encontrarás la opción correspondiente en la sección "Contacto".',
            'La forma indicada para contactar a Jorge es mediante la sección "Contacto" de su portfolio.'
        ]
    },

    /*
    |--------------------------------------------------------------------------
    | SASHA
    |--------------------------------------------------------------------------
    */

    {
        category: "sasha",
        keywords: [
            "quien eres",
            "que eres",
            "como te llamas",
            "tu nombre",
        ],
        responses: [
            "Soy Sasha, la asistente virtual del portfolio de Jorge.",
            "Me llamo Sasha y soy la asistente virtual del portfolio de Jorge.",
            "Soy Sasha, una IA creada para asistir a los visitantes del portfolio de Jorge.",
            "Mi nombre es Sasha y funciono como asistente virtual del portfolio de Jorge."
        ]
    },
];

/*
|--------------------------------------------------------------------------
| COMPROBAR SI HABLA DE JORGE
|--------------------------------------------------------------------------
*/

const isAboutJorge = (message) => {
    const normalized = normalizeText(message);


    const jorgeKeywords = [
    "jorge",
    "patricio",
    "santamaria",
    "santamaria cherrez",

    // Combinaciones del nombre
    "jorge patricio",
    "jorge santamaria",
    "jorge cherrez",
    "patricio santamaria",
    "patricio cherrez",
    "jorge patricio santamaria",
    "jorge patricio cherrez",
    "jorge santamaria cherrez",
    "patricio santamaria cherrez",
    "jorge patricio santamaria cherrez",
];

    return jorgeKeywords.some((keyword) =>
        normalized.includes(normalizeText(keyword))
    );
};

/*
|--------------------------------------------------------------------------
| BUSCAR RESPUESTA LOCAL
|--------------------------------------------------------------------------
*/

export const getLocalResponse = (message) => {
    const normalizedMessage = normalizeText(message);
    const aboutJorge = isAboutJorge(message);

    const jorgeCategories = [
        "identidad",
        "formacion",
        "notas",
        "tecnologias",
        "proyectos",
        "certificaciones",
        "intereses",
    ];

    let bestMatch = null;
    let bestScore = 0;

    for (const item of LOCAL_RESPONSES) {

        /*
        |--------------------------------------------------------------------------
        | SOLO INFORMACIÓN DE JORGE
        |--------------------------------------------------------------------------
        */

        if (
            jorgeCategories.includes(item.category) &&
            !aboutJorge
        ) {
            continue;
        }

        let score = 0;

        /*
        |--------------------------------------------------------------------------
        | CALCULAR COINCIDENCIA
        |--------------------------------------------------------------------------
        */

        for (const keyword of item.keywords) {
            const normalizedKeyword = normalizeText(keyword);

            /*
            |--------------------------------------------------------------------------
            | FRASE COMPLETA
            |--------------------------------------------------------------------------
            */

            if (normalizedMessage.includes(normalizedKeyword)) {
                score += normalizedKeyword.split(" ").length * 3;
                continue;
            }

            /*
            |--------------------------------------------------------------------------
            | PALABRAS INDIVIDUALES
            |--------------------------------------------------------------------------
            */

            const keywordWords = normalizedKeyword
                .split(" ")
                .filter((word) => word.length > 2);

            for (const word of keywordWords) {
                if (normalizedMessage.includes(word)) {
                    score += 1;
                }
            }
        }

        /*
        |--------------------------------------------------------------------------
        | GUARDAR MEJOR COINCIDENCIA
        |--------------------------------------------------------------------------
        */

        if (score > bestScore) {
            bestScore = score;
            bestMatch = item;
        }
    }

    /*
    |--------------------------------------------------------------------------
    | RESPUESTA LOCAL
    |--------------------------------------------------------------------------
    */

    if (bestScore >= 3 && bestMatch) {

        const responses = bestMatch.responses;

        const randomIndex = Math.floor(
            Math.random() * responses.length
        );

        return responses[randomIndex];
    }

    /*
    |--------------------------------------------------------------------------
    | NO HAY RESPUESTA LOCAL
    |--------------------------------------------------------------------------
    */

    return null;
};
