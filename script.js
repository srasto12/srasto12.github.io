const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/* Year -------------------------------------------------------------- */
const yearNode = $("#current-year");
if (yearNode) yearNode.textContent = new Date().getFullYear();

/* Mobile nav ------------------------------------------------------- */
const menuToggle = $(".menu-toggle");
const siteNav = $(".site-nav");
const navLinks = $$(".site-nav a");

if (menuToggle && siteNav) {
  const closeNav = () => {
    siteNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
  };

  menuToggle.addEventListener("click", () => {
    const open = siteNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
  });

  navLinks.forEach((link) => link.addEventListener("click", closeNav));
}

/* Header state + scroll progress --------------------------------- */
const header = $(".site-header");
const progress = $(".scroll-progress span");
let ticking = false;

const onScroll = () => {
  const y = window.scrollY;
  if (header) header.classList.toggle("is-scrolled", y > 8);
  if (progress) {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = max > 0 ? `${(y / max) * 100}%` : "0%";
  }
  ticking = false;
};

window.addEventListener(
  "scroll",
  () => {
    if (ticking) return;
    window.requestAnimationFrame(onScroll);
    ticking = true;
  },
  { passive: true }
);
onScroll();

/* Selected-work switcher --------------------------------------- */
const workItems = $$(".work-item");
const workPanels = $$(".work-panel");

const activateWork = (target) => {
  workItems.forEach((btn) => {
    const on = btn.dataset.target === target;
    btn.classList.toggle("is-active", on);
    btn.setAttribute("aria-selected", String(on));
  });
  workPanels.forEach((panel) => panel.classList.toggle("is-active", panel.id === target));
};

workItems.forEach((btn) => {
  btn.addEventListener("click", () => activateWork(btn.dataset.target));
});

/* Contact form -> mailto -------------------------------------- */
const contactForm = $("#contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(contactForm);
    const get = (k) => String(data.get(k) || "").trim();
    const subject = encodeURIComponent(get("subject") || "Portfolio inquiry");
    const body = encodeURIComponent(
      `Hi Sahil,\n\n${get("message")}\n\nName: ${get("name")}\nEmail: ${get("email")}`
    );
    window.location.href = `mailto:sahilrastogi106@gmail.com?subject=${subject}&body=${body}`;
  });
}

/* Scroll reveal + active section ----------------------------- */
const revealNodes = $$("[data-reveal]");
const sections = $$("main section[id]");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("revealed");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );
  revealNodes.forEach((node) => revealObserver.observe(node));

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach((link) =>
        link.classList.toggle("active", link.getAttribute("href") === `#${visible.target.id}`)
      );
    },
    { rootMargin: "-40% 0px -50% 0px", threshold: [0.15, 0.4, 0.7] }
  );
  sections.forEach((section) => sectionObserver.observe(section));
} else {
  revealNodes.forEach((node) => node.classList.add("revealed"));
}
