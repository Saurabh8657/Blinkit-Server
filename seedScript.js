import mongoose from "mongoose"
import "dotenv/config.js"
import { Category, Product } from "./src/models/index.js"
import { categories, products } from "./seedData.js"





async function seedDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URI)

        await Product.deleteMany({})
        await Category.deleteMany({})

        const categoryDocs = await Category.insertMany(categories)
        const categoryMap = categoryDocs.reduce((map, category) =>{
            map[category.name] = category._id
            return map
        }, {} )

        const productWithCategoryIds = products.map( product => {
            return {...product, category: categoryMap[product.category]}
        })

        await Product.insertMany(productWithCategoryIds)
        console.log("Products inserted successfully")

    } catch (error) {
        console.log(`Error in Seeding database ${error}`)
    } finally {
        mongoose.connection.close()
    }
}

seedDatabase()