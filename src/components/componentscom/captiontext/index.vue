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
      <!-- #7 标题行：左侧图标 + 小标题(渐变) -->
      <div
        class="title-row"
        :style="{
          'padding-right':
            datas.positions !== 'center' && datas.more.show ? '60px' : '0',
        }"
      >
        <!-- #7 左侧图标 -->
        <img
          v-if="datas.leftIcon"
          class="left-icon"
          :src="datas.leftIcon"
          :style="{
            width: datas.leftIconSize + 'px',
            height: datas.leftIconSize + 'px',
          }"
          alt=""
        />
        <!-- #7 小标题（支持渐变） -->
        <h2
          v-if="datas.name"
          :style="titleStyle"
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
    // #7 标题样式，支持渐变
    titleStyle() {
      const base = {
        'font-size': this.datas.wordSize + 'px',
        'font-weight': this.datas.wordWeight,
        color: this.datas.wordColor,
        'text-align': this.datas.positions,
        height: this.datas.wordHeight + 'px',
        'line-height': this.datas.wordHeight + 'px',
        margin: 0,
      }
      if (this.datas.gradientTitle) {
        base.background = `linear-gradient(90deg, ${this.datas.gradientStart}, ${this.datas.gradientEnd})`
        base['-webkit-background-clip'] = 'text'
        base['-webkit-text-fill-color'] = 'transparent'
        base.color = 'transparent'
      }
      return base
    },
  },
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

  h2,
  p {
    word-wrap: break-word;
    min-height: 10px;
  }

  /* #7 标题行 */
  .title-row {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .left-icon {
    display: block;
    flex-shrink: 0;
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
