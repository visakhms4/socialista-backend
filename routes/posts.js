const router = require("express").Router();
const {
  verify,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middlewares/verifyToken");
const {
  createPost,
  updatePost,
  deletePost,
  likeAndUnlike,
  getAPost,
  timeline,
  addComment,
  unComment,
  userPosts,
  getAllComments,
  allPosts,
  reportPost,
  allReports,
  rejectReport,
  resolveReport,
} = require("../controllers/postController");

//create a post
router.post("/", verify, createPost);

//update a post

router.put("/:id", verify, updatePost);

//delete a post

router.delete("/:id", verify, deletePost);

//like / dislike a post

router.put("/:id/like", verify, likeAndUnlike);

//get a post

router.get("/:id", getAPost);

//get timeline posts

router.get("/timeline/all", verify, timeline);

//comment
router.put("/:id/comment", verify, addComment);

//uncomment

router.put("/unComment/:id", verify, unComment);

//user's post
router.get("/profile/:id", verify, userPosts);
//all posts
router.get("/", verifyTokenAndAdmin, allPosts);

//report post
router.get("/reports/:id", verify, allReports);

//report post
router.put("/:id/report", verify, reportPost);

//reject report
router.delete("/:id/report", verify, rejectReport);

//resolve report
router.delete("/:id/rejectReport", verify, resolveReport);

module.exports = router;
