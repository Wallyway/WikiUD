import express from "express";
import registerRouter from "./auth/registerRouter.js";
import loginRouter from "./auth/loginRouter.js";

/**
 * Sets up the API routes for the application.
 *
 * @param {Object} app - The Express application instance.
 *
 * @description
 * This function initializes the API routes under the '/api/v1' path. It currently includes routes for user registration and login.
 * Additional routes for teachers, users, career, subjects, comments, and rating are commented out and can be enabled as needed.
 */

function routerApi(app) {
  const router = express.Router();
  app.use("/api/v1", router); //Para poder manejar varias versiones de un endpoint

  router.use("/register", registerRouter);
  router.use("/login", loginRouter);
  router.use("/logout", loginRouter);
  // router.use('/teachers', teachersRouter);
  // router.use('/users', usersRouter);
  // router.use('/career', coursesRouter);
  // router.use('/subjects', subjectsRouter);
  // router.use('/comments', commentsRouter);
  // router.use('/rating', ratingRouter);
}

export default routerApi;
