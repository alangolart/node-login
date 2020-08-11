const router = require('express').Router()
const {
  firstStepLoginValidation,
  secondStepLoginValidation,
  reSendSecondStepCodeValidation,
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
router.post(
  '/reSendSecondStepCode',
  reSendSecondStepCodeValidation(),
  validate,
  authController.postReSendSecondStepCode
)

module.exports = router
