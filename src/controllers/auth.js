const db = require("../db");
const { hash } = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const { SECRET } = require("../constants");

// USER ROUTES

exports.getUsers = async (req, res) => {
  try {
    const { rows } = await db.query("SELECT user_id, user_email FROM users");

    return res.status(200).json({
      success: true,
      users: rows,
    });
  } catch (error) {
    console.log(error.message);
  }
};
exports.register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await hash(password, 10);

    await db.query(
      "INSERT INTO users(user_email,user_password) values ($1 , $2)",
      [email, hashedPassword]
    );

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
    email: user.user_email,
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
    return res.status(200).clearCookie("token", { httpOnly: true }).json({
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

// GUEST LIST ROUTES

//  gets individual user guest list
exports.protected = async (req, res) => {
  try {
    const user = await db.query(
      "SELECT users.user_email, guests.guest_id, guests.guest_name, guests.guest_number, guests.address, guests.rsvp_status, guests.invite_sent, guests.std_sent FROM users LEFT JOIN guests ON users.user_id = guests.user_id WHERE users.user_id = $1",
      [req.user.id]
    );

    res.json(user.rows);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error!");
  }
};
//  gets all users' guest list
exports.allGuests = async (req, res) => {
  try {
    const user = await db.query(
      "SELECT users.user_email, guests.guest_id, guests.guest_name, guests.guest_number, guests.address, guests.rsvp_status, guests.invite_sent, guests.std_sent FROM users LEFT JOIN guests ON users.user_id = guests.user_id"
    );

    res.json(user.rows);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error!");
  }
};
// add guest to your guest list
exports.addGuest = async (req, res) => {
  try {
    const { name, numGuest, address, rsvpStatus, inviteStatus, stdStatus } =
      req.body;
    const newGuest = await db.query(
      "INSERT INTO guests (user_id, guest_name, guest_number, address, rsvp_status, invite_sent, std_sent) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [
        req.user.id,
        name,
        numGuest,
        address,
        rsvpStatus,
        inviteStatus,
        stdStatus,
      ]
    );
    res.json(newGuest.rows);
    console.log(req.body);
  } catch (error) {
    console.log(error.message);
  }
};
// update guest
exports.updateGuest = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, numGuest, address, rsvpStatus, inviteStatus, stdStatus } =
      req.body;
    const updatingGuest = await db.query(
      "UPDATE guests SET guest_name = $2, guest_number = $3, address = $4, rsvp_status = $5, invite_sent = $6, std_sent = $7 WHERE guest_id = $1 RETURNING *",
      [id, name, numGuest, address, rsvpStatus, inviteStatus, stdStatus]
    );
    if (updatingGuest.rows === 0) {
      return res.json("You are not authorized to change this guest's info.");
    }
    res.json("Guest was updated successfully");
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
};
// delete guest
exports.deleteGuest = async (req, res) => {
  try {
    const { id } = req.params;
    const deletingGuest = await db.query(
      "DELETE FROM guests WHERE guest_id = $1",
      [id]
    );
    res.json("Guest deleted successfully");
    if (deletingGuest.rowCount === 0) {
      return res.status(404).json({ error: "Guest not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.error(error.message);
    if (process.env.NODE_ENV === "development") {
      return res.status(500).json({ error: error.message });
    }
    res.status(500).send();
  }
};
