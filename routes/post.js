const express = require("express");
const router = express.Router();

const { upload } = require("../helpers/filehelper");

const {
  createPost,
  getAllPost,
  updatePost,
  getPostOfUser,
  getPostListOfUser,
  checkExpiredPost,
  SearchFilterPost,
  deletedPost,
  getAllPostOfUser,
  updateExpiredPost,
} = require("../controllers/post");
const middlewareController = require("../middleware/middleware");
router.post("/", upload.array("images"), createPost);
router.post("/update/:id", upload.array("images"), updatePost);
router.put("/check/:id", checkExpiredPost);
router.get("/", getAllPost);
router.get("/:id", getPostOfUser);
router.post("/list", getPostListOfUser);
router.post("/search", SearchFilterPost);
router.post("/deleted/:id", deletedPost);
router.post("/allPostOfUser", getAllPostOfUser);
router.post("/update-expired/:id", updateExpiredPost);
module.exports = router;
