require("dotenv").config();

const askGemini = async (message, language) => {

  let langInstruction = "Reply ONLY in English.";
  if (language === "hi") langInstruction = "Reply ONLY in Hindi.";
  if (language === "mr") langInstruction = "Reply ONLY in Marathi.";

  const systemPrompt = `
You are an intelligent AI Bookstore Assistant.

- Recommend books
- Give spoiler-free summaries
- Suggest mood-based books
- Keep answers short
`;

  const finalPrompt = `
${systemPrompt}
${langInstruction}

User:
${message}
`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: finalPrompt }],
          },
        ],
      }),
    }
  );

  const data = await response.json();

  return (
    data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    "No response from AI"
  );
};

module.exports = { askGemini };