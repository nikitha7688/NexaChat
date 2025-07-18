require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Fix for node-fetch import in ESM-style
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-001:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: message }] }],
        }),
      }
    );

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

    res.json({ reply });
  } catch (error) {
    console.error("Error with Gemini API:", error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

app.listen(5000, () => console.log("✅ Server running on port 5000"));
