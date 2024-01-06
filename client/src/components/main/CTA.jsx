import React from "react";

function CTA() {
  return (
    <section className="container-fluid">
      <div className="row">
        <div className="col-lg-6 mx-auto text-center">
          <div
            className="d-flex flex-column justify-content-center align-items-center"
            style={{ height: "100vh" }}
          >
            <h1>
              <strong>
                Personalized{" "}
                <span className="text-primary">Medical Services</span>{" "}
              </strong>
            </h1>
            <p className="lead">Find Your Desire Doctor!</p>
            <div className="my-3">
              <button
                href="/signup"
                className="btn btn-primary mx-2"
                data-toggle="modal"
                data-target="#exampleModal"
              >
                Get Started
              </button>

              {/* <button href="/learnmore" className="btn btn-outline-primary mx-2">Learn More</button> */}
            </div>
          </div>
        </div>
        <div className="col-lg-6 m-0 p-0 text-center">
          {/* <div className="background"></div> */}
          <div>
            <img
              style={{ width: "100%", height: "90vh" }}
              src="https://previews.123rf.com/images/shutterboythailand/shutterboythailand1601/shutterboythailand160100226/50945648-doctor-holding-a-tablet-pc-with-medical-hub-sign-on-the-display.jpg"
              alt="Doctor with Tablet"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTA;
