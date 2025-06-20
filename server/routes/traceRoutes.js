import initKnex from "knex";
import express from "express";
import configuration from "../knexfile.js";
import verifyToken from "../services/verifyToken.js";
import verifyRole from "../services/verifyRole.js";

const knex = initKnex(configuration);
const router = express.Router();

router.get('/', verifyToken, verifyRole(['operator', 'agent', 'client']), async (req, res) => {
  try {
    const { role, username } = req.user;
    const {sortBy, order} = req.query; //using sorting query
    let operator;

    //columns allowed to sort
    const allowedColumns = [
      "container_number",
      "forwarder_ref",
      "agent_name",
      "client_name",
      "destination",
      "ETA",
      "storage_last_free_day",
      "status",
    ]

    if (role === 'operator') {
      operator = await knex("forwarder_operator").where({ username }).first();
      if (!operator) return res.status(404).json({ message: "Operator not found" });

    } else if (role === 'agent') {
      operator = await knex("agent_user").where({ username }).first();
      if (!operator) return res.status(404).json({ message: "Agent not found" });

    } else if (role === 'client') {
      operator = await knex("client_user").where({ username }).first();
      if (!operator) return res.status(404).json({ message: "Client not found" });
    }


    let query = knex("container_movements")
      .join("containers", "container_movements.container_id", "containers.id")
      .leftJoin("agent", "containers.agent_id", "agent.id")
      .leftJoin("client", "containers.client_id", "client.id")
      .select(
        "container_movements.*",
        "containers.container_number",
        "containers.forwarder_ref",
        "agent.name as agent_name",
        "client.name as client_name"
      );

    if (role === 'operator') {
      query.where("containers.operator_id", operator.id);
    } else if (role === 'agent') {
      query.where("containers.agent_id", operator.agent_id);
    } else if (role === 'client') {
      query.where("containers.client_id", operator.client_id);
    }

    //sort function
    if (sortBy && allowedColumns.includes(sortBy)) {
      query.orderBy(sortBy, order === "desc" ? "desc" : "asc");
    }

    const data = await query;
    res.status(200).json(data);

  } catch (error) {
    console.error("Error retrieving container movement data:", error);
    res.status(500).json({ message: "Failed to retrieve data" });
  }
});

//delete container function
router.delete('/:id', verifyToken, verifyRole('operator'), async (req, res) => {
  const { id } = req.params;

  try {
    
    const movement = await knex("container_movements").where({ id }).first();
    if (!movement) {
      return res.status(404).json({ message: "Container movement not found." });
    }
    const containerId = movement.container_id;
    await knex("container_movements").where({ id }).del();
    await knex("containers").where({ id: containerId }).del();
    res.status(200).json({ message: "Container movement and its container deleted successfully." });
  } catch (error) {
    console.error("Error deleting records:", error);
    res.status(500).json({ message: "Failed to delete container movement and container." });
  }
});

export default router;