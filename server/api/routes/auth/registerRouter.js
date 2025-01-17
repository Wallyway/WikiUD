import express from 'express';
import { register } from '../../controllers/authController.js';

const router = express.Router();   //Gestor de rutas

router.post('/', register)

export default router;  
