

const AppData = (() => {

  
  const DEFAULT_PROJECTS = [
    {
      id: 'proj-001',
      name: 'Data Visualization Dashboard',
      slug: 'data-visualization-dashboard',
      description: 'An interactive dashboard for visualizing complex datasets using custom Canvas charts. Features multiple chart types, real-time filtering, and export capabilities.',
      thumbnail: '',
      category: 'Data & Analytics',
      status: 'Completed',
      progress: 100,
      completionDate: '2026-06-28',
      startDate: '2026-06-26',
      technologies: ['HTML5', 'CSS3', 'JavaScript'],
      tags: ['dashboard', 'charts', 'data', 'analytics', 'visualization'],
      teamIds: ['tm-001'],
      taskIds: ['task-001', 'task-002', 'task-003', 'task-004', 'task-005', 'task-008'],
      features: [
        'Interactive bar, line, and pie charts',
        'Dynamic data filtering',
        'Responsive grid layout',
        'Dark mode support',
        'CSV data export'
      ],
      challenges: 'Rendering large datasets without performance drops required using CSS flexbox layout structures and DOM recycling algorithms.',
      solutions: 'Implemented virtual lists to only render active cards and debounced browser reflow events.',
      lessonsLearned: 'DOM virtualization prevents browser paint lags. Planning the grid layout structure upfront saved refactoring time.',
      screenshots: [],
      documentation: 'Built as a weekly assignment project. Focused on pure vanilla JS charting without any library.',
      notes: 'Could be extended with WebSockets for live data feeds.',
      relatedProjectIds: ['proj-002'],
      githubUrl: '#', liveUrl: '#', priority: 'High'
    },
    {
      id: 'proj-002',
      name: 'Weather Forecast App',
      slug: 'weather-forecast-app',
      description: 'A clean, responsive weather application that displays current conditions, 7-day forecasts, and animated weather icons.',
      thumbnail: '',
      category: 'Web Application',
      status: 'Completed',
      progress: 100,
      completionDate: '2026-06-25',
      startDate: '2026-06-23',
      technologies: ['HTML5', 'CSS3', 'JavaScript'],
      tags: ['weather', 'responsive', 'animations'],
      teamIds: ['tm-001'],
      taskIds: ['task-006', 'task-007', 'task-009', 'task-010', 'task-011', 'task-012'],
      features: [
        'Real-time weather data display',
        '7-day forecast with icons',
        'Search by city name',
        'Animated weather transitions'
      ],
      challenges: 'Handling API rate limits and structuring responsive layouts for mobile weather views.',
      solutions: 'Added caching of raw city forecasts and unified response parsing utilities.',
      lessonsLearned: 'Caching response payloads locally improves page speed significantly.',
      screenshots: [],
      documentation: 'Clean, minimal UI inspired by iOS Weather app.',
      notes: 'Could add hourly breakdown and UV index data.',
      relatedProjectIds: ['proj-001'],
      githubUrl: '#', liveUrl: '#', priority: 'Medium'
    }
  ];

  const DEFAULT_TEAM = [
    {
      id: 'tm-001',
      name: 'Kartikae',
      role: 'Lead Developer',
      initials: 'K',
      email: 'kartik@example.com',
      skills: ['HTML5', 'CSS3', 'JavaScript', 'UI Design'],
      projectIds: ['proj-001', 'proj-002'],
      completedTasks: 4,
      bio: 'Full-stack frontend developer passionate about building clean, performant web applications.'
    }
  ];

  const DEFAULT_TASKS = [
    
    { id:'task-001', projectId:'proj-001', title:'Set up project folder structure',          status:'Done',        priority:'High',   assigneeId:'tm-001', dueDate:'2026-06-26', tags:['setup'] },
    { id:'task-002', projectId:'proj-001', title:'Design dashboard layouts & variables',      status:'Done',        priority:'Medium', assigneeId:'tm-001', dueDate:'2026-06-26', tags:['ui','css'] },
    { id:'task-003', projectId:'proj-001', title:'Implement charts drawing engine',           status:'Done',        priority:'High',   assigneeId:'tm-001', dueDate:'2026-06-28', tags:['charts','js'] },
    { id:'task-004', projectId:'proj-001', title:'Integrate CSV export data parsing',         status:'In Progress', priority:'Medium', assigneeId:'tm-001', dueDate:'2026-06-27', tags:['js','data'] },
    { id:'task-005', projectId:'proj-001', title:'Optimize DOM recycling list performance',    status:'Review',      priority:'High',   assigneeId:'tm-001', dueDate:'2026-06-28', tags:['performance'] },
    { id:'task-008', projectId:'proj-001', title:'Write comprehensive test cases for charts', status:'To Do',       priority:'Low',    assigneeId:'tm-001', dueDate:'2026-06-28', tags:['testing'] },

    
    { id:'task-009', projectId:'proj-002', title:'Implement local city search input field',   status:'Done',        priority:'High',   assigneeId:'tm-001', dueDate:'2026-06-23', tags:['ui','js'] },
    { id:'task-010', projectId:'proj-002', title:'Create responsive stylesheet for mobile',    status:'Done',        priority:'Medium', assigneeId:'tm-001', dueDate:'2026-06-23', tags:['css'] },
    { id:'task-006', projectId:'proj-002', title:'Build weather retrieval engine',            status:'Done',        priority:'High',   assigneeId:'tm-001', dueDate:'2026-06-24', tags:['api'] },
    { id:'task-011', projectId:'proj-002', title:'Incorporate localStorage cache layer',      status:'In Progress', priority:'Low',    assigneeId:'tm-001', dueDate:'2026-06-24', tags:['js','storage'] },
    { id:'task-007', projectId:'proj-002', title:'Design weather card UI with animations',    status:'Done',        priority:'Medium', assigneeId:'tm-001', dueDate:'2026-06-25', tags:['ui','css'] },
    { id:'task-012', projectId:'proj-002', title:'Verify API failure fallbacks and city list', status:'To Do',       priority:'High',   assigneeId:'tm-001', dueDate:'2026-06-25', tags:['testing','api'] }
  ];

  const DEFAULT_EVENTS = [
    
    { id: 'evt-t1', title: 'Task: Folder structure setup', date: '2026-06-26', type: 'milestone', projectId: 'proj-001', description: 'Set up project folder structure completed.' },
    { id: 'evt-t2', title: 'Task: Layout & variable designs', date: '2026-06-26', type: 'milestone', projectId: 'proj-001', description: 'Design dashboard layouts & variables completed.' },
    { id: 'evt-t3', title: 'Task: Charts drawing engine', date: '2026-06-28', type: 'completion', projectId: 'proj-001', description: 'Implement charts drawing engine completed.' },
    { id: 'evt-t4', title: 'Task: CSV export integration', date: '2026-06-27', type: 'meeting', projectId: 'proj-001', description: 'Integrate CSV export data parsing progress.' },
    { id: 'evt-t5', title: 'Task: DOM performance review', date: '2026-06-28', type: 'meeting', projectId: 'proj-001', description: 'Optimize DOM recycling list performance review.' },
    { id: 'evt-t8', title: 'Task: Charts testing QA', date: '2026-06-28', type: 'milestone', projectId: 'proj-001', description: 'Write comprehensive test cases for charts.' },

    
    { id: 'evt-t9', title: 'Task: City search field setup', date: '2026-06-23', type: 'milestone', projectId: 'proj-002', description: 'Implement local city search input field completed.' },
    { id: 'evt-t10', title: 'Task: Mobile layout styling', date: '2026-06-23', type: 'milestone', projectId: 'proj-002', description: 'Create responsive stylesheet for mobile completed.' },
    { id: 'evt-t6', title: 'Task: Weather retrieval engine', date: '2026-06-24', type: 'completion', projectId: 'proj-002', description: 'Build weather retrieval engine completed.' },
    { id: 'evt-t11', title: 'Task: localStorage integration', date: '2026-06-24', type: 'meeting', projectId: 'proj-002', description: 'Incorporate localStorage cache layer progress.' },
    { id: 'evt-t7', title: 'Task: Weather animations UI', date: '2026-06-25', type: 'completion', projectId: 'proj-002', description: 'Design weather card UI with animations completed.' },
    { id: 'evt-t12', title: 'Task: API fallbacks testing', date: '2026-06-25', type: 'milestone', projectId: 'proj-002', description: 'Verify API failure fallbacks and city list QA.' }
  ];

  
  let projects = [];
  let team     = [];
  let tasks    = [];
  let events   = [];

  
  function loadData() {
    try {
      const p = localStorage.getItem('ppd_projects');
      const t = localStorage.getItem('ppd_team');
      const k = localStorage.getItem('ppd_tasks');
      const e = localStorage.getItem('ppd_events');

      projects = p ? JSON.parse(p) : [...DEFAULT_PROJECTS];
      team     = t ? JSON.parse(t) : [...DEFAULT_TEAM];
      tasks    = k ? JSON.parse(k) : [...DEFAULT_TASKS];
      events   = e ? JSON.parse(e) : [...DEFAULT_EVENTS];

      
      const taskEventIds = new Set([
        'evt-t1', 'evt-t2', 'evt-t3', 'evt-t4', 'evt-t5', 'evt-t8',
        'evt-t9', 'evt-t10', 'evt-t6', 'evt-t11', 'evt-t7', 'evt-t12'
      ]);
      const refEvents = new Set(['evt-001', 'evt-002', 'evt-003', 'evt-004', 'evt-005', 'evt-006']);
      
      
      events = events.filter(evt => !refEvents.has(evt.id) && !taskEventIds.has(evt.id));
      events = [...DEFAULT_EVENTS, ...events];

      
      projects.forEach(proj => {
        if (proj.id === 'proj-001') {
          proj.startDate = '2026-06-26';
          proj.completionDate = '2026-06-28';
          proj.technologies = ['HTML5', 'CSS3', 'JavaScript'];
          proj.challenges = 'Rendering large datasets without performance drops required using CSS flexbox layout structures and DOM recycling algorithms.';
          proj.solutions = 'Implemented virtual lists to only render active cards and debounced browser reflow events.';
          proj.lessonsLearned = 'DOM virtualization prevents browser paint lags. Planning the grid layout structure upfront saved refactoring time.';
          proj.taskIds = ['task-001', 'task-002', 'task-003', 'task-004', 'task-005', 'task-008'];
        } else if (proj.id === 'proj-002') {
          proj.startDate = '2026-06-23';
          proj.completionDate = '2026-06-25';
          proj.technologies = ['HTML5', 'CSS3', 'JavaScript'];
          proj.challenges = 'Handling API rate limits and structuring responsive layouts for mobile weather views.';
          proj.solutions = 'Added caching of raw city forecasts and unified response parsing utilities.';
          proj.lessonsLearned = 'Caching response payloads locally improves page speed significantly.';
          proj.taskIds = ['task-006', 'task-007', 'task-009', 'task-010', 'task-011', 'task-012'];
        }
      });

      
      const standardTaskIds = new Set([
        'task-001', 'task-002', 'task-003', 'task-004', 'task-005',
        'task-006', 'task-007', 'task-008', 'task-009', 'task-010',
        'task-011', 'task-012'
      ]);
      const userTasks = tasks.filter(t => !standardTaskIds.has(t.id));
      tasks = [...DEFAULT_TASKS, ...userTasks];

      
      saveData();
    } catch (err) {
      console.error('Failed to load data from localStorage', err);
      projects = [...DEFAULT_PROJECTS];
      team     = [...DEFAULT_TEAM];
      tasks    = [...DEFAULT_TASKS];
      events   = [...DEFAULT_EVENTS];
    }
  }

  function saveData() {
    try {
      localStorage.setItem('ppd_projects', JSON.stringify(projects));
      localStorage.setItem('ppd_team',     JSON.stringify(team));
      localStorage.setItem('ppd_tasks',    JSON.stringify(tasks));
      localStorage.setItem('ppd_events',   JSON.stringify(events));
    } catch (err) {
      console.error('Failed to save data to localStorage', err);
    }
  }

  
  loadData();

  

  
  function getProject(id) {
    return projects.find(p => p.id === id) || null;
  }

  
  function getMember(id) {
    const member = team.find(m => m.id === id) || null;
    if (member) {
      member.completedTasks = tasks.filter(t => t.assigneeId === member.id && t.status === 'Done').length;
    }
    return member;
  }

  
  function getTasksByProject(projectId) {
    return tasks.filter(t => t.projectId === projectId);
  }

  
  function getMembersByProject(projectId) {
    const project = getProject(projectId);
    if (!project) return [];
    return project.teamIds.map(id => getMember(id)).filter(Boolean);
  }

  
  function getEventsByProject(projectId) {
    return events.filter(e => e.projectId === projectId);
  }

  
  function getCategoryStats() {
    const counts = {};
    projects.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value);
  }

  
  function getTechStats(topN = 8) {
    const counts = {};
    projects.forEach(p => {
      p.technologies.forEach(tech => {
        counts[tech] = (counts[tech] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, topN);
  }

  
  function getMonthlyCompletions() {
    const sorted = [...projects]
      .filter(p => p.completionDate)
      .sort((a, b) => new Date(a.completionDate) - new Date(b.completionDate));

    if (!sorted.length) return [];

    const monthMap = {};
    sorted.forEach(p => {
      const d = new Date(p.completionDate);
      const key   = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2,'0')}`;
      const label = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      monthMap[key] = { label, value: (monthMap[key]?.value || 0) + 1 };
    });

    return Object.entries(monthMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, val]) => val);
  }

  
  function getRecentActivity(limit = 8) {
    return [...events]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
  }

  

  
  function addProject(projectData) {
    const id = `proj-${Date.now()}`;
    const newProject = {
      id,
      name: projectData.name || 'New Project',
      slug: (projectData.name || 'new-project').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: projectData.description || '',
      thumbnail: '',
      category: projectData.category || 'Web Application',
      status: projectData.status || 'Completed',
      progress: parseInt(projectData.progress, 10) || 100,
      completionDate: projectData.completionDate || new Date().toISOString().split('T')[0],
      startDate: projectData.startDate || new Date().toISOString().split('T')[0],
      technologies: projectData.technologies || [],
      tags: projectData.tags || [],
      teamIds: projectData.teamIds || ['tm-001'],
      taskIds: [],
      features: projectData.features || [],
      challenges: projectData.challenges || '',
      solutions: projectData.solutions || '',
      lessonsLearned: projectData.lessonsLearned || '',
      screenshots: [],
      documentation: projectData.documentation || '',
      notes: projectData.notes || '',
      relatedProjectIds: [],
      githubUrl: projectData.githubUrl || '#',
      liveUrl: projectData.liveUrl || '#',
      priority: projectData.priority || 'Medium'
    };

    projects.push(newProject);

    
    events.push({
      id: `evt-${Date.now()}`,
      title: `${newProject.name} — Added`,
      date: newProject.startDate,
      type: 'milestone',
      projectId: id,
      description: 'Project added to Management system.'
    });

    saveData();
    return newProject;
  }

  
  function addMember(memberData) {
    const id = `tm-${Date.now()}`;
    const name = memberData.name || 'New Member';
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    const newMember = {
      id,
      name,
      role: memberData.role || 'Contributor',
      initials,
      email: memberData.email || 'member@example.com',
      skills: memberData.skills || [],
      projectIds: memberData.projectIds || [],
      completedTasks: 0,
      bio: memberData.bio || ''
    };

    team.push(newMember);

    
    newMember.projectIds.forEach(pid => {
      const proj = getProject(pid);
      if (proj && !proj.teamIds.includes(id)) {
        proj.teamIds.push(id);
      }
    });

    saveData();
    return newMember;
  }

  
  function addTask(taskData) {
    const id = `task-${Date.now()}`;
    const newTask = {
      id,
      projectId: taskData.projectId,
      title: taskData.title || 'New Task',
      status: taskData.status || 'To Do',
      priority: taskData.priority || 'Medium',
      assigneeId: taskData.assigneeId || 'tm-001',
      dueDate: taskData.dueDate || new Date().toISOString().split('T')[0],
      tags: taskData.tags || []
    };

    tasks.push(newTask);

    
    const proj = getProject(newTask.projectId);
    if (proj && !proj.taskIds.includes(id)) {
      proj.taskIds.push(id);
    }

    
    const member = getMember(newTask.assigneeId);
    if (member) {
      if (!member.projectIds.includes(newTask.projectId)) {
        member.projectIds.push(newTask.projectId);
      }
      
      if (newTask.status === 'Done') {
        member.completedTasks = tasks.filter(t => t.assigneeId === member.id && t.status === 'Done').length;
      }
    }

    
    events.push({
      id: `evt-${Date.now()}`,
      title: `Task Added: ${newTask.title}`,
      date: new Date().toISOString().split('T')[0],
      type: 'task',
      projectId: newTask.projectId,
      description: `Assigned to ${member ? member.name : 'Unknown'}.`
    });

    saveData();
    return newTask;
  }

  
  function resetToDefaults() {
    projects = [...DEFAULT_PROJECTS];
    team     = [...DEFAULT_TEAM];
    tasks    = [...DEFAULT_TASKS];
    events   = [...DEFAULT_EVENTS];
    saveData();
  }

  
  function deleteProject(projectId) {
    projects = projects.filter(p => p.id !== projectId);
    tasks = tasks.filter(t => t.projectId !== projectId);
    events = events.filter(e => e.projectId !== projectId);

    
    team.forEach(m => {
      m.projectIds = m.projectIds.filter(pid => pid !== projectId);
      m.completedTasks = tasks.filter(t => t.assigneeId === m.id && t.status === 'Done').length;
    });

    saveData();
  }

  
  function deleteMember(memberId) {
    team = team.filter(m => m.id !== memberId);

    
    projects.forEach(p => {
      p.teamIds = p.teamIds.filter(tid => tid !== memberId);
    });

    
    tasks.forEach(t => {
      if (t.assigneeId === memberId) {
        t.assigneeId = null;
      }
    });

    saveData();
  }

  
  function deleteTask(taskId) {
    const taskToDelete = tasks.find(t => t.id === taskId);
    if (!taskToDelete) return;

    tasks = tasks.filter(t => t.id !== taskId);

    
    const proj = getProject(taskToDelete.projectId);
    if (proj) {
      proj.taskIds = proj.taskIds.filter(tid => tid !== taskId);
    }

    
    const member = getMember(taskToDelete.assigneeId);
    if (member) {
      member.completedTasks = tasks.filter(t => t.assigneeId === member.id && t.status === 'Done').length;
    }

    saveData();
  }

  
  return {
    get projects() { return projects; },
    get team() {
      team.forEach(m => {
        m.completedTasks = tasks.filter(t => t.assigneeId === m.id && t.status === 'Done').length;
      });
      return team;
    },
    get tasks() { return tasks; },
    get events() { return events; },
    getProject, getMember,
    getTasksByProject, getMembersByProject, getEventsByProject,
    getCategoryStats, getTechStats, getMonthlyCompletions, getRecentActivity,
    addProject, addMember, addTask, deleteProject, deleteMember, deleteTask, resetToDefaults
  };

})();
