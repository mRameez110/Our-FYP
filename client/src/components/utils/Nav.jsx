import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Nav() {
  const navigate = useNavigate();

  const movetosignupPatient = () => {
    navigate("/signup/patient");
  };

  const movetosignupDoc = () => {
    navigate("/signup/doctor");
  };

  const movetologinPatient = () => {
    navigate("/login/patient");
  };

  const movetologinDoc = () => {
    navigate("/login/doctor");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark w-100">
        <div className="container-fluid">

          <img
            style={{ height: "45px", width: "250px" }}
            src="https://spscc.edu/sites/default/files/inline-images/SmartHealth.png"
            alt="logo"
          />
          {/* <h1 className="navbar-brand text-light" to="/">
            DoctorHub
          </h1> */}
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
                <Link className="nav-link active" to="/">
                  Home
                  <span className="visually-hidden">(current)</span>
                </Link>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#aboutus">
                  About
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#contactus">
                  Contact
                </a>
              </li>
              <li className="nav-item">
                <button
                  type="button"
                  className="btn btn-success"
                  data-toggle="modal"
                  data-target="#exampleModal2"
                >
                  Login
                </button>
              </li>
              <li className="nav-item">
                <button
                  type="button"
                  className="btn btn-info"
                  data-toggle="modal"
                  data-target="#exampleModal"
                >
                  Join Us
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Dialog Model For SignUp  */}
      <div
        className="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Role</h5>
              <button
                type="button"
                className="btn-close"
                data-dismiss="modal"
                aria-label="Close"
                data-toggle="modal"
                data-target="#exampleModal"
              >
                <span aria-hidden="true"></span>
              </button>
            </div>
            <div className="modal-body">
              <fieldset className="form-group text-center">
                <legend>Who are you?</legend>
                <div classNameName="p-3">
                  <button
                    data-dismiss="modal"
                    aria-label="Close"
                    data-toggle="modal"
                    data-target="#exampleModal"
                    className="btn btn-outline-secondary mx-3"
                    onClick={movetosignupPatient}
                  >
                    <img
                      src="https://img.freepik.com/free-vector/pregnant-pacient-silhouette_23-2147495492.jpg?w=740&t=st=1699358716~exp=1699359316~hmac=aeac13380e10b4b901cfca9cfa205febe110a7cd44af53d7a2d0b49d1736e9c6"
                      alt="Patient"
                      width="100px"
                      height="100px"
                    />
                    <br />
                    <p classNameName="lead">User</p>
                  </button>
                  <button
                    data-dismiss="modal"
                    aria-label="Close"
                    data-toggle="modal"
                    data-target="#exampleModal"
                    className="btn btn-outline-secondary mx-3"
                    onClick={movetosignupDoc}
                  >
                    <img
                      src="https://img.freepik.com/free-vector/medical-healthcare_24877-57138.jpg?w=740&t=st=1699358482~exp=1699359082~hmac=2c31cb8627f4b47cf9e80e97b4cf8ca677290b2d6d80ab9ad855ddf123f9a864"
                      alt="doctor"
                      width="100px"
                      height="100px"
                    />
                    <br />
                    <p classNameName="lead">Doctor</p>
                  </button>
                </div>
              </fieldset>
            </div>
          </div>
        </div>
      </div>

      {/* Dialog Model for Login  */}
      <div
        className="modal fade"
        id="exampleModal2"
        tabindex="-1"
        aria-labelledby="exampleModalLabel2"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Role</h5>
              <button
                type="button"
                className="btn-close"
                data-dismiss="modal"
                aria-label="Close"
                data-toggle="modal"
                data-target="#exampleModal2"
              >
                <span aria-hidden="true"></span>
              </button>
            </div>
            <div className="modal-body">
              <fieldset className="form-group text-center">
                <legend>Who are you?</legend>
                <div classNameName="p-3">
                  <button
                    data-dismiss="modal"
                    aria-label="Close"
                    data-toggle="modal"
                    data-target="#exampleModal2"
                    className="btn btn-outline-secondary mx-3"
                    onClick={movetologinPatient}
                  >
                    <img
                      src="https://img.freepik.com/free-vector/pregnant-pacient-silhouette_23-2147495492.jpg?w=740&t=st=1699358716~exp=1699359316~hmac=aeac13380e10b4b901cfca9cfa205febe110a7cd44af53d7a2d0b49d1736e9c6"
                      alt="Patient"
                      width="100px"
                      height="100px"
                    />
                    <br />
                    <p classNameName="lead">User</p>
                  </button>
                  <button
                    data-dismiss="modal"
                    aria-label="Close"
                    data-toggle="modal"
                    data-target="#exampleModal2"
                    className="btn btn-outline-secondary mx-3"
                    onClick={movetologinDoc}
                  >
                    <img
                      src="https://img.freepik.com/free-vector/medical-healthcare_24877-57138.jpg?w=740&t=st=1699358482~exp=1699359082~hmac=2c31cb8627f4b47cf9e80e97b4cf8ca677290b2d6d80ab9ad855ddf123f9a864"
                      alt="doctor"
                      width="100px"
                      height="100px"
                    />
                    <br />
                    <p classNameName="lead">Doctor</p>
                  </button>
                </div>
              </fieldset>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Nav;
