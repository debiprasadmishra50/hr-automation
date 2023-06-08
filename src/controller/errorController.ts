import { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError";

const sendError = (err: AppError, req: Request, res: Response) => {
  // NOTE: 1. FOR API
  if (req.originalUrl.startsWith("/api")) {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // Programming or other unknown bug: don't leak error details
    // 1. Log error to console
    console.error("Error: ", err);
  }

  // NOTE: 2. FOR WEBSITE
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    // return res.status(err.statusCode).render("error", {
    //   title: "Something Went Wrong!",
    //   msg: err.message,
    // });
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // Programming or other unknown bug: don't leak error details
  // 1. Log error to console
  console.error("Error: ", err);

  // 2. Send a generic message
  // return res.status(err.statusCode).render("error", {
  //   title: "Something Went Wrong!",
  //   msg: "Please try again later.",
  // });
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

export default (err: AppError, req: Request, res: Response, next: NextFunction) => {
  // console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // console.log("senderror");
  // console.log(process.env.NODE_ENV);

  if (process.env.NODE_ENV === "DEV") sendError(err, req, res);
  else if (process.env.NODE_ENV === "PROD") {
    let error = Object.assign(err);

    // if (error.name === "CastError") error = handleCastErrorDB(error);
    // if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    // if (error.name === "ValidationError") error = handleValidationErrorDB(error);
    // if (error.name === "JsonWebTokenError") error = handleJWTError();
    // if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

    sendError(error, req, res);
  }
};
