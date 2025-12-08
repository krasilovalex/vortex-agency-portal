document.addEventListener("DOMContentLoaded", () => {
  // Те же проекты, что и на дашборде
  const projects = [
    {
      id: 1,
      name: "Промо Telegram-канала «Vortex Crypto»",
      type: "Реклама канала",
      service: "telegram", // telegram | mini-app | seeding
      status: "in_progress", // new | in_progress | review | done
      budget: 150000,
      updatedAt: "2 часа назад",
      month: "Март 2025",
    },
    {
      id: 2,
      name: "Продвижение Mini App «Vortex Tools»",
      type: "Продвижение Mini App",
      service: "mini-app",
      status: "review",
      budget: 80000,
      updatedAt: "вчера",
      month: "Март 2025",
    },
    {
      id: 3,
      name: "Посевы в сетке «Crypto Radar»",
      type: "Посевы",
      service: "seeding",
      status: "done",
      budget: 60000,
      updatedAt: "3 дня назад",
      month: "Февраль 2025",
    },
    {
      id: 4,
      name: "Лонч нативной рекламы «DeFi Launchpad»",
      type: "Реклама канала",
      service: "telegram",
      status: "new",
      budget: 200000,
      updatedAt: "только что",
      month: "Март 2025",
    },
  ];

  const listEl = document.getElementById("projects-list");
  const emptyEl = document.getElementById("projects-empty");

  function formatMoney(value) {
    return value.toLocaleString("ru-RU") + " ₽";
  }

  function getStatusMeta(status) {
    switch (status) {
      case "in_progress":
        return {
          label: "В работе",
          className:
            "inline-flex items-center justify-center whitespace-nowrap px-3 py-1 text-[11px] rounded-full bg-yellow-400/10 text-yellow-300 border border-yellow-400/30",
        };
      case "review":
        return {
          label: "На согласовании",
          className:
            "inline-flex items-center justify-center whitespace-nowrap px-3 py-1 text-[11px] rounded-full bg-blue-400/10 text-blue-300 border border-blue-400/30",
        };
      case "done":
        return {
          label: "Завершен",
          className:
            "inline-flex items-center justify-center whitespace-nowrap px-3 py-1 text-[11px] rounded-full bg-emerald-400/10 text-emerald-300 border border-emerald-400/30",
        };
      case "new":
      default:
        return {
          label: "Новый",
          className:
            "inline-flex items-center justify-center whitespace-nowrap px-3 py-1 text-[11px] rounded-full bg-white/10 text-white border border-white/30",
        };
    }
  }

  function renderProjects(list) {
    if (!listEl) return;

    if (!list || list.length === 0) {
      listEl.innerHTML = "";
      if (emptyEl) emptyEl.classList.remove("hidden");
      return;
    }

    if (emptyEl) emptyEl.classList.add("hidden");

    listEl.innerHTML = list
      .map((p) => {
        const meta = getStatusMeta(p.status);

        return `
          <article class="rounded-2xl bg-white/5 border border-white/10 px-3 py-3 hover:bg-white/[0.08] transition">
            <div class="flex items-center justify-between mb-1.5 gap-2">
              <div>
                <div class="text-[13px] font-semibold">${p.name}</div>
                <div class="text-[11px] text-white/60">
                  ${p.type} · ${p.month}
                </div>
              </div>
              <span class="${meta.className}">
                ${meta.label}
              </span>
            </div>
            <div class="flex items-center justify-between text-[11px] text-white/50 mt-1">
              <span>Бюджет: ${formatMoney(p.budget)}</span>
              <span>Обновлено: ${p.updatedAt}</span>
            </div>
          </article>
        `;
      })
      .join("");
  }

  // стартовый рендер
  renderProjects(projects);
});
