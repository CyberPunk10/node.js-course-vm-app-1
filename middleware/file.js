const multer = require('multer')

// определяем куда и ка будем сохранять файлы, которые будем загружать на сервер
const storage = multer.diskStorage({
  // функция определяет куда сохранять файл
  destination(req, file, cb) {
    cb(null, 'images')
  },
  // функция определяет как назвать файл
  filename(req, file, cb) {
    cb(null, new Date().toISOString() + '-' + file.originalname)
  }
})

const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg']

const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

module.exports = multer({
  storage, fileFilter
})
