<template>
  <div id="suspension">
    <div
      class="suspension-wrap"
      :style="mainBtnStyle"
      @click="handleMainClick"
    >
      <img
        v-if="datas.iconUrl"
        class="suspension-logo"
        :src="datas.iconUrl"
        :style="logoStyle"
      />
      <van-icon
        v-else
        name="plus"
        class="default-icon"
        :style="{ fontSize: (datas.btnSize || 48) / 2 + 'px' }"
      />
    </div>

    <!-- FAB子菜单 -->
    <div
      v-if="datas.fabEnabled && fabExpanded && datas.fabItems && datas.fabItems.length > 0"
      class="fab-items"
      :class="'fab-' + (datas.fabDirection || 'up')"
    >
      <div
        v-for="(item, index) in datas.fabItems"
        :key="index"
        class="fab-item"
        @click="handleFabItemClick(item)"
      >
        <span class="fab-text" v-if="item.text">{{ item.text }}</span>
        <div class="fab-icon" :style="{ width: (datas.btnSize || 48) * 0.8 + 'px', height: (datas.btnSize || 48) * 0.8 + 'px' }">
          <van-icon
            v-if="item.icon"
            :name="item.icon"
            :style="{ fontSize: (datas.btnSize || 48) * 0.4 + 'px' }"
          />
        </div>
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
      fabExpanded: false,
    }
  },
  computed: {
    /* 主按钮样式 */
    mainBtnStyle() {
      const btnSize = this.datas.btnSize || 48
      return {
        width: btnSize + 'px',
        height: btnSize + 'px',
        right: (this.datas.positionX || 30) + 'px',
        bottom: (this.datas.positionY || 10) + '%',
        transform: `translate(${this.datas.offsetX || 0}px, ${this.datas.offsetY || 0}px)`,
        opacity: this.datas.opacity !== undefined ? this.datas.opacity : 1,
        'border-radius': this.datas.borderRadius || '50%',
      }
    },
    /* Logo图标样式 */
    logoStyle() {
      const btnSize = this.datas.btnSize || 48
      return {
        width: btnSize + 'px',
        height: btnSize + 'px',
        'border-radius': this.datas.borderRadius || '50%',
      }
    },
  },
  methods: {
    /* 主按钮点击 */
    handleMainClick() {
      if (this.datas.fabEnabled) {
        this.fabExpanded = !this.fabExpanded
      } else {
        this.navigateTo(this.datas)
      }
    },
    /* FAB子项点击 */
    handleFabItemClick(item) {
      this.fabExpanded = false
      this.navigateTo(item)
    },
    /* 页面跳转 */
    navigateTo(item) {
      if (item && item.linktype && item.http && item.http.externalLink) {
        const link = item.http.externalLink
        /* URL格式校验 */
        if (/^https?:\/\//.test(link)) {
          window.location.href = link
        }
      }
    },
  },
}
</script>
<style lang="less" scoped>
#suspension {
  width: 100%;
  position: relative;
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 999;
  border: none;
  box-sizing: border-box;
  pointer-events: none;

  .suspension-wrap {
    position: absolute;
    z-index: 1001;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #1989fa;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
    pointer-events: auto;
    transition: all 0.3s;

    &:hover {
      transform: scale(1.05);
    }

    .suspension-logo {
      display: block;
      object-fit: cover;
    }

    .default-icon {
      color: #fff;
    }
  }

  /* FAB子菜单 */
  .fab-items {
    position: absolute;
    display: flex;
    pointer-events: auto;
    z-index: 1000;

    &.fab-up {
      flex-direction: column-reverse;
      right: 30px;
      bottom: calc(10% + 60px);
    }

    &.fab-down {
      flex-direction: column;
      right: 30px;
      bottom: calc(10% - 60px);
    }

    &.fab-left {
      flex-direction: row-reverse;
      right: calc(30px + 60px);
      bottom: 10%;
      align-items: center;
    }

    &.fab-right {
      flex-direction: row;
      right: calc(30px - 60px);
      bottom: 10%;
      align-items: center;
    }

    .fab-item {
      display: flex;
      align-items: center;
      margin: 4px 0;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        transform: scale(1.05);
      }

      .fab-text {
        background: rgba(0, 0, 0, 0.7);
        color: #fff;
        padding: 4px 12px;
        border-radius: 4px;
        font-size: 12px;
        margin-right: 8px;
        white-space: nowrap;
      }

      .fab-icon {
        background: #fff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        color: #1989fa;
      }
    }

    &.fab-left .fab-item,
    &.fab-right .fab-item {
      margin: 0 4px;
    }
  }
}
</style>
