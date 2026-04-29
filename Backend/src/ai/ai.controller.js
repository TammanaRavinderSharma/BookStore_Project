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

const summarizeBook = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        summary: "Book details required for summary",
      });
    }

    const prompt = `Summarize the book "${title}" based on this description: ${description}. Provide 3 key bullet points and a one-sentence takeaway.`;
    const summary = await askGemini(prompt, "en");

    res.json({ summary });

  } catch (error) {
    console.error("AI Summary Error:", error);
    res.status(500).json({ summary: "AI failed to summarize 😢" });
  }
};

module.exports = { chatWithAI, summarizeBook };