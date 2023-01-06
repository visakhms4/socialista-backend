const router = require("express").Router();
const {
  register,
  userLogin,
  sentotpHandler,
  verifyotpHandler,
  adminLogin,
} = require("../controllers/authController");
const validateUser = require("../middlewares/schemavalidate");
const schemas = require("../schemaValidate.js/auth.schema");

//REGISTER
router.post("/register", validateUser(schemas.createUser), register);

//LOGIN
router.post("/login", validateUser(schemas.userLogin), userLogin);

router.post("/admin-login", adminLogin);

router.post("/sendotp", sentotpHandler);

router.post("/otplogin", verifyotpHandler);

module.exports = router;
