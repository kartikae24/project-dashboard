

const AnalyticsPage = (() => {

  
  const MEMBER_COLORS = [
    '#6366f1','#06b6d4','#10b981',
    '#f59e0b','#f43f5e','#8b5cf6','#ec4899','#14b8a6'
  ];

  
  function computeStats() {
    const projects  = AppData.projects;
    const team      = AppData.team;
    const tasks     = AppData.tasks;

    
    const allTech = new Set(projects.flatMap(p => p.technologies));

    
    const avgTeamSize = (
      projects.reduce((s, p) => s + p.teamIds.length, 0) / projects.length
    ).toFixed(1);

    
    const techCounts = {};
    projects.forEach(p => p.technologies.forEach(t => {
      techCounts[t] = (techCounts[t] || 0) + 1;
    }));
    const topTech = Object.entries(techCounts)
      .sort((a, b) => b[1] - a[1])[0];

    
    const topMember = [...team].sort((a, b) => b.completedTasks - a.completedTasks)[0];

    
    const catCounts = {};
    projects.forEach(p => {
      catCounts[p.category] = (catCounts[p.category] || 0) + 1;
    });
    const topCat = Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0];

    return {
      totalProjects:  projects.length,
      totalTasks:     tasks.length,
      totalTech:      allTech.size,
      totalMembers:   team.length,
      avgTeamSize,
      topTech:        topTech?.[0] || '—',
      topTechCount:   topTech?.[1] || 0,
      topMember:      topMember?.name.split(' ')[0] || '—',
      topMemberTasks: topMember?.completedTasks || 0,
      topCategory:    topCat?.[0] || '—',
      topCatCount:    topCat?.[1] || 0,
    };
  }

  
  function buildKPICards(stats) {
    const kpis = [
      {
        label: 'Total Projects',
        value: stats.totalProjects,
        icon:  'fa-solid fa-folder-open',
        color: 'var(--accent)',
        bg:    'var(--accent-light)',
        sub:   'All completed',
      },
      {
        label: 'Tasks Completed',
        value: stats.totalTasks,
        icon:  'fa-solid fa-circle-check',
        color: 'var(--color-success)',
        bg:    'var(--bg-success)',
        sub:   '100% completion rate',
      },
      {
        label: 'Technologies',
        value: stats.totalTech,
        icon:  'fa-solid fa-code',
        color: 'var(--color-warning)',
        bg:    'var(--bg-warning)',
        sub:   'Across all projects',
      },
      {
        label: 'Team Members',
        value: stats.totalMembers,
        icon:  'fa-solid fa-users',
        color: 'var(--color-info)',
        bg:    'var(--bg-info)',
        sub:   `Avg ${stats.avgTeamSize} per project`,
      },
    ];

    return kpis.map((k, i) => `
      <div class="stat-card anim-fade-in-up anim-delay-${i + 1}">
        <div class="stat-icon" style="background:${k.bg};color:${k.color};">
          <i class="${k.icon}"></i>
        </div>
        <div class="stat-body">
          <div class="stat-value" data-count="${k.value}"
            id="analytics-kpi-${i}">0</div>
          <div class="stat-label">${k.label}</div>
          <div class="stat-trend" style="color:var(--text-muted);">
            ${k.sub}
          </div>
        </div>
      </div>
    `).join('');
  }

  
  function buildContribution() {
    const team = [...AppData.team]
      .sort((a, b) => b.completedTasks - a.completedTasks);
    const maxTasks = team[0]?.completedTasks || 1;

    return team.map((m, i) => {
      const color = MEMBER_COLORS[i % MEMBER_COLORS.length];
      const pct   = (m.completedTasks / maxTasks) * 100;
      return `
        <div class="contribution-row">
          <!-- Avatar -->
          <div class="contribution-avatar"
            style="background:${color}22;color:${color};">
            ${m.initials}
          </div>
          <!-- Name -->
          <div class="contribution-name" title="${m.name}">${m.name.split(' ')[0]}</div>
          <!-- Bar -->
          <div class="contribution-bar-wrap">
            <div class="contribution-bar-fill"
              style="background:${color};"
              data-target="${pct}%">
            </div>
          </div>
          <!-- Count -->
          <div class="contribution-val">
            ${m.completedTasks} tasks
          </div>
        </div>
      `;
    }).join('');
  }

  
  function buildInsights(stats) {
    const insights = [
      {
        icon:  'fa-solid fa-trophy',
        bg:    'var(--bg-warning)',
        color: 'var(--color-warning)',
        label: 'Top Technology',
        value: stats.topTech,
        sub:   `Used in ${stats.topTechCount} projects`,
      },
      {
        icon:  'fa-solid fa-star',
        bg:    'var(--accent-light)',
        color: 'var(--accent)',
        label: 'Top Contributor',
        value: stats.topMember,
        sub:   `${stats.topMemberTasks} tasks completed`,
      },
      {
        icon:  'fa-solid fa-layer-group',
        bg:    'var(--bg-success)',
        color: 'var(--color-success)',
        label: 'Biggest Category',
        value: stats.topCategory,
        sub:   `${stats.topCatCount} projects`,
      },
    ];

    return insights.map((ins, i) => `
      <div class="insight-card anim-fade-in-up anim-delay-${i + 1}">
        <div class="insight-icon" style="background:${ins.bg};color:${ins.color};">
          <i class="${ins.icon}"></i>
        </div>
        <div>
          <div class="insight-label">${ins.label}</div>
          <div class="insight-value">${ins.value}</div>
          <div class="insight-sub">${ins.sub}</div>
        </div>
      </div>
    `).join('');
  }

  
  function render() {
    const page = Utils.qs('#page-analytics');
    if (!page) return;

    const stats        = computeStats();
    const monthly      = AppData.getMonthlyCompletions();
    const categories   = AppData.getCategoryStats();
    const technologies = AppData.getTechStats(8);

    page.innerHTML = `
      <!-- Page header -->
      <div class="analytics-header anim-fade-in">
        <h2>Analytics</h2>
        <p>Insights generated dynamically from your project data</p>
      </div>

      <!-- KPI Cards -->
      <div class="analytics-kpi-grid">
        ${buildKPICards(stats)}
      </div>

      <!-- Full-width: Monthly completions timeline -->
      <div class="card analytics-full-chart anim-fade-in-up anim-delay-2">
        <div class="chart-section-header">
          <div>
            <div class="chart-section-title">
              <i class="fa-solid fa-chart-line" style="color:var(--accent);"></i>
              Project Completions Timeline
            </div>
            <div class="chart-section-sub">
              Monthly completions from ${monthly[0]?.label || '—'} to ${monthly[monthly.length - 1]?.label || '—'}
            </div>
          </div>
          <span class="badge badge-accent">${AppData.projects.length} projects total</span>
        </div>
        <div id="analytics-area-chart" style="width:100%;"></div>
      </div>

      <!-- 2-column charts: donut + bar -->
      <div class="analytics-charts-grid">

        <!-- Category donut -->
        <div class="card anim-fade-in-up anim-delay-2">
          <div class="chart-section-header">
            <div>
              <div class="chart-section-title">
                <i class="fa-solid fa-chart-pie" style="color:var(--accent);"></i>
                Category Distribution
              </div>
              <div class="chart-section-sub">Projects grouped by type</div>
            </div>
          </div>
          <div id="analytics-donut-chart"></div>
        </div>

        <!-- Technology bar -->
        <div class="card anim-fade-in-up anim-delay-3">
          <div class="chart-section-header">
            <div>
              <div class="chart-section-title">
                <i class="fa-solid fa-chart-bar" style="color:var(--color-info);"></i>
                Technology Usage
              </div>
              <div class="chart-section-sub">Top 8 technologies by project count</div>
            </div>
          </div>
          <div id="analytics-bar-chart" style="width:100%;"></div>
        </div>

      </div>

      <!-- Team contribution bars -->
      <div class="card anim-fade-in-up anim-delay-2" style="margin-bottom:var(--space-6);">
        <div class="chart-section-header">
          <div>
            <div class="chart-section-title">
              <i class="fa-solid fa-users" style="color:var(--color-success);"></i>
              Team Contribution
            </div>
            <div class="chart-section-sub">Tasks completed per team member</div>
          </div>
        </div>
        <div class="contribution-list" id="contribution-list">
          ${buildContribution()}
        </div>
      </div>

      <!-- Key insights -->
      <div class="insights-grid">
        ${buildInsights(stats)}
      </div>
    `;

    

    
    const areaEl = Utils.qs('#analytics-area-chart');
    if (areaEl && monthly.length) {
      Charts.area(areaEl, monthly, {
        color:  Utils.getCSSVar('--accent') || '#6366f1',
        height: 200,
      });
    }

    
    const donutEl = Utils.qs('#analytics-donut-chart');
    if (donutEl && categories.length) {
      Charts.donut(donutEl, categories, {
        size:        180,
        centerLabel: String(AppData.projects.length),
      });
    }

    
    const barEl = Utils.qs('#analytics-bar-chart');
    if (barEl && technologies.length) {
      Charts.bar(barEl, technologies, {
        colors:    Charts.PALETTE,
        height:    200,
        showValues: true,
      });
    }

    
    Utils.qsa('[data-count]', Utils.qs('#page-analytics')).forEach((el, i) => {
      const target = parseInt(el.dataset.count, 10);
      setTimeout(() => Utils.animateCounter(el, target, 1200), i * 100);
    });

    
    setTimeout(() => {
      Utils.qsa('.contribution-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.target;
      });
    }, 200);
  }

  
  return {
    init() {
      render();
    }
  };

})();
