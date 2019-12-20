

const item = document.querySelectorAll('.nav-item')
const link = document.querySelectorAll('.nav-link')

const cartIcon = document.querySelector('.fa-shopping-cart')
const cartInfo = document.querySelector('.cart-info')

for (let i = 0; i < item.length; i++) {
  if (item[i].classList.contains('active')) {
    link[i].style.pointerEvents = 'none'
    link[i].style.cursor = 'pointer'
  }
}

cartInfo.addEventListener('mouseover', () => {
  cartIcon.style.color = 'white'
})

cartInfo.addEventListener('mouseout', () => {
  cartIcon.style.color = '#e44c15'
})

const pathname = window.location.href
if (pathname.indexOf('menu') > -1) {
  const menuNavCart = document.querySelector('#nav-cart')
  menuNavCart.addEventListener('click', () => {
    cart.classList.toggle('show-cart')
  })
}

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
    /[xy]/g,
    function (c) {
      var r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    }
  )
}

// show cart
(function () {
  const cartInfo = document.querySelector('#cart-info')
  const cart = document.querySelector('#cart')
  const cartClose = document.querySelector('.cart-close')

  cartInfo.addEventListener('click', () => {
    cart.classList.toggle('show-cart')
  })

  cartClose.addEventListener('click', () => {
    cart.classList.toggle('show-cart')
  })

  document.addEventListener('keydown', e => {
    const key = e.keyCode
    if (key === 27) {
      cart.classList.toggle('show-cart')
    }
  })
})()

// Array for items to be pushed to local storage
let items = []

// Function for all cart actions
function cartAction() {
  const cartBtn = document.querySelectorAll('.store-item-icon')
  cartBtn.forEach(function (btn, index) {
    btn.addEventListener('click', e => {
      // console.log(index)

      // Select the selection for certain menu items
      const selection = e.target.parentElement.previousElementSibling.lastElementChild

      // If the value of the selection is 0
      if (selection.value == '0') {
        // Create a span element that tells the user there is an error
        const menu = document.querySelector('#menu-title')
        const error = document.createElement('span')
        const close = document.createElement('span')
        error.id = 'error'
        close.id = 'close'

        // Sets error html text and appends it to the menu
        error.innerHTML = `Please select a size before adding an item to your cart`
        menu.append(error)

        // Sets close button text to an X and appends it to the error message
        close.innerHTML = 'X'
        error.append(close)

        // Removes error message on click of the X
        close.addEventListener('click', () => {
          const error = document.querySelectorAll('#error')
          for (let i = 0; i < error.length; i++) {
            error[i].remove()
          }
        })
        // When clicking Order Now button, if the selection value is anything other than 0
        // and there is an error message, remove the error message
      } else {
        const error = document.querySelectorAll('#error')
        for (let i = 0; i < error.length; i++) {
          error[i].remove()
        }
      }

      const error = document.querySelectorAll('#error')

      if (error.length > 1) {
        for (let i = 0; i < error.length; i++) {
          if (i > 0) {
            error[i].remove()
          }
        }
      }

      // Check if select value is not 0 or if there is no select element
      // then add to cart
      if (selection.value != '0' || selection.nodeName != 'SELECT') {
        if (e.target.classList.contains('store-item-icon')) {
          const item = {}

          let name = e.target.parentElement.previousElementSibling.children[0].textContent
          let price2 = e.target.nextElementSibling.children[0].textContent

          item.name = name
          item.price = price2

          // Adds item options to the cart
          let option = e.target.parentElement.previousElementSibling.children[2] || ''
          // console.log(option.value);
          item.option = option.value || '';

          item.uuid = uuid()

          function options() {
            if (option.value === undefined) {
              return ''
            } else {
              return item.option + ' - '
            }
          }

          items.push(item)

          localStorage.setItem('cart', JSON.stringify(items))

          let price = e.target.nextElementSibling.textContent
          let finalPrice = price.slice(1).trim()
          item.price = finalPrice

          const cartItem = document.createElement('div')
          cartItem.classList.add('cart-item', 'd-flex', 'justify-content-between', 'text-capitalize', 'my-3')
          cartItem.innerHTML =
            `<div class="item-text">
            <p id="cart-item-title" class="font-weight-bold mb-0">${item.option} ${item.name}</p>
            <span>$</span>
            <span id="cart-item-price" class="cart-item-price" class="mb-0">${item.price}</span>
          </div>
          <a href="#" id='cart-item-remove' class="cart-item-remove">
            <i class="fas fa-trash" data-id='${item.uuid}'></i>
          </a>
        </div>`

          cartItem.getElementsByClassName('fa-trash')[0].addEventListener('click', removeItem)

          // select cart
          const cart = document.querySelector('#cart')
          const total = document.querySelector('.cart-total-container')

          cart.insertBefore(cartItem, total)

          e.stopPropagation()
          e.preventDefault()

          showTotals()
        }
      }
    })
  })
}
cartAction()

// Show totals
function showTotals() {
  const total = []
  const items = document.querySelectorAll('.cart-item-price')

  items.forEach(function (item) {
    total.push(parseFloat(item.textContent))
  })

  const totalMoney = total.reduce(function (total, item) {
    total += item
    return total
  }, 0)
  const finalMoney = totalMoney.toFixed(2)

  // If statement to change "items" to "item" if there is only 1 item in the cart
  if (total.length == 1) {
    document.querySelector('#cart-info p').innerHTML = `<p class="mb-0 text-capitalize" > <span id="item-count">1 </span> item - $ <span class="item-total" > 0</span > `
  } else {
    document.querySelector('#cart-info p').innerHTML = `<p class="mb-0 text-capitalize" > <span id="item-count">0 </span> items - $ <span class="item-total" > 0</span > `
  }

  document.querySelector('#cart-total').textContent = finalMoney
  document.querySelector('.item-total').textContent = finalMoney
  if (document.querySelector('.total-checkout-price')) {
    document.querySelector('.total-checkout-price').innerHTML = `Total: $${finalMoney}`;
  }
  document.querySelector('#item-count').textContent = total.length
}

const cartItems = document.getElementsByClassName('cart-item')

// Add items to checkout on click of checkout button
const goToCheckout = document.querySelector('#checkout');
goToCheckout.addEventListener('click', () => {
  const checkoutItem = document.querySelectorAll('.checkout-item')
  for (let i = 0; i < checkoutItem.length; i++) {
    checkoutItem[i].remove();
  }

  const itemTotal = document.querySelector('.item-total');

  items.forEach(function (item) {
    const totalCheckout = document.querySelector('#total-checkout')
    totalCheckout.innerHTML = `<span class="total-checkout-price"></span>`
    const order = document.querySelector('#order-items')
    order.classList.add('text-capitalize')
    order.innerHTML += `<div class="item-text checkout-item" data-id='${item.uuid}'>
            <p id="cart-item-title" class="mb-0">${item.option} ${item.name}</p>
            <span>$<span id="cart-item-price" class="mb-0">${item.price}</span></span>
          </div>`;

    document.querySelector('.total-checkout-price').innerHTML = `Total: $${itemTotal.textContent}`;
  });
})

// Remove individual Items
function removeItem(e) {
  let buttonClicked = e.target
  let _uuid = e.currentTarget.getAttribute('data-id')
  buttonClicked.parentElement.parentElement.remove()
  showTotals()
  let storageList = JSON.parse(localStorage.getItem('cart'))
  // console.log(items.length);
  // console.log(_uuid)

  items = storageList.filter((item, idx) => item.uuid != _uuid)

  localStorage.setItem('cart', JSON.stringify(items))
}

const removeAllBtn = document.querySelector('#clear-cart')
removeAllBtn.addEventListener('click', removeAllItems)

// Clear Entire Cart
function removeAllItems() {
  const cartItem = document.querySelectorAll('.cart-item')
  const checkoutItem = document.querySelectorAll('.checkout-item')
  for (let i = 0; i < cartItem.length; i++) {
    if (cartItem.length > 0) {
      cartItem[i].remove()
    }
    if (checkoutItem.length > 0) {
      checkoutItem[i].remove()
    }
  }

  // Removes all items from local storage along with the cart
  localStorage.removeItem('cart')
  localStorage.removeItem('total')
  showTotals()
}

$(document).ready(function () {

  if (localStorage.length > 0) {
    const cartStorage = JSON.parse(localStorage.getItem('cart'));

    for (let i = 0; i < cartStorage.length; i++) {
      items.push(cartStorage[i]);
    }

    localStorage.setItem('cart', JSON.stringify(items));
  }
});

// Add items to cart on refresh or change of page from local storage
window.onload = function () {
  // Hides prices of items that have a selection to be made/shows item prices with no selection
  const price = document.querySelectorAll('.store-item-value')
  const description = document.querySelectorAll('.item-desc')

  if (pathname.indexOf('menu') > -1) {
    for (let i = 0; i < price.length; i++) {
      if (description[i].children.length > 2) {
        price[i].style.visibility = 'hidden'
      } else {
        price[i].style.visibility = 'visible'
      }
    }
  }

  if (localStorage.length > 0) {
    function cartStorageRetrieve() {
      const cartStorage = JSON.parse(localStorage.getItem('cart'))

      for (let i = 0; i < cartStorage.length; i++) {
        const cartStorageName = cartStorage[i].name;
        const cartStoragePrice = cartStorage[i].price;
        const cartStorageOption = cartStorage[i].option || '';
        const cartStorageID = cartStorage[i].uuid;

        const cartItem = document.createElement('div')
        cartItem.classList.add('cart-item', 'd-flex', 'justify-content-between', 'text-capitalize', 'my-3')
        cartItem.innerHTML =
          `<div class="item-text">
              <p id="cart-item-title" class="font-weight-bold mb-0">${cartStorageOption} ${cartStorageName}</p>
              <span>$</span>
              <span id="cart-item-price" class="cart-item-price" class="mb-0">${cartStoragePrice}</span>
            </div>
            <a href="#" id='cart-item-remove' class="cart-item-remove">
              <i class="fas fa-trash" data-id='${cartStorageID}'></i>
            </a>
          </div>`
        cartItem.getElementsByClassName('fa-trash')[0].addEventListener('click', removeItem)

        // select cart
        const cart = document.querySelector('#cart')
        const total = document.querySelector('.cart-total-container')

        cart.insertBefore(cartItem, total)
      }
      showTotals()
    }
    cartStorageRetrieve()
  }
}

//Functionality for left / right arrows on menu horizontal scrolling
const rightArrow = document.querySelectorAll('.right-arrow')
for (let i = 0; i < rightArrow.length; i++) {
  rightArrow[i].addEventListener('click', () => {
    const container = document.querySelectorAll('.menu-type')

    sideScroll(container[i], 'right', 15, 360, 30)
  })
}

const leftArrow = document.querySelectorAll('.left-arrow')
for (let i = 0; i < leftArrow.length; i++) {
  leftArrow[i].addEventListener('click', () => {
    const container = document.querySelectorAll('.menu-type')

    sideScroll(container[i], 'left', 15, 360, 30)
  })
}

function sideScroll(element, direction, speed, distance, step) {
  scrollAmount = 0
  let slideTimer = setInterval(function () {
    if (direction == 'left') {
      element.scrollLeft -= step
    } else {
      element.scrollLeft += step
    }
    scrollAmount += step
    if (scrollAmount >= distance) {
      window.clearInterval(slideTimer)
    }
  }, speed)
}

// Adjust prices for different pizza sizes
const pizzaSize = document.querySelectorAll('.pizza-size')

for (let i = 0; i < pizzaSize.length; i++) {
  pizzaSize[i].addEventListener('change', e => {
    const size = e.target.value
    const price = e.target.parentElement.nextElementSibling.children[1].children[0]
    const name = e.target.parentElement.children[0].textContent

    // Remove the "select size:" option after changing sizes once
    if (e.target.length >= 5) {
      e.target.remove(e.target.children[0])
    }
    price.style.visibility = 'visible'

    if (size === '0') {
      // price.style.visibility = 'hidden';
    } else if (size == 'small') {
      if (name == 'Pepperoni Pizza' || name == 'Sausage Pizza') {
        price.textContent = '11.99'
      } else if (name == 'Supreme Pizza') {
        price.textContent = '12.99'
      } else {
        price.textContent = '10.99'
      }
    } else if (size == 'medium') {
      if (name == 'Pepperoni Pizza' || name == 'Sausage Pizza') {
        price.textContent = '13.99'
      } else if (name == 'Supreme Pizza') {
        price.textContent = '14.99'
      } else {
        price.textContent = '12.99'
      }
    } else if (size == 'large') {
      if (name == 'Pepperoni Pizza' || name == 'Sausage Pizza') {
        price.textContent = '15.99'
      } else if (name == 'Supreme Pizza') {
        price.textContent = '16.99'
      } else {
        price.textContent = '14.99'
      }
    } else if (size == 'XL') {
      if (name == 'Pepperoni Pizza' || name == 'Sausage Pizza') {
        price.textContent = '17.99'
      } else if (name == 'Supreme Pizza') {
        price.textContent = '18.99'
      } else {
        price.textContent = '16.99'
      }
    }
  })
}

// Adjust prices for amount of wings
const wingAmount = document.querySelectorAll('.wing-amount')

for (let i = 0; i < wingAmount.length; i++) {
  wingAmount[i].addEventListener('change', e => {
    const amount = e.target.value
    const price = e.target.parentElement.nextElementSibling.children[1].children[0]
    const name = e.target.parentElement.children[0].textContent

    // Remove the "select size:" option after changing sizes once
    if (e.target.length >= 5) {
      e.target.remove(e.target.children[0])
    }

    if (amount == '6') {
      if (name == 'Buffalo Wings' || name == 'BBQ Wings') {
        price.textContent = '7.99'
      } else if (name == 'Honey Chipotle Wings') {
        price.textContent = '8.99'
      } else if (name == 'Boneless Wings') {
        price.textContent = '6.59'
      } else {
        price.textContent = '6.99'
      }
    } else if (amount == '12') {
      if (name == 'Buffalo Wings' || name == 'BBQ Wings') {
        price.textContent = '12.99'
      } else if (name == 'Honey Chipotle Wings') {
        price.textContent = '13.99'
      } else if (name == 'Boneless Wings') {
        price.textContent = '11.59'
      } else {
        price.textContent = '11.99'
      }
    } else if (amount == '24') {
      if (name == 'Buffalo Wings' || name == 'BBQ Wings') {
        price.textContent = '23.99'
      } else if (name == 'Honey Chipotle Wings') {
        price.textContent = '24.99'
      } else if (name == 'Boneless Wings') {
        price.textContent = '22.59'
      } else {
        price.textContent = '22.99'
      }
    } else if (amount == '50') {
      if (name == 'Buffalo Wings' || name == 'BBQ Wings') {
        price.textContent = '42.99'
      } else if (name == 'Honey Chipotle Wings') {
        price.textContent = '43.99'
      } else if (name == 'Boneless Wings') {
        price.textContent = '41.59'
      } else {
        price.textContent = '41.99'
      }
    }
  })
}

// Coupon Code functionality
const coupon = document.querySelector('.coupon')
const couponApply = document.querySelector('.apply')
const couponForm = document.querySelector('.coupon-form')

couponForm.addEventListener('submit', e => {
  // Prevents the form from default submitting behavior
  e.preventDefault()

  const cartTotal = document.querySelector('#cart-total')
  const itemTotal = document.querySelector('.item-total')
  const cartTotalContainer = document.querySelector('.cart-total-container')

  // Check the coupon code value
  if (coupon.value == '25off' || coupon.value == '25Off' || coupon.value == '25OFF') {
    cartTotal.textContent = (cartTotal.textContent * 0.75).toFixed(2)
    itemTotal.textContent = cartTotal.textContent

    // Inserts ann adjacent HTML span element
    // How much money you saved from which coupon code
    cartTotalContainer.insertAdjacentHTML('beforebegin', `<span id="dicountAmt">You saved $ ${(cartTotal.textContent * 0.25).toFixed(2)} from coupon code "${coupon.value}"</span>`
    )
  }
  // Resets coupon insert value to being empty
  coupon.value = ''
})

const menuType = document.querySelectorAll('.menu-type')

for (let i = 0; i < menuType.length; i++) {
  menuType[i].addEventListener('scroll', () => {
    let scrollValue = menuType[i].scrollLeft
    // console.log(scrollValue);

    if (scrollValue > 150) {
      leftArrow[i].style.opacity = '1'
    } else {
      leftArrow[i].style.opacity = '0'
    }

    if (scrollValue < 100) {
      rightArrow[i].style.opacity = '1'
    } else {
      rightArrow[i].style.opacity = '0'
    }

    if (rightArrow[i].style.opacity == '0') {
      rightArrow[i].style.cursor = 'default'
    } else {
      rightArrow[i].style.cursor = 'pointer'
    }

    if (leftArrow[i].style.opacity == '0') {
      leftArrow[i].style.cursor = 'default'
    } else {
      leftArrow[i].style.cursor = 'pointer'
    }
  })
}

// Add 'active' class functionality for the menu page navigation bar
const menuNavigation = document.querySelector('#menu-nav')
const menuNavigationLinks = document.querySelectorAll('#menu-nav a')

for (let i = 0; i < menuNavigationLinks.length; i++) {
  menuNavigationLinks[i].addEventListener('click', e => {
    // Removes 'active' classes on click from previous active nav link
    const activeMenuNav = document.querySelectorAll('.active-menu-nav')
    if (activeMenuNav.length > 0) {
      for (let i = 0; i < activeMenuNav.length; i++) {
        activeMenuNav[i].classList.remove('active-menu-nav')
      }
    }
    // Adds 'active' class to the target in the nav that is clicked
    e.target.classList.toggle('active-menu-nav')
  })
}

// Functionality for the menu navigation to stay fixed to top of screen
// after a certain scroll position
const body = document.querySelector('body')
if (body.classList.contains('menu-page')) {
  const menuNavCart2 = document.querySelector('#nav-cart')
  window.addEventListener('scroll', () => {
    let scrollAmt = window.scrollY

    if (scrollAmt >= 150) {
      menuNavigation.classList.add('scrolled')
      menuNavCart2.style.display = 'inline-block'
    } else {
      menuNavigation.classList.remove('scrolled')
      menuNavCart2.style.display = 'none'
    }
  })
}

// Closes cart if the checkout modal is open
const cart2 = document.querySelector('#cart')
function closeCart() {
  if (body.classList.contains('modal-open')) {
    cart2.classList.remove('show-cart')
  }
}
setInterval(() => {
  closeCart()
}, 100)

const nameError = document.querySelector('#name-error')
const emailError = document.querySelector('#email-error')
const streetError = document.querySelector('#street-error')
const cityError = document.querySelector('#city-error')
const zipError = document.querySelector('#zip-error')
const stateError = document.querySelector('#state-error')
const monthError = document.querySelector('#cc-month-error')
const yearError = document.querySelector('#cc-year-error')

const ccNameError = document.querySelector('#cc-name-error')
const ccNumError = document.querySelector('#cc-number-error')
const cvvError = document.querySelector('#cc-cvv-error')

const validName = name => {
  let valid = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/.test(name)

  if (valid) {
    nameError.style.display = 'none'
    nameInput.classList.remove('error')
    return true
  } else {
    nameError.style.display = 'block'
    nameInput.classList.add('error')
    return false
  }
}

const validEmail = email => {
  let valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  if (valid) {
    emailError.style.display = 'none'
    emailInput.classList.remove('error')
    return true
  } else {
    emailError.style.display = 'block'
    emailInput.classList.add('error')
    return false
  }
}

const validStreet = street => {
  let valid = /\d+\s[A-z]+\s[A-z]+/.test(street)

  if (valid) {
    streetError.style.display = 'none'
    streetInput.classList.remove('error')
    return true
  } else {
    streetError.style.display = 'block'
    streetInput.classList.add('error')
    return false
  }
}

const validCcNumber = cc => {
  let valid = /^\d{13,16}$/.test(cc)

  if (valid) {
    ccNumError.style.display = 'none'
    ccNumInput.classList.remove('error')
    return true
  } else if (cc !== '') {
    ccNumError.style.display = 'block'
    ccNumInput.classList.add('error')
  } else {
    ccNumError.style.display = 'none'
    ccNumInput.classList.remove('error')
    return false
  }
}

const validCVV = cvv => {
  let valid = /^\d{3}$/.test(cvv)

  if (valid) {
    cvvError.style.display = 'none'
    cvvInput.classList.remove('error')
    return true
  } else {
    cvvError.style.display = 'block'
    cvvInput.classList.add('error')
    return false
  }
}

const validCCName = name => {
  let valid = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/.test(name)

  if (valid) {
    ccNameError.style.display = 'none'
    ccNameInput.classList.remove('error')
    return true
  } else {
    ccNameError.style.display = 'block'
    ccNameInput.classList.add('error')
    return false
  }
}

const validCity = city => {
  let valid = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/.test(city)

  if (valid) {
    cityError.style.display = 'none'
    cityInput.classList.remove('error')
    return true
  } else {
    cityError.style.display = 'block'
    cityInput.classList.add('error')
    return false
  }
}

const validZip = cvv => {
  let valid = /^\d{5}$/.test(cvv)

  if (valid) {
    zipError.style.display = 'none'
    zipInput.classList.remove('error')
    return true
  } else {
    zipError.style.display = 'block'
    zipInput.classList.add('error')
    return false
  }
}

const nameInput = document.querySelector('#fullName')
const emailInput = document.querySelector('#email')
const streetInput = document.querySelector('#street')
const ccNumInput = document.querySelector('#card-number')
const cvvInput = document.querySelector('#cvv')
const ccNameInput = document.querySelector('#name-on-card')
const cityInput = document.querySelector('#city')
const zipInput = document.querySelector('#zip')
const stateSelect = document.querySelector('#states')
const monthSelect = document.querySelector('#month')
const yearSelect = document.querySelector('#year')

const checkoutBtn = document.querySelector('.checkoutBtn')
const personalInfo = document.querySelector('#personal-info')

checkoutBtn.addEventListener('click', () => {
  // Valid name
  if (nameInput.value !== '') {
    validName(nameInput.value)
  } else if ((nameInput.value = '')) {
    nameError.style.display = 'block'
  } else {
    nameError.style.display = 'block'
    nameInput.classList.add('error')
  }

  // Valid email
  if (emailInput.value !== '') {
    validEmail(emailInput.value)
  } else if ((emailInput.value = '')) {
    emailError.style.display = 'block'
  } else {
    emailError.style.display = 'block'
    emailInput.classList.add('error')
  }

  // Valid CC number
  if (ccNumInput.value !== '') {
    validCcNumber(ccNumInput.value)
  } else if (ccNumInput.value == '') {
    ccNumError.style.display = 'block'
    ccNumInput.classList.add('error')
  } else {
    ccNumError.style.display = 'block'
  }

  // Valid CVV number
  if (cvvInput.value !== '') {
    validCVV(cvvInput.value)
  } else if (cvvInput.value == '') {
    cvvError.style.display = 'block'
    cvvInput.classList.add('error')
  } else {
    cvvError.style.display = 'block'
    cvvInput.classList.add('error')
  }

  // Valid CC name
  if (ccNameInput.value !== '') {
    validCCName(ccNameInput.value)
  } else if ((ccNameInput.value = '')) {
    ccNameError.style.display = 'block'
  } else {
    ccNameError.style.display = 'block'
    ccNameInput.classList.add('error')
  }

  // Valid city name
  if (cityInput.value !== '') {
    validCity(cityInput.value)
  } else if ((cityInput.value = '')) {
    cityError.style.display = 'block'
  } else {
    cityError.style.display = 'block'
    cityInput.classList.add('error')
  }

  // Valid Zip code
  if (zipInput.value !== '') {
    validZip(zipInput.value)
  } else if ((zipInput.value = '')) {
    zipError.style.display = 'block'
  } else {
    zipError.style.display = 'block'
    zipInput.classList.add('error')
  }

  // Valid Street
  if (streetInput.value !== '') {
    validStreet(streetInput.value)
  } else if ((streetInput.value = '')) {
    streetError.style.display = 'block'
  } else {
    streetError.style.display = 'block'
    streetInput.classList.add('error')
  }

  // State selected validation
  if (stateSelect.value == '0') {
    stateSelect.classList.add('error')
    stateError.style.display = 'block'
  } else {
    stateSelect.classList.remove('error')
    stateError.style.display = 'none'
  }

  // Exp month selected validation
  if (monthSelect.value == '0') {
    monthSelect.classList.add('error')
    monthError.style.display = 'block'
  } else {
    monthSelect.classList.remove('error')
    monthError.style.display = 'none'
  }

  // Exp year selected validation
  if (yearSelect.value == '0') {
    yearSelect.classList.add('error')
    yearError.style.display = 'block'
  } else {
    yearSelect.classList.remove('error')
    yearError.style.display = 'none'
  }
})

const createYourOwnNav = document.querySelector('#steps')
const createYourOwnNavLinks = document.querySelectorAll('#steps li')
const sizeAndCrust = document.querySelector('#crust-and-size');
const meats = document.querySelector('#meats');
const cheeses = document.querySelector('#cheese');
const veggies = document.querySelector('#veggie');

for (let i = 0; i < createYourOwnNavLinks.length; i++) {
  createYourOwnNavLinks[i].addEventListener('click', e => {
    const activecreateYourOwnNav = document.querySelectorAll('.active-create-your-own-nav')
    if (activecreateYourOwnNav.length > 0) {
      for (let i = 0; i < activecreateYourOwnNav.length; i++) {
        activecreateYourOwnNav[i].classList.remove('active-create-your-own-nav')
      }
    }
    e.target.classList.add('active-create-your-own-nav')

    if (createYourOwnNavLinks[i].textContent == 'Size & Crust' && createYourOwnNavLinks[i].classList.contains('active-create-your-own-nav')) {
      sizeAndCrust.style.display = 'block';
      cheeses.style.display = 'none';
      meats.style.display = 'none';
      veggies.style.display = 'none';
    } else if (createYourOwnNavLinks[i].textContent == 'Cheeses' && createYourOwnNavLinks[i].classList.contains('active-create-your-own-nav')) {
      sizeAndCrust.style.display = 'none';
      cheeses.style.display = 'block';
      meats.style.display = 'none';
      veggies.style.display = 'none';

    } else if (createYourOwnNavLinks[i].textContent == 'Meats' && createYourOwnNavLinks[i].classList.contains('active-create-your-own-nav')) {
      meats.style.display = 'block';
      cheeses.style.display = 'none';
      sizeAndCrust.style.display = 'none';
      veggies.style.display = 'none';
    } else if (createYourOwnNavLinks[i].textContent == 'Veggies' && createYourOwnNavLinks[i].classList.contains('active-create-your-own-nav')) {
      veggies.style.display = 'block';
      cheeses.style.display = 'none';
      sizeAndCrust.style.display = 'none';
      meats.style.display = 'none';
    }
  });
}

const crustOptions = document.querySelectorAll('#crust .pizza-options');
const crustLabels = document.querySelectorAll('#crust label');
const sizeOptions = document.querySelectorAll('#size .pizza-options');
const sizeLabels = document.querySelectorAll('#size label');
const cutOptions = document.querySelectorAll('#cut .pizza-options');
const cutLabels = document.querySelectorAll('#cut label');
const bakeOptions = document.querySelectorAll('#bake .pizza-options');
const bakeLabels = document.querySelectorAll('#bake label');
const sauceOptions = document.querySelectorAll('#sauce .pizza-options');
const sauceLabels = document.querySelectorAll('#sauce label');
const sauceAmountOptions = document.querySelectorAll('#sauce-amount .pizza-options');
const sauceAmountLabels = document.querySelectorAll('#sauce-amount label');

const pizzaOptions = (labelType, optionType, className) => {
  for (let i = 0; i < labelType.length; i++) {
    labelType[i].addEventListener('click', e => {
      const activeType = document.querySelectorAll(`.${className}`)
      if (optionType.length > 0) {
        for (let i = 0; i < optionType.length; i++) {
          activeType[i].classList.remove(className)
        }
      }
      e.target.classList.add(className)
    });
  }
}

pizzaOptions(sauceAmountLabels, sauceAmountOptions, 'sauce-amount-active');
pizzaOptions(sauceLabels, sauceOptions, 'sauce-active');
pizzaOptions(bakeLabels, bakeOptions, 'bake-active');
pizzaOptions(cutLabels, cutOptions, 'cut-active');
pizzaOptions(sizeLabels, sizeOptions, 'size-active');
pizzaOptions(crustLabels, crustOptions, 'crust-active');


let checkedOptions = {
  crust: '',
  size: '',
  cut: '',
  bake: '',
  sauce: '',
  sauceAmt: ''
};

const createYourOwnBtn = document.querySelector('#create-your-own-btn');
const createYourOwnTitleP = document.querySelector('#title p');

if (pathname.indexOf('create-your-own') > -1) {
  createYourOwnBtn.addEventListener('click', () => {
    crustLabels.forEach(label => {
      if (label.classList.contains('crust-active')) {
        checkedOptions.crust = label.textContent;
      }
    });

    sizeLabels.forEach(label => {
      if (label.classList.contains('size-active')) {
        checkedOptions.size = label.textContent;
      }
    });

    cutLabels.forEach(label => {
      if (label.classList.contains('cut-active')) {
        checkedOptions.cut = label.textContent;
      }
    });

    bakeLabels.forEach(label => {
      if (label.classList.contains('bake-active')) {
        checkedOptions.bake = label.textContent;
      }
    });

    sauceLabels.forEach(label => {
      if (label.classList.contains('sauce-active')) {
        checkedOptions.sauce = label.textContent;
      }
    });

    sauceAmountLabels.forEach(label => {
      if (label.classList.contains('sauce-amount-active')) {
        checkedOptions.sauceAmt = label.textContent;
      }
    });
    console.log(checkedOptions);
  });
}

const homePageJumbotronDivs = document.querySelectorAll('.container div');
if (pathname.indexOf('/index.html') > -1) {
  homePageJumbotronDivs.forEach(div => {
    div.addEventListener('animationend', () => {
      div.style.opacity = '1';
    })
  });
}

