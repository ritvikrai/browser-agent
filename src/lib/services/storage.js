import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const TASKS_FILE = path.join(DATA_DIR, 'tasks.json');
const WORKFLOWS_FILE = path.join(DATA_DIR, 'workflows.json');

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (e) {}
}

// Tasks
export async function saveTask(task, steps, result) {
  await ensureDataDir();
  let data;
  try {
    const file = await fs.readFile(TASKS_FILE, 'utf-8');
    data = JSON.parse(file);
  } catch (e) {
    data = { tasks: [] };
  }
  
  const saved = {
    id: Date.now().toString(),
    task,
    steps,
    result,
    status: result?.success ? 'completed' : 'failed',
    createdAt: new Date().toISOString(),
  };
  
  data.tasks.unshift(saved);
  data.tasks = data.tasks.slice(0, 100);
  
  await fs.writeFile(TASKS_FILE, JSON.stringify(data, null, 2));
  return saved;
}

export async function getTasks() {
  await ensureDataDir();
  try {
    const file = await fs.readFile(TASKS_FILE, 'utf-8');
    return JSON.parse(file).tasks;
  } catch (e) {
    return [];
  }
}

// Saved workflows (reusable task templates)
export async function saveWorkflow(name, description, steps) {
  await ensureDataDir();
  let data;
  try {
    const file = await fs.readFile(WORKFLOWS_FILE, 'utf-8');
    data = JSON.parse(file);
  } catch (e) {
    data = { workflows: [] };
  }
  
  const workflow = {
    id: Date.now().toString(),
    name,
    description,
    steps,
    createdAt: new Date().toISOString(),
  };
  
  data.workflows.push(workflow);
  await fs.writeFile(WORKFLOWS_FILE, JSON.stringify(data, null, 2));
  return workflow;
}

export async function getWorkflows() {
  await ensureDataDir();
  try {
    const file = await fs.readFile(WORKFLOWS_FILE, 'utf-8');
    return JSON.parse(file).workflows;
  } catch (e) {
    return [];
  }
}
