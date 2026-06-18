document.getElementById("year").textContent = new Date().getFullYear();

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);

document.querySelectorAll(".reveal").forEach((el) => {
  revealObserver.observe(el);
});

document.querySelector(".hero-content")?.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = `${i * 0.12}s`;
  el.classList.add("visible");
});

document.querySelector(".hero-heading.reveal")?.classList.add("visible");
document.querySelector(".hero-banner.reveal")?.classList.add("visible");

const bookSheets = document.querySelectorAll(".book-sheet");

const sheetObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("turned");
        sheetObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2, rootMargin: "0px 0px -80px 0px" }
);

bookSheets.forEach((sheet) => {
  sheetObserver.observe(sheet);
});

const heroSheet = document.querySelector(".hero .book-sheet");
if (heroSheet) {
  window.setTimeout(() => {
    heroSheet.classList.add("turned");
  }, 350);
}
