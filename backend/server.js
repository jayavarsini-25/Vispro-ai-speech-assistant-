const express = require("express");
const cors = require("cors");
const multer = require("multer");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

app.post("/transcribe", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file uploaded" });
    }

    const audioBuffer = req.file.buffer;

    const deepgramURL =
      "https://api.deepgram.com/v1/listen?punctuate=true&diarize=true&utterances=true";

    const response = await axios.post(deepgramURL, audioBuffer, {
      headers: {
        Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
        "Content-Type": req.file.mimetype,
      },
    });

    res.json(response.data);

  } catch (error) {
    res.status(500).json({
      error: "Transcription failed",
      details: error.response?.data || error.message,
    });
  }
});

app.listen(process.env.PORT, () => {
  console.log("Backend running on port " + process.env.PORT);
});
