<template>
  <div class="dashboard">
    <!-- ========== 区块 1：欢迎块（顶部问候 + 当前时间） ========== -->
    <section class="welcome-block">
      <div>
        <p class="eyebrow">个人工作台</p>
        <h2>{{ greeting }}</h2>
      </div>
      <div class="today-tag">{{ today }}</div>
    </section>

    <!-- ========== 区块 2：统计卡（四张指标卡） ========== -->
    <section class="stats-grid">
      <!-- <article class="stat-card accent-blue">
        <span>待办任务</span>
        <strong>12</strong>
        <small>其中 4 个已完成</small>
      </article>
      <article class="stat-card accent-green">
        <span>本周目标</span>
        <strong>86%</strong>
        <small>目标完成率</small>
      </article>
      <article class="stat-card accent-purple">
        <span>本周会议</span>
        <strong>03</strong>
        <small>已安排</small>
      </article>
      <article class="stat-card accent-orange">
        <span>收藏内容</span>
        <strong>21</strong>
        <small>常用资源</small>
      </article> -->
    </section>

    <!-- ========== 区块 3：内容区（左：待办事项 / 右：今天安排） ========== -->
    <section class="content-grid">
      <!-- 左面板：待办事项 -->
      <article class="panel">
        <div class="panel-header">
          <h3>待办事项</h3>
          <router-link to="/tasks">查看全部</router-link>
        </div>

        <ul v-if="dashboardTasks.length" class="task-list">
          <li v-for="task in dashboardTasks" :key="task.id">
            <input
              type="checkbox"
              :checked="task.done"
              @change="toggleTask(task.id, $event.target.checked)"
            />
            <span>{{ task.title }}</span>
            <em>{{ formatDeadline(task.deadline) }}</em>
          </li>
        </ul>
        <p v-else class="empty-tip">暂无待办任务</p>
      </article>

      <!-- 右面板：今天安排 -->
      <article class="panel">
        <div class="panel-header">
          <h3>今天安排</h3>
          <button type="button">新增</button>
        </div>

        <ul class="timeline">
          <li>
            <span class="time">09:30</span>
            <div>
              <strong>项目同步会</strong>
              <small>与研发团队</small>
            </div>
          </li>
          <li>
            <span class="time">13:00</span>
            <div>
              <strong>原型评审</strong>
              <small>设计方案确认</small>
            </div>
          </li>
          <li>
            <span class="time">16:00</span>
            <div>
              <strong>个人复盘</strong>
              <small>总结待办进展</small>
            </div>
          </li>
        </ul>
      </article>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useTasksStore } from '../stores/tasks'

// 数字补零：5 -> "05"，用于月、日、时、分、秒
const pad = (n) => String(n).padStart(2, '0')

// 当前时间（响应式）。每秒用新 Date 对象替换，才能触发视图更新
const now = ref(new Date())
// 定时器 ID。不需要驱动视图，所以用普通变量而不是 ref
let timer = null

// 组件挂载后启动秒级定时器
onMounted(() => {
  timer = setInterval(() => {
    now.value = new Date()
  }, 1000)
})

// 组件销毁前清理定时器，避免内存泄漏
onUnmounted(() => {
  if (timer) clearInterval(timer)
})

// 欢迎块右侧：今天 · YYYY-MM-DD HH:mm:ss
const today = computed(() => {
  const d = now.value
  return `今天 · ${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
})

// 欢迎块左侧问候语，随时段变化
const greeting = computed(() => {
  const h = now.value.getHours()
  if (h < 6) return '夜深了！'
  if (h < 12) return '早上好！'
  if (h < 14) return '中午好！'
  if (h < 18) return '下午好！'
  return '晚上好！'
})

const tasksStore = useTasksStore()
const { tasks } = storeToRefs(tasksStore)
const dashboardTasks = computed(() => tasks.value.slice(0, 3))

const toDateString = (d) => {
  const localPad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${localPad(d.getMonth() + 1)}-${localPad(d.getDate())}`
}

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

function toggleTask(taskId, done) {
  tasksStore.toggleTask(taskId, done)
}
</script>

<style scoped>
/* =========================================================
   页面整体：纵向排列三大区块
   ========================================================= */
.dashboard {
  display: flex;              /* 弹性布局 */
  flex-direction: column;     /* 欢迎块、统计卡、内容区从上到下 */
  gap: 24px;                  /* 区块之间的统一间距 */
}

/* =========================================================
   区块 1：欢迎块（左侧问候语 + 右侧时间胶囊）
   ========================================================= */
.welcome-block {
  display: flex;                                  /* 左右两组横向排列 */
  justify-content: space-between;                 /* 左问候、右时间，两端对齐 */
  align-items: center;                            /* 两组垂直居中 */
  background: linear-gradient(135deg, #ffffff 0%, #eef4ff 100%); /* 白到浅蓝的对角渐变 */
  border: 1px solid rgba(148, 163, 184, 0.2);     /* 半透明浅灰边框，比实色柔和 */
  border-radius: 22px;                            /* 大圆角卡片 */
  padding: 26px 28px;                             /* 上下 26、左右 28 的内边距 */
}

/* 欢迎块标题：问候语。字号随视口在 1.7rem ~ 2.4rem 之间缩放 */
.welcome-block h2 {
  margin: 0;                                      /* 清掉 h2 默认外边距 */
  font-size: clamp(1.7rem, 2vw, 2.4rem);
}

/* 眉题「个人工作台」：小号、大写、字距拉开 */
.eyebrow {
  margin: 0 0 8px;                                /* 只留下边距，和 h2 拉开 8px */
  color: #6366f1;                                 /* 靛蓝色，弱化但可读 */
  font-size: 12px;
  letter-spacing: 0.12em;                         /* 字间距，小字更透气 */
  text-transform: uppercase;                      /* 英文转大写（中文无影响） */
}

/* 右侧时间胶囊：今天 · 日期 时分秒 */
.today-tag {
  background: rgba(99, 102, 241, 0.1);            /* 靛蓝低透明度背景 */
  color: #4338ca;                                 /* 深靛蓝文字 */
  border: 1px solid rgba(99, 102, 241, 0.16);     /* 同色系浅边框 */
  border-radius: 999px;                           /* 足够大的圆角 = 胶囊形 */
  padding: 10px 14px;
  font-size: 0.9rem;
  white-space: nowrap;                            /* 禁止换行，日期不被拆成两行 */
  font-variant-numeric: tabular-nums;             /* 数字等宽，秒数跳动时宽度不抖 */
}

/* =========================================================
   区块 2：统计卡网格（四张指标卡）
   ========================================================= */
.stats-grid {
  display: grid;                                  /* 网格布局 */
  grid-template-columns: repeat(4, minmax(160px, 1fr)); /* 4 列，每列最小 160px、最大平分剩余空间 */
  gap: 18px;                                      /* 卡片之间 18px 间距 */
}

/* 单张统计卡：白底、浅边框、圆角、轻阴影 */
.stat-card {
  background: #fff;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 18px;
  padding: 18px 20px;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.04);  /* 向下 8px、模糊 18px 的极淡阴影 */
}

/* 卡片上方的标签（span）和下方说明（small）：各占一行、统一灰色 */
.stat-card span,
.stat-card small {
  display: block;                                 /* span/small 默认行内，改为块级独占一行 */
  color: #64748b;                                 /* 灰色弱化次要信息 */
}

/* 卡片中间的大数字：深色、大号、上下留白 */
.stat-card strong {
  display: block;
  margin: 12px 0 6px;                             /* 与上方标签、下方说明拉开距离 */
  font-size: clamp(1.8rem, 2vw, 2.4rem);
  color: #0f172a;                                 /* 近黑色，强调数字 */
}

/* 四张卡的顶部色条：基础类 + 修饰类，只改边框颜色 */
.accent-blue   { border-top: 4px solid #60a5fa; } /* 待办任务：蓝 */
.accent-green  { border-top: 4px solid #34d399; } /* 本周目标：绿 */
.accent-purple { border-top: 4px solid #a78bfa; } /* 本周会议：紫 */
.accent-orange { border-top: 4px solid #fbbf24; } /* 收藏内容：橙 */

/* =========================================================
   区块 3：内容区（左待办 / 右安排，两栏）
   ========================================================= */
.content-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;             /* 左栏稍宽，比例 3:2 */
  gap: 18px;
}

/* 面板通用外观：两张面板（待办、安排）共用 */
.panel {
  background: #fff;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.04); /* 比统计卡稍大的阴影 */
}

/* 面板头部：左标题、右操作按钮，两端对齐 */
.panel-header {
  display: flex;
  align-items: center;                            /* 标题和按钮垂直居中 */
  justify-content: space-between;                 /* 标题靠左、按钮靠右 */
  margin-bottom: 16px;                            /* 和下方列表拉开距离 */
}

/* 面板标题 */
.panel-header h3 {
  margin: 0;
  font-size: 1.1rem;
}

/* 面板右上角的文字按钮（查看全部 / 新增） */
.panel-header button,
.panel-header a {
  border: none;                                   /* 去掉默认边框 */
  background: transparent;                        /* 透明背景，做成文字按钮 */
  color: #4f46e5;                                 /* 主题靛蓝 */
  cursor: pointer;                                /* 手型光标，提示可点击 */
  text-decoration: none;
}

/* =========================================================
   列表通用：待办列表和时间线共用的重置
   ========================================================= */
.task-list,
.timeline {
  list-style: none;                               /* 去掉圆点 */
  padding: 0;                                     /* 去掉浏览器默认左内边距 */
  margin: 0;                                      /* 去掉默认外边距 */
}

/* =========================================================
   左面板：待办事项列表
   ========================================================= */
/* 每一行待办：三列 —— 复选框 / 任务文字 / 日期 */
.task-list li {
  display: grid;
  grid-template-columns: auto 1fr auto;           /* 复选框自适应、文字占剩余、日期自适应 */
  gap: 12px;                                      /* 三列之间 12px */
  align-items: center;                            /* 三列垂直居中 */
  padding: 12px 0;                                /* 上下内边距，左右由面板提供 */
  border-bottom: 1px solid #edf2f7;               /* 行与行之间的浅灰分隔线 */
}

/* 最后一行去掉分隔线，避免和面板底部多一条线 */
.task-list li:last-child {
  border-bottom: none;
}

/* 复选框的选中色改为主题靛蓝（现代 CSS 属性，不用自绘） */
.task-list input {
  accent-color: #4f46e5;
}

/* 任务文字：中等字重，比正文略突出 */
.task-list span {
  font-weight: 500;
}

/* 日期标签（em）：取消默认斜体，灰色小字 */
.task-list em {
  color: #64748b;
  font-style: normal;                             /* em 默认斜体，这里取消 */
  font-size: 0.8rem;
}

.empty-tip {
  margin: 0;
  color: #64748b;
}

/* =========================================================
   右面板：今天安排时间线
   ========================================================= */
/* 每条安排：左侧时间 + 右侧内容，横向排列 */
.timeline li {
  display: flex;
  gap: 14px;                                      /* 时间和内容之间 14px */
  padding: 14px 0;
  border-bottom: 1px solid #edf2f7;               /* 行分隔线 */
}

/* 最后一条去掉分隔线 */
.timeline li:last-child {
  border-bottom: none;
}

/* 时间文字：固定最小宽度保证各条时间左对齐成一条竖线 */
.time {
  min-width: 52px;
  color: #4f46e5;                                 /* 主题靛蓝 */
  font-weight: 600;                               /* 加粗突出时间 */
}

/* 时间右侧的内容容器：标题和说明纵向排列 */
.timeline div {
  display: flex;
  flex-direction: column;                         /* strong 在上、small 在下 */
  gap: 4px;                                       /* 标题与说明之间 4px */
}

/* 安排的具体说明：灰色弱化 */
.timeline small {
  color: #64748b;
}

/* =========================================================
   响应式 1：中间宽度（≤1100px）
   统计卡从 4 列降为 2 列，避免四列挤在一起
   ========================================================= */
@media (max-width: 1100px) {
  .stats-grid {
    grid-template-columns: repeat(2, minmax(160px, 1fr));
  }
}

/* =========================================================
   响应式 2：窄屏（≤900px）
   统计卡与内容区都改为单列；欢迎块改为纵向排列
   ========================================================= */
@media (max-width: 900px) {
  /* 统计卡、内容区：单列堆叠 */
  .stats-grid,
  .content-grid {
    grid-template-columns: 1fr;
  }

  /* 欢迎块：问候语在上、时间胶囊在下，左对齐 */
  .welcome-block {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>