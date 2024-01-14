const Doctor = require("../model/doctorSchema");
const Patient = require("../model/patientSchema");
const bycrypt = require("bcryptjs");
const url = require("url");

const Register = async (req, res, next) => {
  const alreadyExist =
    req.body.role == "patient"
      ? await Patient.findOne({ email: req.body.email })
      : await Doctor.findOne({ email: req.body.email });
  if (alreadyExist) {
    if (alreadyExist.username == req.body.username)
      return res
        .status(409)
        .json({ message: "Email or Username already exist" });
  }
  if (
    !req.body.name ||
    !req.body.email ||
    !req.body.password ||
    !req.body.username
  )
    return res.status(400).json({ message: "Please fill all the fields" });

  next();
};

const Login = async (req, res, next) => {
  if (!req.body.email || !req.body.password)
    return res.status(400).json({ message: "Please fill all the fields" });
  // Below three lines of code are for parse the url to get the user type/role
  // const parsedUrl = url.parse(req.url, true);
  // const path = parsedUrl.pathname;
  // const userType = path.split("/")[1];

  // Other way: by getting role from body
  const find =
    // userType === "patient"
    req.body.role == "patient"
      ? await Patient.findOne({ email: req.body.email })
      : await Doctor.findOne({ email: req.body.email });
  if (!find) return res.status(404).json({ message: `Email does not exist` });
  const decrypt = bycrypt.compareSync(req.body.password, find.password);
  if (!decrypt) return res.status(401).json({ message: "Invalid Password" });
  req.user = find;
  next();
};

module.exports = { Register, Login };
