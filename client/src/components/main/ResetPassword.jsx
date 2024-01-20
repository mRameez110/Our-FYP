// Page form for reset new password
import React, { useState } from "react";
import "./../../assets/css/home.css";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Loader from "../utils/Loader";
import Alert from "../utils/Alert";
import Joi from "joi";

function ResetPassword() {
  const { role, token } = useParams();
  const navigate = useNavigate();
  const [error, seterror] = useState([]);
  // const [user, setUser] = useState([]);
  const [user, setUser] = useState({    
    password: "",
  });
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const schema = Joi.object({
    password: Joi.string()
      .min(1)
      .max(12)
      .required()
      .error(new Error("It must be between 6 and 12 characters.")),
    confirmPassword: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .error(new Error("Passwords do not match.")),
  });

  
  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
    const obj = { [name]: value };

    // To check confirm password is same or not
    if (name === "confirmPassword") {
      const schema1 = Joi.object({
        password: schema.extract("password"),
        confirmPassword: schema.extract("confirmPassword"),
      });
      const res = schema1.validate({
        password: user.password,
        confirmPassword: value,
      });
      if (res.error) {
        seterror({ ...error, confirmPassword: res.error.message });
      } else {
        seterror({ ...error, confirmPassword: null });
      }
    } else {
      const schema1 = Joi.object({ [name]: schema.extract(name) });
      const res = schema1.validate(obj);
      if (res.error) {
        seterror({ ...error, [name]: res.error.message });
      } else {
        seterror({ ...error, [name]: null });
      }
    }
  };

  // function for sign up button on click sign\up button

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`/api/${role}/reset-password/${token}`, {
        ...user,
      });
      setLoading(false);
      console.log("response is", res);
      console.log("user is", user);
      console.log("role is", role);
      console.log("Token is", token);
      if (res.status === 200 || res.status == 200) {
        setLoading(false);
        setAlert({
          type: "success",
          message: res.data.message || "Operation successful",
        });
        setTimeout(() => {
          navigate(`/login/${role}`);
        }, 3000);
      }
    } catch (error) {
      // Handle errors
      setLoading(false);
      console.log("error in request is  ", error);
      setAlert({
        type: "danger",
        message: error.response?.data?.message || "An error occurred",
      });
      setUser([]);
    }
  };

  return (
    <div>
      {loading && <Loader loading={loading} />}

      <div className="d-flex">
        <div className="col-3 signupBackground"></div>

        <div className="container">
          <div className="row align-items-center justify-content-center">
            <div className="col-md-7 py-5">
              <h3 className="display-5">Register</h3>
              <p className="mb-4">
                Thanks for joining us. Please register by completing the
                information below.
              </p>

              
              <form>
                

                
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label
                        for="exampleInputPassword"
                        className="form-label mt-4"
                      >
                        Password
                      </label>
                      <input
                        type="password"
                        className={
                          error.password
                            ? "form-control is-invalid"
                            : "form-control"
                        }
                        id="exampleInputPassword"
                        placeholder="Password"
                        name="password"
                        value={user.password}
                        onChange={handleChangeInput}
                      />
                      {error.password && (
                        <div class="invalid-feedback">{error.password}</div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label
                        for="exampleInputPassword2"
                        className="form-label mt-4"
                      >
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        className={
                          error.confirmPassword
                            ? "form-control is-invalid"
                            : "form-control"
                        }
                        id="exampleInputPassword2"
                        placeholder="Password"
                        name="confirmPassword"
                        value={user.confirmPassword}
                        onChange={handleChangeInput}
                      />
                      {error.confirmPassword && (
                        <div class="invalid-feedback">
                          {error.confirmPassword}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="d-flex mb-5 mt-4 align-items-center">
                  <div className="d-flex align-items-center">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="flexCheckDefault"
                      />
                      <label
                        className="form-check-label"
                        for="flexCheckDefault"
                      >
                        I agree to the{" "}
                        <a href="#" className="text-primary">
                          Terms and Conditions
                        </a>
                      </label>
                    </div>
                  </div>
                </div>

                {user.length != 2 &&
                (
                  error.password ||
                  error.confirmPassword) ? (
                  <button className="btn px-5 btn-primary" disabled>
                    Fill all the fields and resolve errors
                  </button>
                ) : (
                  <button
                    className="btn px-5 btn-primary"
                    onClick={handleSubmit}
                  >
                    Reset Password
                  </button>
                )}

                <span className="text-center d-block pt-4">
                  Already have an account?{" "}
                  <Link to={`/login/${role}`} className="text-primary">
                    {" "}
                    Login
                  </Link>
                </span>
              </form>
            </div>
          </div>
        </div>
      </div>

      {alert.message && <Alert type={alert.type} message={alert.message} />}
    </div>
  );
}

export default ResetPassword;
