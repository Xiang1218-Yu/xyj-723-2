# AS-Editor (Vue 3.x) 功能扩展与工程化建议

> 项目定位：一款基于 Vue 3 + Element Plus + Vant + vuedraggable 的可视化移动端 H5 / 店铺装修拖拽编辑器。左侧组件库、中间手机画布、右侧属性面板三栏布局，组件数据以 JSON 形式存于内存，支持导入/导出 JSON、iframe 预览、腾讯云 COS 图片上传。
>
> 本文档分为三部分：
> 1. **可扩展功能模块**（从 0 到 1 开发，当前完全不存在的新能力）
> 2. **可迭代功能模块**（在已有组件/能力上增强）
> 3. **代码理解 / 重构 / 测试 / 工程化建议**
>
> 约束：所有功能均为纯前端可交互实现，**不接入任何真实后端 API**（数据用 localStorage / IndexedDB / 内存 Mock）；可扩展与可迭代两类之间功能不重复、不相似；各功能模块之间相互独立、无依赖。

---

## 一、可扩展功能模块（从 0 到 1，共 30 个）

> 这些都是当前代码库中完全不存在的编辑器基础能力或新面板。所有数据落本地（localStorage / IndexedDB / 内存），不发任何网络请求。

### E1. 撤销 / 重做（Undo / Redo）
- **交互**：顶部工具栏新增撤销、重做按钮；支持 `Ctrl+Z` / `Ctrl+Y`（Mac `Cmd+Z` / `Cmd+Shift+Z`）。
- **实现要点**：在 `pageComponents` / `pageSetup` 每次变更后（drop、delete、style 变更、排序）推入深拷贝快照到 history 栈，维护一个 `future` 栈；为右侧面板的属性变更做 debounce 合并（300ms 内连续输入合并为一条记录）。
- **独立性**：仅依赖现有 `datas.pageComponents` / `datas.pageSetup`，不影响其他模块。

### E2. 多页面管理（Tab 多页签）
- **交互**：顶部出现页签栏，可"新建页面 / 切换 / 重命名 / 复制 / 删除"；每个页面有独立的 `pageSetup` 与 `pageComponents`。
- **实现要点**：本地维护 `pages: [{ id, name, pageSetup, pageComponents }]` 与 `currentPageId`；导出 JSON 时包含整份 pages。

### E3. 组件复制 / 粘贴 / 快速克隆
- **交互**：选中组件后工具栏出现"复制"，或快捷键 `Ctrl+C` / `Ctrl+V`；画布内组件悬浮新增"复制本组件"图标。
- **实现要点**：复制时把当前组件深拷贝到剪贴板状态（内存），粘贴时生成新 id 后插入到当前选中位置之后；与系统剪贴板隔离。

### E4. 大纲树面板（Outline Tree）
- **交互**：在右侧或新增左侧面板展示所有已添加组件的树形列表，点击高亮/选中画布组件，拖拽树节点可排序，带眼睛（显隐）、锁（锁定）图标。
- **实现要点**：直接渲染 `pageComponents`，复用现有 `activeComponent` 方法。

### E5. 网格与吸附对齐线（Grid & Smart Guides）
- **交互**：顶部按钮切换"显示网格 / 对齐吸附"；拖拽组件时出现紫色对齐线与等距提示线，组件自动吸附到其他组件边缘或中轴。
- **实现要点**：画布区叠加一个绝对定位的 SVG/Canvas 层，拖拽时用 `getBoundingClientRect` 计算水平/垂直对齐。

### E6. 编辑器暗色 / 亮色主题切换
- **交互**：右上角"主题"开关，切换编辑器自身（三栏、面板、按钮）的明暗外观；选择写入 localStorage，下次打开沿用。
- **实现要点**：把 `#155bd4` 等硬编码主色提取为 CSS 变量，在 `:root` 与 `[data-theme="dark"]` 下分别赋值。

### E7. 右键上下文菜单（Context Menu）
- **交互**：在画布组件上右键弹出菜单：复制、粘贴、克隆、删除、置顶/置底、锁定、隐藏、插入到上方/下方。
- **实现要点**：自写一个 Teleport 到 body 的菜单组件，根据当前选中项显隐项，点击空白处关闭。

### E8. 组件锁定与隐藏（Lock / Hide）
- **交互**：组件实例新增 `locked` / `hidden` 标志，锁定后不可拖拽/选中，隐藏后画布不渲染但保留数据；在大纲树与右键菜单中切换。
- **实现要点**：`vuedraggable` 的 `filter` 过滤 locked 项，`<component>` 上用 `v-if="!element.hidden"`。

### E9. 快捷键面板与自定义绑定
- **交互**：按 `?` 或点击"快捷键"弹出 Modal，列出所有快捷键；允许点击录制新按键覆盖默认值，重置为默认。
- **实现要点**：统一的 `useHotkeys()` composable，键位映射存 localStorage。

### E10. 画布缩放（Canvas Zoom）
- **交互**：画布下方滑块与 `+ / - / 适应屏幕 / 100%` 按钮；缩放范围 50%~150%，手机外壳同步缩放。
- **实现要点**：对 `.phoneAll` 用 `transform: scale()` + `transform-origin: top center`，外层容器用缩放后的尺寸占位避免塌陷。

### E11. 本地素材库（Asset Library）
- **交互**：新增"素材"面板，左侧展示本地图片库缩略图；支持从本地上传多张（FileReader → DataURL / IndexedDB Blob）、重命名、删除、搜索；从库中拖拽图片直接替换图片类组件的 `src`。
- **实现要点**：用 IndexedDB（`idb` 小封装或原生）存 Blob，key 用随机 id；**不调 COS / 不调后端**，完全离线。与现有 `uploadImg` 并存但不冲突（可后续替换其数据源）。

### E12. 收藏为"我的组件"（自定义组件模板）
- **交互**：选中已配置好的组件，点"收藏为模板"，命名后加入左侧"我的组件"分组；之后可像内置组件一样拖入画布；支持删除收藏。
- **实现要点**：把组件 `{ component, setStyle }` 深拷贝到 localStorage 的 `myComponents` 数组；在 `sliderassembly` 的 datas 末尾动态加一个分组。

### E13. 格式刷（Style Painter）
- **交互**：选中组件点"格式刷"图标，鼠标变刷子，点击目标组件把源组件的 `setStyle`（可选是否含内容字段）覆盖到目标；按 Esc 取消。
- **实现要点**：内存暂存 `sourceStyle`，点击目标时 `Object.assign(target.setStyle, deepClone(sourceStyle))`。

### E14. 页面预设模板（Starter Templates）
- **交互**：首次进入或点"模板库"弹出 Modal，展示 6~10 套预置页面（如"双 11 大促""新品首发""店铺主页""节日活动"），缩略图 + 一键套用。
- **实现要点**：每套模板是一份写死的 `{ pageSetup, pageComponents }` JSON 模块（放在 `src/templates/*.js`），套用即 `Object.assign`，**无网络请求**。

### E15. 设备机型切换（Device Frame）
- **交互**：顶部下拉切换 iPhone 8 / iPhone 12 / iPhone 14 / Android 1080P / iPad 等，画布宽度与外壳顶部图对应变化。
- **实现要点**：维护设备列表 `{ name, width, height, statusBar }`，绑定到 `.phoneAll` 的 width；状态栏图片用纯 CSS 渐变绘制替代现有 `phoneTop.png`。

### E16. 组件库搜索 / 过滤
- **交互**：左侧组件库顶部加搜索框，输入"导航""广告"实时过滤；按名称拼音首字母也能搜。
- **实现要点**：给 `sliderassembly` 的 datas 每个 item 补 `keywords` 字段，`computed` 过滤。

### E17. Schema 校验与错误提示
- **交互**：点预览/导出时，对必填项（如页面名称、图片组件至少一张图、TabBar 至少 2 项）做校验；失败在右侧面板高亮字段并弹出统计提示。
- **实现要点**：给每个组件定义 `validate(setStyle)` 函数（放 `componentProperties.js` 同目录新建 `validators.js`），返回 `{ ok, errors: [{ field, msg }] }`。

### E18. 操作时间线（Operation Timeline）
- **交互**：底部抽屉展示操作历史（新增"商品搜索"、删除"图片广告"、修改"标题文字.text"…），点击任一条回滚到该时刻状态；与 E1 撤销栈解耦（这是带描述的审计视图）。
- **实现要点**：在每次 mutation 处 push `{ id, time, type, desc, snapshot }`。

### E19. 自动保存与草稿恢复（Autosave）
- **交互**：顶部显示"已自动保存于 12:30"，每次变更后 debounce 1.5s 写入 localStorage；下次打开始终检测到草稿时弹窗"恢复上次草稿 / 新建页面"。
- **实现要点**：watch `pageComponents` + `pageSetup`，localStorage key 带版本号；多页面分别存。

### E20. 多选与批量操作（Multi-select）
- **交互**：`Cmd/Ctrl+点击` 或 `Shift+点击` 选中多个组件（画布上出现多选边框），支持批量删除、批量克隆、批量上下移、批量对齐（左对齐/顶对齐/等间距）。
- **实现要点**：用 `selectedIds: Set` 替换单选 `choose.index`；对齐算法基于各选中组件的 `getBoundingClientRect`。

### E21. 组件编组（Group Section）
- **交互**：多选后右键"编组"，形成一个可整体拖拽/折叠的区块；画布上有分组标题条；"解组"恢复独立。
- **实现要点**：在 `pageComponents` 中引入虚拟 group 节点 `{ component: 'group', children: [...] }`，渲染时递归；或用数据层分组 + 渲染层 flatten，保持现有 `<component :is>` 结构。

### E22. Mock 数据填充器（Faker Panel）
- **交互**：对商品、文章等列表类组件，右侧新增"一键填充 Mock 数据"按钮，可选择"数码产品""服装""食品"等主题，本地生成商品名、价格、图片占位图（SVG dataURL）。
- **实现要点**：写一个 `mock/generator.js`，按主题数组随机组合；图片用纯 SVG dataURL（带文字）模拟，**不依赖网络图片**。

### E23. 安全区 / 刘海屏参考线
- **交互**：在画布上叠加半透明条模拟 iPhone 顶部刘海与底部 Home 指示条，切换机型时联动；仅视觉参考，不影响导出数据。
- **实现要点**：画布容器内加两个绝对定位 div，尺寸随 E15 机型数据。

### E24. 编辑器国际化切换（中 / 英文）
- **交互**：顶部语言下拉切换编辑器自身 UI 文案（按钮、面板标题、表单标签、提示语）；项目已有 `public/langs/zh_CN.js`，补一份 `en_US.js` 并接通。
- **实现要点**：自写极简 `t(key)` composable（无需引入 vue-i18n 即可满足），字典存 localStorage。

### E25. 画布标尺（Rulers）
- **交互**：画布顶部、左侧显示像素刻度，随缩放更新；鼠标在画布上移动时标尺上显示参考线。
- **实现要点**：纯 CSS + 一个 60px 宽的 canvas/div，刻度按 10px 间隔画。

### E26. 批注 / 便签（Annotations）
- **交互**：在组件上右键"添加批注"，出现黄色便签，支持评论文字；批注在预览/导出时可选择是否包含；列表见右侧"批注"Tab。
- **实现要点**：每个组件新增 `annotations: [{ id, text, author, time }]`，仅本地。

### E27. A/B 变体对比（Variant Compare）
- **交互**：顶部"变体 A / B"开关，可把当前页面快照存为变体 A，再编辑变体 B；点击"对比"分屏（左右两台手机）同时渲染两个版本。
- **实现要点**：维护 `variants: { A, B }` 两份独立 state，复用现有 `<component :is>` 渲染第二台手机。

### E28. Schema 代码编辑器（JSON Code View）
- **交互**：顶部"代码视图"抽屉，左右分屏：左侧是带语法高亮、可编辑的 JSON 文本区（可用轻量 `textarea` + 正则高亮，或引入 CodeMirror 5 CDN），右侧实时同步画布；编辑错误时 JSON 解析失败给出红色提示行。
- **与现有"查看 JSON"的区别**：现有是只读 `ElMessageBox.alert` 输出 HTML 字符串，本功能是**可双向编辑、带校验的分栏编辑器**，完全不同的交互层级。

### E29. 新手引导（Onboarding Tour）
- **交互**：首次进入弹出分步蒙层指引（"这是组件库""拖拽到这里""右侧是属性面板"），支持上一步/跳过/不再提示。
- **实现要点**：用固定定位的高亮框 + 气泡，步骤数组写死；"不再提示"写 localStorage。

### E30. 颜色对比度检查（Accessibility Check）
- **交互**：在颜色选择器旁边显示 WCAG AA/AAA 通过情况（文字色 vs 背景色的对比度比值），不通过时给出警告色与建议配色。
- **实现要点**：实现相对亮度 `L` 与对比度公式 `(L1+0.05)/(L2+0.05)`，纯计算无依赖。

---

## 二、可迭代功能模块（基于已有功能增强，共 20 个）

> 下列每一项都严格对应一个**已存在**的组件或能力，仅在其数据结构与 UI 上扩展，不引入新的编辑器基础能力，不与第一部分重复。

### I1. 富文本组件增强（已有 `richtext`）
- 现状：[richtext/index.vue](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/components/componentscom/richtext/index.vue) 仅通过 TinyMCE 编辑 `myValue`，右侧 [richtextstyle](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/components/rightslider/richtextstyle/index.vue) 只有背景色。
- 可迭代：扩展 TinyMCE 配置（行高、字间距、段间距、首行缩进、清除格式、对齐方式、字号预设）；右侧新增"内边距""圆角""文字颜色默认值"。

### I2. 视频组件增强（已有 `videoss`）
- 现状：[componentProperties.js](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/utils/componentProperties.js#L246-L258) 只有 `src / coverUrl / autoplay`。
- 可迭代：加 `loop / muted / controls / playsinline` 开关、封面图上传、播放按钮样式选择、圆角、边距。

### I3. 图片广告组件增强（已有 `pictureads`）
- 现状：[pictureadsstyle](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/components/rightslider/pictureadsstyle/index.vue) 支持 4 种模板但轮播未真正接入 swiper。
- 可迭代：加自动播放间隔滑块、过渡效果（淡入/滑动）、是否循环、是否显示箭头；项目 devDeps 已有 `swiper@5`，直接接入。

### I4. 商品列表组件增强（已有 `listswitching`）
- 现状：[listswitching](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/components/componentscom/listswitching/index.vue) 有大量字段但 `imageList: []` 默认空。
- 可迭代：在右侧增加"添加本地 Mock 商品"按钮（弹框编辑名称、价格、原价、图片占位），支持列数 1/2/3 切换、卡片阴影、购买按钮文案自定义。

### I5. 底部导航 TabBar 增强（已有 `tabBar`）
- 现状：[tabBar](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/components/componentscom/tabBar/index.vue) 的 `iconList: []` 默认空，无法在右侧编辑项。
- 可迭代：[tabBarStyle](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/components/rightslider/tabBarStyle/index.vue) 增加"新增 Tab"按钮（上限 5），每项可编辑文字、未选中/选中图标（从 iconfont 选取或本地上传）、徽标数。

### I6. 公告组件增强（已有 `notice`）
- 现状：[notice](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/components/componentscom/notice/index.vue) 只有单行滚动文本。
- 可迭代：支持多条公告数组、滚动方向（上/左）、速度滑块、前导图标选择、左边距/背景。

### I7. 标题文字组件增强（已有 `captiontext`）
- 现状：[captiontext](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/components/componentscom/captiontext/index.vue) 的 `more` 字段已预留但不完整。
- 可迭代：新增左侧图标/图片选择、分组标题（小标题+大标题）、文字渐变、上下内边距、"查看更多"的图标位置。

### I8. 表单模块增强（已有 `investigate`）
- 现状：[investigatestyle](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/components/rightslider/investigatestyle/index.vue) 仅 4 种类型，提交按钮样式不可改。
- 可迭代：新增"日期选择""开关""评分"类型、必填标记、正则校验（手机号/邮箱预设）、提交按钮颜色/圆角/文案、提交成功提示语。

### I9. 魔方布局增强（已有 `magiccube`）
- 现状：[magiccube](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/components/componentscom/magiccube/index.vue) 已有 7 种布局（0-6），但图片无法在面板里单独排序。
- 可迭代：右侧面板加图片拖拽排序（vuedraggable）、每个格子独立链接、整体圆角、图片比例（1:1/3:2/16:9）选择。

### I10. 商品搜索栏增强（已有 `commoditysearch`）
- 现状：[commoditysearch](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/components/componentscom/commoditysearch/index.vue) 有 `hotords: []` 但无 UI 编辑。
- 可迭代：右侧新增热词标签编辑器（增删/颜色）、搜索按钮文字显隐、语音图标开关、圆角滑块。

### I11. 悬浮按钮增强（已有 `suspension`）
- 现状：[suspension](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/components/componentscom/suspension/index.vue) 仅单按钮。
- 可迭代：支持位置（左上/右上/左下/右下）+ 偏移量、多个按钮展开为 FAB 菜单、图标选择、透明度。

### I12. 店铺信息组件增强（已有 `storeinformation`）
- 现状：[storeinformation](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/components/componentscom/storeinformation/index.vue) 有头像、名称、一条优惠。
- 可迭代：优惠改成数组多条、店铺背景模糊度、按钮"进店逛逛"文案与颜色、关注数 Mock 数字编辑。

### I13. 图文导航增强（已有 `graphicnavigation`）
- 现状：[graphicnavigation](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/components/componentscom/graphicnavigation/index.vue) 支持 `navigationType / imgStyle`。
- 可迭代：新增"大图卡片"样式、图标形状（方/圆/圆角）、每角标文字（HOT/NEW）、一列/两列切换。

### I14. 辅助分割增强（已有 `auxiliarysegmentation`）
- 现状：[auxiliarysegmentation](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/components/componentscom/auxiliarysegmentation/index.vue) 只有空白高度/实线。
- 可迭代：新增虚线/双线/渐变线、中间带文字或图标的分割线、左右缩进、颜色选择器。

### I15. 社群涨粉增强（已有 `communitypowder`）
- 现状：[communitypowder](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/components/componentscom/communitypowder/index.vue) 单张二维码。
- 可迭代：支持多个二维码轮播（如"一群已满加二群"）、复制微信号按钮、加群引导文案编辑、卡片样式切换。

### I16. 单元格 / 进店组件增强（已有 `entertheshop`）
- 现状：[entertheshop](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/components/componentscom/entertheshop/index.vue) 仅单行左图标+标题+文案。
- 可迭代：右侧箭头开关、右侧附加说明/标签颜色、是否显示底部分割线、可添加为列表（多个 cell 连续）。

### I17. 关注公众号增强（已有 `follow`）
- 现状：[follow](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/components/componentscom/follow/index.vue) 只显示名称和 AppId。
- 可迭代：新增按钮文案（已关注/关注）切换、历史文章样式、简介字段、二维码背景色。

### I18. 文章模块增强（已有 `storenotecard`）
- 现状：[storenotecard](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/components/componentscom/storenotecard/index.vue) 有 `noteLabels / readingNumber / praisePoints` 但多为布尔。
- 可迭代：标签可编辑文字与颜色、阅读/点赞数字可填、文章卡片支持多张图（1大图+N小图）、作者头像与名称。

### I19. 页面设置 / 背景增强（已有 `decorate`）
- 现状：[decorate](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/components/rightslider/decorate/index.vue) 只支持纯色 + 背景图。
- 可迭代：新增渐变构建器（线性/径向、色标、角度）、背景平铺/居中/覆盖、标题栏文字颜色、状态栏字体深浅、页面外边距。

### I20. 导入 / 导出 / 预览增强（已有 JSON 导入导出与 iframe 预览）
- 现状：[home/index.vue](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/layout/home/index.vue#L180-L232) 导出 JSON、导入 JSON；[realTimeView](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/components/realTimeView/index.vue) 用外部 iframe `qiniu-plat.juroom.cn` 预览。
- 可迭代：
  - 导出为**本地静态 HTML**（用一份内置渲染模板把当前 JSON 渲染为单文件 HTML，无后端）；
  - 导出为 PNG 长图（项目已装 `html2canvas`，目前未使用）；
  - 导入时做**版本兼容与字段补全**（缺省字段自动用 `componentProperties` 默认值补齐）；
  - 把外部 iframe 预览替换为**内置本地预览组件**（同一份 `<component :is>` 渲染），消除外部依赖与 postMessage 跨域问题。

---

## 三、代码理解 / 重构 / 测试 / 工程化建议

### 3.1 代码理解建议

#### U1. 拖拽落点算法的状态机理解
核心逻辑位于 [home/index.vue](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/layout/home/index.vue#L302-L495) 的 `allowDrop` / `drop` / `dragleaves`。
- **机制**：左侧 `sliderassembly` 拖拽时通过 `dataTransfer.setData('componentName')` 传组件名；画布 `dragover` 时根据鼠标 `offsetY` 计算应在何处插入一个临时的 `placementarea` 占位组件（type=0），`drop` 时再把该占位替换为真实组件数据。
- **三种落点**：
  1. 鼠标在第一个组件上半 → `unshift` 占位到最前；
  2. 鼠标在所有组件之后 → `push` 占位到最后；
  3. 鼠标在两个组件之间 → `splice(i, 0, 占位)`。
- **关键点**：每次 `dragover` 都先 `filter` 掉旧的 `placementarea` 再插入新的；`onlyOne: ['1-5','1-16']`（底部导航、悬浮）被限制不能出现在首位且页面内唯一。
- **值得注意的坑**：`allowDrop` 内直接读 `event.target.children[0].children` 这种 DOM 结构（[L313-L380](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/layout/home/index.vue#L313-L380)），一旦画布 DOM 层级变化（例如套了缩放 transform、加了网格层）就会错位。

#### U2. 组件数据双向绑定的"引用穿透"模式理解
- 组件默认值存于 [componentProperties.js](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/utils/componentProperties.js) 的 `Map`；
- 拖入时 [drop](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/layout/home/index.vue#L427-L483) 调 `utils.deepClone(componentProperties.get(name))` 拿到一个新对象并 push；
- 选中后右侧表单通过 `choose.currentproperties = res.setStyle` 直接持有该对象引用，Element Plus 表单 `v-model` 直接修改其字段；
- 中间没有"编辑→应用"缓冲层，所有改动**立即**反映到画布（所见即所得，代价是难以做撤销/校验）。

#### U3. 全局组件注册的"连坐"问题
[main.js](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/main.js#L16-L35) 用 `require.context('./components', true, /\.vue$/)` 把 `components/` 下**所有** `.vue` 文件全部 `app.component(name, ...)` 全局注册。这意味着：
- 20+ 个右侧属性面板组件（`xxxstyle`）、`uploadImg`、`uploadCommodity`、`headerTop`、`phoneBottom`、`realTimeView`、`placementarea`、`sliderassembly`、`componenmanagement` 等全部常驻；
- 实际只有 `home/index.vue` 中 `<component :is="element.component">` 与 `<component :is="rightcom">` 用到动态切换；其余应按需引入。
- 副作用：包体积大、首屏慢、命名冲突风险（例如多个组件 `name` 重复会静默覆盖）。

---

### 3.2 代码重构建议

#### R1. 把拖拽落点算法抽离为纯函数 composable
- **现状问题**：[allowDrop](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/layout/home/index.vue#L302-L420) 长达 120 行，直接操作 DOM 与 `pageComponents`，难以单测。
- **重构方案**：
  1. 新建 `src/composables/useDragDrop.js`，导出 `computeDropIndex(components, mouseY, rects, onlyOne)` 纯函数，输入组件数组、鼠标 Y、各组件的 `getBoundingClientRect()` 数组，输出 `{ index, action: 'insert-before'|'insert-after'|'replace' }`；
  2. 新建 `usePlacement()` 管理占位组件的增删（目前散落在 4 处 `filter(res => res.component !== 'placementarea')`）；
  3. `home/index.vue` 内组合使用，DOM 读取通过 `ref` 收集 vuedraggable 内元素的 rect 数组，不再硬编码 `children[0]` 层级。

#### R2. 组件默认值从 Map + deepClone 改为工厂函数 + 版本迁移
- **现状问题**：[componentProperties.js](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/utils/componentProperties.js) 是一个 `Map`，用 `deepClone` 复制；导入旧 JSON 时若新增字段会缺失，而右侧面板直接 `v-model="datas.xxx"` 读未定义字段会静默成 undefined。
- **重构方案**：
  ```js
  // src/components/factory.js
  const COMPONENT_DEFS = { /* 从原 Map 迁出的默认值 */ }

  export function createComponent(name) {
    const def = COMPONENT_DEFS[name]
    return structuredClone(def) // 或 JSON.parse(JSON.stringify(def))
  }
  export function migrateComponent(raw) {
    const def = createComponent(raw.component)
    const setStyle = mergeDeep(def.setStyle, raw.setStyle || {})
    return { ...def, ...raw, setStyle }
  }
  ```
  - 顶部加 `schemaVersion`；导入 JSON 时若版本低则跑 migration chain；
  - 用 TypeScript 或 JSDoc 定义 `ComponentInstance` 类型，IDE 可提示字段。

#### R3. 统一组件注册：异步组件 + 显式映射
- **现状问题**：见 U3。
- **重构方案**：
  - 删除 [main.js L16-L35](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/main.js#L16-L35) 的全量自动注册；
  - 新建 `src/component-registry.js`：
    ```js
    import { defineAsyncComponent } from 'vue'
    export const renderComponents = {
      magiccube: defineAsyncComponent(() => import('@/components/componentscom/magiccube')),
      // ...
    }
    export const stylePanels = {
      magiccubestyle: defineAsyncComponent(() => import('@/components/rightslider/magiccubestyle')),
    }
    ```
  - 在 `home/index.vue` 里合并后传给 `<component :is>`。收益：首屏按需、栈体积下降、命名冲突消除。

#### R4. 右侧面板"上传图片"逻辑去重
- **现状问题**：[decorate](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/components/rightslider/decorate/index.vue)、[pictureadsstyle](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723/xyj-723-2/as-editor-vue3.x/src/components/rightslider/pictureadsstyle/index.vue) 等 10+ 个面板都重复写了 `<uploadimg ref="upload" @uploadInformation="...">` + `showUpload()` + `uploadImgDataType` 分支判断。
- **重构方案**：
  - 抽成一个 `useImageField(datas, fieldName)` composable，返回 `{ open, onPick }`，一行接入；
  - 或写一个 `<ImageField v-model="datas.bgImg" label="背景图" />` 受控组件，内部自管 `uploadImg` 弹框。

#### R5. Options API → `<script setup>` 统一
- 目前 [sliderassembly](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/components/sliderassembly/index.vue)、[decorate](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/components/rightslider/decorate/index.vue)、[realTimeView](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/components/realTimeView/index.vue)、[componenmanagement](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/components/rightslider/componenmanagement/index.vue) 等仍用 Options API，而 [home/index.vue](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/layout/home/index.vue) 用 `<script setup>`。
- 重构收益：类型推断更好、`this.$set` 这类过时写法可一并清除、代码风格一致。建议按面板逐个迁移，每个迁移跑一次现有 lint。

#### R6. 修复 utils.assiginObj 的逻辑 Bug
- [utils/index.js L109-L123](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/utils/index.js#L109-L123)：
  ```js
  if (typeof target != 'object' || typeof sources != 'object' || typeof target) {
    return sources
  }
  ```
  末位 `typeof target` **永远为真**（任何字符串都 truthy），导致整个函数永远直接返回 `sources`，递归合并逻辑形同虚设。建议改为：
  ```js
  if (target === null || sources === null ||
      typeof target !== 'object' || typeof sources !== 'object') {
    return sources
  }
  ```
  并补单测（见 T1）。

---

### 3.3 代码测试建议

> 项目当前**完全没有测试**（package.json 无 vitest/jest、无 `test` 脚本）。下面是可直接落地的测试规划。

#### T1. 工具函数单元测试
- 新增 `vitest` + `@vue/test-utils`（或 jest，但 vitest 与 Vite/Vue3 更契合；项目用 vue-cli 4/webpack，可沿用 jest 也可迁 vitest）。
- 对 [utils/index.js](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/utils/index.js) 的 `formatDate / forEach / isArray / getObjClass / deepClone / assiginObj` 写测试：
  - `deepClone` 应保证嵌套对象/数组互不引用、函数/Date/正则等非 plain 原值返回；
  - `assiginObj` 修复后测：目标缺字段补齐、目标已有字段递归合并、基本类型覆盖、null 安全（覆盖 R6）；
  - `formatDate` 对零、负数、单位数月份补零。

#### T2. 拖拽落点算法单元测试
- 重构 R1 之后，对 `computeDropIndex` 写纯函数测试：
  - 空数组 → `push`；
  - 鼠标 Y < 第一个组件一半 → `unshift`；
  - 鼠标 Y > 最后组件底部 → `push`；
  - 鼠标在第 i 个组件中线之上 → 插入到 i 之前；
  - `onlyOne` 组件（1-5/1-16）不允许插入首位/重复。
- mock 数据：构造 3 个高 100px 的组件 rect 数组，分别覆盖每种分支。

#### T3. 组件属性面板的交互测试（Vue Test Utils）
- [home/index.vue](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/layout/home/index.vue) 的 `activeComponent`、`deleteObj`、`componenmanagement`、`headTop`：
  - `activeComponent` 点击后应当清空其他 active 并把当前 active=true、`rightcom` 切到该组件 style；
  - `deleteObj(0)` 后 `pageComponents.length` 减 1 且选中 index 同步；删到当前选中项时 `rightcom` 回到 `decorate`；
  - `catJson` 不报错；
- [sliderassembly](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/components/sliderassembly/index.vue) 的 `drag`：应调用 `event.dataTransfer.setData('componentName', ...)` 且 `pointer.show=true`。

#### T4. JSON 导入导出往返测试
- 用 `exportJSON` 序列化 → 模拟文件读入 → `importJSON` 反序列化，断言：
  - `pageSetup.name`、`pageComponents.length`、每个组件 `setStyle` 深度相等；
  - 导入**缺字段**的旧 JSON（mock 一份只含 2 个字段的 captiontext）时，迁移后能拿到 `componentProperties` 的默认值（配合 R2）；
  - 导入非法 JSON 应给用户提示而不是白屏。

#### T5. 组件渲染快照测试
- 对 [magiccube](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/components/componentscom/magiccube/index.vue) 等核心组件用不同 `datas.rubiksCubeType` 挂载后断言渲染出的图片数量（例如 type=2 显示 4 张），防止重构时模板分支被误删。

---

### 3.4 代码工程化建议

#### E1. 安全：移除硬编码密钥与外部依赖
- **严重**：[utils/upload.js L5-L6](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/utils/upload.js#L5-L6) 把腾讯云 COS 的 `SecretId` 与 `SecretKey` 直接写在前端代码里，任何人 F12 即可获取并盗用你的存储桶。
  - 建议：前端改为调后端临时密钥接口（STS）拿临时 token；**本需求约束不接真实 API**，可先改为走本地 `FileReader → dataURL` 或 IndexedDB（配合可扩展功能 E11 素材库），把 COS 上传做成可插拔 adapter，默认关掉。
- **外部 iframe 依赖**：[realTimeView L10-L35](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/components/realTimeView/index.vue#L10-L35) 固定访问 `https://qiniu-plat.juroom.cn/h5/index.html`，若域名失效预览即不可用；建议改为本地渲染组件（见 I20）。
- [videoss 默认 src](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/utils/componentProperties.js#L254) 写死了一个外部 mp4 URL，也应改为空或本地静态资源。

#### E2. 依赖与构建修复
- `devDependencies` 里同时存在 `vue-template-compiler@2.6.14`（Vue 2 编译器）和 `@vue/compiler-sfc@3.2.30`（Vue 3 编译器），见 [package.json L36-L52](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/package.json#L36-L52)。前者在 Vue 3 项目中无用且会造成误导，应删除。
- husky 已配置（[package.json L54-L59](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/package.json#L54-L59)）`pre-commit: npm run lint`，但 lint 是全量扫描，建议引入 `lint-staged` 只检查暂存文件，提升提交速度。
- `script/verify-commit.js` 存在但未声明 commitlint 依赖，建议接入 `@commitlint/cli` + `@commitlint/config-conventional` 规范化提交信息。
- 升级 `eslint-plugin-vue` 到 v9+ 并启用 `plugin:vue/vue3-recommended`，现有代码里 `value2 === ''` 比较、`event` 全局隐式引用（[investigate L105](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/components/componentscom/investigate/index.vue#L105) 直接用 `event.stopPropagation()` 未声明参数）会被自动捕捉。

#### E3. 引入 Pinia / Vuex 模块化集中状态
- 现状：核心编辑状态全部塞在 [home/index.vue](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/layout/home/index.vue#L160-L252) 的 `reactive` 里，[store/index.js](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/store/index.js) 里的 vuex 还是一个空壳（只有 `count`）。
- 建议：用 **Pinia**（Vue 3 官方推荐）或把 Vuex 拆成 `modules/editor.js`（pageComponents、pageSetup、selection、history、clipboard），使大纲树（E4）、撤销（E1）、多页面（E2）、自动保存（E19）等能力可以在任意组件订阅而不用 prop 层层穿透。

#### E4. 路径别名统一与路径风格
- [vue.config.js L24-L32](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/vue.config.js#L24-L32) 配了 `@ / components / css / iconfont / img / utils` 六个别名，但代码里同时存在：
  - `import utils from 'utils/index'`（[home/index.vue L153](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/layout/home/index.vue#L153)）
  - `import uploadimg from '../../uploadImg'`（[decorate L91](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/components/rightslider/decorate/index.vue#L91)）
  - `import componentProperties from '@/utils/componentProperties'`
  - 模板里 `src="../../../assets/images/mor.png"`（[magiccube L12](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/components/componentscom/magiccube/index.vue#L12)）
- 建议：ESLint 加规则禁止相对路径超过两级，统一用 `@/`；图片一律走别名或 `import` 引入。

#### E5. 组件脚手架（Plop/Hygen 模板）
当前新增一个组件需要同时改 4 处：
1. `src/components/componentscom/<name>/index.vue`（画布渲染）
2. `src/components/rightslider/<name>style/index.vue`（右侧属性面板）
3. `src/utils/componentProperties.js`（默认数据）
4. `src/components/sliderassembly/index.vue`（左侧库注册）

接入 `plop` 或 `hygen`，写一个 `component` 生成器模板，一条命令 `npm run new:component <name>` 生成四个文件骨架并打印"还需要把组件名加入 componentProperties"提示，极大降低新增组件成本并保证命名一致。

#### E6. 环境配置与打包优化
- 项目用 `window.global_config.BASE_URL`（[uploadImg L152](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/components/uploadImg/index.vue#L152)）与 [public/config/config.js](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/public/config/config.js) 做运行时配置，但 `devServer.proxy` 又写死了 `http://api.aseditor.fun/`（[vue.config.js L13-L22](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/vue.config.js#L13-L22)）。建议统一用 `.env.development` / `.env.production` 配 `VUE_APP_BASE_URL`。
- 包体积优化：
  - TinyMCE（[@tinymce/tinymce-vue](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/package.json#L12)）整包约 600KB+，改为按需加载皮肤/插件；
  - Vant 全量引入 `import Vant from 'vant'` + `import 'vant/lib/index.css'`（[main.js L12-L13](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/main.js#L12-L13)），改用 `babel-plugin-import` 按需；
  - 接入 `webpack-bundle-analyzer` 定位大模块。
- 加 `npm run type-check`（后续迁 TS 时）和 CI（GitHub Actions）跑 lint + build + test，给 PR 质量兜底。

#### E7. 样式体系收敛
- 颜色硬编码 `#155bd4`（主色）、`#f7f8fa`（背景）、`#323233`（正文）等散落在各 `.vue` 文件数十处（例：[home/index.vue L619](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/layout/home/index.vue#L619)、[sliderassembly L236](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/components/sliderassembly/index.vue#L236)）。
- 建议：在 [src/assets/css/minx.less](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/assets/css/minx.less) 里定义 `@primary-color`、`@bg-color`、`@text-color` 等 less 变量（或 CSS variables 以支持 E6 暗色主题），全局替换；同时把重复的 `.item { background:#ebedf0; &.active { background:#e0edff; color:#155bd4 } }` 抽成公共 mixin/class。

---

## 附：现有组件清单（用于识别可迭代范围）

| 分组 | 组件 key | 中文名 | 位置 |
| --- | --- | --- | --- |
| 基础 | commoditysearch | 商品搜索 | [componentscom/commoditysearch](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/components/componentscom/commoditysearch) |
| 基础 | captiontext | 标题文字 | [componentscom/captiontext](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/components/componentscom/captiontext) |
| 基础 | pictureads | 图片广告 | [componentscom/pictureads](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/components/componentscom/pictureads) |
| 基础 | graphicnavigation | 图文导航 | [componentscom/graphicnavigation](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/components/componentscom/graphicnavigation) |
| 基础 | tabBar | 底部导航 | [componentscom/tabBar](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/components/componentscom/tabBar) |
| 基础 | magiccube | 魔方 | [componentscom/magiccube](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/components/componentscom/magiccube) |
| 基础 | notice | 公告 | [componentscom/notice](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/components/componentscom/notice) |
| 基础 | videoss | 视频 | [componentscom/videoss](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/components/componentscom/videoss) |
| 基础 | richtext | 富文本 | [componentscom/richtext](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/components/componentscom/richtext) |
| 基础 | auxiliarysegmentation | 辅助分割 | [componentscom/auxiliarysegmentation](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/components/componentscom/auxiliarysegmentation) |
| 基础 | storeinformation | 店铺信息 | [componentscom/storeinformation](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/components/componentscom/storeinformation) |
| 基础 | entertheshop | 单元格 | [componentscom/entertheshop](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/components/componentscom/entertheshop) |
| 基础 | communitypowder | 社群涨粉 | [componentscom/communitypowder](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/components/componentscom/communitypowder) |
| 基础 | follow | 关注公众号 | [componentscom/follow](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/components/componentscom/follow) |
| 基础 | suspension | 悬浮按钮 | [componentscom/suspension](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/components/componentscom/suspension) |
| 基础 | custommodule | 自定义模块（demo） | [componentscom/custommodule](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/components/componentscom/custommodule) |
| 业务 | listswitching | 商品列表 | [componentscom/listswitching](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/components/componentscom/listswitching) |
| 业务 | storenotecard | 文章模块 | [componentscom/storenotecard](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/components/componentscom/storenotecard) |
| 业务 | investigate | 表单模块 | [componentscom/investigate](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/components/componentscom/investigate) |
| 占位 | placementarea | 拖拽落点占位（内部） | [componentscom/placementarea](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/components/componentscom/placementarea) |
| 桩 | crowdoperation / personalizedrecommendation / onlineservice | 仅占位 setStyle 为空对象 | [crowdoperation](file:///Users/tog/Desktop/code/gsb/gsb-723/xyj-723-2/as-editor-vue3.x/src/components/componentscom/crowdoperation) 等 |

> 注：`crowdoperation / personalizedrecommendation / onlineservice` 三个组件目前只有空壳 `setStyle: { text: '...' }`，属于"业务占位"。若要在它们基础上做可迭代，可参照 I4~I18 的思路补齐渲染与面板；但这与"从 0 到 1"边界较模糊，因此本文档未把它们列入可扩展清单，避免重复。
