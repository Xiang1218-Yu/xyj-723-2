<template>
  <div class="captiontext" :style="{ background: datas.backColor }">
    <div
      style="padding: 6px 0"
      :style="{
        'border-bottom': datas.borderBott
          ? '1px solid #F9F9F9'
          : '1px solid #fff',
      }"
    >
      <!-- 标题区域 -->
      <div class="title-area" :class="{ 'has-left-icon': datas.showLeftIcon && datas.leftIcon }">
        <!-- 左侧图标 -->
        <img
          v-if="datas.showLeftIcon && datas.leftIcon"
          :src="datas.leftIcon"
          class="left-icon"
          :style="{ width: datas.leftIconSize + 'px', height: datas.leftIconSize + 'px' }"
        />
        <!-- 标题 -->
        <h2
          :style="titleStyle"
          v-if="datas.name"
        >
          {{ datas.name }}
        </h2>
      </div>

      <!-- 描述文字 -->
      <p
        :style="{
          'font-size': datas.descriptionSize + 'px',
          'font-weight': datas.descriptionWeight,
          color: datas.descriptionColor,
          'text-align': datas.positions,
        }"
        style="margin-top: 8px"
        v-if="datas.description"
      >
        {{ datas.description }}
      </p>

      <!-- 更多 -->
      <p
        class="more"
        v-show="datas.more.show"
        :class="datas.positions !== 'center' ? 'lef' : ''"
        :style="{
          color: datas.more.type === 0 ? '#38f' : '',
          top: (datas.wordHeight - 6) / 2 + 'px',
        }"
      >
        {{ datas.more.type === 2 ? '' : datas.more.text }}
        <span> {{ datas.more.type === 0 ? '' : '>' }}</span>
      </p>
    </div>

    <!-- 删除组件 -->
    <slot name="deles" />
  </div>
</template>

<script>
export default {
  name: 'captiontext',
  props: {
    datas: Object,
  },
  computed: {
    titleStyle() {
      const baseStyle = {
        'font-size': this.datas.wordSize + 'px',
        'font-weight': this.datas.wordWeight,
        color: this.datas.wordColor,
        'text-align': this.datas.positions,
        height: this.datas.wordHeight + 'px',
        'line-height': this.datas.wordHeight + 'px',
        'padding-right': !(this.datas.positions !== 'center' && this.datas.more.show)
          ? '0'
          : '60px',
      }
      // 渐变效果
      if (this.datas.gradientEnabled) {
        let gradientDir = 'to right'
        if (this.datas.gradientDirection === 'to bottom') {
          gradientDir = 'to bottom'
        } else if (this.datas.gradientDirection === 'to right bottom') {
          gradientDir = 'to right bottom'
        }
        baseStyle.background = `linear-gradient(${gradientDir}, ${this.datas.gradientStart || this.datas.wordColor}, ${this.datas.gradientEnd || this.datas.wordColor})`
        baseStyle['-webkit-background-clip'] = 'text'
        baseStyle['-webkit-text-fill-color'] = 'transparent'
        baseStyle['background-clip'] = 'text'
      }
      return baseStyle
    }
  }
}
</script>

<style scoped lang="less">
.captiontext {
  border: 2px solid #fff;
  box-sizing: border-box;
  width: 100%;
  padding: 0 14px;
  min-height: 20px;
  position: relative;

  /* 标题区域 */
  .title-area {
    display: flex;
    align-items: center;
    &.has-left-icon {
      justify-content: flex-start;
      h2 {
        padding-left: 8px;
        padding-right: 60px;
      }
    }
  }

  /* 左侧图标 */
  .left-icon {
    display: block;
    flex-shrink: 0;
  }

  h2,
  p {
    word-wrap: break-word;
    min-height: 10px;
  }

  /* 更多 */
  .more {
    font-size: 10px;
    color: #969799;
    text-align: center;
    &.lef {
      position: absolute;
      right: 15px;
      top: 12px;
    }
  }
}
</style>
