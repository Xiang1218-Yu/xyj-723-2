<template>
  <!-- F1：预览区应用整体文字大小/行高，与编辑器正文保持一致 -->
  <div class="richtext" :style="richtextStyle">
    <img
      draggable="false"
      src="../../../assets/images/fwb.png"
      alt=""
      v-if="!datas.myValue.length"
    />
    <section v-else v-html="datas.myValue" />

    <!-- 删除组件 -->
    <slot name="deles" />
  </div>
</template>

<script>
export default {
  name: 'richtext',
  props: {
    datas: Object,
  },
  computed: {
    // F1：背景色 + 整体文字大小/行高（旧数据缺字段时回退默认值）
    richtextStyle() {
      return {
        background: this.datas.backColor,
        fontSize: (this.datas.fontSize || 14) + 'px',
        lineHeight: this.datas.lineHeight || 1.6,
      }
    },
  },
}
</script>

<style scoped lang="less">
.richtext {
  position: relative;
}
:deep(img) {
  max-width: 100% !important;
  display: block;
}
.richtext {
  position: relative;
  :deep(pre) {
    white-space: break-spaces;
  }
  :deep(p) {
    word-break: break-all;
  }
}
</style>
