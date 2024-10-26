import express from 'express';
const route = express.Router();   //Gestor de rutas


route.post('/sign-up');        //Ruta para registrar un usuario
route.get('/:id');              //Ruta para obtener un usuario
route.get('/');                 //Ruta para obtener todos los usuarios   
route.put('/:id');              //Ruta para actualizar un usuario
route.delete('/:id');           //Ruta para eliminar un usuario
