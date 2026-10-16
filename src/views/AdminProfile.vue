<script setup>
/**
 * 后台 - 编辑个人简介（嵌套子路由）
 * - 实验四：Element Plus 表单组件重构
 * - el-form + el-form-item + rules 校验，el-avatar 实时预览头像
 * - 数据来自 profileStore，保存走 saveProfile action（自动持久化）
 * - 保存后 router.replace 到首页（无新增历史）
 */
import { ref, watch, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { useProfileStore } from '../stores/profileStore'

const router = useRouter()
const profileStore = useProfileStore()
const { profile, motto } = storeToRefs(profileStore)

// 表单字段与 profile + motto 对应
function buildForm() {
  return {
    name: profile.value.name || '',
    className: profile.value.className || '',
    studentId: profile.value.studentId || '',
    phone: profile.value.phone || '',
    avatar: profile.value.avatar || '',
    intro: profile.value.intro || '',
    motto: motto.value || ''
  }
}

const formRef = ref(null)
const form = reactive(buildForm())

const rules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  phone: [
    { pattern: /^1\d{10}$/, message: '请输入 11 位手机号', trigger: 'blur' }
  ]
}

// profile 变化时同步到表单
watch(profile, () => {
  Object.assign(form, buildForm())
}, { deep: true })

function save() {
  formRef.value.validate((valid) => {
    if (!valid) return
    // 调用 action 修改 state（内部会持久化到 localStorage）
    profileStore.saveProfile({ ...form })
    ElMessage.success('已保存，正在返回首页…')
    setTimeout(() => router.replace('/home'), 700)
  })
}

function cancel() {
  router.push('/admin/projects')
}
</script>

<template>
  <section>
    <el-card class="card" shadow="never">
      <template #header>
        <div class="section-head">
          <h2>编辑个人简介</h2>
          <small>修改后会同步到首页展示</small>
        </div>
      </template>

      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-row :gutter="16">
          <el-col :xs="24" :sm="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model.trim="form.name" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item label="专业班级">
              <el-input v-model.trim="form.className" placeholder="如：24计科2班" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item label="学号">
              <el-input v-model.trim="form.studentId" placeholder="请输入学号" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model.trim="form.phone" placeholder="请输入手机号" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="头像链接">
          <el-input v-model.trim="form.avatar" placeholder="https://… 图片地址" />
        </el-form-item>

        <el-form-item label="座右铭">
          <el-input v-model.trim="form.motto" placeholder="一句座右铭" />
        </el-form-item>

        <el-form-item label="个人简介">
          <el-input
            v-model.trim="form.intro"
            type="textarea"
            :rows="4"
            placeholder="介绍一下自己"
          />
        </el-form-item>

        <!-- 头像实时预览 -->
        <el-form-item label="预览" v-if="form.avatar">
          <el-avatar :size="56" :src="form.avatar" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="save">
            <el-icon><Select /></el-icon> 保存
          </el-button>
          <el-button @click="cancel">管理项目 →</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </section>
</template>
