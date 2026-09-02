Minion Moon Heist

Open `index.html` in a browser (or run a simple HTTP server) and click "Send Swarm" to launch a swarm of floating minions.

Quick local server:

```bash
python3 -m http.server 8000
# then open http://localhost:8000 in your browser
```

Files:
- index.html — demo page
- styles.css — visual styles and keyframes
- script.js — spawn logic

Notes:
- This demo uses simple DOM elements and CSS/RAF-based animation for a lightweight effect.
- Feel free to tweak `count`, durations, and styles to suit your taste.