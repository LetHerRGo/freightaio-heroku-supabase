// import initKnex from "knex";
import express from "express";
import verifyToken from "../services/verifyToken.js";
import verifyRole from "../services/verifyRole.js";
// import configuration from "../knexfile.js";
import cnTracking from "../services/cnTracking.js"
import supabase from "../services/supabase.js";


const router = express.Router();

router.post('/', verifyToken, verifyRole('operator'), async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { ctnrNum, agentName, clientName, refNum } = req.body;

  // Check if container exists
  const { data: existing } = await supabase
    .from("containers")
    .select("id")
    .eq("container_number", ctnrNum)
    .single();

  if (existing) {
    return res.status(409).json({ message: `Container '${ctnrNum}' already exists.` });
  }

  // Fetch foreign keys
  const [
    { data: agent, error: agentError },
    { data: operator, error: operatorError },
    { data: forwarder, error: forwarderError },
    { data: client, error: clientError }
  ] = await Promise.all([
    supabase.from("agent").select("id").eq("name", agentName).single(),
    supabase.from("forwarder_operator").select("id").eq("username", req.user.username).single(),
    supabase.from("forwarder_operator").select("forwarder_id").eq("username", req.user.username).single(),
    supabase.from("client").select("id").eq("name", clientName).single()
  ]);

  if (!agent || !operator || !forwarder || !client) {
    return res.status(400).json({ message: "One or more related records not found." });
  }

  try {
    // Insert into containers
    const { data: containerInsert, error: containerInsertError } = await supabase
      .from("containers")
      .insert({
        container_number: ctnrNum,
        agent_id: agent.id,
        operator_id: operator.id,
        forwarder_id: forwarder.forwarder_id,
        client_id: client.id,
        forwarder_ref: refNum
      })
      .select("id")
      .single();

    if (containerInsertError) throw containerInsertError;

    const container_id = containerInsert.id;

    // Fetch tracking info
    const trackingData = await cnTracking([ctnrNum]);
    const equipment = trackingData?.ThirdPartyIntermodalShipment?.Equipment?.[0];
    const status = equipment?.ETA?.Time ? "In Transit" : "Pending";

    console.log("📦 Tracking LastFreeDay:", equipment?.StorageCharge?.LastFreeDay);


    // Insert into container_movements
    const { error: moveInsertError } = await supabase
      .from("container_movements")
      .insert({
        container_id,
        status,
        location: equipment?.Event?.Location?.Station || "N/A",
        event_description: equipment?.Event?.Description || "N/A",
        event_time: equipment?.Event?.Time?.replace(/ [A-Z]{2,3}$/, "") || null,
        customs_status: equipment?.CustomsHold?.Description || "N/A",
        destination: equipment?.Destination?.Station || "N/A",
        ETA: equipment?.ETA?.Time?.replace(/ [A-Z]{2,3}$/, "") || null,
        storage_last_free_day: equipment?.StorageCharge?.LastFreeDay || null
      });

    if (moveInsertError) throw moveInsertError;

    res.json({ message: `Container '${ctnrNum}' has been added and tracking info recorded.` });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;