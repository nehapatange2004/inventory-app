import {
  comparePasswords,
  generateToken,
  hashPassword,
} from "../utils/auth.utils.js";
import User from "../models/User.js";

import dotenv from "dotenv";
dotenv.config();
// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_secret: process.env.API_SECRET,
//   api_key: process.env.API_KEY,
// });

export const signInUser = async (req, res) => {
  try {
    // console.log(req.body.name);
    // console.log(req.body.email);
    // console.log(req.body.password);
    const user = await User.findOne({ email: req.body.email });
    //match the password
    if (!user) {
      res.status(401).send({ error: "User not found!" });
    }

    const isMatch = await comparePasswords(req.body.password, user.password);
    if (!isMatch) {
      res.status(401).send({ error: "Invalid Credentials!" });
    }

    // const foundUser = {
    //   email: user.email,
    //   name: user.name,
    //   token: generateToken(user._id, user.email),
    //   profilepic: user.profilepic,
    //   preferences: user.preferences,
    //   id: user._id,
    // }

    // console.log("is Matched? ", isMatch);
    // console.log("wohoo!! the password is correct!");

    const foundUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id, user.email),
    };

    console.log(foundUser);
    res.send(foundUser);
  } catch (err) {
    console.log("Error while getting data from mongo: ", err);
    res.send({ error: "erorrrr-sigin" });
  }
};

export const signUpNewUser = async (req, res) => {
  try {
    // console.log(req.body.name);
    // console.log(req.body.email);
    // console.log(req.body.password);
    console.log("1")
    console.log(`Body: ${req.body}`)
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      console.log("User already exists: ", user);
      return res
        .status(403)
        .send({ error: "Already have an account! Consider logging in!" });
    }
    const hashedPassword = await hashPassword(req.body.password);
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      role: req.body.role || "customer"
    });
    await newUser.save();
    const createdUser = await User.findOne({ email: req.body.email });
    // const foundUser = {
    //   email: createdUser?.email,
    //   name: createdUser?.name,
    //   token: generateToken(createdUser?._id, createdUser?.email),
    // };

    const foundUser = {
      _id: createdUser?._id,
      name: createdUser?.name,
      email: createdUser?.email,
      token: generateToken(createdUser?._id, createdUser?.email),
    };

    console.log("Account Created successfully!");
    return res.send(foundUser);
  } catch (err) {
    console.log("Error while getting data from mongo: ", err);
    return res.send({ error: err });
  }
};
