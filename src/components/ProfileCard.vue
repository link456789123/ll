<script setup>
/**
 * 个人信息卡片（实验四：Element Plus 重构）
 * - el-avatar 展示头像，el-tag 展示班级/学号/手机等信息标签
 * - el-button 触发「展开详情」与「编辑资料」（后者通过 defineEmits 上报父组件）
 * - 展示数据由父组件通过 props 传入；展开/收起属于组件内部状态
 */
import { ref } from 'vue'

defineProps({
  profile: {
    type: Object,
    required: true
  },
  motto: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['open-edit'])

// 组件内部状态：详情展开/收起
const showDetail = ref(false)

function toggleDetail() {
  showDetail.value = !showDetail.value
}
</script>

<template>
  <section class="card profile">
    <el-avatar :size="104" :src="profile.avatar" :alt="profile.name" class="avatar" />

    <div class="profile-info">
      <h1>{{ profile.name }}</h1>

      <div class="chips">
        <el-tag type="info" effect="plain" round size="small">🎓 {{ profile.className }}</el-tag>
        <el-tag type="info" effect="plain" round size="small">学号 {{ profile.studentId }}</el-tag>
        <el-tag type="info" effect="plain" round size="small">📱 {{ profile.phone }}</el-tag>
      </div>

      <p class="intro">{{ profile.intro }}</p>

      <div class="actions">
        <el-button plain @click="toggleDetail">
          {{ showDetail ? '收起详情' : '展开详情' }}
        </el-button>
        <el-button type="primary" @click="emit('open-edit')">编辑资料</el-button>
      </div>

      <transition name="fade">
        <div class="detail" v-show="showDetail">
          <p>座右铭：{{ motto }}</p>
        </div>
      </transition>
    </div>
  </section>
</template>

<style scoped>
.profile {
  display: flex;
  gap: 26px;
  flex-wrap: wrap;
  position: relative;
  overflow: hidden;
}

.profile::before {
  content: '';
  position: absolute;
  top: -70px;
  right: -70px;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: var(--grad);
  opacity: 0.1;
}

.avatar {
  flex-shrink: 0;
  box-shadow: 0 8px 20px rgba(79, 110, 247, 0.3);
  background: var(--card);
}

.profile-info {
  flex: 1;
  min-width: 260px;
}

h1 {
  font-size: 26px;
  margin-bottom: 10px;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.intro {
  color: var(--sub);
  margin-bottom: 16px;
}

.detail {
  margin-top: 16px;
  padding: 14px 16px;
  border-radius: 12px;
  border-left: 4px solid var(--main);
  background: var(--bg-soft);
}

@media (max-width: 640px) {
  .profile {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .chips,
  .actions {
    justify-content: center;
  }
}
</style>
