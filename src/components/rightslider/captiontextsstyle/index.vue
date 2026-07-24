<template>
  <section class="captiontextsstyle">
    <!-- 标题 -->
    <h2>{{ datas.text }}</h2>

    <!-- 表单 -->
    <el-form label-width="80px" :model="datas" :rules="rules" ref="form">
      <!-- 标题内容 -->
      <el-form-item label="标题内容">
        <el-input
          v-model="datas.name"
          placeholder="请输入标题"
          show-word-limit
          maxlength="20"
        />
      </el-form-item>

      <div style="height: 10px" />

      <!-- #7 左侧图标 -->
      <el-form-item label="左侧图标">
        <div class="icon-upload">
          <img v-if="datas.leftIcon" :src="datas.leftIcon" class="icon-preview" />
          <div v-else class="icon-placeholder">无图标</div>
          <el-button size="mini" @click="$refs.iconUpload.showUpload()"
            >上传图标</el-button
          >
          <el-button
            size="mini"
            type="danger"
            plain
            @click="datas.leftIcon = ''"
            v-if="datas.leftIcon"
            >清除</el-button
          >
        </div>
      </el-form-item>

      <!-- #7 图标大小 -->
      <el-form-item label="图标大小" v-if="datas.leftIcon">
        <el-slider
          v-model="datas.leftIconSize"
          :min="12"
          :max="48"
          input-size="small"
          show-input
        />
      </el-form-item>

      <!-- #7 小标题渐变 -->
      <el-form-item label="标题渐变">
        {{ datas.gradientTitle ? '开' : '关' }}
        <el-checkbox
          style="margin-left: 196px"
          v-model="datas.gradientTitle"
        />
      </el-form-item>

      <!-- #7 渐变颜色选择 -->
      <template v-if="datas.gradientTitle">
        <el-form-item label="渐变起色">
          <el-color-picker
            v-model="datas.gradientStart"
            show-alpha
            class="picke"
            :predefine="predefineColors"
          />
        </el-form-item>
        <el-form-item label="渐变止色">
          <el-color-picker
            v-model="datas.gradientEnd"
            show-alpha
            class="picke"
            :predefine="predefineColors"
          />
        </el-form-item>
      </template>

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
        </div>
      </el-form-item>

      <div style="height: 10px" />

      <!-- 标题大小 -->
      <el-form-item
        label="标题大小"
        prop="wordSize"
        :hide-required-asterisk="true"
      >
        <el-input-number
          v-model.number="datas.wordSize"
          :min="10"
          :max="48"
          controls-position="right"
        />
      </el-form-item>

      <div style="height: 10px" />

      <!-- 描述大小 -->
      <el-form-item
        label="描述大小"
        prop="descriptionSize"
        :hide-required-asterisk="true"
      >
        <el-input-number
          v-model.number="datas.descriptionSize"
          :min="10"
          :max="36"
          controls-position="right"
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
      <el-form-item label="标题颜色" v-if="!datas.gradientTitle">
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
          maxlength="10"
          placeholder="查看更多"
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
            maxlength="500"
            style="margin-top: 10px"
          />
        </el-form-item>
      </div>
    </el-form>

    <!-- #7 上传图标 -->
    <uploadimg ref="iconUpload" @uploadInformation="uploadIcon" />
  </section>
</template>

<script>
import uploadimg from '../../uploadImg' //图片上传

export default {
  name: 'captiontextsstyle',
  components: { uploadimg },
  props: {
    datas: Object,
  },
  data() {
    let checkAge = (rule, value, callback) => {
      if (value === '' || value === null || value === undefined)
        return callback(new Error('请输入有效数字'))
      if (typeof value !== 'number' || isNaN(value))
        return callback(new Error('必须为数字'))
      if (value > 99) callback(new Error('数字最大为99'))
      callback()
    }
    let kon = (rule, value, callback) => {
      if (value === '' || value === null || value === undefined)
        return callback(new Error('请输入有效数字'))
      if (typeof value !== 'number' || isNaN(value))
        return callback(new Error('必须为数字'))
      callback()
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
    // #7 上传图标回调
    uploadIcon(res) {
      // 校验图标URL格式
      if (typeof res !== 'string' || !/^https?:\/\/.+/i.test(res)) {
        return
      }
      this.datas.leftIcon = res
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

  /* #7 图标上传 */
  .icon-upload {
    display: flex;
    align-items: center;
    gap: 8px;
    .icon-preview {
      width: 32px;
      height: 32px;
      object-fit: contain;
    }
    .icon-placeholder {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f5f5;
      color: #999;
      font-size: 10px;
      border-radius: 4px;
    }
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
