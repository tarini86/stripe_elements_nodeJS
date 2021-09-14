# Accept a Card Payment

This is a simple [Stripe Elements](https://stripe.com/docs/payments/accept-a-payment?platform=web&lang=php&client=html&integration=checkout&ui=elements) implementation.

### Solution Design: 

This demo is written in Javascript (Node.js) with the [Express framework](https://expressjs.com/). You'll need to retrieve a set of testmode API keys from the Stripe dashboard (you can create a free test account [here](https://dashboard.stripe.com/register)) to run this locally.

To simplify this project, I am also not using any database here, either. Instead `server.js` includes a simple switch statement to read the GET params for `item`. 

It uses Stripe's Card Element, which enables you to collect the card information all within the Element. It includes a dynamically-updating card brand icon as well as inputs for the number, expiry, CVC, and postal code. 


### Core Resources:
1. Payment Intent
2. Charges

Stripe's create PaymentIntent API is used to create the payment intent at the time of card element load. Parameters amount, currency, order_id and title are passed in the API request. 

Stripe retrieve PaymentIntent API is used to get order's payment intent id, amount, charge Id and title via an AJAX call using secret key. 

stripe.confirmCardPayment() and stripe.retrievePaymentIntent() client functions are used to confirm and retrieve the payment intent, respectively. 

Stripe secret_key is stored and accessed from a .env file. publishable_key is not stored in this file, as it is not required. 

I am retrieving 5 variables at payment intent success, they are: payment intent id, charge id, product title, buyer email and product total (charge). payment intent id, amount and reciept email are retrieved from a JS callback function (client side) using the client secret. charge id and title are retrieved using secret key (server side), due to these values not surfaced client side via clientsecret. 

## Running the sample

1. Build the server

```
npm install
```

2. Update .env file with your STRIPE_SECRET_KEY at the root. Replace YOUR_PUBLISHABLE_KEY with your PUBLISHABLE_KEY in public -> client.js file.


3. Run the server

```
npm run
npm start
```

4. Go to [http://localhost:8000/](http://localhost:8000)

### Testing: 

Use these test cards to test your integration. Once you are ready, switch the test API keys with live API keys.

Successful payment - 4242424242424242

Failed payment - 4000000000009995

Requires authentication - 4000002500003155

For an extended lists of test cards, refer: https://stripe.com/docs/testing#cards