(function () {
  "use strict";

  // --- Динамический год в футере ---
  var yearSpan = document.getElementById("current-year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // --- Переключение тёмной темы ---
  var themeToggleBtn = document.getElementById("theme-toggle");
  if (themeToggleBtn) {
    var currentTheme = localStorage.getItem("theme") || "light";
    if (currentTheme === "dark") {
      document.documentElement.classList.add("dark-theme");
    }

    themeToggleBtn.addEventListener("click", function () {
      document.documentElement.classList.toggle("dark-theme");
      var isDark = document.documentElement.classList.contains("dark-theme");
      localStorage.setItem("theme", isDark ? "dark" : "light");
    });
  }

  // --- Мобильное меню ---
  var burgerBtn = document.getElementById("burger-menu");
  var mobileMenu = document.getElementById("mobile-menu");
  var mobileOverlay = document.getElementById("mobile-overlay");
  var mobileLinks = document.querySelectorAll(".mobile-menu__link");

  if (burgerBtn && mobileMenu && mobileOverlay) {
    function closeMenu() {
      burgerBtn.classList.remove("is-active");
      burgerBtn.setAttribute("aria-expanded", "false");
      mobileMenu.classList.remove("is-active");
      mobileOverlay.classList.remove("is-active");
      document.body.classList.remove("no-scroll");
    }

    function toggleMenu() {
      var isActive = mobileMenu.classList.contains("is-active");
      if (isActive) {
        closeMenu();
      } else {
        burgerBtn.classList.add("is-active");
        burgerBtn.setAttribute("aria-expanded", "true");
        mobileMenu.classList.add("is-active");
        mobileOverlay.classList.add("is-active");
        document.body.classList.add("no-scroll");
      }
    }

    burgerBtn.addEventListener("click", toggleMenu);
    mobileOverlay.addEventListener("click", closeMenu);

    mobileLinks.forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && mobileMenu.classList.contains("is-active")) {
        closeMenu();
      }
    });
  }

  // --- FAQ: аккордеон (открыт только один пункт) ---
  var faqItems = document.querySelectorAll(".faq__item");
  if (faqItems.length) {
    faqItems.forEach(function (item) {
      item.addEventListener("toggle", function () {
        if (item.open) {
          faqItems.forEach(function (otherItem) {
            if (otherItem !== item) {
              otherItem.open = false;
            }
          });
        }
      });
    });
  }

  // --- Обработка формы обратной связи ---
  var callbackForm = document.getElementById("callback-form");
  if (callbackForm) {
    callbackForm.addEventListener("submit", function (e) {
      e.preventDefault();

      var submitBtn = callbackForm.querySelector('button[type="submit"]');
      var successMsg = document.getElementById("form-success");

      if (submitBtn) {
        submitBtn.textContent = "Отправка...";
        submitBtn.disabled = true;
      }

      setTimeout(function () {
        callbackForm.reset();
        
        if (successMsg) {
          successMsg.style.display = "block";
        }
        
        if (submitBtn) {
          submitBtn.textContent = "Жду звонка";
          submitBtn.disabled = false;
        }

        setTimeout(function() {
          if (successMsg) successMsg.style.display = "none";
        }, 5000);

      }, 500);
    });
  }

  // --- ЛЕНИВАЯ ЗАГРУЗКА BVI ---
  var bviBtn = document.querySelector(".bvi-open");
  var bviLoaded = false;

  if (bviBtn) {
    bviBtn.addEventListener("click", function (e) {
      e.preventDefault(); 

      if (bviLoaded) return; 

      bviBtn.style.opacity = "0.5";
      bviBtn.style.pointerEvents = "none";

      var link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "css/bvi.min.css";
      document.head.appendChild(link);

      var script = document.createElement("script");
      script.src = "js/bvi.min.js";
      script.onload = function () {
        bviLoaded = true;
        bviBtn.style.opacity = "1";
        bviBtn.style.pointerEvents = "auto";

        if (typeof isvek !== "undefined" && isvek.Bvi) {
          var isMobile = window.matchMedia("(max-width: 768px)").matches;
          
          new isvek.Bvi({
            target: ".bvi-open",
            fontSize: 16,
            theme: "white",
            images: "grayscale",
            speech: true,
            fontFamily: "arial",
            panelFixed: !isMobile,
          });

          bviBtn.click();
        }
      };
      document.body.appendChild(script);
    });
  }

  // --- Тултип ---
  var tooltip = document.getElementById("tooltip");
  if (tooltip) {
    var cards = document.querySelectorAll(".pricing__card");
    var OFFSET = 16;
    var EDGE_MARGIN = 8;

    function positionTooltip(x, y) {
      var w = tooltip.offsetWidth;
      var h = tooltip.offsetHeight;
      var left = x + OFFSET;
      var top = y + OFFSET;

      if (left + w > window.innerWidth - EDGE_MARGIN) left = x - w - OFFSET;
      if (top + h > window.innerHeight - EDGE_MARGIN) top = y - h - OFFSET;

      tooltip.style.left = left + "px";
      tooltip.style.top = top + "px";
    }

    cards.forEach(function (card) {
      card.addEventListener("mouseenter", function (e) {
        positionTooltip(e.clientX, e.clientY);
        tooltip.classList.add("is-visible");
      });
      card.addEventListener("mousemove", function (e) {
        positionTooltip(e.clientX, e.clientY);
        tooltip.classList.add("is-visible"); 
      });
      card.addEventListener("mouseleave", function () {
        tooltip.classList.remove("is-visible");
      });
    });

    window.addEventListener("scroll", function () {
      if (tooltip.classList.contains("is-visible")) {
        tooltip.classList.remove("is-visible");
      }
    }, { passive: true });
  }

  // --- Кнопка "Наверх" ---
  var scrollTopBtn = document.getElementById("scroll-top");
  if (scrollTopBtn) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 300) {
        scrollTopBtn.classList.add("is-visible");
      } else {
        scrollTopBtn.classList.remove("is-visible");
      }
    }, { passive: true });

    scrollTopBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
})();