<template>
  <el-dialog
    :model-value="datas.show"
    @close="close"
    width="420px"
    :show-close="true"
    append-to-body
    class="preview-dialog"
    title="页面预览"
  >
    <div class="preview-phone">
      <div class="preview-phone-inner" ref="previewEl">
        <img src="@/assets/images/phoneTop.png" alt="" class="status-bar" />
        <div
          class="preview-header"
          :style="{
            height: (pageSetup.titleHeight || 35) + 'px',
            color: pageSetup.titleColor || '#333',
            background: '#fff',
          }"
        >
          <van-icon v-if="pageSetup.isBack" name="arrow-left" class="back-icon" />
          <span class="header-title">{{ pageSetup.name || '页面标题' }}</span>
          <span v-if="pageSetup.isPerson" class="person-text">个人中心</span>
        </div>
        <div class="preview-body" :style="bodyStyle">
          <component
            v-for="(comp, idx) in migratedComponents"
            :key="idx"
            :is="comp.component"
            :datas="comp.setStyle"
          />
        </div>
      </div>
    </div>
    <template #footer>
      <el-button size="small" @click="exportHTML">导出HTML</el-button>
      <el-button size="small" type="warning" @click="exportPNG">导出PNG</el-button>
      <el-button size="small" @click="close">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script>
import FileSaver from 'file-saver'
import { ElMessage } from 'element-plus'
import componentProperties from '@/utils/componentProperties'
import utils from 'utils/index'

export default {
  name: 'realTimeView',
  props: {
    datas: Object,
    val: Object,
  },
  computed: {
    pageSetup() {
      try {
        const ps =
          typeof this.val.templateJson === 'string'
            ? JSON.parse(this.val.templateJson)
            : this.val.templateJson
        // 补全缺失字段
        return {
          name: '页面标题',
          titleHeight: 35,
          titleColor: '#333',
          isBack: true,
          isPerson: false,
          bgColor: 'rgba(249,249,249,1)',
          gradientBg: false,
          gradientStart: '#155bd4',
          gradientEnd: '#07c160',
          gradientAngle: 180,
          bgImg: '',
          bgSize: 'auto',
          outerMargin: 0,
          ...ps,
        }
      } catch (e) {
        return {}
      }
    },
    rawComponents() {
      try {
        return typeof this.val.component === 'string'
          ? JSON.parse(this.val.component)
          : this.val.component || []
      } catch (e) {
        return []
      }
    },
    // 对组件数据做字段迁移，确保预览时所有新字段都有默认值
    migratedComponents() {
      return (this.rawComponents || []).map((comp) => {
        const def = componentProperties.get(comp.component)
        if (def && def.setStyle) {
          comp.setStyle = utils.assiginObj(
            JSON.parse(JSON.stringify(def.setStyle)),
            comp.setStyle || {}
          )
        }
        return comp
      })
    },
    bodyStyle() {
      const ps = this.pageSetup || {}
      const style = {
        'background-color': ps.bgColor,
        padding: (ps.outerMargin || 0) + 'px',
        'box-sizing': 'border-box',
      }
      if (ps.gradientBg) {
        style.backgroundImage = `linear-gradient(${ps.gradientAngle || 180}deg, ${ps.gradientStart}, ${ps.gradientEnd})`
      } else if (ps.bgImg) {
        style.backgroundImage = 'url(' + ps.bgImg + ')'
        style.backgroundRepeat = ps.bgSize === 'repeat' ? 'repeat' : 'no-repeat'
        style.backgroundSize =
          ps.bgSize === 'cover'
            ? 'cover'
            : ps.bgSize === 'contain'
            ? 'contain'
            : '100% 100%'
      }
      return style
    },
  },
  methods: {
    close() {
      this.datas.show = false
    },
    // 收集页面样式并导出独立HTML
    exportHTML() {
      const el = this.$refs.previewEl
      if (!el) return
      const clone = el.cloneNode(true)
      let collectedStyles = ''
      try {
        for (const sheet of document.styleSheets) {
          try {
            const rules = sheet.cssRules || sheet.rules
            for (const rule of rules) {
              collectedStyles += rule.cssText + '\n'
            }
          } catch (e) {
            // 跨域样式表跳过
          }
        }
      } catch (e) {
        // 样式收集失败时静默
      }
      const title = this.pageSetup.name || '页面'
      const html = `<!DOCTYPE html>
<html lang="zh-CN"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${title}</title>
<style>
*{box-sizing:border-box;}
body{margin:0;padding:20px;background:#f5f5f5;font-family:-apple-system,"Microsoft YaHei",sans-serif;}
.preview-phone-inner{max-width:375px;margin:0 auto;background:#fff;box-shadow:0 0 20px rgba(0,0,0,0.1);border-radius:20px;overflow:hidden;}
.preview-phone-inner img{max-width:100%;display:block;}
${collectedStyles}
</style></head><body>${clone.outerHTML}</body></html>`
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
      FileSaver.saveAs(blob, `${title}.html`)
      ElMessage.success('HTML导出成功')
    },
    // 使用 html2canvas 导出 PNG
    async exportPNG() {
      const el = this.$refs.previewEl
      if (!el) return
      const loading = ElMessage({ message: '正在生成截图...', duration: 0 })
      try {
        const html2canvas = (await import('html2canvas')).default
        const canvas = await html2canvas(el, {
          useCORS: true,
          allowTaint: true,
          scale: 2,
          backgroundColor: '#ffffff',
          logging: false,
        })
        canvas.toBlob((blob) => {
          if (blob) {
            FileSaver.saveAs(blob, `${this.pageSetup.name || 'page'}.png`)
            loading.close()
            ElMessage.success('PNG导出成功')
          } else {
            loading.close()
            ElMessage.error('截图生成失败')
          }
        })
      } catch (e) {
        loading.close()
        ElMessage.error('导出失败：' + (e.message || '未知错误'))
      }
    },
  },
}
</script>

<style scoped lang="less">
.preview-phone {
  display: flex;
  justify-content: center;
  .preview-phone-inner {
    width: 375px;
    max-width: 100%;
    background: #fff;
    border: 1px solid #eee;
    border-radius: 20px;
    overflow: hidden;
    position: relative;
  }
  .status-bar {
    width: 100%;
    display: block;
  }
  .preview-header {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    border-bottom: 1px solid #f7f8fa;
    .back-icon {
      position: absolute;
      left: 18px;
    }
    .header-title {
      font-size: 14px;
    }
    .person-text {
      position: absolute;
      right: 18px;
      font-size: 12px;
    }
  }
  .preview-body {
    min-height: 400px;
    padding-bottom: 50px;
    box-sizing: border-box;
  }
}
</style>
