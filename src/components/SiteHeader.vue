<script setup>
/**
 * 顶部公共栏（实验四：使用 Element Plus 菜单组件重构）
 * - el-menu + el-menu-item 实现导航（:router 开启路由模式，index 即跳转路径）
 * - el-switch 切换明暗主题，el-tag 展示当前 URL
 * - el-icon + @element-plus/icons-vue 提供图标
 */
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  brand: {
    type: String,
    default: 'My Space'
  },
  isDark: {
    type: Boolean,
    default: false
  },
  navItems: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['toggle-theme'])

const route = useRoute()

// 当前路由路径：既用于菜单高亮（default-active），也用于展示
const currentPath = computed(() => route.path)

// 导航项对应的图标（与 navItems 顺序一致）
const iconMap = {
  首页: 'House',
  项目: 'FolderOpened',
  文章: 'Document',
  关于: 'User',
  登录: 'Key'
}
</script>

<template>
  <div class="site-header">
    <RouterLink to="/home" class="brand">{{ brand }}</RouterLink>

    <!-- 菜单组件：router 模式下点击菜单项直接跳转 -->
    <el-menu
      class="nav-menu"
      mode="horizontal"
      :router="true"
      :default-active="currentPath"
      :ellipsis="false"
    >
      <el-menu-item v-for="item in navItems" :key="item.to" :index="item.to">
        <el-icon><component :is="iconMap[item.name] || 'Menu'" /></el-icon>
        <span>{{ item.name }}</span>
      </el-menu-item>
      <el-menu-item index="/admin">
        <el-icon><Setting /></el-icon>
        <span>后台</span>
      </el-menu-item>
    </el-menu>

    <div class="right">
      <el-tag size="small" type="info" effect="plain" class="path-hint">
        URL：{{ currentPath }}
      </el-tag>

      <el-switch
        :model-value="isDark"
        inline-prompt
        active-text="🌙"
        inactive-text="☀️"
        @change="emit('toggle-theme')"
      />
    </div>
  </div>
</template>

<style scoped>
.site-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 8px 28px;
  background: color-mix(in srgb, var(--card) 82%, transparent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--line);
}

.brand {
  font-size: 19px;
  font-weight: 700;
  background: var(--grad);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: 0.5px;
  text-decoration: none;
  white-space: nowrap;
}

.nav-menu {
  flex: 1;
  min-width: 0;
  border-bottom: none;
  background: transparent;
  justify-content: center;
}

.right {
  display: flex;
  align-items: center;
  gap: 10px;
}

@media (max-width: 720px) {
  .site-header {
    padding: 8px 16px;
    flex-wrap: wrap;
  }
  .path-hint {
    display: none;
  }
}
</style>
