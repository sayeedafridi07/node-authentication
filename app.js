const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();
const dbConnect = require("./db/dbConnect");
const User = require("./db/userModel");
const auth = require("./auth");

dbConnect();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (request, response, next) => {
  response.json({
    message: "Server is running",
  });
  next();
});

app.post("/register", (request, response) => {
  bcrypt
    .hash(request.body.password, 10)
    .then((hashedPassword) => {
      const user = new User({
        email: request.body.email,
        password: hashedPassword,
      });
      user
        .save()
        .then((result) => {
          response.status(201).send({
            message: "User created",
            result,
          });
        })
        .catch((error) => {
          response.status(500).send({
            message: "Unable to create user",
            error,
          });
        });
    })
    .catch((error) => {
      response.status(500).send({
        message: "Failed to hash the password",
        error,
      });
    });
});

app.post("/login", (request, response) => {
  User.findOne({ email: request.body.email })
    .then((user) => {
      bcrypt
        .compare(request.body.password, user.password)
        .then((passwordCheck) => {
          if (!passwordCheck) {
            return response.status(400).send({
              message: "Passwords do not match",
            });
          }

          const token = jwt.sign(
            {
              userId: user._id,
              userEmail: user.email,
            },
            "RANDOM-TOKEN",
            { expiresIn: "24h" }
          );

          response.status(200).send({
            message: "Login successful",
            email: user.email,
            token,
          });
        })
        .catch((err) => {
          response.status(400).send({
            message: "Passwords do not match",
            err,
          });
        });
    })
    .catch((err) => {
      response.status(404).send({
        message: "Email not found",
        err,
      });
    });
});

app.get("/public-endpoint", (request, response) => {
  response.json({
    message: "This is a public endpoint. You can access it freely.",
  });
});

app.get("/private-endpoint", auth, (request, response) => {
  response.json({
    message: "You are authorized to access this private route.",
  });
});

app.get("/private-endpoint-two", auth, (request, response) => {
  response.json({
    message: "You are authorized to access the orders page.",
  });
});

module.exports = app;
