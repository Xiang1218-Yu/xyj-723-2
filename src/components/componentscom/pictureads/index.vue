<template>
  <div class="pictureads">
    <!-- 无图片 -->
    <div class="upload" v-if="!imageList[0]">
      <i class="iconfont icon-lunbotu"></i>
    </div>

    <!-- 一行一个 -->
    <div
      v-if="imageList[0] && swiperType === 0"
      class="type0"
      :style="{
        'padding-left': datas.pageMargin + 'px',
        'padding-right': datas.pageMargin + 'px',
      }"
    >
      <div
        v-for="(item, index) in imageList"
        :key="index"
        class="imgLis"
        :style="{ 'margin-bottom': datas.imageMargin + 'px' }"
      >
        <!-- 图片 -->
        <img
          :src="item.src"
          draggable="false"
          :style="{ 'border-radius': datas.borderRadius + 'px' }"
        />
        <!-- 图片标题 -->
        <p class="title" v-show="item.text ? true : false">{{ item.text }}</p>
      </div>
    </div>

    <!-- 轮播组件 -->
    <!-- F3修复：使用唯一 ref + 作用域内选择器，避免多个轮播组件共用全局 '.swiper-container' 选错节点 -->
    <div
      ref="swiperEl"
      class="swiper-container pointer-events"
      v-if="
        (imageList[0] && swiperType === 1) ||
        swiperType === 2 ||
        swiperType === 3
      "
    >
      <div
        :class="
          swiperType === 3 && imageList[0]
            ? 'type3 type1 swiper-wrapper type3H'
            : 'swiper-wrapper type1'
        "
      >
        <div
          class="swiper-slide"
          v-for="(item, index) in imageList"
          :key="index"
        >
          <!-- 图片 -->
          <img
            :src="item.src"
            alt=""
            draggable="false"
            :style="{ 'border-radius': datas.borderRadius + 'px' }"
          />
          <!-- 图片标题 -->
          <p class="title" v-show="item.text ? true : false">{{ item.text }}</p>
        </div>
      </div>

      <!-- 分页器 -->
      <div class="swiper-pagination" style="color: #007aff"></div>

      <!-- 左右箭头（showArrow 开启时显示） -->
      <template v-if="datas.showArrow">
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
      </template>
    </div>

    <!-- 删除组件 -->
    <slot name="deles" />
  </div>
</template>

<script>
import Swiper from 'swiper'
import 'swiper/css/swiper.min.css'

export default {
  name: 'pictureads',
  props: {
    datas: Object,
  },
  data() {
    return {
      // 当前 Swiper 实例（单实例，作用于本组件容器）
      mySwiper: null,
    }
  },
  computed: {
    /* 轮播类型(模板使用) */
    swiperType() {
      return this.datas.swiperType
    },
    /* 图片列表(模板使用) */
    imageList() {
      return this.datas.imageList
    },
    /* 分页器类型 */
    pagingType() {
      return this.datas.pagingType
    },
    /* 一行个数：轮播海报(类型1)固定为 1 */
    rowindividual() {
      return this.datas.swiperType === 1 ? 1 : this.datas.rowindividual
    },
    /* 图片间距：轮播海报(类型1)固定为 0 */
    imageMargin() {
      return this.datas.swiperType === 1 ? 0 : this.datas.imageMargin
    },
    /**
     * F3优化：聚合所有影响 Swiper 的配置为单一签名，
     * 供 watch 统一监听，参数变更时只重建一次，避免多个 computed 副作用重复初始化
     */
    swiperSignature() {
      const d = this.datas
      return [
        d.swiperType,
        d.imageList ? d.imageList.length : 0,
        d.pagingType,
        d.rowindividual,
        d.imageMargin,
        d.autoplay,
        d.autoplayDelay,
        d.effect,
        d.showArrow,
        d.loop,
      ].join('|')
    },
  },
  watch: {
    // F3优化：单一聚合监听，任一轮播参数变更后于 nextTick 重建轮播
    swiperSignature() {
      this.$nextTick(() => this.rebuildSwiper())
    },
  },
  mounted() {
    // 初次渲染后按需初始化轮播
    this.$nextTick(() => this.rebuildSwiper())
  },
  beforeUnmount() {
    // 组件卸载前销毁实例，避免内存泄漏与定时器残留
    this.destroySwiper()
  },
  methods: {
    /* F3优化：销毁当前轮播实例（单实例，去除历史 instanceof Array 死代码） */
    destroySwiper() {
      if (this.mySwiper) {
        this.mySwiper.destroy(true, true)
        this.mySwiper = null
      }
    },
    /* 组装 Swiper 参数（纯函数式，便于扩展与测试） */
    buildSwiperParams() {
      const d = this.datas
      const params = {
        loop: d.loop !== false, // 是否循环播放(默认循环)
        // 自动播放：开启时使用配置的间隔时长(兜底 3000)，关闭时为 false
        autoplay:
          d.autoplay !== false
            ? { delay: Number(d.autoplayDelay) || 3000 }
            : false,
        effect: d.effect || 'slide', // 过渡效果 slide/fade/cube/coverflow/flip
        pagination: {
          // 分页器限定在当前组件内部，避免多个轮播互相干扰
          el: this.$refs.swiperEl.querySelector('.swiper-pagination'),
          type: this.pagingType,
        },
      }
      // 显示左右箭头时追加 navigation 配置(限定在当前组件内部)
      if (d.showArrow) {
        params.navigation = {
          nextEl: this.$refs.swiperEl.querySelector('.swiper-button-next'),
          prevEl: this.$refs.swiperEl.querySelector('.swiper-button-prev'),
        }
      }
      // 多图单行/轮播海报：按每屏个数与间距展示
      if (d.swiperType === 1 || d.swiperType === 2) {
        params.slidesPerView = this.rowindividual
        params.spaceBetween = this.imageMargin
      } else if (d.swiperType === 3) {
        // 立体轮播：居中放大
        params.slidesPerView = 1.3
        params.centeredSlides = true
      }
      return params
    },
    /* F3优化：重建轮播——先销毁再按当前配置创建；不满足条件时仅销毁 */
    rebuildSwiper() {
      this.destroySwiper()
      // 仅在需要轮播(非类型0)且有图片、容器已渲染时创建
      if (
        this.datas.swiperType !== 0 &&
        this.datas.imageList[0] &&
        this.$refs.swiperEl
      ) {
        // 传入当前组件的 DOM 元素而非全局选择器，保证多组件各自初始化到正确节点
        this.mySwiper = new Swiper(this.$refs.swiperEl, this.buildSwiperParams())
      }
    },
  },
}
</script>

<style scoped lang="less">
.pictureads {
  position: relative;

  /* 无图片 */
  .upload {
    background: #979797;
    width: 100%;
    height: 250px;
    display: flex;
    justify-content: center;
    align-items: center;
    i {
      font-size: 120px;
    }
  }

  /* 类型0 */
  .type0 {
    box-sizing: border-box;
    /* 图片列表 */
    .imgLis {
      width: 100%;
      position: relative;
      overflow: hidden;
      &:last-child {
        margin: 0 !important;
      }
      /* 图片 */
      img {
        width: 100%;
        height: 100%;
        display: block;
      }
      .title {
        height: 36px;
        width: 100%;
        background-color: rgba(51, 51, 51, 0.8);
        text-align: center;
        line-height: 36px;
        color: #fff;
        position: absolute;
        bottom: 0;
        left: 0;
      }
    }
  }

  /* 类型1 */
  .type1 {
    width: 100%;
    position: relative;
    .swiper-slide {
      width: 100%;
      height: 250px;
    }
    img {
      width: 100%;
      height: 100%;
      display: block;
    }
    .title {
      height: 36px;
      width: 100%;
      background-color: rgba(51, 51, 51, 0.8);
      text-align: center;
      line-height: 36px;
      color: #fff;
      position: absolute;
      bottom: 0;
      left: 0;
      text-align: left;
      box-sizing: border-box;
      padding: 0 5px;
    }
  }

  .type3 {
    width: 100%;
    height: 250px;
    align-items: center;
    .swiper-slide {
      height: 210px !important;
      text-align: center;
      font-size: 18px;
      background: #fff;
      box-shadow: rgba(173, 173, 173, 0.8) 0px 7px 24px 0px;
      border-radius: 12px;
      overflow: hidden;

      /* Center slide text vertically */
      display: -webkit-box;
      display: -ms-flexbox;
      display: -webkit-flex;
      display: flex;
      -webkit-box-pack: center;
      -ms-flex-pack: center;
      -webkit-justify-content: center;
      justify-content: center;
      -webkit-box-align: center;
      -ms-flex-align: center;
      -webkit-align-items: center;
      align-items: center;
      transition: 300ms;
      transform: scale(0.8);
      img {
        width: 100%;
        height: 100%;
      }
    }
    .swiper-slide-active,
    .swiper-slide-duplicate-active {
      transform: scale(1);
    }
    .swiper-pagination {
      bottom: 0 !important;
    }
    .title {
      height: 36px;
      width: 100%;
      background-color: rgba(51, 51, 51, 0.8);
      text-align: center;
      line-height: 36px;
      color: #fff;
      position: absolute;
      bottom: 0;
      left: 0;
      text-align: left;
      box-sizing: border-box;
      padding: 0 5px;
    }
  }
  .type3H {
    height: 250px;
  }
  .swiper-container-horizontal > .swiper-pagination-progressbar {
    height: 2px;
  }
}
</style>
