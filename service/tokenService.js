const jwt = require('jsonwebtoken')
const tokenModel = require('../models/tokenModel')

class TokenService {
  generateToken(payload){
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '30m'})
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'})

    return{
      accessToken,
      refreshToken
    }
  }

  async saveToken(userId, refreshToken){
    const tokeData = await tokenModel.findOne({user: userId})
    if (tokeData){
      tokeData.refreshToken = refreshToken
      return tokeData.save()
    }

    const token = await tokenModel.create({user: userId, refreshToken})
    return token
  }
}

module.exports = new TokenService()
