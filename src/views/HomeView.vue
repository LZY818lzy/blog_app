<template>
  <div class="dashboard">
    <section class="welcome-block">
      <div>
        <p class="eyebrow">个人工作台</p>
        <h2>早上好，Liu</h2>
      </div>
      <div class="today-tag">今天 · 2026-10-30</div>
    </section>

    <section class="stats-grid">
      <article class="stat-card accent-blue">
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
      </article>
    </section>

    <section class="content-grid">
      <article class="panel">
        <div class="panel-header">
          <h3>待办事项</h3>
          <button type="button">查看全部</button>
        </div>

        <ul class="task-list">
          <li>
            <input type="checkbox" checked />
            <span>整理产品需求文档</span>
            <em>今天</em>
          </li>
          <li>
            <input type="checkbox" />
            <span>复盘本周设计反馈</span>
            <em>明天</em>
          </li>
          <li>
            <input type="checkbox" />
            <span>更新个人工作台页面</span>
            <em>本周</em>
          </li>
        </ul>
      </article>

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

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.welcome-block {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #ffffff 0%, #eef4ff 100%);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 22px;
  padding: 26px 28px;
}

.eyebrow {
  margin: 0 0 8px;
  color: #6366f1;
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.welcome-block h2 {
  margin: 0;
  font-size: clamp(1.7rem, 2vw, 2.4rem);
}

.today-tag {
  background: rgba(99, 102, 241, 0.1);
  color: #4338ca;
  border: 1px solid rgba(99, 102, 241, 0.16);
  border-radius: 999px;
  padding: 10px 14px;
  font-size: 0.9rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(160px, 1fr));
  gap: 18px;
}

.stat-card {
  background: #fff;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 18px;
  padding: 18px 20px;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.04);
}

.stat-card span,
.stat-card small {
  display: block;
  color: #64748b;
}

.stat-card strong {
  display: block;
  margin: 12px 0 6px;
  font-size: clamp(1.8rem, 2vw, 2.4rem);
  color: #0f172a;
}

.accent-blue { border-top: 4px solid #60a5fa; }
.accent-green { border-top: 4px solid #34d399; }
.accent-purple { border-top: 4px solid #a78bfa; }
.accent-orange { border-top: 4px solid #fbbf24; }

.content-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 18px;
}

.panel {
  background: #fff;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.04);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.panel-header h3 {
  margin: 0;
  font-size: 1.1rem;
}

.panel-header button {
  border: none;
  background: transparent;
  color: #4f46e5;
  cursor: pointer;
}

.task-list,
.timeline {
  list-style: none;
  padding: 0;
  margin: 0;
}

.task-list li {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 12px;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #edf2f7;
}

.task-list li:last-child {
  border-bottom: none;
}

.task-list input {
  accent-color: #4f46e5;
}

.task-list span {
  font-weight: 500;
}

.task-list em {
  color: #64748b;
  font-style: normal;
  font-size: 0.8rem;
}

.timeline li {
  display: flex;
  gap: 14px;
  padding: 14px 0;
  border-bottom: 1px solid #edf2f7;
}

.timeline li:last-child {
  border-bottom: none;
}

.time {
  min-width: 52px;
  color: #4f46e5;
  font-weight: 600;
}

.timeline div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.timeline small {
  color: #64748b;
}

@media (max-width: 900px) {
  .app-shell {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
  }

  .stats-grid,
  .content-grid {
    grid-template-columns: 1fr;
  }

  .topbar {
    flex-direction: column;
    align-items: stretch;
    gap: 14px;
  }
}
</style>
