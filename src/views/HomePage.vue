<script setup>
/**
 * 个人主页（实验四：Pinia 改造）
 * - 通过 useProfileStore() 获取共享数据（替代实验三的 inject）
 * - storeToRefs 解构 state/getters，保持响应性
 * - 修改数据走 profileStore.saveProfile action
 */
import { ref } from 'vue'
import { storeToRefs } from 'pinia'

import ProfileCard from '../components/ProfileCard.vue'
import StatsBoard from '../components/StatsBoard.vue'
import SkillSection from '../components/SkillSection.vue'
import HobbySection from '../components/HobbySection.vue'
import AwardSection from '../components/AwardSection.vue'
import EditProfileForm from '../components/EditProfileForm.vue'
import { useProfileStore } from '../stores/profileStore'

const profileStore = useProfileStore()

// storeToRefs 解构保持响应式（state + getters）
const { profile, motto, skills, hobbies, awards, skilledCount, daysAtSchool } =
  storeToRefs(profileStore)

// 视图内部状态（组件私有，不进 Store）
const keyword = ref('')
const editVisible = ref(false)

function openEdit() {
  editVisible.value = true
}

function saveProfile(form) {
  // 调用 action 修改 state（唯一推荐入口）
  profileStore.saveProfile(form)
  editVisible.value = false
}

function cancelEdit() {
  editVisible.value = false
}
</script>

<template>
  <main>
    <ProfileCard :profile="profile" :motto="motto" @open-edit="openEdit" />

    <StatsBoard
      :skill-count="skills.length"
      :skilled-count="skilledCount"
      :hobby-count="hobbies.length"
      :days-at-school="daysAtSchool"
    />

    <SkillSection v-model="keyword" :skills="skills" />

    <HobbySection :hobbies="hobbies" />

    <AwardSection :awards="awards" />

    <EditProfileForm
      v-model:visible="editVisible"
      :profile="profile"
      @save="saveProfile"
      @cancel="cancelEdit"
    />
  </main>
</template>
