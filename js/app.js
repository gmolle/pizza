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


(function () {
  const cartBtn = document.querySelectorAll('.store-item-icon');

  cartBtn.forEach(function (btn) {
    btn.addEventListener('click', (e) => {


      if (e.target.classList.contains('store-item-icon')) {

        const item = {};
        let name = e.target.parentElement.parentElement.children[0].textContent;
        item.name = name;


        // console.log(item);
        // const items = [];
        // items.push(item.name);
        // console.log(items);

        let price = e.target.nextElementSibling.textContent;
        let finalPrice = price.slice(1).trim();
        item.price = finalPrice;

        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item', 'd-flex', 'justify-content-between', 'text-capitalize', 'my-3')
        cartItem.innerHTML =
          // `<img src="${item.img}" class="img-fluid rounded-circle" id="item-img" alt="">
          `<div class="item-text">
            <p id="cart-item-title" class="font-weight-bold mb-0">${item.name}</p>
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
    });
  });
})();

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

  document.querySelector('#cart-total').textContent = finalMoney;
  document.querySelector('.item-total').textContent = finalMoney;
  document.querySelector('#item-count').textContent = total.length;

}
// console.log(localStorage);

// if (pathname === '/deals/') {


// }

// Remove individual Items
function removeItem(e) {
  let buttonClicked = e.target;
  buttonClicked.parentElement.parentElement.remove();
  showTotals();
}

const removeAllBtn = document.querySelector('#clear-cart');
removeAllBtn.addEventListener('click', removeAllItems);

// Clear Entire Cart
function removeAllItems(e) {
  const cartItem = document.querySelectorAll('.cart-item');
  for (let i = 0; i < cartItem.length; i++) {
    if (cartItem.length > 0) {
      cartItem[i].remove();

    }
  }
  showTotals();
}






































