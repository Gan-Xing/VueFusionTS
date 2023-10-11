<template>
  <div class="tiptapEditor">
    <div class="editor-menu-bar">
      <!-- 加粗 -->
      <button :class="{ active: isBoldActive }" @click="toggleBold">
        <img src="@/components/svg/加粗.svg" alt="bold" />
      </button>
      <!-- 斜体 -->
      <button :class="{ active: isItalicActive }" @click="toggleItalic">
        <img src="@/components/svg/斜体.svg" alt="italic" />
      </button>
      <!-- 下划线 -->
      <button :class="{ active: isUnderlineActive }" @click="toggleUnderline">
        <img src="@/components/svg/下划线.svg" alt="underline" />
      </button>
      <!-- 引用 -->
      <button :class="{ active: isBlockquoteActive }" @click="toggleBlockquote">
        <img src="@/components/svg/引用.svg" alt="quote-right" />
      </button>
      <el-dropdown @command="setHeading">
        <button>
          <img src="@/components/svg/标题.svg" alt="heading" />
        </button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="1">H1</el-dropdown-item>
          <el-dropdown-item command="2">H2</el-dropdown-item>
          <el-dropdown-item command="3">H3</el-dropdown-item>
          <el-dropdown-item command="4">H4</el-dropdown-item>
          <el-dropdown-item command="5">H5</el-dropdown-item>
          <el-dropdown-item command="6">H6</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- 删除线 -->
      <button :class="{ active: isStrikeActive }" @click="toggleStrike">
        <img src="@/components/svg/删除线.svg" alt="strikethrough" />
      </button>
      <!-- 无序列表 -->
      <button :class="{ active: isBulletListActive }" @click="toggleBulletList">
        <img src="@/components/svg/无序列表.svg" alt="list-ul" />
      </button>
      <!-- 有序列表 -->
      <button
        :class="{ active: isOrderedListActive }"
        @click="toggleOrderedList"
      >
        <img src="@/components/svg/有序列表.svg" alt="list-ol" />
      </button>
      <!-- 分隔线 -->
      <button @click="toggleHorizontalRule">
        <img src="@/components/svg/横线.svg" alt="minus" />
      </button>
      <!-- 左对齐 -->
      <button
        :class="{ active: isTextAlignActive('left') }"
        @click="setTextAlign('left')"
      >
        <img src="@/components/svg/文字居左.svg" alt="textleft" />
      </button>
      <!-- 文字居中 -->
      <button
        :class="{ active: isTextAlignActive('center') }"
        @click="setTextAlign('center')"
      >
        <img src="@/components/svg/文字居中.svg" alt="textcenter" />
      </button>
      <!-- 右对齐 -->
      <button
        :class="{ active: isTextAlignActive('right') }"
        @click="setTextAlign('right')"
      >
        <img src="@/components/svg/文字居右.svg" alt="textright" />
      </button>
      <!-- 两端对齐 -->
      <button
        :class="{ active: isTextAlignActive('justify') }"
        @click="setTextAlign('justify')"
      >
        <img src="@/components/svg/文字两边对齐.svg" alt="textjustify" />
      </button>
      <!-- 上标 -->
      <button
        :class="{ active: isSuperscriptActive }"
        @click="toggleSuperscript"
      >
        <img src="@/components/svg/上标.svg" alt="superscript" />
      </button>
      <!-- 下标 -->
      <button :class="{ active: isSubscriptActive }" @click="toggleSubscript">
        <img src="@/components/svg/下标.svg" alt="subscript" />
      </button>
      <!-- 撤销 -->
      <button @click="undo">
        <img src="@/components/svg/撤销.svg" alt="undo" />
      </button>
      <!-- 重做 -->
      <button @click="redo">
        <img src="@/components/svg/重做.svg" alt="redo" />
      </button>
      <!-- 表格操作 Dropdown ... -->
      <el-dropdown @command="handleTableCommand">
        <button>
          <img src="@/components/svg/表格.svg" alt="tableau" />
        </button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="insertTable">插入表格</el-dropdown-item>
          <el-dropdown-item command="addColumnBefore"
            >左侧插入列</el-dropdown-item
          >
          <el-dropdown-item command="addColumnAfter"
            >右侧插入列</el-dropdown-item
          >
          <el-dropdown-item command="deleteColumn">删除列</el-dropdown-item>
          <el-dropdown-item command="addRowBefore">上方插入行</el-dropdown-item>
          <el-dropdown-item command="addRowAfter">下方插入行</el-dropdown-item>
          <el-dropdown-item command="deleteRow">删除行</el-dropdown-item>
          <el-dropdown-item command="mergeOrSplit">合并或拆分</el-dropdown-item>
          <el-dropdown-item command="toggleHeaderColumn"
            >切换列头</el-dropdown-item
          >
          <el-dropdown-item command="toggleHeaderRow"
            >切换行头</el-dropdown-item
          >
          <el-dropdown-item command="toggleHeaderCell"
            >切换单元格头</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <EditorContent :editor="editor" class="EditorContent" />
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
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import Image from '@tiptap/extension-image'
import { Component } from 'vue'
import { Level } from '@/types'

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

    // 设置标题大小
    const setHeading = (level: string) => {
      if (editor.value) {
        editor.value
          .chain()
          .toggleHeading({ level: parseInt(level) as Level })
          .run()
      }
    }

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
      if (editor.value && direction !== 'left') {
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

    const handleTableCommand = (command: string) => {
      if (!editor.value) return

      switch (command) {
        case 'insertTable':
          editor.value
            .chain()
            .focus()
            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
            .run()
          break
        case 'addColumnBefore':
          editor.value.chain().focus().addColumnBefore().run()
          break
        case 'addColumnAfter':
          editor.value.chain().focus().addColumnAfter().run()
          break
        case 'deleteColumn':
          editor.value.chain().focus().deleteColumn().run()
          break
        case 'addRowBefore':
          editor.value.chain().focus().addRowBefore().run()
          break
        case 'addRowAfter':
          editor.value.chain().focus().addRowAfter().run()
          break
        case 'deleteRow':
          editor.value.chain().focus().deleteRow().run()
          break
        case 'mergeCells':
          editor.value.chain().focus().mergeCells().run()
          break
        case 'splitCell':
          editor.value.chain().focus().splitCell().run()
          break
        case 'toggleHeaderColumn':
          editor.value.chain().focus().toggleHeaderColumn().run()
          break
        case 'toggleHeaderRow':
          editor.value.chain().focus().toggleHeaderRow().run()
          break
        case 'toggleHeaderCell':
          editor.value.chain().focus().toggleHeaderCell().run()
          break
        case 'mergeOrSplit':
          editor.value.chain().focus().mergeOrSplit().run()
          break
        case 'setCellAttribute':
          editor.value.chain().focus().setCellAttribute('colspan', 2).run()
          break
        case 'fixTables':
          editor.value.chain().focus().fixTables().run()
          break
        case 'goToNextCell':
          editor.value.chain().focus().goToNextCell().run()
          break
        case 'goToPreviousCell':
          editor.value.chain().focus().goToPreviousCell().run()
          break
        default:
          break
      }
    }

    const updateEditorContent = (newHtml: string) => {
      if (editor.value && newHtml) {
        editor.value.commands.setContent(newHtml)
      }
    }
    const getHTML = () => {
      return editor.value!.getHTML()
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
          Table.configure({
            resizable: true
          }),
          TableRow,
          TableHeader,
          TableCell,
          Image.configure({
            inline: true,
            allowBase64: true
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
      setHeading,
      handleTableCommand,
      undo,
      redo,
      updateEditorContent,
      getHTML
    }
  }
} as Component
</script>

<style lang="scss">
.tiptap {
  table {
    border-collapse: collapse;
    table-layout: fixed;
    width: 100%;
    margin: 0;
    overflow: hidden;

    td,
    th {
      min-width: 1em;
      border: 2px solid #ced4da;
      padding: 3px 5px;
      vertical-align: top;
      box-sizing: border-box;
      position: relative;

      > * {
        margin-bottom: 0;
      }
    }

    th {
      font-weight: bold;
      text-align: left;
      background-color: #f1f3f5;
    }

    .selectedCell:after {
      z-index: 2;
      position: absolute;
      content: '';
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background: rgba(200, 200, 255, 0.4);
      pointer-events: none;
    }

    .column-resize-handle {
      position: absolute;
      right: -2px;
      top: 0;
      bottom: -2px;
      width: 4px;
      background-color: #adf;
      pointer-events: none;
    }

    p {
      margin: 0;
    }
  }
}

.tableWrapper {
  padding: 1rem 0;
  overflow-x: auto;
}

.resize-cursor {
  cursor: ew-resize;
  cursor: col-resize;
}

/* 引用的样式 */
blockquote {
  padding-left: 1rem;
  border-left: 3px solid rgba(13, 13, 13, 0.1);
}

/* 编辑器样式 */
button {
  background-color: transparent;
  border: 2px solid #409eff; /* ElementUI 蓝色 */
  padding: 6px 10px; /* 减小了内部间距 */
  border-radius: 4px;
  color: #409eff;
  cursor: pointer;
  transition: all 0.3s ease;
  outline: none;
  font-size: 13px; /* 调整字体大小 */
  font-weight: 500;
  margin: 4px; /* 调整间距，使其有缝隙 */
  position: relative;
}

button:hover {
  background-color: #409eff;
  color: white;
}

button.active {
  background-color: #ffc107; /* 使用稍微明亮的黄色作为活跃背景色 */
  border-color: #ffc107;
  color: white;
}

button:active {
  transform: translateY(1px); /* 减小按下效果的移动距离 */
}

button:focus {
  box-shadow: 0 0 6px rgba(64, 158, 255, 0.4); /* 使用ElementUI蓝色的焦点阴影 */
}

.EditorContent {
  border: 2px solid #409eff; /* ElementUI 蓝色 */
  padding: 16px;
  border-radius: 4px;
  color: #333;
  font-size: 15px;
  transition: border 0.3s ease;
  outline: none;
  flex: 1;
  overflow: scroll;
}

.EditorContent:focus {
  border-color: #ffc107; /* 使用黄色作为焦点边框色 */
  box-shadow: 0 0 6px rgba(64, 158, 255, 0.4); /* 使用ElementUI蓝色的焦点阴影 */
}

.tiptap.ProseMirror:focus-visible {
  outline: none; /* ElementUI 蓝色 */
}
</style>
