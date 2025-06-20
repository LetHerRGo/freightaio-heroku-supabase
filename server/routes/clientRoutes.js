import initKnex from "knex";
import express from "express";
import configuration from "../knexfile.js";
import verifyToken from "../services/verifyToken.js";
import verifyRole from "../services/verifyRole.js";

const knex = initKnex(configuration);
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const clients = await knex("client").select("id", "name");
    res.json(clients); 
  } catch (error) {
    res.status(500).json({ message: "Unable to retrieve data." });
  }
});


router.post("/", verifyToken, verifyRole('operator'),async (req, res) => {
  const { name } = req.body;
  if (!name || typeof name !== "string") {
    return res.status(400).json({ message: "Client name is required." });
  }
  const existing = await knex("client").where({ name }).first();
  if (existing) {
    return res.status(409).json({ message: "Client already exists." });
  }
  try {
    const [id] = await knex("client").insert({ name });
    res.status(201).json({ message: "client created successfully.", id });
  } catch (error) {
    res.status(500).json({ message: "Failed to create client." });
  }
});

export default router;