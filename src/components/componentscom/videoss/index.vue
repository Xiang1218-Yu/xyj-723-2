<template>
  <div class="videoss">
    <!-- 默认视频 -->
    <section class="default" v-if="!datas.src">
      <van-icon name="tv-o" size="150px" />
    </section>

    <!-- 选择视频后 -->
    <section v-else style="position: relative">
      <video
        :src="datas.src"
        :controls="datas.showControls"
        :autoplay="datas.autoplay"
        :poster="datas.coverUrl"
        :loop="datas.loop"
        :muted="datas.muted"
        :style="{ objectFit: datas.objectFit || 'contain' }"
      ></video>
    </section>

    <!-- 删除组件 -->
    <slot name="deles" />
  </div>
</template>

<script>
export default {
  name: 'videoss',
  props: {
    datas: Object,
  },
}
</script>

<style scoped lang="less">
.videoss {
  position: relative;

  /* 默认视频 */
  .default {
    width: 100%;
    height: 210px;
    background: #979797;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  video {
    width: 100%;
    display: block;
  }
}
</style>
