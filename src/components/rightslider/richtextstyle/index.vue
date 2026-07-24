<template>
  <div class="richtextstyle">
    <!-- 标题 -->
    <h2>{{ datas.text }}</h2>

    <el-form label-width="80px" :model="datas" :rules="rules">
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

      <!-- 默认字号 (#1) -->
      <el-form-item label="默认字号" prop="fontSize">
        <el-input-number
          v-model.number="datas.fontSize"
          :min="10"
          :max="48"
          :step="1"
          controls-position="right"
        />
        <span style="margin-left: 8px; color: #969799; font-size: 12px">px</span>
      </el-form-item>

      <!-- 默认行高 (#1) -->
      <el-form-item label="默认行高" prop="lineHeight">
        <el-input-number
          v-model.number="datas.lineHeight"
          :min="1"
          :max="3"
          :step="0.1"
          controls-position="right"
        />
      </el-form-item>

      <!-- 默认缩进 (#1) -->
      <el-form-item label="默认缩进" prop="indent">
        <el-input-number
          v-model.number="datas.indent"
          :min="0"
          :max="60"
          :step="2"
          controls-position="right"
        />
        <span style="margin-left: 8px; color: #969799; font-size: 12px">px</span>
      </el-form-item>
    </el-form>

    <div class="edit">
      <editor v-model="datas.myValue" :init="init" />
    </div>
  </div>
</template>

<script>
import { uploadCOS } from '@/utils/upload'

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
// #1 引入缩进插件
import 'tinymce/plugins/indent'

export default {
  name: 'richtextstyle',
  props: {
    datas: Object,
  },
  components: {
    Editor,
  },
  data() {
    // #1 字号校验：必须为数字且在合法范围
    const validateFontSize = (rule, value, callback) => {
      if (value === '' || value === null || value === undefined) {
        return callback(new Error('请输入字号'))
      }
      if (typeof value !== 'number' || isNaN(value)) {
        return callback(new Error('字号必须为数字'))
      }
      if (value < 10 || value > 48) {
        return callback(new Error('字号范围 10-48'))
      }
      callback()
    }
    // #1 行高校验：数字且范围
    const validateLineHeight = (rule, value, callback) => {
      if (value === '' || value === null || value === undefined) {
        return callback(new Error('请输入行高'))
      }
      if (typeof value !== 'number' || isNaN(value)) {
        return callback(new Error('行高必须为数字'))
      }
      if (value < 1 || value > 3) {
        return callback(new Error('行高范围 1-3'))
      }
      callback()
    }
    // #1 缩进校验：非负整数
    const validateIndent = (rule, value, callback) => {
      if (value === '' || value === null || value === undefined) {
        return callback(new Error('请输入缩进值'))
      }
      if (typeof value !== 'number' || isNaN(value) || value < 0) {
        return callback(new Error('缩进必须为非负数字'))
      }
      callback()
    }
    return {
      // #1 表单校验规则（长度校验与格式校验）
      rules: {
        fontSize: [{ validator: validateFontSize, trigger: 'blur' }],
        lineHeight: [{ validator: validateLineHeight, trigger: 'blur' }],
        indent: [{ validator: validateIndent, trigger: 'blur' }],
      },
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
          'indent',
        ],
        image_advtab: true,
        // #1 字号选项补全
        fontsize_formats: '10px 12px 14px 16px 18px 20px 24px 28px 32px 36px 48px',
        // #1 缩进单位使用像素
        indentation: '20px',
        // #1 行高通过 content_style 注入默认样式
        content_style:
          'body { font-size: 14px; line-height: 1.6; text-indent: 0; } p { margin: 0 0 8px; }',
        toolbar: [
          `fullscreen code bold italic underline strikethrough alignleft aligncenter alignright alignjustify 
          outdent indent image link removeformat cut copy paste ltr rtl anchor restoredraft pagebreak save 
          table tabledelete tableprops tablerowprops tablecellprops tableinsertrowbefore tableinsertrowafter tabledeleterow tableinsertcolbefore tableinsertcolafter tabledeletecol 
          backcolor formatselect fontselect fontsizeselect forecolor 
          subscript superscript hr preview print searchreplace wordcount toc charmap bullist numlist insertdatetime undo redo`,
        ],
        theme: 'silver', //主题
        menubar: false,
        // #1 编辑器初始化后应用数据配置（行高/缩进/字号）
        setup: (editor) => {
          editor.on('init', () => {
            this.applyEditorStyle(editor)
          })
        },
        images_upload_handler: (blobInfo, succFun, failFun) => {
          // 腾讯云COS上传开始
          uploadCOS(blobInfo.blob()).then((res) => {
            succFun(res)
          })
          return
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
    }
  },
  methods: {
    // #1 将数据中的字号/行高/缩进应用到编辑器 content_style
    applyEditorStyle(editor) {
      if (!editor || !this.datas) return
      const fs = this.datas.fontSize || 14
      const lh = this.datas.lineHeight || 1.6
      const ind = this.datas.indent || 0
      const css = `body { font-size: ${fs}px; line-height: ${lh}; text-indent: ${ind}px; } p { margin: 0 0 8px; }`
      editor.dom.setStyle(editor.getBody(), 'fontSize', fs + 'px')
      editor.dom.setStyle(editor.getBody(), 'lineHeight', lh)
      editor.dom.setStyle(editor.getBody(), 'textIndent', ind + 'px')
      // 更新 content_style 供后续初始化使用
      this.init.content_style = css
    },
  },
  watch: {
    // #1 监听数据变化实时应用样式
    'datas.fontSize'() {
      this.init.content_style = `body { font-size: ${this.datas.fontSize}px; line-height: ${this.datas.lineHeight}; text-indent: ${this.datas.indent}px; }`
    },
    'datas.lineHeight'() {
      this.init.content_style = `body { font-size: ${this.datas.fontSize}px; line-height: ${this.datas.lineHeight}; text-indent: ${this.datas.indent}px; }`
    },
    'datas.indent'() {
      this.init.content_style = `body { font-size: ${this.datas.fontSize}px; line-height: ${this.datas.lineHeight}; text-indent: ${this.datas.indent}px; }`
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
