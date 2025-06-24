// import initKnex from "knex";
import express from "express";
// import configuration from "../knexfile.js";
import verifyToken from "../services/verifyToken.js";
import verifyRole from "../services/verifyRole.js";
import supabase from "../services/supabase.js";

// const knex = initKnex(configuration);
const router = express.Router();

router.get("/", async (req, res) => {
   try {
    const { data: agents, error } = await supabase
      .from("agent")
      .select("id, name");

    if (error) {
      return res.status(500).json({ message: "Unable to retrieve data." });
    }

    res.json(agents);
  } catch (err) {
    res.status(500).json({ message: "Unexpected server error." });
  }
});

router.post("/", verifyToken, verifyRole('operator'),async (req, res) => {
  const { name } = req.body;

  if (!name || typeof name !== "string") {
    return res.status(400).json({ message: "Agent name is required." });
  }

  // Check for existing agent
  const { data: existing, error: selectError } = await supabase
    .from("agent")
    .select("*")
    .eq("name", name)
    .single();

  if (existing) {
    return res.status(409).json({ message: "Agent already exists." });
  }

  if (selectError && selectError.code !== "PGRST116") {
    // PGRST116 = No rows returned (safe to ignore in this context)
    return res.status(500).json({ message: "Failed to check existing agent." });
  }

  // Insert agent
  const { data, error: insertError } = await supabase
    .from("agent")
    .insert({ name })
    .select("id")
    .single();

  if (insertError) {
    return res.status(500).json({ message: "Failed to create agent." });
  }

  res.status(201).json({ message: "Agent created successfully.", id: data.id });
});

export default router;