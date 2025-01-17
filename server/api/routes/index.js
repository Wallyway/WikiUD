import express from 'express';
import registerRouter from './auth/registerRouter.js';
import loginRouter from './auth/loginRouter.js';

function routerApi(app){
    const router = express.Router();
    app.use('/api/v1', router);     //Para poder manejar varias versiones de un endpoint
    
    router.use('/register', registerRouter);
    router.use('/login', loginRouter);
    // router.use('/teachers', teachersRouter);
    // router.use('/users', usersRouter);
    // router.use('/career', coursesRouter);
    // router.use('/subjects', subjectsRouter);
    // router.use('/comments', commentsRouter);
    // router.use('/rating', ratingRouter);
  }
  
  export default routerApi;
  