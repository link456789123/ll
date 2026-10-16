<script setup>
// 统计面板：纯展示组件，所有数据均由父组件计算后通过 props 传入
defineProps({
  skillCount: {
    type: Number,
    required: true
  },
  skilledCount: {
    type: Number,
    required: true
  },
  hobbyCount: {
    type: Number,
    required: true
  },
  daysAtSchool: {
    type: Number,
    required: true
  }
})
</script>

<template>
  <section class="stats">
    <div class="stat">
      <b>{{ skillCount }}</b>
      <span>技能方向</span>
    </div>
    <div class="stat">
      <b>{{ skilledCount }}</b>
      <span>熟练技能</span>
    </div>
    <div class="stat">
      <b>{{ hobbyCount }}</b>
      <span>兴趣爱好</span>
    </div>
    <div class="stat">
      <b>{{ daysAtSchool }}</b>
      <span>在校天数</span>
    </div>
  </section>
</template>

<style scoped>
.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 20px;
}

.stat {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 18px 12px;
  text-align: center;
  box-shadow: var(--shadow);
}

.stat b {
  display: block;
  font-size: 26px;
  background: var(--grad);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.stat span {
  font-size: 13px;
  color: var(--sub);
}

@media (max-width: 640px) {
  .stats {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
