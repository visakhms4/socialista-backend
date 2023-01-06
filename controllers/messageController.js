const Message = require("../models/Message");
const NotificationModel = require("../models/Notification");

exports.addMessage = async (req, res) => {
  const newMessage = new Message(req.body);

  try {
    const savedMessage = await newMessage.save();
    if (req.body.sendNot) {
      NotificationModel.create({
        userId: req.body.receiverId,
        emiterId: req.user.id,
        text: "just sent you a message",
        postId: req.body.conversationId,
      });
    }
    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getMessage = async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
};
