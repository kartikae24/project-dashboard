

const TeamPage = (() => {

  
  
  const MEMBER_COLORS = [
    { bg: 'rgba(99,102,241,0.15)',  text: '#818cf8', bar: '#6366f1' }, 
    { bg: 'rgba(6,182,212,0.15)',   text: '#22d3ee', bar: '#06b6d4' }, 
    { bg: 'rgba(16,185,129,0.15)',  text: '#34d399', bar: '#10b981' }, 
    { bg: 'rgba(245,158,11,0.15)',  text: '#fbbf24', bar: '#f59e0b' }, 
    { bg: 'rgba(244,63,94,0.15)',   text: '#fb7185', bar: '#f43f5e' }, 
    { bg: 'rgba(139,92,246,0.15)', text: '#a78bfa', bar: '#8b5cf6' }, 
    { bg: 'rgba(236,72,153,0.15)', text: '#f472b6', bar: '#ec4899' }, 
    { bg: 'rgba(20,184,166,0.15)', text: '#2dd4bf', bar: '#14b8a6' }, 
  ];

  
  let state = {
    query: '',    
    role:  'all', 
  };

  
  function getRoles() {
    return [...new Set(AppData.team.map(m => m.role))].sort();
  }

  
  function getFilteredMembers() {
    let list = [...AppData.team];
    const q = state.query.toLowerCase().trim();

    
    if (q) {
      list = list.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q) ||
        m.skills.some(s => s.toLowerCase().includes(q))
      );
    }

    
    if (state.role !== 'all') {
      list = list.filter(m => m.role === state.role);
    }

    return list;
  }

  
  function buildCard(member, index) {
    const colorIndex = AppData.team.findIndex(m => m.id === member.id);
    const color = MEMBER_COLORS[colorIndex % MEMBER_COLORS.length];
    const delay = Math.min(index + 1, 8);

    
    const skillsHTML = member.skills.slice(0, 4).map(s => `
      <span class="member-skill-tag">${s}</span>
    `).join('');

    const extraSkills = member.skills.length - 4;

    return `
      <div
        class="member-card anim-delay-${delay}"
        data-member-id="${member.id}"
        role="button"
        tabindex="0"
        aria-label="View profile of ${member.name}"
        style="position:relative;"
      >
        <!-- Delete button -->
        <button class="btn-member-delete" data-action="delete" title="Delete Member" style="position:absolute;top:12px;right:12px;z-index:10;width:28px;height:28px;border-radius:50%;background:rgba(20,20,30,0.6);backdrop-filter:blur(4px);color:var(--text-primary);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all var(--transition-fast);" onmouseover="this.style.background='var(--color-danger)';this.style.color='white';this.style.borderColor='var(--color-danger)';" onmouseout="this.style.background='rgba(20,20,30,0.6)';this.style.color='var(--text-primary)';this.style.borderColor='var(--border)';"><i class="fa-solid fa-trash" style="font-size:11px;"></i></button>

        <!-- Top colored accent bar -->
        <div class="member-card-accent" style="background:${color.bar};"></div>

        <div class="member-card-body">

          <!-- Avatar circle with initials -->
          <div class="member-avatar-lg"
            style="background:${color.bg}; color:${color.text}; border-color:${color.bar}22;">
            ${member.initials}
          </div>

          <!-- Name & Role -->
          <div>
            <div class="member-card-name">${member.name}</div>
            <div class="member-card-role">${member.role}</div>
          </div>

          <!-- Skill tags -->
          <div class="member-skills">
            ${skillsHTML}
            ${extraSkills > 0 ? `<span class="member-skill-tag" style="color:var(--text-muted);">+${extraSkills} more</span>` : ''}
          </div>

          <!-- Stats: projects + tasks -->
          <div class="member-stats">
            <div class="member-stat">
              <div class="member-stat-value">${member.projectIds.length}</div>
              <div class="member-stat-label">Projects</div>
            </div>
            <div class="member-stat" style="border-left:1px solid var(--border);border-right:1px solid var(--border);padding:0 var(--space-4);">
              <div class="member-stat-value">${member.completedTasks}</div>
              <div class="member-stat-label">Tasks Done</div>
            </div>
            <div class="member-stat">
              <div class="member-stat-value">${member.skills.length}</div>
              <div class="member-stat-label">Skills</div>
            </div>
          </div>

        </div>

        <!-- Footer: view profile button -->
        <div class="member-card-footer">
          <div class="member-view-btn">
            View Profile <i class="fa-solid fa-arrow-right" style="font-size:11px;"></i>
          </div>
        </div>
      </div>
    `;
  }

  
  function renderMembers() {
    const members  = getFilteredMembers();
    const grid     = Utils.qs('#team-grid');
    const countEl  = Utils.qs('#team-count');

    if (!grid) return;

    
    if (countEl) {
      countEl.textContent = `${members.length} member${members.length !== 1 ? 's' : ''}`;
    }

    
    if (!members.length) {
      grid.innerHTML = `
        <div class="team-empty" style="grid-column:1/-1;">
          <div class="team-empty-icon"><i class="fa-solid fa-users"></i></div>
          <div style="font-size:var(--font-size-lg);font-weight:600;color:var(--text-secondary);">
            No members found
          </div>
          <div style="font-size:var(--font-size-sm);color:var(--text-muted);">
            Try adjusting your search or filter.
          </div>
          <button class="btn btn-secondary" id="team-clear-btn">
            <i class="fa-solid fa-xmark"></i> Clear Filters
          </button>
        </div>
      `;
      Utils.qs('#team-clear-btn')?.addEventListener('click', () => {
        clearFilters();
      });
      return;
    }

    grid.innerHTML = members.map((m, i) => buildCard(m, i)).join('');

    
    grid.addEventListener('click', (e) => {
      const deleteBtn = e.target.closest('[data-action="delete"]');
      if (deleteBtn) {
        e.stopPropagation();
        const card = deleteBtn.closest('[data-member-id]');
        if (card) {
          const memberId = card.dataset.memberId;
          const member = AppData.getMember(memberId);
          if (member) {
            if (confirm(`Are you sure you want to delete "${member.name}"?\nThis member will be removed from all projects they are assigned to.`)) {
              AppData.deleteMember(memberId);
              Utils.toast('Team member deleted successfully!', 'success');
              renderMembers();
            }
          }
        }
        return;
      }

      const card = e.target.closest('[data-member-id]');
      if (card) openDrawer(card.dataset.memberId);
    });

    
    grid.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const card = e.target.closest('[data-member-id]');
        if (card) {
          e.preventDefault();
          openDrawer(card.dataset.memberId);
        }
      }
    });
  }

  
  function openDrawer(memberId) {
    const member = AppData.getMember(memberId);
    if (!member) return;

    const colorIndex = AppData.team.findIndex(m => m.id === memberId);
    const color = MEMBER_COLORS[colorIndex % MEMBER_COLORS.length];

    
    const projects = member.projectIds
      .map(id => AppData.getProject(id))
      .filter(Boolean);

    
    const allSkillsHTML = member.skills.map(s => {
      const c = Utils.getTagColor(s);
      return `<span class="badge" style="background:${c.bg};color:${c.text};font-size:11px;">${s}</span>`;
    }).join('');

    
    const projectsHTML = projects.map(p => `
      <div class="drawer-project-item" data-project-id="${p.id}">
        <div class="drawer-project-dot"></div>
        <div style="flex:1;min-width:0;">
          <div style="font-size:var(--font-size-sm);font-weight:500;color:var(--text-primary);
                      white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
            ${p.name}
          </div>
          <div style="font-size:var(--font-size-xs);color:var(--text-muted);">
            ${p.category} · ${Utils.formatDate(p.completionDate, 'short')}
          </div>
        </div>
        <span class="badge badge-success" style="font-size:10px;flex-shrink:0;">Done</span>
      </div>
    `).join('');

    
    const drawerHTML = `
      <!-- Click backdrop to close -->
      <div class="member-drawer-backdrop" id="drawer-backdrop"></div>

      <div class="member-drawer" id="member-drawer" role="dialog" aria-label="Member profile">

        <!-- Drawer header -->
        <div class="drawer-header">
          <span class="drawer-title">Member Profile</span>
          <button class="drawer-close" id="drawer-close-btn" aria-label="Close drawer">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- Drawer scrollable body -->
        <div class="drawer-body">

          <!-- Profile: big avatar + name/role -->
          <div class="drawer-profile">
            <div class="member-avatar-lg"
              style="background:${color.bg};color:${color.text};border-color:${color.bar}44;
                     width:64px;height:64px;font-size:var(--font-size-xl);">
              ${member.initials}
            </div>
            <div class="drawer-profile-info">
              <h3>${member.name}</h3>
              <p>${member.role}</p>
            </div>
          </div>

          <!-- Bio -->
          ${member.bio ? `
            <div>
              <div class="drawer-section-label">About</div>
              <p style="font-size:var(--font-size-sm);color:var(--text-secondary);
                        line-height:var(--line-height-loose);">
                ${member.bio}
              </p>
            </div>
          ` : ''}

          <!-- Stats boxes -->
          <div class="drawer-stats">
            <div class="drawer-stat-box">
              <div class="drawer-stat-val" style="color:${color.bar};">
                ${projects.length}
              </div>
              <div class="drawer-stat-lbl">Projects</div>
            </div>
            <div class="drawer-stat-box">
              <div class="drawer-stat-val" style="color:var(--color-success);">
                ${member.completedTasks}
              </div>
              <div class="drawer-stat-lbl">Tasks Done</div>
            </div>
            <div class="drawer-stat-box">
              <div class="drawer-stat-val" style="color:var(--color-warning);">
                ${member.skills.length}
              </div>
              <div class="drawer-stat-lbl">Skills</div>
            </div>
          </div>

          <!-- All Skills -->
          <div>
            <div class="drawer-section-label">Skills & Technologies</div>
            <div class="tag-list">
              ${allSkillsHTML}
            </div>
          </div>

          <!-- Assigned Projects -->
          <div>
            <div class="drawer-section-label">
              Assigned Projects (${projects.length})
            </div>
            ${projectsHTML || '<p class="text-sm text-muted">No projects assigned.</p>'}
          </div>

          <!-- Contact Info -->
          <div>
            <div class="drawer-section-label">Contact</div>
            <div class="drawer-contact-row">
              <i class="fa-solid fa-envelope"></i>
              <span>${member.email}</span>
            </div>
            ${member.github && member.github !== '#' ? `
              <div class="drawer-contact-row">
                <i class="fa-brands fa-github"></i>
                <span>${member.github}</span>
              </div>
            ` : ''}
          </div>

        </div>
        <!-- end drawer body -->
      </div>
    `;

    
    const container = Utils.qs('#drawer-container');
    if (!container) return;
    container.innerHTML = drawerHTML;

    

    
    Utils.qs('#drawer-close-btn')?.addEventListener('click', closeDrawer);

    
    Utils.qs('#drawer-backdrop')?.addEventListener('click', closeDrawer);

    
    document.addEventListener('keydown', handleEscKey);

    
    Utils.qsa('.drawer-project-item').forEach(item => {
      item.addEventListener('click', () => {
        const pid = item.dataset.projectId;
        if (pid) {
          sessionStorage.setItem('selectedProject', pid);
          closeDrawer();
          navigateTo('details', { projectId: pid });
        }
      });
    });
  }

  
  function closeDrawer() {
    const drawer   = Utils.qs('#member-drawer');
    const backdrop = Utils.qs('#drawer-backdrop');

    
    if (drawer) {
      drawer.style.animation = 'slideOutRight 0.25s ease forwards';
    }
    if (backdrop) {
      backdrop.style.animation = 'fadeIn 0.25s ease reverse forwards';
    }

    setTimeout(() => {
      const container = Utils.qs('#drawer-container');
      if (container) container.innerHTML = '';
    }, 260);

    document.removeEventListener('keydown', handleEscKey);
  }

  
  function handleEscKey(e) {
    if (e.key === 'Escape') closeDrawer();
  }

  
  function clearFilters() {
    state.query = '';
    state.role  = 'all';
    const searchEl = Utils.qs('#team-search-input');
    const roleEl   = Utils.qs('#team-role-select');
    if (searchEl) searchEl.value = '';
    if (roleEl)   roleEl.value   = 'all';
    renderMembers();
  }

  
  function bindEvents() {
    
    Utils.qs('#team-search-input')?.addEventListener('input',
      Utils.debounce((e) => {
        state.query = e.target.value;
        renderMembers();
      }, 250)
    );

    
    Utils.qs('#team-role-select')?.addEventListener('change', (e) => {
      state.role = e.target.value;
      renderMembers();
    });

    
    Utils.qs('#btn-add-member')?.addEventListener('click', openAddMemberModal);
  }

  
  function openAddMemberModal() {
    const container = Utils.qs('#modal-container');
    if (!container) return;

    const projectCheckboxes = AppData.projects.map(p => `
      <label style="display:flex;align-items:center;gap:6px;font-size:var(--font-size-sm);cursor:pointer;margin-bottom:6px;">
        <input type="checkbox" name="assigned-projects" value="${p.id}" />
        <span>${p.name}</span>
      </label>
    `).join('');

    container.innerHTML = `
      <div class="modal-backdrop" id="member-modal-backdrop">
        <div class="modal-box" style="max-width: 500px;">
          <div class="modal-header">
            <h3 class="modal-title"><i class="fa-solid fa-user-plus" style="color:var(--accent);margin-right:8px;"></i>Add Team Member</h3>
            <button class="modal-close" id="member-modal-close" style="background:none;border:none;cursor:pointer;" aria-label="Close modal">&times;</button>
          </div>
          <form id="add-member-form">
            <div style="margin-bottom:var(--space-4);">
              <label style="display:block;font-size:var(--font-size-xs);font-weight:600;margin-bottom:6px;color:var(--text-secondary);" for="mem-name">Full Name *</label>
              <input type="text" id="mem-name" class="input" required placeholder="e.g. John Doe" />
            </div>

            <div style="margin-bottom:var(--space-4);">
              <label style="display:block;font-size:var(--font-size-xs);font-weight:600;margin-bottom:6px;color:var(--text-secondary);" for="mem-role">Role *</label>
              <input type="text" id="mem-role" class="input" required placeholder="e.g. Frontend Developer" />
            </div>

            <div style="margin-bottom:var(--space-4);">
              <label style="display:block;font-size:var(--font-size-xs);font-weight:600;margin-bottom:6px;color:var(--text-secondary);" for="mem-email">Email Address *</label>
              <input type="email" id="mem-email" class="input" required placeholder="e.g. john@example.com" />
            </div>

            <div style="margin-bottom:var(--space-4);">
              <label style="display:block;font-size:var(--font-size-xs);font-weight:600;margin-bottom:6px;color:var(--text-secondary);" for="mem-skills">Skills (comma-separated)</label>
              <input type="text" id="mem-skills" class="input" placeholder="e.g. HTML5, CSS3, JavaScript, Figma" />
            </div>

            <div style="margin-bottom:var(--space-4);">
              <label style="display:block;font-size:var(--font-size-xs);font-weight:600;margin-bottom:6px;color:var(--text-secondary);" for="mem-bio">Bio</label>
              <textarea id="mem-bio" class="input" rows="3" style="resize:vertical;min-height:70px;" placeholder="Brief bio of the team member..."></textarea>
            </div>

            <div style="margin-bottom:var(--space-4);">
              <label style="display:block;font-size:var(--font-size-xs);font-weight:600;margin-bottom:6px;color:var(--text-secondary);">Assign to Projects</label>
              <div style="background:var(--bg-input);padding:10px;border-radius:var(--radius-md);border:1px solid var(--border);">
                ${projectCheckboxes || '<p style="font-size:var(--font-size-xs);color:var(--text-muted);margin:0;">No projects available.</p>'}
              </div>
            </div>

            <div style="display:flex;justify-content:flex-end;gap:var(--space-3);margin-top:var(--space-6);">
              <button type="button" class="btn btn-secondary" id="member-modal-cancel">Cancel</button>
              <button type="submit" class="btn btn-primary">Save Member</button>
            </div>
          </form>
        </div>
      </div>
    `;

    
    const closeModal = () => { container.innerHTML = ''; };
    Utils.qs('#member-modal-close').addEventListener('click', closeModal);
    Utils.qs('#member-modal-cancel').addEventListener('click', closeModal);
    Utils.qs('#member-modal-backdrop').addEventListener('click', (e) => {
      if (e.target.id === 'member-modal-backdrop') closeModal();
    });

    
    Utils.qs('#add-member-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const name = Utils.qs('#mem-name').value.trim();
      const role = Utils.qs('#mem-role').value.trim();
      const email = Utils.qs('#mem-email').value.trim();
      const bio = Utils.qs('#mem-bio').value.trim();
      const skillsInput = Utils.qs('#mem-skills').value;

      const skills = skillsInput
        ? skillsInput.split(',').map(s => s.trim()).filter(Boolean)
        : [];

      
      const checkedBoxes = container.querySelectorAll('input[name="assigned-projects"]:checked');
      const projectIds = Array.from(checkedBoxes).map(cb => cb.value);

      AppData.addMember({
        name,
        role,
        email,
        bio,
        skills,
        projectIds
      });

      closeModal();
      Utils.toast('Team member added successfully!', 'success');

      
      render();
    });
  }

  
  function buildToolbar() {
    const roles = getRoles();
    const roleOptions = roles.map(r =>
      `<option value="${r}">${r}</option>`
    ).join('');

    return `
      <!-- Search -->
      <div class="team-search">
        <i class="fa-solid fa-magnifying-glass"></i>
        <input
          type="text"
          id="team-search-input"
          placeholder="Search by name, role, or skill..."
          aria-label="Search team members"
        />
      </div>

      <!-- Role filter -->
      <select class="team-role-select" id="team-role-select" aria-label="Filter by role">
        <option value="all">All Roles</option>
        ${roleOptions}
      </select>

      <!-- Result count -->
      <span class="team-count" id="team-count">${AppData.team.length} members</span>
    `;
  }

  
  function render() {
    const page = Utils.qs('#page-team');
    if (!page) return;

    page.innerHTML = `
      <!-- Page header -->
      <div class="team-header anim-fade-in" style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:var(--space-4);">
        <div>
          <h2>Team Members</h2>
          <p>Meet the people behind the projects</p>
        </div>
        <button class="btn btn-primary" id="btn-add-member"><i class="fa-solid fa-plus"></i> Add Member</button>
      </div>

      <!-- Toolbar -->
      <div class="team-toolbar anim-fade-in-down">
        ${buildToolbar()}
      </div>

      <!-- Members grid — cards inject here -->
      <div class="team-grid" id="team-grid">
        <!-- member cards rendered by renderMembers() -->
      </div>

      <!-- Drawer mounts here — outside the grid -->
      <div id="drawer-container"></div>
    `;

    bindEvents();
    renderMembers();
  }

  
  return {
    init() {
      render();
    }
  };

})();
