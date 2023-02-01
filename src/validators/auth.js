const { check } = require("express-validator");
const db = require("../db");
const { compare } = require("bcryptjs");

//password
const password = check("password")
  .isLength({ min: 6, max: 25 })
  .withMessage("Password must be a minimum of 6 characters. Please try again.");

//email
const email = check("email")
  .isEmail()
  .withMessage("Please provide a valid email address.");

//check if email already exits
const emailExists = check("email").custom(async (value) => {
  const { rows } = await db.query("SELECT * FROM users WHERE user_email = $1", [
    value,
  ]);

  if (rows.length) {
    throw new Error("Email already exists. Please input a new email.");
  }
});

//login validation
const loginFieldsCheck = check("email").custom(async (value, { req }) => {
  const user = await db.query("SELECT * FROM users WHERE user_email = $1", [
    value,
  ]);

  if (!user.rows.length) {
    throw new Error(
      "The username/password you used was incorrect. Please Try again"
    );
  }

  const validPassword = await compare(
    req.body.password,
    user.rows[0].user_password
  );

  if (!validPassword) {
    throw new Error(
      "The username/password you used was incorrect. Please Try again"
    );
  }

  req.user = user.rows[0];
});

module.exports = {
  registerValidation: [email, password, emailExists],
  loginValidation: [loginFieldsCheck],
};
