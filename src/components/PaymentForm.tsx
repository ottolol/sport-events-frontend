import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

interface PaymentFormProps {
  amount: number;
  clientSecret: string;
  onSuccess: () => void;
}

function PaymentForm({ amount, clientSecret, onSuccess }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError("Stripe ещё не загружен");
      return;
    }

    setProcessing(true);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError("Элемент карты не найден");
      setProcessing(false);
      return;
    }

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (error) {
        setError(error.message || "Ошибка оплаты");
        setProcessing(false);
      } else if (paymentIntent?.status === "succeeded") {
        setProcessing(false);
        onSuccess();
      }
    } catch (err) {
      setError("Ошибка подтверждения платежа");
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "auto" }}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#424770",
              "::placeholder": {
                color: "#aab7c4",
              },
            },
            invalid: {
              color: "#9e2146",
            },
          },
        }}
      />
      {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}
      <button
        type="submit"
        disabled={processing}
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "#6772e5",
          color: "white",
          border: "none",
          borderRadius: "4px",
          fontSize: "16px",
          marginTop: "10px",
        }}
      >
        {processing ? "Оплата..." : `Оплатить ${amount} ₽`}
      </button>
    </form>
  );
}

export default PaymentForm;