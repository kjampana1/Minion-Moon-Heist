const stage = document.getElementById('stage');
const spawnBtn = document.getElementById('spawnBtn');
const countInput = document.getElementById('count');
let flagPlanted = false;
let flagCarrierAssigned = false;

function spawnSwarm(n = 30){
  const frag = document.createDocumentFragment();
  const vw = Math.max(window.innerWidth, 320);
  const moon = document.querySelector('.moon');
  const moonRect = moon ? moon.getBoundingClientRect() : null;

  for(let i=0;i<n;i++){
    const wrap = document.createElement('div');
    wrap.className = 'minion-wrap';

    const min = document.createElement('div');
    min.className = 'minion';

    // add glow element
    const glow = document.createElement('div');
    glow.className = 'glow';
    min.appendChild(glow);

    // carried flag for the first minion
    let carriedFlag = null;
    const isPlanter = (i === 0) && !flagPlanted && !flagCarrierAssigned;
    if(isPlanter){
      carriedFlag = document.createElement('div');
      carriedFlag.className = 'carried-flag';
      carriedFlag.innerHTML = '<div class="triangle"><span class="label">Poopaye, Earth!</span></div><div class="pole"></div>';
      min.appendChild(carriedFlag);
      flagCarrierAssigned = true;
    }

    wrap.appendChild(min);

    // random vertical start (0-100%) for the wrapper
    const topPct = 8 + Math.random() * 84; // keep away from very edges
    wrap.style.top = topPct + '%';

    // random slight scale
    const s = (Math.random()*0.6) + 0.7;
    min.dataset.scale = s.toFixed(2);

    // random base rotation
    const baseR = (Math.random()*40) - 20;
    min.dataset.baseR = baseR;

    // horizontal travel duration and delay
    const dur = (Math.random()*8) + 6; // 6-14s
    const delay = Math.random()*0.6;
    wrap.style.animation = `across ${dur}s linear ${delay}s forwards`;

    // bob amplitude (reduced intensity)
    const bobAmp = (Math.random()*8) + 4; // 4 - 12px
    min.dataset.bob = bobAmp;

    // path vertical offset used by CSS across keyframe
    const pathY = (Math.random()*40 - 20) + 'px';
    wrap.style.setProperty('--y', pathY);

    // expose scale and base rotation to the wrapper for CSS across
    wrap.style.setProperty('--s', s);
    wrap.style.setProperty('--r', baseR + 'deg');

    // behavior flags
    const willCircle = Math.random() < 0.28; // 28% will do a clumsy circular wobble
    const willRotateInSpace = Math.random() < 0.22; // some rotate freely
    min.dataset.circle = willCircle ? '1' : '0';
    min.dataset.spaceRotate = willRotateInSpace ? '1' : '0';

    // initial offsets and circular motion state
    let offsetX = 0, offsetY = 0, angle = 0;
    const angVel = willRotateInSpace ? (Math.random()*120 - 60) : 0; // deg/s (slower)
    const circleRadius = willCircle ? (4 + Math.random()*12) : 0; // smaller wobble radius
    const circleSpeed = willCircle ? ((Math.random()*1.2 + 0.6) * (Math.random() < 0.5 ? 1 : -1)) : 0; // slower rad/s
    let circlePhase = Math.random() * Math.PI * 2;

    // stable bob frequency per-minion (avoid changing every frame)
    const bobFreq = 0.5 + Math.random()*0.6;

    const start = performance.now();

    function tick(now){
      if(!wrap.isConnected) return; // cleaned up already
      const t = (now - start)/1000;

      // gentle bobbing (reduced)
      const bobPhase = t * bobFreq;
      const bobY = Math.sin(bobPhase) * bobAmp;

      // compute steering when near moon
      let steerX = 0, steerY = 0;
      if(moonRect){
        const wRect = wrap.getBoundingClientRect();
        const wCx = wRect.left + wRect.width/2;
        const wCy = wRect.top + wRect.height/2;
          const mRectNow = moon.getBoundingClientRect();
          const mCx = mRectNow.left + mRectNow.width/2;
          const mCy = mRectNow.top + mRectNow.height/2;

        const dx = mCx - wCx;
        const dy = mCy - wCy;
        const dist = Math.hypot(dx, dy);

        // start steering when the wrapper passes 35% of viewport width
        if(wRect.left > window.innerWidth * 0.35){
          // normalized small steering force
          const force = Math.min(120 / (dist || 1), 0.9);
          steerX = dx * force * 0.04; // small lateral curve
          steerY = dy * force * 0.03; // pull toward moon vertically
        }

        // planting logic for the first minion: if close enough or overlaps moon, plant the flag
        if(isPlanter && !flagPlanted){
          const plantDist = Math.max(60, Math.min(260, mRectNow.width * 0.26));
          const wrapCenterX = wRect.left + wRect.width/2;
          const moonLeftEdge = mRectNow.left + (mRectNow.width * 0.08);

          // plant when within radial distance OR when the wrapper reaches moon's left area
          if(dist < plantDist || wrapCenterX >= moonLeftEdge){
            flagPlanted = true;
            flagCarrierAssigned = false;
            // show planted flag on moon
            moon.classList.add('flag-planted');

            // remove carried flag visually from minion (if still present)
            if(carriedFlag && carriedFlag.parentElement) carriedFlag.remove();

            // freeze and remove the minion after a small planting animation
            wrap.style.animation = 'none';
            // set absolute position to current location (px)
            const cur = wrap.getBoundingClientRect();
            wrap.style.left = cur.left + 'px';
            wrap.style.top = cur.top + 'px';
            wrap.style.position = 'fixed';
            wrap.style.transition = 'transform 0.6s ease-out, opacity 0.6s ease-out';
            // make the minion 'plant' then fade
            setTimeout(()=>{ wrap.style.transform = 'translateY(-12px) scale(0.9)'; wrap.style.opacity = '0.0'; }, 120);
            setTimeout(()=>{ wrap.remove(); }, 900);
          }
        }
      }

      // circular/clumsy motion that decays over the duration so minion ends up steering toward moon
      let circleX = 0, circleY = 0;
      if(min.dataset.circle === '1'){
        // decay faster so wobble subsides as it approaches
        const decay = Math.max(0, 1 - (t / Math.max(0.6, dur * 0.6)) );
        circlePhase += circleSpeed * (1/60);
        circleX = Math.cos(circlePhase) * circleRadius * decay;
        circleY = Math.sin(circlePhase) * (circleRadius * 0.55) * decay;
      }

      // apply space rotation angular velocity
      if(min.dataset.spaceRotate === '1'){
        angle += angVel * (1/60); // approximate per-frame deg increment
      }

      // smooth offset lerp and include circular offsets
      offsetX += ((steerX + circleX) - offsetX) * 0.06;
      offsetY += ((steerY + bobY + circleY) - offsetY) * 0.08;

      const baseRotate = parseFloat(min.dataset.baseR) || 0;
      const scale = parseFloat(min.dataset.scale) || 1;

      // set inner transform (relative to the wrapper horizontal motion)
      min.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${baseRotate + angle}deg) scale(${scale})`;

      // remove when offscreen to the right
      const rect = wrap.getBoundingClientRect();
      if(rect.left > vw + 120){
        wrap.remove();
        return;
      }

      requestAnimationFrame(tick);
    }

    // cleanup after duration; if the carrier timed out without planting, clear assignment
    setTimeout(()=>{
      if(isPlanter && !flagPlanted){
        flagCarrierAssigned = false;
        if(carriedFlag && carriedFlag.parentElement) carriedFlag.remove();
      }
      wrap.remove();
    }, (dur + delay + 1)*1000);

    frag.appendChild(wrap);
    requestAnimationFrame(tick);
  }

  stage.appendChild(frag);
}

spawnBtn.addEventListener('click', ()=>{
  // reset planted flag and remove any carried flags before spawning a new swarm
  const moon = document.querySelector('.moon');
  if(moon) moon.classList.remove('flag-planted');
  flagPlanted = false;
  document.querySelectorAll('.carried-flag').forEach(el => el.remove());

  const n = Math.max(1, Math.min(200, parseInt(countInput.value) || 30));
  spawnSwarm(n);
});

// keyboard shortcut: press space to send a small swarm
window.addEventListener('keydown', (e)=>{ if(e.code === 'Space'){ e.preventDefault(); spawnSwarm(12); } });

// auto-launch small swarm once on load for demo
// create starfield
function createStars(count = 120){
  const container = document.querySelector('.stars');
  if(!container) return;
  const w = window.innerWidth;
  const h = window.innerHeight;
  for(let i=0;i<count;i++){
    const star = document.createElement('div');
    star.className = 'star';
    const sizeRoll = Math.random();
    if(sizeRoll < 0.65) star.classList.add('small');
    else if(sizeRoll < 0.9) star.classList.add('med');
    else star.classList.add('big');
    if(Math.random() < 0.45) star.classList.add('twinkle');
    const left = Math.random()*100;
    const top = Math.random()*100;
    star.style.left = left + '%';
    star.style.top = top + '%';
    star.style.opacity = (0.6 + Math.random()*0.4).toFixed(2);
    container.appendChild(star);
  }
}

window.addEventListener('load', ()=>{
  createStars(140);
  setTimeout(()=>spawnSwarm(18), 600);
});