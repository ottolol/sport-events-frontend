import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import RegisterForm from "./RegisterForm";

function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`https://sport-events-backend.onrender.com/api/events/${id}`) 
      .then(res => {
        setEvent(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Загрузка...</p>;
  if (!event) return <p>Мероприятие не найдено</p>;

  return (
    <div>
      <h2>{event.title}</h2>
      <p><strong>Дата:</strong> {new Date(event.date).toLocaleString()}</p>
      <p><strong>Место:</strong> {event.location}</p>
      <p><strong>Цена:</strong> {event.price} ₽</p>
      <img src={event.photoUrl} alt={event.title} width="100%" />
      <p>{event.description}</p>
      <hr />
      <h3>Зарегистрироваться</h3>
      <RegisterForm event={event} />
    </div>
  );
}

export default EventDetail;