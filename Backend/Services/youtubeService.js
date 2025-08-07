// Backend/Services/youtubeService.js
// ytdl-core को हटा दें
// import ytdl from 'ytdl-core'; // यह पहले ही हटा दिया गया है

import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { promisify } from 'util';
import ffmpeg from 'fluent-ffmpeg';
import { youtubeDl } from 'youtube-dl-exec'; // <<< यह इंपोर्ट सही है



const unlinkAsync = promisify(fs.unlink);

// --- Ffmpeg और ffprobe के पथ यहाँ सेट करें (जैसा पहले था, यह अभी भी आवश्यक हो सकता है) ---
const FFMPEG_BIN_PATH = 'C:\\ffmpeg\\ffmpeg-6.0-full_build\\bin\\ffmpeg.exe'; // आपके ffmpeg.exe का सटीक पथ
const FFPROBE_BIN_PATH = 'C:\\ffmpeg\\ffmpeg-6.0-full_build\\bin\\ffprobe.exe'; // आपके ffprobe.exe का सटीक पथ

if (fs.existsSync(FFMPEG_BIN_PATH)) {
    ffmpeg.setFfmpegPath(FFMPEG_BIN_PATH);
    console.log(`[YouTubeService] Ffmpeg path set to: ${FFMPEG_BIN_PATH}`);
} else {
    console.warn(`[YouTubeService] WARNING: Ffmpeg binary not found at ${FFMPEG_BIN_PATH}. Falling back to PATH.`);
}

if (fs.existsSync(FFPROBE_BIN_PATH)) {
    ffmpeg.setFfprobePath(FFPROBE_BIN_PATH);
    console.log(`[YouTubeService] Ffprobe path set to: ${FFPROBE_BIN_PATH}`);
} else {
    console.warn(`[YouTubeService] WARNING: Ffprobe binary not found at ${FFPROBE_BIN_PATH}. Falling back to PATH.`);
}
// --- Ffmpeg पथ सेटिंग्स का अंत ---
/*
* Downloads audio from various video platforms (YouTube, Instagram, Generic URLs) using yt-dlp,
* uploads it to AssemblyAI for transcription, and returns the transcript.
*  @param {string} mediaUrl The full URL of the media (YouTube, Instagram, Generic).
*  @param {string} assemblyAIApiKey Your AssemblyAI API key.
*  @param {string} [platformType='auto'] Optional: 'youtube', 'instagram', 'generic'. Helps with specific yt-dlp options.
* @returns {Promise<string>} The transcribed text from the media.
*/

export async function getYouTubeAudioTranscript(youtubeUrl, assemblyAIApiKey,  platformType = 'auto') {
    let tempFilePath = '';
    try {
        console.log(`[YouTubeService] Attempting to process YouTube URL with yt-dlp: ${youtubeUrl} :${platformType}`);

        // Removed the ytdl.getInfo() call as youtube-dl-exec doesn't have it directly.
        // youtube-dl-exec directly runs the download command.
        
        // 1. yt-dlp का उपयोग करके केवल ऑडियो डाउनलोड करें
        const audioOutputPath = path.join(process.cwd(), `temp_audio_${Date.now()}.webm`); // .webm (ओपस) आमतौर पर अच्छी गुणवत्ता और छोटा फ़ाइल आकार देता है
        tempFilePath = audioOutputPath; // अस्थायी फ़ाइल पथ सेट करें ताकि फाइनली ब्लॉक इसे साफ कर सके

        console.log(`[YouTubeService] Downloading audio using yt-dlp to: ${audioOutputPath}`);

        // yt-dlp कमांड चलाएँ: केवल ऑडियो निकालें, वेबएम प्रारूप में, और सीधे फ़ाइल में सहेजें
        await youtubeDl(youtubeUrl, {
            extractAudio: true, // ऑडियो निकालें
            audioFormat: 'webm', // वेबएम ऑडियो फ़ाइल के रूप में सहेजें
            output: audioOutputPath, // आउटपुट फ़ाइल पथ
            noPlaylist: true, // यदि URL एक प्लेलिस्ट है, तो केवल पहला वीडियो डाउनलोड करें
            // You can add more options here if needed, e.g., to handle age-restricted videos
            // userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            // noCheckCertificates: true,
            // cookiesFromBrowser: 'chrome', // if trying to bypass login for some videos (more complex)
            // dumpSingleJson: true // If you needed info, you'd dump JSON and parse it
        }, {

        });
        if (platformType === 'instagram') {
            console.log("[MediaService] Adding Instagram-specific yt-dlp options.");
            // yt-dlp को Instagram के साथ काम करने के लिए अक्सर लॉगिन/कुकीज़ की आवश्यकता होती है।
            // यहाँ आप ~/.netrc फ़ाइल का उपयोग करने की सलाह दे सकते हैं,
            // या एक Instagram यूजरनेम/पासवर्ड सीधे पास करने की कोशिश कर सकते हैं (सुरक्षा जोखिम)।
            // कुकीज़ लोड करने के लिए:
            // youtubeDl(mediaUrl, { ...ytDlpOptions, cookiesFromBrowser: 'chrome' }); // आपके ब्राउज़र से कुकीज़ निकालने का प्रयास करता है
            // या ~/.netrc फ़ाइल का उपयोग करने के लिए: (अनुशंसित, अधिक सुरक्षित)
            // https://github.com/yt-dlp/yt-dlp#authentication-options
            // username: process.env.INSTAGRAM_USERNAME,
            // password: process.env.INSTAGRAM_PASSWORD,
        }

        await youtubeDl(youtubeUrl, youtubeDl); // yt-dlp कमांड चलाएँ

        console.log(`[MediaService] Uploading audio to AssemblyAI (${audioBuffer.byteLength} bytes)...`);
        console.log(`[YouTubeService] Audio download complete using yt-dlp.`);

        // 2. डाउनलोड की गई ऑडियो फ़ाइल को एक बफर में पढ़ें
        const audioBuffer = fs.readFileSync(tempFilePath);

        // 3. ऑडियो को AssemblyAI पर अपलोड करें
        console.log(`[YouTubeService] Uploading audio to AssemblyAI (${audioBuffer.byteLength} bytes)...`);
        const uploadRes = await axios.post("https://api.assemblyai.com/v2/upload", audioBuffer, {
            headers: {
                authorization: assemblyAIApiKey,
                "Content-Type": "application/octet-stream",
            },
        });
        const audioUrl = uploadRes.data.upload_url;
        console.log(`[YouTubeService] Audio uploaded to AssemblyAI: ${audioUrl}`);

        // 4. ट्रांसक्रिप्शन शुरू करें
        const transcriptRes = await axios.post("https://api.assemblyai.com/v2/transcript", {
            audio_url: audioUrl,
            punctuate: true,
            format_text: true,
        }, {
            headers: { authorization: assemblyAIApiKey, "Content-Type": "application/json" },
        });

        const transcriptId = transcriptRes.data.id;
        console.log(`[YouTubeService] Transcription started: ID = ${transcriptId}`);

        // 5. ट्रांसक्रिप्शन परिणाम के लिए पोल करें (timeout बढ़ा हुआ है)
        let pollStatus = "";
        let transcribedText = "";
        for (let i = 0; i < 300; i++) { // Poll every 1 second, max 300 times (5 minutes)
            await new Promise(r => setTimeout(r, 1000));
            const pollRes = await axios.get(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
                headers: { authorization: assemblyAIApiKey },
            });
            pollStatus = pollRes.data.status;
            if (pollStatus === "completed") {
                transcribedText = pollRes.data.text;
                console.log("[YouTubeService] Transcription completed successfully.");
                break;
            } else if (pollStatus === "error") {
                console.error(`[YouTubeService] AssemblyAI Transcription failed for ID ${transcriptId}:`, pollRes.data.error);
                throw new Error(`AssemblyAI Transcription failed: ${pollRes.data.error.message || 'unknown error'}`);
            }
            console.log(`[YouTubeService] Polling AssemblyAI... Current status: ${pollStatus}`);
        }

        if (!transcribedText) {
            throw new Error("YouTube audio transcription timed out or did not complete within 5 minutes.");
        }

        return transcribedText;

    } catch (error) {
        console.error(`[YouTubeService] Catch-all Error in getYouTubeAudioTranscript (yt-dlp integration): ${error.message}`);
        // If youtubeDl itself throws an error, it usually logs to stderr.
        // We'll catch it here and provide a more user-friendly message.
        if (error.stderr) {
            console.error(`[YouTubeService] yt-dlp stderr: ${error.stderr}`);
            throw new Error(`YouTube video processing failed: ${error.stderr.substring(0, 150)}... Please check the video URL and try again.`);
        } else {
            throw new Error(`YouTube video processing failed: ${error.message}. Please check the video URL and try again.`);
        }
    } finally {
        // अस्थायी फ़ाइल को साफ करें
        if (tempFilePath && fs.existsSync(tempFilePath)) {
            await unlinkAsync(tempFilePath).catch(err => console.error(`Error deleting temp file in finally block ${tempFilePath}:`, err));
        }
    }
}