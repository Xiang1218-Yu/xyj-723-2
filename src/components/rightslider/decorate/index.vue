<template>
  <div class="decorate">
    <!-- 标题 -->
    <h2>页面设置</h2>

    <!-- 表单 -->
    <el-form
      label-position="top"
      label-width="80px"
      :model="datas"
      :rules="rules"
    >
      <el-form-item label="页面名称" :hide-required-asterisk="true" prop="name">
        <el-input
          v-model="datas.name"
          placeholder="页面标题"
          maxlength="25"
          show-word-limit
        />
      </el-form-item>

      <el-form-item
        label="页面描述"
        :hide-required-asterisk="true"
        prop="details"
      >
        <el-input
          v-model="datas.details"
          placeholder="用户通过微信分享给朋友时，会自动显示页面描述"
        />
      </el-form-item>

      <!-- 个人中心 -->
      <el-form-item label="个人中心" class="lef">
        {{ datas.isPerson ? '显示' : '隐藏' }}
        <el-checkbox style="margin-left: 196px" v-model="datas.isPerson" />
      </el-form-item>

      <!-- 返回 -->
      <el-form-item label="返回按钮" class="lef">
        {{ datas.isBack ? '显示' : '隐藏' }}
        <el-checkbox style="margin-left: 196px" v-model="datas.isBack" />
      </el-form-item>

      <!-- 高度 -->
      <el-form-item label="高度" class="lef-height">
        <el-slider
          v-model="datas.titleHeight"
          :max="100"
          :min="35"
          input-size="small"
          show-input
        >
        </el-slider>
      </el-form-item>

      <div class="bor" />

      <!-- 新增：背景类型选择 -->
      <el-form-item label="背景类型" class="lef">
        <el-radio-group v-model="datas.bgType">
          <el-radio label="color">纯色</el-radio>
          <el-radio label="image">图片</el-radio>
          <el-radio label="gradient">渐变</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 纯色背景 - 背景颜色 -->
      <el-form-item v-if="datas.bgType === 'color'" label="背景颜色" class="lef">
        <!-- 颜色选择器 -->
        <el-color-picker
          v-model="datas.bgColor"
          show-alpha
          :predefine="predefineColors"
        >
        </el-color-picker>
      </el-form-item>

      <!-- 渐变背景设置 -->
      <div v-if="datas.bgType === 'gradient'" class="gradient-settings">
        <el-form-item label="渐变起始色" class="lef">
          <el-color-picker
            v-model="datas.gradientStart"
            show-alpha
            :predefine="predefineColors"
          />
        </el-form-item>
        <el-form-item label="渐变结束色" class="lef">
          <el-color-picker
            v-model="datas.gradientEnd"
            show-alpha
            :predefine="predefineColors"
          />
        </el-form-item>
        <el-form-item label="渐变方向" class="lef">
          <el-select v-model="datas.gradientDirection" style="width: 100%">
            <el-option label="从上到下" value="to bottom" />
            <el-option label="从左到右" value="to right" />
            <el-option label="右下方向" value="to right bottom" />
            <el-option label="左下方向" value="to left bottom" />
            <el-option label="从下到上" value="to top" />
            <el-option label="右上方向" value="to right top" />
          </el-select>
        </el-form-item>
      </div>

      <!-- 图片背景设置 -->
      <div v-if="datas.bgType === 'image'">
        <el-form-item label="背景图片">
          <div class="shop-head-pic" style="text-align: center">
            <img class="home-bg" :src="datas.bgImg" alt="" v-if="datas.bgImg" />
            <div class="shop-head-pic-btn" style="text-align: center">
              <el-button
                @click="showUpload('2')"
                class="uploadImg"
                type="primary"
                plain
                >更换图片</el-button
              >
              <el-button type="primary" @click="clear()">清空图片</el-button>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="背景尺寸" class="lef">
          <el-radio-group v-model="datas.bgSize">
            <el-radio label="cover">覆盖(cover)</el-radio>
            <el-radio label="contain">平铺(contain)</el-radio>
            <el-radio label="auto">原始(auto)</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="背景重复" class="lef">
          <el-select v-model="datas.bgRepeat" style="width: 100%">
            <el-option label="不重复" value="no-repeat" />
            <el-option label="重复" value="repeat" />
            <el-option label="水平重复" value="repeat-x" />
            <el-option label="垂直重复" value="repeat-y" />
          </el-select>
        </el-form-item>
      </div>

      <div class="bor" />

      <!-- 新增：标题栏样式 -->
      <h5 style="color: #000; font-size: 14px; margin-bottom: 15px">标题栏样式</h5>

      <el-form-item label="标题栏文字颜色" class="lef">
        <el-color-picker
          v-model="datas.titleTextColor"
          :predefine="predefineColors"
        />
      </el-form-item>

      <el-form-item label="标题栏背景色" class="lef">
        <el-color-picker
          v-model="datas.titleBgColor"
          show-alpha
          :predefine="predefineColors"
        />
      </el-form-item>

      <div class="bor" />

      <!-- 新增：页面外边距 -->
      <h5 style="color: #000; font-size: 14px; margin-bottom: 15px">页面外边距</h5>

      <el-form-item label="上边距" class="lef-height">
        <el-slider
          v-model="datas.pageMarginTop"
          :max="30"
          :min="0"
          input-size="small"
          show-input
          :step="1"
        />
      </el-form-item>

      <el-form-item label="下边距" class="lef-height">
        <el-slider
          v-model="datas.pageMarginBottom"
          :max="30"
          :min="0"
          input-size="small"
          show-input
          :step="1"
        />
      </el-form-item>

      <el-form-item label="左边距" class="lef-height">
        <el-slider
          v-model="datas.pageMarginLeft"
          :max="30"
          :min="0"
          input-size="small"
          show-input
          :step="1"
        />
      </el-form-item>

      <el-form-item label="右边距" class="lef-height">
        <el-slider
          v-model="datas.pageMarginRight"
          :max="30"
          :min="0"
          input-size="small"
          show-input
          :step="1"
        />
      </el-form-item>
    </el-form>

    <!-- 上传图片 -->
    <uploadimg ref="upload" @uploadInformation="uploadInformation" />
  </div>
</template>

<script>
import uploadimg from '../../uploadImg' //图片上传

export default {
  name: 'decorate',
  props: {
    datas: Object,
  },
  data() {
    return {
      rules: {
        //校验表单输入
        name: [
          //页面名称
          { required: true, message: '请输入页面名称', trigger: 'blur' },
        ],
        details: [
          //页面描述
          { required: true, message: '请输入页面描述', trigger: 'blur' },
        ],
        classification: [
          //分类
          { required: true, message: '请选择页面分类', trigger: 'blur' },
        ],
      },
      pickeShow: false, //颜色选择器是否显示
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
      uploadImgDataType: null, // 获取到的图片地址属于哪一类别   0 修改底部logo   1 修改店铺图标 2 页面背景图
    }
  },
  created() {
    // 确保新增字段有默认值
    if (!this.datas.bgType) this.datas.bgType = 'color'
    if (!this.datas.gradientStart) this.datas.gradientStart = '#667eea'
    if (!this.datas.gradientEnd) this.datas.gradientEnd = '#764ba2'
    if (!this.datas.gradientDirection) this.datas.gradientDirection = 'to bottom'
    if (!this.datas.bgSize) this.datas.bgSize = 'cover'
    if (!this.datas.bgRepeat) this.datas.bgRepeat = 'no-repeat'
    if (!this.datas.titleTextColor) this.datas.titleTextColor = '#333333'
    if (!this.datas.titleBgColor) this.datas.titleBgColor = '#ffffff'
    if (this.datas.pageMarginTop === undefined) this.datas.pageMarginTop = 0
    if (this.datas.pageMarginBottom === undefined) this.datas.pageMarginBottom = 0
    if (this.datas.pageMarginLeft === undefined) this.datas.pageMarginLeft = 0
    if (this.datas.pageMarginRight === undefined) this.datas.pageMarginRight = 0
    if (!this.datas.version) this.datas.version = 'V2.0.0'
  },
  setup() {
    return {}
  },
  methods: {
    // 显示上传图片组件   type :  2 页面背景图
    showUpload(type) {
      this.uploadImgDataType = type
      this.$refs.upload.showUpload()
    },

    // 上传图片
    uploadInformation(res) {
      if (this.uploadImgDataType === '2') {
        this.datas.bgImg = res
        // 上传图片后自动切换到图片背景类型
        this.datas.bgType = 'image'
      }
    },

    // 清空背景图片
    clear() {
      this.datas.bgImg = ''
    },
  },
  components: { uploadimg },
}
</script>

<style scoped lang="less">
/* 页面设置 */
.decorate {
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  padding: 0 10px;
  box-sizing: border-box;
  h2 {
    padding: 24px 16px 24px 0;
    margin-bottom: 15px;
    border-bottom: 1px solid #f2f4f6;
    font-size: 18px;
    font-weight: 600;
    color: #323233;
  }
  /* 选择器添加和刷新 */
  .ification {
    color: #155bd4;
    font-size: 14px;
    padding: 0 15px;
    cursor: pointer;
  }
  /* 颜色选择器 */
  .picke {
    margin-left: 15px;
    vertical-align: top;
  }
  .home-bg {
    width: 100px;
    height: 300px;
  }

  .lef {
    display: flex;
    :deep(.el-form-item__label) {
      text-align: left;
      margin-right: 20px;
    }
  }
  .lef-height {
    :deep(.el-form-item__label) {
      text-align: left;
      width: 80px;
      float: left;
    }
    :deep(.el-form-item__content) {
      margin-left: 80px;
    }
  }

  .bor {
    height: 1px;
    background: #f2f4f6;
    margin: 15px 0;
  }

  /* 渐变设置区域 */
  .gradient-settings {
    background: #f9f9f9;
    border-radius: 6px;
    padding: 10px;
    margin-bottom: 15px;
  }

  // 底部logo
  .bottomLogo {
    display: flex;
    flex-direction: column;
    img {
      display: block;
      width: 220px;
      margin: 10px auto;
    }
  }

  // 店铺信息修改
  .shop-info {
    .shop-name {
      display: flex;
      flex-direction: row;
      color: #ababab;
      .el-input {
        flex: 1;
      }
    }
    .shop-head-pic {
      color: #ababab;
      display: flex;
      flex-direction: column;
      img {
        width: 70px;
        height: 70px;
        margin: 10px auto;
      }
      .shop-head-pic-btn {
        display: flex;
        flex-direction: row;
        .el-button {
          flex: 1;
        }
      }
    }
  }
}
</style>
