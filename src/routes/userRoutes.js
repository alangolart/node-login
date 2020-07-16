const router = require('express').Router()
const userController = require('../controllers/userController')
const { registerValidation, validate } = require('../helpers/validator')

router.post('/register', registerValidation(), validate, userController.register)

module.exports = router
