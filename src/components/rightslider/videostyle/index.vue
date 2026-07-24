<template>
  <div class="videostyle">
    <!-- 标题 -->
    <h2>{{ datas.text }}</h2>

    <el-form label-width="70px" :model="datas" :rules="rules" ref="form" class="lef">
      <!-- 封面链接 -->
      <el-form-item label="封面链接" prop="coverUrl">
        <el-input
          v-model="datas.coverUrl"
          placeholder="请输入封面图片链接(http/https)"
          show-word-limit
          :maxlength="500"
        />
      </el-form-item>

      <!-- 视频链接 -->
      <el-form-item label="视频链接" prop="src">
        <el-input
          v-model="datas.src"
          placeholder="请输入视频地址(mp4)"
          show-word-limit
          :maxlength="500"
        />
      </el-form-item>

      <!-- 填充方式 (#2) -->
      <el-form-item label="填充方式">
        <el-radio-group v-model="datas.objectFit">
          <el-radio label="contain">包含</el-radio>
          <el-radio label="cover">覆盖</el-radio>
          <el-radio label="fill">填充</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 是否自动播放 -->
      <el-form-item class="lef" label="自动播放" label-width="100px">
        {{ datas.autoplay ? '是' : '否' }}
        <el-checkbox style="margin-left: 196px" v-model="datas.autoplay" />
      </el-form-item>

      <!-- 循环播放 (#2) -->
      <el-form-item class="lef" label="循环播放" label-width="100px">
        {{ datas.loop ? '是' : '否' }}
        <el-checkbox style="margin-left: 196px" v-model="datas.loop" />
      </el-form-item>

      <!-- 静音 (#2) -->
      <el-form-item class="lef" label="静音" label-width="100px">
        {{ datas.muted ? '是' : '否' }}
        <el-checkbox style="margin-left: 196px" v-model="datas.muted" />
      </el-form-item>

      <!-- 控件开关 (#2) -->
      <el-form-item class="lef" label="显示控件" label-width="100px">
        {{ datas.showControls ? '是' : '否' }}
        <el-checkbox style="margin-left: 196px" v-model="datas.showControls" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'videostyle',
  props: {
    datas: Object,
  },
  data() {
    // #2 URL格式校验
    const validateUrl = (rule, value, callback) => {
      if (!value) {
        // 封面允许为空
        if (rule.field === 'coverUrl') return callback()
        return callback(new Error('请输入视频链接'))
      }
      if (typeof value !== 'string') return callback(new Error('链接必须为字符串'))
      if (value.length > 500) return callback(new Error('链接长度不能超过500字符'))
      if (!/^https?:\/\/.+/i.test(value)) {
        return callback(new Error('链接需以 http:// 或 https:// 开头'))
      }
      callback()
    }
    return {
      rules: {
        src: [{ validator: validateUrl, trigger: 'blur' }],
        coverUrl: [{ validator: validateUrl, trigger: 'blur' }],
      },
    }
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
}
</style>
