import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EventList from "./components/EventList.tsx";
import EventDetail from "./components/EventDetail.tsx";
import AdminPanel from "./components/AdminPanel.tsx";
import RegisterForm from "./components/RegisterForm.tsx";
import AdminLogin from "./components/AdminLogin.tsx";
import ParticipantsPage from "./components/ParticipantsPage.tsx"

function App () {
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