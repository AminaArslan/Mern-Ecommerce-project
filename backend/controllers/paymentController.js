import stripe from "../config/stripe.js";
import Order from "../models/Order.js";

// ---------------- Create Stripe Checkout Session ----------------
export const createCheckoutSession = async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId).populate("orderItems.product");

  if (!order) return res.status(404).json({ message: "Order not found" });

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: order.orderItems.map(item => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: item.price * 100, // cents
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/payment-success?orderId=${order._id}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-fail?orderId=${order._id}`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Stripe session creation failed" });
  }
};

// ---------------- Webhook to mark order as paid ----------------
export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      // Find order by ID from success_url query
      const orderId = new URL(session.success_url).searchParams.get("orderId");
      const order = await Order.findById(orderId);
      if (order) {
        order.status = "paid";
        order.isPaid = true;
        order.paidAt = Date.now();
        await order.save();
      }
    }

    res.json({ received: true });
  } catch (err) {
    console.log(err);
    res.status(400).send(`Webhook error: ${err.message}`);
  }
};
