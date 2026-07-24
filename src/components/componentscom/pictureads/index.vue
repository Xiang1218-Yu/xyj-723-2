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
      :ref="swiperRefName"
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
      <div 
        :class="paginationClass" 
        :style="{ color: datas.arrowColor }"
      ></div>
      
      <!-- 导航箭头 -->
      <div 
        v-if="datas.showArrows" 
        class="swiper-button-prev"
        :style="{ color: datas.arrowColor }"
      ></div>
      <div 
        v-if="datas.showArrows" 
        class="swiper-button-next"
        :style="{ color: datas.arrowColor }"
      ></div>
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
    // 生成唯一ID用于多实例区分
    const uniqueId = Math.random().toString(36).substr(2, 9)
    return {
      mySwiper: null,
      swiperRefName: 'swiperContainer_' + uniqueId,
      paginationClass: 'swiper-pagination-' + uniqueId,
      uniqueId: uniqueId,
    }
  },
  computed: {
    /* 类型切换 */
    swiperType() {
      console.log(this.datas.swiperType, '----------------轮播类型')
      this.$nextTick(() => {
        this.addSwiper()
      })
      return this.datas.swiperType
    },
    /* 图片删除或者增加 */
    imageList() {
      this.$nextTick(() => {
        this.addSwiper()
      })
      console.log(this.datas.imageList.length, '-------轮播数量')
      return this.datas.imageList
    },
    /* 分页器类型切换 */
    pagingType() {
      this.$nextTick(() => {
        this.addSwiper()
      })
      return this.datas.pagingType
    },
    /* 一行个数 */
    rowindividual() {
      this.$nextTick(() => {
        this.addSwiper()
      })
      if (this.datas.swiperType === 1) {
        return 1
      } else {
        return this.datas.rowindividual
      }
    },
    /* 图片间距 */
    imageMargin() {
      this.$nextTick(() => {
        this.addSwiper()
      })
      if (this.datas.swiperType === 1) {
        return 0
      } else {
        return this.datas.imageMargin
      }
    },
  },
  watch: {
    pagingType() {},
    rowindividual() {},
    imageMargin() {},
    'datas.autoplayEnabled'() {
      this.$nextTick(() => {
        this.addSwiper()
      })
    },
    'datas.autoplayDelay'() {
      this.$nextTick(() => {
        this.addSwiper()
      })
    },
    'datas.loopEnabled'() {
      this.$nextTick(() => {
        this.addSwiper()
      })
    },
    'datas.transitionEffect'() {
      this.$nextTick(() => {
        this.addSwiper()
      })
    },
    'datas.speed'() {
      this.$nextTick(() => {
        this.addSwiper()
      })
    },
    'datas.showArrows'() {
      this.$nextTick(() => {
        this.addSwiper()
      })
    },
  },
  mounted() {
    // 组件挂载后初始化swiper
    this.$nextTick(() => {
      this.addSwiper()
    })
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
            this.mySwiper = null
          }

          // 获取当前组件的容器元素
          const containerEl = this.$refs[this.swiperRefName]
          if (!containerEl) return

          let params = {
            loop: this.datas.loopEnabled,
            speed: this.datas.speed || 300,
            effect: this.datas.transitionEffect || 'slide',
            autoplay: this.datas.autoplayEnabled ? {
              delay: this.datas.autoplayDelay || 3000,
              disableOnInteraction: false,
            } : false,
            pagination: {
              el: '.' + this.paginationClass,
              type: this.pagingType,
            },
          }

          // 添加导航箭头配置
          if (this.datas.showArrows) {
            params.navigation = {
              nextEl: containerEl.querySelector('.swiper-button-next'),
              prevEl: containerEl.querySelector('.swiper-button-prev'),
            }
          }

          if (this.datas.swiperType === 1 || this.datas.swiperType === 2) {
            params.slidesPerView = this.rowindividual
            params.spaceBetween = this.imageMargin
          } else if (this.datas.swiperType === 3) {
            params.slidesPerView = 1.3
            params.centeredSlides = true
          }

          this.mySwiper = new Swiper(containerEl, params)
        } else {
          if (this.mySwiper instanceof Array) {
            this.mySwiper.forEach((element) => {
              element.destroy()
            })
          }
          // 每次重新创建swiper前都要销毁之前存在的轮播   不然轮播会重复
          if (this.mySwiper instanceof Object) {
            this.mySwiper.destroy()
            this.mySwiper = null
          }
        }
      })
    },
  },
  beforeDestroy() {
    // 组件销毁前清理swiper实例
    if (this.mySwiper) {
      this.mySwiper.destroy()
      this.mySwiper = null
    }
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
  
  /* 导航箭头样式 */
  :deep(.swiper-button-prev),
  :deep(.swiper-button-next) {
    width: 36px;
    height: 36px;
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 50%;
    &::after {
      font-size: 14px;
      font-weight: bold;
    }
  }
}
</style>
