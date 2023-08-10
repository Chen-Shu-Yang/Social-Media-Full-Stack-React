import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
    try {
        let token = req.header("Authorization");

        if (!token || !token.includes('Bearer')) {
            return res.status(403).send("Access Denied");
        }

        // Gets everything after "Bearer "
        token = token.slice(7, token.length).trimLeft();

        // Verify Token
        const verify = jwt.verify(token, process.env.JWT_SECRET);
        console.log(verify);
        req.user = verify;

        // Allows the code to procceed to the next function in the API
        next();

    } catch (err) {
        res.status(401).send({ error: err.message });
    }
}