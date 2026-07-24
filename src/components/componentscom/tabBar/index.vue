<template>
  <div class="tabBar">
    <!-- F5 改造：按 iconList 渲染底部导航，支持图标/选中态图标/徽标 -->
    <div v-if="datas.iconList.length !== 0" class="tabbar">
      <van-tabbar
        v-model="datas.Highlight"
        :fixed="false"
        :placeholder="true"
        :border="datas.isShowBorder"
        :active-color="datas.activeColor"
        :inactive-color="datas.inactiveColor"
      >
        <van-tabbar-item
          v-for="(item, index) in datas.iconList"
          :key="index"
          :name="index"
          :badge="item.badge ? item.badge : ''"
        >
          <span :style="{ 'font-size': datas.fontSize + 'px' }">{{
            item.text
          }}</span>
          <!-- F5 新增：图标渲染，高亮项优先用 activeIcon，支持图片或 vant/iconfont 图标名 -->
          <template #icon="props">
            <!-- 图片类型图标 -->
            <img
              v-if="isImg(currentIcon(item, props.active))"
              :src="currentIcon(item, props.active)"
              :style="{
                width: datas.iconWidth + 'px',
                height: datas.iconHeight + 'px',
              }"
            />
            <!-- vant/iconfont 图标名 -->
            <van-icon
              v-else-if="currentIcon(item, props.active)"
              :name="currentIcon(item, props.active)"
              :size="datas.iconWidth + 'px'"
            />
          </template>
        </van-tabbar-item>
      </van-tabbar>
    </div>

    <div v-else>
      <van-tabbar
        v-model="datas.Highlight"
        :fixed="false"
        :placeholder="true"
        :border="datas.isShowBorder"
        :active-color="datas.activeColor"
        :inactive-color="datas.inactiveColor"
      >
        <van-tabbar-item icon="search" name="home">标签</van-tabbar-item>
        <van-tabbar-item icon="home-o">标签</van-tabbar-item>
        <van-tabbar-item icon="friends-o">标签</van-tabbar-item>
        <van-tabbar-item icon="setting-o">标签</van-tabbar-item>
        <van-tabbar-item icon="setting-o">标签</van-tabbar-item>
      </van-tabbar>
    </div>

    <!-- 删除组件 -->
    <slot name="deles" />
  </div>
</template>

<script>
export default {
  name: 'tabBar',
  props: {
    datas: Object
  },
  data() {
    return {
      active: 0
    }
  },

  created() {
    console.log(this.datas, '--------------tabbar data  created')
    document.querySelector('.phone-container').style.cssText =
      'padding-bottom: 50px'
  },

  mounted() {},

  methods: {
    // F5 新增：判断图标是否为图片链接（用于区分 img 与 van-icon 渲染）
    isImg(str) {
      if (!str) return false
      return (
        /^https?:\/\//.test(str) ||
        /^data:image/.test(str) ||
        /^\/\//.test(str) ||
        /\.(png|jpe?g|gif|webp|svg)$/i.test(str)
      )
    },
    // F5 新增：根据当前是否高亮返回对应图标（高亮且有 activeIcon 时用 activeIcon）
    currentIcon(item, isActive) {
      if (isActive && item.activeIcon) return item.activeIcon
      return item.icon
    }
  },

  computed: {},

  watch: {},

  beforeDestroy() {
    document.querySelector('.phone-container').style.cssText =
      'padding-bottom: 0px'
  }
}
</script>

<style lang="less" scoped>
.tabBar {
  width: 100%;
  position: relative;
  position: absolute;
  bottom: -54px;
  left: 0px;
  z-index: 2;
}

.tabbar {
  :deep(.van-icon) {
    img {
      display: block;
    }
  }
}
</style>
