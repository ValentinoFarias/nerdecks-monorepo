/* jshint esversion: 6 */

document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("heroVideo");
  const heroTextTrigger = document.getElementById("heroTextTrigger");

  // When clicking the hero text: hide text, show video, auto-play
  if (heroTextTrigger && video) {
    heroTextTrigger.addEventListener("click", () => {
      heroTextTrigger.classList.add("d-none");
      video.classList.remove("d-none");
      video.play();
    });
  }

  if (!video) return;

  // Toggle pause/resume by clicking directly on the video.
  video.addEventListener("click", () => {
    if (video.paused) {
      video.play();
      return;
    }
    video.pause();
  });

  video.addEventListener("ended", () => {
    // When the video ends, reset and show the NERDECKS text again
    video.pause();
    video.currentTime = 0;
    video.classList.add("d-none");

    if (heroTextTrigger) {
      heroTextTrigger.classList.remove("d-none");
    }
  });
});
