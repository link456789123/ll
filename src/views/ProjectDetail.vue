<script setup>
/**
 * 项目详情（嵌套子路由 + 动态路由 :id）
 * - 实验四：改用 projectStore 的 findById getter 查找项目
 * - 演示编程式导航 push / replace / go(-1) 的不同场景
 */
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useProjectStore } from '../stores/projectStore'

const route = useRoute()
const router = useRouter()

const projectStore = useProjectStore()
const { starCount: starredCount } = storeToRefs(projectStore)

// 动态路由参数 → findById getter 查找（Number 转换在 getter 内完成）
const project = computed(() => projectStore.findById(route.params.id))

function toggleStar() {
  // 调用 action 修改 state（会自动持久化到 localStorage）
  projectStore.toggleStar(route.params.id)
}

// push：返回列表（新增历史）
function backToList() {
  router.push({ name: 'ProjectList' })
}

function replaceToList() {
  router.replace({ name: 'ProjectList' })
}

function goBack() {
  router.go(-1)
}

// 切换收藏后跳列表（演示 replace：避免回退到刚才的详情页）
function starAndLeave() {
  toggleStar()
  router.replace({ name: 'ProjectList' })
}
</script>

<template>
  <section class="card">
    <div class="section-head">
      <h2>项目详情</h2>
      <small>动态路由 /projects/{{ route.params.id }}</small>
    </div>

    <!-- 无效 id 时的处理 -->
    <div v-if="!project" class="empty">
      <p>😅 没有找到 id = <code>{{ route.params.id }}</code> 的项目。</p>
      <button @click="backToList">返回列表</button>
    </div>

    <template v-else>
      <h3 class="name">{{ project.name }}</h3>
      <p class="desc">{{ project.desc }}</p>

      <div class="meta-grid">
        <div><span class="k">编号</span><span class="v">{{ project.id }}</span></div>
        <div><span class="k">分类</span><span class="v">{{ project.category }}</span></div>
        <div><span class="k">状态</span><span class="v">{{ project.status }}</span></div>
        <div><span class="k">时间</span><span class="v">{{ project.time }}</span></div>
        <div><span class="k">进度</span><span class="v">{{ project.progress }}%</span></div>
        <div><span class="k">已收藏</span><span class="v">{{ starredCount }}</span></div>
      </div>

      <div class="tags">
        <span v-for="tag in project.tags" :key="tag" class="tag">{{ tag }}</span>
      </div>

      <div class="actions">
        <button @click="toggleStar">
          {{ project.starred ? '★ 取消收藏' : '☆ 收藏项目' }}
        </button>
        <button @click="starAndLeave">收藏并离开（replace）</button>
        <button class="ghost" @click="backToList">← 返回列表（push）</button>
        <button class="ghost" @click="replaceToList">替换回列表（replace）</button>
        <button class="ghost" @click="goBack">⤺ 返回上一页（go(-1)）</button>
      </div>
    </template>
  </section>
</template>

<style scoped>
.name { font-size: 18px; margin-bottom: 8px; }
.desc { color: var(--sub); line-height: 1.7; margin-bottom: 14px; }

.meta-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 10px;
  background: var(--bg-soft);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 14px;
}
.meta-grid > div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.k { font-size: 11px; color: var(--sub); }
.v { font-size: 14px; font-weight: 600; color: var(--text); }

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 14px;
}
.tag {
  font-size: 12px;
  padding: 2px 10px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--main) 14%, transparent);
  color: var(--main);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
  padding-top: 14px;
  border-top: 1px dashed var(--line);
}

.empty {
  text-align: center;
  padding: 30px;
  color: var(--sub);
}
.empty code {
  background: var(--bg-soft);
  padding: 2px 8px;
  border-radius: 6px;
  color: var(--main);
  margin: 0 4px;
}
</style>
