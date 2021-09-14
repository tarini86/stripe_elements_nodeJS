const express = require("express");
const app = express();
const { v4: uuidv4 } = require('uuid');

// This is your real test secret API key.
const stripe = require("stripe")("sk_test_51Ibux7KvDwnAxboxjAGs7xQAw2G2zdWpsjHZt7PtzcgBV8MiIwWLE2TKqNGCJaZGLFjOtFnEqtITvKaqMBxYkn5G00pND6yZrG");
let title;


app.use(express.static("public"));
app.use(express.json());

const calculateOrderAmount = items => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client

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

  //console.log(items);
  //return items;
};

app.post("/create-payment-intent", async (req, res) => {
  const items  = req.body;
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "usd",
    metadata: {'order_id': uuidv4(), 'title':title}
  });

  res.send({
    clientSecret: paymentIntent.client_secret
  });
});

app.get("/retrieve-payment-intent", async (req, res) => {
  //const pi = JSON.parse(req.body);
  console.log(req.query.q);
  // Create a PaymentIntent with the order amount and currency
  const retrieve_paymentIntent = await stripe.paymentIntents.retrieve(
    req.query.q
  );
console.log(retrieve_paymentIntent);
  res.send({
    chargeId: retrieve_paymentIntent.charges.data[0].id,title: retrieve_paymentIntent.metadata.title
  });
});

 app.listen(8000, () => console.log('Node server listening on port 8000!'));
