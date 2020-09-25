const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const exshbs = require('express-handlebars')
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const homeRoutes = require('./routes/home')
const addRoutes = require('./routes/add')
const coursesRoutes = require('./routes/courses')
const cartRoutes = require('./routes/cart')
const User = require('./models/user')

const app = express()

const hbs = exshbs.create({
  defaultLayout: 'main', 
  extname: 'hbs',
  handlebars: allowInsecurePrototypeAccess(Handlebars)
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))

app.use(async (req, res, next) => {
  try {
    const user = await User.findById('5f6cb2496a722b59ac4f3dc1')
    req.user = user  
    next()  
  } catch (error) {
    console.log(error)
  }
})

app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/cart', cartRoutes)

const PORT = process.env.PORT || 3000

async function start() {
  try {
    const url = `mongodb+srv://CyberPunk10:PFs7yix1Bh4lnaKz@cluster0.owfrf.mongodb.net/shop`
    // const url = `mongodb+srv://CyberPunk10:PFs7yix1Bh4lnaKz@cluster0.owfrf.mongodb.net/shop?w=majority`
    await mongoose.connect(url, { 
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    })

    const candidate = await User.findOne()
    if(!candidate) {
      const user = new User({
        email: 'cyberpunk10@mail.ru',
        name: 'cyberpunk10',
        cart: {items: []}
      })
      await user.save()
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  } catch (error) {
    console.log(error)
  }
}

start()



