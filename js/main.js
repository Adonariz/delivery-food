`use strict`;

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");

cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);

function toggleModal() {
  modal.classList.toggle("is-open");
}

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

  localStorage.removeItem(`login`);
  buttonOut.removeEventListener(`click`, onButtonOutClick);

  checkAuth();
};

const isAuthorised = () => {
  authButton.style.display = `none`;
  buttonOut.style.display = `block`;

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

checkAuth();

// day 2

const logo = document.querySelector(`.logo`);
const containerPromo = document.querySelector(`.container-promo`);
const restaurants = document.querySelector(`.restaurants`);
const cardsRestaurants = restaurants.querySelector(`.cards-restaurants`);
const menu = document.querySelector(`.menu`);
const cardsMenu = menu.querySelector(`.cards-menu`);

const createCardRestaurant = (restaurant) => {
  const { image, kitchen, name, price, stars, products, time_of_delivery: timeOfDelivery } = restaurant;

  const card = `
    <a class="card card-restaurant" data-products="${products}">
      <img src="${image}" alt="image" class="card-image"/>
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
  const { name, description, price, image } = product;
  const card = document.createElement(`div`);
  card.className = `card`;

  const goodMarkup =
    `<img src="${image}" alt="image" class="card-image"/>
    <div class="card-text">
      <div class="card-heading">
          <h3 class="card-title card-title-reg">${name}</h3>
      </div>
      <div class="card-info">
        <div class="ingredients">${description}</div>
      </div>
      <div class="card-buttons">
        <button class="button button-primary button-add-cart">
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
        </button>
          <strong class="card-price-bold">${price}</strong>
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

cardsRestaurants.addEventListener(`click`, onCardRestaurantsClick);

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

const init = () => {
  getData(`./db/partners.json`).then(function (data) {
    data.forEach(createCardRestaurant);
  });
};

init();
