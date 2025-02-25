import express from "express";
import { getUser, Login } from "../controllers/auth/authController.js";

/**
 * Sets up the API routes for the application.
 *
 * @param {Object} app - The Express application instance.
 *
 * @description
 * This function initializes the API routes under the '/api/v1' path. It currently includes routes for login.
 * Additional routes for teachers, users, career, subjects, comments, and rating are commented out and can be enabled as needed.
 */

function routerApi(app) {
  const router = express.Router();
  app.use("/api/v1", router); //Para poder manejar varias versiones de un endpoint

  // router.use("/register", registerRouter);
  router.use("/auth/login", Login);
  router.use("get-user", getUser);
  // router.use('/teachers', teachersRouter);
  // router.use('/users', usersRouter);
  // router.use('/career', coursesRouter);
  // router.use('/subjects', subjectsRouter);
  // router.use('/comments', commentsRouter);
  // router.use('/rating', ratingRouter);
}

export default routerApi;
