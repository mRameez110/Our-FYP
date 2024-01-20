import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../utils/Loader";
import Alert from "../utils/Alert";

function ReferralPage() {
  const [referralCode, setReferralCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function getReferralCode() {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.post("/api/patient/referral-code", {
        token: token,
      });

      if (res.status === 200) {
        setReferralCode(res.data.referralCode);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      setError("Error fetching referral code");
    }
  }

  useEffect(() => {
    getReferralCode();
  }, []);

  return (
    <>
      {loading && <Loader loading={loading} />}

      <div className="d-flex justify-content-center my-4">
        <div className="col-10">
          <div className="d-flex justify-content-center align-items-center px-4 my-4">
            <div>
              <h1 className="display-5">Referral Page</h1>
            </div>
          </div>

          <div className="d-flex bg-light p-4 mb-4 rounded-3 flex-column">
            <div className="p-3">
              <h4>Referral Information</h4>
              <div className="d-flex flex-column">
                <div className="row">
                  <div className="col-md-6">
                    <div class="form-group">
                      <label for="referralCode" class="form-label mt-4">
                        Referral Code
                      </label>
                      <input
                        type="text"
                        class="form-control"
                        id="referralCode"
                        placeholder="Referral code"
                        name="referralCode"
                        value={referralCode}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && <Alert type="error" message={error} />}
    </>
  );
}

export default ReferralPage;
