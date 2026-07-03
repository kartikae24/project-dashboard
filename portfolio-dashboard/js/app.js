




const PAGE_MODULES = {
  dashboard: typeof DashboardPage !== 'undefined' ? DashboardPage : null,
  library:   typeof LibraryPage   !== 'undefined' ? LibraryPage   : null,
  details:   typeof DetailsPage   !== 'undefined' ? DetailsPage   : null,
  team:      typeof TeamPage      !== 'undefined' ? TeamPage      : null,
  tasks:     typeof TasksPage     !== 'undefined' ? TasksPage     : null,
  calendar:  typeof CalendarPage  !== 'undefined' ? CalendarPage  : null,
  analytics: typeof AnalyticsPage !== 'undefined' ? AnalyticsPage : null,
  settings:  typeof SettingsPage  !== 'undefined' ? SettingsPage  : null,
};


const initializedPages = new Set();


function navigateTo(pageId, state = {}) {
  
  if (!Utils.qs(`#page-${pageId}`)) pageId = 'dashboard';

  
  Utils.qsa('.page-section').forEach(section => {
    section.classList.remove('active');
  });

  
  const targetPage = Utils.qs(`#page-${pageId}`);
  if (targetPage) {
    targetPage.classList.add('active');
  }

  
  Sidebar.setActive(pageId);

  
  Topbar.setPage(pageId);

  
  window.location.hash = pageId;

  
  Store.set('lastPage', pageId);

  
  
  
  
  const ALWAYS_REINIT = new Set(['details', 'dashboard', 'analytics']);

  if (!initializedPages.has(pageId) || ALWAYS_REINIT.has(pageId)) {
    const module = PAGE_MODULES[pageId];
    if (module && typeof module.init === 'function') {
      module.init(state);
      
      if (!ALWAYS_REINIT.has(pageId)) {
        initializedPages.add(pageId);
      }
    }
  } else if (state && Object.keys(state).length > 0) {
    
    const module = PAGE_MODULES[pageId];
    if (module && typeof module.update === 'function') {
      module.update(state);
    }
  }

  
  const pageContent = Utils.qs('.page-content');
  if (pageContent) pageContent.scrollTop = 0;
}


function applyPreferences() {
  const prefs = Store.getAll();
  const root  = document.documentElement;

  
  root.setAttribute('data-theme', prefs.theme);

  
  root.setAttribute('data-accent', prefs.accent === 'indigo' ? '' : prefs.accent);

  
  root.setAttribute('data-font-size', prefs.fontSize);

  
  root.setAttribute('data-animations', prefs.animations);
}


function initApp() {
  
  applyPreferences();

  
  Sidebar.init(navigateTo);

  
  Topbar.init(navigateTo);

  
  PAGE_MODULES.dashboard = typeof DashboardPage !== 'undefined' ? DashboardPage : null;
  PAGE_MODULES.library   = typeof LibraryPage   !== 'undefined' ? LibraryPage   : null;
  PAGE_MODULES.details   = typeof DetailsPage   !== 'undefined' ? DetailsPage   : null;
  PAGE_MODULES.team      = typeof TeamPage       !== 'undefined' ? TeamPage      : null;
  PAGE_MODULES.tasks     = typeof TasksPage      !== 'undefined' ? TasksPage     : null;
  PAGE_MODULES.calendar  = typeof CalendarPage   !== 'undefined' ? CalendarPage  : null;
  PAGE_MODULES.analytics = typeof AnalyticsPage  !== 'undefined' ? AnalyticsPage : null;
  PAGE_MODULES.settings  = typeof SettingsPage   !== 'undefined' ? SettingsPage  : null;

  
  const hashPage  = window.location.hash.replace('#', '');
  
  const knownPages = Object.keys(PAGE_MODULES);
  const validHash  = knownPages.includes(hashPage) ? hashPage : '';
  const startPage  = validHash || Store.get('lastPage') || 'dashboard';
  navigateTo(startPage);

  
  window.addEventListener('hashchange', () => {
    const page = window.location.hash.replace('#', '');
    
    if (page && knownPages.includes(page)) navigateTo(page);
  });

  
  const overlay = Utils.qs('.sidebar-overlay');
  overlay?.addEventListener('click', () => {
    Sidebar.closeMobile();
  });

  
  document.addEventListener('keydown', (e) => {
    const tag = document.activeElement?.tagName;
    const isTyping = (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT');

    
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      const searchInput = Utils.qs('#global-search');
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      }
    }

    
    if (e.key === 'Escape') {
      if (isTyping) {
        document.activeElement.blur();
      }
      
      const drawer = Utils.qs('#member-drawer');
      if (drawer?.classList.contains('open')) {
        Utils.qs('#drawer-close-btn')?.click();
      }
      
      const calModal = Utils.qs('#cal-modal-backdrop');
      if (calModal) {
        Utils.qs('#cal-modal-close')?.click();
      }
    }
  });
}


document.addEventListener('DOMContentLoaded', initApp);

