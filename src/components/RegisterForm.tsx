import { useState } from "react";
import axios from "axios";
import PaymentForm from "./PaymentForm";

// Интерфейс мероприятия
interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  photoUrl: string;
  price: number;
  status: "upcoming" | "completed";
}

// Интерфейс props
interface RegisterFormProps {
  event: Event;
}

function RegisterForm({ event }: RegisterFormProps) {
  const [name, setName] = useState<string>("");
  const [contact, setContact] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [clientSecret, setClientSecret] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Регистрация пользователя
      await axios.post("https://sport-events-backend.onrender.com/api/register",  {
        name,
        contact,
        eventId: event.id,
      });

      // Создание платежа
      const res = await axios.post(
        "https://sport-events-backend.onrender.com/api/payment/create-intent", 
        {
          amount: event.price,
        }
      );

      setClientSecret(res.data.clientSecret);
      setSubmitted(true);
    } catch (err: any) {
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
      />
      <br />
      <input
        type="text"
        placeholder="Email или телефон"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        required
      />
      <br />
      <button type="submit">Зарегистрироваться</button>
    </form>
  );
}

export default RegisterForm;