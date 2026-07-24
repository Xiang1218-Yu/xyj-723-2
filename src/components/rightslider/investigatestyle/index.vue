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
    <el-form ref="form" :model="datas" label-width="80px">
      <el-form-item label="名称" label-width="40px">
        <el-input
          v-model="datas.title"
          maxlength="20"
          show-word-limit
        ></el-input>
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
        ></el-input>
        <el-select
          v-model="item.type"
          placeholder="请选择显示格式"
          @change="conChange(index)"
        >
          <el-option
            :label="opt.label"
            :value="opt.value"
            v-for="opt in typeOptions"
            :key="opt.value"
          ></el-option>
        </el-select>
        <!-- #8 必填开关 -->
        <div class="required-toggle">
          <span>必填</span>
          <el-switch v-model="item.required"></el-switch>
        </div>
        <el-input
          type="textarea"
          v-model="item.value"
          placeholder="提示语句如:(请输入姓名)"
          v-if="item.type == 0 || item.type == 4"
          maxlength="100"
        ></el-input>
        <el-input
          type="textarea"
          v-model="item.value"
          @input="item.value1 = item.value.split('#')"
          placeholder="多项之间用'#'逗号隔开"
          v-else-if="item.type != 5 && item.type != 6"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="addText" class="uploadImg" type="primary" plain>
          点击添加内容
        </el-button>
      </el-form-item>

      <div class="bor" />

      <!-- #8 提交按钮设置 -->
      <h5 style="color: #000; font-size: 14px; margin: 10px 0">提交按钮</h5>
      <el-form-item label="按钮文案" label-width="70px">
        <el-input
          v-model="datas.submitText"
          placeholder="提交"
          maxlength="6"
        />
      </el-form-item>
      <el-form-item label="按钮颜色" label-width="70px">
        <el-color-picker
          v-model="datas.submitColor"
          :predefine="predefineColors"
        />
      </el-form-item>
      <el-form-item label="按钮形状" label-width="70px">
        <el-radio-group v-model="datas.submitShape">
          <el-radio label="round">圆角</el-radio>
          <el-radio label="square">方形</el-radio>
        </el-radio-group>
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
      // #8 增加日期/开关/评分类型
      typeOptions: [
        { label: '文本', value: 0 },
        { label: '下拉框', value: 1 },
        { label: '单选', value: 2 },
        { label: '多选', value: 3 },
        { label: '日期', value: 4 },
        { label: '开关', value: 5 },
        { label: '评分', value: 6 },
      ],
      index1: 0,
      predefineColors: [
        '#ff4500',
        '#155bd4',
        '#07c160',
        '#ee0a24',
        '#ff976a',
        '#409EFF',
      ],
    }
  },
  mounted() {},
  methods: {
    //添加文本
    addText() {
      // #8 长度校验：最多20个字段
      if (this.datas.jsonData.length >= 20) {
        return
      }
      var text = {
        name: '',
        type: 0,
        value: '',
        value1: [],
        value2: '',
        showPicker: false,
        required: false, // #8 必填标记
      }
      this.datas.jsonData.push(text)
    },
    //删除文本
    deletetext(index) {
      this.datas.jsonData.splice(index, 1)
    },
    //下拉内容改变发生事件
    conChange(index) {
      this.datas.jsonData[index].value = ''
      this.datas.jsonData[index].value1 = []
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
    .required-toggle {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: #666;
      margin: 4px 0;
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
  .bor {
    border-bottom: 1px solid #f2f4f6;
    margin: 15px 0;
  }
}
</style>
