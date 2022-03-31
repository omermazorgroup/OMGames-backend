const express = require("express");
const UserController = require("../controllers/user")
const user = require("../models/user");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");

router.post("/signup", UserController.createUser);
router.get("/getUsernames", UserController.getUsernames);
router.post("/checkEmail", UserController.checkEmail);
router.post("/onVerify", UserController.onVerify);
router.post("/login", UserController.userLogin);
router.get("/getUsers", UserController.getUsers);
router.get("/getAuthUser/:id", UserController.getAuthUser);
router.put("/editUser", checkAuth, UserController.editUser);
module.exports = router;
