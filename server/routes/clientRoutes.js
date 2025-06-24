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
    const { data: clients, error } = await supabase
      .from("client")
      .select("id, name");

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
   if (!name || typeof name !== "string") {
    return res.status(400).json({ message: "Client name is required." });
  }

  // Check for duplicate
  const { data: existing, error: checkError } = await supabase
    .from("client")
    .select("*")
    .eq("name", name)
    .single();

  if (existing) {
    return res.status(409).json({ message: "Client already exists." });
  }

  if (checkError && checkError.code !== "PGRST116") {
    return res.status(500).json({ message: "Failed to check existing client." });
  }

  // Insert client
  const { data: inserted, error: insertError } = await supabase
    .from("client")
    .insert({ name })
    .select("id")
    .single();

  if (insertError) {
    return res.status(500).json({ message: "Failed to create client." });
  }

  res.status(201).json({ message: "Client created successfully.", id: inserted.id });
});

export default router;