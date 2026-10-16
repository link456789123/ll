<script setup>
/**
 * App.vue —— 根组件（实验四：Pinia + Element Plus 整合）
 *
 * 主要改造：
 * 1. 移除实验三的 provide/inject 共享数据方式，改用 Pinia Store（userStore / profileStore）
 * 2. 组件中通过 storeToRefs 解构保持响应性
 * 3. 使用 Element Plus 布局容器重构整体骨架：el-container / el-header / el-main / el-footer
 * 4. 全局回到顶部按钮 el-backtop
 */
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
import { useProfileStore } from './stores/profileStore'
import { useArticleStore } from './stores/articleStore'

const router = useRouter()

/* ---------- Pinia Store（替代 provide/inject） ---------- */
const profileStore = useProfileStore()
const articleStore = useArticleStore()

// storeToRefs 解构 state/getters，保持响应性
const { links } = storeToRefs(profileStore)

/* ---------- 顶部导航 ---------- */
const navItems = [
  { name: '首页', to: '/home' },
  { name: '项目', to: '/projects/list' },
  { name: '文章', to: '/articles' },
  { name: '关于', to: '/about' },
  { name: '登录', to: '/login' }
]

/* ---------- 主题 ---------- */
const isDark = ref(false)

function toggleTheme() {
  isDark.value = !isDark.value
  // Element Plus 深色模式同样依赖 html.dark 类名，因此一处切换即可同时生效
  document.documentElement.classList.toggle('dark', isDark.value)
}

/* ---------- 生命周期 ---------- */
onMounted(() => {
  console.log('[mounted] 路由总数：', router.getRoutes().length)
  console.log('[mounted] Pinia Store：profile / project / article / user')
  console.log('[mounted] 文章总数：', articleStore.total)
})
</script>

<template>
  <el-container class="app-shell">
    <!-- 顶部：站点导航（内部使用 el-menu） -->
    <el-header class="app-header">
      <SiteHeader
        :brand="'王开敏 · 个人主页'"
        :is-dark="isDark"
        :nav-items="navItems"
        @toggle-theme="toggleTheme"
      />
    </el-header>

    <!-- 中部：路由出口，渲染当前 URL 匹配的页面组件 -->
    <el-main class="app-main">
      <RouterView v-slot="{ Component, route: r }">
        <transition name="fade" mode="out-in">
          <component :is="Component" :key="r.fullPath" />
        </transition>
      </RouterView>
    </el-main>

    <!-- 底部：友情链接与版权 -->
    <el-footer class="app-footer">
      <SiteFooter :links="links" />
    </el-footer>

    <!-- 回到顶部 -->
    <el-backtop :bottom="60" :right="30" />
  </el-container>
</template>

<style>
.app-shell {
  min-height: 100vh;
}

/* el-header 默认固定 60px，这里放开高度交给内容撑开 */
.app-shell .el-header.app-header {
  height: auto;
  padding: 0;
  position: sticky;
  top: 0;
  z-index: 10;
}

/* 内容区沿用原有 880px 阅读宽度 */
.app-shell .el-main.app-main {
  width: 100%;
  max-width: 880px;
  margin: 0 auto;
  padding: 32px 16px 48px;
}

.app-shell .el-footer.app-footer {
  height: auto;
  padding: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
