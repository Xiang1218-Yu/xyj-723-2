<template>
  <div class="notice">
    <!-- 公告 -->
    <!-- F6 新增：横向跑马灯滚动（多条公告，速度可调，前导图标可选） -->
    <van-notice-bar
      v-if="datas.direction !== 'vertical'"
      :scrollable="true"
      :speed="speedVal"
      :text="horizontalText"
      :left-icon="datas.showLeadingIcon ? datas.leadingIcon || 'volume-o' : ''"
      :background="datas.backColor"
      :color="datas.textColor"
    />

    <!-- F6 新增：纵向轮播滚动（逐条上下切换显示 noticeList） -->
    <van-notice-bar
      v-else
      :left-icon="datas.showLeadingIcon ? datas.leadingIcon || 'volume-o' : ''"
      :background="datas.backColor"
      :color="datas.textColor"
    >
      <van-swipe
        :vertical="true"
        :autoplay="verticalDelay"
        :show-indicators="false"
        :touchable="false"
        class="notice-swipe"
      >
        <van-swipe-item v-for="(item, index) in noticeShowList" :key="index">
          {{ item }}
        </van-swipe-item>
      </van-swipe>
    </van-notice-bar>

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
    // F6 新增：实际展示的公告列表，noticeList 为空时回退到原有 noticeText
    noticeShowList() {
      if (this.datas.noticeList && this.datas.noticeList.length) {
        return this.datas.noticeList
      }
      return [this.datas.noticeText]
    },
    // F6 新增：横向滚动文本，多条公告拼接展示
    horizontalText() {
      return this.noticeShowList.join('      ')
    },
    // F6 新增：滚动速度范围校验(10-200)，超出则取边界值
    speedVal() {
      let s = Number(this.datas.speed)
      if (isNaN(s)) s = 40
      if (s < 10) s = 10
      if (s > 200) s = 200
      return s
    },
    // F6 新增：纵向轮播间隔，速度越大切换越快（映射到 autoplay 毫秒）
    verticalDelay() {
      // speed(10-200) 映射到 4000ms(慢) ~ 1000ms(快) 之间
      return Math.max(1000, 5000 - this.speedVal * 20)
    },
  },
}
</script>

<style scoped lang="less">
.notice {
  position: relative;
  /* F6 新增：纵向轮播容器高度，与 notice-bar 保持一致 */
  .notice-swipe {
    height: 40px;
    line-height: 40px;
  }
}
</style>
