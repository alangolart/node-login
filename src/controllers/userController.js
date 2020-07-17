const { register, registerConfirmation } = require('../services/userService')

exports.register = async (req, res, next) => {
  try {
    const response = await register(req.body)
    res.status(response.status || 200).json(response)
  } catch (error) {
    next(error)
  }
}
exports.registerConfirmation = async (req, res, next) => {
  try {
    console.log(req.params.token)
    const response = await registerConfirmation(req.params.token)
    res.status(response.status || 200).json({ response })
  } catch (error) {
    next(error)
  }
}
