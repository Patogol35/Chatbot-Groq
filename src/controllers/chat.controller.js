import Groq from "groq-sdk";
import { getLocalResponse } from "../utils/localResponses.js";
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const MODEL = "openai/gpt-oss-20b";

const MAX_MESSAGE_LENGTH = 1000;
const MAX_HISTORY_MESSAGES = 4;
const MAX_COMPLETION_TOKENS = 180;
const COST_PER_1K_TOKENS = 0.0002;

/*
|--------------------------------------------------------------------------
| INFORMACIÓN DE JORGE
|--------------------------------------------------------------------------
*/

const JORGE_INFO = `
Jorge Patricio Santamaría Cherrez.
Estudios: Ingeniería en Sistemas (Universidad Indoamérica, Ecuador, 9/10); Máster en Ingeniería de Software (UNIR, España, 8.68/10).
Certificaciones: MCP y Claude API (Anthropic, 2026); Fundamentals of AI (IBM, 2025); Linux (Udemy, 2024); AZ-900 (UNIR, 2023).
Stack: React, JavaScript, Django, Java, PostgreSQL, MySQL, Render, Vercel, VirtualBox, LibreOffice, Postman.
Proyectos: Quiz Ecuador (React); App del clima (React); Chatbot (Node.js, Express, Groq); Ajedrez (React, Stockfish); E-commerce (React, Django, PostgreSQL).
`;


/*
|--------------------------------------------------------------------------
| PROMPT GENERAL
|--------------------------------------------------------------------------
*/

const GENERAL_PROMPT = `
Eres Sasha, asistente del portfolio de Jorge.

- Responde claro y directo, normalmente en 1-3 frases.
- Usa aproximadamente 25-70 palabras.
- Responde solo en el idioma del último mensaje del usuario.
- Puedes responder preguntas generales y de tecnología.
- Si no tienes información verificable, dilo; no inventes.
- Menciona a Jorge solo cuando la pregunta sea sobre él.
- Solo explica que eres Sasha si preguntan directamente quién eres, quién es Sasha o qué eres.
- Si preguntan por otra persona, responde sobre esa persona sin mencionar a Jorge ni a Sasha.
`;


/*
|--------------------------------------------------------------------------
| PROMPT SOBRE JORGE
|--------------------------------------------------------------------------
*/

const JORGE_PROMPT = `
Eres Sasha, asistente del portfolio de Jorge.

- Responde directo, normalmente en 1-2 frases y en el idioma del último mensaje.
- Usa aproximadamente 25-70 palabras.
- Usa únicamente datos verificables de JORGE_INFO; no inventes.
- Una tecnología es válida solo si aparece literalmente en JORGE_INFO.
- En preguntas sobre proyectos, usa solo las tecnologías/herramientas asociadas explícitamente a ese proyecto; no mezcles el STACK general.
- Evita repetir información innecesaria.

- Sobre notas, responde solo: Ingeniería en Sistemas 9/10 y Máster 8.68/10.

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

    return JORGE_KEYWORDS.some((keyword) => {
        return text.includes(normalizeText(keyword));
    });
};


/*
|--------------------------------------------------------------------------
| LIMPIAR HISTORIAL
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
| ENVIAR MENSAJE
|--------------------------------------------------------------------------
*/

export const sendMessage = async (req, res) => {
    try {
        const { message, history = [] } = req.body;

        if (typeof message !== "string" || !message.trim()) {
            return res.status(400).json({
                error: "El mensaje es obligatorio.",
            });
        }

        const userMessage = message.trim();
        const localResponse = getLocalResponse(userMessage);

if (localResponse) {
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

        if (userMessage.length > MAX_MESSAGE_LENGTH) {
            return res.status(400).json({
                error: `El mensaje no puede superar los ${MAX_MESSAGE_LENGTH} caracteres.`,
            });
        }

        /*
        |--------------------------------------------------------------------------
        | DETECTAR CONTEXTO
        |--------------------------------------------------------------------------
        */

        const cleanHistory = sanitizeHistory(history);

const previousUserMessages = cleanHistory
    .filter((item) => item.role === "user")
    .map((item) => item.content)
    .join(" ");

const aboutJorge =
    isJorgeQuestion(userMessage) ||
    isJorgeQuestion(previousUserMessages);
        
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
        | MENSAJES PARA GROQ
        |--------------------------------------------------------------------------
        */

        const messages = [
            {
                role: "system",
                content: systemPrompt,
            },
            ...cleanHistory,
            {
                role: "user",
                content: userMessage,
            },
        ];

        /*
        |--------------------------------------------------------------------------
        | GROQ
        |--------------------------------------------------------------------------
        */

        const completion = await groq.chat.completions.create({
            model: MODEL,
            messages,
            temperature: 0.3,
            max_completion_tokens: MAX_COMPLETION_TOKENS,
            reasoning_effort: "low",
            stream: false,
        });

        /*
        |--------------------------------------------------------------------------
        | USO DE TOKENS
        |--------------------------------------------------------------------------
        */

        const usage = completion.usage || {};

        const promptTokens = usage.prompt_tokens || 0;
        const completionTokens = usage.completion_tokens || 0;
        const totalTokens = usage.total_tokens || 0;

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

        const cleanResponse = response
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
        console.log("📊 Prompt:", promptTokens);
        console.log("⬅️ Completion:", completionTokens);
        console.log("🔢 Total:", totalTokens);
        console.log("💰 Costo: $", estimatedCost.toFixed(6));

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

        if (error?.status === 429) {
            return res.status(429).json({
                error:
                    "Sasha está recibiendo muchas solicitudes. Inténtalo nuevamente en unos segundos.",
            });
        }

        if (error?.status === 401) {
            return res.status(500).json({
                error:
                    "Error de configuración del servicio de inteligencia artificial.",
            });
        }

        return res.status(500).json({
            error:
                "No fue posible obtener una respuesta de Sasha. Inténtalo nuevamente.",
        });
    }
};
