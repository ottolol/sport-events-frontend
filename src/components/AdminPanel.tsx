import { useState, useEffect } from "react";
import axios from "axios";

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

function AdminPanel() {
  const [events, setEvents] = useState<Event[]>([]);
  const [editEventId, setEditEventId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Event>>({
    id: 0,
    title: "",
    description: "",
    date: "",
    location: "",
    photoUrl: "",
    price: 0,
    status: "upcoming",
  });

  useEffect(() => {
    axios.get("https://sport-events-backend.onrender.com/api/events") 
      .then(res => setEvents(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleEditClick = (event: Event) => {
    setEditEventId(event.id);
    setFormData(event);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post("https://sport-events-backend.onrender.com/api/events",  formData);
      setEvents([...events, res.data]);
    } catch (err) {
      console.error("Ошибка создания мероприятия", err);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.put(`https://sport-events-backend.onrender.com/api/events/${formData.id}`,  formData);
      setEvents(events.map(e => e.id === res.data.id ? res.data : e));
      setEditEventId(null);
    } catch (err) {
      console.error("Ошибка обновления мероприятия", err);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
      <h2>Мероприятия</h2>
      <ul>
        {events.map(event => (
          <li key={event.id}>
            {event.title} — {new Date(event.date).toLocaleString()}
            <button onClick={() => handleEditClick(event)}>Редактировать</button>
          </li>
        ))}
      </ul>

      {(editEventId || !editEventId) && (
        <form onSubmit={editEventId ? handleUpdate : handleCreate}>
          <input
            name="title"
            value={formData.title || ""}
            onChange={handleChange}
            placeholder="Название"
            required
          /><br />

          <textarea
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
            placeholder="Описание"
            required
          /><br />

          <input
            name="date"
            type="datetime-local"
            value={formData.date?.slice(0, 16) || ""}
            onChange={handleChange}
          /><br />

          <input
            name="location"
            value={formData.location || ""}
            onChange={handleChange}
            placeholder="Место"
          /><br />

          <input
            name="photoUrl"
            value={formData.photoUrl || ""}
            onChange={handleChange}
            placeholder="URL фото"
          /><br />

          <input
            name="price"
            type="number"
            value={formData.price || ""}
            onChange={handleChange}
            placeholder="Цена"
          /><br />

          <select name="status" value={formData.status || "upcoming"} onChange={handleChange}>
            <option value="upcoming">Актуальное</option>
            <option value="completed">Прошедшее</option>
          </select><br />

          <button type="submit">Сохранить</button>
        </form>
      )}
    </div>
  );
}

export default AdminPanel;