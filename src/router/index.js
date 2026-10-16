// 部署到 GitHub Pages 时使用 hash 模式：
// 子路由刷新不会因服务器无重写规则而 404（createWebHistory 需要服务端支持）
import { createRouter, createWebHashHistory } from 'vue-router'
import { useUserStore } from '../stores/userStore'

/* ---------- 路由组件（懒加载） ---------- */
const HomePage = () => import('../views/HomePage.vue')
const AboutPage = () => import('../views/AboutPage.vue')
const ProjectCenter = () => import('../views/ProjectCenter.vue')
const ProjectListView = () => import('../views/ProjectListView.vue')
const ProjectDetail = () => import('../views/ProjectDetail.vue')
const ProjectStats = () => import('../views/ProjectStats.vue')
const ArticleListView = () => import('../views/ArticleListView.vue')
const ArticleDetail = () => import('../views/ArticleDetail.vue')
const LoginPage = () => import('../views/LoginPage.vue')
const AdminLayout = () => import('../views/AdminLayout.vue')
const AdminProfile = () => import('../views/AdminProfile.vue')
const AdminProjects = () => import('../views/AdminProjects.vue')
const AdminArticles = () => import('../views/AdminArticles.vue')
const NotFound = () => import('../views/NotFound.vue')

/* ---------- 路由表 ---------- */
const routes = [
  // 根路径重定向到首页
  { path: '/', redirect: '/home' },

  // 个人主页
  {
    path: '/home',
    name: 'Home',
    component: HomePage,
    meta: { title: '个人主页', requireAuth: false }
  },

  // 关于页
  {
    path: '/about',
    name: 'About',
    component: AboutPage,
    meta: { title: '关于我', requireAuth: false }
  },

  // 项目中心（嵌套路由父布局）
  {
    path: '/projects',
    name: 'ProjectCenter',
    component: ProjectCenter,
    redirect: '/projects/list',
    meta: { title: '项目中心', requireAuth: false },
    children: [
      {
        path: 'list',
        name: 'ProjectList',
        component: ProjectListView,
        meta: { title: '项目列表', requireAuth: false }
      },
      {
        path: ':id(\\d+)',
        name: 'ProjectDetail',
        component: ProjectDetail,
        meta: { title: '项目详情', requireAuth: false },
        props: true
      },
      {
        path: 'stats',
        name: 'ProjectStats',
        component: ProjectStats,
        meta: { title: '项目统计', requireAuth: false }
      }
    ]
  },

  // 文章列表（公开）
  {
    path: '/articles',
    name: 'ArticleList',
    component: ArticleListView,
    meta: { title: '文章列表', requireAuth: false }
  },

  // 文章详情（动态路由，公开）
  {
    path: '/articles/:id(\\d+)',
    name: 'ArticleDetail',
    component: ArticleDetail,
    meta: { title: '文章详情', requireAuth: false },
    props: true
  },

  // 登录页
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { title: '管理员登录', requireAuth: false }
  },

  // 后台管理（嵌套路由父布局，需登录）
  {
    path: '/admin',
    name: 'Admin',
    component: AdminLayout,
    redirect: '/admin/profile',
    meta: { title: '后台管理', requireAuth: true },
    children: [
      {
        path: 'profile',
        name: 'AdminProfile',
        component: AdminProfile,
        meta: { title: '编辑个人简介', requireAuth: true }
      },
      {
        path: 'projects',
        name: 'AdminProjects',
        component: AdminProjects,
        meta: { title: '管理项目', requireAuth: true }
      },
      {
        path: 'articles',
        name: 'AdminArticles',
        component: AdminArticles,
        meta: { title: '管理文章', requireAuth: true }
      }
    ]
  },

  // 404 通配符路由
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: { title: '页面未找到' }
  }
]

/* ---------- 路由实例（Hash 模式） ---------- */
const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0, behavior: 'smooth' }
  }
})

/* ---------- 全局前置守卫 ---------- */
// 实验四改造：登录状态改由 userStore 管理
// 注意：useUserStore() 必须在守卫函数【内部】调用，
// 确保此时 Pinia 已完成初始化（模块顶层调用会报错）
router.beforeEach((to, from, next) => {
  // 1) 更新页面标题
  const baseTitle = '王开敏 · 个人主页'
  document.title = to.meta.title ? `${to.meta.title} - ${baseTitle}` : baseTitle

  // 2) 权限拦截：读取 userStore 中的登录状态
  const userStore = useUserStore()
  if (to.meta.requireAuth && !userStore.isLoggedIn) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
})

export default router
