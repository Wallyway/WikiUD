import User from "../../models/userModel.js";
import bcrypt from "bcrypt";

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userFound = await User.findOne({ email });

    if (!userFound) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, userFound.password);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid Credentials" });

    const token = await createAccessToken({ id: userSaved._id });
    res.cookie("token", token);
    res.json({
      id: userSaved._id,
      username: userSaved.username,
      email: userSaved.email,
      createdAt: userSaved.createdAt,
      updatedAt: userSaved.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true, //Para que no se pueda acceder a la cookie desde el navegador
    expires: new Date() + 9999, // Para que la cookie expire en 9999
    secure: true, //Para que solo se pueda acceder a la cookie mediante HTTPS
    sameSite: "none", //Para que la cookie se pueda enviar a través de un dominio diferente
  });
};
