const db = require("../db");
const { hash } = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const { SECRET } = require("../constants");

exports.getUsers = async (req, res) => {
  try {
    const { rows } = await db.query("SELECT user_id, email FROM users");

    return res.status(200).json({
      success: true,
      users: rows,
    });
  } catch (error) {
    console.log(error.message);
  }
};

exports.protected = async (req, res) => {
  console.log("protected function called");
  try {
    return res.status(200).json({
      info: "protected info",
    });
  } catch (error) {
    console.log(error.message);
  }
};

exports.register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await hash(password, 10);

    await db.query("INSERT INTO users(email,password) values ($1 , $2)", [
      email,
      hashedPassword,
    ]);

    return res.status(201).json({
      success: true,
      message: "Registration successful",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  let user = req.user;
  let payload = {
    id: user.user_id,
    email: user.email,
  };
  try {
    const token = await sign(payload, SECRET);
    return res.status(200).cookie("token", token, { httpOnly: true }).json({
      success: true,
      message: "Successfully logged in",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

exports.logout = async (req, res) => {
  try {
    return res
      .status(200)
      .clearCookie("token", token, { httpOnly: true })
      .json({
        success: true,
        message: "Successfully logged out",
      });
  } catch {
    console.log(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};
