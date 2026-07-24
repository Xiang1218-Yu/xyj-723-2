<template>
  <div class="investigate" @click="guanbi">
    <!-- 内容 -->
    <div class="title">{{ datas.title }}</div>
    <div
      class="rescon"
      v-for="(item1, index1) in datas.jsonData"
      :key="index1"
      @mouseleave="leave()"
    >
      <!-- 输入框 -->
      <div v-if="item1.type == 0">
        <van-cell-group>
          <van-field
            :label="item1.name"
            :placeholder="item1.value"
            :value="item1.value2"
            readonly="readonly"
          />
        </van-cell-group>
      </div>

      <!-- 下拉框 -->
      <div v-if="item1.type == 1" class="xiala">
        <div class="titlename">{{ item1.name }}</div>
        <div class="select">
          <input
            type="text"
            readonly="readonly"
            :placeholder="'点击选择' + item1.name"
            class="readinput"
            @click="showpic(index1)"
            :value="item1.value2"
          />
          <ul :class="{ ulshow: item1.showPicker, ultext: true }">
            <li
              v-for="(item, index) in item1.value1"
              :key="index"
              @click="xuanze(index1, item)"
            >
              {{ item }}
            </li>
          </ul>
        </div>
      </div>

      <!-- 单选框 -->
      <van-field name="radio" :label="item1.name" v-if="item1.type == 2">
        <template #input>
          <van-radio-group :value="item1.value2" direction="horizontal">
            <van-radio
              :name="item"
              v-for="(item, index) in item1.value1"
              :key="index"
              >{{ item }}</van-radio
            >
          </van-radio-group>
        </template>
      </van-field>

      <!-- 复选框 -->

      <van-field
        name="checkboxGroup"
        :label="item1.name"
        v-if="item1.type == 3"
      >
        <template #input>
          <van-checkbox-group direction="horizontal">
            <van-checkbox
              :name="item"
              v-for="(item, index) in item1.value1"
              :key="index"
              :shape="item1.name"
              >{{ item }}</van-checkbox
            >
          </van-checkbox-group>
        </template>
      </van-field>
    </div>

    <!-- F8 新增：按 fields 渲染表单预览 -->
    <div class="fields" v-if="datas.fields && datas.fields.length">
      <div
        class="field-item"
        v-for="(field, fIndex) in datas.fields"
        :key="'field-' + fIndex"
      >
        <!-- 字段标题，必填项前显示红色 * -->
        <div class="field-label">
          <span class="required-star" v-if="field.required">*</span>
          {{ field.label }}
        </div>

        <!-- 单行文本 -->
        <van-field
          v-if="field.type === 'input'"
          v-model="field.value"
          :placeholder="field.placeholder"
        />

        <!-- 多行文本 -->
        <van-field
          v-else-if="field.type === 'textarea'"
          v-model="field.value"
          type="textarea"
          rows="2"
          autosize
          :placeholder="field.placeholder"
        />

        <!-- 日期（只读展示） -->
        <van-field
          v-else-if="field.type === 'date'"
          v-model="field.value"
          readonly
          :placeholder="field.placeholder || '请选择日期'"
          right-icon="calendar-o"
        />

        <!-- 开关 -->
        <div class="field-switch" v-else-if="field.type === 'switch'">
          <van-switch v-model="field.value" size="20px" />
        </div>

        <!-- 评分 -->
        <div class="field-rate" v-else-if="field.type === 'rate'">
          <van-rate v-model="field.value" />
        </div>

        <!-- 单选 -->
        <van-radio-group
          v-else-if="field.type === 'radio'"
          v-model="field.value"
          direction="horizontal"
        >
          <van-radio
            :name="opt"
            v-for="(opt, oIndex) in field.options || []"
            :key="oIndex"
            >{{ opt }}</van-radio
          >
        </van-radio-group>
      </div>
    </div>

    <div class="button">
      <!-- F8 新增：提交按钮应用背景/文字色/圆角，点击执行必填校验 -->
      <button
        :style="{
          background: datas.submitBgColor || '#155bd4',
          color: datas.submitTextColor || '#ffffff',
          'border-radius': (datas.submitRadius != null ? datas.submitRadius : 4) + 'px',
        }"
        @click="submitForm"
      >
        {{ datas.submitText || '提交' }}
      </button>
    </div>
    <!-- 删除组件 -->
    <slot name="deles" />
  </div>
</template>

<script>
import { ElMessage } from 'element-plus' // 消息提示

export default {
  name: 'investigate',
  data() {
    return {
      jsonData: [],
    }
  },
  props: {
    datas: Object,
  },
  created() {},
  mounted() {},
  methods: {
    //点击显示下拉框
    showpic(index1) {
      event.stopPropagation()
      this.datas.jsonData.forEach((el) => {
        el.showPicker = false
      })
      this.datas.jsonData[index1].showPicker = !this.datas.jsonData[index1]
        .showPicker
    },

    // //下拉选择
    xuanze(index1) {
      this.datas.jsonData[index1].showPicker = false
    },

    //关闭下拉选项
    guanbi() {
      this.datas.jsonData.forEach((el) => {
        el.showPicker = false
      })
    },
    leave() {
      this.datas.jsonData.forEach((el) => {
        el.showPicker = false
      })
    },
    //
    // F8 新增：提交时校验所有必填字段是否有值，缺失则提示第一个未填项
    submitForm() {
      const fields = this.datas.fields || []
      for (let i = 0; i < fields.length; i++) {
        const field = fields[i]
        if (!field.required) continue
        const val = field.value
        // 判断是否为空：开关未开(false)、评分为 0、文本为空、单选未选均视为未填
        let empty = false
        if (field.type === 'switch') {
          empty = val !== true
        } else if (field.type === 'rate') {
          empty = !val || Number(val) <= 0
        } else {
          empty = val === '' || val === null || val === undefined
        }
        if (empty) {
          ElMessage.warning('请填写：' + (field.label || '必填项'))
          return
        }
      }
      ElMessage.success('提交成功')
    },
  },
  watch: {},
}
</script>

<style scoped lang="less">
.investigate {
  position: relative;
  padding: 0 6px;
}
form select {
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
}
.xiala {
  position: relative;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  box-sizing: border-box;
  width: 100%;
  padding: 10px 16px;
  // overflow: hidden;
  color: #323233;
  font-size: 14px;
  line-height: 24px;
  background-color: #fff;
  .titlename {
    width: 5.6em;
    margin-right: 12px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
select {
  border: none;
  outline: none;
}
.title {
  text-align: center;
  padding: 10px;
  font-size: 18px;
  font-weight: bold;
}
:deep(.van-cell) {
  display: block;
}
:deep(.el-form-item__label) {
  text-align: center;
  width: 100% !important;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
:deep(.el-form-item__content) {
  margin-left: 100% !important;
}
/* 上传图片按钮 */
.uploadImg {
  width: 200px;
  height: 40px;
  margin-top: 20px;
}
:deep(.van-radio),
.van-checkbox {
  padding: 4px 0px;
}
:deep(.van-field__label) {
  width: 100%;
  // overflow: hidden;
  // white-space: nowrap;
  // text-overflow: ellipsis;
  padding-left: 10px;
  border-bottom: 1px solid #dddddd;
  padding-bottom: 10px;
  line-height: 20px;
  font-size: 13px;
}
:deep(.van-field__value) {
  padding-left: 10px;
  font-size: 13px;
  padding-top: 5px;
}
.button {
  padding: 12px 24px;
  button {
    width: 100%;
    background: rgb(48, 116, 243);
    color: #fff;
    padding: 8px;
    border-radius: 20px;
    text-align: center;
    font-size: 14px;
    border: none;
    cursor: pointer;
  }
}

/* F8 新增：fields 表单预览样式 */
.fields {
  .field-item {
    padding: 8px 16px;
    background: #fff;
    border-bottom: 1px solid #f2f2f2;
    .field-label {
      font-size: 13px;
      color: #323233;
      margin-bottom: 6px;
      /* 必填红色星号 */
      .required-star {
        color: #ff0000;
        margin-right: 2px;
      }
    }
    .field-switch,
    .field-rate {
      padding: 2px 0;
    }
    :deep(.van-field) {
      padding: 6px 0;
    }
    :deep(.van-field__label) {
      display: none;
    }
  }
}
.select {
  position: relative;
  width: 100%;
  .readinput {
    display: block;
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
    margin: 0;
    padding: 0;
    color: #323233;
    line-height: inherit;
    text-align: left;
    background-color: transparent;
    border: 0;
    resize: none;
    cursor: default;
  }
}
.ultext {
  display: none;
  height: 0;
  overflow: hidden;
  transition: all linear 1s;
  background: #fff;
  z-index: 100;
  border-radius: 6px;
  box-shadow: 0 0 16px 1px rgba(200, 200, 200, 0.5);
  li {
    padding: 4px 16px;
    border-bottom: 1px solid #eeeeee;
    &:hover {
      background: #c3d4f5;
    }
  }
}
.ulshow {
  display: block;
  height: auto;
  max-height: 200px;
  overflow-y: auto;
  margin-top: 6px;
  position: absolute;
}
</style>
