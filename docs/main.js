let analyticsPollInterval = null;
let notificationsPollInterval = null;
let adminMapPollInterval = null;

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

  // Test Settings Button
  const testSettingsBtn = document.getElementById("test-settings-btn");
  if (testSettingsBtn) {
    testSettingsBtn.addEventListener("click", () => {
      // Create a temporary admin user for testing
      const testUser = {
        name: "Test Admin",
        email: "admin@logixpress.com",
        role: "admin",
      };
      renderAdminDashboard(testUser);
      // Automatically show settings
      setTimeout(() => {
        renderAdminSettingsSection();
      }, 100);
    });
  }

  const showToast = (message = "Coming Soon!", type = "success") => {
    // Create a new toast element for admin notifications
    const toast = document.createElement("div");
    const bgColor =
      type === "error"
        ? "bg-red-600"
        : type === "warning"
        ? "bg-yellow-600"
        : "bg-green-600";
    const icon =
      type === "error"
        ? "fas fa-exclamation-circle"
        : type === "warning"
        ? "fas fa-exclamation-triangle"
        : "fas fa-check-circle";

    toast.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300 flex items-center gap-2`;
    toast.innerHTML = `<i class="${icon}"></i><span>${message}</span>`;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.remove("translate-x-full");
    }, 100);

    setTimeout(() => {
      toast.classList.add("translate-x-full");
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 4000);
  };
  window.showToast = showToast;

  // Feature Navigation (from features.html)
  const featureButtons = document.querySelectorAll(
    "#all-features-btn, #tracking-btn, #analytics-btn, #management-btn, #security-btn"
  );
  const featureContents = document.querySelectorAll(".feature-content");

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
      selectedButton.classList.remove("bg-white", "border", "border-gray-300");
      selectedButton.classList.add("bg-blue-600", "text-white");
    }
  };

  // Add event listeners for feature buttons
  if (document.getElementById("all-features-btn")) {
    document
      .getElementById("all-features-btn")
      .addEventListener("click", () => {
        showFeatureContent("all-features");
        const btn = document.getElementById("all-features-btn");
        btn.classList.add("bg-blue-600", "text-white");
        btn.classList.remove("bg-white", "border", "border-gray-300");
      });
  }
  if (document.getElementById("tracking-btn")) {
    document
      .getElementById("tracking-btn")
      .addEventListener("click", () => showFeatureContent("tracking"));
  }
  if (document.getElementById("analytics-btn")) {
    document
      .getElementById("analytics-btn")
      .addEventListener("click", () => showFeatureContent("analytics"));
  }
  if (document.getElementById("management-btn")) {
    document
      .getElementById("management-btn")
      .addEventListener("click", () => showFeatureContent("management"));
  }
  if (document.getElementById("security-btn")) {
    document
      .getElementById("security-btn")
      .addEventListener("click", () => showFeatureContent("security"));
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
  // const comingSoonButtons = {
  //   "get-started-btn": "Get Started feature coming soon!",
  //   "mobile-get-started-btn": "Get Started feature coming soon!",
  //   "start-tracking-btn": "Tracking feature coming soon!",
  //   "track-package-btn": "Package tracking coming soon!",
  //   "send-message-btn": "Contact form coming soon!",
  //   "cta-get-started-btn": "Get Started feature coming soon!",
  //   "request-demo-btn": "Demo request coming soon!",
  //   "request-quote-btn": "Quote request coming soon!",
  //   "contact-sales-btn": "Sales contact coming soon!",
  // };

  // Object.keys(comingSoonButtons).forEach((id) => {
  //   const button = document.getElementById(id);
  //   if (button) {
  //     button.addEventListener("click", (e) => {
  //       e.preventDefault();
  //       showToast(comingSoonButtons[id]);
  //     });
  //   }
  // });

  // --- Dynamic Login Modal ---
  function createRegisterModal() {
    // Remove existing modal if present
    const existing = document.getElementById("login-modal");
    if (existing) existing.remove();

    const modal = document.createElement("div");
    modal.id = "login-modal";
    modal.className =
      "fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center";
    modal.innerHTML = `
      <div class="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full relative">
        <button id="close-login-modal" class="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
        <h2 class="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <form id="register-form" class="space-y-4">
          <div>
            <label class="block text-gray-700 mb-1">Name</label>
            <input type="text" id="register-name" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-gray-700 mb-1">Email</label>
            <input type="email" id="register-email" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-gray-700 mb-1">Password</label>
            <div class="relative">
              <input type="password" id="register-password" required class="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <button type="button" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 password-toggle">
                <i class="fas fa-eye"></i>
              </button>
            </div>
            <div class="mt-1 text-xs text-gray-500 password-strength"></div>
          </div>
          <button type="submit" class="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-2 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">Create Account</button>
        </form>
        <div class="text-center mt-4 text-sm">
          Already have an account? <a href="#" id="show-login-link" class="text-blue-600 hover:underline">Login</a>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById("close-login-modal").onclick = () => modal.remove();
    modal.onclick = (e) => {
      if (e.target === modal) modal.remove();
    };

    document.getElementById("show-login-link").onclick = (e) => {
      e.preventDefault();
      modal.remove();
      createLoginModal();
    };

    // Password visibility toggle
    document.querySelector(".password-toggle").onclick = function () {
      const input = document.getElementById("register-password");
      const icon = this.querySelector("i");
      if (input.type === "password") {
        input.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
      } else {
        input.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
      }
    };

    // Password strength validation
    document.getElementById("register-password").oninput = function () {
      const password = this.value;
      const strengthDiv = document.querySelector(".password-strength");
      let strength = 0;
      let message = "";

      if (password.length >= 8) strength++;
      if (/[A-Z]/.test(password)) strength++;
      if (/[a-z]/.test(password)) strength++;
      if (/[0-9]/.test(password)) strength++;
      if (/[^A-Za-z0-9]/.test(password)) strength++;

      switch (strength) {
        case 0:
        case 1:
          message = "Very weak";
          strengthDiv.className = "mt-1 text-xs text-red-500";
          break;
        case 2:
          message = "Weak";
          strengthDiv.className = "mt-1 text-xs text-orange-500";
          break;
        case 3:
          message = "Fair";
          strengthDiv.className = "mt-1 text-xs text-yellow-500";
          break;
        case 4:
          message = "Good";
          strengthDiv.className = "mt-1 text-xs text-blue-500";
          break;
        case 5:
          message = "Strong";
          strengthDiv.className = "mt-1 text-xs text-green-500";
          break;
      }
      strengthDiv.textContent = message;
    };

    document.getElementById("register-form").onsubmit = async function (e) {
      e.preventDefault();
      const name = document.getElementById("register-name").value;
      const email = document.getElementById("register-email").value;
      const password = document.getElementById("register-password").value;

      // Client-side password validation
      if (password.length < 8) {
        showToast("Password must be at least 8 characters long", "error");
        return;
      }

      try {
        const res = await fetch("https://logixpress-tracking.onrender.com/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        if (res.ok) {
          showToast("Account created! Please log in.");
          modal.remove();
          createLoginModal();
        } else {
          showToast(data.message || "Registration failed");
        }
      } catch {
        showToast("Registration failed: server error");
      }
    };
  }

  // Update login modal to include sign up link
  function createLoginModal() {
    // Remove existing modal if present
    const existing = document.getElementById("login-modal");
    if (existing) existing.remove();

    const modal = document.createElement("div");
    modal.id = "login-modal";
    modal.className =
      "fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center";
    modal.innerHTML = `
      <div class="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full relative">
        <button id="close-login-modal" class="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
        <h2 class="text-2xl font-bold mb-6 text-center">Login</h2>
        <form id="login-form" class="space-y-4">
          <div>
            <label class="block text-gray-700 mb-1">Email</label>
            <input type="email" id="login-email" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-gray-700 mb-1">Password</label>
            <div class="relative">
              <input type="password" id="login-password" required class="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <button type="button" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 password-toggle">
                <i class="fas fa-eye"></i>
              </button>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <label class="flex items-center">
              <input type="checkbox" id="remember-me" class="mr-2">
              <span class="text-sm text-gray-600">Remember me</span>
            </label>
            <button type="button" class="text-blue-600 hover:text-blue-800 text-sm forgot-password-btn">Forgot Password?</button>
          </div>
          <button type="submit" class="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-2 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">Login</button>
        </form>
        <div class="text-center mt-4 text-sm">
          Don't have an account? <a href="#" id="show-register-link" class="text-blue-600 hover:underline">Sign Up</a>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById("close-login-modal").onclick = () => modal.remove();
    modal.onclick = (e) => {
      if (e.target === modal) modal.remove();
    };

    document.getElementById("show-register-link").onclick = (e) => {
      e.preventDefault();
      modal.remove();
      createRegisterModal();
    };

    // Password visibility toggle
    document.querySelector(".password-toggle").onclick = function () {
      const input = document.getElementById("login-password");
      const icon = this.querySelector("i");
      if (input.type === "password") {
        input.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
      } else {
        input.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
      }
    };

    // Forgot password functionality
    document.querySelector(".forgot-password-btn").onclick = function () {
      modal.remove();
      createForgotPasswordModal();
    };

    document.getElementById("login-form").onsubmit = async function (e) {
      e.preventDefault();
      const email = document.getElementById("login-email").value;
      const password = document.getElementById("login-password").value;
      const rememberMe = document.getElementById("remember-me").checked;

      try {
        const res = await fetch("https://logixpress-tracking.onrender.com/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (res.ok) {
          localStorage.setItem("jwt", data.token);
          if (rememberMe) {
            localStorage.setItem("rememberMe", "true");
          }
          showToast("Login successful!");
          modal.remove();
          // Start session timer
          startSessionTimer();
          // Decode JWT to get user info
          const user = parseJwt(data.token);
          if (user && user.role === "admin") {
            renderAdminDashboard(user);
          } else if (user) {
            showLoggedInUI(user);
          }
        } else {
          showToast(data.message || "Login failed");
        }
      } catch {
        showToast("Login failed: server error");
      }
    };
  }
  window.createLoginModal = createLoginModal;

  function showCustomModal({ title, content, onOpen }) {
    // Remove any existing modal
    const existing = document.getElementById("custom-modal");
    if (existing) existing.remove();

    // Create modal
    const modal = document.createElement("div");
    modal.id = "custom-modal";
    modal.className =
      "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50";
    modal.innerHTML = `
    <div class="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full relative">
      <button id="close-custom-modal" class="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
      <h2 class="text-2xl font-bold mb-4 text-center">${title}</h2>
      <div id="custom-modal-content">${content}</div>
    </div>
  `;
    document.body.appendChild(modal);

    // Close logic
    document.getElementById("close-custom-modal").onclick = () =>
      modal.remove();
    modal.onclick = (e) => {
      if (e.target === modal) modal.remove();
    };

    // Run onOpen callback if provided
    if (typeof onOpen === "function") onOpen();
  }
  window.showCustomModal = showCustomModal;

  // Forgot password modal
  function createForgotPasswordModal() {
    const modal = document.createElement("div");
    modal.className =
      "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50";
    modal.innerHTML = `
      <div class="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full relative">
        <button class="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
        <h2 class="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
        <form id="forgot-password-form" class="space-y-4">
          <div>
            <label class="block text-gray-700 mb-1">Email Address</label>
            <input type="email" id="forgot-email" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button type="submit" class="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-2 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">Send Reset Link</button>
        </form>
        <div class="text-center mt-4 text-sm">
          Remember your password? <a href="#" class="text-blue-600 hover:underline back-to-login">Back to Login</a>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector("button").onclick = () => modal.remove();
    modal.onclick = (e) => {
      if (e.target === modal) modal.remove();
    };

    modal.querySelector(".back-to-login").onclick = (e) => {
      e.preventDefault();
      modal.remove();
      createLoginModal();
    };

    modal.querySelector("#forgot-password-form").onsubmit = async function (e) {
      e.preventDefault();
      const email = document.getElementById("forgot-email").value;

      try {
        const res = await fetch("https://logixpress-tracking.onrender.com/api/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (res.ok) {
          showToast("Password reset link sent to your email!", "success");
          modal.remove();
        } else {
          showToast(data.message || "Failed to send reset link", "error");
        }
      } catch {
        showToast("Failed to send reset link: server error", "error");
      }
    };
  }

  // Helper to remove and restore Get Started group
  let removedGetStartedGroup = null;
  function removeGetStartedGroup() {
    const group = document.querySelector(".hidden.md\\:block.ml-3");
    if (group) {
      removedGetStartedGroup = group;
      group.parentNode.removeChild(group);
    }
  }
  function restoreGetStartedGroup() {
    if (removedGetStartedGroup) {
      const header = document.querySelector("header .container");
      // Insert after nav
      const nav = header.querySelector("nav");
      if (nav && nav.nextSibling) {
        header.insertBefore(removedGetStartedGroup, nav.nextSibling);
      } else {
        header.appendChild(removedGetStartedGroup);
      }
      removedGetStartedGroup = null;
    }
  }

  // Add this helper function (suggested after other nav helpers, e.g., after line 574)
  function restorePublicHamburgerMenu() {
    const header = document.querySelector("header .container");
    if (!header) return;
    // Only add if not already present
    if (!document.getElementById("mobile-menu-button")) {
      const btn = document.createElement("button");
      btn.id = "mobile-menu-button";
      btn.className =
        "md:hidden text-gray-700 text-xl lg:text-2xl border rounded-lg p-3 lg:p-2 hover:bg-gray-100 transition-colors";
      btn.innerHTML = '<i class="bi bi-list"></i>';
      header.appendChild(btn);
      // Re-attach event listeners for mobile menu
      const mobileMenu = document.getElementById("mobile-menu");
      if (mobileMenu) {
        btn.addEventListener("click", () => {
          mobileMenu.classList.toggle("hidden");
        });
        document.addEventListener("click", (e) => {
          if (!btn.contains(e.target) && !mobileMenu.contains(e.target)) {
            mobileMenu.classList.add("hidden");
          }
        });
      }
    }
  }

  // Session timeout functionality
  let sessionTimeout;
  let sessionWarningTimeout;
  const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  const WARNING_TIME = 5 * 60 * 1000; // 5 minutes before timeout

  function startSessionTimer() {
    clearTimeout(sessionTimeout);
    clearTimeout(sessionWarningTimeout);

    sessionWarningTimeout = setTimeout(() => {
      showSessionWarningModal();
    }, SESSION_TIMEOUT - WARNING_TIME);

    sessionTimeout = setTimeout(() => {
      logoutUser();
      showToast("Session expired. Please log in again.", "error");
    }, SESSION_TIMEOUT);
  }

  function resetSessionTimer() {
    startSessionTimer();
  }

  function showSessionWarningModal() {
    const modal = document.createElement("div");
    modal.className =
      "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50";
    modal.innerHTML = `
      <div class="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full relative">
        <div class="text-center">
          <i class="fas fa-clock text-yellow-500 text-4xl mb-4"></i>
          <h2 class="text-2xl font-bold mb-4">Session Expiring Soon</h2>
          <p class="text-gray-600 mb-6">Your session will expire in 5 minutes. Do you want to stay logged in?</p>
          <div class="flex gap-3">
            <button class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors" onclick="extendSession(); this.closest('.fixed').remove()">
              Stay Logged In
            </button>
            <button class="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors" onclick="logoutUser(); this.closest('.fixed').remove()">
              Logout Now
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  function extendSession() {
    resetSessionTimer();
    showToast("Session extended successfully!", "success");
  }
  window.extendSession = extendSession;

  // Custom confirmation modal
  function showConfirmModal(title, message, onConfirm, onCancel) {
    const modal = document.createElement("div");
    modal.className =
      "fixed inset-0 z-[2000] flex items-center justify-center bg-black bg-opacity-50";
    modal.innerHTML = `
      <div class="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full relative">
        <div class="text-center">
          <i class="fas fa-question-circle text-blue-500 text-4xl mb-4"></i>
          <h2 class="text-2xl font-bold mb-4">${title}</h2>
          <p class="text-gray-600 mb-6">${message}</p>
          <div class="flex gap-3">
            <button class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors confirm-btn">
              Confirm
            </button>
            <button class="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors cancel-btn">
              Cancel
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector(".confirm-btn").onclick = () => {
      modal.remove();
      if (onConfirm) onConfirm();
    };

    modal.querySelector(".cancel-btn").onclick = () => {
      modal.remove();
      if (onCancel) onCancel();
    };
  }

  // --- JWT decode helper (simple base64 decode, not secure for prod) ---
  function parseJwt(token) {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  }

  // User nav with mobile menu
  function renderUserNav(user) {
    const header = document.querySelector("header .container");
    if (!header) return;
    // Remove public hamburger menu button if present
    const publicHamburger = document.getElementById("mobile-menu-button");
    if (publicHamburger) publicHamburger.remove();
    const publicNav = header.querySelector("nav");
    removeGetStartedGroup();
    // Remove old user nav if present
    const oldUserNav = document.getElementById("user-nav");
    if (oldUserNav) oldUserNav.remove();
    // Remove public nav
    if (publicNav) publicNav.remove();
    // Remove old user mobile menu if present
    const oldUserMenuBtn = document.getElementById("user-mobile-menu-button");
    if (oldUserMenuBtn) oldUserMenuBtn.remove();
    const oldUserMobileMenu = document.getElementById("user-mobile-menu");
    if (oldUserMobileMenu) oldUserMobileMenu.remove();

    // User nav links (without logout button)
    const navLinks = `
      <a href="#" id="nav-dashboard" class="block px-4 py-2 hover:text-blue-600 transition-colors">Dashboard</a>
      <a href="#" id="nav-create" class="block px-4 py-2 hover:text-blue-600 transition-colors">Create Shipment</a>
      <a href="#" id="nav-notifications" class="block px-4 py-2 hover:text-blue-600 transition-colors relative">Notifications</a>
      <a href="#" id="nav-support" class="block px-4 py-2 hover:text-blue-600 transition-colors">Support</a>
    `;

    // Desktop nav with user profile dropdown
    const userNav = document.createElement("nav");
    userNav.id = "user-nav";
    userNav.className =
      "hidden md:flex flex-1 justify-between items-center text-gray-700 font-medium";
    userNav.innerHTML = `
     <div class="flex flex-row gap-2 md:gap-4 items-center w-full overflow-x-auto whitespace-wrap no-scrollbar">
        <img src="images/logixpresss.png" alt="LogiXpress Logo" class="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16" />
        ${navLinks}
     </div>
      <div class="ml-4 flex items-center relative">
        <button id="user-profile-btn" class="flex items-center text-blue-700 font-semibold hover:text-blue-800 transition-colors">
          <i class='fas fa-user-circle mr-2'></i> 
          <span class="capitalize">${user.name}</span>
          <i class='fas fa-chevron-down ml-2 text-xs'></i>
        </button>
        <div id="user-profile-dropdown" class="hidden absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div class="py-2">
            <a href="#" id="profile-view" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              <i class='fas fa-user mr-2'></i>View Profile
            </a>
            <a href="#" id="profile-shipments" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              <i class='fas fa-box mr-2'></i>My Shipments
            </a>
            <a href="#" id="profile-settings" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              <i class='fas fa-cog mr-2'></i>Settings
            </a>
            <div class="border-t border-gray-200 my-1"></div>
            <button id="profile-logout" class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
              <i class='fas fa-sign-out-alt mr-2'></i>Logout
            </button>
          </div>
        </div>
      </div>
    `;
    header.appendChild(userNav);

    // Mobile menu button
    const userMenuBtn = document.createElement("button");
    userMenuBtn.id = "user-mobile-menu-button";
    userMenuBtn.className =
      "md:hidden text-gray-700 text-xl border rounded-lg p-3 hover:bg-gray-100 transition-colors ml-2";
    userMenuBtn.innerHTML = '<i class="bi bi-list"></i>';
    header.appendChild(userMenuBtn);

    // Mobile menu dropdown
    const userMobileMenu = document.createElement("div");
    userMobileMenu.id = "user-mobile-menu";
    userMobileMenu.className =
      "hidden md:hidden bg-white border-t border-gray-200 shadow-lg absolute left-0 right-0 top-full z-50";
    userMobileMenu.innerHTML = `
      <nav class="flex flex-col space-y-2 py-4">
        ${navLinks}
        <div class='flex items-center px-4 pt-4 text-blue-700 font-semibold'>
          <i class='fas fa-user-circle mr-2'></i> 
          <span class="capitalize">${user.name}</span>
        </div>
        <div class="border-t border-gray-200 my-2"></div>
        <button id="mobile-logout-btn" class="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">
          <i class='fas fa-sign-out-alt mr-2'></i>Logout
        </button>
      </nav>
    `;
    header.appendChild(userMobileMenu);

    // User profile dropdown functionality
    const userProfileBtn = document.getElementById("user-profile-btn");
    const userProfileDropdown = document.getElementById(
      "user-profile-dropdown"
    );

    if (userProfileBtn && userProfileDropdown) {
      userProfileBtn.onclick = (e) => {
        e.stopPropagation();
        userProfileDropdown.classList.toggle("hidden");
      };

      // Hide dropdown on click outside
      document.addEventListener("click", (e) => {
        if (
          !userProfileBtn.contains(e.target) &&
          !userProfileDropdown.contains(e.target)
        ) {
          userProfileDropdown.classList.add("hidden");
        }
      });

      // Profile dropdown links
      document.getElementById("profile-view").onclick = (e) => {
        e.preventDefault();
        userProfileDropdown.classList.add("hidden");
        renderSettingsView(user);
      };

      document.getElementById("profile-shipments").onclick = (e) => {
        e.preventDefault();
        userProfileDropdown.classList.add("hidden");
        renderDashboard(user);
        fetchAndRenderShipments();
        fetchAndRenderAnalytics();
        fetchAndRenderNotifications();
      };

      document.getElementById("profile-settings").onclick = (e) => {
        e.preventDefault();
        userProfileDropdown.classList.add("hidden");
        renderSettingsView(user);
      };

      document.getElementById("profile-logout").onclick = (e) => {
        e.preventDefault();
        userProfileDropdown.classList.add("hidden");
        logoutUser();
      };
    }

    userMenuBtn.onclick = () => {
      userMobileMenu.classList.toggle("hidden");
    };

    // Hide mobile menu on click outside
    document.addEventListener("click", (e) => {
      if (
        !userMenuBtn.contains(e.target) &&
        !userMobileMenu.contains(e.target)
      ) {
        userMobileMenu.classList.add("hidden");
      }
    });

    // Mobile logout logic
    const mobileLogoutBtn = document.getElementById("mobile-logout-btn");
    if (mobileLogoutBtn) {
      mobileLogoutBtn.onclick = () => logoutUser();
    }

    // Ensure nav links are always set up after nav is rendered
    setTimeout(() => setupNavLinks(user), 0);
  }

  // --- Dashboard/Main Area Refactor ---
  function renderDashboard(user) {
    document
      .querySelectorAll("main, section")
      .forEach((el) => (el.style.display = "none"));
    const footer = document.querySelector("footer");
    if (footer) footer.style.display = "";
    const oldDash = document.getElementById("user-dashboard");
    if (oldDash) oldDash.remove();
    const dash = document.createElement("main");
    dash.id = "user-dashboard";
    dash.className = "container mx-auto px-2 sm:px-4 py-6 min-h-[70vh]";
    dash.innerHTML = `
      <!-- Welcome Section -->
      <div class="mb-8">
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-blue-700">
          Welcome, <span class="capitalize">${user.name}</span> 👋
        </h1>
        <p class="text-gray-600 text-sm sm:text-base">
          Let's get started by tracking or creating your first shipment.
        </p>
      </div>

      <!-- Tracking Box -->
      <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6">
        <h2 class="text-lg font-semibold mb-4 text-gray-800">🔍 Track Your Package</h2>
        <form id="track-shipment-form" class="flex flex-col sm:flex-row gap-2">
          <input 
            type="text" 
            id="track-shipment-input" 
            placeholder="Enter tracking number" 
            class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
            required 
          />
          <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
            Track
          </button>
        </form>
        <div id="track-shipment-result" class="mt-4"></div>
      </div>

      <!-- Main Dashboard Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- My Shipments Section -->
        <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <div class="flex items-center mb-4">
            <i class="fas fa-box text-blue-600 text-xl sm:text-2xl mr-2"></i>
            <h2 class="text-base sm:text-lg font-bold">📦 My Shipments</h2>
          </div>
          <div id="shipments-table-container"></div>
        </div>

        <!-- Delivery Analytics Widget -->
        <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <div class="flex items-center mb-4">
            <i class="fas fa-chart-line text-purple-600 text-xl sm:text-2xl mr-2"></i>
            <h2 class="text-base sm:text-lg font-bold">📊 Delivery Analytics</h2>
          </div>
          <div id="analytics-widget"></div>
        </div>

        <!-- Shipment Journey / Map Panel -->
        <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <div class="flex items-center mb-4">
            <i class="fas fa-map-marker-alt text-green-600 text-xl sm:text-2xl mr-2"></i>
            <h2 class="text-base sm:text-lg font-bold">🗺️ Shipment Journey</h2>
          </div>
          <div id="map-panel" class="text-center py-8">
            <div class="text-gray-400 text-6xl mb-4">🗺️</div>
            <h3 class="text-lg font-semibold text-gray-700 mb-2">📭 No active shipments</h3>
            <p class="text-gray-500 text-sm">Live tracking will be shown here when a package is in transit.</p>
          </div>
        </div>

        <!-- Notifications Panel -->
        <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <div class="flex items-center mb-4">
            <i class="fas fa-bell text-orange-600 text-xl sm:text-2xl mr-2"></i>
            <h2 class="text-base sm:text-lg font-bold">🔔 Notifications</h2>
          </div>
          <div id="notifications-panel" class="text-center py-6">
            <div class="text-gray-400 text-4xl mb-3">🔕</div>
            <h3 class="text-lg font-semibold text-gray-700 mb-2">No notifications</h3>
            <p class="text-gray-500 text-sm">You'll receive important updates here — like shipment status, delays, and promotions.</p>
          </div>
        </div>

        <!-- Invoice/History Section -->
        <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <div class="flex items-center mb-4">
            <i class="fas fa-file-invoice text-indigo-600 text-xl sm:text-2xl mr-2"></i>
            <h2 class="text-base sm:text-lg font-bold">🧾 Invoice & History</h2>
          </div>
          <div class="text-center py-6">
            <div class="text-gray-400 text-4xl mb-3">🧾</div>
            <h3 class="text-lg font-semibold text-gray-700 mb-2">No past activity</h3>
            <p class="text-gray-500 text-sm">You can download your invoices and shipment history once activity starts.</p>
          </div>
        </div>

        <!-- Support Section -->
        <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <div class="flex items-center mb-4">
            <i class="fas fa-headset text-teal-600 text-xl sm:text-2xl mr-2"></i>
            <h2 class="text-base sm:text-lg font-bold">💬 Support</h2>
          </div>
          <div class="space-y-4">
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-800 mb-2">Frequently Asked Questions</h3>
              <div class="space-y-2 text-sm">
                <details class="group">
                  <summary class="cursor-pointer font-medium text-gray-700 hover:text-blue-600">
                    How do I start shipping?
                  </summary>
                  <p class="mt-2 text-gray-600">Click the "Create New Shipment" button in the My Shipments section to get started with your first delivery.</p>
                </details>
                <details class="group">
                  <summary class="cursor-pointer font-medium text-gray-700 hover:text-blue-600">
                    Where can I get tracking IDs?
                  </summary>
                  <p class="mt-2 text-gray-600">Tracking IDs are provided when you create a shipment or receive a package from someone using our service.</p>
                </details>
              </div>
            </div>
            <button class="w-full bg-teal-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-teal-700 transition">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    `;
    if (footer && footer.parentNode) {
      footer.parentNode.insertBefore(dash, footer);
    } else {
      document.body.appendChild(dash);
    }

    // Initialize empty states
    renderShipmentsTable([]);
    renderAnalyticsWidget(null);

    // Setup tracking form
    const trackForm = document.getElementById("track-shipment-form");
    const trackInput = document.getElementById("track-shipment-input");
    const trackResult = document.getElementById("track-shipment-result");
    if (trackForm && trackInput && trackResult) {
      trackForm.onsubmit = async function (e) {
        e.preventDefault();
        trackResult.innerHTML = '<div class="text-gray-400">Searching...</div>';
        const jwt = localStorage.getItem("jwt");
        try {
          const res = await fetch("https://logixpress-tracking.onrender.com/api/shipments/track", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + jwt,
            },
            body: JSON.stringify({ trackingNumber: trackInput.value }),
          });
          const data = await res.json();
          if (res.ok) {
            trackResult.innerHTML = `<div class='text-green-600 font-semibold mb-2'>Shipment Found:</div>
              <div class='text-sm'>Tracking #: <span class='font-bold'>${
                data.trackingNumber
              }</span></div>
              <div class='text-sm'>Status: <span class='font-bold'>${
                data.status
              }</span></div>
              <div class='text-sm'>ETA: <span class='font-bold'>${
                data.estimatedDelivery
                  ? new Date(data.estimatedDelivery).toLocaleDateString()
                  : "N/A"
              }</span></div>`;
          } else {
            trackResult.innerHTML = `<div class='text-red-500'>${
              data.message || "Shipment not found."
            }</div>`;
          }
        } catch {
          trackResult.innerHTML =
            '<div class="text-red-500">Error searching for shipment.</div>';
        }
      };
    }
    // Always update dashboard notifications card after rendering
    fetchAndRenderNotifications();
  }

  // --- Feature Views ---
  function renderNotificationsView() {
    document
      .querySelectorAll("main, section")
      .forEach((el) => (el.style.display = "none"));
    const footer = document.querySelector("footer");
    if (footer) footer.style.display = "";
    const old = document.getElementById("user-dashboard");
    if (old) old.remove();
    const dash = document.createElement("main");
    dash.id = "user-dashboard";
    dash.className = "container mx-auto px-2 sm:px-4 py-6 min-h-[70vh]";
    dash.innerHTML = `
      <div class="mb-6">
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-blue-700">Notifications</h1>
        <p class="text-gray-600">Stay updated with your shipment status and important alerts</p>
      </div>
      <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 flex flex-col mb-6">
        <div id="notifications-list"></div>
      </div>
    `;
    if (footer && footer.parentNode) {
      footer.parentNode.insertBefore(dash, footer);
    } else {
      document.body.appendChild(dash);
    }
    fetchAndRenderNotifications();
  }

  function renderSupportView() {
    document
      .querySelectorAll("main, section")
      .forEach((el) => (el.style.display = "none"));
    const footer = document.querySelector("footer");
    if (footer) footer.style.display = "";
    const old = document.getElementById("user-dashboard");
    if (old) old.remove();
    const dash = document.createElement("main");
    dash.id = "user-dashboard";
    dash.className = "container mx-auto px-2 sm:px-4 py-6 min-h-[70vh]";
    dash.innerHTML = `
      <div class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-blue-700">Support / Help Center</h1>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 flex flex-col mb-6">
        <div id="support-widget"></div>
      </div>
    `;
    if (footer && footer.parentNode) {
      footer.parentNode.insertBefore(dash, footer);
    } else {
      document.body.appendChild(dash);
    }
    renderSupportWidget();
  }

  function renderSettingsView(user) {
    document
      .querySelectorAll("main, section")
      .forEach((el) => (el.style.display = "none"));
    const footer = document.querySelector("footer");
    if (footer) footer.style.display = "";
    const old = document.getElementById("user-dashboard");
    if (old) old.remove();
    const dash = document.createElement("main");
    dash.id = "user-dashboard";
    dash.className = "container mx-auto px-2 sm:px-4 py-6 min-h-[70vh]";
    dash.innerHTML = `
      <div class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-blue-700">Account Settings</h1>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 flex flex-col mb-6">
        <div id="settings-widget"></div>
      </div>
    `;
    if (footer && footer.parentNode) {
      footer.parentNode.insertBefore(dash, footer);
    } else {
      document.body.appendChild(dash);
    }
    renderSettingsWidget(user);
  }

  // --- Nav Link Handlers ---
  function setupNavLinks(user) {
    const navIds = [
      "nav-dashboard",
      "nav-create",
      "nav-track",
      "nav-notifications",
      "nav-support",
      "nav-settings",
    ];
    navIds.forEach((id) => {
      document.querySelectorAll(`#${id}`).forEach((el) => {
        el.onclick = (e) => {
          e.preventDefault();
          if (window.innerWidth < 768) {
            const userMobileMenu = document.getElementById("user-mobile-menu");
            if (userMobileMenu) userMobileMenu.classList.add("hidden");
          }
          switch (id) {
            case "nav-dashboard":
              renderDashboard(user);
              fetchAndRenderShipments();
              fetchAndRenderAnalytics();
              fetchAndRenderNotifications();
              break;
            case "nav-create":
              renderCreateShipmentView();
              break;
            case "nav-track":
              renderTrackShipmentView();
              break;
            case "nav-notifications":
              renderNotificationsView();
              break;
            case "nav-support":
              renderSupportView();
              break;
            case "nav-settings":
              renderSettingsView(user);
              break;
          }
        };
      });
    });
  }

  // --- Replace old showLoggedInUI logic ---
  function showLoggedInUI(user) {
    renderUserNav(user);
    renderDashboard(user);
    setupNavLinks(user);
    fetchAndRenderShipments();
    fetchAndRenderAnalytics();

    // Add user activity tracking to reset session timer
    document.addEventListener("click", resetSessionTimer);
    document.addEventListener("keypress", resetSessionTimer);
    document.addEventListener("mousemove", resetSessionTimer);
  }

  // Attach login modal to Get Started buttons
  const getStartedBtns = [
    document.getElementById("get-started-btn"),
    document.getElementById("mobile-get-started-btn"),
    document.getElementById("cta-get-started-btn"),
  ].filter(Boolean);
  getStartedBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      createLoginModal();
    });
  });

  // On page load, show dashboard if JWT exists
  const jwt = localStorage.getItem("jwt");
  if (jwt) {
    const user = parseJwt(jwt);
    if (user && user.role === "admin") {
      renderAdminDashboard(user);
    } else if (user && user.name && user.email) {
      showLoggedInUI(user);
    }
  }

  async function fetchAndRenderShipments() {
    const jwt = localStorage.getItem("jwt");
    const container = document.getElementById("shipments-table-container");
    if (!container) return;
    container.innerHTML =
      '<div class="text-gray-400">Loading shipments...</div>';
    if (!jwt) {
      container.innerHTML =
        '<div class="text-red-500">Not authenticated.</div>';
      return;
    }
    try {
      const res = await fetch("https://logixpress-tracking.onrender.com/api/shipments", {
        headers: { Authorization: "Bearer " + jwt },
      });
      if (!res.ok) {
        container.innerHTML =
          '<div class="text-red-500">Failed to load shipments.</div>';
        return;
      }
      const shipments = await res.json();
      renderShipmentsTable(shipments);
      renderShipmentJourney(shipments); // <-- update journey card
    } catch {
      container.innerHTML =
        '<div class="text-red-500">Error loading shipments.</div>';
    }
  }

  // Add function to render dashboard notifications card
  function renderDashboardNotifications(notifications) {
    const container = document.getElementById("notifications-panel");
    if (!container) return;
    if (!notifications || notifications.length === 0) {
      container.innerHTML = `
        <div class="text-gray-400 text-4xl mb-3">🔕</div>
        <h3 class="text-lg font-semibold text-gray-700 mb-2">No notifications</h3>
        <p class="text-gray-500 text-sm">You'll receive important updates here — like shipment status, delays, and promotions.</p>
      `;
      return;
    }
    // Show at least 2 most recent notifications (or all if less than 2)
    const latest = notifications.slice(0, Math.max(2, notifications.length));
    container.innerHTML = latest
      .map((n) => {
        const title = n.title || "Notification";
        const date = n.createdAt || n.date;
        const dateString = date ? new Date(date).toLocaleDateString() : "";
        return `
        <div class="mb-3 p-3 bg-white rounded shadow border border-gray-100">
          <div class="font-semibold text-blue-700 mb-1">${title}</div>
          <div class="text-gray-700 text-sm mb-1">${n.message}</div>
          <div class="text-xs text-gray-500">${dateString}</div>
        </div>
      `;
      })
      .join("");
    // Add 'View All' button
    container.innerHTML += `
      <div class="mt-2 text-center">
        <button id="view-all-notifications-btn" class="text-blue-600 hover:underline font-semibold">View All</button>
      </div>
    `;
    // Add click handler to navigate to notifications page
    const viewAllBtn = document.getElementById("view-all-notifications-btn");
    if (viewAllBtn) {
      viewAllBtn.onclick = () => {
        renderNotificationsView();
      };
    }
  }

  // Patch fetchAndRenderNotifications to update dashboard card as well
  async function fetchAndRenderNotifications() {
    const jwt = localStorage.getItem("jwt");
    const container = document.getElementById("notifications-list");
    if (container) {
      container.innerHTML =
        '<div class="text-gray-400">Loading notifications...</div>';
      if (!jwt) {
        container.innerHTML =
          '<div class="text-red-500">Not authenticated.</div>';
        return;
      }
    }
    try {
      const res = await fetch("https://logixpress-tracking.onrender.com/api/notifications", {
        headers: { Authorization: "Bearer " + jwt },
      });
      if (container && !res.ok) {
        container.innerHTML =
          '<div class="text-red-500">Failed to load notifications.</div>';
        return;
      }
      const notifications = await res.json();
      if (container) renderNotifications(notifications);
      renderDashboardNotifications(notifications); // always update dashboard card
    } catch {
      if (container) {
        container.innerHTML =
          '<div class="text-red-500">Error loading notifications.</div>';
      }
    }
  }

  async function fetchAndRenderAnalytics() {
    const jwt = localStorage.getItem("jwt");
    const container = document.getElementById("analytics-widget");
    if (!container) return;
    container.innerHTML =
      '<div class="text-gray-400">Loading analytics...</div>';
    if (!jwt) {
      container.innerHTML =
        '<div class="text-red-500">Not authenticated.</div>';
      return;
    }
    try {
      const res = await fetch("https://logixpress-tracking.onrender.com/api/analytics", {
        headers: { Authorization: "Bearer " + jwt },
      });
      if (!res.ok) {
        container.innerHTML =
          '<div class="text-red-500">Failed to load analytics.</div>';
        return;
      }
      const data = await res.json();
      if (!data) {
        container.innerHTML =
          '<div class="text-gray-500">No analytics data.</div>';
        return;
      }
      container.innerHTML = `
        <div class='mb-2'><span class='font-semibold'>Shipments Delivered This Month:</span> ${
          data.deliveredThisMonth
        }</div>
        <div class='mb-2'><span class='font-semibold'>Average Delivery Time:</span> ${
          data.avgDeliveryTime
        } days</div>
        <div class='mb-2'><span class='font-semibold'>Missed Deliveries:</span> ${
          data.missedDeliveries
        }</div>
        <div class='mb-2'><span class='font-semibold'>Regions Delivered To:</span> ${
          data.regions && data.regions.length ? data.regions.join(", ") : "N/A"
        }</div>
      `;
    } catch {
      container.innerHTML =
        '<div class="text-red-500">Error loading analytics.</div>';
    }
  }

  // --- Logout Function ---
  function logoutUser() {
    // Show custom confirmation modal instead of browser confirm
    showConfirmModal(
      "Logout",
      "Are you sure you want to logout?",
      () => {
        // Clear JWT token
        localStorage.removeItem("jwt");
        // Show success message
        showToast("Logged out successfully!");
        // Reload page to show public UI
        setTimeout(() => {
          location.reload();
        }, 1000);
        stopAdminPolling();
        stopAdminMapPolling();
      },
      null
    );
  }
  window.logoutUser = logoutUser;

  // --- Missing Functions ---
  function renderShipmentsTable(shipments) {
    const container = document.getElementById("shipments-table-container");
    if (!container) return;

    if (!shipments || shipments.length === 0) {
      container.innerHTML = `
        <div class="text-center py-8">
          <div class="text-gray-400 text-6xl mb-4">📦</div>
          <h3 class="text-lg font-semibold text-gray-700 mb-2">⚠️ No shipments yet</h3>
          <p class="text-gray-500 text-sm mb-4">You haven't created or received any shipments. Once you do, they'll appear here.</p>
          <button onclick="renderCreateShipmentView()" class="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
            + Create New Shipment
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="overflow-x-auto sm:overflow-x-visible">
        <div class="w-full flex flex-col min-w-0">
          <div class="w-full flex flex-col min-w-0">
            <table class="w-full min-w-0 break-words text-xs sm:text-sm">
              <thead>
                <tr class="bg-blue-50 text-blue-700">
                  <th class="px-2 sm:px-4 py-2 sm:py-3 text-left font-medium uppercase tracking-wider">Tracking #</th>
                  <th class="px-2 sm:px-4 py-2 sm:py-3 text-left font-medium uppercase tracking-wider">Status</th>
                  <th class="px-2 sm:px-4 py-2 sm:py-3 text-left font-medium uppercase tracking-wider">ETA</th>
                  <th class="px-2 sm:px-4 py-2 sm:py-3 text-left font-medium uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody id="shipments-table-body">
                ${shipments
                  .map(
                    (s) => `
                      <tr class="border-b hover:bg-blue-50 transition-colors">
                        <td class="px-2 sm:px-4 py-2 sm:py-3 font-mono">${
                          s.trackingNumber
                        }</td>
                        <td class="px-2 sm:px-4 py-2 sm:py-3">
                          <span class="px-2 py-1 rounded-full text-xs font-medium ${
                            s.status === "Delivered"
                              ? "bg-green-100 text-green-800"
                              : s.status === "In Transit"
                              ? "bg-blue-100 text-blue-800"
                              : s.status === "Pending Pickup"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }">${s.status}</span>
                        </td>
                        <td class="px-2 sm:px-4 py-2 sm:py-3">${
                          s.estimatedDelivery
                            ? new Date(s.estimatedDelivery).toLocaleDateString()
                            : "-"
                        }</td>
                        <td class="px-2 sm:px-4 py-2 sm:py-3">
                          <button onclick='viewShipmentDetails(JSON.parse(this.getAttribute("data-shipment")))' data-shipment='${JSON.stringify(
                            s
                          ).replace(
                            /'/g,
                            "&apos;"
                          )}' class="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50" title="View Details">
                            <i class="fas fa-eye text-sm"></i>
                          </button>
                        </td>
                      </tr>
                    `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  function renderAnalyticsWidget(data) {
    const container = document.getElementById("analytics-widget");
    if (!container) return;

    if (!data) {
      container.innerHTML = `
        <div class="text-center py-6">
          <div class="text-gray-400 text-4xl mb-3">📊</div>
          <h3 class="text-lg font-semibold text-gray-700 mb-2">🚫 No analytics yet</h3>
          <p class="text-gray-500 text-sm mb-4">Delivery stats will be shown after you complete your first shipment.</p>
          <div class="bg-gray-100 rounded-lg p-4 opacity-50">
            <div class="text-xs text-gray-500 mb-2">Coming Soon</div>
            <div class="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      `;
      return;
    }

    // Fix: Map region objects to names
    const regionNames =
      data.regions && data.regions.length
        ? data.regions
            .map((r) => r.name || r.country || r.toString())
            .join(", ")
        : "N/A";

    container.innerHTML = `
      <div class="space-y-3">
        <div class="flex justify-between items-center">
          <span class="text-sm font-medium">Delivered This Month:</span>
          <span class="font-bold text-green-600">${
            data.deliveredThisMonth || 0
          }</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-sm font-medium">Avg Delivery Time:</span>
          <span class="font-bold text-blue-600">${
            data.avgDeliveryTime || 0
          } days</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-sm font-medium">Missed Deliveries:</span>
          <span class="font-bold text-red-600">${
            data.missedDeliveries || 0
          }</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-sm font-medium">Regions:</span>
          <span class="font-bold text-purple-600">${regionNames}</span>
        </div>
      </div>
    `;
  }

  // Add logic to render active shipments in Shipment Journey
  function renderShipmentJourney(shipments) {
    const container = document.getElementById("map-panel");
    if (!container) return;
    const active = shipments.filter((s) => s.status === "In Transit");
    if (active.length === 0) {
      container.innerHTML = `
        <div class="text-gray-400 text-6xl mb-4">🗺️</div>
        <h3 class="text-lg font-semibold text-gray-700 mb-2">📭 No active shipments</h3>
        <p class="text-gray-500 text-sm">Live tracking will be shown here when a package is in transit.</p>
      `;
      return;
    }
    container.innerHTML = `<div id="live-map" style="height: 350px;" class="rounded-lg shadow mb-4"></div>
      <div class="flex items-center gap-4 mt-2">
        <div class="flex items-center gap-1"><span class="bg-blue-600 w-3 h-3 rounded-full inline-block"></span> <span class="text-xs">Truck (Current)</span></div>
        <div class="flex items-center gap-1"><span class="bg-red-600 w-3 h-3 rounded-full inline-block"></span> <span class="text-xs">Destination</span></div>
      </div>`;
    setTimeout(() => {
      // Remove any previous map instance
      if (window.liveMap && window.liveMap.remove) {
        window.liveMap.remove();
      }
      // Center map on Nigeria or first active shipment
      let center = [9.082, 8.6753];
      if (active[0].sender && active[0].sender.lat && active[0].sender.lng) {
        center = [active[0].sender.lat, active[0].sender.lng];
      }
      window.liveMap = L.map("live-map").setView(center, 6);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(window.liveMap);
      active.forEach((s) => {
        // Truck marker (current location)
        if (s.sender && s.sender.lat && s.sender.lng) {
          L.marker([s.sender.lat, s.sender.lng], {
            icon: L.divIcon({
              className: "",
              html: '<div style="background:#2563eb;color:white;border-radius:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center;"><i class="fas fa-truck"></i></div>',
              iconSize: [24, 24],
              iconAnchor: [12, 12],
            }),
          })
            .addTo(window.liveMap)
            .bindPopup(
              `<b>Tracking #:</b> ${s.trackingNumber}<br><b>Status:</b> ${s.status}`
            );
        }
        // Destination marker
        if (s.recipient && s.recipient.lat && s.recipient.lng) {
          L.marker([s.recipient.lat, s.recipient.lng], {
            icon: L.divIcon({
              className: "",
              html: '<div style="background:#dc2626;color:white;border-radius:50%;width:20px;height:20px;display:flex;align-items:center;justify-content:center;"><i class="fas fa-map-marker-alt"></i></div>',
              iconSize: [20, 20],
              iconAnchor: [10, 20],
            }),
          })
            .addTo(window.liveMap)
            .bindPopup(`<b>Destination</b><br>${s.recipient.address}`);
        }
      });
    }, 100);
  }

  function renderCreateShipmentView() {
    document
      .querySelectorAll("main, section")
      .forEach((el) => (el.style.display = "none"));
    const footer = document.querySelector("footer");
    if (footer) footer.style.display = "";
    const old = document.getElementById("user-dashboard");
    if (old) old.remove();
    const dash = document.createElement("main");
    dash.id = "user-dashboard";
    dash.className = "container mx-auto px-2 sm:px-4 py-6 min-h-[70vh]";
    dash.innerHTML = `
      <div class="mb-6">
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-blue-700">Create New Shipment</h1>
        <p class="text-gray-600">Fill in the details below to create your shipment</p>
      </div>
      
      <div class="max-w-4xl mx-auto">
        <form id="create-shipment-form" class="space-y-8">
          <!-- Step 1: Sender Information -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span class="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">1</span>
              Sender Information
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Sender Name *</label>
                <input type="text" id="sender-name" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Contact Number *</label>
                <input type="tel" id="sender-phone" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input type="email" id="sender-email" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Pickup Address *</label>
                <textarea id="sender-address" rows="3" required placeholder="Enter complete pickup address" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
              </div>
            </div>
          </div>

          <!-- Step 2: Receiver Information -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span class="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">2</span>
              Receiver Information
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Recipient Name *</label>
                <input type="text" id="recipient-name" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Contact Number *</label>
                <input type="tel" id="recipient-phone" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Delivery Address *</label>
                <textarea id="recipient-address" rows="3" required placeholder="Enter complete delivery address" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                <div id="recipient-map" style="height: 250px; display: none; margin-top: 1rem;"></div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Country/Region *</label>
                <select id="recipient-country" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select Country</option>
                  <option value="NG">Nigeria</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                  <option value="AU">Australia</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="JP">Japan</option>
                  <option value="CN">China</option>
                  <option value="IN">India</option>
                  <option value="BR">Brazil</option>
                  <option value="MX">Mexico</option>
                  <option value="ZA">South Africa</option>
                  <option value="KE">Kenya</option>
                  <option value="EG">Egypt</option>
                  <option value="GH">Ghana</option>
                  <option value="RU">Russia</option>
                  <option value="IT">Italy</option>
                  <option value="ES">Spain</option>
                  <option value="TR">Turkey</option>
                  <option value="SA">Saudi Arabia</option>
                  <option value="KR">South Korea</option>
                  <option value="SG">Singapore</option>
                  <option value="AR">Argentina</option>
                  <option value="CO">Colombia</option>
                  <option value="ID">Indonesia</option>
                  <option value="PK">Pakistan</option>
                  <option value="PL">Poland</option>
                  <option value="UA">Ukraine</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Step 3: Package Details -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span class="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">3</span>
              Package Details
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Package Description *</label>
                <textarea id="package-description" rows="3" required placeholder="Describe the contents of your package" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Weight (kg) *</label>
                <input type="number" id="package-weight" step="0.1" min="0.1" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                <input type="number" id="package-quantity" min="1" value="1" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Length (cm)</label>
                <input type="number" id="package-length" step="0.1" min="0" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Width (cm)</label>
                <input type="number" id="package-width" step="0.1" min="0" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                <input type="number" id="package-height" step="0.1" min="0" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Value ($)</label>
                <input type="number" id="package-value" step="0.01" min="0" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </div>

          <!-- Step 4: Shipment Preferences -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span class="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">4</span>
              Shipment Preferences
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Delivery Type *</label>
                <div class="space-y-2">
                  <label class="flex items-center">
                    <input type="radio" name="delivery-type" value="standard" checked class="mr-2 text-blue-600" />
                    <span class="text-sm">Standard (3-5 business days)</span>
                  </label>
                  <label class="flex items-center">
                    <input type="radio" name="delivery-type" value="express" class="mr-2 text-blue-600" />
                    <span class="text-sm">Express (1-2 business days)</span>
                  </label>
                  <label class="flex items-center">
                    <input type="radio" name="delivery-type" value="same-day" class="mr-2 text-blue-600" />
                    <span class="text-sm">Same-Day (Same day delivery)</span>
                  </label>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Additional Options</label>
                <div class="space-y-2">
                  <label class="flex items-center">
                    <input type="checkbox" id="insurance" class="mr-2 text-blue-600" />
                    <span class="text-sm">Insurance Coverage</span>
                  </label>
                  <label class="flex items-center">
                    <input type="checkbox" id="signature-required" class="mr-2 text-blue-600" />
                    <span class="text-sm">Require Signature on Delivery</span>
                  </label>
                  <label class="flex items-center">
                    <input type="checkbox" id="notify-receiver" checked class="mr-2 text-blue-600" />
                    <span class="text-sm">Notify Receiver via Email/SMS</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end">
            <button type="submit" class="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Review Shipment
            </button>
          </div>
        </form>
      </div>
    `;
    if (footer && footer.parentNode) {
      footer.parentNode.insertBefore(dash, footer);
    } else {
      document.body.appendChild(dash);
    }

    // Auto-fill sender information from user profile
    const user = parseJwt(localStorage.getItem("jwt"));
    if (user) {
      document.getElementById("sender-name").value = user.name || "";
      document.getElementById("sender-email").value = user.email || "";
    }

    // Setup form submission
    const form = document.getElementById("create-shipment-form");
    if (form) {
      form.onsubmit = async function (e) {
        e.preventDefault();
        renderShipmentReview();
      };
    }

    // Setup Leaflet map for recipient address
    const recipientAddress = document.getElementById("recipient-address");
    const recipientMapDiv = document.getElementById("recipient-map");
    let recipientMap, recipientMarker;
    window.recipientLocation = null;

    if (recipientAddress && recipientMapDiv) {
      recipientAddress.addEventListener("focus", function () {
        recipientMapDiv.style.display = "block";
        setTimeout(() => {
          if (!recipientMap) {
            recipientMap = L.map("recipient-map").setView([9.082, 8.6753], 6); // Center on Nigeria
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
              attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(recipientMap);
            recipientMap.on("click", function (e) {
              if (recipientMarker) {
                recipientMap.removeLayer(recipientMarker);
              }
              recipientMarker = L.marker(e.latlng, { draggable: true }).addTo(
                recipientMap
              );
              window.recipientLocation = e.latlng;
              recipientMarker.on("dragend", function (ev) {
                window.recipientLocation = ev.target.getLatLng();
              });
            });
          } else {
            recipientMap.invalidateSize();
          }
        }, 200);
      });
    }
  }

  function renderShipmentReview() {
    // Collect form data
    const formData = {
      sender: {
        name: document.getElementById("sender-name").value,
        phone: document.getElementById("sender-phone").value,
        email: document.getElementById("sender-email").value,
        address: document.getElementById("sender-address").value,
      },
      recipient: {
        name: document.getElementById("recipient-name").value,
        phone: document.getElementById("recipient-phone").value,
        address: document.getElementById("recipient-address").value,
        country: document.getElementById("recipient-country").value,
        ...(window.recipientLocation
          ? {
              lat: window.recipientLocation.lat,
              lng: window.recipientLocation.lng,
            }
          : {}),
      },
      package: {
        description: document.getElementById("package-description").value,
        weight: document.getElementById("package-weight").value,
        quantity: document.getElementById("package-quantity").value,
        length: document.getElementById("package-length").value,
        width: document.getElementById("package-width").value,
        height: document.getElementById("package-height").value,
        value: document.getElementById("package-value").value,
      },
      preferences: {
        deliveryType: document.querySelector(
          'input[name="delivery-type"]:checked'
        ).value,
        insurance: document.getElementById("insurance").checked,
        signatureRequired:
          document.getElementById("signature-required").checked,
        notifyReceiver: document.getElementById("notify-receiver").checked,
      },
    };

    // Store form data for later use
    window.shipmentFormData = formData;

    document
      .querySelectorAll("main, section")
      .forEach((el) => (el.style.display = "none"));
    const footer = document.querySelector("footer");
    if (footer) footer.style.display = "";
    const old = document.getElementById("user-dashboard");
    if (old) old.remove();
    const dash = document.createElement("main");
    dash.id = "user-dashboard";
    dash.className = "container mx-auto px-2 sm:px-4 py-6 min-h-[70vh]";
    dash.innerHTML = `
      <div class="mb-6">
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-blue-700">Review Shipment</h1>
        <p class="text-gray-600">Please review your shipment details before confirming</p>
      </div>
      
      <div class="max-w-4xl mx-auto space-y-6">
        <!-- Sender Information -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-gray-800">Sender Information</h2>
            <button onclick="renderCreateShipmentView()" class="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-gray-500">Name:</span>
              <span class="font-medium ml-2">${formData.sender.name}</span>
            </div>
            <div>
              <span class="text-gray-500">Phone:</span>
              <span class="font-medium ml-2">${formData.sender.phone}</span>
            </div>
            <div>
              <span class="text-gray-500">Email:</span>
              <span class="font-medium ml-2">${formData.sender.email}</span>
            </div>
            <div class="md:col-span-2">
              <span class="text-gray-500">Address:</span>
              <span class="font-medium ml-2">${formData.sender.address}</span>
            </div>
          </div>
        </div>

        <!-- Receiver Information -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-gray-800">Receiver Information</h2>
            <button onclick="renderCreateShipmentView()" class="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-gray-500">Name:</span>
              <span class="font-medium ml-2">${formData.recipient.name}</span>
            </div>
            <div>
              <span class="text-gray-500">Phone:</span>
              <span class="font-medium ml-2">${formData.recipient.phone}</span>
            </div>
            <div>
              <span class="text-gray-500">Country:</span>
              <span class="font-medium ml-2">${
                formData.recipient.country
              }</span>
            </div>
            <div class="md:col-span-2">
              <span class="text-gray-500">Address:</span>
              <span class="font-medium ml-2">${
                formData.recipient.address
              }</span>
            </div>
          </div>
        </div>

        <!-- Package Details -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-gray-800">Package Details</h2>
            <button onclick="renderCreateShipmentView()" class="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div class="md:col-span-2">
              <span class="text-gray-500">Description:</span>
              <span class="font-medium ml-2">${
                formData.package.description
              }</span>
            </div>
            <div>
              <span class="text-gray-500">Weight:</span>
              <span class="font-medium ml-2">${
                formData.package.weight
              } kg</span>
            </div>
            <div>
              <span class="text-gray-500">Quantity:</span>
              <span class="font-medium ml-2">${formData.package.quantity}</span>
            </div>
            ${
              formData.package.length
                ? `
            <div>
              <span class="text-gray-500">Dimensions:</span>
              <span class="font-medium ml-2">${formData.package.length} × ${formData.package.width} × ${formData.package.height} cm</span>
            </div>
            `
                : ""
            }
            ${
              formData.package.value
                ? `
            <div>
              <span class="text-gray-500">Value:</span>
              <span class="font-medium ml-2">$${formData.package.value}</span>
            </div>
            `
                : ""
            }
          </div>
        </div>

        <!-- Shipment Preferences -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-gray-800">Shipment Preferences</h2>
            <button onclick="renderCreateShipmentView()" class="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-gray-500">Delivery Type:</span>
              <span class="font-medium ml-2 capitalize">${
                formData.preferences.deliveryType
              }</span>
            </div>
            <div>
              <span class="text-gray-500">Insurance:</span>
              <span class="font-medium ml-2">${
                formData.preferences.insurance ? "Yes" : "No"
              }</span>
            </div>
            <div>
              <span class="text-gray-500">Signature Required:</span>
              <span class="font-medium ml-2">${
                formData.preferences.signatureRequired ? "Yes" : "No"
              }</span>
            </div>
            <div>
              <span class="text-gray-500">Notify Receiver:</span>
              <span class="font-medium ml-2">${
                formData.preferences.notifyReceiver ? "Yes" : "No"
              }</span>
            </div>
          </div>
        </div>

        <!-- Discount Code -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">Discount Code (Optional)</h2>
          <div class="flex gap-4">
            <input type="text" id="discount-code" placeholder="Enter discount code" class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <button onclick="applyDiscount()" class="bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors">Apply</button>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-between">
          <button onclick="renderCreateShipmentView()" class="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors">
            Back to Edit
          </button>
          <button onclick="confirmShipment()" class="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
            Confirm Shipment
          </button>
        </div>
      </div>
    `;
    if (footer && footer.parentNode) {
      footer.parentNode.insertBefore(dash, footer);
    } else {
      document.body.appendChild(dash);
    }
  }

  function applyDiscount() {
    const code = document.getElementById("discount-code").value;
    if (code) {
      showToast("Discount code applied successfully!");
    } else {
      showToast("Please enter a discount code.");
    }
  }

  function confirmShipment() {
    if (!window.shipmentFormData) {
      showToast("Shipment data not found. Please try again.");
      return;
    }
    renderShipmentConfirmation();
  }

  // Make functions globally accessible
  window.confirmShipment = confirmShipment;
  window.renderCreateShipmentView = renderCreateShipmentView;
  window.applyDiscount = applyDiscount;
  window.viewShipmentDetails = viewShipmentDetails;
  window.trackShipment = trackShipment;
  window.backToDashboard = backToDashboard;

  function backToDashboard() {
    const user = parseJwt(localStorage.getItem("jwt"));
    if (user) {
      renderDashboard(user);
      fetchAndRenderShipments();
      fetchAndRenderAnalytics();
      fetchAndRenderNotifications();
      showToast("Dashboard refreshed with latest data!");
    }
  }

  function renderShipmentConfirmation() {
    const formData = window.shipmentFormData;
    const trackingNumber = generateTrackingNumber();
    const pickupDate = new Date();
    pickupDate.setDate(pickupDate.getDate() + 1);

    document
      .querySelectorAll("main, section")
      .forEach((el) => (el.style.display = "none"));
    const footer = document.querySelector("footer");
    if (footer) footer.style.display = "";
    const old = document.getElementById("user-dashboard");
    if (old) old.remove();
    const dash = document.createElement("main");
    dash.id = "user-dashboard";
    dash.className = "container mx-auto px-2 sm:px-4 py-6 min-h-[70vh]";
    dash.innerHTML = `
      <div class="max-w-2xl mx-auto text-center">
        <div class="bg-white rounded-xl shadow-lg p-8">
          <!-- Success Icon -->
          <div class="text-green-500 text-6xl mb-6">✅</div>
          
          <!-- Success Message -->
          <h1 class="text-3xl font-bold text-gray-800 mb-4">Shipment Created Successfully!</h1>
          
          <!-- Tracking Number -->
          <div class="bg-gray-50 rounded-lg p-4 mb-6">
            <p class="text-sm text-gray-600 mb-2">Tracking Number</p>
            <p class="text-2xl font-mono font-bold text-blue-600">${trackingNumber}</p>
          </div>
          
          <!-- Confirmation Details -->
          <div class="space-y-4 text-left mb-8">
            <div class="flex items-center text-sm">
              <span class="text-green-500 mr-2">📩</span>
              <span>An email has been sent to the receiver.</span>
            </div>
            <div class="flex items-center text-sm">
              <span class="text-blue-500 mr-2">📦</span>
              <span>Pickup scheduled for: ${pickupDate.toLocaleDateString(
                "en-US",
                {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}</span>
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button onclick="viewShipmentDetails('${trackingNumber}')" class="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              📄 View Details
            </button>
            <button onclick="trackShipment('${trackingNumber}')" class="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors">
              🚚 Track Shipment
            </button>
            <button onclick="backToDashboard()" class="bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors">
              🏠 Dashboard
            </button>
            <button onclick="renderCreateShipmentView()" class="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
              ➕ Create Another
            </button>
          </div>
        </div>
      </div>
    `;
    if (footer && footer.parentNode) {
      footer.parentNode.insertBefore(dash, footer);
    } else {
      document.body.appendChild(dash);
    }

    // Save shipment to backend
    saveShipmentToBackend(formData, trackingNumber);
  }

  function generateTrackingNumber() {
    const prefix = "LX";
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  }

  async function viewShipmentDetails(arg) {
    let shipment;

    // Create loading modal first
    const detailsModal = document.createElement("div");
    detailsModal.className =
      "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40";
    detailsModal.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <div class="flex items-center justify-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span class="ml-2">Loading shipment details...</span>
        </div>
      </div>
    `;
    document.body.appendChild(detailsModal);

    try {
      if (typeof arg === "string") {
        // Admin context: fetch from backend
        const jwt = localStorage.getItem("jwt");
        const res = await fetch("https://logixpress-tracking.onrender.com/api/shipments/all", {
          headers: {
            Authorization: "Bearer " + jwt,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(await res.text());
        }

        const shipments = await res.json();
        shipment = shipments.find((s) => s.trackingNumber === arg);

        if (!shipment) {
          throw new Error("Shipment not found");
        }
      } else if (typeof arg === "object") {
        // User context: use object directly
        shipment = arg;
      } else {
        throw new Error("Invalid shipment details");
      }

      // Update modal with shipment details
      detailsModal.innerHTML = `
        <div class="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
          <button class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl" onclick="this.closest('.fixed').remove()">&times;</button>
          <h2 class="text-lg font-bold mb-4">Shipment Details</h2>
          <div class="space-y-2 text-sm">
            <div><span class="font-semibold">Tracking #:</span> <span class="font-mono">${
              shipment.trackingNumber
            }</span></div>
            <div><span class="font-semibold">Status:</span> <span class="px-2 py-1 rounded-full text-xs font-medium ${
              shipment.status === "Delivered"
                ? "bg-green-100 text-green-800"
                : shipment.status === "In Transit"
                ? "bg-blue-100 text-blue-800"
                : shipment.status === "Pending Pickup"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-gray-100 text-gray-800"
            }">${shipment.status}</span></div>
            <div><span class="font-semibold">User:</span> <span>${
              shipment.user?.name || shipment.user?.email || "Unknown User"
            }</span></div>
            <div><span class="font-semibold">Sender:</span> <span>${
              shipment.sender?.name || "-"
            } (${shipment.sender?.phone || "-"})</span></div>
            <div><span class="font-semibold">Sender Email:</span> <span>${
              shipment.sender?.email || "-"
            }</span></div>
            <div><span class="font-semibold">Sender Address:</span> <span>${
              shipment.sender?.address || "-"
            }</span></div>
            <div><span class="font-semibold">Recipient:</span> <span>${
              shipment.recipient?.name || "-"
            } (${shipment.recipient?.phone || "-"})</span></div>
            <div><span class="font-semibold">Recipient Address:</span> <span>${
              shipment.recipient?.address || "-"
            }</span></div>
            <div><span class="font-semibold">Package Info:</span> <span>${
              shipment.package?.description || "-"
            }</span></div>
            <div><span class="font-semibold">Weight:</span> <span>${
              shipment.package?.weight ? shipment.package.weight + " kg" : "-"
            }</span></div>
            <div><span class="font-semibold">Created:</span> <span>${
              shipment.createdAt
                ? new Date(shipment.createdAt).toLocaleString()
                : "-"
            }</span></div>
            <div><span class="font-semibold">ETA:</span> <span>${
              shipment.estimatedDelivery
                ? new Date(shipment.estimatedDelivery).toLocaleString()
                : "-"
            }</span></div>
          </div>
        </div>
      `;
    } catch (error) {
      detailsModal.remove();
      showToast(error.message || "Error fetching shipment details", "error");
    }
    // Create modal
    const modal = document.createElement("div");
    modal.className =
      "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40";
    modal.innerHTML = `
      <div class="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
        <button class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl" onclick="this.closest('.fixed').remove()">&times;</button>
        <h2 class="text-lg font-bold mb-4">Shipment Details</h2>
        <div class="space-y-2 text-sm">
          <div><span class="font-semibold">Tracking #:</span> <span class="font-mono">${
            shipment.trackingNumber
          }</span></div>
          <div><span class="font-semibold">Status:</span> <span>${
            shipment.status
          }</span></div>
          <div><span class="font-semibold">User:</span> <span>${
            shipment.user?.name || shipment.user?.email || "Unknown User"
          }</span></div>
          <div><span class="font-semibold">Sender:</span> <span>${
            shipment.sender?.name || "-"
          } (${shipment.sender?.phone || "-"})</span></div>
          <div><span class="font-semibold">Sender Email:</span> <span>${
            shipment.sender?.email || "-"
          }</span></div>
          <div><span class="font-semibold">Sender Address:</span> <span>${
            shipment.sender?.address || "-"
          }</span></div>
          <div><span class="font-semibold">Recipient:</span> <span>${
            shipment.recipient?.name || "-"
          } (${shipment.recipient?.phone || "-"})</span></div>
          <div><span class="font-semibold">Recipient Address:</span> <span>${
            shipment.recipient?.address || "-"
          }</span></div>
          <div><span class="font-semibold">Recipient Country:</span> <span>${
            shipment.recipient?.country || "-"
          }</span></div>
          <div><span class="font-semibold">Package:</span> <span>${
            shipment.package?.type || "-"
          }, ${shipment.package?.weight || "-"} kg</span></div>
          <div><span class="font-semibold">Package Description:</span> <span>${
            shipment.package?.description || "-"
          }</span></div>
          <div><span class="font-semibold">Quantity:</span> <span>${
            shipment.package?.quantity || "-"
          }</span></div>
          <div><span class="font-semibold">Value:</span> <span>${
            shipment.package?.value ? "$" + shipment.package.value : "-"
          }</span></div>
          <div><span class="font-semibold">Created:</span> <span>${
            shipment.createdAt
              ? new Date(shipment.createdAt).toLocaleString()
              : "-"
          }</span></div>
          <div><span class="font-semibold">ETA:</span> <span>${
            shipment.estimatedDelivery
              ? new Date(shipment.estimatedDelivery).toLocaleString()
              : "-"
          }</span></div>
          <div><span class="font-semibold">Preferences:</span> <span>${
            shipment.preferences
              ? Object.entries(shipment.preferences)
                  .map(([k, v]) => `${k}: ${v}`)
                  .join(", ")
              : "-"
          }</span></div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  function trackShipment(trackingNumber) {
    // Navigate to track shipment page with the tracking number
    renderTrackShipmentView();
    setTimeout(() => {
      const trackInput = document.getElementById("track-shipment-input");
      if (trackInput) {
        trackInput.value = trackingNumber;
        trackInput.form.dispatchEvent(new Event("submit"));
      }
    }, 100);
  }

  async function saveShipmentToBackend(formData, trackingNumber) {
    const jwt = localStorage.getItem("jwt");
    try {
      const shipmentData = {
        trackingNumber,
        sender: formData.sender,
        recipient: formData.recipient,
        package: formData.package,
        preferences: formData.preferences,
        status: "Pending Pickup",
        estimatedDelivery: calculateEstimatedDelivery(
          formData.preferences.deliveryType
        ),
      };

      const res = await fetch("https://logixpress-tracking.onrender.com/api/shipments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwt,
        },
        body: JSON.stringify(shipmentData),
      });

      if (res.ok) {
        // Do not create a notification here; backend already handles it
      } else {
        console.error("Failed to save shipment to backend");
      }
    } catch (error) {
      console.error("Error saving shipment:", error);
    }
  }

  function calculateEstimatedDelivery(deliveryType) {
    const today = new Date();
    let daysToAdd = 3; // Default standard delivery

    switch (deliveryType) {
      case "express":
        daysToAdd = 2;
        break;
      case "same-day":
        daysToAdd = 1;
        break;
      default:
        daysToAdd = 5;
    }

    const estimatedDate = new Date(today);
    estimatedDate.setDate(today.getDate() + daysToAdd);
    return estimatedDate.toISOString();
  }

  function renderTrackShipmentView() {
    document
      .querySelectorAll("main, section")
      .forEach((el) => (el.style.display = "none"));
    const footer = document.querySelector("footer");
    if (footer) footer.style.display = "";
    const old = document.getElementById("user-dashboard");
    if (old) old.remove();
    const dash = document.createElement("main");
    dash.id = "user-dashboard";
    dash.className = "container mx-auto px-2 sm:px-4 py-6 min-h-[70vh]";
    dash.innerHTML = `
      <div class="mb-6">
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-blue-700">Track Shipment</h1>
        <p class="text-gray-600">Enter a tracking number to check the status of a shipment.</p>
      </div>
      <div class="max-w-2xl mx-auto">
        <div class="bg-white rounded-xl shadow-lg p-6">
          <form id="track-shipment-form" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tracking Number</label>
              <input 
                type="text" 
                id="track-shipment-input" 
                placeholder="Enter your tracking number" 
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                required 
              />
            </div>
            <button type="submit" class="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
              Track Package
            </button>
          </form>
          <div id="track-shipment-result" class="mt-6"></div>
          
          <!-- Don't have tracking number section -->
          <div class="mt-8 pt-6 border-t border-gray-200">
            <div class="text-center">
              <p class="text-gray-600 mb-3">📨 Don't have one?</p>
              <button onclick="renderCreateShipmentView()" class="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition">
                Create New Shipment
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    if (footer && footer.parentNode) {
      footer.parentNode.insertBefore(dash, footer);
    } else {
      document.body.appendChild(dash);
    }

    // Setup tracking form
    const trackForm = document.getElementById("track-shipment-form");
    const trackInput = document.getElementById("track-shipment-input");
    const trackResult = document.getElementById("track-shipment-result");
    if (trackForm && trackInput && trackResult) {
      trackForm.onsubmit = async function (e) {
        e.preventDefault();
        trackResult.innerHTML = '<div class="text-gray-400">Searching...</div>';
        const jwt = localStorage.getItem("jwt");
        try {
          const res = await fetch("https://logixpress-tracking.onrender.com/api/shipments/track", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + jwt,
            },
            body: JSON.stringify({ trackingNumber: trackInput.value }),
          });
          const data = await res.json();
          if (res.ok) {
            trackResult.innerHTML = `<div class='text-green-600 font-semibold mb-2'>Shipment Found:</div>
              <div class='text-sm'>Tracking #: <span class='font-bold'>${
                data.trackingNumber
              }</span></div>
              <div class='text-sm'>Status: <span class='font-bold'>${
                data.status
              }</span></div>
              <div class='text-sm'>ETA: <span class='font-bold'>${
                data.estimatedDelivery
                  ? new Date(data.estimatedDelivery).toLocaleDateString()
                  : "N/A"
              }</span></div>`;
          } else {
            trackResult.innerHTML = `<div class='text-red-500'>${
              data.message || "Shipment not found."
            }</div>`;
          }
        } catch {
          trackResult.innerHTML =
            '<div class="text-red-500">Error searching for shipment.</div>';
        }
      };
    }
    // Always update dashboard notifications card after rendering
    fetchAndRenderNotifications();
  }

  function renderSupportWidget() {
    const container = document.getElementById("support-widget");
    if (!container) return;

    container.innerHTML = `
      <div class="space-y-6">
        <div class="bg-gray-50 rounded-lg p-4">
          <h3 class="font-semibold text-gray-800 mb-3">Frequently Asked Questions</h3>
          <div class="space-y-3">
            <details class="group">
              <summary class="cursor-pointer font-medium text-gray-700 hover:text-blue-600">
                How do I start shipping?
              </summary>
              <p class="mt-2 text-gray-600">Click the "Create New Shipment" button in the My Shipments section to get started with your first delivery.</p>
            </details>
            <details class="group">
              <summary class="cursor-pointer font-medium text-gray-700 hover:text-blue-600">
                Where can I get tracking IDs?
              </summary>
              <p class="mt-2 text-gray-600">Tracking IDs are provided when you create a shipment or receive a package from someone using our service.</p>
            </details>
            <details class="group">
              <summary class="cursor-pointer font-medium text-gray-700 hover:text-blue-600">
                How do I contact support?
              </summary>
              <p class="mt-2 text-gray-600">You can reach our support team through the contact form below or by emailing support@logixpress.com</p>
            </details>
          </div>
        </div>
        
        <div class="bg-white border border-gray-200 rounded-lg p-4">
          <h3 class="font-semibold text-gray-800 mb-3">Contact Support</h3>
          <form id="support-form" class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input type="text" id="support-subject" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea id="support-message" rows="4" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>
            <button type="submit" class="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
              Send Message
            </button>
          </form>
        </div>
      </div>
    `;

    // Setup support form
    const supportForm = document.getElementById("support-form");
    if (supportForm) {
      supportForm.onsubmit = async function (e) {
        e.preventDefault();
        const subject = document.getElementById("support-subject").value;
        const message = document.getElementById("support-message").value;
        const jwt = localStorage.getItem("jwt");

        try {
          const res = await fetch("https://logixpress-tracking.onrender.com/api/support", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + jwt,
            },
            body: JSON.stringify({ subject, message }),
          });

          if (res.ok) {
            showToast("Support message sent successfully!");
            supportForm.reset();
          } else {
            showToast("Failed to send message. Please try again.");
          }
        } catch {
          showToast("Error sending message. Please try again.");
        }
      };
    }
  }

  function renderSettingsWidget(user) {
    const container = document.getElementById("settings-widget");
    if (!container) return;

    container.innerHTML = `
      <div class="space-y-6">
        <div class="bg-white border border-gray-200 rounded-lg p-4">
          <h3 class="font-semibold text-gray-800 mb-3">Profile Information</h3>
          <form id="profile-form" class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input type="text" id="profile-name" value="${user.name}" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" id="profile-email" value="${user.email}" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
              Update Profile
            </button>
          </form>
        </div>
        
        <div class="bg-white border border-gray-200 rounded-lg p-4">
          <h3 class="font-semibold text-gray-800 mb-3">Contact Information</h3>
          <form id="contact-form" class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input type="tel" id="contact-phone" placeholder="+1 (555) 123-4567" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea id="contact-address" rows="3" placeholder="Enter your full address" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>
            <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
              Update Contact Info
            </button>
          </form>
        </div>
        
        <div class="bg-white border border-gray-200 rounded-lg p-4">
          <h3 class="font-semibold text-gray-800 mb-3">Notification Preferences</h3>
          <form id="notification-form" class="space-y-3">
            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-700">Email Notifications</label>
                <p class="text-xs text-gray-500">Receive updates via email</p>
              </div>
              <input type="checkbox" id="email-notifications" checked class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" />
            </div>
            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-700">SMS Notifications</label>
                <p class="text-xs text-gray-500">Receive updates via text message</p>
              </div>
              <input type="checkbox" id="sms-notifications" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" />
            </div>
            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-700">Push Notifications</label>
                <p class="text-xs text-gray-500">Receive updates in the app</p>
              </div>
              <input type="checkbox" id="push-notifications" checked class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" />
            </div>
            <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition">
              Save Preferences
            </button>
          </form>
        </div>
        
        <div class="bg-white border border-gray-200 rounded-lg p-4">
          <h3 class="font-semibold text-gray-800 mb-3">Default Shipping Address</h3>
          <form id="shipping-form" class="space-y-3">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input type="text" id="shipping-first-name" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input type="text" id="shipping-last-name" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
              <input type="text" id="shipping-street" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input type="text" id="shipping-city" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input type="text" id="shipping-state" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                <input type="text" id="shipping-zip" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <button type="submit" class="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition">
              Save Shipping Address
            </button>
          </form>
        </div>
        
        <div class="bg-white border border-gray-200 rounded-lg p-4">
          <h3 class="font-semibold text-gray-800 mb-3">Change Password</h3>
          <form id="password-form" class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <input type="password" id="current-password" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input type="password" id="new-password" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition">
              Change Password
            </button>
          </form>
        </div>
        
        <div class="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 class="font-semibold text-red-800 mb-3">Danger Zone</h3>
          <p class="text-red-600 text-sm mb-3">Once you delete your account, there is no going back. Please be certain.</p>
          <button id="delete-account-btn" class="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition">
            Delete Account
          </button>
        </div>
      </div>
    `;

    // Setup forms
    const profileForm = document.getElementById("profile-form");
    const contactForm = document.getElementById("contact-form");
    const notificationForm = document.getElementById("notification-form");
    const shippingForm = document.getElementById("shipping-form");
    const passwordForm = document.getElementById("password-form");
    const deleteAccountBtn = document.getElementById("delete-account-btn");

    if (profileForm) {
      profileForm.onsubmit = async function (e) {
        e.preventDefault();
        const name = document.getElementById("profile-name").value;
        const email = document.getElementById("profile-email").value;
        const jwt = localStorage.getItem("jwt");

        try {
          const res = await fetch("https://logixpress-tracking.onrender.com/api/user/profile", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + jwt,
            },
            body: JSON.stringify({ name, email }),
          });

          if (res.ok) {
            showToast("Profile updated successfully!");
          } else {
            showToast("Failed to update profile. Please try again.");
          }
        } catch {
          showToast("Error updating profile. Please try again.");
        }
      };
    }

    if (contactForm) {
      contactForm.onsubmit = async function (e) {
        e.preventDefault();
        const phone = document.getElementById("contact-phone").value;
        const address = document.getElementById("contact-address").value;
        const jwt = localStorage.getItem("jwt");

        try {
          const res = await fetch("https://logixpress-tracking.onrender.com/api/user/contact", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + jwt,
            },
            body: JSON.stringify({ phone, address }),
          });

          if (res.ok) {
            showToast("Contact information updated successfully!");
          } else {
            showToast(
              "Failed to update contact information. Please try again."
            );
          }
        } catch {
          showToast("Error updating contact information. Please try again.");
        }
      };
    }

    if (notificationForm) {
      notificationForm.onsubmit = async function (e) {
        e.preventDefault();
        const emailNotifications = document.getElementById(
          "email-notifications"
        ).checked;
        const smsNotifications =
          document.getElementById("sms-notifications").checked;
        const pushNotifications =
          document.getElementById("push-notifications").checked;
        const jwt = localStorage.getItem("jwt");

        try {
          const res = await fetch(
            "https://logixpress-tracking.onrender.com/api/user/notifications",
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + jwt,
              },
              body: JSON.stringify({
                emailNotifications,
                smsNotifications,
                pushNotifications,
              }),
            }
          );

          if (res.ok) {
            showToast("Notification preferences updated successfully!");
          } else {
            showToast(
              "Failed to update notification preferences. Please try again."
            );
          }
        } catch {
          showToast(
            "Error updating notification preferences. Please try again."
          );
        }
      };
    }

    if (shippingForm) {
      shippingForm.onsubmit = async function (e) {
        e.preventDefault();
        const firstName = document.getElementById("shipping-first-name").value;
        const lastName = document.getElementById("shipping-last-name").value;
        const street = document.getElementById("shipping-street").value;
        const city = document.getElementById("shipping-city").value;
        const state = document.getElementById("shipping-state").value;
        const zipCode = document.getElementById("shipping-zip").value;
        const jwt = localStorage.getItem("jwt");

        try {
          const res = await fetch("https://logixpress-tracking.onrender.com/api/user/shipping", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + jwt,
            },
            body: JSON.stringify({
              firstName,
              lastName,
              street,
              city,
              state,
              zipCode,
            }),
          });

          if (res.ok) {
            showToast("Shipping address updated successfully!");
          } else {
            showToast("Failed to update shipping address. Please try again.");
          }
        } catch {
          showToast("Error updating shipping address. Please try again.");
        }
      };
    }

    if (passwordForm) {
      passwordForm.onsubmit = async function (e) {
        e.preventDefault();
        const currentPassword =
          document.getElementById("current-password").value;
        const newPassword = document.getElementById("new-password").value;
        const jwt = localStorage.getItem("jwt");

        try {
          const res = await fetch("https://logixpress-tracking.onrender.com/api/user/password", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + jwt,
            },
            body: JSON.stringify({ currentPassword, newPassword }),
          });

          if (res.ok) {
            showToast("Password changed successfully!");
            passwordForm.reset();
          } else {
            showToast("Failed to change password. Please try again.");
          }
        } catch {
          showToast("Error changing password. Please try again.");
        }
      };
    }

    if (deleteAccountBtn) {
      deleteAccountBtn.onclick = async function () {
        if (
          confirm(
            "Are you sure you want to delete your account? This action cannot be undone."
          )
        ) {
          const jwt = localStorage.getItem("jwt");

          try {
            const res = await fetch("https://logixpress-tracking.onrender.com/api/user/delete", {
              method: "DELETE",
              headers: {
                Authorization: "Bearer " + jwt,
              },
            });

            if (res.ok) {
              localStorage.removeItem("jwt");
              showToast("Account deleted successfully!");
              location.reload();
            } else {
              showToast("Failed to delete account. Please try again.");
            }
          } catch {
            showToast("Error deleting account. Please try again.");
          }
        }
      };
    }
  }

  function renderNotifications(notifications) {
    const container = document.getElementById("notifications-list");
    if (!container) return;

    if (!notifications || notifications.length === 0) {
      container.innerHTML = `
        <div class="text-center py-8">
          <div class="text-gray-400 text-4xl mb-3">🔔</div>
          <h3 class="text-lg font-semibold text-gray-700 mb-2">No notifications yet</h3>
          <p class="text-gray-500 text-sm">You'll start seeing alerts once your first shipment is created.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="space-y-4">
        ${notifications
          .map((notification) => {
            const title = notification.title || "Notification";
            const type = notification.type || "info";
            const date = notification.createdAt || notification.date;
            const dateString = date ? new Date(date).toLocaleDateString() : "";
            return `
                <div class="border border-gray-200 rounded-lg p-4">
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <h4 class="font-semibold text-gray-800 mb-1">${title}</h4>
                      <p class="text-gray-600 text-sm mb-2">${
                        notification.message
                      }</p>
                      <div class="text-xs text-gray-500">${dateString}</div>
                    </div>
                    <div class="ml-4">
                      <span class="px-2 py-1 rounded-full text-xs font-semibold ${
                        type === "urgent"
                          ? "bg-red-100 text-red-800"
                          : type === "info"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }">${type}</span>
                    </div>
                  </div>
                </div>
              `;
          })
          .join("")}
      </div>
    `;
  }

  // Patch renderDashboard to call fetchAndRenderShipments
  const _origRenderDashboard = renderDashboard;
  renderDashboard = function (user) {
    _origRenderDashboard(user);
    fetchAndRenderShipments();
    fetchAndRenderNotifications();
    fetchAndRenderAnalytics();
  };

  // --- Admin Dashboard ---
  function renderAdminDashboard(user) {
    removePublicNavLinksAndGetStarted();
    // Hide all public content
    document
      .querySelectorAll("main, section")
      .forEach((el) => (el.style.display = "none"));
    const footer = document.querySelector("footer");
    if (footer) footer.style.display = "";
    // Only create dashboard if not already present
    let dash = document.getElementById("admin-dashboard");
    if (!dash) {
      // Remove any previous dashboard
      const oldUserDash = document.getElementById("user-dashboard");
      if (oldUserDash) oldUserDash.remove();
      // Add greeting and profile icon to top nav bar
      const header = document.querySelector("header .container");
      if (header) {
        // Remove any previous admin nav additions
        const oldAdminNavRight = document.getElementById("admin-nav-right");
        if (oldAdminNavRight) oldAdminNavRight.remove();
        // Create right-side container
        const adminNavRight = document.createElement("div");
        adminNavRight.id = "admin-nav-right";
        adminNavRight.className = "flex items-center gap-4 ml-auto";
        // Dynamic greeting with icon and color
        function getGreeting() {
          const hour = new Date().getHours();
          if (hour < 12)
            return {
              text: "Good morning",
              icon: "<i class='fas fa-sun text-yellow-400'></i>",
            };
          if (hour < 18)
            return {
              text: "Good afternoon",
              icon: "<i class='fas fa-cloud-sun text-blue-400'></i>",
            };
          return {
            text: "Good evening",
            icon: "<i class='fas fa-moon text-indigo-500'></i>",
          };
        }
        const greeting = getGreeting();
        adminNavRight.innerHTML = `
        <div class='flex items-center gap-2 text-base font-semibold' style='color: #52a3ff;'>${greeting.icon}<span>${greeting.text}, <span class='capitalize'>${user.name}</span></span></div>
        <div class='relative'>
          <button id='admin-profile-btn' class='w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xl focus:outline-none border-2 border-blue-200 hover:shadow-lg transition'><i class='fas fa-user-circle'></i></button>
          <div id='admin-profile-dropdown' class='absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 hidden animate-fade-in'>
            <a href='#' class='block px-4 py-2 text-gray-700 hover:bg-blue-50'><i class='fas fa-user mr-2'></i>Account</a>
            <a href='#' class='block px-4 py-2 text-gray-700 hover:bg-blue-50'><i class='fas fa-cog mr-2'></i>Settings</a>
            <div class='border-t my-2'></div>
            <button id='admin-profile-logout' class='w-full text-left px-4 py-2 text-red-600 hover:bg-red-50'><i class='fas fa-sign-out-alt mr-2'></i>Logout</button>
          </div>
        </div>
      `;
        header.appendChild(adminNavRight);
        // Profile dropdown logic
        const profileBtn = adminNavRight.querySelector("#admin-profile-btn");
        const profileDropdown = adminNavRight.querySelector(
          "#admin-profile-dropdown"
        );
        if (profileBtn && profileDropdown) {
          profileBtn.onclick = (e) => {
            e.stopPropagation();
            profileDropdown.classList.toggle("hidden");
          };
          document.addEventListener("click", (e) => {
            if (
              !profileBtn.contains(e.target) &&
              !profileDropdown.contains(e.target)
            ) {
              profileDropdown.classList.add("hidden");
            }
          });
          // Logout from dropdown
          const dropdownLogout = adminNavRight.querySelector(
            "#admin-profile-logout"
          );
          if (dropdownLogout) dropdownLogout.onclick = logoutUser;
        }
      }
      // Create admin dashboard container (no logo/name, just sidebar and content)
      dash = document.createElement("main");
      dash.id = "admin-dashboard";
      dash.className = "flex min-h-[80vh] bg-gray-50 w-full max-w-full";
      dash.innerHTML = `
      <!-- Sidebar (theme #52a3ff, no logo/name, no logout button) -->
        <aside id="admin-sidebar" class="hidden md:fixed md:static md:block z-40 top-0 left-0 h-full md:h-auto w-56 md:w-56" style="background: #52a3ff; color: #fff;">
        <nav class="flex-1 py-8 px-4 space-y-2">
          <a href="#" id="admin-nav-dashboard" class="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-200 hover:text-blue-900 transition font-medium"><i class="fas fa-tachometer-alt"></i> Dashboard</a>
          <a href="#" id="admin-nav-shipments" class="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-200 hover:text-blue-900 transition font-medium"><i class="fas fa-shipping-fast"></i> Shipments</a>
          <a href="#" id="admin-nav-users" class="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-200 hover:text-blue-900 transition font-medium"><i class="fas fa-users"></i> Users</a>
          <a href="#" id="admin-nav-drivers" class="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-200 hover:text-blue-900 transition font-medium"><i class="fas fa-id-badge"></i> Drivers</a>
          <a href="#" id="admin-nav-analytics" class="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-200 hover:text-blue-900 transition font-medium"><i class="fas fa-chart-bar"></i> Analytics</a>
          <a href="#" id="admin-nav-alerts" class="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-200 hover:text-blue-900 transition font-medium"><i class="fas fa-bell"></i> Alerts</a>
          <a href="#" id="admin-nav-settings" class="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-200 hover:text-blue-900 transition font-medium"><i class="fas fa-cog"></i> Settings</a>
        </nav>
      </aside>
        <!-- Mobile Sidebar Overlay and Drawer -->
        <div id="admin-mobile-menu" class="fixed inset-0 z-50 bg-black bg-opacity-40 transition-opacity duration-300 hidden md:hidden">
          <div class="absolute top-0 left-0 h-full w-64 bg-blue-500 text-white shadow-lg flex flex-col">
            <div class="flex items-center justify-between h-16 px-6 font-bold text-2xl border-b border-blue-400">
              <span class="mr-2">🚚</span> LogiXpress Admin
              <button id="admin-mobile-close" class="text-white text-2xl focus:outline-none">&times;</button>
            </div>
            <nav class="flex-1 py-6 px-4 space-y-2">
              <a href="#" id="admin-nav-dashboard-mobile" class="flex items-center px-3 py-2 rounded-lg hover:bg-blue-600 transition font-semibold"><i class="fas fa-tachometer-alt mr-3"></i> Dashboard</a>
              <a href="#" id="admin-nav-shipments-mobile" class="flex items-center px-3 py-2 rounded-lg hover:bg-blue-600 transition"><i class="fas fa-shipping-fast mr-3"></i> Shipments</a>
              <a href="#" id="admin-nav-users-mobile" class="flex items-center px-3 py-2 rounded-lg hover:bg-blue-600 transition"><i class="fas fa-users mr-3"></i> Users</a>
              <a href="#" id="admin-nav-drivers-mobile" class="flex items-center px-3 py-2 rounded-lg hover:bg-blue-600 transition"><i class="fas fa-id-badge mr-3"></i> Drivers</a>
              <a href="#" id="admin-nav-analytics-mobile" class="flex items-center px-3 py-2 rounded-lg hover:bg-blue-600 transition"><i class="fas fa-chart-bar mr-3"></i> Analytics</a>
              <a href="#" id="admin-nav-alerts-mobile" class="flex items-center px-3 py-2 rounded-lg hover:bg-blue-600 transition"><i class="fas fa-bell mr-3"></i> Alerts</a>
              <a href="#" id="admin-nav-settings-mobile" class="flex items-center px-3 py-2 rounded-lg hover:bg-blue-600 transition"><i class="fas fa-cog mr-3"></i> Settings</a>
            </nav>
          </div>
        </div>
        <!-- Sidebar overlay for mobile (legacy, now unused) -->
        <div id="admin-sidebar-overlay" class="hidden"></div>
      <!-- Main Content -->
        <section class="flex-1 flex flex-col min-h-screen w-full max-w-full">
          <div id="admin-dashboard-content" class="flex-1 p-2 sm:p-4 md:p-6 bg-gray-50 min-h-[70vh] transition-all duration-300 w-full max-w-full">
          <!-- Live Shipment Monitor -->
          <div class="mb-8 animate-fade-in-up">
            <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2"><i class="fas fa-shipping-fast text-blue-600 animate-truck-move"></i> Live Shipments</h2>
            <div id="admin-shipments-table-container"></div>
          </div>
          <!-- Analytics Widgets -->
          <div class="mb-8 animate-fade-in-up">
            <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2"><i class="fas fa-chart-bar text-purple-600"></i> Analytics</h2>
            <div id="admin-analytics-widget"></div>
          </div>
          <!-- Notifications -->
          <div class="mb-8 animate-fade-in-up">
            <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2"><i class="fas fa-bell text-orange-600"></i> Notifications</h2>
            <div id="admin-notifications-panel"></div>
          </div>
          <!-- Map Visualization -->
          <div class="mb-8 animate-fade-in-up">
            <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2"><i class="fas fa-map-marked-alt text-green-600"></i> Live Shipment Map</h2>
            <div id="admin-map-panel" class="w-full h-80 rounded-lg shadow"></div>
          </div>
        </div>
      </section>
    `;
      if (footer && footer.parentNode) {
        footer.parentNode.insertBefore(dash, footer);
      } else {
        document.body.appendChild(dash);
      }
      setupAdminSidebarNav();
      // Sidebar mobile toggle logic
      const sidebar = dash.querySelector("#admin-sidebar");
      const sidebarOverlay = dash.querySelector("#admin-sidebar-overlay");
      // Add hamburger to top nav if not present
      let hamburger = document.getElementById("admin-sidebar-open");
      if (!hamburger && header) {
        hamburger = document.createElement("button");
        hamburger.id = "admin-sidebar-open";
        hamburger.className =
          "md:hidden text-blue-700 text-2xl focus:outline-none ml-2";
        hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        header.insertBefore(hamburger, header.lastChild);
      }
      function openSidebar() {
        sidebar.classList.remove("-translate-x-full");
        sidebarOverlay.classList.remove("hidden");
      }
      function closeSidebar() {
        sidebar.classList.add("-translate-x-full");
        sidebarOverlay.classList.add("hidden");
      }
      if (hamburger) hamburger.onclick = openSidebar;
      const closeBtn = dash.querySelector("#admin-sidebar-close");
      if (closeBtn) closeBtn.onclick = closeSidebar;
      if (sidebarOverlay) sidebarOverlay.onclick = closeSidebar;
      // Mobile menu logic
      const mobileMenuBtn = document.getElementById("admin-sidebar-open");
      const mobileMenu = dash.querySelector("#admin-mobile-menu");
      const mobileMenuClose = dash.querySelector("#admin-mobile-close");
      if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.onclick = () => {
          mobileMenu.classList.remove("hidden");
        };
      }
      if (mobileMenuClose && mobileMenu) {
        mobileMenuClose.onclick = () => {
          mobileMenu.classList.add("hidden");
        };
      }
      if (mobileMenu) {
        mobileMenu.onclick = (e) => {
          if (e.target === mobileMenu) {
            mobileMenu.classList.add("hidden");
          }
        };
      }
    } else {
      // If dashboard already exists, make it visible and refresh its content
      dash.style.display = "flex";
      // Re-apply dashboard HTML
      dash.innerHTML = `
        <!-- Sidebar (theme #52a3ff, no logo/name, no logout button) -->
          <aside id="admin-sidebar" class="hidden md:fixed md:static md:block z-40 top-0 left-0 h-full md:h-auto w-56 md:w-56" style="background: #52a3ff; color: #fff;">
          <nav class="flex-1 py-8 px-4 space-y-2">
            <a href="#" id="admin-nav-dashboard" class="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-200 hover:text-blue-900 transition font-medium"><i class="fas fa-tachometer-alt"></i> Dashboard</a>
            <a href="#" id="admin-nav-shipments" class="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-200 hover:text-blue-900 transition font-medium"><i class="fas fa-shipping-fast"></i> Shipments</a>
            <a href="#" id="admin-nav-users" class="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-200 hover:text-blue-900 transition font-medium"><i class="fas fa-users"></i> Users</a>
            <a href="#" id="admin-nav-drivers" class="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-200 hover:text-blue-900 transition font-medium"><i class="fas fa-id-badge"></i> Drivers</a>
            <a href="#" id="admin-nav-analytics" class="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-200 hover:text-blue-900 transition font-medium"><i class="fas fa-chart-bar"></i> Analytics</a>
            <a href="#" id="admin-nav-alerts" class="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-200 hover:text-blue-900 transition font-medium"><i class="fas fa-bell"></i> Alerts</a>
            <a href="#" id="admin-nav-settings" class="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-200 hover:text-blue-900 transition font-medium"><i class="fas fa-cog"></i> Settings</a>
          </nav>
        </aside>
          <!-- Mobile Sidebar Overlay and Drawer -->
          <div id="admin-mobile-menu" class="fixed inset-0 z-50 bg-black bg-opacity-40 transition-opacity duration-300 hidden md:hidden">
            <div class="absolute top-0 left-0 h-full w-64 bg-blue-500 text-white shadow-lg flex flex-col">
              <div class="flex items-center justify-between h-16 px-6 font-bold text-2xl border-b border-blue-400">
                <span class="mr-2">🚚</span> LogiXpress Admin
                <button id="admin-mobile-close" class="text-white text-2xl focus:outline-none">&times;</button>
              </div>
              <nav class="flex-1 py-6 px-4 space-y-2">
                <a href="#" id="admin-nav-dashboard-mobile" class="flex items-center px-3 py-2 rounded-lg hover:bg-blue-600 transition font-semibold"><i class="fas fa-tachometer-alt mr-3"></i> Dashboard</a>
                <a href="#" id="admin-nav-shipments-mobile" class="flex items-center px-3 py-2 rounded-lg hover:bg-blue-600 transition"><i class="fas fa-shipping-fast mr-3"></i> Shipments</a>
                <a href="#" id="admin-nav-users-mobile" class="flex items-center px-3 py-2 rounded-lg hover:bg-blue-600 transition"><i class="fas fa-users mr-3"></i> Users</a>
                <a href="#" id="admin-nav-drivers-mobile" class="flex items-center px-3 py-2 rounded-lg hover:bg-blue-600 transition"><i class="fas fa-id-badge mr-3"></i> Drivers</a>
                <a href="#" id="admin-nav-analytics-mobile" class="flex items-center px-3 py-2 rounded-lg hover:bg-blue-600 transition"><i class="fas fa-chart-bar mr-3"></i> Analytics</a>
                <a href="#" id="admin-nav-alerts-mobile" class="flex items-center px-3 py-2 rounded-lg hover:bg-blue-600 transition"><i class="fas fa-bell mr-3"></i> Alerts</a>
                <a href="#" id="admin-nav-settings-mobile" class="flex items-center px-3 py-2 rounded-lg hover:bg-blue-600 transition"><i class="fas fa-cog mr-3"></i> Settings</a>
              </nav>
            </div>
          </div>
          <!-- Sidebar overlay for mobile (legacy, now unused) -->
          <div id="admin-sidebar-overlay" class="hidden"></div>
        <!-- Main Content -->
          <section class="flex-1 flex flex-col min-h-screen w-full max-w-full">
            <div id="admin-dashboard-content" class="flex-1 p-2 sm:p-4 md:p-6 bg-gray-50 min-h-[70vh] transition-all duration-300 w-full max-w-full">
            <!-- Live Shipment Monitor -->
            <div class="mb-8 animate-fade-in-up">
              <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2"><i class="fas fa-shipping-fast text-blue-600 animate-truck-move"></i> Live Shipments</h2>
              <div id="admin-shipments-table-container"></div>
            </div>
            <!-- Analytics Widgets -->
            <div class="mb-8 animate-fade-in-up">
              <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2"><i class="fas fa-chart-bar text-purple-600"></i> Analytics</h2>
              <div id="admin-analytics-widget"></div>
            </div>
            <!-- Notifications -->
            <div class="mb-8 animate-fade-in-up">
              <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2"><i class="fas fa-bell text-orange-600"></i> Notifications</h2>
              <div id="admin-notifications-panel"></div>
            </div>
            <!-- Map Visualization -->
            <div class="mb-8 animate-fade-in-up">
              <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2"><i class="fas fa-map-marked-alt text-green-600"></i> Live Shipment Map</h2>
              <div id="admin-map-panel" class="w-full h-80 rounded-lg shadow"></div>
            </div>
          </div>
        </section>
      `;
      setupAdminSidebarNav();
      // Sidebar mobile toggle logic
      const sidebar = dash.querySelector("#admin-sidebar");
      const sidebarOverlay = dash.querySelector("#admin-sidebar-overlay");
      let hamburger = document.getElementById("admin-sidebar-open");
      const header = document.querySelector("header .container");
      if (!hamburger && header) {
        hamburger = document.createElement("button");
        hamburger.id = "admin-sidebar-open";
        hamburger.className =
          "md:hidden text-blue-700 text-2xl focus:outline-none ml-2";
        hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        header.insertBefore(hamburger, header.lastChild);
      }
      function openSidebar() {
        sidebar.classList.remove("-translate-x-full");
        sidebarOverlay.classList.remove("hidden");
      }
      function closeSidebar() {
        sidebar.classList.add("-translate-x-full");
        sidebarOverlay.classList.add("hidden");
      }
      if (hamburger) hamburger.onclick = openSidebar;
      const closeBtn = dash.querySelector("#admin-sidebar-close");
      if (closeBtn) closeBtn.onclick = closeSidebar;
      if (sidebarOverlay) sidebarOverlay.onclick = closeSidebar;
      const mobileMenuBtn = document.getElementById("admin-sidebar-open");
      const mobileMenu = dash.querySelector("#admin-mobile-menu");
      const mobileMenuClose = dash.querySelector("#admin-mobile-close");
      if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.onclick = () => {
          mobileMenu.classList.remove("hidden");
        };
      }
      if (mobileMenuClose && mobileMenu) {
        mobileMenuClose.onclick = () => {
          mobileMenu.classList.add("hidden");
        };
      }
      if (mobileMenu) {
        mobileMenu.onclick = (e) => {
          if (e.target === mobileMenu) {
            mobileMenu.classList.add("hidden");
          }
        };
      }
    }
    // Only update content area on data refresh
    const content = dash.querySelector("#admin-dashboard-content");
    if (content) {
      content.scrollTop = 0;
    }
    // Fetch and render real data
    fetchAndRenderAdminShipments();
    fetchAndRenderAdminAnalytics();
    fetchAndRenderAdminNotifications();
    // Start auto-refresh for real-time updates
    startAutoRefresh();
    startAdminPolling(user);
    // ... existing code ...
    // After rendering the dashboard HTML...
    setTimeout(() => {
      const mapDiv = document.getElementById("admin-map-panel");
      if (mapDiv && typeof L !== "undefined") {
        // Remove any previous map instance
        if (window.adminLiveMap && window.adminLiveMap.remove) {
          window.adminLiveMap.remove();
        }
        // Center on Nigeria by default
        window.adminLiveMap = L.map("admin-map-panel").setView(
          [9.082, 8.6753],
          6
        );
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(window.adminLiveMap);
        // Add shipment markers
        const shipments = JSON.parse(
          localStorage.getItem("adminShipments") || "[]"
        );
        // Get current status filter
        const statusFilter =
          document.getElementById("status-filter")?.value || "";
        shipments.forEach((s) => {
          if (statusFilter && s.status !== statusFilter) return;
          // Truck marker for sender (in transit)
          if (
            s.status === "In Transit" &&
            s.sender &&
            s.sender.lat &&
            s.sender.lng
          ) {
            const marker = L.marker([s.sender.lat, s.sender.lng], {
              icon: L.divIcon({
                className: "",
                html: '<div style="background:#2563eb;color:white;border-radius:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center;"><i class="fas fa-truck"></i></div>',
                iconSize: [24, 24],
                iconAnchor: [12, 12],
              }),
            }).addTo(window.adminLiveMap);
            marker.bindPopup(
              `<b>Tracking #:</b> ${s.trackingNumber}<br><b>Status:</b> ${s.status}`
            );
          }
          // Destination marker for recipient
          if (s.recipient && s.recipient.lat && s.recipient.lng) {
            const marker = L.marker([s.recipient.lat, s.recipient.lng], {
              icon: L.divIcon({
                className: "",
                html: '<div style="background:#dc2626;color:white;border-radius:50%;width:20px;height:20px;display:flex;align-items:center;justify-content:center;"><i class="fas fa-map-marker-alt"></i></div>',
                iconSize: [20, 20],
                iconAnchor: [10, 20],
              }),
            }).addTo(window.adminLiveMap);
            marker.bindPopup(
              `<b>Destination</b><br>${s.recipient.address || "Unknown"}`
            );
          }
        });
      }
    }, 100);
    // ... existing code ...
  }

  // --- Fetch and render admin data ---
  async function fetchAndRenderAdminShipments() {
    const jwt = localStorage.getItem("jwt");
    const container = document.getElementById(
      "admin-shipments-table-container"
    );
    if (!container) return;
    container.innerHTML =
      '<div class="text-gray-400">Loading shipments...</div>';
    if (!jwt) {
      container.innerHTML =
        '<div class="text-red-500">Not authenticated.</div>';
      return;
    }
    try {
      const res = await fetch("https://logixpress-tracking.onrender.com/api/shipments/all", {
        headers: { Authorization: "Bearer " + jwt },
      });
      if (!res.ok) {
        container.innerHTML =
          '<div class="text-red-500">Failed to load shipments.</div>';
        return;
      }
      const shipments = await res.json();
      window.adminShipments = shipments;
      localStorage.setItem("adminShipments", JSON.stringify(shipments));
      // Only update tbody if table exists, else render full table
      const tbody = document.getElementById("shipments-table-body");
      if (tbody) {
        tbody.innerHTML = renderAdminShipmentsTableBody(shipments);
      } else {
        container.innerHTML = renderAdminShipmentsTable(shipments);
      }
      setupShipmentFilters();
      renderShipmentJourney(shipments);
    } catch {
      container.innerHTML =
        '<div class="text-red-500">Error loading shipments.</div>';
    }
  }

  function renderAdminShipmentsTableBody(shipments) {
    if (!shipments || shipments.length === 0) {
      return `<tr><td colspan="9" class="text-center py-8 text-gray-500">No shipments found.</td></tr>`;
    }

    return shipments
      .map(
        (s) => `
      <tr class="border-b hover:bg-blue-50 transition-colors">
        <td class="truncate px-2 sm:px-4 py-2 sm:py-3 font-mono">${
          s.trackingNumber
        }</td>
        <td class="truncate px-2 sm:px-4 py-2 sm:py-3">
          <div class="font-medium">${
            s.user?.name || s.user?.email || "Unknown User"
          }</div>
          <div class="text-xs text-gray-500">${s.user?.email || ""}</div>
        </td>
        <td class="truncate px-2 sm:px-4 py-2 sm:py-3">
          <div class="font-medium">${s.sender?.name || "-"}</div>
          <div class="text-xs text-gray-500">${s.sender?.phone || "-"}</div>
        </td>
        <td class="truncate px-2 sm:px-4 py-2 sm:py-3">
          <div class="font-medium">${s.recipient?.name || "-"}</div>
          <div class="text-xs text-gray-500">${s.recipient?.phone || "-"}</div>
        </td>
        <td class="truncate px-2 sm:px-4 py-2 sm:py-3">
          <div class="font-medium">${s.package?.type || "-"}</div>
          <div class="text-xs text-gray-500">${
            s.package?.weight || "-"
          } kg</div>
        </td>
        <td class="truncate px-2 sm:px-4 py-2 sm:py-3">
          <span class="px-2 py-1 rounded-full text-xs font-medium ${
            s.status === "Delivered"
              ? "bg-green-100 text-green-800"
              : s.status === "In Transit"
              ? "bg-blue-100 text-blue-800"
              : s.status === "Pending Pickup"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-gray-100 text-gray-800"
          }">${s.status}</span>
        </td>
        <td class="truncate px-2 sm:px-4 py-2 sm:py-3">${
          s.createdAt ? new Date(s.createdAt).toLocaleDateString() : "-"
        }</td>
        <td class="truncate px-2 sm:px-4 py-2 sm:py-3">${
          s.estimatedDelivery
            ? new Date(s.estimatedDelivery).toLocaleDateString()
            : "-"
        }</td>
        <td class="truncate px-2 sm:px-4 py-2 sm:py-3">
          <div class="flex items-center gap-2 flex-wrap">
          <button onclick='viewShipmentDetails(JSON.parse(this.getAttribute("data-shipment")))' data-shipment='${JSON.stringify(
            s
          ).replace(
            /'/g,
            "&apos;"
          )}' class="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50" title="View Details">
              <i class="fas fa-eye text-sm"></i>
            </button>
            <button class="assign-driver-btn text-purple-600 hover:text-purple-800 p-1 rounded hover:bg-purple-50" title="Assign Driver" data-tracking="${
              s.trackingNumber
            }">
              <i class="fas fa-user-plus text-sm"></i>
            </button>
            <button onclick="updateShipmentStatus('${
              s.trackingNumber
            }')" class="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50" title="Update Status">
              <i class="fas fa-edit text-sm"></i>
            </button>
          </div>
        </td>
      </tr>
    `
      )
      .join("");
  }

  function renderAdminShipmentsTable(shipments) {
    if (!shipments || shipments.length === 0) {
      return `<div class="text-center py-8 text-gray-500">No shipments found.</div>`;
    }
    const statuses = [...new Set(shipments.map((s) => s.status))];

    // Set up event handlers for both desktop and mobile assign driver buttons
    setTimeout(() => {
      document.querySelectorAll(".assign-driver-btn").forEach((btn) => {
        btn.onclick = (e) => {
          e.preventDefault();
          const trackingNumber = btn.dataset.tracking;
          if (trackingNumber) {
            assignShipmentToDriver(trackingNumber);
          }
        };
      });
    }, 0);

    return `
      <div class="hidden sm:block w-full md:overflow-x-auto md:hide-scrollbar overflow-x-visible">
        <table class="w-full table-fixed text-xs sm:text-sm">
          <thead>
            <tr class="bg-blue-50 text-blue-700">
              <th class="truncate px-2 sm:px-4 py-2 sm:py-3 text-left font-medium uppercase tracking-wider">Tracking #</th>
              <th class="truncate px-2 sm:px-4 py-2 sm:py-3 text-left font-medium uppercase tracking-wider">User</th>
              <th class="truncate px-2 sm:px-4 py-2 sm:py-3 text-left font-medium uppercase tracking-wider">Sender</th>
              <th class="truncate px-2 sm:px-4 py-2 sm:py-3 text-left font-medium uppercase tracking-wider">Recipient</th>
              <th class="truncate px-2 sm:px-4 py-2 sm:py-3 text-left font-medium uppercase tracking-wider">Package</th>
              <th class="truncate px-2 sm:px-4 py-2 sm:py-3 text-left font-medium uppercase tracking-wider">Status</th>
              <th class="truncate px-2 sm:px-4 py-2 sm:py-3 text-left font-medium uppercase tracking-wider">Created</th>
              <th class="truncate px-2 sm:px-4 py-2 sm:py-3 text-left font-medium uppercase tracking-wider">ETA</th>
              <th class="truncate px-2 sm:px-4 py-2 sm:py-3 text-left font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody id="shipments-table-body">
            ${renderAdminShipmentsTableBody(shipments)}
          </tbody>
        </table>
      </div>
      <!-- Card view for mobile screens (unchanged) -->
      <div class="block sm:hidden w-full space-y-4">
        ${shipments
          .map(
            (s) => `
          <div class="bg-white rounded-lg shadow p-4 flex flex-col gap-2">
            <div class="flex items-center justify-between">
              <span class="font-mono text-xs font-bold text-blue-700">${
                s.trackingNumber
              }</span>
              <span class="px-2 py-1 rounded-full text-xs font-medium ${
                s.status === "Delivered"
                  ? "bg-green-100 text-green-800"
                  : s.status === "In Transit"
                  ? "bg-blue-100 text-blue-800"
                  : s.status === "Pending Pickup"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
              }">${s.status}</span>
            </div>
            <div><span class="font-semibold">User:</span> ${
              s.user?.name || s.user?.email || "Unknown User"
            }</div>
            <div><span class="font-semibold">Sender:</span> ${
              s.sender?.name || "-"
            } (${s.sender?.phone || "-"})</div>
            <div><span class="font-semibold">Recipient:</span> ${
              s.recipient?.name || "-"
            } (${s.recipient?.phone || "-"})</div>
            <div><span class="font-semibold">Package:</span> ${
              s.package?.type || "-"
            }, ${s.package?.weight || "-"} kg</div>
            <div><span class="font-semibold">Created:</span> ${
              s.createdAt ? new Date(s.createdAt).toLocaleDateString() : "-"
            }</div>
            <div><span class="font-semibold">ETA:</span> ${
              s.estimatedDelivery
                ? new Date(s.estimatedDelivery).toLocaleDateString()
                : "-"
            }</div>
            <div class="flex gap-2 mt-2">
             <button onclick='viewShipmentDetails(JSON.parse(this.getAttribute("data-shipment")))' data-shipment='${JSON.stringify(
               s
             ).replace(
               /'/g,
               "&apos;"
             )}' class="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50" title="View Details">
                <i class="fas fa-eye text-sm"></i>
              </button>
              <button class="assign-driver-btn text-purple-600 hover:text-purple-800 p-1 rounded hover:bg-purple-50" title="Assign Driver" data-tracking="${
                s.trackingNumber
              }">
                <i class="fas fa-user-plus text-sm"></i>
              </button>
              <button onclick="updateShipmentStatus('${
                s.trackingNumber
              }')" class="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50" title="Update Status">
                <i class="fas fa-edit text-sm"></i>
              </button>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    `;
  }

  function renderAdminAnalyticsWidget(data) {
    if (!data) {
      return `<div class="text-center py-6 text-gray-500">No analytics data.</div>`;
    }
    return `
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
        <div class="bg-white rounded-lg shadow p-4 sm:p-6 w-full">
          <div class="text-sm text-gray-500 mb-1">Shipments Delivered This Month</div>
          <div class="text-2xl font-bold text-green-600 mb-2">${
            data.deliveredThisMonth || 0
          }</div>
        </div>
        <div class="bg-white rounded-lg shadow p-4 sm:p-6 w-full">
          <div class="text-sm text-gray-500 mb-1">Average Delivery Time</div>
          <div class="text-2xl font-bold text-blue-600 mb-2">${
            data.avgDeliveryTime || 0
          } days</div>
        </div>
        <div class="bg-white rounded-lg shadow p-4 sm:p-6 w-full">
          <div class="text-sm text-gray-500 mb-1">Missed Deliveries</div>
          <div class="text-2xl font-bold text-red-600 mb-2">${
            data.missedDeliveries || 0
          }</div>
        </div>
      </div>
    `;
  }

  async function fetchAndRenderAdminNotifications() {
    const jwt = localStorage.getItem("jwt");
    const container = document.getElementById("admin-notifications-panel");
    if (!container) return;
    container.innerHTML =
      '<div class="text-gray-400">Loading notifications...</div>';
    if (!jwt) {
      container.innerHTML =
        '<div class="text-red-500">Not authenticated.</div>';
      return;
    }
    try {
      const res = await fetch("https://logixpress-tracking.onrender.com/api/notifications/all", {
        headers: { Authorization: "Bearer " + jwt },
      });
      if (!res.ok) {
        container.innerHTML =
          '<div class="text-red-500">Failed to load notifications.</div>';
        console.error(
          "Admin notifications fetch failed:",
          res.status,
          await res.text()
        );
        return;
      }
      const notifications = await res.json();
      container.innerHTML = renderAdminNotifications(notifications);
    } catch (err) {
      container.innerHTML =
        '<div class="text-red-500">Error loading notifications.</div>';
      console.error("Admin notifications fetch error:", err);
    }
  }

  function renderAdminNotifications(notifications) {
    if (!notifications || notifications.length === 0) {
      return `<div class="text-center py-6 text-gray-500">No notifications.</div>`;
    }
    // Only show admin notifications
    return notifications
      .filter((n) => n.title === "New Shipment Created")
      .slice(0, 5)
      .map((n) => {
        const userName = n.message.match(/by user ([^.]*)\./)?.[1] || "Unknown";
        return `
            <div class="mb-3 p-3 bg-white rounded shadow border border-gray-100">
              <div class="font-semibold text-blue-700 mb-1">${n.title}</div>
              <div class="text-gray-700 text-sm mb-1">${n.message}</div>
              <div class="text-xs text-gray-500 mb-1">User: ${userName}</div>
              <div class="text-xs text-gray-500">${
                n.createdAt ? new Date(n.createdAt).toLocaleString() : ""
              }</div>
            </div>
          `;
      })
      .join("");
  }

  // --- Utility: Remove/Restore Public Nav Links and Get Started Button ---
  function removePublicNavLinksAndGetStarted() {
    // Remove public nav links (desktop)
    const header = document.querySelector("header .container");
    if (header) {
      const nav = header.querySelector("nav");
      if (nav) nav.remove();
      // Remove Get Started group (desktop)
      const getStartedGroup = header.querySelector(
        ".ml-3, .hidden.md\\:block.ml-3"
      );
      if (getStartedGroup) getStartedGroup.remove();
    }
    // Remove mobile nav links and Get Started button
    const mobileMenu = document.getElementById("mobile-menu");
    if (mobileMenu) mobileMenu.remove();
    const mobileMenuBtn = document.getElementById("mobile-menu-button");
    if (mobileMenuBtn) mobileMenuBtn.remove();
  }
  function restorePublicNavLinksAndGetStarted() {
    location.reload();
  }

  // --- Admin Shipment Management Functions ---
  // Make functions globally accessible for onclick handlers
  window.viewShipmentDetails = function (shipment) {
    if (!shipment || typeof shipment !== "object") {
      showToast("Shipment details not found", "error");
      return;
    }
    // Modal rendering code using the shipment object:
    const modal = document.createElement("div");
    modal.className =
      "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[2000]";
    modal.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-gray-800">Shipment Details</h3>
          <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 class="font-semibold text-gray-700 mb-2">Tracking Information</h4>
              <p><strong>Tracking #:</strong> ${shipment.trackingNumber}</p>
              <p><strong>Status:</strong> <span class="px-2 py-1 rounded-full text-xs font-medium ${
                shipment.status === "Delivered"
                  ? "bg-green-100 text-green-800"
                  : shipment.status === "In Transit"
                  ? "bg-blue-100 text-blue-800"
                  : shipment.status === "Pending Pickup"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
              }">${shipment.status}</span></p>
              <p><strong>Created:</strong> ${
                shipment.createdAt
                  ? new Date(shipment.createdAt).toLocaleString()
                  : "-"
              }</p>
              <p><strong>ETA:</strong> ${
                shipment.estimatedDelivery
                  ? new Date(shipment.estimatedDelivery).toLocaleDateString()
                  : "-"
              }</p>
            </div>
            <div>
              <h4 class="font-semibold text-gray-700 mb-2">User Information</h4>
              <p><strong>User:</strong> ${
                shipment.user?.name || shipment.user?.email || "Unknown"
              }</p>
              <p><strong>User ID:</strong> ${
                shipment.user?._id || shipment.user || "Unknown"
              }</p>
            <p><strong>Email:</strong> ${shipment.user?.email || "Unknown"}</p>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 class="font-semibold text-gray-700 mb-2">Sender Details</h4>
              <p><strong>Name:</strong> ${shipment.sender?.name || "-"}</p>
              <p><strong>Phone:</strong> ${shipment.sender?.phone || "-"}</p>
              <p><strong>Email:</strong> ${shipment.sender?.email || "-"}</p>
            <p><strong>Address:</strong> ${shipment.sender?.address || "-"}</p>
            </div>
            <div>
              <h4 class="font-semibold text-gray-700 mb-2">Recipient Details</h4>
              <p><strong>Name:</strong> ${shipment.recipient?.name || "-"}</p>
              <p><strong>Phone:</strong> ${shipment.recipient?.phone || "-"}</p>
              <p><strong>Email:</strong> ${shipment.recipient?.email || "-"}</p>
              <p><strong>Address:</strong> ${
                shipment.recipient?.address || "-"
              }</p>
            </div>
          </div>
          <div>
            <h4 class="font-semibold text-gray-700 mb-2">Package Details</h4>
            <p><strong>Type:</strong> ${shipment.package?.type || "-"}</p>
          <p><strong>Weight:</strong> ${shipment.package?.weight || "-"} kg</p>
            <p><strong>Dimensions:</strong> ${
              shipment.package?.dimensions || "-"
            }</p>
            <p><strong>Description:</strong> ${
              shipment.package?.description || "-"
            }</p>
          </div>
          ${
            shipment.preferences
              ? `<div><h4 class="font-semibold text-gray-700 mb-2">Shipping Preferences</h4>
            <p><strong>Delivery Type:</strong> ${
              shipment.preferences?.deliveryType || "-"
            }</p>
            <p><strong>Insurance:</strong> ${
              shipment.preferences?.insurance ? "Yes" : "No"
            }</p>
            <p><strong>Fragile:</strong> ${
              shipment.preferences?.fragile ? "Yes" : "No"
            }</p></div>`
              : ""
          }
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  };

  window.updateShipmentStatus = function (trackingNumber) {
    // Find the shipment from localStorage
    const shipments = JSON.parse(
      localStorage.getItem("adminShipments") || "[]"
    );
    const shipment = shipments.find((s) => s.trackingNumber === trackingNumber);
    if (!shipment) {
      showToast("Shipment not found.", "error");
      return;
    }
    // Create modal
    const modal = document.createElement("div");
    modal.className =
      "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40";
    modal.innerHTML = `
      <div class="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 relative">
        <button class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl" onclick="this.closest('.fixed').remove()">&times;</button>
        <h2 class="text-lg font-bold mb-4">Update Shipment Status</h2>
        <form id="update-status-form">
          <label class="block mb-2 font-medium">Status</label>
          <select id="new-status" class="w-full border rounded px-3 py-2 mb-4">
            <option value="Pending Pickup" ${
              shipment.status === "Pending Pickup" ? "selected" : ""
            }>Pending Pickup</option>
            <option value="In Transit" ${
              shipment.status === "In Transit" ? "selected" : ""
            }>In Transit</option>
            <option value="Delivered" ${
              shipment.status === "Delivered" ? "selected" : ""
            }>Delivered</option>
            <option value="Delayed" ${
              shipment.status === "Delayed" ? "selected" : ""
            }>Delayed</option>
            <option value="Cancelled" ${
              shipment.status === "Cancelled" ? "selected" : ""
            }>Cancelled</option>
            </select>
          <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition">Update</button>
        </form>
      </div>
    `;
    document.body.appendChild(modal);
    // Handle form submit
    const form = modal.querySelector("#update-status-form");
    form.onsubmit = async function (e) {
      e.preventDefault();
      const newStatus = modal.querySelector("#new-status").value;
      if (!newStatus || newStatus === shipment.status) {
        showToast("Please select a different status.", "error");
        return;
      }
      const jwt = localStorage.getItem("jwt");
      try {
        const res = await fetch(
          `https://logixpress-tracking.onrender.com/api/shipments/${trackingNumber}/status`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + jwt,
            },
            body: JSON.stringify({ status: newStatus }),
          }
        );
        if (res.ok) {
          showToast("Shipment status updated.");
          modal.remove();
          fetchAndRenderAdminShipments();
        } else {
          const data = await res.json().catch(() => ({}));
          showToast(data.message || "Failed to update status.", "error");
        }
      } catch (err) {
        showToast("Error updating status.", "error");
      }
    };
  };

  // Add fade-in and fade-in-up animations
  const style = document.createElement("style");
  style.innerHTML = `
  @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
  .animate-fade-in { animation: fade-in 0.5s ease; }
  @keyframes fade-in-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
  .animate-fade-in-up { animation: fade-in-up 0.7s cubic-bezier(.39,.575,.565,1) both; }
  `;
  document.head.appendChild(style);

  // --- Enhanced Shipment Monitor Functions ---

  // Search and filter functionality
  function setupShipmentFilters() {
    const searchInput = document.getElementById("shipment-search");
    const statusFilter = document.getElementById("status-filter");
    const sortSelect = document.getElementById("sort-options");
    const refreshBtn = document.getElementById("refresh-shipments");

    if (searchInput) {
      searchInput.addEventListener("input", filterShipments);
    }

    if (statusFilter) {
      statusFilter.addEventListener("change", filterShipments);
    }

    if (sortSelect) {
      sortSelect.addEventListener("change", sortShipments);
    }

    if (refreshBtn) {
      refreshBtn.addEventListener("click", () => {
        refreshBtn.classList.add("animate-spin");
        fetchAndRenderAdminShipments();
        setTimeout(() => {
          refreshBtn.classList.remove("animate-spin");
        }, 1000);
      });
    }
  }

  function filterShipments() {
    const searchTerm =
      document.getElementById("shipment-search")?.value.toLowerCase() || "";
    const statusFilter = document.getElementById("status-filter")?.value || "";
    const rows = document.querySelectorAll("#shipments-table-body tr");
    let visibleCount = 0;

    rows.forEach((row) => {
      const tracking = row.getAttribute("data-tracking")?.toLowerCase() || "";
      const user = row.getAttribute("data-user")?.toLowerCase() || "";
      const sender = row.getAttribute("data-sender")?.toLowerCase() || "";
      const status = row.getAttribute("data-status") || "";

      const matchesSearch =
        !searchTerm ||
        tracking.includes(searchTerm) ||
        user.includes(searchTerm) ||
        sender.includes(searchTerm);

      const matchesStatus = !statusFilter || status === statusFilter;

      if (matchesSearch && matchesStatus) {
        row.style.display = "";
        visibleCount++;
      } else {
        row.style.display = "none";
      }
    });

    // Update results count
    const resultsCount = document.getElementById("results-count");
    if (resultsCount) {
      resultsCount.textContent = `Showing ${visibleCount} shipments`;
    }
  }

  function sortShipments() {
    const sortBy =
      document.getElementById("sort-options")?.value || "created-desc";
    const tbody = document.getElementById("shipments-table-body");
    if (!tbody) return;

    const rows = Array.from(tbody.querySelectorAll("tr"));

    rows.sort((a, b) => {
      switch (sortBy) {
        case "created-desc":
          const dateA = new Date(
            a.querySelector("td:nth-child(7)")?.textContent || ""
          );
          const dateB = new Date(
            b.querySelector("td:nth-child(7)")?.textContent || ""
          );
          return dateB - dateA;
        case "created-asc":
          const dateA2 = new Date(
            a.querySelector("td:nth-child(7)")?.textContent || ""
          );
          const dateB2 = new Date(
            b.querySelector("td:nth-child(7)")?.textContent || ""
          );
          return dateA2 - dateB2;
        case "status":
          const statusA = a.getAttribute("data-status") || "";
          const statusB = b.getAttribute("data-status") || "";
          return statusA.localeCompare(statusB);
        case "tracking":
          const trackingA = a.getAttribute("data-tracking") || "";
          const trackingB = b.getAttribute("data-tracking") || "";
          return trackingA.localeCompare(trackingB);
        default:
          return 0;
      }
    });

    // Re-append sorted rows
    rows.forEach((row) => tbody.appendChild(row));
  }

  // Auto-refresh functionality
  function startAutoRefresh() {
    setInterval(() => {
      fetchAndRenderAdminShipments();
    }, 30000); // Refresh every 30 seconds
  }

  function startAdminPolling(user) {
    stopAdminPolling();
    if (user && user.role === "admin") {
      analyticsPollInterval = setInterval(() => {
        fetchAndRenderAdminAnalytics();
      }, 30000); // 30s
      notificationsPollInterval = setInterval(() => {
        fetchAndRenderAdminNotifications();
      }, 15000); // 15s
    }
  }
  function stopAdminPolling() {
    if (analyticsPollInterval) clearInterval(analyticsPollInterval);
    if (notificationsPollInterval) clearInterval(notificationsPollInterval);
    analyticsPollInterval = null;
    notificationsPollInterval = null;
  }
  // Call startAdminPolling(user) after rendering admin dashboard content, regardless of polling
  // Call stopAdminPolling() on logout or navigation
  // ... existing code ...
  // In renderAdminDashboard(user):
  // ... after dashboard is rendered ...
  startAdminPolling(user);
  // ... existing code ...
  // In logoutUser():
  stopAdminPolling();
  // ... existing code ...

  // --- Admin Analytics Fetch/Render ---
  async function fetchAndRenderAdminAnalytics() {
    const jwt = localStorage.getItem("jwt");
    const container = document.getElementById("admin-analytics-widget");
    if (!container) return;
    container.innerHTML =
      '<div class="text-gray-400">Loading analytics...</div>';
    if (!jwt) {
      container.innerHTML =
        '<div class="text-red-500">Not authenticated.</div>';
      return;
    }
    try {
      const res = await fetch("https://logixpress-tracking.onrender.com/api/analytics", {
        headers: { Authorization: "Bearer " + jwt },
      });
      if (!res.ok) {
        container.innerHTML =
          '<div class="text-red-500">Failed to load analytics.</div>';
        console.error(
          "Admin analytics fetch failed:",
          res.status,
          await res.text()
        );
        return;
      }
      const data = await res.json();
      if (!data) {
        container.innerHTML =
          '<div class="text-gray-500">No analytics data.</div>';
        return;
      }
      container.innerHTML = renderAdminAnalyticsWidget(data);
    } catch (err) {
      container.innerHTML =
        '<div class="text-red-500">Error loading analytics.</div>';
      console.error("Admin analytics fetch error:", err);
    }
  }

  // --- Comprehensive Analytics Functions ---
  async function fetchAndRenderComprehensiveAnalytics() {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      showToast("Not authenticated.", "error");
      return;
    }

    try {
      const res = await fetch(
        "https://logixpress-tracking.onrender.com/api/analytics/comprehensive",
        {
          headers: { Authorization: "Bearer " + jwt },
        }
      );

      if (!res.ok) {
        showToast("Failed to load analytics data.", "error");
        return;
      }

      const data = await res.json();
      renderAnalyticsKPIs(data);
      renderAnalyticsCharts(data);
      renderDriverPerformanceTable(data.driverPerformance);
    } catch (err) {
      showToast("Error loading analytics data.", "error");
      console.error("Analytics fetch error:", err);
    }
  }

  function renderAnalyticsKPIs(data) {
    // Update KPI cards with animated data
    const totalShipmentsEl = document.getElementById("total-shipments");
    const onTimeRateEl = document.getElementById("on-time-rate");
    const avgDeliveryTimeEl = document.getElementById("avg-delivery-time");
    const missedDeliveriesEl = document.getElementById("missed-deliveries");

    // Animate number counting
    function animateNumber(element, targetValue, suffix = "") {
      if (!element) return;

      const startValue = 0;
      const duration = 1500;
      const startTime = performance.now();

      function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(
          startValue + (targetValue - startValue) * easeOutQuart
        );

        element.textContent = currentValue + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateNumber);
        } else {
          element.textContent = targetValue + suffix;
        }
      }

      requestAnimationFrame(updateNumber);
    }

    // Animate percentage with decimal precision
    function animatePercentage(element, targetValue) {
      if (!element) return;

      const startValue = 0;
      const duration = 1500;
      const startTime = performance.now();

      function updatePercentage(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = (
          startValue +
          (targetValue - startValue) * easeOutQuart
        ).toFixed(1);

        element.textContent = `${currentValue}%`;

        if (progress < 1) {
          requestAnimationFrame(updatePercentage);
        } else {
          element.textContent = `${targetValue}%`;
        }
      }

      requestAnimationFrame(updatePercentage);
    }

    // Animate decimal number
    function animateDecimal(element, targetValue, suffix = "") {
      if (!element) return;

      const startValue = 0;
      const duration = 1500;
      const startTime = performance.now();

      function updateDecimal(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = (
          startValue +
          (targetValue - startValue) * easeOutQuart
        ).toFixed(1);

        element.textContent = `${currentValue} ${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(updateDecimal);
        } else {
          element.textContent = `${targetValue} ${suffix}`;
        }
      }

      requestAnimationFrame(updateDecimal);
    }

    // Animate cards with staggered timing
    setTimeout(() => {
      if (totalShipmentsEl) {
        const total =
          data.basicAnalytics.deliveredThisMonth +
          data.basicAnalytics.missedDeliveries;
        animateNumber(totalShipmentsEl, total);
      }
    }, 200);

    setTimeout(() => {
      if (onTimeRateEl) {
        animatePercentage(
          onTimeRateEl,
          parseFloat(data.onTimeDelivery.onTimeRate)
        );
      }
    }, 400);

    setTimeout(() => {
      if (avgDeliveryTimeEl) {
        animateDecimal(
          avgDeliveryTimeEl,
          parseFloat(data.basicAnalytics.avgDeliveryTime),
          "days"
        );
      }
    }, 600);

    setTimeout(() => {
      if (missedDeliveriesEl) {
        animateNumber(missedDeliveriesEl, data.basicAnalytics.missedDeliveries);
      }
    }, 800);

    // Add pulse animation to cards
    const kpiCards = document.querySelectorAll(
      ".bg-white.rounded-xl.shadow-lg.p-6"
    );
    kpiCards.forEach((card, index) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(20px)";
      card.style.transition = "all 0.6s ease-out";

      setTimeout(() => {
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      }, index * 200 + 100);
    });

    // Add click animations and hover effects
    kpiCards.forEach((card, index) => {
      // Add click animation
      card.addEventListener("click", function () {
        this.style.transform = "scale(0.95)";
        setTimeout(() => {
          this.style.transform = "scale(1)";
        }, 150);
      });

      // Add glow effect on hover
      card.addEventListener("mouseenter", function () {
        this.style.boxShadow =
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)";
        this.style.borderColor = this.querySelector(
          ".border-l-4"
        ).classList.contains("border-blue-500")
          ? "#3b82f6"
          : this.querySelector(".border-l-4").classList.contains(
              "border-green-500"
            )
          ? "#10b981"
          : this.querySelector(".border-l-4").classList.contains(
              "border-purple-500"
            )
          ? "#8b5cf6"
          : "#ef4444";
      });

      card.addEventListener("mouseleave", function () {
        this.style.boxShadow = "";
        this.style.borderColor = "";
      });

      // Add periodic pulse animation
      setInterval(() => {
        if (card.style.transform !== "scale(0.95)") {
          card.style.transform = "scale(1.02)";
          setTimeout(() => {
            card.style.transform = "scale(1)";
          }, 200);
        }
      }, 5000 + index * 1000); // Staggered pulse every 5-8 seconds
    });
  }

  function renderAnalyticsCharts(data) {
    // Animate chart containers
    const chartContainers = document.querySelectorAll(
      ".bg-white.rounded-xl.shadow-lg.p-6"
    );
    chartContainers.forEach((container, index) => {
      container.style.opacity = "0";
      container.style.transform = "translateY(30px)";
      container.style.transition = "all 0.8s ease-out";

      setTimeout(() => {
        container.style.opacity = "1";
        container.style.transform = "translateY(0)";
      }, 1000 + index * 200);
    });

    // Render charts with staggered timing
    setTimeout(() => {
      renderMonthlyTrendsChart(data.monthlyTrends);
    }, 1200);

    setTimeout(() => {
      renderStatusDistributionChart(data.statusDistribution);
    }, 1400);

    setTimeout(() => {
      renderRoutesChart(data.mostUsedRoutes);
    }, 1600);

    setTimeout(() => {
      renderZonesChart(data.problematicZones);
    }, 1800);
  }

  function renderMonthlyTrendsChart(monthlyData) {
    const ctx = document.getElementById("monthly-trends-chart");
    if (!ctx) return;

    // Destroy existing chart if it exists
    if (window.monthlyTrendsChart) {
      window.monthlyTrendsChart.destroy();
    }

    const labels = monthlyData.map((item) => item.month);
    const shipmentsData = monthlyData.map((item) => item.shipments);
    const deliveredData = monthlyData.map((item) => item.delivered);

    window.monthlyTrendsChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Total Shipments",
            data: shipmentsData,
            borderColor: "rgb(59, 130, 246)",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            tension: 0.4,
            fill: true,
          },
          {
            label: "Delivered",
            data: deliveredData,
            borderColor: "rgb(34, 197, 94)",
            backgroundColor: "rgba(34, 197, 94, 0.1)",
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(0, 0, 0, 0.1)",
            },
          },
          x: {
            grid: {
              color: "rgba(0, 0, 0, 0.1)",
            },
          },
        },
        animation: {
          duration: 1000,
          easing: "easeInOutQuart",
        },
      },
    });
  }

  function renderStatusDistributionChart(statusData) {
    const ctx = document.getElementById("status-distribution-chart");
    if (!ctx) return;

    // Destroy existing chart if it exists
    if (window.statusDistributionChart) {
      window.statusDistributionChart.destroy();
    }

    const labels = statusData.map((item) => item.status);
    const data = statusData.map((item) => item.count);
    const colors = [
      "rgba(34, 197, 94, 0.8)",
      "rgba(59, 130, 246, 0.8)",
      "rgba(251, 191, 36, 0.8)",
      "rgba(239, 68, 68, 0.8)",
    ];

    window.statusDistributionChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: colors,
            borderWidth: 2,
            borderColor: "#ffffff",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.label || "";
                const value = context.parsed;
                const percentage = (
                  (value / context.dataset.data.reduce((a, b) => a + b, 0)) *
                  100
                ).toFixed(1);
                return `${label}: ${value} (${percentage}%)`;
              },
            },
          },
        },
        animation: {
          duration: 1000,
          easing: "easeInOutQuart",
        },
      },
    });
  }

  function renderRoutesChart(routesData) {
    const ctx = document.getElementById("routes-chart");
    if (!ctx) return;

    // Destroy existing chart if it exists
    if (window.routesChart) {
      window.routesChart.destroy();
    }

    const labels = routesData.map((item) => item.route);
    const data = routesData.map((item) => item.count);

    window.routesChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Shipment Count",
            data: data,
            backgroundColor: "rgba(147, 51, 234, 0.8)",
            borderColor: "rgb(147, 51, 234)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(0, 0, 0, 0.1)",
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
        animation: {
          duration: 1000,
          easing: "easeInOutQuart",
        },
      },
    });
  }

  function renderZonesChart(zonesData) {
    const ctx = document.getElementById("zones-chart");
    if (!ctx) return;

    // Destroy existing chart if it exists
    if (window.zonesChart) {
      window.zonesChart.destroy();
    }

    const labels = zonesData.map((item) => item.zone);
    const data = zonesData.map((item) => parseFloat(item.delayRate));

    window.zonesChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Delay Rate (%)",
            data: data,
            backgroundColor: data.map((rate) =>
              rate > 15
                ? "rgba(239, 68, 68, 0.8)"
                : rate > 10
                ? "rgba(251, 191, 36, 0.8)"
                : "rgba(34, 197, 94, 0.8)"
            ),
            borderColor: data.map((rate) =>
              rate > 15
                ? "rgb(239, 68, 68)"
                : rate > 10
                ? "rgb(251, 191, 36)"
                : "rgb(34, 197, 94)"
            ),
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            grid: {
              color: "rgba(0, 0, 0, 0.1)",
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
        animation: {
          duration: 1000,
          easing: "easeInOutQuart",
        },
      },
    });
  }

  function renderDriverPerformanceTable(driverData) {
    const container = document.getElementById("driver-performance-table");
    if (!container) return;

    if (!driverData || driverData.length === 0) {
      container.innerHTML =
        '<div class="text-gray-500 text-center py-8">No driver performance data available.</div>';
      return;
    }

    container.innerHTML = `
      <table class="w-full text-sm">
        <thead>
          <tr class="bg-blue-50 text-blue-700">
            <th class="px-4 py-2 text-left font-medium">Driver Name</th>
            <th class="px-4 py-2 text-left font-medium">Total Assignments</th>
            <th class="px-4 py-2 text-left font-medium">Delivery Rate</th>
            <th class="px-4 py-2 text-left font-medium">Avg Rating</th>
            <th class="px-4 py-2 text-left font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          ${driverData
            .map(
              (driver) => `
            <tr class="border-b hover:bg-blue-50 transition-colors">
              <td class="px-4 py-2 font-medium">${driver.driverName}</td>
              <td class="px-4 py-2">${driver.totalAssignments}</td>
              <td class="px-4 py-2">
                <span class="px-2 py-1 rounded-full text-xs font-medium ${
                  parseFloat(driver.deliveryRate) >= 90
                    ? "bg-green-100 text-green-800"
                    : parseFloat(driver.deliveryRate) >= 75
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }">${driver.deliveryRate}%</span>
              </td>
              <td class="px-4 py-2">
                <div class="flex items-center">
                  <span class="mr-1">${driver.avgRating}</span>
                  <div class="flex text-yellow-400">
                    ${Array.from(
                      { length: 5 },
                      (_, i) =>
                        `<i class="fas fa-star ${
                          i < Math.floor(driver.avgRating)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }"></i>`
                    ).join("")}
                  </div>
                </div>
              </td>
              <td class="px-4 py-2">
                <span class="px-2 py-1 rounded-full text-xs font-medium ${
                  driver.status === "online"
                    ? "bg-green-100 text-green-800"
                    : driver.status === "busy"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
                }">${driver.status}</span>
              </td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;
  }

  // --- Admin Notifications Fetch/Render ---
  async function fetchAndRenderAdminNotifications() {
    const jwt = localStorage.getItem("jwt");
    const container = document.getElementById("admin-notifications-panel");
    if (!container) return;
    container.innerHTML =
      '<div class="text-gray-400">Loading notifications...</div>';
    if (!jwt) {
      container.innerHTML =
        '<div class="text-red-500">Not authenticated.</div>';
      return;
    }
    try {
      const res = await fetch("https://logixpress-tracking.onrender.com/api/notifications/all", {
        headers: { Authorization: "Bearer " + jwt },
      });
      if (!res.ok) {
        container.innerHTML =
          '<div class="text-red-500">Failed to load notifications.</div>';
        console.error(
          "Admin notifications fetch failed:",
          res.status,
          await res.text()
        );
        return;
      }
      const notifications = await res.json();
      container.innerHTML = renderAdminNotifications(notifications);
    } catch (err) {
      container.innerHTML =
        '<div class="text-red-500">Error loading notifications.</div>';
      console.error("Admin notifications fetch error:", err);
    }
  }

  function startAdminMapPolling() {
    if (adminMapPollInterval) clearInterval(adminMapPollInterval);
    adminMapPollInterval = setInterval(async () => {
      // Fetch latest shipments
      const jwt = localStorage.getItem("jwt");
      if (!jwt) return;
      try {
        const res = await fetch("https://logixpress-tracking.onrender.com/api/shipments/all", {
          headers: { Authorization: "Bearer " + jwt },
        });
        if (!res.ok) return;
        const shipments = await res.json();
        // Update map markers (assume window.adminLiveMap exists)
        if (window.renderAdminMapMarkers) {
          window.renderAdminMapMarkers(shipments);
        }
      } catch (err) {
        // Silent fail
      }
    }, 10000); // 10 seconds
  }

  function stopAdminMapPolling() {
    if (adminMapPollInterval) clearInterval(adminMapPollInterval);
    adminMapPollInterval = null;
  }

  // In renderAdminDashboard, after rendering the map and markers:
  // startAdminMapPolling();
  // On logout or navigation away from admin dashboard:
  // stopAdminMapPolling();
  // ... existing code ...

  // ... existing code ...
  // Add this function to update admin map markers
  window.renderAdminMapMarkers = function (shipments) {
    if (!window.adminLiveMap) return;
    // Use a map of trackingNumber to marker for trucks
    if (!window.adminTruckMarkers) window.adminTruckMarkers = {};
    // Remove destination markers (always re-add)
    if (window.adminDestMarkers) {
      window.adminDestMarkers.forEach((m) =>
        window.adminLiveMap.removeLayer(m)
      );
    }
    window.adminDestMarkers = [];
    const statusFilter = document.getElementById("status-filter")?.value || "";
    shipments
      .filter((s) => !statusFilter || s.status === statusFilter)
      .forEach((s) => {
        // Animate truck marker (sender location)
        if (
          s.sender &&
          s.sender.lat &&
          s.sender.lng &&
          s.status === "In Transit"
        ) {
          const key = s.trackingNumber;
          const newLatLng = L.latLng(s.sender.lat, s.sender.lng);
          if (window.adminTruckMarkers[key]) {
            // Animate movement
            const marker = window.adminTruckMarkers[key];
            animateMarkerMove(marker, newLatLng);
          } else {
            // Create new marker
            const marker = L.marker(newLatLng, {
              icon: L.divIcon({
                className: "",
                html: '<div style="background:#2563eb;color:white;border-radius:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center;"><i class="fas fa-truck"></i></div>',
                iconSize: [24, 24],
                iconAnchor: [12, 12],
              }),
            })
              .addTo(window.adminLiveMap)
              .bindPopup(
                `<b>Tracking #:</b> ${s.trackingNumber}<br><b>Status:</b> ${s.status}`
              );
            window.adminTruckMarkers[key] = marker;
          }
        } else if (
          window.adminTruckMarkers &&
          window.adminTruckMarkers[s.trackingNumber]
        ) {
          // Remove marker if shipment is no longer in transit
          window.adminLiveMap.removeLayer(
            window.adminTruckMarkers[s.trackingNumber]
          );
          delete window.adminTruckMarkers[s.trackingNumber];
        }
        // Destination marker
        if (s.recipient && s.recipient.lat && s.recipient.lng) {
          const destMarker = L.marker([s.recipient.lat, s.recipient.lng], {
            icon: L.divIcon({
              className: "",
              html: '<div style="background:#dc2626;color:white;border-radius:50%;width:20px;height:20px;display:flex;align-items:center;justify-content:center;"><i class="fas fa-map-marker-alt"></i></div>',
              iconSize: [20, 20],
              iconAnchor: [10, 20],
            }),
          })
            .addTo(window.adminLiveMap)
            .bindPopup(`<b>Destination</b><br>${s.recipient.address}`);
          window.adminDestMarkers.push(destMarker);
        }
      });
  };

  // Helper to animate marker movement
  function animateMarkerMove(marker, newLatLng) {
    const duration = 1000; // ms
    const frames = 20;
    const start = marker.getLatLng();
    let frame = 0;
    function step() {
      frame++;
      const lat = start.lat + (newLatLng.lat - start.lat) * (frame / frames);
      const lng = start.lng + (newLatLng.lng - start.lng) * (frame / frames);
      marker.setLatLng([lat, lng]);
      if (frame < frames) {
        setTimeout(step, duration / frames);
      } else {
        marker.setLatLng(newLatLng);
      }
    }
    step();
  }
  // ... existing code ...

  // Add after renderAdminDashboard definition
  function renderAdminUsersSection() {
    const content = document.getElementById("admin-dashboard-content");
    if (!content) return;
    content.innerHTML = `
      <div class="mb-8 animate-fade-in-up">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-2xl font-bold text-gray-800 flex items-center gap-2"><i class="fas fa-users text-blue-600 animate-users-bounce"></i> Users & Clients</h2>
          <button id="admin-add-user-btn" class="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2"><i class="fas fa-user-plus"></i> Add User</button>
        </div>
        <div id="admin-users-table-container" class="bg-white rounded-xl shadow-lg p-4"></div>
      </div>
    `;
    fetchAndRenderAdminUsers();
    setTimeout(() => {
      const addBtn = document.getElementById("admin-add-user-btn");
      if (addBtn) addBtn.onclick = openAddUserModal;
    }, 0);
  }

  function openAddUserModal() {
    const modal = document.createElement("div");
    modal.className =
      "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40";
    modal.innerHTML = `
      <div class="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
        <button class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl" onclick="this.closest('.fixed').remove()">&times;</button>
        <h2 class="text-lg font-bold mb-4">Add New User</h2>
        <form id="admin-add-user-form" class="space-y-4">
          <div><label class="block text-sm font-medium mb-1">Name</label><input type="text" id="add-user-name" required class="w-full px-3 py-2 border rounded" /></div>
          <div><label class="block text-sm font-medium mb-1">Email</label><input type="email" id="add-user-email" required class="w-full px-3 py-2 border rounded" /></div>
          <div><label class="block text-sm font-medium mb-1">Password</label><input type="password" id="add-user-password" required class="w-full px-3 py-2 border rounded" /></div>
          <div><label class="block text-sm font-medium mb-1">Role</label><select id="add-user-role" required class="w-full px-3 py-2 border rounded"><option value="user">User</option><option value="admin">Admin</option></select></div>
          <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition">Add User</button>
        </form>
      </div>
    `;
    document.body.appendChild(modal);
    const form = modal.querySelector("#admin-add-user-form");
    if (form) {
      form.onsubmit = async function (e) {
        e.preventDefault();
        const name = document.getElementById("add-user-name").value;
        const email = document.getElementById("add-user-email").value;
        const password = document.getElementById("add-user-password").value;
        const role = document.getElementById("add-user-role").value;
        const jwt = localStorage.getItem("jwt");
        try {
          const res = await fetch("https://logixpress-tracking.onrender.com/api/users", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + jwt,
            },
            body: JSON.stringify({ name, email, password, role }),
          });
          if (res.ok) {
            showToast("User added successfully!");
            modal.remove();
            fetchAndRenderAdminUsers();
          } else {
            const data = await res.json().catch(() => ({}));
            showToast(data.message || "Failed to add user.", "error");
          }
        } catch {
          showToast("Error adding user.", "error");
        }
      };
    }
  }

  function renderAdminUsersTable(users) {
    if (!users || users.length === 0) {
      return `<div class='text-center py-8 text-gray-500'>No users found.</div>`;
    }
    setTimeout(() => {
      document.querySelectorAll(".admin-user-view-btn").forEach(
        (btn) =>
          (btn.onclick = (e) => {
            e.preventDefault();
            const row = btn.closest("tr");
            const email = row
              .querySelector("td:nth-child(2)")
              .textContent.trim();
            const user = users.find((u) => u.email === email);
            if (user) openUserActivityModal(user);
          })
      );
      document.querySelectorAll(".admin-user-edit-btn").forEach(
        (btn) =>
          (btn.onclick = (e) => {
            e.preventDefault();
            const row = btn.closest("tr");
            const email = row
              .querySelector("td:nth-child(2)")
              .textContent.trim();
            const user = users.find((u) => u.email === email);
            if (user) openEditUserModal(user);
          })
      );
      document.querySelectorAll(".admin-user-delete-btn").forEach(
        (btn) =>
          (btn.onclick = (e) => {
            e.preventDefault();
            const row = btn.closest("tr");
            const email = row
              .querySelector("td:nth-child(2)")
              .textContent.trim();
            const user = users.find((u) => u.email === email);
            if (user) confirmDeleteUser(user);
          })
      );
    }, 0);
    return `
      <table class='w-full text-sm'>
        <thead>
          <tr class='bg-blue-50 text-blue-700'>
            <th class='px-4 py-2 text-left font-medium uppercase tracking-wider'>Name</th>
            <th class='px-4 py-2 text-left font-medium uppercase tracking-wider'>Email</th>
            <th class='px-4 py-2 text-left font-medium uppercase tracking-wider'>Role</th>
            <th class='px-4 py-2 text-left font-medium uppercase tracking-wider'># Shipments</th>
            <th class='px-4 py-2 text-left font-medium uppercase tracking-wider'>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${users
            .map(
              (u) => `
            <tr class='border-b hover:bg-blue-50 transition-colors'>
              <td class='px-4 py-2'>${u.name || "-"}</td>
              <td class='px-4 py-2'>${u.email || "-"}</td>
              <td class='px-4 py-2 capitalize'>${u.role || "-"}</td>
              <td class='px-4 py-2'>${u.shipmentCount ?? "-"}</td>
              <td class='px-4 py-2'>
                <button class='admin-user-view-btn text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50' title='View Activity'><i class='fas fa-eye'></i></button>
                <button class='admin-user-edit-btn text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50' title='Edit'><i class='fas fa-edit'></i></button>
                <button class='admin-user-delete-btn text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50' title='Delete'><i class='fas fa-trash'></i></button>
              </td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;
  }

  function openEditUserModal(user) {
    const modal = document.createElement("div");
    modal.className =
      "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40";
    modal.innerHTML = `
      <div class="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
        <button class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl" onclick="this.closest('.fixed').remove()">&times;</button>
        <h2 class="text-lg font-bold mb-4">Edit User</h2>
        <form id="admin-edit-user-form" class="space-y-4">
          <div><label class="block text-sm font-medium mb-1">Name</label><input type="text" id="edit-user-name" required class="w-full px-3 py-2 border rounded" value="${
            user.name || ""
          }" /></div>
          <div><label class="block text-sm font-medium mb-1">Email</label><input type="email" id="edit-user-email" required class="w-full px-3 py-2 border rounded" value="${
            user.email || ""
          }" /></div>
          <div><label class="block text-sm font-medium mb-1">Role</label><select id="edit-user-role" required class="w-full px-3 py-2 border rounded"><option value="user" ${
            user.role === "user" ? "selected" : ""
          }>User</option><option value="admin" ${
      user.role === "admin" ? "selected" : ""
    }>Admin</option></select></div>
          <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded font-semibold hover:bg-green-700 transition">Save Changes</button>
        </form>
      </div>
    `;
    document.body.appendChild(modal);
    const form = modal.querySelector("#admin-edit-user-form");
    if (form) {
      form.onsubmit = async function (e) {
        e.preventDefault();
        const name = document.getElementById("edit-user-name").value;
        const email = document.getElementById("edit-user-email").value;
        const role = document.getElementById("edit-user-role").value;
        const jwt = localStorage.getItem("jwt");
        try {
          const res = await fetch(
            `https://logixpress-tracking.onrender.com/api/users/${user._id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + jwt,
              },
              body: JSON.stringify({ name, email, role }),
            }
          );
          if (res.ok) {
            showToast("User updated successfully!");
            modal.remove();
            fetchAndRenderAdminUsers();
          } else {
            const data = await res.json().catch(() => ({}));
            showToast(data.message || "Failed to update user.", "error");
          }
        } catch {
          showToast("Error updating user.", "error");
        }
      };
    }
  }

  // Add sidebar navigation handlers after renderAdminDashboard
  function setupAdminSidebarNav() {
    // Dashboard links
    const dashBtn = document.getElementById("admin-nav-dashboard");
    const dashBtnMobile = document.getElementById("admin-nav-dashboard-mobile");
    if (dashBtn)
      dashBtn.onclick = (e) => {
        e.preventDefault();
        const user = parseJwt(localStorage.getItem("jwt"));
        if (user) renderAdminDashboard(user);
      };
    if (dashBtnMobile)
      dashBtnMobile.onclick = (e) => {
        e.preventDefault();
        const user = parseJwt(localStorage.getItem("jwt"));
        if (user) renderAdminDashboard(user);
      };

    // Shipments links
    const shipmentsBtn = document.getElementById("admin-nav-shipments");
    const shipmentsBtnMobile = document.getElementById(
      "admin-nav-shipments-mobile"
    );
    if (shipmentsBtn)
      shipmentsBtn.onclick = (e) => {
        e.preventDefault();
        renderAdminShipmentsSection();
      };
    if (shipmentsBtnMobile)
      shipmentsBtnMobile.onclick = (e) => {
        e.preventDefault();
        renderAdminShipmentsSection();
      };

    // Users links
    const usersBtn = document.getElementById("admin-nav-users");
    const usersBtnMobile = document.getElementById("admin-nav-users-mobile");
    if (usersBtn)
      usersBtn.onclick = (e) => {
        e.preventDefault();
        renderAdminUsersSection();
      };
    if (usersBtnMobile)
      usersBtnMobile.onclick = (e) => {
        e.preventDefault();
        renderAdminUsersSection();
      };

    // Drivers links
    const driversBtn = document.getElementById("admin-nav-drivers");
    const driversBtnMobile = document.getElementById(
      "admin-nav-drivers-mobile"
    );
    if (driversBtn)
      driversBtn.onclick = (e) => {
        e.preventDefault();
        renderAdminDriversSection();
      };
    if (driversBtnMobile)
      driversBtnMobile.onclick = (e) => {
        e.preventDefault();
        renderAdminDriversSection();
      };

    // Analytics links
    const analyticsBtn = document.getElementById("admin-nav-analytics");
    const analyticsBtnMobile = document.getElementById(
      "admin-nav-analytics-mobile"
    );
    if (analyticsBtn)
      analyticsBtn.onclick = (e) => {
        e.preventDefault();
        renderAdminAnalyticsSection();
      };
    if (analyticsBtnMobile)
      analyticsBtnMobile.onclick = (e) => {
        e.preventDefault();
        renderAdminAnalyticsSection();
      };

    // Alerts links
    const alertsBtn = document.getElementById("admin-nav-alerts");
    const alertsBtnMobile = document.getElementById("admin-nav-alerts-mobile");
    if (alertsBtn)
      alertsBtn.onclick = (e) => {
        e.preventDefault();
        renderAdminAlertsSection();
      };
    if (alertsBtnMobile)
      alertsBtnMobile.onclick = (e) => {
        e.preventDefault();
        renderAdminAlertsSection();
      };

    // Settings links
    const settingsBtn = document.getElementById("admin-nav-settings");
    const settingsBtnMobile = document.getElementById(
      "admin-nav-settings-mobile"
    );
    if (settingsBtn)
      settingsBtn.onclick = (e) => {
        e.preventDefault();
        renderAdminSettingsSection();
      };
    if (settingsBtnMobile)
      settingsBtnMobile.onclick = (e) => {
        e.preventDefault();
        renderAdminSettingsSection();
      };
  }
  // ... existing code ...

  async function fetchAndRenderAdminUsers() {
    const jwt = localStorage.getItem("jwt");
    const container = document.getElementById("admin-users-table-container");
    if (!container) return;
    container.innerHTML = '<div class="text-gray-400">Loading users...</div>';
    if (!jwt) {
      container.innerHTML =
        '<div class="text-red-500">Not authenticated.</div>';
      return;
    }
    try {
      const res = await fetch("https://logixpress-tracking.onrender.com/api/users", {
        headers: { Authorization: "Bearer " + jwt },
      });
      if (!res.ok) {
        container.innerHTML =
          '<div class="text-red-500">Failed to load users.</div>';
        return;
      }
      const users = await res.json();
      container.innerHTML = renderAdminUsersTable(users);
    } catch (err) {
      container.innerHTML =
        '<div class="text-red-500">Error loading users.</div>';
    }
  }

  function confirmDeleteUser(user) {
    // Remove browser confirm, use custom modal
    const modal = document.createElement("div");
    modal.className =
      "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40";
    modal.innerHTML = `
      <div class="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative text-center">
        <button class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl" onclick="this.closest('.fixed').remove()">&times;</button>
        <h2 class="text-lg font-bold mb-4 text-red-700">Delete User</h2>
        <p class="mb-6">Are you sure you want to delete user <span class='font-semibold'>${
          user.name || user.email
        }</span>?<br>This action cannot be undone.</p>
        <div class="flex justify-center gap-4">
          <button id="delete-user-cancel" class="bg-gray-200 text-gray-700 px-4 py-2 rounded font-semibold hover:bg-gray-300 transition">Cancel</button>
          <button id="delete-user-confirm" class="bg-red-600 text-white px-4 py-2 rounded font-semibold hover:bg-red-700 transition">Delete</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    modal.querySelector("#delete-user-cancel").onclick = () => modal.remove();
    modal.querySelector("#delete-user-confirm").onclick = () => {
      modal.remove();
      const jwt = localStorage.getItem("jwt");
      fetch(`https://logixpress-tracking.onrender.com/api/users/${user._id}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + jwt },
      })
        .then((res) => {
          if (res.ok) {
            showToast("User deleted successfully!");
            fetchAndRenderAdminUsers();
          } else {
            res
              .json()
              .then((data) =>
                showToast(data.message || "Failed to delete user.", "error")
              )
              .catch(() => showToast("Failed to delete user.", "error"));
          }
        })
        .catch(() => showToast("Error deleting user.", "error"));
    };
  }

  function openUserActivityModal(user) {
    const modal = document.createElement("div");
    modal.className =
      "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40";
    modal.innerHTML = `
      <div class="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative">
        <button class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl" onclick="this.closest('.fixed').remove()">&times;</button>
        <h2 class="text-lg font-bold mb-4">User Activity: ${
          user.name || user.email
        }</h2>
        <div id="user-activity-content" class="min-h-[120px]">Loading activity...</div>
      </div>
    `;
    document.body.appendChild(modal);
    const jwt = localStorage.getItem("jwt");
    fetch(`https://logixpress-tracking.onrender.com/api/users/${user._id}/activity`, {
      headers: { Authorization: "Bearer " + jwt },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((activity) => {
        const content = modal.querySelector("#user-activity-content");
        if (!activity || activity.length === 0) {
          content.innerHTML = `<div class='text-gray-500 text-center py-8'>No activity found.</div>`;
        } else {
          content.innerHTML = `<ul class='divide-y'>${activity
            .map(
              (a) =>
                `<li class='py-2'><span class='font-semibold'>${
                  a.type || "Shipment"
                }</span>: ${
                  a.description || ""
                } <span class='text-xs text-gray-400 ml-2'>${
                  a.date ? new Date(a.date).toLocaleString() : ""
                }</span></li>`
            )
            .join("")}</ul>`;
        }
      })
      .catch(async (res) => {
        let msg = "Failed to load activity.";
        try {
          msg = (await res.json()).message || msg;
        } catch {}
        modal.querySelector(
          "#user-activity-content"
        ).innerHTML = `<div class='text-red-500 text-center py-8'>${msg}</div>`;
      });
  }

  function renderAdminShipmentsSection() {
    const content = document.getElementById("admin-dashboard-content");
    if (content) {
      content.innerHTML = `
        <div class="mb-6">
          <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-blue-700 flex items-center gap-2"><i class="fas fa-shipping-fast text-blue-600 animate-truck-move"></i> Shipments Management</h1>
          <p class="text-gray-600">Manage all shipments across the platform</p>
        </div>
        <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <div id="admin-shipments-table-container"></div>
        </div>
      `;
      fetchAndRenderAdminShipments();
    }
  }

  function renderAdminDriversSection() {
    const content = document.getElementById("admin-dashboard-content");
    if (content) {
      content.innerHTML = `
        <div class="mb-6">
          <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-blue-700 flex items-center gap-2"><i class="fas fa-id-badge text-blue-600 animate-drivers-bounce"></i> Driver Management</h1>
          <p class="text-gray-600">Manage delivery drivers and their assignments</p>
        </div>
        <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-gray-800">Delivery Drivers</h2>
            <button id="admin-add-driver-btn" class="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2">
              <i class="fas fa-user-plus"></i> Add Driver
            </button>
          </div>
          <div id="admin-drivers-table-container"></div>
        </div>
      `;
      fetchAndRenderAdminDrivers();
      setTimeout(() => {
        const addBtn = document.getElementById("admin-add-driver-btn");
        if (addBtn) addBtn.onclick = openAddDriverModal;
      }, 0);
    }
  }

  function renderAdminAnalyticsSection() {
    const content = document.getElementById("admin-dashboard-content");
    if (content) {
      content.innerHTML = `
        <div class="mb-6">
          <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-blue-700 flex items-center gap-2"><i class="fas fa-chart-bar text-blue-600 animate-analytics-pulse"></i> Analytics Dashboard</h1>
          <p class="text-gray-600">Comprehensive analytics and reporting with real-time data</p>
        </div>
        <div class="space-y-6">
          <!-- KPI Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer" id="kpi-card-1">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600">Total Shipments</p>
                  <p class="text-2xl font-bold text-gray-900" id="total-shipments">-</p>
                </div>
                <div class="p-3 bg-blue-100 rounded-full animate-pulse">
                  <i class="fas fa-shipping-fast text-blue-600 text-xl"></i>
                </div>
              </div>
            </div>
            <div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer" id="kpi-card-2">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600">On-Time Delivery</p>
                  <p class="text-2xl font-bold text-gray-900" id="on-time-rate">-</p>
                </div>
                <div class="p-3 bg-green-100 rounded-full animate-pulse">
                  <i class="fas fa-clock text-green-600 text-xl"></i>
                </div>
              </div>
            </div>
            <div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer" id="kpi-card-3">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600">Avg Delivery Time</p>
                  <p class="text-2xl font-bold text-gray-900" id="avg-delivery-time">-</p>
                </div>
                <div class="p-3 bg-purple-100 rounded-full animate-pulse">
                  <i class="fas fa-tachometer-alt text-purple-600 text-xl"></i>
                </div>
              </div>
            </div>
            <div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500 transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer" id="kpi-card-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600">Missed Deliveries</p>
                  <p class="text-2xl font-bold text-gray-900" id="missed-deliveries">-</p>
                </div>
                <div class="p-3 bg-red-100 rounded-full animate-pulse">
                  <i class="fas fa-exclamation-triangle text-red-600 text-xl"></i>
                </div>
              </div>
            </div>
          </div>

          <!-- Charts Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Monthly Trends Chart -->
            <div class="bg-white rounded-xl shadow-lg p-6">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Monthly Shipment Trends</h3>
              <div class="h-64">
                <canvas id="monthly-trends-chart"></canvas>
              </div>
            </div>

            <!-- Delivery Status Distribution -->
            <div class="bg-white rounded-xl shadow-lg p-6">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Delivery Status Distribution</h3>
              <div class="h-64">
                <canvas id="status-distribution-chart"></canvas>
              </div>
            </div>

            <!-- Most Used Routes -->
            <div class="bg-white rounded-xl shadow-lg p-6">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Most Used Routes</h3>
              <div class="h-64">
                <canvas id="routes-chart"></canvas>
              </div>
            </div>

            <!-- Problematic Zones -->
            <div class="bg-white rounded-xl shadow-lg p-6">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Problematic Zones</h3>
              <div class="h-64">
                <canvas id="zones-chart"></canvas>
              </div>
            </div>
          </div>

          <!-- Driver Performance Table -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Driver Performance</h3>
            <div id="driver-performance-table" class="overflow-x-auto">
              <div class="text-gray-500 text-center py-8">Loading driver performance data...</div>
            </div>
          </div>
        </div>
      `;
      fetchAndRenderComprehensiveAnalytics();
    }
  }

  function renderAdminAlertsSection() {
    const content = document.getElementById("admin-dashboard-content");
    if (content) {
      content.innerHTML = `
        <div class="mb-6">
          <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-blue-700 flex items-center gap-2"><i class="fas fa-bell text-blue-600 animate-alerts-shake"></i> Alerts & Notifications</h1>
          <p class="text-gray-600">Manage system alerts and notifications</p>
        </div>
        <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <div id="admin-notifications-panel"></div>
        </div>
      `;
      fetchAndRenderAdminNotifications();
    }
  }

  function renderAdminSettingsSection() {
    const content = document.getElementById("admin-dashboard-content");
    console.log("Rendering admin settings section");
    if (content) {
      content.innerHTML = `
        <div class="mb-6">
          <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-blue-700 flex items-center gap-3">
            <i class="fas fa-cog text-blue-600 animate-spin"></i>
            Admin Settings
          </h1>
          <p class="text-gray-600">Configure system settings and preferences</p>
        </div>

        <!-- Settings Navigation Tabs -->
        <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6">
          <div class="flex flex-wrap gap-2 mb-6" id="settings-tabs">
            <button class="settings-tab active bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-blue-700 flex items-center gap-2" data-tab="platform">
              <i class="fas fa-building"></i>
              Platform Settings
            </button>
            <button class="settings-tab bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-gray-300 flex items-center gap-2" data-tab="zones">
              <i class="fas fa-map-marker-alt"></i>
              Zones & Routes
            </button>
            <button class="settings-tab bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-gray-300 flex items-center gap-2" data-tab="shipping">
              <i class="fas fa-shipping-fast"></i>
              Shipping Rates
            </button>
            <button class="settings-tab bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-gray-300 flex items-center gap-2" data-tab="notifications">
              <i class="fas fa-bell"></i>
              Notifications
            </button>
            <button class="settings-tab bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-gray-300 flex items-center gap-2" data-tab="api">
              <i class="fas fa-key"></i>
              API & Integration
            </button>
            <button class="settings-tab bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-gray-300 flex items-center gap-2" data-tab="logs">
              <i class="fas fa-clipboard-list"></i>
              System Logs
            </button>
            <button class="settings-tab bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-gray-300 flex items-center gap-2" data-tab="billing">
              <i class="fas fa-credit-card"></i>
              Billing
            </button>
            <button class="settings-tab bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-gray-300 flex items-center gap-2" data-tab="security">
              <i class="fas fa-shield-alt"></i>
              Security
            </button>
            <button class="settings-tab bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-gray-300 flex items-center gap-2" data-tab="test">
              <i class="fas fa-flask"></i>
              Test Mode
            </button>
          </div>

          <!-- Settings Content -->
          <div id="settings-content">
            <!-- Platform Settings -->
            <div id="platform-settings" class="settings-panel active">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="space-y-6">
                  <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                    <h3 class="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                      <i class="fas fa-building text-blue-600"></i>
                      Company Information
                    </h3>
                    <div class="space-y-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                        <input type="text" value="LogiXpress Nigeria Limited" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Business Email</label>
                        <input type="email" value="info@logixpress.ng" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <input type="tel" value="+234 908 765 4321" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Address</label>
                        <textarea class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" rows="3">15 Ahmadu Bello Way, Victoria Island, Lagos State, Nigeria</textarea>
                      </div>
                    </div>
                  </div>

                  <div class="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                    <h3 class="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                      <i class="fas fa-globe text-green-600"></i>
                      Platform Configuration
                    </h3>
                    <div class="space-y-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                        <select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                          <option value="Africa/Lagos" selected>Africa/Lagos (WAT)</option>
                          <option value="UTC">UTC</option>
                          <option value="America/New_York">America/New_York (EST)</option>
                          <option value="Europe/London">Europe/London (GMT)</option>
                        </select>
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                        <select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                          <option value="NGN" selected>Nigerian Naira (₦)</option>
                          <option value="USD">US Dollar ($)</option>
                          <option value="EUR">Euro (€)</option>
                          <option value="GBP">British Pound (£)</option>
                        </select>
                      </div>
                      <div class="flex items-center justify-between">
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-2">Maintenance Mode</label>
                          <p class="text-xs text-gray-500">Temporarily disable frontend access</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" class="sr-only peer">
                          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="space-y-6">
                  <div class="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
                    <h3 class="text-lg font-semibold text-purple-800 mb-4 flex items-center gap-2">
                      <i class="fas fa-file-contract text-purple-600"></i>
                      Legal Documents
                    </h3>
                    <div class="space-y-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Terms of Service URL</label>
                        <input type="url" value="https://logixpress.ng/terms-of-service" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Privacy Policy URL</label>
                        <input type="url" value="https://logixpress.ng/privacy-policy" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Cookie Policy URL</label>
                        <input type="url" value="https://logixpress.ng/cookie-policy" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                      </div>
                    </div>
                  </div>

                  <div class="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-200">
                    <h3 class="text-lg font-semibold text-amber-800 mb-4 flex items-center gap-2">
                      <i class="fas fa-image text-amber-600"></i>
                      Brand Assets
                    </h3>
                    <div class="space-y-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Company Logo</label>
                        <div class="flex items-center gap-4">
                          <img src="images/logixpresss.png" alt="Current Logo" class="w-12 h-12 rounded-lg border">
                          <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                            <i class="fas fa-upload mr-2"></i>Upload New
                          </button>
                        </div>
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Favicon</label>
                        <div class="flex items-center gap-4">
                          <div class="w-8 h-8 bg-blue-600 rounded border"></div>
                          <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                            <i class="fas fa-upload mr-2"></i>Upload New
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-6 flex justify-end">
                <button class="save-settings-btn bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                  <i class="fas fa-save"></i>
                  Save Platform Settings
                </button>
              </div>
            </div>

            <!-- Zones & Routes Settings -->
            <div id="zones-settings" class="settings-panel hidden">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="space-y-6">
                  <div class="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                    <h3 class="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                      <i class="fas fa-map-marker-alt text-green-600"></i>
                      Delivery Zones
                    </h3>
                    <div class="space-y-4">
                      <div class="flex justify-between items-center">
                        <span class="font-medium">Lagos Metropolitan</span>
                        <div class="flex gap-2">
                          <button class="edit-zone-btn text-blue-600 hover:text-blue-800 p-1" data-zone="Lagos Metropolitan">
                            <i class="fas fa-edit"></i>
                          </button>
                          <button class="delete-zone-btn text-red-600 hover:text-red-800 p-1" data-zone="Lagos Metropolitan">
                            <i class="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                      <div class="flex justify-between items-center">
                        <span class="font-medium">Abuja Federal Capital Territory</span>
                        <div class="flex gap-2">
                          <button class="edit-zone-btn text-blue-600 hover:text-blue-800 p-1" data-zone="Abuja Federal Capital Territory">
                            <i class="fas fa-edit"></i>
                          </button>
                          <button class="delete-zone-btn text-red-600 hover:text-red-800 p-1" data-zone="Abuja Federal Capital Territory">
                            <i class="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                      <div class="flex justify-between items-center">
                        <span class="font-medium">Port Harcourt Rivers State</span>
                        <div class="flex gap-2">
                          <button class="edit-zone-btn text-blue-600 hover:text-blue-800 p-1" data-zone="Port Harcourt Rivers State">
                            <i class="fas fa-edit"></i>
                          </button>
                          <button class="delete-zone-btn text-red-600 hover:text-red-800 p-1" data-zone="Port Harcourt Rivers State">
                            <i class="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                      <div class="flex justify-between items-center">
                        <span class="font-medium">Kano State</span>
                        <div class="flex gap-2">
                          <button class="edit-zone-btn text-blue-600 hover:text-blue-800 p-1" data-zone="Kano State">
                            <i class="fas fa-edit"></i>
                          </button>
                          <button class="delete-zone-btn text-red-600 hover:text-red-800 p-1" data-zone="Kano State">
                            <i class="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                      <div class="flex justify-between items-center">
                        <span class="font-medium">Ibadan Oyo State</span>
                        <div class="flex gap-2">
                          <button class="edit-zone-btn text-blue-600 hover:text-blue-800 p-1" data-zone="Ibadan Oyo State">
                            <i class="fas fa-edit"></i>
                          </button>
                          <button class="delete-zone-btn text-red-600 hover:text-red-800 p-1" data-zone="Ibadan Oyo State">
                            <i class="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                      <button class="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2">
                        <i class="fas fa-plus"></i>
                        Add New Zone
                      </button>
                    </div>
                  </div>

                  <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                    <h3 class="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                      <i class="fas fa-route text-blue-600"></i>
                      Service Types
                    </h3>
                    <div class="space-y-4">
                      <div class="flex justify-between items-center">
                        <div>
                          <span class="font-medium">Standard Delivery</span>
                          <p class="text-sm text-gray-500">3-5 business days</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked class="sr-only peer">
                          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div class="flex justify-between items-center">
                        <div>
                          <span class="font-medium">Express Delivery</span>
                          <p class="text-sm text-gray-500">1-2 business days</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked class="sr-only peer">
                          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div class="flex justify-between items-center">
                        <div>
                          <span class="font-medium">Same Day Delivery</span>
                          <p class="text-sm text-gray-500">Within 24 hours</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" class="sr-only peer">
                          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="space-y-6">
                  <div class="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
                    <h3 class="text-lg font-semibold text-purple-800 mb-4 flex items-center gap-2">
                      <i class="fas fa-calendar-alt text-purple-600"></i>
                      Holidays & Delays
                    </h3>
                    <div class="space-y-4">
                      <div class="flex justify-between items-center">
                        <div>
                          <span class="font-medium">Christmas Day</span>
                          <p class="text-sm text-gray-500">December 25</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked class="sr-only peer">
                          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div class="flex justify-between items-center">
                        <div>
                          <span class="font-medium">New Year's Day</span>
                          <p class="text-sm text-gray-500">January 1</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked class="sr-only peer">
                          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div class="flex justify-between items-center">
                        <div>
                          <span class="font-medium">Independence Day</span>
                          <p class="text-sm text-gray-500">October 1</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked class="sr-only peer">
                          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div class="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-200">
                    <h3 class="text-lg font-semibold text-amber-800 mb-4 flex items-center gap-2">
                      <i class="fas fa-city text-amber-600"></i>
                      Covered Cities
                    </h3>
                    <div class="space-y-2">
                      <div class="flex items-center gap-2">
                        <input type="checkbox" checked class="rounded">
                        <span>Lagos</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <input type="checkbox" checked class="rounded">
                        <span>Abuja</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <input type="checkbox" checked class="rounded">
                        <span>Port Harcourt</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <input type="checkbox" class="rounded">
                        <span>Kano</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <input type="checkbox" class="rounded">
                        <span>Ibadan</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-6 flex justify-end">
                <button class="save-settings-btn bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                  <i class="fas fa-save"></i>
                  Save Zone Settings
                </button>
              </div>
            </div>

            <!-- Shipping Rates Settings -->
            <div id="shipping-settings" class="settings-panel hidden">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="space-y-6">
                  <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                    <h3 class="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                      <i class="fas fa-shipping-fast text-blue-600"></i>
                      Base Rates by Zone
                    </h3>
                    <div class="space-y-4">
                      <div class="flex justify-between items-center p-3 bg-white rounded-lg border">
                        <div>
                          <span class="font-medium">Lagos Metropolitan</span>
                          <p class="text-sm text-gray-500">Standard: ₦2,500 | Express: ₦4,500 | Same Day: ₦8,000</p>
                        </div>
                        <button class="edit-rate-btn text-blue-600 hover:text-blue-800" data-zone="Lagos Metropolitan">
                          <i class="fas fa-edit"></i>
                        </button>
                      </div>
                      <div class="flex justify-between items-center p-3 bg-white rounded-lg border">
                        <div>
                          <span class="font-medium">Abuja Federal Capital Territory</span>
                          <p class="text-sm text-gray-500">Standard: ₦3,200 | Express: ₦5,800 | Same Day: ₦12,000</p>
                        </div>
                        <button class="edit-rate-btn text-blue-600 hover:text-blue-800" data-zone="Abuja Federal Capital Territory">
                          <i class="fas fa-edit"></i>
                        </button>
                      </div>
                      <div class="flex justify-between items-center p-3 bg-white rounded-lg border">
                        <div>
                          <span class="font-medium">Port Harcourt Rivers State</span>
                          <p class="text-sm text-gray-500">Standard: ₦2,800 | Express: ₦4,800 | Same Day: ₦9,500</p>
                        </div>
                        <button class="edit-rate-btn text-blue-600 hover:text-blue-800" data-zone="Port Harcourt Rivers State">
                          <i class="fas fa-edit"></i>
                        </button>
                      </div>
                      <div class="flex justify-between items-center p-3 bg-white rounded-lg border">
                        <div>
                          <span class="font-medium">Kano State</span>
                          <p class="text-sm text-gray-500">Standard: ₦3,500 | Express: ₦6,200 | Same Day: ₦13,500</p>
                        </div>
                        <button class="edit-rate-btn text-blue-600 hover:text-blue-800" data-zone="Kano State">
                          <i class="fas fa-edit"></i>
                        </button>
                      </div>
                      <div class="flex justify-between items-center p-3 bg-white rounded-lg border">
                        <div>
                          <span class="font-medium">Ibadan Oyo State</span>
                          <p class="text-sm text-gray-500">Standard: ₦2,200 | Express: ₦3,800 | Same Day: ₦7,500</p>
                        </div>
                        <button class="edit-rate-btn text-blue-600 hover:text-blue-800" data-zone="Ibadan Oyo State">
                          <i class="fas fa-edit"></i>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div class="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                    <h3 class="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                      <i class="fas fa-weight text-green-600"></i>
                      Weight-Based Rates
                    </h3>
                    <div class="space-y-4">
                      <div class="flex justify-between items-center">
                        <span>0-5kg</span>
                        <span class="font-medium">₦1,200</span>
                      </div>
                      <div class="flex justify-between items-center">
                        <span>5-10kg</span>
                        <span class="font-medium">₦2,100</span>
                      </div>
                      <div class="flex justify-between items-center">
                        <span>10-20kg</span>
                        <span class="font-medium">₦3,800</span>
                      </div>
                      <div class="flex justify-between items-center">
                        <span>20-50kg</span>
                        <span class="font-medium">₦6,500</span>
                      </div>
                      <div class="flex justify-between items-center">
                        <span>50kg+</span>
                        <span class="font-medium">₦8,000 + ₦250/kg</span>
                      </div>
                      <div class="mt-4">
                        <button class="edit-weight-rates-btn bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                          <i class="fas fa-edit mr-2"></i>Edit Weight Rates
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="space-y-6">
                  <div class="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
                    <h3 class="text-lg font-semibold text-purple-800 mb-4 flex items-center gap-2">
                      <i class="fas fa-gas-pump text-purple-600"></i>
                      Surcharges
                    </h3>
                    <div class="space-y-4">
                      <div class="flex justify-between items-center">
                        <div>
                          <span class="font-medium">Fuel Surcharge</span>
                          <p class="text-sm text-gray-500">18% of base rate (Current: ₦650/L)</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked class="sr-only peer">
                          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div class="flex justify-between items-center">
                        <div>
                          <span class="font-medium">Handling Fee</span>
                          <p class="text-sm text-gray-500">₦500 per package</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked class="sr-only peer">
                          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div class="flex justify-between items-center">
                        <div>
                          <span class="font-medium">Insurance Fee</span>
                          <p class="text-sm text-gray-500">₦1,200 per package (₦50,000 coverage)</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked class="sr-only peer">
                          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div class="mt-4">
                        <button class="edit-surcharges-btn bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                          <i class="fas fa-edit mr-2"></i>Edit Surcharges
                        </button>
                      </div>
                    </div>
                  </div>

                  <div class="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-200">
                    <h3 class="text-lg font-semibold text-amber-800 mb-4 flex items-center gap-2">
                      <i class="fas fa-tags text-amber-600"></i>
                      Promo Codes
                    </h3>
                    <div class="space-y-4">
                      <div class="flex justify-between items-center p-3 bg-white rounded-lg border">
                        <div>
                          <span class="font-medium">WELCOME10</span>
                          <p class="text-sm text-gray-500">10% off first order</p>
                        </div>
                        <div class="flex gap-2">
                          <button class="text-green-600 hover:text-green-800">
                            <i class="fas fa-check"></i>
                          </button>
                          <button class="text-red-600 hover:text-red-800">
                            <i class="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                      <div class="flex justify-between items-center p-3 bg-white rounded-lg border">
                        <div>
                          <span class="font-medium">BULK20</span>
                          <p class="text-sm text-gray-500">20% off bulk orders</p>
                        </div>
                        <div class="flex gap-2">
                          <button class="text-green-600 hover:text-green-800">
                            <i class="fas fa-check"></i>
                          </button>
                          <button class="text-red-600 hover:text-red-800">
                            <i class="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-6 flex justify-end">
                <button class="save-settings-btn bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                  <i class="fas fa-save"></i>
                  Save Shipping Rates
                </button>
              </div>
            </div>

            <!-- Notifications Settings -->
            <div id="notifications-settings" class="settings-panel hidden">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="space-y-6">
                  <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                    <h3 class="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                      <i class="fas fa-envelope text-blue-600"></i>
                      Email Templates
                    </h3>
                    <div class="space-y-4">
                      <div class="p-4 bg-white rounded-lg border">
                        <div class="flex justify-between items-center mb-2">
                          <span class="font-medium">Shipment Created</span>
                          <button class="edit-template-btn text-blue-600 hover:text-blue-800" data-template="Shipment Created Email">
                            <i class="fas fa-edit"></i>
                          </button>
                        </div>
                        <p class="text-sm text-gray-500">Sent when a new shipment is created</p>
                        <div class="mt-2 flex gap-2">
                          <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Active</span>
                        </div>
                      </div>
                      <div class="p-4 bg-white rounded-lg border">
                        <div class="flex justify-between items-center mb-2">
                          <span class="font-medium">In Transit</span>
                          <button class="edit-template-btn text-blue-600 hover:text-blue-800" data-template="In Transit Email">
                            <i class="fas fa-edit"></i>
                          </button>
                        </div>
                        <p class="text-sm text-gray-500">Sent when shipment status changes to in transit</p>
                        <div class="mt-2 flex gap-2">
                          <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Active</span>
                        </div>
                      </div>
                      <div class="p-4 bg-white rounded-lg border">
                        <div class="flex justify-between items-center mb-2">
                          <span class="font-medium">Delivered</span>
                          <button class="edit-template-btn text-blue-600 hover:text-blue-800" data-template="Delivered Email">
                            <i class="fas fa-edit"></i>
                          </button>
                        </div>
                        <p class="text-sm text-gray-500">Sent when shipment is delivered</p>
                        <div class="mt-2 flex gap-2">
                          <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Active</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                    <h3 class="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                      <i class="fas fa-sms text-green-600"></i>
                      SMS Templates
                    </h3>
                    <div class="space-y-4">
                      <div class="p-4 bg-white rounded-lg border">
                        <div class="flex justify-between items-center mb-2">
                          <span class="font-medium">Delivery Update</span>
                          <button class="edit-template-btn text-blue-600 hover:text-blue-800" data-template="Delivery Update SMS">
                            <i class="fas fa-edit"></i>
                          </button>
                        </div>
                        <p class="text-sm text-gray-500">SMS notification for delivery updates</p>
                        <div class="mt-2 flex gap-2">
                          <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Active</span>
                        </div>
                      </div>
                      <div class="p-4 bg-white rounded-lg border">
                        <div class="flex justify-between items-center mb-2">
                          <span class="font-medium">OTP Verification</span>
                          <button class="edit-template-btn text-blue-600 hover:text-blue-800" data-template="OTP Verification SMS">
                            <i class="fas fa-edit"></i>
                          </button>
                        </div>
                        <p class="text-sm text-gray-500">SMS for OTP verification</p>
                        <div class="mt-2 flex gap-2">
                          <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Active</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="space-y-6">
                  <div class="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
                    <h3 class="text-lg font-semibold text-purple-800 mb-4 flex items-center gap-2">
                      <i class="fas fa-bell text-purple-600"></i>
                      Alert Settings
                    </h3>
                    <div class="space-y-4">
                      <div class="flex justify-between items-center">
                        <div>
                          <span class="font-medium">Failed Delivery Alerts</span>
                          <p class="text-sm text-gray-500">Notify when delivery fails</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked class="sr-only peer">
                          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div class="flex justify-between items-center">
                        <div>
                          <span class="font-medium">Driver Assignment Alerts</span>
                          <p class="text-sm text-gray-500">Notify when driver is assigned</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked class="sr-only peer">
                          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div class="flex justify-between items-center">
                        <div>
                          <span class="font-medium">System Maintenance Alerts</span>
                          <p class="text-sm text-gray-500">Notify about system maintenance</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" class="sr-only peer">
                          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div class="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-200">
                    <h3 class="text-lg font-semibold text-amber-800 mb-4 flex items-center gap-2">
                      <i class="fas fa-user text-amber-600"></i>
                      Sender Information
                    </h3>
                    <div class="space-y-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Sender Name</label>
                        <input type="text" value="LogiXpress Team" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Reply-to Email</label>
                        <input type="email" value="support@logixpress.ng" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Support Phone</label>
                        <input type="tel" value="+234 801 234 5678" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-6 flex justify-end">
                <button class="save-settings-btn bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                  <i class="fas fa-save"></i>
                  Save Notification Settings
                </button>
              </div>
            </div>

            <!-- API & Integration Settings -->
            <div id="api-settings" class="settings-panel hidden">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="space-y-6">
                  <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                    <h3 class="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                      <i class="fas fa-key text-blue-600"></i>
                      API Keys
                    </h3>
                    <div class="space-y-4">
                      <div class="p-4 bg-white rounded-lg border">
                        <div class="flex justify-between items-center mb-2">
                          <span class="font-medium">Internal API Key</span>
                          <button class="text-blue-600 hover:text-blue-800">
                            <i class="fas fa-sync-alt"></i>
                          </button>
                        </div>
                        <div class="flex items-center gap-2">
                          <input type="password" value="sk_live_5a8b9c2d3e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z5" class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono">
                          <button class="text-gray-600 hover:text-gray-800">
                            <i class="fas fa-eye"></i>
                          </button>
                        </div>
                        <p class="text-xs text-gray-500 mt-1">Last regenerated: 2 days ago</p>
                      </div>
                      <div class="p-4 bg-white rounded-lg border">
                        <div class="flex justify-between items-center mb-2">
                          <span class="font-medium">Webhook Secret</span>
                          <button class="text-blue-600 hover:text-blue-800">
                            <i class="fas fa-sync-alt"></i>
                          </button>
                        </div>
                        <div class="flex items-center gap-2">
                          <input type="password" value="whsec_5a8b9c2d3e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z5" class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono">
                          <button class="text-gray-600 hover:text-gray-800">
                            <i class="fas fa-eye"></i>
                          </button>
                        </div>
                        <p class="text-xs text-gray-500 mt-1">Used for webhook verification</p>
                      </div>
                    </div>
                  </div>

                  <div class="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                    <h3 class="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                      <i class="fas fa-link text-green-600"></i>
                      Webhooks
                    </h3>
                    <div class="space-y-4">
                      <div class="flex justify-between items-center">
                        <div>
                          <span class="font-medium">Shipment Updates</span>
                          <p class="text-sm text-gray-500">https://your-app.com/webhooks/shipment</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked class="sr-only peer">
                          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div class="flex justify-between items-center">
                        <div>
                          <span class="font-medium">Payment Events</span>
                          <p class="text-sm text-gray-500">https://your-app.com/webhooks/payment</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" class="sr-only peer">
                          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="space-y-6">
                  <div class="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
                    <h3 class="text-lg font-semibold text-purple-800 mb-4 flex items-center gap-2">
                      <i class="fas fa-sms text-purple-600"></i>
                      Twilio Configuration
                    </h3>
                    <div class="space-y-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Account SID</label>
                        <input type="text" value="AC1234567890abcdef" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Auth Token</label>
                        <input type="password" value="••••••••••••••••" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <input type="tel" value="+234 908 765 4321" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                      </div>
                      <div class="flex justify-between items-center">
                        <span class="font-medium">SMS Service</span>
                        <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Connected</span>
                      </div>
                    </div>
                  </div>

                  <div class="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-200">
                    <h3 class="text-lg font-semibold text-amber-800 mb-4 flex items-center gap-2">
                      <i class="fas fa-envelope text-amber-600"></i>
                      Email Service
                    </h3>
                    <div class="space-y-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">SMTP Host</label>
                        <input type="text" value="smtp.sendgrid.net" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                        <input type="password" value="••••••••••••••••" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                      </div>
                      <div class="flex justify-between items-center">
                        <span class="font-medium">Email Service</span>
                        <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Connected</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-6 flex justify-end">
                <button class="save-settings-btn bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                  <i class="fas fa-save"></i>
                  Save API Settings
                </button>
              </div>
            </div>


            <!-- System Logs Settings -->
            <div id="logs-settings" class="settings-panel hidden">
              <div class="space-y-6">
                <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                  <h3 class="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                    <i class="fas fa-clipboard-list text-blue-600"></i>
                    Activity Logs
                  </h3>
                  <div class="space-y-4">
                    <div class="flex justify-between items-center mb-4">
                      <div class="flex gap-4">
                        <select class="px-3 py-2 border border-gray-300 rounded-lg">
                          <option>All Users</option>
                          <option>John Doe</option>
                          <option>Sarah Wilson</option>
                        </select>
                        <select class="px-3 py-2 border border-gray-300 rounded-lg">
                          <option>All Actions</option>
                          <option>Login/Logout</option>
                          <option>Shipment Edits</option>
                          <option>Rate Changes</option>
                        </select>
                        <input type="date" class="px-3 py-2 border border-gray-300 rounded-lg">
                      </div>
                      <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                        <i class="fas fa-filter mr-2"></i>Filter
                      </button>
                    </div>
                    <div class="space-y-2 max-h-96 overflow-y-auto">
                      <div class="flex justify-between items-center p-3 bg-white rounded-lg border">
                        <div>
                          <span class="font-medium">John Doe</span>
                          <p class="text-sm text-gray-500">Updated shipment LX123456</p>
                          <p class="text-xs text-gray-400">2 minutes ago</p>
                        </div>
                        <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Shipment Edit</span>
                      </div>
                      <div class="flex justify-between items-center p-3 bg-white rounded-lg border">
                        <div>
                          <span class="font-medium">Sarah Wilson</span>
                          <p class="text-sm text-gray-500">Logged in from 192.168.1.100</p>
                          <p class="text-xs text-gray-400">15 minutes ago</p>
                        </div>
                        <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Login</span>
                      </div>
                      <div class="flex justify-between items-center p-3 bg-white rounded-lg border">
                        <div>
                          <span class="font-medium">System</span>
                          <p class="text-sm text-gray-500">Updated shipping rates for Lagos zone</p>
                          <p class="text-xs text-gray-400">1 hour ago</p>
                        </div>
                        <span class="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">Rate Change</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-6 flex justify-end">
                <button class="save-settings-btn bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                  <i class="fas fa-download"></i>
                  Export Logs
                </button>
              </div>
            </div>

            <!-- Billing Settings -->
            <div id="billing-settings" class="settings-panel hidden">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="space-y-6">
                  <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                    <h3 class="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                      <i class="fas fa-credit-card text-blue-600"></i>
                      Invoice Settings
                    </h3>
                    <div class="space-y-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Company Tax ID</label>
                        <input type="text" value="NG123456789" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Invoice Prefix</label>
                        <input type="text" value="INV-" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Payment Terms</label>
                        <select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                          <option value="net30" selected>Net 30</option>
                          <option value="net15">Net 15</option>
                          <option value="net7">Net 7</option>
                          <option value="due">Due on Receipt</option>
                        </select>
                      </div>
                      <div class="flex justify-between items-center">
                        <div>
                          <span class="font-medium">Auto-Invoice</span>
                          <p class="text-sm text-gray-500">Automatically generate invoices</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked class="sr-only peer">
                          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div class="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                    <h3 class="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                      <i class="fas fa-file-upload text-green-600"></i>
                      Company Documents
                    </h3>
                    <div class="space-y-4">
                      <div class="flex justify-between items-center p-3 bg-white rounded-lg border">
                        <div>
                          <span class="font-medium">Company Registration</span>
                          <p class="text-sm text-gray-500">registration.pdf</p>
                        </div>
                        <button class="text-blue-600 hover:text-blue-800">
                          <i class="fas fa-download"></i>
                        </button>
                      </div>
                      <div class="flex justify-between items-center p-3 bg-white rounded-lg border">
                        <div>
                          <span class="font-medium">Tax Certificate</span>
                          <p class="text-sm text-gray-500">tax_cert.pdf</p>
                        </div>
                        <button class="text-blue-600 hover:text-blue-800">
                          <i class="fas fa-download"></i>
                        </button>
                      </div>
                      <button class="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors duration-200">
                        <i class="fas fa-upload mr-2"></i>Upload Document
                      </button>
                    </div>
                  </div>
                </div>

                <div class="space-y-6">
                <!-- Revenue Summary Container -->
                <div class="bg-amber-50 p-6 rounded-xl border border-amber-200 mb-6">
                <div class="space-y-4"></div>
             
                </div>
              <!-- Payment History Container -->
               <div class="space-y-4"></div>
              
               </div>
                </div>
              </div>

              <div class="mt-6 flex justify-end">
                <button class="save-settings-btn bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                  <i class="fas fa-save"></i>
                  Save Billing Settings
                </button>
              </div>
            </div>

            <!-- Security Settings -->
            <div id="security-settings" class="settings-panel hidden">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="space-y-6">
                  <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                    <h3 class="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                      <i class="fas fa-shield-alt text-blue-600"></i>
                      Password Policy
                    </h3>
                    <div class="space-y-4">
                      <div class="flex justify-between items-center">
                        <div>
                          <span class="font-medium">Minimum Length</span>
                          <p class="text-sm text-gray-500">8 characters</p>
                        </div>
                        <input type="number" value="8" min="6" max="20" class="w-20 px-3 py-2 border border-gray-300 rounded-lg">
                      </div>
                      <div class="flex justify-between items-center">
                        <div>
                          <span class="font-medium">Require Symbols</span>
                          <p class="text-sm text-gray-500">Include special characters</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked class="sr-only peer">
                          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div class="flex justify-between items-center">
                        <div>
                          <span class="font-medium">Require Numbers</span>
                          <p class="text-sm text-gray-500">Include numeric characters</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked class="sr-only peer">
                          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div class="flex justify-between items-center">
                        <div>
                          <span class="font-medium">Require Uppercase</span>
                          <p class="text-sm text-gray-500">Include capital letters</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked class="sr-only peer">
                          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div class="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                    <h3 class="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                      <i class="fas fa-mobile-alt text-green-600"></i>
                      Two-Factor Authentication
                    </h3>
                    <div class="space-y-4">
                      <div class="flex justify-between items-center">
                        <div>
                          <span class="font-medium">2FA for Admins</span>
                          <p class="text-sm text-gray-500">Require 2FA for admin accounts</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked class="sr-only peer">
                          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div class="flex justify-between items-center">
                        <div>
                          <span class="font-medium">2FA for Staff</span>
                          <p class="text-sm text-gray-500">Require 2FA for staff accounts</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" class="sr-only peer">
                          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div class="flex justify-between items-center">
                        <div>
                          <span class="font-medium">Backup Codes</span>
                          <p class="text-sm text-gray-500">Generate backup codes</p>
                        </div>
                        <button class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                          <i class="fas fa-key mr-2"></i>Generate
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="space-y-6">
                  <div class="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
                    <h3 class="text-lg font-semibold text-purple-800 mb-4 flex items-center gap-2">
                      <i class="fas fa-clock text-purple-600"></i>
                      Session Management
                    </h3>
                    <div class="space-y-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                        <input type="number" value="30" min="5" max="480" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                      </div>
                      <div class="flex justify-between items-center">
                        <div>
                          <span class="font-medium">Remember Me</span>
                          <p class="text-sm text-gray-500">Allow persistent sessions</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked class="sr-only peer">
                          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div class="flex justify-between items-center">
                        <div>
                          <span class="font-medium">Force Logout</span>
                          <p class="text-sm text-gray-500">Logout all active sessions</p>
                        </div>
                        <button class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                          <i class="fas fa-sign-out-alt mr-2"></i>Logout All
                        </button>
                      </div>
                    </div>
                  </div>

                  <div class="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-200">
                    <h3 class="text-lg font-semibold text-amber-800 mb-4 flex items-center gap-2">
                      <i class="fas fa-robot text-amber-600"></i>
                      CAPTCHA Settings
                    </h3>
                    <div class="space-y-4">
                      <div class="flex justify-between items-center">
                        <div>
                          <span class="font-medium">Login CAPTCHA</span>
                          <p class="text-sm text-gray-500">Show CAPTCHA on login</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" class="sr-only peer">
                          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div class="flex justify-between items-center">
                        <div>
                          <span class="font-medium">Registration CAPTCHA</span>
                          <p class="text-sm text-gray-500">Show CAPTCHA on registration</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked class="sr-only peer">
                          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div class="flex justify-between items-center">
                        <div>
                          <span class="font-medium">Rate Limiting</span>
                          <p class="text-sm text-gray-500">Limit login attempts</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked class="sr-only peer">
                          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-6 flex justify-end">
                <button class="save-settings-btn bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                  <i class="fas fa-save"></i>
                  Save Security Settings
                </button>
              </div>
            </div>

            <!-- Test Mode Settings -->
            <div id="test-settings" class="settings-panel hidden">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="space-y-6">
                  <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                    <h3 class="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                      <i class="fas fa-flask text-blue-600"></i>
                      Sandbox Mode
                    </h3>
                    <div class="space-y-4">
                      <div class="flex justify-between items-center">
                        <div>
                          <span class="font-medium">Enable Sandbox</span>
                          <p class="text-sm text-gray-500">Switch to test environment</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" class="sr-only peer">
                          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div class="flex justify-between items-center">
                        <div>
                          <span class="font-medium">Test Data</span>
                          <p class="text-sm text-gray-500">Use dummy data for testing</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked class="sr-only peer">
                          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div class="flex justify-between items-center">
                        <div>
                          <span class="font-medium">Mock Services</span>
                          <p class="text-sm text-gray-500">Use mock external services</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked class="sr-only peer">
                          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div class="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                    <h3 class="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                      <i class="fas fa-paper-plane text-green-600"></i>
                      Test Notifications
                    </h3>
                    <div class="space-y-4">
                      <div class="flex justify-between items-center">
                        <div>
                          <span class="font-medium">Test Email</span>
                          <p class="text-sm text-gray-500">Send test email notification</p>
                        </div>
                        <button class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                          <i class="fas fa-envelope mr-2"></i>Send
                        </button>
                      </div>
                      <div class="flex justify-between items-center">
                        <div>
                          <span class="font-medium">Test SMS</span>
                          <p class="text-sm text-gray-500">Send test SMS notification</p>
                        </div>
                        <button class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                          <i class="fas fa-sms mr-2"></i>Send
                        </button>
                      </div>
                      <div class="flex justify-between items-center">
                        <div>
                          <span class="font-medium">Test Webhook</span>
                          <p class="text-sm text-gray-500">Trigger test webhook event</p>
                        </div>
                        <button class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                          <i class="fas fa-link mr-2"></i>Trigger
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="space-y-6">
                  <div class="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
                    <h3 class="text-lg font-semibold text-purple-800 mb-4 flex items-center gap-2">
                      <i class="fas fa-ship text-purple-600"></i>
                      Test Shipments
                    </h3>
                    <div class="space-y-4">
                      <div class="flex justify-between items-center">
                        <div>
                          <span class="font-medium">Create Test Shipment</span>
                          <p class="text-sm text-gray-500">Generate dummy shipment</p>
                        </div>
                        <button class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                          <i class="fas fa-plus mr-2"></i>Create
                        </button>
                      </div>
                      <div class="flex justify-between items-center">
                        <div>
                          <span class="font-medium">Simulate Delivery</span>
                          <p class="text-sm text-gray-500">Simulate delivery process</p>
                        </div>
                        <button class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                          <i class="fas fa-truck mr-2"></i>Simulate
                        </button>
                      </div>
                      <div class="flex justify-between items-center">
                        <div>
                          <span class="font-medium">Test Tracking</span>
                          <p class="text-sm text-gray-500">Test tracking functionality</p>
                        </div>
                        <button class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                          <i class="fas fa-search mr-2"></i>Test
                        </button>
                      </div>
                    </div>
                  </div>

                  <div class="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-200">
                    <h3 class="text-lg font-semibold text-amber-800 mb-4 flex items-center gap-2">
                      <i class="fas fa-toggle-on text-amber-600"></i>
                      Optional Modules
                    </h3>
                    <div class="space-y-4">
                      <div class="flex justify-between items-center">
                        <div>
                          <span class="font-medium">Driver Management</span>
                          <p class="text-sm text-gray-500">Enable driver management module</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked class="sr-only peer">
                          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div class="flex justify-between items-center">
                        <div>
                          <span class="font-medium">Customer Support</span>
                          <p class="text-sm text-gray-500">Enable support chat/ticketing</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" class="sr-only peer">
                          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div class="flex justify-between items-center">
                        <div>
                          <span class="font-medium">Delivery Proof</span>
                          <p class="text-sm text-gray-500">Enable signature/image upload</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked class="sr-only peer">
                          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div class="flex justify-between items-center">
                        <div>
                          <span class="font-medium">Multiple Pickup Points</span>
                          <p class="text-sm text-gray-500">Enable branch offices</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" class="sr-only peer">
                          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-6 flex justify-end">
                <button class="save-settings-btn bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-amber-700 hover:to-amber-800 transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                  <i class="fas fa-save"></i>
                  Save Test Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      `;

      // Set up tab switching
      setupSettingsTabs();
    }
  }

  // Data fetching functions for real data
  async function fetchAdminUsers() {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) return [];
    try {
      const res = await fetch("https://logixpress-tracking.onrender.com/api/users", {
        headers: { Authorization: "Bearer " + jwt },
      });
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  }

  async function fetchSystemLogs() {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) return [];
    try {
      const res = await fetch("https://logixpress-tracking.onrender.com/api/logs", {
        headers: { Authorization: "Bearer " + jwt },
      });
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  }

  async function fetchAllShipments() {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) return [];
    try {
      const res = await fetch("https://logixpress-tracking.onrender.com/api/shipments/all", {
        headers: { Authorization: "Bearer " + jwt },
      });
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  }

  // Generic edit modal function
  function openEditModal(title, fields, onSave) {
    const modal = document.createElement("div");
    modal.className =
      "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40";
    modal.innerHTML = `
      <div class="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
        <button class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl" onclick="this.closest('.fixed').remove()">&times;</button>
        <h2 class="text-lg font-bold mb-4">${title}</h2>
        <form id="edit-modal-form" class="space-y-4">
          ${fields
            .map(
              (f) =>
                `<div><label class='block text-sm font-medium mb-1'>${
                  f.label
                }</label><input type='${f.type || "text"}' name='${
                  f.name
                }' value='${
                  f.value || ""
                }' class='w-full px-3 py-2 border rounded' /></div>`
            )
            .join("")}
          <div class="flex justify-end gap-2 mt-4">
            <button type="button" class="bg-gray-200 text-gray-700 px-4 py-2 rounded font-semibold hover:bg-gray-300 transition" onclick="this.closest('.fixed').remove()">Cancel</button>
            <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition">Save</button>
          </div>
        </form>
      </div>
    `;
    document.body.appendChild(modal);
    modal.querySelector("#edit-modal-form").onsubmit = (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(e.target));
      onSave(data, modal);
    };
  }

  function setupSettingsTabs() {
    const tabs = document.querySelectorAll(".settings-tab");
    const panels = document.querySelectorAll(".settings-panel");

    tabs.forEach((tab) => {
      tab.addEventListener("click", async () => {
        const targetTab = tab.getAttribute("data-tab");

        // Update tab styles
        tabs.forEach((t) => {
          t.classList.remove("active", "bg-blue-600", "text-white");
          t.classList.add("bg-gray-200", "text-gray-700");
        });
        tab.classList.add("active", "bg-blue-600", "text-white");
        tab.classList.remove("bg-gray-200", "text-gray-700");

        // Hide all panels first
        panels.forEach((panel) => {
          panel.classList.remove("active");
          panel.classList.add("hidden");
        });

        // Show target panel
        const targetPanel = document.getElementById(`${targetTab}-settings`);
        if (targetPanel) {
          targetPanel.classList.remove("hidden");
          targetPanel.classList.add("active");
          console.log(`Switched to ${targetTab} tab`);

          // Load real data for specific tabs
          if (targetTab === "roles") {
            await loadUserRolesData();
          } else if (targetTab === "logs") {
            await loadSystemLogsData();
          } else if (targetTab === "billing") {
            await loadPaymentHistoryData();
          } else if (targetTab === "security") {
            setupSecuritySettings();
          }
        } else {
          console.log(`Panel ${targetTab}-settings not found`);
        }
      });
    });

    // Set up save buttons
    document.querySelectorAll(".save-settings-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        showToast("Settings saved successfully!", "success");
      });
    });

    // Set up zone edit buttons
    document.querySelectorAll(".edit-zone-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const zoneName = btn.getAttribute("data-zone");
        openEditModal(
          "Edit Zone",
          [
            { label: "Zone Name", name: "name", value: zoneName },
            { label: "Description", name: "description", value: "" },
          ],
          (data, modal) => {
            showToast(`Zone ${data.name} updated successfully!`, "success");
            modal.remove();
          }
        );
      });
    });

    // Set up zone delete buttons
    document.querySelectorAll(".delete-zone-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const zoneName = btn.getAttribute("data-zone");
        showConfirmModal(
          "Delete Zone",
          `Are you sure you want to delete the zone: ${zoneName}? This action cannot be undone.`,
          () => {
            showToast(`Zone ${zoneName} deleted successfully!`, "success");
          }
        );
      });
    });

    // Set up rate edit buttons
    document.querySelectorAll(".edit-rate-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const zoneName = btn.getAttribute("data-zone");
        openEditModal(
          "Edit Shipping Rates",
          [
            { label: "Zone", name: "zone", value: zoneName },
            {
              label: "Standard Rate (₦)",
              name: "standard",
              type: "number",
              value: "",
            },
            {
              label: "Express Rate (₦)",
              name: "express",
              type: "number",
              value: "",
            },
            {
              label: "Same Day Rate (₦)",
              name: "sameDay",
              type: "number",
              value: "",
            },
          ],
          (data, modal) => {
            showToast(
              `Rates for ${data.zone} updated successfully!`,
              "success"
            );
            modal.remove();
          }
        );
      });
    });

    // Set up API edit buttons
    document.querySelectorAll(".edit-api-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const serviceName = btn.getAttribute("data-service");
        openEditModal(
          `Edit ${serviceName} Configuration`,
          [
            { label: "API Key", name: "apiKey", value: "" },
            { label: "Secret Key", name: "secretKey", value: "" },
          ],
          (data, modal) => {
            showToast(
              `${serviceName} configuration updated successfully!`,
              "success"
            );
            modal.remove();
          }
        );
      });
    });

    // Set up weight-based rates edit
    document.querySelectorAll(".edit-weight-rates-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        openEditModal(
          "Edit Weight-Based Rates",
          [
            {
              label: "0-5kg (₦)",
              name: "rate1",
              type: "number",
              value: "1200",
            },
            {
              label: "5-10kg (₦)",
              name: "rate2",
              type: "number",
              value: "2100",
            },
            {
              label: "10-20kg (₦)",
              name: "rate3",
              type: "number",
              value: "3800",
            },
            {
              label: "20-50kg (₦)",
              name: "rate4",
              type: "number",
              value: "6500",
            },
            {
              label: "50kg+ Base (₦)",
              name: "rate5",
              type: "number",
              value: "8000",
            },
            {
              label: "50kg+ Per kg (₦)",
              name: "rate6",
              type: "number",
              value: "250",
            },
          ],
          (data, modal) => {
            showToast("Weight-based rates updated successfully!", "success");
            modal.remove();
          }
        );
      });
    });

    // Set up surcharges edit
    document.querySelectorAll(".edit-surcharges-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        openEditModal(
          "Edit Surcharges",
          [
            {
              label: "Fuel Surcharge (%)",
              name: "fuel",
              type: "number",
              value: "18",
            },
            {
              label: "Handling Fee (₦)",
              name: "handling",
              type: "number",
              value: "500",
            },
            {
              label: "Insurance Fee (₦)",
              name: "insurance",
              type: "number",
              value: "1200",
            },
          ],
          (data, modal) => {
            showToast("Surcharges updated successfully!", "success");
            modal.remove();
          }
        );
      });
    });

    // Set up template edit buttons
    document.querySelectorAll(".edit-template-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const templateType = btn.getAttribute("data-template");
        openEditModal(
          `Edit ${templateType} Template`,
          [
            { label: "Subject", name: "subject", value: "" },
            { label: "Message", name: "message", value: "", type: "textarea" },
          ],
          (data, modal) => {
            showToast(
              `${templateType} template updated successfully!`,
              "success"
            );
            modal.remove();
          }
        );
      });
    });

    // Set up API key visibility toggles
    document.querySelectorAll(".fas.fa-eye").forEach((btn) => {
      btn.addEventListener("click", () => {
        const input = btn.previousElementSibling;
        if (input.type === "password") {
          input.type = "text";
          btn.classList.remove("fa-eye");
          btn.classList.add("fa-eye-slash");
        } else {
          input.type = "password";
          btn.classList.remove("fa-eye-slash");
          btn.classList.add("fa-eye");
        }
      });
    });

    // Set up API key regeneration buttons
    document.querySelectorAll(".fas.fa-sync-alt").forEach((btn) => {
      btn.addEventListener("click", () => {
        showToast("API key regenerated successfully!", "success");
      });
    });

    // 1. Add New Zone Button Logic
    function setupAddZoneButton() {
      const addZoneBtn = document.querySelector(
        "#zones-settings .bg-green-600"
      );
      if (addZoneBtn) {
        addZoneBtn.onclick = () => {
          openEditModal(
            "Add New Zone",
            [
              { label: "Zone Name", name: "zoneName", value: "" },
              { label: "Cities (comma separated)", name: "cities", value: "" },
            ],
            async (data, modal) => {
              try {
                const jwt = localStorage.getItem("jwt");
                const res = await fetch("https://logixpress-tracking.onrender.com/api/zones", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + jwt,
                  },
                  body: JSON.stringify({
                    name: data.zoneName,
                    cities: data.cities.split(",").map((c) => c.trim()),
                  }),
                });
                if (res.ok) {
                  showToast("Zone added successfully!", "success");
                  // Optionally refresh zones list here
                } else {
                  showToast("Failed to add zone", "error");
                }
              } catch {
                showToast("Failed to add zone", "error");
              }
              modal.remove();
            }
          );
        };
      }
    }

    // 2. Add New User Button Logic
    function setupAddUserButton() {
      document.querySelectorAll(".add-user-btn").forEach((btn) => {
        btn.onclick = () => {
          openEditModal(
            "Add New User",
            [
              { label: "Name", name: "name", value: "" },
              { label: "Email", name: "email", value: "" },
              { label: "Role", name: "role", value: "user" },
              {
                label: "Password",
                name: "password",
                value: "",
                type: "password",
              },
            ],
            async (data, modal) => {
              try {
                const res = await fetch("https://logixpress-tracking.onrender.com/api/register", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    role: data.role,
                  }),
                });
                if (res.ok) {
                  showToast("User added successfully!", "success");
                  await loadUserRolesData();
                } else {
                  const err = await res.json();
                  showToast(err.message || "Failed to add user", "error");
                }
              } catch {
                showToast("Failed to add user", "error");
              }
              modal.remove();
            }
          );
        };
      });
    }

    // 3. Fix Suspend User Button
    function setupSuspendUserButtons() {
      document.querySelectorAll(".suspend-user-btn").forEach((btn) => {
        btn.onclick = () => {
          const userId = btn.getAttribute("data-userid");
          const userName = btn
            .closest(".flex")
            .querySelector(".font-medium").textContent;
          showConfirmModal(
            "Suspend User",
            `Are you sure you want to suspend ${userName}?`,
            async () => {
              try {
                const jwt = localStorage.getItem("jwt");
                const res = await fetch(
                  `https://logixpress-tracking.onrender.com/api/users/${userId}/suspend`,
                  {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: "Bearer " + jwt,
                    },
                    body: JSON.stringify({ suspended: true }),
                  }
                );
                if (res.ok) {
                  showToast("User suspended successfully!", "success");
                  await loadUserRolesData();
                } else {
                  const err = await res.json();
                  showToast(err.message || "Failed to suspend user", "error");
                }
              } catch {
                showToast("Failed to suspend user", "error");
              }
            }
          );
        };
      });
    }

    // 4. Only Show Real Suspended Users
    async function loadUserRolesData() {
      const users = await fetchAdminUsers();
      const container = document.querySelector("#roles-settings .space-y-4");
      if (!container) return;
      if (!users.length) {
        container.innerHTML = `<div class=\"text-center py-8 text-gray-500\"><p>No users found.</p><button class=\"mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 add-user-btn\"><i class=\"fas fa-plus mr-2\"></i>Add User</button></div>`;
        setupAddUserButton();
        return;
      }
      const usersHtml = users
        .map(
          (user) => `
        <div class=\"flex justify-between items-center p-3 bg-white rounded-lg border\">
          <div>
            <span class=\"font-medium\">${user.name || "Unknown"}</span>
            <p class=\"text-sm text-gray-500\">${user.email}</p>
            <p class=\"text-xs text-gray-400\">Last active: ${
              user.lastActive
                ? new Date(user.lastActive).toLocaleDateString()
                : "Unknown"
            }</p>
            ${
              user.suspended
                ? '<span class="text-xs text-red-500 font-semibold">Suspended</span>'
                : ""
            }
          </div>
          <div class=\"flex gap-2\">
            <span class=\"px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded\">${
              user.role || "user"
            }</span>
            <button class=\"edit-user-btn text-blue-600 hover:text-blue-800\" data-user='${JSON.stringify(
              user
            )}'><i class=\"fas fa-edit\"></i></button>
            <button class=\"suspend-user-btn text-red-600 hover:text-red-800\" data-userid=\"${
              user._id
            }\"><i class=\"fas fa-ban\"></i></button>
          </div>
        </div>
      `
        )
        .join("");
      container.innerHTML = usersHtml;
      setupAddUserButton();
      setupSuspendUserButtons();
      // Add edit-user-btn logic as before...
    }

    // 5. Payment History & Revenue Summary: Only Real Data
    async function loadPaymentHistoryData() {
      const shipments = await fetchAllShipments();
      const container = document.querySelector("#billing-settings .space-y-4");
      if (!container) return;
      if (!shipments.length) {
        container.innerHTML = "";
        const revenueContainer = document.querySelector(
          "#billing-settings .bg-amber-50"
        );
        if (revenueContainer)
          revenueContainer.querySelector(".space-y-4").innerHTML = "";
        return;
      }
      // Calculate revenue from real shipments
      const totalRevenue = shipments.reduce(
        (sum, s) => sum + (s.totalAmount || 0),
        0
      );
      const paidShipments = shipments.filter((s) => s.status === "Delivered");
      const pendingShipments = shipments.filter(
        (s) => s.status !== "Delivered"
      );

      const paymentHistoryHtml = shipments
        .slice(0, 10)
        .map(
          (shipment) => `
        <div class="flex justify-between items-center p-3 bg-white rounded-lg border">
          <div>
            <span class="font-medium">Shipment #${
              shipment.trackingNumber
            }</span>
            <p class="text-sm text-gray-500">₦${shipment.totalAmount || 0} - ${
            shipment.status
          }</p>
            <p class="text-xs text-gray-400">${new Date(
              shipment.createdAt
            ).toLocaleDateString()}</p>
          </div>
          <span class="px-2 py-1 ${
            shipment.status === "Delivered"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          } text-xs rounded">
            ${shipment.status === "Delivered" ? "Paid" : "Pending"}
          </span>
        </div>
      `
        )
        .join("");

      // Update revenue summary
      const revenueContainer = document.querySelector(
        "#billing-settings .bg-amber-50"
      );
      if (revenueContainer) {
        const revenueHtml = `
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-white p-4 rounded-lg border">
              <div class="text-2xl font-bold text-green-600">₦${totalRevenue.toLocaleString()}</div>
              <div class="text-sm text-gray-600">Total Revenue</div>
            </div>
            <div class="bg-white p-4 rounded-lg border">
              <div class="text-2xl font-bold text-blue-600">${
                paidShipments.length
              }</div>
              <div class="text-sm text-gray-600">Paid Shipments</div>
            </div>
            <div class="bg-white p-4 rounded-lg border">
              <div class="text-2xl font-bold text-orange-600">${
                pendingShipments.length
              }</div>
              <div class="text-sm text-gray-600">Pending Shipments</div>
            </div>
          </div>
        `;
        revenueContainer.querySelector(".space-y-4").innerHTML = revenueHtml;
      }

      container.innerHTML = paymentHistoryHtml;
    }

    // --- Ensure all setup functions are called after rendering settings ---
    setupAddZoneButton();
    setupAddUserButton();
    setupSuspendUserButtons();
  }

  // Load real user roles data
  async function loadUserRolesData() {
    const users = await fetchAdminUsers();
    const container = document.querySelector("#roles-settings .space-y-4");
    if (!container) return;

    if (!users.length) {
      container.innerHTML = `
          <div class="text-center py-8 text-gray-500">
          <p>No users found.</p>
          <button class="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 add-user-btn">
            <i class="fas fa-plus mr-2"></i>Add User
          </button>
          </div>
      `;
      return;
    }

    const usersHtml = users
      .map(
        (user) => `
      <div class="flex justify-between items-center p-3 bg-white rounded-lg border">
        <div>
          <span class="font-medium">${user.name || "Unknown"}</span>
          <p class="text-sm text-gray-500">${user.email}</p>
          <p class="text-xs text-gray-400">Last active: ${
            user.lastActive
              ? new Date(user.lastActive).toLocaleDateString()
              : "Unknown"
          }</p>
        </div>
        <div class="flex gap-2">
          <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">${
            user.role || "user"
          }</span>
          <button class="edit-user-btn text-blue-600 hover:text-blue-800" data-user='${JSON.stringify(
            user
          )}'>
            <i class="fas fa-edit"></i>
          </button>
          <button class="suspend-user-btn text-red-600 hover:text-red-800" data-userid="${
            user._id
          }">
            <i class="fas fa-ban"></i>
          </button>
        </div>
      </div>
    `
      )
      .join("");

    container.innerHTML = usersHtml;

    // Set up user edit buttons
    document.querySelectorAll(".edit-user-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const user = JSON.parse(btn.getAttribute("data-user"));
        openEditModal(
          "Edit User",
          [
            { label: "Name", name: "name", value: user.name || "" },
            { label: "Email", name: "email", value: user.email || "" },
            { label: "Role", name: "role", value: user.role || "user" },
          ],
          async (data, modal) => {
            try {
              const jwt = localStorage.getItem("jwt");
              const res = await fetch(
                `https://logixpress-tracking.onrender.com/api/users/${user._id}/role`,
                {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + jwt,
                  },
                  body: JSON.stringify({ role: data.role }),
                }
              );
              if (res.ok) {
                showToast("User updated successfully!", "success");
                await loadUserRolesData(); // Refresh the list
              } else {
                showToast("Failed to update user", "error");
              }
            } catch {
              showToast("Failed to update user", "error");
            }
            modal.remove();
          }
        );
      });
    });

    // Set up suspend buttons
    document.querySelectorAll(".suspend-user-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const userId = btn.getAttribute("data-userid");
        const userName = btn
          .closest(".flex")
          .querySelector(".font-medium").textContent;

        showConfirmModal(
          "Suspend User",
          `Are you sure you want to suspend ${userName}? This will prevent them from logging in.`,
          async () => {
            try {
              const jwt = localStorage.getItem("jwt");
              const res = await fetch(
                `https://logixpress-tracking.onrender.com/api/users/${userId}/suspend`,
                {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + jwt,
                  },
                  body: JSON.stringify({ suspended: true }),
                }
              );
              if (res.ok) {
                showToast("User suspended successfully!", "success");
                await loadUserRolesData(); // Refresh the list
              } else {
                const errorData = await res.json();
                showToast(
                  errorData.message || "Failed to suspend user",
                  "error"
                );
              }
            } catch (error) {
              console.error("Suspension error:", error);
              showToast("Failed to suspend user", "error");
            }
          }
        );
      });
    });
  }

  // Load real system logs data
  async function loadSystemLogsData() {
    const logs = await fetchSystemLogs();
    const container = document.querySelector("#logs-settings .space-y-4");
    if (!container) return;

    if (!logs.length) {
      container.innerHTML = `
        <div class="text-center py-8 text-gray-500">
          <p>No system logs available.</p>
          <p class="text-sm mt-2">Logs will appear here as system activity occurs.</p>
        </div>
      `;
      return;
    }

    const logsHtml = logs
      .map(
        (log) => `
      <div class="flex justify-between items-center p-3 bg-white rounded-lg border">
        <div>
          <span class="font-medium">${log.action}</span>
          <p class="text-sm text-gray-500">${log.user}</p>
          <p class="text-xs text-gray-400">${new Date(
            log.timestamp
          ).toLocaleString()}</p>
        </div>
        <div class="flex gap-2">
          <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">${
            log.type
          }</span>
        </div>
      </div>
    `
      )
      .join("");

    container.innerHTML = logsHtml;
  }

  // Load real payment history data
  async function loadPaymentHistoryData() {
    const shipments = await fetchAllShipments();
    const container = document.querySelector("#billing-settings .space-y-4");
    if (!container) return;

    // If no real shipments, blank out both payment history and revenue summary
    if (!shipments.length) {
      container.innerHTML = "";
      const revenueContainer = document.querySelector(
        "#billing-settings .bg-amber-50"
      );
      if (revenueContainer)
        revenueContainer.querySelector(".space-y-4").innerHTML = "";
      return;
    }

    // Calculate revenue from real shipments
    const totalRevenue = shipments.reduce(
      (sum, s) => sum + (s.totalAmount || 0),
      0
    );
    const paidShipments = shipments.filter((s) => s.status === "Delivered");
    const pendingShipments = shipments.filter((s) => s.status !== "Delivered");

    const paymentHistoryHtml = shipments
      .slice(0, 10)
      .map(
        (shipment) => `
      <div class="flex justify-between items-center p-3 bg-white rounded-lg border">
        <div>
          <span class="font-medium">Shipment #${shipment.trackingNumber}</span>
          <p class="text-sm text-gray-500">₦${shipment.totalAmount || 0} - ${
          shipment.status
        }</p>
          <p class="text-xs text-gray-400">${new Date(
            shipment.createdAt
          ).toLocaleDateString()}</p>
        </div>
        <span class="px-2 py-1 ${
          shipment.status === "Delivered"
            ? "bg-green-100 text-green-800"
            : "bg-yellow-100 text-yellow-800"
        } text-xs rounded">
          ${shipment.status === "Delivered" ? "Paid" : "Pending"}
        </span>
      </div>
    `
      )
      .join("");

    // Update revenue summary
    const revenueContainer = document.querySelector(
      "#billing-settings .bg-amber-50"
    );
    if (revenueContainer) {
      const revenueHtml = `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-white p-4 rounded-lg border">
            <div class="text-2xl font-bold text-green-600">₦${totalRevenue.toLocaleString()}</div>
            <div class="text-sm text-gray-600">Total Revenue</div>
          </div>
          <div class="bg-white p-4 rounded-lg border">
            <div class="text-2xl font-bold text-blue-600">${
              paidShipments.length
            }</div>
            <div class="text-sm text-gray-600">Paid Shipments</div>
          </div>
          <div class="bg-white p-4 rounded-lg border">
            <div class="text-2xl font-bold text-orange-600">${
              pendingShipments.length
            }</div>
            <div class="text-sm text-gray-600">Pending Shipments</div>
          </div>
        </div>
      `;
      revenueContainer.querySelector(".space-y-4").innerHTML = revenueHtml;
    }

    container.innerHTML = paymentHistoryHtml;
  }

  // Setup security settings functionality
  function setupSecuritySettings() {
    // Session timeout input
    const sessionTimeoutInput = document.querySelector(
      "#security-settings input[type='number']"
    );
    if (sessionTimeoutInput) {
      sessionTimeoutInput.value = "30";
      sessionTimeoutInput.addEventListener("change", function () {
        const newTimeout = parseInt(this.value) * 60 * 1000; // Convert to milliseconds
        // Update session timeout (in a real app, this would be saved to backend)
        showToast("Session timeout updated successfully!", "success");
      });
    }

    // Force logout all sessions button
    const forceLogoutBtn = document.querySelector(
      "#security-settings .bg-red-600"
    );
    if (forceLogoutBtn) {
      forceLogoutBtn.addEventListener("click", () => {
        showConfirmModal(
          "Force Logout All Sessions",
          "This will log out all active user sessions. Are you sure you want to continue?",
          () => {
            showToast(
              "All sessions have been logged out successfully!",
              "success"
            );
          }
        );
      });
    }

    // Generate backup codes button
    const generateCodesBtn = document.querySelector(
      "#security-settings .bg-green-600"
    );
    if (generateCodesBtn) {
      generateCodesBtn.addEventListener("click", () => {
        const codes = Array.from({ length: 8 }, () =>
          Math.random().toString(36).substring(2, 8).toUpperCase()
        );
        showBackupCodesModal(codes);
      });
    }

    // Setup password policy toggles
    document
      .querySelectorAll("#security-settings input[type='checkbox']")
      .forEach((checkbox) => {
        checkbox.addEventListener("change", function () {
          const settingName =
            this.closest(".flex").querySelector(".font-medium").textContent;
          showToast(`${settingName} setting updated successfully!`, "success");
        });
      });
  }

  // Show backup codes modal
  function showBackupCodesModal(codes) {
    const modal = document.createElement("div");
    modal.className =
      "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50";
    modal.innerHTML = `
      <div class="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full relative">
        <button class="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
        <div class="text-center">
          <i class="fas fa-key text-green-500 text-4xl mb-4"></i>
          <h2 class="text-2xl font-bold mb-4">Backup Codes Generated</h2>
          <p class="text-gray-600 mb-6">Save these codes in a secure location. You can use them to access your account if you lose your 2FA device.</p>
          <div class="grid grid-cols-2 gap-3 mb-6">
            ${codes
              .map(
                (code) =>
                  `<div class="bg-gray-100 p-3 rounded font-mono text-lg font-bold">${code}</div>`
              )
              .join("")}
          </div>
          <button class="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors" onclick="this.closest('.fixed').remove()">
            I've Saved These Codes
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector("button").onclick = () => modal.remove();
    modal.onclick = (e) => {
      if (e.target === modal) modal.remove();
    };
  }

  async function fetchAndRenderAdminDrivers() {
    const jwt = localStorage.getItem("jwt");
    const container = document.getElementById("admin-drivers-table-container");
    if (!container) return;

    container.innerHTML = '<div class="text-gray-400">Loading drivers...</div>';

    if (!jwt) {
      container.innerHTML =
        '<div class="text-red-500">Not authenticated.</div>';
      return;
    }

    try {
      const res = await fetch("https://logixpress-tracking.onrender.com/api/drivers", {
        headers: { Authorization: "Bearer " + jwt },
      });

      if (!res.ok) {
        container.innerHTML =
          '<div class="text-red-500">Failed to load drivers.</div>';
        return;
      }

      const drivers = await res.json();
      container.innerHTML = renderAdminDriversTable(drivers);
    } catch (err) {
      container.innerHTML =
        '<div class="text-red-500">Error loading drivers.</div>';
    }
  }

  function renderAdminDriversTable(drivers) {
    if (!drivers || drivers.length === 0) {
      return `<div class='text-center py-8 text-gray-500'>No drivers found.</div>`;
    }

    setTimeout(() => {
      // Set up event handlers for action buttons
      document.querySelectorAll(".admin-driver-view-btn").forEach((btn) => {
        btn.onclick = (e) => {
          e.preventDefault();
          const row = btn.closest("tr");
          const email = row.querySelector("td:nth-child(2)").textContent.trim();
          const driver = drivers.find((d) => d.email === email);
          if (driver) openDriverAssignmentsModal(driver);
        };
      });

      document.querySelectorAll(".admin-driver-edit-btn").forEach((btn) => {
        btn.onclick = (e) => {
          e.preventDefault();
          const row = btn.closest("tr");
          const email = row.querySelector("td:nth-child(2)").textContent.trim();
          const driver = drivers.find((d) => d.email === email);
          if (driver) openEditDriverModal(driver);
        };
      });

      document.querySelectorAll(".admin-driver-delete-btn").forEach((btn) => {
        btn.onclick = (e) => {
          e.preventDefault();
          const row = btn.closest("tr");
          const email = row.querySelector("td:nth-child(2)").textContent.trim();
          const driver = drivers.find((d) => d.email === email);
          if (driver) confirmDeleteDriver(driver);
        };
      });

      document.querySelectorAll(".admin-driver-status-btn").forEach((btn) => {
        btn.onclick = (e) => {
          e.preventDefault();
          const row = btn.closest("tr");
          const email = row.querySelector("td:nth-child(2)").textContent.trim();
          const driver = drivers.find((d) => d.email === email);
          if (driver) openDriverStatusModal(driver);
        };
      });
    }, 0);

    return `
      <table class='w-full text-sm'>
        <thead>
          <tr class='bg-blue-50 text-blue-700'>
            <th class='px-4 py-2 text-left font-medium uppercase tracking-wider'>Name</th>
            <th class='px-4 py-2 text-left font-medium uppercase tracking-wider'>Email</th>
            <th class='px-4 py-2 text-left font-medium uppercase tracking-wider'>Phone</th>
            <th class='px-4 py-2 text-left font-medium uppercase tracking-wider'>Vehicle</th>
            <th class='px-4 py-2 text-left font-medium uppercase tracking-wider'>Status</th>
            <th class='px-4 py-2 text-left font-medium uppercase tracking-wider'>Assignments</th>
            <th class='px-4 py-2 text-left font-medium uppercase tracking-wider'>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${drivers
            .map(
              (driver) => `
            <tr class='border-b hover:bg-blue-50 transition-colors'>
              <td class='px-4 py-2'>${driver.name || "-"}</td>
              <td class='px-4 py-2'>${driver.email || "-"}</td>
              <td class='px-4 py-2'>${driver.phone || "-"}</td>
              <td class='px-4 py-2'>
                <div class="font-medium">${driver.vehicle?.type || "-"}</div>
                <div class="text-xs text-gray-500">${
                  driver.vehicle?.plateNumber || "-"
                }</div>
              </td>
              <td class='px-4 py-2'>
                <span class="px-2 py-1 rounded-full text-xs font-medium ${
                  driver.status === "online"
                    ? "bg-green-100 text-green-800"
                    : driver.status === "busy"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
                }">${driver.status || "offline"}</span>
              </td>
              <td class='px-4 py-2'>${driver.assignmentCount || 0}</td>
              <td class='px-4 py-2'>
                <div class="flex items-center gap-2 flex-wrap">
                  <button class='admin-driver-view-btn text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50' title='View Assignments'>
                    <i class='fas fa-eye text-sm'></i>
                  </button>
                  <button class='admin-driver-status-btn text-purple-600 hover:text-purple-800 p-1 rounded hover:bg-purple-50' title='Update Status'>
                    <i class='fas fa-toggle-on text-sm'></i>
                  </button>
                  <button class='admin-driver-edit-btn text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50' title='Edit'>
                    <i class='fas fa-edit text-sm'></i>
                  </button>
                  <button class='admin-driver-delete-btn text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50' title='Delete'>
                    <i class='fas fa-trash text-sm'></i>
                  </button>
                </div>
              </td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;
  }

  function openAddDriverModal() {
    const modal = document.createElement("div");
    modal.className =
      "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40";
    modal.innerHTML = `
      <div class="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative">
        <button class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl" onclick="this.closest('.fixed').remove()">&times;</button>
        <h2 class="text-lg font-bold mb-4">Add New Driver</h2>
        <form id="admin-add-driver-form" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Name</label>
              <input type="text" id="add-driver-name" required class="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Email</label>
              <input type="email" id="add-driver-email" required class="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Phone</label>
              <input type="tel" id="add-driver-phone" required class="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Vehicle Type</label>
              <select id="add-driver-vehicle-type" required class="w-full px-3 py-2 border rounded">
                <option value="">Select Vehicle</option>
                <option value="Motorcycle">Motorcycle</option>
                <option value="Car">Car</option>
                <option value="Van">Van</option>
                <option value="Truck">Truck</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Plate Number</label>
              <input type="text" id="add-driver-plate" required class="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Capacity</label>
              <input type="text" id="add-driver-capacity" required class="w-full px-3 py-2 border rounded" placeholder="e.g., 50kg" />
            </div>
          </div>
          <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition">Add Driver</button>
        </form>
      </div>
    `;
    document.body.appendChild(modal);

    const form = modal.querySelector("#admin-add-driver-form");
    if (form) {
      form.onsubmit = async function (e) {
        e.preventDefault();
        const name = document.getElementById("add-driver-name").value;
        const email = document.getElementById("add-driver-email").value;
        const phone = document.getElementById("add-driver-phone").value;
        const vehicleType = document.getElementById(
          "add-driver-vehicle-type"
        ).value;
        const plateNumber = document.getElementById("add-driver-plate").value;
        const capacity = document.getElementById("add-driver-capacity").value;

        const vehicle = {
          type: vehicleType,
          plateNumber: plateNumber,
          capacity: capacity,
        };

        const jwt = localStorage.getItem("jwt");
        try {
          const res = await fetch("https://logixpress-tracking.onrender.com/api/drivers", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + jwt,
            },
            body: JSON.stringify({ name, email, phone, vehicle }),
          });

          if (res.ok) {
            showToast("Driver added successfully!");
            modal.remove();
            fetchAndRenderAdminDrivers();
          } else {
            const data = await res.json().catch(() => ({}));
            showToast(data.message || "Failed to add driver.", "error");
          }
        } catch {
          showToast("Error adding driver.", "error");
        }
      };
    }
  }

  function openEditDriverModal(driver) {
    const modal = document.createElement("div");
    modal.className =
      "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40";
    modal.innerHTML = `
      <div class="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative">
        <button class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl" onclick="this.closest('.fixed').remove()">&times;</button>
        <h2 class="text-lg font-bold mb-4">Edit Driver</h2>
        <form id="admin-edit-driver-form" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Name</label>
              <input type="text" id="edit-driver-name" required class="w-full px-3 py-2 border rounded" value="${
                driver.name || ""
              }" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Email</label>
              <input type="email" id="edit-driver-email" required class="w-full px-3 py-2 border rounded" value="${
                driver.email || ""
              }" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Phone</label>
              <input type="tel" id="edit-driver-phone" required class="w-full px-3 py-2 border rounded" value="${
                driver.phone || ""
              }" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Vehicle Type</label>
              <select id="edit-driver-vehicle-type" required class="w-full px-3 py-2 border rounded">
                <option value="Motorcycle" ${
                  driver.vehicle?.type === "Motorcycle" ? "selected" : ""
                }>Motorcycle</option>
                <option value="Car" ${
                  driver.vehicle?.type === "Car" ? "selected" : ""
                }>Car</option>
                <option value="Van" ${
                  driver.vehicle?.type === "Van" ? "selected" : ""
                }>Van</option>
                <option value="Truck" ${
                  driver.vehicle?.type === "Truck" ? "selected" : ""
                }>Truck</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Plate Number</label>
              <input type="text" id="edit-driver-plate" required class="w-full px-3 py-2 border rounded" value="${
                driver.vehicle?.plateNumber || ""
              }" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Capacity</label>
              <input type="text" id="edit-driver-capacity" required class="w-full px-3 py-2 border rounded" value="${
                driver.vehicle?.capacity || ""
              }" />
            </div>
          </div>
          <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded font-semibold hover:bg-green-700 transition">Update Driver</button>
        </form>
      </div>
    `;
    document.body.appendChild(modal);

    const form = modal.querySelector("#admin-edit-driver-form");
    if (form) {
      form.onsubmit = async function (e) {
        e.preventDefault();
        const name = document.getElementById("edit-driver-name").value;
        const email = document.getElementById("edit-driver-email").value;
        const phone = document.getElementById("edit-driver-phone").value;
        const vehicleType = document.getElementById(
          "edit-driver-vehicle-type"
        ).value;
        const plateNumber = document.getElementById("edit-driver-plate").value;
        const capacity = document.getElementById("edit-driver-capacity").value;

        const vehicle = {
          type: vehicleType,
          plateNumber: plateNumber,
          capacity: capacity,
        };

        const jwt = localStorage.getItem("jwt");
        try {
          const res = await fetch(
            `https://logixpress-tracking.onrender.com/api/drivers/${driver._id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + jwt,
              },
              body: JSON.stringify({ name, email, phone, vehicle }),
            }
          );

          if (res.ok) {
            showToast("Driver updated successfully!");
            modal.remove();
            fetchAndRenderAdminDrivers();
          } else {
            const data = await res.json().catch(() => ({}));
            showToast(data.message || "Failed to update driver.", "error");
          }
        } catch {
          showToast("Error updating driver.", "error");
        }
      };
    }
  }

  function confirmDeleteDriver(driver) {
    const modal = document.createElement("div");
    modal.className =
      "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40";
    modal.innerHTML = `
      <div class="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative text-center">
        <button class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl" onclick="this.closest('.fixed').remove()">&times;</button>
        <h2 class="text-lg font-bold mb-4 text-red-700">Delete Driver</h2>
        <p class="mb-6">Are you sure you want to delete driver <span class='font-semibold'>${
          driver.name || driver.email
        }</span>?<br>This action cannot be undone.</p>
        <div class="flex justify-center gap-4">
          <button id="delete-driver-cancel" class="bg-gray-200 text-gray-700 px-4 py-2 rounded font-semibold hover:bg-gray-300 transition">Cancel</button>
          <button id="delete-driver-confirm" class="bg-red-600 text-white px-4 py-2 rounded font-semibold hover:bg-red-700 transition">Delete</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector("#delete-driver-cancel").onclick = () => modal.remove();
    modal.querySelector("#delete-driver-confirm").onclick = () => {
      modal.remove();
      const jwt = localStorage.getItem("jwt");
      fetch(`https://logixpress-tracking.onrender.com/api/drivers/${driver._id}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + jwt },
      })
        .then((res) => {
          if (res.ok) {
            showToast("Driver deleted successfully!");
            fetchAndRenderAdminDrivers();
          } else {
            res
              .json()
              .then((data) =>
                showToast(data.message || "Failed to delete driver.", "error")
              )
              .catch(() => showToast("Failed to delete driver.", "error"));
          }
        })
        .catch(() => showToast("Error deleting driver.", "error"));
    };
  }

  function openDriverStatusModal(driver) {
    const modal = document.createElement("div");
    modal.className =
      "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40";
    modal.innerHTML = `
      <div class="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
        <button class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl" onclick="this.closest('.fixed').remove()">&times;</button>
        <h2 class="text-lg font-bold mb-4">Update Driver Status</h2>
        <form id="admin-driver-status-form" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Status</label>
            <select id="driver-status" class="w-full px-3 py-2 border rounded">
              <option value="online" ${
                driver.status === "online" ? "selected" : ""
              }>Online</option>
              <option value="offline" ${
                driver.status === "offline" ? "selected" : ""
              }>Offline</option>
              <option value="busy" ${
                driver.status === "busy" ? "selected" : ""
              }>Busy</option>
            </select>
          </div>
          <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition">Update Status</button>
        </form>
      </div>
    `;
    document.body.appendChild(modal);

    const form = modal.querySelector("#admin-driver-status-form");
    if (form) {
      form.onsubmit = async function (e) {
        e.preventDefault();
        const status = document.getElementById("driver-status").value;

        const jwt = localStorage.getItem("jwt");
        try {
          const res = await fetch(
            `https://logixpress-tracking.onrender.com/api/drivers/${driver._id}/status`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + jwt,
              },
              body: JSON.stringify({ status }),
            }
          );

          if (res.ok) {
            showToast("Driver status updated successfully!");
            modal.remove();
            fetchAndRenderAdminDrivers();
          } else {
            const data = await res.json().catch(() => ({}));
            showToast(data.message || "Failed to update status.", "error");
          }
        } catch {
          showToast("Error updating status.", "error");
        }
      };
    }
  }

  function openDriverAssignmentsModal(driver) {
    const modal = document.createElement("div");
    modal.className =
      "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40";
    modal.innerHTML = `
      <div class="bg-white rounded-lg shadow-lg max-w-4xl w-full p-6 relative">
        <button class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl" onclick="this.closest('.fixed').remove()">&times;</button>
        <h2 class="text-lg font-bold mb-4">Driver Assignments: ${driver.name}</h2>
        <div id="driver-assignments-content" class="min-h-[200px]">Loading assignments...</div>
      </div>
    `;
    document.body.appendChild(modal);

    const jwt = localStorage.getItem("jwt");
    fetch(`https://logixpress-tracking.onrender.com/api/drivers/${driver._id}/assignments`, {
      headers: { Authorization: "Bearer " + jwt },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((assignments) => {
        const content = modal.querySelector("#driver-assignments-content");
        if (!assignments || assignments.length === 0) {
          content.innerHTML = `<div class='text-gray-500 text-center py-8'>No assignments found.</div>`;
        } else {
          content.innerHTML = `
            <table class='w-full text-sm'>
              <thead>
                <tr class='bg-blue-50 text-blue-700'>
                  <th class='px-4 py-2 text-left font-medium'>Tracking #</th>
                  <th class='px-4 py-2 text-left font-medium'>Status</th>
                  <th class='px-4 py-2 text-left font-medium'>Recipient</th>
                  <th class='px-4 py-2 text-left font-medium'>ETA</th>
                </tr>
              </thead>
              <tbody>
                ${assignments
                  .map(
                    (a) => `
                  <tr class='border-b hover:bg-blue-50 transition-colors'>
                    <td class='px-4 py-2 font-mono'>${a.trackingNumber}</td>
                    <td class='px-4 py-2'>
                      <span class="px-2 py-1 rounded-full text-xs font-medium ${
                        a.status === "Delivered"
                          ? "bg-green-100 text-green-800"
                          : a.status === "In Transit"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }">${a.status}</span>
                    </td>
                    <td class='px-4 py-2'>${a.recipient?.address || "-"}</td>
                    <td class='px-4 py-2'>${
                      a.estimatedDelivery
                        ? new Date(a.estimatedDelivery).toLocaleDateString()
                        : "-"
                    }</td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          `;
        }
      })
      .catch(async (res) => {
        let msg = "Failed to load assignments.";
        try {
          msg = (await res.json()).message || msg;
        } catch {}
        modal.querySelector(
          "#driver-assignments-content"
        ).innerHTML = `<div class='text-red-500 text-center py-8'>${msg}</div>`;
      });
  }

  function assignShipmentToDriver(trackingNumber) {
    const modal = document.createElement("div");
    modal.className =
      "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40";
    modal.innerHTML = `
      <div class="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative">
        <button class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl" onclick="this.closest('.fixed').remove()">&times;</button>
        <h2 class="text-lg font-bold mb-4">Assign Shipment to Driver</h2>
        <div class="mb-4">
          <p class="text-sm text-gray-600">Assigning shipment: <span class="font-mono font-bold">${trackingNumber}</span></p>
        </div>
        <div id="available-drivers-content" class="min-h-[200px]">Loading available drivers...</div>
      </div>
    `;
    document.body.appendChild(modal);

    const jwt = localStorage.getItem("jwt");
    fetch("https://logixpress-tracking.onrender.com/api/drivers", {
      headers: { Authorization: "Bearer " + jwt },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((drivers) => {
        const content = modal.querySelector("#available-drivers-content");
        if (!drivers || drivers.length === 0) {
          content.innerHTML = `<div class='text-gray-500 text-center py-8'>No drivers available.</div>`;
        } else {
          content.innerHTML = `
            <div class="space-y-3">
              <p class="text-sm text-gray-600 mb-3">Select a driver to assign this shipment:</p>
              ${drivers
                .map(
                  (driver) => `
                <div class="border rounded-lg p-4 hover:bg-blue-50 transition-colors cursor-pointer driver-assignment-option" data-driver-id="${
                  driver._id
                }">
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="font-semibold">${driver.name}</div>
                      <div class="text-sm text-gray-600">${driver.email}</div>
                      <div class="text-xs text-gray-500">${
                        driver.vehicle?.type
                      } - ${driver.vehicle?.plateNumber}</div>
                    </div>
                    <div class="text-right">
                      <span class="px-2 py-1 rounded-full text-xs font-medium ${
                        driver.status === "online"
                          ? "bg-green-100 text-green-800"
                          : driver.status === "busy"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }">${driver.status}</span>
                      <div class="text-xs text-gray-500 mt-1">${
                        driver.assignmentCount || 0
                      } assignments</div>
                    </div>
                  </div>
                </div>
              `
                )
                .join("")}
            </div>
          `;

          // Add click handlers for driver selection
          document
            .querySelectorAll(".driver-assignment-option")
            .forEach((option) => {
              option.onclick = () => {
                const driverId = option.dataset.driverId;
                const driverName =
                  option.querySelector(".font-semibold").textContent;
                confirmAssignShipment(
                  trackingNumber,
                  driverId,
                  driverName,
                  modal
                );
              };
            });
        }
      })
      .catch(async (res) => {
        let msg = "Failed to load drivers.";
        try {
          msg = (await res.json()).message || msg;
        } catch {}
        modal.querySelector(
          "#available-drivers-content"
        ).innerHTML = `<div class='text-red-500 text-center py-8'>${msg}</div>`;
      });
  }

  function confirmAssignShipment(trackingNumber, driverId, driverName, modal) {
    const confirmModal = document.createElement("div");
    confirmModal.className =
      "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40";
    confirmModal.innerHTML = `
      <div class="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative text-center">
        <h3 class="text-lg font-bold mb-4">Confirm Assignment</h3>
        <p class="mb-6">Assign shipment <span class="font-mono font-bold">${trackingNumber}</span> to <span class="font-semibold">${driverName}</span>?</p>
        <div class="flex justify-center gap-4">
          <button id="cancel-assignment" class="bg-gray-200 text-gray-700 px-4 py-2 rounded font-semibold hover:bg-gray-300 transition">Cancel</button>
          <button id="confirm-assignment" class="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition">Assign</button>
        </div>
      </div>
    `;
    document.body.appendChild(confirmModal);

    confirmModal.querySelector("#cancel-assignment").onclick = () => {
      confirmModal.remove();
    };

    confirmModal.querySelector("#confirm-assignment").onclick = () => {
      const jwt = localStorage.getItem("jwt");
      fetch(`https://logixpress-tracking.onrender.com/api/drivers/${driverId}/assign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwt,
        },
        body: JSON.stringify({ trackingNumber }),
      })
        .then((res) => (res.ok ? res.json() : Promise.reject(res)))
        .then(() => {
          showToast("Shipment assigned successfully!");
          confirmModal.remove();
          modal.remove();
          fetchAndRenderAdminShipments();
          fetchAndRenderAdminDrivers();
        })
        .catch(async (res) => {
          let msg = "Failed to assign shipment.";
          try {
            msg = (await res.json()).message || msg;
          } catch {}
          showToast(msg, "error");
          confirmModal.remove();
        });
    };
  }

  // Make assignShipmentToDriver globally accessible
  window.assignShipmentToDriver = assignShipmentToDriver;
});
