<script setup>
/**
 * 项目卡片（可复用组件）
 * 数据用 props，模板结构用插槽：
 * - props：project（项目数据）、index（序号）、featured（是否精选，配置项）
 * - 具名插槽 title：标题区
 * - 具名插槽 tags：技术标签区（未提供时用 props 数据回退渲染 TagPill）
 * - 具名插槽 actions：操作区按钮（未提供时回退"查看详情"按钮）
 * - 默认插槽：项目描述等主体内容（未提供时回退 project.desc）
 * - defineEmits：把"查看详情""收藏"两个用户操作上报父组件
 */
import TagPill from './TagPill.vue'

defineProps({
  project: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['open', 'toggle-star'])
</script>

<template>
  <article class="project" :class="{ featured }">
    <header class="project-head">
      <div class="project-title">
        <slot name="title">
          <h3>{{ project.name }}</h3>
        </slot>
      </div>

      <button
        class="star"
        :class="{ on: project.starred }"
        :title="project.starred ? '取消收藏' : '收藏项目'"
        @click="emit('toggle-star', project.id)"
      >
        {{ project.starred ? '★' : '☆' }}
      </button>
    </header>

    <div class="project-body">
      <slot>
        <p>{{ project.desc }}</p>
      </slot>
    </div>

    <div class="project-tags">
      <slot name="tags">
        <TagPill v-for="tag in project.tags" :key="tag" tone="primary">{{ tag }}</TagPill>
      </slot>
    </div>

    <footer class="project-foot">
      <span class="project-status">{{ project.status }}</span>

      <div class="actions">
        <slot name="actions">
          <button @click="emit('open', project)">查看详情</button>
        </slot>
      </div>
    </footer>
  </article>
</template>

<style scoped>
.project {
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
  padding: 18px;
  border-radius: 16px;
  border: 1px solid var(--line);
  background: var(--bg-soft);
  transition: transform 0.15s, box-shadow 0.15s, border-color 0.15s;
}

.project:hover {
  transform: translateY(-4px);
  border-color: color-mix(in srgb, var(--main) 40%, transparent);
  box-shadow: var(--shadow-hover);
}

.project.featured {
  border-color: color-mix(in srgb, var(--main) 45%, transparent);
  background: color-mix(in srgb, var(--main) 7%, var(--bg-soft));
}

.project-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}

.project-title h3 {
  font-size: 16px;
  line-height: 1.5;
}

.star {
  background: transparent;
  border: none;
  box-shadow: none;
  color: var(--sub);
  font-size: 20px;
  line-height: 1;
  padding: 0 2px;
  cursor: pointer;
}

.star:hover,
.star.on {
  color: var(--learning);
  transform: none;
  box-shadow: none;
}

.project-body {
  flex: 1;
  font-size: 13px;
  color: var(--sub);
  line-height: 1.7;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.project-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 0;
}

.project-status {
  font-size: 12px;
  color: var(--main);
  font-weight: 600;
}

.project-foot button {
  padding: 6px 14px;
  font-size: 13px;
}
</style>
