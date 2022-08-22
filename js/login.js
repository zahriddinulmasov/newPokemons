"use strict";

let elForm = document.querySelector(".form");
let elFormLogin = document.querySelector(".form__login");
let elFormPassword = document.querySelector(".form__password");

let exmLogin = 12345;
let exmPassword = 54321;

elForm.addEventListener("submit", function (evt) {
  evt.preventDefault();

  let loginValue = elFormLogin.value.trim();
  let passwordValue = elFormPassword.value.trim();

  if (checkUser(loginValue, passwordValue)) {
    localStorage.setItem("token", "Hammasi zor");
    window.location = "/main.html";
  } else {
    alert("Login yoki Parolingiz xato! Iltimos, qaytadan tekshirib kiriting!");
  }

  elFormLogin.value = null;
  elFormPassword.value = null;
});

function checkUser(loginValue, passwordValue) {
  if (loginValue == exmLogin && passwordValue == exmPassword) {
    return true;
  } else {
    return false;
  }
}
