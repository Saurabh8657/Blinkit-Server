import jwt from "jsonwebtoken"
import { Customer, DeliveryPartner } from "../models"



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


export const fetchUser = async (req, res) => {
    try {
        const { userId, role } = req.user
        let user
        if ( role === "Customer" ) {
            user = await Customer.findById({ _id: userId })
        } else if ( role === "DeliveryPartner" ) {
            user = await DeliveryPartner.findById({ _id: userId })
        } else {
            return res.status(400).send({ message: "Invalid role" })
        }
        if (!user) {
            return res.status(403).send({ message: "Invalid user" })
        }
        return res.status(200).send({ message: "User fetched successfully", user })
    } catch (error) {
        return res.status(400).send({ message: "Invalid user", error })
    }
}