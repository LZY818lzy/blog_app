<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const isActive = (path) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path === path
}
</script>

<template>
  <div class="app-shell">
    <aside class="sidebar">
      <div class="brand-wrap">
        <div>
          <p class="brand-label">Workspace</p>
          <h1>WorkBench</h1>
        </div>
      </div>

      <nav class="sidebar-nav" aria-label="主导航">
        <router-link 
          class="nav-item" 
          to="/"
          :class="{ 'nav-item--active': isActive('/') }"
        >概览</router-link>
        <router-link 
          class="nav-item" 
          to="/tasks"
          :class="{ 'nav-item--active': isActive('/tasks') }"
        >待办</router-link>
        <router-link class="nav-item" to="#">日程</router-link>
        <router-link class="nav-item" to="#">笔记</router-link>
        <router-link class="nav-item" to="#">收藏</router-link>
      </nav>

      <div class="mini-card">
        <p class="mini-label">本周效率</p>
        <strong>86%</strong>
        <span>较上周 +12%</span>
      </div>
    </aside>

    <div class="main-panel">
      <header class="topbar">
        <div class="search-box">
          <span class="search-icon">⌕</span>
          <input type="text" placeholder="搜索任务、笔记、链接" aria-label="搜索" />
        </div>

        <div class="topbar-actions">
          <button class="ghost-btn" type="button">+ 新任务</button>
        </div>
      </header>

      <main class="page-content">
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </main>
    </div>
  </div>
</template>

<style scoped>
:global(body) {
  margin: 0;
  background: #f3f6fb;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  color: #1f2937;
}

* {
  box-sizing: border-box;
}

button,
input {
  font: inherit;
}

.app-shell {
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7ff 0%, #eef4ff 100%);
}

.sidebar {
  width: 180px;
  background: rgba(17, 24, 39, 0.96);
  color: #f9fafb;
  padding: 28px 18px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.brand-wrap {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 6px 8px;
}

.brand-mark {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #7c9cff, #5eead4);
  color: #0f172a;
  font-weight: 700;
}

.brand-label {
  margin: 0;
  font-size: 12px;
  color: #94a3b8;
}

.brand-wrap h1 {
  margin: 4px 0 0;
  font-size: 1.15rem;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.nav-item {
  width: 100%;
  border: none;
  border-radius: 12px;
  padding: 12px 14px;
  text-align: left;
  font-size: 0.96rem;
  color: #dfe8ff;
  background: transparent;
  cursor: pointer;
  transition: 0.2s ease;
  text-decoration: none;
  display: block;
}

.nav-item:hover {
  background: rgba(148, 163, 184, 0.18);
  color: #fff;
}

.nav-item--active {
  background: rgba(148, 163, 184, 0.18);
  color: #fff;
}

.mini-card {
  margin-top: auto;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 18px;
  padding: 18px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mini-label {
  margin: 0;
  color: #cbd5e1;
  font-size: 12px;
}

.mini-card strong {
  font-size: 2rem;
}

.mini-card span {
  color: #7dd3fc;
  font-size: 0.8rem;
}

.main-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
}

.search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  width: min(520px, 100%);
  padding: 12px 14px;
}

.search-icon {
  font-size: 1.2rem;
  color: #64748b;
}

.search-box input {
  border: none;
  background: transparent;
  flex: 1;
  outline: none;
  color: #0f172a;
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 14px;
}

.ghost-btn {
  border: 1px solid #c7d2fe;
  border-radius: 12px;
  background: #eef2ff;
  color: #3730a3;
  padding: 10px 14px;
  cursor: pointer;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 14px;
  padding: 8px 10px;
}

.user-profile strong,
.user-profile small {
  display: block;
}

.user-profile small {
  color: #64748b;
}

.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: linear-gradient(135deg, #c4b5fd, #7dd3fc);
  color: #1e1b4b;
  font-weight: 700;
}

.page-content {
  flex: 1;
  padding: 26px 30px 38px;
}
</style>
