import cron from "node-cron";
import cnTracking from './cnTracking.js';
import supabase from './supabase.js'



const cleanTime = (t) =>
  typeof t === "string" ? t.replace(/ [A-Z]{2,3}$/, "") : null;

cron.schedule('*/10 * * * *', async () => {
  console.log(`[CRON] Updating container statuses at ${new Date().toISOString()}`);

  try {
    // Get all containers to update
    const { data: containersToUpdate, error } = await supabase
      .from("containers")
      .select("id, container_number");

    if (error) throw error;

    let updatedCount = 0;

    for (const { id, container_number } of containersToUpdate) {
      const result = await cnTracking([container_number]);
      const equipment = result.ThirdPartyIntermodalShipment?.Equipment?.[0];

      if (!equipment) {
        console.warn(`[WARN] No equipment data for ${container_number}`);
        continue;
      }

      const newETA = cleanTime(equipment?.ETA?.Time);

      // Get current ETA
      const { data: current, error: movementError } = await supabase
        .from("container_movements")
        .select("ETA")
        .eq("container_id", id)
        .single();

      if (movementError && movementError.code !== "PGRST116") {
        console.error(`[ERROR] Failed to fetch current ETA for container_id ${id}`);
        continue;
      }

      // Determine status
      const today = new Date().setHours(0, 0, 0, 0);
      const lastFreeDayRaw = equipment?.StorageCharge?.LastFreeDay || null;
      const lastFreeDay = lastFreeDayRaw ? new Date(lastFreeDayRaw).setHours(0, 0, 0, 0) : null;

      let status = "Pending";
      if (equipment?.Event?.Description === "OUT-GATE") {
        status = "Picked Up";
      } else if (lastFreeDay && lastFreeDay <= today) {
        status = "Need Attention";
      } else if (equipment?.Destination?.Station === equipment?.Event?.Location?.Station) {
        status = "Arrived";
      } else if (newETA) {
        status = "In Transit";
      }

      // Check if ETA changed
      const etaChanged = (current?.ETA === null && newETA !== null) ||
        (current?.ETA !== null && newETA === null) ||
        (current?.ETA && newETA && new Date(current.ETA).getTime() !== new Date(newETA).getTime());

      if (etaChanged) {
        await supabase.from("container_movement_logs").insert({
          container_id: id,
          location: equipment?.Event?.Location?.Station || "N/A",
          event_description: equipment?.Event?.Description || "N/A",
          event_time: cleanTime(equipment?.Event?.Time),
          customs_status: equipment?.CustomsHold?.Description || "N/A",
          destination: equipment?.Destination?.Station || "N/A",
          ETA: newETA,
          storage_last_free_day: equipment?.StorageCharge?.LastFreeDay || null,
          updated_at: new Date()
        });

        console.log(`Logged ETA change for container_id ${container_number}`);
      }

      // Update latest movement
      const { error: updateError } = await supabase
        .from("container_movements")
        .update({
          location: equipment?.Event?.Location?.Station || "N/A",
          event_description: equipment?.Event?.Description || "N/A",
          event_time: cleanTime(equipment?.Event?.Time),
          customs_status: equipment?.CustomsHold?.Description || "N/A",
          destination: equipment?.Destination?.Station || "N/A",
          ETA: newETA,
          storage_last_free_day: equipment?.StorageCharge?.LastFreeDay || null,
          status
        })
        .eq("container_id", id);

      if (updateError) {
        console.error(`[ERROR] Failed to update container_id ${id}:`, updateError.message);
        continue;
      }

      updatedCount++;
    }

    console.log(`[CRON] ✅ Updated ${updatedCount} containers.`);
  } catch (err) {
    console.error('[Error] Cron update failed:', err.message);
  }
});