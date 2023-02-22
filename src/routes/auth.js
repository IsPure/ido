const { Router } = require("express");
const {
  getUsers,
  register,
  login,
  protected,
  logout,
  addGuest,
  allGuests,
  updateGuest,
  deleteGuest,
  getIndividualGuest,
} = require("../controllers/auth");
const {
  validationMiddleware,
} = require("../middlewares/validations-middlewares");
const { registerValidation, loginValidation } = require("../validators/auth");
const { userAuth } = require("../middlewares/auth-middleware");
const router = Router();

// User Routes
router.get("/get-users", getUsers);
router.post("/register", registerValidation, validationMiddleware, register);
router.post("/login", loginValidation, validationMiddleware, login);
router.get("/logout", logout);

// CRUD Routes
router.get("/my-guests", userAuth, protected);
router.post("/protected", userAuth, addGuest);
router.get("/all-guests", userAuth, allGuests);
router.put("/guest/:id", userAuth, updateGuest);
router.delete("/guest/:id", userAuth, deleteGuest);
router.get("/guest/:id", userAuth, getIndividualGuest);

module.exports = router;
