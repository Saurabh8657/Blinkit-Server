import "dotenv/config"
import fastifySession from "@fastify/session"
import ConnectMongoDBSession from "connect-mongodb-session"


const MOongoDBStore = ConnectMongoDBSession(fastifySession)

export const sessionStore = new MOongoDBStore({
    uri: process.env.MONGO_URI,
    collection: "sessions"
})

sessionStore.on("error", (err) => {
    console.log("MongoDB session store error: ", err)
})

export const authenticate  = async (email, password) => {
    if ( email && password) {
        const user = await Admin.findOne({email: email})
        if ( !user ) {
            return null
        }
        if (user.password === password) {
            return Promise.resolve({email: email, password: password, role: user.role})
        } else {
            return null
        }
    } else {
        return null
    }
}

export const PORT = process.env.PORT || 3000
export const COOKIE_PASSWORD = process.env.COOKIE_PASSWORD