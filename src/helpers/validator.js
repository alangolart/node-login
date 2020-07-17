const { body, param, validationResult } = require('express-validator')

const emailValidation = () => {
  return [body('email').isEmail().normalizeEmail({ all_lowercase: true })]
}
const passwordValidation = () => {
  return [body('password').isLength({ min: 6 })]
}
const confirmPasswordValidation = () => {
  return [body('confirmPassword').isLength({ min: 6 })]
}
const mobileNumberValidation = () => {
  return [body('phoneNumber').isMobilePhone()]
}
const tokenValidation = () => {
  return [param('token').isJWT()]
}

const registerValidation = () => {
  return [
    emailValidation(),
    passwordValidation(),
    confirmPasswordValidation(),
    mobileNumberValidation(),
  ]
}
const registerConfirmationValidation = () => {
  return [tokenValidation()]
}

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }
  const extractedErrors = []
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }))
  return res.status(422).json({
    errors: extractedErrors,
  })
}

module.exports = {
  registerValidation,
  registerConfirmationValidation,
  validate,
}
