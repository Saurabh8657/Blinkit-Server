import jwt from "jsonwebtoken"



export const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization']
        if ( !authHeader || !authHeader.startsWith("Bearer ") ) {
            return res.status(401).send({message: "No token provided"})
        }
        const token = authHeader.split(" ")[1]
        const decoded = jwt.verify(token, process.env.ACESS_TOKEN_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        return  res.status(403).send({message: "Invalid or expired token"})
    }
}