import express from "express";
import verifyToken from "../services/verifyToken.js";
import verifyRole from "../services/verifyRole.js";
import cnTracking from "../services/cnTracking.js"

const router = express.Router();

router.post('/', verifyToken, verifyRole('operator'), async(req, res) => {
    const {ctnrNums} = req.body;
    

//validate if container numbers are provided and in the correct format
    if (!ctnrNums || ctnrNums.length === 0) {
    return res.status(400).json({ message: 'Invalid or missing container numbers.' });
    }

// Regex to validate container number format (4 letters + 7 digits)
    const extractedContainers = ctnrNums.match(/\b[A-Z]{4}\d{7}\b/g);


    try {
        
        const data = await cnTracking(extractedContainers);
        const equipmentList = data.ThirdPartyIntermodalShipment.Equipment.map((equipment) => {
            return {
                id: equipment.EquipmentId || "N/A",
                status:  "N/A", // put N/A for now, it will be updated by updateContainers.js
                location: equipment.Event?.Location?.Station || "Unknown",
                eventTime: equipment.Event?.Time || "N/A",
                eventDescription: equipment.Event?.Description || "N/A",
                destination: equipment.Destination?.Station || "N/A",
                ETA: equipment.ETA?.Time || "N/A",
                customsStatus: equipment.CustomsHold?.Description || "N/A",
                storageLastFreeDay: equipment.StorageCharge?.LastFreeDay || "N/A",
            }
        });
        res.json({
            equipmentList: equipmentList
        })
    } catch(error) {
        console.log(error);
        res.status(400).json({message: error.message});
    }
})

export default router;