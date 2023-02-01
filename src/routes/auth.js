const { Router } = require("express");
const {
  getUsers,
  register,
  login,
  protected,
  logout,
  addGuest,
} = require("../controllers/auth");
const {
  validationMiddleware,
} = require("../middlewares/validations-middlewares");
const { registerValidation, loginValidation } = require("../validators/auth");
const { userAuth } = require("../middlewares/auth-middleware");
const router = Router();

// User Routes
router.get("/get-users", getUsers);
router.get("/protected", userAuth, protected);
router.post("/register", registerValidation, validationMiddleware, register);
router.post("/login", loginValidation, validationMiddleware, login);
router.get("/logout", logout);

// CRUD Routes
// router.post("/protected", userAuth, addGuest);

module.exports = router;
