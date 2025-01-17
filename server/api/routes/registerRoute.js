import express from 'express';

const router = express.Router();   //Gestor de rutas
const service = new RegisterService();    //Instancia de la clase RegisterService

// =============== POST

router.post('/', (req,res)=>{                 //FIXME: Check this deeply (Not finished)
  try {
    const body = req.body;
    res.status(201).json({
        message: 'User Created',
        data: body
    });
  } catch (error) {
    res.status(500).json({
        message: 'Error creating user',
        error: error.message
    });
  }
})       

