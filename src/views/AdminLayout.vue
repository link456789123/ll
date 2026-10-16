<script setup>
/**
 * 后台管理父布局（嵌套路由）
 * - 实验四：使用 Element Plus 布局容器 + 侧边菜单重构
 * - el-container / el-aside / el-main 划分结构，el-menu 竖向导航（router 模式）
 * - requireAuth: true，由路由守卫拦截未登录访问
 * - 退出登录走 userStore.logout() action（同步清除 localStorage）
 */
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUserStore } from '../stores/userStore'

const router = useRouter()
const userStore = useUserStore()
const { username } = storeToRefs(userStore)

const menuItems = [
  { index: '/admin/profile', title: '编辑简介', icon: 'EditPen' },
  { index: '/admin/projects', title: '管理项目', icon: 'FolderOpened' },
  { index: '/admin/articles', title: '管理文章', icon: 'Document' }
]

function doLogout() {
  // 调用 action 清除登录状态（同步 localStorage）
  userStore.logout()
  // 退出后用 replace，避免回退又跳回 admin
  router.replace('/login')
}
</script>

<template>
  <el-container class="admin-layout">
    <el-aside width="220px">
      <el-card shadow="never" class="sidebar">
        <div class="logo">
          <el-icon><Setting /></el-icon>
          <span>后台管理</span>
        </div>

        <el-menu
          :router="true"
          :default-active="$route.path"
          class="admin-menu"
        >
          <el-menu-item v-for="item in menuItems" :key="item.index" :index="item.index">
            <el-icon><component :is="item.icon" /></el-icon>
            <span>{{ item.title }}</span>
          </el-menu-item>
        </el-menu>

        <div class="user-box">
          <el-tag type="success" size="small" effect="light">
            已登录：{{ username || 'admin' }}
          </el-tag>
          <el-button type="danger" plain size="small" class="logout" @click="doLogout">
            退出登录
          </el-button>
        </div>
      </el-card>
    </el-aside>

    <el-main class="content">
      <RouterView v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </el-main>
  </el-container>
</template>

<style scoped>
.admin-layout {
  gap: 18px;
  align-items: flex-start;
}
.sidebar {
  position: sticky;
  top: 20px;
}
.logo {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 14px;
  padding-bottom: 12px;
  border-bottom: 1px dashed var(--line);
}
.admin-menu {
  border-right: none;
}
.user-box {
  display: grid;
  gap: 10px;
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px dashed var(--line);
}
.logout {
  width: 100%;
}
.content {
  padding: 0;
  overflow: visible;
}

@media (max-width: 720px) {
  .admin-layout {
    flex-direction: column;
  }
  .admin-layout :deep(.el-aside) {
    width: 100% !important;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
