# Dog Overlay

A transparent, click-through desktop overlay for macOS. Every 5–10 minutes,
a random dog wanders across your screen, pauses near the camera notch to
"sniff" it, then walks off.

It doesn't generate anything itself — it randomly plays video/gif files you
drop into a folder, so you can swap in better assets any time.

## 1. Install dependencies

You need [Node.js](https://nodejs.org) installed. Then, in this folder:

```bash
npm install
```

## 2. Add dog assets (optional)

Put files here:

```
assets/dogs/<breed-name>/<file>.webm   (or .mp4, .mov, .gif)
```

Example:

```
assets/dogs/golden-retriever/walk-and-sniff.webm
assets/dogs/dachshund/clip1.webm
assets/dogs/dachshund/clip2.gif
```

- You can have as many breed folders and clips as you want — one is picked
  at random each time a dog appears.
- **For real transparency, use WebM (VP9 with alpha channel)** — most video
  editors and ffmpeg can export this. Animated GIF also works but only
  supports hard-edged transparency (no soft/anti-aliased edges).
- Each clip should already loop cleanly (the app plays it on loop for the
  full walk-in → sniff → walk-out sequence), ideally showing the dog
  walking/idling so the motion looks natural while it's animated across
  the screen.
- `assets/dogs/example-breed/` is just a placeholder folder — replace its
  contents with a real clip, or delete it.

## 3. Run it

```bash
npm start
```

The overlay is transparent and click-through — you'll keep working normally
underneath it. A small 🐶 appears in your macOS menu bar.

## 4. Quit

Either:
- Click the 🐶 in the menu bar → **Quit Dog Overlay**, or
- Press **Cmd+Shift+Q**

## Tuning behavior

Open `renderer.js` — the constants at the top control timing:

```js
const MIN_INTERVAL_MS = 5 * 60 * 1000;   // how often dogs appear (min)
const MAX_INTERVAL_MS = 10 * 60 * 1000;  // how often dogs appear (max)
const WALK_IN_MS = 6000;                 // walk-in speed
const WALK_OUT_MS = 6000;                // walk-out speed
const MIN_SNIFF_MS = 3000;               // how long it sniffs (min)
const MAX_SNIFF_MS = 6000;               // how long it sniffs (max)
const NOTCH_Y_RANGE = [10, 60];          // vertical position near the camera
```

If you'd like to create an actual app:
```bash
npm run dist
```

Then open the .dmg within the dist folder.
