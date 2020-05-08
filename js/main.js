`use strict`;

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const modalBody = modal.querySelector(`.modal-body`);
const close = document.querySelector(".close");

const toggleModal = () => {
  modal.classList.toggle("is-open");
};

// day 1

const authButton = document.querySelector(`.button-auth`);
const modalAuth = document.querySelector(`.modal-auth`);
const authModalCloseButton = modalAuth.querySelector(`.close-auth`);

const logInForm = modalAuth.querySelector(`#logInForm`);
const loginInput = logInForm.querySelector(`#login`);

const userName = document.querySelector(`.user-name`);
const buttonOut = document.querySelector(`.button-out`);

let login = localStorage.getItem('login');

const onAuthButtonClick = () => {
  modalAuth.classList.add(`is-open`);
  authModalCloseButton.addEventListener(`click`, onAuthModalCloseButtonClick);
  document.addEventListener(`keydown`, onDocumentEscKeydown);
}

const onAuthModalCloseButtonClick = () => {
  modalAuth.classList.remove(`is-open`);
  authModalCloseButton.removeEventListener(`click`, onAuthModalCloseButtonClick);
}

const onDocumentEscKeydown = (evt) => {
  const ESC_KEY = `Escape`;

  if (evt.key === ESC_KEY) {
    evt.preventDefault();
    modalAuth.classList.remove(`is-open`);
    document.removeEventListener(`keydown`, onDocumentEscKeydown);
  }
};

const onLogInFormSubmit = (evt) => {
  evt.preventDefault();
  login = loginInput.value;

  localStorage.setItem(`login`, login);

  if (!loginInput.value) {
    alert(`Введите логин`);
  } else {
    modalAuth.classList.remove(`is-open`);
    logInForm.reset();
    checkAuth();
  }
};

const onButtonOutClick = () => {
  login = ``;
  userName.textContent = ``;

  userName.style.display = ``;
  authButton.style.display = ``;
  buttonOut.style.display = ``;
  cartButton.style.display = ``;

  localStorage.removeItem(`login`);
  buttonOut.removeEventListener(`click`, onButtonOutClick);

  checkAuth();
};

const isAuthorised = () => {
  authButton.style.display = `none`;
  buttonOut.style.display = `flex`;
  cartButton.style.display = `flex`;
  userName.style.display = `inline`;
  userName.textContent = `Привет, ${login}`;

  buttonOut.addEventListener(`click`, onButtonOutClick);
};

const isNotAuthorised = () => {
  authButton.addEventListener(`click`, onAuthButtonClick);
  logInForm.addEventListener(`submit`, onLogInFormSubmit);
};

const checkAuth = () => {
  if (login) {
    isAuthorised();
  } else {
    isNotAuthorised();
  }
};

// day 2, 3

const logo = document.querySelector(`.logo`);
const containerPromo = document.querySelector(`.container-promo`);
const restaurants = document.querySelector(`.restaurants`);
const cardsRestaurants = restaurants.querySelector(`.cards-restaurants`);
const menu = document.querySelector(`.menu`);
const cardsMenu = menu.querySelector(`.cards-menu`);
const restaurantTitle = menu.querySelector(`.restaurant-title`);
const rating = menu.querySelector(`.rating`);
const minPrice = menu.querySelector(`.price`);
const category = menu.querySelector(`.category`);

const createCardRestaurant = (restaurant) => {
  const { image, kitchen, name, price, stars, products, time_of_delivery: timeOfDelivery } = restaurant;

  const card = `
    <a class="card card-restaurant" 
    data-products="${products}" 
    data-info="${[name, price, stars, kitchen]}">
      <img src="${image}" alt="${name}" class="card-image"/>
      <div class="card-text">
        <div class="card-heading">
          <h3 class="card-title">${name}</h3>
          <span class="card-tag tag">${timeOfDelivery}</span>
        </div>
        <div class="card-info">
          <div class="rating">${stars}</div>
          <div class="price">От ${price}</div>
          <div class="category">${kitchen}</div>
         </div>
      </div>
    </a>`;

  cardsRestaurants.insertAdjacentHTML(`beforeend`, card);
};

const createCardGood = (product) => {
  const { id, name, description, price, image } = product;
  const card = document.createElement(`div`);
  card.className = `card`;

  const goodMarkup =
    `<img src="${image}" alt="${name}" class="card-image"/>
    <div class="card-text">
      <div class="card-heading">
          <h3 class="card-title card-title-reg">${name}</h3>
      </div>
      <div class="card-info">
        <div class="ingredients">${description}</div>
      </div>
      <div class="card-buttons">
        <button class="button button-primary button-add-cart" id="${id}">
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price card-price-bold">${price}</strong>
      </div>
    </div>`;

  card.insertAdjacentHTML(`beforeend`, goodMarkup);
  cardsMenu.insertAdjacentElement(`beforeend`, card);
};

const onCardRestaurantsClick = (evt) => {
  evt.preventDefault();
  const target = evt.target;
  const restaurant = target.closest(`.card-restaurant`);

  if (restaurant) {
    if (login) {
      containerPromo.classList.add(`hide`);
      restaurants.classList.add(`hide`);
      menu.classList.remove(`hide`);

      cardsMenu.textContent = ``;

      const restaurantInfo = restaurant.dataset.info.split(`,`);
      [ titleInfo, priceInfo, ratingInfo, categoryInfo ] = restaurantInfo;

      restaurantTitle.textContent = titleInfo;
      rating.textContent = ratingInfo;
      minPrice.textContent = `От ${priceInfo} ₽`;
      category.textContent = categoryInfo;

      getData(`./db/${restaurant.dataset.products}`).then(function (data) {
        data.forEach(createCardGood);
      });

      logo.addEventListener(`click`, onLogoClick);
    } else {
      onAuthButtonClick();
    }
  }
};

const onLogoClick = () => {
  containerPromo.classList.remove(`hide`);
  restaurants.classList.remove(`hide`);
  menu.classList.add(`hide`);
  logo.removeEventListener(`click`, onLogoClick);
}

const mySwiper = new Swiper (`.swiper-container`, {
  loop: true,
  sliderPerView: 1,

  autoplay: {
    delay: 5000,
  },
});

// day 3

const getData = async function (url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Ошибка по адресу ${url}, код ошибки: ${response.status}`);
  }

  return response.json();
};

// day 3, 4

const cart = [];
const modalPriceTag = modal.querySelector(`.modal-pricetag`);
const clearCartButton = modal.querySelector(`.clear-cart`);

const onAddToCartClick = (evt) => {
  const target = evt.target;
  const addToCartButton = target.closest(`.button-add-cart`);

  if (addToCartButton) {
    const card = target.closest(`.card`);
    const title = card.querySelector(`.card-title-reg`).textContent;
    const cost = card.querySelector(`.card-price`).textContent;
    const id = addToCartButton.id;
    const food = cart.find((item) => {
      return item.id === id;
    });

    if (food) {
      food.count += 1;
    } else {
      cart.push({
        id,
        title,
        cost,
        count: 1,
      });
    }
  }
}

const renderCart = () => {
  modalBody.textContent = ``;

  if (cart.length > 0) {
    cart.forEach(({ id, title, cost, count }) => {
      const cartItem = `
      <div class="food-row">
        <span class="food-name">${title}</span>
        <strong class="food-price">${cost} ₽</strong>
        <div class="food-counter">
          <button class="counter-button counter-minus" data-id="${id}">-</button>
          <span class="counter">${count}</span>
          <button class="counter-button counter-plus" data-id="${id}">+</button>
        </div>
      </div>`;

      modalBody.insertAdjacentHTML(`beforeend`, cartItem);

      const totalPrice = cart.reduce((acc, item) => {
        return acc + (parseFloat(item.cost) * item.count);
      }, 0);

      modalPriceTag.textContent = `${totalPrice} ₽`;
    });
  } else {
    const message = document.createElement(`div`);
    message.textContent = `Вы ничего не выбрали`;
    modalBody.insertAdjacentElement(`beforeend`, message);
    modalPriceTag.textContent = `0 ₽`;
  }
};

const onCountButtonClick = (evt) => {
  const target = evt.target;
  const food = cart.find((item) => item.id === target.dataset.id);

  if (target.classList.contains(`counter-minus`)) {
    food.count--;

    if (food.count === 0) {
      cart.splice(cart.indexOf(food), 1);
    }
  }

  if (target.classList.contains(`counter-plus`)) {
    food.count++;
  }

  renderCart();
};

const onClearCartButtonClick = () => {
  cart.length = 0;
  toggleModal();
  clearCartButton.removeEventListener(`click`, onClearCartButtonClick);
};

const onCartButtonClick = () => {
  renderCart();
  toggleModal();

  close.addEventListener("click", toggleModal);
  clearCartButton.addEventListener(`click`, onClearCartButtonClick);
}

const init = () => {
  checkAuth();

  getData(`./db/partners.json`).then(function (data) {
    data.forEach(createCardRestaurant);
  });

  cardsMenu.addEventListener(`click`, onAddToCartClick);
  cardsRestaurants.addEventListener(`click`, onCardRestaurantsClick);

  cartButton.addEventListener("click", onCartButtonClick);
  modalBody.addEventListener(`click`, onCountButtonClick);
};

init();
