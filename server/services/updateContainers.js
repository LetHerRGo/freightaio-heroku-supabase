import initKnex from "knex";
import cron from "node-cron";
import cnTracking from './cnTracking.js';
import configuration from "../knexfile.js";

const knex = initKnex(configuration);

cron.schedule('30 * * * *', async () => {
  console.log(`[CRON] Updating container statuses at ${new Date().toISOString()}`);

  const cleanTime = (t) =>
  typeof t === "string" ? t.replace(/ [A-Z]{2,3}$/, "") : null;



  try {
    const containersToUpdate = await knex('containers').select('id', 'container_number').where('id', '>=', 8); // skip display rows

    let updatedCount = 0;

    for (const {id, container_number} of containersToUpdate) {
        const result = await cnTracking([container_number]);
        const equipment = result.ThirdPartyIntermodalShipment.Equipment?.[0];

        if (!equipment) {
            console.warn(`[WARN] No equipment data for ${container.container_number}`);
            continue;
        }

        const newETA = cleanTime(equipment?.ETA?.Time);
        const current = await knex("container_movements")
        .where("container_id", id)
        .select("ETA")
        .first();

        // Determine status
        const today = new Date().setHours(0, 0, 0, 0); const lastFreeDayRaw = equipment?.StorageCharge?.LastFreeDay || null;
        const lastFreeDay = lastFreeDayRaw ? new Date(lastFreeDayRaw).setHours(0, 0, 0, 0) : null;
 
        
        let status = "Pending";
         if (equipment.Event.Description === "OUT-GATE") { status = "Picked Up";
        } else if (lastFreeDay && lastFreeDay <= today) {
        status = "Need Attention";
        } else if (equipment.Destination.Station == equipment.Event.Location.Station) {
        status = "Arrived";
        } else if (newETA) {
        status = "In Transit";
        } 

        // check if ETA changed
        const etaChanged = (current?.ETA === null && newETA !== null) || (current?.ETA !== null && newETA === null) ||  (current?.ETA !== null && newETA !== null && new Date(current.ETA).getTime() !== new Date(newETA).getTime());

        if (etaChanged) {
            await knex("container_movement_logs").insert({    container_id: id,
            location: equipment?.Event?.Location?.Station || "N/A",
            event_description: equipment?.Event?.Description || "N/A",
            event_time: cleanTime(equipment?.Event?.Time),    customs_status: equipment?.CustomsHold?.Description || "N/A",
            destination: equipment?.Destination?.Station || "N/A",
            ETA: newETA,
            storage_last_free_day: equipment?.StorageCharge?.LastFreeDay || null,
            updated_at: new Date()
        });
        
        //monitor 
        console.log(`📝 Logged ETA change for container_id ${container_number}`);
    }

        await knex('container_movements').where('container_id',id).update({
            location: equipment.Event?.Location?.Station || "N/A",
            event_description: equipment.Event?.Description || "N/A",
            event_time: cleanTime(equipment?.Event?.Time),
            customs_status: equipment.CustomsHold?.Description || "N/A",
            destination: equipment.Destination?.Station || "N/A",
            ETA: cleanTime(equipment?.ETA?.Time),
            storage_last_free_day: equipment.StorageCharge?.LastFreeDay || null,
            status: status
        })

        updatedCount++;
    }
  } catch (err) {
    console.error('[Error] Cron update failed:', err.message);
  }
});
