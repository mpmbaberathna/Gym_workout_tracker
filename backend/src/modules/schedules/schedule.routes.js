const express = require("express");
const router = express.Router();

const auth = require("../../middleware/auth");
const trainerOrAdmin = require("../../middleware/TrainerOrAdmin");

const controller = require("./schedule.controller");

router.use(auth);

//trainer
router.post("/", trainerOrAdmin, controller.createSchedule);
router.get("/trainer", trainerOrAdmin, controller.getTrainerSchedules);
// member
router.get("/member", controller.getMemberSchedule);
router.put("/:id/complete", controller.completeSchedule);

//trainer
router.get("/:id", trainerOrAdmin, controller.getScheduleById);
router.put("/:id", trainerOrAdmin, controller.updateSchedule);
router.delete("/:id", trainerOrAdmin, controller.deleteSchedule);

module.exports = router;