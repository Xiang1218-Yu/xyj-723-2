<template>
  <el-dialog
    :model-value="datas.show"
    @close="close"
    width="400px"
    :show-close="true"
    append-to-body
    class="preview-dialog"
  >
    <!-- #16 内置本地预览：直接渲染组件，不再依赖外部iframe -->
    <div class="preview-phone">
      <div class="preview-phone-inner" ref="previewEl">
        <!-- 状态栏 -->
        <img src="@/assets/images/phoneTop.png" alt="" class="status-bar" />
        <!-- 头部 -->
        <div
          class="preview-header"
          :style="{
            height: pageSetup.titleHeight + 'px',
            color: pageSetup.titleColor || '#333',
            background: '#fff',
          }"
        >
          <van-icon v-if="pageSetup.isBack" name="arrow-left" class="back-icon" />
          <span class="header-title">{{ pageSetup.name }}</span>
          <span v-if="pageSetup.isPerson" class="person-text">个人中心</span>
        </div>
        <!-- 主体 -->
        <div class="preview-body" :style="bodyStyle">
          <component
            v-for="(comp, idx) in components"
            :key="idx"
            :is="comp.component"
            :datas="comp.setStyle"
          />
        </div>
      </div>
    </div>
    <!-- 底部操作：导出HTML/PNG -->
    <div class="preview-actions">
      <el-button size="small" @click="exportHTML">导出HTML</el-button>
      <el-button size="small" type="warning" @click="exportPNG">导出PNG</el-button>
    </div>
  </el-dialog>
</template>

<script>
import FileSaver from 'file-saver'
import headerTop from '@/components/headerTop/index.vue'
// 动态导入所有组件
import richtext from '@/components/componentscom/richtext/index.vue'
import captiontext from '@/components/componentscom/captiontext/index.vue'
import listswitching from '@/components/componentscom/listswitching/index.vue'
import pictureads from '@/components/componentscom/pictureads/index.vue'
import graphicnavigation from '@/components/componentscom/graphicnavigation/index.vue'
import magiccube from '@/components/componentscom/magiccube/index.vue'
import auxiliarysegmentation from '@/components/componentscom/auxiliarysegmentation/index.vue'
import commoditysearch from '@/components/componentscom/commoditysearch/index.vue'
import storeinformation from '@/components/componentscom/storeinformation/index.vue'
import entertheshop from '@/components/componentscom/entertheshop/index.vue'
import notice from '@/components/componentscom/notice/index.vue'
import videoss from '@/components/componentscom/videoss/index.vue'
import communitypowder from '@/components/componentscom/communitypowder/index.vue'
import storenotecard from '@/components/componentscom/storenotecard/index.vue'
import investigate from '@/components/componentscom/investigate/index.vue'
import tabBar from '@/components/componentscom/tabBar/index.vue'
import follow from '@/components/componentscom/follow/index.vue'
import suspension from '@/components/componentscom/suspension/index.vue'
import custommodule from '@/components/componentscom/custommodule/index.vue'

export default {
  name: 'realTimeView',
  props: {
    datas: Object,
    val: Object,
  },
  components: {
    headerTop,
    richtext,
    captiontext,
    listswitching,
    pictureads,
    graphicnavigation,
    magiccube,
    auxiliarysegmentation,
    commoditysearch,
    storeinformation,
    entertheshop,
    notice,
    videoss,
    communitypowder,
    storenotecard,
    investigate,
    tabBar,
    follow,
    suspension,
    custommodule,
  },
  computed: {
    // #16 解析页面设置
    pageSetup() {
      try {
        return typeof this.val.templateJson === 'string'
          ? JSON.parse(this.val.templateJson)
          : this.val.templateJson
      } catch (e) {
        return {}
      }
    },
    // #16 解析组件列表
    components() {
      try {
        return typeof this.val.component === 'string'
          ? JSON.parse(this.val.component)
          : this.val.component
      } catch (e) {
        return []
      }
    },
    // #16 主体样式（支持渐变/背景）
    bodyStyle() {
      const ps = this.pageSetup || {}
      const style = {
        'background-color': ps.bgColor,
        padding: (ps.outerMargin || 0) + 'px',
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
    // #16 导出HTML
    exportHTML() {
      const el = this.$refs.previewEl
      if (!el) return
      const html = `<!DOCTYPE html>
<html lang="zh-CN"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${this.pageSetup.name || '页面'}</title>
<style>
body{margin:0;padding:20px;background:#f5f5f5;font-family:-apple-system,sans-serif;}
.preview-phone-inner{max-width:375px;margin:0 auto;background:#fff;box-shadow:0 0 20px rgba(0,0,0,0.1);}
img{max-width:100%;}
</style></head><body>${el.outerHTML}</body></html>`
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
      FileSaver.saveAs(blob, `${this.pageSetup.name || 'page'}.html`)
    },
    // #16 导出PNG
    async exportPNG() {
      const el = this.$refs.previewEl
      if (!el) return
      try {
        const html2canvas = (await import('html2canvas')).default
        const canvas = await html2canvas(el, {
          useCORS: true,
          scale: 2,
          backgroundColor: '#ffffff',
        })
        canvas.toBlob((blob) => {
          if (blob)
            FileSaver.saveAs(blob, `${this.pageSetup.name || 'page'}.png`)
        })
      } catch (e) {
        // 静默失败
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
.preview-actions {
  text-align: center;
  margin-top: 15px;
}
</style>
