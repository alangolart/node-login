const generateSixDigitCode = () => {
  return Math.floor(100000 + Math.random() * 900000)
}
const generateSecondStepCodeExpiration = () => {
  return Date.now() + 1800000
}

module.exports = {
  generateSixDigitCode,
  generateSecondStepCodeExpiration,
}
