const express = require("express");

const GameController = require("../controllers/posts");
const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");
const router = express.Router();


router.put("/addScore", checkAuth, GameController.addScore);
// router.post("",extractFile, PostController.createPost);

// router.put("/:id", extractFile, PostController.updatePost);

// router.get("", PostController.getPosts);

// router.get("/:id", PostController.getPost);

// router.delete("/:id",checkAuth, PostController.deletePost);


module.exports = router;
