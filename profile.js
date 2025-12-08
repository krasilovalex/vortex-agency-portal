document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("profile-form");
  const savedBadge = document.getElementById("profile-saved");

  const fullNameInput = document.getElementById("fullName");
  const tgUsernameInput = document.getElementById("tgUsername");
  const channelLinkInput = document.getElementById("channelLink");
  const companyInput = document.getElementById("company");
  const notesInput = document.getElementById("notes");

  // view-профиль
  const viewFullName = document.getElementById("view-fullName");
  const viewUsername = document.getElementById("view-username");
  const viewChannel = document.getElementById("view-channel");
  const viewCompany = document.getElementById("view-company");
  const viewTgId = document.getElementById("view-tg-id");
  const viewAvatar = document.getElementById("view-avatar");

  // финансы
  const balanceAmountEl = document.getElementById("balance-amount");
  const balanceReservedEl = document.getElementById("balance-reserved");
  const balanceTotalSpendEl = document.getElementById("balance-total-spend");

  // заказы
  const ordersActiveEl = document.getElementById("orders-active");
  const ordersTotalEl = document.getElementById("orders-total");
  const ordersMonthSpendEl = document.getElementById("orders-month-spend");
  const ordersListEl = document.getElementById("orders-list");

  // аккордеон настроек
  const settingsToggle = document.getElementById("profile-settings-toggle");
  const settingsLabel = document.getElementById(
    "profile-settings-toggle-label"
  );
  const settingsBody = document.getElementById("profile-settings-body");

  // ===== MOCK-ДАННЫЕ ПО ЗАКАЗАМ / ФИНАНСАМ =====
  const orders = [
     {
      id: 103,
      name: "Совместный розыгрыш 'Очки Дурова' и 'NFT GIFTS",
      type: "Реклама канала",
      status: "in_progress",
      month: "Декабрь 2025",
      spend: 250000,
      budget: 300000,
    },
    {
      id: 101,
      name: "Промо Telegram-канала «Vortex Crypto»",
      type: "Реклама канала",
      status: "in_progress", // new | in_progress | review | done
      month: "Ноябрь 2025",
      spend: 120000,
      budget: 150000,
    },
    {
      id: 102,
      name: "Продвижение Mini App «Vortex Tools»",
      type: "Продвижение Mini App",
      status: "review",
      month: "Март 2025",
      spend: 60000,
      budget: 80000,
    },
    {
      id: 99,
      name: "Посевы в сетке «Crypto Radar»",
      type: "Посевы",
      status: "done",
      month: "Февраль 2025",
      spend: 60000,
      budget: 60000,
    },
   
  ];

  const wallet = {
    balance: 27000, // доступно
    reserved: 200000, // в работе
    totalSpend: orders.reduce((acc, o) => acc + o.spend, 0),
    monthSpend: orders
      .filter((o) => o.month === "Март 2025")
      .reduce((acc, o) => acc + o.spend, 0),
  };

  // ===== TELEGRAM USER =====
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

  // ===== ПРОФИЛЬ КЛИЕНТА =====
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

  // ===== VIEW-ПРОФИЛЬ =====
  function updateProfileView() {
    const { fullName, tgUsername, channelLink, company, tgUserId } = profile;

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

  // Прокидываем профиль в форму
  if (fullNameInput) fullNameInput.value = profile.fullName || "";
  if (tgUsernameInput) tgUsernameInput.value = profile.tgUsername || "";
  if (channelLinkInput) channelLinkInput.value = profile.channelLink || "";
  if (companyInput) companyInput.value = profile.company || "";
  if (notesInput) notesInput.value = profile.notes || "";

  updateProfileView();

  // ===== ФИНАНСЫ / ЗАКАЗЫ =====
  function formatMoney(value) {
    return value.toLocaleString("ru-RU") + " ₽";
  }

  function updateWallet() {
    if (balanceAmountEl)
      balanceAmountEl.textContent = formatMoney(wallet.balance);
    if (balanceReservedEl)
      balanceReservedEl.textContent = formatMoney(wallet.reserved);
    if (balanceTotalSpendEl)
      balanceTotalSpendEl.textContent = formatMoney(wallet.totalSpend);
  }

  function updateOrdersSummary() {
    const activeCount = orders.filter(
      (o) => o.status === "in_progress" || o.status === "review"
    ).length;

    if (ordersActiveEl) ordersActiveEl.textContent = String(activeCount);
    if (ordersTotalEl) ordersTotalEl.textContent = String(orders.length);
    if (ordersMonthSpendEl)
      ordersMonthSpendEl.textContent = formatMoney(wallet.monthSpend);
  }

  function renderOrdersList() {
    if (!ordersListEl) return;

    const statusMap = {
      in_progress: {
        label: "В работе",
        className:
          "bg-yellow-400/10 text-yellow-300 border border-yellow-400/30",
      },
      review: {
        label: "На согласовании",
        className: "bg-blue-400/10 text-blue-300 border border-blue-400/30",
      },
      done: {
        label: "Завершен",
        className:
          "bg-emerald-400/10 text-emerald-300 border border-emerald-400/30",
      },
      new: {
        label: "Новый",
        className: "bg-white/10 text-white border border-white/30",
      },
    };

    ordersListEl.innerHTML = orders
      .slice(0, 10)
      .map((o) => {
        const meta = statusMap[o.status] || statusMap.new;
        return `
        <article class="rounded-2xl bg-white/5 border border-white/10 px-3 py-3 hover:bg-white/[0.08] transition">
          <div class="flex items-center justify-between mb-1.5 gap-2">
            <div>
              <div class="text-[13px] font-semibold">${o.name}</div>
              <div class="text-[11px] text-white/60">${o.type} · ${o.month}</div>
            </div>
            <span class="text-[10px] px-2 py-0.5 rounded-full ${meta.className}">
              ${meta.label}
            </span>
          </div>
          <div class="flex items-center justify-between text-[11px] text-white/50 mt-1">
            <span>Потрачено: ${formatMoney(o.spend)}</span>
            <span>Бюджет: ${formatMoney(o.budget)}</span>
          </div>
        </article>
      `;
      })
      .join("");
  }

  updateWallet();
  updateOrdersSummary();
  renderOrdersList();

  // ===== АККОРДЕОН НАСТРОЕК =====
  if (settingsToggle && settingsBody && settingsLabel) {
    settingsToggle.addEventListener("click", () => {
      const isHidden = settingsBody.classList.contains("hidden");
      if (isHidden) {
        settingsBody.classList.remove("hidden");
        settingsLabel.textContent = "Свернуть";
      } else {
        settingsBody.classList.add("hidden");
        settingsLabel.textContent = "Развернуть";
      }
    });
  }

  // ===== СОХРАНЕНИЕ ПРОФИЛЯ =====
  function showSavedBadge() {
    if (!savedBadge) return;
    savedBadge.classList.remove("hidden");
    setTimeout(() => {
      savedBadge.classList.add("hidden");
    }, 2000);
  }

  if (form) {
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
        updateProfileView();
        showSavedBadge();
      } catch (e) {
        console.error("Ошибка при сохранении профиля", e);
      }
    });
  }
});
