// import initKnex from "knex";
import express from "express";
// import configuration from "../knexfile.js";
import verifyToken from "../services/verifyToken.js";
import verifyRole from "../services/verifyRole.js";
import supabase from "../services/supabase.js";

// const knex = initKnex(configuration);
const router = express.Router();

router.get('/:containerNumber', verifyToken, verifyRole('operator'), async (req, res) => {
  const { container_number } = req.params;

  try {

    const { data: containers, error: containerError } = await supabase
      .from("containers")
      .select("id")
      .eq("container_number", container_number)
      .single();

    if (containerError) {
      throw containerError;
    }

    if (!containers) {
      return res.status(404).json({ message: "Container not found." });
    }

    const containerId = containers.id;



    const { data: logs, error } = await supabase
      .from("container_movement_logs")
      .select("*")
      .eq("container_id", containerId)
      .order("updated_at", { ascending: false });

    if (error) {
      throw error;
    }

    if (!logs || logs.length === 0) {
      return res.status(404).json({ message: "No logs found for this container." });
    }

    res.json(logs);
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({ message: "Failed to fetch logs." });
  }
});

export default router;