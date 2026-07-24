<template>
  <div id="follow">
    <div class="follow-box">
      <div class="follow-pic">
        <img :src="datas.heade" alt="" />
      </div>
      <div class="follow-info">
        <span>{{ datas.followName }}</span>
        <!-- F13 新增：简介文字（showIntro 为真时显示） -->
        <p class="follow-intro" v-if="datas.showIntro && datas.intro">
          {{ datas.intro }}
        </p>
      </div>
      <div class="follow-right">
        <!-- F13 新增：关注按钮切换（点击在关注/已关注间切换演示态 isFollowed） -->
        <van-button
          v-if="datas.showFollowBtn"
          :color="datas.isFollowed ? '#c8c9cc' : '#07C160'"
          @click="toggleFollow"
        >
          {{ datas.isFollowed ? (datas.followedBtnText || '已关注') : (datas.followBtnText || '关注') }}
        </van-button>
        <!-- 原关注公众号按钮：当不显示可切换按钮时兜底展示 -->
        <van-button v-else color="#07C160">关注公众号</van-button>
      </div>
    </div>

    <!-- F13 新增：历史文章列表（showHistory 为真且有数据时显示） -->
    <div
      class="follow-history"
      v-if="datas.showHistory && datas.historyList && datas.historyList.length"
    >
      <div
        class="history-item"
        v-for="(item, index) in datas.historyList"
        :key="index"
      >
        <!-- 封面缩略图 -->
        <div class="history-cover">
          <img v-if="item.cover" :src="item.cover" alt="" draggable="false" />
        </div>
        <!-- 文章标题 -->
        <span class="history-title">{{ item.title }}</span>
      </div>
    </div>

    <!-- 删除组件 -->
    <slot name="deles" />
  </div>
</template>

<script>
export default {
  name: 'follow',
  props: {
    datas: Object,
  },
  methods: {
    // F13 新增：切换关注状态（仅用于预览演示效果）
    toggleFollow() {
      this.datas.isFollowed = !this.datas.isFollowed
    },
  },
}
</script>

<style lang="less" scoped>
#follow {
  position: relative;
  width: 100%;
  padding: 5px 10px;
  box-sizing: border-box;
  .follow-box {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #999;
    border-radius: 5px;
    padding: 10px;
    box-sizing: border-box;
    .follow-pic {
      width: 50px;
      height: 50px;
      img {
        display: block;
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .follow-info {
      flex: 1;
      margin-left: 20px;
      font-size: 14px;
      color: #333;
      /* F13 新增：简介样式 */
      .follow-intro {
        margin-top: 4px;
        font-size: 12px;
        color: #969799;
        line-height: 16px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    }
  }

  /* F13 新增：历史文章列表样式 */
  .follow-history {
    margin-top: 8px;
    border: 1px solid #f2f4f6;
    border-radius: 5px;
    padding: 6px 10px;
    box-sizing: border-box;
    .history-item {
      display: flex;
      align-items: center;
      padding: 6px 0;
      cursor: pointer;
      border-bottom: 1px solid #f2f4f6;
      &:last-child {
        border-bottom: 0;
      }
      .history-cover {
        width: 40px;
        height: 40px;
        flex: none;
        border-radius: 4px;
        overflow: hidden;
        background: #f2f4f6;
        img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      .history-title {
        flex: 1;
        margin-left: 10px;
        font-size: 13px;
        color: #333;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
