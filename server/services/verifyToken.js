import {supabase} from "./supabase.js"

const verifyToken = async (req, res, next) => {

    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Missing or invalid Authorization header." });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token is required for authentication." });
    }

    
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      return res.status(401).json({ message: "Invalid or expired token." });
    }

    
    req.user = data.user;
    next();
  } catch (err) {
    console.error("verifyToken error:", err);
    res.status(500).json({ message: "Internal server error during token verification." });
  }
    
}

export default verifyToken;