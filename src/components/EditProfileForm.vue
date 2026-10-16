<script setup>
/**
 * 编辑资料表单（实验四：改用 Element Plus 对话框 + 表单组件）
 * - el-dialog 承载弹窗（v-model 通过 defineModel 与父组件双向同步）
 * - el-form + el-form-item + rules 做校验，el-input / el-textarea 收集输入
 * - 表单初值来自 props.profile（单向数据流，不直接修改 props）
 * - 保存/取消通过 defineEmits 上报父组件，由父组件调用 Store action 更新数据
 */
import { ref, watch } from 'vue'

const props = defineProps({
  profile: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['save', 'cancel'])

const visible = defineModel('visible', {
  type: Boolean,
  default: false
})

const formRef = ref(null)
const form = ref({
  name: '',
  className: '',
  intro: ''
})

const rules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }]
}

watch(
  () => props.profile,
  (profile) => {
    form.value = {
      name: profile.name,
      className: profile.className,
      intro: profile.intro
    }
  },
  { immediate: true }
)

function save() {
  formRef.value.validate((valid) => {
    if (!valid) return
    emit('save', { ...form.value })
    visible.value = false
  })
}

function cancel() {
  emit('cancel')
  visible.value = false
}

// 关闭对话框时同步通知父组件
function onClose() {
  emit('cancel')
}
</script>

<template>
  <el-dialog
    v-model="visible"
    title="编辑资料"
    width="480px"
    @close="onClose"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="姓名" prop="name">
        <el-input v-model.trim="form.name" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="专业班级">
        <el-input v-model.trim="form.className" placeholder="请输入专业班级" />
      </el-form-item>
      <el-form-item label="个人简介">
        <el-input
          v-model.trim="form.intro"
          type="textarea"
          :rows="3"
          placeholder="请输入个人简介"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="save">保存</el-button>
    </template>
  </el-dialog>
</template>
