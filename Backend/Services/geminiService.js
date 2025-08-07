// // Backend/Services/geminiService.js
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import dotenv from "dotenv";

// dotenv.config(); // Load environment variables from .env file

// const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// if (!GEMINI_API_KEY) {
//     console.error("ERROR: GEMINI_API_KEY is not set in backend environment variables. Gemini AI responses will be unavailable.");
//     // Exit process or throw error if Gemini is critical and key is missing
// }

// const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;
// // You can use 'gemini-pro' for text-only interactions.
// // If you need multimodal capabilities (image + text), you might use 'gemini-pro-vision'.
// const model = genAI ? genAI.getGenerativeModel({ model: "gemini-2.0-flash" }) : null;

// /**
//  * Generates an AI response using the Gemini model.
//  * @param {string} promptText The main content/query for Gemini.
//  * @param {string} [format=""] Optional: Desired format for the response (e.g., "in 10 bullet points").
//  * @returns {Promise<string>} The AI's generated response.
//  */
// export async function getGeminiResponse(promptText, format = "") {
//     if (!model) {
//         console.error("[GeminiService] Gemini model not initialized due to missing API Key.");
//         return "🤖 I'm sorry, my AI brain is not configured. Please ensure GEMINI_API_KEY is set up correctly in the backend.";
//     }

    
    
 

//     // Add a system-like instruction to guide Gemini's behavior
//     const systemInstruction = `You are a special AI assistant designed to answer questions and suggestions only related to YouTube videos and audio content (their transcriptions). Your answers must always be in the context of the video/audio content provided. If a question is not directly related to video or audio content, please politely state that you focus only on that type of information.`;

//     let fullPrompt = `${systemInstruction}\n\nUser asked: ${promptText}`;

//     if (format) {
//         fullPrompt += `\n\nResponse Format Request:** Please provide the response ${format}.`;
//     } else {
//         fullPrompt += `\n\nPlease provide a concise and helpful response.`;
//     }
//     console.log(`[GeminiService] Sending prompt to Gemini: "${fullPrompt.substring(0, 200)}..."`); // Log first 200 chars
//     try {
//         const result = await model.generateContent(fullPrompt);
//         const response = await result.response;
//         const text = response.text();
//         console.log(`[GeminiService] Received response from Gemini.`);
//         return text;
//     } catch (error) {
//         console.error("[GeminiService] Error calling Gemini API:", error);
//         if (error.response && error.response.data) {
//             console.error("Gemini API Error Response Data:", error.response.data);
//             console.error("Gemini API Error Status:", error.response.status);
//         }
//         if (error.response && error.response.data) {
//             console.error("Gemini API Error Response Data:", error.response.data); // This is critical
//             console.error("Gemini API Error Status:", error.response.status);     // This is critical
//             console.error("[GeminiService] Error calling Gemini API:", error);
//         return "🤖 I apologize, I encountered an error trying to generate a response from Gemini. Please try again or rephrase your query.";
// }
//     }
// }




// Backend/Services/geminiService.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    console.error("ERROR: GEMINI_API_KEY is not set in backend environment variables. Gemini AI responses will be unavailable.");
}

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;
const model = genAI ? genAI.getGenerativeModel({ model: "gemini-2.0-flash" }) : null; // या "gemini-1.5-flash" / "gemini-1.5-pro"

/**
 * Generates an AI response using the Gemini model.
 * @param {string} promptText The main content/query for Gemini.
 * @param {string} [format=""] Optional: Desired format for the response (e.g., "in 10 bullet points").
 * @returns {Promise<string>} The AI's generated response.
 */
export async function getGeminiResponse(promptText, format = "") {
    if (!model) {
        console.error("[GeminiService] Gemini model not initialized due to missing API Key.");
        return "🤖 I'm sorry, my AI brain is not configured. Please ensure GEMINI_API_KEY is set up correctly in the backend.";
    }

    const systemInstruction = `You are a special AI assistant designed to answer questions and suggestions only related to YouTube videos and audio content (their transcriptions). Your answers must always be in the context of the video/audio content provided. If a question is not directly related to video or audio content, please politely state that you focus only on that type of information.`;

    let fullPrompt = `${systemInstruction}\n\nUser asked: ${promptText}`;

    if (format) {
        fullPrompt += `\n\nResponse Format Request:** Please provide the response ${format}.`;
    } else {
        fullPrompt += `\n\nPlease provide a concise and helpful response.`;
    }
    console.log(`[GeminiService] Sending prompt to Gemini: "${fullPrompt.substring(0, 200)}..."`);
    try {
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();
        console.log(`[GeminiService] Received response from Gemini.`);
        return text;
    } catch (error) {
        console.error("[GeminiService] Error calling Gemini API:", error);
        if (error.response && error.response.data) {
            console.error("Gemini API Error Response Data:", error.response.data);
            console.error("Gemini API Error Status:", error.response.status);
        }
        // Removed the duplicate and malformed if(error.response && error.response.data) block here.
        return "🤖 I apologize, I encountered an error trying to generate a response from Gemini. Please try again or rephrase your query.";
    }
}