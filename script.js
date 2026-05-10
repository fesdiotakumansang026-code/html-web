const revealItems = document.querySelectorAll(".reveal");
const tiltCard = document.querySelector("[data-tilt] .profile-card");
const galleryButtons = document.querySelectorAll(".gallery-card");
const lightbox = document.querySelector("#galleryLightbox");
const lightboxImage = document.querySelector(".lightbox-image");
const lightboxClose = document.querySelector(".lightbox-close");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.16,
    rootMargin: "0px 0px -60px 0px",
  }
);

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index * 70, 280)}ms`;
  revealObserver.observe(item);
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));

    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

if (tiltCard && window.matchMedia("(pointer: fine)").matches) {
  const resetTilt = () => {
    tiltCard.style.transform = "rotateX(0deg) rotateY(0deg) translateY(0)";
  };

  tiltCard.addEventListener("mousemove", (event) => {
    const rect = tiltCard.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    const rotateX = y * -8;
    const rotateY = x * 8;

    tiltCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  tiltCard.addEventListener("mouseleave", resetTilt);
}

if (lightbox && lightboxImage && lightboxClose) {
  const openLightbox = (image) => {
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt;
    lightbox.hidden = false;
    document.body.classList.add("lightbox-open");
    lightboxClose.focus();
  };

  const closeLightbox = () => {
    lightbox.hidden = true;
    document.body.classList.remove("lightbox-open");
    lightboxImage.removeAttribute("src");
    lightboxImage.alt = "";
  };

  galleryButtons.forEach((button) => {
    const image = button.querySelector("img");

    if (!image) {
      return;
    }

    button.addEventListener("click", () => openLightbox(image));
  });

  lightboxClose.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !lightbox.hidden) {
      closeLightbox();
    }
  });
}
