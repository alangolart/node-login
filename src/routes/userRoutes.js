const router = require('express').Router()
const userController = require('../controllers/userController')
const {
  registerValidation,
  registerConfirmationValidation,
  resetPasswordValidation,
  newPasswordValidation,
  validate,
} = require('../helpers/validator')

router.post('/register', registerValidation(), validate, userController.register)
router.put(
  '/confirmation/:token',
  registerConfirmationValidation(),
  validate,
  userController.registerConfirmation
)
router.post('/reset', resetPasswordValidation(), validate, userController.postResetPassword)
router.put('/new-password', newPasswordValidation(), validate, userController.postNewPassword)

module.exports = router
