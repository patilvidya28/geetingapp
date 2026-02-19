/**
 * Tests for the Modern Greeting App.
 */
const domTestingLib = require("@testing-library/dom");
const { fireEvent, getByLabelText, getByText } = domTestingLib;
const { initApp } = require("../src/app");

function renderApp() {
  document.body.innerHTML = `
    <div id="app-root">
      <div class="card">
        <h1 class="title">Modern Greeting</h1>
        <label for="name-input" class="label">Enter Your Name</label>
        <input
          id="name-input"
          class="text-input"
          type="text"
          placeholder="Type your name here"
        />
        <button id="greet-button" class="primary-button">Greet</button>
        <div id="greeting-output" class="greeting-output" aria-live="polite"></div>
      </div>
    </div>
    <div id="animation-layer" class="animation-layer"></div>
  `;

  const api = initApp(document);
  const root = document.getElementById("app-root");
  const animationLayer = document.getElementById("animation-layer");
  return { root, animationLayer, api };
}

describe("Modern Greeting App UI", () => {
  test("renders label, input, and button with correct text", () => {
    const { root } = renderApp();

    const label = getByLabelText(root, "Enter Your Name");
    expect(label).toBeInTheDocument();

    const input = root.querySelector("#name-input");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("placeholder", "Type your name here");

    const button = getByText(root, "Greet");
    expect(button).toBeInTheDocument();
  });

  test("displays greeting with entered name when Greet button is clicked", () => {
    const { root } = renderApp();
    const input = root.querySelector("#name-input");
    const button = getByText(root, "Greet");

    input.value = "Alex";
    fireEvent.click(button);

    const output = root.querySelector("#greeting-output");
    expect(output).toHaveTextContent("Hello, Alex!");
  });

  test("displays generic greeting when no name is entered", () => {
    const { root } = renderApp();
    const button = getByText(root, "Greet");

    fireEvent.click(button);

    const output = root.querySelector("#greeting-output");
    expect(output).toHaveTextContent("Hello!");
  });
});

describe("Animation behavior", () => {
  test("clicking Greet triggers exactly one type of animation at a time", () => {
    const { root, animationLayer } = renderApp();
    const button = getByText(root, "Greet");

    fireEvent.click(button);

    const confettiPieces = animationLayer.querySelectorAll(".confetti-piece").length;
    const burstParticles = animationLayer.querySelectorAll(".burst-particle").length;
    const glowRings = animationLayer.querySelectorAll(".glow-ring").length;
    const glowOrbs = animationLayer.querySelectorAll(".glow-orb").length;

    const hasConfetti = confettiPieces > 0;
    const hasBurst = burstParticles > 0;
    const hasGlow = glowRings > 0 || glowOrbs > 0;
    const activeTypes = [hasConfetti, hasBurst, hasGlow].filter(Boolean).length;

    expect(activeTypes).toBe(1);
  });

  test("animations do not accumulate between clicks (layer cleared)", () => {
    const { root, animationLayer } = renderApp();
    const button = getByText(root, "Greet");

    fireEvent.click(button);
    const firstChildCount = animationLayer.childElementCount;
    expect(firstChildCount).toBeGreaterThan(0);

    fireEvent.click(button);
    const secondChildCount = animationLayer.childElementCount;
    expect(secondChildCount).toBeGreaterThan(0);
  });

  test("pressing Enter inside input triggers greeting and animation", () => {
    const { root, animationLayer } = renderApp();
    const input = root.querySelector("#name-input");

    input.value = "Taylor";
    fireEvent.keyDown(input, { key: "Enter", code: "Enter", charCode: 13 });

    const output = root.querySelector("#greeting-output");
    expect(output).toHaveTextContent("Hello, Taylor!");
    expect(animationLayer.childElementCount).toBeGreaterThan(0);
  });
});

