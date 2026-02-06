import stripe from "../config/stripe.js";
import Order from "../models/Order.js";

// ---------------- Create Stripe Checkout Session ----------------
export const createCheckoutSession = async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId).populate("orderItems.product");

  if (!order) return res.status(404).json({ message: "Order not found" });

  // Stop duplicate payments
  if (order.paymentStatus === "paid") {
    return res.status(400).json({ message: "Order already paid" });
  }

  try {
    const baseServerUrl = process.env.SERVER_URL;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: order.orderItems.map(item => {
        let imageUrl = item.product?.image || item.image || "";

        //  If image is stored like "/uploads/abc.jpg", make it full URL
        if (imageUrl && !imageUrl.startsWith("http")) {
          imageUrl = `${baseServerUrl}${imageUrl}`;
        }

        //  Stripe only accepts valid https URLs
        const imagesArray = imageUrl.startsWith("http") ? [imageUrl] : [];

        return {
          price_data: {
            currency: "pkr",
            product_data: {
              name: item.name,
              images: imagesArray, // ✅ Safe images
            },
            unit_amount: Math.round(item.price * 100), // Stripe needs cents
          },
          quantity: item.quantity,
        };
      }),
      mode: "payment",
      metadata: {
        orderId: order._id.toString(), // ✅ Keep orderId in metadata
      },
      success_url: `${process.env.CLIENT_URL}/payment-success?orderId=${order._id}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-fail?orderId=${order._id}`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error(" FULL STRIPE ERROR:", error);
    res.status(500).json({
      message: "Stripe session creation failed",
      error: error.message
    });
  }

};

// ---------------- Webhook to mark order as paid ----------------
export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body, // Make sure you are using express.raw() in your route
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    console.log("Webhook event received:", event.type);
    console.log("Event data:", event.data.object);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const orderId = session.metadata.orderId;
      const order = await Order.findById(orderId);

      if (order && order.paymentStatus !== "paid") {
        order.paymentStatus = "paid";
        order.isPaid = true;
        order.paidAt = new Date();
        order.status = "paid";

        await order.save();
        console.log(`Order ${orderId} marked as paid via Stripe.`);
      }
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error("Stripe webhook error:", err);
    res.status(400).send(`Webhook error: ${err.message}`);
  }
};