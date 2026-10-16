<script setup>
/**
 * 标签胶囊（可复用小组件）
 * - props：tone 控制配色（配置类数据用 props）
 * - 默认插槽：标签文字由父组件传入（模板内容用插槽）
 */
defineProps({
  tone: {
    type: String,
    default: 'default'
  }
})
</script>

<template>
  <span class="tag" :class="tone">
    <slot />
  </span>
</template>

<style scoped>
.tag {
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  padding: 2px 10px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: var(--bg-soft);
  color: var(--sub);
  white-space: nowrap;
}

.tag.primary {
  color: var(--main);
  border-color: color-mix(in srgb, var(--main) 35%, transparent);
  background: color-mix(in srgb, var(--main) 10%, transparent);
}

.tag.success {
  color: var(--expert);
  border-color: color-mix(in srgb, var(--expert) 32%, transparent);
  background: color-mix(in srgb, var(--expert) 12%, transparent);
}

.tag.warning {
  color: var(--learning);
  border-color: color-mix(in srgb, var(--learning) 34%, transparent);
  background: color-mix(in srgb, var(--learning) 14%, transparent);
}
</style>
