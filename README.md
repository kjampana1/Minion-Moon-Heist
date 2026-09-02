**Minion Moon Heist!**

A lightweight screen effect that unleashes a chaotic swarm of Minions across your display to execute Gru’s ultimate dream: storming the cosmos and planting a victory flag straight onto the moon.
<img width="1512" height="823" alt="Screenshot 2026-09-02 at 3 01 12 PM" src="https://github.com/user-attachments/assets/18f36e20-954a-4ae3-90c1-adc58ef65f9f" />

**<u>Quick run**</u>

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
