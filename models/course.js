const path = require('path')
const fs = require('fs')

const { v4: uuidv4 } = require('uuid');
uuidv4(); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'


class Course {
  constructor(title, price, img) {
    this.title = title
    this.price = price
    this.img = img
    this.id = uuidv4()
  }

  async save() {
    const courses = await Course.getAll()
    courses.push({
      title: this.title,
      price: this.price,
      img: this.img,
      id: this.id
    })
    console.log(this.id, this.title)

    return new Promise((resolve, reject) => {
      fs.writeFile(
        path.join(__dirname, '..', 'data', 'courses.json'),
        JSON.stringify(courses),
        (err) => {
          if (err) {
            reject(err)
          } else {
            resolve()
          }
        }
      )
    })
  }

  static getAll() {
    return new Promise((resolve, reject) => {
      fs.readFile(
        path.join(__dirname, '..', 'data', 'courses.json'),
        'utf-8',
        (err, content) => {
          if (err) {
            reject(err)
          } else {
            resolve(JSON.parse(content))
          }  
        }
      )
    }) 
  }

  static async getById(id) {
    const courses = Course.getAll()
    return courses.find(c => c.id === id)
  }
}

module.exports = Course
