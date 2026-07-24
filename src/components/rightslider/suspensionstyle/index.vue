<template>
  <div class="suspensionstyle">
    <!-- 标题 -->
    <h2>{{ datas.text }}</h2>

    <!-- 表单 -->
    <el-form label-position="top" label-width="80px" :model="datas" :rules="rules" ref="form">
      <!-- #10 按钮图标 -->
      <el-form-item label="按钮图标">
        <div class="icon-upload">
          <img v-if="datas.iconUrl" :src="datas.iconUrl" class="icon-preview" />
          <div v-else class="icon-placeholder">无图标</div>
          <el-button size="mini" @click="$refs.iconUpload.showUpload()">上传图标</el-button>
        </div>
      </el-form-item>

      <!-- #10 位置 -->
      <el-form-item label="悬浮位置">
        <el-radio-group v-model="datas.position">
          <el-radio label="right-bottom">右下</el-radio>
          <el-radio label="right-top">右上</el-radio>
          <el-radio label="left-bottom">左下</el-radio>
          <el-radio label="left-top">左上</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- #10 水平偏移 -->
      <el-form-item label="水平偏移">
        <el-slider
          v-model="datas.offsetX"
          :min="-50"
          :max="50"
          input-size="small"
          show-input
        />
      </el-form-item>

      <!-- #10 垂直偏移 -->
      <el-form-item label="垂直偏移">
        <el-slider
          v-model="datas.offsetY"
          :min="-30"
          :max="30"
          input-size="small"
          show-input
        />
      </el-form-item>

      <!-- #10 透明度 -->
      <el-form-item label="透明度" prop="opacity">
        <el-slider
          v-model="datas.opacity"
          :min="0.1"
          :max="1"
          :step="0.05"
          input-size="small"
          show-input
        />
      </el-form-item>

      <!-- #10 FAB展开菜单 -->
      <el-form-item label="展开菜单">
        {{ datas.fabExpand ? '开' : '关' }}
        <el-checkbox style="margin-left: 180px" v-model="datas.fabExpand" />
      </el-form-item>

      <!-- #10 菜单项编辑 -->
      <template v-if="datas.fabExpand">
        <el-divider content-position="left">菜单项</el-divider>
        <div
          v-for="(item, idx) in datas.fabMenu"
          :key="idx"
          class="fab-menu-edit"
        >
          <el-input v-model="item.icon" placeholder="图标名(如chat-o)" size="mini" style="width: 40%" />
          <el-input v-model="item.text" placeholder="文案" size="mini" style="width: 40%" maxlength="6" />
          <van-icon
            name="delete-o"
            class="del-menu"
            @click="removeMenuItem(idx)"
          />
        </div>
        <el-button size="mini" @click="addMenuItem" plain>添加菜单项</el-button>
      </template>

      <div style="height: 15px" />

      <!-- 跳转页面 -->
      <el-form-item label="跳转页面">
        <div class="imgText">
          <el-select
            style="width: 60%"
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
          <el-input
            style="width: 100%"
            placeholder="请输入链接，输入前确保可以访问"
            v-model="datas.http.externalLink"
            maxlength="500"
          >
          </el-input>
        </div>
      </el-form-item>
    </el-form>

    <!-- #10 上传图标 -->
    <uploadimg ref="iconUpload" @uploadInformation="uploadIcon" />
  </div>
</template>
<script>
import uploadimg from '../../uploadImg'
export default {
  name: 'suspensionstyle',
  props: {
    datas: Object,
  },
  components: { uploadimg },
  data() {
    return {
      optionsType: [
        { type: '10', name: '内部链接' },
        { type: '11', name: '外部链接' },
      ],
      rules: {
        // #10 透明度范围校验
        opacity: [
          {
            validator: (rule, value, cb) => {
              if (value === '' || value == null) return cb(new Error('请输入透明度'))
              if (typeof value !== 'number' || isNaN(value))
                return cb(new Error('透明度必须为数字'))
              if (value < 0.1 || value > 1)
                return cb(new Error('透明度范围 0.1-1'))
              cb()
            },
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    // #10 上传图标回调
    uploadIcon(res) {
      if (typeof res !== 'string' || !/^https?:\/\/.+/i.test(res)) return
      this.datas.iconUrl = res
    },
    // #10 添加菜单项
    addMenuItem() {
      // 长度校验：最多5项
      if (!Array.isArray(this.datas.fabMenu)) this.datas.fabMenu = []
      if (this.datas.fabMenu.length >= 5) return
      this.datas.fabMenu.push({
        icon: 'plus',
        text: '菜单',
        linktype: '10',
        http: {},
      })
    },
    // #10 删除菜单项
    removeMenuItem(idx) {
      this.datas.fabMenu.splice(idx, 1)
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
  h2 {
    padding: 24px 16px 24px 0;
    margin-bottom: 15px;
    border-bottom: 1px solid #f2f4f6;
    font-size: 18px;
    font-weight: 600;
    color: #323233;
  }
  .icon-upload {
    display: flex;
    align-items: center;
    gap: 8px;
    .icon-preview {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      object-fit: cover;
    }
    .icon-placeholder {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f5f5;
      color: #999;
      font-size: 10px;
      border-radius: 50%;
    }
  }
  .fab-menu-edit {
    display: flex;
    gap: 6px;
    align-items: center;
    margin-bottom: 8px;
    .del-menu {
      color: #f56c6c;
      font-size: 18px;
      cursor: pointer;
    }
  }
  .imgText {
    width: 100%;
    display: flex;
    box-sizing: border-box;
    justify-content: space-between;
  }
}
</style>
