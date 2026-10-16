<script setup>
/**
 * 后台 - 管理文章（实验四：Element Plus 重构，需登录）
 * - el-table 展示文章列表（含 el-switch 发布开关、el-tag 分类标签）
 * - el-dialog + el-form 实现新增/编辑，el-select 选择分类
 * - ElMessageBox 删除确认、ElMessage 操作反馈
 * - 增删改查全部走 articleStore 的 actions（自动持久化到 localStorage）
 */
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useArticleStore } from '../stores/articleStore'

const router = useRouter()
const articleStore = useArticleStore()
const { articles, total, publishedCount } = storeToRefs(articleStore)

const dialogVisible = ref(false)
const formRef = ref(null)
const form = reactive({
  id: null,
  title: '',
  summary: '',
  content: '',
  category: '前端',
  tags: '',
  published: true
})

const rules = {
  title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
  content: [{ required: true, message: '正文不能为空', trigger: 'blur' }]
}

const dialogTitle = computed(() => (form.id ? '编辑文章' : '新增文章'))

const categories = ['前端', '后端', '样式', '随笔']

function startAdd() {
  Object.assign(form, {
    id: null,
    title: '',
    summary: '',
    content: '',
    category: '前端',
    tags: '',
    published: true
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
      title: form.title,
      summary: form.summary || form.title,
      content: form.content,
      category: form.category,
      published: form.published,
      tags: tags.length ? tags : ['随笔']
    }

    // 走 Store actions（修改 state 的唯一入口，自动 persist）
    if (form.id) {
      articleStore.updateArticle(form.id, payload)
      ElMessage.success('修改成功')
    } else {
      articleStore.addArticle(payload)
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
  })
}

async function remove(row) {
  try {
    await ElMessageBox.confirm(`确认删除「${row.title}」？`, '删除确认', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消'
    })
    articleStore.removeArticle(row.id)
    ElMessage.success('已删除')
  } catch {
    // 用户取消删除
  }
}

function togglePublished(row) {
  articleStore.togglePublished(row.id)
  ElMessage.info(row.published ? '已设为草稿' : '已发布')
}

function viewOnSite(id) {
  router.push({ name: 'ArticleDetail', params: { id } })
}

function tagType(category) {
  const map = { 前端: 'primary', 后端: 'success', 样式: 'warning', 随笔: 'info' }
  return map[category] || 'info'
}
</script>

<template>
  <section>
    <el-card class="card" shadow="never">
      <template #header>
        <div class="section-head">
          <h2>文章管理</h2>
          <el-button type="primary" size="small" @click="startAdd">
            <el-icon><Plus /></el-icon> 新增文章
          </el-button>
        </div>
      </template>

      <el-alert
        :closable="false"
        type="info"
        show-icon
        :title="`共 ${total} 篇文章 · 已发布 ${publishedCount} 篇`"
        class="count-alert"
      />

      <!-- 表格组件：展示 + 行内操作 -->
      <el-table :data="articles" border stripe size="small" empty-text="暂无文章，点击右上角新增">
        <el-table-column type="index" label="#" width="50" />
        <el-table-column prop="title" label="标题" min-width="180" show-overflow-tooltip />
        <el-table-column prop="category" label="分类" width="90">
          <template #default="{ row }">
            <el-tag :type="tagType(row.category)" size="small" effect="light">
              {{ row.category }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="标签" min-width="140">
          <template #default="{ row }">
            <el-tag
              v-for="t in row.tags"
              :key="t"
              size="small"
              type="info"
              effect="plain"
              class="row-tag"
            >
              {{ t }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="时间" width="90" />
        <el-table-column prop="views" label="阅读" width="80" />
        <el-table-column label="发布" width="90">
          <template #default="{ row }">
            <el-switch
              :model-value="row.published"
              size="small"
              @change="togglePublished(row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="210" fixed="right">
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
      <el-form ref="formRef" :model="form" :rules="rules" label-width="70px">
        <el-form-item label="标题" prop="title">
          <el-input v-model.trim="form.title" placeholder="必填" />
        </el-form-item>
        <el-form-item label="摘要">
          <el-input v-model.trim="form.summary" placeholder="一句话概括" />
        </el-form-item>
        <el-form-item label="正文" prop="content">
          <el-input
            v-model.trim="form.content"
            type="textarea"
            :rows="6"
            placeholder="正文内容，换行分段"
          />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="form.category" placeholder="请选择分类">
            <el-option v-for="c in categories" :key="c" :label="c" :value="c" />
          </el-select>
        </el-form-item>
        <el-form-item label="标签">
          <el-input v-model.trim="form.tags" placeholder="逗号分隔，如：Vue, 笔记" />
        </el-form-item>
        <el-form-item label="发布">
          <el-switch v-model="form.published" active-text="立即发布" />
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
.row-tag {
  margin-right: 4px;
  margin-bottom: 2px;
}
:deep(.el-table) {
  background: var(--bg-soft);
}
</style>
