const fs = require('fs');
const path = require('path');

// ── Mock DOM Context ──────────────────────────
global.window = {};
global.document = {
  querySelector: (sel) => {
    console.log(`[DOM Query] document.querySelector(\${sel})`);
    if (sel === '#page-tasks') {
      return { innerHTML: '' };
    }
    if (sel === '#modal-container') {
      return { innerHTML: '' };
    }
    if (sel === '#btn-add-task') {
      return { addEventListener: (evt, cb) => {
        console.log(`[Event Register] Bound \${evt} on #btn-add-task`);
        global.btnAddTaskListener = cb;
      }};
    }
    if (sel === '#task-modal-close' || sel === '#task-modal-cancel' || sel === '#task-modal-backdrop') {
      return { addEventListener: (evt, cb) => {
        console.log(`[Event Register] Bound \${evt} on \${sel}`);
      }};
    }
    if (sel === '#add-task-form') {
      return { addEventListener: (evt, cb) => {
        console.log(`[Event Register] Bound \${evt} on #add-task-form`);
        global.addTaskFormListener = cb;
      }};
    }
    return { value: 'MockValue', trim: () => 'MockValue', addEventListener: () => {} };
  },
  querySelectorAll: (sel) => {
    console.log(`[DOM Query] document.querySelectorAll(\${sel})`);
    return [];
  },
  addEventListener: () => {}
};

global.localStorage = {
  getItem: (key) => null,
  setItem: (key, val) => {}
};

// ── Load utilities, store, and data modules ─────
console.log('Loading utils.js...');
let utilsCode = fs.readFileSync(path.join(__dirname, '../js/utils.js'), 'utf8');
utilsCode = utilsCode.replace('const Utils =', 'global.Utils =');
eval(utilsCode);

console.log('Loading store.js...');
let storeCode = fs.readFileSync(path.join(__dirname, '../js/store.js'), 'utf8');
storeCode = storeCode.replace('const Store =', 'global.Store =');
eval(storeCode);

console.log('Loading data.js...');
let dataCode = fs.readFileSync(path.join(__dirname, '../js/data.js'), 'utf8');
dataCode = dataCode.replace('const AppData =', 'global.AppData =');
eval(dataCode);

console.log('Loading tasks.js...');
let tasksCode = fs.readFileSync(path.join(__dirname, '../js/pages/tasks.js'), 'utf8');
tasksCode = tasksCode.replace('const TasksPage =', 'global.TasksPage =');
eval(tasksCode);

// Test execution
try {
  console.log('\nRunning TasksPage.init()...');
  global.TasksPage.init();
  
  console.log('\nSimulating click on #btn-add-task...');
  if (global.btnAddTaskListener) {
    global.btnAddTaskListener();
    console.log('Successfully opened Add Task Modal!');
  } else {
    throw new Error('#btn-add-task listener not registered');
  }

  console.log('\nSimulating submit on #add-task-form...');
  if (global.addTaskFormListener) {
    const mockEvent = { preventDefault: () => {} };
    global.addTaskFormListener(mockEvent);
    console.log('Successfully submitted task form!');
  } else {
    throw new Error('#add-task-form listener not registered');
  }

  console.log('\nAll checks passed successfully without throwing errors!');
} catch (err) {
  console.error('\nERROR DETECTED during simulation:', err);
}
