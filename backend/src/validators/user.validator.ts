import { body } from 'express-validator';

/**
 * Validator schema for updating user profile via PUT /api/v1/users/me
 */
export const validateUpdateMe = [
  body('domain')
    .optional()
    .trim()
    .isString().withMessage('Domain must be a string.')
    .isLength({ max: 100 }).withMessage('Domain cannot exceed 100 characters.'),

  body('targetRole')
    .optional()
    .trim()
    .isString().withMessage('Target role must be a string.')
    .isLength({ max: 100 }).withMessage('Target role cannot exceed 100 characters.'),

  body('dreamJob')
    .optional()
    .trim()
    .isString().withMessage('Dream job must be a string.')
    .isLength({ max: 100 }).withMessage('Dream job cannot exceed 100 characters.'),

  body('bio')
    .optional()
    .trim()
    .isString().withMessage('Bio must be a string.')
    .isLength({ max: 500 }).withMessage('Bio cannot exceed 500 characters.'),

  body('profileCompleted')
    .optional()
    .isBoolean().withMessage('profileCompleted must be a boolean value.'),

  body('education')
    .optional()
    .trim()
    .isString().withMessage('Education must be a string.')
    .isLength({ max: 100 }).withMessage('Education cannot exceed 100 characters.'),

  body('firstName')
    .optional()
    .trim()
    .isString().withMessage('First name must be a string.')
    .isLength({ max: 50 }).withMessage('First name cannot exceed 50 characters.'),

  body('lastName')
    .optional()
    .trim()
    .isString().withMessage('Last name must be a string.')
    .isLength({ max: 50 }).withMessage('Last name cannot exceed 50 characters.'),

  body('name')
    .optional()
    .trim()
    .isString().withMessage('Name must be a string.')
    .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters.'),

  body('avatar')
    .optional()
    .isString().withMessage('Avatar must be a string.'),

  body('skills')
    .optional()
    .isArray().withMessage('Skills must be an array.'),

  body('experiences')
    .optional()
    .isArray().withMessage('Experiences must be an array.'),

  body('certifications')
    .optional()
    .isArray().withMessage('Certifications must be an array.'),

  body('track')
    .optional()
    .trim()
    .isString().withMessage('Track must be a string.'),

  body('selectedTrack')
    .optional()
    .trim()
    .isString().withMessage('Selected track must be a string.'),
];
