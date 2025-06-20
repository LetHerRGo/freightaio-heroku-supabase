import initKnex from "knex";
import express from "express";
import jwt from "jsonwebtoken";
import configuration from "../knexfile.js";
import authenticateUser from "../services/authService.js";

const knex = initKnex(configuration);
const router = express.Router();

router.post('/', async (req, res) => {
    const {username, password} = req.body;
    
    try {
        const token = await authenticateUser(username, password);
        res.json({message: 'Login successful', token});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

export default router;