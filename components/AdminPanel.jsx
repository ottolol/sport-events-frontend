import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminPanel() {
  const [events, setEvents] = useState([]);
  const [editEventId, setEditEventId] = useState(null);
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    date: "",
    location: "",
    photoUrl: "",
    price: 0,
    status: "upcoming",
  });

  useEffect(() => {
    axios.get("https://ваше-приложение.onrender.com/api/events") 
      .then(res => setEvents(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleEditClick = (event) => {
    setEditEventId(event.id);
    setFormData(event);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://ваше-приложение.onrender.com/api/events",  formData);
      setEvents([...events, res.data]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`https://ваше-приложение.onrender.com/api/events/${formData.id}`,  formData);
      setEvents(events.map(e => e.id === res.data.id ? res.data : e));
      setEditEventId(null);
    } catch (err) {
      console.error(err);
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
          <input name="title" value={formData.title} onChange={handleChange} placeholder="Название" required />
          <br />
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Описание" required />
          <br />
          <input name="date" type="datetime-local" value={formData.date.slice(0, 16)} onChange={handleChange} />
          <br />
          <input name="location" value={formData.location} onChange={handleChange} placeholder="Место" />
          <br />
          <input name="photoUrl" value={formData.photoUrl} onChange={handleChange} placeholder="URL фото" />
          <br />
          <input name="price" type="number" value={formData.price} onChange={handleChange} placeholder="Цена" />
          <br />
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="upcoming">Актуальное</option>
            <option value="completed">Прошедшее</option>
          </select>
          <br />
          <button type="submit">Сохранить</button>
        </form>
      )}
    </div>
  );
}

export default AdminPanel;