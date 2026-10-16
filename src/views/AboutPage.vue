<script setup>
/**
 * 关于我（实验四：Element Plus 重构 + 新增时间线）
 * - 使用 el-card / el-descriptions 展示个人档案
 * - 使用 el-timeline + el-timeline-item 展示「学习路线」与「获奖经历」时间线
 * - 数据来自 Pinia profileStore，storeToRefs 解构保持响应性
 */
import { storeToRefs } from 'pinia'
import { useProfileStore } from '../stores/profileStore'

const profileStore = useProfileStore()
const { profile, motto, skills, awards, skilledCount, daysAtSchool } =
  storeToRefs(profileStore)

// 学习路线（时间线数据）
const roadmap = [
  {
    time: '2024.09',
    title: '入学计算机科学与技术专业',
    desc: '开始系统学习程序设计基础与 Web 前端开发。',
    type: 'primary',
    icon: 'School'
  },
  {
    time: '2025.09',
    title: '完成实验一：Vue 基础语法',
    desc: '掌握模板语法、指令与事件绑定，写出第一个 Vue 页面。',
    type: 'success',
    icon: 'Checked'
  },
  {
    time: '2026.01',
    title: '完成「图书管理系统」全栈项目',
    desc: '贯通前后端：Vue 3 + Spring Boot + MySQL，实现借还书与统计。',
    type: 'success',
    icon: 'Trophy'
  },
  {
    time: '2026.06',
    title: '完成「互联网专家平台」前端作品',
    desc: '组件化拆分页面，练习插槽、自定义事件与父子通信。',
    type: 'warning',
    icon: 'Star'
  },
  {
    time: '2026.10',
    title: '实验四：Pinia + Element Plus',
    desc: '引入状态管理与 UI 组件库，实现文章管理、权限控制与线上部署。',
    type: 'danger',
    icon: 'MagicStick'
  }
]
</script>

<template>
  <main>
    <!-- 个人档案 -->
    <el-card class="card" shadow="never">
      <div class="about-hero">
        <el-avatar :size="110" :src="profile.avatar" :alt="profile.name" />

        <div class="hero-info">
          <h1>{{ profile.name }}</h1>
          <p class="sub">🎓 {{ profile.className }} · 学号 {{ profile.studentId }}</p>
          <p class="intro">{{ profile.intro }}</p>

          <div class="stats-row">
            <el-tag type="primary" effect="light" round>
              🛠 熟练技能 {{ skilledCount }} 项
            </el-tag>
            <el-tag type="success" effect="light" round>
              📅 在校 {{ daysAtSchool }} 天
            </el-tag>
            <el-tag type="info" effect="light" round>📱 {{ profile.phone }}</el-tag>
            <el-tag type="warning" effect="light" round>{{ motto }}</el-tag>
          </div>
        </div>
      </div>

      <el-divider content-position="left">基本信息</el-divider>

      <!-- 描述列表组件：以键值对形式展示档案 -->
      <el-descriptions :column="2" border size="small">
        <el-descriptions-item label="姓名">{{ profile.name }}</el-descriptions-item>
        <el-descriptions-item label="学号">{{ profile.studentId }}</el-descriptions-item>
        <el-descriptions-item label="班级">{{ profile.className }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ profile.phone }}</el-descriptions-item>
        <el-descriptions-item label="技能方向">
          <el-tag
            v-for="s in skills"
            :key="s.name"
            size="small"
            :type="s.level === '熟练' ? 'success' : s.level === '掌握' ? 'primary' : 'warning'"
            effect="plain"
            class="skill-tag"
          >
            {{ s.name }} · {{ s.level }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="座右铭">{{ motto }}</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <!-- 学习路线时间线（实验要求新增） -->
    <el-card class="card" shadow="never">
      <template #header>
        <div class="section-head">
          <h2>🕐 成长时间线</h2>
          <small>学习路线 · 共 {{ roadmap.length }} 个节点</small>
        </div>
      </template>

      <el-timeline>
        <el-timeline-item
          v-for="node in roadmap"
          :key="node.time"
          :timestamp="node.time"
          :type="node.type"
          :icon="node.icon"
          placement="top"
        >
          <el-card shadow="never" class="timeline-card">
            <h4>{{ node.title }}</h4>
            <p>{{ node.desc }}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-card>

    <!-- 获奖经历时间线 -->
    <el-card class="card" shadow="never">
      <template #header>
        <div class="section-head">
          <h2>🏆 获奖经历</h2>
          <small>共 {{ awards.length }} 项</small>
        </div>
      </template>

      <el-timeline v-if="awards.length">
        <el-timeline-item
          v-for="a in awards"
          :key="a.time + a.name"
          :timestamp="a.time"
          type="warning"
          :hollow="false"
          placement="top"
        >
          <h4>{{ a.name }}</h4>
          <p>{{ a.desc }}</p>
        </el-timeline-item>
      </el-timeline>
      <el-empty v-else description="暂无获奖记录" :image-size="80" />
    </el-card>
  </main>
</template>

<style scoped>
.about-hero {
  display: flex;
  gap: 24px;
  align-items: center;
  flex-wrap: wrap;
}
.hero-info {
  flex: 1;
  min-width: 240px;
}
h1 {
  font-size: 24px;
  margin-bottom: 6px;
}
.sub {
  color: var(--sub);
  font-size: 14px;
  margin-bottom: 10px;
}
.intro {
  color: var(--text);
  margin-bottom: 14px;
  line-height: 1.7;
}
.stats-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.skill-tag {
  margin-right: 6px;
  margin-bottom: 4px;
}
.timeline-card h4 {
  font-size: 15px;
  margin-bottom: 4px;
}
.timeline-card p,
:deep(.el-timeline-item) p {
  font-size: 13px;
  color: var(--sub);
  line-height: 1.7;
}
:deep(.el-card) {
  background: var(--card);
  border: 1px solid var(--line);
  color: var(--text);
}
:deep(.el-descriptions__label) {
  color: var(--sub);
}
</style>
