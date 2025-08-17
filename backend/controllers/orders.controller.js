import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Stripe from "stripe";

const stripe = Stripe(process.env.STRIPE_PRIVATE_KEY)


// ----------------
export const makeOrder = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(500).send({ "message": "No data recived" })
        }
        const product = await Product.findById(req.body.items[0].productId);
        console.log("Product found: ", product)
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: req.body.items.map(item => {

                return {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: product.name,
                        },
                        unit_amount: product.price*100,
                    },
                    quantity: item.quantity,
                }
            }),
            customer_email: req.user.email,
            success_url: `${process.env.CLIENT_URL}/success`,
            cancel_url: `${process.env.CLIENT_URL}/error`,
        })




        const newOrder = new Order({
            customer: req.user._id,
            products: [
                {
                    product: req.body.items[0].productId,
                    quantity: req.body.items[0].quantity
                }
            ],
            totalAmount: req.body.items[0].quantity * product.price

        });
        await newOrder.save();
        res.json({ url: session.url })
        // return res.send(newOrder);
    } catch (err) {
        console.log(`error: ${err}`);
        return res.status(500).send({ "message": "Internal server error", "error": err })
    }
}
export const getMyOrders = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            const allOrders = await Order.find({ customer: req.user._id }).populate("products.product");
            return res.send(allOrders);
        }

        const allOrders = await Order.find().populate("products.product");
        return res.send(allOrders);

    } catch (err) {
        console.log(`error: ${err}`);
        res.status(500).send({ "message": "Internal server error", "error": err })
    }
}
export const changeStatus = async (req, res) => {
    try {

        if (req.user.role !== "admin") {
            // console.log("No order found!");
            return res.send({ message: "Not authorized" })
        }
        if (!req.body | req.body.status) {
            // console.log("No order found!");
            return res.send({ message: "No body received" })
        }
        const order = await Order.findById(req.params.id);

        if (!order) {
            console.log("No order found!");
            return res.send({ message: "No such order found" })
        }
        order.status = req.body.status;
        order.save();



    } catch (err) {
        console.log(`error: ${err}`);
        res.status(500).send({ "message": "Internal server error", "error": err })
    }
}



