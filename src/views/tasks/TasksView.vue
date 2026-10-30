<template>
  <div class="tasks-page">
    <!-- ========== 页头：标题 + 新增入口 ========== -->
    <header class="page-header">
      <div>
        <p class="eyebrow">任务中心</p>
        <h2>待办管理</h2>
      </div>
      <button class="primary-btn" type="button" @click="toggleAddForm">
        {{ isAdding ? '收起' : '+ 新增待办' }}
      </button>
    </header>

    <!-- ========== 新增任务弹窗（居中） ========== -->
    <div v-if="isAdding" class="modal-mask" @click.self="closeAddModal">
      <section class="task-modal" role="dialog" aria-modal="true" aria-label="新增任务">
        <header class="modal-header">
          <h3>新增待办</h3>
          <button type="button" class="icon-btn" @click="closeAddModal">关闭</button>
        </header>

        <div class="modal-body">
          <label class="field-label" for="task-title">任务标题</label>
          <input
            id="task-title"
            v-model="newTitle"
            type="text"
            class="add-input"
            placeholder="输入任务标题"
            @keyup.enter="addTask"
          />

          <div class="mode-group" aria-label="任务时间模式">
            <button
              v-for="mode in dateModes"
              :key="mode.value"
              type="button"
              :class="['mode-btn', { active: selectedMode === mode.value }]"
              @click="setDateMode(mode.value)"
            >
              {{ mode.label }}
            </button>
          </div>

          <div class="calendar-panel">
            <div class="calendar-header">
              <button type="button" class="icon-btn" @click="goPrevMonth">上月</button>
              <strong>{{ monthTitle }}</strong>
              <button type="button" class="icon-btn" @click="goNextMonth">下月</button>
            </div>

            <div class="weekday-row">
              <span v-for="day in weekNames" :key="day">{{ day }}</span>
            </div>

            <div class="calendar-grid">
              <button
                v-for="day in calendarDays"
                :key="day.key"
                type="button"
                :disabled="!day.currentMonth"
                :class="[
                  'day-cell',
                  { muted: !day.currentMonth, selected: isDateSelected(day.dateStr), inRange: isDateInRange(day.dateStr) },
                ]"
                @click="pickDate(day.dateStr)"
              >
                {{ day.dayNumber }}
              </button>
            </div>
          </div>

          <p class="selected-tip">{{ selectedDateText }}</p>

          <div class="setting-row">
            <div class="setting-item">
              <label class="field-label">时间</label>
              <div class="time-mode-group">
                <button
                  type="button"
                  :class="['time-mode-btn', { active: timeType === 'point' }]"
                  @click="timeType = 'point'"
                >
                  时间点
                </button>
                <button
                  type="button"
                  :class="['time-mode-btn', { active: timeType === 'range' }]"
                  @click="timeType = 'range'"
                >
                  时间段
                </button>
              </div>
              <div v-if="timeType === 'point'" class="time-input-group">
                <input id="task-time" v-model="newTime" type="time" class="add-date" />
              </div>
              <div v-else class="time-input-group">
                <input id="task-time-start" v-model="newTime" type="time" class="add-date" placeholder="开始" />
                <span class="time-separator">至</span>
                <input id="task-time-end" v-model="newTimeEnd" type="time" class="add-date" placeholder="结束" />
              </div>
            </div>

            <div class="setting-item">
              <label class="field-label" for="task-repeat">重复</label>
              <select id="task-repeat" v-model="newRepeat" class="add-select">
                <option value="不重复">不重复</option>
                <option value="每天">每天</option>
                <option value="每周">每周</option>
                <option value="每月">每月</option>
              </select>
            </div>

            <div class="setting-item">
              <label class="field-label" for="task-priority">优先级</label>
              <select id="task-priority" v-model="newPriority" class="add-select">
                <option value="高">高</option>
                <option value="中">中</option>
                <option value="低">低</option>
              </select>
            </div>
          </div>
        </div>

        <footer class="modal-footer">
          <button class="cancel-btn" type="button" @click="closeAddModal">取消</button>
          <button class="primary-btn" type="button" @click="addTask">确认添加</button>
        </footer>
      </section>
    </div>

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

const dateModes = [
  { label: '单日', value: 'single' },
  { label: '跨天', value: 'range' },
  { label: '自选多日', value: 'multi' },
]

const weekNames = ['一', '二', '三', '四', '五', '六', '日']

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
const newTime = ref('09:00')
const newTimeEnd = ref('17:00')
const newRepeat = ref('不重复')
const timeType = ref('point')

const selectedMode = ref('single')
const selectedSingleDate = ref(toDateString(today))
const selectedRangeStart = ref('')
const selectedRangeEnd = ref('')
const selectedMultiDates = ref([])
const calendarMonth = ref(new Date(today.getFullYear(), today.getMonth(), 1))

const monthTitle = computed(() => {
  const y = calendarMonth.value.getFullYear()
  const m = String(calendarMonth.value.getMonth() + 1).padStart(2, '0')
  return `${y} 年 ${m} 月`
})

const calendarDays = computed(() => {
  const year = calendarMonth.value.getFullYear()
  const month = calendarMonth.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const firstWeekday = (firstDay.getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const days = []

  for (let i = 0; i < firstWeekday; i++) {
    const d = new Date(year, month, i - firstWeekday + 1)
    days.push({
      key: `prev-${i}-${toDateString(d)}`,
      dayNumber: d.getDate(),
      dateStr: toDateString(d),
      currentMonth: false,
    })
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(year, month, i)
    days.push({
      key: `cur-${i}`,
      dayNumber: i,
      dateStr: toDateString(d),
      currentMonth: true,
    })
  }

  while (days.length < 42) {
    const i = days.length - (firstWeekday + daysInMonth) + 1
    const d = new Date(year, month + 1, i)
    days.push({
      key: `next-${i}-${toDateString(d)}`,
      dayNumber: d.getDate(),
      dateStr: toDateString(d),
      currentMonth: false,
    })
  }

  return days
})

const selectedDateText = computed(() => {
  if (selectedMode.value === 'single') {
    return `已选日期：${selectedSingleDate.value}`
  }

  if (selectedMode.value === 'range') {
    if (!selectedRangeStart.value) return '请选择开始日期'
    if (!selectedRangeEnd.value) return `开始日期：${selectedRangeStart.value}`
    return `时间范围：${selectedRangeStart.value} 至 ${selectedRangeEnd.value}`
  }

  if (!selectedMultiDates.value.length) return '请选择至少一天'
  return `已选 ${selectedMultiDates.value.length} 天：${selectedMultiDates.value.join('、')}`
})

function toggleAddForm() {
  if (!isAdding.value) {
    resetForm()
    isAdding.value = true
    return
  }

  closeAddModal()
}

function closeAddModal() {
  isAdding.value = false
  resetForm()
}

function resetForm() {
  newTitle.value = ''
  newPriority.value = '中'
  newTime.value = '09:00'
  newTimeEnd.value = '17:00'
  newRepeat.value = '不重复'
  timeType.value = 'point'
  selectedMode.value = 'single'
  selectedSingleDate.value = toDateString(new Date())
  selectedRangeStart.value = ''
  selectedRangeEnd.value = ''
  selectedMultiDates.value = []
  const now = new Date()
  calendarMonth.value = new Date(now.getFullYear(), now.getMonth(), 1)
}

function setDateMode(mode) {
  selectedMode.value = mode
}

function goPrevMonth() {
  const d = calendarMonth.value
  calendarMonth.value = new Date(d.getFullYear(), d.getMonth() - 1, 1)
}

function goNextMonth() {
  const d = calendarMonth.value
  calendarMonth.value = new Date(d.getFullYear(), d.getMonth() + 1, 1)
}

function pickDate(dateStr) {
  if (selectedMode.value === 'single') {
    selectedSingleDate.value = dateStr
    return
  }

  if (selectedMode.value === 'range') {
    if (!selectedRangeStart.value || selectedRangeEnd.value) {
      selectedRangeStart.value = dateStr
      selectedRangeEnd.value = ''
      return
    }

    if (dateStr < selectedRangeStart.value) {
      selectedRangeEnd.value = selectedRangeStart.value
      selectedRangeStart.value = dateStr
      return
    }

    selectedRangeEnd.value = dateStr
    return
  }

  const exists = selectedMultiDates.value.includes(dateStr)
  if (exists) {
    selectedMultiDates.value = selectedMultiDates.value.filter((d) => d !== dateStr)
  } else {
    selectedMultiDates.value = [...selectedMultiDates.value, dateStr].sort()
  }
}

function isDateSelected(dateStr) {
  if (!dateStr) return false
  if (selectedMode.value === 'single') {
    return selectedSingleDate.value === dateStr
  }
  if (selectedMode.value === 'range') {
    return selectedRangeStart.value === dateStr || selectedRangeEnd.value === dateStr
  }
  return selectedMultiDates.value.includes(dateStr)
}

function isDateInRange(dateStr) {
  if (selectedMode.value !== 'range') return false
  if (!selectedRangeStart.value || !selectedRangeEnd.value) return false
  return dateStr > selectedRangeStart.value && dateStr < selectedRangeEnd.value
}

function buildDeadlineLabel() {
  const timeStr = timeType.value === 'point' ? newTime.value : `${newTime.value} - ${newTimeEnd.value}`

  if (selectedMode.value === 'single') {
    return `${selectedSingleDate.value} ${timeStr}`
  }

  if (selectedMode.value === 'range') {
    if (!selectedRangeStart.value || !selectedRangeEnd.value) return ''
    return `${selectedRangeStart.value} 至 ${selectedRangeEnd.value} ${timeStr}`
  }

  if (!selectedMultiDates.value.length) return ''
  return `多日(${selectedMultiDates.value.length}天) ${timeStr}`
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

  const deadline = buildDeadlineLabel()
  if (!deadline) {
    alert('请先完成任务时间选择')
    return
  }

  tasksStore.addTask({
    title,
    priority: newPriority.value,
    deadline,
  })

  closeAddModal()
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
   新增任务弹窗
   ========================================================= */
.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.46);
  display: grid;
  place-items: center;
  z-index: 1200;
  padding: 20px;
}

.task-modal {
  width: min(820px, 96vw);
  max-height: 92vh;
  overflow: auto;
  background: #fff;
  border-radius: 20px;
  border: 1px solid rgba(148, 163, 184, 0.24);
  box-shadow: 0 24px 48px rgba(15, 23, 42, 0.2);
}

.modal-header,
.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-footer {
  border-bottom: none;
  border-top: 1px solid #e2e8f0;
  justify-content: flex-end;
  gap: 10px;
}

.modal-header h3 {
  margin: 0;
}

.icon-btn {
  border: 1px solid #e2e8f0;
  background: #fff;
  border-radius: 10px;
  padding: 6px 10px;
  color: #334155;
  cursor: pointer;
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 16px 20px;
}

.field-label {
  display: block;
  font-size: 0.9rem;
  color: #334155;
}

.mode-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.mode-btn {
  border: 1px solid #cbd5e1;
  background: #fff;
  color: #475569;
  border-radius: 999px;
  padding: 8px 14px;
  cursor: pointer;
}

.mode-btn.active {
  border-color: #6366f1;
  background: #eef2ff;
  color: #3730a3;
}

.calendar-panel {
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 12px;
  background: #f8fafc;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.weekday-row,
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
}

.weekday-row span {
  text-align: center;
  color: #64748b;
  font-size: 0.8rem;
}

.day-cell {
  border: 1px solid transparent;
  background: #fff;
  border-radius: 10px;
  height: 36px;
  cursor: pointer;
}

.day-cell.muted {
  opacity: 0.35;
  cursor: not-allowed;
}

.day-cell.selected {
  background: #4f46e5;
  color: #fff;
}

.day-cell.inRange {
  background: #e0e7ff;
  border-color: #a5b4fc;
}

.selected-tip {
  margin: 0;
  color: #475569;
  font-size: 0.9rem;
}

.setting-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(120px, 1fr));
  gap: 12px;
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.time-mode-group {
  display: flex;
  gap: 6px;
  margin-bottom: 8px;
}

.time-mode-btn {
  border: 1px solid #cbd5e1;
  background: #fff;
  color: #475569;
  border-radius: 8px;
  padding: 6px 10px;
  cursor: pointer;
  font-size: 0.85rem;
}

.time-mode-btn.active {
  border-color: #6366f1;
  background: #eef2ff;
  color: #3730a3;
}

.time-input-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.time-separator {
  color: #64748b;
  font-size: 0.9rem;
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

  .task-modal {
    width: 100%;
  }

  .setting-row {
    grid-template-columns: 1fr;
  }

  .add-input {
    min-width: 0;
  }
}
</style>