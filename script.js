
const TARGET_MONEY = 500;


const recipes = [
  {
    name: "Strawberry Cupcake",
    emoji: "🧁",
    description: "A fluffy cupcake with sweet strawberry goodness!",
    reward: 25,
    ingredients: ["flour", "milk", "strawberry", "sugar", "egg"]
  },
  {
    name: "Chocolate Cookie",
    emoji: "🍪",
    description: "A crunchy cookie filled with chocolate!",
    reward: 25,
    ingredients: ["flour", "sugar", "chocolate", "butter"]
  },
  {
    name: "Birthday Cake",
    emoji: "🎂",
    description: "A beautiful cake made for a special birthday!",
    reward: 60,
    ingredients: ["flour", "egg", "cream", "sugar", "vanilla"]
  },
  {
    name: "Butter Sugar Bun",
    emoji: "🥐",
    description: "A soft and buttery bakery treat!",
    reward: 25,
    ingredients: ["flour", "butter", "milk", "sugar"]
  },
  {
    name: "Strawberry Milkshake",
    emoji: "🥤",
    description: "A refreshing strawberry drink!",
    reward: 20,
    ingredients: ["milk", "strawberry", "cream"]
  },
  {
    name: "Chocolate Brownie",
    emoji: "🍫",
    description: "A rich, fudgy chocolate brownie!",
    reward: 35,
    ingredients: ["flour", "egg", "chocolate", "butter", "sugar"]
  },
  {
    name: "Blueberry Pancakes",
    emoji: "🥞",
    description: "Fluffy pancakes topped with blueberries and honey!",
    reward: 35,
    ingredients: ["flour", "milk", "egg", "blueberry", "honey"]
  },
  {
    name: "Banana Bread",
    emoji: "🍌",
    description: "A warm and sweet banana loaf!",
    reward: 30,
    ingredients: ["flour", "banana", "egg", "butter", "cinnamon"]
  },
  {
    name: "Blueberry Muffin",
    emoji: "🫐",
    description: "A soft muffin bursting with blueberries!",
    reward: 30,
    ingredients: ["flour", "milk", "blueberry", "sugar", "egg"]
  },
  {
    name: "Strawberry Donut",
    emoji: "🍩",
    description: "A fluffy donut with strawberry sweetness!",
    reward: 40,
    ingredients: ["flour", "milk", "sugar", "strawberry", "butter"]
  },
  {
    name: "Vanilla Macarons",
    emoji: "🍬",
    description: "Delicate little sweets with vanilla flavor!",
    reward: 45,
    ingredients: ["egg", "sugar", "vanilla", "cream"]
  },
  {
    name: "Blueberry Cheesecake",
    emoji: "🍰",
    description: "A creamy cheesecake with juicy blueberries!",
    reward: 50,
    ingredients: ["flour", "cream", "cheese", "sugar", "blueberry"]
  }
];

const ingredientsInfo = {
  flour: { name: "Flour", emoji: "🌾" },
  milk: { name: "Milk", emoji: "🥛" },
  strawberry: { name: "Strawberry", emoji: "🍓" },
  sugar: { name: "Sugar", emoji: "🍬" },
  egg: { name: "Egg", emoji: "🥚" },
  chocolate: { name: "Chocolate", emoji: "🍫" },
  butter: { name: "Butter", emoji: "🧈" },
  cream: { name: "Cream", emoji: "🍦" },
  banana: { name: "Banana", emoji: "🍌" },
  blueberry: { name: "Blueberry", emoji: "🫐" },
  honey: { name: "Honey", emoji: "🍯" },
  vanilla: { name: "Vanilla", emoji: "🌼" },
  cinnamon: { name: "Cinnamon", emoji: "🪵" },
  cheese: { name: "Cream Cheese", emoji: "🧀" }
};


const customers = [
  { name: "Mochi the Bunny", emoji: "🐰", message: "Hello! I'd love something sweet!" },
  { name: "Berry the Bear", emoji: "🐻", message: "Your bakery looks so cute! Can I order?" },
  { name: "Coco the Puppy", emoji: "🐶", message: "I heard you make the best desserts!" },
  { name: "Mimi the Kitty", emoji: "🐱", message: "Can I have a yummy treat, please?" },
  { name: "Cloud the Angel", emoji: "☁️", message: "Something sweet would make my day!" },
  { name: "Pudding the Duck", emoji: "🐥", message: "I'm so excited to try your bakery!" }
];

const $ = id => document.getElementById(id);

let money = Number(localStorage.getItem("bakeryMoney")) || 0;
let selectedIngredients = [];
let currentRecipe = null;
let orderActive = false;
let readyToServe = false;
let paymentPending = false;
let currentPayment = 0;
let currentCustomer = null;

const moneyDisplay = $("money");
const progressText = $("progress-text");
const progressFill = $("progress-fill");

const ingredientButtons = document.querySelectorAll(".ingredient");

const takeOrderButton = $("take-order-button");
const bakeButton = $("bake-button");
const clearButton = $("clear-button");
const serveButton = $("serve-button");
const collectButton = $("collect-button");

const selectedDisplay = $("selected-ingredients");
const gameMessage = $("game-message");

const letterButton = $("letter-button");
const letterModal = $("letter-modal");
const letterSection = $("letter-section");

function saveGame() {
  localStorage.setItem("bakeryMoney", money);
}

function updateMoney() {
  moneyDisplay.textContent = money;

  const progress = Math.min((money / TARGET_MONEY) * 100, 100);

  progressFill.style.width = progress + "%";
  progressText.textContent = money + " / " + TARGET_MONEY;

  saveGame();

  if (money >= TARGET_MONEY) {
    unlockLetter();
  }
}

function unlockLetter() {
  letterButton.disabled = false;
  letterButton.textContent = "💌 Open Your Birthday Letter!";
  $("lock-icon").textContent = "💗";

  $("letter-description").textContent =
    "You did it, little baker! You earned ₱250 and unlocked a special surprise made with love!";

  letterSection.style.borderColor = "#f49fbd";
}

function setIngredientsEnabled(enabled) {
  ingredientButtons.forEach(button => {
    button.disabled = !enabled;
  });
}

function updateSelectedDisplay() {
  selectedDisplay.innerHTML = "";

  if (selectedIngredients.length === 0) {
    selectedDisplay.innerHTML =
      '<span class="empty-bowl">Nothing added yet...</span>';
    return;
  }

  selectedIngredients.forEach(item => {
    const info = ingredientsInfo[item];
    const span = document.createElement("span");

    span.className = "selected-item";
    span.textContent = info.emoji + " " + info.name;

    selectedDisplay.appendChild(span);
  });
}

function clearIngredients() {
  selectedIngredients = [];

  ingredientButtons.forEach(button => {
    button.classList.remove("selected");
  });

  updateSelectedDisplay();
}

function showRecipe() {
  $("order-emoji").textContent = currentRecipe.emoji;
  $("order-name").textContent = currentRecipe.name;
  $("order-description").textContent = currentRecipe.description;
  $("order-reward").textContent = "₱" + currentRecipe.reward;
}

function showCustomer() {
  const customer = customers[
    Math.floor(Math.random() * customers.length)
  ];

  currentCustomer = customer;

  $("customer-emoji").textContent = customer.emoji;
  $("customer-name").textContent = customer.name;
  $("customer-message").textContent = customer.message;
}

// STEP 1: TAKE ORDER

takeOrderButton.addEventListener("click", () => {
  if (money >= TARGET_MONEY) {
    gameMessage.textContent = "Your birthday surprise is ready! 💗";
    return;
  }

  if (orderActive || paymentPending) {
    gameMessage.textContent =
      "Please finish the current customer's order first! ♡";
    return;
  }

  orderActive = true;
  readyToServe = false;

  showCustomer();

  currentRecipe = recipes[
    Math.floor(Math.random() * recipes.length)
  ];

  showRecipe();
  clearIngredients();

  $("cashier-message").textContent =
    "A customer has arrived! Waiting for their payment...";

  $("cashier-total").textContent = currentRecipe.reward;

  takeOrderButton.disabled = true;
  takeOrderButton.textContent = "♡ Order in Progress";

  bakeButton.disabled = false;
  clearButton.disabled = false;

  serveButton.disabled = true;
  collectButton.disabled = true;

  setIngredientsEnabled(true);

  $("serving-display").innerHTML =
    "<span>🧺</span><p>Your finished treat will appear here!</p>";

  gameMessage.textContent =
    "A customer has arrived! Let's prepare their order! ☁️";
});

// STEP 2: CHOOSE INGREDIENTS

ingredientButtons.forEach(button => {
  button.addEventListener("click", () => {
    if (!orderActive || readyToServe) return;

    const ingredient = button.dataset.item;

    if (selectedIngredients.includes(ingredient)) {
      selectedIngredients = selectedIngredients.filter(
        item => item !== ingredient
      );

      button.classList.remove("selected");
    } else {
      selectedIngredients.push(ingredient);
      button.classList.add("selected");
    }

    updateSelectedDisplay();
  });
});

// CLEAR INGREDIENTS

clearButton.addEventListener("click", () => {
  if (!orderActive || readyToServe) return;

  clearIngredients();

  gameMessage.textContent =
    "Mixing bowl cleared! Try another combination! ♡";
});

// STEP 3: BAKE

bakeButton.addEventListener("click", () => {
  if (!orderActive || readyToServe) return;

  const correctIngredients = currentRecipe.ingredients;

  const isCorrect =
    selectedIngredients.length === correctIngredients.length &&
    correctIngredients.every(item =>
      selectedIngredients.includes(item)
    );

  if (!isCorrect) {
    gameMessage.textContent =
      "Oopsie! That's not the correct recipe. Try again! 💗";
    return;
  }

  readyToServe = true;

  setIngredientsEnabled(false);

  bakeButton.disabled = true;
  clearButton.disabled = true;
  serveButton.disabled = false;

  $("serving-display").innerHTML =
    "<span>" + currentRecipe.emoji +
    "</span><p>Your " + currentRecipe.name +
    " is freshly baked! ♡</p>";

  gameMessage.textContent =
    "YAY! Your treat is ready! Take it to the serving counter! 🧁";

  $("cashier-message").textContent =
    "Your customer is waiting for their delicious order!";
});

// STEP 4: SERVE CUSTOMER

serveButton.addEventListener("click", () => {
  if (!orderActive || !readyToServe) return;

  orderActive = false;
  readyToServe = false;
  paymentPending = true;

  currentPayment = currentRecipe.reward;

  serveButton.disabled = true;
  collectButton.disabled = false;

  $("cashier-total").textContent = currentPayment;

  $("cashier-message").textContent =
    currentCustomer.name +
    " loved the " + currentRecipe.name +
    "! They are ready to pay you! 💗";

  $("customer-message").textContent =
    "Thank you so much! Your bakery is amazing! ♡";

  gameMessage.textContent =
    "Customer served! Head to the cashier and collect your money! 💰";
});

// STEP 5: COLLECT PAYMENT

collectButton.addEventListener("click", () => {
  if (!paymentPending) return;

  money += currentPayment;

  paymentPending = false;
  currentPayment = 0;

  updateMoney();

  $("cashier-total").textContent = "0";

  $("cashier-message").textContent =
    "Payment received! Thank you for supporting our little bakery! ☁️";

  $("serving-display").innerHTML =
    "<span>💗</span><p>Order completed! Ready for another customer!</p>";

  collectButton.disabled = true;

  if (money >= TARGET_MONEY) {
    takeOrderButton.disabled = true;
    takeOrderButton.textContent = "💗 Bakery Goal Completed!";

    $("customer-name").textContent = "Cinnamoroll";
    $("customer-emoji").textContent = "🐰";
    $("customer-message").textContent =
      "You did it! Your birthday surprise is ready!";

    gameMessage.textContent =
      "🎉 YOU REACHED ₱250! Your birthday letter is unlocked! 💌";
  } else {
    takeOrderButton.disabled = false;
    takeOrderButton.textContent = "🛎️ Take Another Order";

    gameMessage.textContent =
      "Wonderful job! You earned ₱" +
      money + " so far! Let's serve another customer! ♡";
  }
});

// OPEN BIRTHDAY LETTER

letterButton.addEventListener("click", () => {
  if (money >= TARGET_MONEY) {
    letterModal.classList.add("show");
    document.body.style.overflow = "hidden";
  }
});

// CLOSE BIRTHDAY LETTER

function closeBirthdayLetter() {
  letterModal.classList.remove("show");
  document.body.style.overflow = "";
}

$("close-letter").addEventListener("click", closeBirthdayLetter);

letterModal.addEventListener("click", event => {
  if (event.target === letterModal) {
    closeBirthdayLetter();
  }
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeBirthdayLetter();
  }
});

/* ===== RECIPE BOOK FUNCTIONALITY ===== */

const recipeBookButton = $("recipe-book-button");
const recipeBookContent = $("recipe-book-content");
const recipeList = $("recipe-list");

function renderRecipeBook() {
  recipeList.innerHTML = "";

  recipes.forEach(recipe => {
    const card = document.createElement("div");
    card.className = "recipe-entry";

    const emoji = document.createElement("div");
    emoji.className = "recipe-entry-emoji";
    emoji.textContent = recipe.emoji;

    const title = document.createElement("h4");
    title.textContent = recipe.name;

    const description = document.createElement("p");
    description.textContent = recipe.description;

    const ingredientTitle = document.createElement("p");
    ingredientTitle.style.marginTop = "8px";
    ingredientTitle.style.fontWeight = "900";
    ingredientTitle.textContent = "Ingredients:";

    const ingredientText = document.createElement("p");
    ingredientText.textContent = recipe.ingredients
      .map(item => {
        const info = ingredientsInfo[item];
        return info.emoji + " " + info.name;
      })
      .join(" + ");

    const price = document.createElement("span");
    price.className = "recipe-price";
    price.textContent = "Earn ₱" + recipe.reward;

    card.append(
      emoji,
      title,
      description,
      ingredientTitle,
      ingredientText,
      price
    );

    recipeList.appendChild(card);
  });
}

renderRecipeBook();

recipeBookButton.addEventListener("click", () => {
  const isClosed = recipeBookContent.hidden;

  recipeBookContent.hidden = !isClosed;

  recipeBookButton.textContent = isClosed
    ? "📕 Close Recipe Book"
    : "📖 Open Recipe Book";
});

// START GAME

updateMoney();

setIngredientsEnabled(false);

bakeButton.disabled = true;
clearButton.disabled = true;
serveButton.disabled = true;
collectButton.disabled = true;

if (money >= TARGET_MONEY) {
  takeOrderButton.disabled = true;
  takeOrderButton.textContent = "💗 Bakery Goal Completed!";

  $("customer-name").textContent = "Cinnamoroll";
  $("customer-message").textContent =
    "Your birthday surprise is ready!";
}
