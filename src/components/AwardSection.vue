<script setup>
/**
 * 获奖经历
 * 复用 ContentCard：标题通过具名插槽定制，卡片主体通过默认插槽传入
 */
import ContentCard from './ContentCard.vue'

defineProps({
  awards: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <ContentCard id="awards">
    <template #title>获奖经历</template>
    <template #extra>共 {{ awards.length }} 项</template>

    <ul class="awards">
      <li v-for="award in awards" :key="award.name">
        <span class="award-icon">🏅</span>
        <div class="award-info">
          <h3>{{ award.name }}</h3>
          <p>{{ award.desc }}</p>
        </div>
        <span class="award-time">{{ award.time }}</span>
      </li>
    </ul>
  </ContentCard>
</template>

<style scoped>
.awards {
  list-style: none;
  display: grid;
  gap: 14px;
}

.awards li {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 16px 18px;
  background: var(--bg-soft);
  border: 1px solid var(--line);
  border-radius: 14px;
  transition: transform 0.15s, border-color 0.15s, box-shadow 0.15s;
}

.awards li:hover {
  transform: translateY(-3px);
  border-color: color-mix(in srgb, var(--main) 40%, transparent);
  box-shadow: var(--shadow-hover);
}

.award-icon {
  font-size: 24px;
  line-height: 1.4;
  flex-shrink: 0;
}

.award-info {
  flex: 1;
}

.award-info h3 {
  font-size: 15px;
  margin-bottom: 4px;
}

.award-info p {
  font-size: 13px;
  color: var(--sub);
  line-height: 1.6;
}

.award-time {
  font-size: 12px;
  color: var(--main);
  font-weight: 600;
  white-space: nowrap;
}
</style>
