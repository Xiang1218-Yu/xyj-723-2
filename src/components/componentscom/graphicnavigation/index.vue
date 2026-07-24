<template>
  <div
    class="graphicnavigation"
    :style="{ backgroundImage: 'url(' + datas.bgImg + ')' }"
  >
    <!-- 默认导航 -->
    <section
      class="defaultNavigation"
      :class="{ 'card-style': datas.cardStyle === 1 }"
      v-if="!datas.imageList[0]"
      :style="{
        background: datas.cardStyle === 1 ? datas.cardBgColor : datas.backgroundColor,
        display: datas.imgStyle === 0 ? 'flex' : '-webkit-box',
        'overflow-x': datas.imgStyle === 0 ? '' : 'scroll',
        padding: datas.cardStyle === 1 ? datas.cardPadding + 'px' : '0',
      }"
    >
      <!-- 导航 -->
      <div
        class="navigationList"
        :class="{ 'card-item': datas.cardStyle === 1 }"
        v-for="index in 5"
        :key="index"
        :style="{
          width:
            datas.imgStyle === 0 ? 'auto' : 375 / datas.showSize - 1 + 'px',
          background: datas.cardStyle === 1 ? '#fff' : 'transparent',
          padding: datas.cardStyle === 1 ? datas.cardPadding + 'px' : '0',
        }"
      >
        <!-- 图片容器 -->
        <div class="img-wrap" :class="'shape-' + (datas.iconShape || 'circle')">
          <img
            src="../../../assets/images/imgs.png"
            alt="默认图片"
            v-show="datas.navigationType === 0"
            draggable="false"
            :style="getIconStyle()"
          />
          <!-- 角标 -->
          <div
            v-if="datas.showBadge"
            class="badge"
            :style="{ background: datas.badgeColor || '#ff4444' }"
          >
            {{ getBadgeText() }}
          </div>
        </div>
        <!-- 文字 -->
        <p :style="{ color: datas.textColor }">导航</p>
      </div>
    </section>

    <!-- 导航列表 -->
    <section
      class="defaultNavigation"
      :class="{ 'card-style': datas.cardStyle === 1 }"
      v-else
      :style="{
        background: datas.cardStyle === 1 ? datas.cardBgColor : datas.backgroundColor,
        display: datas.imgStyle === 0 ? 'flex' : '-webkit-box',
        'flex-wrap': datas.imgStyle === 0 ? 'wrap' : 'nowrap',
        'justify-content':
          datas.imgStyle === 0 ? 'space-evenly' : 'space-around',
        'overflow-x': datas.imgStyle === 0 ? '' : 'scroll',
        padding: datas.cardStyle === 1 ? datas.cardPadding + 'px' : '0',
      }"
    >
      <!-- 导航 -->
      <div
        class="navigationList"
        :class="{ 'card-item': datas.cardStyle === 1 }"
        v-for="(item, index) in datas.imageList"
        :key="index"
        :style="{
          width: datas.imgStyle === 0 ? '20%' : 375 / datas.showSize - 1 + 'px',
          background: datas.cardStyle === 1 ? '#fff' : 'transparent',
          padding: datas.cardStyle === 1 ? datas.cardPadding + 'px' : '0',
        }"
      >
        <!-- 图片容器 -->
        <div class="img-wrap" :class="'shape-' + (datas.iconShape || 'circle')">
          <img
            :src="item.src"
            alt="导航图片"
            v-show="datas.navigationType === 0"
            draggable="false"
            :style="getIconStyle()"
          />
          <!-- 角标 -->
          <div
            v-if="datas.showBadge"
            class="badge"
            :style="{ background: datas.badgeColor || '#ff4444' }"
          >
            {{ getBadgeText() }}
          </div>
        </div>
        <!-- 文字 -->
        <p
          :style="{
            color: datas.textColor,
            'font-size': datas.textSize + 'px',
            height: datas.textHeight + 'px',
            'line-height': datas.textHeight + 'px',
          }"
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
  methods: {
    /* 获取图标样式 */
    getIconStyle() {
      const shape = this.datas.iconShape || 'circle'
      let radius = '50%'
      if (shape === 'square') radius = '0'
      else if (shape === 'rounded') radius = '20px'

      const size = this.datas.cardStyle === 1 ? '60px' : '45px'
      return {
        'border-radius': radius,
        width: size,
        height: size,
      }
    },
    /* 获取角标文字 */
    getBadgeText() {
      const type = this.datas.badgeType || 'hot'
      if (type === 'custom') {
        return (this.datas.badgeText || '').substring(0, 5)
      }
      return type === 'hot' ? 'HOT' : 'NEW'
    },
  },
}
</script>

<style scoped lang="less">
.graphicnavigation {
  position: relative;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  /* 默认导航 */
  .defaultNavigation {
    justify-content: space-evenly;
    &::-webkit-scrollbar {
      height: 1px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #155bd4;
    }
    :deep(.el-collapse-item__header),
    :deep(.el-collapse-item__wrap) {
      border-bottom: 0 !important;
    }
    /* 导航 */
    .navigationList {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      img {
        margin-top: 5px;
        object-fit: cover;
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
      /* 图片容器 */
      .img-wrap {
        position: relative;
        display: inline-block;
        &.shape-circle img {
          border-radius: 50%;
        }
        &.shape-square img {
          border-radius: 0;
        }
        &.shape-rounded img {
          border-radius: 20px;
        }
        /* 角标 */
        .badge {
          position: absolute;
          top: -2px;
          right: -8px;
          padding: 1px 6px;
          border-radius: 8px;
          font-size: 10px;
          color: #fff;
          white-space: nowrap;
          z-index: 1;
          transform: scale(0.9);
        }
      }
    }
    /* 大图卡片样式 */
    &.card-style {
      gap: 10px;
      .navigationList.card-item {
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        margin: 0 4px;
        img {
          width: 60px !important;
          height: 60px !important;
          margin-top: 0;
        }
        p {
          margin-top: 8px;
        }
      }
    }
  }
}
</style>
