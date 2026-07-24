<template>
  <div class="noticestyle">
    <!-- 标题 -->
    <h2>{{ datas.text }}</h2>

    <!-- 公告 -->
    <el-form label-width="90px" :model="datas" :rules="rules" class="lef" ref="form">
      <!-- #6 多条滚动开关 -->
      <el-form-item label="多条滚动">
        {{ datas.multiLine ? '开' : '关' }}
        <el-checkbox style="margin-left: 180px" v-model="datas.multiLine" />
      </el-form-item>

      <!-- #6 多条公告列表 -->
      <template v-if="datas.multiLine">
        <el-form-item label="公告列表">
          <div class="notice-list">
            <div
              v-for="(item, idx) in datas.noticeList"
              :key="idx"
              class="notice-list-item"
            >
              <el-input
                v-model="datas.noticeList[idx]"
                placeholder="请输入公告内容"
                maxlength="50"
              />
              <van-icon
                name="delete-o"
                class="del-btn"
                @click="removeNotice(idx)"
              />
            </div>
            <el-button size="mini" @click="addNotice" plain>添加一条</el-button>
          </div>
        </el-form-item>

        <!-- #6 滚动方向 -->
        <el-form-item label="滚动方向">
          <el-radio-group v-model="datas.direction">
            <el-radio label="up">向上</el-radio>
            <el-radio label="left">向左</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- #6 滚动速度 -->
        <el-form-item label="滚动速度" prop="speed">
          <el-slider
            v-model="datas.speed"
            :min="10"
            :max="100"
            input-size="small"
            show-input
          />
        </el-form-item>
      </template>

      <!-- 单条公告 -->
      <el-form-item
        v-else
        label="公告内容"
        :hide-required-asterisk="true"
        prop="noticeText"
      >
        <el-input
          v-model="datas.noticeText"
          placeholder="请输入公告"
          maxlength="100"
          show-word-limit
        />
      </el-form-item>

      <!-- #6 前导图标 -->
      <el-form-item label="前导图标">
        <el-select v-model="datas.leadingIcon" placeholder="选择图标" clearable>
          <el-option label="喇叭" value="volume-o" />
          <el-option label="铃铛" value="bell" />
          <el-option label="警告" value="warning-o" />
          <el-option label="信息" value="info-o" />
          <el-option label="无" value="" />
        </el-select>
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
          { max: 100, message: '公告不能超过100字', trigger: 'blur' },
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
  methods: {
    // #6 添加一条公告
    addNotice() {
      // 长度校验：最多10条
      if (!Array.isArray(this.datas.noticeList)) {
        this.datas.noticeList = []
      }
      if (this.datas.noticeList.length >= 10) {
        return
      }
      this.datas.noticeList.push('新公告')
    },
    // #6 删除公告
    removeNotice(idx) {
      this.datas.noticeList.splice(idx, 1)
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

  /* #6 公告列表 */
  .notice-list {
    width: 100%;
    .notice-list-item {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      gap: 6px;
      .del-btn {
        color: #f56c6c;
        font-size: 18px;
        cursor: pointer;
      }
    }
  }
}
</style>
