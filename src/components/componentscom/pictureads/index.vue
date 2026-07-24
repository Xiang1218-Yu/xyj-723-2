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
      mySwiper: null,
    }
  },
  computed: {
    /* 类型切换 */
    swiperType() {
      console.log(this.datas.swiperType, '----------------轮播类型')
      this.addSwiper()
      return this.datas.swiperType
    },
    /* 图片删除或者增加 */
    imageList() {
      this.addSwiper()
      console.log(this.datas.imageList.length, '-------轮播数量')
      return this.datas.imageList
    },
    /* 分页器类型切换 */
    pagingType() {
      this.addSwiper()
      return this.datas.pagingType
    },
    /* 一行个数 */
    rowindividual() {
      this.addSwiper()
      if (this.datas.swiperType === 1) {
        return 1
      } else {
        return this.datas.rowindividual
      }
    },
    /* 图片间距 */
    imageMargin() {
      this.addSwiper()
      if (this.datas.swiperType === 1) {
        return 0
      } else {
        return this.datas.imageMargin
      }
    },
    /* 是否自动播放（变更时重建轮播） */
    autoplay() {
      this.addSwiper()
      return this.datas.autoplay
    },
    /* 自动播放间隔（变更时重建轮播） */
    autoplayDelay() {
      this.addSwiper()
      return this.datas.autoplayDelay
    },
    /* 过渡效果（变更时重建轮播） */
    effect() {
      this.addSwiper()
      return this.datas.effect
    },
    /* 是否显示左右箭头（变更时重建轮播） */
    showArrow() {
      this.addSwiper()
      return this.datas.showArrow
    },
    /* 是否循环播放（变更时重建轮播） */
    loop() {
      this.addSwiper()
      return this.datas.loop
    },
  },
  watch: {
    pagingType() {},
    rowindividual() {},
    imageMargin() {},
    // 监听新增字段，变更时触发轮播重建
    autoplay() {},
    autoplayDelay() {},
    effect() {},
    showArrow() {},
    loop() {},
  },
  methods: {
    /* 创建轮播对象 */
    addSwiper() {
      this.$nextTick(() => {
        if (this.datas.swiperType !== 0 && this.datas.imageList[0]) {
          if (this.mySwiper instanceof Array) {
            this.mySwiper.forEach((element) => {
              element.destroy()
            })
          } else if (this.mySwiper instanceof Object) {
            // 每次重新创建swiper前都要销毁之前存在的轮播   不然轮播会重复
            this.mySwiper.destroy()
          }

          let params = {
            loop: this.datas.loop, // 是否循环播放
            // 自动播放：开启时使用配置的间隔时长，关闭时为 false
            autoplay: this.datas.autoplay
              ? { delay: this.datas.autoplayDelay }
              : false,
            effect: this.datas.effect, // 过渡效果 slide/fade/cube/coverflow/flip
            pagination: {
              el: '.swiper-pagination',
              type: this.pagingType,
            },
          }

          // 显示左右箭头时追加 navigation 配置
          if (this.datas.showArrow) {
            params.navigation = {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }
          }

          if (this.datas.swiperType === 1 || this.datas.swiperType === 2) {
            params.slidesPerView = this.rowindividual
            params.spaceBetween = this.imageMargin
          } else if (this.datas.swiperType === 3) {
            params.slidesPerView = 1.3
            params.centeredSlides = true
          }

          this.mySwiper = new Swiper('.swiper-container', params)
        } else {
          if (this.mySwiper instanceof Array) {
            this.mySwiper.forEach((element) => {
              element.destroy()
            })
          }
          // 每次重新创建swiper前都要销毁之前存在的轮播   不然轮播会重复
          if (this.mySwiper instanceof Object) {
            this.mySwiper.destroy()
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
