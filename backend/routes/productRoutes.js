import express from "express";
import { deleteProduct, editProduct, getAllListedProducts, getProductById, imgPreview, listProduct } from "../controllers/products.controller.js";
import fs from "fs";
import multer from "multer";
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            const uploadPath = 'uploads';

            // Make folder if it doesn't exist
            fs.mkdirSync(uploadPath, { recursive: true });
            cb(null, uploadPath); // callback function to save file at uploads folder to save files (create if not exists)
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + '-' + file.originalname);   //callback function to name the file
        }
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit (optional)
});




const productRoutes = express.Router();

productRoutes.get("/", getAllListedProducts);
productRoutes.post("/", upload.single("file"), listProduct);
productRoutes.put("/edit/:id", upload.single("file"), editProduct);
productRoutes.get("/preview/:id", imgPreview);
productRoutes.get("/single/:id", getProductById);
productRoutes.delete("/:id", deleteProduct);

export default productRoutes;