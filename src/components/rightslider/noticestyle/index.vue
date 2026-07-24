<template>
  <div class="noticestyle">
    <!-- 标题 -->
    <h2>{{ datas.text }}</h2>

    <!-- 公告 -->
    <el-form label-width="90px" :model="datas" :rules="rules" class="lef">
      <el-form-item
        label="公告"
        :hide-required-asterisk="true"
        prop="noticeText"
      >
        <el-input v-model="datas.noticeText" placeholder="请输入公告" />
      </el-form-item>

      <div style="height: 10px" />

      <!-- F6 新增：多条公告列表编辑（可增删，每条最长 50 字符） -->
      <el-form-item label="多条公告" class="lef" />
      <div class="notice-list">
        <div
          class="notice-list-item"
          v-for="(item, index) in datas.noticeList"
          :key="index"
        >
          <el-input
            :model-value="item"
            maxlength="50"
            show-word-limit
            placeholder="请输入公告内容"
            @update:model-value="updateNotice(index, $event)"
          />
          <!-- 删除当前公告 -->
          <van-icon
            name="delete-o"
            class="del-icon"
            @click="deleteNotice(index)"
          />
        </div>
        <!-- 添加公告按钮 -->
        <el-button
          class="add-btn"
          type="primary"
          plain
          @click="addNotice"
          >添加公告</el-button
        >
      </div>

      <div style="height: 10px" />

      <!-- F6 新增：滚动方向选择 -->
      <el-form-item label="滚动方向" class="lef">
        <el-radio-group v-model="datas.direction">
          <el-radio label="horizontal">横向</el-radio>
          <el-radio label="vertical">纵向</el-radio>
        </el-radio-group>
      </el-form-item>

      <div style="height: 10px" />

      <!-- F6 新增：滚动速度(10-200) -->
      <el-form-item label="滚动速度" class="lef">
        <el-slider
          v-model="datas.speed"
          :min="10"
          :max="200"
          input-size="small"
          show-input
          @change="checkSpeed"
        >
        </el-slider>
      </el-form-item>

      <div style="height: 10px" />

      <!-- F6 新增：前导图标开关 + 图标名称 -->
      <el-form-item label="前导图标" class="lef">
        <el-checkbox v-model="datas.showLeadingIcon">显示</el-checkbox>
      </el-form-item>
      <el-form-item
        label="图标名称"
        class="lef"
        v-show="datas.showLeadingIcon"
      >
        <el-input
          v-model="datas.leadingIcon"
          placeholder="请输入 vant 图标名，如 volume-o"
        />
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
import { ElMessage } from 'element-plus' // F6 新增：非法输入提示

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
  methods: {
    // F6 新增：更新指定公告并做长度校验(<=50)
    updateNotice(index, val) {
      if (val && val.length > 50) {
        ElMessage.warning('每条公告最长 50 个字符')
        val = val.slice(0, 50)
      }
      this.datas.noticeList[index] = val
    },
    // F6 新增：新增一条公告
    addNotice() {
      if (!Array.isArray(this.datas.noticeList)) {
        this.datas.noticeList = []
      }
      this.datas.noticeList.push('请填写公告内容')
    },
    // F6 新增：删除一条公告
    deleteNotice(index) {
      this.datas.noticeList.splice(index, 1)
    },
    // F6 新增：速度范围校验(10-200)
    checkSpeed(val) {
      let s = Number(val)
      if (isNaN(s) || s < 10 || s > 200) {
        ElMessage.warning('滚动速度需在 10-200 之间')
        this.datas.speed = Math.min(200, Math.max(10, isNaN(s) ? 40 : s))
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

  /* F6 新增：多条公告列表样式 */
  .notice-list {
    .notice-list-item {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      .del-icon {
        margin-left: 8px;
        color: red;
        cursor: pointer;
        font-size: 18px;
      }
    }
    .add-btn {
      width: 100%;
    }
  }
}
</style>
