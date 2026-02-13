gsap.registerPlugin(ScrollTrigger);

// Fade from LEFT
gsap.utils.toArray(".fade-left").forEach((element) => {
  gsap.from(element, {
    x: -80,
    opacity: 0,
    duration: 1.4,
    ease: "power2.out",
    scrollTrigger: {
      trigger: element,
      start: "top 50%",
      toggleActions: "play none none none",
    },
  });
});

// Fade from RIGHT
gsap.utils.toArray(".fade-right").forEach((element) => {
  gsap.from(element, {
    x: 80,
    opacity: 0,
    duration: 1.4,
    ease: "power2.out",
    scrollTrigger: {
      trigger: element,
      start: "top 50%",
      toggleActions: "play none none none",
    },
  });
});

// Fade DOWN (from top)
gsap.utils.toArray(".fade-down").forEach((element) => {
  gsap.from(element, {
    y: -80,
    opacity: 0,
    duration: 1.4,
    ease: "power2.out",
    scrollTrigger: {
      trigger: element,
      start: "top 50%",
      toggleActions: "play none none none",
    },
  });
});