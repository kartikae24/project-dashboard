

const TasksPage = (() => {

  
  let state = {
    query:    '',       
    project:  'all',   
    priority: 'all',   
    view:     'kanban',
    sortCol:  'title', 
    sortDir:  'asc',   
  };

  
  
  const KANBAN_COLS = [
    { id: 'To Do',       label: 'To Do',       color: 'var(--text-muted)',    dot: '#64748b' },
    { id: 'In Progress', label: 'In Progress', color: 'var(--accent)',        dot: '#6366f1' },
    { id: 'Review',      label: 'Review',      color: 'var(--color-warning)', dot: '#f59e0b' },
    { id: 'Done',        label: 'Done',        color: 'var(--color-success)', dot: '#10b981' },
  ];

  
  function getFilteredTasks() {
    let list = [...AppData.tasks];
    const q = state.query.toLowerCase().trim();

    
    if (q) {
      list = list.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.tags?.some(tag => tag.toLowerCase().includes(q))
      );
    }

    
    if (state.project !== 'all') {
      list = list.filter(t => t.projectId === state.project);
    }

    
    if (state.priority !== 'all') {
      list = list.filter(t => t.priority === state.priority);
    }

    return list;
  }

  
  function buildKanbanCard(task, index) {
    const assignee = AppData.getMember(task.assigneeId);
    const project  = AppData.getProject(task.projectId);
    const delay    = Math.min(index + 1, 6);

    return `
      <div class="kanban-task-card anim-delay-${delay}">

        <!-- Tags & Delete row -->
        <div style="display:flex;gap:4px;flex-wrap:wrap;justify-content:space-between;align-items:center;width:100%;">
          <div style="display:flex;gap:4px;flex-wrap:wrap;">
            ${(task.tags || []).slice(0, 2).map(tag => `
              <span class="badge badge-accent" style="font-size:10px;padding:1px 6px;">${tag}</span>
            `).join('')}
          </div>
          <!-- Delete button -->
          <button data-action="delete" data-task-id="${task.id}" title="Delete Task" style="background:none;border:none;color:var(--text-muted);cursor:pointer;transition:color var(--transition-fast);padding:2px;display:flex;align-items:center;justify-content:center;" onmouseover="this.style.color='var(--color-danger)';" onmouseout="this.style.color='var(--text-muted)';"><i class="fa-solid fa-trash" style="font-size:10px;"></i></button>
        </div>

        <!-- Task title -->
        <div class="kanban-task-title" style="margin-top:4px;">${task.title}</div>

        <!-- Project name -->
        <div style="font-size:11px;color:var(--text-muted);
                    white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
          <i class="fa-solid fa-folder" style="font-size:9px;"></i>
          ${project?.name || 'Unknown project'}
        </div>

        <!-- Footer: assignee + priority badge -->
        <div class="kanban-task-meta">
          <div style="display:flex;align-items:center;gap:6px;">
            ${assignee ? `
              <div class="kanban-assignee" title="${assignee.name}">
                ${assignee.initials}
              </div>
              <span style="font-size:10px;color:var(--text-muted);">${assignee.name.split(' ')[0]}</span>
            ` : ''}
          </div>
          <div style="display:flex;align-items:center;gap:6px;">
            <span class="badge ${
              task.priority === 'High'   ? 'badge-danger' :
              task.priority === 'Medium' ? 'badge-warning' :
                                           'badge-success'
            }" style="font-size:10px;padding:1px 6px;">${task.priority}</span>
          </div>
        </div>
      </div>
    `;
  }

  
  function renderKanban(tasks) {
    const colsHTML = KANBAN_COLS.map(col => {
      
      const colTasks = tasks.filter(t => t.status === col.id);

      return `
        <div class="kanban-column">

          <!-- Column header -->
          <div class="kanban-col-header">
            <div class="kanban-col-title">
              <div class="kanban-col-dot" style="background:${col.dot};"></div>
              ${col.label}
            </div>
            <span class="kanban-col-count">${colTasks.length}</span>
          </div>

          <!-- Task cards -->
          <div class="kanban-col-cards">
            ${colTasks.length
              ? colTasks.map((t, i) => buildKanbanCard(t, i)).join('')
              : `<div style="padding:var(--space-4);text-align:center;font-size:var(--font-size-xs);color:var(--text-muted);">
                   No tasks
                 </div>`
            }
          </div>

        </div>
      `;
    }).join('');

    return `<div class="kanban-board">${colsHTML}</div>`;
  }

  
  function renderTable(tasks) {
    
    const sorted = [...tasks].sort((a, b) => {
      let valA = a[state.sortCol] || '';
      let valB = b[state.sortCol] || '';

      
      if (state.sortCol === 'assigneeId') {
        valA = AppData.getMember(a.assigneeId)?.name || '';
        valB = AppData.getMember(b.assigneeId)?.name || '';
      }

      
      if (state.sortCol === 'projectId') {
        valA = AppData.getProject(a.projectId)?.name || '';
        valB = AppData.getProject(b.projectId)?.name || '';
      }

      const cmp = String(valA).localeCompare(String(valB));
      return state.sortDir === 'asc' ? cmp : -cmp;
    });

    
    const th = (col, label) => {
      const cls = state.sortCol === col
        ? `sorted-${state.sortDir}` : '';
      return `<th class="${cls}" data-col="${col}">${label}</th>`;
    };

    const rowsHTML = sorted.map((task, i) => {
      const assignee = AppData.getMember(task.assigneeId);
      const project  = AppData.getProject(task.projectId);
      const delay    = Math.min(i + 1, 6);

      return `
        <tr class="anim-delay-${delay}">
          <td class="task-title-cell">${task.title}</td>
          <td>
            <span class="badge ${
              task.priority === 'High'   ? 'badge-danger' :
              task.priority === 'Medium' ? 'badge-warning' :
                                           'badge-success'
            }">${task.priority}</span>
          </td>
          <td>
            <span class="badge ${
              task.status === 'Done'        ? 'badge-success' :
              task.status === 'Review'      ? 'badge-warning' :
              task.status === 'In Progress' ? 'badge-accent' :
                                              'badge-secondary'
            }">${task.status}</span>
          </td>
          <td style="max-width:160px;overflow:hidden;text-overflow:ellipsis;">
            ${project?.name || '—'}
          </td>
          <td>
            ${assignee ? `
              <div style="display:flex;align-items:center;gap:6px;">
                <div style="width:22px;height:22px;border-radius:50%;
                  background:var(--accent-light);color:var(--accent);
                  display:flex;align-items:center;justify-content:center;
                  font-size:9px;font-weight:700;flex-shrink:0;">
                  ${assignee.initials}
                </div>
                ${assignee.name.split(' ')[0]}
              </div>
            ` : '—'}
          </td>
          <td>
            <div style="display:flex;gap:4px;flex-wrap:wrap;">
              ${(task.tags || []).slice(0, 2).map(tag =>
                `<span class="badge badge-accent" style="font-size:10px;">${tag}</span>`
              ).join('')}
            </div>
          </td>
          <td>${Utils.formatDate(task.dueDate, 'short')}</td>
          <td style="text-align:center;">
            <button data-action="delete" data-task-id="${task.id}" title="Delete Task" style="background:none;border:none;color:var(--text-muted);cursor:pointer;transition:color var(--transition-fast);padding:4px;display:inline-flex;align-items:center;justify-content:center;" onmouseover="this.style.color='var(--color-danger)';" onmouseout="this.style.color='var(--text-muted)';"><i class="fa-solid fa-trash" style="font-size:11px;"></i></button>
          </td>
        </tr>
      `;
    }).join('');

    return `
      <div class="tasks-table-wrap">
        <table class="tasks-table" id="tasks-table">
          <thead>
            <tr>
              ${th('title',      'Task')}
              ${th('priority',   'Priority')}
              ${th('status',     'Status')}
              ${th('projectId',  'Project')}
              ${th('assigneeId', 'Assignee')}
              <th>Tags</th>
              ${th('dueDate',    'Due Date')}
              <th style="width:50px;"></th>
            </tr>
          </thead>
          <tbody>${rowsHTML}</tbody>
        </table>
      </div>
    `;
  }

  
  function renderCards(tasks) {
    if (!tasks.length) {
      return `<div class="team-empty" style="grid-column:1/-1;">
        <div class="team-empty-icon"><i class="fa-solid fa-list-check"></i></div>
        <div style="font-size:var(--font-size-lg);font-weight:600;color:var(--text-secondary);">No tasks found</div>
      </div>`;
    }

    const cardsHTML = tasks.map((task, i) => {
      const assignee = AppData.getMember(task.assigneeId);
      const project  = AppData.getProject(task.projectId);
      const delay    = Math.min(i + 1, 8);

      return `
        <div class="task-card priority-${task.priority} anim-delay-${delay}">

          <!-- Priority + status badges -->
          <div style="display:flex;gap:6px;align-items:center;justify-content:space-between;width:100%;">
            <div style="display:flex;gap:6px;">
              <span class="badge ${
                task.priority === 'High'   ? 'badge-danger' :
                task.priority === 'Medium' ? 'badge-warning' :
                                             'badge-success'
              }" style="font-size:10px;">
                ${task.priority}
              </span>
              <span class="badge ${
                task.status === 'Done'        ? 'badge-success' :
                task.status === 'Review'      ? 'badge-warning' :
                task.status === 'In Progress' ? 'badge-accent' :
                                                'badge-secondary'
              }" style="font-size:10px;">${task.status}</span>
            </div>
            <!-- Delete button -->
            <button data-action="delete" data-task-id="${task.id}" title="Delete Task" style="background:none;border:none;color:var(--text-muted);cursor:pointer;transition:color var(--transition-fast);padding:2px;display:flex;align-items:center;justify-content:center;" onmouseover="this.style.color='var(--color-danger)';" onmouseout="this.style.color='var(--text-muted)';"><i class="fa-solid fa-trash" style="font-size:11px;"></i></button>
          </div>

          <!-- Task title -->
          <div class="task-card-title">${task.title}</div>

          <!-- Project name -->
          <div class="task-card-project">
            <i class="fa-solid fa-folder"></i>
            ${project?.name || '—'}
          </div>

          <!-- Tags -->
          <div style="display:flex;gap:4px;flex-wrap:wrap;">
            ${(task.tags || []).map(tag =>
              `<span class="badge badge-accent" style="font-size:10px;">${tag}</span>`
            ).join('')}
          </div>

          <!-- Footer: assignee + date -->
          <div class="task-card-footer">
            ${assignee ? `
              <div style="display:flex;align-items:center;gap:6px;font-size:var(--font-size-xs);color:var(--text-muted);">
                <div style="width:20px;height:20px;border-radius:50%;
                  background:var(--accent-light);color:var(--accent);
                  display:flex;align-items:center;justify-content:center;
                  font-size:8px;font-weight:700;">
                  ${assignee.initials}
                </div>
                ${assignee.name.split(' ')[0]}
              </div>
            ` : '<span></span>'}
            <span style="font-size:var(--font-size-xs);color:var(--text-muted);">
              ${Utils.formatDate(task.dueDate, 'short')}
            </span>
          </div>

        </div>
      `;
    }).join('');

    return `<div class="tasks-cards-grid">${cardsHTML}</div>`;
  }

  
  function renderContent() {
    const tasks      = getFilteredTasks();
    const container  = Utils.qs('#tasks-content');
    const countEl    = Utils.qs('#tasks-count');

    if (!container) return;

    
    if (countEl) {
      countEl.textContent = `${tasks.length} task${tasks.length !== 1 ? 's' : ''}`;
    }

    
    if (state.view === 'table') {
      container.innerHTML = renderTable(tasks);
      
      Utils.qsa('.tasks-table th[data-col]').forEach(th => {
        th.addEventListener('click', () => {
          const col = th.dataset.col;
          if (state.sortCol === col) {
            state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc';
          } else {
            state.sortCol = col;
            state.sortDir = 'asc';
          }
          renderContent();
        });
      });
    } else if (state.view === 'card') {
      container.innerHTML = renderCards(tasks);
    } else {
      container.innerHTML = renderKanban(tasks);
    }
  }

  
  function buildToolbar() {
    const projectOptions = AppData.projects.map(p =>
      `<option value="${p.id}">${p.name}</option>`
    ).join('');

    return `
      <!-- Search -->
      <div class="tasks-search">
        <i class="fa-solid fa-magnifying-glass"></i>
        <input
          type="text"
          id="tasks-search-input"
          placeholder="Search tasks..."
          aria-label="Search tasks"
        />
      </div>

      <!-- Project filter -->
      <select class="tasks-filter-select" id="tasks-project-select" aria-label="Filter by project">
        <option value="all">All Projects</option>
        ${projectOptions}
      </select>

      <!-- Priority filter -->
      <select class="tasks-filter-select" id="tasks-priority-select" aria-label="Filter by priority">
        <option value="all">All Priorities</option>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>

      <!-- Count -->
      <span class="tasks-count" id="tasks-count">${AppData.tasks.length} tasks</span>

      <!-- View toggle -->
      <div class="view-toggle" role="group" aria-label="View mode">
        <button class="view-toggle-btn active" data-view="kanban"
          aria-label="Kanban view" id="tasks-view-kanban">
          <i class="fa-solid fa-table-columns"></i>
        </button>
        <button class="view-toggle-btn" data-view="table"
          aria-label="Table view" id="tasks-view-table">
          <i class="fa-solid fa-table"></i>
        </button>
        <button class="view-toggle-btn" data-view="card"
          aria-label="Card view" id="tasks-view-card">
          <i class="fa-solid fa-grip"></i>
        </button>
      </div>
    `;
  }

  
  function bindEvents() {
    
    Utils.qs('#tasks-search-input')?.addEventListener('input',
      Utils.debounce((e) => {
        state.query = e.target.value;
        renderContent();
      }, 250)
    );

    
    Utils.qs('#tasks-project-select')?.addEventListener('change', (e) => {
      state.project = e.target.value;
      renderContent();
    });

    
    Utils.qs('#tasks-priority-select')?.addEventListener('change', (e) => {
      state.priority = e.target.value;
      renderContent();
    });

    
    Utils.qs('.view-toggle')?.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-view]');
      if (!btn) return;
      Utils.qsa('.view-toggle-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.view = btn.dataset.view;
      renderContent();
    });

    
    Utils.qs('#btn-add-task')?.addEventListener('click', openAddTaskModal);

    
    Utils.qs('#tasks-content')?.addEventListener('click', (e) => {
      const deleteBtn = e.target.closest('[data-action="delete"]');
      if (deleteBtn) {
        e.stopPropagation();
        const taskId = deleteBtn.dataset.taskId;
        if (taskId) {
          if (confirm('Are you sure you want to delete this task?')) {
            AppData.deleteTask(taskId);
            Utils.toast('Task deleted successfully!', 'success');
            render();
          }
        }
      }
    });
  }

  
  function openAddTaskModal() {
    const container = Utils.qs('#modal-container');
    if (!container) return;

    const projectOptions = AppData.projects.map(p => `
      <option value="${p.id}">${p.name}</option>
    `).join('');

    const assigneeOptions = AppData.team.map(m => `
      <option value="${m.id}">${m.name} (${m.role})</option>
    `).join('');

    container.innerHTML = `
      <div class="modal-backdrop" id="task-modal-backdrop">
        <div class="modal-box" style="max-width: 500px;">
          <div class="modal-header">
            <h3 class="modal-title"><i class="fa-solid fa-square-plus" style="color:var(--accent);margin-right:8px;"></i>Add New Task</h3>
            <button class="modal-close" id="task-modal-close" style="background:none;border:none;cursor:pointer;" aria-label="Close modal">&times;</button>
          </div>
          <form id="add-task-form">
            <div style="margin-bottom:var(--space-4);">
              <label style="display:block;font-size:var(--font-size-xs);font-weight:600;margin-bottom:6px;color:var(--text-secondary);" for="task-title">Task Title *</label>
              <input type="text" id="task-title" class="input" required placeholder="e.g. Set up API endpoints" />
            </div>

            <div style="margin-bottom:var(--space-4);">
              <label style="display:block;font-size:var(--font-size-xs);font-weight:600;margin-bottom:6px;color:var(--text-secondary);" for="task-project">Project *</label>
              <select id="task-project" class="input select" required>
                ${projectOptions}
              </select>
            </div>

            <div style="margin-bottom:var(--space-4);">
              <label style="display:block;font-size:var(--font-size-xs);font-weight:600;margin-bottom:6px;color:var(--text-secondary);" for="task-assignee">Assignee *</label>
              <select id="task-assignee" class="input select" required>
                ${assigneeOptions}
              </select>
            </div>

            <div style="display:flex;gap:var(--space-4);margin-bottom:var(--space-4);">
              <div style="flex:1;">
                <label style="display:block;font-size:var(--font-size-xs);font-weight:600;margin-bottom:6px;color:var(--text-secondary);" for="task-priority">Priority</label>
                <select id="task-priority" class="input select">
                  <option value="High">High</option>
                  <option value="Medium" selected>Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div style="flex:1;">
                <label style="display:block;font-size:var(--font-size-xs);font-weight:600;margin-bottom:6px;color:var(--text-secondary);" for="task-status">Status</label>
                <select id="task-status" class="input select">
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Review">Review</option>
                  <option value="Done" selected>Done</option>
                </select>
              </div>
            </div>

            <div style="display:flex;gap:var(--space-4);margin-bottom:var(--space-4);">
              <div style="flex:1;">
                <label style="display:block;font-size:var(--font-size-xs);font-weight:600;margin-bottom:6px;color:var(--text-secondary);" for="task-due-date">Due Date</label>
                <input type="date" id="task-due-date" class="input" value="${new Date().toISOString().split('T')[0]}" />
              </div>
              <div style="flex:1;">
                <label style="display:block;font-size:var(--font-size-xs);font-weight:600;margin-bottom:6px;color:var(--text-secondary);" for="task-tags">Tags (comma-separated)</label>
                <input type="text" id="task-tags" class="input" placeholder="e.g. ui, js, bug" />
              </div>
            </div>

            <div style="display:flex;justify-content:flex-end;gap:var(--space-3);margin-top:var(--space-6);">
              <button type="button" class="btn btn-secondary" id="task-modal-cancel">Cancel</button>
              <button type="submit" class="btn btn-primary">Save Task</button>
            </div>
          </form>
        </div>
      </div>
    `;

    
    const closeModal = () => { container.innerHTML = ''; };
    Utils.qs('#task-modal-close').addEventListener('click', closeModal);
    Utils.qs('#task-modal-cancel').addEventListener('click', closeModal);
    Utils.qs('#task-modal-backdrop').addEventListener('click', (e) => {
      if (e.target.id === 'task-modal-backdrop') closeModal();
    });

    
    Utils.qs('#add-task-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const title = Utils.qs('#task-title').value.trim();
      const projectId = Utils.qs('#task-project').value;
      const assigneeId = Utils.qs('#task-assignee').value;
      const priority = Utils.qs('#task-priority').value;
      const status = Utils.qs('#task-status').value;
      const dueDate = Utils.qs('#task-due-date').value;
      const tagsInput = Utils.qs('#task-tags').value;

      const tags = tagsInput
        ? tagsInput.split(',').map(t => t.trim()).filter(Boolean)
        : [];

      AppData.addTask({
        title,
        projectId,
        assigneeId,
        priority,
        status,
        dueDate,
        tags
      });

      closeModal();
      Utils.toast('Task added successfully!', 'success');

      
      render();
    });
  }

  
  function render() {
    const page = Utils.qs('#page-tasks');
    if (!page) return;

    page.innerHTML = `
      <!-- Page header -->
      <div class="tasks-header anim-fade-in" style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:var(--space-4);">
        <div>
          <h2>Tasks</h2>
          <p>${AppData.tasks.length} tasks across ${AppData.projects.length} projects</p>
        </div>
        <button class="btn btn-primary" id="btn-add-task"><i class="fa-solid fa-plus"></i> Add Task</button>
      </div>

      <!-- Toolbar -->
      <div class="tasks-toolbar anim-fade-in-down">
        ${buildToolbar()}
      </div>

      <!-- Content area — Kanban / Table / Cards render here -->
      <div id="tasks-content" class="anim-fade-in">
        <!-- renderContent() fills this -->
      </div>
    `;

    bindEvents();
    renderContent();
  }

  
  return {
    init() {
      render();
    }
  };

})();
