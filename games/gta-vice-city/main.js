import { initSaveManagerModal } from "./save-manager.js";

// Self-hosted static build for schplay.com.
// The 129 MB core package + 7.6 MB wasm are committed under ./vcbr/ (the .data
// file is split into <50 MB parts + a manifest — see game.js loadData()).
// Runtime-streamed assets come from the js-dos CDN. No download prompt, no OPFS,
// no service worker, no cross-origin-isolation headers (this wasm build is
// single-threaded, so SharedArrayBuffer is not required).

const BASE = "./";

const LEGACY_SCRIPT_SOURCES = [
  `${BASE}GamepadEmulator.js`,
  `${BASE}jsdos-cloud-sdk.js`,
  `${BASE}idbfs.js`,
  `${BASE}game.js`,
];

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existingScript = document.querySelector(`script[src="${src}"]`);
    if (existingScript) {
      if (existingScript.dataset.loaded === "true") {
        resolve();
        return;
      }
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener(
        "error",
        () => reject(new Error(`Failed to load script: ${src}`)),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = false;
    script.addEventListener(
      "load",
      () => {
        script.dataset.loaded = "true";
        resolve();
      },
      { once: true },
    );
    script.addEventListener(
      "error",
      () => reject(new Error(`Failed to load script: ${src}`)),
      { once: true },
    );
    document.body.appendChild(script);
  });
}

async function loadLegacyScripts() {
  for (const src of LEGACY_SCRIPT_SOURCES) {
    try {
      await loadScript(src);
    } catch (err) {
      // jsdos-cloud-sdk is optional; the others are needed but a load error
      // here should still let the rest of the chain attempt to run.
      console.error(err);
    }
  }
}

// Bundled mode: the game files are already served from ./vcbr/, so there is
// nothing to install. Just enable the PLAY button and hide the setup UI.
function initSetupFlow() {
  const clickToPlayButton = document.getElementById("click-to-play-button");
  if (!clickToPlayButton) {
    return;
  }

  window.__gtaGameReady = true;
  clickToPlayButton.disabled = false;
  clickToPlayButton.classList.remove("disabled");
  clickToPlayButton.dataset.installMode = "";

  const storageStatus = document.getElementById("storage-status");
  if (storageStatus) {
    storageStatus.textContent = "Ready to play";
    storageStatus.dataset.state = "ready";
    storageStatus.classList.add("hidden");
  }

  const setupOverlay = document.getElementById("setup-overlay");
  if (setupOverlay) {
    const err = document.getElementById("setup-error");
    if (err) err.classList.add("hidden");
  }

  const progress = document.getElementById("setup-progress");
  if (progress) {
    progress.classList.add("hidden");
  }

  const resetBtn = document.getElementById("reset-game-btn");
  if (resetBtn) {
    resetBtn.classList.add("hidden");
  }
}

function initCanvasBindings() {
  const canvas = document.getElementById("canvas");
  if (!canvas) {
    return;
  }
  canvas.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });
}

function checkBrowserCompatibility() {
  const missing = [];
  if (typeof WebAssembly === "undefined") missing.push("WebAssembly");
  if (typeof Worker === "undefined") missing.push("Web Workers");
  return missing;
}

function initOrientationLock() {
  const observer = new MutationObserver(() => {
    if (document.body.classList.contains("gameIsStarted")) {
      observer.disconnect();
      screen.orientation?.lock("landscape").catch(() => {});
    }
  });
  observer.observe(document.body, { attributeFilter: ["class"] });
}

async function boot() {
  initCanvasBindings();
  initOrientationLock();

  const missing = checkBrowserCompatibility();
  if (missing.length > 0) {
    const storageStatus = document.getElementById("storage-status");
    const errorBox = document.getElementById("setup-error");
    if (storageStatus) {
      storageStatus.textContent = "Browser not supported";
      storageStatus.dataset.state = "error";
      storageStatus.classList.remove("hidden");
    }
    if (errorBox) {
      errorBox.classList.remove("hidden");
      errorBox.textContent = `Your browser is missing required features: ${missing.join(", ")}. Please use Chrome 110+, Firefox 111+, or Safari 16.4+.`;
    }
    return;
  }

  initSaveManagerModal();
  initSetupFlow();
  await loadLegacyScripts();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    void boot();
  });
} else {
  void boot();
}
