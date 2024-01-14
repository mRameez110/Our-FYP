const Patient = require("../model/patientSchema");
const Appointment = require("../model/appointmentSchema");
const Doctor = require("../model/doctorSchema");
const Classroom = require("../model/classroomSchema");
const mail = require("../modules/mail");
const stripe = require("stripe")(
  "sk_test_51NXkywEEmrDcA7BPvJcTlLYiz0lumgxDa0Ac9qnrUQ6zvQ1ilQ0450DXAxwF1AWMRDPaUhF4n2WUG2l4iI5XNw0I002bQfTM94"
);
const jwt = require("jsonwebtoken");
require("dotenv").config();
const crypto = require("crypto");

const signUp = async (req, res) => {
  try {
    const { name, email, password, username } = req.body;
    const patient = new Patient({ name, email, password, username });

    const token = jwt.sign(
      // payload for generating token agaisnt email and role
      { email: email, role: "patient" },
      process.env.secret
    );

    patient.tokens = patient.tokens.concat({ token: token });
    res.cookie("token", token);
    // await patient.save();
    // console.log("patient saved in Data base", patient);
    // res.status(200).json({ msg: "patient created successfully" });
    const verificationLink = `http://localhost:5000/patient/verify/${token}`;
    // Commented out mail function for testing
    await mail({
      from: process.env.email,
      to: email,
      subject: "Email verification",
      text: `Please click on the following link to verify your email: ${verificationLink}`,
    });
    await patient.save();
    console.log("patient saved in Data base", patient);
    res.status(200).json({ msg: "patient created successfully" });
  } catch (err) {
    console.error(err);
    console.log("Error occurre in creating account");
    return res.status(400).json({ message: "Something is wrong" });
  }
};

const sendForgetPasswordEmail = async (req, res) => {
  try {
    const {email} = req.body;

    const patient = await Patient.findOne({ email });
    if (!patient) {
      return res.status(404).json({ err: "Email not found" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    patient.resetPasswordToken = resetToken;
    patient.resetPasswordExpires = Date.now() + 3600000; // Token valid for 1 hour
    await patient.save();

    const resetLink = `http://localhost:3000/reset-password/patient/${resetToken}`;
    
    await mail({
      from: process.env.email,
      to: email,
      subject: "Password Reset Link",
      text: `Please click on the following link to reset Password: ${resetLink}`,
    });

    res.status(200).json({ message: "Sending Email...." });

  } catch (err) {
    console.error("Error in forgot password route:", err);
    res.status(500).json({ err: "Internal server error" });
  }
};

const resetPassword = async (req, res) => {
   try {
    const { token } = req.params;
    const { password } = req.body;

    const patient = await Patient.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!patient) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    // Set new password
    patient.password = password;
    patient.resetPasswordToken = undefined;
    patient.resetPasswordExpires = undefined;

    await patient.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error in reset password route:", error);
    res.status(500).json({ error: "Internal server error" });
  } 
};
  
  
const login = async (req, res) => {
  const patient = req.user;

  const token = jwt.sign(
    { email: patient.email, role: "patient" },
    process.env.secret
  );
  patient.tokens = patient.tokens.concat({ token: token });

  await patient.save();

  res.json({ token: token });
};

const emailVerification = (req, res) => {
  const token = req.params.token;
  jwt.verify(token, process.env.secret, (err, decoded) => {
    if (err) {
      res.status(400).json({ msg: "Invalid token" });
    } else {
      Patient.findOne({ email: decoded.email }).then((patient) => {
        patient.isVerified = true;
        patient.save();
        res.redirect(
          `http://localhost:3000/verify/patient/${patient.isVerified}`
        );
      });
    }
  });
};

const userPanel = async (req, res) => {
  try {
    const { token } = req.body;
    const decoded = jwt.verify(token, process.env.secret);
    const patient = await Patient.findOne({ email: decoded.email });
    res.json(patient);
  } catch (err) {
    res.status(400).json(err.message);
  }
};

const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (err) {
    res.status(400).json(err.message);
  }
};

const getPatientCount = async (req, res) => {
  const count = await Patient.countDocuments();
  return count;
};

const deletePatient = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email);
    if (req.user.email == email) {
      await Patient.findOneAndDelete({ email: email });
      res.json({ msg: "Patient deleted successfully" });
    } else {
      res
        .status(400)
        .json({ msg: "You are not authorized to delete the account" });
    }
  } catch (err) {
    res.status(400).json(err.message);
  }
};

const updatePatient = async (req, res) => {
  try {
    const { data } = req.body;
    console.log(data);
    if (req.user.email == data.email) {
      const result = await Patient.findOneAndUpdate(
        { email: data.email },
        data,
        { new: true }
      );
      res.json(result);
    }
  } catch (err) {
    res.status(400).json(err.msg);
  }
};

// const appointment = async (req, res) => {
//   try {
//     const {
//       patient,
//       doctor,
//       appointmentDate,
//       appointmentTime,

//       notes,
//     } = req.body;
//     const appointment = new Appointment({
//       patient,
//       doctor,
//       appointmentDate,
//       appointmentTime,

//       notes,
//     });
//     const result = await appointment.save();
//     console.log(result);
//     res.status(200).json({ msg: "Appointment created successfully" });
//   } catch (err) {
//     res.status(400).json(err.message);
//   }
// };

const getAppointments = async (req, res) => {
  try {
    const { patient } = req.body;
    await console.log("Patirnt is ", patient);
    const appointments = await Appointment.find({ patient: patient });
    if (appointments) {
      const doctors = await Doctor.find({
        username: {
          $in: appointments.map((appointment) => appointment.doctor),
        },
      });
      const result = appointments.map((appointment) => {
        const doctor = doctors.find(
          (doctor) => doctor.username == appointment.doctor
        );
        return {
          ...appointment._doc,
          doctor: {
            profile: doctor.profile,
            name: doctor.name,
            username: doctor.username,
          },
        };
      });
      result.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      console.log(result);
      res.json(result);
    }
  } catch (err) {
    res.status(400).json(err.message);
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const { appointment } = req.body;
    const result = await Appointment.findOneAndDelete({ _id: appointment });
    res.json(result);
  } catch (err) {
    res.status(400).json(err.message);
  }
};

function formatDate(dateString) {
  const date = new Date(dateString);
  const month = date.toLocaleString("default", { month: "long" });
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
}

function formatTime(timeStr) {
  let [hours, minutes] = timeStr.split(":").map(Number);
  let ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  return hours + ":" + (minutes < 10 ? "0" + minutes : minutes) + " " + ampm;
}

const updateAppointment = async (req, res) => {
  try {
    const { appointment, date, time } = req.body;
    const result = await Appointment.findOneAndUpdate(
      { _id: appointment },
      {
        appointmentDate: date,
        appointmentTime: time,
        notes: `patient updated the appointment on ${formatDate(
          date
        )} at ${formatTime(time)}`,
      },
      { new: true }
    );
    res.json(result);
  } catch (err) {
    res.status(400).json(err.message);
  }
};

// const payment = async (req, res) => {
//   const data = {
//     fee: req.query.fee,
//     doctor: req.query.doctor,
//     patient: req.query.patient,
//     multipleSubjects: JSON.parse(req.query.multipleSubjects),
//     quantity: JSON.parse(req.query.multipleSubjects).length,
//   };
//   const session = await stripe.checkout.sessions.create({
//     payment_method_types: ["card"],
//     line_items: data.multipleSubjects.map((subject) => {
//       return {
//         price_data: {
//           currency: "pkr",
//           product_data: {
//             name: subject,
//             images: ["https://i.imgur.com/EHyR2nP.png"],
//           },
//           unit_amount: parseInt(data.fee) * 100,
//         },
//         quantity: 1,
//       };
//     }),
//     mode: "payment",
//     success_url: `http://localhost:5000/payment/success?doctor=${data.doctor}&patient=${data.patient}&multipleSubjects=${data.multipleSubjects}`,
//     cancel_url: `http://localhost:5000/payment/cancel/`,
//   });
//   res.redirect(session.url);
// };

// const payment = async (req, res) => {
//   try {
//     const { fee, doctor, patient } = req.query;

//     if (!fee || !doctor || !patient) {
//       return res
//         .status(400)
//         .json({ error: "Missing some required parameters" });
//     }

//     const data = {
//       fee,
//       doctor,
//       patient,
//     };

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: [
//         {
//           price_data: {
//             currency: "pkr",
//             product_data: {
//               name: "Appointment", // Customize as needed
//               images: ["https://i.imgur.com/EHyR2nP.png"],
//             },
//             unit_amount: parseInt(data.fee) * 100,
//           },
//           quantity: 1,
//         },
//       ],
//       mode: "payment",
//       success_url: `http://localhost:5000/payment/success?doctor=${data.doctor}&patient=${data.patient}&multipleSubjects=${data.multipleSubjects}`,
//       cancel_url: `http://localhost:5000/payment/cancel/`,
//     });
//     console.log("Session url is ", session.url);
//     res.redirect(session.url);
//   } catch (error) {
//     console.error("Error in payment:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// const BookAppointment = async (req, res) => {
//   try {
//     const { appointmentDate, appointmentTime, notes, doctor, patient } =
//       req.body;

//     console.log(
//       "Appointment details are ",
//       appointmentDate,
//       appointmentTime,
//       notes,
//       doctor,
//       patient
//     );
//     const finddoctorforFee = await doctor.findOne({ username: doctor });
//     const appointmentFee = finddoctorforFee.availability.fee;

//     console.log("doctor fee is ", appointmentFee);
//     const appointment = new Appointment({
//       appointmentDate,
//       appointmentTime,
//       notes,
//       doctor,
//       patient,
//       appointmentFee,
//     });

//     // Create a Checkout session with Stripe
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: [
//         {
//           price_data: {
//             currency: "usd", // Update currency as needed
//             product_data: {
//               name: "Appointment",
//               images: ["https://i.imgur.com/EHyR2nP.png"],
//             },
//             unit_amount: appointmentFee * 100,
//           },
//           quantity: 1,
//         },
//       ],
//       mode: "payment",
//       success_url: "http://localhost:3000/patient/dashboard/appointment",
//       cancel_url: "http://localhost:5000/payment/cancel/",
//     });

//     const savedAppointment = await appointment.save();
//     // Send the Checkout session URL to the client
//     res.status(200).json({
//       msg: "Appointment created successfully",
//       appointmentId: savedAppointment.id,
//       stripeCheckoutUrl: session.url,
//     });
//   } catch (err) {
//     console.error("Error creating appointment:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// const Appointment = require("../models/appointment"); // Assuming you have an Appointment model

// const BookAppointment = async (req, res) => {
//   try {
//     const { appointmentDate, appointmentTime, notes, doctor, patient } =
//       req.body;
//     // const { notes, doctor, patient } = req.body;
//     console.log("Appointment response data in bookappointment ", {
//       appointmentDate,
//       appointmentTime,
//       notes,
//       doctor,
//       patient,
//     });
//     console.log(
//       "Appointment response data in bookappointment ",
//       doctor,
//       patient
//     );
//     const findDoctorforFee = await Doctor.findOne({ username: doctor });
//     const appointmentFee = findDoctorforFee.availability.fee;
//     console.log("Doctor appointment fee is ", appointmentFee);

//     // Redirect to Stripe Checkout page immediately without saving the appointment
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],

//       line_items: [
//         {
//           price_data: {
//             currency: "usd",
//             product_data: {
//               name: "Appointment",
//               images: ["https://i.imgur.com/EHyR2nP.png"],
//             },
//             unit_amount: appointmentFee * 100,
//           },
//           quantity: 1,
//         },
//       ],
//       mode: "payment",
//       success_url: "http://localhost:5000/payment/success?paymentSuccess=true",
//       cancel_url: `http://localhost:5000/payment/cancel`,
//     });
//     console.log("origin is ", req.headers.origin);
//     console.log("Stripe Checkout session URL is :", session.url);
//     console.log("Stripe Checkout session attributes are :", session);
//     console.log("Stripe Checkout status are :", session.status);
//     res.status(200).json({
//       stripeCheckoutUrl: session.url,
//       stripeSession: session.status,
//     });
//     console.log("Stripe Checkout status are :", session.status);
//   } catch (err) {
//     console.error("Error creating checkout session:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// const saveAppointment = async (req, res) => {
//   try {
//     const { appointmentDate, appointmentTime, notes, doctor, patient } =
//       req.body;
//     console.log("Appointment response data in SaveAppointment ", {
//       appointmentDate,
//       appointmentTime,
//       notes,
//       doctor,
//       patient,
//     });
//     console.log(
//       "Appointment response data in SaveAppointment ",
//       doctor,
//       patient
//     );

//     // Save the appointment details to the database
//     const appointment = new Appointment({
//       appointmentDate,
//       appointmentTime,
//       notes,
//       doctor,
//       patient,
//     });
//     console.log("Appointment response data is ", appointment);
//     const savedAppointment = await appointment.save();
//     console.log("saved appointment is ", savedAppointment);

//     // Perform other actions as needed
//     // ...
//     console.log("SavedAppointment api run, redirected to appointments");
//     res.redirect(
//       "http://localhost:3000/patient/dashboard/appointments?paymentSuccess=true"
//     );
//   } catch (error) {
//     console.error("Error handling payment success:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

const BookAppointment = async (req, res) => {
  try {
    const appointmentData = ({
      appointmentDate,
      appointmentTime,
      notes,
      doctor,
      patient,
      appointmentFee,
    } = req.body);

    console.log("appointment data in bookapoint is ", appointmentData);

    // Create a session for Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "pkr",
            product_data: {
              name: "Appointment",
              images: ["https://i.imgur.com/EHyR2nP.png"],
            },
            unit_amount: appointmentFee * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:5000/payment/success?appointmentData=${encodeURIComponent(
        JSON.stringify({
          appointmentDate,
          appointmentTime,
          notes,
          doctor,
          patient,
          appointmentFee,
        })
      )}`,

      cancel_url: "http://localhost:5000/payment/cancel",
    });

    // Return the session URL to the client
    res.status(200).json({
      stripeCheckoutUrl: session.url,
      stripeSession: session.status,
    });
    console.log("Payment status is ", session.status);
  } catch (err) {
    console.error("Error creating checkout session:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const saveAppointment = async (req, res) => {
  try {
    console.log("Appointment saved in db ");
    const { appointmentDate, appointmentTime, notes, doctor, patient } =
      req.body;

    // Save the appointment details to the database
    const appointment = new Appointment({
      appointmentDate,
      appointmentTime,
      notes,
      doctor,
      patient,
    });
    const savedAppointment = await appointment.save();

    console.log("Appointment saved in db ", savedAppointment);

    // Check for payment success (you might want to improve this logic)
    if (req.query.paymentSuccess === "true") {
      // Perform other actions as needed

      // Redirect after ensuring payment success
      res.redirect(
        "http://localhost:3000/patient/dashboard/appointments?paymentSuccess=true"
      );
    } else {
      // Handle case where payment is not successful
      res.status(400).json({ error: "Payment not successful" });
    }
  } catch (error) {
    console.error("Error handling payment success:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getClassrooms = async (req, res) => {
  try {
    console.log(req.body);
    const classrooms = await Classroom.find({
      "patient.username": req.body.username,
    });
    res.status(200).json(classrooms);
  } catch (err) {
    res.status(400).json(err.message);
  }
};

const getClass = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const result = await Classroom.findOne({ _id: id });
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json(err.message);
  }
};

const uploadAssignment = async (req, res) => {
  try {
    const { classroom, subject, assignment, link } = req.body;
    const filename = req.file == undefined ? "" : req.file.filename;
    const result = await Classroom.findOne({ _id: classroom });
    if (result) {
      const sub = result.subjects.find((sub) => sub._id == subject);
      const assesment = sub.assignments.find(
        (assesment) => assesment._id == assignment
      );
      assesment.link = link;
      assesment.answer = filename == "" ? "" : `/api/public/${filename}`;
      assesment.uploadDate = new Date();
      await result.save();
      const newClassroom = await Classroom.findOne({ _id: classroom });
      res.status(200).json(newClassroom);
    } else {
      res.status(400).json({ msg: "Classroom not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err.message);
  }
};

const uploadQuiz = async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.file);
    const { classroom, subject, quiz, link } = req.body;
    const filename = req.file == undefined ? "" : req.file.filename;
    const result = await Classroom.findOne({ _id: classroom });
    if (result) {
      const sub = result.subjects.find((sub) => sub._id == subject);
      const assesment = sub.quizzes.find((assesment) => assesment._id == quiz);
      assesment.link = link;
      assesment.answer = filename == "" ? "" : `/api/public/${filename}`;
      assesment.uploadDate = new Date();
      await result.save();
      const newClassroom = await Classroom.findOne({ _id: classroom });
      res.status(200).json(newClassroom);
    } else {
      res.status(400).json({ msg: "Classroom not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err.message);
  }
};

module.exports = {
  signUp,
  sendForgetPasswordEmail,
  resetPassword,
  login,
  emailVerification,
  userPanel,
  getAllPatients,
  getPatientCount,
  deletePatient,
  updatePatient,
  appointment: BookAppointment,
  saveAppointment,
  getAppointments,
  updateAppointment,
  deleteAppointment,
  // payment,
  getClassrooms,
  getClass,
  uploadAssignment,
  uploadQuiz,
};
