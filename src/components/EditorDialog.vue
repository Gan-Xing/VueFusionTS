<template>
  <div>
    <el-button @click="showEditor = true">Open Editor</el-button>
    <el-dialog :visible.sync="showEditor" @close="destroyEditor">
      <TiptapEditor ref="tiptapEditorRef" />
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="destroyEditor">取消</el-button>
          <el-button type="primary" @click="confirmEditor">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { ref } from '@vue/composition-api'
import TiptapEditor from './TiptapEditor.vue'

import { Component } from 'vue'
import { TiptapEditorComponent } from '@/types'

export default {
  name: 'EditorDialog',
  components: {
    TiptapEditor
  },
  setup() {
    const showEditor = ref<boolean>(false)
    const tiptapEditorRef = ref<TiptapEditorComponent | null>(null)

    const openEditor = () => {
      showEditor.value = true
    }

    const destroyEditor = () => {
      showEditor.value = false
    }

    const confirmEditor = () => {
      // 使用子组件的 getHTML 方法获取 html
      if (tiptapEditorRef.value) {
        const html = tiptapEditorRef.value.getHTML()
        console.log(html)
        showEditor.value = false
      }
    }

    return {
      showEditor,
      openEditor,
      destroyEditor,
      confirmEditor,
      tiptapEditorRef
    }
  }
} as Component
</script>
