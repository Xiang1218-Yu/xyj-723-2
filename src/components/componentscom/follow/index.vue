<template>
  <div id="follow">
    <div class="follow-box">
      <div class="follow-pic">
        <img :src="datas.heade" alt="" />
      </div>
      <div class="follow-info">
        <span>{{ datas.followName }}</span>
        <!-- 公众号简介 -->
        <p v-if="datas.showDescription && datas.description" class="follow-desc">
          {{ datas.description }}
        </p>
      </div>
      <div class="follow-right">
        <!-- 关注按钮，根据isFollowed显示不同文案和样式 -->
        <van-button
          :color="datas.isFollowed ? '#cccccc' : '#07C160'"
          @click="toggleFollow"
        >
          {{ datas.isFollowed ? datas.followedBtnText : datas.followBtnText }}
        </van-button>
      </div>
    </div>

    <!-- 历史文章列表 -->
    <div v-if="datas.showHistoryArticles && displayedArticles.length > 0" class="history-articles">
      <div
        v-for="(article, index) in displayedArticles"
        :key="index"
        class="article-item"
      >
        <div class="article-title">{{ article.title }}</div>
        <div class="article-date">{{ article.date }}</div>
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
    // 显示的文章列表，根据articleCount截取
    displayedArticles() {
      if (!this.datas.historyArticles || !Array.isArray(this.datas.historyArticles)) {
        return []
      }
      return this.datas.historyArticles.slice(0, this.datas.articleCount || 3)
    },
  },
  methods: {
    // 切换关注状态
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
      .follow-desc {
        margin-top: 5px;
        font-size: 12px;
        color: #999;
        line-height: 1.4;
      }
    }
    .follow-right {
      flex-shrink: 0;
    }
  }
  // 历史文章列表样式
  .history-articles {
    margin-top: 10px;
    border: 1px solid #eee;
    border-radius: 5px;
    padding: 10px;
    background: #fafafa;
    .article-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #f0f0f0;
      &:last-child {
        border-bottom: none;
      }
      .article-title {
        flex: 1;
        font-size: 13px;
        color: #333;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-right: 10px;
      }
      .article-date {
        font-size: 11px;
        color: #999;
        flex-shrink: 0;
      }
    }
  }
}
</style>
