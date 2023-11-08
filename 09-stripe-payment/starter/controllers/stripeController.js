const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const stripeController = async (req, res) => {
  const { purchase, total_amount, shipping_fee } = req.body;

  // communicate with backend to make the prices are correct
  // because it is easy to manipulate price values on frontend
  const calculateOrderAmount = () => {
    return total_amount + shipping_fee;
  };

  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(),
    currency: "myr",
  });

  res.json({ clientSecret: paymentIntent.client_secret });
};

module.exports = stripeController;
