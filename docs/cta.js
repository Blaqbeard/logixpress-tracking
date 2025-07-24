// CTA Button Logic for Public Pages
// Ensure main.js exposes showCustomModal, createLoginModal, showToast globally

document.addEventListener("DOMContentLoaded", () => {
  // --- Start Tracking / Track Package ---
  const startTrackingBtn = document.getElementById("start-tracking-btn");
  const trackPackageBtn = document.getElementById("track-package-btn");
  if (startTrackingBtn) {
    startTrackingBtn.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("CTA Clicked: ", startTrackingBtn.id);
      showLoginToTrackModal();
    });
  }
  // --- Track Package Button Logic (no modal) ---
  if (trackPackageBtn) {
    trackPackageBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      console.log("CTA Clicked: ", trackPackageBtn.id);
      // Find the input field above the button
      const input =
        trackPackageBtn.parentElement.querySelector('input[type="text"]');
      const trackingNumber = input && input.value.trim();
      const resultDiv = document.createElement("div");
      resultDiv.className = "mt-4 text-sm";
      // Remove any previous result
      const prev = trackPackageBtn.parentElement.querySelector(
        ".track-preview-result"
      );
      if (prev) prev.remove();
      resultDiv.classList.add("track-preview-result");
      if (!trackingNumber) {
        resultDiv.innerHTML =
          "<span class='text-red-500'>Please enter a tracking number.</span>";
        trackPackageBtn.parentElement.appendChild(resultDiv);
        return;
      }
      try {
        const res = await fetch(
          `https://logixpress-tracking.onrender.com/api/shipments/track/${trackingNumber}`
        );
        if (!res.ok) throw new Error();
        const data = await res.json();
        resultDiv.innerHTML = `
          <div><b>Status:</b> ${data.status}</div>
          <div><b>ETA:</b> ${data.eta}</div>
          <button id="full-details-btn" class="mt-3 bg-blue-600 text-white px-4 py-2 rounded">Login/Signup for Full Details</button>
        `;
        trackPackageBtn.parentElement.appendChild(resultDiv);
        document.getElementById("full-details-btn").onclick = () =>
          window.createLoginModal && window.createLoginModal();
      } catch {
        resultDiv.innerHTML =
          "<span class='text-red-500'>Tracking number not found.</span>";
        trackPackageBtn.parentElement.appendChild(resultDiv);
      }
    });
  }

  // --- Contact Support ---
  const contactSupportBtn = document.getElementById("contact-support-btn");
  if (contactSupportBtn) {
    contactSupportBtn.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("CTA Clicked: contact-support-btn");
      showSupportModal();
    });
  }

  // --- Request Demo ---
  const requestDemoBtn = document.getElementById("request-demo-btn");
  if (requestDemoBtn) {
    requestDemoBtn.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("CTA Clicked: request-demo-btn");
      showDemoModal();
    });
  }

  // --- Send Message (Contact Form) ---
  const sendMessageBtn = document.getElementById("send-message-btn");
  if (sendMessageBtn) {
    sendMessageBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      console.log("CTA Clicked: send-message-btn");
      const form = sendMessageBtn.closest("form");
      const data = {
        firstName: form.querySelector('input[placeholder="First Name"]')?.value,
        lastName: form.querySelector('input[placeholder="Last Name"]')?.value,
        email: form.querySelector('input[type="email"]')?.value,
        message: form.querySelector("textarea")?.value,
      };
      try {
        await fetch("https://logixpress-tracking.onrender.com/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        window.showToast &&
          window.showToast(
            "Message sent! We'll get back to you soon.",
            "success"
          );
        form.reset();
      } catch {
        window.showToast &&
          window.showToast(
            "Failed to send message. Please try again.",
            "error"
          );
      }
    });
  }
});

// --- Modal Functions ---
function showTrackingModal() {
  console.log("showTrackingModal called");
  window.showCustomModal &&
    window.showCustomModal({
      title: "Track Your Package",
      content: `
      <form id="tracking-form">
        <input type="text" id="tracking-input" placeholder="Enter tracking number" class="w-full border px-3 py-2 rounded mb-3" />
        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">Track</button>
        <div id="tracking-result" class="mt-4"></div>
      </form>
    `,
      onOpen: () => {
        document.getElementById("tracking-form").onsubmit = async (e) => {
          e.preventDefault();
          const trackingNumber = document
            .getElementById("tracking-input")
            .value.trim();
          const resultDiv = document.getElementById("tracking-result");
          if (!trackingNumber) {
            resultDiv.innerHTML =
              "<span class='text-red-500'>Please enter a tracking number.</span>";
            return;
          }
          try {
            const res = await fetch(
              `https://logixpress-tracking.onrender.com/api/shipments/track/${trackingNumber}`
            );
            if (!res.ok) throw new Error();
            const data = await res.json();
            resultDiv.innerHTML = `
            <div><b>Status:</b> ${data.status}</div>
            <div><b>ETA:</b> ${data.eta}</div>
            <button id="full-details-btn" class="mt-3 bg-blue-600 text-white px-4 py-2 rounded">Login/Signup for Full Details</button>
          `;
            document.getElementById("full-details-btn").onclick = () =>
              window.createLoginModal && window.createLoginModal();
          } catch {
            resultDiv.innerHTML =
              "<span class='text-red-500'>Tracking number not found.</span>";
          }
        };
      },
    });
}

function showSupportModal() {
  console.log("showSupportModal called");
  window.showCustomModal &&
    window.showCustomModal({
      title: "Contact Support",
      content: `
      <form id="support-form">
        <input type="text" id="support-name" placeholder="Your Name" class="w-full border px-3 py-2 rounded mb-3" />
        <input type="email" id="support-email" placeholder="Your Email" class="w-full border px-3 py-2 rounded mb-3" />
        <textarea id="support-message" placeholder="How can we help you?" class="w-full border px-3 py-2 rounded mb-3"></textarea>
        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">Send</button>
        <div id="support-result" class="mt-4"></div>
      </form>
    `,
      onOpen: () => {
        document.getElementById("support-form").onsubmit = async (e) => {
          e.preventDefault();
          document.getElementById("support-result").innerHTML =
            "Thank you! Our team will contact you soon.<br><button id='support-login-btn' class='mt-3 bg-blue-600 text-white px-4 py-2 rounded'>Login/Signup for Advanced Support</button>";
          document.getElementById("support-login-btn").onclick = () =>
            window.createLoginModal && window.createLoginModal();
        };
      },
    });
}

function showDemoModal() {
  console.log("showDemoModal called");
  // Show loading state first
  window.showCustomModal &&
    window.showCustomModal({
      title: "🚀 Mini Demo Preview!",
      content: `
        <div class="flex flex-col items-center text-center p-2 sm:p-4 md:p-6 w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto">
          <div class="text-4xl sm:text-5xl md:text-6xl mb-2">✨🔍</div>
          <div class="text-base sm:text-lg md:text-xl font-semibold mb-2 text-blue-700">
            Loading your demo preview...
          </div>
          <div class="text-gray-400 text-sm mt-4">Please wait...</div>
        </div>
      `,
      onOpen: async () => {
        // Fetch real demo data (simulate with a real endpoint or fallback)
        let demoData;
        try {
          const res = await fetch(
            "https://logixpress-tracking.onrender.com/api/shipments/demo"
          );
          if (!res.ok) throw new Error();
          demoData = await res.json();
        } catch {
          demoData = {
            trackingNumber: "LX123456789",
            status: "In Transit",
            eta: "May 18, 2025",
            origin: "Lagos",
            destination: "Abuja",
            funFact:
              "This package has traveled 1,200km and dodged 3 traffic jams! 🛣️",
          };
        }
        // Replace modal content with real preview
        const modalContent = `
          <div class="flex flex-col items-center text-center p-2 sm:p-4 md:p-6 w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto">
            <div class="text-4xl sm:text-5xl md:text-6xl mb-2">📦✨</div>
            <div class="text-base sm:text-lg md:text-xl font-semibold mb-2 text-blue-700">
              Demo Shipment Preview
            </div>
            <div class="bg-blue-50 rounded-lg shadow p-4 w-full mb-4">
              <div class="mb-2"><b>Tracking #:</b> <span class="font-mono">${
                demoData.trackingNumber
              }</span></div>
              <div class="mb-2"><b>Status:</b> ${demoData.status}</div>
              <div class="mb-2"><b>ETA:</b> ${demoData.eta}</div>
              <div class="mb-2"><b>From:</b> ${demoData.origin} <b>→</b> ${
          demoData.destination
        }</div>
              <div class="text-xs text-gray-500 mt-2">${
                demoData.funFact || ""
              }</div>
            </div>
            <button id="full-demo-btn" class="relative w-full max-w-[220px] h-12 bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl shadow-lg text-white font-bold text-base sm:text-lg flex items-center justify-center transition-transform transform hover:scale-105 active:scale-95 group overflow-hidden mt-2">
              <span class="pr-3 z-10">🎉 Full Demo</span>
              <span class="absolute left-0 top-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-500"></span>
              <span class="absolute right-1 text-2xl animate-bounce hidden sm:inline">👉</span>
            </button>
            <div class="mt-4 text-xs sm:text-sm text-gray-400 italic">
              Want to see the full journey? Login or signup for the real magic! ✨
            </div>
          </div>
        `;
        document.getElementById("custom-modal-content").innerHTML =
          modalContent;
        document.getElementById("full-demo-btn").onclick = () =>
          window.createLoginModal && window.createLoginModal();
      },
    });
}

// Fun login modal for tracking
function showLoginToTrackModal() {
  window.showCustomModal &&
    window.showCustomModal({
      title: "😅 Oops, I Got You!",
      content: `
        <div class="flex flex-col items-center text-center p-2 sm:p-4 md:p-6 w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto">
          <div class="text-4xl sm:text-5xl md:text-6xl mb-2">🔍📦</div>
          <div class="text-base sm:text-lg md:text-xl font-semibold mb-2 text-blue-700">
            You almost tracked that shipment!
          </div>
          <div class="text-gray-600 mb-4 text-sm sm:text-base md:text-lg">
            But first, <b>log in</b> or <b>sign up</b> to see the juicy details.<br>
            (We promise, no carrier pigeons involved 🐦)
          </div>
          <button id="modal-login-btn" class="relative w-full max-w-[220px] h-12 bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl shadow-lg text-white font-bold text-base sm:text-lg flex items-center justify-center transition-transform transform hover:scale-105 active:scale-95 group overflow-hidden">
            <span class="pr-3 z-10">🚀 Login / Signup</span>
            <span class="absolute left-0 top-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-500"></span>
            <span class="absolute right-1 text-2xl animate-bounce hidden sm:inline">👉</span>
          </button>
          <div class="mt-4 text-xs sm:text-sm text-gray-400 italic">
            P.S. We take your privacy as seriously as our delivery times!
          </div>
        </div>
      `,
      onOpen: () => {
        document.getElementById("modal-login-btn").onclick = () =>
          window.createLoginModal && window.createLoginModal();
      },
    });
}
