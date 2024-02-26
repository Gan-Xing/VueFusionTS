<template>
  <div>
    <el-button @click="showEditor = true">Open Editor</el-button>
    <el-dialog
      :visible.sync="showEditor"
      :close-on-click-modal="false"
      class="customDialog"
      @close="destroyEditor"
    >
      <TiptapEditor ref="tiptapEditorRef" />
      <template #footer>
        <div class="dialog-footer">
          <div class="dialog-footer-left">
            <el-upload action="#" :before-upload="beforeUpload">
              <el-button slot="trigger" size="small" type="primary"
                >选择文件</el-button
              >
            </el-upload>
          </div>
          <span slot="footer" class="dialog-footer-right">
            <el-button size="small" @click="destroyEditor">取消</el-button>
            <el-button size="small" type="primary" @click="confirmEditor"
              >确定</el-button
            >
          </span>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { ref } from '@vue/composition-api'
import TiptapEditor from '@/components/TiptapEditor.vue'
import elementUiCss from 'element-ui/lib/theme-chalk/index.css'
import mammoth from 'mammoth'
import imageCompression from 'browser-image-compression'
import juice from 'juice'

import { Component } from 'vue'
import { TiptapEditorComponent } from '@/types'
import { Loading, Message } from 'element-ui'

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

        // 使用 Juice 内联 CSS
        const inlinedHTML = juice.inlineContent(html, elementUiCss)

        console.log('inlinedHTML', inlinedHTML)

        showEditor.value = false
      }
    }

    const beforeUpload = async (file: any) => {
      let loadingInstance
      try {
        loadingInstance = Loading.service({
          fullscreen: true,
          text: '正在转换文件...'
        })
        const htmlContent = (await convertDocxToHtml(file)) as string
        if (tiptapEditorRef.value) {
          tiptapEditorRef.value.updateEditorContent(htmlContent)
        }
      } catch (err) {
        Message.error('文件转化为编辑器内容失败,请选择doc,docx文件')
      } finally {
        // 关闭加载状态框
        if (loadingInstance) {
          loadingInstance.close()
        }
      }
      return false
    }

    const convertDocxToHtml = (file: any) => {
      return new Promise((resolve, reject) => {
        const options = {
          convertImage: mammoth.images.imgElement(function (image) {
            return image.read('base64').then(async (base64) => {
              const base64DataUrl =
                'data:' + image.contentType + ';base64,' + base64
              const tempImageFile = await imageCompression.getFilefromDataUrl(
                base64DataUrl,
                'temp.jpg'
              )
              const compressionOptions = {
                maxSizeMB: 0.05, // 0.01MB = 10KB
                useWebWorker: true
              }
              const compressedFile = await imageCompression(
                tempImageFile,
                compressionOptions
              )
              const compressedDataUrl =
                await imageCompression.getDataUrlFromFile(compressedFile)
              return { src: compressedDataUrl }
            })
          })
        }

        mammoth
          .convertToHtml({ arrayBuffer: file.arrayBuffer() }, options)
          .then((result) => {
            resolve(result.value)
          })
          .catch((error) => {
            reject(error)
          })
      })
    }

    return {
      showEditor,
      openEditor,
      destroyEditor,
      confirmEditor,
      tiptapEditorRef,
      beforeUpload,
      convertDocxToHtml
    }
  }
} as Component
</script>
<style lang="scss">
// .customDialog {
//   .el-dialog {
//     min-width: 520px;
//   }
// }
.customDialog {
  width: 100%;
  // height: 100vh;
  div.el-dialog {
    width: 100%;
    height: 100%;
    margin: 0 !important;
    min-height: 500px;
    display: flex;
    flex-direction: column;
    .el-dialog__body {
      display: flex;
      flex-direction: column;
      flex: 1;
      height: calc(100% - 67px - 55px);
      .tiptapEditor {
        display: flex;
        flex-direction: column;
        flex: 1;
        height: calc(100% - 32px);
      }
    }
  }
}
.dialog-footer {
  margin-top: 5px;
  display: flex;
  justify-content: space-between;
}

.dialog-footer-right {
  display: flex;
  justify-content: flex-end;
}
</style>
