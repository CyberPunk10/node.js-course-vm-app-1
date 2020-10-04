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

router.post('/register', async (req, res) => {
  try {
    const {email, password, repeat, name} = req.body
    const candidate = await User.findOne({email})

    if (candidate) {
      res.redirect('/auth/login#register')
    } else {
      const user = new User({
        email, name, password, cart: {items: []}
      })
      await user.save()
      res.redirect('/auth/login#login')
    }
  } catch (error) {
    console.log(error)
  }
})

module.exports = router