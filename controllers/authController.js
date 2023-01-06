const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
require("dotenv").config();
const serverSID = process.env.Twilio_ServerSID;
const accoutSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require("twilio")(accoutSid, authToken);
exports.register = async (req, res) => {
  try {
    //generate new password
    if (req.body.username && req.body.email && req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      //create new user
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        phone: req.body.phone,
      });

      //save user and respond
      await newUser
        .save()
        .then((user) => {
          const { password, updatedAt, ...other } = user._doc;
          res.status(200).json(other);
        })
        .catch((err) => {
          res.status(400).json({ msg: "user already exist", err });
        });
    } else {
      res.status(400).json("fill all credentials");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.userLogin = async (req, res) => {
  try {
    if (req.body.email && req.body.password) {
      const user = await User.findOne({
        email: req.body.email,
      });
      !user && res.status(404).json("user not found");

      if (user) {
        const validPassword = await bcrypt.compare(
          req.body.password,
          user.password
        );
        !validPassword && res.status(400).json("wrong password");

        if (validPassword) {
          const accessToken = jwt.sign(
            { id: user._id, email: user.email },
            process.env.SECRET,
            { expiresIn: "7d" }
          );
          const { password, updatedAt, blocked, email, createdAt, ...other } =
            user._doc;
          res
            .cookie("accessToken", accessToken, {
              httpOnly: true,
              secure: true,
            })
            .status(200)
            .json({ other, accessToken });
        }
      }
    } else {
      res.status(400).json("please fill all the credentials");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};
exports.adminLogin = async (req, res) => {
  try {
    if (req.body.email && req.body.password) {
      const user = await Admin.findOne({
        email: req.body.email,
      });
      !user && res.status(404).json("user not found");

      if (user) {
        const validPassword = await bcrypt.compare(
          req.body.password,
          user.password
        );
        !validPassword && res.status(400).json("wrong password");

        if (validPassword) {
          const accessToken = jwt.sign(
            { id: user._id, email: user.email, isAdmin: user.isAdmin },
            process.env.SECRET,
            { expiresIn: "5d" }
          );
          const {
            password,
            updatedAt,
            profilePicture,
            coverPicture,
            followers,
            followings,
            blocked,
            email,
            createdAt,
            ...other
          } = user._doc;

          res
            .cookie("accessToken", accessToken, {
              httpOnly: true,
            })
            .status(200)
            .json({ other, accessToken });
        }
      }
    } else {
      res.status(400).json("please fill all the credentials");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.sentotpHandler = async (req, res) => {
  try {
    const user = await User.findOne({ phone: req.body.phno });
    console.log(user, "user");
    if (!user || user == null) {
      console.log("hi");
      res.status(403).json("please register before login");
    } else {
      client.verify
        .services(serverSID)
        .verifications.create({
          to: `+91${req.body.phno}`,
          channel: "sms",
        })
        .then((data) => {
          res.json("otp sent");
        })
        .catch((err) => {
          res.status(403).json("something went wrong! please try again later");
        });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};
exports.verifyotpHandler = async (req, res) => {
  const { otp, phno } = req.body;
  client.verify
    .services(serverSID)
    .verificationChecks.create({ to: `+91${phno}`, code: otp })
    .then(async (resp) => {
      console.log(resp);
      if (!resp.valid) {
        res.status(403).json({ err: "invalid otp" });
      } else {
        let user = await User.findOne({ phone: req.body.phno }); //get users details
        console.log(user);

        if (!user) {
          res.status(200).json({ message: "user not found" });
        } else {
          const accessToken = jwt.sign(
            { id: user._id, email: user.email, isAdmin: user.isAdmin },
            process.env.SECRET,
            { expiresIn: "5d" }
          );
          const { password, updatedAt, blocked, email, createdAt, ...other } =
            user._doc;

          res
            .cookie("accessToken", accessToken, {
              httpOnly: true,
              secure: true,
            })
            .status(200)
            .json({ other, accessToken });
        }
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ err: "error happend in otp verify" });
    });
};
