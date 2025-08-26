import { signInSchema, signUpSchema } from "../validators/user.js";
import User from "../models/user.js";
import { generateToken } from "../utils/jwt.js";
import { options, clearOptions } from "../utils/options.js";
import { logger } from "../utils/logger.js";

export const signUpController = async (req, res, next) => {
  try {
    const validate = signUpSchema.safeParse(req.body);
    if (!validate.success) {
      const formattedErrors = validate.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: formattedErrors,
      });
    }

    const body = validate.data;
    const existingUser = await User.findOne({ email: body.email }).lean();
    if (existingUser) {
      logger.warn('Registration attempt with existing email', {
        email: body.email,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });
      
      return res.status(409).json({
        success: false,
        message: "Validation failed",
        errors: [{ field: "email", message: "Email is already registered" }],
      });
    }

    const user = await User.create({
      name: body.name,
      email: body.email,
      password: body.password,
    });
    const token = generateToken(user._id);
    
    // Log successful registration
    logger.info('User registered successfully', {
      userId: user._id,
      email: user.email,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    res
      .status(201)
      .cookie("jwt", token, options)
      .json({
        success: true,
        message: "User created successfully",
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
      });
  } catch (error) {
    logger.error('Error in signUpController:', {
      error: error.message,
      stack: error.stack,
      body: req.body,
      ip: req.ip
    });
    next(error);
  }
};

export const signInController = async (req, res, next) => {
  try {
    const validate = signInSchema.safeParse(req.body);
    if (!validate.success) {
      const formattedErrors = validate.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: formattedErrors,
      });
    }

    const body = validate.data;
    
    // Find user and include password for comparison
    const user = await User.findOne({ email: body.email }).select('+password');
    
    // Timing attack prevention - always check password even if user doesn't exist
    let isPasswordValid = false;
    if (user) {
      isPasswordValid = await user.comparePassword(body.password);
    } else {
      // Perform a dummy password comparison to prevent timing attacks
      const bcrypt = await import('bcryptjs');
      await bcrypt.compare(body.password, '$2a$10$dummyhashtopreventtimingattacks');
    }

    if (!user || !isPasswordValid) {
      logger.warn('Failed login attempt', {
        email: body.email,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        reason: !user ? 'user_not_found' : 'invalid_password'
      });

      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
        errors: [],
      });
    }
    const token = generateToken(user._id);
    
    // Log successful login
    logger.info('User signed in successfully', {
      userId: user._id,
      email: user.email,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    res
      .status(200)
      .cookie("jwt", token, options)
      .json({
        success: true,
        message: "User signed in successfully",
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
      });
  } catch (error) {
    logger.error('Error in signInController:', {
      error: error.message,
      stack: error.stack,
      email: req.body?.email,
      ip: req.ip
    });
    next(error);
  }
};

export const logoutController = (req, res) => {
  try {
    // Log logout event
    logger.info('User logged out', {
      userId: req.user?._id,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

  res.clearCookie("jwt", clearOptions).status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    logger.error('Error in logoutController:', {
      error: error.message,
      userId: req.user?._id,
      ip: req.ip
    });
    
    // Still clear the cookie even if logging fails
  res.clearCookie("jwt", clearOptions).status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  }
};

export const getUserController = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        createdAt: req.user.createdAt,
      },
    });
  } catch (error) {
    logger.error('Error in getUserController:', {
      error: error.message,
      userId: req.user?._id,
      ip: req.ip
    });
    next(error);
  }
};
