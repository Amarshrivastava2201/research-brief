require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const researchRoutes = require("./routes/researchRoutes");
const { checkLLMHealth } = require("./services/llmService");


const app = express();

// Middleware
app.use(cors({
  origin: "*"
}));

app.use(express.json());

// MongoDB Connection
const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/research_brief";
mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 5000 })
  .then(() => console.log("MongoDB Connected successfully"))
  .catch(async (err) => {
    console.log("DB Error on primary URI:", err.message);
    if (!mongoURI.includes("127.0.0.1") && !mongoURI.includes("localhost")) {
      console.log("Falling back to local MongoDB at mongodb://127.0.0.1:27017/research_brief...");
      try {
        await mongoose.connect("mongodb://127.0.0.1:27017/research_brief", { serverSelectionTimeoutMS: 3000 });
        console.log("Connected to local fallback MongoDB");
      } catch (localErr) {
        console.log("Local fallback also failed:", localErr.message);
      }
    }
  });

const Research = require("./models/Research");


// Basic test route
app.get("/", (req, res) => {
  res.json({ message: "Research Brief API Running" });
});

app.use("/api/research", researchRoutes);

// Health route
app.get("/status", async (req, res) => {
  try {
    // Check DB connection
    const dbState =
      mongoose.connection.readyState === 1
        ? "Connected"
        : "Not Connected";

    // Check LLM connection
    const llmStatus = await checkLLMHealth();

    res.json({
      server: "Running",
      database: dbState,
      llm: llmStatus
    });

  } catch (error) {
    res.status(500).json({ error: "Status check failed" });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
