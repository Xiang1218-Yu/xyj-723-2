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

      <div v-show="datas.segmentationtype === 1" style="height: 20px" />

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

      <div v-show="datas.segmentationtype === 1" style="height: 20px" />

      <!-- 辅助线颜色 -->
      <el-form-item
        v-show="datas.segmentationtype === 1"
        label="辅助线颜色"
        class="lef aa"
      >
        <!-- 辅助线颜色 -->
        <el-color-picker
          v-model="datas.auxliarColor"
          show-alpha
          class="picke"
          :predefine="predefineColors"
        >
        </el-color-picker>
      </el-form-item>

      <div v-show="datas.segmentationtype === 1" style="height: 20px" />

      <!-- F12 新增：线型选择(实线/虚线/双线/渐变) -->
      <el-form-item
        v-show="datas.segmentationtype === 1"
        class="lef"
        label="线型样式"
      >
        <el-radio-group v-model="datas.lineStyle">
          <el-radio label="solid">实线</el-radio>
          <el-radio label="dashed">虚线</el-radio>
          <el-radio label="double">双线</el-radio>
          <el-radio label="gradient">渐变</el-radio>
        </el-radio-group>
      </el-form-item>

      <div
        v-show="datas.segmentationtype === 1 && datas.lineStyle === 'gradient'"
        style="height: 20px"
      />

      <!-- F12 新增：渐变起止色(仅 gradient 时显示) -->
      <el-form-item
        v-show="datas.segmentationtype === 1 && datas.lineStyle === 'gradient'"
        class="lef aa"
        label="渐变颜色"
      >
        <div class="gradient-colors">
          <el-color-picker
            v-model="datas.gradientStart"
            show-alpha
            :predefine="predefineColors"
          />
          <span class="gradient-arrow">→</span>
          <el-color-picker
            v-model="datas.gradientEnd"
            show-alpha
            :predefine="predefineColors"
          />
        </div>
      </el-form-item>

      <div v-show="datas.segmentationtype === 1" style="height: 20px" />

      <!-- F12 新增：左右缩进(0-50) -->
      <el-form-item
        v-show="datas.segmentationtype === 1"
        class="lef"
        label="左右缩进"
      >
        <el-slider
          v-model="datas.indent"
          :max="50"
          :min="0"
          input-size="small"
          show-input
          @change="checkIndent"
        >
        </el-slider>
      </el-form-item>

      <div v-show="datas.segmentationtype === 1" style="height: 20px" />

      <!-- F12 新增：显示中间文字开关 -->
      <el-form-item
        v-show="datas.segmentationtype === 1"
        class="lef"
        label="中间文字"
      >
        <el-checkbox v-model="datas.showText">显示中间文字</el-checkbox>
      </el-form-item>

      <div
        v-show="datas.segmentationtype === 1 && datas.showText"
        style="height: 20px"
      />

      <!-- F12 新增：文字内容(最长 20) -->
      <el-form-item
        v-show="datas.segmentationtype === 1 && datas.showText"
        class="lef"
        label="文字内容"
      >
        <el-input
          v-model="datas.lineText"
          maxlength="20"
          show-word-limit
          placeholder="请输入文字（最长20字）"
          @input="checkLineText"
        />
      </el-form-item>

      <div
        v-show="datas.segmentationtype === 1 && datas.showText"
        style="height: 20px"
      />

      <!-- F12 新增：前导图标(iconfont 类名) -->
      <el-form-item
        v-show="datas.segmentationtype === 1 && datas.showText"
        class="lef"
        label="文字图标"
      >
        <el-input
          v-model="datas.textIcon"
          placeholder="请输入 iconfont 类名，如 icon-xxx"
        />
      </el-form-item>

      <div
        v-show="datas.segmentationtype === 1 && datas.showText"
        style="height: 20px"
      />

      <!-- F12 新增：文字颜色 -->
      <el-form-item
        v-show="datas.segmentationtype === 1 && datas.showText"
        class="lef aa"
        label="文字颜色"
      >
        <el-color-picker
          v-model="datas.textColor"
          show-alpha
          class="picke"
          :predefine="predefineColors"
        >
        </el-color-picker>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus' //校验提示

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
      ],
    }
  },
  methods: {
    // F12：左右缩进范围校验(0-50)，越界纠正并提示
    checkIndent(val) {
      if (val < 0 || val > 50) {
        this.datas.indent = Math.min(Math.max(Number(val) || 0, 0), 50)
        ElMessage.warning('左右缩进需在 0-50 之间，已自动纠正')
      }
    },
    // F12：文字长度校验(<=20)，超出截断并提示
    checkLineText(val) {
      if (val && val.length > 20) {
        this.datas.lineText = val.slice(0, 20)
        ElMessage.warning('中间文字最长 20 个字符，已自动截断')
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

  /* F12：渐变颜色选择区 */
  .gradient-colors {
    display: flex;
    align-items: center;
    float: right;
    .gradient-arrow {
      margin: 0 8px;
      color: #969799;
    }
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
