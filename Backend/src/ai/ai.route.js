const express = require("express");
const router = express.Router();

const { chatWithAI, summarizeBook } = require("./ai.controller");

// POST /api/ai/chat
router.post("/chat", chatWithAI);
router.post("/summarize", summarizeBook);

module.exports = router;