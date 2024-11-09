import AdminJS from "adminjs";
import AdminJSFastify from "@adminjs/fastify";
import * as AdminJSMongoose from "@adminjs/mongoose"
import * as Models from "../models/index.js"
import { authenticate, COOKIE_PASSWORD, sessionStore } from "./config.js";
import { dark, light, noSidebar } from "@adminjs/themes";

AdminJS.registerAdapter(AdminJSMongoose)

export const admin = new AdminJS({
    resources: [
        {
            resource: Models.Customer,
            options: {
                listProperties: ["phone", "role", "isActive"],
                filterProperties: ["phone", "role", "isActive"],
            }
        },
        {
            resource: Models.DeliveryPartner,
            options: {
                listProperties: ["email", "role", "isActive"],
                filterProperties: ["email", "role"],
            }
        },
        {
            resource: Models.Admin,
            options: {
                listProperties: ["email", "role", "isActive"],
                filterProperties: ["email", "role"],
            }
        },
        {
            resource: Models.Branch
        }
    ],
    branding: {
        companyName: "Blinkit",
        logo: "https://i.ibb.co/4b2r0sX/logo.png",
        favicon: "https://i.ibb.co/4b2r0sX/logo.png",
        logo: "https://i.ibb.co/4b2r0sX/logo.png",
        copyright: "Copyright © 2023 Blinkit",
        productName: "Blinkit",
        withMadeWithLove: true,
    },
    availableThemes: [dark, light, noSidebar],
    defaultTheme: light.id,
    rootPath: "/admin",
})


export const buildAdminRouter = async (app) => {
    await AdminJSFastify.buildAuthenticatedRouter(
        admin, 
        {
        authenticate,
        cookiePassword: COOKIE_PASSWORD,
        cookieName: "adminjs",
        }, 
        app, 
        {
            store: sessionStore,
            saveUnintailable: true,
            cookiePassword: process.env.COOKIE_PASSWORD,
            secret: COOKIE_PASSWORD,
            cookie: {
                httpOnly: process.env.NODE_ENV === "production",
                secure: process.env.NODE_ENV === "production"
            }
        }
    )
}