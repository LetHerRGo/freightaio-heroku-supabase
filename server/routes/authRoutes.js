import express from "express";
import { supabase } from "../services/supabase.js"

const router = express.Router();

router.post('/', async (req, res) => {
    const {email, password} = req.body;
    
    try {
        const {data, error} = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        })
        if (error) {
            return res.status(401).json({ message: error.message})
        }
        
        
        res.json({token: data.session.access_token});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

export default router;