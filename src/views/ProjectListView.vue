<script setup>
/**
 * 项目列表（嵌套子路由 1/3）
 * - 实验四：改用 projectStore 获取共享数据（替代 inject）
 * - 每行使用 RouterLink 跳转到动态详情路由
 * - 使用 useRouter() 实现编程式导航
 */
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useProjectStore } from '../stores/projectStore'

const router = useRouter()

// Pinia Store：项目数据（跨页面共享 + 持久化）
const projectStore = useProjectStore()
const { projects, doneCount, starCount: starredCount } = storeToRefs(projectStore)

// 编程式导航：跳详情（push：新增历史）
function goDetail(id) {
  router.push({
    name: 'ProjectDetail',
    params: { id }
  })
}

// 编程式导航：去新增
function goAdd() {
  router.push({ name: 'AdminProjects' })
}
</script>

<template>
  <section class="card">
    <div class="section-head">
      <h2>项目列表</h2>
      <small>共 {{ projects.length }} 个 · 已完成 {{ doneCount }} · 已收藏 {{ starredCount }}</small>
    </div>

    <div v-if="projects.length === 0" class="empty">暂无项目</div>

    <ul v-else class="project-list">
      <li
        v-for="(project, index) in projects"
        :key="project.id"
        class="project-item"
      >
        <div class="info">
          <div class="title-row">
            <span class="num">{{ index + 1 }}.</span>
            <RouterLink
              :to="{ name: 'ProjectDetail', params: { id: project.id } }"
              class="title"
            >{{ project.name }}</RouterLink>
            <span v-if="project.featured" class="badge feat">推荐</span>
            <span v-if="project.starred" class="badge star">★</span>
          </div>
          <p class="desc">{{ project.desc }}</p>
          <div class="meta">
            <span class="tag">{{ project.category }}</span>
            <span class="tag light">{{ project.status }}</span>
            <span class="time">{{ project.time }}</span>
          </div>
        </div>
        <div class="ops">
          <button class="ghost" @click="goDetail(project.id)">详情 →</button>
        </div>
      </li>
    </ul>

    <div class="foot">
      <button @click="goAdd">➕ 去新增项目（push）</button>
    </div>
  </section>
</template>

<style scoped>
.project-list {
  list-style: none;
  display: grid;
  gap: 12px;
}
.project-item {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  padding: 14px 16px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--bg-soft);
  transition: all 0.15s;
}
.project-item:hover {
  border-color: var(--main);
  box-shadow: var(--shadow-hover);
}
.title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}
.num {
  color: var(--main);
  font-weight: 700;
  font-size: 14px;
}
.title {
  font-weight: 600;
  color: var(--text);
  text-decoration: none;
  font-size: 15px;
}
/* 嵌套路由下 RouterLink 高亮 */
.title.router-link-exact-active {
  color: var(--main);
}
.desc {
  font-size: 13px;
  color: var(--sub);
  line-height: 1.6;
  margin-bottom: 8px;
}
.meta {
  display: flex;
  gap: 8px;
  font-size: 12px;
  color: var(--sub);
}
.tag {
  padding: 1px 8px;
  border-radius: 6px;
  background: color-mix(in srgb, var(--main) 14%, transparent);
  color: var(--main);
}
.tag.light {
  background: var(--card);
  border: 1px solid var(--line);
}
.badge {
  font-size: 11px;
  padding: 1px 7px;
  border-radius: 999px;
}
.badge.feat {
  background: linear-gradient(135deg, #f6ad55, #ed8936);
  color: #fff;
}
.badge.star {
  background: linear-gradient(135deg, #f6e05e, #ecc94b);
  color: #744210;
}
.ops button {
  font-size: 12px;
  padding: 5px 12px;
}
.empty {
  text-align: center;
  color: var(--sub);
  padding: 30px;
}
.foot {
  margin-top: 16px;
  text-align: right;
}
</style>
