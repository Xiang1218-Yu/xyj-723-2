<template>
  <div class="RealTimeView">
    <el-dialog v-model="datas.show" width="414px" top="8vh" :close-on-click-modal="false">
      <div class="preview-container">
        <!-- 手机状态栏 -->
        <img src="@/assets/images/phoneTop.png" style="width: 375px; display: block" />

        <!-- 加载状态 -->
        <div v-if="loading" class="loading-wrapper">
          <van-loading size="24px" vertical>加载中</van-loading>
        </div>

        <!-- 内置预览区域 -->
        <div v-show="!loading" class="preview-content">
          <!-- 头部导航 -->
          <headerTop :pageSetup="val.pageSetup" />

          <!-- 主体内容 -->
          <section
            class="preview-phone-container"
            :style="containerStyle"
          >
            <!-- 动态组件渲染 -->
            <component
              v-for="(element, index) in val.component"
              :key="index"
              :is="element.component"
              :datas="element.setStyle"
              class="preview-component"
            />
          </section>

          <!-- 底部 -->
          <phoneBottom />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ref, watch, computed } from 'vue'
import headerTop from '../headerTop/index.vue'
import phoneBottom from '../phoneBottom/index.vue'

// 导入所有组件
import follow from '../componentscom/follow/index.vue'
import storenotecard from '../componentscom/storenotecard/index.vue'
import captiontext from '../componentscom/captiontext/index.vue'
import pictureads from '../componentscom/pictureads/index.vue'
import graphicnavigation from '../componentscom/graphicnavigation/index.vue'
import richtext from '../componentscom/richtext/index.vue'
import magiccube from '../componentscom/magiccube/index.vue'
import auxiliarysegmentation from '../componentscom/auxiliarysegmentation/index.vue'
import commoditysearch from '../componentscom/commoditysearch/index.vue'
import storeinformation from '../componentscom/storeinformation/index.vue'
import entertheshop from '../componentscom/entertheshop/index.vue'
import notice from '../componentscom/notice/index.vue'
import videoss from '../componentscom/videoss/index.vue'
import custommodule from '../componentscom/custommodule/index.vue'
import communitypowder from '../componentscom/communitypowder/index.vue'
import crowdoperation from '../componentscom/crowdoperation/index.vue'
import personalizedrecommendation from '../componentscom/personalizedrecommendation/index.vue'
import onlineservice from '../componentscom/onlineservice/index.vue'
import investigate from '../componentscom/investigate/index.vue'
import tabBar from '../componentscom/tabBar/index.vue'
import suspension from '../componentscom/suspension/index.vue'
import listswitching from '../componentscom/listswitching/index.vue'

export default {
  name: 'RealTimeView',
  components: {
    headerTop,
    phoneBottom,
    follow,
    storenotecard,
    captiontext,
    pictureads,
    graphicnavigation,
    richtext,
    magiccube,
    auxiliarysegmentation,
    commoditysearch,
    storeinformation,
    entertheshop,
    notice,
    videoss,
    custommodule,
    communitypowder,
    crowdoperation,
    personalizedrecommendation,
    onlineservice,
    investigate,
    tabBar,
    suspension,
    listswitching,
  },
  props: {
    datas: {
      type: Object,
      default: () => ({ show: false }),
    },
    val: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    // 是否在加载中
    const loading = ref(true)

    // 计算容器样式
    const containerStyle = computed(() => {
      const ps = props.val.pageSetup || {}
      let style = {
        minHeight: '603px',
        boxSizing: 'border-box',
        width: '100%',
        position: 'relative',
        paddingTop: (ps.pageMarginTop || 0) + 'px',
        paddingBottom: (ps.pageMarginBottom || 0) + 'px',
        paddingLeft: (ps.pageMarginLeft || 0) + 'px',
        paddingRight: (ps.pageMarginRight || 0) + 'px',
      }

      if (ps.bgType === 'gradient') {
        style.background = `linear-gradient(${ps.gradientDirection || 'to bottom'}, ${ps.gradientStart || '#667eea'}, ${ps.gradientEnd || '#764ba2'})`
      } else if (ps.bgType === 'image' && ps.bgImg) {
        style.backgroundImage = 'url(' + ps.bgImg + ')'
        style.backgroundSize = ps.bgSize || 'cover'
        style.backgroundRepeat = ps.bgRepeat || 'no-repeat'
        style.backgroundColor = 'transparent'
      } else {
        style.backgroundColor = ps.bgColor || 'rgba(249, 249, 249, 10)'
        if (ps.bgImg) {
          style.backgroundImage = 'url(' + ps.bgImg + ')'
        }
      }

      return style
    })

    // 监听弹窗显示
    watch(
      () => props.datas.show,
      (newVal) => {
        if (newVal) {
          loading.value = true
          // 模拟加载，给组件一点时间渲染
          setTimeout(() => {
            loading.value = false
          }, 300)
        }
      },
      { immediate: true }
    )

    return {
      loading,
      containerStyle,
    }
  },
}
</script>

<style lang="less" scoped>
.RealTimeView {
  .preview-container {
    width: 375px;
    margin: 0 auto;
    background: #fff;
  }

  .loading-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 603px;
  }

  .preview-content {
    width: 100%;
  }

  .preview-phone-container {
    background-repeat: no-repeat;
    background-size: 100% 100%;

    .preview-component {
      border: 1px solid transparent;
    }
  }

  :deep(.el-dialog__body) {
    padding: 0;
  }

  :deep(.el-dialog__header) {
    padding: 10px 20px;
    margin: 0;
  }

  .screen {
    width: 375px;
    height: 667px;
    border: 0;

    // 隐藏滚动条
    &::-webkit-scrollbar {
      display: none; /* Chrome Safari */
    }
  }
}
</style>
