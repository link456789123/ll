<script setup>
/**
 * 文章列表（实验四：Element Plus 重构，公开页面）
 * - 数据来自 articleStore（跨页面共享 + localStorage 持久化），storeToRefs 保持响应性
 * - el-radio-group / el-radio-button 分类切换，el-input 关键词搜索
 * - el-card + el-tag 展示文章卡片，el-pagination 分页，el-empty / el-badge 辅助展示
 */
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useArticleStore } from '../stores/articleStore'

const articleStore = useArticleStore()
const { articles, total, totalViews } = storeToRefs(articleStore)

// 本地筛选状态（组件私有，不进 Store）
const activeCategory = ref('全部')
const keyword = ref('')

// 分页状态
const page = ref(1)
const pageSize = ref(6)

// 分类列表（派生）
const categories = computed(() => {
  const set = new Set(articles.value.map(a => a.category))
  return ['全部', ...set]
})

// 筛选结果
const filtered = computed(() => {
  let list = articleStore.findByCategory(activeCategory.value)
  if (keyword.value.trim()) {
    const k = keyword.value.trim().toLowerCase()
    list = list.filter(
      a =>
        a.title.toLowerCase().includes(k) ||
        (a.summary || '').toLowerCase().includes(k)
    )
  }
  return list
})

// 当前页数据
const paged = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filtered.value.slice(start, start + pageSize.value)
})

// 筛选条件变化时回到第一页
watch([activeCategory, keyword], () => {
  page.value = 1
})

function tagType(category) {
  const map = { 前端: 'primary', 后端: 'success', 样式: 'warning', 随笔: 'info' }
  return map[category] || 'info'
}
</script>

<template>
  <main>
    <el-card class="card" shadow="never">
      <template #header>
        <div class="section-head">
          <h2>📝 文章列表</h2>
          <small>共 {{ total }} 篇 · 总阅读 {{ totalViews }} 次</small>
        </div>
      </template>

      <!-- 筛选区：单选按钮组 + 搜索框 -->
      <div class="toolbar">
        <el-radio-group v-model="activeCategory" size="small">
          <el-radio-button
            v-for="cat in categories"
            :key="cat"
            :value="cat"
          >
            {{ cat }}
          </el-radio-button>
        </el-radio-group>

        <el-input
          v-model.trim="keyword"
          class="search"
          placeholder="搜索文章标题或摘要…"
          prefix-icon="Search"
          clearable
        />
      </div>

      <!-- 文章卡片列表 -->
      <div v-if="filtered.length" class="article-grid">
        <RouterLink
          v-for="a in paged"
          :key="a.id"
          :to="{ name: 'ArticleDetail', params: { id: a.id } }"
          class="article-card"
        >
          <el-card shadow="hover" class="inner-card">
            <div class="card-head">
              <el-tag :type="tagType(a.category)" size="small" effect="light">
                {{ a.category }}
              </el-tag>
              <el-tag v-if="!a.published" type="danger" size="small" effect="plain">
                草稿
              </el-tag>
            </div>
            <h3>{{ a.title }}</h3>
            <p class="summary">{{ a.summary }}</p>
            <div class="meta">
              <span>🕐 {{ a.time }}</span>
              <el-badge :value="a.views" type="primary" class="views-badge">
                <span class="views-label">阅读</span>
              </el-badge>
            </div>
          </el-card>
        </RouterLink>
      </div>

      <!-- 空状态 -->
      <el-empty v-else description="没有匹配的文章" :image-size="90" />

      <!-- 分页 -->
      <div v-if="filtered.length > pageSize" class="pager">
        <el-pagination
          v-model:current-page="page"
          v-model:page-size="pageSize"
          :total="filtered.length"
          :page-sizes="[6, 12, 24]"
          layout="total, sizes, prev, pager, next"
          background
          small
        />
      </div>
    </el-card>
  </main>
</template>

<style scoped>
.toolbar {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.search {
  width: 220px;
}
.article-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 14px;
}
.article-card {
  text-decoration: none;
}
.inner-card {
  height: 100%;
}
.card-head {
  display: flex;
  gap: 6px;
  margin-bottom: 8px;
}
h3 {
  font-size: 15px;
  color: var(--text);
  margin-bottom: 6px;
  line-height: 1.5;
}
.summary {
  font-size: 13px;
  color: var(--sub);
  line-height: 1.6;
  margin-bottom: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: var(--sub);
  align-items: center;
}
.views-label {
  font-size: 12px;
  color: var(--sub);
  padding-right: 6px;
}
.pager {
  display: flex;
  justify-content: center;
  margin-top: 18px;
}
:deep(.el-card) {
  background: var(--bg-soft);
  border: 1px solid var(--line);
}
</style>
