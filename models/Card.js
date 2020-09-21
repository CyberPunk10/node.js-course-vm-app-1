const path = require('path')
const fs = require('fs')

const p = path.join(__dirname, '..', 'data', 'card.json')

class Card {
  static async add(course) {
    const card = await Card.fetch()

    const idx = card.courses.findIndex(c => c.id === course.id)
    const candidate = card.courses[idx]

    if(candidate) {
      // курс уже есть в корзине
      candidate.count++
      card.courses[idx] = candidate
    } else {
      // курс нужно добавить в корзину
      course.count = 1
      card.courses.push(course)
    }

    card.price += +course.price

    return new Promise((resolve, reject) => {
      fs.writeFile(p, JSON.stringify(card), err => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  static async fetch() {
    return new Promise((resolve, reject) => {
      fs.readFile(p, 'utf-8', (err, content) => {
        if (err) {
          reject(err)
        } else {
          resolve(JSON.parse(content))
        }
      })
    })
  }

  static async remove(id) {
    const card = await Card.fetch()

    const idx = card.courses.findIndex(c => c.id === id)
    const course = card.courses[idx]

    // if () {

    // }
  }

}

module.exports = Card
