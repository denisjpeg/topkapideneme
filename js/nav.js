/**
 * Topkapi_VBA — Ortak Menü / Footer Katmanı (js/nav.js)
 * ---------------------------------------------------------
 * TEK KAYNAK (single source of truth): sitedeki tüm sayfa bağlantıları
 * (üst menü + alt bilgi/footer) burada tanımlıdır. Yeni bir sayfa
 * eklemek, bir linki değiştirmek ya da sırasını güncellemek istersen
 * SADECE bu dosyayı düzenlemen yeterli — her HTML dosyasını tek tek
 * açmana gerek kalmaz.
 *
 * Her HTML sayfası şunları içerir:
 *   <div id="vba-header"></div>   <script src="/js/nav.js"></script>
 *   ... sayfa içeriği (değişmedi) ...
 *   <div id="vba-footer"></div>
 *
 * nav.js, sayfa yüklendiğinde bu iki boş kutuyu bulup içini doldurur
 * ve geçerli sayfayı menüde otomatik olarak vurgular (aktif sekme).
 */

const VBA_NAV_LINKS = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/hakkimizda/", label: "Hakkımızda" },
  { href: "/etkinlikler/", label: "Etkinlikler" },
  { href: "/form/", label: "Formlar" },
  { href: "/sponsorlar/", label: "Sponsorlar" },
  { href: "/iletisim/", label: "İletişim" },
];

const VBA_ADMIN_LINK = { href: "/yonetim/", label: "Yönetim Paneli" };

const VBA_FOOTER_EXTRA_LINKS = [
  { href: "/gizlilik/", label: "Gizlilik Politikası" },
  { href: "/kosullar/", label: "Kullanım Koşulları" },
];

const VBA_CTA_LINK = { href: "/form/", label: "Kulübe Üye Ol" };

/* ---------------------------------------------------
   Geçerli sayfayı belirle (dosya adına göre)
--------------------------------------------------- */
function vbaCurrentPage() {
  const path = window.location.pathname.split("/").pop();
  return path === "" ? "/" : path;
}

/* ---------------------------------------------------
   HEADER
--------------------------------------------------- */
function vbaRenderHeader() {
  const current = vbaCurrentPage();

  const desktopLinks = VBA_NAV_LINKS.map((link) => {
    const isActive = link.href === current;
    const cls = isActive
      ? "text-[#94b4ff] font-bold border-b-2 border-[#5072BA] pb-1"
      : "text-[#c8c5cc] hover:text-[#94b4ff] transition-colors pb-1 border-b-2 border-transparent";
    return `<a class="${cls} font-medium text-sm whitespace-nowrap" href="${link.href}">${link.label}</a>`;
  }).join("\n");

  const mobileLinks = VBA_NAV_LINKS.concat([VBA_ADMIN_LINK]).map((link) => {
    const isActive = link.href === current;
    const cls = isActive
      ? "block px-4 py-3 rounded-lg bg-[#1d448a]/30 text-[#94b4ff] font-bold"
      : "block px-4 py-3 rounded-lg text-[#c8c5cc] hover:bg-[#282a2b] transition-colors";
    return `<a class="${cls}" href="${link.href}">${link.label}</a>`;
  }).join("\n");

  const adminActive = current === VBA_ADMIN_LINK.href;

  return `
<header class="bg-[#1D1D29] border-b border-[#47464c] shadow-sm sticky top-0 z-50 w-full">
  <div class="flex justify-between items-center h-20 px-4 md:px-10 max-w-7xl mx-auto">
    <a class="flex items-center gap-2 shrink-0" href="/">
      <span class="w-9 h-9 rounded-full bg-[#5072BA] flex items-center justify-center text-white text-xs font-bold">VBA</span>
      <span class="font-bold text-lg text-[#e1e3e4] tracking-tight">Topkapi_VBA</span>
    </a>

    <nav class="hidden md:flex items-center gap-7 mx-6">
      ${desktopLinks}
    </nav>

    <div class="hidden md:flex items-center gap-3 shrink-0">
      <a href="${VBA_ADMIN_LINK.href}"
         class="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border transition-colors ${adminActive ? "border-[#5072BA] text-[#94b4ff] bg-[#1d448a]/20" : "border-[#47464c] text-[#c8c5cc] hover:border-[#5072BA] hover:text-[#94b4ff]"}">
        <span class="material-symbols-outlined text-[16px]">admin_panel_settings</span>
        ${VBA_ADMIN_LINK.label}
      </a>
      <a href="${VBA_CTA_LINK.href}" class="bg-[#5072BA] text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-opacity-90 transition-all">
        ${VBA_CTA_LINK.label}
      </a>
    </div>

    <button id="vba-mobile-toggle" class="md:hidden text-[#e1e3e4]" aria-label="Menüyü aç/kapat">
      <span class="material-symbols-outlined">menu</span>
    </button>
  </div>

  <div id="vba-mobile-panel" class="hidden md:hidden border-t border-[#47464c] bg-[#1D1D29] px-4 py-3 space-y-1">
    ${mobileLinks}
    <a href="${VBA_CTA_LINK.href}" class="block mt-2 text-center bg-[#5072BA] text-white text-sm font-semibold px-5 py-3 rounded-lg">
      ${VBA_CTA_LINK.label}
    </a>
  </div>
</header>`;
}

/* ---------------------------------------------------
   FOOTER
--------------------------------------------------- */
function vbaRenderFooter() {
  const allLinks = VBA_NAV_LINKS.filter((l) => l.href !== "/")
    .concat(VBA_FOOTER_EXTRA_LINKS)
    .concat([VBA_ADMIN_LINK]);

  const linkHTML = allLinks
    .map(
      (link) =>
        `<a class="text-[#c8c5cc] hover:text-[#94b4ff] transition-colors" href="${link.href}">${link.label}</a>`
    )
    .join("\n");

  return `
<footer class="bg-[#0c0f10] border-t border-[#47464c] w-full mt-auto">
  <div class="flex flex-col md:flex-row justify-between items-center py-8 px-4 md:px-10 max-w-7xl mx-auto gap-6">
    <a href="/" class="flex items-center gap-2 shrink-0">
      <span class="w-8 h-8 rounded-full bg-[#5072BA] flex items-center justify-center text-white text-xs font-bold">VBA</span>
      <span class="font-bold text-base text-[#c7c5d5]">Topkapi_VBA</span>
    </a>
    <nav class="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
      ${linkHTML}
    </nav>
    <div class="text-xs text-[#929096] text-center md:text-right shrink-0 space-y-1">
      <div>© ${new Date().getFullYear()} Topkapi_VBA. Tüm Hakları Saklıdır.</div>
      <div>Powered by <a href="https://denizaltny.com" target="_blank" rel="noopener" class="text-[#94b4ff] hover:underline">Deniz</a></div>
    </div>
  </div>
</footer>`;
}

/* ---------------------------------------------------
   Sayfaya yerleştir
--------------------------------------------------- */
function vbaInitNav() {
  const headerMount = document.getElementById("vba-header");
  const footerMount = document.getElementById("vba-footer");

  if (headerMount) headerMount.outerHTML = vbaRenderHeader();
  if (footerMount) footerMount.outerHTML = vbaRenderFooter();

  const toggle = document.getElementById("vba-mobile-toggle");
  const panel = document.getElementById("vba-mobile-panel");
  if (toggle && panel) {
    toggle.addEventListener("click", () => panel.classList.toggle("hidden"));
  }
}

document.addEventListener("DOMContentLoaded", vbaInitNav);
if (document.readyState !== "loading") vbaInitNav();
