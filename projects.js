const projects = [
  {
    id: "p1",
    name: "Реклама канала @vortexnft — ноябрь",
    type: "channel", // канал
    channelUsername: "@vortexnft",
    status: "running", // running | planned | paused | finished
    startDate: "2025-11-12",
    endDate: "2025-11-30",
    budget: {
      total: 150000,
      spent: 72300
    },
    metrics: {
      reach: 240000,
      joins: 3420,
      retentionD7: 68,
      cpj: 21.3,
      likes: 12300,
      comments: 1200,
      engagementRate: 7.3
    }
  },
  {
    id: "p2",
    name: "Продвижение Mini App @spin2win — декабрь",
    type: "miniapp", // miniapp / click-проект
    appUsername: "@spin2win",
    status: "running",
    startDate: "2025-12-05",
    endDate: "2025-12-31",
    budget: {
      total: 300000,
      spent: 184500
    },
    metrics: {
      clicks: 42800,
      installs: 31240,
      cr: 7.8,
      cpc: 4.3,
      revenue: 742000,
      transactions: 1984,
      arppu: 374,
      roi: 247,
      paybackDays: 3,
      repeatRate: 41
    }
  }
];

function formatNumber(value) {
  if (value == null) return "—";
  return value.toLocaleString("ru-RU");
}

function formatMoney(value) {
  if (value == null) return "— ₽";
  return value.toLocaleString("ru-RU") + " ₽";
}

function getStatusConfig(status) {
  switch (status) {
    case "running":
      return {
        label: "В работе",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/40",
        text: "text-emerald-300",
        dot: "bg-emerald-400"
      };
    case "planned":
      return {
        label: "На запуске",
        bg: "bg-sky-500/10",
        border: "border-sky-500/40",
        text: "text-sky-300",
        dot: "bg-sky-400"
      };
    case "paused":
      return {
        label: "На паузе",
        bg: "bg-amber-500/10",
        border: "border-amber-500/40",
        text: "text-amber-300",
        dot: "bg-amber-400"
      };
    case "finished":
      return {
        label: "Завершен",
        bg: "bg-slate-500/10",
        border: "border-slate-500/40",
        text: "text-slate-300",
        dot: "bg-slate-300"
      };
    default:
      return {
        label: "Статус",
        bg: "bg-slate-700/20",
        border: "border-slate-600/40",
        text: "text-slate-200",
        dot: "bg-slate-300"
      };
  }
}

function renderProjectRow(project) {
  const listEl = document.getElementById("projects-list");
  if (!listEl) return;

  const emptyStateEl = document.getElementById("projects-empty-state");

  // если список пустой — очистим и спрячем заглушку

  if (emptyStateEl) {
    emptyStateEl.classList.add("hidden");
  }

  const { status, budget, metrics } = project;
  const statusCfg = getStatusConfig(status);

  const total = budget.total || 0;
  const spent = budget.spent || 0;
  const remain = Math.max(total - spent, 0);
  const progress = total > 0 ? Math.round((spent / total) * 100) : 0;

  const periodLine =
    (project.startDate ? `Запуск: ${project.startDate}` : "") +
    (project.endDate ? ` · До: ${project.endDate}` : "");

  // блок метрик зависит от типа проекта
  let metricsBlock = "";
  let bottomBlock = "";

  if (project.type === "channel") {
    metricsBlock = `
      <div class="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px]">
        <div class="flex items-baseline gap-1">
          <span class="text-slate-500">Охват:</span>
          <span class="font-medium text-slate-50">${formatNumber(metrics.reach)}</span>
        </div>
        <div class="flex items-baseline gap-1">
          <span class="text-slate-500">Подписки:</span>
          <span class="font-medium text-slate-50">${formatNumber(metrics.joins)}</span>
        </div>
        <div class="flex items-baseline gap-1">
          <span class="text-slate-500">Удержание D7:</span>
          <span class="font-medium text-emerald-300">${metrics.retentionD7 ?? "—"}%</span>
        </div>
        <div class="flex items-baseline gap-1">
          <span class="text-slate-500">CPJ:</span>
          <span class="font-medium text-sky-300">${metrics.cpj ?? "—"} ₽</span>
        </div>
      </div>
    `;

    bottomBlock = `
      <div class="mt-2.5 flex items-center justify-between gap-2 text-[11px]">
        <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-400">
          <span>Лайки: <span class="text-slate-100 font-medium">${formatNumber(metrics.likes)}</span></span>
          <span>Комменты: <span class="text-slate-100 font-medium">${formatNumber(metrics.comments)}</span></span>
          <span>ER поста: <span class="text-slate-100 font-medium">${metrics.engagementRate ?? "—"}%</span></span>
        </div>
        <button
          class="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-800 bg-slate-900/80 text-slate-400"
          aria-label="Действия по проекту"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-3.5 w-3.5">
            <path
              d="M12 8a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
    `;
  } else if (project.type === "miniapp") {
    metricsBlock = `
      <div class="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px]">
        <div class="flex items-baseline gap-1">
          <span class="text-slate-500">Клики:</span>
          <span class="font-medium text-slate-50">${formatNumber(metrics.clicks)}</span>
        </div>
        <div class="flex items-baseline gap-1">
          <span class="text-slate-500">Установки:</span>
          <span class="font-medium text-slate-50">${formatNumber(metrics.installs)}</span>
        </div>
        <div class="flex items-baseline gap-1">
          <span class="text-slate-500">CR:</span>
          <span class="font-medium text-emerald-300">${metrics.cr ?? "—"}%</span>
        </div>
        <div class="flex items-baseline gap-1">
          <span class="text-slate-500">CPC:</span>
          <span class="font-medium text-sky-300">${metrics.cpc ?? "—"} ₽</span>
        </div>
      </div>

      <div class="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px]">
        <div class="flex items-baseline gap-1">
          <span class="text-slate-500">Выручка:</span>
          <span class="font-medium text-emerald-400">${formatMoney(metrics.revenue)}</span>
        </div>
        <div class="flex items-baseline gap-1">
          <span class="text-slate-500">Транзакций:</span>
          <span class="font-medium text-slate-50">${formatNumber(metrics.transactions)}</span>
        </div>
        <div class="flex items-baseline gap-1">
          <span class="text-slate-500">ARPPU:</span>
          <span class="font-medium text-slate-50">${formatMoney(metrics.arppu)}</span>
        </div>
        <div class="flex items-baseline gap-1">
          <span class="text-slate-500">ROI:</span>
          <span class="font-medium text-emerald-400">${metrics.roi ?? "—"}%</span>
        </div>
      </div>
    `;

    bottomBlock = `
      <div class="mt-2.5 flex items-center justify-between gap-2 text-[11px]">
        <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-400">
          <span>Окупаемость: <span class="text-slate-100 font-medium">${metrics.paybackDays ?? "—"} дня</span></span>
          <span>Повторы: <span class="text-slate-100 font-medium">${metrics.repeatRate ?? "—"}%</span></span>
        </div>
        <button
          class="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-800 bg-slate-900/80 text-slate-400"
          aria-label="Действия по проекту"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-3.5 w-3.5">
            <path
              d="M12 8a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
    `;
  }

  const typeLine =
    project.type === "channel"
      ? `Тип: Telegram-канал · ${project.channelUsername || ""}`
      : `Тип: Telegram Mini App · ${project.appUsername || ""}`;

  const articleHtml = `
    <article class="rounded-2xl border border-slate-800/80 bg-slate-950/80 px-3 py-2.5 shadow-sm shadow-black/20">
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0">
          <p class="truncate text-[13px] font-semibold text-slate-50">
            ${project.name}
          </p>
          <p class="mt-0.5 text-[11px] text-slate-500 truncate">
            ${typeLine}
          </p>
        </div>
        <div class="flex flex-col items-end gap-1">
          <span
            class="inline-flex items-center rounded-full ${statusCfg.bg} px-2.5 py-0.5 text-[10px] font-medium ${statusCfg.text} border ${statusCfg.border}"
          >
            <span class="mr-1 h-1.5 w-1.5 rounded-full ${statusCfg.dot}"></span>
            ${statusCfg.label}
          </span>
          <p class="text-[10px] text-slate-500">
            ${periodLine}
          </p>
        </div>
      </div>

      <div class="mt-2.5 space-y-1.5 text-[11px] text-slate-300">
        <div class="flex flex-wrap items-center gap-x-4 gap-y-1">
          <div class="flex items-baseline gap-1">
            <span class="text-slate-500">Бюджет:</span>
            <span class="font-medium text-slate-50">${formatMoney(total)}</span>
          </div>
          <div class="flex items-baseline gap-1">
            <span class="text-slate-500">Потрачено:</span>
            <span class="font-medium text-slate-50">${formatMoney(spent)}</span>
          </div>
          <div class="flex items-baseline gap-1">
            <span class="text-slate-500">Остаток:</span>
            <span class="font-medium text-sky-300">${formatMoney(remain)}</span>
          </div>
        </div>

        <div class="mt-0.5">
          <div class="h-1.5 w-full overflow-hidden rounded-full bg-slate-900">
            <div class="h-full rounded-full bg-emerald-500" style="width: ${progress}%;"></div>
          </div>
          <div class="mt-0.5 flex justify-between text-[10px] text-slate-500">
            <span>${progress}% бюджета израсходовано</span>
            <span>Прогноз: в рамках плана</span>
          </div>
        </div>
      </div>

      ${metricsBlock}
      ${bottomBlock}
    </article>
  `;

  listEl.insertAdjacentHTML("beforeend", articleHtml);
}

function renderProjects(list) {
  const container = document.getElementById("projects-list");
  const emptyStateEl = document.getElementById("projects-empty-state");

  if (!container) return;

  container.innerHTML = "";

  if (!list || list.length === 0) {
    if (emptyStateEl) emptyStateEl.classList.remove("hidden");
    return;
  }

  if (emptyStateEl) emptyStateEl.classList.add("hidden");

  list.forEach((project) => {
    renderProjectRow(project);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderProjects(projects);

  // тут позже добавим:
  // - обновление счетчиков "Всего проектов" / "В работе"
  // - расчёт KPI в верхнем баре
  // - фильтры и сортировку
});

