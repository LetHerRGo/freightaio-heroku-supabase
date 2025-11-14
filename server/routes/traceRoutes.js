import express from "express";
import verifyToken from "../services/verifyToken.js";
import verifyRole from "../services/verifyRole.js";
import {supabase} from "../services/supabase.js";

const router = express.Router();

// GET /trace
router.get('/', verifyToken, verifyRole(['operator', 'agent', 'client']), async (req, res) => {
  try {
    const { sortBy, order } = req.query;
    if (!req.user?.id) {
        return res.status(401).json({message: "Usernot authenticated."})
    }
    const operatorId = req.user.id;

    const allowedColumns = [
      "container_number",
      "forwarder_ref",
      "agent_name",
      "client_name",
      "destination",
      "eta",
      "storage_last_free_day",
      "status",
    ];

 

    // Build query to the view
    let query = supabase.from("container_movements_with_info").select("*").eq("operator_id", operatorId)


    // Add sorting
    if (sortBy && allowedColumns.includes(sortBy.toLowerCase())) {
      query = query.order(sortBy.toLowerCase(), { ascending: order !== "desc" });
    }

    const { data, error } = await query;
    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error("Error retrieving container trace data:", error);
    console.error("Trace fetch error:", error); // Add this
    res.status(500).json({ message: "Failed to retrieve trace data." });
  }
});

// DELETE /trace/:id
router.delete('/:id', verifyToken, verifyRole('operator'), async (req, res) => {
  const { id } = req.params;

  try {
    // Get related container_id
    const { data: movement, error: movementErr } = await supabase
      .from("container_movements")
      .select("container_id")
      .eq("id", id)
      .single();

    if (movementErr || !movement) {
      return res.status(404).json({ message: "Container movement not found." });
    }

    // Delete container_movements row
    const { error: deleteMovementError } = await supabase
      .from("container_movements")
      .delete()
      .eq("id", id);

    if (deleteMovementError) throw deleteMovementError;

    // Delete container row
    const { error: deleteContainerError } = await supabase
      .from("containers")
      .delete()
      .eq("id", movement.container_id);

    if (deleteContainerError) throw deleteContainerError;

    res.status(200).json({ message: "Container movement and its container deleted successfully." });
  } catch (error) {
    console.error("Error deleting trace record:", error);
    res.status(500).json({ message: "Failed to delete trace record." });
  }
});

export default router;
