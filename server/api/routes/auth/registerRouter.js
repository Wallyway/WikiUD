import express from "express";
import { register } from "../../controllers/auth/authRegisterController.js";

const router = express.Router(); //Gestor de rutas

router.post("/", register);

export default router;
