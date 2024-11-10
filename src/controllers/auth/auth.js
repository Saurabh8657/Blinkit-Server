import jwt from "jsonwebtoken"
import { Customer, DeliveryPartner } from "../../models"



export const generateToken = (user) => {
    const accessToken = jwt.sign(
        { userID: user._id, role: user.role },
        process.env.ACESS_TOKEN_SECRET,
        { expiresIn: "1d" }
    )

    const refreshToken = jwt.sign(
        { userID: user._id, role: user.role },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
    )

    return { accessToken, refreshToken }
}

export const loginCustomer = async (req, res, next) => {
    try {
        const { phone } = req.body
        let customer = await Customer.findOne({ phone: phone })

        if (!customer) {
            customer = new Customer({ name: "", phone: phone, role: "Customer", isActive: true })
            await customer.save()
        }

        const { accessToken, refreshToken } = generateToken(customer)
        return res.status(200).send({
            message: customer ? "Login successful" : "Customer created successfully",
            customer: customer,
            accessToken, 
            refreshToken
        })

    } catch (error) {
        return res.status(400).send({ message: "Invalid credentials", error })
    }
}


export const loginDeliveryPartner = async (req, res, next) => {
    try {
        const { email, password } = req.body
        let deliveryPartner = await DeliveryPartner.findOne({ email })

        if (!deliveryPartner) {
            return res.status(400).send({ message: "Delivery Partner not found" })
        }

        const isMatch = password === deliveryPartner.password
        if (!isMatch) {
            return res.status(400).send({ message: "Invalid password" })
        }

        const { accessToken, refreshToken } = generateToken(deliveryPartner)
        return res.status(200).send({
            message: "Login successful",
            deliveryPartner,
            accessToken,
            refreshToken
        })

    } catch (error) {
        return res.status(400).send({ message: "Invalid credentials", error })
    }
}


export const refreshToken = async (req, res) => {
    const { refreshToken } = req.body
    if (!refreshToken) {
        return res.status(400).send({ message: "Refresh token is required" })
    }
    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        let user

        if ( decoded.role === "Customer" ) {
            user = await Customer.findById({ _id: decoded.userID })
        } else if ( decoded.role === "DeliveryPartner" ) {
            user = await DeliveryPartner.findById({ _id: decoded.userID })
        } else if ( decoded.role === "Admin" ) {
            user = await Admin.findById({ _id: decoded.userID })
        } else {
            return res.status(400).send({ message: "Invalid role" })
        }

        if (!user) {
            return res.status(403).send({ message: "Invalid user" })
        }
        const { accessToken, refreshToken: newRefreshToken } = generateToken(user)
        return res.status(200).send({
            message: "Refresh token successful",
            user,
            accessToken,
            refreshToken: newRefreshToken
        })
    } catch (error) {
        return res.status(400).send({ message: "Invalid refresh token", error })
    }
}