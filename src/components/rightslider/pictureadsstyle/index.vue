<template>
  <div class="pictureadsstyle">
    <!-- 标题 -->
    <h2>图片广告</h2>

    <!-- 表单 -->
    <el-form label-width="80px" :model="datas" :rules="rules" ref="pictureadsForm">
      <!-- 标题内容 -->
      <el-form-item label="选择模板" class="lef">
        <p style="color: #000">{{ styleText }}</p>
      </el-form-item>

      <!-- 轮播图选择 -->
      <div class="swiperType">
        <el-tooltip
          class="item"
          effect="dark"
          content="一行一个"
          placement="bottom"
        >
          <span
            class="iconfont icon-yihangyige"
            style="font-size: 21px"
            :class="datas.swiperType === 0 ? 'active' : ''"
            @click="datas.swiperType = 0"
          />
        </el-tooltip>

        <el-tooltip
          class="item"
          effect="dark"
          content="轮播海报"
          placement="bottom"
        >
          <span
            class="iconfont icon-icon_tupian_lunbohaibao"
            style="font-size: 20px"
            :class="datas.swiperType === 1 ? 'active' : ''"
            @click="datas.swiperType = 1"
          />
        </el-tooltip>

        <el-tooltip
          class="item"
          effect="dark"
          content="多图单行"
          placement="bottom"
        >
          <span
            class="iconfont icon-daohanghengxianghuadong"
            style="font-size: 24px"
            :class="datas.swiperType === 2 ? 'active' : ''"
            @click="datas.swiperType = 2"
          />
        </el-tooltip>

        <el-tooltip
          class="item"
          effect="dark"
          content="立体轮播"
          placement="bottom"
        >
          <span
            class="iconfont icon-xiaotuhengxianghuadong"
            style="font-size: 24px"
            :class="datas.swiperType === 3 ? 'active' : ''"
            @click="datas.swiperType = 3"
          />
        </el-tooltip>
      </div>

      <!-- 下划线 -->
      <div class="bor" />

      <h5 style="color: #000; font-size: 14px">添加图片</h5>
      <p style="color: #969799; font-size: 12px; margin-top: 10px">
        拖动选中的导航可对其排序
      </p>

      <!-- 图片广告 -->
      <div v-if="datas.imageList[0]">
        <vuedraggable
          :list="datas.imageList"
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
              <!-- 图片 -->
              <div class="imag">
                <img :src="element.src" alt draggable="false" />
              </div>
              <!-- 标题和链接 -->
              <div class="imgText">
                <el-input
                  v-model="element.text"
                  placeholder="请输入标题，也可不填"
                ></el-input>

                <!-- 选择类型 -->
                <div class="select-type">
                  <el-select
                    style="width: 60%"
                    v-model="element.linktype"
                    placeholder="请选择跳转类型"
                  >
                    <el-option
                      v-for="element in optionsType"
                      :key="element.name"
                      :label="element.name"
                      :value="element.type"
                    ></el-option>
                  </el-select>

                  <!-- 输入链接 -->
                  <el-input
                    style="width: 100%"
                    placeholder="请输入链接，输入前确保可以访问"
                    v-model="element.http.externalLink"
                  ></el-input>
                </div>
              </div>
            </section>
          </template>
        </vuedraggable>
      </div>
      <!-- 上传图片 -->
      <el-button
        @click="$refs.upload.showUpload()"
        class="uploadImg"
        type="primary"
        plain
      >
        点击添加图片
      </el-button>

      <!-- 下划线 -->
      <div class="bor"></div>

      <el-form-item
        class="lef"
        label="一行个数"
        v-show="datas.swiperType === 2"
      >
        <!-- 单选框 -->
        <el-radio-group v-model="datas.rowindividual" class="radi">
          <el-radio :label="2">2个</el-radio>
          <el-radio :label="3">3个</el-radio>
          <el-radio :label="4">4个</el-radio>
          <el-radio :label="5">5个</el-radio>
          <el-radio :label="6">6个</el-radio>
        </el-radio-group>
      </el-form-item>

      <div style="height: 10px" />

      <!-- 图片倒角 -->
      <el-form-item label="分页类型" class="lef borrediu">
        <el-radio-group v-model="datas.pagingType" class="radi1">
          <el-radio :label="0">不显示</el-radio>
          <el-radio label="bullets">样式一</el-radio>
          <el-radio label="fraction">样式二</el-radio>
          <el-radio label="progressbar">样式三</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 轮播增强配置 - 仅在轮播模式下显示 -->
      <template v-if="datas.swiperType !== 0">
        <div style="height: 10px" />
        <div class="bor"></div>
        
        <!-- 自动播放 -->
        <el-form-item class="lef" label="自动播放">
          {{ datas.autoplayEnabled ? '开启' : '关闭' }}
          <el-checkbox style="margin-left: 196px" v-model="datas.autoplayEnabled" />
        </el-form-item>
        
        <!-- 自动播放间隔 -->
        <el-form-item 
          label="播放间隔" 
          class="lef" 
          prop="autoplayDelay"
          v-show="datas.autoplayEnabled"
        >
          <el-slider
            v-model="datas.autoplayDelay"
            :min="1000"
            :max="8000"
            :step="500"
            input-size="small"
            show-input
          ></el-slider>
        </el-form-item>
        
        <!-- 循环播放 -->
        <el-form-item class="lef" label="循环播放">
          {{ datas.loopEnabled ? '开启' : '关闭' }}
          <el-checkbox style="margin-left: 196px" v-model="datas.loopEnabled" />
        </el-form-item>
        
        <!-- 过渡效果 -->
        <el-form-item label="过渡效果" class="lef" prop="transitionEffect">
          <el-select v-model="datas.transitionEffect" placeholder="请选择过渡效果" style="width: 100%">
            <el-option label="滑动" value="slide"></el-option>
            <el-option label="淡入" value="fade"></el-option>
            <el-option label="方块" value="cube"></el-option>
            <el-option label="流" value="coverflow"></el-option>
          </el-select>
        </el-form-item>
        
        <!-- 切换速度 -->
        <el-form-item label="切换速度" class="lef" prop="speed">
          <el-slider
            v-model="datas.speed"
            :min="100"
            :max="1000"
            :step="50"
            input-size="small"
            show-input
          ></el-slider>
        </el-form-item>
        
        <!-- 显示箭头 -->
        <el-form-item class="lef" label="显示箭头">
          {{ datas.showArrows ? '显示' : '隐藏' }}
          <el-checkbox style="margin-left: 196px" v-model="datas.showArrows" />
        </el-form-item>
        
        <!-- 箭头颜色 -->
        <el-form-item 
          label="箭头颜色" 
          class="lef"
          v-show="datas.showArrows"
        >
          <el-color-picker
            v-model="datas.arrowColor"
            show-alpha
            class="picke"
            :predefine="predefineColors"
          >
          </el-color-picker>
        </el-form-item>
      </template>

      <div style="height: 10px" />

      <!-- 图片倒角 -->
      <el-form-item label="图片倒角" class="lef borrediu">
        <el-slider
          v-model="datas.borderRadius"
          :max="30"
          input-size="small"
          show-input
        ></el-slider>
      </el-form-item>

      <div style="height: 10px" />

      <!-- 页面边距 -->
      <el-form-item
        class="lef"
        label="页面边距"
        v-show="datas.swiperType === 0"
      >
        <el-slider
          v-model="datas.pageMargin"
          :max="20"
          input-size="small"
          show-input
        ></el-slider>
      </el-form-item>

      <div style="height: 10px" />

      <!-- 图片边距 -->
      <el-form-item
        class="lef"
        label="图片边距"
        v-show="datas.swiperType === 0 || datas.swiperType === 2"
      >
        <el-slider
          v-model="datas.imageMargin"
          :max="20"
          input-size="small"
          show-input
        ></el-slider>
      </el-form-item>
    </el-form>

    <!-- 上传图片 -->
    <uploadimg ref="upload" @uploadInformation="uploadInformation" />
  </div>
</template>

<script>
import vuedraggable from 'vuedraggable' //拖拽组件
import uploadimg from '../../uploadImg' //图片上传

export default {
  name: 'pictureadsstyle',
  components: { vuedraggable, uploadimg },
  props: {
    datas: Object,
  },
  data() {
    // 自动播放间隔范围校验
    const validateAutoplayDelay = (rule, value, callback) => {
      if (value < 1000 || value > 8000) {
        callback(new Error('自动播放间隔应在1000-8000ms之间'))
      } else {
        callback()
      }
    }
    // 切换速度范围校验
    const validateSpeed = (rule, value, callback) => {
      if (value < 100 || value > 1000) {
        callback(new Error('切换速度应在100-1000ms之间'))
      } else {
        callback()
      }
    }
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
      emptyText: '',
      rules: {
        autoplayDelay: [
          { validator: validateAutoplayDelay, trigger: 'change' }
        ],
        speed: [
          { validator: validateSpeed, trigger: 'change' }
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
        '#ffffff',
        '#000000',
      ],
    }
  },

  created() {},

  methods: {
    // 提交
    uploadInformation(res) {
      this.datas.imageList.push({
        src: res,
        text: '',
        http: {},
      })
    },

    /* 删除图片 */
    deleteimg(index) {
      this.datas.imageList.splice(index, 1)
    },
  },

  computed: {
    styleText() {
      let data
      if (this.datas.swiperType === 0) data = '一行一个'
      if (this.datas.swiperType === 1) data = '轮播海报'
      if (this.datas.swiperType === 2) data = '多图单行'
      if (this.datas.swiperType === 3) data = '立体模式'
      if (this.datas.swiperType === 4) data = '导航横向滑动'

      return data
    },
  },
}
</script>

<style scoped lang="less">
.pictureadsstyle {
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  padding: 0 10px;
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

  /* 轮播图样式 */
  .swiperType {
    display: flex;
    justify-content: space-around;
    align-items: center;
    span {
      display: inline-block;
      width: 58px;
      height: 32px;
      text-align: center;
      line-height: 32px;
      background: #ebedf0;
      color: #979797;
      border: 1px solid #fff;
      cursor: pointer;
      transition: all 0.5s;

      &:hover {
        border: 1px solid #155bd4;
        color: #155bd4;
      }

      &.active {
        border: 1px solid #155bd4;
        background-color: #e0edff;
        color: #155bd4;
      }
    }
  }

  /* 圆角 */
  .borrediu {
    span {
      display: inline-block;
      width: 48px;
      height: 26px;
      text-align: center;
      line-height: 26px;
      background: #ebedf0;
      color: #979797;
      border: 1px solid #fff;
      cursor: pointer;
      transition: all 0.5s;

      &:hover {
        border: 1px solid #155bd4;
        color: #155bd4;
      }

      &.active {
        border: 1px solid #155bd4;
        background-color: #e0edff;
        color: #155bd4;
      }
    }
  }

  :deep(.radi) .el-radio {
    margin-right: 8px;
  }

  :deep(.radi1) .el-radio {
    margin-right: 7px;
    .el-radio__label {
      padding-left: 5px;
    }
  }

  /* 上传图片按钮 */
  .uploadImg {
    width: 345px;
    height: 40px;
    margin-top: 20px;
  }

  // 上传弹框内容部分
  :deep(.uploadIMG) .el-dialog__body {
    height: 280px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    justify-content: center;
  }

  .disable {
    :deep(.el-upload) {
      display: none !important;
    }
  }

  /* 图片广告列表 */
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
    .imag {
      width: 60px;
      height: 60px;
      border-radius: 5px;
      overflow: hidden;
      position: relative;
      cursor: pointer;
      img {
        width: 100%;
        height: 100%;
        display: inline-block;
      }
      span {
        background: rgba(0, 0, 0, 0.5);
        font-size: 12px;
        position: absolute;
        left: 0px;
        bottom: 0px;
        display: inline-block;
        width: 100%;
        text-align: center;
        color: #fff;
        height: 20px;
        line-height: 20px;
      }
    }

    /* 图片字 */
    .imgText {
      width: 80%;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      padding-left: 20px;
      justify-content: space-between;
      .select-type {
        display: flex;
        :deep(.el-select) {
          .el-input {
            input {
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
        }
      }
    }
  }
}
</style>
