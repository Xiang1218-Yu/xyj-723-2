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

      <!-- F1 新增：整体文字大小（作用于编辑器正文与预览区，独立于局部选中字号） -->
      <el-form-item label="文字大小">
        <el-select v-model="datas.fontSize" placeholder="请选择文字大小">
          <el-option
            v-for="size in fontSizeOptions"
            :key="size"
            :label="size + 'px'"
            :value="size"
          />
        </el-select>
      </el-form-item>

      <!-- F1 新增：整体行高（内置 + 自定义，与编辑器行高工具栏联动） -->
      <el-form-item label="行高">
        <div class="lineheight-row">
          <el-select v-model="datas.lineHeight" placeholder="请选择行高">
            <el-option
              v-for="(lh, idx) in allLineHeights"
              :key="'lh-' + idx + '-' + lh.value"
              :label="lh.name"
              :value="lh.value"
            />
          </el-select>
          <!-- 打开自定义行高设置面板 -->
          <el-button class="lineheight-add" type="primary" plain @click="openLineHeightDialog">
            自定义
          </el-button>
        </div>
      </el-form-item>

      <!-- F1 新增：已保存的自定义行高列表（点击可快速切换应用，当前项高亮） -->
      <el-form-item
        label="自定义行高"
        v-if="datas.customLineHeights && datas.customLineHeights.length"
      >
        <div class="custom-lh-list">
          <el-tag
            v-for="(lh, idx) in datas.customLineHeights"
            :key="'custom-' + idx"
            closable
            :effect="datas.lineHeight === lh.value ? 'dark' : 'plain'"
            class="custom-lh-tag"
            @click="applyLineHeight(lh.value)"
            @close="removeCustomLineHeight(idx)"
          >
            {{ lh.name }}（{{ lh.value }}）
          </el-tag>
        </div>
      </el-form-item>
    </el-form>

    <div class="edit">
      <!-- F1：编辑器；自定义行高保存后通过 syncEditorLineHeights 动态注入行高工具栏，
           不重挂组件（重挂会与 TinyMCE 自管理 DOM 冲突导致报错） -->
      <editor v-model="datas.myValue" :init="init" />
    </div>

    <!-- F1 新增：自定义行高设置对话框 -->
    <el-dialog
      v-model="lineHeightDialog.show"
      title="自定义行高"
      width="340px"
      append-to-body
    >
      <el-form label-width="80px">
        <el-form-item label="名称">
          <el-input
            v-model="lineHeightDialog.name"
            maxlength="10"
            show-word-limit
            placeholder="如：宽松"
          />
        </el-form-item>
        <el-form-item label="行高值">
          <el-input-number
            v-model="lineHeightDialog.value"
            :min="0.5"
            :max="5"
            :step="0.1"
            :precision="2"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="lineHeightDialog.show = false">取消</el-button>
        <el-button type="primary" @click="saveCustomLineHeight">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { uploadCOS } from '@/utils/upload'
import { ElMessage } from 'element-plus'

import Editor from '@tinymce/tinymce-vue'
// 先导入 TinyMCE 核心，核心中已内置行高(lineheight)按钮与命令；
// 模块打包模式下必须显式导入核心，否则核心按钮(如 lineheight)注册缺失，
// 表现为工具栏按钮可见但点击无反应。TinyMCE5.x 无独立 lineheight 插件。
import 'tinymce/tinymce'
import 'tinymce/themes/silver'
import 'tinymce/icons/default' // 图标包，保证工具栏图标(含行高)正常显示
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
      // F1：TinyMCE 基础配置（与字号/行高相关的 fontsize_formats/lineheight_formats/content_style
      // 由 computed init 动态合入，实现面板与编辑器工具栏联动）
      baseInit: {
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
      // F1：整体字号/行高内置可选项（集中配置，便于扩展）
      fontSizeOptions: [12, 14, 16, 18, 20, 24, 28, 36],
      // 内置行高（value 为行高倍数，name 为显示名）
      baseLineHeights: [
        { name: '1 倍', value: 1 },
        { name: '1.2 倍', value: 1.2 },
        { name: '1.4 倍', value: 1.4 },
        { name: '1.6 倍', value: 1.6 },
        { name: '1.8 倍', value: 1.8 },
        { name: '2.0 倍', value: 2.0 },
        { name: '2.5 倍', value: 2.5 },
      ],
      // F1：当前 TinyMCE 编辑器实例引用
      editorInstance: null,
      // F1：自定义行高对话框状态
      lineHeightDialog: {
        show: false,
        name: '',
        value: 1.5,
      },
    }
  },
  computed: {
    // F1：合并内置 + 自定义行高，供面板下拉与编辑器工具栏共用（联动核心）
    // 按 value 去重：el-select 以 value 匹配选中项，若多项 value 相同会同时高亮/显示错乱，
    // 故同值只保留第一项（内置优先），保证下拉选中唯一、切换生效。
    allLineHeights() {
      const custom = (this.datas.customLineHeights || []).map((lh) => ({
        name: lh.name,
        value: lh.value,
      }))
      const merged = [...this.baseLineHeights, ...custom]
      const seen = new Set()
      return merged.filter((lh) => {
        if (seen.has(lh.value)) return false
        seen.add(lh.value)
        return true
      })
    },
    // F1：动态组装 TinyMCE 配置——字号/行高格式与正文样式均来自共享选项，实现联动
    init() {
      // 行高工具栏格式：把倍数转成 TinyMCE 可识别的字符串（去重）
      const lhValues = [...new Set(this.allLineHeights.map((lh) => lh.value))]
      return {
        ...this.baseInit,
        // 字号工具栏可选项（与面板字号选项联动）
        fontsize_formats: this.fontSizeOptions.map((s) => s + 'px').join(' '),
        // 行高工具栏可选项（内置 + 自定义，与面板行高下拉联动）
        lineheight_formats: lhValues.join(' '),
        // 编辑器正文初始整体字号/行高
        content_style: `body{font-size:${this.datas.fontSize || 14}px;line-height:${
          this.datas.lineHeight || 1.6
        };}`,
        // 缓存编辑器实例，供后续动态更新整体字号/行高
        setup: (editor) => {
          this.editorInstance = editor
        },
      }
    },
  },
  watch: {
    // 监听富文本内容变化，超长时用 ElMessage 提示并截断
    'datas.myValue'(val) {
      if (val && val.length > this.maxLength) {
        ElMessage.warning(`富文本内容长度不能超过 ${this.maxLength} 个字符，已自动截断`)
        this.datas.myValue = val.slice(0, this.maxLength)
      }
    },
    // F1：整体字号/行高变化时，同步更新编辑器正文样式（预览区通过 props 响应式已自动更新）
    'datas.fontSize'() {
      this.applyEditorBodyStyle()
    },
    'datas.lineHeight'() {
      this.applyEditorBodyStyle()
    },
  },
  methods: {
    // F1：将整体字号/行高实时应用到已初始化编辑器的正文 body
    applyEditorBodyStyle() {
      const editor = this.editorInstance
      if (!editor || !editor.getBody) return
      const body = editor.getBody()
      if (!body) return
      body.style.fontSize = (this.datas.fontSize || 14) + 'px'
      body.style.lineHeight = this.datas.lineHeight || 1.6
    },
    // F1：打开自定义行高设置面板（重置输入）
    openLineHeightDialog() {
      this.lineHeightDialog.name = ''
      this.lineHeightDialog.value = 1.5
      this.lineHeightDialog.show = true
    },
    // F1：保存自定义行高——校验后写入 customLineHeights，联动更新下拉与编辑器工具栏
    saveCustomLineHeight() {
      const name = (this.lineHeightDialog.name || '').trim()
      const value = Number(this.lineHeightDialog.value)
      // 名称与数值校验
      if (!name) {
        ElMessage.warning('请输入行高名称')
        return
      }
      if (!value || value < 0.5 || value > 5) {
        ElMessage.warning('行高值需在 0.5 - 5 之间')
        return
      }
      if (!Array.isArray(this.datas.customLineHeights)) {
        this.datas.customLineHeights = []
      }
      // 名称去重，避免下拉出现同名项
      if (
        this.datas.customLineHeights.some((lh) => lh.name === name) ||
        this.baseLineHeights.some((lh) => lh.name === name)
      ) {
        ElMessage.warning('该行高名称已存在')
        return
      }
      // 数值去重：el-select 以 value 匹配，相同数值会导致选中错乱，禁止重复
      if (
        this.datas.customLineHeights.some((lh) => lh.value === value) ||
        this.baseLineHeights.some((lh) => lh.value === value)
      ) {
        ElMessage.warning('该行高值已存在，请使用不同的数值')
        return
      }
      this.datas.customLineHeights.push({ name, value })
      // 保存后立即应用为当前行高（联动编辑器正文与预览区）
      this.applyLineHeight(value)
      this.lineHeightDialog.show = false
      ElMessage.success('已保存并应用自定义行高')
    },
    // F1：应用指定行高——用于自定义行高标签的快速切换，联动下拉/编辑器/预览
    applyLineHeight(value) {
      this.datas.lineHeight = value
      this.applyEditorBodyStyle()
      this.syncEditorLineHeights()
    },
    // F1：删除自定义行高
    removeCustomLineHeight(index) {
      // 若删除的正是当前应用的行高，回退到默认行高，避免下拉显示空值
      const removed = this.datas.customLineHeights[index]
      this.datas.customLineHeights.splice(index, 1)
      if (removed && this.datas.lineHeight === removed.value) {
        this.datas.lineHeight = 1.6
        this.applyEditorBodyStyle()
      }
      // 同步移除编辑器行高工具栏中的对应格式
      this.syncEditorLineHeights()
    },
    // F1：将合并后的行高列表动态写入当前编辑器的 lineheight 工具栏配置，实现联动
    syncEditorLineHeights() {
      const editor = this.editorInstance
      if (!editor) return
      const lhValues = [...new Set(this.allLineHeights.map((lh) => lh.value))]
      // 更新编辑器设置，使行高下拉纳入自定义项（TinyMCE5 支持运行时读取该设置）
      editor.settings.lineheight_formats = lhValues.join(' ')
      if (editor.options && typeof editor.options.set === 'function') {
        // 兼容以 options API 读取配置的版本
        editor.options.set('lineheight_formats', lhValues.join(' '))
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
  /* F1：行高选择行（下拉 + 自定义按钮） */
  .lineheight-row {
    display: flex;
    align-items: center;
    width: 100%;
    .el-select {
      flex: 1;
    }
    .lineheight-add {
      margin-left: 8px;
      flex: none;
    }
  }
  /* F1：自定义行高标签列表 */
  .custom-lh-list {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    /* F1：标签可点击快速切换行高 */
    .custom-lh-tag {
      cursor: pointer;
    }
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
