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
      <!-- 标题 -->
      <h2
        :style="{
          'font-size': datas.wordSize + 'px',
          'font-weight': datas.wordWeight,
          color: datas.wordColor,
          'text-align': datas.positions,
          height: datas.wordHeight + 'px',
          'line-height': datas.wordHeight + 'px',
          'padding-right': !(datas.positions !== 'center' && datas.more.show)
            ? '0'
            : '60px',
        }"
        v-if="datas.name"
      >
        <!-- F7 新增：标题左侧图标（http 链接用 img，否则当作 iconfont 类名，非空才显示） -->
        <img
          v-if="datas.leftIcon && isImgLink(datas.leftIcon)"
          class="left-icon-img"
          :src="datas.leftIcon"
          alt=""
          draggable="false"
        />
        <i
          v-else-if="datas.leftIcon"
          class="iconfont left-icon-font"
          :class="datas.leftIcon"
        />
        {{ datas.name }}
      </h2>

      <!-- 描述文字 -->
      <!-- F7 新增：descGradient 为真时用线性渐变实现渐变文字 -->
      <p
        :style="[
          {
            'font-size': datas.descriptionSize + 'px',
            'font-weight': datas.descriptionWeight,
            'text-align': datas.positions,
          },
          datas.descGradient
            ? {
                background:
                  'linear-gradient(' +
                  datas.descGradientAngle +
                  'deg, ' +
                  datas.descGradientStart +
                  ', ' +
                  datas.descGradientEnd +
                  ')',
                '-webkit-background-clip': 'text',
                'background-clip': 'text',
                '-webkit-text-fill-color': 'transparent',
                color: 'transparent',
              }
            : { color: datas.descriptionColor },
        ]"
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
  methods: {
    // F7 新增：判断 leftIcon 是否为 http(s) 图片链接
    isImgLink(icon) {
      return /^https?:\/\//i.test(icon)
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

  /* F7 新增：标题左侧图标样式（图片与 iconfont 类名两种） */
  .left-icon-img {
    height: 1em;
    width: auto;
    vertical-align: -0.15em;
    margin-right: 6px;
    display: inline-block;
  }
  .left-icon-font {
    margin-right: 6px;
    font-size: inherit;
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
