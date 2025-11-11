import express from "express";
import verifyToken from "../services/verifyToken.js";
import verifyRole from "../services/verifyRole.js";
import {supabase} from "../services/supabase.js";


const router = express.Router();

router.get("/", verifyToken, verifyRole('operator'), async (req, res) => {
  const operatorId = req.user.id;
 
   try {
    const { data: agents, agentError  } = await supabase
      .from("agent")
      .select("id, name")
      .eq("operator_id", operatorId);

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
  const operatorId = req.user.id;

  if (!name || typeof name !== "string") {
    return res.status(400).json({ message: "Agent name is required." });
  }

  // Check for duplicate
  const { data: existing, error: selectError } = await supabase
    .from("agent")
    .select("*")
    .eq("name", name)
    .eq("operator_id", operatorId)
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
    .insert({ name, operator_id: operatorId })
    .select("id")
    .single();

  if (insertError) {
    return res.status(500).json({ message: "Failed to create agent." });
  }

  res.status(201).json({ message: "Agent created successfully.", id: data.id });
});

export default router;