<template>
  <!-- F10 增强：悬浮按钮支持四角定位、偏移、透明度、FAB 展开菜单 -->
  <div
    id="suspension"
    :style="wrapStyle"
  >
    <div class="suspension-wrap">
      <!-- FAB 展开的子菜单，沿 fabDirection 方向排列，带过渡动画 -->
      <transition-group
        v-if="datas.fabMode"
        :name="'fab-' + (datas.fabDirection || 'up')"
        tag="div"
        class="fab-menu"
        :class="'fab-menu--' + (datas.fabDirection || 'up')"
      >
        <div
          class="fab-item"
          v-for="(menu, mIndex) in datas.menuList"
          v-show="fabOpen"
          :key="mIndex"
        >
          <!-- 子按钮图标：图片链接显示 img，否则按 iconfont 类名显示 -->
          <div class="fab-item-icon">
            <img
              v-if="isImg(menu.icon)"
              :src="menu.icon"
              draggable="false"
              alt=""
            />
            <i v-else-if="menu.icon" class="iconfont" :class="menu.icon" />
          </div>
          <!-- 子项文字 -->
          <span class="fab-item-text" v-if="menu.text">{{ menu.text }}</span>
        </div>
      </transition-group>

      <!-- 主按钮 -->
      <div class="suspension-main" @click="handleMainClick">
        <!-- mainIcon 有值时显示：图片或 iconfont，否则显示默认图标 -->
        <img
          v-if="isImg(datas.mainIcon)"
          class="suspension-logo"
          :src="datas.mainIcon"
          draggable="false"
        />
        <i
          v-else-if="datas.mainIcon"
          class="iconfont suspension-icon"
          :class="datas.mainIcon"
        />
        <img
          v-else
          class="suspension-logo"
          src="https://imgs.starfirelink.com/vue-fire-start-h5/shop-peison/icon_back_36.png"
        />
      </div>
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
      // FAB 菜单是否展开
      fabOpen: false,
    }
  },
  computed: {
    // 根据 position/offsetX/offsetY/opacity 计算悬浮按钮定位样式
    wrapStyle() {
      const pos = this.datas.position || 'right-bottom'
      // 偏移量兜底并按范围约束
      const offsetX = Math.min(Math.max(Number(this.datas.offsetX) || 0, 0), 200)
      const offsetY = Math.min(Math.max(Number(this.datas.offsetY) || 0, 0), 400)
      // 透明度 0-100 转 0-1
      const opacity = Math.min(Math.max(Number(this.datas.opacity), 0), 100)
      const style = {
        opacity: (isNaN(opacity) ? 100 : opacity) / 100,
      }
      // 根据位置将 offsetX 映射为 left/right，offsetY 映射为 top/bottom
      if (pos.indexOf('left') > -1) {
        style.left = offsetX + 'px'
        style.right = 'auto'
      } else {
        style.right = offsetX + 'px'
        style.left = 'auto'
      }
      if (pos.indexOf('top') > -1) {
        style.top = offsetY + 'px'
        style.bottom = 'auto'
      } else {
        style.bottom = offsetY + 'px'
        style.top = 'auto'
      }
      return style
    },
  },
  methods: {
    // 判断字符串是否为图片链接
    isImg(val) {
      return typeof val === 'string' && /^(https?:\/\/|data:image|\/)/.test(val)
    },
    // 主按钮点击：FAB 模式下切换展开，否则保持原单按钮行为
    handleMainClick() {
      if (this.datas.fabMode) {
        this.fabOpen = !this.fabOpen
      }
      // 非 FAB 模式：保持原有单按钮行为（此处不做额外跳转，交由外层逻辑）
    },
  },
}
</script>
<style lang="less" scoped>
#suspension {
  width: 36px;
  height: 36px;
  position: absolute;
  right: 30px;
  bottom: 10%;
  z-index: 999;
  border: none;
  box-sizing: border-box;
  .suspension-wrap {
    width: 36px;
    height: 36px;
    position: relative;
    z-index: 1001;
    .suspension-main {
      width: 36px;
      height: 36px;
      cursor: pointer;
    }
    .suspension-logo {
      width: 36px;
      height: 36px;
      border-radius: 50%;
    }
    /* 主按钮 iconfont 图标 */
    .suspension-icon {
      width: 36px;
      height: 36px;
      line-height: 36px;
      text-align: center;
      display: inline-block;
      font-size: 30px;
      border-radius: 50%;
      background: #155bd4;
      color: #fff;
    }
  }
  /* FAB 展开子菜单容器 */
  .fab-menu {
    position: absolute;
    display: flex;
    align-items: center;
    /* 向上展开 */
    &--up {
      flex-direction: column-reverse;
      bottom: 44px;
      left: 0;
    }
    /* 向下展开 */
    &--down {
      flex-direction: column;
      top: 44px;
      left: 0;
    }
    /* 向左展开 */
    &--left {
      flex-direction: row-reverse;
      right: 44px;
      top: 0;
    }
    /* 向右展开 */
    &--right {
      flex-direction: row;
      left: 44px;
      top: 0;
    }
    /* 单个子项 */
    .fab-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 4px;
      .fab-item-icon {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: #fff;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
        .iconfont {
          font-size: 20px;
          color: #155bd4;
        }
      }
      .fab-item-text {
        font-size: 10px;
        color: #323233;
        margin-top: 2px;
        white-space: nowrap;
      }
    }
  }
}
/* FAB 简单过渡动画 */
.fab-up-enter-active,
.fab-up-leave-active,
.fab-down-enter-active,
.fab-down-leave-active,
.fab-left-enter-active,
.fab-left-leave-active,
.fab-right-enter-active,
.fab-right-leave-active {
  transition: all 0.25s ease;
}
.fab-up-enter-from,
.fab-up-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
.fab-down-enter-from,
.fab-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.fab-left-enter-from,
.fab-left-leave-to {
  opacity: 0;
  transform: translateX(10px);
}
.fab-right-enter-from,
.fab-right-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
</style>
