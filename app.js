import { portfolioData } from "./portfolio-data.js";

const htmlEl = document.documentElement;
const pillSwitch = document.querySelector(".pill-switch");
const tabButtons = document.querySelectorAll(".pill-option");
const stageContent = document.getElementById("stage-content");
const topCluster = document.getElementById("topCluster");
const middleTexts = document.getElementById("middleTexts");
const bottomCluster = document.getElementById("bottomCluster");

const profileTrigger = document.getElementById("profileTrigger");
const profileTriggerImg = document.getElementById("profileTriggerImg");
const profileDialog = document.getElementById("profileDialog");
const profileCloseBtn = document.getElementById("profileCloseBtn");
const profileDialogTitle = document.getElementById("profileDialogTitle");
const profileDialogPhoto = document.getElementById("profileDialogPhoto");
const profileDialogDesc = document.getElementById("profileDialogDesc");
const profileDialogLinks = document.getElementById("profileDialogLinks");

let currentSection = "engineering";

/**
 * Compute hover angle so hovering tilts the item slightly further in its natural direction.
 */
function getHoverAngle(baseAngle) {
  const delta = baseAngle >= 0 ? 2.8 : -2.8;
  return (baseAngle + delta).toFixed(2);
}

/**
 * Create a single off-kilter floating card DOM element.
 */
function createCardElement(card, index) {
  const article = document.createElement("article");
  article.className = `floating-card${card.size === "compact" ? " is-compact" : ""}`;
  article.tabIndex = 0;

  const hoverAngle = getHoverAngle(card.angle);
  const floatDuration = (6.2 + (index % 4) * 0.85).toFixed(2);
  const floatDelay = ((index * 0.45) % 2.5).toFixed(2);

  article.style.setProperty("--base-angle", `${card.angle}deg`);
  article.style.setProperty("--hover-angle", `${hoverAngle}deg`);
  article.style.setProperty("--offset-y", `${card.offsetY || 0}px`);
  article.style.setProperty("--offset-x", `${card.offsetX || 0}px`);
  article.style.setProperty("--base-z", `${card.zIndex || 1}`);
  article.style.setProperty("--float-duration", `${floatDuration}s`);
  article.style.setProperty("--float-delay", `-${floatDelay}s`);

  const inner = document.createElement("div");
  inner.className = "floating-card-inner";

  const img = document.createElement("img");
  img.className = "floating-card-img";
  img.src = card.img;
  img.alt = card.title || "Portfolio item";
  img.loading = "lazy";

  const meta = document.createElement("div");
  meta.className = "floating-card-meta";

  const title = document.createElement("h3");
  title.className = "floating-card-title";
  title.textContent = card.title;

  const caption = document.createElement("p");
  caption.className = "floating-card-caption";
  caption.textContent = card.caption || "";

  meta.append(title, caption);
  inner.append(img, meta);
  article.appendChild(inner);

  return article;
}

/**
 * Create a floating off-kilter text block for the middle band.
 */
function createTextElement(item) {
  const div = document.createElement("div");
  div.className = "floating-text-item";

  const hoverAngle = getHoverAngle(item.angle || -2);
  div.style.setProperty("--base-angle", `${item.angle || -2}deg`);
  div.style.setProperty("--hover-angle", `${hoverAngle}deg`);
  div.style.setProperty("--offset-y", `${item.offsetY || 0}px`);

  const heading = document.createElement("h2");
  heading.className = "floating-text-heading";
  heading.textContent = item.text;

  div.appendChild(heading);

  if (item.subtext) {
    const sub = document.createElement("p");
    sub.className = "floating-text-sub";
    sub.textContent = item.subtext;
    div.appendChild(sub);
  }

  return div;
}

/**
 * Render the active section ("engineering" or "photography").
 */
function renderSection(sectionKey) {
  const sectionData = portfolioData[sectionKey];
  if (!sectionData) return;

  topCluster.replaceChildren(
    ...sectionData.topCards.map((card, idx) => createCardElement(card, idx))
  );

  middleTexts.replaceChildren(
    ...sectionData.floatingTexts.map((item) => createTextElement(item))
  );

  bottomCluster.replaceChildren(
    ...sectionData.bottomCards.map((card, idx) => createCardElement(card, idx + 5))
  );
}

/**
 * Switch smoothly between Engineering and Photography tabs.
 */
function switchSection(targetSection) {
  if (targetSection === currentSection) return;
  currentSection = targetSection;

  // Update theme background color & pill state
  htmlEl.setAttribute("data-theme", targetSection);
  pillSwitch.setAttribute("data-active", targetSection);

  tabButtons.forEach((btn) => {
    const isTarget = btn.dataset.section === targetSection;
    btn.classList.toggle("is-active", isTarget);
    btn.setAttribute("aria-selected", String(isTarget));
  });

  // Smooth stage fade transition
  stageContent.classList.add("is-switching");
  setTimeout(() => {
    renderSection(targetSection);
    stageContent.classList.remove("is-switching");
  }, 190);
}

/**
 * Populate the profile modal & top-right avatar from portfolioData.profile.
 */
function initProfile() {
  const { profile } = portfolioData;
  if (!profile) return;

  profileTriggerImg.src = profile.photoUrl;
  profileDialogTitle.textContent = profile.name;
  profileDialogPhoto.src = profile.photoUrl;
  profileDialogPhoto.alt = profile.name;
  profileDialogDesc.textContent = profile.description;

  profileDialogLinks.replaceChildren(
    ...(profile.links || []).map((link) => {
      const a = document.createElement("a");
      a.className = "profile-link";
      a.href = link.url;
      a.textContent = link.label;
      if (link.url.startsWith("http")) {
        a.target = "_blank";
        a.rel = "noopener noreferrer";
      }
      return a;
    })
  );
}

/* ==========================================================================
   Top-Layer Dialog Animation & Light-Dismiss Fallbacks
   ========================================================================== */

let supportsDisplayTransition;
function canTransitionDisplay() {
  if (supportsDisplayTransition !== undefined) return supportsDisplayTransition;
  if (!window.CSS?.supports?.("transition-behavior", "allow-discrete") || !document.body) {
    return false;
  }
  const probe = document.createElement("div");
  probe.style.cssText = "transition: display 1s allow-discrete !important; display: block;";
  document.body.appendChild(probe);
  getComputedStyle(probe).display;
  probe.style.display = "none";
  supportsDisplayTransition = getComputedStyle(probe).display === "block";
  probe.remove();
  return supportsDisplayTransition;
}

function supportsTopLayerExit() {
  return window.CSS?.supports?.("overlay", "auto") && canTransitionDisplay();
}

async function closeTopLayer(element) {
  if (!supportsTopLayerExit()) {
    element.setAttribute("data-closing", "");
    const animations = element.getAnimations({ subtree: true });
    if (animations.length > 0) {
      await Promise.race([
        Promise.allSettled(animations.map((a) => a.finished)),
        new Promise((r) => setTimeout(r, 2000))
      ]);
    }
    if (!element.hasAttribute("data-closing")) return;
    element.removeAttribute("data-closing");
  }

  element.close();
}

// Event listeners
tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    switchSection(btn.dataset.section);
  });
});

profileTrigger.addEventListener("click", () => {
  if (!profileDialog.open) {
    profileDialog.showModal();
  }
});

profileCloseBtn.addEventListener("click", () => {
  closeTopLayer(profileDialog);
});

profileDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeTopLayer(profileDialog);
});

// Fallback for browsers without native <dialog closedby="any"> support
if (!("closedBy" in HTMLDialogElement.prototype)) {
  profileDialog.addEventListener("click", (event) => {
    if (event.target !== profileDialog) return;

    const rect = profileDialog.getBoundingClientRect();
    const isDialogContent =
      rect.top <= event.clientY &&
      event.clientY <= rect.top + rect.height &&
      rect.left <= event.clientX &&
      event.clientX <= rect.left + rect.width;

    if (isDialogContent) return;

    closeTopLayer(profileDialog);
  });
}

// Initial render (Default first page: Engineering)
initProfile();
renderSection("engineering");
