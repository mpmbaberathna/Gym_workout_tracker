const express = require("express");
const router = express.Router();

const auth = require("../../middleware/auth");
const trainerOrAdmin = require("../../middleware/trainerOrAdmin");
const { adminOnly } = require("../../middleware/roles");

const {
  createWorkout,
  getTrainerWorkouts,
  getAllWorkouts,
  updateWorkout,
  deleteWorkout,
  assignWorkout,
  getWorkoutsForMember,
} = require("./workout.controller");

//ADMIN: get all workouts
router.get("/", auth, adminOnly, getAllWorkouts);

//TRAINER: own workouts
router.get("/trainer", auth, trainerOrAdmin, getTrainerWorkouts);

//MEMBER: assigned workouts
router.get("/member", auth, getWorkoutsForMember);

//CREATE
router.post("/", auth, trainerOrAdmin, createWorkout);

//UPDATE
router.put("/:id", auth, trainerOrAdmin, updateWorkout);

//DELETE
router.delete("/:id", auth, trainerOrAdmin, deleteWorkout);

//ASSIGN
router.post("/assign", auth, trainerOrAdmin, assignWorkout);

module.exports = router;