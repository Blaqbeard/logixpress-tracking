// This file will contain the JavaScript for the contact modal and "Coming Soon" notifications.
document.addEventListener("DOMContentLoaded", () => {
  // Mobile Menu
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });

    document.addEventListener("click", (e) => {
      if (
        !mobileMenuButton.contains(e.target) &&
        !mobileMenu.contains(e.target)
      ) {
        mobileMenu.classList.add("hidden");
      }
    });
  }

  // Contact Modal Logic
  const contactModal = document.getElementById("contact-modal");
  const closeModalBtn = document.getElementById("close-modal-btn");

  const openModal = () => {
    if (!contactModal) return;
    contactModal.classList.remove("hidden");
    contactModal.classList.add("flex");
    setTimeout(() => {
      contactModal.classList.add("opacity-100");
      contactModal.querySelector("div").classList.add("scale-100");
    }, 10);
  };

  const closeModal = () => {
    if (!contactModal) return;
    contactModal.querySelector("div").classList.remove("scale-100");
    contactModal.classList.remove("opacity-100");
    setTimeout(() => {
      contactModal.classList.add("hidden");
      contactModal.classList.remove("flex");
    }, 300);
  };

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeModal);
  }

  if (contactModal) {
    contactModal.addEventListener("click", (e) => {
      if (e.target === contactModal) {
        closeModal();
      }
    });
  }

  // "Coming Soon" Notification Logic
  const notification = document.getElementById("notification");
  const notificationText = document.getElementById("notification-text");

  const showToast = (message = "Coming Soon!") => {
    if (!notification || !notificationText) return;
    notificationText.textContent = message;
    notification.classList.remove("translate-x-full", "opacity-0");
    notification.classList.add("translate-x-0", "opacity-100");
    setTimeout(() => {
      notification.classList.add("translate-x-full", "opacity-0");
      notification.classList.remove("translate-x-0", "opacity-100");
    }, 3000);
  };

  // Feature Navigation (from features.html)
  const featureButtonsContainer = document.querySelector(
    ".overflow-x-auto.pb-2"
  );
  const featureContents = document.querySelectorAll(".feature-content");
  const learnMoreButtons = document.querySelectorAll(".learn-more-btn");

  if (featureButtonsContainer) {
    const featureButtons = featureButtonsContainer.querySelectorAll("button");

    const showFeatureContent = (feature) => {
      featureContents.forEach((content) => content.classList.add("hidden"));
      const selectedContent = document.getElementById(`${feature}-content`);
      if (selectedContent) {
        selectedContent.classList.remove("hidden");
      }

      featureButtons.forEach((btn) => {
        btn.classList.remove("bg-blue-600", "text-white");
        btn.classList.add("bg-white", "border", "border-gray-300");
      });

      const selectedButton = document.getElementById(`${feature}-btn`);
      if (selectedButton) {
        selectedButton.classList.remove(
          "bg-white",
          "border",
          "border-gray-300"
        );
        selectedButton.classList.add("bg-blue-600", "text-white");
      } else if (feature === "all-features") {
        const allFeaturesBtn = document.getElementById("all-features-btn");
        if (allFeaturesBtn) {
          allFeaturesBtn.classList.add("bg-blue-600", "text-white");
          allFeaturesBtn.classList.remove(
            "bg-white",
            "border",
            "border-gray-300"
          );
        }
      }
    };

    featureButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const feature = button.id.replace("-btn", "");
        showFeatureContent(feature);
      });
    });

    learnMoreButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const feature = button.dataset.feature;
        if (feature) {
          showFeatureContent(feature);
          // Scroll to the features section for better UX
          featureButtonsContainer.scrollIntoView({ behavior: "smooth" });
        }
      });
    });
  }

  // --- Centralized Button Event Listeners ---

  // Buttons that open the contact modal
  const contactButtons = document.querySelectorAll(
    '[href*="contact"], .contact-us-btn, #contact-support-btn'
  );
  contactButtons.forEach((btn) => {
    if (btn) {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        openModal();
      });
    }
  });

  // Buttons that show a "Coming Soon" toast
  const comingSoonButtons = {
    // General
    "get-started-btn": "Get Started feature coming soon!",
    "mobile-get-started-btn": "Get Started feature coming soon!",
    "cta-get-started-btn": "Get Started feature coming soon!",
    "send-message-btn": "Contact form coming soon!",

    // index.html specific
    "start-tracking-btn": "Tracking feature coming soon!",
    "track-package-btn": "Package tracking coming soon!",
    "request-demo-btn": "Demo request coming soon!",

    // features.html specific
    "header-get-started-btn": "Get Started feature coming soon!",
    "cta-request-demo-btn": "Demo request coming soon!",
    "cta-contact-sales-btn": "Sales contact coming soon!",

    // services.html specific
    "request-quote-btn": "Quote request coming soon!",
    "contact-sales-btn": "Sales contact coming soon!",
  };

  Object.keys(comingSoonButtons).forEach((id) => {
    const button = document.getElementById(id);
    if (button) {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        showToast(comingSoonButtons[id]);
      });
    }
  });
});
