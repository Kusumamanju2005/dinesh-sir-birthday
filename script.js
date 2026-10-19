/* =====================================
   DINESH SIR BIRTHDAY WEBSITE
   Complete JavaScript
===================================== */

/* 1. GET HTML ELEMENTS */

const welcomeScreen = document.getElementById("welcomeScreen");
const countdownScreen = document.getElementById("countdownScreen");
const countdownNumber = document.getElementById("countdownNumber");
const birthdayReveal = document.getElementById("birthdayReveal");
const memoriesPage = document.getElementById("memoriesPage");

const surpriseButton = document.getElementById("surpriseButton");
const musicToggle = document.getElementById("musicToggle");
const memoriesButton = document.getElementById("memoriesButton");
const backToBirthday = document.getElementById("backToBirthday");

const birthdayMusic = document.getElementById("birthdayMusic");

const fireworksCanvas = document.getElementById("fireworksCanvas");
const fireworksContext = fireworksCanvas
  ? fireworksCanvas.getContext("2d")
  : null;

/* 2. WELCOME BUTTON AND COUNTDOWN */

if (
  surpriseButton &&
  welcomeScreen &&
  countdownScreen &&
  countdownNumber &&
  birthdayReveal
) {
  surpriseButton.addEventListener("click", function () {
    welcomeScreen.classList.add("hidden");
    countdownScreen.classList.remove("hidden");

    let count = 3;
    countdownNumber.textContent = count;

    const countdownTimer = setInterval(function () {
      count--;

      if (count > 0) {
        countdownNumber.textContent = count;
      } else {
        clearInterval(countdownTimer);

        countdownScreen.classList.add("hidden");
        birthdayReveal.classList.remove("hidden");

        window.scrollTo(0, 0);
        startFireworks();
      }
    }, 1000);
  });
}

/* 3. BIRTHDAY MUSIC BUTTON */

if (musicToggle && birthdayMusic) {
  musicToggle.addEventListener("click", async function () {
    try {
      if (birthdayMusic.paused) {
        await birthdayMusic.play();
        musicToggle.textContent = "♫ PAUSE MUSIC";
      } else {
        birthdayMusic.pause();
        musicToggle.textContent = "♫ PLAY MUSIC";
      }
    } catch (error) {
      console.error("Music could not play:", error);
      alert(
        "Music could not play. Please check that the MP3 file is inside the music folder.",
      );
    }
  });

  birthdayMusic.addEventListener("ended", function () {
    musicToggle.textContent = "♫ PLAY MUSIC";
  });
}

/* 4. OPEN THE MEMORIES PAGE */

if (memoriesButton && birthdayReveal && memoriesPage) {
  memoriesButton.addEventListener("click", function () {
    birthdayReveal.classList.add("hidden");
    memoriesPage.classList.remove("hidden");

    window.scrollTo(0, 0);
  });
}

/* 5. RETURN TO THE BIRTHDAY PAGE */

if (backToBirthday && birthdayReveal && memoriesPage) {
  backToBirthday.addEventListener("click", function () {
    memoriesPage.classList.add("hidden");
    birthdayReveal.classList.remove("hidden");

    window.scrollTo(0, 0);
  });
}

/* 6. PHOTO GALLERY
   Hide the gallery only if every photo fails to load.
*/

const gallerySection = document.getElementById("gallerySection");
const galleryPhotos = document.querySelectorAll(".gallery-photo");

if (gallerySection && galleryPhotos.length > 0) {
  let loadedPhotos = 0;
  let checkedPhotos = 0;

  function checkGalleryPhoto(photo) {
    checkedPhotos++;

    if (photo.naturalWidth > 0) {
      loadedPhotos++;
    }

    if (checkedPhotos === galleryPhotos.length) {
      if (loadedPhotos === 0) {
        gallerySection.classList.add("hidden");
      } else {
        gallerySection.classList.remove("hidden");
      }
    }
  }

  galleryPhotos.forEach(function (photo) {
    if (photo.complete) {
      checkGalleryPhoto(photo);
    } else {
      photo.addEventListener(
        "load",
        function () {
          checkGalleryPhoto(photo);
        },
        { once: true },
      );

      photo.addEventListener(
        "error",
        function () {
          checkGalleryPhoto(photo);
        },
        { once: true },
      );
    }
  });
}

/* 7. VIDEO SOUND BUTTON */

const memoryVideos = document.querySelectorAll(".memory-video");
const soundButtons = document.querySelectorAll(".sound-toggle");

soundButtons.forEach(function (button, index) {
  const video = memoryVideos[index];

  if (!video) return;

  button.addEventListener("click", function () {
    video.muted = !video.muted;

    if (video.muted) {
      button.textContent = "🔇 Turn Sound On";
    } else {
      button.textContent = "🔊 Turn Sound Off";
    }

    if (video.paused) {
      video.play().catch(function (error) {
        console.error("Video could not play:", error);
      });
    }
  });
});

/* 8. FIREWORKS */

let fireworks = [];
let animationRunning = false;

function resizeFireworksCanvas() {
  if (!fireworksCanvas) return;

  fireworksCanvas.width = window.innerWidth;
  fireworksCanvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeFireworksCanvas);
resizeFireworksCanvas();

function createFirework() {
  if (!fireworksCanvas) return;

  const x = Math.random() * fireworksCanvas.width;
  const y = Math.random() * fireworksCanvas.height * 0.55;

  const colors = ["#f5d27a", "#ffffff", "#e8b44c", "#ffcf91", "#ffe9b5"];

  const color = colors[Math.floor(Math.random() * colors.length)];

  for (let i = 0; i < 55; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 3.5 + 1;

    fireworks.push({
      x: x,
      y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      alpha: 1,
      color: color,
      radius: Math.random() * 2.5 + 1,
    });
  }
}

function animateFireworks() {
  if (!fireworksContext || !fireworksCanvas) return;

  fireworksContext.clearRect(
    0,
    0,
    fireworksCanvas.width,
    fireworksCanvas.height,
  );

  fireworks = fireworks.filter(function (particle) {
    particle.x += particle.vx;
    particle.y += particle.vy;

    particle.vy += 0.025;
    particle.alpha -= 0.012;

    if (particle.alpha <= 0) return false;

    fireworksContext.globalAlpha = particle.alpha;
    fireworksContext.fillStyle = particle.color;

    fireworksContext.beginPath();

    fireworksContext.arc(
      particle.x,
      particle.y,
      particle.radius,
      0,
      Math.PI * 2,
    );

    fireworksContext.fill();

    return true;
  });

  fireworksContext.globalAlpha = 1;

  if (animationRunning || fireworks.length > 0) {
    requestAnimationFrame(animateFireworks);
  }
}

function startFireworks() {
  if (!fireworksCanvas || !fireworksContext) return;

  animationRunning = true;

  createFirework();
  animateFireworks();

  let bursts = 0;

  const fireworkInterval = setInterval(function () {
    createFirework();
    bursts++;

    if (bursts >= 8) {
      clearInterval(fireworkInterval);
      animationRunning = false;
    }
  }, 700);
}

/* 9. CONSOLE MESSAGE */

console.log("Dinesh Sir's birthday website is ready!");
