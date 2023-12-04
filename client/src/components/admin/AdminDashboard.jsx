import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";

import Statistics from "./Statistics";
import AdminNavbar from "./AdminNavbar";
import Patients from "./Patients";
import Doctors from "./Doctors";
import Messages from "./Messages";
import Appointments from "./Appointments";

function AdminDashoard() {
  const [admin, setAdmin] = useState("");
  const navigate = useNavigate();

  async function getAdmin() {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/admin/login");
  }

  useEffect(() => {
    getAdmin();
  }, []);

  return (
    <>
      <AdminNavbar />
      <div className="container p-5">
        <Routes>
          <Route path="/" element={<Statistics />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/appointments" element={<Appointments />} />
        </Routes>
      </div>
    </>
  );
}

export default AdminDashoard;
