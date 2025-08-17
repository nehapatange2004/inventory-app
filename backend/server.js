import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.routes.js";
import Product from "./models/Product.js";
import User from "./models/User.js";
import Asset from "./models/Asset.js";
import cors from "cors"
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/order.routes.js";
dotenv.config();
const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // Vite dev server URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true // if you want cookies to be sent
}));
app.use(express.json());
app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/orders", orderRoutes)

const PORT = process.env.PORT || 5000;
const MONGO_DB_URI = process.env.MONGO_DB_URI



mongoose.connect(MONGO_DB_URI).then(async () => {
    console.log("Mongo DB connected!")
}).catch((err) => {
    console.log(`can't connect mongoDB: `, err)
})





app.get("/", async (req, res) => {
    res.send({ "message": "Hello from /" })
})
app.listen((PORT), async (req, res) => {
    console.log(`Server started at PORT: ${PORT}`)
//     const products =[
//   {
//     name: "Margherita Pizza",
//     category: "Pizza",
//     imgURL: "https://example.com/images/margherita.jpg",
//     quantity: 15,
//     price: 299,
//     expiryDate: new Date("2025-08-20"),
//   },
//   {
//     name: "Veg Biryani",
//     category: "Rice",
//     imgURL: "https://example.com/images/veg-biryani.jpg",
//     quantity: 10,
//     price: 199,
//     expiryDate: new Date("2025-08-18"),
//   },
//   {
//     name: "Chicken Shawarma Roll",
//     category: "Wraps",
//     imgURL: "https://example.com/images/chicken-shawarma.jpg",
//     quantity: 25,
//     price: 149,
//     expiryDate: new Date("2025-08-15"),
//   },
//   {
//     name: "Cold Coffee",
//     category: "Beverages",
//     imgURL: "https://example.com/images/cold-coffee.jpg",
//     quantity: 30,
//     price: 99,
//     expiryDate: new Date("2025-08-30"),
//   },
//   {
//     name: "Chocolate Brownie",
//     category: "Desserts",
//     imgURL: "https://example.com/images/chocolate-brownie.jpg",
//     quantity: 20,
//     price: 120,
//     expiryDate: new Date("2025-08-25"),
//   }
// ];
    try {
        // await Product.insertMany(products);
        const assest = new Asset()
    } catch (err) {
        console.log("err:", err);
    }

})
