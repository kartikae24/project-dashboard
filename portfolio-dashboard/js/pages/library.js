

const LibraryPage = (() => {

  
  
  let state = {
    query:    '',          
    category: 'all',       
    tech:     'all',       
    sort:     'name-asc',  
    view:     'grid',      
  };

  
  
  const CATEGORY_GRADIENTS = {
    'Data & Analytics': 'linear-gradient(135deg, #6366f1, #06b6d4)',
    'Web Application':  'linear-gradient(135deg, #10b981, #06b6d4)',
    'UI Design':        'linear-gradient(135deg, #f43f5e, #f59e0b)',
    'Productivity':     'linear-gradient(135deg, #8b5cf6, #6366f1)',
    'Web Design':       'linear-gradient(135deg, #ec4899, #8b5cf6)',
    'Game':             'linear-gradient(135deg, #f59e0b, #f43f5e)',
  };

  
  const CATEGORY_ICONS = {
    'Data & Analytics': 'fa-solid fa-chart-bar',
    'Web Application':  'fa-solid fa-globe',
    'UI Design':        'fa-solid fa-pen-ruler',
    'Productivity':     'fa-solid fa-bolt',
    'Web Design':       'fa-solid fa-palette',
    'Game':             'fa-solid fa-gamepad',
  };

  
  function getFilteredProjects() {
    let list = [...AppData.projects];
    const q = state.query.toLowerCase().trim();

    
    if (q) {
      list = list.filter(p =>
        p.name.toLowerCase().includes(q)        ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q)) ||
        p.technologies.some(t => t.toLowerCase().includes(q))
      );
    }

    
    if (state.category !== 'all') {
      list = list.filter(p => p.category === state.category);
    }

    
    if (state.tech !== 'all') {
      list = list.filter(p =>
        p.technologies.some(t => t === state.tech)
      );
    }

    
    switch (state.sort) {
      case 'name-asc':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        list.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'date-desc':
        list.sort((a, b) => new Date(b.completionDate) - new Date(a.completionDate));
        break;
      case 'date-asc':
        list.sort((a, b) => new Date(a.completionDate) - new Date(b.completionDate));
        break;
      case 'category':
        list.sort((a, b) => a.category.localeCompare(b.category));
        break;
    }

    return list;
  }

  
  function getCategories() {
    return [...new Set(AppData.projects.map(p => p.category))].sort();
  }

  function getTechnologies() {
    const all = AppData.projects.flatMap(p => p.technologies);
    return [...new Set(all)].sort();
  }

  
  function buildAvatarStack(teamIds) {
    const members = teamIds.slice(0, 3).map(id => AppData.getMember(id)).filter(Boolean);
    const extra = teamIds.length - 3;
    let html = '<div class="avatar-stack">';
    members.forEach(m => {
      html += `
        <div class="avatar avatar-sm" title="${m.name}" style="background:var(--accent-light);color:var(--accent);">
          ${m.initials}
        </div>
      `;
    });
    if (extra > 0) {
      html += `
        <div class="avatar avatar-sm" style="background:var(--bg-card-hover);color:var(--text-muted);">
          +${extra}
        </div>
      `;
    }
    html += '</div>';
    return html;
  }

  
  function buildTechTags(technologies, max = 4) {
    const visible = technologies.slice(0, max);
    const extra   = technologies.length - max;
    let html = visible.map(tech => {
      const color = Utils.getTagColor(tech);
      return `
        <span class="proj-tech-tag"
          style="background:${color.bg};color:${color.text};">
          ${tech}
        </span>
      `;
    }).join('');
    if (extra > 0) {
      html += `
        <span class="proj-tech-tag"
          style="background:var(--bg-card-hover);color:var(--text-muted);">
          +${extra}
        </span>
      `;
    }
    return html;
  }

  
  function hi(text) {
    return Utils.highlight(text, state.query);
  }

  
  function buildCard(project, index) {
    const gradient = CATEGORY_GRADIENTS[project.category]
      || 'linear-gradient(135deg, #6366f1, #8b5cf6)';
    const icon = CATEGORY_ICONS[project.category] || 'fa-solid fa-folder';
    const members = buildAvatarStack(project.teamIds);
    const tags = buildTechTags(project.technologies, 3);
    const delay = Math.min(index + 1, 8);

    return `
      <div
        class="proj-card anim-delay-${delay}"
        data-project-id="${project.id}"
        role="button"
        tabindex="0"
        aria-label="View ${project.name}"
      >
        <!-- Gradient color cover -->
        <div class="proj-card-cover" style="background:${gradient};">
          <!-- Category badge -->
          <span class="proj-category-badge">${project.category}</span>
          <!-- Delete button -->
          <button class="btn-card-delete" data-action="delete" title="Delete Project" style="position:absolute;top:10px;right:10px;z-index:10;width:28px;height:28px;border-radius:50%;background:rgba(20,20,30,0.6);backdrop-filter:blur(4px);color:var(--text-primary);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all var(--transition-fast);" onmouseover="this.style.background='var(--color-danger)';this.style.color='white';this.style.borderColor='var(--color-danger)';" onmouseout="this.style.background='rgba(20,20,30,0.6)';this.style.color='var(--text-primary)';this.style.borderColor='var(--border)';"><i class="fa-solid fa-trash" style="font-size:11px;"></i></button>
          <!-- Big faded icon -->
          <i class="proj-card-cover-icon ${icon}"></i>
        </div>

        <!-- Card body -->
        <div class="proj-card-body">
          <div class="proj-card-name">${hi(project.name)}</div>
          <div class="proj-card-desc">${Utils.truncate(hi(project.description), 90)}</div>
          <!-- Tech tags -->
          <div class="proj-card-tags">${tags}</div>
        </div>

        <!-- Card footer: avatars + date -->
        <div class="proj-card-footer">
          ${members}
          <span class="proj-card-date">
            <i class="fa-regular fa-calendar"></i>
            ${Utils.formatDate(project.completionDate, 'short')}
          </span>
        </div>
      </div>
    `;
  }

  
  function buildListRow(project, index) {
    const gradient = CATEGORY_GRADIENTS[project.category]
      || 'linear-gradient(135deg, #6366f1, #8b5cf6)';
    const delay = Math.min(index + 1, 8);
    const tags = buildTechTags(project.technologies, 2);

    
    const indicatorColor = project.category === 'Data & Analytics' ? '#6366f1'
      : project.category === 'Web Application'  ? '#10b981'
      : project.category === 'UI Design'        ? '#f43f5e'
      : project.category === 'Productivity'     ? '#8b5cf6'
      : project.category === 'Web Design'       ? '#ec4899'
      : project.category === 'Game'             ? '#f59e0b'
      : '#6366f1';

    return `
      <div
        class="proj-list-row anim-delay-${delay}"
        data-project-id="${project.id}"
        role="button"
        tabindex="0"
        aria-label="View ${project.name}"
      >
        <!-- Left color indicator -->
        <div class="proj-list-indicator" style="background:${indicatorColor};"></div>

        <!-- Name + description -->
        <div class="proj-list-info">
          <div class="proj-list-name">${hi(project.name)}</div>
          <div class="proj-list-desc">${project.description}</div>
        </div>

        <!-- Tech tags -->
        <div class="proj-list-tech">${tags}</div>

        <!-- Category badge -->
        <div class="proj-list-category">
          <span class="badge badge-accent">${project.category}</span>
        </div>

        <!-- Mini progress bar -->
        <div class="proj-list-progress">
          <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
            <span style="font-size:10px;color:var(--text-muted);">Progress</span>
            <span style="font-size:10px;font-weight:600;color:var(--text-primary);">${project.progress}%</span>
          </div>
          <div class="progress-bar-wrap">
            <div class="progress-bar-fill"
              style="width:${project.progress}%;background:var(--color-success);">
            </div>
          </div>
        </div>

        <!-- Completion date -->
        <div class="proj-list-date">
          ${Utils.formatDate(project.completionDate, 'short')}
        </div>

        <!-- Delete button -->
        <button class="btn-list-delete" data-action="delete" title="Delete Project" style="margin-right:12px;width:28px;height:28px;border-radius:50%;background:none;color:var(--text-muted);border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all var(--transition-fast);" onmouseover="this.style.color='var(--color-danger)';this.style.background='var(--bg-card-hover)';" onmouseout="this.style.color='var(--text-muted)';this.style.background='none';"><i class="fa-solid fa-trash" style="font-size:12px;"></i></button>

        <!-- Arrow -->
        <i class="fa-solid fa-chevron-right" style="color:var(--text-muted);font-size:12px;flex-shrink:0;"></i>
      </div>
    `;
  }

  
  function renderProjects() {
    const projects = getFilteredProjects();
    const container = Utils.qs('#lib-projects-container');
    const countEl   = Utils.qs('#lib-count');
    if (!container) return;

    
    if (countEl) {
      countEl.textContent = `${projects.length} project${projects.length !== 1 ? 's' : ''}`;
    }

    
    if (!projects.length) {
      container.innerHTML = `
        <div class="lib-empty">
          <div class="lib-empty-icon"><i class="fa-solid fa-folder-open"></i></div>
          <div class="lib-empty-title">No projects found</div>
          <div class="lib-empty-desc">
            Try adjusting your search or filters to find what you're looking for.
          </div>
          <button class="btn btn-secondary" id="lib-clear-btn">
            <i class="fa-solid fa-xmark"></i> Clear Filters
          </button>
        </div>
      `;
      
      Utils.qs('#lib-clear-btn')?.addEventListener('click', clearFilters);
      return;
    }

    
    if (state.view === 'list') {
      container.className = 'lib-list';
      container.innerHTML = projects.map((p, i) => buildListRow(p, i)).join('');
    } else if (state.view === 'card') {
      container.className = 'lib-cards';
      container.innerHTML = projects.map((p, i) => buildCard(p, i)).join('');
    } else {
      
      container.className = 'lib-grid';
      container.innerHTML = projects.map((p, i) => buildCard(p, i)).join('');
    }

    
    
    container.addEventListener('click', handleCardClick);
    container.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        const card = e.target.closest('[data-project-id]');
        if (card) {
          e.preventDefault();
          openProject(card.dataset.projectId);
        }
      }
    });
  }

  
  function handleCardClick(e) {
    const deleteBtn = e.target.closest('[data-action="delete"]');
    if (deleteBtn) {
      e.stopPropagation();
      const card = deleteBtn.closest('[data-project-id]');
      if (card) {
        const projectId = card.dataset.projectId;
        const project = AppData.getProject(projectId);
        if (project) {
          if (confirm(`Are you sure you want to delete "${project.name}"?\nThis will also delete all tasks associated with this project.`)) {
            AppData.deleteProject(projectId);
            Utils.toast('Project deleted successfully!', 'success');
            renderProjects();
          }
        }
      }
      return;
    }

    const card = e.target.closest('[data-project-id]');
    if (card) {
      openProject(card.dataset.projectId);
    }
  }

  
  function openProject(projectId) {
    
    sessionStorage.setItem('selectedProject', projectId);
    navigateTo('details', { projectId });
  }

  
  function clearFilters() {
    state.query    = '';
    state.category = 'all';
    state.tech     = 'all';

    
    const searchEl   = Utils.qs('#lib-search-input');
    const catEl      = Utils.qs('#lib-filter-category');
    const techEl     = Utils.qs('#lib-filter-tech');
    if (searchEl) searchEl.value = '';
    if (catEl)    catEl.value    = 'all';
    if (techEl)   techEl.value   = 'all';

    renderProjects();
  }

  
  function buildToolbar() {
    const categories   = getCategories();
    const technologies = getTechnologies();

    const catOptions = categories.map(c =>
      `<option value="${c}">${c}</option>`
    ).join('');

    const techOptions = technologies.map(t =>
      `<option value="${t}">${t}</option>`
    ).join('');

    return `
      <!-- Search input -->
      <div class="lib-search">
        <i class="fa-solid fa-magnifying-glass"></i>
        <input
          type="text"
          id="lib-search-input"
          placeholder="Search projects, tags, technologies..."
          aria-label="Search projects"
        />
      </div>

      <!-- Category filter -->
      <select class="lib-filter-select" id="lib-filter-category" aria-label="Filter by category">
        <option value="all">All Categories</option>
        ${catOptions}
      </select>

      <!-- Technology filter -->
      <select class="lib-filter-select" id="lib-filter-tech" aria-label="Filter by technology">
        <option value="all">All Technologies</option>
        ${techOptions}
      </select>

      <!-- Sort -->
      <select class="lib-filter-select" id="lib-filter-sort" aria-label="Sort projects">
        <option value="name-asc">Name A–Z</option>
        <option value="name-desc">Name Z–A</option>
        <option value="date-asc">Oldest First</option>
        <option value="category">By Category</option>
      </select>

      <!-- Results count -->
      <span class="lib-count" id="lib-count">${AppData.projects.length} projects</span>

      <!-- View mode toggle -->
      <div class="view-toggle" role="group" aria-label="View mode">
        <button class="view-toggle-btn active" data-view="grid"
          aria-label="Grid view" id="view-btn-grid">
          <i class="fa-solid fa-grip"></i>
        </button>
        <button class="view-toggle-btn" data-view="card"
          aria-label="Card view" id="view-btn-card">
          <i class="fa-solid fa-table-cells-large"></i>
        </button>
        <button class="view-toggle-btn" data-view="list"
          aria-label="List view" id="view-btn-list">
          <i class="fa-solid fa-list"></i>
        </button>
      </div>
    `;
  }

  
  function bindEvents() {
    
    const searchInput = Utils.qs('#lib-search-input');
    searchInput?.addEventListener('input', Utils.debounce((e) => {
      state.query = e.target.value;
      renderProjects();
    }, 250));

    
    const catSelect = Utils.qs('#lib-filter-category');
    catSelect?.addEventListener('change', (e) => {
      state.category = e.target.value;
      renderProjects();
    });

    
    const techSelect = Utils.qs('#lib-filter-tech');
    techSelect?.addEventListener('change', (e) => {
      state.tech = e.target.value;
      renderProjects();
    });

    
    const sortSelect = Utils.qs('#lib-filter-sort');
    sortSelect?.addEventListener('change', (e) => {
      state.sort = e.target.value;
      renderProjects();
    });

    
    const viewToggle = Utils.qs('.view-toggle');
    viewToggle?.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-view]');
      if (!btn) return;
      const view = btn.dataset.view;

      
      Utils.qsa('.view-toggle-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      
      state.view = view;
      renderProjects();
    });

    
    Utils.qs('#btn-add-project')?.addEventListener('click', openAddProjectModal);
  }

  
  function openAddProjectModal() {
    const container = Utils.qs('#modal-container');
    if (!container) return;

    container.innerHTML = `
      <div class="modal-backdrop" id="project-modal-backdrop">
        <div class="modal-box" style="max-width: 580px;">
          <div class="modal-header">
            <h3 class="modal-title"><i class="fa-solid fa-folder-plus" style="color:var(--accent);margin-right:8px;"></i>Add New Project</h3>
            <button class="modal-close" id="project-modal-close" style="background:none;border:none;cursor:pointer;" aria-label="Close modal">&times;</button>
          </div>
          <form id="add-project-form">
            <div style="margin-bottom:var(--space-4);">
              <label style="display:block;font-size:var(--font-size-xs);font-weight:600;margin-bottom:6px;color:var(--text-secondary);" for="proj-name">Project Name *</label>
              <input type="text" id="proj-name" class="input" required placeholder="e.g. Portfolio Website" />
            </div>
            
            <div style="display:flex;gap:var(--space-4);margin-bottom:var(--space-4);">
              <div style="flex:1;">
                <label style="display:block;font-size:var(--font-size-xs);font-weight:600;margin-bottom:6px;color:var(--text-secondary);" for="proj-category">Category</label>
                <select id="proj-category" class="input select">
                  <option value="Web Application">Web Application</option>
                  <option value="Data & Analytics">Data & Analytics</option>
                  <option value="UI Design">UI Design</option>
                  <option value="Productivity">Productivity</option>
                  <option value="Web Design">Web Design</option>
                  <option value="Game">Game</option>
                </select>
              </div>
              <div style="flex:1;">
                <label style="display:block;font-size:var(--font-size-xs);font-weight:600;margin-bottom:6px;color:var(--text-secondary);" for="proj-priority">Priority</label>
                <select id="proj-priority" class="input select">
                  <option value="High">High</option>
                  <option value="Medium" selected>Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            <div style="margin-bottom:var(--space-4);">
              <label style="display:block;font-size:var(--font-size-xs);font-weight:600;margin-bottom:6px;color:var(--text-secondary);" for="proj-desc">Description *</label>
              <textarea id="proj-desc" class="input" required rows="3" style="resize:vertical;min-height:80px;" placeholder="Brief summary of the project..."></textarea>
            </div>

            <div style="margin-bottom:var(--space-4);">
              <label style="display:block;font-size:var(--font-size-xs);font-weight:600;margin-bottom:6px;color:var(--text-secondary);" for="proj-tech">Technologies (comma-separated)</label>
              <input type="text" id="proj-tech" class="input" placeholder="e.g. HTML5, CSS3, JavaScript, Web Audio API" />
            </div>

            <div style="display:flex;gap:var(--space-4);margin-bottom:var(--space-4);">
              <div style="flex:1;">
                <label style="display:block;font-size:var(--font-size-xs);font-weight:600;margin-bottom:6px;color:var(--text-secondary);" for="proj-start-date">Start Date</label>
                <input type="date" id="proj-start-date" class="input" value="${new Date().toISOString().split('T')[0]}" />
              </div>
              <div style="flex:1;">
                <label style="display:block;font-size:var(--font-size-xs);font-weight:600;margin-bottom:6px;color:var(--text-secondary);" for="proj-date">Completion Date</label>
                <input type="date" id="proj-date" class="input" value="${new Date().toISOString().split('T')[0]}" />
              </div>
            </div>

            <div style="display:flex;justify-content:flex-end;gap:var(--space-3);margin-top:var(--space-6);">
              <button type="button" class="btn btn-secondary" id="project-modal-cancel">Cancel</button>
              <button type="submit" class="btn btn-primary">Save Project</button>
            </div>
          </form>
        </div>
      </div>
    `;

    
    const closeModal = () => { container.innerHTML = ''; };
    Utils.qs('#project-modal-close').addEventListener('click', closeModal);
    Utils.qs('#project-modal-cancel').addEventListener('click', closeModal);
    Utils.qs('#project-modal-backdrop').addEventListener('click', (e) => {
      if (e.target.id === 'project-modal-backdrop') closeModal();
    });

    
    Utils.qs('#add-project-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const name = Utils.qs('#proj-name').value.trim();
      const category = Utils.qs('#proj-category').value;
      const priority = Utils.qs('#proj-priority').value;
      const description = Utils.qs('#proj-desc').value.trim();
      const techInput = Utils.qs('#proj-tech').value;
      const startDate = Utils.qs('#proj-start-date').value;
      const completionDate = Utils.qs('#proj-date').value;

      const technologies = techInput
        ? techInput.split(',').map(t => t.trim()).filter(Boolean)
        : [];
      const tags = [...technologies].map(t => t.toLowerCase());

      AppData.addProject({
        name,
        category,
        priority,
        description,
        technologies,
        tags,
        startDate,
        completionDate
      });

      closeModal();
      Utils.toast('Project added successfully!', 'success');

      
      render();
    });
  }

  
  function render() {
    const page = Utils.qs('#page-library');
    if (!page) return;

    page.innerHTML = `
      <!-- Page header -->
      <div class="lib-header anim-fade-in" style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:var(--space-4);">
        <div class="lib-header-left">
          <h2>Project Library</h2>
          <p>Browse and filter all the completed projects</p>
        </div>
        <button class="btn btn-primary" id="btn-add-project"><i class="fa-solid fa-plus"></i> Add Project</button>
      </div>

      <!-- Toolbar: search, filters, sort, view toggle -->
      <div class="lib-toolbar anim-fade-in-down">
        ${buildToolbar()}
      </div>

      <!-- Projects container — filled by renderProjects() -->
      <div id="lib-projects-container" class="lib-view-container lib-grid">
        <!-- Project cards render here -->
      </div>
    `;

    
    bindEvents();

    
    renderProjects();
  }

  
  return {
    
    init(state = {}) {
      render();
      
      if (state.search) {
        const input = Utils.qs('#lib-search-input');
        if (input) {
          input.value = state.search;
          this.update(state);
        }
      }
    },

    
    update(newState) {
      if (newState.search !== undefined) {
        state.query = newState.search;
        const input = Utils.qs('#lib-search-input');
        if (input) input.value = state.query;
        renderProjects();
      }
    }
  };

})();
