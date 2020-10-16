// libs
const express = require('express')
const path = require('path')
const csrf = require('csurf')
const flash = require('connect-flash')
const mongoose = require('mongoose')
// const helmet = require('helmet')
const compression = require('compression')
const exshbs = require('express-handlebars')
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session) // вернет fn, которую нужно вызвать, которая вернет Класс
// routes
const homeRoutes = require('./routes/home')
const addRoutes = require('./routes/add')
const coursesRoutes = require('./routes/courses')
const cartRoutes = require('./routes/cart')
const ordersRoutes = require('./routes/orders')
const authRoutes = require('./routes/auth')
const profileRoutes = require('./routes/profile')
// another
const varMiddleware = require('./middleware/variables')
const userMiddleware = require('./middleware/user')
const errorHandler = require('./middleware/error')
const fileMiddleware = require('./middleware/file')
const keys = require('./keys')

const app = express()
const hbs = exshbs.create({
  defaultLayout: 'main', 
  extname: 'hbs',
  helpers: require('./utils/hbs-helpers'),
  handlebars: allowInsecurePrototypeAccess(Handlebars)
})
const store = new MongoStore({
  collection: 'sessions',
  uri: keys.MONGODB_URI
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')))
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use(express.urlencoded({extended: true}))
app.use(session({
  secret: keys.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store
}))
app.use(fileMiddleware.single('avatar')) // после определения session и до csrf (порядок важен)
app.use(csrf())
app.use(flash())
// app.use(helmet())
app.use(compression())
app.use(varMiddleware)
app.use(userMiddleware)

app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/cart', cartRoutes)
app.use('/orders', ordersRoutes)
app.use('/auth', authRoutes)
app.use('/profile', profileRoutes)

app.use(errorHandler)

const PORT = process.env.PORT || 3000

async function start() {
  try {
    await mongoose.connect(keys.MONGODB_URI, { 
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    })

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  } catch (error) {
    console.log(error)
  }
}

start()

// myfocus.com

// 1. убрать из форм атрибут novalidation
// 2. настроить почту (пройти заново 6 part)
// 3. сделать загрузку файлов в профиле (part 7, 8-9 lessons)
// 4. part 8, 2/5 - helmet - при подключении ломается приложение, не разбирался, иду без него
// 5. 

