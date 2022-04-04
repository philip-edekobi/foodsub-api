const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        return res
                .status(403)
                .json({ error: "You do not have permission to access this resource" });
    }
    try {
        const data = await jwt.verify(token, process.env.TOKEN_KEY)
        const { email } = data;
        req.email = email;
        next();
    } catch (error) {
        return res.status(500).json({ error: "Some internal server error occured. Try again" })
    }
}

module.exports = authMiddleware;