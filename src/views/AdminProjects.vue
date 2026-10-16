<script setup>
/**
 * 后台 - 管理项目（实验四：Element Plus 重构，需登录）
 * - el-table 展示项目，el-progress 展示完成度，el-switch 切换收藏
 * - el-dialog + el-form + el-select + el-slider 实现新增/编辑
 * - ElMessageBox 删除确认、ElMessage 操作反馈
 * - 增删改全部走 projectStore 的 actions（自动持久化到 localStorage）
 */
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useProjectStore } from '../stores/projectStore'

const router = useRouter()
const projectStore = useProjectStore()
const { projects, total } = storeToRefs(projectStore)

const dialogVisible = ref(false)
const formRef = ref(null)
const form = reactive({
  id: null,
  name: '',
  desc: '',
  category: '前端',
  tags: '',
  status: '开发中',
  progress: 0
})

const rules = {
  name: [{ required: true, message: '项目名称不能为空', trigger: 'blur' }]
}

const dialogTitle = computed(() => (form.id ? '编辑项目' : '新增项目'))

const categories = ['前端', '后端', '全栈', '工具']
const statuses = ['开发中', '已完成', '维护中']

function startAdd() {
  Object.assign(form, {
    id: null,
    name: '',
    desc: '',
    category: '前端',
    tags: '',
    status: '开发中',
    progress: 0
  })
  dialogVisible.value = true
}

function startEdit(row) {
  Object.assign(form, {
    ...row,
    tags: (row.tags || []).join(', ')
  })
  dialogVisible.value = true
}

function submit() {
  formRef.value.validate((valid) => {
    if (!valid) return

    const tags = form.tags
      .split(/[,，\s]+/)
      .map(t => t.trim())
      .filter(Boolean)

    const payload = {
      name: form.name,
      desc: form.desc,
      category: form.category,
      status: form.status,
      progress: Number(form.progress) || 0,
      tags: tags.length ? tags : ['未分类']
    }

    // 调用 Store actions（修改 state 的唯一入口，自动 persist）
    if (form.id) {
      projectStore.updateProject(form.id, payload)
      ElMessage.success('修改成功')
    } else {
      projectStore.addProject(payload)
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
  })
}

async function remove(row) {
  try {
    await ElMessageBox.confirm(`确认删除「${row.name}」？`, '删除确认', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消'
    })
    projectStore.removeProject(row.id)
    ElMessage.success('已删除')
  } catch {
    // 用户取消删除
  }
}

function toggleStar(row) {
  projectStore.toggleStar(row.id)
  ElMessage.info(row.starred ? '已取消收藏' : '已收藏')
}

function viewOnSite(id) {
  router.push({ name: 'ProjectDetail', params: { id } })
}

function statusType(status) {
  const map = { 已完成: 'success', 开发中: 'warning', 维护中: 'info' }
  return map[status] || 'info'
}

function progressColor(progress) {
  if (progress >= 100) return '#67c23a'
  if (progress >= 60) return '#409eff'
  return '#e6a23c'
}
</script>

<template>
  <section>
    <el-card class="card" shadow="never">
      <template #header>
        <div class="section-head">
          <h2>项目管理</h2>
          <el-button type="primary" size="small" @click="startAdd">
            <el-icon><Plus /></el-icon> 新增项目
          </el-button>
        </div>
      </template>

      <el-alert
        :closable="false"
        type="info"
        show-icon
        :title="`共 ${total} 个项目`"
        class="count-alert"
      />

      <el-table :data="projects" border stripe size="small" empty-text="暂无项目，点击右上角新增">
        <el-table-column type="index" label="#" width="50" />
        <el-table-column prop="name" label="项目名称" min-width="160" show-overflow-tooltip />
        <el-table-column prop="category" label="分类" width="90" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)" size="small" effect="light">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="进度" min-width="160">
          <template #default="{ row }">
            <el-progress
              :percentage="row.progress"
              :color="progressColor(row.progress)"
              :stroke-width="10"
              striped
            />
          </template>
        </el-table-column>
        <el-table-column label="收藏" width="80">
          <template #default="{ row }">
            <el-switch
              :model-value="row.starred"
              size="small"
              @change="toggleStar(row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button size="small" text type="primary" @click="viewOnSite(row.id)">
              预览
            </el-button>
            <el-button size="small" text type="warning" @click="startEdit(row)">
              编辑
            </el-button>
            <el-button size="small" text type="danger" @click="remove(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 对话框组件：新增 / 编辑 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="560px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="项目名称" prop="name">
          <el-input v-model.trim="form.name" placeholder="必填" />
        </el-form-item>
        <el-form-item label="项目简介">
          <el-input v-model.trim="form.desc" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="技术栈">
          <el-input v-model.trim="form.tags" placeholder="逗号分隔，如：Vue 3, Vite" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="form.category">
            <el-option v-for="c in categories" :key="c" :label="c" :value="c" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status">
            <el-option v-for="s in statuses" :key="s" :label="s" :value="s" />
          </el-select>
        </el-form-item>
        <el-form-item label="完成度">
          <!-- 滑块组件：拖动设置 0~100 的进度 -->
          <el-slider v-model="form.progress" :step="5" show-input :show-input-controls="false" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit">保存</el-button>
      </template>
    </el-dialog>
  </section>
</template>

<style scoped>
.count-alert {
  margin-bottom: 14px;
}
:deep(.el-table) {
  background: var(--bg-soft);
}
</style>
