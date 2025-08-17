import express from "express";
import Order from "../models/Order.js";
import { changeStatus, getMyOrders, makeOrder } from "../controllers/orders.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";
// ------------------
import dotenv from "dotenv";

dotenv.config();

const orderRoutes = express.Router();

// ---------------------

const storeItems = new Map([
  [1, { priceInCents: 200, name: "Learn React Today" }],
  [2, { priceInCents: 2, name: "Learn CSS Today" }],
])

orderRoutes.post("/create-checkout-session", async (req, res) => {
  try {
    // const item = req.body;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: req.body.items.map(item => {
        const storeItem = storeItems.get(item.id)
        return {
          price_data: {
            currency: "inr",
            product_data: {
              name: storeItem.name,
            },
            unit_amount: storeItem.priceInCents,
          },
          quantity: item.quantity,
        }
      }),
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    })
    res.json({ url: session.url })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})



// -----------------



orderRoutes.post("/make-order", protectedRoute , makeOrder);
orderRoutes.get("/", protectedRoute, getMyOrders);
orderRoutes.put("/:id", protectedRoute, changeStatus);

export default orderRoutes;