<script setup>
/**
 * 技能清单（实验四：Element Plus 重构）
 * - el-input 搜索框（clearable + prefix-icon）替代原生 input
 * - el-progress 以进度条形式展示技能掌握程度
 * - el-tag 展示熟练度等级，el-empty 处理无匹配结果
 * - 搜索词使用 defineModel 与父组件双向同步
 */
import { computed } from 'vue'
import ContentCard from './ContentCard.vue'

const props = defineProps({
  skills: {
    type: Array,
    required: true
  }
})

// defineModel：父子双向绑定的搜索关键词
const keyword = defineModel({
  type: String,
  default: ''
})

// 筛选逻辑属于本组件内部派生状态
const filteredSkills = computed(() => {
  const kw = keyword.value.trim().toLowerCase()

  if (!kw) {
    return props.skills
  }

  return props.skills.filter(skill =>
    (skill.name + skill.level).toLowerCase().includes(kw)
  )
})

// 掌握程度 → 百分比 + 进度条颜色
function percent(level) {
  const map = { 熟练: 90, 掌握: 70, 学习中: 40 }
  return map[level] ?? 40
}

function levelType(level) {
  const map = { 熟练: 'success', 掌握: 'primary', 学习中: 'warning' }
  return map[level] || 'info'
}
</script>

<template>
  <ContentCard id="skills">
    <!-- 具名插槽：标题 -->
    <template #title>技能清单</template>

    <!-- 具名插槽：标题右侧统计 -->
    <template #extra>共 {{ skills.length }} 项 / 匹配 {{ filteredSkills.length }} 项</template>

    <!-- 默认插槽：卡片主体 -->
    <el-input
      v-model.trim="keyword"
      class="search"
      placeholder="输入关键词筛选技能…"
      prefix-icon="Search"
      clearable
    />

    <ul class="skill-list" v-if="filteredSkills.length > 0">
      <li class="skill-item" v-for="skill in filteredSkills" :key="skill.name">
        <div class="skill-head">
          <span class="skill-name">{{ skill.name }}</span>
          <el-tag :type="levelType(skill.level)" size="small" effect="light">
            {{ skill.level }}
          </el-tag>
        </div>
        <el-progress
          :percentage="percent(skill.level)"
          :stroke-width="8"
          :show-text="false"
          :status="skill.level === '熟练' ? 'success' : ''"
        />
      </li>
    </ul>

    <!-- 空状态 -->
    <el-empty v-else :image-size="70" :description="`没有找到与「${keyword}」相关的技能`" />
  </ContentCard>
</template>

<style scoped>
.skill-list {
  list-style: none;
  margin-top: 18px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 14px;
}

.skill-item {
  padding: 13px 16px;
  background: var(--bg-soft);
  border: 1px solid var(--line);
  border-radius: 12px;
  transition: transform 0.15s, border-color 0.15s, box-shadow 0.15s;
}

.skill-item:hover {
  transform: translateY(-3px);
  border-color: color-mix(in srgb, var(--main) 40%, transparent);
  box-shadow: var(--shadow-hover);
}

.skill-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.skill-name {
  font-size: 14px;
  font-weight: 600;
}
</style>
