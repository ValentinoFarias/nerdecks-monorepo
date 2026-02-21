// Simple custom scramble effect without external plugins
document.addEventListener("DOMContentLoaded", () => {
  const scrambleElements = document.querySelectorAll(".scramble-text");

  const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  scrambleElements.forEach((el) => {
    const originalText = el.textContent;
    let intervalId = null;

    el.addEventListener("mouseenter", () => {
      if (intervalId) return;

      const duration = 600; // total duration in ms
      const frame = 30; // ms per frame
      const steps = Math.floor(duration / frame);
      let step = 0;

      intervalId = setInterval(() => {
        const revealCount = Math.floor((step / steps) * originalText.length);
        let nextText = "";

        for (let i = 0; i < originalText.length; i++) {
          const char = originalText[i];
          if (char === " ") {
            nextText += " ";
            continue;
          }
          if (i < revealCount) {
            nextText += char;
          } else {
            nextText += CHARS[Math.floor(Math.random() * CHARS.length)];
          }
        }

        el.textContent = nextText;
        step++;

        if (step > steps) {
          clearInterval(intervalId);
          intervalId = null;
          el.textContent = originalText;
        }
      }, frame);
    });

    el.addEventListener("mouseleave", () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      el.textContent = originalText;
    });
  });
});
