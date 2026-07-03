

const Sidebar = (() => {

  
  
  const NAV_ITEMS = [
    {
      section: 'Main',
      items: [
        { id: 'dashboard', label: 'Dashboard',       icon: 'fa-solid fa-chart-pie' },
        { id: 'library',   label: 'Project Library', icon: 'fa-solid fa-folder-open' },
        { id: 'team',      label: 'Team Members',    icon: 'fa-solid fa-users' },
        { id: 'tasks',     label: 'Tasks',           icon: 'fa-solid fa-list-check' },
      ]
    },
    {
      section: 'Insights',
      items: [
        { id: 'calendar',  label: 'Calendar',   icon: 'fa-solid fa-calendar-days' },
        { id: 'analytics', label: 'Analytics',  icon: 'fa-solid fa-chart-line' },
      ]
    },
    {
      section: 'System',
      items: [
        { id: 'settings', label: 'Settings', icon: 'fa-solid fa-gear' },
      ]
    }
  ];

  
  function buildHTML() {
    
    const navHTML = NAV_ITEMS.map(section => `
      <div class="nav-section-label">${section.section}</div>
      ${section.items.map(item => `
        <div class="nav-item" data-page="${item.id}" id="nav-${item.id}" role="button" tabindex="0" aria-label="${item.label}">
          <i class="${item.icon}"></i>
          <span>${item.label}</span>
        </div>
      `).join('')}
    `).join('');

    return `
      <!-- Sidebar Header: logo + brand name -->
      <div class="sidebar-header">
        <div class="sidebar-logo">
          <i class="fa-solid fa-layer-group"></i>
        </div>
        <span class="sidebar-brand">Project Management</span>
      </div>

      <!-- Navigation Links -->
      <nav class="sidebar-nav" role="navigation" aria-label="Main Navigation">
        ${navHTML}
      </nav>

      <!-- Footer: collapse toggle button -->
      <div class="sidebar-footer">
        <button class="sidebar-toggle" id="sidebar-toggle-btn" aria-label="Toggle Sidebar">
          <i class="fa-solid fa-chevron-left"></i>
        </button>
        <span class="sidebar-footer-text">Collapse sidebar</span>
      </div>
    `;
  }

  
  function setActive(pageId) {
    
    Utils.qsa('.nav-item').forEach(item => item.classList.remove('active'));
    
    const activeItem = Utils.qs(`#nav-${pageId}`);
    if (activeItem) activeItem.classList.add('active');
  }

  
  function toggleCollapse() {
    const sidebar = Utils.qs('.sidebar');
    sidebar.classList.toggle('collapsed');
    const isCollapsed = sidebar.classList.contains('collapsed');
    
    Store.set('sidebar', isCollapsed ? 'collapsed' : 'expanded');
  }

  
  function openMobile() {
    const sidebar = Utils.qs('.sidebar');
    const overlay = Utils.qs('.sidebar-overlay');
    sidebar.classList.add('mobile-open');
    overlay?.classList.add('visible');
  }

  
  function closeMobile() {
    const sidebar = Utils.qs('.sidebar');
    const overlay = Utils.qs('.sidebar-overlay');
    sidebar.classList.remove('mobile-open');
    overlay?.classList.remove('visible');
  }

  
  function init(onNavigate) {
    const sidebarEl = Utils.qs('.sidebar');
    if (!sidebarEl) return;

    
    sidebarEl.innerHTML = buildHTML();

    
    const savedState = Store.get('sidebar');
    if (savedState === 'collapsed') {
      sidebarEl.classList.add('collapsed');
    }

    
    
    sidebarEl.addEventListener('click', (e) => {
      const navItem = e.target.closest('.nav-item');
      if (navItem) {
        const pageId = navItem.dataset.page;
        if (pageId) {
          onNavigate(pageId);        
          closeMobile();             
        }
      }

      
      if (e.target.closest('#sidebar-toggle-btn')) {
        toggleCollapse();
      }
    });

    
    sidebarEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const navItem = e.target.closest('.nav-item');
        if (navItem) {
          e.preventDefault();
          navItem.click();
        }
      }
    });
  }

  
  return { init, setActive, openMobile, closeMobile };

})();
