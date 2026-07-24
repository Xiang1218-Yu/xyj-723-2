<template>
  <div class="auxiliarysegmentationstyle">
    <!-- 标题 -->
    <h2>{{ datas.text }}</h2>

    <!-- 表单 -->
    <el-form label-width="80px" :model="datas">
      <!-- 空白高度 -->
      <el-form-item label="空白高度" class="lef">
        <el-slider
          v-model="datas.blankHeight"
          :max="100"
          input-size="small"
          show-input
        >
        </el-slider>
      </el-form-item>

      <div style="height: 20px" />

      <!-- 分割类型 -->
      <el-form-item class="lef" label="分割类型">
        <div class="weiz">
          <el-tooltip
            effect="dark"
            :content="index - 1 === 0 ? '辅助空白' : '辅助线'"
            placement="bottom"
            v-for="index in 2"
            :key="index"
          >
            <i
              class="iconfont"
              :class="[
                index - 1 === 0
                  ? 'icon-fuzhukongbai_weixuanzhong'
                  : 'icon-fuzhuxiantiao',
                datas.segmentationtype === index - 1 ? 'active' : '',
              ]"
              @click="datas.segmentationtype = index - 1"
            />
          </el-tooltip>
        </div>
      </el-form-item>

      <div style="height: 20px" />

      <!-- 选择样式 -->
      <el-form-item
        v-show="datas.segmentationtype === 1"
        class="lef"
        label="选择样式"
      >
        <div class="weiz">
          <el-tooltip
            effect="dark"
            :content="item.text"
            placement="bottom"
            v-for="(item, index) in borderType"
            :key="index"
          >
            <i
              class="iconfont"
              :class="[item.icon, datas.bordertp === item.type ? 'active' : '']"
              @click="datas.bordertp = item.type"
            />
          </el-tooltip>
        </div>
      </el-form-item>

      <!-- 渐变线设置 -->
      <template v-if="datas.segmentationtype === 1 && datas.bordertp === 'gradient'">
        <div style="height: 10px" />

        <!-- 渐变起始色 -->
        <el-form-item class="lef" label="渐变起始">
          <el-color-picker
            v-model="datas.gradientStartColor"
            show-alpha
            class="picke"
            :predefine="predefineColors"
          >
          </el-color-picker>
        </el-form-item>

        <div style="height: 10px" />

        <!-- 渐变结束色 -->
        <el-form-item class="lef" label="渐变结束">
          <el-color-picker
            v-model="datas.gradientEndColor"
            show-alpha
            class="picke"
            :predefine="predefineColors"
          >
          </el-color-picker>
        </el-form-item>

        <div style="height: 10px" />

        <!-- 线条粗细 -->
        <el-form-item label="线条粗细" class="lef">
          <el-slider
            v-model="datas.lineWidth"
            :max="5"
            :min="1"
            input-size="small"
            show-input
          >
          </el-slider>
        </el-form-item>
      </template>

      <div v-show="datas.segmentationtype === 1" style="height: 20px" />

      <!-- 线条粗细(非渐变) -->
      <el-form-item
        v-if="datas.segmentationtype === 1 && datas.bordertp !== 'gradient'"
        label="线条粗细"
        class="lef"
      >
        <el-slider
          v-model="datas.lineWidth"
          :max="5"
          :min="1"
          input-size="small"
          show-input
        >
        </el-slider>
      </el-form-item>

      <div v-if="datas.segmentationtype === 1" style="height: 10px" />

      <!-- 左右边距 -->
      <el-form-item
        v-show="datas.segmentationtype === 1"
        class="lef"
        label="左右边距"
      >
        <div class="weiz">
          <el-tooltip
            effect="dark"
            :content="index - 1 === 0 ? '无边距' : '左右留边'"
            placement="bottom"
            v-for="index in 2"
            :key="index"
          >
            <i
              class="iconfont"
              :class="[
                index - 1 === 0
                  ? 'icon-icon_wubianju'
                  : 'icon-icon_zuoyoubianju',
                datas.paddType === index - 1 ? 'active' : '',
              ]"
              @click="datas.paddType = index - 1"
            />
          </el-tooltip>
        </div>
      </el-form-item>

      <div v-show="datas.segmentationtype === 1" style="height: 10px" />

      <!-- 左侧缩进 -->
      <el-form-item
        v-if="datas.segmentationtype === 1"
        label="左侧缩进"
        class="lef"
      >
        <el-slider
          v-model="datas.leftIndent"
          :max="40"
          :min="0"
          input-size="small"
          show-input
        >
        </el-slider>
      </el-form-item>

      <div v-if="datas.segmentationtype === 1" style="height: 10px" />

      <!-- 右侧缩进 -->
      <el-form-item
        v-if="datas.segmentationtype === 1"
        label="右侧缩进"
        class="lef"
      >
        <el-slider
          v-model="datas.rightIndent"
          :max="40"
          :min="0"
          input-size="small"
          show-input
        >
        </el-slider>
      </el-form-item>

      <div v-show="datas.segmentationtype === 1" style="height: 20px" />

      <!-- 辅助线颜色 -->
      <el-form-item
        v-show="datas.segmentationtype === 1 && datas.bordertp !== 'gradient'"
        label="辅助线颜色"
        class="lef aa"
      >
        <el-color-picker
          v-model="datas.auxliarColor"
          show-alpha
          class="picke"
          :predefine="predefineColors"
        >
        </el-color-picker>
      </el-form-item>

      <div v-show="datas.segmentationtype === 1" style="height: 20px" />

      <!-- 显示文字 -->
      <el-form-item
        v-if="datas.segmentationtype === 1"
        class="lef"
        label="显示文字"
      >
        <el-switch v-model="datas.showText"></el-switch>
      </el-form-item>

      <!-- 文字设置 -->
      <template v-if="datas.segmentationtype === 1 && datas.showText">
        <div style="height: 10px" />

        <!-- 中间文字 -->
        <el-form-item class="lef" label="中间文字">
          <el-input
            v-model="datas.centerText"
            placeholder="请输入分割线文字"
            maxlength="20"
            @input="validateCenterText"
          ></el-input>
        </el-form-item>

        <div style="height: 10px" />

        <!-- 文字颜色 -->
        <el-form-item class="lef" label="文字颜色">
          <el-color-picker
            v-model="datas.textColor"
            show-alpha
            class="picke"
            :predefine="predefineColors"
          >
          </el-color-picker>
        </el-form-item>

        <div style="height: 10px" />

        <!-- 文字大小 -->
        <el-form-item label="文字大小" class="lef">
          <el-slider
            v-model="datas.textSize"
            :max="20"
            :min="10"
            input-size="small"
            show-input
          >
          </el-slider>
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'auxiliarysegmentationstyle',
  props: {
    datas: Object,
  },
  data() {
    return {
      predefineColors: [
        // 颜色选择器预设
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585',
        '#409EFF',
        '#909399',
        '#C0C4CC',
        'rgba(255, 69, 0, 0.68)',
        'rgb(255, 120, 0)',
        'hsv(51, 100, 98)',
        'hsva(120, 40, 94, 0.5)',
        'hsl(181, 100%, 37%)',
        'hsla(209, 100%, 56%, 0.73)',
        '#c7158577',
      ],
      borderType: [
        //线类型
        {
          icon: 'icon-icon_fengexian_shixian',
          text: '实线',
          type: 'solid',
        },
        {
          icon: 'icon-xuxian',
          text: '虚线',
          type: 'dashed',
        },
        {
          icon: 'icon-dianxian--',
          text: '点线',
          type: 'dotted',
        },
        {
          icon: 'icon-icon_fengexian_shixian',
          text: '双线',
          type: 'double',
        },
        {
          icon: 'icon-icon_fengexian_shixian',
          text: '渐变线',
          type: 'gradient',
        },
      ],
    }
  },
  created() {
    // 初始化数据
    if (!this.datas.lineWidth) {
      this.datas.lineWidth = 1
    }
    if (!this.datas.gradientStartColor) {
      this.datas.gradientStartColor = '#ff6b6b'
    }
    if (!this.datas.gradientEndColor) {
      this.datas.gradientEndColor = '#4ecdc4'
    }
    if (this.datas.leftIndent === undefined) {
      this.datas.leftIndent = 0
    }
    if (this.datas.rightIndent === undefined) {
      this.datas.rightIndent = 0
    }
    if (this.datas.showText === undefined) {
      this.datas.showText = false
    }
    if (!this.datas.centerText) {
      this.datas.centerText = ''
    }
    if (!this.datas.textColor) {
      this.datas.textColor = '#999999'
    }
    if (!this.datas.textSize) {
      this.datas.textSize = 12
    }
  },
  methods: {
    /* 中间文字长度校验 */
    validateCenterText() {
      if (this.datas.centerText && this.datas.centerText.length > 20) {
        this.datas.centerText = this.datas.centerText.substring(0, 20)
        this.$message.warning('文字最多20个字')
      }
    },
  },
}
</script>

<style scoped lang="less">
.auxiliarysegmentationstyle {
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  padding: 0 10px 20px;
  box-sizing: border-box;
  /* 标题 */
  h2 {
    padding: 24px 16px 24px 0;
    margin-bottom: 15px;
    border-bottom: 1px solid #f2f4f6;
    font-size: 18px;
    font-weight: 600;
    color: #323233;
  }
  .lef {
    :deep(.el-form-item__label) {
      text-align: left;
    }
  }
  .aa {
    :deep(.el-form-item__label) {
      width: 100px !important;
    }
  }

  /* 颜色选择器 */
  .picke {
    float: right;
  }

  /* 图片样式 */
  .weiz {
    text-align: right;
    i {
      padding: 5px 14px;
      margin-left: 10px;
      border-radius: 0;
      border: 1px solid #ebedf0;
      font-size: 20px;
      font-weight: 500;
      cursor: pointer;

      &:last-child {
        font-size: 22px;
      }

      &.active {
        color: #155bd4;
        border: 1px solid #155bd4;
        background: #e0edff;
      }
    }
  }
}
</style>
