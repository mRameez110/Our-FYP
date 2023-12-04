import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import StudentNavbar from "./StudentNavbar";
import Statistics from "./Statistics";
import Finder from "./Finder";
import Classrooms from "./Classrooms";
import Class from "./Class";
import Messages from "./Messages";
import Appointments from "./Appointments";

import ViewProfile from "./ViewProfile";
import EditProfile from "./EditProfile";
import DeleteProfile from "./DeleteProfile";
import TeacherProfile from "./TeacherProfile";

function StudentDashoard() {
  const [student, setStudent] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // In case of login with Google Authentication, need to get token from url.
  const params = new URLSearchParams(location.search);
  const token = params.get("token");

  async function getStudent() {
    try {
      //If case: When Sign in using form
      if (localStorage.getItem("token")) {
        const res = await axios.post("/api/student/details", {
          token: localStorage.getItem("token"),
        });
        setStudent(res.data);
        localStorage.setItem("student", JSON.stringify(res.data));
        console.log("Setted student response is ", res.data);
      }
      // When Sign in Using Google Auth
      else {
        const res = await axios.post("/api/student/details", { token });
        setStudent(res.data);
        localStorage.setItem("student", JSON.stringify(res.data));
        localStorage.setItem("token", token);
        console.log("Setted student response 2 is ", res.data);
      }
    } catch (err) {
      console.log(err);
      navigate("/login");
    }
  }

  useEffect(() => {
    getStudent();
  }, []);

  return (
    <>
      <StudentNavbar student={student} />
      <div className="container">
        <Routes>
          <Route path="/" element={<Statistics student={student} />} />
          <Route path="/finder" element={<Finder />} />
          <Route path="/classrooms" element={<Classrooms />} />
          <Route path="/class/:id" element={<Class />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/profile/:username" element={<TeacherProfile />} />
          <Route path="/view-profile" element={<ViewProfile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/delete-profile" element={<DeleteProfile />} />
        </Routes>
      </div>
    </>
  );
}

export default StudentDashoard;
