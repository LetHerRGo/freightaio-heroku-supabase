import initKnex from "knex";
import express from "express";
import configuration from "../knexfile.js";
import verifyToken from "../services/verifyToken.js";
import verifyRole from "../services/verifyRole.js";

const knex = initKnex(configuration);
const router = express.Router();

router.get('/:containerId', verifyToken, verifyRole('operator'), async (req, res) => {
    const {containerId} = req.params;

    try {
        const logs= await knex("container_movement_logs")
        .where("container_id", containerId)
        .orderBy("updated_at", "desc");

        if(logs.length === 0) {
            return res.status(404).json({message:"No logs found for this container."})
        }

        res.json(logs);
    } catch (error) {
        res.status(500).json({message: "Faild to fetch logs."})
    }

})

export default router;