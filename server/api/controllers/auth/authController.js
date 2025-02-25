import User from "../../models/userModel.js";
import jwt from "jsonwebtoken";

export const Login = async (req, res) => {
  try {
    const { name, email, avatar } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      const newUser = new User({
        name,
        email,
        avatar,
      });
      user = await newUser.save();
    }

    user = user.toObject({ getters: true }); // Convertir el objeto a un objeto de JS

    const token = jwt.sign(user, process.env.JWT_SECRET);

    res.cookie("access_token", token, {
      httpOnly: true,
      expires: new Date() + 9999,
    });

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: error.message,
      error,
    });
  }
};

export const getUser = async (req, res) => {};
