import { defineStore } from 'pinia'

/**
 * 用户 Store（实验四：登录状态 + 持久化）
 * - state：isAdmin（是否已登录）、username（登录用户名）
 * - getters：isLoggedIn（派生登录态）
 * - actions：login / logout（修改 state 的唯一入口，同时写入 localStorage）
 */
const TOKEN_KEY = 'admin-token'
const NAME_KEY = 'admin-name'

export const useUserStore = defineStore('user', {
  state: () => ({
    // 初始化时从 localStorage 恢复，实现"刷新不丢登录态"
    isAdmin: !!localStorage.getItem(TOKEN_KEY),
    username: localStorage.getItem(NAME_KEY) || ''
  }),

  getters: {
    isLoggedIn: (state) => state.isAdmin
  },

  actions: {
    login(username, password) {
      if (username === 'admin' && password === '123456') {
        this.isAdmin = true
        this.username = username
        localStorage.setItem(TOKEN_KEY, 'admin-token-ok')
        localStorage.setItem(NAME_KEY, username)
        return true
      }
      return false
    },

    logout() {
      this.isAdmin = false
      this.username = ''
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(NAME_KEY)
    }
  }
})
