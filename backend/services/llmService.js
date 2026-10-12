const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

async function generateResearchBrief(contents) {
  try {
    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "system",
          content: "You are an expert research analyst. Return ONLY a valid, complete JSON object. Keep summary concise (2-4 sentences). Provide 3-5 key points with concise snippet. Keep total JSON under 600 words."
        },
        {
          role: "user",
          content: `
Analyze the sources and return ONLY valid JSON in this structure:

{
  "summary": "string",
  "keyPoints": [
    {
      "point": "string",
      "source": "string",
      "snippet": "string"
    }
  ],
  "conflicts": ["string"],
  "verifyChecklist": ["string"],
  "tags": ["string"]
}

Sources:
${contents}
`
        }
      ],
      max_tokens: 1500,
      temperature: 0.2
    });

    return response.choices[0].message.content;

  } catch (error) {
    console.error("Groq Error:", error);
    throw new Error("LLM generation failed");
  }
}

async function checkLLMHealth() {
  try {
    await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [{ role: "user", content: "ping" }],
      max_tokens: 50
    });
    return "Connected";
  } catch (error) {
    return "Failed";
  }
}


module.exports = {
  generateResearchBrief,
  checkLLMHealth
};

