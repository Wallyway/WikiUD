import express from 'express';
const route = express.Router();

route.post('/register');
route.get('/:id');
route.get('/');
route.put('/:id');
route.delete('/:id');
