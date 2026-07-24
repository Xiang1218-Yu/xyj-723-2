<template>
  <div class="notice">
    <!-- #6 多条滚动模式：垂直滚动列表 -->
    <div
      v-if="datas.multiLine && datas.noticeList && datas.noticeList.length"
      class="notice-multi"
      :style="{
        background: datas.backColor,
        color: datas.textColor,
      }"
    >
      <!-- 前导图标 (#6) -->
      <van-icon
        v-if="datas.leadingIcon"
        :name="datas.leadingIcon"
        class="notice-leading-icon"
      />
      <div class="notice-scroll-wrap">
        <div
          class="notice-scroll-inner"
          :class="datas.direction === 'up' ? 'scroll-up' : 'scroll-left'"
          :style="scrollStyle"
        >
          <template v-if="datas.direction === 'up'">
            <div
              v-for="(item, idx) in displayList"
              :key="idx"
              class="notice-item"
            >
              {{ item }}
            </div>
          </template>
          <template v-else>
            <span
              v-for="(item, idx) in displayList"
              :key="idx"
              class="notice-item-inline"
            >
              {{ item }}<span v-if="idx < displayList.length - 1" class="sep"
                >&nbsp;&nbsp;</span
              >
            </span>
          </template>
        </div>
      </div>
    </div>

    <!-- 单条公告（原有） -->
    <van-notice-bar
      v-else
      :text="datas.noticeText"
      :left-icon="datas.leadingIcon || 'volume-o'"
      :background="datas.backColor"
      :color="datas.textColor"
      :scrollable="datas.direction !== 'up'"
    />

    <!-- 删除组件 -->
    <slot name="deles" />
  </div>
</template>

<script>
export default {
  name: 'notice',
  props: {
    datas: Object,
  },
  computed: {
    // #6 展示列表（克隆一份用于无缝滚动）
    displayList() {
      const list = Array.isArray(this.datas.noticeList)
        ? this.datas.noticeList.filter((t) => typeof t === 'string' && t.length)
        : []
      // 长度校验：最多展示20条
      return list.slice(0, 20).concat(list.slice(0, 20))
    },
    // #6 滚动速度转换为动画时长
    scrollStyle() {
      if (this.datas.direction === 'up') {
        const speed = Number(this.datas.speed) || 50
        const duration = Math.max(20, 100 - speed) * 0.3
        return {
          animationDuration: duration + 's',
        }
      } else {
        const speed = Number(this.datas.speed) || 50
        const duration = Math.max(5, 50 - speed / 2)
        return {
          animationDuration: duration + 's',
        }
      }
    },
  },
}
</script>

<style scoped lang="less">
.notice {
  position: relative;
  overflow: hidden;
}
/* #6 多条公告容器 */
.notice-multi {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  font-size: 14px;
  overflow: hidden;
  position: relative;
  height: 36px;
  box-sizing: border-box;
}
.notice-leading-icon {
  margin-right: 8px;
  font-size: 16px;
  flex-shrink: 0;
}
.notice-scroll-wrap {
  flex: 1;
  overflow: hidden;
  height: 20px;
  position: relative;
}
.notice-scroll-inner {
  display: flex;
  flex-direction: column;
}
.notice-item {
  height: 20px;
  line-height: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
/* 垂直滚动动画 */
.scroll-up {
  animation: noticeScrollUp linear infinite;
}
@keyframes noticeScrollUp {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-50%);
  }
}
/* 横向滚动 */
.scroll-left {
  flex-direction: row !important;
  white-space: nowrap;
  animation: noticeScrollLeft linear infinite;
  width: max-content;
}
.notice-item-inline {
  display: inline-block;
}
@keyframes noticeScrollLeft {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
</style>
