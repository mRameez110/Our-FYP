const jwt = require("jsonwebtoken");
const Doctor = require("../model/doctorSchema");
const Patient = require("../model/patientSchema");
require("dotenv").config();

const auth = async (req, res, next) => {
  try {
    const token = req.body.token;
    if (!token) throw new Error();
    const verifyUser = jwt.verify(token, process.env.secret);

    switch (verifyUser.role) {
      case "patient":
        const patient = await Patient.findOne({ email: verifyUser.email });
        if (!patient) {
          throw new Error();
        }
        req.token = token;
        req.user = patient;
        next();
        break;
      case "doctor":
        const doctor = await Doctor.findOne({ email: verifyUser.email });
        if (!doctor) {
          throw new Error();
        }
        req.token = token;
        req.user = doctor;
        next();
        break;
      case "admin":
        req.token = token;
        req.user = verifyUser;
        next();
        break;
      default:
        throw new Error();
    }
  } catch (error) {
    res.status(401).json({ error: `Please authenticate: ${error}` });
  }
};

module.exports = auth;
