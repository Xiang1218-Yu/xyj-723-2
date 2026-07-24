<template>
  <div class="home">
    <!-- 按钮集合 -->
    <section class="buttons">
      <p
        style="
          font-size: 12px;
          color: #4f4f4f;
          margin-left: 15px;
          cursor: pointer;
        "
      >
        <!-- 返回 -->
      </p>
      <div>
        <el-button @click="reloads" type="danger">重置</el-button>
        <el-button @click="realTimeViewData.show = true">预览</el-button>
        <el-button @click="catJson">查看JSON </el-button>
        <el-button @click="$refs.file.click()">导入JSON </el-button>
        <el-button @click="exportJSON">导出JSON </el-button>
        <!-- F16 新增：导出静态 HTML / 导出 PNG 长图 -->
        <el-button @click="exportHTML">导出HTML </el-button>
        <el-button @click="exportImage" :loading="exporting">导出长图 </el-button>
        <input
          type="file"
          ref="file"
          id="file"
          accept=".json"
          @change="importJSON"
          style="display: none"
        />
      </div>
    </section>

    <!-- 装修操作 -->
    <section class="operation">
      <!-- 组件 -->
      <sliderassembly :pointer="pointer" />

      <!-- 手机 -->
      <div class="phone">
        <section class="phoneAll" ref="imageTofile" id="imageTofile">
          <img src="@/assets/images/phoneTop.png" alt="" class="statusBar" />

          <!-- 头部导航 -->
          <headerTop :pageSetup="pageSetup" @click="headTop" />

          <!-- 主体内容 -->
          <section
            class="phone-container"
            :style="containerStyle"
            @drop="drop($event)"
            @dragover="allowDrop($event)"
            @dragleave="dragleaves($event)"
          >
            <!-- 动态组件 -->
            <vuedraggable
              :class="pointer.show ? 'pointer-events' : ''"
              :list="pageComponents"
              item-key="index"
              :forceFallback="true"
              :animation="200"
            >
              <template #item="{ element, index }">
                <component
                  :is="element.component"
                  :datas="element.setStyle"
                  :style="{
                    border:
                      element.active && deleShow ? '2px solid #155bd4' : '',
                  }"
                  @click="activeComponent(element, index)"
                  class="componentsClass"
                  :data-type="element.type"
                >
                  <template #deles>
                    <div
                      v-show="deleShow"
                      class="deles"
                      @click.stop="deleteObj(index)"
                    >
                      <!-- 删除组件 -->
                      <span class="iconfont icon-sanjiaoxingzuo"></span>
                      {{ element.text }}
                      <van-icon name="delete" />
                    </div>
                  </template>
                </component>
              </template>
            </vuedraggable>
          </section>

          <!-- 手机高度 -->
          <div class="phoneSize">iPhone 8手机高度</div>

          <!-- 底部 -->
          <phoneBottom />
        </section>
        <!-- 底部 -->
      </div>

      <!-- 页面设置tab -->
      <div class="decorateTab">
        <span
          :class="rightcom === 'decorate' ? 'active' : ''"
          @click="rightcom = 'decorate'"
        >
          <i class="iconfont icon-wangye" />
          页面设置
        </span>
        <span
          :class="rightcom === 'componenmanagement' ? 'active' : ''"
          @click="rightcom = 'componenmanagement'"
        >
          <i class="iconfont icon-zujian" />
          组件管理
        </span>
        <span
          class="active"
          v-show="rightcom != 'componenmanagement' && rightcom != 'decorate'"
        >
          <i class="iconfont icon-zujian" />
          组件设置
        </span>
      </div>

      <!-- 右侧工具栏 -->
      <div class="decorateAll">
        <!-- 页面设置 -->
        <transition name="decorateAnima">
          <!-- 动态组件 -->
          <component
            :is="rightcom"
            :datas="currentproperties"
            @componenmanagement="componenmanagement"
          />
        </transition>
      </div>
    </section>
    <realTimeView
      :datas="realTimeViewData"
      :val="{
        id,
        name: pageSetup.name,
        templateJson: JSON.stringify(pageSetup),
        component: JSON.stringify(pageComponents),
      }"
    />
  </div>
</template>

<script setup>
import utils from 'utils/index' // 方法类
import componentProperties from '@/utils/componentProperties' // 组件数据
import FileSaver from 'file-saver' // 导出JSON
import html2canvas from 'html2canvas/dist/html2canvas.min.js' // F16：导出 PNG 长图(使用自包含浏览器构建，避免 alpha 版缺失 css-line-break 依赖)
import { reactive, watch, toRefs, inject, computed, ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import vuedraggable from 'vuedraggable' //拖拽组件

// 是否显示预览
const realTimeViewData = reactive({ show: false })

// F16：长图导出中状态(防止重复点击)
const exporting = ref(false)

// F16：页面设置默认模板(工厂函数)，用于初始化与导入时的字段补全基准
const createDefaultPageSetup = () => ({
  // 页面设置属性
  name: '页面标题', //页面名称
  details: '', //页面描述
  isPerson: false, // 是否显示个人中心
  isBack: true, // 是否返回按钮
  titleHeight: 35, // 高度
  bgColor: 'rgba(249, 249, 249, 10)', //背景颜色
  bgImg: '', // 背景图片
  // F15 新增：页面背景与标题栏增强
  bgType: 'color', // 背景类型: color(纯色)/gradient(渐变)/image(图片)
  gradientStart: 'rgb(255, 255, 255)', // 渐变起始色
  gradientEnd: 'rgb(230, 240, 255)', // 渐变结束色
  gradientAngle: 180, // 渐变角度(0-360)
  bgRepeat: 'cover', // 背景图铺贴方式: cover(覆盖)/repeat(平铺)
  titleColor: '#333333', // 标题栏文字颜色
  pageMargin: 0, // 页面外边距(px, 0-30)
})
// 导入时用作字段补全基准的默认页面设置
const defaultPageSetup = createDefaultPageSetup()

// 页面数据
const datas = reactive({
  id: null, //当前页面id
  pageSetup: createDefaultPageSetup(),
  pageComponents: [], //页面组件
})

/**
 * F15 新增：根据页面背景配置计算主体容器样式
 * 支持纯色 / 渐变 / 图片(覆盖或平铺)，并应用页面外边距
 */
const containerStyle = computed(() => {
  const p = datas.pageSetup
  const style = {
    padding: (p.pageMargin || 0) + 'px', //页面外边距
  }
  if (p.bgType === 'gradient') {
    // 渐变背景
    style.backgroundImage = `linear-gradient(${p.gradientAngle}deg, ${p.gradientStart}, ${p.gradientEnd})`
  } else if (p.bgType === 'image' && p.bgImg) {
    // 图片背景，支持覆盖(cover)与平铺(repeat)
    style.backgroundImage = `url(${p.bgImg})`
    if (p.bgRepeat === 'repeat') {
      style.backgroundRepeat = 'repeat'
      style.backgroundSize = 'auto'
    } else {
      style.backgroundRepeat = 'no-repeat'
      style.backgroundSize = 'cover'
    }
    style.backgroundColor = p.bgColor //图片下方兜底色
  } else {
    // 纯色背景(默认)
    style.backgroundColor = p.bgColor
  }
  return style
})

// 查看JSON
const catJson = () => {
  ElMessageBox.alert(
    `{
          <br/>
          "id": ${datas.id},
          <br/>
          "name": "${datas.pageSetup.name}",
          <br/>
          "templateJson": '${JSON.stringify(datas.pageSetup)}',
          <br/>
          "component": '${JSON.stringify(datas.pageComponents)}',
          <br/>
        }`,
    '查看JSON',
    {
      confirmButtonText: '确定',
      customClass: 'JSONView',
      dangerouslyUseHTMLString: true,
      callback: () => {},
    }
  )
}

// 导出json
const exportJSON = () => {
  // 将json转换成字符串
  const data = JSON.stringify({
    id: datas.id,
    name: datas.pageSetup.name,
    // F16：导出时写入数据版本，便于导入时做版本迁移
    version: componentProperties.get('componentPropertiesVersion'),
    templateJson: JSON.stringify(datas.pageSetup),
    component: JSON.stringify(datas.pageComponents),
  })
  const blob = new Blob([data], { type: '' })
  FileSaver.saveAs(blob, `${datas.pageSetup.name}.json`)
}

/**
 * F16：对导入的组件列表做字段补全/版本迁移
 * 以 componentProperties 中的默认模板为基准，补齐新增字段，兼容旧版本 JSON
 *
 * @param {Array} list 导入的组件数组
 * @returns {Array} 补全后的组件数组
 */
const migrateComponents = (list) => {
  if (!utils.isArray(list)) return []
  return list.map((item) => {
    // 占位提示组件无需迁移
    if (!item || !item.component || item.component === 'placementarea') {
      return item
    }
    const template = componentProperties.get(item.component)
    // 找不到对应模板(未知组件)则原样返回
    if (!template) return item
    // 用默认模板补全整个组件对象(含 setStyle 内新增字段)
    return utils.completeFields(utils.deepClone(template), item)
  })
}

// 导入json
const importJSON = () => {
  const file = document.getElementById('file').files[0]
  const reader = new FileReader()
  reader.readAsText(file)
  let _this = datas
  reader.onload = function () {
    try {
      // this.result为读取到的json字符串，需转成json对象
      let ImportJSON = JSON.parse(this.result)

      // F16：基础格式校验，缺少关键字段则提示并终止
      if (!ImportJSON || !ImportJSON.templateJson || !ImportJSON.component) {
        ElMessage.error('导入失败：JSON 格式不正确或缺少必要字段')
        return
      }

      // 解析页面设置与组件列表
      const importedSetup = JSON.parse(ImportJSON.templateJson)
      const importedComponents = JSON.parse(ImportJSON.component)

      // F16：页面设置字段补全(以当前默认 pageSetup 为基准，补齐新增的背景/标题栏等字段)
      _this.id = ImportJSON.id
      _this.pageSetup = utils.completeFields(
        utils.deepClone(defaultPageSetup),
        importedSetup
      )
      // F16：组件列表版本迁移补全
      _this.pageComponents = migrateComponents(importedComponents)

      // 提示版本迁移结果
      const curVersion = componentProperties.get('componentPropertiesVersion')
      if (ImportJSON.version && ImportJSON.version !== curVersion) {
        ElMessage.success(
          `已从 ${ImportJSON.version} 迁移至 ${curVersion}，并自动补全新增字段`
        )
      } else {
        ElMessage.success('导入成功')
      }
    } catch (e) {
      console.error('导入解析失败', e)
      ElMessage.error('导入失败：文件内容无法解析')
    } finally {
      // 清空 input 值，保证同一文件可再次触发 change
      const fileEl = document.getElementById('file')
      if (fileEl) fileEl.value = ''
    }
  }
}

/**
 * F16：导出静态 HTML —— 将当前预览手机区域的真实 DOM 与样式内联导出为独立 HTML 文件，
 * 便于脱离编辑器直接在浏览器中查看渲染效果
 */
const exportHTML = () => {
  const el = document.getElementById('imageTofile')
  if (!el) {
    ElMessage.error('未找到可导出的页面内容')
    return
  }
  // 收集页面中所有样式(内联 style 标签 + 外链样式表链接)
  let styles = ''
  document.querySelectorAll('style').forEach((s) => {
    styles += `<style>${s.innerHTML}</style>\n`
  })
  document.querySelectorAll('link[rel="stylesheet"]').forEach((l) => {
    styles += `<link rel="stylesheet" href="${l.href}">\n`
  })

  // 组装完整 HTML 文档，居中展示 375px 宽的手机内容
  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${datas.pageSetup.name || '页面预览'}</title>
${styles}
<style>
  body { margin: 0; display: flex; justify-content: center; background: #f7f8fa; }
  .export-wrap { width: 375px; background: #fff; }
</style>
</head>
<body>
<div class="export-wrap">${el.innerHTML}</div>
</body>
</html>`

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  FileSaver.saveAs(blob, `${datas.pageSetup.name || 'page'}.html`)
  ElMessage.success('已导出静态 HTML')
}

/**
 * F16：预检测图片是否可跨域加载（用于导出降级）
 * 尝试以 crossOrigin='anonymous' 加载图片，成功说明可安全绘制到 canvas，
 * 失败(跨域未授权/加载超时)则收集其 src，导出时对这些图片做降级处理。
 *
 * @param {HTMLElement} root 需要截图的根节点
 * @returns {Promise<Set<string>>} 无法安全导出的图片 src 集合
 */
const detectUnsafeImages = (root) => {
  const imgs = Array.from(root.querySelectorAll('img')).filter((i) => i.src)
  return Promise.all(
    imgs.map(
      (img) =>
        new Promise((resolve) => {
          // 同源图片直接视为安全
          try {
            const u = new URL(img.src, window.location.href)
            if (u.origin === window.location.origin) return resolve(null)
          } catch (e) {
            return resolve(null)
          }
          const test = new Image()
          test.crossOrigin = 'anonymous'
          // 3 秒超时视为不可安全导出
          const timer = setTimeout(() => resolve(img.src), 3000)
          test.onload = () => {
            clearTimeout(timer)
            resolve(null)
          }
          test.onerror = () => {
            clearTimeout(timer)
            resolve(img.src) // 跨域失败，标记为不安全
          }
          test.src = img.src
        })
    )
  ).then((results) => new Set(results.filter(Boolean)))
}

/**
 * F16：导出 PNG 长图 —— 用 html2canvas 对整块手机预览区域截图，导出为 PNG
 * 对跨域图片做降级处理：无法安全加载的图片在克隆节点中替换为灰底占位，
 * 避免 canvas 被污染(tainted)导致导出彻底失败。
 */
const exportImage = async () => {
  const el = document.getElementById('imageTofile')
  if (!el) {
    ElMessage.error('未找到可导出的页面内容')
    return
  }
  exporting.value = true
  try {
    // 预检测跨域不可导出的图片
    const unsafe = await detectUnsafeImages(el)
    if (unsafe.size) {
      ElMessage.warning(`存在 ${unsafe.size} 张跨域图片，已用占位图降级导出`)
    }
    const canvas = await html2canvas(el, {
      useCORS: true, // 允许跨域图片(需图片服务支持 CORS)
      allowTaint: false, // 不允许污染画布，保证 toBlob 可用
      scale: 2, // 2 倍分辨率，长图更清晰
      backgroundColor: '#ffffff',
      imageTimeout: 8000, // 图片加载超时(ms)
      // 克隆阶段对不安全图片做降级：替换为灰底占位，避免污染画布
      onclone: (doc) => {
        doc.querySelectorAll('img').forEach((img) => {
          if (unsafe.has(img.src)) {
            img.removeAttribute('src')
            img.style.background = '#f2f4f6'
          }
        })
      },
    })
    // canvas 转 blob 后下载
    canvas.toBlob((blob) => {
      if (blob) {
        FileSaver.saveAs(blob, `${datas.pageSetup.name || 'page'}.png`)
        ElMessage.success('已导出长图')
      } else {
        ElMessage.error('长图生成失败')
      }
      exporting.value = false
    })
  } catch (e) {
    console.error('导出长图失败', e)
    ElMessage.error('导出长图失败，请检查图片资源是否可访问')
    exporting.value = false
  }
}

/**
 * 切换组件位置  用于组件管理中删除功能
 *
 * @param {Object} res 组件切换后返回的位置
 */
const componenmanagement = (res) => {
  datas.pageComponents = res
}

// 选择组件数据
const choose = reactive({
  deleShow: true, // 删除标签显示
  index: '', // 当前选中的index
  rightcom: 'decorate', // 右侧组件切换
  currentproperties: datas.pageSetup, // 当前属性  默认：页面设置
  offsetY: 0, //记录上一次距离父元素高度
  onlyOne: ['1-5', '1-16'], // 只能存在一个的组件(组件的type)
  pointer: { show: false }, // 穿透
})

/**
 * 选择组件
 *
 * @param {Object} res 当前组件对象
 */
const activeComponent = (res, index) => {
  choose.index = index
  /* 切换组件 */
  choose.rightcom = res.style
  /* 丢样式 */
  choose.currentproperties = res.setStyle

  /* 替换 */
  datas.pageComponents.forEach((res) => {
    /* 修改选中 */
    if (res.active === true) res.active = false
  })

  /* 选中样式 */
  res.active = true
}

// 切换标题
const headTop = () => {
  choose.rightcom = 'decorate'
  /* 替换 */
  datas.pageComponents.forEach((res) => {
    /* 修改选中 */
    if (res.active === true) res.active = false
  })
}

/**
 * 删除组件
 *
 * @param {Number} index 当前组件index
 */
const deleteObj = (index) => {
  datas.pageComponents.splice(index, 1)
  if (choose.index === index) choose.rightcom = 'decorate'
  if (index < choose.index) choose.index = choose.index - 1
}

/**
 * 当将元素或文本选择拖动到有效放置目标（每几百毫秒）上时，会触发此事件
 *
 * @param {Object} event event对象
 */
const allowDrop = (event) => {
  //阻止浏览器的默认事件
  event.preventDefault()

  /* 获取鼠标高度 */
  let eventoffset = event.offsetY

  /* 如果没有移动不触发事件减少损耗 */
  if (choose.offsetY === eventoffset) return
  else choose.offsetY = eventoffset

  /* 获取组件 */
  const childrenObject = event.target.children[0]

  // 一个以上的组件计算
  if (datas.pageComponents.length) {
    /* 如果只有一个组件并且第一个是提示组件直接返回 */
    if (datas.pageComponents.length === 1 && datas.pageComponents[0].type === 0)
      return

    /* 如果鼠标的高度小于第一个的一半直接放到第一个 */
    if (eventoffset < childrenObject.children[0].clientHeight / 2) {
      /* 如果第一个是提示组件直接返回 */
      if (datas.pageComponents[0].type === 0) return

      /* 删除提示组件 */
      datas.pageComponents = datas.pageComponents.filter(
        (res) => res.component !== 'placementarea'
      )

      /* 最后面添加提示组件 */
      datas.pageComponents.unshift({
        component: 'placementarea',
        type: 0,
      })

      return
    }

    /* 记录距离父元素高度 */
    const childOff = childrenObject.offsetTop

    /* 鼠标在所有组件下面 */
    if (
      eventoffset > childrenObject.clientHeight ||
      childrenObject.lastChild.offsetTop -
        childOff +
        childrenObject.lastChild.clientHeight / 2 <
        eventoffset
    ) {
      /* 最后一个组件是提示组件返回 */
      if (datas.pageComponents[datas.pageComponents.length - 1].type === 0)
        return

      /* 清除提示组件 */
      datas.pageComponents = datas.pageComponents.filter(
        (res) => res.component !== 'placementarea'
      )

      /* 最后一个不是提示组件添加 */
      datas.pageComponents.push({
        component: 'placementarea',
        type: 0,
      })

      return
    }

    const childrens = childrenObject.children

    /* 在两个组件中间，插入 */
    for (let i = 0, l = childrens.length; i < l; i++) {
      const childoffset = childrens[i].offsetTop - childOff

      if (childoffset + childrens[i].clientHeight / 2 > event.offsetY) {
        /* 如果是提示组件直接返回 */
        if (datas.pageComponents[i].type === 0) break

        if (datas.pageComponents[i - 1].type === 0) break

        /* 清除提示组件 */
        datas.pageComponents = datas.pageComponents.filter(
          (res) => res.component !== 'placementarea'
        )

        datas.pageComponents.splice(i, 0, {
          component: 'placementarea',
          type: 0,
        })
        break
      } else if (childoffset + childrens[i].clientHeight > event.offsetY) {
        if (datas.pageComponents[i].type === 0) break

        if (
          !datas.pageComponents[i + 1] ||
          datas.pageComponents[i + 1].type === 0
        )
          break

        datas.pageComponents = datas.pageComponents.filter(
          (res) => res.component !== 'placementarea'
        )

        datas.pageComponents.splice(i, 0, {
          component: 'placementarea',
          type: 0,
        })

        break
      }
    }
  } else {
    /* 一个组件都没有直接push */
    datas.pageComponents.push({
      component: 'placementarea',
      type: 0,
    })
  }
}

/**
 * 当在有效放置目标上放置元素或选择文本时触发此事件
 *
 * @param {Object} event event对象
 */
const drop = (event) => {
  /* 获取数据 */
  let data = utils.deepClone(
    componentProperties.get(event.dataTransfer.getData('componentName'))
  )

  /* 查询是否只能存在一个的组件且在第一个 */
  let someOne = datas.pageComponents.some((item, index) => {
    return (
      item.component === 'placementarea' &&
      index === 0 &&
      choose.onlyOne.includes(data.type)
    )
  })
  if (someOne) {
    ElMessage.info('固定位置的组件(如: 底部导航、悬浮)不能放在第一个!')
    /* 删除提示组件 */
    dragleaves()
    return
  }

  /* 查询是否只能存在一个的组件 */
  let someResult = datas.pageComponents.some((item) => {
    console.log(item.component, '--------------item.component')
    return (
      choose.onlyOne.includes(item.type) &&
      item.component === event.dataTransfer.getData('componentName')
    )
  })
  if (someResult) {
    ElMessage.info('当前组件只能添加一个!')
    /* 删除提示组件 */
    dragleaves()
    return
  }

  /* 替换 */
  datas.pageComponents.forEach((res, index) => {
    /* 修改选中 */
    if (res.active === true) res.active = false
    /* 替换提示 */
    choose.index = index
    if (res.component === 'placementarea') datas.pageComponents[index] = data
  })

  /* 切换组件 */
  choose.rightcom = data.style
  /* 丢样式 */
  choose.currentproperties = data.setStyle

  console.log(
    data,
    choose.rightcom,
    choose.currentproperties,
    '----------components data'
  )
}

/**
 * 当拖动的元素或文本选择离开有效的放置目标时，会触发此事件
 *
 * @param {Object} event event对象
 */
const dragleaves = () => {
  /* 删除提示组件 */
  datas.pageComponents = datas.pageComponents.filter(
    (res) => res.component !== 'placementarea'
  )
}

const reload = inject('reload')
// 重置
const reloads = () => {
  ElMessageBox.confirm(
    '重置后您添加或者修改的数据将会失效, 是否继续?',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      reload()
    })
    .catch(() => {})
}

// 监听右侧属性设置切换
watch(
  () => choose.rightcom,
  (newval) => {
    if (newval === 'decorate') {
      datas.pageComponents.forEach((res) => {
        /* 修改选中 */
        if (res.active === true) res.active = false
      })
      choose.currentproperties = datas.pageSetup
      return
    }
    if (newval === 'componenmanagement') {
      /* 替换 */
      datas.pageComponents.forEach((res) => {
        /* 修改选中 */
        if (res.active === true) res.active = false
      })
      choose.currentproperties = datas.pageComponents
    }
  }
)

const { id, pageSetup, pageComponents } = toRefs(datas)
const { deleShow, rightcom, currentproperties, pointer } = toRefs(choose)
</script>

<style lang="less" scoped>
.pointer-events {
  pointer-events: none;
}

.home {
  width: 100%;
  height: 100%;

  /* 删除组件 */
  .deles {
    position: absolute;
    min-width: 80px;
    text-align: center;
    line-height: 25px;
    background: #fff;
    height: 25px;
    font-size: 12px;
    left: 103%;
    top: 50%;
    transform: translateY(-50%);
    .icon-sanjiaoxingzuo {
      position: absolute;
      left: -11px;
      color: #fff;
      font-size: 12px;
      top: 50%;
      transform: translateY(-50%);
    }
    &:hover {
      i {
        display: block;
        position: absolute;
        left: 0;
        font-size: 16px;
        top: 0;
        text-align: center;
        line-height: 25px;
        width: 100%;
        color: #fff;
        height: 100%;
        z-index: 10;
        background: rgba(0, 0, 0, 0.5);
      }
      .icon-sanjiaoxingzuo {
        color: rgba(0, 0, 0, 0.5);
      }
    }

    i {
      display: none;
    }
  }

  /* 按钮集合 */
  .buttons {
    height: 8%;
    border-bottom: 1px solid #ebedf0;
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    padding-right: 15px;
    align-items: center;
    /* 下拉 */
    .frop {
      padding-right: 15px;
      .el-button.el-button--primary.el-dropdown-selfdefine {
        background: #fff;
        color: #000;
        border: 1px solid #dcdee0;
      }
    }
    .el-button {
      font-size: 14px;
      padding: 0 16px;
      height: 30px;
      &.el-button--primary {
        background: #155bd4;
      }
      &.el-button--danger {
        background: red;
      }
    }
  }

  /* 操作主体 */
  .operation {
    width: 100%;
    height: 92%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background: #f7f8fa;
  }

  /* 手机 */
  .phone {
    width: 55%;
    height: 100%;
    overflow-y: scroll;
    display: flex;
    justify-content: center;
    background: #f7f8fa;
    &::-webkit-scrollbar {
      width: 1px;
    }
    // &::-webkit-scrollbar-thumb {
    //   background-color: #155bd4;
    // }

    /* 手机样式 */
    .phoneAll {
      width: 375px;
      min-height: 760px;
      box-shadow: 0 0 14px 0 rgba(0, 0, 0, 0.1);
      margin: 45px 0;
      position: relative;

      /* 手机高度 */
      .phoneSize {
        position: absolute;
        left: -137px;
        top: 640px;
        font-size: 12px;
        color: #a2a2a2;
        border-bottom: 1px solid #dedede;
        width: 130px;
        height: 21px;
        line-height: 21px;
      }

      /* 状态栏 */
      .statusBar {
        width: 100%;
        display: block;
      }

      /* 主体内容 */
      .phone-container {
        min-height: 603px;
        box-sizing: border-box;
        cursor: pointer;
        width: 100%;
        position: relative;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        .componentsClass {
          border: 1px solid #fff;
          &:hover {
            border: 1px dashed #155bd4;
          }
        }
      }
    }
  }

  /* 右侧工具栏 */
  .decorateAll {
    width: 376px;
    height: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
    position: relative;
    padding: 0 12px;
    background: #fff;
    &::-webkit-scrollbar {
      width: 1px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #155bd4;
    }
  }

  /* 页面设置tab */
  .decorateTab {
    position: fixed;
    display: flex;
    right: 380px;
    top: 115px;
    flex-direction: column;
    span {
      background-color: #fff;
      box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
      border-radius: 2px;
      width: 94px;
      height: 32px;
      display: inline-block;
      text-align: center;
      line-height: 32px;
      margin-bottom: 12px;
      transition: all 0.8s;
      cursor: pointer;
      &.active {
        background-color: #155bd4;
        color: #fff;
      }
      /* 图标 */
      i {
        font-size: 12px;
        margin-right: 5px;
      }
    }
  }
}

/* 动画 */
.decorateAnima-enter-active {
  transition: all 1.5s ease;
}
.decorateAnima-leave-active {
  transition: all 1.5s ease;
}
.decorateAnima-enter {
  transform: translate(8px, 8px);
  opacity: 0;
}
.decorateAnima-leave-to {
  transform: translate(8px, 8px);
  opacity: 0;
}
</style>
