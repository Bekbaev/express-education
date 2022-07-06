const UserModel = require('../models/userModel')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const mailService = require('./mailService')
const tokenService = require('./tokenService')
const UserDto = require('../dtos/userDto')
const ApiError = require('../exception/apiError')

class UserService {
  async registration(email, password) {
    const candidate = await UserModel.findOne({email})
    if (candidate) {
      throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует.`)
    }

    const hashPassword = await bcrypt.hash(password, 3)
    const activationLink = uuid.v4()

    const user = await UserModel.create({email, password: hashPassword, activationLink})
    await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`)

    const userDto = new UserDto(user) // id, email, isActivated
    const tokens = tokenService.generateToken({...userDto})
    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return {...tokens, user: userDto}
  }

  async activate(activationLink) {
    const user = await UserModel.findOne({activationLink})
    if (!user) {
      throw ApiError.BadRequest('Неккоректная ссылка активации.')
    }

    user.isActivated = true;
    await user.save()
  }

  async login(email, password) {
    const user = await UserModel.findOne({email})
    if (!user) {
      throw ApiError.BadRequest(`Пользователь с таким email не найден.`)
    }

    const isPassEquals = await bcrypt.compare(password, user.password)
    if (!isPassEquals) {
      throw ApiError.BadRequest('Неверный пароль.')
    }

    const userDto = new UserDto(user)
    const tokens = tokenService.generateToken({...userDto})
    await tokenService.saveToken(userDto.id, tokens.refreshToken)
    return {...tokens, user: userDto}
  }
}

module.exports = new UserService()
