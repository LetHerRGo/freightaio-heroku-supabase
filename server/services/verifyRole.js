import { supabase } from "./supabase.js";
const verifyRole = (requiredRole) => {
    return async (req, res, next) => {
        try {
            if (!req.user?.id) {
                return res.status(401).json({message: "Usernot authenticated."})
            }
            const uuid = req.user.id;

            // Fetch role from your 'profiles' table
            const { data: profile, error } = await supabase.from("profiles").select("role").eq("id", uuid).single();

            if (error) {
            console.error("Error fetching user role:", error.message);
            return res.status(500).json({ message: "Failed to retrieve user role." });
            }

            if (!profile) {
            return res.status(404).json({ message: "User profile not found." });
            }

            // Check if user's role is allowed
            if (!requiredRole.includes(profile.role)) {
                return res.status(403).json({
                message: "Permission denied: You do not have the required role.",
                });
            }
            req.user.role = profile.role;
            next();       
        } catch (err) {
            return res.status(500).json({message: "Internal server error."})
        }
    }
}

export default verifyRole;