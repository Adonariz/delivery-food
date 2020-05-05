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
