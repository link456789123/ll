<script setup>
/**
 * 项目列表（作用域插槽）
 * 子组件负责遍历数据，并把"当前项目 + 序号"通过作用域插槽交给父组件，
 * 由父组件决定每一项渲染成什么结构（ProjectCard、纯文本或其它组件）。
 * - props：projects 数据集合
 * - 作用域插槽（默认插槽）：父组件通过 v-slot="{ project, index }" 使用子组件遍历出的数据
 * - 具名插槽 empty：列表为空时的占位内容
 */
defineProps({
  projects: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <ul class="project-list" v-if="projects.length > 0">
    <li v-for="(project, index) in projects" :key="project.id">
      <slot :project="project" :index="index" />
    </li>
  </ul>

  <slot v-else name="empty" />
</template>

<style scoped>
.project-list {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 14px;
}

.project-list > li {
  display: flex;
}
</style>
