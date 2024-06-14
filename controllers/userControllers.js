const express = require("express");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const generateToken = require("../utils/generateToken");
const cloudinary = require("../utils/cloudinaryImageUpload");

//
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("user already exists");
  }
  const image_URL = req.body.pic;
  const cloudinary_res = await cloudinary.uploader.upload(image_URL, {
    folder: "/notezipper",
  });
  console.log(`Cloudinary URL: ${cloudinary_res.url}`);
  const user = await User.create({
    name,
    email,
    password,
    pic: cloudinary_res.url,
  });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("error occured while registering user !!!");
  }
});

// jwt token certifies the user identity, and sends it to the client

//
const authUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  const image_URL = user.pic;
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
    console.log(`image_URL: ${image_URL}`);
  } else {
    res.status(400);
    throw new Error("Invalid Email or Password !!!");
  }
});

const updateUserProfile = asyncHandler(async (req, res, next) => {
  const { name, email, password, pic } = req.body;
  const user = await User.findById(req.user._id);

  const image_URL = req.body.pic;
  const cloudinary_res = await cloudinary.uploader.upload(image_URL, {
    folder: "/notezipper",
  });
  console.log(`Cloudinary URL: ${cloudinary_res.url}`);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.pic = cloudinary_res.url;
    if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      pic: updatedUser.pic,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error("user not found");
  }
});
//
module.exports = { registerUser, authUser, updateUserProfile };
