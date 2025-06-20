import initKnex from "knex";
import express from "express";
import configuration from "../knexfile.js";
import verifyToken from "../services/verifyToken.js";
import verifyRole from "../services/verifyRole.js";

const knex = initKnex(configuration);
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const agents = await knex("agent").select("id", "name");
    res.json(agents); 
  } catch (error) {
    res.status(500).json({ message: "Unable to retrieve data." });
  }
});

router.post("/", verifyToken, verifyRole('operator'),async (req, res) => {
  const { name } = req.body;
  if (!name || typeof name !== "string") {
    return res.status(400).json({ message: "Agent name is required." });
  }
  const existing = await knex("agent").where({ name }).first();
  if (existing) {
    return res.status(409).json({ message: "Agent already exists." });
  }
  try {
    const [id] = await knex("agent").insert({ name });
    res.status(201).json({ message: "Agent created successfully.", id });
  } catch (error) {
    res.status(500).json({ message: "Failed to create agent." });
  }
});

export default router;