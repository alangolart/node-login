const router = require('express').Router()
const {
  firstStepLoginValidation,
  secondStepLoginValidation,
  validate,
} = require('../helpers/validator.js')
const authController = require('../controllers/authController')

router.post(
  '/firstStepLogin',
  firstStepLoginValidation(),
  validate,
  authController.postFirstStepLogin
)
router.post(
  '/secondStepLogin',
  secondStepLoginValidation(),
  validate,
  authController.postSecondStepLogin
)

module.exports = router
