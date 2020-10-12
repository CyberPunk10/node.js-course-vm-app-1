const { Router } = require('express')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
// const nodemailer = require('nodemailer')
const sendpulse = require('sendpulse-api')
const keys = require('../keys')
const regEmail = require('../emails/registration')
const resetEmail = require('../emails/reset')
const User = require('../models/user')
const router = Router()

const API_USER_ID = keys.SENDPULSE_API_ID
const API_SECRET = keys.SENDPULSE_API_SECRET
const TOKEN_STORAGE = "/tmp/"

// sendpulse.init(API_USER_ID,API_SECRET,TOKEN_STORAGE,function() {
//   sendpulse.listAddressBooks(console.log);
// })

// const answerGetter = function(data) {
//   console.log(data)
// }

// const transporter = nodemailer.createTransport(sendpulse.init(API_USER_ID, API_SECRET, TOKEN_STORAGE, function() {
//   sendpulse.listAddressBooks(console.log)
// }))

sendpulse.init(API_USER_ID, API_SECRET, TOKEN_STORAGE)

var answerGetter = function answerGetter(data){
    console.log(data)
}

sendpulse.addEmails(answerGetter, 1053116, [{email:'some@example.com',variables:{}}])


router.get('/login', async (req, res) => {
  res.render('auth/login', {
    title: 'Авторизация',
    isLogin: true,
    loginError: req.flash('loginError'),
    registerError: req.flash('registerError')
  })
})

router.get('/logout', async (req, res) => {
  // req.session.isAuthenticated = false
  req.session.destroy(() => { // после очищения сессии вызывается callback функция,
    res.redirect('/auth/login#login') // которая, в данном случае, делает редирект
  })
})

// вход
router.post('/login', async (req, res) => {
  try {
    const {email, password} = req.body

    const candidate = await User.findOne({email})

    if (candidate) {
      const areSame = await bcrypt.compare(password, candidate.password)

      if (areSame) {
        req.session.user = candidate
        req.session.isAuthenticated = true
        req.session.save(err => {
          if (err) {
            throw err
          }
          res.redirect('/')
        })
      } else {
        req.flash('loginError', 'Неверный пароль')
        res.redirect('/auth/login#login')
      }

    } else {
      req.flash('loginError', 'Такого пользователя не существует')
      res.redirect('/auth/login#login')
    }

  } catch (error) {
    console.log(error)
  }
})

// регистрация
router.post('/register', async (req, res) => {
  try {
    const {email, password, repeat, name} = req.body
    const candidate = await User.findOne({email})

    if (candidate) {
      // проверяем есть ли пользователь с таким email
      req.flash('registerError', 'Пользователь с таким email уже существует')
      res.redirect('/auth/login#register')
    } else {
      // если нет, то создаем его
      const hashPassword = await bcrypt.hash(password, 10)
      const user = new User({
        email, name, password: hashPassword, cart: {items: []}
      })
      await user.save()
      // await transporter.sendMail(regEmail(email))
      // await sendpulse.init(API_USER_ID,API_SECRET,TOKEN_STORAGE,function() {
      //   sendpulse.smtpSendMail(answerGetter, regEmail(email))
      // })
      // const emailObj = regEmail(email)
      // sendpulse.smtpSendMail(answerGetter, emailObj)
      // const emailObj = regEmail()
      // sendpulse.smtpSendMail(answerGetter, emailObj)
      res.redirect('/auth/login#login')
    }
  } catch (error) {
    console.log(error)
  }
})

// сброс пароля
router.get('/reset', (req, res) => {
  res.render('auth/reset', {
    title: 'Забыли пароль',
    // isReset: true,
    error: req.flash('error')
  })
})

router.post('/reset', (req, res) => {
  try {
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        req.flash('error', 'Что-то пошло не так, повторите попытку позже')
        return res.redirect('/auth/reset')
      }
      
      const token = buffer.toString('hex')
      const candidate = await User.findOne({email: req.body.email})
      
      if (candidate) {
        candidate.resetToken = token
        candidate.resetTokenExp = Date.now() + (60 * 60 * 1000)
        await candidate.save()
        // await transporter.sendMail(resetEmail(candidate.email, token))
        res.redirect('/auth/login')
      } else {
        req.flash('error', 'Такого email нет')
        return res.redirect('/auth/reset')
      }
    })
  } catch (error) {
    console.log(error)
  }

})

// восстановление пароля
router.get('/password', async (req, res) => {
  if (req.params.token) {
    return res.redirect('auth/login')
  }
  try {
    const user = await User.findOne({
      resetToken: req.params.token,
      resetTokenExp: {$gt: DataCue.now()}
    })  

    if (!user) {
      return res.redirect('auth/login')
    } else {
      res.render('auth/password', {
        title: 'Восстановить доступ',
        // isPassword: true,
        error: req.flash('error'),
        userId: user._id.toString(),
        token: req.params.token
      })
    }

  } catch (error) {
    console.log(error)
  }  
})

router.post('/password', async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.body.userId,
      resetToken: req.body.token,
      resetTokenExp: {$gt: Date.now()}
    })

    if (user) {
      user.password = await bcrypt.hash(req.body.password, 10)
      user.resetTokenExp = undefined
      user.resetTokenExp = undefined
      await user.save()
      res.redirect('auth/login')
    } else {
      req.flash('loginError', 'Время жизни токена истекло')
      return redirect('auth/login')
    }
  } catch (error) {
    console.log(error)
  }
})

module.exports = router