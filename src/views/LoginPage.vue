<script setup>
/**
 * 登录页（实验四：Element Plus 表单组件重构）
 * - el-form + el-form-item + rules 实现表单校验
 * - el-input（prefix-icon / show-password）、el-button、el-alert、el-card
 * - 登录状态写入 userStore（action 内部持久化到 localStorage）
 * - 从 query 读取 redirect 参数，登录成功后 replace 跳回原目标
 */
import { ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const formRef = ref(null)
const form = reactive({
  username: 'admin',
  password: '123456'
})

// 校验规则
const rules = {
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少 6 位', trigger: 'blur' }
  ]
}

const error = ref('')

function handleLogin() {
  error.value = ''
  formRef.value.validate((valid) => {
    if (!valid) return
    // 调用 userStore 的 login action（会同时持久化到 localStorage）
    if (userStore.login(form.username, form.password)) {
      const redirect = route.query.redirect || '/admin'
      router.replace(redirect)
    } else {
      error.value = '账号或密码错误（演示账号 admin / 123456）'
    }
  })
}

function toHome() {
  router.push('/home')
}
</script>

<template>
  <main class="login-page">
    <el-card class="login-card" shadow="never">
      <template #header>
        <div class="section-head">
          <h2>管理员登录</h2>
          <small>访问后台管理页面</small>
        </div>
      </template>

      <!-- 错误提示条 -->
      <el-alert
        v-if="error"
        :title="error"
        type="error"
        show-icon
        :closable="false"
        class="login-alert"
      />

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="60px"
        @submit.prevent="handleLogin"
      >
        <el-form-item label="账号" prop="username">
          <el-input
            v-model.trim="form.username"
            placeholder="请输入账号"
            prefix-icon="User"
            clearable
          />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            v-model.trim="form.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleLogin">
            登录
          </el-button>
          <el-button @click="toHome">返回首页</el-button>
        </el-form-item>
      </el-form>

      <el-divider content-position="center">演示账号</el-divider>
      <p class="hint">账号：<code>admin</code> · 密码：<code>123456</code></p>
    </el-card>
  </main>
</template>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  padding-top: 40px;
}
.login-card {
  width: 100%;
  max-width: 420px;
}
.login-alert {
  margin-bottom: 16px;
}
.hint {
  font-size: 12px;
  color: var(--sub);
  text-align: center;
}
.hint code {
  background: var(--bg-soft);
  padding: 1px 6px;
  border-radius: 4px;
  color: var(--main);
}
</style>
