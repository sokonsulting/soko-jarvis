const form = document.getElementById("chat-form");
const input = document.getElementById("message");
const messages = document.getElementById("messages");
const mic = document.getElementById("mic");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = input.value.trim();
  if (!value) return;

  const bubble = document.createElement("div");
  bubble.className = "message user";
  bubble.textContent = value;
  messages.appendChild(bubble);

  const notice = document.createElement("div");
  notice.className = "message";
  notice.textContent = "SOKO JARVIS 0.4 : interface en développement.";
  messages.appendChild(notice);

  input.value = "";
  messages.scrollTop = messages.scrollHeight;
});

mic.addEventListener("click", () => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("La reconnaissance vocale n'est pas disponible.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "fr-FR";
  recognition.onresult = (event) => {
    input.value = event.results[0][0].transcript;
    input.focus();
  };
  recognition.onerror = () =>
    alert("Microphone indisponible ou autorisation refusée.");

  recognition.start();
});

/* SOKO JARVIS 0.4 - moteur de particules */
(() => {
  const canvas = document.getElementById("avatar-canvas");
  const source = document.getElementById("avatar-source");
  if (!canvas || !source) return;

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  const sample = document.createElement("canvas");
  const sw = 300;
  const sh = 375;
  sample.width = sw;
  sample.height = sh;

  const sctx = sample.getContext("2d", {
    willReadFrequently: true
  });

  const reducedMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let particles = [];
  let width = 0;
  let height = 0;
  let frame = 0;
  let lastBlink = 0;
  let blinkStart = 0;

  function buildParticles() {
    sctx.clearRect(0, 0, sw, sh);

    const sx = source.naturalWidth * 0.15;
    const sy = source.naturalHeight * 0.025;
    const cropW = source.naturalWidth * 0.70;
    const cropH = source.naturalHeight * 0.80;

    sctx.drawImage(source, sx, sy, cropW, cropH, 0, 0, sw, sh);

    const pixels = sctx.getImageData(0, 0, sw, sh).data;
    particles = [];

    for (let y = 2; y < sh - 2; y += 2) {
      for (let x = 2; x < sw - 2; x += 2) {
        const i = (y * sw + x) * 4;
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const brightness = (r + g + b) / 3;

        const cyan =
          g > r * 1.12 &&
          b > r * 1.22 &&
          g > 48 &&
          b > 70;

        if (!cyan || brightness < 48) continue;

        particles.push({
          x,
          y,
          phase: Math.random() * Math.PI * 2,
          speed: 0.5 + Math.random() * 1.2,
          radius: 0.45 + Math.random() * 0.75,
          intensity: 0.55 + Math.random() * 0.45,
          drift: 0.2 + Math.random() * 0.45
        });
      }
    }

    console.log(
      "SOKO JARVIS 0.4 : " + particles.length + " particules chargées"
    );
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    width = rect.width;
    height = rect.height;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function blink(time) {
    if (reducedMotion) return 0;

    if (!lastBlink) lastBlink = time;

    if (!blinkStart && time - lastBlink > 3800 + Math.random() * 2200) {
      blinkStart = time;
      lastBlink = time;
    }

    if (!blinkStart) return 0;

    const progress = (time - blinkStart) / 170;

    if (progress >= 1) {
      blinkStart = 0;
      return 0;
    }

    return Math.sin(progress * Math.PI);
  }

  function draw(time) {
    ctx.clearRect(0, 0, width, height);

    const t = time * 0.001;
    const scale = Math.min(width / sw, height / sh) * 0.96;
    const ox = (width - sw * scale) / 2;
    const oy = (height - sh * scale) / 2;

    ctx.globalCompositeOperation = "lighter";

    for (const p of particles) {
      const shimmer =
        0.78 + 0.22 * Math.sin(t * p.speed + p.phase);

      const movement = reducedMotion
        ? 0
        : Math.sin(t * 0.8 + p.phase) * p.drift;

      const x = ox + p.x * scale + movement;
      const y =
        oy +
        p.y * scale +
        (reducedMotion
          ? 0
          : Math.cos(t * 0.6 + p.phase) * p.drift);

      const alpha = shimmer * p.intensity;

      ctx.beginPath();
      ctx.fillStyle = `rgba(70,215,255,${alpha})`;
      ctx.shadowColor = "rgba(35,180,255,0.8)";
      ctx.shadowBlur = 2;
      ctx.arc(x, y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalCompositeOperation = "source-over";
    ctx.shadowBlur = 0;

    /* Léger éclat lumineux pendant le clignement */
    const blinkAmount = blink(time);

    if (blinkAmount > 0) {
      ctx.save();
      ctx.globalAlpha = blinkAmount * 0.18;
      ctx.fillStyle = "#36cfff";

      const eyeY = oy + 178 * scale;

      ctx.beginPath();
      ctx.ellipse(
        ox + 101 * scale,
        eyeY,
        27 * scale,
        5 * scale,
        0,
        0,
        Math.PI * 2
      );
      ctx.ellipse(
        ox + 195 * scale,
        eyeY,
        27 * scale,
        5 * scale,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.restore();
    }

    if (!reducedMotion) {
      frame = requestAnimationFrame(draw);
    }
  }

  function start() {
    resize();
    buildParticles();
    cancelAnimationFrame(frame);

    if (reducedMotion) {
      draw(0);
    } else {
      frame = requestAnimationFrame(draw);
    }
  }

  source.onload = start;

  if (source.complete && source.naturalWidth) {
    start();
  }

  window.addEventListener("resize", resize);

  console.log("SOKO JARVIS 0.4 : moteur graphique initialisé");
})();
