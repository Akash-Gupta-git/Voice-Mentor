// backend/index.js
import express from 'express';
import multer from 'multer';
import cors from 'cors';
import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';

const app = express();
const PORT = 5000;
app.use(cors());

// Multer to handle file uploads
const upload = multer({ dest: 'uploads/' });

const ASSEMBLYAI_API_KEY = 'your_assembly_ai_key_here';

app.post('/upload', upload.single('audio'), async (req, res) => {
  const audioFile = req.file;

  // 1. Upload audio to AssemblyAI
  const formData = new FormData();
  formData.append('file', fs.createReadStream(audioFile.path));

  try {
    const uploadResponse = await axios.post(
      'https://api.assemblyai.com/v2/upload',
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          authorization: ASSEMBLYAI_API_KEY,
        },
      }
    );

    const audioUrl = uploadResponse.data.upload_url;

    // 2. Start transcription
    const transcriptResponse = await axios.post(
      'https://api.assemblyai.com/v2/transcript',
      {
        audio_url: audioUrl,
        sentiment_analysis: true,
        auto_highlights: true,
      },
      {
        headers: {
          authorization: ASSEMBLYAI_API_KEY,
        },
      }
    );

    const transcriptId = transcriptResponse.data.id;

    // 3. Poll until done
    let status;
    let transcriptData;

    while (true) {
      const polling = await axios.get(
        `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
        { headers: { authorization: ASSEMBLYAI_API_KEY } }
      );

      status = polling.data.status;
      if (status === 'completed') {
        transcriptData = polling.data;
        break;
      } else if (status === 'error') {
        return res.status(500).json({ error: polling.data.error });
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    res.json({
      transcript: transcriptData.text,
      sentiment: transcriptData.sentiment_analysis_results,
      highlights: transcriptData.auto_highlights_result.results,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'AssemblyAI failed.' });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
