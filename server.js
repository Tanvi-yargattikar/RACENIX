const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/ask", async (req, res) => {
  const userPrompt = req.body.prompt;

  try {
    const response = await axios.post(
      "https://api.anthropic.com/v1/messages",
      {
        model: "claude-3-sonnet-20240229",
        max_tokens: 300,
        messages: [
          { role: "user", content: userPrompt }
        ]
      },
      {
        headers: {
          "x-api-key": process.env.CLAUDE_API_KEY,
          "anthropic-version": "2023-06-01",
          "Content-Type": "application/json"
        }
      }
    );

    
    res.json(response.data.content[0].text);

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).send("Error calling Claude");
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});