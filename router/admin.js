const { Router } = require("express");
const router = Router();
const { Admins, validateAdmin } = require("../models/adminSchema");
const jwt = require("jsonwebtoken");
const { config } = require("dotenv");
config();

//--------- GET ADMINS ---------
router.get("/", async (req, res) => {
  try {
    const alladmins = await Admins.find();
    if (!alladmins.length) {
      return res
        .status(404)
        .json({ state: false, msg: "Data is not defined", innerData: null });
    }
    res
      .status(200)
      .json({ state: true, msg: "All admins", innerData: alladmins });
  } catch {
    res
      .status(500)
      .json({ state: false, msg: "Server error", innerData: null });
  }
});

//--------- SIGN UP ADMIN ---------
router.post("/", async (req, res) => {
  try {
    const { value, error } = validateAdmin(req.body);
    if (error) {
      return res
        .status(400)
        .json({ state: false, msg: error.details[0].message, innerData: null });
    }

    const exactAdmin = await Admins.findOne({ username: value.username });
    if (exactAdmin) {
      return res
        .status(400)
        .json({
          state: false,
          msg: "username is already been taken",
          innerData: null,
        });
    }

    value.phoneNumber = "+998" + value.phoneNumber;

    const newAdmin = await Admins.create(value);
    const saveAdmin = await newAdmin.save();
    res
      .status(201)
      .json({ state: true, msg: "Admin is created", innerData: saveAdmin });
  } catch {
    res
      .status(500)
      .json({ state: false, msg: "Server error", innerData: null });
  }
});

//--------- SIGN IN ADMIN ---------
router.post("/sign-in", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(403)
        .json({
          state: false,
          msg: "Username or password is empty",
          innerData: null,
        });
    }

    const exactAdmin = await Admins.findOne({ username }); // => {username : username}
    if (!exactAdmin) {
      return res
        .status(400)
        .json({
          state: false,
          msg: "Username or password is incorrect",
          innerData: null,
        });
    }

    if (exactAdmin.password !== password) {
      return res
        .status(400)
        .json({
          state: false,
          msg: "Username or password is incorrect",
          innerData: null,
        });
    }

    const token = jwt.sign(
      { _id: exactAdmin._id, username, isActive: exactAdmin.isActive },
      process.env.JWT_KEY
    );
    exactAdmin.password = "*".repeat(exactAdmin.password.length);
    res
      .status(200)
      .json({
        state: true,
        msg: "Successfully sign in",
        innerData: { admin: exactAdmin, token },
      });
  } catch {
    res
      .status(500)
      .json({ state: false, msg: "Server error", innerData: null });
  }
});

//--------- DELETE ADMIN ---------
router.delete("/:id", async (req, res) => {
  try {
    const deleteAdmin = await Admins.findByIdAndDelete(req.params.id);
    if (!deleteAdmin) {
      return res
        .status(400)
        .json({
          state: false,
          msg: "Admin o'chirilmadi",
          innerData: deleteAdmin,
        });
    }
    res
      .status(200)
      .json({ state: true, msg: "Admin o'chirildi", innerData: deleteAdmin });
  } catch {
    res
      .status(500)
      .json({ state: false, msg: "Server error", innerData: null });
  }
});

//--------- UPDATE ADMIN ---------
router.put("/:id", async (req, res) => {
  try {
    const { value, error } = validateAdmin(req.body);
    if (error) {
      return res
        .status(400)
        .json({ state: false, msg: error.details[0].message, innerData: null });
    }

    const exactAdmin = await Admins.findOne({ username: value.username });
    if (exactAdmin) {
      return res
        .status(400)
        .json({
          state: false,
          msg: "username is already been taken",
          innerData: null,
        });
    }

    value.phoneNumber = "+998" + value.phoneNumber;

    const updatedAdmin = await Admins.findByIdAndUpdate(req.params.id, value);
    res
      .status(200)
      .json({ state: true, msg: "Admin updated", innerData: updatedAdmin });
  } catch {
    res.json({ state: false, msg: "something went wrong", data: null });
  }
});

module.exports = router;
