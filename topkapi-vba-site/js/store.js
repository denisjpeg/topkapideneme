/**
 * Topkapi_VBA — Ortak Veri Katmanı (store.js)
 * ---------------------------------------------------------
 * Bu dosya tüm sitede TEK bir veri kaynağı görevi görür.
 * Etkinlikler ve Formlar, tarayıcının localStorage'ında saklanır.
 * admin.html üzerinden yapılan her ekleme/düzenleme/silme işlemi
 * anında events.html ve forms.html sayfalarına yansır (aynı tarayıcıda).
 *
 * ÖNEMLİ SINIRLAMA:
 * localStorage tarayıcıya/cihaza özeldir; gerçek bir sunucu veritabanı
 * DEĞİLDİR. Yani siz admin panelinden bir etkinlik eklediğinizde bunu
 * yalnızca SİZİN o an kullandığınız tarayıcı görür — sitenizi ziyaret
 * eden başka biri göremez. Canlıya (gerçek ziyaretçilere) yayınlamak için
 * bu store.js'in fonksiyonlarını bir backend'e (Firebase, Supabase,
 * basit bir Node/Express API vb.) bağlamanız gerekir. Sohbetin sonundaki
 * açıklamada bunu adım adım anlattım.
 */

const VBA_KEYS = {
  EVENTS: "vba_events",
  FORMS: "vba_forms",
  SESSION: "vba_admin_session",
};

/* ---------------------------------------------------
   VARSAYILAN (SEED) VERİLER
   Sitenizdeki mevcut statik içerikten üretildi, böylece
   ilk açılışta hiçbir şey kaybolmuyor.
--------------------------------------------------- */
const VBA_SEED_EVENTS = [
  {
    id: "evt-1",
    status: "active", // active | upcoming | past
    title: "Veri Bilimine Giriş Semineri",
    description:
      "Veri bilimi dünyasına ilk adımınızı atın. Temel kavramlar, kariyer yolları ve Topkapi_VBA'nın sunduğu imkanlar.",
    date: "2024-11-15",
    time: "14:00 - 16:00",
    location: "Topkapı Üniversitesi Merkez Kampüs - Konferans Salonu 1",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAdQ-h9xawrkjNnHLYhpHgE31yfrmCzQk-hSpFpun_5lmNSq3YdTwYpo11EJgYw9iRCNuR_rmCBlyhzfsGuFeNygN1zRIFr-4rNY7XR2yaX7u_uagiHWmHUtAqVZvuCPhEbXY5vo39aatdWW4aYi4Je9Sfqtzmf7B450nIpng4UPcg_FoMRba2K0mU1wE5XE9VVCij8MI97fCg3LW6akOlue_8wkB7GuDLOLV8jkFKzZn7_PdSrsKBa7A",
    link: "forms.html",
  },
  {
    id: "evt-2",
    status: "active",
    title: "Python ile Veri Analizi Atölyesi",
    description:
      "Pandas ve NumPy kullanarak gerçek veri setleri üzerinde uygulamalı analiz çalışması.",
    date: "2024-11-18",
    time: "10:00 - 15:00",
    location: "Lab 402 - Bilgisayar Mühendisliği Bölümü",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCPT8wRISh61kDYp6xca7jvX4S8qDa5NprvXo1bV01YybAFOJYLqOJCsZrLudrWJ9hiYS1b0J5mz33TItNmFi7CES0rGjBzAcskmAaR7dS69uZSGAP387pv4Y4yLHf6Uid8CizByxGVPdO5nPot0fBxEP8lT6usuVjaTBRZSIqDUO96qy52fbtXxWr-Gz6rNJ4hUrFWRzIWNKrjINxpb3kCUv41aTomdmLdMn5Ensf4iI6O8ZSiLM0eEg",
    link: "forms.html",
  },
  {
    id: "evt-3",
    status: "upcoming",
    title: "Yapay Zeka & Gelecek Zirvesi",
    description: "Topkapi_VBA'nın yıl sonu büyük etkinliği yakında duyurulacak.",
    date: "2024-12",
    time: "",
    location: "",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCux1pufPackIoPjzQAiedFpqF2cvc7xpxBXJ9EZd7zpElhi05LhXBmDwizsdIai1in4m6U8uf2NLSbIq5ipQ3HFCUoh3MNQJ2zqBhM2WDgtae1IRvP8XGcQ1HcpJaKcub8_kJWOD6NsP66eK1BBRkKQHAQrm11uSrNZN9bj1DsSIkE5Y1l-6LEF2GmHEHHGfZKHI8jaohwpIGE08CMv_5qkkqmPTWXkwYb50nnQ4AWsVkowA7SCR700w",
    link: "",
  },
  {
    id: "evt-4",
    status: "past",
    title: "Kariyer Günleri: Veri Bilimci Olmak",
    description: "Sektör profesyonelleriyle söyleşi.",
    date: "2024-10-10",
    time: "",
    location: "",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCymNN7qbuOgSE2tE0CczQD_gOLrPV_x2aJr-g-Uxh-eIgyZ8NJxSh5HXaRX1rxng-E1Uw9ZxHEeYs8Sp3vvrxYcf1lGLLBCbnHTLwGDPx6yBvnmfKShE7zblH26oanZ8En_eiclTbJR8jbqkw3X8p6UJ_cLicDbFqjTL3gUugMESD_dH-dGTbJ7EUlkfmD4VvSF3l5DrXwTk8LuJWO1f4tgP3xeGPfenApuMv8_vaTMkFiqr04YLJoOw",
    link: "",
  },
  {
    id: "evt-5",
    status: "past",
    title: "Şirket Turu: Veri Ekipleri Yerinde",
    description: "25 Eylül 2024",
    date: "2024-09-25",
    time: "",
    location: "",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA3peVbsRPTnSavjjuDpkzv_shN4enOHf4rgHVw3NSj8gAkVNJ5QgtVX9mmNyjTAj5WIZ9Z9SN9lTGoOp2Z-VIZdnSX5JjNCLXAxea1h6sKSRMTbpcbF2J5AQMluRipBtecVLFZlGx3lELLcn5O3ivzJmpaR1edttQGFRl2lQ4i-YXgHUAvbE35LWXYUG1_vVONc33yDXxVO64_8DpW_yy05cEdWHsrhOr7zcG3Jg0RhLh5zZzg9lQ-Ow",
    link: "",
  },
];

const VBA_SEED_FORMS = [
  {
    id: "frm-1",
    badge: "KAYITLAR AÇIK",
    icon: "group_add",
    title: "Kulübe Üye Ol",
    description:
      "Veri Bilimi ve Analitiği dünyasına adım atmak, temel eğitimlere katılmak ve topluluğumuzun bir parçası olmak için genel üyelik formunu doldurun.",
    url: "#",
  },
  {
    id: "frm-2",
    badge: "KAYITLAR AÇIK",
    icon: "engineering",
    title: "Departman Üyesi Ol",
    description:
      "Kulüp yönetiminde aktif rol almak, projeler geliştirmek ve organizasyon komitelerinde görev almak için departman başvuru formunu doldurun.",
    url: "#",
  },
  {
    id: "frm-3",
    badge: "YAKINDA",
    icon: "event_available",
    title: "Etkinliğe Katıl",
    description:
      "Yaklaşan seminerler, workshoplar ve hackathon etkinliklerimize ön kayıt yaptırarak yerinizi ayırtın.",
    url: "#",
  },
  {
    id: "frm-4",
    badge: "",
    icon: "reviews",
    title: "Etkinlik Değerlendir",
    description:
      "Katıldığınız etkinlikler hakkındaki görüşlerinizi, geri bildirimlerinizi ve önerilerinizi bizimle paylaşarak daha iyisini yapmamıza yardımcı olun.",
    url: "#",
  },
];

/* ---------------------------------------------------
   DÜŞÜK SEVİYE YARDIMCILAR
--------------------------------------------------- */
function vbaRead(key, seed) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(seed));
      return JSON.parse(JSON.stringify(seed));
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Depo okunamadı:", key, e);
    return JSON.parse(JSON.stringify(seed));
  }
}

function vbaWrite(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function vbaUid(prefix) {
  return prefix + "-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

/* ---------------------------------------------------
   ETKİNLİKLER (Events) CRUD
--------------------------------------------------- */
const VbaEvents = {
  getAll() {
    return vbaRead(VBA_KEYS.EVENTS, VBA_SEED_EVENTS);
  },
  save(list) {
    vbaWrite(VBA_KEYS.EVENTS, list);
  },
  add(event) {
    const list = this.getAll();
    list.unshift({ id: vbaUid("evt"), ...event });
    this.save(list);
  },
  update(id, patch) {
    const list = this.getAll().map((e) => (e.id === id ? { ...e, ...patch } : e));
    this.save(list);
  },
  remove(id) {
    const list = this.getAll().filter((e) => e.id !== id);
    this.save(list);
  },
  resetToDefaults() {
    this.save(JSON.parse(JSON.stringify(VBA_SEED_EVENTS)));
  },
};

/* ---------------------------------------------------
   FORMLAR (Forms) CRUD
--------------------------------------------------- */
const VbaForms = {
  getAll() {
    return vbaRead(VBA_KEYS.FORMS, VBA_SEED_FORMS);
  },
  save(list) {
    vbaWrite(VBA_KEYS.FORMS, list);
  },
  add(form) {
    const list = this.getAll();
    list.push({ id: vbaUid("frm"), ...form });
    this.save(list);
  },
  update(id, patch) {
    const list = this.getAll().map((f) => (f.id === id ? { ...f, ...patch } : f));
    this.save(list);
  },
  remove(id) {
    const list = this.getAll().filter((f) => f.id !== id);
    this.save(list);
  },
  resetToDefaults() {
    this.save(JSON.parse(JSON.stringify(VBA_SEED_FORMS)));
  },
};

/* ---------------------------------------------------
   ADMIN OTURUMU (Basit / Sadece İstemci Tarafı)
   ÖNEMLİ: Bu, gerçek bir güvenlik sistemi DEĞİLDİR. Şifre bu dosyanın
   içinde açık şekilde durur ve tarayıcı konsolundan görülebilir.
   Sadece "giriş yapılmış görünümü" ve panel demosu içindir.
   Gerçek kullanım için mutlaka bir backend + gerçek kimlik doğrulama
   (ör. Firebase Auth) kullanın — sohbetin sonunda anlatıyorum.
--------------------------------------------------- */
const VBA_ADMIN_CREDENTIALS = {
  username: "admin@topkapi.edu.tr",
  password: "TopkapiVBA2024!",
};

const VbaAuth = {
  login(username, password) {
    if (
      username.trim().toLowerCase() === VBA_ADMIN_CREDENTIALS.username.toLowerCase() &&
      password === VBA_ADMIN_CREDENTIALS.password
    ) {
      localStorage.setItem(VBA_KEYS.SESSION, JSON.stringify({ user: username, ts: Date.now() }));
      return true;
    }
    return false;
  },
  logout() {
    localStorage.removeItem(VBA_KEYS.SESSION);
  },
  isLoggedIn() {
    return !!localStorage.getItem(VBA_KEYS.SESSION);
  },
  currentUser() {
    try {
      return JSON.parse(localStorage.getItem(VBA_KEYS.SESSION)).user;
    } catch (e) {
      return null;
    }
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
