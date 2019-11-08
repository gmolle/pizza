const item = document.querySelectorAll('.nav-item');
const link = document.querySelectorAll('.nav-link');

const cart = document.querySelector('.fa-shopping-cart');
const cartInfo = document.querySelector('.cart-info');

const pathname = window.location.pathname;

for (let i = 0; i < item.length; i++) {
  if (item[i].classList.contains('active')) {
    link[i].style.pointerEvents = 'none';
    link[i].style.cursor = 'pointer';
  }
}


cartInfo.addEventListener('mouseover', () => {
  cart.style.color = 'white';
});

cartInfo.addEventListener('mouseout', () => {
  cart.style.color = '#e44c15';
});


// show cart

(function () {
  const cartInfo = document.querySelector('#cart-info');
  const cart = document.querySelector('#cart');
  const cartClose = document.querySelector('.cart-close');

  cartInfo.addEventListener('click', () => {
    cart.classList.toggle('show-cart');
  });

  cartClose.addEventListener('click', () => {
    cart.classList.toggle('show-cart');
  })
})();


// Array for items to be pushed to local storage
const items = [];

// Function for all cart actions
function cartAction() {
  const cartBtn = document.querySelectorAll('.store-item-icon');

  cartBtn.forEach(function (btn) {
    btn.addEventListener('click', (e) => {


      // Select the selection for certain menu items
      const selection = e.target.parentElement.previousElementSibling.lastElementChild;

      // If the value of the selection is 0
      if (selection.value == '0') {

        // Create a span element that tells the user there is an error
        const menu = document.querySelector('#menu-title');
        const error = document.createElement('span');
        const close = document.createElement('span');
        error.id = 'error';
        close.id = 'close';

        // Sets error html text and appends it to the menu
        error.innerHTML = `Please select a size before adding an item to your cart`
        menu.append(error);

        // Sets close button text to an X and appends it to the error message
        close.innerHTML = 'X';
        error.append(close);

        // Removes error message on click of the X
        close.addEventListener('click', () => {
          const error = document.querySelectorAll('#error');
          for (let i = 0; i < error.length; i++) {
            error[i].remove();
          }
        });
        // When clicking Order Now button, if the selection value is anything other than 0
        // and there is an error message, remove the error message
      } else {
        const error = document.querySelectorAll('#error');
        for (let i = 0; i < error.length; i++) {
          error[i].remove();
        }
      }

      // Check if select value is not 0 or if there is no select element
      // then add to cart
      if (selection.value != '0' || selection.nodeName != 'SELECT') {

        if (e.target.classList.contains('store-item-icon')) {

          const item = {};

          let name = e.target.parentElement.previousElementSibling.children[0].textContent;
          let price2 = e.target.nextElementSibling.children[0].textContent;

          item.name = name;
          item.price = price2;


          // Adds item options to the cart
          let option = e.target.parentElement.previousElementSibling.children[2];
          // item.option = option.value;
          function options() {
            if (option) {
              item.option = option.value;
              return item.option + ' - ';
            } else {
              items.push(item);
              return '';
            }
          }

          items.push(item);

          // console.log(item);
          // console.log(items);

          localStorage.setItem('cart', JSON.stringify(items));

          let price = e.target.nextElementSibling.textContent;
          let finalPrice = price.slice(1).trim();
          item.price = finalPrice;

          const cartItem = document.createElement('div');
          cartItem.classList.add('cart-item', 'd-flex', 'justify-content-between', 'text-capitalize', 'my-3')
          cartItem.innerHTML =
            // `<img src="${item.img}" class="img-fluid rounded-circle" id="item-img" alt="">
            `<div class="item-text">
            <p id="cart-item-title" class="font-weight-bold mb-0">${options()}${item.name}</p>
            <span>$</span>
            <span id="cart-item-price" class="cart-item-price" class="mb-0">${item.price}</span>
          </div>
          <a href="#" id='cart-item-remove' class="cart-item-remove">
            <i class="fas fa-trash"></i>
          </a>
        </div>`;

          cartItem.getElementsByClassName('fa-trash')[0].addEventListener('click', removeItem)


          // select cart
          const cart = document.querySelector('#cart');
          const total = document.querySelector('.cart-total-container');

          cart.insertBefore(cartItem, total);
          showTotals();

          e.stopPropagation();
          e.preventDefault();
        }
      }
    });
  });
}

cartAction();

// Show totals
function showTotals() {
  const total = [];
  const items = document.querySelectorAll('.cart-item-price');

  items.forEach(function (item) {
    total.push(parseFloat(item.textContent));
  });

  const totalMoney = total.reduce(function (total, item) {
    total += item;
    return total;
  }, 0);
  const finalMoney = totalMoney.toFixed(2);

  // If statement to change "items" to "item" if there is only 1 item in the cart
  if (total.length == 1) {
    document.querySelector('#cart-info p').innerHTML =
      `<p class="mb-0 text-capitalize"><span id="item-count">1 </span> item - $<span class="item-total">0</span>`
  }
  else {
    document.querySelector('#cart-info p').innerHTML =
      `<p class="mb-0 text-capitalize"><span id="item-count">0 </span> items - $<span class="item-total">0</span>`
  }

  document.querySelector('#cart-total').textContent = finalMoney;
  document.querySelector('.item-total').textContent = finalMoney;
  document.querySelector('#item-count').textContent = total.length;

}

const cartItems = document.getElementsByClassName('cart-item');

// Remove individual Items
function removeItem(e) {
  let buttonClicked = e.target;
  buttonClicked.parentElement.parentElement.remove();
  showTotals();
  // console.log(localStorage);

  let storageList = JSON.parse(localStorage.getItem('cart'));

  for (let i = 0; i < storageList.length; i++) {
    items.splice(i, 1);
    console.log(items[i])
    // console.log(storageList);
  }
  localStorage.setItem('cart', JSON.stringify(items));
}

const removeAllBtn = document.querySelector('#clear-cart');
removeAllBtn.addEventListener('click', removeAllItems);

// Clear Entire Cart
function removeAllItems() {
  const cartItem = document.querySelectorAll('.cart-item');
  for (let i = 0; i < cartItem.length; i++) {
    if (cartItem.length > 0) {
      cartItem[i].remove();
    }
  }
  // Removes all items from local storage along with the cart
  localStorage.removeItem('cart');
  showTotals();

}


// Add items to cart on refresh or change of page from local storage
window.onload = function () {

  if (localStorage.length > 0) {
    function cartStorageRetrieve() {
      const cartStorage = JSON.parse(localStorage.getItem('cart'));
      // console.log(cartStorage);

      for (let i = 0; i < cartStorage.length; i++) {
        const cartStorageName = cartStorage[i].name;
        const cartStoragePrice = cartStorage[i].price;
        const cartStorageOption = cartStorage[i].option;



        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item', 'd-flex', 'justify-content-between', 'text-capitalize', 'my-3')
        cartItem.innerHTML =
          // `<img src="${item.img}" class="img-fluid rounded-circle" id="item-img" alt="">
          `<div class="item-text">
              <p id="cart-item-title" class="font-weight-bold mb-0">${cartStorageName}</p>
              <span>$</span>
              <span id="cart-item-price" class="cart-item-price" class="mb-0">${cartStoragePrice}</span>
            </div>
            <a href="#" id='cart-item-remove' class="cart-item-remove">
              <i class="fas fa-trash"></i>
            </a>
          </div>`;
        cartItem.getElementsByClassName('fa-trash')[0].addEventListener('click', removeItem)

        // select cart
        const cart = document.querySelector('#cart');
        const total = document.querySelector('.cart-total-container');

        cart.insertBefore(cartItem, total);
      }
      showTotals();
    }
    cartStorageRetrieve();
  }
}

// window.localStorage.clear();
// console.log(localStorage);



// Functionality for left/right arrows on menu horizontal scrolling
const rightArrow = document.querySelectorAll('.right-arrow');
for (let i = 0; i < rightArrow.length; i++) {
  rightArrow[i].addEventListener('click', () => {
    const container = document.querySelectorAll('.menu-type');

    sideScroll(container[i], 'right', 15, 360, 30);
  })
}

const leftArrow = document.querySelectorAll('.left-arrow');
for (let i = 0; i < leftArrow.length; i++) {
  leftArrow[i].addEventListener('click', () => {
    const container = document.querySelectorAll('.menu-type');

    sideScroll(container[i], 'left', 15, 360, 30);
  })
}

function sideScroll(element, direction, speed, distance, step) {
  scrollAmount = 0;
  let slideTimer = setInterval(function () {
    if (direction == 'left') {
      element.scrollLeft -= step;
    } else {
      element.scrollLeft += step;
    }
    scrollAmount += step;
    if (scrollAmount >= distance) {
      window.clearInterval(slideTimer);
    }
  }, speed);
}


// Adjust prices for different pizza sizes
const pizzaSize = document.querySelectorAll('.pizza-size');

for (let i = 0; i < pizzaSize.length; i++) {
  pizzaSize[i].addEventListener('change', (e) => {

    const size = e.target.value;
    const price = e.target.parentElement.nextElementSibling.children[1].children[0];


    // Remove the "select size:" option after changing sizes once
    if (e.target.length >= 5) {
      e.target.remove(e.target.children[0]);
    }


    if (size === '0') {
      price.style.visibility = 'hidden';
    } else if (size == 'small') {
      price.textContent = '10.99';
    } else if (size == 'medium') {
      price.textContent = '12.99';
    } else if (size == 'large') {
      price.textContent = '14.99';
    } else if (size == 'XL') {
      price.textContent = '16.99';
    }

  });
}

const wingAmount = document.querySelectorAll('.wing-amount');

for (let i = 0; i < wingAmount.length; i++) {
  wingAmount[i].addEventListener('change', (e) => {

    const amount = e.target.value;
    const price = e.target.parentElement.nextElementSibling.children[1].children[0];

    // Remove the "select size:" option after changing sizes once
    if (e.target.length >= 5) {
      e.target.remove(e.target.children[0]);
    }

    if (amount == '6') {
      price.textContent = '6.89';
    } else if (amount == '12') {
      price.textContent = '11.99';
    } else if (amount == '24') {
      price.textContent = '22.99';
    } else if (amount == '50') {
      price.textContent = '41.99';
    }

  });
}



// Coupon Code functionality
const coupon = document.querySelector('.coupon');
const couponApply = document.querySelector('.apply');
const couponForm = document.querySelector('.coupon-form');


couponForm.addEventListener('submit', (e) => {
  // Prevents the form from default submitting behavior
  e.preventDefault();

  const cartTotal = document.querySelector('#cart-total');
  const itemTotal = document.querySelector('.item-total');
  const cartTotalContainer = document.querySelector('.cart-total-container');

  // Check the coupon code value
  if (coupon.value == '25off' || coupon.value == '25Off' || coupon.value == '25OFF') {
    cartTotal.textContent = (cartTotal.textContent * 0.75).toFixed(2);
    itemTotal.textContent = cartTotal.textContent;

    // Inserts ann adjacent HTML span element
    // How much money you saved from which coupon code
    cartTotalContainer.insertAdjacentHTML('beforebegin', `<span id="dicountAmt">You saved $ ${(cartTotal.textContent * 0.25).toFixed(2)} from coupon code "${coupon.value}"</span>`);
  }
  // Resets coupon insert value to being empty
  coupon.value = '';
});


