<template>
  <div id="follow">
    <div class="follow-box">
      <div class="follow-pic">
        <img :src="datas.heade" alt="" />
      </div>
      <div class="follow-info">
        <span class="follow-name">{{ datas.followName }}</span>
        <!-- #13 公众号简介 -->
        <p v-if="datas.intro" class="follow-intro">{{ datas.intro }}</p>
      </div>
      <div class="follow-right">
        <!-- #13 关注按钮可切换状态 -->
        <van-button
          v-if="!datas.followed"
          color="#07C160"
          size="small"
          @click.stop="toggleFollow"
        >
          关注公众号
        </van-button>
        <van-button
          v-else
          color="#f2f3f5"
          size="small"
          @click.stop="toggleFollow"
        >
          <span style="color: #969799">已关注</span>
        </van-button>
      </div>
    </div>

    <!-- #13 历史文章列表 -->
    <div v-if="datas.showHistory && datas.historyArticles.length" class="history-list">
      <div
        v-for="(article, idx) in displayArticles"
        :key="idx"
        class="history-item"
      >
        <span class="history-title">{{ article.title || '文章标题' }}</span>
        <span class="history-date">{{ article.date }}</span>
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
  computed: {
    // #13 展示历史文章（最多5条，长度校验）
    displayArticles() {
      if (!Array.isArray(this.datas.historyArticles)) return []
      return this.datas.historyArticles.slice(0, 5)
    },
  },
  methods: {
    // #13 切换关注状态
    toggleFollow() {
      this.datas.followed = !this.datas.followed
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
      .follow-name {
        font-weight: 500;
      }
      /* #13 简介样式 */
      .follow-intro {
        margin: 4px 0 0;
        font-size: 12px;
        color: #969799;
        line-height: 1.4;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  /* #13 历史文章列表 */
  .history-list {
    margin-top: 8px;
    border: 1px solid #eee;
    border-radius: 5px;
    overflow: hidden;
    .history-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      font-size: 13px;
      border-bottom: 1px solid #f5f5f5;
      &:last-child {
        border-bottom: none;
      }
      .history-title {
        color: #323233;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        flex: 1;
        margin-right: 8px;
      }
      .history-date {
        color: #c8c9cc;
        font-size: 11px;
        flex-shrink: 0;
      }
    }
  }
}
</style>
