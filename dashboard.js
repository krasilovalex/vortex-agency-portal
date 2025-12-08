document.addEventListener("DOMContentLoaded", () => {
  const projects = [
    {
      id: 1,
      name: "Промо Telegram-канала «Vortex Crypto»",
      type: "Реклама канала",
      service: "telegram", // telegram | mini-app | seeding
      status: "in_progress", // new | in_progress | review | done
      budget: 150000,
      updatedAt: "2 часа назад",
      description:
        "Сеточная реклама + посевы в тематических каналах (crypto). Фокус на трафике из RU/CIS.",
    },
    {
      id: 2,
      name: "Продвижение Mini App «Vortex Tools»",
      type: "Продвижение Mini App",
      service: "mini-app",
      status: "review",
      budget: 80000,
      updatedAt: "вчера",
      description:
        "Telegram Ads + тест креативов и аудиторий. Ждёт согласования финального пакета.",
    },
    {
      id: 3,
      name: "Посевы в сетке «Crypto Radar»",
      type: "Посевы",
      service: "seeding",
      status: "done",
      budget: 60000,
      updatedAt: "3 дня назад",
      description:
        "Пакетное размещение постов и сторис в сетке смежных Telegram-каналов.",
    },
    {
      id: 4,
      name: "Совместный розыгрыш 'Очки Дурова' и 'NFT GIFTS' ",
      type: "Реклама канала",
      service: "telegram", // telegram | mini-app | seeding
      status: "in_progress", // new | in_progress | review | done
      budget: 250000,
      updatedAt: "2 часа назад",
      description:
        "Проведение усиленного розыгрыша, раздача Telegram Stars и NFT Gifts",
    },
  ];

  // Фейковые суммарные метрики
  const performance = {
    impressions: 1_200_000, // показы
    clicks: 46_000,
    conversions: 1_150,
  };

  const activeProjectsContainer = document.getElementById("active-projects");
  const noActiveProjectsBlock = document.getElementById("no-active-projects");

  const statActiveEl = document.getElementById("stat-active");
  const statLaunchesEl = document.getElementById("stat-launches");
  const statReachEl = document.getElementById("stat-reach");

  const perfCtrEl = document.getElementById("perf-ctr");
  const perfCpcEl = document.getElementById("perf-cpc");
  const perfCrEl = document.getElementById("perf-cr");

  const filterButtons = document.querySelectorAll(".filter-btn");

  let currentFilter = "all";

  // Формат бюджета
  function formatBudget(value) {
    return value.toLocaleString("ru-RU") + " ₽";
  }

  // Маппинг статуса → текст + классы Tailwind
  function getStatusMeta(status) {
    switch (status) {
      case "in_progress":
        return {
          label: "В работе",
          className:
            "bg-yellow-400/10 text-yellow-300 border border-yellow-400/30",
        };
      case "review":
        return {
          label: "На согласовании",
          className: "bg-blue-400/10 text-blue-300 border border-blue-400/30",
        };
      case "done":
        return {
          label: "Завершен",
          className:
            "bg-emerald-400/10 text-emerald-300 border border-emerald-400/30",
        };
      case "new":
      default:
        return {
          label: "Новый",
          className: "bg-white/10 text-white border border-white/30",
        };
    }
  }

  // Обновление "числовой" статистики
  function updateStats() {
    const activeCount = projects.filter(
      (p) => p.status === "in_progress" || p.status === "review"
    ).length;

    const launches = projects.length * 4; // условно: на каждый проект по 4 запуска

    const reach = projects.reduce((acc, p) => acc + p.budget * 50, 0); // грубая модель

    if (statActiveEl) statActiveEl.textContent = String(activeCount);
    if (statLaunchesEl) statLaunchesEl.textContent = String(launches);
    if (statReachEl) statReachEl.textContent = `${(reach / 1_000_000).toFixed(
      1
    )}M`;
  }

  // Обновление performance-метрик (CTR, CPC, CR)
  function updatePerformance() {
    const { impressions, clicks, conversions } = performance;
    const totalSpend = projects.reduce((acc, p) => acc + p.budget, 0);

    const ctr = impressions ? (clicks / impressions) * 100 : 0;
    const cpc = clicks ? totalSpend / clicks : 0;
    const cr = clicks ? (conversions / clicks) * 100 : 0;

    if (perfCtrEl) perfCtrEl.textContent = ctr.toFixed(1) + "%";
    if (perfCpcEl) perfCpcEl.textContent = cpc.toFixed(1) + " ₽";
    if (perfCrEl) perfCrEl.textContent = cr.toFixed(1) + "%";
  }

  // Рендер списка активных проектов с учётом фильтра
  function renderActiveProjects() {
    if (!activeProjectsContainer) return;

    const active = projects.filter((p) => {
      const isActiveStatus =
        p.status === "in_progress" || p.status === "review";
      const isMatchFilter =
        currentFilter === "all" || p.service === currentFilter;
      return isActiveStatus && isMatchFilter;
    });

    if (active.length === 0) {
      activeProjectsContainer.innerHTML = "";
      if (noActiveProjectsBlock) {
        noActiveProjectsBlock.classList.remove("hidden");
      }
      return;
    }

    if (noActiveProjectsBlock) {
      noActiveProjectsBlock.classList.add("hidden");
    }

    activeProjectsContainer.innerHTML = active
      .map((project) => {
        const statusMeta = getStatusMeta(project.status);

        return `
          <article class="rounded-2xl bg-white/5 border border-white/10 px-3 py-3 hover:bg-white/[0.08] transition">
            <div class="flex items-center justify-between mb-1.5 gap-2">
              <h3 class="text-sm font-semibold">
                ${project.name}
              </h3>
              <span class="text-[10px] px-2 py-0.5 rounded-full ${statusMeta.className}">
                ${statusMeta.label}
              </span>
            </div>
            <p class="text-[11px] text-white/60 mb-1">
              ${project.type}
            </p>
            <p class="text-[12px] text-white/70 mb-2">
              ${project.description}
            </p>
            <div class="flex items-center justify-between text-[11px] text-white/50">
              <span>Бюджет: ${formatBudget(project.budget)}</span>
              <span>Обновлено: ${project.updatedAt}</span>
            </div>
          </article>
        `;
      })
      .join("");
  }

  // Установка активного фильтра и перерисовка списка
  function setActiveFilter(filter) {
    currentFilter = filter;

    filterButtons.forEach((btn) => {
      const btnFilter = btn.dataset.filter;
      const isActive = btnFilter === filter;

      btn.classList.remove(
        "bg-white",
        "text-black",
        "font-semibold",
        "bg-white/5",
        "text-white/70"
      );

      if (isActive) {
        btn.classList.add("bg-white", "text-black", "font-semibold");
      } else {
        btn.classList.add("bg-white/5", "text-white/70");
      }
    });

    renderActiveProjects();
  }

  // Вешаем обработчики на фильтры
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter || "all";
      setActiveFilter(filter);
    });
  });

  // Инициализация
  updateStats();
  updatePerformance();
  setActiveFilter("all");
});
