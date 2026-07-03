

const DetailsPage = (() => {

  
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

  
  function render(project) {
    const page = Utils.qs('#page-details');
    if (!page || !project) return;

    const gradient = CATEGORY_GRADIENTS[project.category]
      || 'linear-gradient(135deg, #6366f1, #8b5cf6)';
    const icon = CATEGORY_ICONS[project.category] || 'fa-solid fa-folder';

    const members = project.teamIds.map(id => AppData.getMember(id)).filter(Boolean);
    const tasks   = AppData.getTasksByProject(project.id);
    const related = project.relatedProjectIds
      ?.map(id => AppData.getProject(id)).filter(Boolean) || [];

    
    const featuresHTML = (project.features || []).map(f => `
      <div class="feature-item anim-fade-in-up">
        <i class="fa-solid fa-check"></i>
        <span>${f}</span>
      </div>
    `).join('');

    
    const techHTML = project.technologies.map(tech => {
      const color = Utils.getTagColor(tech);
      return `
        <span class="badge"
          style="background:${color.bg};color:${color.text};font-size:12px;padding:4px 12px;">
          ${tech}
        </span>
      `;
    }).join('');

    
    const teamHTML = members.map(m => `
      <div class="detail-member-card" data-member-page="team">
        <div class="avatar avatar-lg"
          style="background:var(--accent-light);color:var(--accent);">
          ${m.initials}
        </div>
        <div class="detail-member-info">
          <div class="name">${m.name}</div>
          <div class="role">${m.role}</div>
        </div>
      </div>
    `).join('');

    
    const tasksHTML = tasks.length ? tasks.map(t => {
      let iconClass = 'fa-solid fa-circle-check';
      let iconColor = 'var(--color-success)';
      if (t.status === 'In Progress') {
        iconClass = 'fa-solid fa-spinner fa-spin';
        iconColor = 'var(--accent)';
      } else if (t.status === 'Review') {
        iconClass = 'fa-solid fa-circle-question';
        iconColor = 'var(--color-warning)';
      } else if (t.status === 'To Do') {
        iconClass = 'fa-regular fa-circle';
        iconColor = 'var(--text-muted)';
      }
      return `
        <div class="feature-item">
          <i class="${iconClass}" style="color:${iconColor}; margin-right: 8px;"></i>
          <span style="flex:1;">${t.title}</span>
          <span class="badge ${
            t.status === 'Done'        ? 'badge-success' :
            t.status === 'Review'      ? 'badge-warning' :
            t.status === 'In Progress' ? 'badge-accent' :
                                         'badge-secondary'
          }" style="font-size:10px; margin-right: 8px;">${t.status}</span>
          <span class="badge ${
            t.priority === 'High'   ? 'badge-danger' :
            t.priority === 'Medium' ? 'badge-warning' : 'badge-success'
          }" style="font-size:10px;">${t.priority}</span>
        </div>
      `;
    }).join('')
    : '<p class="text-muted text-sm">No tasks for this project.</p>';

    
    const relatedHTML = related.length ? related.map(r => `
      <div class="related-proj-card" data-project-id="${r.id}">
        <div class="related-proj-name">${r.name}</div>
        <div class="related-proj-cat">${r.category}</div>
      </div>
    `).join('')
    : '<p class="text-muted text-sm">No related projects.</p>';

    page.innerHTML = `
      <!-- Back button -->
      <div style="margin-bottom:var(--space-4);" class="anim-fade-in">
        <button class="btn btn-secondary btn-sm" id="detail-back-btn">
          <i class="fa-solid fa-arrow-left"></i> Back to Library
        </button>
      </div>

      <!-- Hero Section -->
      <div class="detail-hero anim-scale-in" style="background:${gradient};">

        <!-- Category label -->
        <div class="detail-hero-content">
          <div class="detail-hero-category">
            <i class="${icon}"></i>
            ${project.category}
          </div>
          <h1 class="detail-hero-title">${project.name}</h1>
          <div class="detail-hero-meta">
            <span><i class="fa-regular fa-calendar"></i>
              Completed ${Utils.formatDate(project.completionDate, 'long')}
            </span>
            <span><i class="fa-solid fa-users"></i>
              ${members.length} member${members.length !== 1 ? 's' : ''}
            </span>
            <span><i class="fa-solid fa-list-check"></i>
              ${tasks.length} task${tasks.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <!-- Big faded icon -->
        <i class="${icon}" style="
          position:absolute;right:40px;bottom:-10px;
          font-size:120px;opacity:0.1;color:#fff;
        "></i>
      </div>

      <!-- Main 2-column layout -->
      <div class="detail-layout">

        <!-- ── Left Column: Main Content ──── -->
        <div>

          <!-- Overview -->
          <div class="card detail-section anim-fade-in-up">
            <div class="detail-section-title">
              <i class="fa-solid fa-circle-info"></i> Overview
            </div>
            <p style="font-size:var(--font-size-sm);color:var(--text-secondary);line-height:var(--line-height-loose);">
              ${project.description}
            </p>
          </div>

          <!-- Features -->
          <div class="card detail-section anim-fade-in-up anim-delay-1">
            <div class="detail-section-title">
              <i class="fa-solid fa-star"></i> Key Features
            </div>
            <div class="feature-list">
              ${featuresHTML || '<p class="text-muted text-sm">No features listed.</p>'}
            </div>
          </div>

          <!-- Technologies -->
          <div class="card detail-section anim-fade-in-up anim-delay-2">
            <div class="detail-section-title">
              <i class="fa-solid fa-code"></i> Technologies Used
            </div>
            <div class="tag-list">
              ${techHTML}
            </div>
          </div>

          <!-- Challenges, Solutions, Lessons -->
          <div class="card detail-section anim-fade-in-up anim-delay-3">
            <div class="detail-section-title">
              <i class="fa-solid fa-lightbulb"></i> Challenges & Learnings
            </div>

            ${project.challenges ? `
              <div class="info-block info-block-challenge">
                <div class="info-block-label" style="color:var(--color-danger);">
                  <i class="fa-solid fa-triangle-exclamation"></i> Challenge
                </div>
                ${project.challenges}
              </div>
            ` : ''}

            ${project.solutions ? `
              <div class="info-block info-block-solution">
                <div class="info-block-label" style="color:var(--color-success);">
                  <i class="fa-solid fa-check-circle"></i> Solution
                </div>
                ${project.solutions}
              </div>
            ` : ''}

            ${project.lessonsLearned ? `
              <div class="info-block info-block-lesson">
                <div class="info-block-label" style="color:var(--accent);">
                  <i class="fa-solid fa-graduation-cap"></i> Lesson Learned
                </div>
                ${project.lessonsLearned}
              </div>
            ` : ''}
          </div>

          <!-- Team Members -->
          <div class="card detail-section anim-fade-in-up anim-delay-2">
            <div class="detail-section-title">
              <i class="fa-solid fa-users"></i> Team Members
            </div>
            <div class="detail-team-grid">
              ${teamHTML || '<p class="text-muted text-sm">No team members listed.</p>'}
            </div>
          </div>

          <!-- Tasks (read-only) -->
          <div class="card detail-section anim-fade-in-up anim-delay-3">
            <div class="detail-section-title">
              <i class="fa-solid fa-list-check"></i> Tasks
            </div>
            <div class="feature-list">
              ${tasksHTML}
            </div>
          </div>

          <!-- Notes -->
          ${project.notes ? `
            <div class="detail-section anim-fade-in-up anim-delay-4">
              <div class="detail-section-title">
                <i class="fa-solid fa-note-sticky"></i> Notes
              </div>
              <div class="detail-notes">
                <i class="fa-solid fa-lightbulb" style="color:var(--color-warning);"></i>
                ${project.notes}
              </div>
            </div>
          ` : ''}

          <!-- Related Projects -->
          <div class="card detail-section anim-fade-in-up anim-delay-4">
            <div class="detail-section-title">
              <i class="fa-solid fa-link"></i> Related Projects
            </div>
            <div class="related-projects-grid">
              ${relatedHTML}
            </div>
          </div>

        </div>
        <!-- end left column -->

        <!-- ── Right Column: Sidebar ──────── -->
        <div>
          <!-- Meta information card -->
          <div class="card anim-fade-in-up anim-delay-2" style="margin-bottom:var(--space-4);">
            <div class="detail-section-title" style="margin-bottom:var(--space-4);">
              <i class="fa-solid fa-circle-info"></i> Project Info
            </div>

            <div class="detail-meta-item">
              <span class="detail-meta-label">
                <i class="fa-solid fa-flag"></i> Status
              </span>
              <span class="badge badge-success">${project.status}</span>
            </div>

            <div class="detail-meta-item">
              <span class="detail-meta-label">
                <i class="fa-solid fa-layer-group"></i> Category
              </span>
              <span class="detail-meta-value">${project.category}</span>
            </div>

            <div class="detail-meta-item">
              <span class="detail-meta-label">
                <i class="fa-solid fa-calendar-plus"></i> Started
              </span>
              <span class="detail-meta-value">${Utils.formatDate(project.startDate, 'short')}</span>
            </div>

            <div class="detail-meta-item">
              <span class="detail-meta-label">
                <i class="fa-solid fa-calendar-check"></i> Completed
              </span>
              <span class="detail-meta-value">${Utils.formatDate(project.completionDate, 'short')}</span>
            </div>

            <div class="detail-meta-item">
              <span class="detail-meta-label">
                <i class="fa-solid fa-bolt"></i> Priority
              </span>
              <span class="badge badge-${
                project.priority === 'High'   ? 'danger' :
                project.priority === 'Medium' ? 'warning' : 'default'
              }">${project.priority}</span>
            </div>

            <div class="detail-meta-item">
              <span class="detail-meta-label">
                <i class="fa-solid fa-chart-line"></i> Progress
              </span>
              <span class="detail-meta-value">${project.progress}%</span>
            </div>

            <div class="detail-meta-item">
              <span class="detail-meta-label">
                <i class="fa-solid fa-users"></i> Team Size
              </span>
              <span class="detail-meta-value">${members.length} members</span>
            </div>

            <div class="detail-meta-item">
              <span class="detail-meta-label">
                <i class="fa-solid fa-code"></i> Tech Stack
              </span>
              <span class="detail-meta-value">${project.technologies.length} tools</span>
            </div>
          </div>

          <!-- Tags cloud -->
          <div class="card anim-fade-in-up anim-delay-3">
            <div class="detail-section-title" style="margin-bottom:var(--space-4);">
              <i class="fa-solid fa-tags"></i> Tags
            </div>
            <div class="tag-list">
              ${(project.tags || []).map(tag => `
                <span class="tag">#${tag}</span>
              `).join('')}
            </div>
          </div>

        </div>
        <!-- end right column -->

      </div>
      <!-- end detail-layout -->
    `;

    

    
    Utils.qs('#detail-back-btn')?.addEventListener('click', () => {
      navigateTo('library');
    });

    
    Utils.qsa('.related-proj-card').forEach(card => {
      card.addEventListener('click', () => {
        const pid = card.dataset.projectId;
        if (pid) {
          sessionStorage.setItem('selectedProject', pid);
          
          renderWithId(pid);
        }
      });
    });

    
    Utils.qsa('.detail-member-card').forEach(card => {
      card.addEventListener('click', () => {
        navigateTo('team');
      });
    });
  }

  
  function renderWithId(projectId) {
    const project = AppData.getProject(projectId);
    if (project) {
      render(project);
    } else {
      
      const page = Utils.qs('#page-details');
      if (page) {
        page.innerHTML = `
          <div class="empty-state">
            <div class="empty-state-icon"><i class="fa-solid fa-folder-open"></i></div>
            <div class="empty-state-title">Project not found</div>
            <div class="empty-state-desc">The selected project could not be loaded.</div>
            <button class="btn btn-primary" onclick="navigateTo('library')">
              Back to Library
            </button>
          </div>
        `;
      }
    }
  }

  
  return {
    init() {
      
      const projectId = sessionStorage.getItem('selectedProject')
        || AppData.projects[0]?.id;
      renderWithId(projectId);
    },

    update(state) {
      if (state.projectId) {
        sessionStorage.setItem('selectedProject', state.projectId);
        renderWithId(state.projectId);
      }
    }
  };

})();
