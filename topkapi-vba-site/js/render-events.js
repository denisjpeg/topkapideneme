/**
 * events.html sayfasındaki kartları js/store.js'teki verilerden üretir.
 * Admin girişi yapılmışsa her kartın altında "Düzenle / Sil" butonları çıkar.
 */
(function () {
  const grid = document.getElementById("vba-events-grid");
  const empty = document.getElementById("vba-events-empty");
  const heading = document.getElementById("vba-events-heading");
  const tabs = document.querySelectorAll("#vba-event-tabs .vba-tab");

  const HEADINGS = {
    active: "Aktif Kayıt",
    upcoming: "Yaklaşan Etkinlikler",
    past: "Geçmiş Etkinlikler",
  };

  let currentFilter = "active";

  function setActiveTab(filter) {
    tabs.forEach((t) => {
      const isActive = t.dataset.filter === filter;
      t.classList.toggle("text-brand-primary", isActive);
      t.classList.toggle("border-b-2", isActive);
      t.classList.toggle("border-brand-primary", isActive);
      t.classList.toggle("text-on-surface-variant", !isActive);
    });
  }

  function cardHTML(evt) {
    const isAdmin = window.VbaAuth && VbaAuth.isLoggedIn();
    const meta = [];
    if (evt.date) meta.push(`<div class="flex items-center gap-2"><span class="material-symbols-outlined text-base">calendar_today</span> ${vbaFormatDate(evt.date)}</div>`);
    if (evt.time) meta.push(`<div class="flex items-center gap-2"><span class="material-symbols-outlined text-base">schedule</span> ${evt.time}</div>`);
    if (evt.location) meta.push(`<div class="flex items-center gap-2 col-span-2"><span class="material-symbols-outlined text-base">location_on</span> ${evt.location}</div>`);

    const ctaHref = evt.link && evt.link !== "" ? evt.link : "forms.html";
    const cta = evt.status === "upcoming"
      ? `<button class="w-full mt-4 bg-surface-variant text-on-surface-variant font-label-md py-3 rounded-lg cursor-not-allowed flex justify-center items-center gap-2 border border-outline-variant/50" disabled>Kayıtlar Açılmadı</button>`
      : `<a href="${ctaHref}" class="w-full mt-4 bg-brand-primary text-white font-label-md py-3 rounded-lg hover:bg-opacity-90 transition-all flex justify-center items-center gap-2">
          ${evt.status === "past" ? "Etkinliği Değerlendir" : "Etkinliğe Katıl"} <span class="material-symbols-outlined">arrow_forward</span>
        </a>`;

    const adminBar = isAdmin
      ? `<div class="flex gap-2 mt-3 pt-3 border-t border-outline-variant/30">
          <button class="vba-edit-evt flex-1 border border-outline-variant text-on-surface-variant text-xs py-2 rounded hover:bg-surface-container-highest" data-id="${evt.id}">✏️ Düzenle</button>
          <button class="vba-del-evt flex-1 border border-red-400/40 text-red-300 text-xs py-2 rounded hover:bg-red-500/10" data-id="${evt.id}">🗑️ Sil</button>
        </div>`
      : "";

    return `
      <article class="bg-brand-surface rounded-lg overflow-hidden border border-[#52526c] shadow-lg flex flex-col">
        <div class="w-full h-48 bg-cover bg-center" style="background-image: url('${evt.image || ""}')"></div>
        <div class="p-md flex flex-col flex-grow space-y-4">
          <div>
            <h3 class="font-subheading text-subheading text-white mb-2">${evt.title}</h3>
            <p class="font-body-md text-body-md text-on-surface-variant line-clamp-2">${evt.description || ""}</p>
          </div>
          ${meta.length ? `<div class="grid grid-cols-2 gap-2 mt-auto pt-4 border-t border-[#52526c]/50 font-data-caption text-data-caption text-on-surface-variant">${meta.join("")}</div>` : ""}
          ${cta}
          ${adminBar}
        </div>
      </article>`;
  }

  function render() {
    const all = VbaEvents.getAll();
    const filtered = all.filter((e) => e.status === currentFilter);
    heading.textContent = HEADINGS[currentFilter];
    grid.innerHTML = filtered.map(cardHTML).join("");
    empty.classList.toggle("hidden", filtered.length > 0);
    setActiveTab(currentFilter);

    // Admin aksiyonları
    grid.querySelectorAll(".vba-del-evt").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (confirm("Bu etkinliği silmek istediğinize emin misiniz?")) {
          VbaEvents.remove(btn.dataset.id);
          render();
        }
      });
    });
    grid.querySelectorAll(".vba-edit-evt").forEach((btn) => {
      btn.addEventListener("click", () => {
        window.location.href = "admin.html#etkinlik-" + btn.dataset.id;
      });
    });
  }

  tabs.forEach((t) => {
    t.addEventListener("click", () => {
      currentFilter = t.dataset.filter;
      render();
    });
  });

  document.addEventListener("DOMContentLoaded", render);
  if (document.readyState !== "loading") render();
})();
