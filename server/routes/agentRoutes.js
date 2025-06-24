// import initKnex from "knex";
import express from "express";
// import configuration from "../knexfile.js";
import verifyToken from "../services/verifyToken.js";
import verifyRole from "../services/verifyRole.js";
import supabase from "../services/supabase.js";

// const knex = initKnex(configuration);
const router = express.Router();

router.get("/", verifyToken, verifyRole('operator'), async (req, res) => {
  const { username } = req.user;

   try {
    // Step 1: Get forwarder_id from operator
    const { data: operator, error: operatorError } = await supabase
      .from("forwarder_operator")
      .select("forwarder_id")
      .eq("username", username)
      .single();

    if (operatorError || !operator) {
      return res.status(404).json({ message: "Operator's forwarder ID not found." });
    }

    const forwarder_id = operator.forwarder_id;


    const { data: agents, agentError  } = await supabase
      .from("agent")
      .select("id, name")
      .eq("forwarder_id", forwarder_id);

    if (agentError) {
      return res.status(500).json({ message: "Unable to retrieve data." });
    }

    res.json(agents);
  } catch (err) {
    res.status(500).json({ message: "Unexpected server error." });
  }
});

router.post("/", verifyToken, verifyRole('operator'),async (req, res) => {
  const { name } = req.body;
  const { username } = req.user;

  if (!name || typeof name !== "string") {
    return res.status(400).json({ message: "Agent name is required." });
  }

  // 1. Get forwarder_id from the operator's username
  const { data: operator, error: operatorError } = await supabase
    .from("forwarder_operator")
    .select("forwarder_id")
    .eq("username", username)
    .single();

  if (operatorError || !operator) {
    return res.status(404).json({ message: "Operator's forwarder ID not found." });
  }

  const forwarder_id = operator.forwarder_id;

  // Check for existing agent
  const { data: existing, error: selectError } = await supabase
    .from("agent")
    .select("*")
    .eq("name", name)
    .eq("forwarder_id", forwarder_id)
    .maybeSingle();

  if (existing) {
    return res.status(409).json({ message: "Agent already exists." });
  }

  if (selectError && selectError.code !== "PGRST116") {
    return res.status(500).json({ message: "Failed to check existing agent." });
  }

  // Insert agent
  const { data, error: insertError } = await supabase
    .from("agent")
    .insert({ name, forwarder_id })
    .select("id")
    .single();

  if (insertError) {
    return res.status(500).json({ message: "Failed to create agent." });
  }

  res.status(201).json({ message: "Agent created successfully.", id: data.id });
});

export default router;