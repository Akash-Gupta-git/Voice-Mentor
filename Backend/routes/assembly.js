// // // // Backend/Routes/assembly.js
// // // // -----------------------
// // // import express from "express";
// // // import multer from "multer";
// // // import axios from "axios";
// // // import dotenv from "dotenv";
// // // // fs is not needed if multer stores in memory or if you're not saving to disk first
// // // // import fs from "fs"; // Not needed with memoryStorage

// // // dotenv.config();

// // // const router = express.Router();

// // // // Using multer.memoryStorage() means the file data is available in req.file.buffer
// // // const upload = multer({ storage: multer.memoryStorage() });

// // // const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY; // Use environment variable!

// // // // Basic health check route
// // // router.get("/", (req, res) => {
// // //     console.log("Request received on / route.");
// // //     res.status(200).send("Chat Backend with AI integration is running!");
// // // });

// // // // Endpoint for handling both audio uploads (for transcription) and text messages (for LLM)
// // // // Using upload.single("audio") means it expects a field named 'audio' in multipart/form-data
// // // router.post("/api/dashboard/chat", upload.single("audio"), async (req, res) => {
// // //     const { message, answer_format } = req.body;
// // //     const audioFileBuffer = req.file ? req.file.buffer : null;

// // //     console.log(`[Backend] Received request. Audio present: ${!!audioFileBuffer}`);
// // //     console.log(`[Backend] Message present: ${!!message}`);
// // //     console.log(`[Backend] Answer Format: ${answer_format}`);

// // //     if (!ASSEMBLYAI_API_KEY) {
// // //         return res.status(500).json({
// // //             error: "ASSEMBLYAI_API_KEY is not set in backend environment variables. Cannot process request.",
// // //         });
// // //     }

// // //     try {
// // //         let transcribedText = "";

// // //         // --- Handle Audio Transcription if file is present ---
// // //         if (audioFileBuffer) {
// // //             console.log(`[Backend] Processing audio file: ${req.file.originalname}, ${req.file.size} bytes`);

// // //             // Step 1: Upload audio to AssemblyAI
// // //             const uploadRes = await axios.post("https://api.assemblyai.com/v2/upload", audioFileBuffer, {
// // //                 headers: {
// // //                     authorization: ASSEMBLYAI_API_KEY,
// // //                     "Content-Type": "application/octet-stream",
// // //                 },
// // //             });

// // //             const audioUrl = uploadRes.data.upload_url;
// // //             console.log(`[Backend] Audio uploaded to AssemblyAI: ${audioUrl}`);

// // //             // Step 2: Start transcription
// // //             const transcriptRes = await axios.post("https://api.assemblyai.com/v2/transcript", {
// // //                 audio_url: audioUrl,
// // //                 punctuate: true,
// // //                 format_text: true,
// // //                 // Add language_code if you expect non-English audio, e.g., "hi" for Hindi
// // //                 // language_code: "en_us" // Default is en_us
// // //             }, {
// // //                 headers: {
// // //                     authorization: ASSEMBLYAI_API_KEY,
// // //                     "Content-Type": "application/json",
// // //                 },
// // //             });

// // //             const transcriptId = transcriptRes.data.id;
// // //             console.log(`[Backend] Transcription started: ID = ${transcriptId}`);

// // //             // Step 3: Poll for transcription result
// // //             let pollStatus = "";
// // //             for (let i = 0; i < 60; i++) { // Increased polling attempts/time for potentially longer audio
// // //                 await new Promise(r => setTimeout(r, 1000)); // Poll every 1 second
// // //                 const pollRes = await axios.get(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
// // //                     headers: { authorization: ASSEMBLYAI_API_KEY },
// // //                 });

// // //                 pollStatus = pollRes.data.status;
// // //                 if (pollStatus === "completed") {
// // //                     transcribedText = pollRes.data.text;
// // //                     console.log("[Backend] Transcription completed successfully.");
// // //                     break;
// // //                 } else if (pollStatus === "error") {
// // //                     console.error("[Backend] AssemblyAI Transcription Error:", pollRes.data.error);
// // //                     throw new Error(`AssemblyAI Transcription failed: ${pollRes.data.error}`);
// // //                 }
// // //                 console.log(`[Backend] Polling... Current status: ${pollStatus}`);
// // //             }

// // //             if (!transcribedText) {
// // //                 console.error("[Backend] Transcription timed out or did not complete.");
// // //                 return res.status(504).json({ error: "Transcription timed out or did not complete." });
// // //             }

// // //             // At this point, `transcribedText` contains the text from the audio.
// // //             // You can now use this text as the 'message' for your LLM.
// // //             console.log(`[Backend] Transcribed Text: "${transcribedText}"`);

// // //             // If you only send audio, you might just return the transcription
// // //             // Or you can proceed to send this transcribedText to the LLM
// // //             // For now, let's assume `transcribedText` becomes the primary input for the LLM
// // //             // if we received an audio file.
// // //         }

// // //         // --- Determine the actual message for LLM ---
// // //         // If audio was transcribed, use that. Otherwise, use the text message from req.body.
// // //         const finalMessageForLLM = transcribedText || message;

// // //         if (!finalMessageForLLM || typeof finalMessageForLLM !== "string" || finalMessageForLLM.trim() === "") {
// // //             return res.status(400).json({ error: "No valid message or audio provided for AI processing." });
// // //         }

// // //         console.log(`[Backend - Final LLM Input] Processing message: "${finalMessageForLLM}"`);

// // //         // --- LLM Integration (Replace with actual LLM API call) ---
// // //         // This is where you would integrate with your actual Large Language Model (LLM)
// // //         // API (e.g., Google's Gemini API, OpenAI GPT, etc.).
// // //         // You would send `finalMessageForLLM` and `answer_format` to your LLM.
// // //         let aiResponseText;

// // //         // Example: Simulated LLM response
// // //         if (finalMessageForLLM.toLowerCase().includes("hello") || finalMessageForLLM.toLowerCase().includes("hi")) {
// // //             aiResponseText = "Hello there! How can I assist you today?";
// // //         } else if (finalMessageForLLM.toLowerCase().includes("how are you")) {
// // //             aiResponseText = "As an AI, I don't have feelings, but I'm ready to help!";
// // //         } else if (finalMessageForLLM.toLowerCase().includes("what can you do")) {
// // //             aiResponseText = "I can answer questions, generate text, translate languages, and much more! Try asking me something.";
// // //         } else if (finalMessageForLLM.toLowerCase().includes("your name")) {
// // //             aiResponseText = "I am a large language model, trained by Google.";
// // //         } else {
// // //             aiResponseText = `I've received your query based on "${finalMessageForLLM}". I'm processing that... (This is a simulated AI response).\n\nYour requested format: "${answer_format}"`;
// // //         }

// // //         // --- Send Response to Frontend ---
// // //         console.log("[Backend] Sending AI response:", aiResponseText);
// // //         res.json({
// // //             userMessage: finalMessageForLLM, // Send back what the AI processed (transcribed text or typed message)
// // //             aiResponse: aiResponseText, // The AI's reply
// // //             transcribedAudio: transcribedText // Only present if audio was sent and transcribed
// // //         });

// // //     } catch (error) {
// // //         console.error("Backend Error:", error.message || error);
// // //         if (error.response) {
// // //             // Log full AssemblyAI API error response for debugging
// // //             console.error("AssemblyAI API Error Response Data:", error.response.data);
// // //             console.error("AssemblyAI API Error Status:", error.response.status);
// // //             return res.status(error.response.status).json({
// // //                 error: `AssemblyAI API Error: ${error.response.data.error || error.message}`,
// // //             });
// // //         }
// // //         res.status(500).json({ error: "Internal server error during processing: " + error.message });
// // //     }
// // // });

// // // export default router;







// // // Backend/Routes/chatRoutes.js
// // import express from "express";
// // import multer from "multer";
// // import axios from "axios";
// // import dotenv from "dotenv";
// // // import { getGeminiResponse } from "../Services/geminiService.js"; // Import Gemini service
// // import { getGeminiResponse } from "./gemini.js"

// // dotenv.config();

// // const router = express.Router();

// // const upload = multer({ storage: multer.memoryStorage() });

// // const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY;

// // // Regex to detect YouTube URLs
// // const YOUTUBE_URL_REGEX = /(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|)([\w-]{11})(?:\S+)?/i;

// // // Basic health check route
// // router.get("/", (req, res) => {
// //     console.log("Request received on / route.");
// //     res.status(200).send("Chat Backend with AI integration is running!");
// // });

// // router.post("/api/dashboard/chat", upload.single("audio"), async (req, res) => {
// //     const { message, text_prompt: additional_text_prompt, answer_format } = req.body;
// //     const audioFileBuffer = req.file ? req.file.buffer : null;

// //     console.log(`[Backend] Received request. Audio present: ${!!audioFileBuffer}`);
// //     console.log(`[Backend] Message: "${message}"`);
// //     console.log(`[Backend] Additional Text Prompt: "${additional_text_prompt}"`);
// //     console.log(`[Backend] Answer Format: "${answer_format}"`);

// //     // Prioritize AssemblyAI API Key check if audio is involved
// //     if (audioFileBuffer && !ASSEMBLYAI_API_KEY) {
// //         return res.status(500).json({
// //             error: "ASSEMBLYAI_API_KEY is not set in backend environment variables. Cannot process audio.",
// //         });
// //     }

// //     try {
// //         let transcribedText = "";
// //         let youtubeVideoId = null;
// //         let finalPromptForLLM = "";
// //         let userInitialMessage = message || ""; // The original text message from the user

// //         // --- Step 1: Handle Audio Transcription (if audio buffer is present) ---
// //         if (audioFileBuffer) {
// //             console.log(`[Backend] Processing audio file: ${req.file.originalname}, ${req.file.size} bytes`);

// //             const uploadRes = await axios.post("https://api.assemblyai.com/v2/upload", audioFileBuffer, {
// //                 headers: {
// //                     authorization: ASSEMBLYAI_API_KEY,
// //                     "Content-Type": "application/octet-stream",
// //                 },
// //             });
// //             const audioUrl = uploadRes.data.upload_url;
// //             console.log(`[Backend] Audio uploaded to AssemblyAI: ${audioUrl}`);

// //             const transcriptRes = await axios.post("https://api.assemblyai.com/v2/transcript", {
// //                 audio_url: audioUrl,
// //                 punctuate: true,
// //                 format_text: true,
// //             }, {
// //                 headers: { authorization: ASSEMBLYAI_API_KEY, "Content-Type": "application/json" },
// //             });
// //             const transcriptId = transcriptRes.data.id;
// //             console.log(`[Backend] Transcription started: ID = ${transcriptId}`);

// //             let pollStatus = "";
// //             for (let i = 0; i < 60; i++) { // Poll every 1 second, max 60 times (1 minute)
// //                 await new Promise(r => setTimeout(r, 1000));
// //                 const pollRes = await axios.get(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
// //                     headers: { authorization: ASSEMBLYAI_API_KEY },
// //                 });
// //                 pollStatus = pollRes.data.status;
// //                 if (pollStatus === "completed") {
// //                     transcribedText = pollRes.data.text;
// //                     console.log("[Backend] Transcription completed successfully.");
// //                     break;
// //                 } else if (pollStatus === "error") {
// //                     console.error("[Backend] AssemblyAI Transcription Error:", pollRes.data.error);
// //                     throw new Error(`AssemblyAI Transcription failed: ${pollRes.data.error}`);
// //                 }
// //                 console.log(`[Backend] Polling... Current status: ${pollStatus}`);
// //             }

// //             if (!transcribedText) {
// //                 console.error("[Backend] Transcription timed out or did not complete.");
// //                 return res.status(504).json({ error: "Transcription timed out or did not complete." });
// //             }

// //             // If an additional text prompt was sent with the audio, prepend it to the transcribed text
// //             finalPromptForLLM = additional_text_prompt ? `${additional_text_prompt} ${transcribedText}` : transcribedText;
// //             console.log(`[Backend] Transcribed Text: "${transcribedText}"`);
// //         } else {
// //             // If no audio buffer, the primary input is the 'message' field from the frontend
// //             finalPromptForLLM = message;
// //         }

// //         // --- Step 2: Handle YouTube Video Links (if present in message or transcribed text) ---
// //         const combinedTextInput = finalPromptForLLM; // This is what the user *said* or *typed*
// //         const youtubeMatch = combinedTextInput.match(YOUTUBE_URL_REGEX);

// //         if (youtubeMatch) {
// //             youtubeVideoId = youtubeMatch[1]; // Extract video ID
// //             console.log(`[Backend] Detected YouTube URL with ID: ${youtubeVideoId}`);

// //             // You need to fetch the YouTube video transcript here.
// //             // This is a complex step. A robust approach:
// //             // 1. Use a library like 'ytdl-core' or 'youtube-dl-exec' to download video audio.
// //             // 2. Save the audio temporarily to a file (e.g., using 'fs').
// //             // 3. Upload that temporary file to AssemblyAI for transcription (similar to how you handle audioFileBuffer).
// //             // 4. Delete the temporary file.
// //             //
// //             // For now, let's simulate this or assume a direct AssemblyAI URL transcription might work if the URL is publicly accessible:

// //             let youtubeTranscript = "";
// //             try {
// //                 // IMPORTANT: This part assumes AssemblyAI can directly process the YouTube URL if it points to an accessible audio stream.
// //                 // In most real-world scenarios, you'd need to download the audio from YouTube first.
// //                 // For a proper solution, consider integrating 'ytdl-core' to get the audio stream and then pipe it to AssemblyAI.
// //                 // Example using a placeholder for the URL if direct AssemblyAI processing isn't working:
// //                 // const youtubeAudioStreamUrl = `https://www.youtube.com/watch?v=${youtubeVideoId}`; // This is the video URL, not a direct audio stream
// //                 // You would need a method to get the *direct audio stream URL* if AssemblyAI doesn't accept video page URLs directly.

// //                 // A simplified demonstration using a *hypothetical* direct transcription of a YouTube video by URL (often not directly supported by AAI for video *pages*):
// //                 // To do this robustly, you'd download the audio and then upload the audio file to AAI.
// //                 // Let's assume for this demo that we're passing the video URL to AssemblyAI, and if that fails, we inform the user.
// //                 // A better approach for YT is outlined in AssemblyAI's docs with yt-dlp: Download audio -> Upload audio to AAI.

// //                 // For the purpose of getting a functional example, let's *simulate* a transcript fetch
// //                 // or just append a note that the backend received a YouTube link.
// //                 // **Real Implementation would go here:**
// //                 // const youtubeAudioDownloadUrl = await getYouTubeAudioStreamUrl(youtubeVideoId); // Custom function using ytdl-core
// //                 // const youtubeUploadRes = await axios.post("https://api.assemblyai.com/v2/upload", { audio_url: youtubeAudioDownloadUrl }, { headers: ... });
// //                 // const youtubeTranscriptId = youtubeUploadRes.data.id;
// //                 // // ... poll for transcript ...
// //                 // youtubeTranscript = "Actual transcript from YouTube video would go here.";

// //                 // For now, we'll just indicate we received a YouTube link
// //                 youtubeTranscript = `(Transcript of YouTube video ID: ${youtubeVideoId} would be generated here.)`;
// //                 console.log(`[Backend] Placeholder for YouTube Transcript: ${youtubeTranscript}`);

// //             } catch (ytError) {
// //                 console.error("[Backend] Error fetching YouTube transcript:", ytError.message);
// //                 youtubeTranscript = `(Could not retrieve transcript for YouTube video: ${ytError.message})`;
// //             }

// //             // Combine the original prompt (if any) with the YouTube transcript
// //             finalPromptForLLM = `${finalPromptForLLM}\n\nVideo Content: ${youtubeTranscript}`;
// //             userInitialMessage = `Asked about YouTube video: ${youtubeMatch[0]}`; // Update user message for display
// //         }


// //         // --- Step 3: Send to LLM (Gemini) ---
// //         if (!finalPromptForLLM || finalPromptForLLM.trim() === "") {
// //             return res.status(400).json({ error: "No valid message or audio/video content provided for AI processing." });
// //         }

// //         console.log(`[Backend - Final LLM Input] Processing message: "${finalPromptForLLM}" with format: "${answer_format}"`);

// //         const aiResponseText = await getGeminiResponse(finalPromptForLLM, answer_format);

// //         // --- Step 4: Send Response to Frontend ---
// //         console.log("[Backend] Sending AI response.");
// //         res.json({
// //             userMessage: userInitialMessage, // What the user initially sent (text, or placeholder for audio/video)
// //             aiResponse: aiResponseText, // The AI's reply
// //             transcribedAudio: transcribedText // Only present if audio was sent and transcribed by AssemblyAI
// //         });

// //     } catch (error) {
// //         console.error("Backend Error:", error.message || error);
// //         // More specific error logging for AssemblyAI or other external APIs
// //         if (error.response) {
// //             console.error("External API Error Response Data:", error.response.data);
// //             console.error("External API Error Status:", error.response.status);
// //             return res.status(error.response.status).json({
// //                 error: `External API Error: ${error.response.data.error || error.message}`,
// //             });
// //         }
// //         res.status(500).json({ error: "Internal server error during processing: " + error.message });
// //     }
// // });

// // export default router;


// // Backend/Routes/chatRoutes.js
// import express from "express";
// import multer from "multer";
// import axios from "axios";
// import dotenv from "dotenv";
// import { getGeminiResponse } from "../Services/geminiService.js"; // Import Gemini service
// import { getYouTubeAudioTranscript } from "../Services/youtubeService.js"; // Import YouTube service

// dotenv.config(); // Load environment variables from .env file

// const router = express.Router();

// // Using multer.memoryStorage() means the file data is available in req.file.buffer
// const upload = multer({ storage: multer.memoryStorage() });

// const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY;

// // Regex to detect YouTube URLs
// const YOUTUBE_URL_REGEX = /(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|)([\w-]{11})(?:\S+)?/i;

// // Regex to detect common audio/video file extensions in a URL
// // This regex is basic and assumes the URL directly points to a file.
// const GENERIC_AUDIO_VIDEO_URL_REGEX = /(https?:\/\/\S+\.(?:mp3|wav|m4a|aac|flac|ogg|webm|mp4|mov|avi|mkv|flv|wmv))(?:\S+)?/i;

// // Basic health check route
// router.get("/", (req, res) => {
//     console.log("Request received on / route.");
//     res.status(200).send("Chat Backend with AI integration is running!");
// });

// // Endpoint for handling both audio uploads (for transcription) and text messages (for LLM)
// router.post("/api/dashboard/chat", upload.single("audio"), async (req, res) => {
//     const { message, text_prompt: additional_text_prompt, answer_format } = req.body;
//     const audioFileBuffer = req.file ? req.file.buffer : null;

//     console.log(`[Backend] Received request. Audio present: ${!!audioFileBuffer}`);
//     console.log(`[Backend] Message (from text input): "${message}"`);
//     console.log(`[Backend] Additional Text Prompt (from combined input with media): "${additional_text_prompt}"`);
//     console.log(`[Backend] Answer Format: "${answer_format}"`);

//     // Prioritize API Key checks based on usage
//    if ((audioFileBuffer || message?.match(YOUTUBE_URL_REGEX) || message?.match(GENERIC_AUDIO_VIDEO_URL_REGEX)) && !ASSEMBLYAI_API_KEY) {
//         return res.status(500).json({
//             error: "ASSEMBLYAI_API_KEY is not set in backend environment variables. Cannot process audio/video links.",
//         });
//     }

//     try {
//         let transcribedAudioText = ""; // Text from direct audio upload (microphone or file)
//         let youtubeTranscriptText = ""; // Text from YouTube video transcription
//         let finalPromptForLLM = ""; // The ultimate prompt sent to Gemini
//         let userInitialMessageForFrontend = message || ""; // What frontend displays as user's input

//         // --- Step 1: Handle Audio Transcription (if audio buffer is present) ---
//         if (audioFileBuffer) {
//             console.log(`[Backend] Processing audio file: ${req.file.originalname}, ${req.file.size} bytes`);
//             const uploadRes = await axios.post("https://api.assemblyai.com/v2/upload", audioFileBuffer, {
//                 headers: {
//                     authorization: ASSEMBLYAI_API_KEY,
//                     "Content-Type": "application/octet-stream",
//                 },
//             });
//             const audioUrl = uploadRes.data.upload_url;
//             console.log(`[Backend] Audio uploaded to AssemblyAI: ${audioUrl}`);

//             const transcriptRes = await axios.post("https://api.assemblyai.com/v2/transcript", {
//                 audio_url: audioUrl,
//                 punctuate: true,
//                 format_text: true,
//             }, {
//                 headers: { authorization: ASSEMBLYAI_API_KEY, "Content-Type": "application/json" },
//             });
//             const transcriptId = transcriptRes.data.id;
//             console.log(`[Backend] Transcription started: ID = ${transcriptId}`);

//             let pollStatus = "";
//             for (let i = 0; i < 90; i++) { // Increased polling attempts/time for potentially longer audio (1.5 mins)
//                 await new Promise(r => setTimeout(r, 1000)); // Poll every 1 second
//                 const pollRes = await axios.get(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
//                     headers: { authorization: ASSEMBLYAI_API_KEY },
//                 });
//                 pollStatus = pollRes.data.status;
//                 if (pollStatus === "completed") {
//                     transcribedAudioText = pollRes.data.text;
//                     console.log("[Backend] Transcription completed successfully.");
//                     break;
//                 } else if (pollStatus === "error") {
//                     console.error("[Backend] AssemblyAI Transcription Error:", pollRes.data.error);
//                     throw new Error(`AssemblyAI Transcription failed: ${pollRes.data.error.message || 'unknown error'}`);
//                 }
//                 console.log(`[Backend] Polling... Current status: ${pollStatus}`);
//             }

//             if (!transcribedAudioText) {
//                 console.error("[Backend] Transcription timed out or did not complete.");
//                 return res.status(504).json({ error: "Audio transcription timed out or did not complete." });
//             }
//             console.log(`[Backend] Transcribed Direct Audio: "${transcribedAudioText}"`);
//             userInitialMessageForFrontend = `🎤 Voice message`;
//             if (additional_text_prompt) {
//                 userInitialMessageForFrontend += `: "${additional_text_prompt}"`;
//             }
//         }
       

//         // --- Step 2: Determine the core user query ---
//         let mainUserQuery = "";
//         if (transcribedAudioText) {
//             // If audio was transcribed, its text combined with any additional typed text is the main query
//             mainUserQuery = additional_text_prompt ? `${additional_text_prompt} ${transcribedAudioText}` : transcribedAudioText;
//             userInitialMessageForFrontend = `🎤 Voice message`; // Frontend already shows transcribed text or file name for audio
//             if (additional_text_prompt) {
//                 userInitialMessageForFrontend += `: "${additional_text_prompt}"`;
//             }

//         } else {
//             // If no audio, the 'message' field is the main query
//             mainUserQuery = message || "";
//             userInitialMessageForFrontend = message;
//         }

//         // --- Step 3: Handle YouTube Video Links (if present in the main query) ---
//         const youtubeMatch = mainUserQuery.match(YOUTUBE_URL_REGEX);

//         if (!audioFileBuffer) {
//         const youtubeMatch = message?.match(YOUTUBE_URL_REGEX);
//         const genericUrlMatch = message?.match(GENERIC_AUDIO_VIDEO_URL_REGEX);
//         let urlToTranscribe = null;

//         if (youtubeMatch) {
//                 urlToTranscribe = youtubeMatch[0]; // Full YouTube URL
//                 console.log(`[Backend] Detected YouTube URL: ${urlToTranscribe}`);
//                 userInitialMessageForFrontend = `Regarding YouTube video: ${urlToTranscribe}`;
//                 if (additional_text_prompt) {
//                     userInitialMessageForFrontend += ` (Query: ${additional_text_prompt})`;
//                 }

//                  try {
//                     transcribedAudioText = await getYouTubeAudioTranscript(urlToTranscribe, ASSEMBLYAI_API_KEY);
//                     console.log(`[Backend] YouTube Transcribed Text successfully retrieved.`);
//                 } catch (ytError) {
//                     console.error("[Backend] Error fetching YouTube transcript:", ytError.message);
//                     transcribedAudioText = `(Could not retrieve transcript for YouTube video: ${ytError.message}. Please ensure the video is publicly accessible and not geo-restricted.)`;
//                     // Even if transcription fails, we send this error message to LLM for response
//                 }
//             } else if (genericUrlMatch) {
//                 urlToTranscribe = genericUrlMatch[0]; // Full Generic URL
//                 console.log(`[Backend] Detected Generic Audio/Video URL: ${urlToTranscribe}`);
//                 userInitialMessageForFrontend = `Regarding external media: ${urlToTranscribe}`;
//                  if (additional_text_prompt) {
//                     userInitialMessageForFrontend += ` (Query: ${additional_text_prompt})`;
//                 }
//                 try {
//                     // For generic URLs, AssemblyAI can often directly transcribe publicly accessible links
//                     const transcriptRes = await axios.post("https://api.assemblyai.com/v2/transcript", {
//                         audio_url: urlToTranscribe, // Send the URL directly
//                         punctuate: true,
//                         format_text: true,
//                     }, {
//                         headers: { authorization: ASSEMBLYAI_API_KEY, "Content-Type": "application/json" },
//                     });
//                     const transcriptId = transcriptRes.data.id;
//                     console.log(`[Backend] Generic URL transcription started: ID = ${transcriptId}`);

//                     let pollStatus = "";
//                     for (let i = 0; i < 90; i++) { // Poll every 1 second, max 90 times
//                         await new Promise(r => setTimeout(r, 1000));
//                         const pollRes = await axios.get(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
//                             headers: { authorization: ASSEMBLYAI_API_KEY },
//                         });
//                         pollStatus = pollRes.data.status;
//                         if (pollStatus === "completed") {
//                             transcribedAudioText = pollRes.data.text;
//                             console.log("[Backend] Generic URL transcription completed successfully.");
//                             break;
//                         } else if (pollStatus === "error") {
//                             console.error("[Backend] AssemblyAI Transcription Error (Generic URL):", pollRes.data.error);
//                             throw new Error(`AssemblyAI Transcription failed (Generic URL): ${pollRes.data.error.message || 'unknown error'}`);
//                         }
//                         console.log(`[Backend] Polling generic URL... Current status: ${pollStatus}`);
//                     }

//                     if (!transcribedAudioText) {
//                         throw new Error("Generic URL transcription timed out or did not complete.");
//                     }
//                 } catch (urlTranscribeError) {
//                     console.error("[Backend] Error transcribing generic URL:", urlTranscribeError.message);
//                     transcribedAudioText = `(Could not retrieve transcript for URL: ${urlTranscribeError.message}. Please ensure it's a direct link to an audio/video file and publicly accessible.)`;
//                 }
//             }
//         }
        
//         let rawUserTextInput = message || ""; // Original text message if no direct audio upload
//         if (additional_text_prompt) {
//             rawUserTextInput = additional_text_prompt; // If text_prompt was sent with media, this is the main text input
//         }

//         if (youtubeMatch) {
//             const youtubeUrl = youtubeMatch[0]; // Full matched URL
//             const youtubeVideoId = youtubeMatch[1]; // Extracted video ID
//             console.log(`[Backend] Detected YouTube URL: ${youtubeUrl}, ID: ${youtubeVideoId}`);

//             try {
//                 youtubeTranscriptText = await getYouTubeAudioTranscript(youtubeUrl, ASSEMBLYAI_API_KEY);
//                 console.log(`[Backend] YouTube Transcribed Text successfully retrieved.`);
//             } catch (ytError) {
//                 console.error("[Backend] Error fetching YouTube transcript:", ytError.message);
//                 youtubeTranscriptText = `(Could not retrieve transcript for YouTube video: ${ytError.message}. Please ensure the video is publicly accessible and not geo-restricted.)`;
//                 // If transcription fails, we still want to send something to LLM, perhaps with an error message in the transcript.
//             }

//             // Construct the final prompt for LLM including YouTube content
//             finalPromptForLLM = `User's request: "${mainUserQuery}".\n\nYouTube Video Content:\n${youtubeTranscriptText}`;
//             // Update the message displayed to the user in the frontend to reflect the YouTube processing
//             userInitialMessageForFrontend = `Regarding YouTube video: ${youtubeUrl}`;
//             if (additional_text_prompt) {
//                 userInitialMessageForFrontend += ` (Query: ${additional_text_prompt})`;
//             } else if (transcribedAudioText) {
//                  userInitialMessageForFrontend += ` (from voice message)`;
//             }
//         } else {
//             // If no YouTube link, the main query is the final prompt
//             finalPromptForLLM = mainUserQuery;
//         }

//          // Final check before sending to LLM
//         if (!finalPromptForLLM || finalPromptForLLM.trim() === "") {
//             return res.status(400).json({ error: "No valid message, audio, or video content provided for AI processing." });
//         }

//         console.log(`[Backend - Final LLM Input] Sending to Gemini: "${finalPromptForLLM.substring(0, 300)}..." with format: "${answer_format}"`);

//         // --- Step 4: Send to LLM (Gemini) ---
//         const aiResponseText = await getGeminiResponse(finalPromptForLLM, answer_format);

//         // --- Step 5: Send Response to Frontend ---
//         console.log("[Backend] Sending AI response to frontend.");
//         res.json({
//             userMessage: userInitialMessageForFrontend,
//             aiResponse: aiResponseText,
//             transcribedAudio: transcribedAudioText || youtubeTranscriptText
//         });

//     } catch (error) {
//         console.error("Backend Catch-all Error:", error.message || error);
//         // More specific error logging for external APIs
//         if (error.response) {
//             console.error("External API Error Response Data:", error.response.data);
//             console.error("External API Error Status:", error.response.status);
//             if (error.response.status === 401 || error.response.status === 403) {
//                 return res.status(error.response.status).json({
//                     error: `Authentication Error: Please check your API keys (AssemblyAI/Gemini).`,
//                 });
//             }
//         }
//         res.status(500).json({ error: "Internal server error during processing: " + error.message });
//     }
// });

// export default router;





// Backend/Routes/chatRoutes.js
import express from "express";
import multer from "multer";
import axios from "axios";
import dotenv from "dotenv";
import { getGeminiResponse } from "../Services/geminiService.js";
import { getYouTubeAudioTranscript } from "../Services/youtubeService.js";

dotenv.config();

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY;

const INSTAGRAM_REELS_URL_REGEX = /(?:https?:\/\/)?(?:www\.)?(?:instagram\.com)\/(?:reels|p|tv)\/([\w-]+)/i; // 'reels', 'p' (posts), 'tv' (IGTV) को कवर करता है
const FACEBOOK_VIDEO_URL_REGEX = /(?:https?:\/\/)?(?:www\.)?(?:facebook\.com)\/(?:.+?\/videos\/(?:[a-zA-Z0-9\-\.]+)\/|video\.php\?v=)(\d+)/i;
const YOUTUBE_URL_REGEX = /(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|)([\w-]{11})(?:\S+)?/i;
const GENERIC_AUDIO_VIDEO_URL_REGEX = /(https?:\/\/\S+\.(?:mp3|wav|m4a|aac|flac|ogg|webm|mp4|mov|avi|mkv|flv|wmv))(?:\S+)?/i;

router.get("/", (req, res) => {
    console.log("Request received on / route.");
    res.status(200).send("Chat Backend with AI integration is running!");
});

router.post("/api/dashboard/chat", upload.single("audio"), async (req, res) => {
    const { message, text_prompt: additional_text_prompt, answer_format } = req.body;
    const audioFileBuffer = req.file ? req.file.buffer : null;

    console.log(`[Backend] Received request. Audio present: ${!!audioFileBuffer}`);
    console.log(`[Backend] Message (from text input): "${message}"`);
    console.log(`[Backend] Additional Text Prompt (from combined input with media): "${additional_text_prompt}"`);
    console.log(`[Backend] Answer Format: "${answer_format}"`);

    // API Key check (simplified to always check if any media processing is implied)
    const requiresAssemblyAI = audioFileBuffer || message?.match(YOUTUBE_URL_REGEX) || message?.match(FACEBOOK_VIDEO_URL_REGEX) || message?.match(INSTAGRAM_REELS_URL_REGEX) || message?.match(GENERIC_AUDIO_VIDEO_URL_REGEX);
    if (requiresAssemblyAI && !ASSEMBLYAI_API_KEY) {
        return res.status(500).json({
            error: "ASSEMBLYAI_API_KEY is not set in backend environment variables. Cannot process audio/video links.",
        });
    }

    let transcribedContentText = ""; // Text from any media source (direct audio, YouTube, generic URL)
    let finalPromptForLLM = "";
    let userInitialMessageForFrontend = message || ""; // What frontend displays as user's input

    try {
        // --- Process Direct Audio Upload (Microphone or File) ---
        if (audioFileBuffer) {
            console.log(`[Backend] Processing direct audio file: ${req.file.originalname}, ${req.file.size} bytes`);
            const uploadRes = await axios.post("https://api.assemblyai.com/v2/upload", audioFileBuffer, {
                headers: { authorization: ASSEMBLYAI_API_KEY, "Content-Type": "application/octet-stream" },
            });
            const audioUrl = uploadRes.data.upload_url;
            console.log(`[Backend] Direct audio uploaded to AssemblyAI: ${audioUrl}`);

            const transcriptRes = await axios.post("https://api.assemblyai.com/v2/transcript", {
                audio_url: audioUrl, punctuate: true, format_text: true,
            }, { headers: { authorization: ASSEMBLYAI_API_KEY, "Content-Type": "application/json" } });
            const transcriptId = transcriptRes.data.id;
            console.log(`[Backend] Direct audio transcription started: ID = ${transcriptId}`);

            let pollStatus = "";
            for (let i = 0; i < 300; i++) { // Max 5 minutes polling
                await new Promise(r => setTimeout(r, 1000));
                const pollRes = await axios.get(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, { headers: { authorization: ASSEMBLYAI_API_KEY } });
                pollStatus = pollRes.data.status;
                if (pollStatus === "completed") {
                    transcribedContentText = pollRes.data.text;
                    console.log("[Backend] Direct audio transcription completed successfully.");
                    break;
                } else if (pollStatus === "error") {
                    console.error("[Backend] AssemblyAI Transcription Error (Direct Audio):", pollRes.data.error);
                    throw new Error(`AssemblyAI Transcription failed (Direct Audio): ${pollRes.data.error.message || 'unknown error'}`);
                }
                console.log(`[Backend] Polling direct audio... Current status: ${pollStatus}`);
            }

            if (!transcribedContentText) {
                console.error("[Backend] Direct audio transcription timed out or did not complete.");
                return res.status(504).json({ error: "Direct audio transcription timed out or did not complete." });
            }
            console.log(`[Backend] Transcribed Direct Audio: "${transcribedContentText}"`);
            // Set user message for frontend based on what was sent
            userInitialMessageForFrontend = `🎤 Voice message`;
            if (additional_text_prompt) {
                userInitialMessageForFrontend += `: "${additional_text_prompt}"`;
            }

        } else {
            // --- Process YouTube or Generic URL if NO direct audio buffer ---
            // const youtubeMatch = message?.match(YOUTUBE_URL_REGEX) || message?.match(FACEBOOK_VIDEO_URL_REGEX) || message?.match(INSTAGRAM_REELS_URL_REGEX)
            // const genericUrlMatch = message?.match(GENERIC_AUDIO_VIDEO_URL_REGEX);
            const youtubeMatch = message?.match(YOUTUBE_URL_REGEX);
            const facebookMatch = message?.match(FACEBOOK_VIDEO_URL_REGEX); // <-- नया वेरिएबल
            const instagramMatch = message?.match(INSTAGRAM_REELS_URL_REGEX); // <-- नया वेरिएबल
            const genericUrlMatch = message?.match(GENERIC_AUDIO_VIDEO_URL_REGEX);
            
          
            let urlToTranscribe = null;
            let urlType = null; // 'youtube', 'facebook', 'instagram', 'generic'

            if (youtubeMatch) {
                urlToTranscribe = youtubeMatch[0]; // Full YouTube URL
                console.log(`[Backend] Detected YouTube URL: ${urlToTranscribe}`);
                userInitialMessageForFrontend = `Regarding YouTube video: ${urlToTranscribe}`;
                if (additional_text_prompt) {
                    userInitialMessageForFrontend += ` (Query: ${additional_text_prompt})`;
                }
                try {
                    transcribedContentText = await getYouTubeAudioTranscript(urlToTranscribe, ASSEMBLYAI_API_KEY);
                    console.log(`[Backend] YouTube Transcribed Text successfully retrieved.`);
                } catch (ytError) {
                    console.error("[Backend] Error fetching YouTube transcript:", ytError.message);
                    transcribedContentText = `(Could not retrieve transcript for YouTube video: ${ytError.message}. Please ensure the video is publicly accessible and not geo-restricted.)`;
                }
            }
            else if (facebookMatch) { // <-- नया else if
                urlToTranscribe = facebookMatch[0];
                urlType = 'facebook';
                userInitialMessageForFrontend = `Regarding Facebook video: ${urlToTranscribe}`;
            } else if (instagramMatch) { // <-- नया else if
                urlToTranscribe = instagramMatch[0];
                urlType = 'instagram';
                userInitialMessageForFrontend = `Regarding Instagram Reel/Post: ${urlToTranscribe}`;
                userInitialMessageForFrontend = `Regarding external media: ${urlToTranscribe}`;
            }
            if (urlToTranscribe) { // यदि कोई URL पहचाना गया
                if (additional_text_prompt) {
                    userInitialMessageForFrontend += ` (Query: ${additional_text_prompt})`;
                }

                try {
                    // getMediaAudioTranscript फ़ंक्शन को सही 'platformType' के साथ कॉल करें
                    transcribedContentText = await getYouTubeAudioTranscript(urlToTranscribe, ASSEMBLYAI_API_KEY, urlType);
                    console.log(`[Backend] ${urlType} Transcribed Text successfully retrieved.`);
                } catch (transcribeError) {
                    console.error(`[Backend] Error transcribing ${urlType} URL:`, transcribeError.message);
                    transcribedContentText = `(Could not retrieve transcript for ${urlType} URL: ${transcribeError.message}. Please ensure the URL is correct and publicly accessible.)`;
                }
            } else if (genericUrlMatch) {
                urlType = 'generic';
                urlToTranscribe = genericUrlMatch[0]; // Full Generic URL
                console.log(`[Backend] Detected Generic Audio/Video URL: ${urlToTranscribe}`);
                userInitialMessageForFrontend = `Regarding external media: ${urlToTranscribe}`;
                if (additional_text_prompt) {
                    userInitialMessageForFrontend += ` (Query: ${additional_text_prompt})`;
                }
            
                try {
                    const transcriptRes = await axios.post("https://api.assemblyai.com/v2/transcript", {
                    audio_url: urlToTranscribe, punctuate: true, format_text: true,
                    }, { headers: { authorization: ASSEMBLYAI_API_KEY, "Content-Type": "application/json" } });
                    const transcriptId = transcriptRes.data.id;
                    console.log(`[Backend] Generic URL transcription started: ID = ${transcriptId}`);

                    let pollStatus = "";
                    for (let i = 0; i < 300; i++) { // Max 5 minutes polling
                        await new Promise(r => setTimeout(r, 1000));
                        const pollRes = await axios.get(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, { headers: { authorization: ASSEMBLYAI_API_KEY } });
                        pollStatus = pollRes.data.status;
                        if (pollStatus === "completed") {
                            transcribedContentText = pollRes.data.text;
                            console.log("[Backend] Generic URL transcription completed successfully.");
                            break;
                        } else if (pollStatus === "error") {
                            console.error("[Backend] AssemblyAI Transcription Error (Generic URL):", pollRes.data.error);
                            throw new Error(`AssemblyAI Transcription failed (Generic URL): ${pollRes.data.error.message || 'unknown error'}`);
                        }
                        console.log(`[Backend] Polling generic URL... Current status: ${pollStatus}`);
                    }

                    if (!transcribedContentText) {
                        throw new Error("Generic URL transcription timed out or did not complete.");
                    }
                } catch (urlTranscribeError) {
                    console.error("[Backend] Error transcribing generic URL:", urlTranscribeError.message);
                    transcribedContentText = `(Could not retrieve transcript for URL: ${urlTranscribeError.message}. Please ensure it's a direct link to an audio/video file and publicly accessible.)`;
                }
            }
            // If no audio buffer and no recognized URL, then it's just a text message.
            // In this case, transcribedContentText will remain empty, which is desired.
        }

        // --- Determine the final prompt for LLM ---
        // Combine user's text input (original or additional) with any transcribed media content.
        let rawUserTextInput = message || "";
        if (additional_text_prompt) {
            rawUserTextInput = additional_text_prompt; // text_prompt from frontend takes precedence if media was uploaded
        }

        if (transcribedContentText) {
            finalPromptForLLM = `User's query: "${rawUserTextInput}".\n\nMedia Content (Transcribed):\n${transcribedContentText}`;
        } 
        else {
            // If no media content was provided or transcribed, the raw text input is the final prompt.
            finalPromptForLLM = rawUserTextInput;
        }

        // Final check before sending to LLM
        if (!finalPromptForLLM || finalPromptForLLM.trim() === "") {
            return res.status(400).json({ error: "No valid message, audio, or video content provided for AI processing." });
        }

        console.log(`[Backend - Final LLM Input] Sending to Gemini: "${finalPromptForLLM.substring(0, 300)}..." with format: "${answer_format}"`);

        // --- Send to LLM (Gemini) ---
        const aiResponseText = await getGeminiResponse(finalPromptForLLM, answer_format);

        // --- Send Response to Frontend ---
        console.log("[Backend] Sending AI response to frontend.");
        res.json({
            userMessage: userInitialMessageForFrontend,
            aiResponse: aiResponseText,
            transcribedAudio: transcribedContentText // Will contain text from any source
        });

    } catch (error) {
        console.error("Backend Catch-all Error:", error.message || error);
        if (error.response) {
            console.error("External API Error Response Data:", error.response.data);
            console.error("External API Error Status:", error.response.status);
            if (error.response.status === 401 || error.response.status === 403) {
                return res.status(error.response.status).json({
                    error: `Authentication Error: Please check your API keys (AssemblyAI/Gemini).`,
                });
            }
        }
        res.status(500).json({ error: "Internal server error during processing: " + error.message });
    }
});

export default router;
