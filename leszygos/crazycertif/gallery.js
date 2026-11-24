import { getCategory, generateCategoryTemplates } from "./src/data/content.js";
import { renderCertificate } from "./src/data/renderTemplate.js";

const params = new URLSearchParams(window.location.search);
const categoryId = params.get("cat");

const categoryHero = document.getElementById("category-hero");
const grid = document.getElementById("templates-grid");
const selectionBar = document.getElementById("selection-bar");
const selectionCount = document.getElementById("selection-count");
const checkoutBtn = document.getElementById("checkout-btn");

const category = getCategory(categoryId);

if (!category) {
  categoryHero.innerHTML = `<h1>Catégorie introuvable</h1><p><a href="index.html">Retour à l'accueil</a></p>`;
  throw new Error("unknown_category");
}

document.title = `${category.name} — CrazyCertif`;
document.documentElement.style.setProperty("--cat-color", category.themeColor);

categoryHero.innerHTML = `
  <span class="category-hero-emoji">${category.emoji}</span>
  <h1>${category.name}</h1>
  <p>20 certificats prêts, dans 6 styles visuels différents. Choisissez celui qui vous fait rire.</p>
`;

const templates = generateCategoryTemplates(categoryId, 20);

let requiredCount = 1; // 1 (single) ou 3 (pack)
const selectedIndexes = new Set();

function renderGrid() {
  grid.innerHTML = "";
  templates.forEach((tpl, index) => {
    const previewContent = {
      title: tpl.title,
      firstname: "Prénom",
      date: new Date().toISOString().slice(0, 10),
      phrase: tpl.phrase,
    };
    const card = document.createElement("button");
    card.type = "button";
    card.className = "template-card";
    card.dataset.index = String(index);
    card.innerHTML = `
      <div class="thumb">${renderCertificate(tpl.style, previewContent)}</div>
      <div class="meta">
        <p class="template-title">${tpl.title}</p>
      </div>
    `;
    card.addEventListener("click", () => toggleTemplate(index, card));
    grid.appendChild(card);
  });
}

function toggleTemplate(index, cardEl) {
  if (selectedIndexes.has(index)) {
    selectedIndexes.delete(index);
    cardEl.classList.remove("selected");
  } else {
    if (selectedIndexes.size >= requiredCount) {
      const [first] = selectedIndexes;
      selectedIndexes.delete(first);
      grid.querySelector(`[data-index="${first}"]`)?.classList.remove("selected");
    }
    selectedIndexes.add(index);
    cardEl.classList.add("selected");
  }
  updateSelectionBar();
}

function updateSelectionBar() {
  selectionBar.hidden = false;
  selectionCount.textContent = `${selectedIndexes.size} / ${requiredCount} certificat${requiredCount > 1 ? "s" : ""} sélectionné${selectedIndexes.size > 1 ? "s" : ""}`;
  checkoutBtn.disabled = selectedIndexes.size !== requiredCount;
}

document.querySelectorAll("[data-select-count]").forEach((btn) => {
  btn.addEventListener("click", () => {
    requiredCount = Number(btn.dataset.selectCount);
    selectedIndexes.clear();
    grid.querySelectorAll(".template-card").forEach((c) => c.classList.remove("selected"));
    document.querySelectorAll(".btn-select").forEach((b) => b.classList.remove("selected"));
    btn.classList.add("selected");
    updateSelectionBar();
  });
});

checkoutBtn.addEventListener("click", async () => {
  checkoutBtn.disabled = true;
  checkoutBtn.textContent = "Redirection…";
  const combos = Array.from(selectedIndexes).map((i) => templates[i]);
  try {
    const res = await fetch("/.netlify/functions/create-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        count: requiredCount,
        combos, // [{style, title, phrase, categoryId}, ...]
      }),
    });
    if (!res.ok) throw new Error("checkout_failed");
    const { url } = await res.json();
    window.location.href = url;
  } catch (err) {
    checkoutBtn.disabled = false;
    checkoutBtn.textContent = "Payer et personnaliser";
    alert("Le paiement n'a pas pu démarrer. Réessayez dans un instant.");
  }
});

renderGrid();
