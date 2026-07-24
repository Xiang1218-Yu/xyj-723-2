<template>
  <div class="videostyle">
    <!-- 标题 -->
    <h2>{{ datas.text }}</h2>

    <el-form label-width="70px" :model="datas" class="lef">
      <el-form-item label="封面链接">
        <el-input
          v-model="datas.coverUrl"
          placeholder="请输入封面链接"
          maxlength="500"
          show-word-limit
          @blur="checkUrl('coverUrl', '封面链接')"
        />
      </el-form-item>
      <el-form-item label="视频链接">
        <el-input
          v-model="datas.src"
          placeholder="请输入视频链接"
          maxlength="500"
          show-word-limit
          @blur="checkUrl('src', '视频链接')"
        />
      </el-form-item>
      <!-- 是否自动播放 -->
      <el-form-item class="lef" label="是否自动播放" label-width="100px">
        {{ datas.autoplay ? '是' : '否' }}
        <el-checkbox style="margin-left: 196px" v-model="datas.autoplay" />
      </el-form-item>
      <!-- 是否循环播放 -->
      <el-form-item class="lef" label="循环播放" label-width="100px">
        {{ datas.loop ? '是' : '否' }}
        <el-checkbox style="margin-left: 196px" v-model="datas.loop" />
      </el-form-item>
      <!-- 是否静音 -->
      <el-form-item class="lef" label="静音" label-width="100px">
        {{ datas.muted ? '是' : '否' }}
        <el-checkbox style="margin-left: 196px" v-model="datas.muted" />
      </el-form-item>
      <!-- 是否显示控件 -->
      <el-form-item class="lef" label="显示控件" label-width="100px">
        {{ datas.controls ? '是' : '否' }}
        <el-checkbox style="margin-left: 196px" v-model="datas.controls" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus' // 消息提示

export default {
  name: 'videostyle',
  props: {
    datas: Object,
  },
  data() {
    return {}
  },
  created() {},
  methods: {
    /* 链接格式校验：非空时校验是否为合法 http/https URL，并限制长度不超过 500 字符 */
    checkUrl(field, label) {
      const value = this.datas[field]
      // 空值不做校验
      if (!value) return
      // 长度校验：链接不超过 500 字符
      if (value.length > 500) {
        ElMessage.error(`${label}长度不能超过 500 个字符`)
        return
      }
      // URL 格式校验：必须以 http/https 开头
      const reg = /^https?:\/\/.+/i
      if (!reg.test(value)) {
        ElMessage.error(`${label}格式不正确，请输入以 http/https 开头的合法链接`)
      }
    },
  },
}
</script>

<style scoped lang="less">
.videostyle {
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

  /* 刷新 */
  .link {
    display: inline-block;
    padding: 0 10px;
    height: 32px;
    line-height: 32px;
    font-size: 12px;
    cursor: pointer;
    color: #155bd4;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
}
</style>
