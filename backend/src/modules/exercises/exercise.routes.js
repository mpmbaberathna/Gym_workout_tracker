const express = require("express");
const router = express.Router();

const auth = require("../../middleware/auth");
const trainerOrAdmin = require("../../middleware/trainerOrAdmin");

const {
  createExercise,
  getExercises,
  deleteExercise,
  updateExercise,
} = require("./exercise.controller");

//GET exercises
router.get("/", auth, trainerOrAdmin, getExercises);

//CREATE exercise
router.post("/", auth, trainerOrAdmin, createExercise);

//UPDATE exercise
router.put("/:id", auth, trainerOrAdmin, updateExercise);

//DELETE exercise
router.delete("/:id", auth, trainerOrAdmin, deleteExercise);

module.exports = router;