const router = require("express").Router();
const auth = require("../../middleware/auth");
const trainerOrAdmin = require("../../middleware/TrainerOrAdmin");
const controller = require("./plan.controller");

router.post("/", auth, trainerOrAdmin, controller.createPlan);
router.get("/trainer", auth, trainerOrAdmin, controller.getTrainerPlans);
router.get("/admin", auth, controller.getAllPlans);
router.post("/assign", auth, trainerOrAdmin, controller.assignPlan);
router.get("/member", auth, controller.getMemberPlans);
router.delete("/:id", auth, trainerOrAdmin, controller.deletePlan);
router.put("/:id", auth, trainerOrAdmin, controller.updatePlan);

module.exports = router;