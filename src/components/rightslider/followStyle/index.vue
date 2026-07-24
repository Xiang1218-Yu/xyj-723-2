<template>
  <div id="followStyle">
    <!-- 标题 -->
    <h2>{{ datas.text }}</h2>

    <el-form :model="datas" :rules="rules" ref="followForm" label-width="100px">
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

      <!-- 初始关注状态开关 -->
      <el-form-item class="lef" label="初始关注状态">
        {{ datas.isFollowed ? '已关注' : '未关注' }}
        <el-checkbox style="margin-left: 170px" v-model="datas.isFollowed" />
      </el-form-item>

      <!-- 关注按钮文案 -->
      <el-form-item class="lef" label="关注按钮文案" prop="followBtnText">
        <el-input
          type="text"
          v-model="datas.followBtnText"
          placeholder="请输入关注按钮文案"
          maxlength="8"
          show-word-limit
        />
      </el-form-item>

      <!-- 已关注文案 -->
      <el-form-item class="lef" label="已关注文案" prop="followedBtnText">
        <el-input
          type="text"
          v-model="datas.followedBtnText"
          placeholder="请输入已关注文案"
          maxlength="8"
          show-word-limit
        />
      </el-form-item>

      <div class="bor" />

      <!-- 显示简介开关 -->
      <el-form-item class="lef" label="显示简介">
        {{ datas.showDescription ? '显示' : '隐藏' }}
        <el-checkbox style="margin-left: 196px" v-model="datas.showDescription" />
      </el-form-item>

      <!-- 简介内容 -->
      <el-form-item
        v-if="datas.showDescription"
        class="lef"
        label="简介内容"
        prop="description"
      >
        <el-input
          type="textarea"
          v-model="datas.description"
          placeholder="请输入公众号简介"
          maxlength="100"
          show-word-limit
          :rows="3"
        />
      </el-form-item>

      <div class="bor" />

      <!-- 显示历史文章开关 -->
      <el-form-item class="lef" label="显示历史文章">
        {{ datas.showHistoryArticles ? '显示' : '隐藏' }}
        <el-checkbox style="margin-left: 180px" v-model="datas.showHistoryArticles" />
      </el-form-item>

      <!-- 历史文章编辑器 -->
      <div v-if="datas.showHistoryArticles" class="articles-editor">
        <h5 style="color: #000; font-size: 14px; margin: 10px 0">历史文章列表</h5>

        <!-- 文章项列表 -->
        <div
          v-for="(article, index) in datas.historyArticles"
          :key="index"
          class="article-edit-item"
        >
          <van-icon
            class="delete-article"
            name="close"
            @click="deleteArticle(index)"
          />
          <el-form-item
            :label="'文章' + (index + 1) + '标题'"
            :prop="'historyArticles.' + index + '.title'"
            :rules="articleTitleRules"
          >
            <el-input
              v-model="article.title"
              placeholder="请输入文章标题"
              maxlength="50"
              show-word-limit
            />
          </el-form-item>
          <el-form-item
            label="文章URL"
            :prop="'historyArticles.' + index + '.url'"
            :rules="articleUrlRules"
          >
            <el-input v-model="article.url" placeholder="请输入文章链接" />
          </el-form-item>
          <el-form-item label="发布日期">
            <el-date-picker
              v-model="article.date"
              type="date"
              placeholder="选择日期"
              value-format="YYYY-MM-DD"
              style="width: 100%"
            />
          </el-form-item>
        </div>

        <!-- 添加文章按钮 -->
        <el-button
          @click="addArticle"
          class="add-article-btn"
          type="primary"
          plain
          :disabled="datas.historyArticles.length >= 10"
        >
          + 添加文章
        </el-button>

        <!-- 显示文章数滑块 -->
        <el-form-item class="lef" label="显示文章数" style="margin-top: 15px">
          <el-slider
            v-model="datas.articleCount"
            :min="1"
            :max="5"
            show-input
            :step="1"
          />
        </el-form-item>
      </div>
    </el-form>

    <!-- 上传图片 -->
    <uploadimg ref="upload" @uploadInformation="uploadInformation" />
  </div>
</template>

<script>
import uploadimg from '../../uploadImg' //图片上传
export default {
  name: 'followStyle',
  props: {
    datas: Object,
  },
  data() {
    // 校验文章标题长度
    const validateArticleTitle = (rule, value, callback) => {
      if (!value || value.trim() === '') {
        callback(new Error('请输入文章标题'))
      } else if (value.length > 50) {
        callback(new Error('文章标题不能超过50字'))
      } else {
        callback()
      }
    }
    // 校验URL格式
    const validateUrl = (rule, value, callback) => {
      if (value && value.trim() !== '') {
        const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/
        if (!urlPattern.test(value)) {
          callback(new Error('请输入有效的URL地址'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      rules: {
        followBtnText: [
          { required: true, message: '请输入关注按钮文案', trigger: 'blur' },
          { max: 8, message: '不能超过8个字符', trigger: 'blur' },
        ],
        followedBtnText: [
          { required: true, message: '请输入已关注文案', trigger: 'blur' },
          { max: 8, message: '不能超过8个字符', trigger: 'blur' },
        ],
        description: [
          { max: 100, message: '简介不能超过100字', trigger: 'blur' },
        ],
      },
      articleTitleRules: [{ validator: validateArticleTitle, trigger: 'blur' }],
      articleUrlRules: [{ validator: validateUrl, trigger: 'blur' }],
    }
  },

  created() {
    console.log(this.datas, '-------------followStyle datas')
    // 确保historyArticles是数组
    if (!this.datas.historyArticles) {
      this.datas.historyArticles = []
    }
  },

  mounted() {},

  methods: {
    // 提交
    uploadInformation(res) {
      this.datas.heade = res
    },
    // 添加文章
    addArticle() {
      if (!this.datas.historyArticles) {
        this.datas.historyArticles = []
      }
      const today = new Date()
      const dateStr = today.getFullYear() + '-' +
        String(today.getMonth() + 1).padStart(2, '0') + '-' +
        String(today.getDate()).padStart(2, '0')
      this.datas.historyArticles.push({
        title: '',
        url: '',
        date: dateStr,
      })
    },
    // 删除文章
    deleteArticle(index) {
      this.datas.historyArticles.splice(index, 1)
    },
  },

  computed: {},

  watch: {},
  components: {
    uploadimg,
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

.bor {
  height: 1px;
  background: #f2f4f6;
  margin: 15px 0;
}

/* 文章编辑器样式 */
.articles-editor {
  .article-edit-item {
    background: #f9f9f9;
    border-radius: 6px;
    padding: 12px;
    margin-bottom: 12px;
    position: relative;
    .delete-article {
      position: absolute;
      right: 8px;
      top: 8px;
      font-size: 16px;
      cursor: pointer;
      color: #999;
      &:hover {
        color: #f56c6c;
      }
    }
    :deep(.el-form-item) {
      margin-bottom: 10px;
    }
    :deep(.el-form-item:last-child) {
      margin-bottom: 0;
    }
  }
  .add-article-btn {
    width: 100%;
    margin-top: 5px;
  }
}
</style>
