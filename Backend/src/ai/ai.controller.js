const { askGemini } = require("./ai.service");

const chatWithAI = async (req, res) => {
  try {
    const { message, language } = req.body;

    if (!message) {
      return res.status(400).json({
        reply: "Message required",
      });
    }

    const reply = await askGemini(message, language);

    res.json({ reply });

  } catch (error) {
    console.error("AI Controller Error:", error);
    res.status(500).json({ reply: "AI failed 😢" });
  }
};

module.exports = { chatWithAI };