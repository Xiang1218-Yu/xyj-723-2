<template>
  <div class="storenotecard">
    <!-- 更多 -->
    <div class="more1">
      <h4>{{ datas.name }}</h4>
      <p v-show="datas.viewMore1">查看更多 <van-icon name="arrow" /></p>
    </div>

    <!-- F14 新增：按 articleList 渲染的文章卡片预览（有数据时显示，与原 imageList 渲染并存） -->
    <section
      class="articlePreview"
      v-if="datas.articleList && datas.articleList.length"
    >
      <div
        class="articleCard"
        v-for="(item, index) in datas.articleList"
        :key="index"
        :style="{ 'border-radius': datas.borderRadius + 'px' }"
      >
        <!-- 多图：1 图大图，多图九宫格/横排 -->
        <div
          class="articleImgs"
          v-if="item.images && item.images.length"
          :class="[item.images.length === 1 ? 'single' : 'grid']"
        >
          <div
            class="articleImgItem"
            v-for="(img, imgIdx) in item.images"
            :key="imgIdx"
          >
            <img
              draggable="false"
              :src="img"
              alt=""
              :style="{ 'border-radius': datas.borderRadius + 'px' }"
            />
          </div>
        </div>

        <!-- 标题（应用文本粗细） -->
        <h5 class="articleTitle" :style="{ 'font-weight': datas.textWeight }">
          {{ item.title }}
        </h5>

        <!-- 标签（小圆角标签） -->
        <div class="articleLabels" v-if="item.labels && item.labels.length">
          <span
            class="articleLabel"
            v-for="(label, labelIdx) in item.labels"
            :key="labelIdx"
          >
            {{ label }}
          </span>
        </div>

        <!-- 底部：作者 + 阅读数/点赞数 -->
        <div class="articleFooter">
          <!-- 作者（authorEditable 为真时显示） -->
          <div class="articleAuthor" v-if="datas.authorEditable">
            <img
              v-if="item.authorAvatar"
              :src="item.authorAvatar"
              alt=""
              draggable="false"
            />
            <span>{{ item.author }}</span>
          </div>
          <span v-else></span>
          <!-- 阅读数/点赞数 -->
          <div class="articleStat">
            <span class="stat" v-if="datas.readingNumber"
              >{{ item.readCount }} 阅读</span
            >
            <span class="stat" v-if="datas.praisePoints">
              <van-icon name="good-job-o" /> {{ item.praiseCount }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- 没有视频展示默认 -->
    <section
      v-show="!datas.imageList[0]"
      :class="[datas.commodityType === 2 ? 'defaultcommodityList2' : '']"
      class="defaultcommodity"
    >
      <div
        v-for="index in 3"
        :key="index"
        class="defaultcommodityList"
        :class="[
          datas.commodityType === 0 ? 'defaultcommodityList0' : '',
          datas.commodityType === 1 ? 'defaultcommodityList1' : '',
          datas.commodityType === 2 ? 'defaultcommodityList2' : '',
          datas.commodityType === 3 ? 'defaultcommodityList3' : '',
          datas.commodityType === 4 ? 'defaultcommodityList4' : '',
          datas.commodityType === 5 ? 'defaultcommodityList5' : '',
        ]"
        :style="{
          'border-radius': datas.borderRadius + 'px',
          border: datas.moditystyle === 2 ? '1px solid rgba(50,50,51,0.1)' : '',
          'box-shadow':
            datas.moditystyle === 1 ? '0 2px 8px rgba(93,113,127,0.08)' : '',
          width:
            datas.commodityType === 1
              ? 50 - datas.commodityMargin / 6 + '%'
              : datas.commodityType === 2
              ? 33 - datas.commodityMargin / 5 + '%'
              : datas.commodityType === 4
              ? 50 - datas.commodityMargin / 5 + '%'
              : '',
        }"
      >
        <!-- 视频图片 -->
        <div
          class="imgss"
          style="position: relative; width: 100%"
          :class="[datas.positions === 'top' ? 'containoptions' : '']"
        >
          <img draggable="false" src="../../../assets/images/imgs.png" alt="" />
          <!-- 标签 -->
          <p class="marks" v-if="datas.noteLabels"><span>#</span>笔记标签</p>
        </div>

        <!-- 文字内容 -->
        <div
          class="text"
          :class="[datas.positions === 'top' ? 'positionsTop' : '']"
          :style="{ background: datas.moditystyle !== 3 ? '#fff' : 'none' }"
        >
          <!-- 视频名称 -->
          <h5>这里显示商品名称，最多显示2行</h5>
          <!-- 点赞和阅读量 -->
          <div class="dianz">
            <span class="fir" v-if="datas.readingNumber">999 阅读</span>
            <span v-else></span>
            <span v-show="datas.praisePoints"
              ><van-icon name="good-job-o" /> 999</span
            >
          </div>
        </div>
      </div>
    </section>

    <section
      v-show="datas.imageList[0]"
      :class="[datas.commodityType === 2 ? 'defaultcommodityList2' : '']"
      class="defaultcommodity"
    >
      <div
        v-for="(item, index) in datas.imageList"
        :key="index"
        class="defaultcommodityList"
        :class="[
          datas.commodityType === 0 ? 'defaultcommodityList0' : '',
          datas.commodityType === 1 ? 'defaultcommodityList1' : '',
          datas.commodityType === 2 ? 'defaultcommodityList2' : '',
          datas.commodityType === 3 ? 'defaultcommodityList3' : '',
          datas.commodityType === 4 ? 'defaultcommodityList4' : '',
          datas.commodityType === 5 ? 'defaultcommodityList5' : '',
        ]"
        :style="{
          'border-radius': datas.borderRadius + 'px',
          border: datas.moditystyle === 2 ? '1px solid rgba(50,50,51,0.1)' : '',
          'box-shadow':
            datas.moditystyle === 1 ? '0 2px 8px rgba(93,113,127,0.08)' : '',
          width:
            datas.commodityType === 1
              ? 50 - datas.commodityMargin / 6 + '%'
              : datas.commodityType === 2
              ? 33 - datas.commodityMargin / 5 + '%'
              : datas.commodityType === 4
              ? 50 - datas.commodityMargin / 5 + '%'
              : '',
        }"
      >
        <!-- 视频图片 -->
        <div
          class="imgss"
          style="position: relative; width: 100%"
          :class="[datas.positions === 'top' ? 'containoptions' : '']"
        >
          <img draggable="false" :src="item.src" alt="" />
          <!-- 标签 -->
          <p class="marks" v-if="datas.noteLabels"><span>#</span>笔记标签</p>
        </div>

        <!-- 文字内容 -->
        <div
          class="text"
          :class="[datas.positions === 'top' ? 'positionsTop' : '']"
          :style="{ background: datas.moditystyle !== 3 ? '#fff' : 'none' }"
        >
          <!-- 视频名称 -->
          <h5>{{ item.text }}</h5>
          <!-- 点赞和阅读量 -->
          <div class="dianz">
            <span class="fir" v-if="datas.readingNumber">999 阅读</span>
            <span v-else></span>
            <span v-show="datas.praisePoints"
              ><van-icon name="good-job-o" /> 999</span
            >
          </div>
        </div>
      </div>
    </section>

    <p class="more2" v-show="datas.viewMore2">
      查看更多 <van-icon name="arrow" />
    </p>

    <!-- 删除组件 -->
    <slot name="deles" />
  </div>
</template>

<script>
export default {
  name: 'storenotecard',
  props: {
    datas: Object,
  },
  data() {
    return {
      active: 0,
    }
  },

  created() {},

  methods: {},
}
</script>

<style scoped lang="less">
.storenotecard {
  position: relative;

  /* F14 新增：文章卡片预览样式 */
  .articlePreview {
    padding: 0 15px;
    box-sizing: border-box;
    .articleCard {
      margin-bottom: 15px;
      padding: 10px;
      background: #fff;
      box-shadow: 0 2px 8px rgba(93, 113, 127, 0.08);
      overflow: hidden;
      /* 多图容器 */
      .articleImgs {
        margin-bottom: 8px;
        /* 单图大图 */
        &.single {
          .articleImgItem {
            width: 100%;
            img {
              width: 100%;
              display: block;
            }
          }
        }
        /* 多图九宫格 */
        &.grid {
          display: flex;
          flex-wrap: wrap;
          margin: -2px;
          .articleImgItem {
            width: calc(33.33% - 4px);
            margin: 2px;
            img {
              width: 100%;
              height: 90px;
              object-fit: cover;
              display: block;
            }
          }
        }
      }
      /* 标题 */
      .articleTitle {
        font-size: 14px;
        line-height: 20px;
        margin: 0 0 8px;
        color: #323233;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      /* 标签 */
      .articleLabels {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 8px;
        .articleLabel {
          font-size: 11px;
          color: #155bd4;
          background: #e0edff;
          border-radius: 4px;
          padding: 2px 6px;
          margin: 2px 6px 2px 0;
        }
      }
      /* 底部作者 + 数据 */
      .articleFooter {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .articleAuthor {
          display: flex;
          align-items: center;
          font-size: 12px;
          color: #646566;
          img {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            margin-right: 6px;
          }
        }
        .articleStat {
          display: flex;
          align-items: center;
          .stat {
            font-size: 12px;
            color: #969799;
            display: flex;
            align-items: center;
            margin-left: 12px;
            .van-icon-good-job-o {
              margin-right: 4px;
            }
          }
        }
      }
    }
  }

  /* 更多1 */
  .more1 {
    margin: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    h4 {
      font-size: 16px;
      color: #323233;
      font-weight: 400;
      width: 270px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    p {
      color: #969799;
      font-size: 12px;
      display: flex;
      align-items: center;
    }
  }

  /* 更多2 */
  .more2 {
    text-align: center;
    color: #969799;
    font-size: 12px;
    margin-bottom: 15px;
  }

  /* 默认商品 */
  .defaultcommodity {
    box-sizing: border-box;
    margin: 1px;
    padding: 0 15px;
    /* 横向滑动 */
    &.defaultcommodityList2 {
      overflow: scroll;
      display: flex;
      /* 滚动条 */
      &::-webkit-scrollbar {
        height: 1px;
      }
      &::-webkit-scrollbar-thumb {
        background-color: #155bd4;
      }
      :deep(.el-collapse-item__header),
      :deep(.el-collapse-item__wrap) {
        border-bottom: 0 !important;
      }
    }
    /* 卡片列表 */
    .defaultcommodityList {
      position: relative;
      margin-bottom: 15px;
      overflow: hidden;
      display: inline-flex;
      flex-direction: column;

      /* 大图模式 */
      &.defaultcommodityList0 {
        width: 100%;
        /* 标签 */
        .containoptions {
          .marks {
            bottom: 33px;
            z-index: 3;
          }
        }
        img {
          height: 147px;
        }
        /* 文字在图片中 */
        .positionsTop {
          position: absolute;
          display: flex;
          flex-direction: column-reverse;
          left: 0;
          bottom: 0;
          background: none !important;
          background-image: linear-gradient(
            to bottom,
            transparent,
            rgba(0, 0, 0, 0.5)
          ) !important;
          /* 标题 */
          h5 {
            color: #fff;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          span {
            color: #fff;
          }
          /* 点赞和阅读量 */
          .dianz {
            padding-left: 190px;
          }
        }
      }

      /* 一行两个 */
      &.defaultcommodityList1 {
        width: 48%;
        &:nth-of-type(even) {
          margin-left: 4%;
        }
      }

      /* 横向滑动 */
      &.defaultcommodityList2 {
        width: 150px;
        flex: none;
        margin-right: 5%;
      }

      /* 一大两小 */
      &.defaultcommodityList3 {
        display: flex;
        &:nth-of-type(3n-2) {
          margin-bottom: 0 !important;
          .marks {
            bottom: 33px;
            z-index: 3;
          }
          img {
            height: 147px;
          }
          /* 文字在图片中 */
          .text {
            position: absolute;
            display: flex;
            flex-direction: column-reverse;
            left: 0;
            bottom: 0;
            background: none !important;
            background-image: linear-gradient(
              to bottom,
              transparent,
              rgba(0, 0, 0, 0.5)
            ) !important;
            /* 标题 */
            h5 {
              color: #fff;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            span {
              color: #fff;
            }
            /* 点赞和阅读量 */
            .dianz {
              padding-left: 190px;
            }
          }
        }
        &:nth-of-type(3n) {
          flex-direction: row-reverse;
          margin-bottom: 15px;
          .imgss {
            width: 65px !important;
            height: 67px;
            z-index: 99;
            position: absolute !important;
            top: 10%;
            right: 10px;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .marks {
            left: 0;
            background: #fff;
            opacity: 0.85;
            bottom: 0;
          }
          .text {
            width: 100%;
            padding: 10px 80px 10px 10px;
            min-height: 87px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            .dianz {
              justify-content: start;
              line-height: 20px;
              span {
                &.fir {
                  margin-right: 30px;
                }
              }
            }
          }
        }
        &:nth-of-type(3n-1) {
          flex-direction: row-reverse;
          margin-bottom: 0;
          border-bottom: 1px solid #e5e5e5;
          border-top: 1px solid #e5e5e5;
          .marks {
            left: 0;
            bottom: 0;
            background: #fff;
            opacity: 0.85;
          }
          .imgss {
            width: 65px !important;
            height: 67px;
            z-index: 99;
            position: absolute !important;
            top: 10%;
            right: 10px;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .text {
            width: 100%;
            padding: 10px 80px 10px 10px;
            min-height: 87px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .dianz {
              justify-content: start;
              line-height: 20px;
              span {
                &.fir {
                  margin-right: 30px;
                }
              }
            }
          }
        }
        &:nth-of-type(3n) {
          flex-direction: row-reverse;
        }
      }

      /* 详细列表 */
      &.defaultcommodityList4 {
        width: 100%;
        flex-direction: row-reverse;
        margin-bottom: 15px;
        .imgss {
          width: 120px !important;
          height: 122px;
          z-index: 99;
          position: absolute !important;
          top: 8%;
          right: 10px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .marks {
          left: 0;
          background: #fff;
          opacity: 0.85;
          bottom: 0;
        }
        .text {
          width: 100%;
          padding: 10px 160px 10px 10px;
          min-height: 145px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          .dianz {
            justify-content: start;
            line-height: 20px;
            span {
              &.fir {
                margin-right: 30px;
              }
            }
          }
        }
      }

      /* 标签 */
      .marks {
        position: absolute;
        bottom: 10px;
        left: 13px;
        font-size: 10px;
        padding: 2px 5px;
        background: #fff;
        opacity: 0.85;
        border-radius: 3px;
        span {
          color: #d40;
        }
      }

      /* 图片 */
      img {
        width: 100%;
        display: block;
        overflow: hidden;
      }

      /* 文字 */
      .text {
        padding: 10px 10px 0;
        width: 100%;
        box-sizing: border-box;
        /* 商品名称 */
        h5 {
          font-size: 14px;
          line-height: 20px;
          margin: 0 0 5px;
          font-weight: 400;
          width: 100%;
          display: -webkit-box;
          text-overflow: ellipsis;
          overflow: hidden;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        /* 点赞和阅读量 */
        .dianz {
          display: flex;
          justify-content: space-between;
          line-height: 35px;
          span {
            font-size: 12px;
            display: flex;
            align-items: center;
            .van-icon-good-job-o {
              margin-right: 5px;
            }
          }
        }
      }
    }
  }
}
</style>
