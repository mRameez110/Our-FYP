const Patient = require("../model/patientSchema");
const Doctor = require("../model/doctorSchema");
const Admin = require("./../model/adminSchema");
const Contact = require("./../model/contactSchema");
const jwt = require("jsonwebtoken");
const sendMail = require("./../modules/mail");
require("dotenv").config();

const login = async (req, res) => {
  // const {email, password} = req.body;
  const { email } = req.body;
  console.log("Email is ", email);
  try {
    // const result = await Admin.findOne({ email: email, password: password });
    const result = await Admin.findOne({
      email: email,
    });

    if (result) {
      console.log("admin sucess and response is ", result);
      const token = jwt.sign(
        { email: email, role: "admin" },
        process.env.secret
      );
      res.json({
        token,
        message: "Login successful",
      });
    } else {
      console.log("Error is ", result);
      res.status(400).json({
        message: "Invalid credentials",
      });
    }
  } catch (err) {
    res.status(400).json(err.message);
  }
};

// get all Patients
const getAllPatients = async (req, res) => {
  const patients = await Patient.find();
  res.json(patients);
};

// delete Patient
const deletePatient = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Patient.findByIdAndDelete(id);
    res.json(result);
  } catch (err) {
    res.status(400).json(err.message);
  }
};

// delete doctor
const deleteDoctor = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Doctor.findByIdAndDelete(id);
    res.json(result);
  } catch (err) {
    res.status(400).json(err.message);
  }
};

// get all doctors
const getAllDoctors = async (req, res) => {
  const doctors = await Doctor.find();
  res.json(doctors);
};

const sendEmail = async (req, res) => {
  const { email, subject, message, reply } = req.body;
  try {
    await sendMail({
      from: process.env.email,
      to: email,
      subject: subject,
      text: `Message: ${message} \n\n Reply: ${reply}`,
    });
    const update = await Contact.findOneAndUpdate(
      { email: email },
      { status: "Replied", reply: reply },
      { new: true }
    );
    res.status(200).json(update);
  } catch (err) {
    res.status(400).json(err.message);
  }
};

module.exports = {
  login,
  getAllPatients,
  getAllDoctors,
  deletePatient,
  deleteDoctor,
  sendEmail,
};
