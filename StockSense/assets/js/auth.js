/* =========================================================
   STOCKSENSE — AUTH LOGIC
   Front-end only for now: validates input, then calls the
   endpoints marked TODO once the backend is ready.
========================================================= */

/* ---------- Session helpers (used by every protected page) ---------- */
const StockSenseAuth = (function () {
  const KEY = "stocksense_session";

  function save(session) {
    try { localStorage.setItem(KEY, JSON.stringify(session)); } catch (e) { /* ignore */ }
  }
  function get() {
    try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { return null; }
  }
  function clear() {
    try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ }
  }
  // Call at the top of any protected page. Redirects to login if not signed in.
  function requireAuth() {
    const session = get();
    if (!session) {
      window.location.href = "login.html";
      return null;
    }
    return session;
  }
  function dashboardUrlForRole(role) {
    return role === "staff" ? "dashboard-staff.html" : "dashboard-manager.html";
  }
  return { save, get, clear, requireAuth, dashboardUrlForRole };
})();

/* ---------- Page logic (only runs on login.html) ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const authPane = document.getElementById("authPane");
  if (!authPane) return; // not on the auth page

  const panes = ["loginPane", "registerPane", "forgotPane", "otpPane", "newPassPane"];
  function showPane(id) {
    panes.forEach((p) => document.getElementById(p).classList.toggle("active", p === id));
    const tabsBar = document.querySelector(".tabs");
    const onTabs = id === "loginPane" || id === "registerPane";
    tabsBar.style.display = onTabs ? "flex" : "none";
    document.querySelectorAll(".tab").forEach((t) =>
      t.classList.toggle("active", t.dataset.tab === (id === "loginPane" ? "login" : "register"))
    );
  }
  document.querySelectorAll("[data-tab]").forEach((el) => {
    el.addEventListener("click", () => {
      const map = { login: "loginPane", register: "registerPane", forgot: "forgotPane" };
      showPane(map[el.dataset.tab]);
    });
  });

  // Role selection
  document.querySelectorAll(".role-opt").forEach((opt) => {
    opt.addEventListener("click", () => {
      document.querySelectorAll(`.role-opt[data-group="${opt.dataset.group}"]`).forEach((o) => o.classList.remove("selected"));
      opt.classList.add("selected");
    });
  });
  function selectedRole(group) {
    const el = document.querySelector(`.role-opt.selected[data-group="${group}"]`);
    return el ? el.dataset.role : "manager";
  }

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  function validateField(fieldId, condition) {
    const field = document.getElementById(fieldId);
    field.classList.toggle("invalid", !condition);
    return condition;
  }
  function runWithLoading(btn, onDone) {
    btn.classList.add("loading");
    btn.disabled = true;
    // TODO: replace the setTimeout below with a real fetch() to the backend.
    setTimeout(() => {
      btn.classList.remove("loading");
      btn.disabled = false;
      onDone && onDone();
    }, 700);
  }

  /* ----- Log in ----- */
  document.getElementById("loginBtn").addEventListener("click", () => {
    const email = document.getElementById("loginEmail").value;
    const pass = document.getElementById("loginPass").value;
    const okEmail = validateField("loginEmailField", emailRe.test(email));
    const okPass = validateField("loginPassField", pass.length > 0);
    if (!okEmail || !okPass) return;

    runWithLoading(document.getElementById("loginBtn"), () => {
      // TODO: POST /api/auth/login  { email, password, role }
      // On success the backend returns { token, user: { name, email, role } }.
      const role = selectedRole("login");
      StockSenseAuth.save({ token: "demo-token", user: { name: email.split("@")[0], email, role } });
      window.location.href = StockSenseAuth.dashboardUrlForRole(role);
    });
  });

  /* ----- Register ----- */
  document.getElementById("registerBtn").addEventListener("click", () => {
    const name = document.getElementById("regName").value;
    const email = document.getElementById("regEmail").value;
    const p1 = document.getElementById("regPass").value;
    const p2 = document.getElementById("regPass2").value;
    const okName = validateField("regNameField", name.trim().length > 0);
    const okEmail = validateField("regEmailField", emailRe.test(email));
    const okPass = validateField("regPassField", p1.length >= 8);
    const okPass2 = validateField("regPass2Field", p2 === p1 && p2.length > 0);
    if (!(okName && okEmail && okPass && okPass2)) return;

    runWithLoading(document.getElementById("registerBtn"), () => {
      // TODO: POST /api/auth/register { name, email, password, role }
      const role = selectedRole("register");
      StockSenseAuth.save({ token: "demo-token", user: { name, email, role } });
      window.location.href = StockSenseAuth.dashboardUrlForRole(role);
    });
  });

  /* ----- Forgot password: request OTP ----- */
  document.getElementById("sendOtpBtn").addEventListener("click", () => {
    const email = document.getElementById("forgotEmail").value;
    if (!validateField("forgotEmailField", emailRe.test(email))) return;
    runWithLoading(document.getElementById("sendOtpBtn"), () => {
      // TODO: POST /api/auth/forgot-password { email }  -> backend emails a 4-digit OTP
      document.getElementById("otpSentTo").textContent = `We sent a 4-digit code to ${email}.`;
      showPane("otpPane");
    });
  });

  // OTP auto-advance between boxes
  const otpInputs = document.querySelectorAll("#otpPane .otp-boxes input");
  otpInputs.forEach((inp, i) => {
    inp.addEventListener("input", () => {
      inp.value = inp.value.replace(/[^0-9]/g, "");
      if (inp.value && otpInputs[i + 1]) otpInputs[i + 1].focus();
    });
    inp.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !inp.value && otpInputs[i - 1]) otpInputs[i - 1].focus();
    });
  });

  document.getElementById("verifyOtpBtn").addEventListener("click", () => {
    // TODO: POST /api/auth/verify-otp { email, code }
    runWithLoading(document.getElementById("verifyOtpBtn"), () => showPane("newPassPane"));
  });
  document.getElementById("resendOtp").addEventListener("click", () => {
    // TODO: POST /api/auth/forgot-password again
    otpInputs.forEach((i) => (i.value = ""));
    otpInputs[0].focus();
  });

  document.getElementById("resetPassBtn").addEventListener("click", () => {
    const p1 = document.getElementById("newPass").value;
    const p2 = document.getElementById("newPass2").value;
    const okPass = validateField("newPassField", p1.length >= 8);
    const okPass2 = validateField("newPass2Field", p2 === p1 && p2.length > 0);
    if (!(okPass && okPass2)) return;
    runWithLoading(document.getElementById("resetPassBtn"), () => {
      // TODO: POST /api/auth/reset-password { email, code, newPassword }
      showPane("loginPane");
    });
  });
});
