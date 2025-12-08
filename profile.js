document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("profile-form");
  const savedBadge = document.getElementById("profile-saved");

  const fullNameInput = document.getElementById("fullName");
  const tgUsernameInput = document.getElementById("tgUsername");
  const channelLinkInput = document.getElementById("channelLink");
  const companyInput = document.getElementById("company");
  const notesInput = document.getElementById("notes");

  // Элементы "view"-карточки
  const viewFullName = document.getElementById("view-fullName");
  const viewUsername = document.getElementById("view-username");
  const viewChannel = document.getElementById("view-channel");
  const viewCompany = document.getElementById("view-company");
  const viewTgId = document.getElementById("view-tg-id");
  const viewAvatar = document.getElementById("view-avatar");

  // Пытаемся достать данные из Telegram WebApp (если запущено внутри ТГ)
  function getTelegramUser() {
    try {
      const tg = window.Telegram && window.Telegram.WebApp;
      if (!tg || !tg.initDataUnsafe || !tg.initDataUnsafe.user) return null;

      const u = tg.initDataUnsafe.user;
      return {
        tgUserId: u.id,
        tgUsername: u.username ? `@${u.username}` : "",
        fullName: [u.first_name, u.last_name].filter(Boolean).join(" "),
      };
    } catch (e) {
      console.warn("Telegram WebApp user not available", e);
      return null;
    }
  }

  // Обновление карточки "view"
  function updateProfileView(profile) {
    const {
      fullName,
      tgUsername,
      channelLink,
      company,
      tgUserId,
    } = profile;

    if (viewFullName) {
      viewFullName.textContent = fullName || "Клиент VORTEX";
    }

    if (viewUsername) {
      viewUsername.textContent = tgUsername || "@username";
    }

    if (viewChannel) {
      viewChannel.textContent = channelLink || "не указан";
    }

    if (viewCompany) {
      viewCompany.textContent = company || "не указано";
    }

    if (viewTgId) {
      viewTgId.textContent = tgUserId
        ? `Telegram ID: ${tgUserId}`
        : "Telegram ID: —";
    }

    if (viewAvatar) {
      // Инициалы из имени или "VA"
      const base = fullName || "Vortex Agency";
      const initials = base
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase())
        .join("");

      viewAvatar.textContent = initials || "VA";
    }
  }

  // Загружаем профиль из localStorage + Telegram
  let profile = {
    fullName: "",
    tgUsername: "",
    channelLink: "",
    company: "",
    notes: "",
    tgUserId: null,
  };

  try {
    const stored = localStorage.getItem("vortexProfile");
    if (stored) {
      const data = JSON.parse(stored);
      profile = { ...profile, ...data };
    }
  } catch (e) {
    console.warn("Не удалось прочитать профиль из localStorage", e);
  }

  const tgUser = getTelegramUser();
  if (tgUser) {
    profile = {
      ...profile,
      fullName: tgUser.fullName || profile.fullName,
      tgUsername: tgUser.tgUsername || profile.tgUsername,
      tgUserId: tgUser.tgUserId || profile.tgUserId,
    };
  }

  // Прокидываем профиль в инпуты
  fullNameInput.value = profile.fullName || "";
  tgUsernameInput.value = profile.tgUsername || "";
  channelLinkInput.value = profile.channelLink || "";
  companyInput.value = profile.company || "";
  notesInput.value = profile.notes || "";

  // Рисуем view-карточку
  updateProfileView(profile);

  function showSavedBadge() {
    if (!savedBadge) return;
    savedBadge.classList.remove("hidden");
    setTimeout(() => {
      savedBadge.classList.add("hidden");
    }, 2000);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    profile = {
      ...profile,
      fullName: fullNameInput.value.trim(),
      tgUsername: tgUsernameInput.value.trim(),
      channelLink: channelLinkInput.value.trim(),
      company: companyInput.value.trim(),
      notes: notesInput.value.trim(),
    };

    try {
      localStorage.setItem("vortexProfile", JSON.stringify(profile));
      updateProfileView(profile);
      showSavedBadge();
    } catch (e) {
      console.error("Ошибка при сохранении профиля", e);
    }
  });
});
