<template>
  <div class="notice">
    <!-- 公告 - 单条模式 -->
    <van-notice-bar
      v-if="!datas.multiMode"
      :text="datas.noticeText"
      :left-icon="datas.showLeadIcon ? datas.leadIcon : ''"
      :background="datas.backColor"
      :color="datas.textColor"
      :scrollable="true"
      :direction="datas.scrollDirection || 'left'"
      :speed="datas.scrollSpeed || 50"
    />

    <!-- 公告 - 多条模式 -->
    <van-notice-bar
      v-else-if="datas.scrollDirection === 'up'"
      :left-icon="datas.showLeadIcon ? datas.leadIcon : ''"
      :background="datas.backColor"
      :color="datas.textColor"
      :scrollable="false"
    >
      <van-swipe
        vertical
        :autoplay="3000"
        :touchable="false"
        :show-indicators="false"
      >
        <van-swipe-item v-for="(item, index) in noticeList" :key="index">
          {{ item }}
        </van-swipe-item>
      </van-swipe>
    </van-notice-bar>

    <!-- 公告 - 多条模式向左滚动 -->
    <van-notice-bar
      v-else
      :left-icon="datas.showLeadIcon ? datas.leadIcon : ''"
      :background="datas.backColor"
      :color="datas.textColor"
      :scrollable="true"
      direction="left"
      :speed="datas.scrollSpeed || 50"
    >
      {{ multiNoticeText }}
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
    noticeList() {
      if (this.datas.noticeList && this.datas.noticeList.length > 0) {
        return this.datas.noticeList.filter(item => item && item.trim())
      }
      return [this.datas.noticeText || '']
    },
    multiNoticeText() {
      if (this.datas.noticeList && this.datas.noticeList.length > 0) {
        return this.datas.noticeList.filter(item => item && item.trim()).join('　　')
      }
      return this.datas.noticeText || ''
    }
  },
}
</script>

<style scoped lang="less">
.notice {
  position: relative;
  :deep(.van-swipe) {
    height: 40px;
    line-height: 40px;
  }
  :deep(.van-swipe-item) {
    line-height: 40px;
  }
}
</style>
