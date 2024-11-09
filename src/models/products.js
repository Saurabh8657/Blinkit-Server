import mongoose, { disconnect } from "mongoose";


const productSchema = new mongoose.Schema({
    name: {type: String, required: true},
    image: {type: String, required: true},
    price: {type: Number, required: true},
    discountPrice: {type: Number, required: true},
    quantity: {type: Number, required: true},
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    }
})

const Category = mongoose.model("Category", categorySchema)

export default Category
