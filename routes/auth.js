const { Router } = require('express')
const User = require('../models/user')
const router = Router()

router.get('/login', async (req, res) => {
  res.render('auth/login', {
    title: 'Авторизация',
    isLogin: true
  })
})

router.get('/logout', async (req, res) => {
  // req.session.isAuthenticated = false
  req.session.destroy(() => { // после очищения сессии вызывается callback функция,
    res.redirect('/auth/login#login') // которая, в данном случае, делает редирект
  })
})

router.post('/login', async (req, res) => {
  const user = await User.findById('5f6cb2496a722b59ac4f3dc1')
  req.session.user = user
  req.session.isAuthenticated = true
  req.session.save(err => {
    if (err) {
      throw err
    }
    res.redirect('/')
  })
})

// router.post('/register', async (req, res) => {

// })

module.exports = router