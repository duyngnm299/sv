const Post = require("../models/Post");
const mongoose = require("mongoose");

const { post } = require("../routes/post");

const createPost = async (req, res, next) => {
  try {
    let imagesArray = [];
    const {
      category_id,
      category_name,
      title,
      describe,
      address,
      province,
      district,
      ward,
      street,
      area,
      price,
      createdBy,
      userInfo,
      postType,
      numberDayPost,
      startDate,
      endDate,
    } = req.body;
    const postCode = Math.floor(10000 + Math.random() * 90000);

    const images = [...req.files];
    console.log(req.files);
    images.forEach((element) => {
      const image = {
        imageName: element.originalname,
        imagePath: element.path,
        imageType: element.mimetype,
        imageSize: fileSizeFormatter(element.size, 2),
      };
      imagesArray.push(image);
    });

    const newPost = await Post.create({
      category_id,
      category_name,
      title,
      describe,
      address,
      province,
      district,
      ward,
      street,
      area,
      price,
      images: imagesArray,
      createdBy,
      userInfo,
      postCode: "TPTP" + postCode,
      postType,
      numberDayPost,
      startDate,
      endDate,
    });
    res.status(200).json({ newPost });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
const getAllPost = async (req, res, next) => {
  try {
    const posts = await Post.find();
    res.status(200).json({ posts });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const fileSizeFormatter = (bytes, decimal) => {
  if (bytes === 0) {
    return "0 Bytes";
  }
  const dm = decimal || 2;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "YB", "ZB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1000));
  return (
    parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + " " + sizes[index]
  );
};

const updatePost = async (req, res) => {
  try {
    const id = req.params.id;
    const { title, describe, address, price } = req.body;

    const post = await Post.findByIdAndUpdate(
      id,
      {
        title,
        describe,
        address,
        price,
      },
      { new: true }
    );

    res.status(200).json({ post });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
};

const getPostOfUser = async (req, res) => {
  try {
    const id = req.params.id;
    const posts = await Post.find({ createdBy: id });
    res.status(200).json({ posts });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};

module.exports = {
  createPost,
  getAllPost,
  updatePost,
  getPostOfUser,
};
