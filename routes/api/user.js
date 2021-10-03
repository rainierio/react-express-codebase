const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const withAuth = require("../../middleware/withAuth");

/**
 * GET api/userauth
 * get user information
 *
 */
router.get("/", withAuth, (req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.json({ msg: "User not found", err }));
});

/**
 * POST api/signup
 * create new user
 * public access
 */
router.post("/signup", (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    password: req.body.password,
    emailVerificationToken: "empty",
    emailVerified: false,
    createdat: Date.now(),
  });
  newUser
    .save()
    .then((userResp) =>
      res.send({
        msg: `User ${userResp.username} successfuly created `,
      })
    )
    .catch((err) => res.send({ msg: "error user creation", err }));
});

/**
 * POST api/singin
 * user login
 */
router.post("/signin", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email }, (err, user) => {
    if (err) {
      res.status(500).json({ error: "login error, please try again" });
    } else if (!user) {
      res.status(401).json({ error: "incorect email or username" });
    } else {
      user.isCorrectPassword(password, function (err, same) {
        if (err) {
          res.status(500).json({ error: "login error, please try again" });
        } else if (!same) {
          console.log("error password");
          res.status(401).json({ error: "Incorrect password" });
        } else {
          /** user logged in then generate token */
          const payload = { email };
          let userSession = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "300m",
          });
          res
            .cookie("USER_SESSION", userSession, { httpOnly: false })
            .status(200)
            .json({ username: user.username, email: user.email });
        }
      });
    }
  });
});

/**
 * POST api/signout
 * user logout
 */
router.get("/signout", (req, res) => {
  req.session.destroy((err) => {
    if (err)
      console.log("Error : Failed to destroy the session during logout.", err);
    req.body.username = null;
  });
});

/**
 * GET api/userprofile
 * get user profile
 */
router.get("/userprofile", withAuth, (req, res) => {
  User.findOne({ email: req.email }, (err, user) => {
    if (user) {
      res.status(200).send({
        username: user.username,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
      });
    } else {
      res.status(401).send({ error: "User not found" });
    }
  });
});

/**
 * GET api/checktoken
 * check current user token
 */
router.get("/checktoken", withAuth, (req, res) => {
  User.findOne({ email: req.email }, (err, user) => {
    if (user) {
      res.status(200).send({ username: user.username, email: user.email });
    } else {
      res.status(401).send({ error: "invalid token" });
    }
  });
});

/**
 * PUT api/updateprofile
 * update user profile data
 */
router.put("/updateprofile", (req, res) => {
  const {
    userEmail,
    userName,
    firstName,
    lastName,
    currentPassword,
    newPassword,
    repeatNewPassword,
  } = req.body;
  if (currentPassword && newPassword && repeatNewPassword) {
    User.findOne({ email: userEmail }, (err, user) => {
      user.isCorrectPassword(currentPassword, (err, same) => {
        if (err) {
          //console.log("connection error")
        } else if (!same) {
          //console.log("password error")
        } else if (newPassword !== repeatNewPassword) {
          //console.log("new password not same")
        } else {
          //update information without password update
          (user.username = userName),
            (user.firstname = firstName),
            (user.lastname = lastName),
            (user.password = newPassword);
          user
            .save()
            .then((result) => res.send({ msg: "success update user info" }));
        }
      });
    });
  } else if (currentPassword !== "" && newPassword !== repeatNewPassword) {
    //console.log( "New password and repeat new password must be filled")
  } else {
    //console.log("update data without password update")
    User.findOne({ email: userEmail }, (err, user) => {
      //update information without password update
      (user.username = userName),
        (user.firstname = firstName),
        (user.lastname = lastName);
      user.save().then((resp) => res.send({ msg: "success update user info" }));
    });
  }
});

module.exports = router;
