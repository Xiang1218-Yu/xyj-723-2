<template>
  <div class="auxiliarysegmentation">
    <section
      class="contan"
      :style="{
        height: datas.blankHeight + 'px',
        padding: datas.paddType === 0 ? '0px' : '0px 15px',
      }"
    >
      <!-- 辅助线区域：segmentationtype === 1 时显示 -->
      <!-- F12：根据 lineStyle 渲染实线/虚线/双线/渐变，indent 作为左右缩进 -->
      <div
        v-show="datas.segmentationtype === 1"
        class="line-wrap"
        :style="{ padding: '0 ' + (datas.indent || 0) + 'px' }"
      >
        <!-- 显示文字模式：左右各一条线夹住中间文字 -->
        <template v-if="datas.showText">
          <span class="line-seg" :style="segLineStyle" />
          <span class="line-text" :style="{ color: datas.textColor }">
            <!-- 可选前导图标 -->
            <i
              v-if="datas.textIcon"
              class="iconfont"
              :class="datas.textIcon"
              :style="{ color: datas.textColor }"
            />
            {{ datas.lineText }}
          </span>
          <span class="line-seg" :style="segLineStyle" />
        </template>
        <!-- 不显示文字：整条分割线 -->
        <span v-else class="line-seg full" :style="segLineStyle" />
      </div>
    </section>

    <!-- 删除组件 -->
    <slot name="deles" />
  </div>
</template>

<script>
export default {
  name: 'auxiliarysegmentation',
  props: {
    datas: Object,
  },
  computed: {
    // F12：根据 lineStyle 计算分割线样式
    segLineStyle() {
      const style = this.datas.lineStyle || 'solid'
      const color = this.datas.auxliarColor
      if (style === 'gradient') {
        // 渐变：用 linear-gradient 背景细条
        return {
          height: '2px',
          background: `linear-gradient(to right, ${this.datas.gradientStart}, ${this.datas.gradientEnd})`,
          border: 'none',
        }
      }
      if (style === 'double') {
        // 双线：border-style: double 需要至少 3px 高度才能显示两条线
        return {
          height: '3px',
          'border-top-style': 'double',
          'border-top-width': '3px',
          'border-top-color': color,
        }
      }
      // solid / dashed
      return {
        height: '1px',
        'border-top-style': style,
        'border-top-width': '1px',
        'border-top-color': color,
      }
    },
  },
}
</script>

<style scoped lang="less">
.auxiliarysegmentation {
  position: relative;
  .contan {
    display: flex;
    align-items: center;
  }
  /* F12：辅助线容器 */
  .line-wrap {
    width: 100%;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    /* 分割线段 */
    .line-seg {
      flex: 1;
      display: block;
      &.full {
        width: 100%;
      }
    }
    /* 中间文字 */
    .line-text {
      flex-shrink: 0;
      padding: 0 12px;
      font-size: 13px;
      white-space: nowrap;
      display: inline-flex;
      align-items: center;
      .iconfont {
        margin-right: 4px;
        font-size: 14px;
      }
    }
  }
}
</style>
