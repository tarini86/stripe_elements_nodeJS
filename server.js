const express = require("express");
require('dotenv').config({path:'./.env'});
const app = express();
const { v4: uuidv4 } = require('uuid');

// This is your real test secret API key.
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
let title;


app.use(express.static("public"));
app.use(express.json());

// Calculate the order total on the server to prevent
// people from directly manipulating the amount on the client
const calculateOrderAmount = items => {

var string = JSON.stringify(items);
var objectValue = JSON.parse(string);
var itemValue = objectValue['items'];

  switch(itemValue) 
   {
    case '1':
      title = "The Art of Doing Science and Engineering";
      return 1300;     
    case '2':
      title = "The Making of Prince of Persia: Journals 1985-1993";
      return 1500;
    case '3':
      title = "Working in Public: The Making and Maintenance of Open Source";
      return 1800;  
    default:
      return 0;
      break;
    }
};

// Create a PaymentIntent with the order amount and currency
app.post("/create-payment-intent", async (req, res) => {
  const items  = req.body;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "usd",
    metadata: {'order_id': uuidv4(), 'title':title}
  });

  res.send({
    clientSecret: paymentIntent.client_secret
  });
});


// Retrieve a PaymentIntent using secret key to surface chargeId and title to the customer
app.get("/retrieve-payment-intent", async (req, res) => {
  const retrieve_paymentIntent = await stripe.paymentIntents.retrieve(
    req.query.q
  );
console.log(retrieve_paymentIntent);
  res.send({
    chargeId: retrieve_paymentIntent.charges.data[0].id,title: retrieve_paymentIntent.metadata.title
  });
});

// Listen at 8000!
app.listen(8000, () => console.log('Node server listening on port 8000!'));
