const keys = require('../keys')

// module.exports = function (email) {
//   return {
//     to: email,
//     from: keys.EMAIL_FROM,
//     subject: 'Аккаунт создан',
//     html: `
//       <h1>Добро пожаловать в наш магазин</h1>
//       <p>Вы успешно создали аккаунт с email - ${email}</p>
//       <hr/>
//       <a href="${keys.BASE_URL}">Магазин курсов</a>
//     `
//   }
// }

module.exports = function () {
  return {
    "html" : "<h1>Example text</h1>",
    "text" : "Example text",
    "subject" : "Example subject",
    "from" : {
      "name" : "Alex",
      "email" : "konstantin21_arx@bk.ru"
    },
    "to" : [
      {
        "name" : "Piter",
        "email" : "konstantin21_arx@bk.ru"
      },
    ],
    "bcc" : [
      {
        "name" : "John",
        "email" : "some@domain.info"
      },
    ]
  };
}