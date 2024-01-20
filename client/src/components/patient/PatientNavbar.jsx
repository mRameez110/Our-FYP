import React, { useState } from "react";
import { Link } from "react-router-dom";

function PatientNavbar({ patient }) {
  const [activeTab, setActiveTab] = useState("dashboard");

  function handleTabClick(tab) {
    setActiveTab(tab);
  }

  function logout() {
    localStorage.removeItem("patient");
    localStorage.removeItem("token");
    window.location.href = "/";
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success ">
      <div className="container-fluid">
        <img
          style={{ height: "45px", width: "250px" }}
          src="https://spscc.edu/sites/default/files/inline-images/SmartHealth.png"
          alt="logo"
        />
        {/* <Link className="navbar-brand" href="#">
          Doctor Hub
        </Link> */}
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarColor01"
          aria-controls="navbarColor01"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarColor01">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link
                className={`nav-link ${
                  activeTab === "dashboard" ? "active" : ""
                }`}
                to="/patient/dashboard"
                onClick={() => handleTabClick("dashboard")}
              >
                Dashboard
                <span className="visually-hidden">(current)</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${activeTab === "finder" ? "active" : ""}`}
                to="/patient/dashboard/finder"
                onClick={() => handleTabClick("finder")}
              >
                Finder
              </Link>
            </li>
            
            <li className="nav-item">
              <Link
                className={`nav-link ${
                  activeTab === "messages" ? "active" : ""
                }`}
                to="/patient/dashboard/messages"
                onClick={() => handleTabClick("messages")}
              >
                Messages
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className={`nav-link ${
                  activeTab === "appointments" ? "active" : ""
                }`}
                to="/patient/dashboard/appointments"
                onClick={() => handleTabClick("appointments")}
              >
                Appointments
              </Link>
            </li>

            {/* Profile dropdown menu/list */}

            <li className="nav-item dropdown">
              <a
                className={`nav-link dropdown-toggle ${
                  activeTab === "profile" ? "active" : ""
                }`}
                onClick={() => handleTabClick("profile")}
                href=""
                id="navbarDropdown"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <span className="mx-2 text-light h-4">Profile</span>
                {patient.profile && (
                  <img
                    src={patient.profile}
                    alt="avatar"
                    className="img-fluid rounded-circle"
                    style={{ width: "20px", height: "20px" }}
                  />
                )}
              </a>
              <div className="dropdown-menu">

                <Link
                  className={`dropdown-item ${
                    activeTab === "View Profile" ? "active" : ""
                  }`}
                  to="/patient/dashboard/view-profile"
                  onClick={() => handleTabClick("View Profile")}
                >
                  View Profile
                </Link>

                <Link
                  className={`dropdown-item ${
                    activeTab === "Edit Profile" ? "active" : ""
                  }`}
                  to="/patient/dashboard/edit-profile"
                  onClick={() => handleTabClick("Edit Profile")}
                >
                  Edit Profile
                </Link>

                <Link
                  className={`dropdown-item ${activeTab === " Referral Code" ? "active" : ""}`}
                  to="/patient/dashboard/referral"
                  onClick={() => handleTabClick(" Referral Code")}
                >
                 Referral Code
                </Link>

                <Link
                  className={`dropdown-item ${
                    activeTab === " Delete Profile" ? "active" : ""
                  }`}
                  to="/patient/dashboard/delete-profile"
                  onClick={() => handleTabClick(" Delete Profile")}
                >
                  Delete Profile
                </Link>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item" onClick={logout}>
                  Logout
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default PatientNavbar;
