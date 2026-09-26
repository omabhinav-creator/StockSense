/* =========================================================
   STOCKSENSE — OPERATIONS PAGE ENGINE
   Shared by receipts.html, deliveries.html, transfers.html so each
   page only has to supply its own data + row/card templates.
   (Not in the original file list — added to avoid copy-pasting the
   same list/kanban/modal/search code three times. Swap for real
   API calls once the backend exists — each TODO marks where.)
========================================================= */
function initOperationsPage(config) {
  const {
    data,                 // array of records, each needs a unique `ref` and a `status`
    statuses,             // e.g. ["draft","waiting","ready","done"]
    statusLabel,          // { draft: "Draft", ... }
    renderRow,            // (record) => "<tr>...</tr>"
    renderCard,           // (record) => "<div class='kanban-card'>...</div>"
    searchMatch,          // (record, query) => boolean
    tableBodyId,
    kanbanId,
    listBtnId,
    kanbanBtnId,
    searchInputId,
    onCycleStatus,        // optional custom status-cycle handler
  } = config;

  const state = { view: "list" };

  function filtered() {
    const input = document.getElementById(searchInputId);
    const q = input ? input.value.trim().toLowerCase() : "";
    if (!q) return data;
    return data.filter((r) => searchMatch(r, q));
  }

  function renderList() {
    const body = document.getElementById(tableBodyId);
    if (!body) return;
    const rows = filtered();
    body.innerHTML = rows.length
      ? rows.map(renderRow).join("")
      : `<tr class="empty-row"><td colspan="6">No records match your search.</td></tr>`;
  }

  function renderKanban() {
    const board = document.getElementById(kanbanId);
    if (!board) return;
    const rows = filtered();
    board.innerHTML = statuses
      .map((st) => {
        const items = rows.filter((r) => r.status === st);
        return `
        <div class="kanban-col">
          <h3>${statusLabel[st]} <span class="kanban-count">${items.length}</span></h3>
          ${items.map(renderCard).join("") || '<div class="kmeta">No records</div>'}
        </div>`;
      })
      .join("");
  }

  function renderAll() {
    renderList();
    renderKanban();
  }

  function cycleStatus(ref) {
    const record = data.find((r) => r.ref === ref);
    if (!record) return;
    if (onCycleStatus) {
      onCycleStatus(record);
    } else {
      const idx = statuses.indexOf(record.status);
      record.status = statuses[(idx + 1) % statuses.length];
    }
    // TODO: PATCH /api/<resource>/:ref { status } once the backend exists
    renderAll();
  }

  function setView(view) {
    state.view = view;
    document.getElementById(listBtnId)?.classList.toggle("active", view === "list");
    document.getElementById(kanbanBtnId)?.classList.toggle("active", view === "kanban");
    document.getElementById(tableBodyId)?.closest(".list-view")?.classList.toggle("hide", view !== "list");
    document.getElementById(kanbanId)?.classList.toggle("show", view === "kanban");
    if (view === "kanban") renderKanban();
  }

  document.getElementById(searchInputId)?.addEventListener("input", renderAll);
  document.getElementById(listBtnId)?.addEventListener("click", () => setView("list"));
  document.getElementById(kanbanBtnId)?.addEventListener("click", () => setView("kanban"));

  renderAll();

  return { renderAll, cycleStatus, addRecord: (r) => { data.push(r); renderAll(); }, data };
}

/* ---- Simple modal open/close helper reused by every "New" button ---- */
function bindModal(overlayId, openBtnId, closeSelector) {
  const overlay = document.getElementById(overlayId);
  if (!overlay) return;
  document.getElementById(openBtnId)?.addEventListener("click", () => overlay.classList.add("show"));
  overlay.querySelectorAll(closeSelector).forEach((el) =>
    el.addEventListener("click", () => overlay.classList.remove("show"))
  );
}
