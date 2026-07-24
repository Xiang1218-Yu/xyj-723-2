<template>
  <div
    class="magiccube"
    :style="{
      'padding-left': datas.pageMargin + 'px',
      'padding-right': datas.pageMargin + 'px',
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
      <draggable
        v-model="datas.imageList"
        item-key="src"
        :animation="200"
        class="drag-wrap"
      >
        <template #item="{ element, index }">
          <div
            class="rubiksCubeType0 rubiksCubeType"
            :class="{ 'clickable': datas.enableSingleLink }"
            @click="handleItemClick(element)"
          >
            <div class="img-container" :style="imgContainerStyle">
              <img
                draggable="false"
                :src="element.src"
                alt=""
                :style="{
                  padding: datas.imgMargin / 2 + 'px',
                  'border-radius': datas.borderRadius + 'px',
                }"
              />
            </div>
          </div>
        </template>
      </draggable>
    </section>

    <!-- 一行三个 -->
    <section
      class="buju buju0"
      v-show="datas.rubiksCubeType === 1 && showimageList"
    >
      <draggable
        v-model="datas.imageList"
        item-key="src"
        :animation="200"
        class="drag-wrap"
      >
        <template #item="{ element, index }">
          <div
            class="rubiksCubeType1 rubiksCubeType"
            :class="{ 'clickable': datas.enableSingleLink }"
            :style="{
              margin: datas.imgMargin / 10 + '%',
              width: 33.33 + '%',
            }"
            @click="handleItemClick(element)"
          >
            <div class="img-container" :style="imgContainerStyle">
              <img
                draggable="false"
                :src="element.src"
                alt=""
                :style="{ 'border-radius': datas.borderRadius + 'px' }"
              />
            </div>
          </div>
        </template>
      </draggable>
    </section>

    <!-- 一行四个 -->
    <section
      class="buju buju0"
      v-show="datas.rubiksCubeType === 2 && showimageList"
    >
      <draggable
        v-model="datas.imageList"
        item-key="src"
        :animation="200"
        class="drag-wrap"
      >
        <template #item="{ element, index }">
          <div
            class="rubiksCubeType2 rubiksCubeType"
            :class="{ 'clickable': datas.enableSingleLink }"
            :style="{
              margin: datas.imgMargin / 10 + '%',
              width: 25 - datas.imgMargin / 10 + '%',
            }"
            @click="handleItemClick(element)"
          >
            <div class="img-container" :style="imgContainerStyle">
              <img
                draggable="false"
                :src="element.src"
                alt=""
                :style="{ 'border-radius': datas.borderRadius + 'px' }"
              />
            </div>
          </div>
        </template>
      </draggable>
    </section>

    <!-- 二左二右 -->
    <section
      class="buju buju0"
      v-show="datas.rubiksCubeType === 3 && showimageList"
    >
      <draggable
        v-model="datas.imageList"
        item-key="src"
        :animation="200"
        class="drag-wrap"
      >
        <template #item="{ element, index }">
          <div
            class="rubiksCubeType3 rubiksCubeType"
            :class="{ 'clickable': datas.enableSingleLink }"
            @click="handleItemClick(element)"
          >
            <div class="img-container" :style="imgContainerStyle">
              <img
                draggable="false"
                :src="element.src"
                alt=""
                :style="{
                  padding: datas.imgMargin + 'px',
                  'border-radius': datas.borderRadius + 'px',
                }"
              />
            </div>
          </div>
        </template>
      </draggable>
    </section>

    <!-- 一左二右 -->
    <section
      class="buju buju4"
      v-show="datas.rubiksCubeType === 4 && showimageList"
    >
      <draggable
        v-model="datas.imageList"
        item-key="src"
        :animation="200"
        class="drag-wrap buju4-drag"
      >
        <template #item="{ element, index }">
          <div
            v-if="index === 0"
            class="rubiksCubeType hw"
            :class="{ 'clickable': datas.enableSingleLink }"
            :style="{ 'padding-top': aspectRatioPercent }"
            @click="handleItemClick(element)"
          >
            <img
              draggable="false"
              :src="element.src"
              alt=""
              :style="{
                'padding-right': datas.imgMargin + 'px',
                'border-radius': datas.borderRadius + 'px',
              }"
            />
          </div>
          <div
            v-else
            style="display: inline-flex; flex-direction: column; width: 100%"
          >
            <div
              class="hw imgone"
              v-for="(subItem, subIndex) in datas.imageList.slice(1, 3)"
              :key="subIndex"
              :class="{ 'clickable': datas.enableSingleLink }"
              :style="{ 'padding-top': aspectRatioPercent }"
              @click="handleItemClick(subItem)"
            >
              <img
                draggable="false"
                :src="subItem.src"
                alt=""
                :style="{
                  padding: datas.imgMargin + 'px',
                  'border-radius': datas.borderRadius + 'px',
                }"
              />
            </div>
          </div>
        </template>
      </draggable>
    </section>

    <!-- 一上二下 -->
    <section
      class="buju buju5"
      v-show="datas.rubiksCubeType === 5 && showimageList"
    >
      <div
        class="rubiksCubeType hw"
        :class="{ 'clickable': datas.enableSingleLink }"
        :style="{ display: 'block', 'padding-top': aspectRatioPercent }"
        @click="handleItemClick(datas.imageList[0])"
      >
        <img
          draggable="false"
          :src="datas.imageList[0].src"
          alt=""
          :style="{
            'padding-bottom': datas.imgMargin + 'px',
            'border-radius': datas.borderRadius + 'px',
          }"
        />
      </div>
      <div style="display: flex; width: 100%">
        <div
          class="rubiksCubeType hw imgtow"
          v-for="(item, index) in datas.imageList.slice(1, 3)"
          :key="index"
          :class="{ 'clickable': datas.enableSingleLink }"
          :style="{ 'padding-top': aspectRatioPercent }"
          @click="handleItemClick(item)"
        >
          <img
            draggable="false"
            :src="item.src"
            alt=""
            :style="{
              padding: datas.imgMargin + 'px',
              'border-radius': datas.borderRadius + 'px',
            }"
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
      <div
        class="rubiksCubeType hw"
        :class="{ 'clickable': datas.enableSingleLink }"
        :style="{ 'padding-top': aspectRatioPercent }"
        @click="handleItemClick(datas.imageList[0])"
      >
        <img
          draggable="false"
          :src="datas.imageList[0].src"
          alt=""
          :style="{
            'padding-right': datas.imgMargin + 'px',
            'border-radius': datas.borderRadius + 'px',
          }"
        />
      </div>
      <div style="display: inline-flex; flex-direction: column; width: 100%">
        <!-- 第二张图片 -->
        <div
          class="rubiksCubeType hw"
          :class="{ 'clickable': datas.enableSingleLink }"
          :style="{ 'padding-top': aspectRatioPercent }"
          @click="handleItemClick(datas.imageList[1])"
        >
          <img
            draggable="false"
            :src="datas.imageList[1].src"
            alt=""
            :style="{
              'padding-bottom': datas.imgMargin + 'px',
              'padding-left': datas.imgMargin + 'px',
              'border-radius': datas.borderRadius + 'px',
            }"
          />
        </div>
        <div class="rubiksCubeType">
          <div
            class="hw"
            style="
              display: inline-flex;
              justify-content: center;
              align-items: center;
            "
            :style="{ 'padding-top': aspectRatioPercent }"
            v-for="(item, index) in datas.imageList.slice(2, 4)"
            :key="index"
            :class="{ 'clickable': datas.enableSingleLink }"
            @click="handleItemClick(item)"
          >
            <img
              draggable="false"
              :src="item.src"
              alt=""
              :style="{
                'padding-left': datas.imgMargin + 'px',
                'padding-top': datas.imgMargin + 'px',
                'border-radius': datas.borderRadius + 'px',
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
import draggable from 'vuedraggable'

export default {
  name: 'magiccube',
  components: { draggable },
  props: {
    datas: Object,
  },
  computed: {
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
    /* 计算宽高比padding-top百分比 */
    aspectRatioPercent() {
      const ratio = this.datas.aspectRatio || '1:1'
      const ratioMap = {
        '1:1': '100%',
        '4:3': '75%',
        '16:9': '56.25%',
        '3:4': '133.33%',
      }
      return ratioMap[ratio] || '100%'
    },
    imgContainerStyle() {
      return {
        'padding-top': this.aspectRatioPercent,
      }
    },
  },
  methods: {
    /* 单格点击跳转 */
    handleItemClick(item) {
      if (!this.datas.enableSingleLink) return
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

<style scoped lang="less">
.magiccube {
  position: relative;
  /* 拖拽容器 */
  .drag-wrap {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    &.buju4-drag {
      flex-wrap: nowrap;
    }
  }
  /* 可点击样式 */
  .clickable {
    cursor: pointer;
  }
  /* 图片容器 - 用于padding-top比例 */
  .img-container {
    width: 100%;
    position: relative;
    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
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
      flex-direction: row;
      justify-content: space-around;
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
      &.rubiksCubeType0 {
        width: 50%;
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
          display: block;
          object-fit: cover;
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
          display: block;
          object-fit: cover;
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
          display: block;
          object-fit: cover;
        }
      }
      &.rubiksCubeType3 {
        width: 50%;
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
          object-fit: cover;
        }
      }
      &.rubiksCubeType4 {
        width: 187px;
        img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
        }
      }
    }
  }
}
</style>
