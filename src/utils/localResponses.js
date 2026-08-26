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
*/

const LOCAL_RESPONSES = [

    // IDENTIDAD
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
        response:
            "Jorge Patricio Santamaría Cherrez es Ingeniero en Sistemas y Máster en Ingeniería de Software."
    },

    // FORMACIÓN
    {
        category: "formacion",
        keywords: [
            "donde estudio",
            "en que universidad",
        ],
        response:
            "Jorge estudió Ingeniería en Sistemas en la Universidad Indoamérica, Ecuador. Posteriormente realizó un Máster en Ingeniería de Software y Sistemas Informáticos en la UNIR, España."
    },

    {
        category: "formacion",
        keywords: [
            "que estudio",
            "que carrera estudio",
            "ingenieria",
        ],
        response:
            "Jorge estudió Ingeniería en Sistemas en la Universidad Indoamérica, Ecuador."
    },

    {
        category: "formacion",
        keywords: [
            "master",
            "maestria",
            "posgrado",
            "que master tiene",
        ],
        response:
            "Jorge realizó un Máster en Ingeniería de Software y Sistemas Informáticos en la Universidad Internacional de La Rioja (UNIR), España."
    },

    {
        category: "formacion",
        keywords: [
            "formacion",
            "formacion academica",
            "educacion",
            "trayectoria academica",
        ],
        response:
            "La formación académica de Jorge incluye Ingeniería en Sistemas por la Universidad Indoamérica y un Máster en Ingeniería de Software y Sistemas Informáticos por la UNIR, España."
    },

    // NOTAS
    {
        category: "notas",
        keywords: [
            "promedio ingenieria",
            "nota ingenieria",
            "promedio universidad",
        ],
        response:
            "Jorge obtuvo un promedio de 9 en Ingeniería en Sistemas."
    },

    {
        category: "notas",
        keywords: [
            "promedio master",
            "nota master",
            "promedio posgrado",
        ],
        response:
            "Jorge obtuvo un promedio de 8.68 en el Máster en Ingeniería de Software y Sistemas Informáticos."
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
        response:
            "Jorge obtuvo un promedio de 9 en Ingeniería en Sistemas y un promedio de 8.68 en el Máster en Ingeniería de Software y Sistemas Informáticos."
    },

    // TECNOLOGÍAS
    {
        category: "tecnologias",
        keywords: [
            "frontend",
            "front end",
            "react",
            "javascript",
        ],
        response:
            "En frontend, Jorge trabaja principalmente con React y JavaScript."
    },

    {
        category: "tecnologias",
        keywords: [
            "backend",
            "back end",
            "django",
            "java",
        ],
        response:
            "En backend, Jorge trabaja principalmente con Django y Java."
    },

    {
        category: "tecnologias",
        keywords: [
            "base de datos",
            "bases de datos",
            "postgresql",
            "mysql",
        ],
        response:
            "Jorge trabaja con PostgreSQL y MySQL."
    },

    {
        category: "tecnologias",
        keywords: [
            "deploy",
            "deployment",
            "despliegue",
            "hosting",
        ],
        response:
            "Para despliegue, Jorge trabaja con servicios como Render, Vercel y AWS."
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
        response:
            "Jorge trabaja principalmente con React, JavaScript, Django, Java, PostgreSQL y MySQL. También utiliza Render, Vercel y AWS."
    },

    // PROYECTOS
    {
        category: "proyectos",
        keywords: [
            "portfolio",
            "portafolio",
            "portfolio react",
        ],
        response:
            "Jorge cuenta con un portfolio desarrollado con React para mostrar su formación, tecnologías y proyectos."
    },

    {
        category: "proyectos",
        keywords: [
            "quiz",
            "quiz ecuador",
            "quiz sobre ecuador",
        ],
        response:
            "Uno de los proyectos de Jorge es un Quiz sobre Ecuador."
    },

    {
        category: "proyectos",
        keywords: [
            "clima",
            "app clima",
            "aplicacion clima",
        ],
        response:
            "Jorge desarrolló una aplicación del clima que permite consultar información meteorológica."
    },

    {
        category: "proyectos",
        keywords: [
            "chatbot",
            "chat bot",
            "sasha",
        ],
        response:
            "Jorge desarrolló un chatbot y Sasha funciona como asistente virtual de su portfolio."
    },

    {
        category: "proyectos",
        keywords: [
            "ajedrez",
            "chess",
        ],
        response:
            "Jorge cuenta con un proyecto relacionado con el juego de ajedrez."
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
        response:
            "Jorge desarrolló un e-commerce utilizando React en frontend y Django en backend."
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
        response:
            "Entre los proyectos de Jorge se encuentran su Portfolio React, un Quiz sobre Ecuador, una aplicación del clima, un chatbot, un proyecto de ajedrez y un e-commerce con React y Django."
    },

    // CERTIFICACIONES
    {
        category: "certificaciones",
        keywords: [
            "mcp",
            "certificacion mcp",
        ],
        response:
            "Jorge cuenta con una certificación relacionada con MCP de Anthropic, obtenida en 2026."
    },

    {
        category: "certificaciones",
        keywords: [
            "linux",
            "certificacion linux",
        ],
        response:
            "Jorge cuenta con una certificación de Linux realizada en Udemy en 2024."
    },

    {
        category: "certificaciones",
        keywords: [
            "fundamentals of ai",
            "fundamentos de ia",
            "ibm",
        ],
        response:
            "Jorge cuenta con la certificación Fundamentals of AI de IBM, obtenida en 2025."
    },

    {
        category: "certificaciones",
        keywords: [
            "az 900",
            "az-900",
            "azure",
        ],
        response:
            "Jorge cuenta con la certificación AZ-900 de UNIR, obtenida en 2023."
    },

    {
        category: "certificaciones",
        keywords: [
            "claude api",
            "certificacion claude",
        ],
        response:
            "Jorge cuenta con una certificación relacionada con Claude API de Anthropic, obtenida en 2026."
    },

    {
        category: "certificaciones",
        keywords: [
            "certificaciones",
            "certificados",
            "certificacion",
            "que certificaciones tiene",
        ],
        response:
            "Jorge cuenta con certificaciones relacionadas con MCP, Linux, Fundamentals of AI, AZ-900 y Claude API."
    },

    // INTERESES
    {
        category: "intereses",
        keywords: [
            "lectura",
            "leer",
            "libros",
            "libro",
            "dan brown",
        ],
        response:
            "A Jorge le gusta la lectura, especialmente las obras del escritor Dan Brown."
    },

    {
        category: "intereses",
        keywords: [
            "musica",
            "que musica le gusta",
        ],
        response:
            "La música es uno de los intereses de Jorge."
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
        response:
            "Entre los intereses de Jorge están la lectura, especialmente las obras de Dan Brown, y la música."
    },

    // CONTACTO
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
        response:
            'Puedes contactar a Jorge desde la sección "Contacto" de su portfolio.'
    },

    // SASHA
    {
        category: "sasha",
        keywords: [
            "quien eres",
            "que eres",
            "como te llamas",
            "tu nombre",
        ],
        response:
            "Soy Sasha, la asistente virtual del portfolio de Jorge."
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
        "santamaria",
        "santamaria cherrez",
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

        if (
            jorgeCategories.includes(item.category) &&
            !aboutJorge
        ) {
            continue;
        }

        let score = 0;

        for (const keyword of item.keywords) {
            const normalizedKeyword = normalizeText(keyword);

            if (normalizedMessage.includes(normalizedKeyword)) {
                score += normalizedKeyword.split(" ").length * 3;
                continue;
            }

            const keywordWords = normalizedKeyword
                .split(" ")
                .filter((word) => word.length > 2);

            for (const word of keywordWords) {
                if (normalizedMessage.includes(word)) {
                    score += 1;
                }
            }
        }

        if (score > bestScore) {
            bestScore = score;
            bestMatch = item;
        }
    }

    if (bestScore >= 3 && bestMatch) {
        return bestMatch.response;
    }

    return null;
};
