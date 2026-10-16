import { portfolioData } from "./portfolio-data.js?v=11";

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

const projectDialog = document.getElementById("projectDialog");
const projectCloseBtn = document.getElementById("projectCloseBtn");
const projectDialogTitle = document.getElementById("projectDialogTitle");
const projectDialogDesc = document.getElementById("projectDialogDesc");
const projectDialogGrid = document.getElementById("projectDialogGrid");

const lightboxDialog = document.getElementById("lightboxDialog");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxCloseBtn = document.getElementById("lightboxCloseBtn");
const scrollHintBtn = document.getElementById("scrollHintBtn");
const introScreen = document.getElementById("introScreen");
const bobRossZone = document.getElementById("bobRossZone");

let currentSection = "engineering";
let switchTimer = null;
let activeMediaObserver = null;

// Sequential tutorial state machine: "photo" -> "scroll" -> "profile" -> "done"
let tutorialState = "photo";

const preloadedThumbs = [];
const preloadedHighRes = [];
const svgParser = new DOMParser();

const supportsLazyMedia =
  typeof HTMLMediaElement !== "undefined" &&
  Object.hasOwn(HTMLMediaElement.prototype, "loading");

const EXPANDED_ANGLES = [-7.2, 6.4, -2.8, 8.6, -5.2, 4.4, -8.4, 7.2, -3.4, 5.8];
const EXPANDED_OFFSETS_Y = [-6, 10, -4, 14, 6, -8, 12, -5, 8, -4];

const LINK_ICONS = {
  linkedin: `<svg xmlns="http://www.w3.org/2000/svg" class="profile-link-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>`,
  instagram: `<svg xmlns="http://www.w3.org/2000/svg" class="profile-link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`,
  github: `<svg xmlns="http://www.w3.org/2000/svg" class="profile-link-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>`,
  music: `<svg xmlns="http://www.w3.org/2000/svg" class="profile-link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
  beli: `<svg xmlns="http://www.w3.org/2000/svg" class="profile-link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2v20M21 2v6a3 3 0 0 1-3 3M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20"/></svg>`
};

const EXPAND_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>`;

const VIDEO_ICONS = {
  centerPlay: `<svg class="video-center-icon" viewBox="0 0 24 24" fill="currentColor" style="margin-left: 2px;"><polygon points="6 4 20 12 6 20 6 4"/></svg>`,
  centerReplay: `<svg class="video-center-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>`,
  play: `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4"/></svg>`,
  pause: `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`,
  mute: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`,
  unmute: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`,
  fullscreen: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>`,
  fullscreenExit: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/></svg>`
};

function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

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

function sendYouTubeCommand(iframe, func, args = []) {
  if (!iframe || !iframe.contentWindow) return;
  iframe.contentWindow.postMessage(
    JSON.stringify({ event: "command", func, args }),
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

let currentLightboxSrc = null;

function openLightbox(src, altText) {
  advanceTutorial("photo");
  if (!lightboxDialog || !lightboxImg) return;

  currentLightboxSrc = src;
  lightboxImg.classList.remove("is-loaded");
  lightboxImg.removeAttribute("src");
  lightboxImg.alt = altText || "";

  if (!lightboxDialog.open) {
    lightboxDialog.showModal();
  }

  const targetSrc = src;
  const tempImg = new Image();
  tempImg.src = targetSrc;

  const reveal = () => {
    if (!lightboxDialog.open || currentLightboxSrc !== targetSrc) return;
    lightboxImg.src = targetSrc;
    requestAnimationFrame(() => {
      lightboxImg.classList.add("is-loaded");
    });
  };

  if ("decode" in tempImg) {
    tempImg.decode().then(reveal).catch(reveal);
  } else {
    tempImg.onload = reveal;
    tempImg.onerror = reveal;
  }
}

function cleanupProjectDialogMedia() {
  if (activeMediaObserver) {
    activeMediaObserver.disconnect();
    activeMediaObserver = null;
  }
  if (!projectDialogGrid) return;
  const videos = projectDialogGrid.querySelectorAll("video");
  for (const video of videos) {
    video.pause();
    video.removeAttribute("src");
    video.load();
  }
}

function setupLazyVideosInDialog(containerEl) {
  if (supportsLazyMedia || !containerEl) return;

  const lazyVideos = containerEl.querySelectorAll('video[loading="lazy"]');
  if (lazyVideos.length === 0) return;

  activeMediaObserver = new IntersectionObserver(
    (entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const media = entry.target;

        if (media.dataset.preload) {
          media.preload = media.dataset.preload;
          delete media.dataset.preload;
        }
        if (media.dataset.src) {
          media.src = media.dataset.src;
          delete media.dataset.src;
          media.load();
        }

        observer.unobserve(media);
      }
    },
    {
      root: projectDialog,
      rootMargin: "240px 0px"
    }
  );

  for (const media of lazyVideos) {
    if (media.hasAttribute("preload") && media.getAttribute("preload") !== "none") {
      media.dataset.preload = media.getAttribute("preload");
    }
    if (media.hasAttribute("src")) {
      media.dataset.src = media.getAttribute("src");
      media.removeAttribute("src");
    }
    media.preload = "none";
    activeMediaObserver.observe(media);
  }
}

function createExpandedMediaCard(item, idx, projectTitle) {
  const article = document.createElement("article");
  const isLocalVideo = item.type === "video";
  article.className = `floating-card${isLocalVideo ? " is-local-video-card" : ""}`;
  article.tabIndex = 0;

  const baseAngle = EXPANDED_ANGLES[idx % EXPANDED_ANGLES.length];
  const hoverAngle = getHoverAngle(baseAngle);
  const offsetY = EXPANDED_OFFSETS_Y[idx % EXPANDED_OFFSETS_Y.length];
  const floatDuration = (6.2 + (idx % 4) * 0.85).toFixed(2);
  const floatDelay = ((idx * 0.45) % 2.5).toFixed(2);
  const fanDelay = Math.min(idx * 0.03, 0.36).toFixed(2);

  article.style.setProperty("--base-angle", `${baseAngle}deg`);
  article.style.setProperty("--hover-angle", `${hoverAngle}deg`);
  article.style.setProperty("--offset-y", `${offsetY}px`);
  article.style.setProperty("--base-z", `${(idx % 3) + 1}`);
  article.style.setProperty("--float-duration", `${floatDuration}s`);
  article.style.setProperty("--float-delay", `-${floatDelay}s`);
  article.style.setProperty("--fan-delay", `${fanDelay}s`);

  const inner = document.createElement("div");
  inner.className = "floating-card-inner";

  if (isLocalVideo) {
    if (item.width && item.height && item.width > item.height) {
      article.classList.add("is-landscape");
    }

    const video = document.createElement("video");
    video.className = "floating-card-video";
    video.controls = false;
    video.playsInline = true;
    video.width = item.width || 304;
    video.height = item.height || 540;
    video.poster = item.thumb || "";
    video.preload = "metadata";
    video.setAttribute("loading", "lazy");
    video.src = item.src;

    const ensureSrc = () => {
      if (video.dataset.src) {
        video.src = video.dataset.src;
        delete video.dataset.src;
        video.load();
      }
    };

    const centerBtn = document.createElement("button");
    centerBtn.type = "button";
    centerBtn.className = "video-center-btn";
    centerBtn.setAttribute("aria-label", "Play video");
    centerBtn.appendChild(parseSvgNode(VIDEO_ICONS.centerPlay));

    const hud = document.createElement("div");
    hud.className = "video-hud";
    hud.setAttribute("aria-label", "Video controls");

    const scrubBar = document.createElement("div");
    scrubBar.className = "video-scrub-bar";
    scrubBar.setAttribute("role", "slider");
    scrubBar.setAttribute("aria-label", "Video progress");
    scrubBar.setAttribute("aria-valuemin", "0");
    scrubBar.setAttribute("aria-valuemax", "100");
    scrubBar.setAttribute("aria-valuenow", "0");
    scrubBar.tabIndex = 0;

    const scrubTrack = document.createElement("div");
    scrubTrack.className = "video-scrub-track";

    const scrubBuffer = document.createElement("div");
    scrubBuffer.className = "video-scrub-buffer";

    const scrubProgress = document.createElement("div");
    scrubProgress.className = "video-scrub-progress";

    const scrubThumb = document.createElement("div");
    scrubThumb.className = "video-scrub-thumb";

    scrubTrack.append(scrubBuffer, scrubProgress, scrubThumb);
    scrubBar.appendChild(scrubTrack);

    const controlsRow = document.createElement("div");
    controlsRow.className = "video-controls-row";

    const playToggleBtn = document.createElement("button");
    playToggleBtn.type = "button";
    playToggleBtn.className = "video-control-btn video-play-toggle";
    playToggleBtn.setAttribute("aria-label", "Play");
    playToggleBtn.appendChild(parseSvgNode(VIDEO_ICONS.play));

    const timeDisplay = document.createElement("span");
    timeDisplay.className = "video-time-display";
    timeDisplay.textContent = "0:00 / 0:00";

    const spacer = document.createElement("div");
    spacer.className = "video-controls-spacer";

    const muteToggleBtn = document.createElement("button");
    muteToggleBtn.type = "button";
    muteToggleBtn.className = "video-control-btn video-mute-toggle";
    muteToggleBtn.setAttribute("aria-label", "Mute");
    muteToggleBtn.appendChild(parseSvgNode(VIDEO_ICONS.unmute));

    const fullscreenBtn = document.createElement("button");
    fullscreenBtn.type = "button";
    fullscreenBtn.className = "video-control-btn video-fullscreen-toggle";
    fullscreenBtn.setAttribute("aria-label", "Full screen");
    fullscreenBtn.appendChild(parseSvgNode(VIDEO_ICONS.fullscreen));

    controlsRow.append(playToggleBtn, timeDisplay, spacer, muteToggleBtn, fullscreenBtn);
    hud.append(scrubBar, controlsRow);

    const updatePlayUI = (isPlaying) => {
      article.classList.toggle("is-playing", isPlaying);
      if (isPlaying) {
        article.classList.remove("is-ended");
        playToggleBtn.setAttribute("aria-label", "Pause");
        playToggleBtn.replaceChildren(parseSvgNode(VIDEO_ICONS.pause));
        centerBtn.setAttribute("aria-label", "Pause video");
      } else {
        playToggleBtn.setAttribute("aria-label", "Play");
        playToggleBtn.replaceChildren(parseSvgNode(VIDEO_ICONS.play));
        centerBtn.setAttribute("aria-label", "Play video");
        if (video.ended) {
          centerBtn.replaceChildren(parseSvgNode(VIDEO_ICONS.centerReplay));
        } else {
          centerBtn.replaceChildren(parseSvgNode(VIDEO_ICONS.centerPlay));
        }
      }
    };

    const updateMuteUI = () => {
      const isMuted = video.muted;
      muteToggleBtn.setAttribute("aria-label", isMuted ? "Unmute" : "Mute");
      muteToggleBtn.replaceChildren(parseSvgNode(isMuted ? VIDEO_ICONS.mute : VIDEO_ICONS.unmute));
    };

    const togglePlay = () => {
      ensureSrc();
      if (video.paused || video.ended) {
        if (projectDialogGrid) {
          for (const other of projectDialogGrid.querySelectorAll("video")) {
            if (other !== video && !other.paused) {
              other.pause();
            }
          }
        }
        if (video.ended) {
          video.currentTime = 0;
        }
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    };

    let isScrubbing = false;
    const seek = (e) => {
      ensureSrc();
      const rect = scrubTrack.getBoundingClientRect();
      const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      if (video.duration) {
        video.currentTime = pos * video.duration;
        const pct = pos * 100;
        scrubProgress.style.width = `${pct}%`;
        scrubThumb.style.left = `${pct}%`;
        timeDisplay.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
      }
    };

    scrubBar.addEventListener("pointerdown", (e) => {
      e.stopPropagation();
      isScrubbing = true;
      try { scrubBar.setPointerCapture(e.pointerId); } catch {}
      seek(e);
    });

    scrubBar.addEventListener("pointermove", (e) => {
      if (!isScrubbing) return;
      e.stopPropagation();
      seek(e);
    });

    const stopScrubbing = (e) => {
      if (isScrubbing) {
        isScrubbing = false;
        try { scrubBar.releasePointerCapture(e.pointerId); } catch {}
      }
    };
    scrubBar.addEventListener("pointerup", stopScrubbing);
    scrubBar.addEventListener("pointercancel", stopScrubbing);

    let hudTimer = null;
    const triggerHud = () => {
      hud.classList.add("is-visible");
      clearTimeout(hudTimer);
      if (!video.paused && !video.ended) {
        hudTimer = setTimeout(() => {
          hud.classList.remove("is-visible");
        }, 2200);
      }
    };

    article.addEventListener("pointerenter", triggerHud);
    article.addEventListener("pointermove", triggerHud);
    article.addEventListener("pointerleave", () => {
      clearTimeout(hudTimer);
      if (!video.paused && !video.ended) {
        hud.classList.remove("is-visible");
      }
    });

    video.addEventListener("play", () => {
      updatePlayUI(true);
      triggerHud();
    });

    video.addEventListener("pause", () => {
      updatePlayUI(false);
      hud.classList.add("is-visible");
      clearTimeout(hudTimer);
    });

    video.addEventListener("ended", () => {
      article.classList.add("is-ended");
      updatePlayUI(false);
      hud.classList.add("is-visible");
      clearTimeout(hudTimer);
    });

    video.addEventListener("loadedmetadata", () => {
      timeDisplay.textContent = `0:00 / ${formatTime(video.duration || 0)}`;
    });

    video.addEventListener("timeupdate", () => {
      if (isScrubbing) return;
      const duration = video.duration || 0;
      const current = video.currentTime || 0;
      const pct = duration ? (current / duration) * 100 : 0;
      scrubProgress.style.width = `${pct}%`;
      scrubThumb.style.left = `${pct}%`;
      scrubBar.setAttribute("aria-valuenow", Math.round(pct));
      timeDisplay.textContent = `${formatTime(current)} / ${formatTime(duration)}`;
    });

    video.addEventListener("progress", () => {
      if (video.buffered.length > 0 && video.duration) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const pct = (bufferedEnd / video.duration) * 100;
        scrubBuffer.style.width = `${pct}%`;
      }
    });

    centerBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      togglePlay();
    });

    playToggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      togglePlay();
    });

    muteToggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      video.muted = !video.muted;
      updateMuteUI();
    });

    fullscreenBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      ensureSrc();
      if (document.fullscreenElement) {
        document.exitFullscreen?.().catch(() => {});
      } else {
        if (inner.requestFullscreen) {
          inner.requestFullscreen().catch(() => {});
        } else if (inner.webkitRequestFullscreen) {
          inner.webkitRequestFullscreen();
        } else if (video.webkitEnterFullscreen) {
          video.webkitEnterFullscreen();
        }
      }
    });

    const onFsChange = () => {
      const isFs = document.fullscreenElement === inner;
      fullscreenBtn.setAttribute("aria-label", isFs ? "Exit full screen" : "Full screen");
      fullscreenBtn.replaceChildren(parseSvgNode(isFs ? VIDEO_ICONS.fullscreenExit : VIDEO_ICONS.fullscreen));
    };
    document.addEventListener("fullscreenchange", onFsChange);

    inner.addEventListener("click", (e) => {
      if (e.target.closest(".video-hud") || e.target.closest(".video-center-btn")) return;
      togglePlay();
    });

    article.addEventListener("keydown", (e) => {
      if (e.target.tagName === "BUTTON") return;
      if (e.key === " " || e.key === "k") {
        e.preventDefault();
        togglePlay();
      } else if (e.key === "m") {
        e.preventDefault();
        video.muted = !video.muted;
        updateMuteUI();
      } else if (e.key === "f") {
        e.preventDefault();
        fullscreenBtn.click();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        ensureSrc();
        video.currentTime = Math.max(0, video.currentTime - 5);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        ensureSrc();
        video.currentTime = Math.min(video.duration || Infinity, video.currentTime + 5);
      }
    });

    inner.append(video, centerBtn, hud);
  } else {
    const img = document.createElement("img");
    img.className = "floating-card-img";
    img.alt = `${projectTitle} photo ${idx + 1}`;
    img.width = item.width || 540;
    img.height = item.height || 540;
    img.decoding = "async";
    if (idx >= 4) {
      img.loading = "lazy";
    }
    img.src = item.thumb || item.src;
    inner.appendChild(img);

    const openFull = () => {
      openLightbox(item.src || item.thumb, `${projectTitle} photo ${idx + 1}`);
    };
    article.addEventListener("click", openFull);
    article.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openFull();
      }
    });
  }

  article.appendChild(inner);
  return article;
}

function openProjectDialog(project) {
  advanceTutorial("photo");
  if (!projectDialog || !projectDialogGrid) return;

  if (projectDialog.hasAttribute("data-closing")) {
    projectDialog.removeAttribute("data-closing");
  }

  cleanupProjectDialogMedia();

  projectDialogTitle.textContent = project.title || "";
  projectDialogDesc.textContent = project.description || "";

  const frag = document.createDocumentFragment();
  (project.items || []).forEach((item, idx) => {
    frag.appendChild(createExpandedMediaCard(item, idx, project.title));
  });
  projectDialogGrid.replaceChildren(frag);

  if (!projectDialog.open) {
    projectDialog.showModal();
  }
  projectDialog.scrollTop = 0;

  setupLazyVideosInDialog(projectDialogGrid);
}

function createProjectPileElement(project, index) {
  const article = document.createElement("article");
  article.className = "floating-card is-project-pile";
  article.tabIndex = 0;
  article.setAttribute("role", "button");
  article.setAttribute("aria-haspopup", "dialog");
  article.setAttribute("aria-label", `Expand ${project.title} project`);

  const hoverAngle = getHoverAngle(project.angle);
  const floatDuration = (6.2 + (index % 4) * 0.85).toFixed(2);
  const floatDelay = ((index * 0.45) % 2.5).toFixed(2);

  article.style.setProperty("--base-angle", `${project.angle}deg`);
  article.style.setProperty("--hover-angle", `${hoverAngle}deg`);
  article.style.setProperty("--offset-y", `${project.offsetY || 0}px`);
  article.style.setProperty("--base-z", `${project.zIndex || 1}`);
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

  const stack = document.createElement("div");
  stack.className = "pile-stack";

  const items = project.items || [];
  const backingItems = items.slice(1, 4);

  for (let i = backingItems.length - 1; i >= 0; i--) {
    const backItem = backingItems[i];
    const backCard = document.createElement("div");
    backCard.className = `pile-card-back pile-card-back-${i + 1}`;
    backCard.setAttribute("aria-hidden", "true");

    const backImg = document.createElement("img");
    backImg.className = "floating-card-img";
    backImg.src = backItem.thumb || backItem.src;
    backImg.alt = "";
    backImg.width = backItem.width || 400;
    backImg.height = backItem.height || 400;
    backImg.decoding = "async";
    backImg.fetchPriority = "low";

    backCard.appendChild(backImg);
    stack.appendChild(backCard);
  }

  const topItem = items[0];
  const topCard = document.createElement("div");
  topCard.className = "pile-card-top";

  if (topItem) {
    const topImg = document.createElement("img");
    topImg.className = "floating-card-img";
    topImg.src = topItem.thumb || topItem.src;
    topImg.alt = project.title || "";
    topImg.width = topItem.width || 540;
    topImg.height = topItem.height || 540;
    topImg.decoding = "async";
    if (index < 2) {
      topImg.fetchPriority = "high";
    } else if (index >= 5) {
      topImg.loading = "lazy";
    }
    topCard.appendChild(topImg);
  }

  stack.appendChild(topCard);
  article.appendChild(stack);

  const titleEl = document.createElement("h3");
  titleEl.className = "project-pile-title";
  titleEl.textContent = project.title;
  article.appendChild(titleEl);

  article.addEventListener("click", () => {
    openProjectDialog(project);
  });
  article.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openProjectDialog(project);
    }
  });

  return article;
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

function preloadHighResPhotos() {
  const photoSection = portfolioData.photography;
  if (!photoSection) return;
  const allCards = [...(photoSection.topCards || []), ...(photoSection.bottomCards || [])];
  allCards.forEach((card, idx) => {
    if (card.img && card.img.endsWith(".JPG")) {
      setTimeout(() => {
        const fullImg = new Image();
        fullImg.decoding = "async";
        fullImg.src = card.img;
        if (fullImg.decode) {
          fullImg.decode().catch(() => {});
        }
        preloadedHighRes.push(fullImg);
      }, 60 + idx * 70);
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
    if (fullImg.complete) {
      swapIn();
    } else if (fullImg.decode) {
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
  if (card.type === "project") {
    return createProjectPileElement(card, index);
  }

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
      sendYouTubeCommand(iframe, "setVolume", [100]);
      sendYouTubeCommand(iframe, "playVideo");
      return target;
    });

    article.addEventListener("mouseenter", () => {
      sendYouTubeCommand(iframe, "playVideo");
    });

    article.addEventListener("focusin", () => {
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
    if (index < 2) {
      img.fetchPriority = "high";
    } else if (index >= 6) {
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
  (sectionData.floatingTexts || []).forEach((item) => {
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
  if (!element || !element.open) return;
  if (!supportsTopLayerExit()) {
    element.setAttribute("data-closing", "");
    const animations = element.getAnimations().filter((a) => {
      const iter = a.effect?.getTiming?.()?.iterations;
      return iter !== Infinity;
    });
    if (animations.length > 0) {
      await Promise.race([
        Promise.allSettled(animations.map((a) => a.finished)),
        new Promise((r) => setTimeout(r, 320))
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
  if (profileDialog.hasAttribute("data-closing")) {
    profileDialog.removeAttribute("data-closing");
  }
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

if (projectDialog && projectCloseBtn) {
  projectCloseBtn.addEventListener("click", () => {
    closeTopLayer(projectDialog);
  });

  projectDialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeTopLayer(projectDialog);
  });

  projectDialog.addEventListener("close", () => {
    cleanupProjectDialogMedia();
  });
}

if (lightboxDialog) {
  if (lightboxCloseBtn) {
    lightboxCloseBtn.addEventListener("click", () => {
      lightboxDialog.close();
    });
  }

  lightboxDialog.addEventListener("close", () => {
    currentLightboxSrc = null;
    if (lightboxImg) {
      lightboxImg.classList.remove("is-loaded");
      lightboxImg.removeAttribute("src");
    }
  });

  lightboxDialog.addEventListener("click", (event) => {
    if (event.target === lightboxDialog) {
      lightboxDialog.close();
    }
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
attachDialogBackdropFallback(projectDialog, true);
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
preloadHighResPhotos();
