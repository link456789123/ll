import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './styles/global.css'

/* ---------- Element Plus（实验四第二次：全局注册） ---------- */
// 1) 组件库本体 + 样式
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 2) 中文语言包（分页、日期、对话框按钮等文案中文化）
import zhCn from 'element-plus/es/locale/lang/zh-cn'
// 3) 图标库（全局注册后即可用 <el-icon><Edit /></el-icon>）
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)

// 关键：Pinia 要在 router 之前注册，
// 这样路由守卫 beforeEach 才能安全地使用 Store
app.use(createPinia())
app.use(router)
app.use(ElementPlus, { locale: zhCn })

// 注册所有图标组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')
