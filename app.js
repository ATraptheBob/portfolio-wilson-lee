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
let switchTimer = null;

const LINK_ICONS = {
  linkedin: `<svg class="profile-link-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>`,
  instagram: `<svg class="profile-link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`,
  github: `<svg class="profile-link-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>`,
  music: `<svg class="profile-link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`
};

const EXPAND_ICON = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>`;

function getHoverAngle(baseAngle) {
  const delta = baseAngle >= 0 ? 2.8 : -2.8;
  return (baseAngle + delta).toFixed(2);
}

function sendYouTubeCommand(iframe, func) {
  if (!iframe || !iframe.contentWindow) return;
  iframe.contentWindow.postMessage(
    JSON.stringify({ event: "command", func, args: [] }),
    "*"
  );
}

function createCardElement(card, index) {
  const article = document.createElement("article");
  const isVideo = card.type === "youtube" && card.videoId;
  article.className = `floating-card${card.size === "compact" ? " is-compact" : ""}${isVideo ? " is-video-card" : ""}`;
  article.tabIndex = 0;

  const hoverAngle = getHoverAngle(card.angle);
  const floatDuration = (6.2 + (index % 4) * 0.85).toFixed(2);
  const floatDelay = ((index * 0.45) % 2.5).toFixed(2);

  article.style.setProperty("--base-angle", `${card.angle}deg`);
  article.style.setProperty("--hover-angle", `${hoverAngle}deg`);
  article.style.setProperty("--offset-y", `${card.offsetY || 0}px`);
  article.style.setProperty("--base-z", `${card.zIndex || 1}`);
  article.style.setProperty("--float-duration", `${floatDuration}s`);
  article.style.setProperty("--float-delay", `-${floatDelay}s`);

  const inner = document.createElement("div");
  inner.className = "floating-card-inner";

  if (isVideo) {
    const iframe = document.createElement("iframe");
    iframe.className = "floating-card-video";
    iframe.src = `https://www.youtube.com/embed/${card.videoId}?enablejsapi=1&mute=1&controls=1&rel=0&playsinline=1&loop=1&playlist=${card.videoId}`;
    iframe.title = "Embedded video";
    iframe.allow = "autoplay; fullscreen; encrypted-media; picture-in-picture";
    iframe.allowFullscreen = true;

    const expandBtn = document.createElement("button");
    expandBtn.type = "button";
    expandBtn.className = "video-expand-btn";
    expandBtn.setAttribute("aria-label", "Expand video full screen");
    expandBtn.title = "Full screen";
    expandBtn.innerHTML = EXPAND_ICON;

    expandBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const target = inner.requestFullscreen
        ? inner.requestFullscreen()
        : inner.webkitRequestFullscreen
        ? inner.webkitRequestFullscreen()
        : iframe.requestFullscreen?.();
      sendYouTubeCommand(iframe, "unMute");
      sendYouTubeCommand(iframe, "playVideo");
      return target;
    });

    article.addEventListener("mouseenter", () => {
      sendYouTubeCommand(iframe, "playVideo");
    });

    article.addEventListener("mouseleave", () => {
      if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        sendYouTubeCommand(iframe, "pauseVideo");
      }
    });

    inner.append(iframe, expandBtn);
  } else {
    const img = document.createElement("img");
    img.className = "floating-card-img";
    img.src = card.img;
    img.alt = card.title || "";
    img.decoding = "async";
    inner.appendChild(img);
  }

  if (card.title || card.caption) {
    const meta = document.createElement("div");
    meta.className = "floating-card-meta";

    if (card.title) {
      const title = document.createElement("h3");
      title.className = "floating-card-title";
      title.textContent = card.title;
      meta.appendChild(title);
    }

    if (card.caption) {
      const caption = document.createElement("p");
      caption.className = "floating-card-caption";
      caption.textContent = card.caption;
      meta.appendChild(caption);
    }

    inner.appendChild(meta);
  }

  article.appendChild(inner);
  return article;
}

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
    ...sectionData.bottomCards.map((card, idx) => createCardElement(card, idx + sectionData.topCards.length))
  );
}

function switchSection(targetSection) {
  if (targetSection === currentSection) return;
  currentSection = targetSection;

  htmlEl.setAttribute("data-theme", targetSection);
  pillSwitch.setAttribute("data-active", targetSection);

  tabButtons.forEach((btn) => {
    const isTarget = btn.dataset.section === targetSection;
    btn.classList.toggle("is-active", isTarget);
    btn.setAttribute("aria-selected", String(isTarget));
  });

  if (switchTimer) {
    clearTimeout(switchTimer);
  }
  stageContent.classList.add("is-switching");
  switchTimer = setTimeout(() => {
    renderSection(targetSection);
    stageContent.classList.remove("is-switching");
    switchTimer = null;
  }, 240);
}

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
      if (link.url.startsWith("http")) {
        a.target = "_blank";
        a.rel = "noopener noreferrer";
      }

      const iconSvg = LINK_ICONS[link.id] || "";
      const span = document.createElement("span");
      span.textContent = link.label;

      a.innerHTML = iconSvg;
      a.appendChild(span);
      return a;
    })
  );
}

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

initProfile();
renderSection("engineering");
