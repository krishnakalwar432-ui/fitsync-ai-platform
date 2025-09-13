import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

// Validation schemas
const schemas = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])')).required()
      .messages({
        'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'
      }),
    name: Joi.string().min(2).max(50).required(),
    dateOfBirth: Joi.date().max('now').required(),
    fitnessLevel: Joi.string().valid('BEGINNER', 'INTERMEDIATE', 'ADVANCED').required(),
    goals: Joi.array().items(Joi.string()).optional()
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  updateProfile: Joi.object({
    name: Joi.string().min(2).max(50).optional(),
    height: Joi.number().positive().max(300).optional(),
    weight: Joi.number().positive().max(1000).optional(),
    fitnessLevel: Joi.string().valid('BEGINNER', 'INTERMEDIATE', 'ADVANCED').optional(),
    goals: Joi.array().items(Joi.string()).optional(),
    activityLevel: Joi.string().valid('SEDENTARY', 'LIGHT', 'MODERATE', 'ACTIVE', 'VERY_ACTIVE').optional(),
    dietaryRestrictions: Joi.array().items(Joi.string()).optional()
  }),

  createWorkout: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().max(500).optional(),
    difficulty: Joi.string().valid('BEGINNER', 'INTERMEDIATE', 'ADVANCED').required(),
    duration: Joi.number().positive().required(),
    exercises: Joi.array().items(
      Joi.object({
        exerciseId: Joi.string().required(),
        sets: Joi.number().positive().required(),
        reps: Joi.number().positive().optional(),
        duration: Joi.number().positive().optional(),
        weight: Joi.number().positive().optional(),
        restTime: Joi.number().positive().optional()
      })
    ).min(1).required(),
    tags: Joi.array().items(Joi.string()).optional()
  }),

  createMealPlan: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().max(500).optional(),
    targetCalories: Joi.number().positive().required(),
    meals: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        type: Joi.string().valid('BREAKFAST', 'LUNCH', 'DINNER', 'SNACK').required(),
        foods: Joi.array().items(
          Joi.object({
            foodId: Joi.string().required(),
            quantity: Joi.number().positive().required(),
            unit: Joi.string().required()
          })
        ).min(1).required()
      })
    ).min(1).required()
  }),

  aiChatMessage: Joi.object({
    message: Joi.string().min(1).max(1000).required(),
    context: Joi.object({
      workoutId: Joi.string().optional(),
      nutritionId: Joi.string().optional(),
      goalId: Joi.string().optional()
    }).optional()
  })
};

// Validation middleware factory
const createValidationMiddleware = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      return res.status(400).json({
        error: 'Validation failed',
        details: errors
      });
    }

    req.body = value;
    next();
  };
};

// Export validation middleware
export const authValidation = {
  register: createValidationMiddleware(schemas.register),
  login: createValidationMiddleware(schemas.login)
};

export const userValidation = {
  updateProfile: createValidationMiddleware(schemas.updateProfile)
};

export const workoutValidation = {
  createWorkout: createValidationMiddleware(schemas.createWorkout)
};

export const nutritionValidation = {
  createMealPlan: createValidationMiddleware(schemas.createMealPlan)
};

export const aiValidation = {
  chatMessage: createValidationMiddleware(schemas.aiChatMessage)
};

// Query parameter validation
export const validateQueryParams = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      return res.status(400).json({
        error: 'Query validation failed',
        details: errors
      });
    }

    req.query = value;
    next();
  };
};