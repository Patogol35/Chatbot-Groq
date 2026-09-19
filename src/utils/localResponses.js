import { LOCAL_RESPONSES } from "./localResponsesData.js";

/*
|--------------------------------------------------------------------------
| NORMALIZAR TEXTO
|--------------------------------------------------------------------------
*/

const normalizeText = (text = "") => {
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
| DISTANCIA DE LEVENSHTEIN
|--------------------------------------------------------------------------
*/

const levenshteinDistance = (a, b) => {
    const matrix = Array.from(
        { length: b.length + 1 },
        (_, i) => [i]
    );

    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            matrix[i][j] =
                b[i - 1] === a[j - 1]
                    ? matrix[i - 1][j - 1]
                    : Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
        }
    }

    return matrix[b.length][a.length];
};

/*
|--------------------------------------------------------------------------
| DETECTAR ERROR DE ESCRITURA DE JORGE
|--------------------------------------------------------------------------
*/

const isSimilarToJorge = (word) => {
    const normalizedWord = normalizeText(word);

    // Solo aplicar similitud a palabras con una longitud razonable
    if (
        normalizedWord.length < 4 ||
        normalizedWord.length > 8
    ) {
        return false;
    }

    return levenshteinDistance(
        normalizedWord,
        "jorge"
    ) <= 2;
};

/*
|--------------------------------------------------------------------------
| NORMALIZAR VARIANTES DE JORGE
|--------------------------------------------------------------------------
|
| Ejemplos:
| jorge  → jorge
| jorgee → jorge
| jorje  → jorge
| jroge  → jorge
|
|--------------------------------------------------------------------------
*/

const normalizeJorgeVariants = (message) => {
    return normalizeText(message)
        .split(/\s+/)
        .map((word) =>
            isSimilarToJorge(word)
                ? "jorge"
                : word
        )
        .join(" ");
};

/*
|--------------------------------------------------------------------------
| NOMBRES VÁLIDOS DE JORGE
|--------------------------------------------------------------------------
*/

const VALID_NAMES = [
    "jorge",
    "patricio",
    "santamaria",
    "cherrez",
    "jorge patricio",
    "jorge patricio santamaria",
    "jorge patricio santamaria cherrez",
    "santamaria cherrez",
];

/*
|--------------------------------------------------------------------------
| PALABRAS COMUNES
|--------------------------------------------------------------------------
*/

const COMMON_WORDS = new Set([
    "a",
    "soluciones",
    "aplicaciones",
    "apps",
    "sistemas",
    "al",
    "algo",
    "proyectos",
    "proyecto",
    "tecnologia",
    "tecnologias",
    "stack",
    "lenguajes",
    "herramientas",
    "que",
    "desarrollado",
    "algun",
    "alguna",
    "algunos",
    "algunas",
    "como",
    "con",
    "cual",
    "cuales",
    "cuando",
    "calificacion",
    "de",
    "del",
    "desde",
    "deseo",
    "dime",
    "donde",
    "estudio",
    "estudia",
    "estudios",
    "el",
    "ella",
    "ellos",
    "en",
    "es",
    "esa",
    "son",
    "ese",
    "eso",
    "esta",
    "estas",
    "este",
    "estos",
    "fue",
    "ha",
    "habla",
    "hablame",
    "hablar",
    "hay",
    "la",
    "las",
    "le",
    "lo",
    "los",
    "me",
    "mi",
    "mis",
    "necesito",
    "nombre",
    "no",
    "o",
    "para",
    "por",
    "quien",
    "quienes",
    "se",
    "sobre",
    "su",
    "sus",
    "tiene",
    "tienen",
    "tu",
    "un",
    "una",
    "unos",
    "unas",
    "y",

    // Perfil y formación
    "formacion",
    "ingenieria",
    "ingeniero",
    "acerca",
    "master",
    "maestria",
    "posgrado",
    "postgrado",
    "promedio",
    "perfil",
    "nota",
    "notas",
    "realizo",
    "siguio",
    "educacion",
    "estudio",
    "estudios",

    // Conversación
    "hola",
    "buenas",
    "buenos",
    "dias",
    "tardes",
    "noches",
    "hey",
    "hello",
    "gracias",
    "muchas",
    "te",
    "agradezco",
    "chao",
    "adios",
    "hasta",
    "luego",
    "nos",
    "vemos",
    "voy",
    "bye",
    "pronto",
    "estas",
    "encuentras",
    "bien",
    "va",
    "creo",
    "ti",
    "eres",
    "sasha",

    // Desarrollo
    "hizo",
    "programo",
    "desarrollo",
    "curso",
    "cursos",
    "certificado",
    "certificados",
    "certificacion",
    "certificaciones",
    "base",
    "bases",
    "datos",

    // Contacto
    "contactarlo",
    "contactame",
    "contactar",
    "contactarme",
    "comunicarme",
    "comunicar",
    "quiero",
    "hablar",
    "llamar",
    "cuentame",
    "saber",

    // Microsoft / Azure
    "microsoft",
    "azure",
    "az",
    "az900",
    "fundamentals",
    "cloud",
    "nube",

    // MCP / Anthropic / Claude
    "mcp",
    "anthropic",
    "claude",

    // IBM
    "ibm",

    // Otros
    "linux",
    "utiliza",
    "experiencia",
]);

/*
|--------------------------------------------------------------------------
| DETECTAR SI EL MENSAJE MENCIONA A JORGE
|--------------------------------------------------------------------------
*/

const containsValidName = (message) => {
    const normalized = normalizeJorgeVariants(message);

    return VALID_NAMES.some((name) => {
        const normalizedName = normalizeText(name);

        const regex = new RegExp(
            `(^|\\s)${normalizedName.replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
            )}(?=\\s|$)`
        );

        return regex.test(normalized);
    });
};

/*
|--------------------------------------------------------------------------
| DETECTAR SI EXISTE OTRO NOMBRE
|--------------------------------------------------------------------------
*/

const containsAnotherPersonName = (message) => {
    const normalized = normalizeJorgeVariants(message);

    console.log("MENSAJE NORMALIZADO:", normalized);

    const jorgeWords = new Set([
        "jorge",
        "patricio",
        "santamaria",
        "cherrez",
    ]);

    const words = normalized.split(/\s+/);

    for (const word of words) {
        if (!word) continue;

        // Palabras del nombre de Jorge
        if (jorgeWords.has(word)) {
            continue;
        }

        // Sasha no es una persona consultada
        if (word === "sasha") {
            continue;
        }

        // Palabras comunes
        if (COMMON_WORDS.has(word)) {
            continue;
        }

        // Números
        if (/^\d+$/.test(word)) {
            continue;
        }

        // Cualquier palabra restante se considera otro nombre
        if (/^[a-záéíóúñ]+$/i.test(word)) {
            console.log("OTRA PERSONA:", word);
            return true;
        }
    }

    return false;
};

/*
|--------------------------------------------------------------------------
| BUSCAR RESPUESTA LOCAL
|--------------------------------------------------------------------------
*/

export const getLocalResponse = (message) => {

    /*
    |--------------------------------------------------------------------------
    | NORMALIZAR MENSAJE
    |--------------------------------------------------------------------------
    |
    | Aquí se corrigen automáticamente pequeños errores de "Jorge".
    |
    */

    const normalizedMessage =
        normalizeJorgeVariants(message);

    console.log(
        "🔎 MENSAJE PARA RESPUESTA LOCAL:",
        normalizedMessage
    );

    /*
    |--------------------------------------------------------------------------
    | PREGUNTAS CONCEPTUALES
    |--------------------------------------------------------------------------
    */

    const conceptualPrefixes = [
        "que es",
        "que significa",
        "que son",

        "dime que es",
        "dime que significa",
        "dime que son",

        "explica que es",
        "explica que significa",
        "explica que son",

        "explicame que es",
        "explicame que significa",
        "explicame que son",

        "puedes decirme que es",
        "puedes decirme que significa",
        "puedes decirme que son",

        "puedes explicar que es",
        "puedes explicarme que es",
        "puedes explicarme que significa",
        "puedes explicarme que son",

        "cuentame que es",
        "cuentame que significa",
        "cuentame que son",

        "para que sirve",
        "para que sirven",

        "que hace",
        "que hacen",
    ];

    const conceptualTopics = [
        // Frontend
        "frontend",
        "front end",
        "front-end",

        // Backend
        "backend",
        "back end",
        "back-end",

        // Bases de datos
        "base de datos",
        "bases de datos",

        // Formación
        "formacion",

        // Otros conceptos
        "stack",
        "tecnologia",
        "tecnologias",
        "herramienta",
        "herramientas",
        "proyecto",
        "proyectos",
        "nota",
        "notas",
        "master",
        "maestria",
        "ingenieria",
        "posgrado",
        "experiencia",
    ];

    const isConceptualQuestion =
        conceptualPrefixes.some((prefix) =>
            normalizedMessage.includes(prefix)
        ) &&
        conceptualTopics.some((topic) =>
            normalizedMessage.includes(topic)
        );

    if (isConceptualQuestion) {
        return null;
    }

    /*
    |--------------------------------------------------------------------------
    | PREGUNTAS CON AÑO ESPECÍFICO → GROQ
    |--------------------------------------------------------------------------
    */

    if (
        /\b(19|20)\d{2}\b/.test(
            normalizedMessage
        )
    ) {
        return null;
    }

    /*
    |--------------------------------------------------------------------------
    | OTRO NOMBRE → GROQ
    |--------------------------------------------------------------------------
    */

    if (containsAnotherPersonName(message)) {
        return null;
    }

    /*
    |--------------------------------------------------------------------------
    | BUSCAR MEJOR RESPUESTA LOCAL
    |--------------------------------------------------------------------------
    */

    let bestMatch = null;
    let bestScore = 0;

    for (const item of LOCAL_RESPONSES) {

        let score = 0;

        for (const keyword of item.keywords) {

            const normalizedKeyword =
                normalizeText(keyword);

            const escapedKeyword =
                normalizedKeyword.replace(
                    /[.*+?^${}()|[\]\\]/g,
                    "\\$&"
                );

            const regex = new RegExp(
                `(^|\\s)${escapedKeyword}(?=\\s|$)`
            );

            if (regex.test(normalizedMessage)) {

                const words =
                    normalizedKeyword.split(" ").length;

                score += words * 10;
            }
        }

        if (score > bestScore) {
            bestScore = score;
            bestMatch = item;
        }
    }

    /*
    |--------------------------------------------------------------------------
    | DEVOLVER RESPUESTA LOCAL
    |--------------------------------------------------------------------------
    */

    if (
        bestMatch &&
        bestScore >= 10
    ) {

        const responses =
            bestMatch.responses;

        const randomIndex =
            Math.floor(
                Math.random() *
                responses.length
            );

        console.log(
            "✅ RESPUESTA LOCAL UTILIZADA"
        );

        return responses[randomIndex];
    }

    console.log(
        "❌ SIN RESPUESTA LOCAL → GROQ"
    );

    return null;
};
