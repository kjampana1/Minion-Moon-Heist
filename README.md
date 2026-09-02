Minion Moon Heist!

A small HTML/CSS/JS effect that sends a swarm of minions swarming the moon and planting a victory flag.

Quick run

1. Open a terminal in the project root and start a simple HTTP server:

```bash
python3 -m http.server 8000
```

2. Open your browser to http://localhost:8000

Controls

- Use the Send Swarm button in the UI to spawn minions.
- Adjust Minion Count to change the swarm size.
- The demo auto-spawns on load by default.

Files of interest

- [index.html](index.html) — main page and UI.
- [styles.css](styles.css) — all visual styling (moon, stars, flag, minions).
- [script.js](script.js) — spawning, steering, flag-carrying and planting logic.

Notes & troubleshooting

- If stars appear above the moon or flag, ensure `styles.css` sets `.stars { z-index: 0 }` and `.moon { z-index: 20 }`.
- The planted flag persists until you click Send Swarm to reset.
