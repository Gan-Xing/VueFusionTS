<template>
  <div>
    <!-- 加粗按钮 -->
    <button @click="toggleBold">加粗</button>

    <EditorContent :editor="editor" />
    <el-form>
      <el-form-item label="HTML内容">
        <el-input
          v-model="htmlContent"
          type="textarea"
          :autosize="true"
          readonly
          placeholder="HTML内容将在这里显示..."
        ></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, onBeforeUnmount, Ref } from '@vue/composition-api'
import { Editor, EditorContent } from '@tiptap/vue-2'
import StarterKit from '@tiptap/starter-kit'
import { Component } from 'vue'

export default {
  name: 'TiptapEditor',
  components: {
    EditorContent
  },
  setup() {
    const editor: Ref<Editor | null> = ref(null)
    const htmlContent: Ref<string> = ref('')

    // 加粗功能的事件处理器
    const toggleBold = () => {
      if (editor.value) {
        editor.value.chain().focus().toggleBold().run()
      }
    }

    const getHTML = () => {
      return editor.value!.getHTML()
    }

    onMounted(() => {
      editor.value = new Editor({
        extensions: [StarterKit],
        content: '<p>Hello World! 🌍</p>'
      })

      // 监听编辑器的更新事件
      editor.value.on('update', () => {
        htmlContent.value = editor.value!.getHTML()
      })

      // 初始化HTML内容
      htmlContent.value = editor.value!.getHTML()
    })

    onBeforeUnmount(() => {
      if (editor.value) {
        editor.value.destroy()
      }
    })

    return {
      editor,
      htmlContent,
      getHTML,
      toggleBold // 返回我们新添加的方法
    }
  }
} as Component
</script>
