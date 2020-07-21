const router = require('express').Router()
const { loginValidation, validate } = require('../helpers/validator.js')
const authController = require('../controllers/authController')

router.post('/login', loginValidation(), validate, authController.postLogin)

module.exports = router
