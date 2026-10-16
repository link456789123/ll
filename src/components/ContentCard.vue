<script setup>
/**
 * 通用内容卡片（可复用"外壳"组件）
 * - props：title 用于标题回退、id 用于锚点定位（数据/配置用 props）
 * - 具名插槽 title：标题区，父组件可用自定义标题结构覆盖 props 回退值
 * - 具名插槽 extra：标题右侧的说明/统计区
 * - 具名插槽 footer：底部操作区，按需渲染
 * - 默认插槽：卡片主体内容
 */
defineProps({
  title: {
    type: String,
    default: ''
  },
  id: {
    type: String,
    default: undefined
  }
})
</script>
<template>
  <section class="card" :id="id">
    <div class="section-head">
      <h2>
        <slot name="title">{{ title }}</slot>
      </h2>
      <small v-if="$slots.extra">
        <slot name="extra" />
      </small>
    </div>

    <!-- 默认插槽：主体内容由父组件决定 -->
    <slot />

    <div class="card-foot" v-if="$slots.footer">
      <slot name="footer" />
    </div>
  </section>
</template>

<style scoped>
.card-foot {
  margin-top: 18px;
  padding-top: 14px;
  border-top: 1px dashed var(--line);
}
</style>
