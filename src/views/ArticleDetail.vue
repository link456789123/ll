<script setup>
/**
 * 文章详情（实验四新增，动态路由 /articles/:id）
 * - useRoute() 读取路由参数，articleStore.findById 查找
 * - 进入页面时调用 bumpViews action 阅读量 +1
 * - 演示编程式导航 go(-1) 返回
 */
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useArticleStore } from '../stores/articleStore'

const route = useRoute()
const router = useRouter()
const articleStore = useArticleStore()

const article = computed(() => articleStore.findById(route.params.id))

// 进入详情页：阅读量 +1（action 内部自动持久化）
onMounted(() => {
  if (article.value) articleStore.bumpViews(route.params.id)
})

function backToList() {
  router.push({ name: 'ArticleList' })
}

function goBack() {
  router.go(-1)
}
</script>

<template>
  <main>
    <section class="card">
      <div class="section-head">
        <h2>文章详情</h2>
        <small>动态路由 /articles/{{ route.params.id }}</small>
      </div>

      <div v-if="!article" class="empty">
        <p>😅 没有找到 id = <code>{{ route.params.id }}</code> 的文章。</p>
        <button @click="backToList">返回列表</button>
      </div>

      <article v-else class="article">
        <header>
          <h1>{{ article.title }}</h1>
          <div class="meta">
            <span class="tag">{{ article.category }}</span>
            <span>🕐 {{ article.time }}</span>
            <span>👀 {{ article.views }} 次阅读</span>
            <span v-for="t in article.tags" :key="t" class="tag light"># {{ t }}</span>
          </div>
        </header>

        <p class="summary">{{ article.summary }}</p>

        <div class="content">
          <p v-for="(para, i) in article.content.split('\n')" :key="i">
            {{ para }}
          </p>
        </div>

        <div class="actions">
          <button class="ghost" @click="backToList">← 返回列表</button>
          <button class="ghost" @click="goBack">⤺ 返回上一页 go(-1)</button>
        </div>
      </article>
    </section>
  </main>
</template>

<style scoped>
.article header { margin-bottom: 14px; }
h1 {
  font-size: 22px;
  line-height: 1.5;
  margin-bottom: 10px;
  color: var(--text);
}
.meta {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  font-size: 12px;
  color: var(--sub);
  align-items: center;
}
.tag {
  padding: 1px 8px;
  border-radius: 6px;
  background: color-mix(in srgb, var(--main) 14%, transparent);
  color: var(--main);
}
.tag.light {
  background: var(--bg-soft);
  border: 1px solid var(--line);
}
.summary {
  color: var(--sub);
  font-size: 14px;
  padding: 10px 14px;
  border-left: 3px solid var(--main);
  background: var(--bg-soft);
  border-radius: 0 8px 8px 0;
  margin-bottom: 18px;
  line-height: 1.7;
}
.content p {
  line-height: 2;
  color: var(--text);
  margin-bottom: 12px;
  white-space: pre-wrap;
}
.actions {
  display: flex;
  gap: 10px;
  margin-top: 18px;
  padding-top: 14px;
  border-top: 1px dashed var(--line);
}
.empty {
  text-align: center;
  color: var(--sub);
  padding: 30px;
}
.empty code {
  background: var(--bg-soft);
  padding: 2px 8px;
  border-radius: 6px;
  color: var(--main);
  margin: 0 4px;
}
</style>
