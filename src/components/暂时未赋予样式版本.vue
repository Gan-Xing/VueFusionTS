<template>
  <div>
    <div class="editor-menu-bar">
      <button :class="{ active: isBoldActive }" @click="toggleBold">
        加粗
      </button>
      <button :class="{ active: isItalicActive }" @click="toggleItalic">
        斜体
      </button>
      <button :class="{ active: isUnderlineActive }" @click="toggleUnderline">
        下划线
      </button>
      <button :class="{ active: isBlockquoteActive }" @click="toggleBlockquote">
        引用
      </button>
      <button
        :class="{ active: isTextAlignActive('left') }"
        @click="setTextAlign('left')"
      >
        左对齐
      </button>
      <button
        :class="{ active: isTextAlignActive('center') }"
        @click="setTextAlign('center')"
      >
        居中
      </button>
      <button
        :class="{ active: isTextAlignActive('right') }"
        @click="setTextAlign('right')"
      >
        右对齐
      </button>
      <button
        :class="{ active: isTextAlignActive('justify') }"
        @click="setTextAlign('justify')"
      >
        两端对齐
      </button>
      <button @click="unsetTextAlign">取消文本对齐</button>
    </div>

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
import {
  ref,
  onMounted,
  onBeforeUnmount,
  computed,
  Ref
} from '@vue/composition-api'
import { Editor, EditorContent } from '@tiptap/vue-2'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import { Component } from 'vue'

export default {
  name: 'TiptapEditor',
  components: {
    EditorContent
  },
  setup() {
    const editor: Ref<Editor | null> = ref(null)
    const htmlContent: Ref<string> = ref('')

    // 加粗
    const toggleBold = () => {
      if (editor.value) {
        editor.value.chain().toggleBold().run()
      }
    }
    const isBoldActive = computed(() => editor.value?.isActive('bold') || false)

    // 斜体
    const toggleItalic = () => {
      if (editor.value) {
        editor.value.chain().toggleItalic().run()
      }
    }
    const isItalicActive = computed(
      () => editor.value?.isActive('italic') || false
    )

    // 下划线
    const toggleUnderline = () => {
      if (editor.value) {
        editor.value.chain().toggleUnderline().run()
      }
    }
    const isUnderlineActive = computed(
      () => editor.value?.isActive('underline') || false
    )

    // 引用
    const toggleBlockquote = () => {
      if (editor.value) {
        editor.value.chain().focus().toggleBlockquote().run()
      }
    }
    const isBlockquoteActive = computed(
      () => editor.value?.isActive('blockquote') || false
    )

    const setTextAlign = (
      direction: 'left' | 'center' | 'right' | 'justify'
    ) => {
      if (editor.value) {
        editor.value.chain().focus().setTextAlign(direction).run()
      }
    }

    const isTextAlignActive = (
      direction: 'left' | 'center' | 'right' | 'justify'
    ) => {
      if (editor.value) {
        return editor.value.isActive({ textAlign: direction })
      }
      return false
    }

    const unsetTextAlign = () => {
      if (editor.value) {
        editor.value.chain().focus().unsetTextAlign().run()
      }
    }

    onMounted(() => {
      editor.value = new Editor({
        extensions: [
          StarterKit,
          Underline,
          TextAlign.configure({
            types: ['heading', 'paragraph']
          })
        ],
        content: '<p>Hello World! 🌍</p>'
      })

      editor.value.on('update', () => {
        htmlContent.value = editor.value!.getHTML()
      })

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
      toggleBold,
      isBoldActive,
      toggleItalic,
      isItalicActive,
      toggleUnderline,
      isUnderlineActive,
      toggleBlockquote,
      isBlockquoteActive,
      setTextAlign,
      isTextAlignActive,
      unsetTextAlign
    }
  }
} as Component
</script>

<style>
.active {
  background-color: #007bff;
  color: white;
}

/* 引用的样式 */
blockquote {
  padding-left: 1rem;
  border-left: 3px solid rgba(#0d0d0d, 0.1);
}
</style>
