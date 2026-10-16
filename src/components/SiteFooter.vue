<script setup>
// 底部公共栏：链接数据由父组件 props 传入
import { computed } from 'vue'

defineProps({
  links: {
    type: Array,
    required: true
  }
})

const year = computed(() => new Date().getFullYear())
</script>

<template>
  <footer id="contact">
    <div class="links">
      <a
        v-for="link in links"
        :key="link.name"
        :href="link.url"
        target="_blank"
        rel="noopener"
      >
        {{ link.name }}
      </a>
    </div>

    <p class="copyright">© {{ year }} 王开敏 · Vue 3 组合式 API 组件化实验页面</p>
  </footer>
</template>

<style scoped>
footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 20px;
}

.links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
}

footer a {
  color: var(--sub);
  font-size: 14px;
  text-decoration: none;
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 6px 18px;
  background: var(--card);
  transition: color 0.2s, border-color 0.2s, transform 0.15s;
}

footer a:hover {
  color: var(--main);
  border-color: var(--main);
  transform: translateY(-2px);
}

.copyright {
  font-size: 12px;
  color: var(--sub);
}
</style>
