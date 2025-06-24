import express from "express";
import cors from "cors";
import "dotenv/config";
import authRoutes from "./routes/authRoutes.js"
import trackRoutes from "./routes/trackRoutes.js"
import addshipmentRoutes from "./routes/addshipmentRoutes.js"
import agentRoutes from "./routes/agentRoutes.js"
import clientRoutes from "./routes/clientRoutes.js"
import traceRoutes from "./routes/traceRoutes.js"
// import initKnex from "knex";
// import configuration from "./knexfile.js";
import "./services/updateContainers.js" // update container every x mins
import logRoutes from "./routes/logRoutes.js";
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';


// const knex = initKnex(configuration);
const app = express();

// Resolve __dirname (since you're using ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from Vite build
app.use(express.static(path.join(__dirname, 'public')));

const logRequest = (req, res, next) => {
  console.log(`Request: ${req.method} for ${req.path}`);
  next();
};

const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(logRequest);
app.use(cors());

app.get("/", (req, res) => {
  res.send("Catstone API");
});


app.use("/login", authRoutes);
app.use("/track", trackRoutes);
app.use("/addshipment", addshipmentRoutes);
app.use("/agent", agentRoutes);
app.use("/client", clientRoutes);
app.use("/trace", traceRoutes);
app.use("/logs", logRoutes);


app.get(/.*/, (req, res) => {
  const indexPath = path.join(__dirname, 'public', 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(500).send("index.html not found — did you run `npm run build`?");
  }
});


app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}...`);
});
