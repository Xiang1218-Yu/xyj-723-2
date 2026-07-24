<template>
  <div class="videoss">
    <!-- 默认视频 -->
    <section class="default" v-if="!datas.src">
      <van-icon name="tv-o" size="150px" />
    </section>

    <!-- 选择视频后 -->
    <section v-else style="position: relative">
      <video
        ref="videoRef"
        :src="datas.src"
        :controls="datas.showControls"
        :autoplay="datas.autoplay"
        :loop="datas.loop"
        :muted="datas.muted"
        :poster="datas.coverUrl"
        playsinline
        @play="onVideoPlay"
        @pause="onVideoPause"
      ></video>
      
      <!-- 封面和播放按钮覆盖层 -->
      <div 
        class="video-overlay" 
        v-if="datas.coverUrl && !isPlaying"
        @click="playVideo"
      >
        <img :src="datas.coverUrl" class="cover-image" alt="封面" />
        <div class="play-button">
          <van-icon name="play-circle-o" size="60px" />
        </div>
      </div>
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
  data() {
    return {
      isPlaying: false,
    }
  },
  created() {
  },
  methods: {
    // 视频播放事件
    onVideoPlay() {
      this.isPlaying = true
    },
    // 视频暂停事件
    onVideoPause() {
      this.isPlaying = false
    },
    // 点击封面播放视频
    playVideo() {
      if (this.$refs.videoRef) {
        this.$refs.videoRef.play()
      }
    },
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

  /* 播放图标 */
  .bof {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 100px;
    opacity: 0.5;
    color: #999;
  }
  
  /* 视频样式 */
  video {
    width: 100%;
    display: block;
  }
  
  /* 封面覆盖层 */
  .video-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
    
    .cover-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .play-button {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: rgba(255, 255, 255, 0.9);
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }
  }
}
</style>
