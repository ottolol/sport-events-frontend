import { useState } from "react";
import axios from "axios";
import PaymentForm from "./PaymentForm";

function RegisterForm({ event }) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Регистрация пользователя
      await axios.post("https://ваше-приложение.onrender.com/api/register",  {
        name,
        contact,
        eventId: event.id,
      });

      // Создание платежа
      const res = await axios.post("https://ваше-приложение.onrender.com/api/payment/create-intent",  {
        amount: event.price,
      });

      setClientSecret(res.data.clientSecret);
      setSubmitted(true);
    } catch (err) {
      alert("Ошибка регистрации или оплаты.");
      console.error(err);
    }
  };

  if (submitted && clientSecret) {
    return (
      <PaymentForm
        amount={event.price}
        clientSecret={clientSecret}
        onSuccess={() => alert("Оплата прошла успешно!")}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Имя"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      /><br />
      <input
        type="text"
        placeholder="Email или телефон"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        required
      /><br />
      <button type="submit">Зарегистрироваться</button>
    </form>
  );
}

export default RegisterForm;