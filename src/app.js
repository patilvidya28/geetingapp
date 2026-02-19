/**
 * Initialize the greeting app: wire up events and animation logic.
 * Exported for tests; in the browser we call this on DOMContentLoaded.
 */
function initApp(doc) {
  const nameInput = doc.getElementById("name-input");
  const greetButton = doc.getElementById("greet-button");
  const greetingOutput = doc.getElementById("greeting-output");
  const animationLayer = doc.getElementById("animation-layer");

  if (!nameInput || !greetButton || !greetingOutput || !animationLayer) {
    return;
  }

  function setGreeting() {
    const raw = nameInput.value || "";
    const trimmed = raw.trim();
    const message = trimmed ? `Hello, ${trimmed}!` : "Hello!";

    greetingOutput.textContent = message;

    greetingOutput.classList.remove("faded-in");
    // Force reflow to restart the animation class
    // eslint-disable-next-line no-unused-expressions
    greetingOutput.offsetHeight;
    greetingOutput.classList.add("faded-in");
  }

  function clearAnimations() {
    while (animationLayer.firstChild) {
      animationLayer.removeChild(animationLayer.firstChild);
    }
  }

  function triggerConfetti() {
    clearAnimations();
    const pieceCount = 70;
    const viewportWidth = window.innerWidth || 800;
    for (let i = 0; i < pieceCount; i += 1) {
      const piece = document.createElement("div");
      piece.className = "confetti-piece";
      const x = Math.random() * viewportWidth;
      piece.style.left = `${x}px`;
      piece.style.top = "-24px";
      const colors = ["#fb7185", "#facc15", "#4ade80", "#38bdf8", "#a855f7"];
      piece.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      piece.style.setProperty(
        "--drift-x",
        `${(Math.random() - 0.5) * 200}px`
      );
      piece.style.setProperty(
        "--spin",
        `${Math.random() > 0.5 ? "" : "-"}${180 + Math.random() * 180}deg`
      );
      piece.addEventListener(
        "animationend",
        () => {
          if (piece.parentElement) {
            piece.parentElement.removeChild(piece);
          }
        },
        { once: true }
      );
      animationLayer.appendChild(piece);
    }
  }

  function triggerPartyPopper() {
    clearAnimations();
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.left = "50%";
    container.style.top = "50%";
    container.style.width = "0";
    container.style.height = "0";
    container.style.pointerEvents = "none";

    const particleCount = 30;
    const maxRadius = 160;
    for (let i = 0; i < particleCount; i += 1) {
      const particle = document.createElement("div");
      particle.className = "burst-particle";
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = maxRadius * (0.4 + Math.random() * 0.6);
      const dx = Math.cos(angle) * radius;
      const dy = Math.sin(angle) * radius;
      particle.style.setProperty("--dx", `${dx}px`);
      particle.style.setProperty("--dy", `${dy}px`);
      particle.addEventListener(
        "animationend",
        () => {
          if (particle.parentElement) {
            particle.parentElement.removeChild(particle);
          }
        },
        { once: true }
      );
      container.appendChild(particle);
    }

    container.addEventListener(
      "animationend",
      () => {
        if (container.parentElement && container.childElementCount === 0) {
          container.parentElement.removeChild(container);
        }
      },
      { once: true }
    );

    animationLayer.appendChild(container);
  }

  function triggerGlowBurst() {
    clearAnimations();
    const ring = document.createElement("div");
    ring.className = "glow-ring";
    const orb = document.createElement("div");
    orb.className = "glow-orb";

    const cleanup = (node) => {
      if (node.parentElement) {
        node.parentElement.removeChild(node);
      }
    };

    ring.addEventListener("animationend", () => cleanup(ring), { once: true });
    orb.addEventListener("animationend", () => cleanup(orb), { once: true });

    animationLayer.appendChild(ring);
    animationLayer.appendChild(orb);
  }

  const animationFns = [triggerConfetti, triggerPartyPopper, triggerGlowBurst];

  function triggerRandomAnimation() {
    clearAnimations();
    const index = Math.floor(Math.random() * animationFns.length);
    animationFns[index]();
  }

  function handleGreetClick(event) {
    event.preventDefault();
    setGreeting();
    triggerRandomAnimation();
  }

  greetButton.addEventListener("click", handleGreetClick);

  nameInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      handleGreetClick(event);
    }
  });

  return {
    setGreeting,
    triggerRandomAnimation,
    _clearAnimations: clearAnimations,
  };
}

if (typeof window !== "undefined") {
  window.addEventListener("DOMContentLoaded", () => {
    initApp(document);
  });
}

module.exports = {
  initApp,
};
