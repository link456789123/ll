<script setup>
/**
 * 空状态提示（可复用组件）
 * - props：text 为文案回退值
 * - 默认插槽：可放入图标或自定义提示内容
 */
defineProps({
  text: {
    type: String,
    default: '暂无数据'
  }
})
</script>

<template>
  <div class="empty">
    <slot>{{ text }}</slot>
  </div>
</template>

<style scoped>
.empty {
  margin-top: 16px;
  padding: 26px;
  text-align: center;
  color: var(--sub);
  border: 1px dashed var(--line);
  border-radius: 12px;
}
</style>
