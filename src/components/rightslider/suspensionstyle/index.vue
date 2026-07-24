<template>
  <div class="suspensionstyle">
    <!-- 标题 -->
    <h2>{{ datas.text }}</h2>

    <!-- 表单 -->
    <el-form label-position="top" label-width="80px" :model="datas">
      <!-- 按钮图标 -->
      <el-form-item label="按钮图标">
        <el-input
          v-model="datas.iconUrl"
          placeholder="请输入图标URL或上传图片"
        >
          <template #append>
            <el-button @click="$refs.upload.showUpload()">上传</el-button>
          </template>
        </el-input>
        <div v-if="datas.iconUrl" class="icon-preview">
          <img :src="datas.iconUrl" class="preview-img" />
        </div>
      </el-form-item>

      <div style="height: 10px" />

      <!-- 水平位置(距右) -->
      <el-form-item label="水平位置(距右px)">
        <el-slider
          v-model="datas.positionX"
          :max="60"
          :min="0"
          input-size="small"
          show-input
        >
        </el-slider>
      </el-form-item>

      <div style="height: 10px" />

      <!-- 垂直位置(距底) -->
      <el-form-item label="垂直位置(距底%)">
        <el-slider
          v-model="datas.positionY"
          :max="50"
          :min="0"
          input-size="small"
          show-input
        >
        </el-slider>
      </el-form-item>

      <div style="height: 10px" />

      <!-- 水平偏移 -->
      <el-form-item label="水平偏移(px)">
        <el-slider
          v-model="datas.offsetX"
          :max="30"
          :min="-30"
          input-size="small"
          show-input
        >
        </el-slider>
      </el-form-item>

      <div style="height: 10px" />

      <!-- 垂直偏移 -->
      <el-form-item label="垂直偏移(px)">
        <el-slider
          v-model="datas.offsetY"
          :max="30"
          :min="-30"
          input-size="small"
          show-input
        >
        </el-slider>
      </el-form-item>

      <div style="height: 10px" />

      <!-- 透明度 -->
      <el-form-item label="透明度">
        <el-slider
          v-model="datas.opacity"
          :max="1"
          :min="0.1"
          :step="0.1"
          input-size="small"
          show-input
        >
        </el-slider>
      </el-form-item>

      <div style="height: 10px" />

      <!-- 按钮大小 -->
      <el-form-item label="按钮大小(px)">
        <el-slider
          v-model="datas.btnSize"
          :max="70"
          :min="30"
          input-size="small"
          show-input
        >
        </el-slider>
      </el-form-item>

      <div style="height: 10px" />

      <!-- 按钮圆角 -->
      <el-form-item label="按钮圆角(px)">
        <el-slider
          v-model="datas.borderRadius"
          :max="35"
          :min="0"
          input-size="small"
          show-input
        >
        </el-slider>
      </el-form-item>

      <div style="height: 20px" />

      <!-- FAB菜单开关 -->
      <el-form-item label="FAB展开菜单">
        <el-switch v-model="datas.fabEnabled"></el-switch>
      </el-form-item>

      <!-- FAB设置 -->
      <template v-if="datas.fabEnabled">
        <div style="height: 10px" />

        <!-- 展开方向 -->
        <el-form-item label="展开方向">
          <el-select v-model="datas.fabDirection" placeholder="请选择展开方向">
            <el-option label="向上" value="up"></el-option>
            <el-option label="向下" value="down"></el-option>
            <el-option label="向左" value="left"></el-option>
            <el-option label="向右" value="right"></el-option>
          </el-select>
        </el-form-item>

        <div style="height: 10px" />

        <!-- FAB子项列表 -->
        <el-form-item label="FAB菜单项">
          <div class="fab-items-list">
            <div
              v-for="(item, index) in datas.fabItems"
              :key="index"
              class="fab-item-card"
            >
              <div class="fab-item-header">
                <span>子项 {{ index + 1 }}</span>
                <van-icon
                  name="close"
                  class="delete-btn"
                  @click="removeFabItem(index)"
                />
              </div>

              <!-- 图标 -->
              <el-input
                v-model="item.icon"
                placeholder="van-icon图标名"
                size="small"
                style="margin-bottom: 8px"
              ></el-input>

              <!-- 文字 -->
              <el-input
                v-model="item.text"
                placeholder="显示文字"
                size="small"
                style="margin-bottom: 8px"
              ></el-input>

              <!-- 跳转类型 -->
              <el-select
                v-model="item.linktype"
                placeholder="跳转类型"
                size="small"
                style="width: 100%; margin-bottom: 8px"
              >
                <el-option
                  v-for="opt in optionsType"
                  :key="opt.name"
                  :label="opt.name"
                  :value="opt.type"
                ></el-option>
              </el-select>

              <!-- 链接 -->
              <el-input
                v-model="item.http.externalLink"
                placeholder="请输入链接(http/https开头)"
                size="small"
                @blur="validateUrl(item)"
              ></el-input>
            </div>

            <el-button
              v-if="datas.fabItems.length < 5"
              type="primary"
              plain
              size="small"
              @click="addFabItem"
              style="width: 100%"
            >
              + 添加子项 ({{ datas.fabItems.length }}/5)
            </el-button>
            <div
              v-else
              style="
                text-align: center;
                color: #999;
                font-size: 12px;
                padding: 8px;
              "
            >
              最多添加5个子项
            </div>
          </div>
        </el-form-item>
      </template>

      <div v-if="!datas.fabEnabled" style="height: 20px" />

      <!-- 普通跳转设置(非FAB模式) -->
      <template v-if="!datas.fabEnabled">
        <!-- 跳转页面 -->
        <el-form-item label="跳转页面">
          <div class="imgText">
            <!-- 选择类型 -->
            <el-select
              style="width: 100%; margin-bottom: 8px"
              v-model="datas.type"
              placeholder="请选择跳转类型"
            >
              <el-option
                v-for="item in optionsType"
                :key="item.name"
                :label="item.name"
                :value="item.type"
              >
              </el-option>
            </el-select>

            <!-- 输入链接 -->
            <el-input
              style="width: 100%"
              placeholder="请输入链接，http/https开头"
              v-model="datas.http.externalLink"
              @blur="validateUrl(datas)"
            >
            </el-input>
          </div>
        </el-form-item>
      </template>
    </el-form>

    <!-- 上传图片 -->
    <uploadimg ref="upload" @uploadInformation="uploadInformation" />
  </div>
</template>
<script>
import uploadimg from '../../uploadImg' //图片上传

export default {
  name: 'suspensionstyle',
  props: {
    datas: Object,
  },
  components: { uploadimg },
  data() {
    return {
      optionsType: [
        {
          type: '10',
          name: '内部链接',
        },
        {
          type: '11',
          name: '外部链接',
        },
      ], // 选择跳转类型
      options: [], //后端返回的列表提供下拉选择
      emptyText: '',
    }
  },
  created() {
    // 初始化数据
    if (!this.datas.fabItems) {
      this.$set(this.datas, 'fabItems', [])
    }
    if (!this.datas.http) {
      this.$set(this.datas, 'http', {})
    }
    this.datas.fabItems.forEach((item) => {
      if (!item.http) item.http = {}
      if (!item.linktype) item.linktype = '11'
    })
  },
  methods: {
    /* 上传图标回调 */
    uploadInformation(res) {
      this.datas.iconUrl = res
    },
    /* URL格式校验 */
    validateUrl(item) {
      if (item && item.http && item.http.externalLink) {
        const url = item.http.externalLink
        if (url && !/^https?:\/\//.test(url)) {
          this.$message.warning('链接需以http://或https://开头')
          item.http.externalLink = ''
        }
      }
    },
    /* 添加FAB子项 */
    addFabItem() {
      if (this.datas.fabItems.length >= 5) {
        this.$message.warning('最多添加5个子项')
        return
      }
      this.datas.fabItems.push({
        icon: '',
        text: '',
        linktype: '11',
        http: {},
      })
    },
    /* 删除FAB子项 */
    removeFabItem(index) {
      this.datas.fabItems.splice(index, 1)
    },
  },
}
</script>
<style lang="less" scoped>
.suspensionstyle {
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
  .imgText {
    width: 100%;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    justify-content: space-between;
    .fir-sele.el-select {
      width: 40%;
    }
  }

  /* 图标预览 */
  .icon-preview {
    margin-top: 8px;
    .preview-img {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      object-fit: cover;
      border: 1px solid #ebedf0;
    }
  }

  /* FAB子项列表 */
  .fab-items-list {
    width: 100%;

    .fab-item-card {
      padding: 12px;
      margin-bottom: 10px;
      background: #f7f8fa;
      border-radius: 4px;
      border: 1px solid #ebedf0;

      .fab-item-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        font-size: 13px;
        font-weight: 500;
        color: #323233;

        .delete-btn {
          font-size: 16px;
          color: #f56c6c;
          cursor: pointer;

          &:hover {
            opacity: 0.8;
          }
        }
      }
    }
  }
}
</style>
