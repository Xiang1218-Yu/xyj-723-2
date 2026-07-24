<template>
  <div
    class="magiccube"
    :style="{
      'padding-left': datas.pageMargin + 'px',
      'padding-right': datas.pageMargin + 'px',
      /* F9 新增：通过 CSS 变量下发圆角与宽高比，供内部图片统一使用 */
      '--mc-radius': datas.borderRadius + 'px',
      '--mc-aspect': aspectRatioCss,
      /* F9修复：下发比例对应的 padding-top 百分比，供 type3-6 复杂布局撑高使用 */
      '--mc-pt': aspectPaddingTop,
    }"
  >
    <img
      draggable="false"
      v-show="!showimageList"
      src="../../../assets/images/mor.png"
      alt=""
      style="width: 100%"
    />

    <!-- 一行二个 -->
    <section
      class="buju buju0"
      v-show="datas.rubiksCubeType === 0 && showimageList"
    >
      <div
        v-for="index in 2"
        :key="index"
        class="rubiksCubeType0 rubiksCubeType"
      >
        <img
          draggable="false"
          :src="datas.imageList[index - 1].src"
          alt=""
          :style="{ padding: datas.imgMargin / 2 + 'px' }"
        />
      </div>
    </section>

    <!-- 一行三个 -->
    <section
      class="buju buju0"
      v-show="datas.rubiksCubeType === 1 && showimageList"
    >
      <div
        v-for="index in 3"
        :key="index"
        class="rubiksCubeType1 rubiksCubeType"
        :style="{
          margin: datas.imgMargin / 10 + '%',
          width: 33.33 + '%',
        }"
      >
      <!--    width: 33 - datas.imgMargin / 10 + '%', -->
        <img draggable="false" :src="datas.imageList[index - 1].src" alt="" />
      </div>
    </section>

    <!-- 一行四个 -->
    <section
      class="buju buju0"
      v-show="datas.rubiksCubeType === 2 && showimageList"
    >
      <div
        v-for="index in 4"
        :key="index"
        class="rubiksCubeType2 rubiksCubeType"
        :style="{
          margin: datas.imgMargin / 10 + '%',
          width: 25 - datas.imgMargin / 10 + '%',
        }"
      >
        <img draggable="false" :src="datas.imageList[index - 1].src" alt="" />
      </div>
    </section>

    <!-- 二左二右 -->
    <section
      class="buju buju0"
      v-show="datas.rubiksCubeType === 3 && showimageList"
    >
      <div
        v-for="index in 4"
        :key="index"
        class="rubiksCubeType3 rubiksCubeType"
      >
        <img
          draggable="false"
          :src="datas.imageList[index - 1].src"
          alt=""
          :style="{ padding: datas.imgMargin + 'px' }"
        />
      </div>
    </section>

    <!-- 一左二右 -->
    <section
      class="buju buju4"
      v-show="datas.rubiksCubeType === 4 && showimageList"
    >
      <!-- F9修复：主图为 50% 宽的 flex 项，padding-top 百分比按“行宽”解析，
           故取比例的一半(calc(pt/2))才能得到与自身宽度相符的比例 -->
      <div class="rubiksCubeType hw" :style="{ paddingTop: 'calc(' + aspectPaddingTop + ' / 2)' }">
        <img
          draggable="false"
          :src="datas.imageList[0].src"
          alt=""
          :style="{ 'padding-right': datas.imgMargin + 'px' }"
        />
      </div>
      <div style="display: inline-flex; flex-direction: column; width: 100%">
        <!-- F9修复：右列缩略图宽度=列宽，padding-top 按列宽解析，用完整比例值即得正确比例 -->
        <div
          class=" hw imgone"
          v-for="index in 2"
          :key="index"
          :style="{ paddingTop: aspectPaddingTop }"
        >
          <img
            draggable="false"
            :src="datas.imageList[index].src"
            alt=""
            :style="{ padding: datas.imgMargin + 'px'}"
          />
        </div>
      </div>
    </section>

    <!-- 一上二下 -->
    <section
      class="buju buju5"
      v-show="datas.rubiksCubeType === 5 && showimageList"
    >
      <div class="rubiksCubeType hw" :style="{ display: 'block', paddingTop: aspectPaddingTop }">
        <img
          draggable="false"
          :src="datas.imageList[0].src"
          alt=""
          :style="{ 'padding-bottom': datas.imgMargin + 'px' }"
        />
      </div>
      <div style="display: flex; width: 100%">
        <div
          class="rubiksCubeType hw imgtow"
          v-for="index in 2"
          :key="index"
          :style="{ paddingTop: 'calc(' + aspectPaddingTop + ' / 2)' }"
        >
          <img
            draggable="false"
            :src="datas.imageList[index].src"
            alt=""
            :style="{ padding: datas.imgMargin + 'px' }"
          />
        </div>
      </div>
    </section>

    <!-- 一左三右 -->
    <section
      class="buju buju4"
      v-show="datas.rubiksCubeType === 6 && showimageList"
    >
      <!-- 第一张图片 -->
      <!-- F9修复：主图为 50% 宽的 flex 项，padding-top 按行宽解析，取比例一半 -->
      <div class="rubiksCubeType hw" :style="{ paddingTop: 'calc(' + aspectPaddingTop + ' / 2)' }">
        <img
          draggable="false"
          :src="datas.imageList[0].src"
          alt=""
          :style="{ 'padding-right': datas.imgMargin + 'px' }"
        />
      </div>
      <div style="display: inline-flex; flex-direction: column; width: 100%">
        <!-- 第二张图片：宽度=右列宽，padding-top 按列宽解析，用完整比例值 -->
        <div class="rubiksCubeType hw" :style="{ paddingTop: aspectPaddingTop }">
          <img
            draggable="false"
            :src="datas.imageList[1].src"
            alt=""
            :style="{
              'padding-bottom': datas.imgMargin + 'px',
              'padding-left': datas.imgMargin + 'px',
            }"
          />
        </div>
        <!-- 底部两张：右列内各占 50% 宽，padding-top 按列宽解析，取比例一半 -->
        <div class="rubiksCubeType" style="display: flex; width: 100%">
          <div
            class="hw"
            :style="{ width: '50%', paddingTop: 'calc(' + aspectPaddingTop + ' / 2)' }"
            v-for="index in 2"
            :key="index"
          >
            <img
              draggable="false"
              :src="datas.imageList[index + 1].src"
              alt=""
              :style="{
                'padding-left': datas.imgMargin + 'px',
                'padding-top': datas.imgMargin + 'px',
              }"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- 删除组件 -->
    <slot name="deles" />
  </div>
</template>

<script>
export default {
  name: 'magiccube',
  props: {
    datas: Object,
  },
  computed: {
    // F9 新增：将 '1:1' 形式的比例转换为 css aspect-ratio 的 '1 / 1' 形式
    aspectRatioCss() {
      const ratio = this.datas.aspectRatio || '1:1'
      return ratio.replace(':', ' / ')
    },
    // F9修复：将比例 'w:h' 换算为 padding-top 百分比(h/w*100%)，
    // 供 type3-6 等使用 .hw(padding-top 撑高)的复杂布局统一应用比例，
    // 解决 aspect-ratio 仅对 type0-2 生效、复杂布局比例设置无视觉效果的问题
    aspectPaddingTop() {
      const ratio = this.datas.aspectRatio || '1:1'
      const parts = ratio.split(':')
      const w = Number(parts[0]) || 1
      const h = Number(parts[1]) || 1
      return (h / w) * 100 + '%'
    },
    showimageList() {
      if (
        this.datas.rubiksCubeType === 0 &&
        !this.datas.imageList[0].src &&
        !this.datas.imageList[1].src
      )
        return false

      if (
        (this.datas.rubiksCubeType === 1 ||
          this.datas.rubiksCubeType === 4 ||
          this.datas.rubiksCubeType === 5) &&
        !this.datas.imageList[0].src &&
        !this.datas.imageList[1].src &&
        !this.datas.imageList[2].src
      )
        return false

      if (
        (this.datas.rubiksCubeType === 2 ||
          this.datas.rubiksCubeType === 6 ||
          this.datas.rubiksCubeType === 3) &&
        !this.datas.imageList[0].src &&
        !this.datas.imageList[1].src &&
        !this.datas.imageList[2].src &&
        !this.datas.imageList[3].src
      )
        return false

      return true
    },
  },
}
</script>

<style scoped lang="less">
.magiccube {
  position: relative;
  /* F9 新增：所有魔方图片统一应用圆角（由 --mc-radius 变量控制） */
  img {
    border-radius: var(--mc-radius, 0);
  }
  /* F9 新增：一行 N 个的行布局图片按宽高比展示（由 --mc-aspect 变量控制） */
  .buju0 {
    .rubiksCubeType0 img,
    .rubiksCubeType1 img,
    .rubiksCubeType2 img {
      aspect-ratio: var(--mc-aspect, 1 / 1);
      object-fit: cover;
    }
  }
  /* 布局 */
  .imgone {
    &:last-of-type {
      img {
        padding-bottom: 0 !important;
        padding-right: 0 !important;
      }
    }
    &:first-of-type {
      img {
        padding-top: 0 !important;
        padding-right: 0 !important;
      }
    }
  }
  .imgtow {
    &:first-of-type {
      img {
        padding-bottom: 0 !important;
        padding-left: 0 !important;
      }
    }
    &:last-of-type {
      img {
        padding-bottom: 0 !important;
        padding-right: 0 !important;
      }
    }
  }
  .hw {
    width: 100%;
    position: relative;
    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      /* F9修复：复杂布局图片按比例裁剪填充，配合父级 padding-top 使比例设置生效 */
      object-fit: cover;
    }
  }
  .buju {
    &.buju0 {
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
    }
    &.buju4 {
      display: flex;
      width: 100%;
      /* F9修复：移除固定高度，改由左侧主图按比例(padding-top)撑开，使 aspectRatio 生效 */
      flex-direction: row;
      justify-content: space-around;
      align-items: flex-start;
    }
    .active {
      background: #e0edff;
      border: 1px solid #155bd4;
      color: #155bd4;
      z-index: 2;
    }
    .rubiksCubeType {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      &.rubiksCubeType0 {
        width: 50%;
        // height: 200px;
        &:first-of-type {
          img {
            padding-left: 0 !important;
            padding-top: 0 !important;
            padding-bottom: 0 !important;
          }
        }
        &:last-of-type {
          img {
            padding-right: 0 !important;
            padding-top: 0 !important;
            padding-bottom: 0 !important;
          }
        }
        img {
          width: 100%;
          // height: 200px;
          display: block;
        }
      }
      &.rubiksCubeType1 {
        width: 33.333%;
        &:nth-of-type(1) {
          margin-left: 0 !important;
          margin-top: 0 !important;
          margin-bottom: 0 !important;
        }
        &:nth-of-type(2) {
          margin-top: 0 !important;
          margin-left: 0 !important;
          margin-bottom: 0 !important;
        }
        &:nth-of-type(3) {
          margin-top: 0 !important;
          margin-right: 0 !important;
          margin-bottom: 0 !important;
        }
        img {
          width: 100%;
          /* F9修复：改 auto，避免固定 150px 以更高特异性覆盖 aspect-ratio 比例 */
          height: auto;
          display: block;
        }
      }
      &.rubiksCubeType2 {
        width: 25%;
        &:nth-of-type(1) {
          margin-left: 0 !important;
          margin-top: 0 !important;
          margin-bottom: 0 !important;
        }
        &:nth-of-type(2) {
          margin-top: 0 !important;
          margin-left: 0 !important;
          margin-bottom: 0 !important;
        }
        &:nth-of-type(3) {
          margin-top: 0 !important;
          margin-left: 0 !important;
          margin-bottom: 0 !important;
        }
        &:nth-of-type(4) {
          margin-top: 0 !important;
          margin-right: 0 !important;
          margin-bottom: 0 !important;
        }
        img {
          width: 100%;
          /* F9修复：改 auto，避免固定 150px 以更高特异性覆盖 aspect-ratio 比例 */
          height: auto;
          display: block;
        }
      }
      &.rubiksCubeType3 {
        width: 50%;
        /* F9修复：二左二右为 50% 宽的方格，padding-top 取比例的一半使宽高比生效 */
        padding-top: calc(var(--mc-pt, 100%) / 2);
        position: relative;
        &:nth-of-type(1) {
          img {
            padding-top: 0 !important;
            padding-left: 0 !important;
          }
        }
        &:nth-of-type(2) {
          img {
            padding-top: 0 !important;
            padding-right: 0 !important;
          }
        }
        &:nth-of-type(3) {
          img {
            padding-bottom: 0 !important;
            padding-left: 0 !important;
          }
        }
        &:nth-of-type(4) {
          img {
            padding-bottom: 0 !important;
            padding-right: 0 !important;
          }
        }
        img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
      }
      &.rubiksCubeType4 {
        width: 187px;
        height: 187px;
        img {
          width: 100%;
          height: 100%;
          display: block;
        }
      }
    }
  }
}
</style>
