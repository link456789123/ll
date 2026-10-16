<script setup>
/**
 * 项目统计（嵌套子路由 3/3）
 * - 实验四：改用 Element Plus 组件展示统计结果
 * - el-progress 展示分类占比，el-tag 展示数量徽标
 * - 数据全部来自 projectStore 的 getters（派生值，带缓存）
 */
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useProjectStore } from '../stores/projectStore'

const route = useRoute()
const projectStore = useProjectStore()
const { projects, total, doneCount, doingCount, starCount } = storeToRefs(projectStore)

const categoryBars = computed(() => {
  const map = {}
  projects.value.forEach(p => {
    map[p.category] = (map[p.category] || 0) + 1
  })
  const t = total.value || 1
  return Object.entries(map).map(([name, count]) => ({
    name,
    count,
    percent: Math.round((count / t) * 100)
  }))
})
</script>

<template>
  <section>
    <el-card class="card" shadow="never">
      <template #header>
        <div class="section-head">
          <h2>项目统计</h2>
          <small>当前子路由：{{ route.path }}</small>
        </div>
      </template>

      <div class="stat-row">
        <el-tag type="primary" effect="dark" size="large">项目总数 {{ total }}</el-tag>
        <el-tag type="success" effect="dark" size="large">已完成 {{ doneCount }}</el-tag>
        <el-tag type="warning" effect="dark" size="large">进行中 {{ doingCount }}</el-tag>
        <el-tag type="danger" effect="dark" size="large">已收藏 {{ starCount }}</el-tag>
      </div>

      <el-divider content-position="left">分类占比</el-divider>

      <div v-if="categoryBars.length" class="cat-bars">
        <div v-for="bar in categoryBars" :key="bar.name" class="bar-row">
          <span class="cat-name">{{ bar.name }}</span>
          <el-progress
            class="bar"
            :percentage="bar.percent"
            :stroke-width="12"
            :text-inside="true"
          />
          <el-tag size="small" effect="plain">{{ bar.count }} 个</el-tag>
        </div>
      </div>
      <el-empty v-else description="暂无统计数据" :image-size="80" />
    </el-card>
  </section>
</template>

<style scoped>
.stat-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.cat-bars {
  display: grid;
  gap: 14px;
}
.bar-row {
  display: grid;
  grid-template-columns: 70px 1fr 70px;
  align-items: center;
  gap: 12px;
  font-size: 13px;
}
.cat-name {
  color: var(--sub);
}
.bar {
  width: 100%;
}
</style>
