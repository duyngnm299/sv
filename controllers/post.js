const { Post } = require("../models/Post");
const { User } = require("../models/User");
const mongoose = require("mongoose");

const createPost = async (req, res, next) => {
  try {
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
    let imagesArray = [];
    const images = [...req.files];
    console.log(req.files);
    console.log(createdBy);
    images.forEach((element) => {
      const image = {
        imageName: element.originalname,
        imagePath: element.path,
        imageType: element.mimetype,
        imageSize: fileSizeFormatter(element.size, 2),
      };
      imagesArray.push(image);
    });
    console.log(createdBy);
    const newPost = new Post({
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
    const savedBook = await newPost.save();
    if (req.body.createdBy) {
      const createdBy = User.findById(req.body.createdBy);
      console.log(createdBy);
      const update = await createdBy.updateOne({
        $push: { post: savedBook._id },
      });
      console.log("update: " + { update });
    }
    res.status(200).json({ savedBook });
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

const SearchFilterPost = async (req, res) => {
  //sort
  const { _sort } = req.query;
  const [field, condition] = _sort?.split(":") || ["createdAt", "desc"];

  //pagination
  const page = req.query.page - 1 || 0;
  const limit = req.query.limit || 8;
  const start = page * limit;
  //price
  const price_gte = (req.query.price_gte && parseInt(req.query.price_gte)) || 0;
  const price_lte =
    (req.query.price_lte && parseInt(req.query.price_lte)) || 999999999999;
  console.log("limit", limit);
  //search
  const title = req.query.title || "";
  const ctgrName = req.query.category_name || "";
  const areaGte = (req.query.areaGte && parseInt(req.query.areaGte)) || 0;
  const areaLte =
    (req.query.areaLte && parseInt(req.query.areaLte)) || 99999999999;
  const type = req.query.type || "";
  // const status = req.query.status || "approved";
  //province
  const district = req.query.district || "";
  console.log(price_gte, price_lte);

  // console.log(
  //   "title",
  //   title,
  //   "district",
  //   district,
  //   "ctgr",
  //   ctgrName,
  //   "area",
  //   areaGte
  // );

  try {
    const post = await Post.find({
      $and: [
        { district: { $regex: district } },
        { price: { $gte: price_gte, $lte: price_lte } },
        { area: { $gte: areaGte, $lte: areaLte } },
        { category_name: { $regex: ctgrName } },
        { title: { $regex: title } },
        { postType: { $regex: type } },

        // { status: { $regex: status } },
      ],
    })
      .sort({ [field]: condition })
      .skip(start)
      .limit(limit);
    const total = await Post.find({
      $and: [
        { district: { $regex: district } },
        { price: { $gte: price_gte, $lte: price_lte } },
        { area: { $gte: areaGte, $lte: areaLte } },
        { category_name: { $regex: ctgrName } },
        { title: { $regex: title } },
        { postType: { $regex: type } },
      ],
    }).countDocuments();
    const pagination = {
      page: Number.parseInt(page),
      limit: Number.parseInt(limit),
      total,
    };
    return res.status(200).json({ post, pagination });
    // }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
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

const getPostListOfUser = async (req, res) => {
  //sort
  const { _sort } = req.query;
  const [field, condition] = _sort?.split(":") || ["createdAt", "desc"];
  //pagination
  const page = req.query.page - 1 || 0;
  const limit = req.query.limit || 8;
  const start = page * limit;
  const createdBy = req.query.createdBy || "";
  try {
    const post = await Post.find({
      $and: [
        // { district: { $regex: district } },
        // { price: { $gte: price_gte, $lte: price_lte } },
        // { area: { $gte: areaGte, $lte: areaLte } },
        // { category_name: { $regex: ctgrName } },
        // { title: { $regex: title } },
        // { postType: { $regex: type } },
        { createdBy: createdBy },

        // { status: { $regex: status } },
      ],
    })
      .sort({ [field]: condition })
      .skip(start)
      .limit(limit);
    const total = await Post.find({
      $and: [
        // { district: { $regex: district } },
        // { price: { $gte: price_gte, $lte: price_lte } },
        // { area: { $gte: areaGte, $lte: areaLte } },
        // { category_name: { $regex: ctgrName } },
        // { title: { $regex: title } },
        // { postType: { $regex: type } },
        { createdBy: createdBy },
      ],
    }).countDocuments();
    const pagination = {
      page: Number.parseInt(page),
      limit: Number.parseInt(limit),
      total,
    };
    return res.status(200).json({ post, pagination });
    // }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};

const checkExpiredPost = async (req, res) => {
  try {
    const id = req.params.id;
    const postExpired = await Post.findByIdAndUpdate(
      id,
      { status: "expired" },
      { new: true }
    );
    return res.status(200).json({ postExpired });
  } catch (error) {
    return res.status(400).json(error);
  }
};
module.exports = {
  createPost,
  getAllPost,
  SearchFilterPost,
  updatePost,
  getPostOfUser,
  checkExpiredPost,
  getPostListOfUser,
};
