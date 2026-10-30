<template>
  <div class="tasks-page">
    <!-- ========== 页头：标题 + 新增入口 ========== -->
    <header class="page-header">
      <div>
        <p class="eyebrow">任务中心</p>
        <h2>待办管理</h2>
      </div>
      <button class="primary-btn" type="button" @click="toggleAddForm">
        {{ isAdding ? '收起' : '+ 新增任务' }}
      </button>
    </header>

    <!-- ========== 新增任务表单（点击新增后展开） ========== -->
    <section v-if="isAdding" class="add-form">
      <input
        v-model="newTitle"
        type="text"
        class="add-input"
        placeholder="输入任务标题，回车确认"
        @keyup.enter="addTask"
      />
      <select v-model="newPriority" class="add-select">
        <option value="高">高</option>
        <option value="中">中</option>
        <option value="低">低</option>
      </select>
      <input v-model="newDeadline" type="date" class="add-date" />
      <button class="primary-btn" type="button" @click="addTask">确认添加</button>
      <button class="cancel-btn" type="button" @click="resetForm">取消</button>
    </section>

    <!-- ========== 统计卡：全部 / 进行中 / 已完成 / 今日到期 ========== -->
    <section class="summary-grid">
      <article class="summary-card">
        <span>全部任务</span>
        <strong>{{ tasks.length }}</strong>
      </article>
      <article class="summary-card">
        <span>进行中</span>
        <strong>{{ inProgressCount }}</strong>
      </article>
      <article class="summary-card">
        <span>已完成</span>
        <strong>{{ completedCount }}</strong>
      </article>
      <article class="summary-card">
        <span>今日到期</span>
        <strong>{{ dueTodayCount }}</strong>
      </article>
    </section>

    <!-- ========== 任务面板：筛选 + 列表 ========== -->
    <section class="task-panel">
      <div class="panel-header">
        <div class="filter-group" aria-label="任务筛选">
          <button
            v-for="filter in filters"
            :key="filter.value"
            type="button"
            :class="['filter-btn', { active: currentFilter === filter.value }]"
            @click="currentFilter = filter.value"
          >
            {{ filter.label }}
          </button>
        </div>
      </div>

      <ul v-if="filteredTasks.length" class="task-list">
        <li
          v-for="task in filteredTasks"
          :key="task.id"
          :class="{ done: task.done }"
        >
          <label class="task-main">
            <input
              type="checkbox"
              :checked="task.done"
              @change="toggleTask(task.id, $event.target.checked)"
            />
            <span>{{ task.title }}</span>
          </label>

          <div class="task-meta">
            <span>{{ task.priority }}</span>
            <span>{{ formatDeadline(task.deadline) }}</span>
          </div>

          <button type="button" class="delete-btn" @click="removeTask(task)">
            删除
          </button>
        </li>
      </ul>
      <p v-else class="empty-tip">当前筛选下没有任务</p>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useTasksStore } from '../../stores/tasks'

const filters = [
  { label: '全部', value: 'all' },
  { label: '进行中', value: 'active' },
  { label: '已完成', value: 'done' },
]

// 把日期格式化成 YYYY-MM-DD，用于初始数据和新增
const toDateString = (d) => {
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

// 今天 / 明天 / 本周五的日期字符串
const today = new Date()
const tomorrow = new Date(today)
tomorrow.setDate(today.getDate() + 1)

const tasksStore = useTasksStore()
const { tasks } = storeToRefs(tasksStore)

const currentFilter = ref('all')

// ---------- 新增表单状态 ----------
const isAdding = ref(false)
const newTitle = ref('')
const newPriority = ref('中')
const newDeadline = ref(toDateString(today))

function toggleAddForm() {
  isAdding.value = !isAdding.value
  if (!isAdding.value) resetForm()
}

function resetForm() {
  newTitle.value = ''
  newPriority.value = '中'
  newDeadline.value = toDateString(today)
}

// ---------- 派生数据 ----------
const filteredTasks = computed(() => {
  if (currentFilter.value === 'active') {
    return tasks.value.filter((task) => !task.done)
  }
  if (currentFilter.value === 'done') {
    return tasks.value.filter((task) => task.done)
  }
  return tasks.value
})

const inProgressCount = computed(() => tasks.value.filter((t) => !t.done).length)
const completedCount = computed(() => tasks.value.filter((t) => t.done).length)

// deadline 存的是 YYYY-MM-DD，和今天比较才准确
const dueTodayCount = computed(() => {
  const todayStr = toDateString(new Date())
  return tasks.value.filter((t) => t.deadline === todayStr).length
})

// 把日期显示成「今天 / 明天 / YYYY-MM-DD」
function formatDeadline(dateStr) {
  if (!dateStr) return '待定'
  const todayStr = toDateString(new Date())
  const tomorrowDate = new Date()
  tomorrowDate.setDate(tomorrowDate.getDate() + 1)
  const tomorrowStr = toDateString(tomorrowDate)

  if (dateStr === todayStr) return '今天'
  if (dateStr === tomorrowStr) return '明天'
  return dateStr
}

// ---------- 操作 ----------
function addTask() {
  const title = newTitle.value.trim()
  if (!title) {
    alert('请输入任务标题')
    return
  }

  tasksStore.addTask({
    title,
    priority: newPriority.value,
    deadline: newDeadline.value || '',
  })

  resetForm()
  isAdding.value = false
}

function toggleTask(taskId, done) {
  tasksStore.toggleTask(taskId, done)
}

function removeTask(task) {
  if (!confirm(`确定删除「${task.title}」吗？`)) return
  tasksStore.removeTaskById(task.id)
}
</script>

<style scoped>
.tasks-page {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

/* =========================================================
   页头：标题 + 新增按钮
   ========================================================= */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  background: #fff;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 20px;
  padding: 22px 24px;
}

.eyebrow {
  margin: 0 0 8px;
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #6366f1;
}

.page-header h2 {
  margin: 0;
  font-size: clamp(1.8rem, 2vw, 2.4rem);
}

/* 主按钮：渐变底色，补 hover / focus-visible */
.primary-btn {
  border: none;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: #fff;
  border-radius: 12px;
  padding: 12px 16px;
  cursor: pointer;
  font-weight: 600;
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.primary-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.primary-btn:focus-visible {
  outline: 2px solid #4f46e5;
  outline-offset: 2px;
}

/* =========================================================
   新增表单：标题 / 优先级 / 日期 / 确认 / 取消
   ========================================================= */
.add-form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  background: #fff;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 16px;
  padding: 14px 16px;
}

.add-input,
.add-select,
.add-date {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px 12px;
  font: inherit;
  color: #0f172a;
  background: #f8fafc;
}

.add-input {
  flex: 1;
  min-width: 180px;
}

.add-input:focus-visible,
.add-select:focus-visible,
.add-date:focus-visible {
  outline: 2px solid #4f46e5;
  outline-offset: 1px;
}

/* 取消按钮：中性配色 */
.cancel-btn {
  border: 1px solid #e2e8f0;
  background: #fff;
  color: #475569;
  border-radius: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.15s ease;
}

.cancel-btn:hover {
  background: #f1f5f9;
}

.cancel-btn:focus-visible {
  outline: 2px solid #94a3b8;
  outline-offset: 2px;
}

/* =========================================================
   统计卡：四张
   ========================================================= */
.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(150px, 1fr));
  gap: 16px;
}

.summary-card {
  background: #fff;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 18px;
  padding: 18px 20px;
}

.summary-card span {
  display: block;
  color: #64748b;
  margin-bottom: 10px;
}

.summary-card strong {
  display: block;
  font-size: 2rem;
  color: #0f172a;
}

/* =========================================================
   任务面板：筛选 + 列表
   ========================================================= */
.task-panel {
  background: #fff;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 20px;
  padding: 20px;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.filter-group {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

/* 筛选按钮：默认浅灰，选中靛蓝 */
.filter-btn {
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  color: #475569;
  border-radius: 999px;
  padding: 8px 14px;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}

.filter-btn:hover {
  background: #eef2ff;
  color: #4338ca;
}

.filter-btn.active {
  background: #eef2ff;
  color: #4338ca;
  border-color: #c7d2fe;
}

.filter-btn:focus-visible {
  outline: 2px solid #4f46e5;
  outline-offset: 2px;
}

/* 任务列表：三列 —— 主体 / 元信息 / 删除 */
.task-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.task-list li {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 16px;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #edf2f7;
}

.task-list li:last-child {
  border-bottom: none;
}

/* 完成态：任务文字删除线 + 变灰 */
.task-list li.done .task-main span {
  text-decoration: line-through;
  color: #94a3b8;
}

.task-main {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 500;
  cursor: pointer;
}

.task-main input {
  accent-color: #4f46e5;
}

.task-main input:focus-visible {
  outline: 2px solid #4f46e5;
  outline-offset: 2px;
}

.task-meta {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  color: #64748b;
  font-size: 0.85rem;
}

/* 删除按钮：浅红底红字，补 hover / focus-visible */
.delete-btn {
  border: none;
  background: #fef2f2;
  color: #dc2626;
  border-radius: 10px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background 0.15s ease;
}

.delete-btn:hover {
  background: #fee2e2;
}

.delete-btn:focus-visible {
  outline: 2px solid #dc2626;
  outline-offset: 2px;
}

/* 空状态提示 */
.empty-tip {
  margin: 0;
  padding: 24px 0;
  text-align: center;
  color: #94a3b8;
  font-size: 0.9rem;
}

/* =========================================================
   响应式：≤700px
   ========================================================= */
@media (max-width: 700px) {
  .summary-grid {
    grid-template-columns: 1fr 1fr;
  }

  /* 页头与任务行改为纵向 flex；不再保留无用的 grid-template-columns */
  .page-header,
  .task-list li {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .add-form {
    flex-direction: column;
    align-items: stretch;
  }

  .add-input {
    min-width: 0;
  }
}
</style>