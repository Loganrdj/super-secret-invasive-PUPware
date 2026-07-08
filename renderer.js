const fs = require('fs');
const path = require('path');

const ASSET_DIR = path.join(__dirname, 'assets', 'dogs');
const VIDEO_EXT = ['.webm', '.mp4', '.mov'];
const IMAGE_EXT = ['.gif'];

// --- Config: tweak timings/positioning here ---
const MIN_INTERVAL_MS = 10 * 60 * 1000;   // 10 min
const MAX_INTERVAL_MS = 30 * 60 * 1000;  // 30 min
const MIN_SNIFF_MS = 1000;
const MAX_SNIFF_MS = 10000;

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function getDogAssets() {
  const assets = [];
  if (!fs.existsSync(ASSET_DIR)) return assets;

  const breeds = fs
    .readdirSync(ASSET_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  for (const breed of breeds) {
    const breedDir = path.join(ASSET_DIR, breed);
    const files = fs.readdirSync(breedDir).filter((f) => {
      const ext = path.extname(f).toLowerCase();
      return VIDEO_EXT.includes(ext) || IMAGE_EXT.includes(ext);
    });
    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      assets.push({
        breed,
        file: path.join(breedDir, file),
        type: VIDEO_EXT.includes(ext) ? 'video' : 'image',
      });
    }
  }
  return assets;
}

function createDogElement(asset) {
  let el;
  if (asset.type === 'video') {
    el = document.createElement('video');
    el.src = asset.file;
    el.autoplay = true;
    el.loop = false;
    el.muted = true;
    el.playsInline = true;
  } else {
    el = document.createElement('img');
    el.src = asset.file;
  }
  el.className = 'dog';
  return el;
}

function scheduleNextAppearance() {
  const delay = randomBetween(MIN_INTERVAL_MS, MAX_INTERVAL_MS);
  setTimeout(runDogSequence, delay);
}

function runDogSequence() {
  const assets = getDogAssets();

  if (assets.length === 0) {
    console.warn(
      `No dog assets found. Add a .webm/.mp4/.gif into a breed folder under: ${ASSET_DIR}`
    );
    scheduleNextAppearance();
    return;
  }

  const asset = assets[Math.floor(Math.random() * assets.length)];
  const stage = document.getElementById('stage');
  const dogEl = createDogElement(asset);

  dogEl.className = 'dog';
  stage.appendChild(dogEl);

  if (asset.type === 'video') {
    dogEl.addEventListener('ended', () => {
        dogEl.remove();
        scheduleNextAppearance();
    });
  } else {
      // GIFs/images still use a timer
      const displayMs = randomBetween(MIN_SNIFF_MS, MAX_SNIFF_MS);

      setTimeout(() => {
          dogEl.remove();
          scheduleNextAppearance();
      }, displayMs);
  }
}

scheduleNextAppearance();
