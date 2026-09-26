import Groq from "groq-sdk";
import { getLocalResponse } from "../utils/localResponses.js";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

/*
|--------------------------------------------------------------------------
| CONFIGURACIÓN
|--------------------------------------------------------------------------
*/

const MODEL = "openai/gpt-oss-120b";

const MAX_MESSAGE_LENGTH = 1000;
const MAX_HISTORY_MESSAGES = 2;
const MAX_COMPLETION_TOKENS = 180;
const COST_PER_1K_TOKENS = 0.0002;


/*
|--------------------------------------------------------------------------
| INFORMACIÓN DE JORGE
|--------------------------------------------------------------------------
*/

const JORGE_INFO = `
Jorge Patricio Santamaría Cherrez.
Ingeniería en Sistemas, Universidad Indoamérica, Ecuador: 9/10.
Máster en Ingeniería de Software, UNIR, España: 8.68/10.
Certificaciones: MCP y Claude API (Anthropic, 2026); Fundamentals of AI (IBM, 2025); Linux (Udemy, 2024); AZ-900 (UNIR, 2023).
Stack: React, JavaScript, Django, Java, PostgreSQL, MySQL, Render, Vercel, VirtualBox, LibreOffice, Postman.
Proyectos: Quiz Ecuador (React); App del clima (React); Chatbot (Node.js, Express, Groq); Ajedrez (React, Stockfish); E-commerce (React, Django, PostgreSQL).
`;


/*
|--------------------------------------------------------------------------
| PROMPT GENERAL
|--------------------------------------------------------------------------
|
| MUY CORTO:
| Este prompt se utiliza para preguntas generales.
| No incluimos JORGE_INFO aquí.
|--------------------------------------------------------------------------
*/

const GENERAL_PROMPT = `
Eres Sasha, asistente del portfolio de Jorge.

Responde en el idioma del usuario, de forma clara y directa, normalmente en 1-3 frases.
No inventes información.
Para información actual, reciente o que pueda haber cambiado, utiliza la búsqueda web.
Solo menciona a Jorge si la pregunta trata sobre él.
Si preguntan quién eres, explica brevemente que eres Sasha.
`;


/*
|--------------------------------------------------------------------------
| PROMPT SOBRE JORGE
|--------------------------------------------------------------------------
*/

const JORGE_PROMPT = `
Eres Sasha, asistente del portfolio de Jorge.

Responde en el idioma del usuario, de forma clara y directa, normalmente en 1-2 frases.
Usa únicamente los datos proporcionados sobre Jorge.
No inventes datos.
No mezcles tecnologías entre proyectos.
En preguntas sobre notas, responde solo con:
Ingeniería en Sistemas 9/10 y Máster 8.68/10.

DATOS:
${JORGE_INFO}
`;


/*
|--------------------------------------------------------------------------
| PALABRAS RELACIONADAS CON JORGE
|--------------------------------------------------------------------------
*/

const JORGE_KEYWORDS = [
    "jorge",
    "patricio",
    "santamaria",
    "santamaria cherrez",
    "jorge patricio",

    "sus estudios",
    "sus notas",
    "sus calificaciones",
    "su master",
    "su maestria",
    "su ingenieria",
    "sus certificaciones",
    "sus proyectos",
    "sus tecnologias",
    "su stack",
    "su portfolio",
    "su portafolio",
    "su experiencia",

    "contactar a jorge",
    "contacto de jorge",

    "ecommerce",
];


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
| DETECTAR SI LA PREGUNTA ES SOBRE JORGE
|--------------------------------------------------------------------------
*/

const isJorgeQuestion = (message) => {
    const text = normalizeText(message);

    return JORGE_KEYWORDS.some((keyword) =>
        text.includes(normalizeText(keyword))
    );
};


/*
|--------------------------------------------------------------------------
| LIMPIAR HISTORIAL
|--------------------------------------------------------------------------
|
| Solo conservamos los últimos 2 mensajes.
|
| Esto reduce bastante el prompt sin eliminar completamente
| la capacidad de mantener contexto.
|--------------------------------------------------------------------------
*/

const sanitizeHistory = (history) => {
    if (!Array.isArray(history)) {
        return [];
    }

    return history
        .filter(
            (item) =>
                item &&
                (item.role === "user" || item.role === "assistant") &&
                typeof item.content === "string"
        )
        .map((item) => ({
            role: item.role,
            content: item.content.trim(),
        }))
        .filter((item) => item.content.length > 0)
        .slice(-MAX_HISTORY_MESSAGES);
};


/*
|--------------------------------------------------------------------------
| DECIDIR SI REALMENTE NECESITAMOS HISTORIAL
|--------------------------------------------------------------------------
|
| Si la pregunta parece independiente, no enviamos historial.
|
| Ejemplo:
|
| "¿Quién ganó el Royal Rumble 2026?"
|
| No necesita conocer la conversación anterior.
|--------------------------------------------------------------------------
*/

const needsHistory = (message) => {
    const text = normalizeText(message);

    const contextWords = [
        "ese",
        "esa",
        "eso",
        "ese proyecto",
        "esa tecnologia",
        "esa certificacion",
        "el anterior",
        "la anterior",
        "lo anterior",
        "tambien",
        "también",
        "y que",
        "y cual",
        "y cuál",
        "y como",
        "y cómo",
        "que mas",
        "qué más",
        "cuentame mas",
        "cuéntame más",
        "explica mas",
        "explica más",
    ];

    return contextWords.some((word) =>
        text.includes(normalizeText(word))
    );
};


/*
|--------------------------------------------------------------------------
| ENVIAR MENSAJE
|--------------------------------------------------------------------------
*/

export const sendMessage = async (req, res) => {
    try {
        const { message, history = [] } = req.body;

        /*
        |--------------------------------------------------------------------------
        | VALIDACIÓN
        |--------------------------------------------------------------------------
        */

        if (typeof message !== "string" || !message.trim()) {
            return res.status(400).json({
                error: "El mensaje es obligatorio.",
            });
        }

        const userMessage = message.trim();

        if (userMessage.length > MAX_MESSAGE_LENGTH) {
            return res.status(400).json({
                error: `El mensaje no puede superar los ${MAX_MESSAGE_LENGTH} caracteres.`,
            });
        }


        /*
        |--------------------------------------------------------------------------
        | RESPUESTAS LOCALES
        |--------------------------------------------------------------------------
        |
        | Este es el ahorro máximo:
        |
        | Si localResponses.js conoce la respuesta,
        | NO llamamos a Groq.
        |--------------------------------------------------------------------------
        */

        const localResponse = getLocalResponse(userMessage);

        if (localResponse) {
            console.log("⚡ Respuesta local");

            return res.json({
                response: localResponse,
                usage: {
                    promptTokens: 0,
                    completionTokens: 0,
                    totalTokens: 0,
                    estimatedCost: 0,
                },
                source: "local",
            });
        }


        /*
        |--------------------------------------------------------------------------
        | HISTORIAL LIMPIO
        |--------------------------------------------------------------------------
        */

        const cleanHistory = sanitizeHistory(history);


        /*
        |--------------------------------------------------------------------------
        | DETECTAR SI ES SOBRE JORGE
        |--------------------------------------------------------------------------
        */

        const currentQuestionIsAboutJorge =
            isJorgeQuestion(userMessage);


        /*
        |--------------------------------------------------------------------------
        | CONTEXTO ANTERIOR
        |--------------------------------------------------------------------------
        |
        | Solo utilizamos historial para detectar continuidad.
        |
        | No mandamos automáticamente todo el historial a Groq.
        |--------------------------------------------------------------------------
        */

        let aboutJorge = currentQuestionIsAboutJorge;

        if (!aboutJorge && needsHistory(userMessage)) {
            const previousUserMessages = cleanHistory
                .filter((item) => item.role === "user")
                .map((item) => item.content)
                .join(" ");

            aboutJorge = isJorgeQuestion(previousUserMessages);
        }


        /*
        |--------------------------------------------------------------------------
        | ELEGIR PROMPT
        |--------------------------------------------------------------------------
        */

        const systemPrompt = aboutJorge
            ? JORGE_PROMPT
            : GENERAL_PROMPT;


        /*
        |--------------------------------------------------------------------------
        | DECIDIR CUÁNTO HISTORIAL ENVIAR
        |--------------------------------------------------------------------------
        |
        | Solo mandamos historial si la pregunta depende del contexto anterior.
        |
        | Una pregunta independiente va prácticamente sin contexto.
        |--------------------------------------------------------------------------
        */

        const historyToSend = needsHistory(userMessage)
            ? cleanHistory
            : [];


        /*
        |--------------------------------------------------------------------------
        | MENSAJES PARA GROQ
        |--------------------------------------------------------------------------
        */

        const messages = [
            {
                role: "system",
                content: systemPrompt,
            },

            ...historyToSend,

            {
                role: "user",
                content: userMessage,
            },
        ];


        /*
        |--------------------------------------------------------------------------
        | GROQ + BÚSQUEDA WEB
        |--------------------------------------------------------------------------
        */

        const completion = await groq.chat.completions.create({
            model: MODEL,

            messages,

            temperature: 0.3,

            max_completion_tokens: MAX_COMPLETION_TOKENS,

            reasoning_effort: "low",

            stream: false,

            tools: [
                {
                    type: "browser_search",
                },
            ],
        });


        /*
        |--------------------------------------------------------------------------
        | USO DE TOKENS
        |--------------------------------------------------------------------------
        */

        const usage = completion.usage || {};

        const promptTokens =
            usage.prompt_tokens || 0;

        const completionTokens =
            usage.completion_tokens || 0;

        const totalTokens =
            usage.total_tokens || 0;

        const estimatedCost =
            (totalTokens / 1000) * COST_PER_1K_TOKENS;


        /*
        |--------------------------------------------------------------------------
        | RESPUESTA
        |--------------------------------------------------------------------------
        */

        const response =
            completion.choices?.[0]?.message?.content?.trim();

        if (!response) {
            throw new Error("Groq no devolvió contenido.");
        }


        /*
        |--------------------------------------------------------------------------
        | LIMPIAR RESPUESTA
        |--------------------------------------------------------------------------
        */

        const cleanResponse = response
            .replace(/【[^】]*】/g, "")
            .replace(/\*\*/g, "")
            .replace(/\*/g, "")
            .trim();


        /*
        |--------------------------------------------------------------------------
        | LOGS
        |--------------------------------------------------------------------------
        */

        console.log("🤖 Sasha respondió");
        console.log("🧠 Modelo:", MODEL);

        console.log(
            "👤 Contexto Jorge:",
            aboutJorge ? "SÍ" : "NO"
        );

        console.log(
            "💬 Historial enviado:",
            historyToSend.length
        );

        console.log("📊 Prompt:", promptTokens);
        console.log("⬅️ Completion:", completionTokens);
        console.log("🔢 Total:", totalTokens);
        console.log(
            "💰 Costo: $",
            estimatedCost.toFixed(6)
        );


        /*
        |--------------------------------------------------------------------------
        | RESPUESTA API
        |--------------------------------------------------------------------------
        */

        return res.json({
            response: cleanResponse,

            usage: {
                promptTokens,
                completionTokens,
                totalTokens,
                estimatedCost,
            },
        });

    } catch (error) {

        console.error("❌ ERROR GROQ:", error);

        /*
        |--------------------------------------------------------------------------
        | RATE LIMIT
        |--------------------------------------------------------------------------
        */

        if (error?.status === 429) {
            return res.status(429).json({
                error:
                    "Sasha está recibiendo muchas solicitudes. Inténtalo nuevamente en unos segundos.",
            });
        }


        /*
        |--------------------------------------------------------------------------
        | API KEY
        |--------------------------------------------------------------------------
        */

        if (error?.status === 401) {
            return res.status(500).json({
                error:
                    "Error de configuración del servicio de inteligencia artificial.",
            });
        }


        /*
        |--------------------------------------------------------------------------
        | ERROR GENERAL
        |--------------------------------------------------------------------------
        */

        return res.status(500).json({
            error:
                "No fue posible obtener una respuesta de Sasha. Inténtalo nuevamente.",
        });
    }
};

 
