document.getElementById("year").textContent = new Date().getFullYear();

const roadmap = document.querySelector(".roadmap");
if (roadmap) {
  const stops = Array.from(roadmap.querySelectorAll(".roadmap-stop a"));
  const sections = stops.map((stop) => document.getElementById(stop.dataset.target));
  const fill = roadmap.querySelector(".roadmap-fill");

  const updateRoadmap = () => {
    const probe = window.innerHeight * 0.35;
    let active = -1;
    sections.forEach((section, i) => {
      if (section && section.getBoundingClientRect().top <= probe) active = i;
    });

    stops.forEach((stop, i) => {
      stop.classList.toggle("is-active", i === active);
      stop.classList.toggle("is-visited", i < active);
    });

    if (fill) {
      let progress = 0;
      if (active >= 0) {
        progress = active;
        const current = sections[active];
        const next = sections[active + 1];
        if (current && next) {
          const currentTop = current.getBoundingClientRect().top;
          const span = next.getBoundingClientRect().top - currentTop;
          if (span > 0) {
            const local = (probe - currentTop) / span;
            progress += Math.max(0, Math.min(1, local));
          }
        }
      }
      const pct = stops.length > 1 ? (progress / (stops.length - 1)) * 100 : 0;
      fill.style.height = `${Math.max(0, Math.min(100, pct))}%`;
    }
  };

  let roadmapTicking = false;
  const onRoadmapScroll = () => {
    if (roadmapTicking) return;
    roadmapTicking = true;
    window.requestAnimationFrame(() => {
      updateRoadmap();
      roadmapTicking = false;
    });
  };

  window.addEventListener("scroll", onRoadmapScroll, { passive: true });
  window.addEventListener("resize", onRoadmapScroll);
  updateRoadmap();
}

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

const bookSheets = Array.from(document.querySelectorAll(".book-sheet"));
const heroSheet = document.querySelector(".hero .book-sheet");
const scrollSheets = bookSheets.filter((sheet) => sheet !== heroSheet);
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

if (prefersReducedMotion) {
  bookSheets.forEach((sheet) => sheet.classList.add("turned"));
} else {
  if (heroSheet) {
    window.setTimeout(() => {
      heroSheet.classList.add("turned");
    }, 350);
  }

  const progress = new WeakMap();

  scrollSheets.forEach((sheet) => sheet.classList.add("scroll-driven"));

  const updateSheets = () => {
    const viewportHeight = window.innerHeight;
    const start = viewportHeight; // top edge at bottom of viewport => closed
    const end = viewportHeight * 0.2; // top edge at 20% up => fully open (more scroll = slower turn)

    scrollSheets.forEach((sheet) => {
      const top = sheet.getBoundingClientRect().top;
      let p = (start - top) / (start - end);
      p = Math.max(0, Math.min(1, p));

      const previous = progress.get(sheet) || 0;
      if (p < previous) p = previous; // stay open once turned
      progress.set(sheet, p);

      // Linear rotation so the full swing is visible across the scroll,
      // with opacity rising quickly so the page isn't faint while turning.
      sheet.style.transform = `rotateY(${-90 + 90 * p}deg)`;
      sheet.style.opacity = String(Math.min(1, 0.35 + p * 1.6));
      sheet.classList.toggle("turned", p >= 0.999);
    });
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      updateSheets();
      ticking = false;
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  updateSheets();
}
