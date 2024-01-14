// components/main/ForgetPassword.jsx

import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Loader from "../utils/Loader";
import Alert from "../utils/Alert";

function ForgetPassword() {
  const { role } = useParams();
  const [alert, setAlert] = useState({ type: "", message: "" });
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      // Send a request to the backend to initiate the forgot password process
      const res = await axios.post(`/api/${role}/forget-password`, {
        email,
        role: role,
      });
      console.log("I am in try block of forget Password ");
      console.log("Role is ", role);
      setLoading(false);

      if (res.status === 200 || res.status == 200) {
        setLoading(false);
        setAlert({
          type: "success",
          message: res.data.message || "Operation successful",
        });
        setTimeout(() => {
          navigate(`/verify/${role}/false`);
        }, 1000);
      }
    } catch (err) {
      console.log("I am in catch of forget Password");
      setLoading(false);
      setAlert({ type: "danger", message: err.response.data.message });
    }
  };

  return (
    <div>
      {loading && <Loader loading={loading} />}

      <div className="container">
        <div className="row align-items-center justify-content-center">
          <div className="col-md-7 py-5">
            <h3 className="display-5">Forgot Password</h3>
            <p className="mb-4">Enter your email to reset your password.</p>

            <form>
              <div className="form-group">
                <label htmlFor="exampleInputEmail" className="form-label mt-4">
                  Email address
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="exampleInputEmail"
                  aria-describedby="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button className="btn px-5 btn-primary" onClick={handleSubmit}>
                Submit
              </button>

              <span className="text-center d-block pt-4">
                Remember your password?{" "}
                <Link to={`/login/${role}`} className="text-primary login-link">
                  Log in
                </Link>
              </span>
            </form>
          </div>
        </div>
      </div>

      {alert.message && <Alert type={alert.type} message={alert.message} />}
    </div>
  );
}

export default ForgetPassword;
