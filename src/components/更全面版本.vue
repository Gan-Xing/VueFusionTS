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
      <button :class="{ active: isHeadingActive }" @click="toggleHeading">
        标题
      </button>
      <button :class="{ active: isStrikeActive }" @click="toggleStrike">
        删除线
      </button>
      <button :class="{ active: isBulletListActive }" @click="toggleBulletList">
        项目符号列表
      </button>
      <button
        :class="{ active: isOrderedListActive }"
        @click="toggleOrderedList"
      >
        有序列表
      </button>
      <button
        :class="{ active: isHorizontalRuleActive }"
        @click="toggleHorizontalRule"
      >
        分隔线
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
      <button
        :class="{ active: isSuperscriptActive }"
        @click="toggleSuperscript"
      >
        上标
      </button>
      <button :class="{ active: isSubscriptActive }" @click="toggleSubscript">
        下标
      </button>
      <button @click="undo">撤销</button>
      <button @click="redo">重做</button>
      <input
        type="color"
        :value="editor.getAttributes('textStyle').color"
        @input="editor.chain().focus().setColor($event.target.value).run()"
      />
      <el-dropdown @command="setFontFamily">
        <button class="el-button el-button--primary">
          字体 <i class="el-icon-arrow-down el-icon--right"></i>
        </button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="SimSun">宋体</el-dropdown-item>
          <el-dropdown-item command="Microsoft YaHei"
            >微软雅黑</el-dropdown-item
          >
          <el-dropdown-item command="KaiTi">楷体</el-dropdown-item>
          <el-dropdown-item command="LiSu">隶书</el-dropdown-item>
          <el-dropdown-item command="FangSong">仿宋</el-dropdown-item>
          <el-dropdown-item command="YouYuan">幼圆</el-dropdown-item>
          <el-dropdown-item command="Xingkai SC">行楷</el-dropdown-item>
          <el-dropdown-item command="Arial">Arial</el-dropdown-item>
          <el-dropdown-item command="Verdana">Verdana</el-dropdown-item>
          <el-dropdown-item command="Georgia">Georgia</el-dropdown-item>
          <el-dropdown-item command="Courier New">Courier New</el-dropdown-item>
          <el-dropdown-item command="Times New Roman"
            >Times New Roman</el-dropdown-item
          >
          <el-dropdown-item command="Trebuchet MS"
            >Trebuchet MS</el-dropdown-item
          >
          <el-dropdown-item command="Lucida Sans Unicode"
            >Lucida Sans</el-dropdown-item
          >
          <el-dropdown-item command="Tahoma">Tahoma</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
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
import Superscript from '@tiptap/extension-superscript'
import Subscript from '@tiptap/extension-subscript'
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import { Component } from 'vue'
import FontFamily from '@tiptap/extension-font-family'

export default {
  name: 'TiptapEditor',
  components: {
    EditorContent
  },
  setup() {
    const editor: Ref<Editor | null> = ref(null)
    const htmlContent: Ref<string> = ref('')

    const hasTextSelected = computed(() => {
      return (
        editor.value?.state.selection.from !== editor.value?.state.selection.to
      )
    })

    // 加粗
    const toggleBold = () => {
      if (editor.value) {
        editor.value.chain().toggleBold().run()
      }
    }
    const isBoldActive = computed(
      () => (hasTextSelected.value && editor.value?.isActive('bold')) || false
    )
    // 斜体
    const toggleItalic = () => {
      if (editor.value) {
        editor.value.chain().toggleItalic().run()
      }
    }
    const isItalicActive = computed(
      () => (hasTextSelected.value && editor.value?.isActive('italic')) || false
    )

    // 下划线
    const toggleUnderline = () => {
      if (editor.value) {
        editor.value.chain().toggleUnderline().run()
      }
    }
    const isUnderlineActive = computed(
      () =>
        (hasTextSelected.value && editor.value?.isActive('underline')) || false
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

    // 标题
    const toggleHeading = () => {
      if (editor.value) {
        editor.value.chain().toggleHeading({ level: 1 }).run()
      }
    }
    const isHeadingActive = computed(
      () =>
        (hasTextSelected.value && editor.value?.isActive('heading')) || false
    )

    // 删除线
    const toggleStrike = () => {
      if (editor.value) {
        editor.value.chain().toggleStrike().run()
      }
    }
    const isStrikeActive = computed(
      () => (hasTextSelected.value && editor.value?.isActive('strike')) || false
    )

    // 无序列表
    const toggleBulletList = () => {
      if (editor.value) {
        editor.value.chain().toggleBulletList().run()
      }
    }
    const isBulletListActive = computed(
      () =>
        (hasTextSelected.value && editor.value?.isActive('bulletList')) || false
    )

    // 有序列表
    const toggleOrderedList = () => {
      if (editor.value) {
        editor.value.chain().toggleOrderedList().run()
      }
    }
    const isOrderedListActive = computed(
      () =>
        (hasTextSelected.value && editor.value?.isActive('orderedList')) ||
        false
    )

    // 水平线
    const toggleHorizontalRule = () => {
      if (editor.value) {
        editor.value.chain().setHorizontalRule().run()
      }
    }

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

    const undo = () => {
      if (editor.value) {
        editor.value.chain().undo().run()
      }
    }

    const redo = () => {
      if (editor.value) {
        editor.value.chain().redo().run()
      }
    }

    const toggleSuperscript = () => {
      if (editor.value) {
        editor.value.chain().focus().toggleSuperscript().run()
      }
    }
    const isSuperscriptActive = computed(
      () =>
        (hasTextSelected.value && editor.value?.isActive('superscript')) ||
        false
    )

    const toggleSubscript = () => {
      if (editor.value) {
        editor.value.chain().focus().toggleSubscript().run()
      }
    }
    const isSubscriptActive = computed(
      () =>
        (hasTextSelected.value && editor.value?.isActive('subscript')) || false
    )

    const setFontFamily = (fontName: string) => {
      if (editor.value) {
        editor.value.chain().focus().setFontFamily(fontName).run()
      }
    }

    onMounted(() => {
      editor.value = new Editor({
        extensions: [
          StarterKit,
          Underline,
          TextAlign.configure({
            alignments: ['left', 'center', 'right', 'justify'],
            types: ['heading', 'paragraph', 'taskItem']
          }),
          Superscript,
          Subscript,
          TextStyle,
          Color,
          FontFamily
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
      toggleHeading,
      isHeadingActive,
      toggleStrike,
      isStrikeActive,
      toggleBulletList,
      isBulletListActive,
      toggleOrderedList,
      isOrderedListActive,
      toggleHorizontalRule,
      toggleSuperscript,
      isSuperscriptActive,
      toggleSubscript,
      isSubscriptActive,
      setFontFamily,
      undo,
      redo
    }
  }
} as Component
</script>

<style lang="scss">
.active {
  background-color: #007bff;
  color: white;
}

/* 引用的样式 */
blockquote {
  padding-left: 1rem;
  border-left: 3px solid rgba(13, 13, 13, 0.1);
}
</style>
