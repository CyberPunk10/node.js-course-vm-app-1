const toCurrency = price => {
  return new Intl.NumberFormat('ru-RU', {
    currency: 'rub',
    style: 'currency'
  }).format(price)
}

document.querySelectorAll('.price').forEach(node => {
  node.textContent = toCurrency(node.textContent)
})

const toDate = date => {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(new Date(date))
}

document.querySelectorAll('.date').forEach(node => {
  node.textContent = toDate(node.textContent)
})

const $cart = document.getElementById('cart')

if ($cart) {
  $cart.addEventListener('click', event => {
    if (event.target.classList.contains('js-remove')) {
      const id = event.target.dataset.id

      fetch('/cart/remove/' + id, {
        method: 'delete'
      }).then(res => res.json())
        .then(cart => {
          if (cart.courses.length) {
            const html = cart.courses.map(c => {
              return `
                <tr>
                  <td>${c.title}</td>
                  <td>${c.count}</td>
                  <td><button class="btn btn-small js-remove" data-id="${c.id}">Удалить</button></td>
                </tr>
              `
            }).join('')
            $cart.querySelector('tbody').innerHTML = html
            $cart.querySelector('.price').innerHTML = toCurrency(cart.price)
          } else {
            $cart.innerHTML = '<p>Корзина пуста</p>'
          }
        })
    }
  })
}

M.Tabs.init(document.querySelectorAll('.tabs-auth'))
