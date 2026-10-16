# 个人主页 + 项目展示页 · Vue 3 组件化实验（实验二）

在实验一个人页面的基础上，迁移到 Vue 工程并使用**组合式 API（`<script setup>`）**实现，完成了组件拆分、父子通信（props / emits / v-model）以及**项目展示页面**（插槽综合应用）。

## 组件树

```
App.vue（根组件 · 全站共享状态：个人资料 / 技能 / 爱好 / 荣誉 / 项目 / 主题 / 当前页面）
├── SiteHeader.vue            顶部公共栏
├── HomePage.vue              个人主页视图
│   ├── ProfileCard.vue       个人信息卡片
│   ├── StatsBoard.vue        统计面板
│   ├── SkillSection.vue      技能清单（含搜索）
│   ├── HobbySection.vue      兴趣爱好
│   ├── AwardSection.vue      获奖经历
│   └── EditProfileForm.vue   编辑资料表单
├── ProjectShowcase.vue       项目展示视图（第二次实验）
│   ├── PageHero.vue          页面头横幅
│   ├── ContentCard.vue       通用内容卡片（复用外壳）
│   ├── ProjectList.vue       项目列表（作用域插槽）
│   ├── ProjectCard.vue       项目卡片
│   ├── TagPill.vue           标签胶囊
│   └── EmptyState.vue        空状态提示
└── SiteFooter.vue            底部公共栏
```

## 拆分依据

- **公共元素**：`SiteHeader` / `SiteFooter` 每个页面复用，独立成组件。
- **视图层**：`HomePage` / `ProjectShowcase` 各自负责一个页面的组装，只处理页面内部的 UI 状态（搜索词、编辑框开关、详情展开）。
- **共享数据**：个人资料、技能、项目等由 `App.vue` 持有，通过 props 下发，遵循单向数据流。
- **可复用组件**：`ContentCard`（卡片外壳）、`PageHero`（页面头）、`ProjectCard`、`ProjectList`、`TagPill`、`EmptyState` 在多个位置复用，避免重复结构。

## 父子组件通信

| 技术 | 使用位置 |
| --- | --- |
| `defineProps` | `ProfileCard` / `StatsBoard` / `SkillSection` / `HobbySection` / `AwardSection` / `ProjectCard` / `ProjectList` / `PageHero` / `ContentCard` / `TagPill` / `EmptyState` |
| `defineEmits` | `SiteHeader`（`toggle-theme`、`navigate`）；`ProfileCard`（`open-edit`）；`EditProfileForm`（`save`、`cancel`）；`ProjectCard`（`open`、`toggle-star`）；`ProjectShowcase`（`add-project`、`toggle-star`）；`HomePage`（`save-profile`） |
| `defineModel` | `SkillSection` 搜索词 `v-model="keyword"`；`EditProfileForm` 显示状态 `v-model:visible="editVisible"` |

## 插槽应用

| 组件 | 插槽类型 | 用途 |
| --- | --- | --- |
| `ContentCard` | 具名 `title` / `extra` / `footer` + 默认 | 卡片标题、右上角统计、底部操作区，主体内容由页面定制 |
| `PageHero` | 具名 `actions` + 默认 | 页面头操作按钮区、统计信息行 |
| `ProjectList` | **作用域插槽** + 具名 `empty` | 子组件遍历项目，把 `{ project, index }` 交给父模板渲染每一项；空列表占位 |
| `ProjectCard` | 具名 `title` / `tags` / `actions` + 默认 | 标题、技术标签、操作按钮、描述内容均可由父组件定制，未提供时用 props 数据回退 |
| `TagPill` / `EmptyState` | 默认 | 标签文字、空状态内容 |

**props 与插槽的选择依据**：项目名称、标签数组、状态等是数据或配置，用 props 传递；标题结构、按钮、标签组合、描述排版属于"由父组件决定的模板内容"，用插槽定制。

## 功能清单

- 个人主页：资料展示、详情展开、编辑资料（v-model 同步）、技能关键词搜索（v-model + watch 日志）、明暗主题切换。
- 项目展示页：项目卡片列表、分类筛选、关键词搜索、收藏（★）、新增项目、查看详情、顶部导航切换页面。

## Project Setup

```sh
npm install
npm run dev      # 开发调试（PowerShell 若被拦截可用 npm.cmd run dev）
npm run build    # 生产构建
npm run preview  # 预览构建结果
```

---

# 实验四：状态管理与 UI 组件库应用

在实验三（Vue Router）基础上完成：引入 **Pinia** 做全局状态管理，新增文章列表 / 文章管理等页面，
配合路由守卫实现登录访问控制；引入 **Element Plus** 重构界面，并通过 GitHub Actions 部署到 GitHub Pages。

## 一、Pinia Store 清单（`src/stores/`）

| Store | state | getters | actions | 持久化 key |
| --- | --- | --- | --- | --- |
| `userStore` | `isAdmin`、`username` | `isLoggedIn` | `login` / `logout` | `admin-token`、`admin-name` |
| `profileStore` | `profile`、`motto`、`skills`、`hobbies`、`awards`、`links` | `skilledCount`、`daysAtSchool` | `saveProfile` / `persist` | `lab4-profile` |
| `projectStore` | `projects` | `total`、`doneCount`、`doingCount`、`starCount`、`findById` | `addProject` / `updateProject` / `removeProject` / `toggleStar` | `lab4-projects` |
| `articleStore` | `articles` | `total`、`publishedCount`、`totalViews`、`findById`、`findByCategory` | `addArticle` / `updateArticle` / `removeArticle` / `bumpViews` / `togglePublished` | `lab4-articles` |

要点：

- **storeToRefs**：组件中解构 state / getters 保持响应式，actions 直接从 Store 实例解构使用。
- **持久化**：state 初始化时 `JSON.parse(localStorage.getItem(key))` 读取，actions 修改后 `persist()` 写回。
- **路由守卫**：`src/router/index.js` 的 `beforeEach` 内部调用 `useUserStore()`（不能在模块顶层调用），
  结合 `meta.requireAuth` 拦截未登录访问并跳转 `/login?redirect=...`。

## 二、Element Plus 组件清单（共 26 种，≥10 种要求）

| # | 组件 | 使用位置 | 作用 |
| --- | --- | --- | --- |
| 1 | `el-container` / `el-header` / `el-main` / `el-footer` / `el-aside` | `App.vue`、`AdminLayout.vue` | 划分全站骨架与后台（侧边栏 + 内容区）布局 |
| 2 | `el-menu` / `el-menu-item` | `SiteHeader.vue`、`AdminLayout.vue` | 顶部横向导航与后台侧边导航（`router` 模式，index 即路径） |
| 3 | `el-card` | 首页 / 关于 / 文章列表 / 后台各页 | 统一卡片容器，替代手写 `.card` |
| 4 | `el-timeline` / `el-timeline-item` | `AboutPage.vue` | **新增时间线**：成长路线 + 获奖经历 |
| 5 | `el-descriptions` / `el-descriptions-item` | `AboutPage.vue` | 键值对形式展示个人档案 |
| 6 | `el-avatar` | `ProfileCard.vue`、`AboutPage.vue`、`AdminProfile.vue` | 头像展示与实时预览 |
| 7 | `el-tag` | 全站 | 分类、熟练度、统计数字等标签 |
| 8 | `el-progress` | `SkillSection.vue`、`ProjectStats.vue`、`AdminProjects.vue` | 技能掌握度、分类占比、项目完成度 |
| 9 | `el-form` / `el-form-item`（含 `rules` 校验） | `LoginPage.vue`、`AdminProfile.vue`、`AdminArticles.vue`、`AdminProjects.vue`、`EditProfileForm.vue` | 表单收集与校验 |
| 10 | `el-input`（含 `textarea`） | 各表单页、`SkillSection.vue`、`ArticleListView.vue` | 文本输入、搜索框、多行输入 |
| 11 | `el-select` / `el-option` | `AdminArticles.vue`、`AdminProjects.vue` | 分类 / 状态下拉选择 |
| 12 | `el-slider` | `AdminProjects.vue` | 拖动设置项目完成度 0~100 |
| 13 | `el-switch` | `SiteHeader.vue`（主题）、后台表格（发布 / 收藏） | 开关切换 |
| 14 | `el-button` | 全站 | 各类操作按钮 |
| 15 | `el-dialog` | `AdminArticles.vue`、`AdminProjects.vue`、`EditProfileForm.vue` | 新增 / 编辑内容弹窗 |
| 16 | `el-table` / `el-table-column` | `AdminArticles.vue`、`AdminProjects.vue` | 后台数据表格（排序、固定操作列、空状态文案） |
| 17 | `el-pagination` | `ArticleListView.vue` | 文章列表分页 |
| 18 | `el-empty` | `ArticleListView.vue`、`SkillSection.vue`、`ProjectStats.vue`、`AboutPage.vue` | 空数据占位 |
| 19 | `el-alert` | `LoginPage.vue`、后台管理页 | 错误 / 统计提示条 |
| 20 | `el-badge` | `ArticleListView.vue` | 文章阅读量徽标 |
| 21 | `el-divider` | `AboutPage.vue`、`LoginPage.vue`、`ProjectStats.vue` | 分区分割线 |
| 22 | `el-backtop` | `App.vue` | 回到顶部 |
| 23 | `el-radio-group` / `el-radio-button` | `ArticleListView.vue` | 文章分类切换 |
| 24 | `el-row` / `el-col` | `AdminProfile.vue` | 响应式栅格排列表单 |
| 25 | `el-icon` + `@element-plus/icons-vue` | 全站 | 图标（全局注册后直接使用） |
| 26 | `ElMessage` / `ElMessageBox` | 后台管理页 | 操作反馈与删除二次确认 |

全局注册方式：`src/main.js` 中 `app.use(ElementPlus, { locale: zhCn })`，并一次性引入样式、
中文语言包与图标组件；`src/styles/global.css` 中通过 `--el-color-primary` 让组件库主色与站点主题一致。

## 三、部署到 GitHub Pages

1. `vite.config.js` 中设置 `base: '/vue-personal-homepage/'`（**必须与 GitHub 仓库名一致**，
   若仓库名不同请修改文件中 `REPO_NAME` 常量）。
2. 路由使用 `createWebHashHistory()`（hash 模式），避免 GitHub Pages 刷新子路由 404。
3. 已提供 `.github/workflows/deploy.yml`，推送到 `main` 分支即自动构建 `dist` 并发布。
4. 仓库 Settings → Pages → Source 选择 **GitHub Actions**，发布后访问
   `https://<username>.github.io/<repo-name>/`。

```sh
git init
git add .
git commit -m "feat: 实验四 Pinia + Element Plus"
git branch -M main
git remote add origin https://github.com/<username>/<repo-name>.git
git push -u origin main
```
