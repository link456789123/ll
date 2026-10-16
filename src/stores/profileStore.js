import { defineStore } from 'pinia'

/**
 * 个人资料 Store（实验四：跨页面共享 + localStorage 持久化）
 * - state：profile / motto / skills / hobbies / awards / links
 * - getters：skilledCount（熟练技能数）、daysAtSchool（在校天数）
 * - actions：saveProfile（后台修改资料）→ 修改后调用 persist 写入 localStorage
 */
const STORE_KEY = 'lab4-profile'
const ENROLL_DATE = '2024-09-01'

/* ---------- 默认数据 ---------- */
const defaults = {
  profile: {
    name: '王开敏',
    className: '24计科2班',
    studentId: '249981128',
    phone: '13812345678',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix',
    intro: '一名热爱编程的大学生，正在学习 Web 前端开发。'
  },
  motto: '🍃 生活是个动词',
  skills: [
    { name: 'HTML5', level: '熟练' },
    { name: 'CSS3', level: '熟练' },
    { name: 'JavaScript', level: '掌握' },
    { name: 'Vue 3', level: '学习中' },
    { name: 'MySQL', level: '掌握' }
  ],
  hobbies: [
    { name: '摄影', icon: '📷', desc: '喜欢拍校园的黄昏和街头人文，手机党正在攒镜头钱。' },
    { name: '跳舞', icon: '💃', desc: '校园文艺晚会的常客，喜欢跟着音乐释放压力。' },
    { name: '音乐', icon: '🎧', desc: '写代码必开歌单，流行与轻音乐混搭，效率翻倍。' }
  ],
  awards: [
    { time: '2025.09', name: '校级二等奖学金', desc: '大一学年学业成绩优秀，综合测评位列班级前列，获校级奖学金。' },
    { time: '2026.05', name: '川渝校园街舞齐舞大赛一等奖', desc: '与舞蹈团参加川渝高校齐舞大赛获一等奖。' }
  ],
  links: [
    { name: 'GitHub', url: 'https://github.com' },
    { name: '掘金', url: 'https://juejin.cn' },
    { name: 'Bilibili', url: 'https://www.bilibili.com' }
  ]
}

/* ---------- 从 localStorage 读取（持久化恢复） ---------- */
function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY)
    if (raw) return { ...defaults, ...JSON.parse(raw) }
  } catch (e) {
    console.warn('[profileStore] localStorage 数据损坏，使用默认值', e)
  }
  return { ...defaults }
}

export const useProfileStore = defineStore('profile', {
  state: () => loadState(),

  getters: {
    // 派生：熟练技能数量
    skilledCount: (state) => state.skills.filter(s => s.level === '熟练').length,
    // 派生：在校天数
    daysAtSchool: () => {
      const start = new Date(ENROLL_DATE).getTime()
      return Math.max(0, Math.floor((Date.now() - start) / 86400000))
    }
  },

  actions: {
    // 后台保存资料（motto 单独字段，其余合并进 profile）
    saveProfile(form) {
      const { motto, ...profileFields } = form
      Object.keys(profileFields).forEach((key) => {
        if (profileFields[key] !== undefined && profileFields[key] !== '') {
          this.profile[key] = profileFields[key]
        }
      })
      if (motto !== undefined) this.motto = motto
      this.persist()
    },

    // 持久化到 localStorage
    persist() {
      const { profile, motto, skills, hobbies, awards } = this
      localStorage.setItem(
        STORE_KEY,
        JSON.stringify({ profile, motto, skills, hobbies, awards })
      )
    }
  }
})
