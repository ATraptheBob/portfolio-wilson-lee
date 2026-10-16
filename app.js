import { portfolioData } from "./portfolio-data.js?v=8";

const htmlEl = document.documentElement;
const pillSwitch = document.querySelector(".pill-switch");
const tabButtons = document.querySelectorAll(".pill-option");
const stageContent = document.getElementById("stage-content");
const topCluster = document.getElementById("topCluster");
const middleTexts = document.getElementById("middleTexts");
const bottomCluster = document.getElementById("bottomCluster");

const profileTrigger = document.getElementById("profileTrigger");
const profileTriggerImg = document.getElementById("profileTriggerImg");
const profileHint = document.getElementById("profileHint");
const profileDialog = document.getElementById("profileDialog");
const profileCloseBtn = document.getElementById("profileCloseBtn");
const profileDialogTitle = document.getElementById("profileDialogTitle");
const profileDialogPhoto = document.getElementById("profileDialogPhoto");
const profileDialogDesc = document.getElementById("profileDialogDesc");
const profileDialogLinks = document.getElementById("profileDialogLinks");

const lightboxDialog = document.getElementById("lightboxDialog");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxCloseBtn = document.getElementById("lightboxCloseBtn");
const scrollHintBtn = document.getElementById("scrollHintBtn");
const introScreen = document.getElementById("introScreen");
const bobRossZone = document.getElementById("bobRossZone");

let currentSection = "engineering";
let switchTimer = null;

// Sequential tutorial state machine: "photo" -> "scroll" -> "profile" -> "done"
let tutorialState = "photo";

const preloadedThumbs = [];
const svgParser = new DOMParser();

const LINK_ICONS = {
  linkedin: `<svg xmlns="http://www.w3.org/2000/svg" class="profile-link-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>`,
  instagram: `<svg xmlns="http://www.w3.org/2000/svg" class="profile-link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`,
  github: `<svg xmlns="http://www.w3.org/2000/svg" class="profile-link-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>`,
  music: `<svg xmlns="http://www.w3.org/2000/svg" class="profile-link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`
};

const EXPAND_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>`;

const PHOTO_HINT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" class="hand-arrow-svg" viewBox="0 0 115 75" fill="none"><path class="hand-stroke-main" pathLength="1" d="M 10 16 C 36 6, 62 20, 52 38 C 44 50, 26 42, 34 27 C 43 12, 78 24, 96 56"/><path class="hand-stroke-tip" pathLength="1" d="M 82 52 C 89 55, 94 58, 98 60 C 98 54, 99 47, 102 41"/></svg>`;

function parseSvgNode(svgMarkup) {
  const doc = svgParser.parseFromString(svgMarkup, "image/svg+xml");
  return doc.documentElement ? document.importNode(doc.documentElement, true) : null;
}

function isSafeUrl(rawUrl) {
  try {
    const parsed = new URL(rawUrl, window.location.origin);
    return parsed.protocol === "https:" || parsed.protocol === "http:" || parsed.protocol === "mailto:";
  } catch {
    return false;
  }
}

function getHoverAngle(baseAngle) {
  const delta = baseAngle >= 0 ? 2.6 : -2.6;
  return (baseAngle + delta).toFixed(2);
}

function sendYouTubeCommand(iframe, func) {
  if (!iframe || !iframe.contentWindow) return;
  iframe.contentWindow.postMessage(
    JSON.stringify({ event: "command", func, args: [] }),
    "https://www.youtube.com"
  );
}

function syncTutorialUI() {
  const activePhotoHint = document.getElementById("photoHint");
  if (activePhotoHint) {
    activePhotoHint.classList.toggle("is-hidden", tutorialState !== "photo");
  }

  if (profileHint) {
    profileHint.classList.toggle("is-hidden", tutorialState !== "profile");
  }

  if (scrollHintBtn) {
    if (tutorialState === "scroll") {
      scrollHintBtn.classList.remove("is-hidden");
      scrollHintBtn.classList.remove("is-static");
    } else if (tutorialState === "done") {
      scrollHintBtn.classList.add("is-static");
      scrollHintBtn.classList.toggle("is-hidden", window.scrollY > 80);
    } else {
      scrollHintBtn.classList.add("is-hidden");
    }
  }
}

function advanceTutorial(completedStep) {
  if (completedStep === "photo" && tutorialState === "photo") {
    tutorialState = "scroll";
    const activePhotoHint = document.getElementById("photoHint");
    if (activePhotoHint) {
      activePhotoHint.remove();
    }
    syncTutorialUI();
  } else if (completedStep === "scroll" && tutorialState === "scroll") {
    tutorialState = "profile";
    syncTutorialUI();
  } else if (completedStep === "profile" && tutorialState === "profile") {
    tutorialState = "done";
    syncTutorialUI();
  }
}

function openLightbox(src, altText) {
  advanceTutorial("photo");
  if (!lightboxDialog || !lightboxImg) return;
  lightboxImg.src = src;
  lightboxImg.alt = altText || "";
  if (!lightboxDialog.open) {
    lightboxDialog.showModal();
  }
}

function preloadPhotographyThumbnails() {
  const photoSection = portfolioData.photography;
  if (!photoSection) return;
  const allCards = [...(photoSection.topCards || []), ...(photoSection.bottomCards || [])];
  allCards.forEach((card) => {
    if (card.thumb) {
      const preloadImg = new Image();
      preloadImg.decoding = "async";
      preloadImg.src = card.thumb;
      preloadedThumbs.push(preloadImg);
    }
  });
}

function attachProgressiveImage(imgEl, card) {
  if (card.thumb) {
    imgEl.src = card.thumb;
    const fullImg = new Image();
    fullImg.decoding = "async";
    fullImg.src = card.img;
    const swapIn = () => {
      if (imgEl.isConnected) {
        imgEl.src = card.img;
      }
    };
    if (fullImg.decode) {
      fullImg.decode().then(swapIn).catch(() => {
        fullImg.onload = swapIn;
      });
    } else {
      fullImg.onload = swapIn;
    }
  } else {
    imgEl.src = card.img;
  }
}

function createCardElement(card, index) {
  const article = document.createElement("article");
  const isVideo = card.type === "youtube" && /^[a-zA-Z0-9_-]{6,20}$/.test(card.videoId);
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

  if (index === 0 && tutorialState === "photo") {
    const hintWrap = document.createElement("div");
    hintWrap.className = "hand-hint photo-hint";
    hintWrap.id = "photoHint";
    const hintSvgNode = parseSvgNode(PHOTO_HINT_SVG);
    if (hintSvgNode) {
      hintWrap.appendChild(hintSvgNode);
    }
    article.appendChild(hintWrap);
  }

  const inner = document.createElement("div");
  inner.className = "floating-card-inner";

  if (isVideo) {
    const iframe = document.createElement("iframe");
    iframe.className = "floating-card-video";
    iframe.src = `https://www.youtube.com/embed/${card.videoId}?enablejsapi=1&mute=1&controls=1&rel=0&playsinline=1&loop=1&playlist=${card.videoId}`;
    iframe.title = "Embedded video";
    iframe.loading = "lazy";
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.allow = "autoplay; fullscreen; encrypted-media; picture-in-picture";
    iframe.allowFullscreen = true;

    const expandBtn = document.createElement("button");
    expandBtn.type = "button";
    expandBtn.className = "video-expand-btn";
    expandBtn.setAttribute("aria-label", "Expand video full screen");
    expandBtn.title = "Full screen";
    const expandIconNode = parseSvgNode(EXPAND_ICON);
    if (expandIconNode) {
      expandBtn.appendChild(expandIconNode);
    }

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
    img.alt = card.title || card.subtitle || "";
    img.width = 600;
    img.height = 600;
    img.decoding = "async";
    if (index < 6) {
      img.fetchPriority = "high";
    } else {
      img.loading = "lazy";
    }
    attachProgressiveImage(img, card);
    inner.appendChild(img);

    article.addEventListener("click", () => {
      openLightbox(card.img, card.title || card.subtitle);
    });
    article.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(card.img, card.title || card.subtitle);
      }
    });
  }

  if (card.subtitle) {
    const subtitleEl = document.createElement("div");
    subtitleEl.className = "floating-card-subtitle";
    subtitleEl.textContent = card.subtitle;
    inner.appendChild(subtitleEl);
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

  const topFrag = document.createDocumentFragment();
  sectionData.topCards.forEach((card, idx) => {
    topFrag.appendChild(createCardElement(card, idx));
  });
  topCluster.replaceChildren(topFrag);

  const textFrag = document.createDocumentFragment();
  sectionData.floatingTexts.forEach((item) => {
    textFrag.appendChild(createTextElement(item));
  });
  middleTexts.replaceChildren(textFrag);

  const bottomFrag = document.createDocumentFragment();
  sectionData.bottomCards.forEach((card, idx) => {
    bottomFrag.appendChild(createCardElement(card, idx + sectionData.topCards.length));
  });
  bottomCluster.replaceChildren(bottomFrag);

  syncTutorialUI();
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
  }, 220);
}

function initProfile() {
  const { profile } = portfolioData;
  if (!profile) return;

  profileTriggerImg.src = profile.photoUrl;
  profileDialogTitle.textContent = profile.name;
  profileDialogPhoto.src = profile.photoUrl;
  profileDialogPhoto.alt = profile.name;
  profileDialogDesc.textContent = profile.description;

  const linksFrag = document.createDocumentFragment();
  (profile.links || []).forEach((link) => {
    if (!isSafeUrl(link.url)) return;

    const a = document.createElement("a");
    a.className = "profile-link";
    a.href = link.url;
    if (link.url.startsWith("http")) {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }

    const iconMarkup = LINK_ICONS[link.id];
    if (iconMarkup) {
      const iconNode = parseSvgNode(iconMarkup);
      if (iconNode) {
        a.appendChild(iconNode);
      }
    }

    const span = document.createElement("span");
    span.textContent = link.label;
    a.appendChild(span);
    linksFrag.appendChild(a);
  });
  profileDialogLinks.replaceChildren(linksFrag);
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

function attachDialogBackdropFallback(dialogEl, useAnimatedClose) {
  if (!dialogEl || "closedBy" in HTMLDialogElement.prototype) return;
  dialogEl.addEventListener("click", (event) => {
    if (event.target !== dialogEl) return;
    const rect = dialogEl.getBoundingClientRect();
    const isInside =
      rect.top <= event.clientY &&
      event.clientY <= rect.top + rect.height &&
      rect.left <= event.clientX &&
      event.clientX <= rect.left + rect.width;
    if (!isInside) {
      if (useAnimatedClose) {
        closeTopLayer(dialogEl);
      } else {
        dialogEl.close();
      }
    }
  });
}

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    switchSection(btn.dataset.section);
  });
});

profileTrigger.addEventListener("click", () => {
  advanceTutorial("profile");
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

if (lightboxCloseBtn && lightboxDialog) {
  lightboxCloseBtn.addEventListener("click", () => {
    lightboxDialog.close();
  });
}

if (scrollHintBtn) {
  scrollHintBtn.addEventListener("click", () => {
    window.scrollBy({ top: window.innerHeight * 0.75, behavior: "smooth" });
    advanceTutorial("scroll");
  });

  window.addEventListener(
    "scroll",
    () => {
      if (tutorialState === "scroll" && window.scrollY > 50) {
        advanceTutorial("scroll");
      } else if (tutorialState === "done") {
        syncTutorialUI();
      }
    },
    { passive: true }
  );
}

attachDialogBackdropFallback(profileDialog, true);
attachDialogBackdropFallback(lightboxDialog, false);

function dismissIntroScreen() {
  if (!introScreen || introScreen.classList.contains("is-dismissed")) return;
  introScreen.classList.add("is-dismissed");
  introScreen.addEventListener(
    "transitionend",
    () => {
      introScreen.style.display = "none";
    },
    { once: true }
  );
}

if (introScreen) {
  introScreen.addEventListener("click", dismissIntroScreen);

  window.addEventListener(
    "wheel",
    (e) => {
      if (Math.abs(e.deltaY) > 2 || Math.abs(e.deltaX) > 2) {
        dismissIntroScreen();
      }
    },
    { passive: true }
  );

  let touchStartY = 0;
  window.addEventListener(
    "touchstart",
    (e) => {
      if (e.touches && e.touches[0]) {
        touchStartY = e.touches[0].clientY;
      }
    },
    { passive: true }
  );
  window.addEventListener(
    "touchmove",
    (e) => {
      if (e.touches && e.touches[0]) {
        const deltaY = touchStartY - e.touches[0].clientY;
        if (Math.abs(deltaY) > 8) {
          dismissIntroScreen();
        }
      }
    },
    { passive: true }
  );

  window.addEventListener("keydown", (e) => {
    if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", " ", "Spacebar"].includes(e.key)) {
      dismissIntroScreen();
    }
  });

  window.addEventListener(
    "scroll",
    () => {
      if (window.scrollY > 5) {
        dismissIntroScreen();
      }
    },
    { passive: true }
  );
}

if (bobRossZone) {
  window.addEventListener("mousemove", (e) => {
    const distFromRight = window.innerWidth - e.clientX;
    const distFromBottom = window.innerHeight - e.clientY;
    if (distFromRight <= 72 && distFromBottom <= 72) {
      bobRossZone.classList.add("is-popped");
    } else {
      bobRossZone.classList.remove("is-popped");
    }
  });
}

initProfile();
renderSection("engineering");
preloadPhotographyThumbnails();

