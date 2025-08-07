// import express from "express";
// import multer from "multer";
// import axios from "axios";
// // import fs from "fs/promises";
// const router = express.Router();

// const upload = multer();
// const ASSEMBLYAI_API_KEY = "16bc706f8b57421f9abe1086e8af4bd8"; // Your actual API key
// const BASE_URL = "https://api.assemblyai.com";

// router.post("/api/dashboard/Chat", upload.single("audio"), async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ error: "No audio file provided." });
//   }
//   console.log("API Key:", ASSEMBLYAI_API_KEY);

//   try {
//     console.log(`[Backend] Audio file received: ${req.file.originalname}, ${req.file.size} bytes`);

//     // Step 1: Upload the audio file
//     const uploadRes = await axios.post(`${BASE_URL}/v2/upload`, req.file.buffer, {
//       headers: {
//         authorization: ASSEMBLYAI_API_KEY,
//         "Content-Type": "application/octet-stream",
//       },
//     });

//     const audioUrl = uploadRes.data.upload_url;
//     // const audioUrl = '/public/songs.mp3'
//     console.log(`[Backend] Uploaded to AssemblyAI: ${audioUrl}`);

//     // Step 2: Start transcription
//     const transcriptRes = await axios.post(`${BASE_URL}/v2/transcript`, {
//       audio_url: audioUrl,
//       speech_model: "universal",
//       punctuate: true,
//       format_text: true,
//     }, {
//       headers: {
//         authorization: ASSEMBLYAI_API_KEY,
//         "Content-Type": "application/json",
//       },
//     });

//     const transcriptId = transcriptRes.data.id;
//     console.log(`[Backend] Transcription job started: ${transcriptId}`);

//     // Step 3: Poll until transcription completes
//     let transcript;
//     while (true) {
//       const pollingRes = await axios.get(`${BASE_URL}/v2/transcript/${transcriptId}`, {
//         headers: { authorization: ASSEMBLYAI_API_KEY },
//       });

//       if (pollingRes.data.status === "completed") {
//         transcript = pollingRes.data.text;
//         break;
//       } else if (pollingRes.data.status === "error") {
//         return res.status(500).json({ error: "Transcription failed", details: pollingRes.data });
//       }

//       console.log("Waiting for transcription...");
//       await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait 3 seconds
//     }

//     // Step 4: Return transcript with your answer_format
//     const answer_format = {
//       question: "What is said in the audio?",
//       answer: transcript,
//     };

//     return res.status(200).json(answer_format);

//   } catch (error) {
//     console.error("[Backend] Transcription Error:", error.message);
//     return res.status(500).json({ error: "Something went wrong", details: error.message });
//   }
// });

// export default router;



// Backend/Services/geminiService.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // Your Gemini API Key

if (!GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY is not set. Gemini AI responses will be unavailable.");
}

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;
const model = genAI ? genAI.getGenerativeModel({ model: "gemini-2.5-pro" }) : null; // Use gemini-pro for text tasks

/**
 * Generates an AI response using the Gemini model.
 * @param {string} promptText The user's query or transcribed audio text.
 * @param {string} [format=""] Optional: Desired format for the response (e.g., "in 10 bullet points").
 * @returns {Promise<string>} The AI's generated response.
 */
export async function getGeminiResponse(promptText, format = "") {
    if (!model) {
        return "🤖 I'm sorry, my AI brain is not configured. Please set model.";
    } 

    let fullPrompt = promptText;
    if (format) {
        fullPrompt += `\n\nPlease provide the response ${format}.`;
    }

    try {
        console.log(`[GeminiService] Sending prompt to Gemini: "${fullPrompt}"`);
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();
        console.log(`[GeminiService] Received response from Gemini.`);
        return text;
    } catch (error) {
        console.error("[GeminiService] Error calling Gemini API:", error);
        // More detailed error logging for Gemini API errors
        if (error.response && error.response.data) {
            console.error("Gemini API Error Response:", error.response.data);
        }
        return "🤖 I apologize, I encountered an error trying to generate a response from Gemini. Please try again or rephrase your query.";
    }
}