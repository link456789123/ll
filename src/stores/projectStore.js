import { defineStore } from 'pinia'

/**
 * 项目 Store（实验四：项目数据增删改查 + 持久化）
 * - state：projects（项目数组）
 * - getters：total / doneCount / doingCount / starCount（统计派生值）
 * - actions：addProject / updateProject / removeProject / toggleStar → 均在修改后 persist
 */
const STORE_KEY = 'lab4-projects'

const defaults = [
  {
    id: 1,
    name: '图书管理系统',
    desc: '面向中小型图书馆的图书借阅管理系统，支持图书录入、查询、借还、读者管理与借阅统计。',
    category: '全栈',
    tags: ['Vue 3', 'Spring Boot', 'MySQL'],
    status: '已完成',
    time: '2026.06',
    progress: 100,
    featured: true,
    starred: true
  },
  {
    id: 2,
    name: '互联网专家平台',
    desc: '面向互联网从业者的问答与经验分享平台，提供提问、回答、话题订阅与个人主页。',
    category: '前端',
    tags: ['Vue 3', 'Vite', 'CSS3'],
    status: '已完成',
    time: '2026.08',
    progress: 100,
    featured: false,
    starred: false
  }
]

function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY)
    if (raw) return { projects: JSON.parse(raw) }
  } catch (e) {
    console.warn('[projectStore] localStorage 数据损坏，使用默认值', e)
  }
  return { projects: [...defaults] }
}

export const useProjectStore = defineStore('project', {
  state: () => loadState(),

  getters: {
    total: (state) => state.projects.length,
    doneCount: (state) => state.projects.filter(p => p.status === '已完成').length,
    doingCount: (state) => state.projects.filter(p => p.status !== '已完成').length,
    starCount: (state) => state.projects.filter(p => p.starred).length,
    // 按 id 查找（getter 返回函数，供详情页使用）
    findById: (state) => (id) => state.projects.find(p => p.id === Number(id))
  },

  actions: {
    addProject(form) {
      const id = this.projects.length
        ? Math.max(...this.projects.map(p => p.id)) + 1
        : 1
      this.projects.push({
        id,
        name: form.name,
        desc: form.desc,
        category: form.category || '前端',
        tags: form.tags || [],
        status: form.status || '开发中',
        time: form.time || new Date().toISOString().slice(0, 7),
        progress: Number(form.progress) || 0,
        featured: false,
        starred: false
      })
      this.persist()
      return id
    },

    updateProject(id, form) {
      const idx = this.projects.findIndex(p => p.id === Number(id))
      if (idx === -1) return false
      this.projects[idx] = { ...this.projects[idx], ...form, id: Number(id) }
      this.persist()
      return true
    },

    removeProject(id) {
      this.projects = this.projects.filter(p => p.id !== Number(id))
      this.persist()
    },

    toggleStar(id) {
      const target = this.findById(id)
      if (target) {
        target.starred = !target.starred
        this.persist()
      }
    },

    persist() {
      localStorage.setItem(STORE_KEY, JSON.stringify(this.projects))
    }
  }
})
