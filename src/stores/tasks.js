import { defineStore } from 'pinia'

const TASKS_STORAGE_KEY = 'blog-app:tasks'

const pad = (n) => String(n).padStart(2, '0')
const toDateString = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

function createDefaultTasks() {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  return [
    { id: 1, title: '整理产品需求文档', priority: '高', deadline: toDateString(today), done: true },
    { id: 2, title: '复盘本周设计反馈', priority: '中', deadline: toDateString(tomorrow), done: false },
    { id: 3, title: '更新工作台首页布局', priority: '高', deadline: toDateString(today), done: false },
    { id: 4, title: '准备周会演示稿', priority: '中', deadline: toDateString(tomorrow), done: false },
  ]
}

function normalizeTasks(input) {
  if (!Array.isArray(input)) return []

  return input
    .filter((item) => item && typeof item === 'object')
    .map((item) => ({
      id: Number(item.id),
      title: String(item.title ?? ''),
      priority: String(item.priority ?? '中'),
      deadline: String(item.deadline ?? ''),
      done: Boolean(item.done),
    }))
    .filter((item) => Number.isFinite(item.id) && item.id > 0 && item.title)
}

function loadTasks() {
  try {
    const raw = localStorage.getItem(TASKS_STORAGE_KEY)
    if (!raw) return createDefaultTasks()

    const parsed = JSON.parse(raw)
    const normalized = normalizeTasks(parsed)
    return normalized.length ? normalized : createDefaultTasks()
  } catch {
    return createDefaultTasks()
  }
}

export const useTasksStore = defineStore('tasks', {
  state: () => {
    const tasks = loadTasks()
    const maxId = tasks.reduce((max, task) => Math.max(max, task.id), 0)

    return {
      tasks,
      nextId: maxId + 1,
    }
  },

  actions: {
    persistTasks() {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(this.tasks))
    },

    addTask({ title, priority = '中', deadline = '' }) {
      this.tasks.unshift({
        id: this.nextId++,
        title,
        priority,
        deadline,
        done: false,
      })
      this.persistTasks()
    },

    toggleTask(taskId, done) {
      const task = this.tasks.find((item) => item.id === taskId)
      if (!task) return
      task.done = done
      this.persistTasks()
    },

    removeTaskById(taskId) {
      this.tasks = this.tasks.filter((item) => item.id !== taskId)
      this.persistTasks()
    },
  },
})
