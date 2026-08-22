import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

export const sendMessage = async (req, res) => {

    try {

        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                error: "El mensaje es obligatorio"
            });
        }

        const response = await ai.models.generateContent({
         model: "gemini-3.6-flash",
            contents: message
        });

        res.json({
            response: response.text
        });

    } catch (error) {

        console.error("ERROR COMPLETO:");
        console.error(error);

        res.status(500).json({
            error: error.message
        });
    }
};