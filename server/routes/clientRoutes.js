import express from "express";
import verifyToken from "../services/verifyToken.js";
import verifyRole from "../services/verifyRole.js";
import supabase from "../services/supabase.js";


const router = express.Router();

router.get("/", verifyToken, verifyRole('operator'), async (req, res) => {
  const { username } = req.user;

   try {
    const { data: forwarder, error: forwarderError } = await supabase
      .from("forwarder_operator")
      .select("forwarder_id")
      .eq("username", username)
      .single();
    
    if (forwarderError || !forwarder) {
      return res.status(404).json({ message: "Forwarder not found." });
    }

    const { data: clients, error } = await supabase
      .from("client")
      .select("id, name")
      .eq("forwarder_id", forwarder.forwarder_id);

    if (error) {
      return res.status(500).json({ message: "Unable to retrieve data." });
    }

    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: "Unexpected server error." });
  }
});


router.post("/", verifyToken, verifyRole('operator'),async (req, res) => {
  const { name } = req.body;
  const { username } = req.user;

   if (!name || typeof name !== "string") {
    return res.status(400).json({ message: "Client name is required." });
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

  // Check for duplicate
  const { data: existing, error: checkError } = await supabase
    .from("client")
    .select("*")
    .eq("name", name)
    .eq("forwarder_id", forwarder.forwarder_id)
  .maybeSingle(); // Use maybeSingle in case it returns null

  if (existing) {
    return res.status(409).json({ message: "Client already exists." });
  }

  if (checkError && checkError.code !== "PGRST116") {
    return res.status(500).json({ message: "Failed to check existing client." });
  }


  // Insert client
  const { data: inserted, error: insertError } = await supabase
    .from("client")
    .insert({ name, forwarder_id })
    .select("id")
    .single();

  if (insertError) {
    return res.status(500).json({ message: "Failed to create client." });
  }

  res.status(201).json({ message: "Client created successfully.", id: inserted.id });
});

export default router;