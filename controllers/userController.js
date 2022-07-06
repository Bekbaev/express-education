const userService = require('../service/userService')
const {validationResult} = require('express-validator')
const ApiError = require('../exception/apiError')

// CONSTANTS
const REFRESH_TOKEN_MAX_AGE = 30 * 24 * 60 * 1000 // 30 days

class UserController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req)

      if(!errors.isEmpty()){
        return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
      }

      const {email, password} = req.body
      const userData = await userService.registration(email, password)
      res.cookie('refreshToken', userData.refreshToken, {maxAge: REFRESH_TOKEN_MAX_AGE, httpOnly: true}) // if https, add secure: true

      return res.json(userData)
    } catch (e) {
      next(e)
    }
  }

  async login(req, res, next) {
    try {
      const errors = validationResult(req)

      if(!errors.isEmpty()){
        return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
      }

      const {email, password} = req.body
      const userData = await userService.login(email, password)

      res.cookie('refreshToken', userData.refreshToken, {maxAge: REFRESH_TOKEN_MAX_AGE, httpOnly: true}) // if https, add secure: true

      return res.json(userData)

    } catch (e) {
      next(e)
    }
  }

  async logout(req, res, next) {
    try {

    } catch (e) {
      next(e)
    }
  }

  async activate(req, res, next) {
    try {
      const activationLink = req.params.link;
      await userService.activate(activationLink)
      return res.redirect(process.env.CLIENT_URL)
    } catch (e) {
      next(e)
    }
  }

  async refresh(req, res, next) {
    try {

    } catch (e) {
      next(e)
    }
  }

  async getUsers(req, res, next) {
    try {
      res.json(['123', '12312', '12312'])
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new UserController()
