const { header, body, param, validationResult } = require('express-validator')

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
const passwordTokenValidation = () => {
  return [header('passwordToken').isJWT()]
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
const resetPasswordValidation = () => {
  return [emailValidation()]
}
const newPasswordValidation = () => {
  return [
    emailValidation(),
    passwordValidation(),
    confirmPasswordValidation(),
    passwordTokenValidation(),
  ]
}
const firstStepTokenValidation = () => {
  return [header('firstStepToken').isJWT()]
}
const sixDigitCodeValidation = () => {
  return [body('sixDigitCode').isInt().isLength({ min: 6, max: 6 })]
}

const firstStepLoginValidation = () => {
  return [emailValidation(), passwordValidation()]
}
const secondStepLoginValidation = () => {
  return [sixDigitCodeValidation(), firstStepTokenValidation()]
}
const reSendSecondStepCodeValidation = () => {
  return [firstStepTokenValidation()]
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
  resetPasswordValidation,
  newPasswordValidation,
  firstStepLoginValidation,
  secondStepLoginValidation,
  reSendSecondStepCodeValidation,
  validate,
}
