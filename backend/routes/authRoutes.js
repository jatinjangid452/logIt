const express = require("express");
const { registerUser, loginUser, getAllUsers, getTechnicians,getAllManagers, deleteUser } = require("../controllers/authController");

const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware"); 
const { getLoggedInUser } = require("../controllers/authController");
router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/users", getAllUsers);
router.get("/managers", getAllManagers);

router.get("/technicians", getTechnicians);
router.get("/me", authMiddleware, getLoggedInUser);
router.delete("/users/:id", deleteUser);
module.exports = router;
