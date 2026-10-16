<script setup>
/**
 * 页面头横幅（可复用组件）
 * - props：badge / title / subtitle 属于数据，用 props 传递
 * - 具名插槽 actions：操作按钮区（按钮属于模板结构，用插槽更灵活）
 * - 默认插槽：页面自定义的补充内容
 */
defineProps({
  badge: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <section class="hero">
    <div class="hero-main">
      <span class="hero-badge" v-if="badge">{{ badge }}</span>
      <h1 class="hero-title">{{ title }}</h1>
      <p class="hero-sub" v-if="subtitle">{{ subtitle }}</p>

      <div class="hero-extra" v-if="$slots.default">
        <slot />
      </div>
    </div>

    <div class="hero-actions" v-if="$slots.actions">
      <slot name="actions" />
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  padding: 30px 32px;
  margin-bottom: 20px;
  border-radius: 18px;
  border: 1px solid var(--line);
  background: var(--grad);
  box-shadow: var(--shadow);
  color: #ffffff;
}

.hero::after {
  content: '';
  position: absolute;
  right: -60px;
  bottom: -80px;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.16);
}

.hero-main {
  position: relative;
  z-index: 1;
  flex: 1;
  min-width: 240px;
}

.hero-badge {
  display: inline-block;
  font-size: 12px;
  letter-spacing: 0.5px;
  padding: 3px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.22);
  margin-bottom: 10px;
}

.hero-title {
  font-size: 26px;
  margin-bottom: 8px;
}

.hero-sub {
  font-size: 14px;
  opacity: 0.92;
  max-width: 560px;
}

.hero-extra {
  margin-top: 14px;
  font-size: 13px;
}

.hero-actions {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.hero-actions :deep(button.ghost) {
  background: rgba(255, 255, 255, 0.9);
  border-color: transparent;
  color: var(--main);
}

.hero-actions :deep(button.ghost:hover) {
  border-color: #ffffff;
  color: #ffffff;
  background: rgba(255, 255, 255, 0.2);
}

@media (max-width: 640px) {
  .hero {
    padding: 22px;
    text-align: center;
    justify-content: center;
  }

  .hero-actions {
    justify-content: center;
  }
}
</style>
