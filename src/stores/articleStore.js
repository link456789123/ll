import { defineStore } from 'pinia'

/**
 * 文章 Store（实验四新增：文章数据增删改查 + 持久化）
 * - state：articles（文章数组）
 * - getters：total / publishedCount / findByCategory（分类筛选）
 * - actions：addArticle / updateArticle / removeArticle / bumpViews → 均在修改后 persist
 */
const STORE_KEY = 'lab4-articles'

const defaults = [
  {
    id: 1,
    title: '从零开始学习 Vue 3 组合式 API',
    summary: '记录我从 Options API 过渡到组合式 API 的学习过程，以及 ref、computed、watch 的使用心得。',
    content: '组合式 API 是 Vue 3 最大的变化之一。\n\n最初写实验二时我还在用 data 和 methods，改成 <script setup> 后发现代码更聚合了：相关的状态、计算属性和方法可以写在一起，不用来回翻找。\n\nref 适合基本类型，reactive 适合对象；computed 会缓存结果，只有依赖变化才重新计算；watch 用来处理副作用。这三板斧掌握了，写组件就顺手了。',
    category: '前端',
    tags: ['Vue 3', '学习笔记'],
    time: '2026.07',
    views: 128,
    published: true
  },
  {
    id: 2,
    title: 'CSS Grid 布局的三个实用技巧',
    summary: 'grid-template-columns 的 repeat、minmax 和 auto-fill，用好了可以少写很多媒体查询。',
    content: '一、repeat(auto-fill, minmax(220px, 1fr)) 一行代码实现响应式卡片列表，不需要写一堆 @media。\n\n二、grid-template-areas 可以按名字排版，可读性比行号列号好很多，改布局时只需要调整名字顺序。\n\n三、gap 属性替代 margin，不用担心第一个/最后一个元素的多余间距。',
    category: '样式',
    tags: ['CSS', '布局'],
    time: '2026.08',
    views: 96,
    published: true
  },
  {
    id: 3,
    title: '前端路由与状态管理的初体验',
    summary: '实验三用 Vue Router 把单页拆成多页，实验四用 Pinia 管理全局状态，记录两者的配合方式。',
    content: '路由解决了"页面切换"，状态管理解决"数据共享"。\n\n实验三结束时我用 provide/inject 共享数据，实验四改用 Pinia 后发现：Store 里的 state 可以直接被任何组件读取，getters 自动缓存，actions 统一管理修改逻辑，还能配合 DevTools 观察数据流。\n\n路由守卫里可以在函数内部调用 useUserStore() 读取登录态，实现访问控制，这个配合非常优雅。',
    category: '前端',
    tags: ['Vue Router', 'Pinia', '实验心得'],
    time: '2026.10',
    views: 45,
    published: true
  }
]

function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY)
    if (raw) return { articles: JSON.parse(raw) }
  } catch (e) {
    console.warn('[articleStore] localStorage 数据损坏，使用默认值', e)
  }
  return { articles: [...defaults] }
}

export const useArticleStore = defineStore('article', {
  state: () => loadState(),

  getters: {
    total: (state) => state.articles.length,
    publishedCount: (state) => state.articles.filter(a => a.published).length,
    totalViews: (state) => state.articles.reduce((sum, a) => sum + a.views, 0),
    findById: (state) => (id) => state.articles.find(a => a.id === Number(id)),
    findByCategory: (state) => (cat) =>
      cat && cat !== '全部'
        ? state.articles.filter(a => a.category === cat)
        : state.articles
  },

  actions: {
    addArticle(form) {
      const id = this.articles.length
        ? Math.max(...this.articles.map(a => a.id)) + 1
        : 1
      this.articles.push({
        id,
        title: form.title,
        summary: form.summary || form.title,
        content: form.content || '',
        category: form.category || '前端',
        tags: form.tags || [],
        time: form.time || new Date().toISOString().slice(0, 7),
        views: 0,
        published: form.published ?? true
      })
      this.persist()
      return id
    },

    updateArticle(id, form) {
      const idx = this.articles.findIndex(a => a.id === Number(id))
      if (idx === -1) return false
      this.articles[idx] = { ...this.articles[idx], ...form, id: Number(id) }
      this.persist()
      return true
    },

    removeArticle(id) {
      this.articles = this.articles.filter(a => a.id !== Number(id))
      this.persist()
    },

    // 阅读量 +1（进入详情页时调用）
    bumpViews(id) {
      const target = this.findById(id)
      if (target) {
        target.views++
        this.persist()
      }
    },

    // 切换发布状态（后台管理）
    togglePublished(id) {
      const target = this.findById(id)
      if (target) {
        target.published = !target.published
        this.persist()
      }
    },

    persist() {
      localStorage.setItem(STORE_KEY, JSON.stringify(this.articles))
    }
  }
})
