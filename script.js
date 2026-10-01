(() => {
  "use strict";

  const root = document.documentElement;
  const body = document.body;
  const header = document.querySelector(".header");
  const menu = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#navigation");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const progress = document.querySelector(".reading-progress");
  const hero = document.querySelector(".hero");
  const heroArt = document.querySelector(".hero-art");
  const heroHeading = document.querySelector(".hero-heading");
  const manifesto = document.querySelector(".manifesto");
  const manifestoTitle = document.querySelector(".manifesto-text");
  const asterisk = document.querySelector(".asterisk");
  const marquee = document.querySelector(".marquee");
  const track = document.querySelector(".marquee-track");
  const cards = [...document.querySelectorAll(".work-card")];
  const contact = document.querySelector(".contact");
  const orb = document.querySelector(".contact-orb");
  const cursor = document.querySelector(".cursor");
  let words = [];
  let scheduled = false;
  let motionEnabled = false;
  let cursorFrame = 0;
  let pointerX = 0;
  let pointerY = 0;
  let tiltX = 0;
  let tiltY = 0;

  const clamp = (value, min = 0, max = 1) =>
    Math.min(max, Math.max(min, value));

  function closeMenu(restoreFocus = false) {
    const wasOpen = menu.getAttribute("aria-expanded") === "true";
    menu.setAttribute("aria-expanded", "false");
    menu.setAttribute("aria-label", "Abrir menu");
    nav.classList.remove("open");
    if (restoreFocus && wasOpen) menu.focus();
  }

  menu.addEventListener("click", () => {
    const open = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(open));
    menu.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    nav.classList.toggle("open", open);
  });
  nav
    .querySelectorAll("a")
    .forEach((link) => link.addEventListener("click", () => closeMenu()));
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".header")) closeMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu(true);
    if (event.key === "Tab") cursor.classList.remove("is-active");
  });
  document.querySelector("#year").textContent = new Date().getFullYear();

  if ("IntersectionObserver" in window) {
    const reveals = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            reveals.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    document
      .querySelectorAll(".reveal")
      .forEach((element) => reveals.observe(element));

    const sections = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          nav.querySelectorAll("a").forEach((link) => {
            const active = link.hash === "#" + entry.target.id;
            link.classList.toggle("active", active);
            if (active) link.setAttribute("aria-current", "location");
            else link.removeAttribute("aria-current");
          });
        });
      },
      { rootMargin: "-15% 0px -60% 0px" },
    );
    document
      .querySelectorAll("main > section[id]")
      .forEach((section) => sections.observe(section));
  }

  function prepareWords() {
    if (words.length) return;
    const sentence = manifestoTitle.textContent.trim();
    manifestoTitle.setAttribute("aria-label", sentence);
    manifestoTitle.textContent = "";
    sentence.split(/\s+/).forEach((word, index) => {
      if (index) manifestoTitle.append(" ");
      const span = document.createElement("span");
      span.className = "manifesto-word";
      span.setAttribute("aria-hidden", "true");
      span.textContent = word;
      manifestoTitle.append(span);
      words.push(span);
    });
  }

  function updateStack() {
    // Keep every card fully readable on short screens and on touch devices.
    const canStack =
      motionEnabled &&
      finePointer.matches &&
      innerWidth > 800 &&
      cards.every((card) => card.offsetHeight + 145 < innerHeight);
    body.classList.toggle("stack-ready", canStack);
  }

  function configureMotion() {
    motionEnabled = !reducedMotion.matches && "IntersectionObserver" in window;
    if (motionEnabled) prepareWords();
    body.classList.toggle("motion-ready", motionEnabled);
    body.classList.toggle(
      "cursor-enabled",
      motionEnabled && finePointer.matches,
    );
    if (!motionEnabled) {
      [heroArt, heroHeading, track, asterisk, orb, ...cards].forEach(
        (element) => {
          element.style.removeProperty("transform");
          element.style.removeProperty("opacity");
        },
      );
      manifesto.style.removeProperty("background-color");
      words.forEach((word) => word.classList.add("is-lit"));
      cursor.classList.remove("is-active");
    }
    updateStack();
    schedule();
  }

  function render() {
    scheduled = false;
    const viewport = innerHeight;
    const max = root.scrollHeight - viewport;
    progress.style.transform = `scaleX(${max > 0 ? clamp(scrollY / max) : 0})`;
    header.classList.toggle("scrolled", scrollY > 35);
    if (!motionEnabled) return;

    // Read geometry together before applying style changes.
    const heroRect = hero.getBoundingClientRect();
    const manifestoRect = manifesto.getBoundingClientRect();
    const marqueeRect = marquee.getBoundingClientRect();
    const contactRect = contact.getBoundingClientRect();
    const cardRects = cards.map((card) => card.getBoundingClientRect());

    if (heroRect.bottom > 0 && heroRect.top < viewport) {
      const desktop = innerWidth > 800;
      const phase = clamp(
        -heroRect.top / Math.max(1, hero.offsetHeight - viewport),
      );
      const scrollScale = desktop
        ? phase
        : clamp(-heroRect.top / viewport) * 0.35;
      heroArt.style.transform = `translate3d(${tiltX - scrollScale * 35}px,${tiltY + scrollScale * 45}px,0) scale(${1 + scrollScale * 0.2}) rotate(${scrollScale * 9}deg)`;
      heroHeading.style.transform = `translate3d(${-scrollScale * 45}px,${-scrollScale * 30}px,0)`;
      heroHeading.style.opacity = String(1 - scrollScale * 0.65);
    }

    if (manifestoRect.bottom > 0 && manifestoRect.top < viewport) {
      const phase = clamp(
        (viewport * 0.5 - manifestoRect.top) /
          (manifesto.offsetHeight - viewport * 0.2),
      );
      const lit = Math.ceil(clamp(phase * 1.3) * words.length);
      words.forEach((word, index) =>
        word.classList.toggle("is-lit", index < lit),
      );
      manifesto.style.backgroundColor = `rgb(${Math.round(16 + phase * 8)}, ${Math.round(35 + phase * 32)}, ${Math.round(69 + phase * 130)})`;
      asterisk.style.transform = `rotate(${phase * 150}deg)`;
    }

    cards.forEach((card, index) => {
      if (!body.classList.contains("stack-ready")) {
        card.style.removeProperty("transform");
        return;
      }
      const next = cardRects[index + 1];
      const overlap = next
        ? clamp((viewport * 0.82 - next.top) / (viewport * 0.82 - 105))
        : 0;
      card.style.transform = `translate3d(0,${-overlap * 10}px,0) scale(${1 - overlap * 0.055}) rotate(${-overlap * 0.6}deg)`;
    });

    if (marqueeRect.bottom > -100 && marqueeRect.top < viewport + 100) {
      const distance = clamp(
        (viewport - marqueeRect.top) / (viewport + marqueeRect.height),
      );
      track.style.transform = `translate3d(${-distance * Math.min(innerWidth * 0.32, 500)}px,0,0)`;
    }
    if (contactRect.bottom > 0 && contactRect.top < viewport) {
      const phase = clamp(
        (viewport - contactRect.top) / (viewport + contactRect.height),
      );
      orb.style.transform = `translate3d(0,${(phase - 0.5) * -90}px,0) rotate(${phase * 65}deg)`;
    }
  }

  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(render);
  }

  addEventListener("scroll", schedule, { passive: true });
  addEventListener(
    "resize",
    () => {
      if (innerWidth > 800) closeMenu();
      updateStack();
      schedule();
    },
    { passive: true },
  );
  reducedMotion.addEventListener("change", configureMotion);
  finePointer.addEventListener("change", configureMotion);
  addEventListener("load", () => {
    updateStack();
    schedule();
  });
  addEventListener("pageshow", schedule);

  hero.addEventListener("pointermove", (event) => {
    if (!motionEnabled || !finePointer.matches) return;
    tiltX = (event.clientX / innerWidth - 0.5) * 22;
    tiltY = (event.clientY / innerHeight - 0.5) * 16;
    schedule();
  });
  hero.addEventListener("pointerleave", () => {
    tiltX = 0;
    tiltY = 0;
    schedule();
  });

  document.addEventListener(
    "pointermove",
    (event) => {
      if (!motionEnabled || !finePointer.matches) return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      const target = event.target.closest("[data-cursor]");
      cursor.classList.toggle("is-active", Boolean(target));
      if (!target || cursorFrame) return;
      cursorFrame = requestAnimationFrame(() => {
        cursor.style.transform = `translate3d(${pointerX - 50}px,${pointerY - 50}px,0)`;
        cursorFrame = 0;
      });
    },
    { passive: true },
  );
  document.addEventListener("pointerleave", () =>
    cursor.classList.remove("is-active"),
  );
  document.addEventListener("visibilitychange", () => {
    cursor.classList.remove("is-active");
    if (!document.hidden) schedule();
  });

  configureMotion();
})();
