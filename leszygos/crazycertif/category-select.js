import { CATEGORIES } from "./src/data/content.js";

const grid = document.getElementById("category-grid");

grid.innerHTML = CATEGORIES.map(
  (cat) => `
  <a class="category-card" href="category.html?cat=${encodeURIComponent(cat.id)}" style="--cat-color: ${cat.themeColor}">
    <span class="category-card-emoji">${cat.emoji}</span>
    <span class="category-card-name">${cat.name}</span>
    <span class="category-card-count">${cat.titles.length} titres · ${cat.phrases.length} phrases</span>
  </a>
`
).join("");
