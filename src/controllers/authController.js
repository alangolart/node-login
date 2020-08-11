const { firstStepLogin, secondStepLogin, reSendSecondStepCode } = require('../services/authService')

exports.postFirstStepLogin = async (req, res, next) => {
  try {
    const response = await firstStepLogin(req.body)
    res.status(response.status || 200).json(response)
  } catch (error) {
    next(error)
  }
}
exports.postSecondStepLogin = async (req, res, next) => {
  try {
    const response = await secondStepLogin(req.body, req.header('firstStepToken'))
    res
      .header('authToken', response.token)
      .status(response.status || 200)
      .json(response)
  } catch (error) {
    next(error)
  }
}
exports.postReSendSecondStepCode = async (req, res, next) => {
  try {
    const response = await reSendSecondStepCode(req.header('firstStepToken'))
    res.status(response.status || 200).json(response)
  } catch (error) {
    next(error)
  }
}
