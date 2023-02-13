require("dotenv").config(); // enables loading .env vars
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// Import, then initiate Magic instance for server-side methods
const { Magic } = require("@magic-sdk/admin");
const magic = new Magic(process.env.MAGIC_SECRET_KEY);

// Import & initiate Stripe instance
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Allow requests from client-side
app.use(cors({ origin: process.env.CLIENT_URL }));

// Route to validate the user's DID token
app.post("/login", async (req, res) => {
  try {
    const didToken = req.headers.authorization.substr(7);
    await magic.token.validate(didToken);
    res.status(200).json({ authenticated: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add the user to your list of customers
// Then create a PaymentIntent to track the customer's payment cycle
app.post("/create-payment-intent", async (req, res) => {
  const { email } = req.body;

  const paymentIntent = await stripe.customers
    .create({
      email,
    })
    .then((customer) =>
      stripe.paymentIntents
        .create({
          amount: 50000, // Replace this constant with the price of your service
          currency: "usd",
          customer: customer.id,
        })
        .catch((error) => console.log("error: ", error))
    );

  res.send({
    clientSecret: paymentIntent.client_secret,
    customer: paymentIntent.customer,
  });
});

// Update the customer's info to reflect that they've
// paid for lifetime access to your Premium Content
app.post("/update-customer", async (req, res) => {
  const { customerID } = req.body;

  const customer = await stripe.customers.update(customerID, {
    metadata: { lifetimeAccess: true },
  });

  res.send({
    customer,
  });
});

// Collect the customer's information to help validate
// that they've paid for lifetime access
app.post("/validate-customer", async (req, res) => {
  const { email } = req.body;

  const customer = await stripe.customers.list({
    limit: 1,
    email,
  });

  res.send({
    customer: customer.data,
  });
});

/* For heroku deployment */
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const listener = app.listen(process.env.PORT || 8080, function () {
  console.log("Listening on port " + listener.address().port);
});
