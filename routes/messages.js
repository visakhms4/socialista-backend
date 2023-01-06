const router = require("express").Router();
const { addMessage, getMessage } = require("../controllers/messageController");
const {verify} = require('../middlewares/verifyToken')
//add

router.post("/",verify, addMessage);

//get

router.get("/:conversationId",verify, getMessage);

module.exports = router;