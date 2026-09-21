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

ESTUDIOS:
Ingeniería en Sistemas — Universidad Indoamérica, Ecuador — 9/10.
Máster en Ingeniería de Software — UNIR, España — 8.68/10.

CERTIFICACIONES:
MCP — Anthropic, 2026.
Claude API — Anthropic, 2026.
Fundamentals of AI — IBM, 2025.
Linux — Udemy, 2024.
AZ-900 — UNIR, 2023.

STACK:
Frontend: React, JavaScript.
Backend: Django, Java.
BD: PostgreSQL, MySQL.
Cloud: Render, Vercel.
Herramientas: VirtualBox, LibreOffice, Postman.

PROYECTOS:
Quiz Ecuador: React.
App del clima: React.
Chatbot: Node.js, Express, Groq.
Ajedrez: React, Stockfish.
E-commerce: React, Django, PostgreSQL.
`;


/*
|--------------------------------------------------------------------------
| PROMPT GENERAL
|--------------------------------------------------------------------------
*/

const GENERAL_PROMPT = `
Eres Sasha, asistente virtual del portfolio de Jorge.

REGLAS:
- Responde de forma clara y normalmente en 1-3 frases.
- Responde únicamente en el idioma del usuario.
- Puedes responder preguntas generales y de tecnología.
- Si no tienes información verificable, dilo y no inventes datos.
- No menciones a Jorge si la pregunta no trata sobre él.
- Si preguntan quién eres, responde que eres Sasha.
- Si preguntan por otra persona, responde sobre esa persona y no hables de Jorge ni de Sasha.
`;


/*
|--------------------------------------------------------------------------
| PROMPT SOBRE JORGE
|--------------------------------------------------------------------------
*/

const JORGE_PROMPT = `
Eres Sasha, asistente del portfolio de Jorge.

REGLAS:
- Responde claro y normalmente en 1-2 frases.
- Responde en el idioma del usuario.
- Usa solo los datos proporcionados sobre Jorge.
- En proyectos, usa solo las tecnologías asociadas a ese proyecto; no agregues herramientas del STACK general.
- Si no tienes información verificable, dilo y no inventes.
- No repitas información innecesaria.
- Si preguntan quién eres, responde que eres Sasha.
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
"e-commerce",
"chatbot",
"portfolio",
"portafolio",
"quiz ecuador",
"app del clima",
"ajedrez",
"stockfish",
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

        const aboutJorge = isJorgeQuestion(userMessage);

        const cleanHistory = sanitizeHistory(history);

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
