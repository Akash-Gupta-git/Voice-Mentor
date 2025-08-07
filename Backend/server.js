

// // Backend/server.js 

// import express from 'express';
// import dotenv from 'dotenv'; // Corrected ESM import
// import cors from 'cors';

// import router from './routes/assembly.js'; // Import your routes


// dotenv.config(); // Load environment variables from .env file

// const app = express();
//  // Configure multer for in-memory storage (req.file.buffer)
// const PORT = process.env.PORT || 5000;
// const LLM_API_KEY = process.env.LLM_API_KEY;
// const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY; // Now correctly sourced from .env
// console.log(`\n--- Backend Startup Check ---`);
// console.log(`LLM_API_KEY is set: ${LLM_API_KEY ? 'Yes' : 'No'}`);
// console.log(`ASSEMBLYAI_API_KEY is set: ${ASSEMBLYAI_API_KEY ? 'Yes' : 'No'}`);

// // --- Middleware ---
// app.use(cors({
//     origin: ['http://localhost:5173', 'YOUR_FRONTEND_DOMAIN_IF_DEPLOYED'], // IMPORTANT: Add your frontend's actual URL!
//     methods: ['GET', 'POST'], // Explicitly allow GET and POST
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true // Enable credentials if needed (e.g., cookies, auth headers)
//   }));
//   app.use(express.json()); // To parse JSON request bodies (for /api/chat)
//   app.use(express.urlencoded({ extended: true })); // To parse URL-encoded request bodies
  
  
//   // --- Routes ---
  
//   app.use(router);






// // --- Start the Server ---
// app.listen(PORT, () => {
//     console.log(`\nChat Backend server running on http://localhost:${PORT}`);
//     console.log(`\nChat Backend server running on http://localhost:5173`);
//     console.log(`Access health check at http://localhost:${PORT}/`);
//     console.log(`Text chat endpoint: POST http://localhost:${PORT}/api/chat`);
//     console.log(`Audio transcribe endpoint: POST http://localhost:${PORT}/api/dashboard/chat (multipart/form-data)`);
// });


import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import router from './routes/assembly.js'; // Import your routes


dotenv.config(); // Load environment variables from .env file
 
const app = express();
const PORT = process.env.PORT || 5000;

// Correctly use environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // If you plan to use an LLM API
const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY; 

console.log(`\n--- Backend Startup Check ---`);
console.log(`LLM_API_KEY is set: ${GEMINI_API_KEY ? 'Yes' : 'No'}`);
console.log(`ASSEMBLYAI_API_KEY is set: ${ASSEMBLYAI_API_KEY ? 'Yes' : 'No'}`);

// --- Middleware ---
app.use(cors({  
    origin: ['http://localhost:5173'], // IMPORTANT: Ensure this is your React app's URL
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(express.json()); // To parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded request bodies


// --- Routes ---
app.use(router); // This will handle all routes defined in assembly.js

// --- Start the Server ---
app.listen(PORT, () => {
    console.log(`\nChat Backend server running on http://localhost:${PORT}`);
    console.log(`Access health check at http://localhost:${PORT}/`);
    console.log(`Combined chat endpoint (text/audio): POST http://localhost:${PORT}/api/dashboard/chat`);
});