<template>
  <div
    class="graphicnavigation"
    :style="{ backgroundImage: 'url(' + datas.bgImg + ')' }"
  >
    <!-- 默认导航 -->
    <section
      class="defaultNavigation"
      v-if="!datas.imageList[0]"
      :style="{
        background: datas.backgroundColor,
        display: datas.imgStyle === 0 ? 'flex' : '-webkit-box',
        'overflow-x': datas.imgStyle === 0 ? '' : 'scroll',
      }"
    >
      <!-- 导航 -->
      <div
        class="navigationList"
        v-for="index in 5"
        :key="index"
        :style="{
          width:
            datas.imgStyle === 0 ? 'auto' : 375 / datas.showSize - 1 + 'px',
        }"
      >
        <!-- 图片 -->
        <img
          src="../../../assets/images/imgs.png"
          alt="默认图片"
          v-show="datas.navigationType === 0"
          draggable="false"
          :style="{ 'border-radius': datas.borderRadius + '%' }"
        />
        <!-- 文字 -->
        <p :style="{ color: datas.textColor }">导航</p>
      </div>
    </section>

    <!-- 导航列表 -->
    <!-- F11：cardStyle 为真时使用大图卡片布局 -->
    <section
      v-else
      class="defaultNavigation"
      :class="{ 'card-mode': datas.cardStyle }"
      :style="{
        background: datas.backgroundColor,
        display: datas.imgStyle === 0 ? 'flex' : '-webkit-box',
        'flex-wrap': datas.imgStyle === 0 ? 'wrap' : 'nowrap',
        'justify-content':
          datas.imgStyle === 0 ? 'space-evenly' : 'space-around',
        'overflow-x': datas.imgStyle === 0 ? '' : 'scroll',
      }"
    >
      <!-- 导航 -->
      <div
        class="navigationList"
        :class="{ 'card-item': datas.cardStyle }"
        v-for="(item, index) in datas.imageList"
        :key="index"
        :style="{
          width: datas.cardStyle
            ? '50%'
            : datas.imgStyle === 0
            ? 100 / (datas.showSize || 5) + '%'
            : 375 / (datas.showSize || 5) - 1 + 'px',
        }"
      >
        <!-- 图片包裹层：用于承载角标与图标形状 -->
        <div class="img-box" v-show="datas.navigationType === 0">
          <!-- 图片：iconShape 控制圆角形状；cardStyle 时图片更大 -->
          <img
            :src="item.src"
            alt="默认图片"
            draggable="false"
            :class="'shape-' + (datas.iconShape || 'square')"
            :style="{
              'border-radius':
                datas.iconShape === 'circle'
                  ? '50%'
                  : datas.iconShape === 'round'
                  ? '12px'
                  : datas.borderRadius + '%',
            }"
          />
          <!-- F11：角标 HOT(红)/NEW(橙)，item.corner 非空时显示 -->
          <span
            v-if="item.corner"
            class="corner-badge"
            :class="item.corner === 'HOT' ? 'corner-hot' : 'corner-new'"
            >{{ item.corner }}</span
          >
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
  created(){
    console.log(this.datas,'--------graphicnavigation')
  }
}
</script>

<style scoped lang="less">
.graphicnavigation {
  position: relative;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  /* 默认导航 */
  .defaultNavigation {
    // overflow-x: scroll;
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
      /* 图片包裹层 */
      .img-box {
        position: relative;
        margin-top: 5px;
        width: 45px;
        height: 45px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      /* F11：角标基础样式 */
      .corner-badge {
        position: absolute;
        top: -6px;
        right: -6px;
        min-width: 16px;
        height: 16px;
        line-height: 16px;
        padding: 0 4px;
        border-radius: 8px;
        font-size: 10px;
        color: #fff;
        text-align: center;
        transform: scale(0.85);
        transform-origin: right top;
        z-index: 2;
      }
      /* HOT 红色 */
      .corner-hot {
        background: #ee0a24;
      }
      /* NEW 橙色 */
      .corner-new {
        background: #ff8c00;
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
    /* F11：大图卡片模式 */
    &.card-mode {
      padding: 8px;
      box-sizing: border-box;
      /* 卡片模式强制换行，保证两列大图卡片正常排布 */
      flex-wrap: wrap !important;
      display: flex !important;
      overflow-x: hidden !important;
    }
    .navigationList.card-item {
      padding: 6px;
      box-sizing: border-box;
      .img-box {
        width: 100%;
        height: 90px;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      p {
        margin-top: 8px;
      }
    }
  }
}
</style>
