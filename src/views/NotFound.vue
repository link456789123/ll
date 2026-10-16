<script setup>
/**
 * 404 页面
 * - 通配符路由 :pathMatch(.*)* 命中
 * - 使用 useRouter() 编程式导航返回首页
 * - 演示 replace vs go(-1) 的区别
 */
import { useRouter } from 'vue-router'

const router = useRouter()

// replace：直接去首页（不留 404 历史）
function goHome() {
  router.replace('/home')
}

// go(-1)：返回上一页
function goBack() {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.replace('/home')
  }
}
</script>

<template>
  <main class="not-found">
    <div class="card box">
      <div class="big">404</div>
      <h2>页面走丢了 😅</h2>
      <p>您访问的地址不存在或已被移除。</p>
      <p class="path">URL：<code>{{ $route.fullPath }}</code></p>
      <div class="actions">
        <button @click="goHome">返回首页（replace）</button>
        <button class="ghost" @click="goBack">← 返回上一页（go(-1)）</button>
      </div>
    </div>
  </main>
</template>

<style scoped>
.not-found {
  display: flex;
  justify-content: center;
  padding-top: 60px;
}
.box {
  text-align: center;
  width: 100%;
  max-width: 460px;
}
.big {
  font-size: 90px;
  font-weight: 900;
  background: var(--grad);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}
h2 { margin: 10px 0 6px; }
p { color: var(--sub); font-size: 14px; }
.path { margin-bottom: 18px; }
.path code {
  background: var(--bg-soft);
  padding: 2px 8px;
  border-radius: 6px;
  color: var(--main);
  font-size: 12px;
}
.actions {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}
</style>
