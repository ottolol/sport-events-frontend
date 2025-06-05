import React, { useEffect, useState } from "react";
import axios from "axios";

interface Participant {
  id: number;
  name: string;
  contact: string;
  eventId: number;
  createdAt: string;
  updatedAt: string;
}

interface Event {
  id: number;
  title: string;
}

interface ParticipantWithEvent extends Participant {
  Event?: Event;
}

function ParticipantsPage () {
  const [participants, setParticipants] = useState<ParticipantWithEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await axios.get(
          "https://sport-events-backend.onrender.com/api/participants" 
        );
        setParticipants(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Ошибка загрузки участников", err);
        setError("Не удалось загрузить список участников");
        setLoading(false);
      }
    };

    fetchParticipants();
  }, []);

  if (loading) return <p>Загрузка участников...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Участники мероприятий</h2>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "20px",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f4f4f4" }}>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Имя</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Контакт</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Мероприятие</th>
          </tr>
        </thead>
        <tbody>
          {participants.length === 0 ? (
            <tr>
              <td colSpan={3} style={{ textAlign: "center", padding: "16px" }}>
                Нет зарегистрированных участников
              </td>
            </tr>
          ) : (
            participants.map((participant) => (
              <tr key={participant.id}>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {participant.name}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {participant.contact}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {participant.Event?.title || "—"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ParticipantsPage;