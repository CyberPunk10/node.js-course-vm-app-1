const { Router } = require('express')
const Course = require('../models/course')
const router = Router()

router.get('/', (req, res) => {
  res.render('add', {
    title: 'Добавить курс',
    isAdd: true
  })
})

router.post('/', async (req, res) => {
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