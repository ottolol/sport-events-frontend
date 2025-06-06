import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

// ✅ Интерфейс мероприятия (обязательно!)
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

function EventList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    axios.get("https://sport-events-backend.onrender.com/api/events") 
      .then(res => setEvents(res.data))
      .catch(err => console.error(err));
  }, []);

  const filteredEvents = filter === "all"
    ? events
    : events.filter(e => e.status === filter);

  return (
    <div>
      <h2>Мероприятия</h2>
      <div>
        <button onClick={() => setFilter("all")}>Все</button>
        <button onClick={() => setFilter("upcoming")}>Актуальные</button>
        <button onClick={() => setFilter("completed")}>Прошедшие</button>
      </div>

      {filteredEvents.map(event => (
        <div key={event.id} style={{ marginBottom: "20px", border: "1px solid #ccc", padding: "10px" }}>
          <img src={event.photoUrl} alt={event.title} width="100%" />
          <h3>{event.title}</h3>
          <p><strong>Дата:</strong> {new Date(event.date).toLocaleString()}</p>
          <p><strong>Место:</strong> {event.location}</p>
          <Link to={`/event/${event.id}`}>Подробнее</Link>
        </div>
      ))}
    </div>
  );
}

export default EventList;