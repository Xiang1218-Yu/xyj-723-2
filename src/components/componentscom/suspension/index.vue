<template>
  <div id="suspension" :style="fabWrapStyle">
    <!-- #10 FAB展开菜单 -->
    <div v-if="datas.fabExpand && menuOpen" class="fab-menu">
      <div
        v-for="(item, idx) in datas.fabMenu"
        :key="idx"
        class="fab-menu-item"
      >
        <span class="fab-menu-text">{{ item.text }}</span>
        <div class="fab-menu-icon">
          <van-icon :name="item.icon" />
        </div>
      </div>
    </div>
    <div class="suspension-wrap" :style="fabStyle" @click="toggleMenu">
      <img class="suspension-logo" :src="datas.iconUrl || defaultIcon" />
    </div>
    <!-- 删除组件 -->
    <slot name="deles" />
  </div>
</template>
<script>
export default {
  name: 'suspension',
  props: {
    datas: Object,
  },
  data() {
    return {
      menuOpen: false,
      defaultIcon:
        'https://imgs.starfirelink.com/vue-fire-start-h5/shop-peison/icon_back_36.png',
    }
  },
  computed: {
    // #10 外层位置（支持方位选择与偏移）
    fabWrapStyle() {
      const pos = this.datas.position || 'right-bottom'
      const ox = Number(this.datas.offsetX) || 0
      const oy = Number(this.datas.offsetY) || 0
      const style = {
        position: 'absolute',
        zIndex: 999,
        opacity: this.datas.opacity != null ? this.datas.opacity : 1,
      }
      if (pos.includes('bottom')) {
        style.bottom = 10 + oy + '%'
      } else {
        style.top = 10 + oy + '%'
      }
      if (pos.includes('right')) {
        style.right = 30 - ox + 'px'
        style.left = 'auto'
      } else {
        style.left = 30 - ox + 'px'
        style.right = 'auto'
      }
      return style
    },
    // #10 按钮本体样式
    fabStyle() {
      return {
        opacity: this.datas.opacity != null ? this.datas.opacity : 1,
      }
    },
  },
  methods: {
    // #10 展开/收起菜单
    toggleMenu() {
      if (this.datas.fabExpand) {
        this.menuOpen = !this.menuOpen
      }
    },
  },
}
</script>
<style lang="less" scoped>
#suspension {
  width: auto;
  height: auto;
  position: absolute;
  z-index: 999;
  border: none;
  box-sizing: border-box;
  .suspension-wrap {
    width: 36px;
    height: 36px;
    cursor: pointer;
    .suspension-logo {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: block;
    }
  }
  /* #10 FAB展开菜单 */
  .fab-menu {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
    margin-bottom: 8px;
  }
  .fab-menu-item {
    display: flex;
    align-items: center;
    gap: 6px;
    .fab-menu-text {
      background: rgba(0, 0, 0, 0.65);
      color: #fff;
      font-size: 12px;
      padding: 2px 8px;
      border-radius: 10px;
      white-space: nowrap;
    }
    .fab-menu-icon {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      color: #155bd4;
    }
  }
}
</style>
