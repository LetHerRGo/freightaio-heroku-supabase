// import initKnex from "knex";
import express from "express";
// import configuration from "../knexfile.js";
import verifyToken from "../services/verifyToken.js";
import verifyRole from "../services/verifyRole.js";
import supabase from "../services/supabase.js";


const router = express.Router();

// GET /trace
router.get('/', verifyToken, verifyRole(['operator', 'agent', 'client']), async (req, res) => {
  try {
    const { role, username } = req.user;
    const { sortBy, order } = req.query;

    const allowedColumns = [
      "container_number",
      "forwarder_ref",
      "agent_name",
      "client_name",
      "destination",
      "ETA",
      "storage_last_free_day",
      "status",
    ];

    // Step 1: Get role-based ID (operator.id, agent_id, client_id)
    let userQuery;
    if (role === 'operator') {
      userQuery = await supabase.from("forwarder_operator").select("id").eq("username", username).single();
    } else if (role === 'agent') {
      userQuery = await supabase.from("agent_user").select("agent_id").eq("username", username).single();
    } else if (role === 'client') {
      userQuery = await supabase.from("client_user").select("client_id").eq("username", username).single();
    }

    if (userQuery.error || !userQuery.data) {
      return res.status(404).json({ message: `${role} not found.` });
    }

    const userId = userQuery.data.id || userQuery.data.agent_id || userQuery.data.client_id;

    // Step 2: Build query to container_movements with joins
    let query = supabase
      .from("container_movements_with_info") // 👈 Use a Supabase VIEW with joins
      .select("*");

    // Step 3: Role filter
    if (role === 'operator') {
      query = query.eq("operator_id", userId);
    } else if (role === 'agent') {
      query = query.eq("agent_id", userId);
    } else if (role === 'client') {
      query = query.eq("client_id", userId);
    }

    // Step 4: Sorting
    if (sortBy && allowedColumns.includes(sortBy)) {
      query = query.order(sortBy, { ascending: order !== "desc" });
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Error retrieving container movement data:", error);
    res.status(500).json({ message: "Failed to retrieve data" });
  }
});

// DELETE /trace/:id
router.delete('/:id', verifyToken, verifyRole('operator'), async (req, res) => {
  const { id } = req.params;

  try {
    // Get container_id first
    const { data: movement, error: fetchError } = await supabase
      .from("container_movements")
      .select("container_id")
      .eq("id", id)
      .single();

    if (fetchError || !movement) {
      return res.status(404).json({ message: "Container movement not found." });
    }

    const containerId = movement.container_id;

    // Delete movement
    const { error: deleteMovementError } = await supabase
      .from("container_movements")
      .delete()
      .eq("id", id);

    if (deleteMovementError) throw deleteMovementError;

    // Delete container
    const { error: deleteContainerError } = await supabase
      .from("containers")
      .delete()
      .eq("id", containerId);

    if (deleteContainerError) throw deleteContainerError;

    res.status(200).json({ message: "Container movement and its container deleted successfully." });
  } catch (error) {
    console.error("Error deleting records:", error);
    res.status(500).json({ message: "Failed to delete container movement and container." });
  }
});

export default router;