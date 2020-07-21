const { login } = require('../services/authService')

exports.postLogin = async (req, res, next) => {
  try {
    const response = await login(req.body)
    res.status(response.status || 200).json(response)
  } catch (error) {
    next(error)
  }
}
