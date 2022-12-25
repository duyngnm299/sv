const { User } = require("../models/User");
const mongoose = require("mongoose");

const getUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(400).json(error);
  }
};

const updateUser = async (req, res) => {
  try {
    const id = req.params.id;

    const avatar = req?.file?.path;
    const {
      fullName,
      gender,
      dateOfBirth,
      username,
      password,
      email,
      address,
      province,
      district,
      ward,
      identityCard,
      zalo,
      phoneNumber,
      balance,
      saved,
    } = req.body;
    console.log(balance);
    const user = await User.findByIdAndUpdate(
      id,
      {
        fullName,
        username,
        password,
        email,
        profilePicture: avatar && avatar,
        address,
        phoneNumber,
        balance,
        gender,
        province,
        district,
        ward,
        identityCard,
        zalo,
        dateOfBirth,
        savedItem: saved && [...user.savedItem, saved],
      },
      { new: true }
    );

    return res.status(200).json({ user });
  } catch (error) {
    res.status(400).json({ error });
  }
};
const updateUserSavePost = async (req, res) => {
  try {
    const id = req.params.id;
    const { saved } = req.body;
    // console.log("[saved]: ", saved);
    const us = await User.findById(id);
    if (us.savedPost.length > 0) {
      let arrPost = [...us.savedPost];
      let temp = arrPost.some((item) => item._id === saved._id);
      if (temp) {
        return res.send("nothing change");
      }
      if (!temp) {
        arrPost.push(saved);
        us.savedPost = arrPost;
        us.save();
        return res.status(200).json({ us });
      }
    } else {
      us.savedPost = [saved];
      us.save();
      return res.status(200).json({ us });
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};
const deleteSavePost = async (req, res) => {
  try {
    const id = req.params.id;
    const { postId } = req.body;
    const us = await User.findById(id);
    let arr = [...us.savedPost];
    let newArr = arr.filter((item) => item._id !== postId);
    us.savedPost = newArr;
    us.save();
    return res.status(200).json({ us });
  } catch (error) {
    return res.status(400).json({ error });
  }
};
const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findByIdAndDelete(id);
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(400).json(error);
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

const getUserByEmail = async (req, res) => {
  try {
    const email = req.params.email.trim().toLowerCase();
    const user = await User.find({ email });
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
module.exports = {
  getUser,
  getUserByEmail,
  updateUser,
  updateUserSavePost,
  deleteSavePost,
  deleteUser,
};
