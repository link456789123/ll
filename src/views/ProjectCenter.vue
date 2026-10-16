<script setup>
/**
 * 项目中心父布局（嵌套路由）
 * - 顶部面包屑 + 标题由父组件提供
 * - 内部 RouterView 渲染子路由（list / detail / stats）
 * - 命名导航：使用 RouterLink 的 :to="{ name: '...' }"
 */
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const router = useRouter()

const activeTab = computed(() => route.path)

function goAdd() {
  router.push({ name: 'AdminProjects' })
}
</script>

<template>
  <main>
    <section class="card">
      <div class="section-head">
        <h2>项目中心</h2>
        <small>命名路由 / 嵌套子路由</small>
      </div>
      <p class="sub">通过下方导航切换列表、详情与统计三种视图，子路由由下方 RouterView 渲染。</p>

      <nav class="tab-bar">
        <RouterLink
          :to="{ name: 'ProjectList' }"
          :class="{ active: activeTab.startsWith('/projects/list') }"
        >📚 项目列表</RouterLink>
        <RouterLink
          :to="{ name: 'ProjectStats' }"
          :class="{ active: activeTab.startsWith('/projects/stats') }"
        >📊 项目统计</RouterLink>
        <button class="admin-btn" @click="goAdd">➕ 管理项目</button>
      </nav>
    </section>

    <!-- 嵌套子路由出口 -->
    <RouterView v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </RouterView>
  </main>
</template>

<style scoped>
.sub {
  color: var(--sub);
  font-size: 13px;
  margin-bottom: 14px;
}

.tab-bar {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.tab-bar a {
  display: inline-block;
  padding: 7px 16px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: var(--card);
  color: var(--sub);
  font-size: 13px;
  text-decoration: none;
  transition: all 0.15s;
}

/* router-link-active：包含匹配 */
.tab-bar a.router-link-active {
  color: var(--main);
  border-color: var(--main);
}

/* router-link-exact-active：完全匹配 */
.tab-bar a.router-link-exact-active {
  background: var(--grad);
  color: #fff;
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(79, 110, 247, 0.25);
}

.admin-btn {
  margin-left: auto;
  font-size: 13px;
  padding: 6px 14px;
  background: transparent;
  color: var(--main);
  border: 1px dashed var(--main);
  box-shadow: none;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
