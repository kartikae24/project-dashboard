

const Topbar = (() => {

  
  const PAGE_TITLES = {
    dashboard: { title: 'Dashboard',       crumb: 'Home / Overview' },
    library:   { title: 'Project Library', crumb: 'Home / Projects' },
    details:   { title: 'Project Details', crumb: 'Home / Projects / Details' },
    team:      { title: 'Team Members',    crumb: 'Home / Team' },
    tasks:     { title: 'Tasks',           crumb: 'Home / Tasks' },
    calendar:  { title: 'Calendar',        crumb: 'Home / Calendar' },
    analytics: { title: 'Analytics',       crumb: 'Home / Analytics' },
    settings:  { title: 'Settings',        crumb: 'Home / Settings' },
  };

  
  function buildHTML() {
    return `
      <!-- Left: mobile menu button + page title -->
      <div class="flex items-center gap-3 flex-1">

        <!-- Hamburger menu — only visible on mobile -->
        <button class="topbar-btn" id="mobile-menu-btn" aria-label="Open Menu">
          <i class="fa-solid fa-bars"></i>
        </button>

        <!-- Page title area -->
        <div>
          <div class="topbar-title" id="topbar-title">Dashboard</div>
          <div class="topbar-breadcrumb" id="topbar-breadcrumb">Home / Overview</div>
        </div>
      </div>

      <!-- Right: search + actions -->
      <div class="topbar-actions">

        <!-- Search bar (hidden on mobile via CSS) -->
        <div class="topbar-search" role="search">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input
            type="text"
            id="global-search"
            placeholder="Search projects… (Ctrl+K)"
            aria-label="Global search"
          />
        </div>

        <!-- Dark/Light mode toggle -->
        <button class="topbar-btn" id="theme-toggle-btn" aria-label="Toggle Theme" data-tooltip="Toggle theme">
          <i class="fa-solid fa-moon" id="theme-icon"></i>
        </button>

        <!-- Notifications (decorative for now) -->
        <button class="topbar-btn" aria-label="Notifications" data-tooltip="Notifications" style="position:relative;">
          <i class="fa-solid fa-bell"></i>
          <!-- Notification dot -->
          <span style="
            position:absolute; top:6px; right:6px;
            width:7px; height:7px;
            background: var(--accent);
            border-radius:50%;
            border: 1.5px solid var(--bg-surface);
          "></span>
        </button>

      </div>
    `;
  }

  
  function setPage(pageId) {
    const titleEl = Utils.qs('#topbar-title');
    const crumbEl = Utils.qs('#topbar-breadcrumb');
    const info = PAGE_TITLES[pageId] || PAGE_TITLES['dashboard'];

    if (titleEl) titleEl.textContent = info.title;
    if (crumbEl) crumbEl.textContent = info.crumb;
  }

  
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const icon = Utils.qs('#theme-icon');
    if (icon) {
      
      icon.className = theme === 'dark'
        ? 'fa-solid fa-moon'
        : 'fa-solid fa-sun';
    }
  }

  
  function init(onNavigate) {
    const topbarEl = Utils.qs('.topbar');
    if (!topbarEl) return;

    
    topbarEl.innerHTML = buildHTML();

    
    const savedTheme = Store.get('theme');
    applyTheme(savedTheme);

    
    const themeBtn = Utils.qs('#theme-toggle-btn');
    themeBtn?.addEventListener('click', () => {
      const current = Store.get('theme');
      const next = current === 'dark' ? 'light' : 'dark';
      Store.set('theme', next);
      applyTheme(next);
    });

    
    const mobileMenuBtn = Utils.qs('#mobile-menu-btn');
    mobileMenuBtn?.addEventListener('click', () => {
      Sidebar.openMobile();
    });

    
    
    const searchInput = Utils.qs('#global-search');
    searchInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && searchInput.value.trim()) {
        
        onNavigate('library', { search: searchInput.value.trim() });
        searchInput.value = '';
      }
    });
  }

  
  return { init, setPage, applyTheme };

})();
