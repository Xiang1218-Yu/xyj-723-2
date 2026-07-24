<template>
  <div class="richtextstyle">
    <h2>{{ datas.text }}</h2>

    <el-form label-width="80px" :model="datas" :rules="rules" ref="form" size="small">
      <el-form-item label="背景颜色">
        <el-color-picker
          v-model="datas.backColor"
          show-alpha
          :predefine="predefineColors"
        />
      </el-form-item>

      <el-form-item label="默认字号" prop="fontSize">
        <el-input-number
          v-model.number="datas.fontSize"
          :min="10"
          :max="48"
          :step="1"
          controls-position="right"
        />
        <span class="unit">px</span>
      </el-form-item>

      <el-form-item label="默认行高" prop="lineHeight">
        <el-select v-model.number="datas.lineHeight" style="width: 140px">
          <el-option
            v-for="opt in lineHeightOptions"
            :key="opt"
            :label="opt + ''"
            :value="opt"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="默认缩进" prop="indent">
        <el-input-number
          v-model.number="datas.indent"
          :min="0"
          :max="60"
          :step="2"
          controls-position="right"
        />
        <span class="unit">px</span>
      </el-form-item>
    </el-form>

    <div class="edit">
      <editor
        v-model="datas.myValue"
        :init="editorInit"
        @onInit="onEditorInit"
      />
    </div>
  </div>
</template>

<script>
import { uploadCOS } from '@/utils/upload'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/themes/silver'
import 'tinymce/skins/ui/oxide/skin.min.css'
import 'tinymce/skins/content/default/content.min.css'
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
import 'tinymce/plugins/textcolor'
import 'tinymce/plugins/colorpicker'
import 'tinymce/plugins/textpattern'
import 'tinymce/plugins/nonbreaking'
import 'tinymce/plugins/template'

export default {
  name: 'richtextstyle',
  components: { Editor },
  props: { datas: Object },
  data() {
    const num = (min, max, label) => (rule, value, cb) => {
      if (value === '' || value == null) return cb(new Error(`请输入${label}`))
      if (typeof value !== 'number' || isNaN(value))
        return cb(new Error(`${label}必须为数字`))
      if (value < min || value > max)
        return cb(new Error(`${label}范围 ${min}-${max}`))
      cb()
    }
    return {
      editorInstance: null,
      lineHeightOptions: [1, 1.2, 1.4, 1.5, 1.6, 1.8, 2, 2.5, 3],
      rules: {
        fontSize: [{ validator: num(10, 48, '字号'), trigger: 'blur' }],
        lineHeight: [{ validator: num(1, 3, '行高'), trigger: 'change' }],
        indent: [{ validator: num(0, 60, '缩进'), trigger: 'blur' }],
      },
      predefineColors: [
        '#ff4500', '#ff8c00', '#ffd700', '#90ee90', '#00ced1',
        '#1e90ff', '#c71585', '#409EFF', '#909399', '#C0C4CC',
      ],
    }
  },
  computed: {
    editorInit() {
      const fs = this.datas.fontSize || 14
      const lh = this.datas.lineHeight || 1.6
      const ind = this.datas.indent || 0
      return {
        height: 500,
        language_url: '/langs/zh_CN.js',
        language: 'zh_CN',
        menubar: false,
        branding: false,
        plugins:
          'advlist anchor autosave code directionality fullscreen hr image ' +
          'insertdatetime link lists nonbreaking pagebreak paste preview print ' +
          'save searchreplace table template textcolor textpattern toc wordcount charmap',
        // 三行工具栏，字号/行高/缩进全部可见
        toolbar: [
          'undo redo | styleselect | fontselect fontsizeselect | lineheight | bold italic underline strikethrough | forecolor backcolor',
          'alignleft aligncenter alignright alignjustify | outdent indent | bullist numlist | subscript superscript hr',
          'image link table charmap insertdatetime | anchor restoredraft pagebreak | ltr rtl | searchreplace preview fullscreen code',
        ],
        fontsize_formats:
          '10px 12px 14px 16px 18px 20px 24px 28px 32px 36px 48px',
        font_formats:
          '微软雅黑=Microsoft YaHei;宋体=SimSun;黑体=SimHei;楷体=KaiTi;Arial=arial;Helvetica=helvetica;Times New Roman=times new roman;',
        indentation: '20px',
        content_style: `body{font-size:${fs}px;line-height:${lh};text-indent:${ind}px;font-family:-apple-system,"Microsoft YaHei",sans-serif;color:#333;padding:10px;}p{margin:0 0 8px;}`,
        images_upload_handler: (blobInfo, succFun, failFun) => {
          uploadCOS(blobInfo.blob()).then(
            (res) => succFun(res),
            (err) => failFun('上传失败：' + err)
          )
        },
        setup: (editor) => {
          this.editorInstance = editor
          // 注册行高下拉按钮（使用文本按钮，避免图标缺失）
          editor.ui.registry.addMenuButton('lineheight', {
            text: '行高',
            tooltip: '设置行高',
            fetch: (callback) => {
              const opts = [1, 1.2, 1.4, 1.5, 1.6, 1.8, 2, 2.5, 3]
              const items = opts.map((v) => ({
                type: 'togglemenuitem',
                text: String(v),
                active: false,
                onAction: () => {
                  // 对选中块级元素设置行高
                  editor.formatter.register('lh' + v * 10, {
                    selector: 'p,h1,h2,h3,h4,h5,h6,div,li',
                    styles: { 'line-height': String(v) },
                  })
                  editor.formatter.apply('lh' + v * 10)
                },
              }))
              callback(items)
            },
          })
          editor.on('init', () => {
            this.applyBodyStyles()
          })
        },
      }
    },
  },
  methods: {
    onEditorInit(e, editor) {
      this.editorInstance = editor
      this.applyBodyStyles()
    },
    applyBodyStyles() {
      if (!this.editorInstance) return
      const fs = this.datas.fontSize || 14
      const lh = this.datas.lineHeight || 1.6
      const ind = this.datas.indent || 0
      const body = this.editorInstance.getBody()
      if (body) {
        this.editorInstance.dom.setStyle(body, 'fontSize', fs + 'px')
        this.editorInstance.dom.setStyle(body, 'lineHeight', lh)
        this.editorInstance.dom.setStyle(body, 'textIndent', ind + 'px')
      }
    },
  },
  watch: {
    'datas.fontSize'() {
      this.applyBodyStyles()
    },
    'datas.lineHeight'() {
      this.applyBodyStyles()
    },
    'datas.indent'() {
      this.applyBodyStyles()
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
  h2 {
    padding: 24px 16px 24px 0;
    margin-bottom: 15px;
    border-bottom: 1px solid #f2f4f6;
    font-size: 18px;
    font-weight: 600;
    color: #323233;
  }
  .unit {
    margin-left: 8px;
    color: #969799;
    font-size: 12px;
  }
  .edit {
    margin-top: 10px;
  }
}
</style>
