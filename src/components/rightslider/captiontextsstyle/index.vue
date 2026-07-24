<template>
  <section class="captiontextsstyle">
    <!-- 标题 -->
    <h2>{{ datas.text }}</h2>

    <!-- 表单 -->
    <el-form label-width="80px" :model="datas" :rules="rules">
      <!-- 标题内容 -->
      <el-form-item label="标题内容">
        <el-input
          v-model="datas.name"
          placeholder="请输入标题"
          show-word-limit
        />
      </el-form-item>

      <div style="height: 10px" />

      <!-- 描述内容 -->
      <el-form-item label="描述内容">
        <el-input
          type="textarea"
          v-model="datas.description"
          placeholder="请输入要说明的文字，最多 100 字"
          maxlength="100"
        />
      </el-form-item>

      <div style="height: 10px" />

      <!-- F7 新增：左侧图标（可填 iconfont 类名，或点击上传图片得到链接，最长 100 字符） -->
      <el-form-item label="左侧图标">
        <el-input
          v-model="datas.leftIcon"
          placeholder="填 iconfont 类名或图片链接"
          maxlength="100"
          show-word-limit
          @blur="checkLeftIcon"
        />
        <!-- 上传图片作为左侧图标 -->
        <el-button
          @click="$refs.iconUpload.showUpload()"
          type="primary"
          plain
          size="small"
          style="margin-top: 8px"
        >
          上传图片图标
        </el-button>
      </el-form-item>

      <div style="height: 10px" />

      <!-- F7 新增：描述渐变文字开关 -->
      <el-form-item label="描述渐变" class="wid">
        {{ datas.descGradient ? '开启' : '关闭' }}
        <el-checkbox v-model="datas.descGradient" />
      </el-form-item>

      <!-- F7 新增：渐变相关配置，仅在开启渐变时显示 -->
      <div v-show="datas.descGradient">
        <div style="height: 10px" />

        <!-- 渐变起始色 -->
        <el-form-item label="渐变起始">
          <el-color-picker
            v-model="datas.descGradientStart"
            show-alpha
            class="picke"
            :predefine="predefineColors"
          />
        </el-form-item>

        <div style="height: 10px" />

        <!-- 渐变结束色 -->
        <el-form-item label="渐变结束">
          <el-color-picker
            v-model="datas.descGradientEnd"
            show-alpha
            class="picke"
            :predefine="predefineColors"
          />
        </el-form-item>

        <div style="height: 10px" />

        <!-- 渐变角度(0-360) -->
        <el-form-item label="渐变角度" class="lef">
          <el-slider
            v-model="datas.descGradientAngle"
            :max="360"
            :min="0"
            input-size="small"
            show-input
          />
        </el-form-item>
      </div>

      <div style="height: 10px" />

      <!-- 显示位置 -->
      <el-form-item label="显示位置">
        <div class="weiz">
          <i
            :class="datas.positions === 'left' ? 'active' : ''"
            class="iconfont icon-horizontal-left"
            @click="datas.positions = 'left'"
          />
          <i
            :class="datas.positions === 'center' ? 'active' : ''"
            class="iconfont icon-juzhong"
            @click="datas.positions = 'center'"
          />
          <!-- <i
          :class="datas.positions === 'right' ? 'active': ''"
          class="iconfont icon-juyou"
          @click="datas.positions = 'right'"
          /> -->
        </div>
      </el-form-item>

      <div style="height: 10px" />

      <!-- 标题大小 -->
      <el-form-item
        label="标题大小"
        prop="wordSize"
        :hide-required-asterisk="true"
      >
        <el-input
          type="number"
          v-model.number="datas.wordSize"
          placeholder="请输入标题文字大小"
          :maxlength="2"
        />
      </el-form-item>

      <div style="height: 10px" />

      <!-- 描述大小 -->
      <el-form-item
        label="描述大小"
        prop="descriptionSize"
        :hide-required-asterisk="true"
      >
        <el-input
          type="number"
          v-model.number="datas.descriptionSize"
          placeholder="请输入描述文字大小"
        />
      </el-form-item>

      <div style="height: 10px" />

      <!-- 标题粗细 -->
      <el-form-item
        label="标题粗细"
        prop="wordWeight"
        :hide-required-asterisk="true"
      >
        <el-input
          type="number"
          v-model.number="datas.wordWeight"
          placeholder="请输入标题粗细"
        />
      </el-form-item>

      <div style="height: 10px" />

      <!--描述粗细 -->
      <el-form-item
        label="描述粗细"
        prop="descriptionWeight"
        :hide-required-asterisk="true"
      >
        <el-input
          type="number"
          v-model.number="datas.descriptionWeight"
          placeholder="请输入描述粗细"
        />
      </el-form-item>

      <div style="height: 10px" />

      <!-- 框体高度 -->
      <el-form-item class="lef" label="框体高度">
        <el-slider
          v-model="datas.wordHeight"
          :max="100"
          :min="20"
          input-size="small"
          show-input
        >
        </el-slider>
      </el-form-item>

      <div style="height: 10px" />

      <!-- 标题颜色 -->
      <el-form-item label="标题颜色">
        <!-- 颜色选择器 -->
        <el-color-picker
          v-model="datas.wordColor"
          show-alpha
          class="picke"
          :predefine="predefineColors"
        >
        </el-color-picker>
      </el-form-item>

      <div style="height: 10px" />

      <!-- 描述颜色 -->
      <el-form-item label="描述颜色">
        <!-- 颜色选择器 -->
        <el-color-picker
          v-model="datas.descriptionColor"
          show-alpha
          class="picke"
          :predefine="predefineColors"
        >
        </el-color-picker>
      </el-form-item>

      <div style="height: 10px" />

      <!-- 背景颜色 -->
      <el-form-item label="背景颜色">
        <!-- 背景颜色 -->
        <el-color-picker
          v-model="datas.backColor"
          show-alpha
          class="picke"
          :predefine="predefineColors"
        >
        </el-color-picker>
      </el-form-item>

      <div style="height: 10px" />

      <!--查看更多 -->
      <el-form-item label="底部分割线" class="wid">
        {{ datas.borderBott ? '显示' : '隐藏' }}
        <el-checkbox v-model="datas.borderBott" />
      </el-form-item>

      <div style="height: 10px" />

      <!--查看更多 -->
      <el-form-item label="查看更多" class="wid">
        {{ datas.more.show ? '显示' : '隐藏' }}
        <el-checkbox v-model="datas.more.show" />
      </el-form-item>

      <div style="height: 10px" />

      <!-- 更多样式选择 -->
      <div v-show="datas.more.show ? true : false">
        <el-radio-group v-model="datas.more.type">
          <el-radio :label="0">样式一</el-radio>
          <el-radio :label="1">样式二</el-radio>
          <el-radio :label="2">样式三</el-radio>
        </el-radio-group>

        <div style="height: 10px" />

        <!-- 更多文字 -->
        <el-input
          v-show="datas.more.type === 2 ? false : true"
          type="text"
          style="width: 110px; margin: 15px"
          v-model="datas.more.text"
        />

        <div style="height: 10px" />

        <!-- 跳转链接 -->
        <el-form-item label="跳转链接">
          <el-radio-group
            v-model="datas.more.httpType"
            style="margin-left: 18px"
          >
            <el-radio :label="10">内部链接</el-radio>
            <el-radio :label="11">外部链接</el-radio>
          </el-radio-group>

          <!-- 输入http -->
          <el-input
            v-model="datas.more.http"
            placeholder="请输入跳转链接"
            show-word-limit
            style="margin-top: 10px"
          />
        </el-form-item>
      </div>
    </el-form>

    <!-- F7 新增：上传图片作为左侧图标 -->
    <uploadimg ref="iconUpload" @uploadInformation="uploadIcon" />
  </section>
</template>

<script>
import uploadimg from '../../uploadImg' //图片上传
import { ElMessage } from 'element-plus' // 消息提示

export default {
  name: 'captiontextsstyle',
  components: { uploadimg },
  props: {
    datas: Object,
  },
  data() {
    let checkAge = (rule, value, callback) => {
      if (value.length === 0) callback(new Error('请输入有效数字'))
      if (value > 99) callback(new Error('数字最大为99'))
    }
    let kon = (rule, value, callback) => {
      if (value.length === 0) callback(new Error('请输入有效数字'))
    }
    return {
      options: [],
      rules: {
        wordSize: [{ required: true, validator: checkAge, trigger: 'blur' }],
        descriptionSize: [
          { required: true, validator: checkAge, trigger: 'blur' },
        ],
        wordWeight: [{ required: true, validator: kon, trigger: 'blur' }],
        descriptionWeight: [
          { required: true, validator: kon, trigger: 'blur' },
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
    // F7 新增：上传图片后写入左侧图标（图片链接形式）
    uploadIcon(res) {
      this.datas.leftIcon = res
    },
    // F7 新增：左侧图标长度校验(<=100)
    checkLeftIcon() {
      if (this.datas.leftIcon && this.datas.leftIcon.length > 100) {
        ElMessage.warning('左侧图标内容不能超过 100 个字符')
        this.datas.leftIcon = this.datas.leftIcon.slice(0, 100)
      }
    },
  },
}
</script>

<style scoped lang="less">
.captiontextsstyle {
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

  /* 颜色选择器 */
  .picke {
    float: right;
  }

  /* 位置 */
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

  :deep(.wid) .el-form-item__label {
    width: 94px !important;
  }
  :deep(.wid) .el-form-item__content {
    float: right;
  }
}
</style>
