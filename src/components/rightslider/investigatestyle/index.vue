<template>
  <div class="investigatestyle">
    <!-- 标题 -->
    <h2>{{ datas.text }}</h2>

    <!-- 内容 -->
    <div>
      <p class="info" style="color: #ff0000">
        下拉框，单选，多选等文本用，符号隔开#如：(男#女)
      </p>
    </div>
    <el-form ref="form" :model="datas" :rules="rules" label-width="80px">
      <el-form-item label="名称" label-width="40px" prop="title">
        <el-input v-model="datas.title" style="width: 87%" maxlength="20" show-word-limit></el-input>
      </el-form-item>
      <el-form-item
        v-for="(item, index) in datas.jsonData"
        :key="index"
        class="lef"
      >
        <span class="delete" @click="deletetext(index)">x</span>
        <el-input
          v-model="item.name"
          class="title"
          placeholder="表单模块名称"
          maxlength="20"
          show-word-limit
        ></el-input>
        <div class="form-item-row">
          <el-select
            v-model="item.type"
            placeholder="请选择显示格式"
            @change="conChange(index)"
          >
            <el-option
              :label="item"
              :value="index"
              v-for="(item, index) in selecttext"
              :key="index"
            ></el-option>
          </el-select>
          <!-- 必填复选框 -->
          <el-checkbox v-model="item.required" class="required-check">必填</el-checkbox>
        </div>
        <el-input
          type="textarea"
          v-model="item.value"
          placeholder="提示语句如:(请输入姓名)"
          v-if="item.type == 0"
          maxlength="50"
        ></el-input>
        <el-input
          type="textarea"
          v-model="item.value"
          @input="item.value1 = item.value.split('#')"
          placeholder="多项之间用‘#’逗号隔开"
          v-else-if="item.type <= 3"
          maxlength="100"
        ></el-input>
        <!-- 日期、开关、评分类型不需要输入选项 -->
        <div v-else class="type-tip">
          <span v-if="item.type == 4">日期选择器，点击选择日期</span>
          <span v-if="item.type == 5">开关组件，切换开启/关闭状态</span>
          <span v-if="item.type == 6">评分组件，点击星星评分</span>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button @click="addText" class="uploadImg" type="primary" plain>
          点击添加内容
        </el-button>
      </el-form-item>

      <div style="height: 10px" />

      <!-- 显示必填标记开关 -->
      <el-form-item label="必填标记">
        <el-switch v-model="datas.requiredMark"></el-switch>
      </el-form-item>

      <div style="height: 10px" />

      <!-- 提交按钮文案 -->
      <el-form-item label="按钮文案">
        <el-input v-model="datas.submitText" placeholder="提交" maxlength="6" show-word-limit />
      </el-form-item>

      <div style="height: 10px" />

      <!-- 按钮背景色 -->
      <el-form-item label="按钮背景色">
        <el-color-picker
          v-model="datas.submitBgColor"
          show-alpha
          class="picke"
          :predefine="predefineColors"
        />
      </el-form-item>

      <div style="height: 10px" />

      <!-- 按钮文字色 -->
      <el-form-item label="按钮文字色">
        <el-color-picker
          v-model="datas.submitTextColor"
          show-alpha
          class="picke"
          :predefine="predefineColors"
        />
      </el-form-item>

      <div style="height: 10px" />

      <!-- 按钮圆角 -->
      <el-form-item label="按钮圆角">
        <el-slider
          v-model="datas.submitBtnRadius"
          :min="0"
          :max="30"
          show-input
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'investigatestyle',
  props: {
    datas: Object,
  },
  data() {
    return {
      selecttext: ['文本', '下拉框', '单选', '多选', '日期', '开关', '评分'],
      index1: 0,
      rules: {
        title: [
          { required: true, message: '请输入表单名称', trigger: 'blur' },
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
    // 初始化提交按钮默认值
    if (!this.datas.submitText) {
      this.$set(this.datas, 'submitText', '提交')
    }
    if (!this.datas.submitBgColor) {
      this.$set(this.datas, 'submitBgColor', '#3074f3')
    }
    if (!this.datas.submitTextColor) {
      this.$set(this.datas, 'submitTextColor', '#fff')
    }
    if (this.datas.submitBtnRadius === undefined) {
      this.$set(this.datas, 'submitBtnRadius', 20)
    }
    if (this.datas.requiredMark === undefined) {
      this.$set(this.datas, 'requiredMark', true)
    }
  },
  mounted() {},
  methods: {
    //添加文本
    addText() {
      var text = {
        name: '',
        type: '',
        value: '',
        value1: [],
        value2: '',
        showPicker: false,
        required: false,
      }
      this.datas.jsonData.push(text)
    },
    //删除文本
    deletetext(index) {
      this.datas.jsonData.splice(index, 1)
    },
    //下拉内容改变发生发生事件
    conChange(index) {
      this.datas.jsonData[index].value = ''
      this.datas.jsonData[index].value1 = []
      // 根据类型初始化value2
      const type = this.datas.jsonData[index].type
      if (type == 5) {
        this.datas.jsonData[index].value2 = false
      } else if (type == 6) {
        this.datas.jsonData[index].value2 = 0
      } else {
        this.datas.jsonData[index].value2 = ''
      }
    },
    // 校验表单项名称
    validateItemName(rule, value, callback) {
      if (!value || value.trim() === '') {
        callback(new Error('请输入表单项名称'))
      } else if (value.length > 20) {
        callback(new Error('名称最多20字'))
      } else {
        callback()
      }
    },
  },
}
</script>

<style scoped lang="less">
.investigatestyle {
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
    position: relative;
    :deep(.el-form-item__label) {
      text-align: left;
    }
    .delete {
      background: #ff0000;
      color: #ffffff;
      top: -6px;
      right: -6px;
      border-radius: 50%;
      display: block;
      width: 16px;
      height: 16px;
      line-height: 16px;
      text-align: center;
      position: absolute;
      z-index: 10;
      cursor: pointer;
    }
    .form-item-row {
      display: flex;
      align-items: center;
      width: 90%;
      margin-bottom: 10px;
      .el-select {
        flex: 1;
      }
      .required-check {
        margin-left: 10px;
      }
    }
    .type-tip {
      width: 100%;
      font-size: 12px;
      color: #999;
      padding: 8px;
      background: #f5f5f5;
      border-radius: 4px;
      margin-top: 5px;
    }
  }

  :deep(.el-form-item__content) {
    margin-left: 0 !important;
    div {
      &:nth-child(2) {
        width: 90%;
        margin-right: 2%;
        margin-bottom: 10px;
      }
      &:nth-child(3) {
        width: 90%;
      }
      &:nth-child(4) {
        width: 100%;
        margin-top: 5px;
      }
    }
  }
  /* 上传图片按钮 */
  .uploadImg {
    width: 345px;
    height: 40px;
    margin-top: 20px;
  }
  /* 颜色选择器 */
  .picke {
    float: right;
  }
}
</style>
