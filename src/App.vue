<script setup>
  import HomeView from './views/HomeView.vue'
</script>

<template>
  <!--顶部导航栏-->
  <header class="header">
    <!--导航栏内容-->
    <h1>My Blog</h1>
    <nav>
      <!--导航链接-->
        <a href="/">首页</a>
        <a href="#">关于</a>
    </nav>
  </header>

  <!--主要内容区域-->
  <main class="main">
    <!--页面主要内容-->
    <HomeView />
  </main>

  <!--底部区域-->
  <footer class="footer">
    <p>&copy; 2026 My Blog. All rights reserved.</p>
  </footer>

</template>

<style scoped>
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 40px;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.header h1 {
  margin: 0;
  font-size: 1.5em;
}

.header a {
  margin: 0 1em;
  text-decoration: none;
  color: #333;
}
.header a:hover {
  text-decoration: underline;
}

.main {
  text-align: center;
  padding: 2em 0;
}
.footer {
  text-align: center;
  padding: 1em 0;
  background-color: #f8f8f8;
  border-top: 1px solid #e7e7e7;
}
</style>
