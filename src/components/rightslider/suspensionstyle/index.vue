<template>
  <div class="suspensionstyle">
    <!-- 标题 -->
    <h2>{{ datas.text }}</h2>

    <!-- 表单 -->
    <el-form label-position="top" label-width="80px" :model="datas">
      <!-- 跳转页面（原有单按钮跳转，FAB 关闭时生效） -->
      <el-form-item label="跳转页面">
        <div class="imgText">
          <!-- 选择类型 -->
          <el-select
            style="width: 60%"
            v-model="datas.linktype"
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
            placeholder="请输入链接，输入前确保可以访问"
            v-model="datas.http.externalLink"
          >
          </el-input>
        </div>
      </el-form-item>

      <!-- F10 新增：基础位置(四选一) -->
      <el-form-item label="按钮位置">
        <el-radio-group v-model="datas.position">
          <el-radio label="right-bottom">右下</el-radio>
          <el-radio label="left-bottom">左下</el-radio>
          <el-radio label="right-top">右上</el-radio>
          <el-radio label="left-top">左上</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- F10 新增：水平偏移(0-200) -->
      <el-form-item label="水平偏移">
        <el-slider
          v-model="datas.offsetX"
          :max="200"
          :min="0"
          input-size="small"
          show-input
          @change="checkOffsetX"
        >
        </el-slider>
      </el-form-item>

      <!-- F10 新增：垂直偏移(0-400) -->
      <el-form-item label="垂直偏移">
        <el-slider
          v-model="datas.offsetY"
          :max="400"
          :min="0"
          input-size="small"
          show-input
          @change="checkOffsetY"
        >
        </el-slider>
      </el-form-item>

      <!-- F10 新增：透明度(0-100) -->
      <el-form-item label="透明度">
        <el-slider
          v-model="datas.opacity"
          :max="100"
          :min="0"
          input-size="small"
          show-input
          @change="checkOpacity"
        >
        </el-slider>
      </el-form-item>

      <!-- F10 新增：主按钮图标（上传或输入 iconfont 类名） -->
      <el-form-item label="主按钮图标">
        <div class="icon-edit">
          <div class="icon-preview" v-if="datas.mainIcon">
            <img
              v-if="isImg(datas.mainIcon)"
              :src="datas.mainIcon"
              alt=""
            />
            <i v-else class="iconfont" :class="datas.mainIcon" />
          </div>
          <el-input
            v-model="datas.mainIcon"
            placeholder="输入图片链接或 iconfont 类名"
          />
          <el-button
            @click="showUpload('main')"
            type="primary"
            plain
            class="mini-btn"
            >上传图片</el-button
          >
        </div>
      </el-form-item>

      <!-- F10 新增：FAB 展开菜单开关 -->
      <el-form-item label="FAB 展开菜单">
        <el-checkbox v-model="datas.fabMode">启用点击展开子菜单</el-checkbox>
      </el-form-item>

      <!-- F10 新增：展开方向(上下左右) -->
      <el-form-item label="展开方向" v-if="datas.fabMode">
        <el-select v-model="datas.fabDirection" placeholder="请选择展开方向">
          <el-option label="向上" value="up" />
          <el-option label="向下" value="down" />
          <el-option label="向左" value="left" />
          <el-option label="向右" value="right" />
        </el-select>
      </el-form-item>

      <!-- F10 新增：FAB 子菜单编辑(vuedraggable 增删排序) -->
      <el-form-item label="子菜单列表" v-if="datas.fabMode">
        <div style="width: 100%">
          <p style="color: #969799; font-size: 12px; margin-bottom: 6px">
            拖动可排序
          </p>
          <vuedraggable
            :list="datas.menuList"
            item-key="index"
            :forceFallback="true"
            :animation="200"
          >
            <template #item="{ element, index }">
              <section class="menuItem">
                <!-- 删除子项 -->
                <van-icon
                  class="el-icon-circle-close"
                  name="close"
                  @click="deleteMenu(index)"
                />
                <!-- 图标：上传或输入 -->
                <div class="menu-icon" @click="showUpload('menu', index)">
                  <img
                    v-if="isImg(element.icon)"
                    draggable="false"
                    :src="element.icon"
                    alt=""
                  />
                  <i
                    v-else-if="element.icon"
                    class="iconfont"
                    :class="element.icon"
                  />
                  <span v-else>上传</span>
                </div>
                <!-- 文字与链接 -->
                <div class="menu-info">
                  <el-input
                    v-model="element.text"
                    placeholder="菜单文字"
                    maxlength="6"
                    show-word-limit
                  />
                  <div class="select-type">
                    <el-select
                      style="width: 60%"
                      v-model="element.linktype"
                      placeholder="跳转类型"
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
                      style="width: 100%"
                      placeholder="请输入链接"
                      v-model="element.http.externalLink"
                    />
                  </div>
                  <!-- 输入 iconfont 类名（图标也可手填） -->
                  <el-input
                    v-model="element.icon"
                    placeholder="图片链接或 iconfont 类名"
                  />
                </div>
              </section>
            </template>
          </vuedraggable>
          <el-button
            @click="addMenu"
            class="uploadImg"
            type="primary"
            plain
            >添加子菜单</el-button
          >
        </div>
      </el-form-item>
    </el-form>

    <!-- 上传图片 -->
    <uploadimg ref="upload" @uploadInformation="uploadInformation" />
  </div>
</template>
<script>
import uploadimg from '../../uploadImg' //图片上传
import vuedraggable from 'vuedraggable' //拖拽组件
import { ElMessage } from 'element-plus' //校验提示

export default {
  name: 'suspensionstyle',
  props: {
    datas: Object,
  },
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
      // 上传目标类型：main 主图标 / menu 子菜单图标
      uploadTarget: null,
      // 当前编辑的子菜单索引
      uploadMenuIndex: null,
    }
  },
  created() {},
  methods: {
    // 判断是否图片链接
    isImg(val) {
      return typeof val === 'string' && /^(https?:\/\/|data:image|\/)/.test(val)
    },
    // 水平偏移范围校验(0-200)
    checkOffsetX(val) {
      if (val < 0 || val > 200) {
        const fixed = Math.min(Math.max(Number(val) || 0, 0), 200)
        this.datas.offsetX = fixed
        ElMessage.warning('水平偏移需在 0-200 之间，已自动纠正')
      }
    },
    // 垂直偏移范围校验(0-400)
    checkOffsetY(val) {
      if (val < 0 || val > 400) {
        const fixed = Math.min(Math.max(Number(val) || 0, 0), 400)
        this.datas.offsetY = fixed
        ElMessage.warning('垂直偏移需在 0-400 之间，已自动纠正')
      }
    },
    // 透明度范围校验(0-100)
    checkOpacity(val) {
      if (val < 0 || val > 100) {
        const fixed = Math.min(Math.max(Number(val) || 0, 0), 100)
        this.datas.opacity = fixed
        ElMessage.warning('透明度需在 0-100 之间，已自动纠正')
      }
    },
    // 打开上传弹窗，记录上传目标
    showUpload(target, index) {
      this.uploadTarget = target
      this.uploadMenuIndex = index != null ? index : null
      this.$refs.upload.showUpload()
    },
    // 上传回调
    uploadInformation(res) {
      if (this.uploadTarget === 'main') {
        this.datas.mainIcon = res
      } else if (this.uploadTarget === 'menu' && this.uploadMenuIndex != null) {
        this.datas.menuList[this.uploadMenuIndex].icon = res
      }
    },
    // 新增子菜单项
    addMenu() {
      this.datas.menuList.push({
        icon: '',
        text: '菜单',
        linktype: '10',
        http: {},
      })
    },
    // 删除子菜单项
    deleteMenu(index) {
      this.datas.menuList.splice(index, 1)
    },
  },
  components: { uploadimg, vuedraggable },
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
    box-sizing: border-box;
    justify-content: space-between;
    .fir-sele.el-select {
      width: 40%;
    }
  }
  /* 主图标编辑区 */
  .icon-edit {
    width: 100%;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 6px;
    .icon-preview {
      width: 40px;
      height: 40px;
      border: 1px solid #ebedf0;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
      .iconfont {
        font-size: 24px;
        color: #155bd4;
      }
    }
    .mini-btn {
      margin: 0;
    }
  }
  /* 添加按钮 */
  .uploadImg {
    width: 100%;
    height: 40px;
    margin-top: 10px;
  }
  /* 子菜单项 */
  .menuItem {
    padding: 8px 12px;
    margin: 12px 0;
    border-radius: 2px;
    background-color: #fff;
    box-shadow: 0 0 4px 0 rgba(10, 42, 97, 0.2);
    display: flex;
    position: relative;
    .el-icon-circle-close {
      position: absolute;
      right: -8px;
      top: -8px;
      cursor: pointer;
      font-size: 19px;
    }
    .menu-icon {
      width: 50px;
      height: 50px;
      flex-shrink: 0;
      border: 1px dashed #dcdee0;
      border-radius: 5px;
      overflow: hidden;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #969799;
      font-size: 12px;
      img {
        width: 100%;
        height: 100%;
      }
      .iconfont {
        font-size: 26px;
        color: #155bd4;
      }
    }
    .menu-info {
      width: 80%;
      display: flex;
      flex-direction: column;
      padding-left: 12px;
      gap: 6px;
      .select-type {
        display: flex;
      }
    }
  }
}
</style>
