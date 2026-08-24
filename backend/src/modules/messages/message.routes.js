const router = require("express").Router();
const controller = require("./message.controller");
const auth = require("../../middleware/auth");
const { adminOnly } = require("../../middleware/roles");

router.post("/", controller.createMessage);
router.get("/", auth, adminOnly, controller.getMessages);
router.put("/:id/reply", auth, adminOnly, controller.replyMessage);
router.delete("/:id", auth, adminOnly, controller.deleteMessage);

module.exports = router;