

const CalendarPage = (() => {

  
  
  let state = {
    view:        'month',    
    currentDate: new Date(), 
  };

  
  const EVENT_CONFIG = {
    completion: {
      chipClass: 'chip-completion',
      icon:      'fa-solid fa-circle-check',
      iconBg:    'var(--bg-success)',
      iconColor: 'var(--color-success)',
      barColor:  'var(--color-success)',
      label:     'Completion',
    },
    milestone: {
      chipClass: 'chip-milestone',
      icon:      'fa-solid fa-flag',
      iconBg:    'var(--accent-light)',
      iconColor: 'var(--accent)',
      barColor:  'var(--accent)',
      label:     'Milestone',
    },
    meeting: {
      chipClass: 'chip-meeting',
      icon:      'fa-solid fa-users',
      iconBg:    'var(--bg-warning)',
      iconColor: 'var(--color-warning)',
      barColor:  'var(--color-warning)',
      label:     'Meeting',
    },
  };

  
  const DAY_NAMES   = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const MONTH_NAMES = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];

  
  
  
  function buildEventMap() {
    const map = {};
    AppData.events.forEach(evt => {
      const key = evt.date; 
      if (!map[key]) map[key] = [];
      map[key].push(evt);
    });
    return map;
  }

  
  function toKey(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  
  function isSameDay(a, b) {
    return a.getFullYear() === b.getFullYear()
        && a.getMonth()    === b.getMonth()
        && a.getDate()     === b.getDate();
  }

  
  function isToday(date) {
    return isSameDay(date, new Date());
  }

  
  function buildChip(evt, extraClass = '') {
    const cfg = EVENT_CONFIG[evt.type] || EVENT_CONFIG.milestone;
    return `
      <div class="cal-event-chip ${cfg.chipClass} ${extraClass}"
        data-event-id="${evt.id}" title="${evt.title}">
        <i class="${cfg.icon}" style="font-size:9px;flex-shrink:0;"></i>
        <span style="overflow:hidden;text-overflow:ellipsis;">${evt.title}</span>
      </div>
    `;
  }

  
  
  
  function renderMonthly() {
    const year  = state.currentDate.getFullYear();
    const month = state.currentDate.getMonth(); 
    const eventMap = buildEventMap();

    
    const firstDay = new Date(year, month, 1).getDay();
    
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const daysInPrev = new Date(year, month, 0).getDate();

    
    const TOTAL_CELLS = 42;

    let dayCells = '';

    for (let i = 0; i < TOTAL_CELLS; i++) {
      let dayNum, date, isOther = false;

      if (i < firstDay) {
        
        dayNum  = daysInPrev - firstDay + i + 1;
        date    = new Date(year, month - 1, dayNum);
        isOther = true;
      } else if (i >= firstDay + daysInMonth) {
        
        dayNum  = i - firstDay - daysInMonth + 1;
        date    = new Date(year, month + 1, dayNum);
        isOther = true;
      } else {
        
        dayNum = i - firstDay + 1;
        date   = new Date(year, month, dayNum);
      }

      const key    = toKey(date);
      const events = eventMap[key] || [];
      const today  = isToday(date);

      
      let cls = 'cal-day';
      if (isOther) cls += ' other-month';
      if (today)   cls += ' today';
      if (events.length && !isOther) cls += ' has-events';

      
      const maxChips  = 2;
      const visible   = events.slice(0, maxChips);
      const overflow  = events.length - maxChips;

      const chipsHTML = visible.map(e => buildChip(e)).join('');
      const moreHTML  = overflow > 0
        ? `<div class="cal-day-more" data-date="${key}">+${overflow} more</div>`
        : '';

      dayCells += `
        <div class="${cls}">
          <div class="cal-day-num">${dayNum}</div>
          ${isOther ? '' : chipsHTML + moreHTML}
        </div>
      `;
    }

    
    const weekdaysHTML = DAY_NAMES.map(d =>
      `<div class="cal-weekday">${d}</div>`
    ).join('');

    return `
      <div class="cal-weekdays">${weekdaysHTML}</div>
      <div class="cal-month-grid anim-fade-in">${dayCells}</div>
    `;
  }

  
  
  
  function renderWeekly() {
    const eventMap = buildEventMap();

    
    const curr     = new Date(state.currentDate);
    const dayOfWeek = curr.getDay(); 
    const sunday   = new Date(curr);
    sunday.setDate(curr.getDate() - dayOfWeek);

    const colsHTML = Array.from({ length: 7 }, (_, i) => {
      const date   = new Date(sunday);
      date.setDate(sunday.getDate() + i);
      const key    = toKey(date);
      const events = eventMap[key] || [];
      const today  = isToday(date);

      const eventsHTML = events.length
        ? events.map(evt => {
            const cfg = EVENT_CONFIG[evt.type] || EVENT_CONFIG.milestone;
            return `
              <div class="cal-week-event ${cfg.chipClass}"
                data-event-id="${evt.id}">
                <i class="${cfg.icon}" style="font-size:10px;margin-right:4px;"></i>
                ${evt.title}
              </div>
            `;
          }).join('')
        : `<div style="font-size:11px;color:var(--text-muted);text-align:center;
                       padding:var(--space-3);">No events</div>`;

      return `
        <div class="cal-week-col ${today ? 'today' : ''}">
          <div class="cal-week-day-header">
            <span class="cal-week-day-name">${DAY_NAMES[i]}</span>
            <span class="cal-week-day-num">${date.getDate()}</span>
          </div>
          <div class="cal-week-events">
            ${eventsHTML}
          </div>
        </div>
      `;
    }).join('');

    return `<div class="cal-week-grid anim-fade-in">${colsHTML}</div>`;
  }

  
  
  
  function renderDaily() {
    const date     = state.currentDate;
    const key      = toKey(date);
    const eventMap = buildEventMap();
    const events   = eventMap[key] || [];

    const dayLabel = date.toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    const isTodayFlag = isToday(date);

    
    const eventsHTML = events.length
      ? events.map((evt, i) => {
          const cfg = EVENT_CONFIG[evt.type] || EVENT_CONFIG.milestone;
          const project = AppData.getProject(evt.projectId);
          const delay = Math.min(i + 1, 6);
          return `
            <div class="cal-timeline-event anim-delay-${delay}"
              data-event-id="${evt.id}">
              <div class="cal-timeline-icon"
                style="background:${cfg.iconBg};color:${cfg.iconColor};">
                <i class="${cfg.icon}"></i>
              </div>
              <div class="cal-timeline-info">
                <div class="cal-timeline-title">${evt.title}</div>
                <div class="cal-timeline-desc">
                  ${project ? project.name + ' · ' : ''}${evt.description || ''}
                </div>
              </div>
              <span class="badge ${
                evt.type === 'completion' ? 'badge-success' :
                evt.type === 'meeting'    ? 'badge-warning' :
                                            'badge-accent'
              }" style="flex-shrink:0;font-size:10px;">
                ${cfg.label}
              </span>
            </div>
          `;
        }).join('')
      : `<div class="cal-no-events">
           <i class="fa-regular fa-calendar" style="font-size:32px;display:block;margin-bottom:var(--space-3);"></i>
           No events on this day
         </div>`;

    return `
      <div class="cal-day-view anim-fade-in">
        <!-- Day banner -->
        <div class="cal-day-banner">
          <div>
            <div class="cal-day-banner-title">${dayLabel}</div>
            <div class="cal-day-banner-sub">
              ${events.length} event${events.length !== 1 ? 's' : ''} scheduled
            </div>
          </div>
          ${isTodayFlag
            ? `<span class="badge badge-accent" style="font-size:12px;padding:4px 14px;">Today</span>`
            : ''}
        </div>

        <!-- Timeline events -->
        ${eventsHTML}
      </div>
    `;
  }

  
  
  
  function openEventModal(eventId) {
    const evt = AppData.events.find(e => e.id === eventId);
    if (!evt) return;

    const cfg     = EVENT_CONFIG[evt.type] || EVENT_CONFIG.milestone;
    const project = AppData.getProject(evt.projectId);

    const modalHTML = `
      <div class="cal-modal-backdrop" id="cal-modal-backdrop">
        <div class="cal-modal" role="dialog" aria-label="Event details">

          <!-- Colored top bar -->
          <div class="cal-modal-top" style="background:${cfg.barColor};"></div>

          <div class="cal-modal-body">

            <!-- Header -->
            <div class="cal-modal-header">
              <div>
                <div style="margin-bottom:var(--space-2);">
                  <span class="badge ${
                    evt.type === 'completion' ? 'badge-success' :
                    evt.type === 'meeting'    ? 'badge-warning' :
                                               'badge-accent'
                  }">
                    <i class="${cfg.icon}"></i> ${cfg.label}
                  </span>
                </div>
                <div class="cal-modal-title">${evt.title}</div>
              </div>
              <button class="cal-modal-close" id="cal-modal-close" aria-label="Close">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>

            <!-- Details -->
            <div class="cal-modal-row">
              <i class="fa-regular fa-calendar"></i>
              <span>${Utils.formatDate(evt.date, 'long')}</span>
            </div>

            ${project ? `
              <div class="cal-modal-row">
                <i class="fa-solid fa-folder"></i>
                <span>${project.name}</span>
              </div>
            ` : ''}

            ${evt.description ? `
              <div class="cal-modal-row" style="align-items:flex-start;">
                <i class="fa-solid fa-align-left" style="margin-top:2px;"></i>
                <span style="line-height:var(--line-height-normal);">
                  ${evt.description}
                </span>
              </div>
            ` : ''}

            <!-- View project button -->
            ${project ? `
              <div style="margin-top:var(--space-5);">
                <button class="btn btn-primary" id="cal-view-proj-btn"
                  data-project-id="${project.id}" style="width:100%;">
                  <i class="fa-solid fa-arrow-right"></i>
                  View Project Details
                </button>
              </div>
            ` : ''}

          </div>
        </div>
      </div>
    `;

    
    const container = Utils.qs('#cal-modal-container');
    if (container) container.innerHTML = modalHTML;

    
    Utils.qs('#cal-modal-close')?.addEventListener('click', closeModal);
    Utils.qs('#cal-modal-backdrop')?.addEventListener('click', (e) => {
      if (e.target.id === 'cal-modal-backdrop') closeModal();
    });
    document.addEventListener('keydown', handleEscModal);

    
    Utils.qs('#cal-view-proj-btn')?.addEventListener('click', (e) => {
      const pid = e.currentTarget.dataset.projectId;
      sessionStorage.setItem('selectedProject', pid);
      closeModal();
      navigateTo('details', { projectId: pid });
    });
  }

  function closeModal() {
    const container = Utils.qs('#cal-modal-container');
    if (container) container.innerHTML = '';
    document.removeEventListener('keydown', handleEscModal);
  }

  function handleEscModal(e) {
    if (e.key === 'Escape') closeModal();
  }

  
  
  
  function navigate(direction) {
    
    const d = new Date(state.currentDate);

    if (state.view === 'month') {
      d.setMonth(d.getMonth() + direction);
    } else if (state.view === 'week') {
      d.setDate(d.getDate() + direction * 7);
    } else {
      
      d.setDate(d.getDate() + direction);
    }

    state.currentDate = d;
    updatePeriodLabel();
    renderView();
  }

  function goToday() {
    state.currentDate = new Date();
    updatePeriodLabel();
    renderView();
  }

  
  function getPeriodLabel() {
    const d = state.currentDate;

    if (state.view === 'month') {
      return `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
    }

    if (state.view === 'week') {
      
      const dayOfWeek = d.getDay();
      const sunday = new Date(d);
      sunday.setDate(d.getDate() - dayOfWeek);
      const saturday = new Date(sunday);
      saturday.setDate(sunday.getDate() + 6);

      const fmt = { month: 'short', day: 'numeric' };
      return `${sunday.toLocaleDateString('en-US', fmt)} – ${saturday.toLocaleDateString('en-US', fmt)}, ${d.getFullYear()}`;
    }

    
    return d.toLocaleDateString('en-US', {
      weekday: 'short', month: 'long', day: 'numeric', year: 'numeric'
    });
  }

  function updatePeriodLabel() {
    const el = Utils.qs('#cal-period-label');
    if (el) el.textContent = getPeriodLabel();
  }

  
  function renderView() {
    const container = Utils.qs('#cal-view-container');
    if (!container) return;

    if (state.view === 'month') {
      container.innerHTML = renderMonthly();
    } else if (state.view === 'week') {
      container.innerHTML = renderWeekly();
    } else {
      container.innerHTML = renderDaily();
    }

    
    container.addEventListener('click', (e) => {
      const chip = e.target.closest('[data-event-id]');
      if (chip) {
        openEventModal(chip.dataset.eventId);
      }
    });
  }

  
  function buildLegend() {
    return `
      <div class="cal-legend">
        <div class="cal-legend-item">
          <div class="cal-legend-dot" style="background:var(--color-success);"></div>
          Completion
        </div>
        <div class="cal-legend-item">
          <div class="cal-legend-dot" style="background:var(--accent);"></div>
          Milestone
        </div>
        <div class="cal-legend-item">
          <div class="cal-legend-dot" style="background:var(--color-warning);"></div>
          Meeting
        </div>
        <span style="margin-left:auto;font-size:var(--font-size-xs);color:var(--text-muted);">
          ${AppData.events.length} total events
        </span>
      </div>
    `;
  }

  
  function render() {
    const page = Utils.qs('#page-calendar');
    if (!page) return;

    page.innerHTML = `
      <!-- Page header -->
      <div class="cal-header anim-fade-in">
        <div class="cal-header-left">
          <h2>Calendar</h2>
          <p>Project milestones, meetings, and completions</p>
        </div>
      </div>

      <!-- Toolbar: prev/next + today + view toggle -->
      <div class="cal-toolbar anim-fade-in-down">

        <!-- Prev / Period Label / Next navigation -->
        <div class="cal-nav">
          <button class="cal-nav-btn" id="cal-prev-btn" aria-label="Previous">
            <i class="fa-solid fa-chevron-left"></i>
          </button>
          <div class="cal-period-label" id="cal-period-label">
            ${getPeriodLabel()}
          </div>
          <button class="cal-nav-btn" id="cal-next-btn" aria-label="Next">
            <i class="fa-solid fa-chevron-right"></i>
          </button>
        </div>

        <!-- Jump to today -->
        <button class="cal-today-btn" id="cal-today-btn">Today</button>

        <!-- View mode toggle -->
        <div class="cal-view-toggle" role="group">
          <button class="cal-view-btn active" data-view="month" id="cal-view-month">Month</button>
          <button class="cal-view-btn" data-view="week" id="cal-view-week">Week</button>
          <button class="cal-view-btn" data-view="day" id="cal-view-day">Day</button>
        </div>

      </div>

      <!-- Event type legend -->
      ${buildLegend()}

      <!-- Calendar view renders here -->
      <div id="cal-view-container">
        <!-- renderView() fills this -->
      </div>

      <!-- Modal mounts here -->
      <div id="cal-modal-container"></div>
    `;

    
    Utils.qs('#cal-prev-btn')?.addEventListener('click', () => navigate(-1));
    Utils.qs('#cal-next-btn')?.addEventListener('click', () => navigate(+1));
    Utils.qs('#cal-today-btn')?.addEventListener('click', goToday);

    
    Utils.qsa('.cal-view-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        Utils.qsa('.cal-view-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.view = btn.dataset.view;
        updatePeriodLabel();
        renderView();
      });
    });

    
    renderView();
  }

  
  return {
    init() {
      
      
      
      const mostRecentEvent = AppData.events
        .slice()
        .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

      if (mostRecentEvent) {
        state.currentDate = new Date(mostRecentEvent.date + 'T12:00:00');
      } else {
        state.currentDate = new Date();
      }

      render();
    }
  };

})();
