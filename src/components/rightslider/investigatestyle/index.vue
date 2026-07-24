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
    <!-- <el-from ref="form" :model="datas" label-width="80px">
      
    </el-from>-->
    <el-form ref="form" :model="datas" label-width="80px">
      <el-form-item label="名称" label-width="40px">
        <el-input v-model="datas.title" style="width: 87%"></el-input>
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
        ></el-input>
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
        <el-input
          type="textarea"
          v-model="item.value"
          placeholder="提示语句如:(请输入姓名)"
          v-if="item.type == 0"
        ></el-input>
        <el-input
          type="textarea"
          v-model="item.value"
          @input="item.value1 = item.value.split('#')"
          placeholder="多项之间用‘#’逗号隔开"
          v-else
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="addText" class="uploadImg" type="primary" plain>
          点击添加内容
        </el-button>
      </el-form-item>
    </el-form>

    <!-- F8 新增：字段编辑区（vuedraggable 拖拽排序） -->
    <div class="fields-editor">
      <p class="section-title">表单字段（可拖拽排序）</p>
      <vuedraggable
        :list="datas.fields"
        item-key="fIndex"
        :forceFallback="true"
        :animation="200"
        handle=".drag-handle"
      >
        <template #item="{ element, index }">
          <section class="field-box">
            <!-- 删除按钮 -->
            <span class="delete" @click="deleteField(index)">x</span>
            <!-- 拖拽手柄 -->
            <van-icon class="drag-handle" name="bars" title="拖拽排序" />

            <!-- 字段类型 -->
            <el-select
              v-model="element.type"
              placeholder="选择字段类型"
              style="width: 100%; margin-bottom: 8px"
              @change="onTypeChange(element)"
            >
              <el-option
                v-for="opt in fieldTypes"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              />
            </el-select>

            <!-- 字段标题 -->
            <el-input
              v-model="element.label"
              placeholder="字段标题"
              maxlength="20"
              show-word-limit
              style="margin-bottom: 8px"
              @blur="checkLabel(element)"
            />

            <!-- 占位提示 -->
            <el-input
              v-model="element.placeholder"
              placeholder="占位提示语"
              style="margin-bottom: 8px"
            />

            <!-- radio 类型可编辑选项 -->
            <div v-if="element.type === 'radio'" class="options-editor">
              <div
                class="option-row"
                v-for="(opt, oIndex) in element.options"
                :key="oIndex"
              >
                <el-input
                  v-model="element.options[oIndex]"
                  placeholder="选项内容"
                  size="small"
                  style="width: 80%"
                />
                <span class="opt-del" @click="deleteOption(element, oIndex)"
                  >删除</span
                >
              </div>
              <el-button
                size="small"
                type="primary"
                plain
                @click="addOption(element)"
              >
                添加选项
              </el-button>
            </div>

            <!-- 是否必填 -->
            <div class="required-row">
              是否必填
              <el-checkbox v-model="element.required" />
            </div>
          </section>
        </template>
      </vuedraggable>

      <el-button @click="addField" class="uploadImg" type="primary" plain>
        添加字段
      </el-button>
    </div>

    <!-- F8 新增：提交按钮样式配置 -->
    <div class="submit-config">
      <p class="section-title">提交按钮</p>
      <el-form label-width="80px" :model="datas">
        <!-- 按钮文案 -->
        <el-form-item label="按钮文案" class="lef">
          <el-input
            v-model="datas.submitText"
            placeholder="提交"
            maxlength="10"
            show-word-limit
          />
        </el-form-item>

        <!-- 背景色 -->
        <el-form-item label="背景颜色" class="lef">
          <el-color-picker v-model="datas.submitBgColor" />
        </el-form-item>

        <!-- 文字色 -->
        <el-form-item label="文字颜色" class="lef">
          <el-color-picker v-model="datas.submitTextColor" />
        </el-form-item>

        <!-- 圆角 -->
        <el-form-item label="按钮圆角" class="lef">
          <el-slider
            v-model="datas.submitRadius"
            :max="25"
            :min="0"
            input-size="small"
            show-input
          />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import vuedraggable from 'vuedraggable' //拖拽组件
import { ElMessage } from 'element-plus' // 消息提示

export default {
  name: 'investigatestyle',
  components: { vuedraggable },
  props: {
    datas: Object,
  },
  data() {
    return {
      selecttext: ['文本', '下拉框', '单选', '多选'],
      index1: 0,
      // F8 新增：字段类型下拉选项
      fieldTypes: [
        { label: '单行文本', value: 'input' },
        { label: '多行文本', value: 'textarea' },
        { label: '日期', value: 'date' },
        { label: '开关', value: 'switch' },
        { label: '评分', value: 'rate' },
        { label: '单选', value: 'radio' },
      ],
    }
  },
  mounted() {},
  methods: {
    //添加文本
    addText() {
      console.log(this.datas.jsonData)
      var text = {
        name: '',
        type: '',
        value: '',
        value1: [],
        value2: '',
        showPicker: false,
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
    },

    // F8 新增：添加字段
    addField() {
      this.datas.fields.push({
        label: '新字段',
        type: 'input',
        required: false,
        placeholder: '',
        options: [],
        value: '',
      })
    },
    // F8 新增：删除字段
    deleteField(index) {
      this.datas.fields.splice(index, 1)
    },
    // F8 新增：字段类型切换时，重置 value 并按需初始化 options
    onTypeChange(field) {
      if (field.type === 'switch') {
        field.value = false
      } else if (field.type === 'rate') {
        field.value = 0
      } else {
        field.value = ''
      }
      // radio 类型确保有 options 数组
      if (field.type === 'radio' && (!field.options || !field.options.length)) {
        field.options = ['选项一', '选项二']
      }
    },
    // F8 新增：radio 选项增删
    addOption(field) {
      if (!Array.isArray(field.options)) field.options = []
      field.options.push('新选项')
    },
    deleteOption(field, oIndex) {
      field.options.splice(oIndex, 1)
    },
    // F8 新增：字段标题长度校验(<=20)
    checkLabel(field) {
      if (field.label && field.label.length > 20) {
        ElMessage.warning('字段标题不能超过 20 个字符')
        field.label = field.label.slice(0, 20)
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
  }

  :deep(.el-form-item__content) {
    margin-left: 0 !important;
    // display: flex;
    div {
      &:nth-child(2) {
        // flex: 1;
        width: 90%;
        margin-right: 2%;
        margin-bottom: 10px;
      }
      &:nth-child(3) {
        width: 90%;
        // flex: 1;
      }
      &:nth-child(4) {
        width: 100%;
        margin-top: 5px;
        // flex: 3;
      }
    }
  }
  /* 上传图片按钮 */
  .uploadImg {
    width: 345px;
    height: 40px;
    margin-top: 20px;
  }

  /* F8 新增：字段编辑区与提交按钮配置样式 */
  .section-title {
    font-size: 14px;
    font-weight: 600;
    color: #323233;
    margin: 20px 0 10px;
    padding-top: 15px;
    border-top: 1px solid #f2f4f6;
  }
  .fields-editor {
    .field-box {
      position: relative;
      padding: 12px;
      margin-bottom: 12px;
      border-radius: 4px;
      background-color: #fff;
      box-shadow: 0 0 4px 0 rgba(10, 42, 97, 0.2);
      /* 删除按钮 */
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
      /* 拖拽手柄 */
      .drag-handle {
        position: absolute;
        top: -6px;
        left: -6px;
        cursor: move;
        color: #969799;
        font-size: 16px;
      }
      /* radio 选项编辑 */
      .options-editor {
        margin-bottom: 8px;
        .option-row {
          display: flex;
          align-items: center;
          margin-bottom: 6px;
          .opt-del {
            color: #ff0000;
            font-size: 12px;
            margin-left: 8px;
            cursor: pointer;
          }
        }
      }
      .required-row {
        font-size: 13px;
        color: #646566;
      }
    }
  }
  .submit-config {
    .lef {
      :deep(.el-form-item__label) {
        text-align: left;
      }
    }
  }
}
// :deep(.el-input__inner){
//   padding: 0 5px;
// }
</style>
