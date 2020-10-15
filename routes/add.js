const { Router } = require('express')
const { validationResult } = require('express-validator')
const auth = require('../middleware/auth')
const Course = require('../models/course')
const { addCourseValidators } = require('../utils/validators')
const router = Router()

router.get('/', auth, (req, res) => {
  res.render('add', {
    title: 'Добавить курс',
    isAdd: true
  })
})

router.post('/', auth, addCourseValidators, async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).render('/add', {
      title: 'Добавить курс',
      isAdd: true,
      error: errors.array()[0].msg
    })
  }

  // const course = new Course(req.body.title, req.body.price, req.body.image)
  const course = new Course({
    title: req.body.title,
    price: req.body.price,
    img: req.body.image,
    userId: req.user // аналогично req.user._id, т.к. Schema.Types.ObjectId
  })
  
  try {
    await course.save()
    res.redirect('/courses')    
  } catch (error) {
    console.log(error)
  }
})

module.exports = router