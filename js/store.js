/**
 * Topkapi_VBA — Ortak Veri Katmanı (store.js) — Supabase sürümü
 * ---------------------------------------------------------------
 * Bu dosya artık tüm sitede TEK bir GERÇEK veri kaynağına (Supabase)
 * bağlanır. admin.html üzerinden yapılan her ekleme/düzenleme/silme
 * işlemi, siteyi ziyaret eden HERKESE anında yansır — tarayıcıya/
 * cihaza özel değildir (eski localStorage sürümünün aksine).
 *
 * Kimlik doğrulama artık gerçek Supabase Auth üzerinden yapılır.
 * Admin hesabını Supabase Dashboard > Authentication > Users
 * bölümünden oluşturman/yönetmen gerekir (bkz. sohbetteki kurulum
 * talimatları). Şifre bu dosyanın içinde ASLA açık şekilde durmaz.
 */

const VBA_SUPABASE_URL = "https://ctylunepwplrvblmcusb.supabase.co";
const VBA_SUPABASE_KEY = "sb_publishable_LVo1X2IK2BA2Xmocgd2bMQ_hGtjWG4A";

const vbaSupabase = window.supabase.createClient(VBA_SUPABASE_URL, VBA_SUPABASE_KEY, {
  auth: {
    // Oturum tarayıcıda kalıcı tutulmasın: admin.html'e her girişte
    // (sayfa yenilense, sekme kapatılıp açılsa bile) şifre yeniden istensin.
    persistSession: false,
  },
});

/* ---------------------------------------------------
   OTURUM DURUMU
   vbaSession senkron okunabilsin diye bellekte tutulur.
   VbaAuthReady, ilk oturum bilgisi yüklenene kadar beklemek
   isteyen sayfalar (render-events.js, render-forms.js, admin.html)
   için bir Promise sağlar.
--------------------------------------------------- */
let vbaSession = null;

window.VbaAuthReady = vbaSupabase.auth.getSession().then(({ data }) => {
  vbaSession = data.session;
});

vbaSupabase.auth.onAuthStateChange((_event, session) => {
  vbaSession = session;
  document.dispatchEvent(new CustomEvent("vba-auth-changed"));
});

/* ---------------------------------------------------
   Veritabanı satırı <-> site genelinde kullanılan obje şekli
--------------------------------------------------- */
function vbaMapEventRow(row) {
  return {
    id: row.id,
    status: row.status,
    title: row.title,
    description: row.description,
    date: row.event_date,
    time: row.event_time,
    location: row.location,
    image: row.image,
    link: row.link,
  };
}

function vbaMapFormRow(row) {
  return {
    id: row.id,
    badge: row.badge,
    icon: row.icon,
    title: row.title,
    description: row.description,
    url: row.url,
  };
}

/* ---------------------------------------------------
   ETKİNLİKLER (Events) CRUD — Supabase
--------------------------------------------------- */
const VbaEvents = {
  async getAll() {
    const { data, error } = await vbaSupabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Etkinlikler okunamadı:", error);
      return [];
    }
    return data.map(vbaMapEventRow);
  },
  async add(event) {
    const { error } = await vbaSupabase.from("events").insert({
      status: event.status,
      title: event.title,
      description: event.description || "",
      event_date: event.date || "",
      event_time: event.time || "",
      location: event.location || "",
      image: event.image || "",
      link: event.link || "",
    });
    if (error) console.error("Etkinlik eklenemedi:", error);
    return !error;
  },
  async update(id, patch) {
    const row = {};
    if ("status" in patch) row.status = patch.status;
    if ("title" in patch) row.title = patch.title;
    if ("description" in patch) row.description = patch.description;
    if ("date" in patch) row.event_date = patch.date;
    if ("time" in patch) row.event_time = patch.time;
    if ("location" in patch) row.location = patch.location;
    if ("image" in patch) row.image = patch.image;
    if ("link" in patch) row.link = patch.link;
    const { error } = await vbaSupabase.from("events").update(row).eq("id", id);
    if (error) console.error("Etkinlik güncellenemedi:", error);
    return !error;
  },
  async remove(id) {
    const { error } = await vbaSupabase.from("events").delete().eq("id", id);
    if (error) console.error("Etkinlik silinemedi:", error);
    return !error;
  },
};

/* ---------------------------------------------------
   FORMLAR (Forms) CRUD — Supabase
--------------------------------------------------- */
const VbaForms = {
  async getAll() {
    const { data, error } = await vbaSupabase
      .from("forms")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) {
      console.error("Formlar okunamadı:", error);
      return [];
    }
    return data.map(vbaMapFormRow);
  },
  async add(form) {
    const { error } = await vbaSupabase.from("forms").insert({
      badge: form.badge || "",
      icon: form.icon || "description",
      title: form.title,
      description: form.description || "",
      url: form.url || "#",
    });
    if (error) console.error("Form eklenemedi:", error);
    return !error;
  },
  async update(id, patch) {
    const row = {};
    if ("badge" in patch) row.badge = patch.badge;
    if ("icon" in patch) row.icon = patch.icon;
    if ("title" in patch) row.title = patch.title;
    if ("description" in patch) row.description = patch.description;
    if ("url" in patch) row.url = patch.url;
    const { error } = await vbaSupabase.from("forms").update(row).eq("id", id);
    if (error) console.error("Form güncellenemedi:", error);
    return !error;
  },
  async remove(id) {
    const { error } = await vbaSupabase.from("forms").delete().eq("id", id);
    if (error) console.error("Form silinemedi:", error);
    return !error;
  },
};

/* ---------------------------------------------------
   ADMIN OTURUMU — Gerçek Supabase Auth (e-posta + şifre)
--------------------------------------------------- */
const VbaAuth = {
  async login(email, password) {
    const { data, error } = await vbaSupabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error("Giriş başarısız:", error.message);
      return false;
    }
    vbaSession = data.session;
    return true;
  },
  async logout() {
    await vbaSupabase.auth.signOut();
    vbaSession = null;
  },
  isLoggedIn() {
    return !!vbaSession;
  },
  currentUser() {
    return vbaSession && vbaSession.user ? vbaSession.user.email : null;
  },
};

/* Herkese açık: küçük tarih biçimlendirici (tr-TR) */
function vbaFormatDate(isoLike) {
  if (!isoLike) return "";
  const parts = isoLike.split("-");
  const months = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
  ];
  if (parts.length === 3) {
    const [y, m, d] = parts;
    return `${parseInt(d, 10)} ${months[parseInt(m, 10) - 1]} ${y}`;
  }
  if (parts.length === 2) {
    const [y, m] = parts;
    return `${months[parseInt(m, 10) - 1]} ${y}`;
  }
  return isoLike;
}
