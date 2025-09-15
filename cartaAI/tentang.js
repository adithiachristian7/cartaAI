document.addEventListener("DOMContentLoaded", () => {
  const memberCards = document.querySelectorAll(".member-card");

  // --- CARD INTERACTION LOGIC (HOVER TO TILT & REVEAL) ---
  memberCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.classList.add("info-visible");
    });

    card.addEventListener("mouseleave", () => {
      card.classList.remove("info-visible");
      card.style.transform =
        "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    });

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const tiltX = ((centerY - y) / centerY) * 10;
      const tiltY = ((x - centerX) / centerX) * -10;
      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
  });

  // --- THEME ICON LOGIC ---
  const themeIconContainer = document.getElementById("theme-icon-container");
  const setTheme = (isDark) => {
    if (isDark) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  };

  themeIconContainer.addEventListener("click", () => {
    const isCurrentlyDark = document.body.classList.contains("dark-mode");
    setTheme(!isCurrentlyDark);
  });

  // Check for saved theme on page load
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    setTheme(true);
  } else {
    setTheme(false);
  }
});
