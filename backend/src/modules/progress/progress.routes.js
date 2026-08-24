const express = require("express");
const router = express.Router();
const controller = require("./progress.controller");
const auth = require("../../middleware/auth");
const trainerOrAdmin = require("../../middleware/trainerOrAdmin");


router.use(auth);

router.post("/", controller.createProgress);
router.get("/", controller.getProgress);

router.get("/trainer", trainerOrAdmin, controller.getProgressForTrainer);

router.get("/:id", controller.getProgressById);
router.put("/:id", controller.updateProgress);
router.delete("/:id", controller.deleteProgress);

module.exports = router;
