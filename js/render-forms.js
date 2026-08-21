/**
 * forms.html sayfasındaki form kartlarını Supabase'teki verilerden üretir.
 * Admin girişi yapılmışsa her kartın altında "Düzenle / Sil" butonları çıkar.
 */
(function () {
  const grid = document.getElementById("vba-forms-grid");
  const empty = document.getElementById("vba-forms-empty");

  function cardHTML(form) {
    const isAdmin = window.VbaAuth && VbaAuth.isLoggedIn();
    const badge = form.badge
      ? `<div class="absolute top-0 right-0 bg-secondary/10 px-sm py-xs rounded-bl-lg border-b border-l border-outline-variant">
           <span class="font-label-md text-label-md text-secondary">${form.badge}</span>
         </div>`
      : "";

    const adminBar = isAdmin
      ? `<div class="flex gap-2 mt-3 pt-3 border-t border-outline-variant/30">
          <button class="vba-edit-frm flex-1 border border-outline-variant text-on-surface-variant text-xs py-2 rounded hover:bg-surface-container-highest" data-id="${form.id}">✏️ Düzenle</button>
          <button class="vba-del-frm flex-1 border border-red-400/40 text-red-300 text-xs py-2 rounded hover:bg-red-500/10" data-id="${form.id}">🗑️ Sil</button>
        </div>`
      : "";

    return `
      <div class="bg-tertiary-graphite rounded-lg p-md border border-outline-variant flex flex-col relative overflow-hidden group hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)] transition-shadow">
        ${badge}
        <div class="flex items-center gap-sm mb-md mt-sm">
          <span class="material-symbols-outlined text-[32px] text-analytic-blue bg-primary-container p-sm rounded-lg border border-outline-variant" style="font-variation-settings: 'FILL' 1;">${form.icon || "description"}</span>
          <h2 class="font-subheading text-subheading text-on-surface">${form.title}</h2>
        </div>
        <p class="font-body-md text-body-md text-on-surface-variant mb-xl flex-grow">${form.description || ""}</p>
        <a href="${form.url || "#"}" target="${form.url && form.url.startsWith("http") ? "_blank" : "_self"}" rel="noopener"
           class="w-full bg-analytic-blue text-surface-white font-label-md text-label-md rounded-lg py-sm px-md hover:bg-opacity-90 transition-colors flex justify-center items-center gap-sm border border-tertiary-graphite">
          Forma Git <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
        </a>
        ${adminBar}
      </div>`;
  }

  async function render() {
    const all = await VbaForms.getAll();
    grid.innerHTML = all.map(cardHTML).join("");
    empty.classList.toggle("hidden", all.length > 0);

    grid.querySelectorAll(".vba-del-frm").forEach((btn) => {
      btn.addEventListener("click", async () => {
        if (confirm("Bu formu silmek istediğinize emin misiniz?")) {
          await VbaForms.remove(btn.dataset.id);
          render();
        }
      });
    });
    grid.querySelectorAll(".vba-edit-frm").forEach((btn) => {
      btn.addEventListener("click", () => {
        window.location.href = "/yonetim/#form-" + btn.dataset.id;
      });
    });
  }

  async function init() {
    if (window.VbaAuthReady) await window.VbaAuthReady;
    render();
  }

  document.addEventListener("DOMContentLoaded", init);
  if (document.readyState !== "loading") init();
  document.addEventListener("vba-auth-changed", render);
})();
