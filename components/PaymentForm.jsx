import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

function PaymentForm({ amount, clientSecret, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();

  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return; // Stripe ещё не загружен
    }

    setProcessing(true);

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (error) {
      setError(error.message);
      setProcessing(false);
    } else if (paymentIntent.status === "succeeded") {
      setProcessing(false);
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      {error && <div style={{ color: "red" }}>{error}</div>}
      <button type="submit" disabled={processing}>
        {processing ? "Оплата..." : `Оплатить ${amount} ₽`}
      </button>
    </form>
  );
}

export default PaymentForm;