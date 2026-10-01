/* EWS TECH · native scroll choreography, progressive enhancement. */
(() => {
  "use strict";
  const root = document.documentElement;
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [
    ...scope.querySelectorAll(selector),
  ];
  const clamp = (value, min = 0, max = 1) =>
    Math.max(min, Math.min(max, value));
  const ease = (value) => 1 - Math.pow(1 - clamp(value), 3);
  const pad = (value) => String(value).padStart(2, "0");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const fine = matchMedia("(hover: hover) and (pointer: fine)");
  const hero = $(".hero");
  const vision = $(".vision");
  const services = $(".services");
  const portal = $(".portal");
  const work = $(".work");
  const track = $(".gallery-track");
  const viewport = $(".gallery-viewport");
  const cards = $$(".project-card");
  const scenes = $$(".service-scene");
  const sceneCopies = scenes.map((scene) => $(".service-copy", scene));
  const sceneVisuals = scenes.map((scene) => $(".service-visual", scene));
  const dots = $$(".service-dots i");
  const previous = $(".gallery-prev");
  const next = $(".gallery-next");
  const heroHeading = $("#hero-title");
  const visionLines = $$(".vision-title > span");
  const visionStar = $(".vision-star");
  const portalCircle = $(".portal-circle");
  const portalBrand = $(".portal-brand");
  const portalCopy = $(".portal-copy");
  const marquee = $(".marquee-track");
  const progressBar = $(".scroll-progress");
  const header = $(".header");
  const serviceNumber = $("#service-current");
  const projectNumber = $("#project-current");
  let motion = false;
  let desktop = false;
  let frame = 0;
  let activeProject = 0;
  let activeService = -1;
  let geometry = {};
  let galleryDistance = 0;
  let cardStride = 0;
  let pageHeight = 1;
  let viewportHeight = innerHeight;
  let resizeTimer;
  window.EWSSceneState = {
    progress: 0,
    pointerX: 0,
    pointerY: 0,
    reduced: reduced.matches,
  };

  // Native dialogs retain focus trapping and Escape behavior in every layout.
  const menu = $("#menu-dialog");
  const menuButton = $(".menu-toggle");
  const projectDialog = $("#project-dialog");
  let dialogTrigger;
  function openDialog(dialog, trigger) {
    dialogTrigger = trigger;
    dialog.showModal();
    document.body.classList.add("dialog-open");
  }
  function closeDialog(dialog) {
    if (dialog.open) dialog.close();
  }
  [menu, projectDialog].forEach((dialog) => {
    dialog.addEventListener("click", (event) => {
      if (event.target !== dialog) return;
      const box = dialog.getBoundingClientRect();
      if (
        event.clientX < box.left ||
        event.clientX > box.right ||
        event.clientY < box.top ||
        event.clientY > box.bottom
      )
        closeDialog(dialog);
    });
    dialog.addEventListener("close", () => {
      document.body.classList.remove("dialog-open");
      menuButton.setAttribute("aria-expanded", "false");
      dialogTrigger?.focus({ preventScroll: true });
    });
  });
  if (typeof menu.showModal === "function") {
    menuButton.hidden = false;
    menuButton.addEventListener("click", () => {
      openDialog(menu, menuButton);
      menuButton.setAttribute("aria-expanded", "true");
    });
    $(".close-menu").addEventListener("click", () => closeDialog(menu));
    $$('.menu-inner a[href^="#"]').forEach((link) =>
      link.addEventListener("click", () => closeDialog(menu)),
    );
    $(".close-project").addEventListener("click", () =>
      closeDialog(projectDialog),
    );
    $$(".detail-button").forEach((button) => {
      button.hidden = false;
      button.addEventListener("click", () => {
        const template = $(`#project-template-${button.dataset.details}`);
        const body = $(".project-dialog-body");
        body.replaceChildren(template.content.cloneNode(true));
        $("h2", body).id = "project-dialog-title";
        openDialog(projectDialog, button);
        projectDialog.scrollTop = 0;
      });
    });
    root.classList.add("js");
  }
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  // Split only text nodes, preserving emphasis, line breaks and heading names.
  $$(".split-reveal").forEach((heading) => {
    heading.setAttribute(
      "aria-label",
      heading.innerText.replace(/\s+/g, " ").trim(),
    );
    const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    let index = 0;
    nodes.forEach((node) => {
      const fragment = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach((part) => {
        if (!part.trim()) {
          fragment.append(document.createTextNode(part));
          return;
        }
        const wrapper = document.createElement("span");
        wrapper.className = "split-word";
        wrapper.setAttribute("aria-hidden", "true");
        wrapper.style.setProperty("--word-index", index++);
        const word = document.createElement("span");
        word.textContent = part;
        wrapper.append(word);
        fragment.append(wrapper);
      });
      node.replaceWith(fragment);
    });
  });
  const paragraph = $(".word-reveal");
  const paragraphText = paragraph.textContent;
  paragraph.replaceChildren();
  paragraphText.split(/(\s+)/).forEach((part) => {
    if (!part.trim()) {
      paragraph.append(document.createTextNode(part));
      return;
    }
    const word = document.createElement("span");
    word.className = "word";
    word.textContent = part;
    paragraph.append(word);
  });
  const words = $$(".word-reveal .word");
  $$(".footer-mark > span").forEach((letter, index) =>
    letter.style.setProperty("--letter", index),
  );

  function countUp(element) {
    if (element.dataset.counted) return;
    element.dataset.counted = "true";
    if (!motion) return;
    const total = Number(element.dataset.count);
    const start = performance.now();
    function tick(now) {
      const progress = reduced.matches ? 1 : clamp((now - start) / 900);
      element.textContent = pad(Math.round(total * ease(progress)));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  const revealTargets = $$(".reveal, .split-reveal, .footer-mark");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
          $$("[data-count]", entry.target).forEach(countUp);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -25px 0px" },
    );
    revealTargets.forEach((target) => observer.observe(target));
  } else revealTargets.forEach((target) => target.classList.add("visible"));

  function measure() {
    viewportHeight = innerHeight;
    [hero, vision, services, portal, work].forEach((section) => {
      geometry[section.classList[0]] = {
        top: section.offsetTop,
        height: section.offsetHeight,
      };
    });
    cardStride =
      cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : 0;
    galleryDistance = cardStride * (cards.length - 1);
    pageHeight = Math.max(1, root.scrollHeight - viewportHeight);
    schedule();
  }
  function progress(section, y) {
    const bounds = geometry[section];
    return clamp(
      (y - bounds.top) / Math.max(1, bounds.height - viewportHeight),
    );
  }
  function setProject(index) {
    activeProject = clamp(index, 0, cards.length - 1);
    projectNumber.textContent = pad(activeProject + 1);
    previous.disabled = activeProject === 0;
    next.disabled = activeProject === cards.length - 1;
  }
  function goToProject(index, behavior = motion ? "smooth" : "instant") {
    index = clamp(index, 0, cards.length - 1);
    if (desktop) {
      const bounds = geometry.work;
      const fraction = index / (cards.length - 1);
      window.scrollTo({
        top: bounds.top + fraction * (bounds.height - viewportHeight),
        behavior,
      });
    } else viewport.scrollTo({ left: cardStride * index, behavior });
    setProject(index);
  }
  previous.addEventListener("click", () => goToProject(activeProject - 1));
  next.addEventListener("click", () => goToProject(activeProject + 1));
  viewport.addEventListener(
    "scroll",
    () => {
      // Keyboard focus can cause an overflow:hidden viewport to scroll natively.
      if (desktop) {
        if (viewport.scrollLeft) viewport.scrollLeft = 0;
        return;
      }
      if (cardStride) setProject(Math.round(viewport.scrollLeft / cardStride));
    },
    { passive: true },
  );
  cards.forEach((card, index) =>
    card.addEventListener("focusin", () => {
      if (desktop && index !== activeProject) goToProject(index, "instant");
    }),
  );

  function render() {
    frame = 0;
    const y = scrollY;
    header.classList.toggle("scrolled", y > 45);
    progressBar.style.transform = `scaleX(${clamp(y / pageHeight)})`;
    if (!motion) return;
    const hp = progress("hero", y);
    window.EWSSceneState.progress = hp;
    heroHeading.style.transform = `translate3d(${-hp * 3}%,${-hp * 35}px,0)`;
    heroHeading.style.opacity = 1 - hp * 0.4;
    const vp = progress("vision", y);
    const entrance = clamp(
      (viewportHeight - (geometry.vision.top - y)) / viewportHeight,
    );
    visionLines.forEach((line, index) => {
      const amount = (1 - ease(entrance)) * (index % 2 ? -100 : 100);
      line.style.transform = `translate3d(${amount + vp * (index % 2 ? 32 : -25)}px,0,0)`;
      line.style.opacity = 0.3 + entrance * 0.7;
    });
    visionStar.style.transform = `rotate(${vp * 165 + entrance * 30}deg)`;
    words.forEach((word, index) =>
      word.classList.toggle(
        "lit",
        vp > (index / words.length) * 0.68 || vp > 0.75,
      ),
    );
    if (desktop) {
      const sp = progress("services", y);
      const position = sp * (scenes.length - 0.15);
      const current = Math.min(scenes.length - 1, Math.floor(position));
      const phase = position - Math.floor(position);
      if (current !== activeService) {
        activeService = current;
        scenes.forEach((scene, index) => {
          const active = index === current;
          scene.style.visibility = active ? "visible" : "hidden";
          scene.style.pointerEvents = active ? "auto" : "none";
          scene.inert = !active;
          dots[index].classList.toggle("active", active);
        });
        serviceNumber.textContent = pad(current + 1);
      }
      scenes.forEach((scene, index) => {
        const active = index === current;
        const arrival = current === 0 ? 1 : ease(phase / 0.22);
        const departure =
          current === scenes.length - 1 ? 0 : ease((phase - 0.83) / 0.17);
        scene.style.opacity = active ? 1 - departure * 0.85 : 0;
        if (!active) return;
        sceneCopies[index].style.transform =
          `translate3d(0,${(1 - arrival) * 60 - departure * 35}px,0)`;
        sceneCopies[index].style.filter =
          `blur(${(1 - arrival) * 7 + departure * 5}px)`;
        sceneVisuals[index].style.clipPath =
          `inset(${(1 - arrival) * 80}% -15% -15% -15% round 10px)`;
        sceneVisuals[index].style.transform =
          `perspective(1000px) translate3d(0,${(0.5 - phase) * 24}px,0) rotateY(${(1 - arrival) * -12}deg)`;
      });
      const wp = progress("work", y);
      track.style.transform = `translate3d(${-wp * galleryDistance}px,0,0)`;
      setProject(Math.round(wp * (cards.length - 1)));
    }
    const pp = progress("portal", y);
    const pe = clamp(
      (viewportHeight - (geometry.portal.top - y)) / viewportHeight,
    );
    portalCircle.style.transform = `translate(-50%,-50%) scale(${0.03 + ease(pp / 0.62) * 0.97})`;
    portalBrand.style.transform = `translate3d(${-pp * 160}px,${pp * 220}px,0) rotate(${15 + pp * 145}deg) scale(${1 + pp * 0.6})`;
    portalCopy.style.opacity = clamp(0.05 + pp * 2.8);
    portalCopy.style.transform = `translate3d(0,${(1 - ease(pp / 0.6)) * 90}px,0) scale(${0.86 + ease(pp / 0.8) * 0.14})`;
    portalCopy.style.filter = `blur(${(1 - ease(pp / 0.55)) * 10}px)`;
    // The visible edge introduces the portal before its pinned expansion starts.
    portalCircle.style.opacity = 0.3 + pe * 0.7;
    const marqueeTop = marquee.parentElement.offsetTop;
    marquee.style.transform = `translate3d(${-clamp((y + viewportHeight - marqueeTop) / (viewportHeight * 2)) * 320}px,0,0)`;
  }
  function schedule() {
    if (!frame) frame = requestAnimationFrame(render);
  }

  function configure() {
    const oldDesktop = desktop;
    motion = !reduced.matches && "IntersectionObserver" in window;
    desktop = motion && innerWidth >= 900 && innerHeight >= 760;
    root.classList.toggle("immersive", motion);
    root.classList.toggle("desktop-scenes", desktop);
    root.classList.toggle("desktop-gallery", desktop);
    window.EWSSceneState.reduced = !motion;
    activeService = -1;
    const horizontal = desktop || innerWidth < 900;
    previous.hidden = next.hidden = !horizontal;
    $(".gallery-hint").textContent = desktop
      ? "ROLE PARA CONHECER OS PROJETOS ↓"
      : horizontal
        ? "DESLIZE PARA EXPLORAR →"
        : "ESCOLHA UM PROJETO PARA CONHECER";
    if (!desktop) {
      scenes.forEach((scene, index) => {
        scene.removeAttribute("style");
        scene.inert = false;
        sceneCopies[index].removeAttribute("style");
        sceneVisuals[index].removeAttribute("style");
      });
      track.style.transform = "";
    }
    if (!motion) {
      [
        heroHeading,
        ...visionLines,
        visionStar,
        portalCircle,
        portalBrand,
        portalCopy,
        marquee,
      ].forEach((node) => node.removeAttribute("style"));
      words.forEach((word) => word.classList.add("lit"));
      revealTargets.forEach((target) => target.classList.add("visible"));
    }
    if (oldDesktop !== desktop) viewport.scrollLeft = 0;
    setProject(0);
    measure();
    dispatchEvent(new CustomEvent("ews:motionchange"));
  }
  addEventListener("scroll", schedule, { passive: true });
  addEventListener(
    "resize",
    () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(configure, 150);
    },
    { passive: true },
  );
  reduced.addEventListener("change", configure);
  configure();
  document.fonts?.ready.then(measure);
  addEventListener("load", measure, { once: true });
  if ("ResizeObserver" in window)
    new ResizeObserver(measure).observe($(".studio"));

  // Short entrance, never a loading gate: content remains usable immediately.
  const introNumber = $(".intro-number");
  const introLine = $(".intro-line");
  const introStart = performance.now();
  function introTick(now) {
    const p = clamp((now - introStart) / 1050);
    introNumber.textContent = String(Math.round(p * 100)).padStart(3, "0");
    introLine.style.transform = `scaleX(${p})`;
    if (p < 1 && motion) requestAnimationFrame(introTick);
  }
  if (motion && !location.hash) requestAnimationFrame(introTick);
  else $(".intro").remove();

  // A small, fading blue trail. It sleeps as soon as the pointer stops moving.
  const trail = $("#pointer-trail");
  const ctx = trail.getContext("2d");
  const cursor = $(".cursor");
  let trailPoints = [];
  let trailFrame = 0;
  let pointerX = 0;
  let pointerY = 0;
  function resizeTrail() {
    trail.width = innerWidth;
    trail.height = innerHeight;
  }
  function paintTrail(now) {
    trailFrame = 0;
    ctx.clearRect(0, 0, trail.width, trail.height);
    trailPoints = trailPoints.filter((point) => now - point.t < 240);
    if (!motion || !fine.matches) {
      trailPoints = [];
      cursor.classList.remove("active");
      return;
    }
    for (let i = 1; i < trailPoints.length; i++) {
      const point = trailPoints[i];
      ctx.beginPath();
      ctx.strokeStyle = `rgba(99,154,255,${(1 - (now - point.t) / 240) * 0.48})`;
      ctx.lineWidth = 1 + (i / trailPoints.length) * 2;
      ctx.lineCap = "round";
      ctx.moveTo(trailPoints[i - 1].x, trailPoints[i - 1].y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    }
    cursor.style.transform = `translate3d(${pointerX - 46}px,${pointerY - 46}px,0)`;
    if (trailPoints.length) trailFrame = requestAnimationFrame(paintTrail);
  }
  if (ctx) {
    resizeTrail();
    addEventListener("resize", resizeTrail, { passive: true });
    addEventListener(
      "pointermove",
      (event) => {
        if (!motion || !fine.matches || event.pointerType === "touch") return;
        pointerX = event.clientX;
        pointerY = event.clientY;
        window.EWSSceneState.pointerX = (pointerX / innerWidth) * 2 - 1;
        window.EWSSceneState.pointerY = (pointerY / innerHeight) * 2 - 1;
        const target = event.target.closest("[data-cursor]");
        cursor.classList.toggle(
          "active",
          !!target && !document.body.classList.contains("dialog-open"),
        );
        if (target) $("span", cursor).textContent = target.dataset.cursor;
        trailPoints.push({ x: pointerX, y: pointerY, t: performance.now() });
        if (trailPoints.length > 24) trailPoints.shift();
        if (!trailFrame) trailFrame = requestAnimationFrame(paintTrail);
      },
      { passive: true },
    );
    document.addEventListener("pointerleave", () =>
      cursor.classList.remove("active"),
    );
  }
  $$(".magnetic").forEach((button) => {
    button.addEventListener("pointermove", (event) => {
      if (!motion || !fine.matches) return;
      const box = button.getBoundingClientRect();
      button.style.transform = `translate(${(event.clientX - box.left - box.width / 2) * 0.16}px,${(event.clientY - box.top - box.height / 2) * 0.16}px)`;
    });
    button.addEventListener("pointerleave", () => {
      button.style.transform = "";
    });
  });

  // Original ambient tones, opt-in only. No audio download or autoplay.
  const soundButton = $("#sound-toggle");
  const AudioEngine = window.AudioContext || window.webkitAudioContext;
  let audio;
  let master;
  let soundOn = false;
  if (AudioEngine) {
    soundButton.hidden = false;
    soundButton.addEventListener("click", async () => {
      try {
        if (!audio) {
          audio = new AudioEngine();
          master = audio.createGain();
          master.gain.value = 0;
          master.connect(audio.destination);
          [110, 164.81, 220].forEach((frequency, index) => {
            const tone = audio.createOscillator();
            const gain = audio.createGain();
            tone.type = "sine";
            tone.frequency.value = frequency;
            gain.gain.value = 0.07 / (index + 1);
            tone.connect(gain).connect(master);
            tone.start();
          });
        }
        soundOn = !soundOn;
        if (soundOn) await audio.resume();
        master.gain.setTargetAtTime(soundOn ? 0.4 : 0, audio.currentTime, 0.25);
        soundButton.setAttribute("aria-pressed", String(soundOn));
        soundButton.classList.toggle("sound-on", soundOn);
        $(".sound-state").textContent = soundOn ? "LIGADO" : "DESLIGADO";
      } catch {
        soundOn = false;
        soundButton.setAttribute("aria-pressed", "false");
        $(".sound-state").textContent = "INDISPONÍVEL";
        soundButton.disabled = true;
      }
    });
    document.addEventListener("visibilitychange", () => {
      if (!audio) return;
      if (document.hidden) audio.suspend().catch(() => {});
      else if (soundOn) audio.resume().catch(() => {});
    });
  }
})();
