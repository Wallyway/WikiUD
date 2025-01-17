import express from 'express';

const router = express.Router();   //Gestor de rutas
const service = new RegisterService();    //Instancia de la clase RegisterService

// =============== POST

router.post('/', (req,res)=>{                 //Crear un usuario
    const {id} = req.params
    const body = req.body
    res.status(201).json({
      message: 'User Created',
      data: body,
      id,
    })
  })       

