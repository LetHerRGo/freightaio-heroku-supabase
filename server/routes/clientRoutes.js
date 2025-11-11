import express from "express";
import verifyToken from "../services/verifyToken.js";
import verifyRole from "../services/verifyRole.js";
import {supabase} from "../services/supabase.js";


const router = express.Router();

router.get("/", verifyToken, verifyRole('operator'), async (req, res) => {
  const operatorId  = req.user.id;

   try {
    const { data: clients, error } = await supabase
      .from("client")
      .select("id, name")
      .eq("operator_id", operatorId);

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
  const operatorId = req.user.id

   if (!name || typeof name !== "string") {
    return res.status(400).json({ message: "Client name is required." });
  }



  // Check for duplicate
  const { data: existing, error: checkError } = await supabase
    .from("client")
    .select("*")
    .eq("name", name)
    .eq("operator_id", operatorId)
    .maybeSingle(); 

  if (existing) {
    return res.status(409).json({ message: "Client already exists." });
  }

  if (checkError && checkError.code !== "PGRST116") {
    return res.status(500).json({ message: "Failed to check existing client." });
  }


  // Insert client
  const { data: inserted, error: insertError } = await supabase
    .from("client")
    .insert({ name, operator_id: operatorId })
    .select("id")
    .single();

  if (insertError) {
    return res.status(500).json({ message: "Failed to create client." });
  }

  res.status(201).json({ message: "Client created successfully.", id: inserted.id });
});

export default router;