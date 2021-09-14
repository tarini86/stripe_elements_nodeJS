// A reference to Stripe.js initialized with your real test publishable API key.
var stripe = Stripe("pk_test_51Ibux7KvDwnAxboxnWyNXjofsEp1sbFRiZ5B7UyIVrnfHNL3g7dLA3WiqiXB2BeLWpilhliZmrH7GI1ifKIfq0nb00mMd5R0XH");

// The items the customer wants to buy
const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get('item');

// The item the customer wants to buy
var purchase = {
  items: myParam
};

console.log(purchase);
calculateOrderAmount(myParam);
// document.addEventListener('DOMContentLoaded', (event) => {
// Disable the button until we have Stripe set up on the page
document.querySelector("button").disabled = true;
fetch("/create-payment-intent", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(purchase)
})
  .then(function(result) {
    return result.json();
  })
  .then(function(data) {
    var elements = stripe.elements();

    var style = {
      base: {
        color: "#32325d",
        fontFamily: 'Arial, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#32325d"
        }
      },
      invalid: {
        fontFamily: 'Arial, sans-serif',
        color: "#fa755a",
        iconColor: "#fa755a"
      }
    };

    var card = elements.create("card", { style: style });
    // Stripe injects an iframe into the DOM
    card.mount("#card-element");

    card.on("change", function (event) {
      // Disable the Pay button if there are no card details in the Element
      document.querySelector("button").disabled = event.empty;
      document.querySelector("#card-error").textContent = event.error ? event.error.message : "";
    });

    var form = document.getElementById("payment-form");
    form.addEventListener("submit", function(event) {
      event.preventDefault();
      // Complete payment when the submit button is clicked
      payWithCard(stripe, card, data.clientSecret);
    });
  });

//For display title and amount calculation 
function calculateOrderAmount(myParam) {
console.log(myParam + "hi");
  switch(String(myParam))
   {
    case '1':
      document.getElementById("txtTitle").innerHTML = "The Art of Doing Science and Engineering";
      document.getElementById("txtAmount").innerHTML = "Total is: $" + 1300/100;
      break;
    case '2':
      document.getElementById("txtTitle").innerHTML = "The Making of Prince of Persia: Journals 1985-1993";
      document.getElementById("txtAmount").innerHTML = "Total is: $" + 1500/100;
      break;

    case '3':
      document.getElementById("txtTitle").innerHTML = "Working in Public: The Making and Maintenance of Open Source";
      document.getElementById("txtAmount").innerHTML = "Total is: $" + 1800/100;
      break;

    default:
      document.getElementById("txtTitle").innerHTML = "Product not selected";
      document.getElementById("txtAmount").innerHTML = "Total is: $" + 100/100;     
      break;

    }
};

// Calls stripe.confirmCardPayment
// If the card requires authentication Stripe shows a pop-up modal to
// prompt the user to enter authentication details without leaving your page.
var payWithCard = function(stripe, card, clientSecret) {
  loading(true);
  stripe
    .confirmCardPayment(clientSecret, {
      receipt_email: document.getElementById('email').value,
      payment_method: {
        card: card
      }
    })
    .then(function(result) {
      if (result.error) {
        // Show error to your customer
        showError(result.error.message);
      } else {
        // The payment succeeded!
        orderComplete();
        retrieveCharge(clientSecret);
      }
    });
};

/* ------- UI helpers ------- */

// Disable Pay Now button when the payment is complete
var orderComplete = function() {
  loading(false);
  document.getElementById("submit").disabled = true;
  document.getElementById("email").style.display='none';
  document.getElementById("card-element").style.display='none';  
  document.getElementById("submit").style.display='none';
  document.getElementById("txtTitle").style.display='none';
  document.getElementById("txtAmount").style.display='none';

};


// retrieves the payment_intent JSON result
var retrieveCharge = function(clientSecret) {
  var piId, receipt_email, amount;

  stripe.retrievePaymentIntent(clientSecret)
  .then(function(result) {
    if (result.error) {
      // Show error to your customer
      showError(result.error.message);
    } else {
     //Check payment intent status to proceed
     if(result.paymentIntent.status == 'succeeded') {
        document.querySelector("button").disabled = true;

       console.log(JSON.stringify(result.paymentIntent.id));
      // console.log(result.paymentIntent.receipt_email);
       console.log(result);

      fetch("/retrieve-payment-intent?q="+result.paymentIntent.id) 
       .then(response => response.json())
        .then(data => { 
      
           document.getElementById("txtMessage").innerHTML =
          'Success! Thank you for the order. <br/><br/>Here is the payment intent Id ' + result.paymentIntent.id + ' and charge Id ' + data.chargeId + 
          ' for your reference.<br /> <br />You should have recieved the e-book <i>' + data.title + '</i> in your e-mail at ' 
          + result.paymentIntent.receipt_email +'. <br/> <br/>The total amount you paid is $' + 
            result.paymentIntent.amount/100+ '.';
     });
     }
      
    }
  });
}

// Show the customer the error from Stripe if their card fails to charge
var showError = function(errorMsgText) {
  loading(false);
  var errorMsg = document.querySelector("#card-error");
  errorMsg.textContent = errorMsgText;
  setTimeout(function() {
    errorMsg.textContent = "";
  }, 4000);
};

// Show a spinner on payment submission
var loading = function(isLoading) {
  if (isLoading) {
    // Disable the button and show a spinner
    document.querySelector("button").disabled = true;
    document.querySelector("#spinner").classList.remove("hidden");
    document.querySelector("#button-text").classList.add("hidden");
  } else {
    document.querySelector("button").disabled = false;
    document.querySelector("#spinner").classList.add("hidden");
    document.querySelector("#button-text").classList.remove("hidden");
  }
};
