/* =========================================================
   STOCKSENSE — DASHBOARD & SHARED SHELL BEHAVIOR
   Included on: dashboard-manager, dashboard-staff, receipts,
   deliveries, transfers (anything using the sidebar shell).
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  // ---- Route guard: bounce to login if no session ----
  const session = window.StockSenseAuth ? StockSenseAuth.requireAuth() : null;
  if (!session) return;

  // ---- Fill sidebar / topbar with the signed-in user ----
  const initials = (session.user.name || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  document.querySelectorAll(".js-user-name").forEach((el) => (el.textContent = session.user.name));
  document.querySelectorAll(".js-user-role").forEach(
    (el) => (el.textContent = session.user.role === "staff" ? "Warehouse Staff" : "Inventory Manager")
  );
  document.querySelectorAll(".js-user-initials").forEach((el) => (el.textContent = initials));

  // ---- Logout ----
  document.querySelectorAll(".js-logout").forEach((el) =>
    el.addEventListener("click", (e) => {
      e.preventDefault();
      StockSenseAuth.clear();
      window.location.href = "login.html";
    })
  );

  // ---- Mobile sidebar toggle ----
  const menuBtn = document.getElementById("menuBtn");
  const sidebar = document.getElementById("sidebar");
  if (menuBtn && sidebar) {
    menuBtn.addEventListener("click", () => sidebar.classList.toggle("open"));
    document.addEventListener("click", (event) => {
      if (
        window.innerWidth <= 900 &&
        sidebar.classList.contains("open") &&
        !sidebar.contains(event.target) &&
        !menuBtn.contains(event.target)
      ) {
        sidebar.classList.remove("open");
      }
    });
  }

  // ---- Nav active state (only when not already server/page-set) ----
  document.querySelectorAll(".nav-link[data-nav]").forEach((link) => {
    link.addEventListener("click", function (event) {
      if (link.getAttribute("href") && link.getAttribute("href") !== "#") return; // let real links navigate
      event.preventDefault();
      document.querySelectorAll(".nav-link").forEach((item) => item.classList.remove("active"));
      this.classList.add("active");
    });
  });

  // ---- Global search / notification (demo placeholders) ----
  const notification = document.querySelector(".notification");
  if (notification) {
    notification.addEventListener("click", () => alert("You have 6 new inventory notifications."));
  }

  // ---- Operations table search + warehouse/category filters (manager dashboard) ----
  const searchInput = document.getElementById("searchInput");
  const tableRows = document.querySelectorAll("#operationsTable tbody tr");
  function applyFilters() {
    const q = (searchInput ? searchInput.value : "").toLowerCase().trim();
    const warehouse = (document.getElementById("warehouseFilter")?.value || "all").toLowerCase();
    const category = (document.getElementById("categoryFilter")?.value || "all").toLowerCase();
    tableRows.forEach((row) => {
      const text = row.textContent.toLowerCase();
      const matchesSearch = !q || text.includes(q);
      const matchesWarehouse = warehouse === "all" || text.includes(warehouse);
      const matchesCategory = category === "all" || text.includes(category);
      row.style.display = matchesSearch && matchesWarehouse && matchesCategory ? "" : "none";
    });
  }
  if (searchInput) searchInput.addEventListener("input", applyFilters);
  document.getElementById("warehouseFilter")?.addEventListener("change", applyFilters);
  document.getElementById("categoryFilter")?.addEventListener("change", applyFilters);

  // ---- "New Operation" shortcut on the manager dashboard ----
  document.querySelectorAll(".js-new-operation").forEach((btn) =>
    btn.addEventListener("click", () => (window.location.href = "receipts.html"))
  );

  // ---- View all low stock ----
  document.querySelector(".view-btn")?.addEventListener("click", () => {
    alert("Opening all low-stock products...");
  });

  // ---- Pagination (demo only — wire to real paging once the API exists) ----
  document.querySelectorAll(".pagination button").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.disabled || button.classList.contains("page-active")) return;
      document.querySelectorAll(".pagination button").forEach((b) => b.classList.remove("page-active"));
      if (!button.querySelector("i")) button.classList.add("page-active");
    });
  });
});
