import express from "express";
import verifyToken from "../services/verifyToken.js";
import verifyRole from "../services/verifyRole.js";
import cnTracking from "../services/cnTracking.js";
import { supabase } from "../services/supabase.js";
import { parseTime } from "../services/timeParser.js";

const router = express.Router();

router.post("/", verifyToken, verifyRole("operator"), async (req, res) => {
  const operatorId = req.user.id;
  const { ctnrNum, agentName, clientName, refNum } = req.body;

  try {
    // Check if container already exists
    const { data: existing } = await supabase
      .from("containers")
      .select("id")
      .eq("container_number", ctnrNum)
      .single();

    if (existing) {
      return res
        .status(409)
        .json({ message: `Container '${ctnrNum}' already exists.` });
    }

    // Fetch foreign keys
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("company_name")
      .eq("id", operatorId)
      .single();

    if (profileError || !profile) {
      return res.status(400).json({ message: "Profile not found." });
    }

    const [{ data: agent }, { data: forwarder }, { data: client }] =
      await Promise.all([
        supabase
          .from("agent")
          .select("id")
          .eq("name", agentName)
          .eq("operator_id", operatorId)
          .maybeSingle(),
        supabase
          .from("forwarder")
          .select("id")
          .eq("name", profile.company_name)
          .maybeSingle(),
        supabase
          .from("client")
          .select("id")
          .eq("name", clientName)
          .eq("operator_id", operatorId)
          .maybeSingle(),
      ]);

    if (!agent || !forwarder || !client) {
      return res
        .status(400)
        .json({ message: "One or more related records not found." });
    }

    // Fetch tracking info before inserting
    const trackingData = await cnTracking([ctnrNum]);

    if (!trackingData || trackingData.error) {
      console.error("CN Tracking failed:", trackingData?.error);
      return res
        .status(502)
        .json({ message: "Unable to fetch CN tracking data." });
    }

    const equipment = trackingData?.ThirdPartyIntermodalShipment?.Equipment?.[0];
    if (!equipment) {
      return res
        .status(404)
        .json({ message: `No tracking data available for ${ctnrNum} yet.` });
    }

    // Insert container only after tracking success
    const { data: containerInsert, error: containerInsertError } = await supabase
      .from("containers")
      .insert({
        container_number: ctnrNum,
        agent_id: agent.id,
        operator_id: operatorId,
        forwarder_id: forwarder.id,
        client_id: client.id,
        forwarder_ref: refNum,
      })
      .select("id")
      .single();

    if (containerInsertError) throw containerInsertError;

    const container_id = containerInsert.id;

    // Insert movement logs
    const status = equipment?.ETA?.Time ? "In Transit" : "Pending";

    const { error: moveInsertError } = await supabase
      .from("container_movements")
      .insert({
        container_id,
        status,
        location: equipment?.Event?.Location?.Station || "N/A",
        event_description: equipment?.Event?.Description || "N/A",
        event_time: equipment?.Event?.Time || null,
        customs_status: equipment?.CustomsHold?.Description || "N/A",
        destination: equipment?.Destination?.Station || "N/A",
        ETA: equipment?.ETA?.Time || null,
        storage_last_free_day: equipment?.StorageCharge?.LastFreeDay || null,
      });

    if (moveInsertError) throw moveInsertError;

    res.json({
      message: `Container '${ctnrNum}' has been added and tracking info recorded.`,
    });
  } catch (error) {
    console.error("Add shipment error:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
});

export default router;
