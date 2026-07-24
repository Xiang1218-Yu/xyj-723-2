<template>
  <div class="investigatestyle">
    <!-- 标题 -->
    <h2>{{ datas.text }}</h2>

    <!-- 表单 -->
    <el-form label-width="100px" :model="datas">
      <el-form-item class="lef" label="外边框">
        <el-checkbox v-model="datas.isShowBorder">显示</el-checkbox>
      </el-form-item>

      <el-form-item class="lef" label="选中的颜色">
        <!-- 颜色选择器 -->
        <el-color-picker
          v-model="datas.activeColor"
          show-alpha
          class="picke"
          :predefine="predefineColors"
        >
        </el-color-picker>
      </el-form-item>

      <el-form-item class="lef" label="未选中的颜色">
        <!-- 颜色选择器 -->
        <el-color-picker
          v-model="datas.inactiveColor"
          show-alpha
          class="picke"
          :predefine="predefineColors"
        >
        </el-color-picker>
      </el-form-item>

      <el-form-item class="lef" label="高亮位置">
        <el-slider
          v-model="datas.Highlight"
          :max="datas.iconList.length ? datas.iconList.length - 1 : 4"
          :min="0"
          input-size="small"
          show-input
        >
        </el-slider>
      </el-form-item>

      <el-form-item class="lef" label="导航">
        <span style="color: #969799; font-size: 12px"
          >鼠标拖拽调整导航顺序</span
        >
      </el-form-item>
      <!-- F5 改造：按新结构 {text,icon,activeIcon,badge,linktype,http} 编辑导航 -->
      <vuedraggable
        :list="datas.iconList"
        item-key="index"
        :forceFallback="true"
        :animation="200"
      >
        <template #item="{ element, index }">
          <section class="imgBanner">
            <van-icon
              class="el-icon-circle-close"
              name="close"
              @click="deleteimg(index)"
            />
            <!-- 图标区：未选中图标 + 选中态图标，可上传图片或输入图标名 -->
            <div>
              <div
                class="imagBox"
                v-for="replaceIconIndex in 2"
                :key="replaceIconIndex"
                @click="replaceIcon(replaceIconIndex, index)"
              >
                <!-- 图片类型展示图片，否则展示图标名文字 -->
                <img
                  v-if="isImg(replaceIconIndex == 1 ? element.icon : element.activeIcon)"
                  class="imag"
                  :src="replaceIconIndex == 1 ? element.icon : element.activeIcon"
                  draggable="false"
                />
                <div class="imag icon-placeholder" v-else>
                  {{ (replaceIconIndex == 1 ? element.icon : element.activeIcon) || '图标' }}
                </div>
                <div>
                  {{ replaceIconIndex == 1 ? '未选中' : '选中时' }}
                </div>
              </div>
            </div>
            <!-- 文本/徽标/图标名/链接 -->
            <div class="imgText">
              <div class="imgText-top">
                <!-- text 最长 6 -->
                <el-input
                  v-model="element.text"
                  maxlength="6"
                  show-word-limit
                  placeholder="导航名称"
                />
              </div>
              <!-- 徽标文本 最长 4 -->
              <div class="imgText-row">
                <span class="row-label">徽标</span>
                <el-input
                  v-model="element.badge"
                  maxlength="4"
                  placeholder="徽标文本，空则不显示"
                />
              </div>
              <!-- 图标名（iconfont/vant 图标类名，点击上方图标框可改为上传图片） -->
              <div class="imgText-row">
                <span class="row-label">图标名</span>
                <el-input
                  v-model="element.icon"
                  placeholder="vant 图标名，或点上方框上传图片"
                />
              </div>
              <div class="imgText-row">
                <span class="row-label">选中图标</span>
                <el-input
                  v-model="element.activeIcon"
                  placeholder="选中态图标名，可留空"
                />
              </div>
              <!-- 跳转类型与链接 -->
              <div class="imgTextChild">
                <el-select
                  v-model="element.linktype"
                  placeholder="请选择跳转类型"
                >
                  <el-option
                    v-for="opt in optionsType"
                    :key="opt.name"
                    :label="opt.name"
                    :value="opt.type"
                  >
                  </el-option>
                </el-select>
                <el-input
                  placeholder="请输入链接，输入前确保可以访问"
                  v-model="element.http.externalLink"
                >
                </el-input>
              </div>
            </div>
          </section>
        </template>
      </vuedraggable>

      <!-- 添加导航按钮 -->
      <el-button
        @click="addNav"
        class="uploadImg"
        type="primary"
        plain
      >
        点击添加导航
      </el-button>
      <i class="icon-tip">*最少2个，最多5个</i>
    </el-form>

    <!-- 上传图片 -->
    <uploadimg
      ref="upload"
      @uploadInformation="uploadInformation"
      @handleClose="handleClose"
    />
  </div>
</template>

<script>
import uploadimg from '../../uploadImg' //图片上传
import vuedraggable from 'vuedraggable' //拖拽组件
import { ElMessage } from 'element-plus' // F5 新增：数量越界提示

export default {
  name: 'tabBarStyle',
  props: {
    datas: Object,
  },
  data() {
    return {
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
      emptyText: '',
      replaceIconIndex: null,
      replaceIndex: null,
    }
  },

  created() {},

  mounted() {},

  methods: {
    // F5 新增：判断字符串是否为图片链接
    isImg(str) {
      if (!str) return false
      return (
        /^https?:\/\//.test(str) ||
        /^data:image/.test(str) ||
        /^\/\//.test(str) ||
        /\.(png|jpe?g|gif|webp|svg)$/i.test(str)
      )
    },
    // 上传图片回调：写入 icon(未选中) 或 activeIcon(选中)
    uploadInformation(res) {
      if (this.replaceIconIndex == 1) {
        this.datas.iconList[this.replaceIndex].icon = res
        this.replaceIconIndex = null
        return
      }
      if (this.replaceIconIndex == 2) {
        this.datas.iconList[this.replaceIndex].activeIcon = res
        this.replaceIconIndex = null
        return
      }
    },
    /* 取消上传 */
    handleClose() {
      this.replaceIconIndex = null
    },
    // F5 新增：添加导航（默认结构），最多 5 个
    addNav() {
      if (this.datas.iconList.length >= 5) {
        ElMessage.warning('底部导航最多添加 5 个')
        return
      }
      this.datas.iconList.push({
        text: '导航',
        icon: '',
        activeIcon: '',
        badge: '',
        linktype: '10',
        http: {},
      })
    },
    // F5 改造：删除导航，最少保留 2 个
    deleteimg(index) {
      if (this.datas.iconList.length <= 2) {
        ElMessage.warning('底部导航最少保留 2 个')
        return
      }
      this.datas.iconList.splice(index, 1)
      // 高亮位置越界时回退
      if (this.datas.Highlight > this.datas.iconList.length - 1) {
        this.datas.Highlight = this.datas.iconList.length - 1
      }
    },
    /* 点击图标框，1=未选中图标 2=选中态图标 */
    replaceIcon(replaceIconIndex, replaceIndex) {
      this.replaceIconIndex = replaceIconIndex
      this.replaceIndex = replaceIndex
      this.$refs.upload.showUpload()
    },
  },

  computed: {},

  watch: {},

  components: {
    uploadimg,
    vuedraggable,
  },
}
</script>

<style lang="less" scoped>
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
    :deep(.el-form-item__label) {
      text-align: left;
    }
  }
  /* 颜色选择器 */
  .picke {
    float: right;
  }

  /* 上传图片按钮 */
  .uploadImg {
    width: 345px;
    height: 40px;
    margin-top: 20px;
  }

  /* 卡片列表 */
  .imgBanner {
    padding: 6px 12px;
    margin: 16px 7px;
    border-radius: 2px;
    background-color: #fff;
    box-shadow: 0 0 4px 0 rgba(10, 42, 97, 0.2);
    display: flex;
    position: relative;

    /* 删除图标 */
    .el-icon-circle-close {
      position: absolute;
      right: -10px;
      top: -10px;
      cursor: pointer;
      font-size: 19px;
    }

    /* 图片 */
    .imagBox {
      position: relative;
      border-radius: 5px;
      overflow: hidden;
      cursor: pointer;
      .imag {
        width: 60px;
        height: 60px;
      }
      /* F5 新增：非图片图标名占位展示 */
      .icon-placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        color: #969799;
        background-color: #f7f8fa;
        box-sizing: border-box;
        padding: 2px;
        word-break: break-all;
      }
      div {
        position: absolute;
        top: 0;
        width: 60px;
        line-height: 60px;
        border-radius: 5px;
        text-align: center;
        font-size: 12px;
        color: #fff;
        background-color: rgba(0, 0, 0, 0.3);
      }
    }

    /* 图片字 */
    .imgText {
      flex: 1;
      padding-left: 20px;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      justify-content: space-around;
      /* F5 新增：行式编辑项 */
      .imgText-row {
        display: flex;
        align-items: center;
        margin-top: 6px;
        .row-label {
          width: 56px;
          flex-shrink: 0;
          font-size: 12px;
          color: #646566;
        }
      }
      /* 图片字 */
      .imgTextChild {
        width: 100%;
        display: flex;
        box-sizing: border-box;
        justify-content: space-between;
        margin-top: 6px;
        .fir-sele.el-select {
          width: 40%;
        }
      }
      .imgText-top {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        :deep(.el-input),
        .el-input--mini {
          flex: 1;
        }
      }
    }
  }
  .icon-tip {
    font-size: 12px;
    color: red;
  }
}
</style>
