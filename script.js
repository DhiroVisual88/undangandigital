/* ============================================================
   50th Birthday Celebration — script.js
   All event configuration lives in EVENT_CONFIG below.
   Change values there — nothing else in this file needs editing
   for a routine content update (name, date, venue, bank, etc).
   ============================================================ */

const EVENT_CONFIG = {
  birthdayPerson: "Yenni Alina",              // <-- Replace with the real name
  age: 50,
  date: "2026-09-05",                 // YYYY-MM-DD
  dateDisplay: "5 September 2026",    // Human-readable date shown on the page
  startTime: "18:00",                 // 24h HH:MM, event timezone
  endTime: "21:00",                   // 24h HH:MM, event timezone
  timezoneOffset: "+07:00",           // Asia/Jakarta (WIB, UTC+7) — fixed offset, no DST
  venue: "Bandar Djakarta Alam Sutera | Ruang Bromo",
  address: "Flavor Bliss.3, Jl. Alam Sutera Boulevard Blok Kavling No.6, Pakulonan, Kec. Serpong Utara, Kota Tangerang Selatan, Banten 15325",

  // Gift section
  bankAccount: "1234 5678 9012 (Bank Name — Account Holder Name)", // <-- Replace
  giftAddress: "XXX", // <-- Replace with delivery address, or leave as a note

  // Google integrations — REPLACE these two before going live.
  // 1) appsScriptUrl: paste the "Web app URL" you get after deploying Code.gs
  //    (see google-apps-script/Code.gs and README.md for steps).
  // 2) mapsUrl is generated automatically from `address` below, but you can
  //    hardcode a specific Google Maps place URL here instead if you prefer.
  appsScriptUrl: "https://script.google.com/macros/s/AKfycbw-gKA17CwcKGCMV8ubdPcBso3h1_b8S7S-x1Yu-idsW7IbDVJp2APGCqNjd6k99siJ9w/exec",
  mapsUrl: "" // leave blank to auto-generate from the address
};

// ---------- Derived helpers ----------
function buildMapsUrl(){
  if (EVENT_CONFIG.mapsUrl) return EVENT_CONFIG.mapsUrl;
  const query = encodeURIComponent(`${EVENT_CONFIG.venue}, ${EVENT_CONFIG.address}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

function buildCalendarUrl(){
  const fmt = (dateStr, timeStr) => {
    // Returns UTC timestamp in YYYYMMDDTHHMMSSZ from a WIB (+07:00) local time
    const iso = `${dateStr}T${timeStr}:00${EVENT_CONFIG.timezoneOffset}`;
    const d = new Date(iso);
    return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  };
  const start = fmt(EVENT_CONFIG.date, EVENT_CONFIG.startTime);
  const end = fmt(EVENT_CONFIG.date, EVENT_CONFIG.endTime);

  const title = `50th Birthday Celebration – ${EVENT_CONFIG.birthdayPerson}`;
  const details = `Join us as we celebrate the 50th birthday of ${EVENT_CONFIG.birthdayPerson}. We would be delighted to have you with us for this special celebration.`;
  const location = `${EVENT_CONFIG.venue}, ${EVENT_CONFIG.address}`;

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${start}/${end}`,
    details: details,
    location: location
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function getEventDateUTC(){
  const iso = `${EVENT_CONFIG.date}T${EVENT_CONFIG.startTime}:00${EVENT_CONFIG.timezoneOffset}`;
  return new Date(iso);
}

// ---------- Apply configuration to the DOM ----------
function applyConfigToDOM(){
  document.querySelectorAll('[data-field="birthdayPerson"]').forEach(el => {
    el.textContent = EVENT_CONFIG.birthdayPerson;
  });
  document.querySelectorAll('[data-field="dateDisplay"]').forEach(el => {
    el.textContent = EVENT_CONFIG.dateDisplay;
  });
  document.querySelectorAll('[data-field="venue"]').forEach(el => {
    el.textContent = EVENT_CONFIG.venue;
  });
  document.querySelectorAll('[data-field="address"]').forEach(el => {
    el.textContent = EVENT_CONFIG.address;
  });
  document.querySelectorAll('[data-field="bankAccount"]').forEach(el => {
    el.textContent = EVENT_CONFIG.bankAccount;
  });
  document.querySelectorAll('[data-field="giftAddress"]').forEach(el => {
    el.textContent = EVENT_CONFIG.giftAddress;
  });

  document.title = `50th Birthday Celebration — ${EVENT_CONFIG.birthdayPerson}`;

  const mapsLink = document.getElementById("mapsLink");
  if (mapsLink) mapsLink.href = buildMapsUrl();
}

// ---------- Opening cover ----------
function initCover(){
  const cover = document.getElementById("cover");
  const openBtn = document.getElementById("openInvitation");
  const main = document.getElementById("mainContent");

  openBtn.addEventListener("click", () => {
    cover.classList.add("is-leaving");
    main.hidden = false;
    document.body.style.overflow = "";

    // Attempt to start music after this direct user gesture
    tryStartMusic();

    setTimeout(() => {
      cover.style.display = "none";
      main.scrollIntoView({ behavior: "smooth", block: "start" });
      initScrollReveal();
    }, 650);
  }, { once: true });
}

// ---------- Countdown ----------
function initCountdown(){
  const target = getEventDateUTC().getTime();
  const elDays = document.getElementById("cd-days");
  const elHours = document.getElementById("cd-hours");
  const elMinutes = document.getElementById("cd-minutes");
  const elSeconds = document.getElementById("cd-seconds");
  const countdownEl = document.getElementById("countdown");
  const endedEl = document.getElementById("countdownEnded");

  function pad(n){ return String(n).padStart(2, "0"); }

  function tick(){
    const now = Date.now();
    const diff = target - now;

    if (diff <= 0){
      countdownEl.hidden = true;
      endedEl.hidden = false;
      clearInterval(timer);
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    elDays.textContent = pad(days);
    elHours.textContent = pad(hours);
    elMinutes.textContent = pad(minutes);
    elSeconds.textContent = pad(seconds);
  }

  tick();
  const timer = setInterval(tick, 1000);
}

// ---------- Save the Date (Google Calendar) ----------
function initSaveDate(){
  const btn = document.getElementById("saveDateBtn");
  btn.addEventListener("click", () => {
    window.open(buildCalendarUrl(), "_blank", "noopener,noreferrer");
  });
}

// ---------- RSVP form ----------
function sanitizeText(str){
  // Basic HTML-escaping so any later rendering of guest text can't inject markup.
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function initRsvpForm(){
  const form = document.getElementById("rsvpForm");
  const guestCountInput = document.getElementById("guestCount");
  const messageInput = document.getElementById("message");
  const charCount = document.getElementById("charCount");
  const errorEl = document.getElementById("rsvpError");
  const successEl = document.getElementById("rsvpSuccess");
  const submitBtn = document.getElementById("submitRsvp");
  const btnText = submitBtn.querySelector(".btn-text");
  const btnSpinner = submitBtn.querySelector(".btn-spinner");

  // Toggle guest count based on attendance
  form.querySelectorAll('input[name="attendance"]').forEach(radio => {
    radio.addEventListener("change", (e) => {
      if (e.target.value === "Not Attending"){
        guestCountInput.value = 0;
        guestCountInput.disabled = true;
      } else {
        guestCountInput.disabled = false;
        if (Number(guestCountInput.value) < 1) guestCountInput.value = 1;
      }
    });
  });

  messageInput.addEventListener("input", () => {
    charCount.textContent = messageInput.value.length;
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorEl.hidden = true;

    const fullName = form.fullName.value.trim();
    const attendance = form.attendance.value;
    const guestCount = attendance === "Not Attending" ? 0 : Number(guestCountInput.value || 1);
    const message = messageInput.value.trim();

    // Client-side validation
    if (!fullName){
      showError("Please enter your full name.");
      return;
    }
    if (fullName.length > 100){
      showError("Name must be 100 characters or fewer.");
      return;
    }
    if (message.length > 500){
      showError("Message must be 500 characters or fewer.");
      return;
    }
    if (attendance === "Attending" && (guestCount < 1 || guestCount > 10 || !Number.isFinite(guestCount))){
      showError("Please enter a valid number of guests (1–10).");
      return;
    }

    setLoading(true);

    const payload = {
      fullName,
      attendance,
      guestCount,
      message
    };

    try {
      if (!EVENT_CONFIG.appsScriptUrl || EVENT_CONFIG.appsScriptUrl.includes("PASTE_YOUR")){
        throw new Error("RSVP endpoint is not configured yet.");
      }

      const res = await fetch(EVENT_CONFIG.appsScriptUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" }, // avoids CORS preflight on Apps Script
        body: JSON.stringify(payload)
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.status === "error"){
        throw new Error(data.message || "Something went wrong. Please try again.");
      }

      form.hidden = true;
      successEl.hidden = false;

      // Optimistically prepend the wish to the list if one was written
      if (message){
        prependWish({ name: fullName, message, timestamp: new Date().toISOString() });
      }

    } catch (err){
      showError(err.message || "We couldn't send your RSVP. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  });

  function showError(msg){
    errorEl.textContent = msg;
    errorEl.hidden = false;
  }

  function setLoading(isLoading){
    submitBtn.disabled = isLoading;
    btnText.hidden = isLoading;
    btnSpinner.hidden = !isLoading;
  }
}

// ---------- Birthday wishes ----------
function formatWishDate(iso){
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch { return ""; }
}

function renderWishCard(wish){
  const card = document.createElement("div");
  card.className = "wish-card";

  const nameEl = document.createElement("p");
  nameEl.className = "wish-name";
  nameEl.textContent = wish.name || "A Guest"; // textContent = safe, no injection

  const msgEl = document.createElement("p");
  msgEl.className = "wish-message";
  msgEl.textContent = `"${wish.message}"`;

  card.appendChild(nameEl);
  card.appendChild(msgEl);
  return card;
}

function prependWish(wish){
  const list = document.getElementById("wishesList");
  const loading = document.getElementById("wishesLoading");
  if (loading) loading.remove();
  const emptyMsg = list.querySelector(".wishes-empty");
  if (emptyMsg) emptyMsg.remove();
  list.prepend(renderWishCard(wish));
}

async function loadWishes(){
  const list = document.getElementById("wishesList");

  try {
    if (!EVENT_CONFIG.appsScriptUrl || EVENT_CONFIG.appsScriptUrl.includes("PASTE_YOUR")){
      throw new Error("not configured");
    }

    const res = await fetch(`${EVENT_CONFIG.appsScriptUrl}?action=wishes`, { method: "GET" });
    const data = await res.json();

    list.innerHTML = "";

    const wishes = Array.isArray(data.wishes) ? data.wishes : [];

    if (wishes.length === 0){
      const empty = document.createElement("p");
      empty.className = "wishes-empty";
      empty.textContent = "Be the first to leave a birthday wish!";
      list.appendChild(empty);
      return;
    }

    // Newest first — Apps Script also sorts, but we guard here too
    wishes
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .forEach(w => list.appendChild(renderWishCard(w)));

  } catch (err){
    list.innerHTML = "";
    const empty = document.createElement("p");
    empty.className = "wishes-empty";
    empty.textContent = "Wishes will appear here once the RSVP form is connected.";
    list.appendChild(empty);
  }
}

// ---------- Gift copy button ----------
function initCopyButton(){
  const btn = document.getElementById("copyAccountBtn");
  const confirmEl = document.getElementById("copyConfirm");
  const accountEl = document.getElementById("accountNumber");

  btn.addEventListener("click", async () => {
    const text = accountEl.textContent.trim();
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for older browsers
      const temp = document.createElement("textarea");
      temp.value = text;
      temp.style.position = "fixed";
      temp.style.opacity = "0";
      document.body.appendChild(temp);
      temp.select();
      document.execCommand("copy");
      document.body.removeChild(temp);
    }
    confirmEl.hidden = false;
    setTimeout(() => { confirmEl.hidden = true; }, 2500);
  });
}

// ---------- Music ----------
function tryStartMusic(){
  const audio = document.getElementById("bgMusic");
  const btn = document.getElementById("musicToggle");
  audio.play().then(() => {
    btn.classList.add("is-playing");
    btn.setAttribute("aria-pressed", "true");
    btn.setAttribute("aria-label", "Pause background music");
  }).catch(() => {
    // Autoplay blocked — user can press the button manually
  });
}

function initMusicButton(){
  const audio = document.getElementById("bgMusic");
  const btn = document.getElementById("musicToggle");

  btn.addEventListener("click", () => {
    if (audio.paused){
      audio.play().then(() => {
        btn.classList.add("is-playing");
        btn.setAttribute("aria-pressed", "true");
        btn.setAttribute("aria-label", "Pause background music");
      }).catch(() => {});
    } else {
      audio.pause();
      btn.classList.remove("is-playing");
      btn.setAttribute("aria-pressed", "false");
      btn.setAttribute("aria-label", "Play background music");
    }
  });
}

// ---------- Scroll reveal ----------
function initScrollReveal(){
  const reveals = document.querySelectorAll("[data-reveal]");
  if (!("IntersectionObserver" in window)){
    reveals.forEach(el => el.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });

  reveals.forEach(el => observer.observe(el));
}

// ---------- Init ----------
document.addEventListener("DOMContentLoaded", () => {
  applyConfigToDOM();
  initCover();
  initCountdown();
  initSaveDate();
  initRsvpForm();
  initCopyButton();
  initMusicButton();
  loadWishes();

  document.body.style.overflow = "hidden"; // lock scroll behind the cover
});
// Fitur Nama Tamu Otomatis dari URL
document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const nameFromUrl = urlParams.get('to');
    
    if (nameFromUrl) {
        document.getElementById('guest-name').innerText = nameFromUrl;
    }
});
