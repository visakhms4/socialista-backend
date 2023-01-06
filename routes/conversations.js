const router = require("express").Router();

const { newConversation, getConv, getConvIncTwo } = require("../controllers/conversationController");
const {verify} = require("../middlewares/verifyToken");

//new conv

router.post("/",verify, newConversation);

//get conv of a user

router.get("/:userId",verify, getConv);

// get conv includes two userId

router.get("/find/:firstUserId/:secondUserId",verify, getConvIncTwo);

module.exports = router;