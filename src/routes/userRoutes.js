const router = require('express').Router()
const userController = require('../controllers/userController')
const {
  registerValidation,
  registerConfirmationValidation,
  validate,
} = require('../helpers/validator')

router.post('/register', registerValidation(), validate, userController.register)
router.put(
  '/confirmation/:token',
  registerConfirmationValidation(),
  validate,
  userController.registerConfirmation
)

module.exports = router
