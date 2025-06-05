import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EventList from "./components/EventList";
import EventDetail from "./components/EventDetail";
import AdminPanel from "./components/AdminPanel";
import RegisterForm from "./components/RegisterForm";
import ParticipantsPage from "./components/ParticipantsPage";
import AdminLogin from "./components/AdminLogin";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EventList />} />
        <Route path="/event/:id" element={<EventDetail />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/participants" element={<ParticipantsPage />} />
      </Routes>
    </Router>
  );
}

export default App;