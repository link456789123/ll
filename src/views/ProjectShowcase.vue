<script setup>
/**
 * 项目展示页（视图组件）
 * 组件划分：PageHero（页面头）→ 筛选卡片 → ProjectList（作用域插槽）→ ProjectCard（具名/默认插槽）→ 详情卡片
 * 插槽使用：
 * - 具名插槽：ContentCard 的 title / extra / footer，ProjectCard 的 title / tags / actions，PageHero 的 actions
 * - 默认插槽：ContentCard 主体、ProjectCard 描述内容、PageHero 补充信息、EmptyState 提示
 * - 作用域插槽：ProjectList 把 { project, index } 交给父模板渲染每一项
 */
import { computed, ref } from 'vue'

import PageHero from '../components/PageHero.vue'
import ContentCard from '../components/ContentCard.vue'
import ProjectList from '../components/ProjectList.vue'
import ProjectCard from '../components/ProjectCard.vue'
import TagPill from '../components/TagPill.vue'
import EmptyState from '../components/EmptyState.vue'

const props = defineProps({
  projects: {
    type: Array,
    required: true
  }
})
const emit = defineEmits(['toggle-star', 'add-project'])
const keyword = ref('')
const activeCategory = ref('全部')
const selected = ref(null)
const showAdd = ref(false)
const form = ref({
  name: '',
  desc: '',
  tags: '',
  category: '前端',
  status: '开发中'
})

/* 派生状态 */
const categoryOptions = computed(() => [
  '全部',
  ...new Set(props.projects.map(project => project.category))
])

const filteredProjects = computed(() => {
  const kw = keyword.value.trim().toLowerCase()

  return props.projects.filter((project) => {
    const matchCategory =
      activeCategory.value === '全部' || project.category === activeCategory.value

    const matchKeyword =
      !kw ||
      (project.name + project.desc + project.tags.join('') + project.category)
        .toLowerCase()
        .includes(kw)

    return matchCategory && matchKeyword
  })
})

const starredCount = computed(
  () => props.projects.filter(project => project.starred).length
)

const doneCount = computed(
  () => props.projects.filter(project => project.status === '已完成').length
)

/* 事件处理 */
function openDetail(project) {
  selected.value = project
}

function submitProject() {
  if (!form.value.name.trim()) {
    return
  }

  emit('add-project', {
    ...form.value,
    tags: form.value.tags
      .split(/[,，\s]+/)
      .map(tag => tag.trim())
      .filter(Boolean)
  })

  form.value = { name: '', desc: '', tags: '', category: '前端', status: '开发中' }
  showAdd.value = false
  keyword.value = ''
  activeCategory.value = '全部'
}
</script>

<template>
  <main>
    <!-- PageHero：props 传标题数据，具名插槽定制操作区，默认插槽放统计信息 -->
    <PageHero
      badge="我的作品集"
      title="项目展示"
      subtitle="记录课程实践与个人项目，通过组件拆分与插槽定制复用同一套展示结构。"
    >
      <span class="hero-stats">
        共 {{ projects.length }} 个项目 · 已完成 {{ doneCount }} 个 · 已收藏 {{ starredCount }} 个
      </span>

      <template #actions>
        <button @click="showAdd = !showAdd">
          {{ showAdd ? '收起表单' : '➕ 新增项目' }}
        </button>
      </template>
    </PageHero>

    <ContentCard v-if="showAdd">
      <template #title>新增项目</template>
      <template #extra>技术栈用逗号分隔</template>

      <div class="form">
        <label>
          项目名称
          <input v-model.trim="form.name" placeholder="请输入项目名称">
        </label>
        <label>
          项目简介
          <textarea v-model.trim="form.desc" rows="3" placeholder="简单描述项目功能与亮点"></textarea>
        </label>
        <label>
          技术栈
          <input v-model.trim="form.tags" placeholder="例如：Vue 3, Vite, CSS">
        </label>
        <label>
          项目分类
          <select v-model="form.category">
            <option v-for="category in categoryOptions.slice(1)" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </label>
        <label>
          项目状态
          <select v-model="form.status">
            <option value="开发中">开发中</option>
            <option value="已完成">已完成</option>
            <option value="维护中">维护中</option>
          </select>
        </label>
      </div>

      <template #footer>
        <div class="actions">
          <button @click="submitProject">提交项目</button>
          <button class="ghost" @click="showAdd = false">取消</button>
        </div>
      </template>
    </ContentCard>

    <!-- 筛选区：extra 具名插槽显示匹配统计 -->
    <ContentCard>
      <template #title>筛选项目</template>
      <template #extra>共 {{ projects.length }} 个 / 匹配 {{ filteredProjects.length }} 个</template>

      <input class="search" v-model.trim="keyword" placeholder="搜索项目名称、简介或技术栈…">

      <div class="filters">
        <button
          v-for="category in categoryOptions"
          :key="category"
          class="filter-btn"
          :class="{ active: activeCategory === category }"
          @click="activeCategory = category"
        >
          {{ category }}
        </button>
      </div>
    </ContentCard>

    <!-- 项目列表：作用域插槽接收子组件遍历出的 project 与 index -->
    <ContentCard id="projects">
      <template #title>项目列表</template>
      <template #extra>作用域插槽渲染</template>

      <ProjectList :projects="filteredProjects">
        <template #default="{ project, index }">
          <ProjectCard
            :project="project"
            :index="index"
            :featured="project.featured"
            @open="openDetail"
            @toggle-star="id => emit('toggle-star', id)"
          >
            <!-- 具名插槽：标题区 -->
            <template #title>
              <h3>{{ index + 1 }}. {{ project.name }}</h3>
            </template>
            <!-- 默认插槽：项目描述内容 -->
            <template #default>
              <p>{{ project.desc }}</p>
              <p class="progress" v-if="project.progress > 0">完成度 {{ project.progress }}%</p>
            </template>
            <!-- 具名插槽：技术标签区 -->
            <template #tags>
              <TagPill v-for="tag in project.tags" :key="tag" tone="primary">{{ tag }}</TagPill>
              <TagPill :tone="project.category === '前端' ? 'success' : 'warning'">
                {{ project.category }}
              </TagPill>
            </template>

            <!-- 具名插槽：操作区 -->
            <template #actions>
              <button class="ghost" @click="openDetail(project)">查看详情</button>
            </template>
          </ProjectCard>
        </template>
        <!-- 具名插槽：空列表占位 -->
        <template #empty>
          <EmptyState>🔍 没有找到与"{{ keyword }}"匹配的项目</EmptyState>
        </template>
      </ProjectList>
    </ContentCard>

    <!-- 详情卡片：默认插槽放详情内容，footer 具名插槽放关闭按钮 -->
    <ContentCard v-if="selected" id="detail">
      <template #title>项目详情</template>
      <template #extra>{{ selected.time }} · {{ selected.status }}</template>

      <h3 class="detail-name">{{ selected.name }}</h3>
      <p class="detail-desc">{{ selected.desc }}</p>

      <div class="detail-tags">
        <TagPill v-for="tag in selected.tags" :key="tag" tone="primary">{{ tag }}</TagPill>
      </div>

      <template #footer>
        <div class="actions">
          <button class="ghost" @click="selected = null">关闭详情</button>
        </div>
      </template>
    </ContentCard>
  </main>
</template>

<style scoped>
.hero-stats {
  display: inline-block;
  padding: 4px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.22);
}

.form select {
  width: 100%;
  padding: 9px 14px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: var(--bg-soft);
  color: var(--text);
  font: inherit;
  outline: none;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}

.filter-btn {
  background: var(--card);
  color: var(--sub);
  border: 1px solid var(--line);
  box-shadow: none;
  font-size: 13px;
  padding: 6px 16px;
  border-radius: 999px;
}

.filter-btn:hover {
  color: var(--main);
  border-color: var(--main);
  transform: translateY(-2px);
}

.filter-btn.active {
  background: var(--grad);
  border-color: transparent;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(79, 110, 247, 0.25);
}

.progress {
  margin-top: 8px;
  font-size: 12px;
  color: var(--main);
  font-weight: 600;
}

.detail-name {
  font-size: 17px;
  margin-bottom: 8px;
}

.detail-desc {
  font-size: 14px;
  color: var(--sub);
  line-height: 1.7;
}

.detail-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 12px;
}
</style>
