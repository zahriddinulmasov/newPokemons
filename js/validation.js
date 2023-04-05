"use strict";

if (!localStorage.getItem("token")) {
  window.location = "/index.html";
}

let elLogOut = document.querySelector(".log__out");

elLogOut.addEventListener("click", function () {
  localStorage.removeItem("token");
  window.location.href = "/index.html";
});

let elTotalResult = document.querySelector(".total__result");
let elPokemonsResult = document.querySelector(".pokemons__result");
let elClose = document.querySelector(".close");
let elCauntion = document.querySelector(".cauntion");
let elForm = document.querySelector(".form__pokemons");
let elInputTitle = document.querySelector(".form__title");
let elInputWeight = document.querySelector(".form__weight");
let elInputHeight = document.querySelector(".form__height");
let elSelectCategory = document.querySelector(".form__category");
let elSelectSorting = document.querySelector(".form__sorting");

let elPokemonWrapper = document.querySelector(".pokemon__wrapper");
let elPokemonTemplate = document.querySelector("#pokemon_card").content;
let elModalPokemonName = document.querySelector(".modal__pokemon-name");
let elModalPokemonEgg = document.querySelector(".modal__pokemon-egg");
let elModalPokemonTime = document.querySelector(".modal__pokemon-time");
let elModalPokemonMultipliers = document.querySelector(
  ".modal__pokemon-multipliers"
);
let elModalPokemonWeaknesses = document.querySelector(
  ".modal__pokemon-weaknesses"
);

let elBookmarkList = document.querySelector(".bookmark__list");
let elBookmarkResult = document.querySelector(".bookmark__result");
let elBookmarkTemplate = document.querySelector("#bookmarkedItem").content;

let elPaginationWrapper = document.querySelector(".pagination__wrapper");

let pokemonsArray = pokemons.slice(0, 120);

let itemPerPage = 30;
let currentPage = 1;
let pages;

let localPokemons = JSON.parse(localStorage.getItem("bookmarkedPokemons"));
// elBookmarkResult.textContent = localPokemons.length;

let bookmarkedPokemons = localPokemons ? localPokemons : [];
renderBookmarks(bookmarkedPokemons);
elBookmarkResult.textContent = bookmarkedPokemons.length;

// Normalize Pokemons:
let normalizedArray = pokemonsArray.map(function (item) {
  return {
    img: item.img,
    name: item.name,
    type: item.type,
    candy: item.candy,
    weight: item.weight,
    height: item.height,
    id: item.id,

    egg: item.egg,
    spawnTime: item.spawn_time,
    multipliers: item.multipliers,
    weaknesses: item.weaknesses,
  };
});

// Render Pokemons:
function renderPokemons(array) {
  elPokemonsResult.textContent = array.length;
  elPokemonWrapper.innerHTML = null;
  let tempFragment = document.createDocumentFragment();

  for (const item of array) {
    let templateItem = elPokemonTemplate.cloneNode(true);

    templateItem.querySelector(".pokemon__img").src = item.img;
    templateItem.querySelector(".pokemon__title").textContent = item.name;
    templateItem.querySelector(".pokemon__type").textContent = item.type;
    templateItem.querySelector(".pokemon__candy").textContent = item.candy;
    templateItem.querySelector(".pokemon__weight").textContent = item.weight;
    templateItem.querySelector(".pokemon__height").textContent = item.height;
    templateItem.querySelector(".pokemon_about-btn").dataset.pokemonId =
      item.id;
    templateItem.querySelector(".pokemon__bookmark-btn").dataset.bookmarkId =
      item.id;

    tempFragment.appendChild(templateItem);
  }
  elPokemonWrapper.appendChild(tempFragment);
}
renderPokemons(normalizedArray.slice(0, itemPerPage));
renderPageBtns(normalizedArray);

//  Pagination1:
function getElementsPage(array, perPage, currentPage) {
  let result = [];

  if (currentPage == 1) {
    result = array.slice(0, perPage);
  } else {
    result = array.slice(perPage * (currentPage - 1), perPage * currentPage);
  }

  return result;
}

let currentRender = getElementsPage(normalizedArray, itemPerPage, 4);

elTotalResult.textContent = normalizedArray.length;
// Form:
elForm.addEventListener("submit", function (evt) {
  evt.preventDefault();
  let inputTitle = elInputTitle.value.trim();
  let pattern = new RegExp(inputTitle, "gi");

  let inputWeight = elInputWeight.value.trim();
  let inputHeight = elInputHeight.value.trim();
  let selectCategory = elSelectCategory.value.trim();
  let selectSorting = elSelectSorting.value.trim();

  normalizedArray = pokemonsArray.filter(function (item) {
    let isTrue =
      selectCategory == "all" ? true : item.type.includes(selectCategory);

    let searchByName = item.name.match(pattern);

    let pokemonsWeight = Number(item.weight.split(" ")[0]) >= inputWeight;
    let pokemonsHeight = Number(item.height.split(" ")[0]) >= inputHeight;

    let validation = pokemonsWeight && pokemonsHeight && isTrue && searchByName;

    return validation;
  });

  normalizedArray.sort(function (a, b) {
    if (selectSorting == "weight_high-low") {
      return b.weight.split(" ")[0] - a.weight.split(" ")[0];
    }
    if (selectSorting == "weight_low-high") {
      return a.weight.split(" ")[0] - b.weight.split(" ")[0];
    }

    if (selectSorting == "height_high-low") {
      return b.height.split(" ")[0] - a.height.split(" ")[0];
    }
    if (selectSorting == "height_low-high") {
      return a.height.split(" ")[0] - b.height.split(" ")[0];
    }

    if (selectSorting == "a-z") {
      let firstValue = a.name.toLowerCase();
      let secondValue = b.name.toLowerCase();
      return firstValue == b.secondValue
        ? 0
        : firstValue < secondValue
        ? -1
        : 1;
    }
    if (selectSorting == "z-a") {
      let firstValue = a.name.toLowerCase();
      let secondValue = b.name.toLowerCase();
      return firstValue == b.secondValue
        ? 0
        : firstValue < secondValue
        ? 1
        : -1;
    }
  });

  renderPokemons(
    normalizedArray.slice(
      (currentPage - 1) * itemPerPage,
      itemPerPage * currentPage
    )
  );
  renderPageBtns(normalizedArray);
  elTotalResult.textContent = normalizedArray.length;
});

// Type:
function getType(array) {
  let newArray = [];

  array.forEach((item) => {
    let onePokemonsCategories = item.type;

    onePokemonsCategories.forEach((item) => {
      if (!newArray.includes(item)) {
        newArray.push(item);
      }
    });
  });
  return newArray;
}
let typeArray = getType(normalizedArray);

// Render Type:
function renderType(array, wrapper) {
  let fragment = document.createDocumentFragment();

  for (let item of array) {
    let newOption = document.createElement("option");

    newOption.textContent = item;
    newOption.value = item;

    fragment.appendChild(newOption);
  }
  wrapper.appendChild(fragment);
}
renderType(typeArray.sort(), elSelectCategory);

// Modal pokemons:
elPokemonWrapper.addEventListener("click", function (evt) {
  let currentPokemonId = evt.target.dataset.pokemonId;
  let currentBookmarkId = evt.target.dataset.bookmarkId;

  if (currentPokemonId) {
    let foundPokemon = normalizedArray.find(function (item) {
      return item.id == currentPokemonId;
    });

    elModalPokemonName.textContent = foundPokemon.name;
    elModalPokemonEgg.textContent = foundPokemon.egg;
    elModalPokemonTime.textContent = foundPokemon.spawnTime;
    elModalPokemonMultipliers.textContent = foundPokemon.multipliers;
    elModalPokemonWeaknesses.textContent = foundPokemon.weaknesses;
  }

  if (currentBookmarkId) {
    let foundBookmarked = normalizedArray.find(function (item) {
      return item.id == currentBookmarkId;
    });

    if (bookmarkedPokemons.length == 0) {
      bookmarkedPokemons.unshift(foundBookmarked);
      localStorage.setItem(
        "bookmarkedPokemons",
        JSON.stringify(bookmarkedPokemons)
      );
    } else {
      let isPokemonInArray = bookmarkedPokemons.find(function (item) {
        return item.name == foundBookmarked.name;
      });

      if (!isPokemonInArray) {
        bookmarkedPokemons.unshift(foundBookmarked);
        localStorage.setItem(
          "bookmarkedPokemons",
          JSON.stringify(bookmarkedPokemons)
        );
      }
    }
    elBookmarkResult.innerHTML = null;
    elBookmarkResult.textContent = bookmarkedPokemons.length;
    renderBookmarks(bookmarkedPokemons);
  }
});

function renderBookmarks(arrayOfBookmarks) {
  elBookmarkList.innerHTML = null;

  let fragment = document.createDocumentFragment();

  for (let item of arrayOfBookmarks) {
    let bookmarkItem = elBookmarkTemplate.cloneNode(true);

    bookmarkItem.querySelector(".bookmark__name").textContent = item.name;
    bookmarkItem.querySelector(".bookmark__btn").dataset.bookmarkId = item.id;

    fragment.appendChild(bookmarkItem);
  }
  elBookmarkList.appendChild(fragment);
}

// Bookmarked:
elBookmarkList.addEventListener("click", function (evt) {
  let bookmarketPokemonId = evt.target.dataset.bookmarkId;

  if (bookmarketPokemonId) {
    let foundBookmarkedPokemon = bookmarkedPokemons.findIndex(function (item) {
      return item.id == bookmarketPokemonId;
    });
    console.log(foundBookmarkedPokemon);

    bookmarkedPokemons.splice(foundBookmarkedPokemon, 1);
    localStorage.setItem(
      "bookmarkedPokemons",
      JSON.stringify(bookmarkedPokemons)
    );
  }

  elBookmarkResult.textContent = bookmarkedPokemons.length;
  renderBookmarks(bookmarkedPokemons);
});

//  Pagination2:
function renderPageBtns(array) {
  elPaginationWrapper.innerHTML = null;
  pages = Math.ceil(array.length / itemPerPage);
  let fragment = document.createDocumentFragment();

  for (let i = 1; i <= pages; i++) {
    let newLi = document.createElement("li");
    newLi.textContent = i.toString();
    newLi.dataset.pageNumId = i.toString();
    newLi.setAttribute("class", "page-item page-link");

    fragment.appendChild(newLi);
  }
  elPaginationWrapper.appendChild(fragment);
}

function slicePokemonsPages(array, page) {
  let sliceArray = array.slice((page - 1) * itemPerPage, itemPerPage * page);
  return sliceArray;
}

elPaginationWrapper.addEventListener("click", function (evt) {
  let currentPage = evt.target.dataset.pageNumId;

  let slicePokemons = slicePokemonsPages(normalizedArray, currentPage);

  renderPokemons(slicePokemons);
});

// Countion:
elClose.addEventListener("click", () => {
  elCauntion.style.display = "none";
});
