import jwt from "jsonwebtoken";
import { asyncHandler } from "./asyncHandler.js";
import { ApiError } from "./ApiError.js";

// Middleware to verify the JWT access token
export const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;
    // req.header('Authorization')?.split(' ')[1]; // Authorization header format: "Bearer <token>"
    // console.log(token);

    if (!token)
      return res.status(401).json({ message: "Access token is required" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err)
        return res.status(401).json({ message: "Invalid or expired token" });

      // req.userId = decoded.userId;
      req.userDetails = decoded;
      req.userId=decoded.userId;
      // console.log(decoded);

      next(); // Proceed to the next middleware or route handler
    });
  } catch (error) {
    console.log("error in verify token", error);
  }
};
//Admin verify
export const isTeacher = asyncHandler(async (req, res, next) => {
  try {
    const user = req.userDetails; // Get user information attached to the request

    // Check if the user has the 'Teacher' role
    if (user.role !== "Teacher") {
      throw new ApiError(403, "You are not authorized to perform this action");
    }

    next(); // User is Teacher, proceed to the next middleware or route handler
  } catch (error) {
    next(error); // Pass any errors to the error handler middleware
  }
});


export const isStudent = asyncHandler(async (req, res, next) => {
  try {
    const user = req.userDetails; // Get user information attached to the request

    // Check if the user has the 'Student' role
    if (user.role !== "Student") {
      throw new ApiError(403, "You are not authorized to perform this action");
    }

    next(); // User is Student, proceed to the next middleware or route handler
  } catch (error) {
    next(error); // Pass any errors to the error handler middleware
  }
});

// Middleware to check if the user is an Institute
export const isInstitute = asyncHandler(async (req, res, next) => {
  try {
    const user = req.userDetails; // Get user information attached to the request

    // Check if the user has the 'Institute' role
    if (user.role !== "Institute") {
      throw new ApiError(403, "You are not authorized to perform this action");
    }

    next(); // User is Institute, proceed to the next middleware or route handler
  } catch (error) {
    next(error); // Pass any errors to the error handler middleware
  }
});

export const accessToken = async (id, email,phone_number, role) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { userId: id, email, role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.ACEESS_TOKEN_EXPIRE },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    );
  });
};

export const refreshToken = async (id) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { userId: id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRE },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    );
  });
};
