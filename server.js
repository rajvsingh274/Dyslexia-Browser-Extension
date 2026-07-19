import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { chooseBest } from "./engine/chooser.js";

// ✅ CLEAN FUNCTION (removes ANSI + garbage characters)
function cleanText(text) {
  return text
    .replace(/\x1B\[[0-9;]*[A-Za-z]/g, "") // Remove ANSI escape codes
    .replace(/[^\x20-\x7E]/g, "");         // Remove non-printable characters
}

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve frontend files (index.html, app.js)
app.use(express.static(__dirname));

// ✅ MAIN API
app.post("/simplify", async (req, res) => {
  const { text, weights } = req.body;

  try {
    const result = await chooseBest(text, weights);

    // 🔥 CLEAN BEST OUTPUT
    if (result?.best?.text) {
      result.best.text = cleanText(result.best.text);
    }

    // 🔥 CLEAN ALL MODEL OUTPUTS (important for future UI use)
    if (result?.all && Array.isArray(result.all)) {
      result.all = result.all.map(item => ({
        ...item,
        text: cleanText(item.text)
      }));
    }

    res.json(result);

  } catch (error) {
    console.error("Error in /simplify:", error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});