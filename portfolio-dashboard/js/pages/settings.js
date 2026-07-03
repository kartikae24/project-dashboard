

const SettingsPage = (() => {

  
  const ACCENTS = [
    { id: 'indigo',  label: 'Indigo',  hex: '#6366f1' },
    { id: 'violet',  label: 'Violet',  hex: '#8b5cf6' },
    { id: 'cyan',    label: 'Cyan',    hex: '#06b6d4' },
    { id: 'emerald', label: 'Emerald', hex: '#10b981' },
    { id: 'rose',    label: 'Rose',    hex: '#f43f5e' },
    { id: 'amber',   label: 'Amber',   hex: '#f59e0b' },
  ];

  
  
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    Store.set('theme', theme);
    showSaved('Theme updated');
  }

  function applyAccent(accentId) {
    const val = accentId === 'indigo' ? '' : accentId;
    document.documentElement.setAttribute('data-accent', val);
    Store.set('accent', accentId);

    
    Utils.qsa('.accent-swatch').forEach(s => {
      s.classList.toggle('active', s.dataset.accent === accentId);
    });
    showSaved('Accent color updated');
  }

  function applyFontSize(size) {
    document.documentElement.setAttribute('data-font-size', size);
    Store.set('fontSize', size);

    
    Utils.qsa('.font-size-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.size === size);
    });
    showSaved('Font size updated');
  }

  function applyAnimations(enabled) {
    const val = enabled ? 'on' : 'off';
    document.documentElement.setAttribute('data-animations', val);
    Store.set('animations', val);
    showSaved(`Animations turned ${enabled ? 'on' : 'off'}`);
  }

  function applySidebar(expanded) {
    const val = expanded ? 'expanded' : 'collapsed';
    Store.set('sidebar', val);
    
    const sidebar = Utils.qs('#sidebar');
    if (sidebar) {
      if (expanded) {
        sidebar.classList.remove('collapsed');
      } else {
        sidebar.classList.add('collapsed');
      }
    }
    showSaved(`Sidebar set to ${val}`);
  }

  
  function showSaved(msg = 'Settings saved') {
    Utils.toast(msg, 'success', 2500);
  }

  
  function buildThemeCards(currentTheme) {
    return `
        <!-- Dark theme card -->
        <div class="theme-option ${currentTheme === 'dark' ? 'active' : ''}"
          data-theme="dark" id="theme-dark-card" role="button" tabindex="0"
          aria-label="Switch to dark theme">
          <div class="theme-preview theme-preview-dark">
            <div class="theme-preview-bar"></div>
            <div class="theme-preview-main"></div>
          </div>
          <div class="theme-option-label">
            <span>Dark</span>
            ${currentTheme === 'dark' ? '<i class="fa-solid fa-check" style="color:var(--accent);font-size:11px;"></i>' : ''}
          </div>
        </div>

        <!-- Light theme card -->
        <div class="theme-option ${currentTheme === 'light' ? 'active' : ''}"
          data-theme="light" id="theme-light-card" role="button" tabindex="0"
          aria-label="Switch to light theme">
          <div class="theme-preview theme-preview-light">
            <div class="theme-preview-bar"></div>
            <div class="theme-preview-main"></div>
          </div>
          <div class="theme-option-label">
            <span>Light</span>
            ${currentTheme === 'light' ? '<i class="fa-solid fa-check" style="color:var(--accent);font-size:11px;"></i>' : ''}
          </div>
        </div>
    `;
  }

  
  function buildAccentSwatches(currentAccent) {
    return `
      <div class="accent-swatches">
        ${ACCENTS.map(a => `
          <div class="accent-swatch ${currentAccent === a.id ? 'active' : ''}"
            data-accent="${a.id}"
            style="background: ${a.hex};"
            title="${a.label}"
            role="button"
            tabindex="0"
            aria-label="${a.label} accent color"
          ></div>
        `).join('')}
      </div>
    `;
  }

  
  function buildFontSizeBtns(currentSize) {
    const sizes = [
      { id: 'sm', label: 'S' },
      { id: 'md', label: 'M' },
      { id: 'lg', label: 'L' },
    ];
    return `
      <div class="font-size-btns">
        ${sizes.map(s => `
          <button class="font-size-btn ${currentSize === s.id ? 'active' : ''}"
            data-size="${s.id}"
            aria-label="Font size ${s.label}"
          >${s.label}</button>
        `).join('')}
      </div>
    `;
  }

  
  function buildPreview() {
    return `
      <div class="settings-preview-card">
        <div class="settings-preview-header">
          <i class="fa-solid fa-eye" style="color:var(--accent);margin-right:6px;"></i>
          Live Preview
        </div>
        <div class="settings-preview-body">

          <!-- Mini stat card preview -->
          <div style="display:flex;align-items:center;gap:10px;
                      background:var(--bg-surface);border:1px solid var(--border);
                      border-radius:var(--radius-md);padding:10px;">
            <div style="width:32px;height:32px;border-radius:var(--radius-sm);
                        background:var(--accent-light);color:var(--accent);
                        display:flex;align-items:center;justify-content:center;">
              <i class="fa-solid fa-folder-open" style="font-size:13px;"></i>
            </div>
            <div>
              <div style="font-size:18px;font-weight:700;color:var(--text-primary);line-height:1;">${AppData.projects.length}</div>
              <div style="font-size:11px;color:var(--text-muted);">Projects</div>
            </div>
          </div>

          <!-- Mini project card preview -->
          <div class="preview-mini-card">
            <div class="preview-mini-title">Data Visualization Dashboard</div>
            <div class="preview-mini-bar">
              <div class="preview-mini-fill"></div>
            </div>
            <div style="display:flex;justify-content:space-between;margin-top:6px;">
              <span style="font-size:10px;color:var(--text-muted);">Completed</span>
              <span class="badge badge-success" style="font-size:10px;padding:1px 6px;">100%</span>
            </div>
          </div>

          <!-- Color palette row -->
          <div>
            <div style="font-size:11px;color:var(--text-muted);margin-bottom:8px;">Current Accent</div>
            <div class="preview-colors">
              <div class="preview-color-dot" style="background:var(--accent);"></div>
              <div class="preview-color-dot" style="background:var(--accent-light);border:1px solid var(--accent);"></div>
              <div class="preview-color-dot" style="background:var(--bg-card);border:1px solid var(--border);"></div>
              <div class="preview-color-dot" style="background:var(--bg-surface);border:1px solid var(--border);"></div>
            </div>
          </div>

          <!-- Typography sample -->
          <div style="border-top:1px solid var(--border);padding-top:12px;">
            <div style="font-size:var(--font-size-sm);font-weight:600;color:var(--text-primary);">
              Project Management
            </div>
            <div style="font-size:var(--font-size-xs);color:var(--text-muted);margin-top:2px;">
              Inter · Current font size
            </div>
          </div>

        </div>
      </div>
    `;
  }

  
  function render() {
    const page = Utils.qs('#page-settings');
    if (!page) return;

    
    const prefs = Store.getAll();

    page.innerHTML = `
      <!-- Page header -->
      <div class="settings-header anim-fade-in">
        <h2>Settings</h2>
        <p>Customize the look and feel of your dashboard. Changes apply instantly.</p>
      </div>

      <!-- Two-column layout: settings left, preview right -->
      <div class="settings-layout">

        <!-- ── Left: Settings groups ─────────── -->
        <div>

          <!-- Theme -->
          <div class="settings-card anim-fade-in-up anim-delay-1">
            <div class="settings-card-title">
              <i class="fa-solid fa-circle-half-stroke"></i>
              Appearance
            </div>

            <!-- Theme: dark / light -->
            <div class="settings-row">
              <div class="settings-row-label">
                <strong>Theme</strong>
                <span>Choose between dark or light interface</span>
              </div>
              <div class="theme-options">
                ${buildThemeCards(prefs.theme)}
              </div>
            </div>

            <!-- Accent color -->
            <div class="settings-row">
              <div class="settings-row-label">
                <strong>Accent Color</strong>
                <span>Controls buttons, highlights, and active states</span>
              </div>
              ${buildAccentSwatches(prefs.accent)}
            </div>

            <!-- Font size -->
            <div class="settings-row">
              <div class="settings-row-label">
                <strong>Font Size</strong>
                <span>Adjust the base text size across the dashboard</span>
              </div>
              ${buildFontSizeBtns(prefs.fontSize)}
            </div>

          </div>

          <!-- Behavior -->
          <div class="settings-card anim-fade-in-up anim-delay-2">
            <div class="settings-card-title">
              <i class="fa-solid fa-sliders"></i>
              Behavior
            </div>

            <!-- Animations toggle -->
            <div class="settings-row">
              <div class="settings-row-label">
                <strong>Animations</strong>
                <span>Enable smooth transitions and entrance animations</span>
              </div>
              <label class="toggle-switch" aria-label="Toggle animations">
                <input
                  type="checkbox"
                  id="toggle-animations"
                  ${prefs.animations === 'on' ? 'checked' : ''}
                />
                <span class="toggle-slider"></span>
              </label>
            </div>

            <!-- Sidebar default state -->
            <div class="settings-row">
              <div class="settings-row-label">
                <strong>Sidebar Default</strong>
                <span>Start with sidebar expanded or collapsed</span>
              </div>
              <label class="toggle-switch" aria-label="Toggle sidebar default">
                <input
                  type="checkbox"
                  id="toggle-sidebar"
                  ${prefs.sidebar === 'expanded' ? 'checked' : ''}
                />
                <span class="toggle-slider"></span>
              </label>
            </div>

          </div>

          <!-- About -->
          <div class="settings-card anim-fade-in-up anim-delay-3">
            <div class="settings-card-title">
              <i class="fa-solid fa-circle-info"></i>
              About
            </div>

            <div class="settings-row">
              <div class="settings-row-label">
                <strong>Project</strong>
              </div>
              <span style="font-size:var(--font-size-sm);color:var(--text-secondary);">
                Project Management Dashboard
              </span>
            </div>

            <div class="settings-row">
              <div class="settings-row-label">
                <strong>Version</strong>
              </div>
              <span class="badge badge-accent">v1.0.0</span>
            </div>

            <div class="settings-row">
              <div class="settings-row-label">
                <strong>Tech Stack</strong>
              </div>
              <div style="display:flex;gap:4px;flex-wrap:wrap;justify-content:flex-end;">
                <span class="badge badge-default">HTML5</span>
                <span class="badge badge-default">CSS3</span>
                <span class="badge badge-default">Vanilla JS</span>
              </div>
            </div>

            <div class="settings-row">
              <div class="settings-row-label">
                <strong>Total Projects</strong>
              </div>
              <span style="font-size:var(--font-size-sm);color:var(--text-secondary);">
                ${AppData.projects.length} completed projects
              </span>
            </div>

            <div class="settings-row">
              <div class="settings-row-label">
                <strong>Team Size</strong>
              </div>
              <span style="font-size:var(--font-size-sm);color:var(--text-secondary);">
                ${AppData.team.length} members
              </span>
            </div>

          </div>

          <!-- Danger zone: reset -->
          <div class="settings-card danger-zone anim-fade-in-up anim-delay-4">
            <div class="settings-card-title">
              <i class="fa-solid fa-triangle-exclamation"></i>
              Danger Zone
            </div>

            <div class="settings-row">
              <div class="settings-row-label">
                <strong>Reset All Settings</strong>
                <span>
                  Restores theme, accent, font size, and all preferences back to defaults.
                  This cannot be undone.
                </span>
              </div>
              <button class="btn btn-secondary" id="btn-reset-settings"
                style="border-color:var(--color-danger);color:var(--color-danger);flex-shrink:0;">
                <i class="fa-solid fa-rotate-left"></i>
                Reset
              </button>
            </div>

          </div>

          <!-- Saved feedback message -->
          <div style="text-align:right;min-height:24px;margin-top:-12px;">
            <span id="settings-saved-msg" class="settings-saved-msg"
              style="opacity:0;transition:opacity 0.3s ease;">
            </span>
          </div>

        </div>
        <!-- end left column -->

        <!-- ── Right: Live preview ────────────── -->
        <div class="anim-fade-in-up anim-delay-2">
          ${buildPreview()}
        </div>

      </div>
      <!-- end settings-layout -->
    `;

    

    
    const themeContainer = Utils.qs('.theme-options');
    themeContainer?.addEventListener('click', (e) => {
      const card = e.target.closest('.theme-option');
      if (!card) return;
      const theme = card.dataset.theme;
      applyTheme(theme);
      themeContainer.innerHTML = buildThemeCards(theme);
    });

    themeContainer?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const card = e.target.closest('.theme-option');
        if (!card) return;
        e.preventDefault();
        const theme = card.dataset.theme;
        applyTheme(theme);
        themeContainer.innerHTML = buildThemeCards(theme);
      }
    });

    
    Utils.qsa('.accent-swatch').forEach(swatch => {
      const activate = () => applyAccent(swatch.dataset.accent);
      swatch.addEventListener('click', activate);
      swatch.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); } });
    });

    
    Utils.qsa('.font-size-btn').forEach(btn => {
      btn.addEventListener('click', () => applyFontSize(btn.dataset.size));
    });

    
    Utils.qs('#toggle-animations')?.addEventListener('change', (e) => {
      applyAnimations(e.target.checked);
    });

    
    Utils.qs('#toggle-sidebar')?.addEventListener('change', (e) => {
      applySidebar(e.target.checked);
    });

    
    Utils.qs('#btn-reset-settings')?.addEventListener('click', () => {
      if (confirm('Reset all settings to defaults? This cannot be undone.')) {
        Store.reset();
        
        const defaults = Store.DEFAULTS;
        document.documentElement.setAttribute('data-theme',      defaults.theme);
        document.documentElement.setAttribute('data-accent',     '');
        document.documentElement.setAttribute('data-font-size',  defaults.fontSize);
        document.documentElement.setAttribute('data-animations', defaults.animations);
        
        render();
        showSaved('All settings reset to defaults');
      }
    });
  }

  
  return {
    init() {
      render();
    }
  };

})();
