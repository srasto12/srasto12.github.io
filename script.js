const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const siteHeader = document.querySelector(".site-header");
const navLinks = Array.from(document.querySelectorAll(".site-nav a"));
const revealNodes = document.querySelectorAll("[data-reveal]");
const sections = Array.from(document.querySelectorAll("main section[id]"));
const yearNode = document.getElementById("current-year");
const contactForm = document.getElementById("contact-form");
let lastScrollY = window.scrollY;
let ticking = false;

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation menu");
    });
  });
}

const syncHeaderState = () => {
  if (!siteHeader) {
    return;
  }

  const currentScrollY = window.scrollY;
  const isMobileMenuOpen = siteNav && siteNav.classList.contains("open");

  siteHeader.classList.toggle("is-scrolled", currentScrollY > 20);

  if (currentScrollY <= 40 || isMobileMenuOpen) {
    siteHeader.classList.remove("is-hidden");
    lastScrollY = currentScrollY;
    return;
  }

  const scrollingDown = currentScrollY > lastScrollY;
  const scrollDelta = Math.abs(currentScrollY - lastScrollY);

  if (scrollDelta < 8) {
    return;
  }

  siteHeader.classList.toggle("is-hidden", scrollingDown);
  lastScrollY = currentScrollY;
};

window.addEventListener(
  "scroll",
  () => {
    if (ticking) {
      return;
    }

    window.requestAnimationFrame(() => {
      syncHeaderState();
      ticking = false;
    });

    ticking = true;
  },
  { passive: true }
);

syncHeaderState();

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const subject = String(formData.get("subject") || "").trim();
    const message = String(formData.get("message") || "").trim();

    const composedSubject = encodeURIComponent(subject || "Portfolio inquiry");
    const composedBody = encodeURIComponent(
      `Hi Sahil,\n\n${message}\n\nName: ${name}\nEmail: ${email}`
    );

    window.location.href = `mailto:sahilrastogi106@gmail.com?subject=${composedSubject}&body=${composedBody}`;
  });
}

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.16 }
  );

  revealNodes.forEach((node) => revealObserver.observe(node));

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) {
        return;
      }

      navLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${visible.target.id}`;
        link.classList.toggle("active", isActive);
      });
    },
    {
      rootMargin: "-35% 0px -45% 0px",
      threshold: [0.2, 0.4, 0.6]
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));
} else {
  revealNodes.forEach((node) => node.classList.add("revealed"));
}
