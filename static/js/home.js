document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("heroVideo");
  const playButton = document.getElementById("overlayPlayHeroVideo");
  const heroTextTrigger = document.getElementById("heroTextTrigger");

  // When clicking the hero text: hide text, show video, auto-play
  if (heroTextTrigger && video) {
    heroTextTrigger.addEventListener("click", () => {
      heroTextTrigger.classList.add("d-none");
      video.classList.remove("d-none");
      video.play();
      if (playButton) {
        playButton.classList.add("d-none");
      }
    });
  }

  if (!video || !playButton) return;

  playButton.addEventListener("click", () => {
    video.play();
    playButton.classList.add("d-none");
  });

  video.addEventListener("ended", () => {
    playButton.classList.remove("d-none");
  });
});
