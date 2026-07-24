<template>
  <div class="auxiliarysegmentation">
    <section
      class="contan"
      :style="{
        height: datas.blankHeight + 'px',
        padding: datas.paddType === 0 ? '0px' : '0px 15px',
        'padding-left': (datas.leftIndent || 0) + 'px',
        'padding-right': (datas.rightIndent || 0) + 'px',
      }"
    >
      <!-- 辅助线 -->
      <div
        v-if="datas.segmentationtype === 1"
        class="line-wrap"
        :class="{
          'line-solid': datas.bordertp === 'solid',
          'line-dashed': datas.bordertp === 'dashed',
          'line-dotted': datas.bordertp === 'dotted',
          'line-double': datas.bordertp === 'double',
          'line-gradient': datas.bordertp === 'gradient',
          'with-text': datas.showText,
        }"
        :style="getLineStyle()"
      >
        <!-- 带文字的分割线 -->
        <template v-if="datas.showText">
          <div class="line-before"></div>
          <div class="text-content">
            <van-icon
              v-if="datas.centerIcon"
              :name="datas.centerIcon"
              class="center-icon"
              :style="{ color: datas.textColor || '#999', 'font-size': (datas.textSize || 12) + 'px' }"
            />
            <span
              v-if="datas.centerText"
              class="center-text"
              :style="{
                color: datas.textColor || '#999',
                'font-size': (datas.textSize || 12) + 'px',
              }"
            >{{ datas.centerText }}</span>
          </div>
          <div class="line-after"></div>
        </template>
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
  methods: {
    /* 获取线条样式 */
    getLineStyle() {
      const lineWidth = this.datas.lineWidth || 1
      const style = {}

      if (this.datas.bordertp === 'gradient') {
        style.background = `linear-gradient(to right, ${this.datas.gradientStartColor || '#ff6b6b'}, ${this.datas.gradientEndColor || '#4ecdc4'})`
        style.height = lineWidth + 'px'
      } else if (this.datas.bordertp === 'double') {
        style.height = lineWidth * 3 + 'px'
        style.borderTop = lineWidth + 'px solid ' + (this.datas.auxliarColor || '#e5e5e5')
        style.borderBottom = lineWidth + 'px solid ' + (this.datas.auxliarColor || '#e5e5e5')
      } else {
        style.borderTopWidth = lineWidth + 'px'
        style.borderTopStyle = this.datas.bordertp
        style.borderTopColor = this.datas.auxliarColor
      }

      return style
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

    .line-wrap {
      width: 100%;
      display: flex;
      align-items: center;

      &.with-text {
        .line-before,
        .line-after {
          flex: 1;
          height: 0;
        }
        .text-content {
          padding: 0 12px;
          display: flex;
          align-items: center;
          white-space: nowrap;

          .center-icon {
            margin-right: 4px;
          }
          .center-text {
            line-height: 1;
          }
        }
      }

      &.line-solid,
      &.line-dashed,
      &.line-dotted {
        .line-before,
        .line-after {
          border-top-style: inherit;
          border-top-width: inherit;
          border-top-color: inherit;
        }
      }

      &.line-double {
        .line-before,
        .line-after {
          height: 3px;
          border-top: 1px solid;
          border-bottom: 1px solid;
          border-color: inherit;
        }
      }

      &.line-gradient {
        background: linear-gradient(to right, #ff6b6b, #4ecdc4);

        .line-before,
        .line-after {
          background: inherit;
          height: inherit;
        }
        .text-content {
          background: #fff;
        }
      }
    }
  }
}
</style>
