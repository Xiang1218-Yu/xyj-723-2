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
            :label="getLabel(item1)"
            :placeholder="item1.value"
            :value="item1.value2"
            readonly="readonly"
          />
        </van-cell-group>
      </div>

      <!-- 下拉框 -->
      <div v-if="item1.type == 1" class="xiala">
        <div class="titlename">{{ getLabel(item1) }}</div>
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
      <van-field name="radio" :label="getLabel(item1)" v-if="item1.type == 2">
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
        :label="getLabel(item1)"
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

      <!-- 日期选择器 type=4 -->
      <div v-if="item1.type == 4">
        <van-cell-group>
          <van-field
            :label="getLabel(item1)"
            :placeholder="item1.value || '请选择日期'"
            :value="item1.value2"
            readonly
            is-link
            @click="showDatePicker(index1)"
          />
        </van-cell-group>
        <van-popup v-model="item1.showDate" position="bottom">
          <van-datetime-picker
            v-model="item1.currentDate"
            type="date"
            :title="'选择' + item1.name"
            @confirm="onDateConfirm(index1, $event)"
            @cancel="item1.showDate = false"
          />
        </van-popup>
      </div>

      <!-- 开关 type=5 -->
      <div v-if="item1.type == 5" class="switch-item">
        <span class="switch-label">{{ getLabel(item1) }}</span>
        <van-switch v-model="item1.value2" />
      </div>

      <!-- 评分 type=6 -->
      <div v-if="item1.type == 6" class="rate-item">
        <span class="rate-label">{{ getLabel(item1) }}</span>
        <van-rate v-model="item1.value2" />
      </div>
    </div>
    <div class="button">
      <button
        @click.stop="submitForm"
        :style="{
          background: datas.submitBgColor || '#3074f3',
          color: datas.submitTextColor || '#fff',
          'border-radius': (datas.submitBtnRadius || 20) + 'px'
        }"
      >
        {{ datas.submitText || '提交' }}
      </button>
    </div>
    <!-- 删除组件 -->
    <slot name="deles" />
  </div>
</template>

<script>
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
  created() {
    // 初始化表单项默认值
    if (this.datas.jsonData) {
      this.datas.jsonData.forEach(item => {
        if (item.type == 5 && item.value2 === undefined) {
          this.$set(item, 'value2', false)
        }
        if (item.type == 6 && item.value2 === undefined) {
          this.$set(item, 'value2', 0)
        }
        if (item.type == 4) {
          this.$set(item, 'showDate', false)
          this.$set(item, 'currentDate', new Date())
        }
        if (item.required === undefined) {
          this.$set(item, 'required', false)
        }
      })
    }
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
    // 获取标签名（带必填标记）
    getLabel(item) {
      if (this.datas.requiredMark && item.required) {
        return item.name + ' *'
      }
      return item.name
    },
    // 显示日期选择器
    showDatePicker(index1) {
      event.stopPropagation()
      this.datas.jsonData[index1].showDate = true
    },
    // 日期选择确认
    onDateConfirm(index1, date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      this.datas.jsonData[index1].value2 = `${year}-${month}-${day}`
      this.datas.jsonData[index1].showDate = false
    },
    //提交表单校验
    submitForm() {
      let isValid = true
      let errorMsg = ''
      this.datas.jsonData.forEach(item => {
        if (item.required) {
          if (item.type == 0 || item.type == 1 || item.type == 4) {
            if (!item.value2 || item.value2 === '') {
              isValid = false
              errorMsg = `请填写${item.name}`
            }
          } else if (item.type == 2 || item.type == 3) {
            if (!item.value2 || (Array.isArray(item.value2) && item.value2.length === 0)) {
              isValid = false
              errorMsg = `请选择${item.name}`
            }
          } else if (item.type == 6) {
            if (!item.value2 || item.value2 === 0) {
              isValid = false
              errorMsg = `请为${item.name}评分`
            }
          }
        }
      })
      if (!isValid) {
        if (this.$toast) {
          this.$toast(errorMsg)
        } else {
          alert(errorMsg)
        }
        return
      }
      if (this.$toast) {
        this.$toast.success('提交成功')
      }
    },
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
/* 开关样式 */
.switch-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background-color: #fff;
  font-size: 14px;
  .switch-label {
    color: #323233;
  }
}
/* 评分样式 */
.rate-item {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  background-color: #fff;
  font-size: 14px;
  .rate-label {
    color: #323233;
    margin-right: 12px;
  }
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
    padding: 8px;
    text-align: center;
    font-size: 14px;
    border: none;
    cursor: pointer;
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
