const router = require("express").Router();
const {
  verify,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middlewares/verifyToken");
const {
  updateUser,
  blockUser,
  unblock,
  getUser,
  follow,
  unfollow,
  deleteUser,
  getAllUsers,
  getFriends,
  reportUser,
  rejectReport,
  resolveReport,
  getUserStats,
} = require("../controllers/userController");

//update user
router.put("/:id", verify, updateUser);

//get a user
router.get("/:id", getUser);

//get all users
router.get("/", verify, getAllUsers);

//get userStats
router.get("/stats/:id", verify, getUserStats);

//follow a user
router.put("/:id/follow", verify, follow);

//unfollow  user
router.put("/:id/unfollow", verify, unfollow);

//get friends
router.get("/friends/:userId", getFriends);

module.exports = router;
