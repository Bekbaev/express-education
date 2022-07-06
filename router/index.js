const Router = require('express').Router
const userController= require('../controllers/userController')
const router = new Router()
const {body} = require('express-validator')

router.post('/registration',
  body('email').isEmail(),
  body('password').isLength({min: 6, max: 32}),
  userController.registration
)

router.post('/login',
  body('email').isEmail(),
  body('password').isLength({min: 6, max: 32}),
  userController.login
)

router.post('/logout')
router.get('/activate/:link', userController.activate)
router.get('/refresh')
router.get('/users', userController.getUsers )

module.exports = router
