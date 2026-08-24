const express = require("express");
const router = express.Router();

const auth = require("../../middleware/auth");
const trainerOrAdmin = require("../../middleware/trainerOrAdmin");

const {
  register,
  login,
  logout,
  getUsers,
  assignTrainer,
  getMyMembers,
  getMembersOnly,
  updateUserRole,
  updateUser,
  deleteUser,
  getMe,
  updateMe,
  deleteMe,
} = require("./user.controller");

//PUBLIC
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

//AUTHENTICATED USER - profile
router.get("/me", auth, getMe);
router.put("/me", auth, updateMe);
router.delete("/me", auth, deleteMe);

//ADMIN
router.get("/", auth, trainerOrAdmin, getUsers);
router.put("/:id/role", auth, trainerOrAdmin, updateUserRole);
router.put("/:id", auth, trainerOrAdmin, updateUser);
router.delete("/:id", auth, trainerOrAdmin, deleteUser);

//TRAINER
router.get("/my-members", auth, trainerOrAdmin, getMyMembers);

//COMMON
router.get("/members", auth, trainerOrAdmin, getMembersOnly);
router.post("/assign-trainer", auth, trainerOrAdmin, assignTrainer);

module.exports = router;