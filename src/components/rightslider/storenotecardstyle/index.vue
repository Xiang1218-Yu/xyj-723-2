<template>
  <div class="storenotecardstyle">
    <!-- 标题 -->
    <h2>{{ datas.text }}</h2>

    <!-- 表单 -->
    <el-form label-width="100px" :model="datas" :rules="rules">
      <el-form-item label="活动名称" class="lef">
        <el-input v-model="datas.name"></el-input>
      </el-form-item>

      <div class="bor" />

      <!-- 标题内容 -->
      <el-form-item class="lef" label="选择模板">
        <p style="color: #000">{{ styleText }}</p>
      </el-form-item>

      <!-- 卡片样式选择 -->
      <div class="commodityType">
        <el-tooltip
          class="item"
          effect="dark"
          :content="item.content"
          placement="bottom"
          v-for="(item, index) in commodityTypes"
          :key="index"
        >
          <span
            class="iconfont"
            style="font-size: 21px"
            :class="[
              item.type === datas.commodityType ? 'active' : '',
              item.icon,
            ]"
            @click="datas.commodityType = index"
          />
        </el-tooltip>
      </div>

      <div class="bor" />

      <!-- 新增：标签编辑 -->
      <el-form-item class="lef" label="显示标签">
        {{ datas.showTags ? '显示' : '隐藏' }}
        <el-checkbox style="margin-left: 196px" v-model="datas.showTags" />
      </el-form-item>

      <!-- 标签编辑器 -->
      <div v-if="datas.showTags" class="tags-editor">
        <div
          v-for="(tag, index) in datas.tags"
          :key="index"
          class="tag-edit-item"
        >
          <el-input
            v-model="datas.tags[index]"
            placeholder="标签文字"
            maxlength="10"
            size="small"
            style="width: 200px"
          />
          <van-icon
            name="close"
            @click="deleteTag(index)"
            style="margin-left: 8px; cursor: pointer; color: #999"
          />
        </div>
        <el-button
          @click="addTag"
          type="primary"
          plain
          size="small"
          style="margin-top: 8px; width: 240px"
          :disabled="datas.tags.length >= 10"
        >
          + 添加标签
        </el-button>
      </div>

      <div class="bor" />

      <!-- 新增：自定义计数 -->
      <el-form-item class="lef" label="自定义计数">
        {{ datas.useCustomCount ? '开启' : '关闭' }}
        <el-checkbox style="margin-left: 185px" v-model="datas.useCustomCount" />
      </el-form-item>

      <div v-if="datas.useCustomCount" class="custom-count">
        <el-form-item class="lef" label="阅读数" prop="customReadCount">
          <el-input
            type="number"
            v-model.number="datas.customReadCount"
            placeholder="请输入阅读数"
            :min="1"
          />
        </el-form-item>
        <el-form-item class="lef" label="点赞数" prop="customPraiseCount">
          <el-input
            type="number"
            v-model.number="datas.customPraiseCount"
            placeholder="请输入点赞数"
            :min="1"
          />
        </el-form-item>
      </div>

      <div class="bor" />

      <!-- 新增：显示作者 -->
      <el-form-item class="lef" label="显示作者">
        {{ datas.showAuthor ? '显示' : '隐藏' }}
        <el-checkbox style="margin-left: 196px" v-model="datas.showAuthor" />
      </el-form-item>

      <div v-if="datas.showAuthor" class="author-edit">
        <el-form-item class="lef" label="作者名称" prop="author">
          <el-input
            v-model="datas.author"
            placeholder="请输入作者名称"
            maxlength="20"
            show-word-limit
          />
        </el-form-item>
        <el-form-item class="lef" label="作者头像">
          <div class="author-avatar-upload">
            <img v-if="datas.authorAvatar" :src="datas.authorAvatar" class="avatar-preview" />
            <div v-else class="avatar-placeholder">暂无头像</div>
            <el-button
              @click="$refs.uploadAuthorAvatar.showUpload()"
              type="primary"
              plain
              size="small"
              style="margin-top: 8px"
            >
              上传头像
            </el-button>
          </div>
        </el-form-item>
      </div>

      <div class="bor" />

      <!-- 新增：多图模式 -->
      <el-form-item class="lef" label="多图模式">
        {{ datas.multiImage ? '开启' : '关闭' }}
        <el-checkbox style="margin-left: 185px" v-model="datas.multiImage" />
      </el-form-item>

      <!-- 新增：显示时间 -->
      <el-form-item class="lef" label="显示时间">
        {{ datas.showTime ? '显示' : '隐藏' }}
        <el-checkbox style="margin-left: 196px" v-model="datas.showTime" />
      </el-form-item>

      <div v-if="datas.showTime" class="time-edit">
        <el-form-item class="lef" label="发布时间">
          <el-date-picker
            v-model="datas.publishTime"
            type="datetime"
            placeholder="选择发布时间"
            value-format="YYYY-MM-DD HH:mm"
            style="width: 100%"
          />
        </el-form-item>
      </div>

      <div class="bor" />

      <h5 style="color: #000; font-size: 14px">添加卡片</h5>
      <p style="color: #969799; font-size: 12px; margin-top: 10px">
        鼠标拖拽调整卡片顺序
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
                <img :src="element.src" alt="" draggable="false" />
              </div>
              <!-- 标题和链接 -->
              <div class="imgText">
                <el-input v-model="element.text" placeholder="笔记标题" />

                <!-- 新增：标签输入 -->
                <div v-if="datas.showTags" class="card-tags-edit">
                  <span style="font-size: 12px; color: #666">文章标签：</span>
                  <el-tag
                    v-for="(tag, tagIdx) in (element.tags || [])"
                    :key="tagIdx"
                    closable
                    size="small"
                    style="margin: 2px"
                    @close="removeCardTag(index, tagIdx)"
                  >
                    {{ tag }}
                  </el-tag>
                  <el-input
                    v-if="tagInputVisible[index]"
                    v-model="tagInputValue[index]"
                    size="small"
                    style="width: 100px; display: inline-block; margin-top: 4px"
                    @keyup.enter.native="addCardTag(index)"
                    @blur="addCardTag(index)"
                  />
                  <el-button
                    v-else
                    size="small"
                    type="primary"
                    plain
                    @click="showTagInput(index)"
                  >
                    + 标签
                  </el-button>
                </div>

                <!-- 新增：阅读数、点赞数 -->
                <div v-if="datas.useCustomCount" class="card-counts-edit">
                  <el-input
                    v-model.number="element.readCount"
                    placeholder="阅读数"
                    type="number"
                    size="small"
                    style="width: 48%; display: inline-block"
                  />
                  <el-input
                    v-model.number="element.praiseCount"
                    placeholder="点赞数"
                    type="number"
                    size="small"
                    style="width: 48%; display: inline-block; margin-left: 4%"
                  />
                </div>

                <!-- 新增：作者信息 -->
                <div v-if="datas.showAuthor" class="card-author-edit">
                  <el-input
                    v-model="element.author"
                    placeholder="作者名称(可选)"
                    size="small"
                    style="width: 60%; display: inline-block"
                  />
                  <el-button
                    size="small"
                    @click="currentUploadIndex = index; $refs.uploadCardAuthorAvatar.showUpload()"
                    style="width: 38%; margin-left: 2%"
                  >
                    头像
                  </el-button>
                </div>

                <!-- 新增：多图上传 -->
                <div v-if="datas.multiImage" class="card-images-edit">
                  <span style="font-size: 12px; color: #666">文章图片(最多3张)：</span>
                  <div class="image-list">
                    <div
                      v-for="(img, imgIdx) in (element.images || [])"
                      :key="imgIdx"
                      class="image-item"
                    >
                      <img :src="img" style="width: 50px; height: 50px; object-fit: cover" />
                      <van-icon
                        name="close"
                        @click="removeCardImage(index, imgIdx)"
                        style="position: absolute; top: -5px; right: -5px; background: #fff; border-radius: 50%; cursor: pointer"
                      />
                    </div>
                    <el-button
                      v-if="!element.images || element.images.length < 3"
                      size="small"
                      @click="currentUploadIndex = index; $refs.uploadCardImage.showUpload()"
                    >
                      + 图
                    </el-button>
                  </div>
                </div>

                <!-- 新增：时间选择 -->
                <div v-if="datas.showTime" class="card-time-edit">
                  <el-date-picker
                    v-model="element.publishTime"
                    type="datetime"
                    placeholder="发布时间"
                    value-format="YYYY-MM-DD HH:mm"
                    size="small"
                    style="width: 100%"
                  />
                </div>

                <!-- 标题和链接 -->
                <div class="imgTextChild">
                  <!-- 选择类型 -->
                  <el-select
                    v-model="element.linktype"
                    placeholder="请选择跳转类型"
                    @change="selectType(index)"
                  >
                    <el-option
                      v-for="element in optionsType"
                      :key="element.name"
                      :label="element.name"
                      :value="element.type"
                    >
                    </el-option>
                  </el-select>

                  <!-- 输入外部链接 -->
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
      </div>

      <!-- 上传图片 -->
      <el-button
        @click="$refs.upload.showUpload()"
        class="uploadImg"
        type="primary"
        plain
        >点击添加卡片</el-button
      >

      <div style="height: 10px" />

      <!-- 卡片样式 -->
      <el-form-item label="卡片样式" class="lef" />
      <!-- 卡片样式选择 -->
      <div class="moditystyle">
        <span
          v-for="(item, index) in moditystyles"
          :key="index"
          :class="item.type == datas.moditystyle ? 'active' : ''"
          @click="datas.moditystyle = index"
        >
          {{ item.text }}
        </span>
      </div>

      <div class="bor" />

      <!-- 文本粗细 -->
      <el-form-item
        class="lef"
        label="文本粗细"
        prop="textWeight"
        :hide-required-asterisk="true"
      >
        <el-input
          type="number"
          v-model.number="datas.textWeight"
          placeholder="请输入文本粗细"
        />
      </el-form-item>

      <div style="height: 10px" />

      <!-- 图片倒角 -->
      <el-form-item label="图片倒角" class="lef borrediu">
        <el-slider
          v-model="datas.borderRadius"
          :max="30"
          input-size="small"
          show-input
        >
        </el-slider>
      </el-form-item>

      <div style="height: 10px" v-if="datas.commodityType === 0" />

      <!-- 显示位置 -->
      <el-form-item
        label="标题位置"
        class="lef"
        v-if="datas.commodityType === 0"
      >
        <div class="weiz">
          <el-tooltip
            class="item"
            effect="dark"
            content="上方"
            placement="bottom"
          >
            <i
              :class="datas.positions === 'top' ? 'active' : ''"
              class="iconfont icon-shang"
              @click="datas.positions = 'top'"
            />
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="下方"
            placement="bottom"
          >
            <i
              :class="datas.positions === 'bottom' ? 'active' : ''"
              class="iconfont icon-jiantou"
              @click="datas.positions = 'bottom'"
            />
          </el-tooltip>
        </div>
      </el-form-item>

      <div class="bor" />

      <!--笔记标签 -->
      <el-form-item class="lef" label="笔记标签">
        {{ datas.noteLabels ? '显示' : '隐藏' }}
        <el-checkbox style="margin-left: 196px" v-model="datas.noteLabels" />
      </el-form-item>

      <!--阅读数 -->
      <el-form-item class="lef" label="阅读数">
        {{ datas.readingNumber ? '显示' : '隐藏' }}
        <el-checkbox style="margin-left: 196px" v-model="datas.readingNumber" />
      </el-form-item>

      <!--点赞数 -->
      <el-form-item class="lef" label="点赞数">
        {{ datas.praisePoints ? '显示' : '隐藏' }}
        <el-checkbox style="margin-left: 196px" v-model="datas.praisePoints" />
      </el-form-item>

      <!--查看更多 -->
      <el-form-item class="lef" label="查看更多">
        <el-checkbox v-model="datas.viewMore1"
          >头部{{ datas.viewMore1 ? '显示' : '隐藏' }}</el-checkbox
        >
        <el-checkbox v-model="datas.viewMore2"
          >尾部{{ datas.viewMore2 ? '显示' : '隐藏' }}</el-checkbox
        >
        <div class="imgText1" v-show="datas.viewMore1 || datas.viewMore2">
          <!-- 选择类型 -->
          <el-select
            style="width: 60%"
            v-model="datas.linktype"
            placeholder="请选择跳转类型"
          >
            <el-option
              v-for="item in optionsType1"
              :key="item.name"
              :label="item.name"
              :value="item.type"
            >
            </el-option>
          </el-select>

          <!-- 输入外部链接 -->
          <el-input
            style="width: 100%"
            placeholder="请输入链接，输入前确保可以访问"
            v-model="datas.http.externalLink"
          >
          </el-input>
        </div>
      </el-form-item>
    </el-form>

    <!-- 上传图片 -->
    <uploadimg ref="upload" @uploadInformation="uploadInformation" />
    <uploadimg ref="uploadAuthorAvatar" @uploadInformation="uploadAuthorAvatar" />
    <uploadimg ref="uploadCardAuthorAvatar" @uploadInformation="uploadCardAuthorAvatar" />
    <uploadimg ref="uploadCardImage" @uploadInformation="uploadCardImage" />
  </div>
</template>

<script>
import vuedraggable from 'vuedraggable' //拖拽组件
import uploadimg from '../../uploadImg' //图片上传

export default {
  name: 'storenotecardstyle',
  props: {
    datas: Object,
  },
  components: { vuedraggable, uploadimg },
  data() {
    let kon = (rule, value, callback) => {
      if (value.length === 0) callback(new Error('请输入有效数字'))
    }
    // 正整数校验
    let validatePositiveInt = (rule, value, callback) => {
      if (value === '' || value === null || value === undefined) {
        callback(new Error('请输入数值'))
      } else if (!Number.isInteger(Number(value)) || Number(value) < 1) {
        callback(new Error('请输入正整数'))
      } else {
        callback()
      }
    }
    return {
      optionsType1: [
        {
          type: '10',
          name: '内部链接',
        },
        {
          type: '11',
          name: '外部链接',
        },
      ], // 选择跳转类型
      options1: [],
      moditystyles: [
        /* 卡片样式 */
        {
          text: '无边白底',
          type: 0,
        },
        {
          text: '卡片投影',
          type: 1,
        },
        {
          text: '描边白底',
          type: 2,
        },
        {
          text: '无边透明底',
          type: 3,
        },
      ],
      commodityTypes: [
        {
          icon: 'icon-datumoshi',
          type: 0,
          content: '大图模式',
        },
        {
          icon: 'icon-commodity-yihangliangge',
          type: 1,
          content: '一行两个',
        },
        {
          icon: 'icon-xuanzemokuai-daohanghengxianghuadong',
          type: 2,
          content: '横向滑动',
        },
        {
          icon: 'icon-sanlan',
          type: 3,
          content: '一大两小',
        },
        {
          icon: 'icon-commodity-xiangxiliebiao',
          type: 4,
          content: '详细列表',
        },
      ],
      rules: {
        textWeight: [{ required: true, validator: kon, trigger: 'blur' }],
        customReadCount: [{ validator: validatePositiveInt, trigger: 'blur' }],
        customPraiseCount: [{ validator: validatePositiveInt, trigger: 'blur' }],
      },
      marker: ['新品', '热卖', 'NEW', 'HOT'],
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
      // 标签输入相关
      tagInputVisible: [],
      tagInputValue: [],
      currentUploadIndex: 0,
    }
  },
  created() {
    // 确保新字段存在
    if (!this.datas.tags) this.datas.tags = []
    if (!this.datas.customReadCount) this.datas.customReadCount = 999
    if (!this.datas.customPraiseCount) this.datas.customPraiseCount = 999
    // 为每个图片项初始化新增字段
    this.datas.imageList.forEach((item) => {
      if (!item.tags) item.tags = []
      if (!item.images) item.images = []
    })
  },
  methods: {
    // 标签操作
    addTag() {
      if (!this.datas.tags) this.datas.tags = []
      if (this.datas.tags.length < 10) {
        this.datas.tags.push('')
      }
    },
    deleteTag(index) {
      this.datas.tags.splice(index, 1)
    },
    // 文章标签操作
    showTagInput(cardIndex) {
      this.tagInputVisible[cardIndex] = true
      this.tagInputValue[cardIndex] = ''
    },
    addCardTag(cardIndex) {
      const val = this.tagInputValue[cardIndex]
      if (val && val.trim()) {
        if (!this.datas.imageList[cardIndex].tags) {
          this.datas.imageList[cardIndex].tags = []
        }
        if (this.datas.imageList[cardIndex].tags.length < 5) {
          this.datas.imageList[cardIndex].tags.push(val.trim())
        }
      }
      this.tagInputVisible[cardIndex] = false
      this.tagInputValue[cardIndex] = ''
    },
    removeCardTag(cardIndex, tagIdx) {
      this.datas.imageList[cardIndex].tags.splice(tagIdx, 1)
    },
    // 图片操作
    removeCardImage(cardIndex, imgIdx) {
      this.datas.imageList[cardIndex].images.splice(imgIdx, 1)
    },
    // 上传全局作者头像
    uploadAuthorAvatar(res) {
      this.datas.authorAvatar = res
    },
    // 上传文章作者头像
    uploadCardAuthorAvatar(res) {
      this.datas.imageList[this.currentUploadIndex].authorAvatar = res
    },
    // 上传文章多图
    uploadCardImage(res) {
      if (!this.datas.imageList[this.currentUploadIndex].images) {
        this.datas.imageList[this.currentUploadIndex].images = []
      }
      if (this.datas.imageList[this.currentUploadIndex].images.length < 3) {
        this.datas.imageList[this.currentUploadIndex].images.push(res)
      }
    },
    selectType(index) {
      // 每次切换类型之前 清空之前选中跳转
      this.datas.imageList[index].http = {}
      // 清空 options
      this.options = []
    },
    // 提交
    uploadInformation(res) {
      this.datas.imageList.push({
        src: res,
        text: '这里显示笔记标题最多显示2行',
        http: {},
        type: '1',
        // 新增字段
        tags: [],
        images: [],
      })
      // 初始化标签输入状态
      this.tagInputVisible.push(false)
      this.tagInputValue.push('')
    },

    /* 删除图片 */
    deleteimg(index) {
      this.datas.imageList.splice(index, 1)
      this.tagInputVisible.splice(index, 1)
      this.tagInputValue.splice(index, 1)
    },
  },
  computed: {
    // eslint-disable-next-line vue/return-in-computed-property
    styleText() {
      if (this.datas.commodityType === 0) return '大图模式'
      if (this.datas.commodityType === 1) return '一行两个'
      if (this.datas.commodityType === 2) return '横向滑动'
      if (this.datas.commodityType === 3) return '详细列表'
      if (this.datas.commodityType === 4) return '一大两小'
      if (this.datas.commodityType === 5) return '横向滑动'
    },
  },
}
</script>

<style scoped lang="less">
.storenotecardstyle {
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

  .bor {
    height: 1px;
    background: #f2f4f6;
    margin: 15px 0;
  }

  /* 标签编辑器 */
  .tags-editor {
    background: #f9f9f9;
    border-radius: 6px;
    padding: 12px;
    margin-bottom: 15px;
    .tag-edit-item {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
    }
  }

  /* 作者头像上传 */
  .author-avatar-upload {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    .avatar-preview {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      object-fit: cover;
    }
    .avatar-placeholder {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: #f0f0f0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      color: #999;
    }
  }

  /* 图片字 */
  .imgText1 {
    width: 100%;
    display: flex;
    box-sizing: border-box;
    justify-content: space-between;
    .fir-sele.el-select {
      width: 40%;
    }
  }

  /* 列表样式 */
  .commodityType {
    display: flex;
    justify-content: space-around;
    align-items: center;
    span {
      display: inline-block;
      width: 58px;
      height: 32px;
      text-align: center;
      line-height: 32px;
      background: #fff;
      border: 1px solid #ebedf0;
      color: #979797;
      margin: 0 1px;
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

  /* 卡片样式 */
  .moditystyle {
    font-size: 12px;
    width: 100%;
    display: flex;
    span {
      width: 86px;
      height: 32px;
      display: inline-block;
      text-align: center;
      line-height: 32px;
      cursor: pointer;
      border: 1px solid #ebedf0;
      &.active {
        border: 1px solid #155bd4;
        background-color: #e0edff;
        color: #155bd4;
      }
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

  /* 单选框 */
  :deep(.radi1) {
    border-top: 1px solid #f7f8fa;
    border-bottom: 1px solid #f7f8fa;
    padding: 12px 0;
    .el-radio {
      margin: 10px 25px 7px 0;
    }
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
      /* 文章标签编辑 */
      .card-tags-edit {
        margin-top: 6px;
      }
      /* 文章计数编辑 */
      .card-counts-edit {
        margin-top: 6px;
      }
      /* 作者编辑 */
      .card-author-edit {
        margin-top: 6px;
      }
      /* 多图编辑 */
      .card-images-edit {
        margin-top: 6px;
        .image-list {
          display: flex;
          gap: 8px;
          margin-top: 4px;
          .image-item {
            position: relative;
            width: 50px;
            height: 50px;
          }
        }
      }
      /* 时间编辑 */
      .card-time-edit {
        margin-top: 6px;
      }
      /* 图片字 */
      .imgTextChild {
        width: 100%;
        display: flex;
        box-sizing: border-box;
        justify-content: space-between;
        margin-top: 8px;
        .fir-sele.el-select {
          width: 40%;
        }
      }
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

  .tit {
    :deep(.el-input__inner) {
      text-align: center;
    }
  }
}
</style>
