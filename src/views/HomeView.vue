<template>
  <h1>{{ blogTitle }}</h1>
  <p>作者：{{ author }}</p>
  <p>当前时间：{{ new Date().toLocaleDateString() }}</p>
</template>

<script setup>
const blogTitle = 'RUNOOB 前端笔记'
const author = '小明'
</script>

<style scoped>
h1 {
  font-size: 2em;
  margin-bottom: 0.5em;
}
p {
  margin: 0.5em 0;
}
</style>


<script>
    // 注意点：
    // 插值表达式 {{ }}花括号里可以放任何 JS 表达式：变量、运算、三元表达式、函数调用都行，但不能放语句（如 if、for）
    // 插值表达式只替换标签内部的文本，不会替换标签


</script>