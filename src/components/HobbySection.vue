<script setup>
/**
 * 兴趣爱好
 * 复用 ContentCard：标题通过具名插槽定制，卡片主体通过默认插槽传入
 */
import ContentCard from './ContentCard.vue'

defineProps({
  hobbies: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <ContentCard id="hobbies">
    <template #title>兴趣爱好</template>

    <div class="hobby-grid">
      <div class="hobby" v-for="hobby in hobbies" :key="hobby.name">
        <div class="hobby-icon">{{ hobby.icon }}</div>
        <h3>{{ hobby.name }}</h3>
        <p>{{ hobby.desc }}</p>
      </div>
    </div>
  </ContentCard>
</template>

<style scoped>
.hobby-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: 14px;
}

.hobby {
  background: var(--bg-soft);
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 18px;
  transition: transform 0.15s, box-shadow 0.15s, border-color 0.15s;
}

.hobby:hover {
  transform: translateY(-4px);
  border-color: color-mix(in srgb, var(--main) 40%, transparent);
  box-shadow: var(--shadow-hover);
}

.hobby-icon {
  font-size: 30px;
  margin-bottom: 8px;
}

.hobby h3 {
  font-size: 15px;
  margin-bottom: 6px;
}

.hobby p {
  font-size: 13px;
  color: var(--sub);
  line-height: 1.6;
}
</style>
