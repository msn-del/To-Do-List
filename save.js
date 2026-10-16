const STORAGE_KEY = 'todo-tasks';

let tasks = loadTasks();     // [{ id, text, done }]
let filter = 'all';          // 'all' | 'active' | 'done'
let editingId = null;        // id of the task being edited, if any

const form = document.getElementById('addForm');
const input = document.getElementById('taskInput');
const listEl = document.getElementById('taskList');
const emptyEl = document.getElementById('emptyState');
const countEl = document.getElementById('count');
const clearBtn = document.getElementById('clearDone');
const filterBtns = document.querySelectorAll('[data-filter]');

document.getElementById('today').textContent = new Date().toLocaleDateString(undefined, {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
});

/* ---------- Storage ---------- */

function loadTasks() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(data)
      ? data.filter(t => t && typeof t.text === 'string')
      : [];
  } catch {
    return [];
  }
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // Storage can be unavailable (private mode, quota); the list still works for this session.
  }
}

/* ---------- Actions ---------- */

function addTask(text) {
  const clean = text.trim();
  if (!clean) return false;
  tasks.push({
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    text: clean,
    done: false,
  });
  saveTasks();
  render();
  return true;
}

function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  task.done = !task.done;
  saveTasks();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  render();
}

function startEdit(id) {
  editingId = id;
  render();
  const field = listEl.querySelector('.edit-input');
  if (field) {
    field.focus();
    field.select();
  }
}

function finishEdit(id, newText) {
  if (editingId !== id) return;      // already finished (guards against Enter + blur firing twice)
  editingId = null;
  const clean = newText.trim();
  if (clean) {
    const task = tasks.find(t => t.id === id);
    if (task) task.text = clean;
    saveTasks();
  }
  render();
}

function cancelEdit() {
  editingId = null;
  render();
}

function clearCompleted() {
  tasks = tasks.filter(t => !t.done);
  saveTasks();
  render();
}

/* ---------- Rendering ---------- */

function createItem(task) {
  const li = document.createElement('li');
  li.className = 'task' + (task.done ? ' done' : '');
  li.dataset.id = task.id;

  const label = document.createElement('label');
  label.className = 'check';
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = task.done;
  checkbox.setAttribute('aria-label', `Mark "${task.text}" as done`);
  const box = document.createElement('span');
  box.className = 'box';
  label.append(checkbox, box);
  li.append(label);

  if (task.id === editingId) {
    const field = document.createElement('input');
    field.className = 'edit-input';
    field.value = task.text;
    field.maxLength = 200;
    field.setAttribute('aria-label', 'Edit task');
    li.append(field);
    return li;
  }

  // textContent keeps whatever the user types from being run as HTML
  const text = document.createElement('span');
  text.className = 'text';
  text.textContent = task.text;
  li.append(text);

  const actions = document.createElement('div');
  actions.className = 'actions';
  const edit = document.createElement('button');
  edit.type = 'button';
  edit.className = 'edit';
  edit.textContent = 'Edit';
  edit.setAttribute('aria-label', `Edit "${task.text}"`);
  const del = document.createElement('button');
  del.type = 'button';
  del.className = 'delete';
  del.textContent = 'Delete';
  del.setAttribute('aria-label', `Delete "${task.text}"`);
  actions.append(edit, del);
  li.append(actions);

  return li;
}

function render() {
  const visible = tasks.filter(t =>
    filter === 'all' || (filter === 'active' ? !t.done : t.done)
  );
  listEl.replaceChildren(...visible.map(createItem));

  const left = tasks.filter(t => !t.done).length;
  countEl.textContent = tasks.length
    ? `${left} ${left === 1 ? 'task' : 'tasks'} left`
    : '';
  clearBtn.hidden = !tasks.some(t => t.done);

  if (visible.length === 0) {
    emptyEl.hidden = false;
    emptyEl.textContent = tasks.length === 0
      ? 'No tasks yet. Type one above and press Enter.'
      : filter === 'active'
        ? 'Nothing left to do.'
        : 'No completed tasks yet.';
  } else {
    emptyEl.hidden = true;
  }

  filterBtns.forEach(btn => {
    btn.setAttribute('aria-pressed', String(btn.dataset.filter === filter));
  });
}

/* ---------- Events ---------- */

form.addEventListener('submit', event => {
  event.preventDefault();
  if (addTask(input.value)) input.value = '';
  input.focus();
});

listEl.addEventListener('change', event => {
  if (!event.target.matches('.check input')) return;
  toggleTask(event.target.closest('.task').dataset.id);
});

listEl.addEventListener('click', event => {
  const id = event.target.closest('.task')?.dataset.id;
  if (!id) return;
  if (event.target.closest('.delete')) deleteTask(id);
  else if (event.target.closest('.edit')) startEdit(id);
});

listEl.addEventListener('dblclick', event => {
  if (!event.target.matches('.text')) return;
  startEdit(event.target.closest('.task').dataset.id);
});

listEl.addEventListener('keydown', event => {
  if (!event.target.matches('.edit-input')) return;
  const id = event.target.closest('.task').dataset.id;
  if (event.key === 'Enter') finishEdit(id, event.target.value);
  else if (event.key === 'Escape') cancelEdit();
});

listEl.addEventListener('focusout', event => {
  if (!event.target.matches('.edit-input')) return;
  finishEdit(event.target.closest('.task').dataset.id, event.target.value);
});

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filter = btn.dataset.filter;
    render();
  });
});

clearBtn.addEventListener('click', clearCompleted);

render();
