<template>
  <div
    class="graphicnavigation"
    :class="{ 'card-style': datas.cardStyle }"
    :style="{ backgroundImage: 'url(' + datas.bgImg + ')' }"
  >
    <!-- 默认导航 -->
    <section
      class="defaultNavigation"
      v-if="!datas.imageList[0]"
      :style="navContainerStyle"
    >
      <!-- 导航 -->
      <div
        class="navigationList"
        :class="iconShapeClass"
        v-for="index in 5"
        :key="index"
        :style="navItemStyle"
      >
        <!-- 图片 -->
        <img
          src="../../../assets/images/imgs.png"
          alt="默认图片"
          v-show="datas.navigationType === 0"
          draggable="false"
          :style="imgRadiusStyle"
        />
        <!-- 文字 -->
        <p :style="textStyle">导航</p>
      </div>
    </section>

    <!-- 导航列表 -->
    <section
      class="defaultNavigation"
      v-else
      :style="navContainerStyle"
    >
      <!-- 导航 -->
      <div
        class="navigationList"
        :class="[iconShapeClass, { 'card-item': datas.cardStyle }]"
        v-for="(item, index) in datas.imageList"
        :key="index"
        :style="navItemStyle"
      >
        <!-- 图片容器（用于角标定位） -->
        <div class="nav-img-wrap" v-show="datas.navigationType === 0">
          <img
            :src="item.src"
            alt="默认图片"
            draggable="false"
            :style="imgRadiusStyle"
          />
          <!-- #11 HOT/NEW角标 -->
          <span
            v-if="datas.showBadge && item.badge"
            class="nav-badge"
            :class="'badge-' + item.badge"
          >
            {{ item.badge === 'hot' ? 'HOT' : 'NEW' }}
          </span>
        </div>
        <!-- 文字 -->
        <p
          :style="textStyle"
        >
          {{ item.text }}
        </p>
      </div>
    </section>

    <!-- 删除组件 -->
    <slot name="deles" />
  </div>
</template>

<script>
export default {
  name: 'graphicnavigation',
  props: {
    datas: Object,
  },
  computed: {
    // #11 图标形状样式类
    iconShapeClass() {
      return 'shape-' + (this.datas.iconShape || 'circle')
    },
    // #11 导航容器样式
    navContainerStyle() {
      return {
        background: this.datas.backgroundColor,
        display: this.datas.imgStyle === 0 ? 'flex' : '-webkit-box',
        'flex-wrap': this.datas.imgStyle === 0 ? 'wrap' : 'nowrap',
        'justify-content':
          this.datas.imgStyle === 0 ? 'space-evenly' : 'space-around',
        'overflow-x': this.datas.imgStyle === 0 ? '' : 'scroll',
      }
    },
    // #11 导航项宽度
    navItemStyle() {
      return {
        width:
          this.datas.imgStyle === 0
            ? this.datas.cardStyle
              ? '48%'
              : '20%'
            : 375 / this.datas.showSize - 1 + 'px',
      }
    },
    // #11 图片圆角样式（根据图标形状）
    imgRadiusStyle() {
      const shape = this.datas.iconShape || 'circle'
      let radius = '0'
      if (shape === 'circle') radius = '50%'
      else if (shape === 'rounded') radius = this.datas.borderRadius + '%'
      else radius = '0'
      return { 'border-radius': radius }
    },
    // #11 文字样式
    textStyle() {
      return {
        color: this.datas.textColor,
        'font-size': this.datas.textSize + 'px',
        height: this.datas.textHeight + 'px',
        'line-height': this.datas.textHeight + 'px',
      }
    },
  },
}
</script>

<style scoped lang="less">
.graphicnavigation {
  position: relative;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  .defaultNavigation {
    justify-content: space-evenly;
    &::-webkit-scrollbar {
      height: 1px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #155bd4;
    }
    .navigationList {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 8px;
      .nav-img-wrap {
        position: relative;
        margin-top: 5px;
        img {
          width: 45px;
          height: 45px;
          display: block;
        }
        /* #11 角标样式 */
        .nav-badge {
          position: absolute;
          top: -4px;
          right: -8px;
          font-size: 9px;
          padding: 0 4px;
          height: 14px;
          line-height: 14px;
          color: #fff;
          border-radius: 7px;
          white-space: nowrap;
          &.badge-hot {
            background: linear-gradient(135deg, #ff6b6b, #ee0a24);
          }
          &.badge-new {
            background: linear-gradient(135deg, #07c160, #52c41a);
          }
        }
      }
      p {
        font-size: 12px;
        margin-top: 5px;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: center;
        box-sizing: border-box;
      }
    }
  }

  /* #11 大图卡片样式 */
  &.card-style {
    .defaultNavigation {
      padding: 8px;
      gap: 4px;
    }
    .navigationList.card-item {
      background: #fff;
      border-radius: 8px;
      padding: 8px 4px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      margin: 4px 1%;
      .nav-img-wrap {
        img {
          width: 80px !important;
          height: 80px !important;
        }
      }
    }
  }

  /* #11 图标形状 */
  .shape-circle .nav-img-wrap img {
    border-radius: 50%;
  }
  .shape-square .nav-img-wrap img {
    border-radius: 0;
  }
  .shape-rounded .nav-img-wrap img {
    border-radius: 20%;
  }
}
</style>
