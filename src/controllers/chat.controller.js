import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const MODEL = "openai/gpt-oss-20b";

const MAX_MESSAGE_LENGTH = 1000;
const MAX_HISTORY_MESSAGES = 2;
const MAX_COMPLETION_TOKENS = 280;
const COST_PER_1K_TOKENS = 0.0002;

// ======================================================
// INFORMACIÓN DE JORGE
// ======================================================

const JORGE_INFO = `
INFORMACIÓN VERIFICADA DE JORGE:

Nombre:
Jorge Patricio Santamaría Cherrez.

Estudios:
- Ingeniería en Sistemas, Universidad Indoamérica (9/10).
- Máster en Ingeniería de Software, UNIR España (8.68/10).

Certificaciones:
- MCP Anthropic (2026).
- Claude API Anthropic (2026).
- Fundamentals of AI IBM (2025).
- Linux Udemy (2024).
- AZ-900 UNIR (2023).

Stack:
- React
- JavaScript
- Django
- Java
- PostgreSQL
- MySQL
- Render
- Vercel
- AWS

Herramientas:
- VirtualBox
- LibreOffice
- RustDesk
- Postman

Proyectos:
- Portfolio React
- Quiz Ecuador
- App del clima
- Chatbot
- Ajedrez
- E-commerce React + Django

Contacto:
- Para contactar a Jorge, indica la sección "Contacto" del portfolio.
`;

// ======================================================
// PROMPT BASE
// ======================================================

const BASE_SYSTEM_PROMPT = `
Eres Sasha, la IA del portfolio de Jorge Patricio Santamaría Cherrez.

REGLAS GENERALES:
- Responde directamente y de forma natural.
- Responde en el mismo idioma que utiliza el usuario.
- Mantén las respuestas normalmente entre 1 y 3 frases y 25-70 palabras.
- Puedes responder preguntas generales sobre tecnología.
- No inventes información sobre Jorge.
- No digas que eres humana.

IDENTIDAD DE SASHA:
Si el usuario pregunta "¿quién eres?", "¿cómo te llamas?" o pregunta específicamente por Sasha, responde:
"Soy Sasha, la IA del portfolio de Jorge."

IMPORTANTE:
La pregunta "¿Quién es Jorge?" NO pregunta quién eres tú.
Si el usuario pregunta quién es Jorge, debes explicar quién es Jorge utilizando la información proporcionada.
`;

// ======================================================
// PROMPT CUANDO LA PREGUNTA ES SOBRE JORGE
// ======================================================

const JORGE_SYSTEM_PROMPT = `
${BASE_SYSTEM_PROMPT}

========================================
MODO INFORMACIÓN SOBRE JORGE
========================================

La pregunta actual está relacionada con Jorge.

Debes responder sobre JORGE, no sobre Sasha.

Utiliza EXCLUSIVAMENTE la información verificada de Jorge que aparece abajo.

Si preguntan:
"¿Quién es Jorge?"
debes responder presentando brevemente a Jorge, por ejemplo indicando su nombre, formación y perfil tecnológico.

Si preguntan por sus estudios, certificaciones, tecnologías, herramientas o proyectos, responde únicamente con los datos correspondientes.

No confundas:
- Jorge = propietario y profesional del portfolio.
- Sasha = asistente de IA del portfolio.

No respondas "Soy Sasha" cuando la pregunta sea sobre Jorge.

Si el dato solicitado no aparece en la información proporcionada, indica que no tienes ese dato.

INFORMACIÓN VERIFICADA DE JORGE:
${JORGE_INFO}
`;

// ======================================================
// DETECCIÓN DE PREGUNTAS SOBRE JORGE
// ======================================================

const isJorgeQuestion = (message, history = []) => {
    const text = message
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

    // --------------------------------------------------
    // 1. REFERENCIA DIRECTA
    // --------------------------------------------------

    if (
        /\b(jorge|patricio|santamaria)\b/i.test(text)
    ) {
        return true;
    }

    // --------------------------------------------------
    // 2. PREGUNTAS DIRECTAS SOBRE EL PERFIL
    // --------------------------------------------------

    const directPatterns = [
        // Identidad
        /^(quien|quién)\s+es\b/i,
        /^(quien|quién)\s+es\s+el\b/i,
        /^(que|qué)\s+sabes\s+(de|sobre)\b/i,
        /^(hablame|háblame)\s+(de|sobre)\b/i,
        /^(cuentame|cuéntame)\s+(de|sobre)\b/i,

        // Perfil
        /\b(perfil|portafolio|portfolio)\b/i,

        // Estudios
        /\b(estudio|estudios|universidad|carrera|ingenieria|ingeniería|master|máster|maestria|maestría)\b/i,

        // Certificaciones
        /\b(certificacion|certificación|certificaciones|certificado|certificados)\b/i,

        // Habilidades
        /\b(habilidades|skills|stack|tecnologias|tecnologías|lenguajes|frameworks)\b/i,

        // Experiencia
        /\b(experiencia|trayectoria|profesional|laboral)\b/i,

        // Proyectos
        /\b(proyecto|proyectos)\b/i,

        // Contacto
        /\b(contacto|contactar|correo|email|telefono|teléfono)\b/i,
    ];

    // --------------------------------------------------
    // IMPORTANTE:
    // Las palabras genéricas anteriores NO son suficientes
    // por sí solas.
    //
    // Solo se consideran si el contexto indica que se habla
    // del portfolio/persona.
    // --------------------------------------------------

    const hasPortfolioContext =
        /\b(mi|tu|el|este|ese)\s+(portfolio|portafolio)\b/i.test(text);

    if (hasPortfolioContext) {
        return true;
    }

    // --------------------------------------------------
    // 3. NOMBRES DE PROYECTOS ESPECÍFICOS
    // --------------------------------------------------

    const projectPatterns = [
        /\bquiz ecuador\b/i,
        /\bquiz educativo\b/i,
        /\bapp del clima\b/i,
        /\baplicacion del clima\b/i,
        /\baplicación del clima\b/i,
        /\be-commerce\b/i,
        /\becommerce\b/i,
        /\bajedrez con ia\b/i,
    ];

    if (
        projectPatterns.some((pattern) =>
            pattern.test(text)
        )
    ) {
        return true;
    }

    // --------------------------------------------------
    // 4. HISTORIAL
    // Detecta preguntas de seguimiento.
    // --------------------------------------------------

    const cleanHistory = sanitizeHistory(history);

    const previousMessages = cleanHistory
        .slice(-2)
        .map((item) => item.content.toLowerCase())
        .join(" ");

    const previousWasAboutJorge =
        /\b(jorge|patricio|santamaria)\b/i.test(
            previousMessages
        );

    if (previousWasAboutJorge) {
        const followUpPatterns = [
            /^(y|y que|y qué)\b/i,
            /^(cual|cuál|cuales|cuáles)\b/i,
            /^(donde|dónde)\b/i,
            /^(como|cómo)\b/i,
            /^(que|qué)\b/i,
            /^(quien|quién)\b/i,
            /^(cuanto|cuánto)\b/i,
            /^(tambien|también)\b/i,
            /^(y sus|y su)\b/i,
            /^(sus|su)\b/i,
            /^(dime|cuentame|cuéntame)\b/i,
        ];

        if (
            followUpPatterns.some((pattern) =>
                pattern.test(text)
            )
        ) {
            return true;
        }
    }

    // --------------------------------------------------
    // 5. NO ES SOBRE JORGE
    // --------------------------------------------------

    return false;
};

// ======================================================
// SANITIZAR HISTORIAL
// ======================================================

const sanitizeHistory = (history) => {
    if (!Array.isArray(history)) {
        return [];
    }

    return history
        .filter(
            (item) =>
                item &&
                (item.role === "user" ||
                    item.role === "assistant") &&
                typeof item.content === "string"
        )
        .map((item) => ({
            role: item.role,
            content: item.content.trim(),
        }))
        .filter(
            (item) => item.content.length > 0
        )
        .slice(-MAX_HISTORY_MESSAGES);
};

// ======================================================
// SEND MESSAGE
// ======================================================

export const sendMessage = async (req, res) => {
    try {
        const {
            message,
            history = [],
        } = req.body;

        // --------------------------------------------------
        // VALIDAR MENSAJE
        // --------------------------------------------------

        if (
            typeof message !== "string" ||
            !message.trim()
        ) {
            return res.status(400).json({
                error: "El mensaje es obligatorio.",
            });
        }

        const userMessage = message.trim();

        // --------------------------------------------------
        // LÍMITE DE CARACTERES
        // --------------------------------------------------

        if (
            userMessage.length >
            MAX_MESSAGE_LENGTH
        ) {
            return res.status(400).json({
                error: `El mensaje no puede superar los ${MAX_MESSAGE_LENGTH} caracteres.`,
            });
        }

        // --------------------------------------------------
        // LIMPIAR HISTORIAL
        // --------------------------------------------------

        const cleanHistory =
            sanitizeHistory(history);

        // --------------------------------------------------
        // DETECTAR INTENCIÓN
        // --------------------------------------------------

        const aboutJorge =
            isJorgeQuestion(
                userMessage,
                cleanHistory
            );

        // --------------------------------------------------
        // ELEGIR PROMPT
        //
        // Pregunta general:
        // BASE_SYSTEM_PROMPT
        //
        // Pregunta sobre Jorge:
        // JORGE_SYSTEM_PROMPT
        // --------------------------------------------------

        const systemPrompt =
            aboutJorge
                ? JORGE_SYSTEM_PROMPT
                : BASE_SYSTEM_PROMPT;

        // --------------------------------------------------
        // CONSTRUIR MENSAJES
        // --------------------------------------------------

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

        // --------------------------------------------------
        // GROQ
        // --------------------------------------------------

        const completion =
            await groq.chat.completions.create({
                model: MODEL,
                messages,
                temperature: 0.3,
                max_completion_tokens:
                    MAX_COMPLETION_TOKENS,
                reasoning_effort: "low",
                stream: false,
            });

        // --------------------------------------------------
        // USAGE
        // --------------------------------------------------

        const usage =
            completion.usage || {};

        const promptTokens =
            usage.prompt_tokens || 0;

        const completionTokens =
            usage.completion_tokens || 0;

        const totalTokens =
            usage.total_tokens || 0;

        const estimatedCost =
            (totalTokens / 1000) *
            COST_PER_1K_TOKENS;

        // --------------------------------------------------
        // OBTENER RESPUESTA
        // --------------------------------------------------

        const response =
            completion.choices?.[0]?.message?.content?.trim();

        if (!response) {
            throw new Error(
                "Groq no devolvió contenido."
            );
        }

        // --------------------------------------------------
        // LIMPIAR RESPUESTA
        // --------------------------------------------------

        const cleanResponse =
            response
                .replace(/\*\*/g, "")
                .replace(/\*/g, "")
                .trim();

        // --------------------------------------------------
        // LOGS
        // --------------------------------------------------

        console.log(
            "🤖 Sasha respondió"
        );

        console.log(
            "🧠 Modelo:",
            MODEL
        );

        console.log(
            "👤 Sobre Jorge:",
            aboutJorge
                ? "Sí"
                : "No"
        );

        console.log(
            "📊 Prompt:",
            promptTokens
        );

        console.log(
            "⬅️ Completion:",
            completionTokens
        );

        console.log(
            "🔢 Total:",
            totalTokens
        );

        console.log(
            "💰 Costo: $",
            estimatedCost.toFixed(6)
        );

        // --------------------------------------------------
        // RESPUESTA
        // --------------------------------------------------

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
        // --------------------------------------------------
        // ERROR
        // --------------------------------------------------

        console.error(
            "❌ ERROR GROQ:",
            error
        );

        // --------------------------------------------------
        // RATE LIMIT
        // --------------------------------------------------

        if (
            error?.status === 429
        ) {
            return res.status(429).json({
                error:
                    "Sasha está recibiendo muchas solicitudes. Inténtalo nuevamente en unos segundos.",
            });
        }

        // --------------------------------------------------
        // API KEY
        // --------------------------------------------------

        if (
            error?.status === 401
        ) {
            return res.status(500).json({
                error:
                    "Error de configuración del servicio de inteligencia artificial.",
            });
        }

        // --------------------------------------------------
        // ERROR GENERAL
        // --------------------------------------------------

        return res.status(500).json({
            error:
                "No fue posible obtener una respuesta de Sasha. Inténtalo nuevamente.",
        });
    }
};
