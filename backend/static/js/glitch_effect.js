document.addEventListener('DOMContentLoaded', function () {
  var imageLogoLink = document.getElementById('landing-logo-image-link');
  var textLogoLink = document.getElementById('landing-logo-text-link');

  function handleLogoClick(event) {
    if (!window.nerdeckTransition || !window.nerdeckTransition.animateTransition) {
      return; // Fallback: allow normal navigation
    }

    event.preventDefault();
    var targetUrl = event.currentTarget.href;

    try {
      if (window.sessionStorage) {
        window.sessionStorage.setItem('runRevealOnNextPage', '1');
      }
    } catch (e) {
      // Ignore sessionStorage errors
    }

    window.nerdeckTransition.animateTransition().then(function () {
      window.location.href = targetUrl;
    });
  }

  if (imageLogoLink) {
    imageLogoLink.addEventListener('click', handleLogoClick);
  }
  if (textLogoLink) {
    textLogoLink.addEventListener('click', handleLogoClick);
  }

  // Glitch hover effect on any element with .glitch-btn
  var glitchButtons = document.querySelectorAll('.glitch-btn');
  glitchButtons.forEach(function (glitchBtn) {
    var slices = glitchBtn.querySelectorAll('.slice');
    if (!slices.length) return;

    var glitchInterval = null;

    function runGlitchBurst() {
      // Short glitch burst
      slices.forEach(function (slice) {
        slice.style.opacity = 0.7;
        slice.style.top = Math.random() * 100 + '%';
        slice.style.transform = 'translateX(' + (Math.random() * 8 - 4) + 'px)';
      });

      // Quickly reset after the burst so it feels like a flicker
      setTimeout(function () {
        slices.forEach(function (slice) {
          slice.style.opacity = 0;
          slice.style.transform = 'translateX(0)';
        });
      }, 120);
    }

    glitchBtn.addEventListener('mouseenter', function () {
      if (glitchInterval) return;

      // Immediate glitch when the user first hovers
      runGlitchBurst();

      glitchInterval = setInterval(function () {
        // Only glitch sometimes, not on every tick
        var shouldGlitchNow = Math.random() < 0.3; // 30% chance

        if (!shouldGlitchNow) {
          // Most of the time, keep slices hidden and still
          slices.forEach(function (slice) {
            slice.style.opacity = 0;
            slice.style.transform = 'translateX(0)';
          });
          return;
        }

        // Occasional glitch burst while hovering
        runGlitchBurst();
      }, 300); // run less often so it feels occasional
    });

    glitchBtn.addEventListener('mouseleave', function () {
      if (glitchInterval) {
        clearInterval(glitchInterval);
        glitchInterval = null;
      }
      slices.forEach(function (slice) {
        slice.style.opacity = 0;
        slice.style.transform = 'translateX(0)';
      });
    });
  });
});
