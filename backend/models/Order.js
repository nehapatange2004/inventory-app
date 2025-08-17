import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true }
      }
    ],
    totalAmount: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"], 
      default: "pending" 
    }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
