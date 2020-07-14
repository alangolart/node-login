const { register } = require('../services/userService')

exports.register = async (req, res, next) => {
  try {
    const response = await register(req.body)
    res.status(response.status || 200).json(response)
  } catch (error) {
    next(error)
  }
}
