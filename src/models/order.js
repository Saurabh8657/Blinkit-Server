import mongoose from "mongoose";
import { DeliveryPartner } from "./user.js";


const orderSchema = new mongoose.Schema({
    orderId: { type: String, required: true, unique: true },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true
    },
    deliveryPartner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DeliveryPartner",
        required: true
    },
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch",
        required: true
    },
    items: [
        {
            id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
            item: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
            count: { type: Number, required: true }
        }
    ],
    count: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    deliveryLocation: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
        address: { type: String }
    },
    pickupLocation: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
        address: { type: String }
    },
    deliveryPersonLocation: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
        address: { type: String },
    },
    status: {
        type: String,
        enum: ["available", "confirmed", "arriving", "delivered", "cancelled"],
        default: "available"
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    totalPrice: { type: Number, required: true }
})

const getNextSequenceValue = async ( sequenceName ) => {
    const sequeneceDocument = await Counter.findOneAndUpdate(
        { name: sequenceName },
        { $inc: { sequence_value: 1 } },
        { new: true, upsert: true }
    )
    return sequeneceDocument.sequence_value
}

orderSchema.pre("save", async function (next) {  
    // Use function instead of arrow function to access `this`
    if (this.isNew) {
        const sequenceValue = await getNextSequenceValue("orderId");
        this.orderId = `ORDER-${sequenceValue.toString().padStart(5, "0")}`;
    }
    next();
});



const Order = mongoose.model("Order", orderSchema)

export default Order