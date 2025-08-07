import express from "express";
import multer from "multer";
import axios from "axios";
// import fs from "fs/promises";
import path from 'path';
const router = express.Router();
const upload = multer();
const ASSEMBLYAI_API_KEY = "16bc706f8b57421f9abe1086e8af4bd8"; // Your actual API key
const BASE_URL = "https://api.assemblyai.com";


  console.log("API Key:", ASSEMBLYAI_API_KEY);
//  const file = '/songs.mp3'
  const file = path.resolve("C:/Users/akash/OneDrive/Desktop/Proramming_file/React_project/Domain-Expert-Agent_project/voice-mentor/Backend/routes/songs.mp3");
  try {
    console.log(`[Backend] Audio file received: ${file.originalname}, ${file.size} bytes`);
    console.log("==========file", file)
    // Step 1: Upload the audio file
    const uploadRes = await axios.post(`${BASE_URL}/v2/upload`, file.buffer, {
      headers: {
        authorization: ASSEMBLYAI_API_KEY,
        "Content-Type": "application/octet-stream",
      },
    });

    const audioUrl = uploadRes.data.upload_url;
    // const audioUrl = '/public/songs.mp3'
    console.log(`[Backend] Uploaded to AssemblyAI: ${audioUrl}`);

    // Step 2: Start transcription
    const transcriptRes = await axios.post(`${BASE_URL}/v2/transcript`, {
      audio_url: audioUrl,
      speech_model: "universal",
      punctuate: true,
      format_text: true,
    }, {
      headers: {
        authorization: ASSEMBLYAI_API_KEY,
        "Content-Type": "application/json",
      },
    });

    const transcriptId = transcriptRes.data.id;
    console.log(`[Backend] Transcription job started: ${transcriptId}`);

    // Step 3: Poll until transcription completes
    let transcript;
    while (true) {
      const pollingRes = await axios.get(`${BASE_URL}/v2/transcript/${transcriptId}`, {
        headers: { authorization: ASSEMBLYAI_API_KEY },
      });

      if (pollingRes.data.status === "completed") {
        transcript = pollingRes.data.text;
        break;
      } else if (pollingRes.data.status === "error") {
       console.log(error)
      }

      console.log("Waiting for transcription...");
      await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait 3 seconds
    }

    // Step 4: Return transcript with your answer_format
    const answer_format = {
      question: "What is said in the audio?",
      answer: transcript,
    };

   console.log(answer_format);

  } catch (error) {
    console.error("[Backend] Transcription Error:", error.message);
   console.log("Something went wrong", error.message, error);
  }


export default router;
