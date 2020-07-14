const mongoose = require('mongoose')

const { Schema } = mongoose
const userSchema = new Schema(
  {
    email: {
      type: String,
      minlength: 3,
      required: true,
      lowercase: true,
      trim: true,
    },
    phoneNumber: {
      type: Number,
      minlength: 4,
      maxlength: 15,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    confirmedEmail: {
      type: Boolean,
      required: true,
      default: false,
    },
    admin: {
      type: Boolean,
      required: true,
      default: false,
    },
    twoFactorAuth: {
      type: Boolean,
      required: true,
      default: false,
    },
    secondStepCode: {
      type: Number,
      minlength: 6,
      maxlength: 6,
      min: 100000,
      max: 999999,
    },
    secondStepCodeExpiration: {
      type: Date,
      default: Date.now() - 1,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('User', userSchema)
