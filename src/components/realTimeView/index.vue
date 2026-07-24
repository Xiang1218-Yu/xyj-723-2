<template>
  <div class="RealTimeView">
    <el-dialog v-model="datas.show" width="414px" top="8vh">
      <!-- 状态栏 -->
      <img src="@/assets/images/phoneTop.png" style="width: 375px; display: block" />

      <!-- F16 改造：由外部 iframe 预览改为内置本地渲染，直接复用全局注册的组件本地渲染，
           不再依赖外部 https 站点，预览更快且离线可用 -->
      <div class="screen" ref="screen">
        <!-- 头部导航 -->
        <headerTop :pageSetup="localPageSetup" />

        <!-- 主体内容，背景样式与编辑区保持一致 -->
        <section class="preview-container" :style="containerStyle">
          <!-- 动态渲染所有页面组件（只读预览，不显示删除标签） -->
          <component
            :is="item.component"
            v-for="(item, index) in localComponents"
            :key="index"
            :datas="item.setStyle"
            :data-type="item.type"
          />
        </section>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'RealTimeView',
  props: {
    datas: {
      // 是否显示预览
      type: Object,
      default: () => ({ show: false }),
    },
    // val 中的 templateJson / component 为字符串，需解析后本地渲染
    val: Object,
  },
  setup(props) {
    // 预览容器引用
    const screen = ref(null)

    /**
     * F16：解析页面设置(字符串 JSON)，解析失败时兜底为空对象，避免预览崩溃
     */
    const localPageSetup = computed(() => {
      try {
        return props.val && props.val.templateJson
          ? JSON.parse(props.val.templateJson)
          : {}
      } catch (e) {
        console.error('预览-页面设置解析失败', e)
        return {}
      }
    })

    /**
     * F16：解析页面组件列表(字符串 JSON)，过滤占位提示组件(placementarea)
     */
    const localComponents = computed(() => {
      try {
        const list =
          props.val && props.val.component ? JSON.parse(props.val.component) : []
        // 过滤拖拽占位提示组件，预览中不需要展示
        return Array.isArray(list)
          ? list.filter((it) => it.component && it.component !== 'placementarea')
          : []
      } catch (e) {
        console.error('预览-组件列表解析失败', e)
        return []
      }
    })

    /**
     * F16：与编辑区一致的背景样式(纯色/渐变/图片)，保证预览所见即所得
     */
    const containerStyle = computed(() => {
      const p = localPageSetup.value || {}
      const style = { padding: (p.pageMargin || 0) + 'px' }
      if (p.bgType === 'gradient') {
        style.backgroundImage = `linear-gradient(${p.gradientAngle || 180}deg, ${
          p.gradientStart
        }, ${p.gradientEnd})`
      } else if (p.bgType === 'image' && p.bgImg) {
        style.backgroundImage = `url(${p.bgImg})`
        if (p.bgRepeat === 'repeat') {
          style.backgroundRepeat = 'repeat'
          style.backgroundSize = 'auto'
        } else {
          style.backgroundRepeat = 'no-repeat'
          style.backgroundSize = 'cover'
        }
        style.backgroundColor = p.bgColor
      } else {
        style.backgroundColor = p.bgColor
      }
      return style
    })

    return {
      screen,
      localPageSetup,
      localComponents,
      containerStyle,
    }
  },
}
</script>

<style lang="less" scoped>
.RealTimeView {
  .screen {
    width: 375px;
    height: 667px;
    overflow-y: auto;
    background: #fff;

    // 隐藏滚动条
    &::-webkit-scrollbar {
      display: none; /* Chrome Safari */
    }

    /* 预览主体，最小高度撑满可视区 */
    .preview-container {
      min-height: 603px;
      box-sizing: border-box;
      position: relative;
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
  }
}
</style>
