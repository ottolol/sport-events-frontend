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

  // const handleCreate = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   try {
  //     const res = await axios.post("https://sport-events-backend.onrender.com/api/events", formData);
  //     setEvents([...events, res.data]);
  //   } catch (err) {
  //     console.error("Ошибка создания мероприятия", err);
  //   }
  // };
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("adminToken");

    if (!token) {
      alert("Вы не авторизованы");
      window.location.href = "/admin/login";
      return;
    }

    try {
      const res = await axios.post(
        "https://sport-events-backend.onrender.com/api/events", 
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEvents([...events, res.data]);
      alert("Мероприятие успешно создано!");
    } catch (err: any) {
      console.error("Ошибка создания мероприятия", err);
      if (err.response?.status === 401) {
        alert("Сессия истекла. Войдите снова.");
        localStorage.removeItem("adminToken");
        window.location.href = "/admin/login";
      } else {
        alert(`Не удалось создать мероприятие: ${err.response?.data?.message || "Ошибка сервера"}`);
      }
    }
  };

  // const handleUpdate = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   try {
  //     const res = await axios.put(`https://sport-events-backend.onrender.com/api/events/${formData.id}`,    formData);
  //     setEvents(events.map(e => e.id === res.data.id ? res.data : e));
  //     setEditEventId(null);
  //   } catch (err) {
  //     console.error("Ошибка обновления мероприятия", err);
  //   }
  // };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("adminToken");

    if (!token) {
      alert("Вы не авторизованы");
      window.location.href = "/admin/login";
      return;
    }

    if (!formData.id || formData.id === 0) {
      alert("Неверный ID мероприятия");
      return;
    }

    try {
      const res = await axios.put(
        `https://sport-events-backend.onrender.com/api/events/${formData.id}`, 
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEvents(events.map((event) => (event.id === res.data.id ? res.data : event)));
      setEditEventId(null);
      alert("Мероприятие успешно обновлено!");
    } catch (err: any) {
      console.error("Ошибка обновления мероприятия", err);
      if (err.response?.status === 401) {
        alert("Сессия истекла. Войдите снова.");
        localStorage.removeItem("adminToken");
        window.location.href = "/admin/login";
      } else {
        alert(`Не удалось обновить мероприятие: ${err.response?.data?.message || "Ошибка сервера"}`);
      }
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