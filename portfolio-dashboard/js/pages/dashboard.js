

const DashboardPage = (() => {

  
  
  const QUICK_NAV = [
    { page: 'library',   icon: 'fa-solid fa-folder-open',   label: 'Projects' },
    { page: 'team',      icon: 'fa-solid fa-users',          label: 'Team' },
    { page: 'tasks',     icon: 'fa-solid fa-list-check',     label: 'Tasks' },
    { page: 'calendar',  icon: 'fa-solid fa-calendar-days',  label: 'Calendar' },
    { page: 'analytics', icon: 'fa-solid fa-chart-line',     label: 'Analytics' },
    { page: 'settings',  icon: 'fa-solid fa-gear',           label: 'Settings' },
  ];

  
  function buildStats() {
    const projects   = AppData.projects;
    const team       = AppData.team;
    const tasks      = AppData.tasks;
    const techCount  = AppData.getTechStats(100).length; 

    
    const doneTasks = tasks.filter(t => t.status === 'Done').length;

    const stats = [
      {
        label:  'Total Projects',
        value:  projects.length,
        icon:   'fa-solid fa-folder-open',
        color:  'var(--accent)',
        bg:     'var(--accent-light)',
        trend:  '+2 this year',
        up:     true,
      },
      {
        label:  'Completed Tasks',
        value:  doneTasks,
        icon:   'fa-solid fa-circle-check',
        color:  'var(--color-success)',
        bg:     'var(--bg-success)',
        trend:  '100% completion',
        up:     true,
      },
      {
        label:  'Team Members',
        value:  team.length,
        icon:   'fa-solid fa-users',
        color:  'var(--color-info)',
        bg:     'var(--bg-info)',
        trend:  'Active contributors',
        up:     null,
      },
      {
        label:  'Technologies Used',
        value:  techCount,
        icon:   'fa-solid fa-code',
        color:  'var(--color-warning)',
        bg:     'var(--bg-warning)',
        trend:  'Across all projects',
        up:     null,
      },
    ];

    return stats.map((s, i) => `
      <div class="stat-card anim-fade-in-up anim-delay-${i + 1}">
        <!-- Colored icon box -->
        <div class="stat-icon" style="background:${s.bg}; color:${s.color};">
          <i class="${s.icon}"></i>
        </div>
        <div class="stat-body">
          <!-- Number will be animated by JS -->
          <div class="stat-value" data-count="${s.value}" id="stat-val-${i}">0</div>
          <div class="stat-label">${s.label}</div>
          <div class="stat-trend ${s.up === true ? 'up' : s.up === false ? 'down' : ''}">
            ${s.up === true ? '<i class="fa-solid fa-arrow-trend-up"></i>' : ''}
            ${s.trend}
          </div>
        </div>
      </div>
    `).join('');
  }

  
  function buildActivity() {
    const activities = AppData.getRecentActivity(8);
    const typeIcons = {
      completion: 'fa-solid fa-circle-check',
      milestone:  'fa-solid fa-flag',
      meeting:    'fa-solid fa-users'
    };

    if (!activities.length) {
      return '<div class="empty-state"><p class="text-muted">No recent activity.</p></div>';
    }

    return activities.map((evt, i) => `
      <div class="activity-item anim-delay-${Math.min(i + 1, 8)}">
        <!-- Colored dot -->
        <div class="activity-dot ${evt.type}"></div>
        <div class="activity-text">
          <div class="activity-title">${evt.title}</div>
          <div class="activity-meta">${Utils.formatDate(evt.date, 'relative')}</div>
        </div>
        <!-- Type badge -->
        <span class="badge ${
          evt.type === 'completion' ? 'badge-success' :
          evt.type === 'meeting'    ? 'badge-warning' :
                                      'badge-accent'
        }">
          <i class="${typeIcons[evt.type] || 'fa-solid fa-circle'}"></i>
          ${Utils.capitalize(evt.type)}
        </span>
      </div>
    `).join('');
  }

  
  function buildProjectProgress() {
    
    const recent = [...AppData.projects]
      .sort((a, b) => new Date(b.completionDate) - new Date(a.completionDate))
      .slice(0, 5);

    return recent.map(p => {
      const color = p.progress === 100
        ? 'var(--color-success)'
        : 'var(--accent)';
      return `
        <div class="project-progress-item">
          <div class="project-progress-meta">
            <span class="project-progress-name">${p.name}</span>
            <span class="project-progress-pct">${p.progress}%</span>
          </div>
          <!-- Progress bar fills via CSS transition -->
          <div class="progress-bar-wrap">
            <div class="progress-bar-fill"
              style="width:0%; background:${color};"
              data-target="${p.progress}%">
            </div>
          </div>
          <div style="font-size:var(--font-size-xs);color:var(--text-muted);">
            ${Utils.formatDate(p.completionDate, 'short')}
            <span class="dot-sep"></span>
            <span class="badge badge-success" style="font-size:10px;padding:1px 7px;">
              ${p.status}
            </span>
          </div>
        </div>
      `;
    }).join('');
  }

  
  function buildQuickNav() {
    return QUICK_NAV.map((nav, i) => `
      <div
        class="quicknav-card anim-fade-in-up anim-delay-${i + 1}"
        data-page="${nav.page}"
        role="button"
        tabindex="0"
        aria-label="Go to ${nav.label}"
      >
        <div class="quicknav-icon">
          <i class="${nav.icon}"></i>
        </div>
        <div class="quicknav-label">${nav.label}</div>
      </div>
    `).join('');
  }

  
  function render() {
    const page = Utils.qs('#page-dashboard');
    if (!page) return;

    const categoryStats  = AppData.getCategoryStats();
    const techStats      = AppData.getTechStats(8);
    const monthlyStats   = AppData.getMonthlyCompletions();

    page.innerHTML = `
      <!-- Welcome header -->
      <div class="dash-welcome anim-fade-in">
        <h1 class="dash-welcome-title">
          Welcome back, <span>Kartikae</span> 👋
        </h1>
        <p class="dash-welcome-sub">
          Here's a snapshot of your projects.
        </p>
      </div>

      <!-- KPI Stat Cards (4 columns) -->
      <div class="dash-stats-grid">
        ${buildStats()}
      </div>

      <!-- Main 2-column grid: Charts + Activity -->
      <div class="dash-main-grid">

        <!-- Left column: Monthly completions area chart -->
        <div class="card anim-fade-in-up anim-delay-2">
          <div class="card-header">
            <div>
              <div class="card-title">Project Completions Over Time</div>
              <div class="card-subtitle">Monthly completed projects timeline</div>
            </div>
          </div>
          <!-- charts.js renders the SVG here -->
          <div class="chart-wrapper" id="chart-area"></div>
        </div>

        <!-- Right column: Activity feed -->
        <div class="card anim-fade-in-up anim-delay-3">
          <div class="card-header">
            <div>
              <div class="card-title">Recent Activity</div>
              <div class="card-subtitle">Latest events & milestones</div>
            </div>
          </div>
          <div class="activity-feed">
            ${buildActivity()}
          </div>
        </div>
      </div>

      <!-- Bottom 2-column grid: tech chart + project progress -->
      <div class="dash-bottom-grid">

        <!-- Category distribution donut -->
        <div class="card anim-fade-in-up anim-delay-2">
          <div class="card-header">
            <div>
              <div class="card-title">Category Distribution</div>
              <div class="card-subtitle">Projects by type</div>
            </div>
          </div>
          <div class="chart-wrapper" id="chart-donut"></div>
        </div>

        <!-- Technology usage horizontal bars -->
        <div class="card anim-fade-in-up anim-delay-3">
          <div class="card-header">
            <div>
              <div class="card-title">Technology Usage</div>
              <div class="card-subtitle">Most used technologies</div>
            </div>
          </div>
          <div class="chart-wrapper" id="chart-tech"></div>
        </div>
      </div>

      <!-- Recent projects progress -->
      <div class="card anim-fade-in-up anim-delay-2" style="margin-bottom:var(--space-6);">
        <div class="card-header">
          <div>
            <div class="card-title">Recent Projects</div>
            <div class="card-subtitle">Latest 5 completed projects</div>
          </div>
          <!-- Link to full library -->
          <button class="btn btn-secondary btn-sm" onclick="navigateTo('library')">
            View All <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
        <div class="project-progress-list">
          ${buildProjectProgress()}
        </div>
      </div>
    `;

    
    

    
    const areaContainer = Utils.qs('#chart-area');
    if (areaContainer && monthlyStats.length) {
      Charts.area(areaContainer, monthlyStats, {
        color: Utils.getCSSVar('--accent') || '#6366f1',
        height: 180,
      });
    }

    
    const donutContainer = Utils.qs('#chart-donut');
    if (donutContainer && categoryStats.length) {
      Charts.donut(donutContainer, categoryStats, {
        size: 160,
        centerLabel: AppData.projects.length.toString(),
        title: 'Projects by category'
      });
    }

    
    const techContainer = Utils.qs('#chart-tech');
    if (techContainer && techStats.length) {
      Charts.horizontalBar(techContainer, techStats, {
        colors: Charts.PALETTE,
        showValues: true,
      });
    }

    
    
    const dashPage = Utils.qs('#page-dashboard');
    Utils.qsa('[data-count]', dashPage).forEach((el, i) => {
      const target = parseInt(el.dataset.count, 10);
      
      setTimeout(() => {
        Utils.animateCounter(el, target, 1200);
      }, i * 100);
    });

    
    
    setTimeout(() => {
      Utils.qsa('.progress-bar-fill[data-target]').forEach(bar => {
        bar.style.width = bar.dataset.target;
      });
    }, 100);

  }

  
  return {
    
    init() {
      render();
    }
  };

})();
