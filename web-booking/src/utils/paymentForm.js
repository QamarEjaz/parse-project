const config = {
  // Initialize the payment form elements

  //TODO: Replace with your sandbox application ID
  applicationId: process.env.REACT_APP_SQUARE_APLLICATION_ID,
  inputClass: 'sq-input',
  autoBuild: false,
  // Customize the CSS for SqPaymentForm iframe elements
  inputStyles: [
    {
      fontSize: '14px',
      // lineHeight: "30px",
      padding: '12px',
      placeholderColor: '#a0a0a0',
      backgroundColor: 'white',
    },
  ],
  // Initialize the credit card placeholders
  cardNumber: {
    elementId: 'sq-card-number',
    placeholder: 'Card Number',
  },
  cvv: {
    elementId: 'sq-cvv',
    placeholder: 'CVV',
  },
  expirationDate: {
    elementId: 'sq-expiration-date',
    placeholder: 'MM/YY',
  },
  postalCode: {
    elementId: 'sq-postal-code',
    placeholder: 'Postal',
  },
  // SqPaymentForm callback functions
  callbacks: {
    /*
     * callback function: cardNonceResponseReceived
     * Triggered when: SqPaymentForm completes a card nonce request
     */
    cardNonceResponseReceived: function (errors, nonce, cardData) {
      if (errors) {
        // Log errors from nonce generation to the browser developer console.
        console.error('Encountered errors:');
        errors.forEach(function (error) {
          alert(error.message);
        });
        // alert(
        //   "Encountered errors, check browser developer console for more details"
        // );
        return;
      }

      // alert(`The generated nonce is:\n${nonce}`);

      fetch('https://dentrix-api.herokuapp.com/square/cards?isTesting=true', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nonce: nonce,
          email: document.getElementById('card-email').value,
          cardholderName: cardData.card_holder_name
            ? cardData.card_holder_name
            : 'THDC Patient',
          cardBrand: cardData.card_brand,
          last4: cardData.last_4,
          expMonth: cardData.exp_month,
          expYear: cardData.exp_year,
          // cardType: cardData.card_type ? cardData.card_type : "PREPAID",
          // prepaidType: cardData.prepaid_type
          //   ? cardData.prepaid_type
          //   : "PREPAID",
        }),
      })
        .catch((err) => {
          alert('Network error: ' + err);
        })
        .then((response) => {
          if (!response.ok) {
            return response
              .text()
              .then((errorInfo) => Promise.reject(errorInfo));
          }
          return response.text();
        })
        .then((data) => {
          alert(
            'Payment complete successfully!\nCheck browser developer console form more details'
          );
        })
        .catch((err) => {
          console.error(err);
          alert(
            'Payment failed to complete!\nCheck browser developer console form more details'
          );
        });
    },
  },
};

export default config;
