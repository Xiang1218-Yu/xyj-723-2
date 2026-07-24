<template>
  <div class="richtextstyle">
    <!-- 标题 -->
    <h2>{{ datas.text }}</h2>

    <el-form label-width="80px" :model="datas">
      <!-- 背景颜色 -->
      <el-form-item label="背景颜色">
        <!-- 背景颜色 -->
        <el-color-picker
          v-model="datas.backColor"
          show-alpha
          style="float: right"
          class="picke"
          :predefine="predefineColors"
        >
        </el-color-picker>
      </el-form-item>
    </el-form>

    <div class="edit">
      <editor v-model="datas.myValue" :init="init" />
    </div>
  </div>
</template>

<script>
import { uploadCOS } from '@/utils/upload'
import { ElMessage } from 'element-plus'

import Editor from '@tinymce/tinymce-vue'
import 'tinymce/themes/silver'
import 'tinymce/skins/ui/oxide/skin.min.css'
import 'tinymce/plugins/image'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/anchor'
import 'tinymce/plugins/autosave'
import 'tinymce/plugins/code'
import 'tinymce/plugins/paste'
import 'tinymce/plugins/directionality'
import 'tinymce/plugins/link'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/hr'
import 'tinymce/plugins/insertdatetime'
import 'tinymce/plugins/pagebreak'
import 'tinymce/plugins/preview'
import 'tinymce/plugins/print'
import 'tinymce/plugins/save'
import 'tinymce/plugins/searchreplace'
import 'tinymce/plugins/table'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/toc'
import 'tinymce/plugins/charmap'

export default {
  name: 'richtextstyle',
  props: {
    datas: Object,
  },
  components: {
    Editor,
  },
  data() {
    return {
      init: {
        height: 550,
        language_url: '/langs/zh_CN.js',
        language: 'zh_CN',
        plugins: [
          'charmap',
          'toc',
          'wordcount',
          'table',
          'searchreplace',
          'image',
          'link',
          'lists',
          'advlist',
          'anchor',
          'autosave',
          'code',
          'paste',
          'directionality',
          'fullscreen',
          'hr',
          'insertdatetime',
          'pagebreak',
          'preview',
          'print',
          'save',
        ],
        image_advtab: true,
        // 字号可选项（TinyMCE5 通过 fontsize_formats 配合 fontsizeselect 使用）
        fontsize_formats: '12px 14px 16px 18px 24px 36px 48px',
        // 行高可选项（TinyMCE5.5+ 通过 lineheight_formats 配合 lineheight 按钮使用）
        lineheight_formats: '1 1.2 1.4 1.6 1.8 2.0',
        toolbar: [
          `fullscreen code bold italic underline strikethrough alignleft aligncenter alignright alignjustify 
          outdent indent image link removeformat cut copy paste ltr rtl anchor restoredraft pagebreak save 
          table tabledelete tableprops tablerowprops tablecellprops tableinsertrowbefore tableinsertrowafter tabledeleterow tableinsertcolbefore tableinsertcolafter tabledeletecol 
          backcolor formatselect fontselect fontsizeselect forecolor lineheight 
          subscript superscript hr preview print searchreplace wordcount toc charmap bullist numlist insertdatetime undo redo`,
        ],
        theme: 'silver', //主题
        menubar: false,
        images_upload_handler: (blobInfo, succFun, failFun) => {
          // 腾讯云COS上传开始
          uploadCOS(blobInfo.blob()).then((res) => {
            succFun(res)
          })
          return
          //（如果要用api接口上传删除腾讯云COS上传这些代码）
          // 腾讯云COS上传结束

          var formData = new FormData()

          formData.append('path', 'test/')
          formData.append('file', blobInfo.blob(), blobInfo.blob().name)

          var xhr = new XMLHttpRequest()
          xhr.withCredentials = false
          xhr.open('POST', `${window.global_config.BASE_URL}upload/miniShop`)

          xhr.onload = function () {
            // 获取数据
            var res = JSON.parse(xhr.response)
            if (res.success != true) return failFun('HTTP Error: ' + res.msg)
            succFun(res.data.src)
          }
          xhr.send(formData)
        },
      },
      predefineColors: [
        // 颜色选择器预设
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585',
        '#409EFF',
        '#909399',
        '#C0C4CC',
        'rgba(255, 69, 0, 0.68)',
        'rgb(255, 120, 0)',
        'hsv(51, 100, 98)',
        'hsva(120, 40, 94, 0.5)',
        'hsl(181, 100%, 37%)',
        'hsla(209, 100%, 56%, 0.73)',
        '#c7158577',
      ],
      // 富文本内容最大长度限制，超出则提示并截断，避免数据异常
      maxLength: 20000,
    }
  },
  watch: {
    // 监听富文本内容变化，超长时用 ElMessage 提示并截断
    'datas.myValue'(val) {
      if (val && val.length > this.maxLength) {
        ElMessage.warning(`富文本内容长度不能超过 ${this.maxLength} 个字符，已自动截断`)
        this.datas.myValue = val.slice(0, this.maxLength)
      }
    },
  },
}
</script>

<style scoped lang="less">
.richtextstyle {
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  padding: 0 10px 20px;
  box-sizing: border-box;
  /* 标题 */
  h2 {
    padding: 24px 16px 24px 0;
    margin-bottom: 15px;
    border-bottom: 1px solid #f2f4f6;
    font-size: 18px;
    font-weight: 600;
    color: #323233;
  }
}

/* 修改富文本样式 */
:deep(.tox) {
  border: 1px solid #ebedf0 !important;
  .tox-tbtn {
    height: 25px !important;
    margin: 0 2px !important;
    width: auto;
    font-size: 13px;
  }
  .tox-tbtn--bespoke .tox-tbtn__select-label {
    width: auto !important;
  }
  .tox-toolbar__group {
    background: #f7f8fa;
  }
}

:deep(.tox) .tox-toolbar,
.tox .tox-toolbar__primary,
.tox .tox-toolbar__overflow {
  background: none !important;
}

:deep(.tox) .tox-tbtn--enabled,
.tox .tox-tbtn--enabled:hover {
  background: none !important;
  :deep(svg) {
    fill: #155bd4 !important;
  }
}
</style>
