import express from 'express';
import {login} from '../../controllers/authController.js'; //Middleware de autenticación

const router = express.Router();   //Gestor de rutas

router.post('/', login); 
  
export default router;  