<template>
  <div class="noticestyle">
    <!-- 标题 -->
    <h2>{{ datas.text }}</h2>

    <!-- 公告 -->
    <el-form label-width="100px" :model="datas" :rules="rules" class="lef">
      <!-- 多公告模式开关 -->
      <el-form-item label="多公告模式">
        <el-switch v-model="datas.multiMode"></el-switch>
      </el-form-item>

      <!-- 单条公告输入 -->
      <el-form-item
        v-if="!datas.multiMode"
        label="公告"
        :hide-required-asterisk="true"
        prop="noticeText"
      >
        <el-input v-model="datas.noticeText" placeholder="请输入公告" maxlength="200" show-word-limit />
      </el-form-item>

      <!-- 多条公告列表编辑器 -->
      <div v-if="datas.multiMode" class="notice-list">
        <el-form-item label="公告列表">
          <div class="notice-list-container">
            <div
              v-for="(item, index) in datas.noticeList"
              :key="index"
              class="notice-item"
            >
              <span class="delete-btn" @click="removeNotice(index)">×</span>
              <el-input
                v-model="datas.noticeList[index]"
                placeholder="请输入公告内容"
                maxlength="200"
                show-word-limit
              />
            </div>
            <el-button
              type="primary"
              plain
              size="small"
              @click="addNotice"
              class="add-btn"
            >
              + 添加公告
            </el-button>
          </div>
        </el-form-item>
      </div>

      <div style="height: 10px" />

      <!-- 滚动方向 -->
      <el-form-item label="滚动方向">
        <el-radio-group v-model="datas.scrollDirection">
          <el-radio label="left">向左</el-radio>
          <el-radio label="up">向上</el-radio>
        </el-radio-group>
      </el-form-item>

      <div style="height: 10px" />

      <!-- 滚动速度 -->
      <el-form-item label="滚动速度">
        <el-slider
          v-model="datas.scrollSpeed"
          :min="10"
          :max="100"
          show-input
          :format-tooltip="formatSpeed"
        />
        <div class="speed-tip">数值越大滚动越慢</div>
      </el-form-item>

      <div style="height: 10px" />

      <!-- 显示前导图标 -->
      <el-form-item label="显示前导图标">
        <el-switch v-model="datas.showLeadIcon"></el-switch>
      </el-form-item>

      <!-- 前导图标输入 -->
      <el-form-item v-if="datas.showLeadIcon" label="前导图标">
        <el-input v-model="datas.leadIcon" placeholder="请输入vant图标名，如volume-o" />
      </el-form-item>

      <div style="height: 10px" />

      <!-- 背景颜色 -->
      <el-form-item label="背景颜色" class="lef">
        <!-- 颜色选择器 -->
        <el-color-picker
          v-model="datas.backColor"
          show-alpha
          class="picke"
          :predefine="predefineColors"
        >
        </el-color-picker>
      </el-form-item>

      <div style="height: 10px" />

      <!-- 文字颜色 -->
      <el-form-item label="文字颜色" class="lef">
        <!-- 颜色选择器 -->
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
export default {
  name: 'noticestyle',
  props: {
    datas: Object,
  },
  data() {
    return {
      rules: {
        //校验表单输入
        noticeText: [
          //页面名称
          { required: true, message: '请输入公告', trigger: 'blur' },
        ],
      },
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
    }
  },
  created() {
    // 初始化默认值
    if (this.datas.multiMode === undefined) {
      this.$set(this.datas, 'multiMode', false)
    }
    if (!this.datas.noticeList) {
      this.$set(this.datas, 'noticeList', [''])
    }
    if (!this.datas.scrollDirection) {
      this.$set(this.datas, 'scrollDirection', 'left')
    }
    if (!this.datas.scrollSpeed) {
      this.$set(this.datas, 'scrollSpeed', 50)
    }
    if (this.datas.showLeadIcon === undefined) {
      this.$set(this.datas, 'showLeadIcon', true)
    }
    if (!this.datas.leadIcon) {
      this.$set(this.datas, 'leadIcon', 'volume-o')
    }
  },
  methods: {
    // 速度提示格式化
    formatSpeed(val) {
      return val + ' (越大越慢)'
    },
    // 添加公告
    addNotice() {
      if (!this.datas.noticeList) {
        this.$set(this.datas, 'noticeList', [])
      }
      this.datas.noticeList.push('')
    },
    // 删除公告
    removeNotice(index) {
      this.datas.noticeList.splice(index, 1)
      if (this.datas.noticeList.length === 0) {
        this.datas.noticeList.push('')
      }
    },
  },
}
</script>

<style scoped lang="less">
.noticestyle {
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

  /* 颜色选择器 */
  .picke {
    float: right;
  }

  /* 公告列表 */
  .notice-list {
    .notice-list-container {
      width: 100%;
    }
    .notice-item {
      position: relative;
      margin-bottom: 10px;
      .delete-btn {
        position: absolute;
        right: -8px;
        top: -8px;
        width: 18px;
        height: 18px;
        line-height: 16px;
        text-align: center;
        background: #ff4d4f;
        color: #fff;
        border-radius: 50%;
        cursor: pointer;
        font-size: 14px;
        z-index: 10;
      }
    }
    .add-btn {
      width: 100%;
      margin-top: 5px;
    }
  }

  .speed-tip {
    font-size: 12px;
    color: #999;
    margin-top: 4px;
  }
}
</style>
