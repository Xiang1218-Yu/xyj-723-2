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
    <div
      class="swiper-container pointer-events"
      :ref="'swiperContainer' + uid"
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
      <div
        v-if="datas.pagingType !== 0"
        class="swiper-pagination"
        style="color: #007aff"
      ></div>

      <!-- #3 左右箭头 -->
      <div v-if="datas.showArrows" class="swiper-button-prev swiper-nav-btn">
        <van-icon name="arrow-left" />
      </div>
      <div v-if="datas.showArrows" class="swiper-button-next swiper-nav-btn">
        <van-icon name="arrow" />
      </div>
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
      mySwiper: null,
      uid: Math.random().toString(36).slice(2, 8),
    }
  },
  computed: {
    /* 类型切换 */
    swiperType() {
      this.$nextTick(() => this.addSwiper())
      return this.datas.swiperType
    },
    /* 图片删除或者增加 */
    imageList() {
      this.$nextTick(() => this.addSwiper())
      return this.datas.imageList
    },
    /* 分页器类型切换 */
    pagingType() {
      this.$nextTick(() => this.addSwiper())
      return this.datas.pagingType
    },
    /* 一行个数 */
    rowindividual() {
      this.$nextTick(() => this.addSwiper())
      if (this.datas.swiperType === 1) {
        return 1
      } else {
        return this.datas.rowindividual
      }
    },
    /* 图片间距 */
    imageMargin() {
      this.$nextTick(() => this.addSwiper())
      if (this.datas.swiperType === 1) {
        return 0
      } else {
        return this.datas.imageMargin
      }
    },
  },
  watch: {
    // #3 监听自动播放切换
    'datas.autoplay'() {
      this.addSwiper()
    },
    // #3 监听过渡效果
    'datas.effect'() {
      this.addSwiper()
    },
    // #3 监听过渡速度
    'datas.speed'() {
      this.addSwiper()
    },
    // #3 监听箭头开关
    'datas.showArrows'() {
      this.addSwiper()
    },
    // #3 监听循环
    'datas.loop'() {
      this.addSwiper()
    },
    // #3 监听播放间隔
    'datas.autoplayDelay'() {
      this.addSwiper()
    },
  },
  methods: {
    /* 创建轮播对象 */
    addSwiper() {
      this.$nextTick(() => {
        const el = this.$refs['swiperContainer' + this.uid]
        if (!el) return
        if (this.datas.swiperType !== 0 && this.datas.imageList[0]) {
          // 销毁旧实例
          if (this.mySwiper) {
            this.mySwiper.destroy(true, true)
            this.mySwiper = null
          }

          // #3 构建参数
          const params = {
            loop: !!this.datas.loop,
            speed: Number(this.datas.speed) || 300,
            effect: this.datas.effect || 'slide',
            pagination: {
              el: el.querySelector('.swiper-pagination'),
              type: this.datas.pagingType || 'bullets',
              clickable: true,
            },
          }
          // #3 自动播放
          if (this.datas.autoplay) {
            params.autoplay = {
              delay: Number(this.datas.autoplayDelay) || 3000,
              disableOnInteraction: false,
            }
          }
          // #3 箭头导航
          if (this.datas.showArrows) {
            params.navigation = {
              nextEl: el.querySelector('.swiper-button-next'),
              prevEl: el.querySelector('.swiper-button-prev'),
            }
          }

          if (this.datas.swiperType === 1 || this.datas.swiperType === 2) {
            params.slidesPerView = this.rowindividual
            params.spaceBetween = this.imageMargin
          } else if (this.datas.swiperType === 3) {
            params.slidesPerView = 1.3
            params.centeredSlides = true
          }

          this.mySwiper = new Swiper(el, params)
        } else {
          if (this.mySwiper) {
            this.mySwiper.destroy(true, true)
            this.mySwiper = null
          }
        }
      })
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
      display: flex;
      justify-content: center;
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

  /* #3 箭头按钮样式 */
  .swiper-nav-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 28px;
    height: 28px;
    background: rgba(0, 0, 0, 0.4);
    color: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    cursor: pointer;
    font-size: 14px;
    &.swiper-button-prev {
      left: 6px;
    }
    &.swiper-button-next {
      right: 6px;
    }
  }
}
</style>
