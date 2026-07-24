<template>
  <div id="followStyle">
    <!-- 标题 -->
    <h2>{{ datas.text }}</h2>

    <el-form>
      <el-form-item class="lef" label="公众号图片">
        <div class="follow-pic">
          <img :src="datas.heade" alt="" />
          <el-button
            @click="$refs.upload.showUpload()"
            class="uploadImg"
            type="primary"
            plain
          >
            上传公众号图片
          </el-button>
        </div>
      </el-form-item>

      <el-form-item class="lef" label="公众号名称">
        <el-input type="text" v-model="datas.followName" placeholder="请输入公众号名称" />
      </el-form-item>

      <el-form-item class="lef" label="公众号Id">
        <el-input type="text" v-model="datas.followAppId" placeholder="请输入公众号Id" />
      </el-form-item>

      <div class="bor" />

      <!-- F13 新增：关注按钮开关及文案 -->
      <el-form-item class="lef" label="关注按钮">
        <el-checkbox v-model="datas.showFollowBtn">
          {{ datas.showFollowBtn ? '显示' : '隐藏' }}
        </el-checkbox>
      </el-form-item>
      <template v-if="datas.showFollowBtn">
        <el-form-item class="lef" label="关注文案">
          <el-input
            type="text"
            v-model="datas.followBtnText"
            maxlength="6"
            placeholder="请输入关注按钮文案"
            @input="checkFollowBtnText"
          />
        </el-form-item>
        <el-form-item class="lef" label="已关注文案">
          <el-input
            type="text"
            v-model="datas.followedBtnText"
            maxlength="6"
            placeholder="请输入已关注文案"
          />
        </el-form-item>
        <!-- 预览态：切换按钮显示状态 -->
        <el-form-item class="lef" label="预览已关注">
          <el-checkbox v-model="datas.isFollowed">
            {{ datas.isFollowed ? '已关注态' : '未关注态' }}
          </el-checkbox>
        </el-form-item>
      </template>

      <div class="bor" />

      <!-- F13 新增：简介开关及内容 -->
      <el-form-item class="lef" label="公众号简介">
        <el-checkbox v-model="datas.showIntro">
          {{ datas.showIntro ? '显示' : '隐藏' }}
        </el-checkbox>
      </el-form-item>
      <el-form-item class="lef" label="简介内容" v-if="datas.showIntro">
        <el-input
          type="textarea"
          v-model="datas.intro"
          maxlength="60"
          show-word-limit
          :rows="3"
          placeholder="请输入公众号简介"
          @input="checkIntro"
        />
      </el-form-item>

      <div class="bor" />

      <!-- F13 新增：历史文章开关 -->
      <el-form-item class="lef" label="历史文章">
        <el-checkbox v-model="datas.showHistory">
          {{ datas.showHistory ? '显示' : '隐藏' }}
        </el-checkbox>
      </el-form-item>

      <!-- F13 新增：历史文章编辑（vuedraggable 拖拽增删编辑） -->
      <template v-if="datas.showHistory">
        <p style="color: #969799; font-size: 12px; margin: 6px 0">
          鼠标拖拽调整文章顺序
        </p>
        <vuedraggable
          :list="datas.historyList"
          item-key="index"
          :forceFallback="true"
          :animation="200"
        >
          <template #item="{ element, index }">
            <section class="historyItem">
              <!-- 删除按钮 -->
              <van-icon
                class="el-icon-circle-close"
                name="close"
                @click="deleteHistory(index)"
              />
              <!-- 封面上传 -->
              <div class="imag" @click="showHistoryUpload(index)">
                <img v-if="element.cover" :src="element.cover" alt="" draggable="false" />
                <span v-else>上传封面</span>
              </div>
              <!-- 标题和链接 -->
              <div class="imgText">
                <el-input
                  v-model="element.title"
                  maxlength="30"
                  placeholder="文章标题"
                  @input="checkHistoryTitle(index)"
                />
                <el-input
                  v-model="element.http.externalLink"
                  placeholder="请输入文章链接"
                />
              </div>
            </section>
          </template>
        </vuedraggable>

        <!-- 添加历史文章 -->
        <el-button
          @click="addHistory"
          class="uploadImg"
          type="primary"
          plain
        >
          添加历史文章
        </el-button>
      </template>
    </el-form>

    <!-- 上传图片（公众号头像 + 历史文章封面共用，通过 uploadTarget 区分） -->
    <uploadimg ref="upload" @uploadInformation="uploadInformation" />
  </div>
</template>

<script>
import { ElMessage } from 'element-plus'
import vuedraggable from 'vuedraggable' //拖拽组件
import uploadimg from '../../uploadImg' //图片上传
export default {
  name: 'followStyle',
  props: {
    datas: Object,
  },
  data() {
    return {
      // F13 新增：当前上传目标，null 表示上传公众号头像，数字表示历史文章下标
      uploadTarget: null,
    }
  },

  created() {
    console.log(this.datas,'-------------followStyle datas')
  },

  mounted() {},

  methods: {
    // 提交（区分头像上传与历史文章封面上传）
    uploadInformation(res) {
      if (this.uploadTarget === null) {
        // 上传公众号头像
        this.datas.heade = res
      } else {
        // 上传历史文章封面
        this.datas.historyList[this.uploadTarget].cover = res
        this.uploadTarget = null
      }
    },

    // F13 新增：打开历史文章封面上传弹框
    showHistoryUpload(index) {
      this.uploadTarget = index
      this.$refs.upload.showUpload()
    },

    // F13 新增：添加历史文章
    addHistory() {
      this.datas.historyList.push({
        title: '',
        cover: '',
        http: {},
      })
    },

    // F13 新增：删除历史文章
    deleteHistory(index) {
      this.datas.historyList.splice(index, 1)
    },

    // F13 新增：关注文案校验（<=6）
    checkFollowBtnText() {
      if (this.datas.followBtnText && this.datas.followBtnText.length > 6) {
        this.datas.followBtnText = this.datas.followBtnText.slice(0, 6)
        ElMessage.warning('关注按钮文案最多 6 个字符')
      }
    },

    // F13 新增：简介校验（<=60）
    checkIntro() {
      if (this.datas.intro && this.datas.intro.length > 60) {
        this.datas.intro = this.datas.intro.slice(0, 60)
        ElMessage.warning('简介最多 60 个字符')
      }
    },

    // F13 新增：历史文章标题校验（<=30）
    checkHistoryTitle(index) {
      const item = this.datas.historyList[index]
      if (item.title && item.title.length > 30) {
        item.title = item.title.slice(0, 30)
        ElMessage.warning('文章标题最多 30 个字符')
      }
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
#followStyle {
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  padding: 0 10px 20px;
  box-sizing: border-box;
}

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

.follow-pic {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  img {
    display: block;
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
  .uploadImg {
    width: 80%;
    margin-top: 20px;
  }
}

/* F13 新增：分隔线 */
.bor {
  height: 1px;
  background: #f2f4f6;
  margin: 15px 0;
}

/* F13 新增：历史文章编辑项样式 */
.historyItem {
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

  /* 封面 */
  .imag {
    width: 60px;
    height: 60px;
    flex: none;
    border-radius: 5px;
    overflow: hidden;
    position: relative;
    cursor: pointer;
    background: #f2f4f6;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 100%;
      height: 100%;
      display: inline-block;
      object-fit: cover;
    }
    span {
      font-size: 12px;
      color: #969799;
      text-align: center;
    }
  }

  /* 文本 */
  .imgText {
    flex: 1;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding-left: 20px;
    justify-content: space-between;
    .el-input {
      margin-bottom: 6px;
    }
  }
}

/* F13 新增：添加按钮 */
.uploadImg {
  width: 100%;
  margin-top: 10px;
}
</style>
