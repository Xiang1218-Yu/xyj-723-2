const componentProperties = new Map()

// 数据版本  每次修改组件数据  需要对版本进行修改
componentProperties.set('componentPropertiesVersion', 'V2.0.0')

componentProperties.set('captiontext', {
  component: 'captiontext',
  text: '标题文字',
  type: '1-3',
  active: true,
  style: 'captiontextsstyle',
  setStyle: {
    text: '标题文字',
    name: '标题文字',//标题内容
    description: '',//描述内容
    wordSize: 16,//标题大小
    descriptionSize: 12,//描述大小
    wordWeight: 400,//标题粗细
    positions: 'left', //显示位置  可选left/center
    descriptionWeight: 200,//描述粗细
    wordColor: 'rgba(50, 50, 51, 10)',//标题颜色
    descriptionColor: 'rgba(150, 151, 153, 10)',//描述颜色
    backColor: 'rgba(255, 255, 255, 10)', //背景颜色
    borderBott: false, //底部分割线
    wordHeight: 24,//框体高度
    // 新增：左侧图标
    leftIcon: '', //左侧图标URL
    leftIconSize: 20, //左侧图标大小
    showLeftIcon: false, //是否显示左侧图标
    // 新增：小标题渐变
    gradientEnabled: false, //是否启用渐变
    gradientStart: '#ff6b6b', //渐变起始色
    gradientEnd: '#4ecdc4', //渐变结束色
    gradientDirection: 'to right', //渐变方向
    // 查看更多
    more: {
      show: false,//是否显示查看更多
      type: 1, // 样式选择
      text: '查看更多', //自定义文字
      httpType: 10,//链接类型
      http: '',//链接
    },
  },
})

componentProperties.set('listswitching', {
  component: 'listswitching',
  text: '商品',
  type: '2-1',
  active: true,
  style: 'listswitchingstyle',
  setStyle: {
    text: '商品',
    commodityType: 0,
    moditystyle: 0,
    borderRadius: 0,
    pageMargin: 15,
    commodityMargin: 10,
    textWeight: 400,
    positions: 'left',
    priceofcommodity: true,
    purchasebutton: true,
    commoditycorner: true,
    purchasebuttonType: 0,
    commoditycornertype: 0,
    commodityTagColor: '#07c160',
    tagPosition: 0,
    imageList: [],
    purchase: '马上抢',
    commoditylisttype: 0,
    commoditylisttypetab: [
      {
        text: '分组',
        imageList: [],
      },
      {
        text: '分组',
        imageList: [],
      },
    ],
    tabColor: '#f39800',
    showMore: false,
    moreUrl: null,
    bgImg: '',
    // 新增：列数/阴影/按钮文案
    columns: 2, //列数
    shadowEnabled: false, //是否显示阴影
    shadowColor: 'rgba(0,0,0,0.1)', //阴影颜色
    shadowBlur: 8, //阴影模糊度
    buttonText: '立即购买', //按钮文案
    buttonBgColor: '#ff6b6b', //按钮背景色
    buttonTextColor: '#ffffff', //按钮文字颜色
  },
})

componentProperties.set('pictureads', {
  component: 'pictureads',
  text: '图片广告',
  type: '1-3',
  active: true,
  style: 'pictureadsstyle',
  setStyle: {
    text: '图片广告',
    swiperType: 0,  // 选择模板
    borderRadius: 0,// 图片倒角
    pageMargin: 0,  // 页面边距
    imageMargin: 0, // 图片边距
    pagingType: 0,  // 分页类型: 0/"bullets"/"fraction"/"progressbar"
    rowindividual: 2,// 一行个数
    imageList: [],  // 添加图片
    // 新增：Swiper增强配置
    autoplayEnabled: true, //是否自动播放
    autoplayDelay: 3000, //自动播放间隔(ms)
    transitionEffect: 'slide', //过渡效果: slide/fade/cube/coverflow/flip
    showArrows: false, //是否显示箭头
    arrowColor: '#ffffff', //箭头颜色
    loopEnabled: true, //是否循环
    speed: 300, //切换速度(ms)
  },
})

componentProperties.set('graphicnavigation', {
  component: 'graphicnavigation',
  text: '图文导航',
  type: '1-4',
  active: true,
  style: 'graphicnavigationstyle',
  setStyle: {
    text: '图文导航',
    imageList: [], // 图片导航列表
    navigationType: 0, //图片导航类型
    imgStyle: 0, //图片样式
    backgroundColor: 'rgb(255, 255, 255)', //背景颜色
    textColor: 'rgb(0, 0, 0)', //文字颜色
    borderRadius: 0, //图片倒角
    showSize: 5, //一屏显示个数
    textHeight: 24, // 字体高度
    textSize: 12, // 字体大小
    bgImg: '',
    // 新增：大图卡片样式/图标形状/HOT/NEW角标
    cardStyle: 0, //卡片样式: 0-默认小图 1-大图卡片
    iconShape: 'circle', //图标形状: circle/square/rounded
    showBadge: false, //是否显示角标
    badgeType: 'hot', //角标类型: hot/new
    badgeText: 'HOT', //角标文字
    badgeColor: '#ff4444', //角标背景色
    cardPadding: 10, //卡片内边距
    cardBgColor: '#ffffff', //卡片背景色
  },
})

componentProperties.set('richtext', {
  component: 'richtext',
  text: '富文本',
  type: '1-10',
  active: true,
  style: 'richtextstyle',
  setStyle: {
    text: '富文本',
    myValue: '', //富文本内容
    backColor: 'rgb(249, 249, 249)', //背景颜色
    // 新增：TinyMCE行高/缩进/字号配置
    lineHeight: '1.6', //默认行高
    fontSize: '14px', //默认字号
    indentSize: '2em', //缩进大小
    fontFormats: '微软雅黑=Microsoft YaHei;宋体=SimSun;黑体=SimHei;楷体=KaiTi;Arial=Arial;Times New Roman=Times New Roman', //字体列表
    fontsizeFormats: '12px 14px 16px 18px 20px 24px 28px 32px 36px', //字号列表
    lineHeightFormats: '1 1.2 1.5 1.6 1.8 2 2.5 3', //行高列表
  },
})

componentProperties.set('magiccube', {
  component: 'magiccube',
  text: '魔方',
  type: '1-6',
  active: true,
  style: 'magiccubestyle',
  setStyle: {
    text: '魔方',
    rubiksCubeType: 0, // 魔方类型
    pageMargin: 0, //页面间距
    imgMargin: 0, //图片间隙
    imageList: [
      {
        src: '',
        linktype: '10',
        http: {},
      },
      {
        src: '',
        linktype: '10',
        http: {},
      },
      {
        src: '',
        linktype: '10',
        http: {},
      },
      {
        src: '',
        linktype: '10',
        http: {},
      },
      {
        src: '',
        linktype: '10',
        http: {},
      },
    ], //图片列表
    // 新增：单格链接/比例/圆角
    aspectRatio: '1:1', //图片比例: 1:1/4:3/16:9/3:4
    borderRadius: 0, //圆角大小
    enableSingleLink: false, //是否启用单格链接
  },
})

componentProperties.set('auxiliarysegmentation', {
  component: 'auxiliarysegmentation',
  text: '辅助分割',
  type: '1-11',
  active: true,
  style: 'auxiliarysegmentationstyle',
  setStyle: {
    text: '辅助分割',
    blankHeight: 30, //空白高度
    segmentationtype: 0, //分割类型
    paddType: 0, //边距
    auxliarColor: 'rgb(229, 229, 229)', //辅助线颜色
    bordertp: 'solid', //线的类型
    // 新增：虚线/双线/渐变/带文字图标/缩进
    lineStyle: 'solid', //线条样式: solid/dashed/dotted/double/gradient
    gradientStartColor: '#ff6b6b', //渐变起始色
    gradientEndColor: '#4ecdc4', //渐变结束色
    lineWidth: 1, //线条粗细
    showText: false, //是否显示文字
    centerText: '', //中间文字
    centerIcon: '', //中间图标
    textColor: '#999999', //文字颜色
    textSize: 12, //文字大小
    leftIndent: 0, //左侧缩进
    rightIndent: 0, //右侧缩进
  },
})

componentProperties.set('commoditysearch', {
  component: 'commoditysearch',
  text: '商品搜索',
  type: '1-1',
  active: true,
  style: 'commoditysearchstyle',
  setStyle: {
    text: '商品搜索',
    heights: 28, //搜索栏高度
    position: 0, //显示位置
    sweep: false, // 显示扫一扫
    borderRadius: 0, //框体样式
    textPosition: 0, //文本位置
    backgroundColor: 'rgb(249, 249, 249)', //背景颜色
    borderColor: 'rgb(255, 255, 255)', //框体颜色
    textColor: 'rgb(150, 151, 153)', //字体颜色
    hotords: [], //热词
  },
})

componentProperties.set('storeinformation', {
  component: 'storeinformation',
  text: '店铺信息',
  type: '1-12',
  active: true,
  style: 'storeinformationstyle',
  setStyle: {
    text: '店铺信息',
    bakcgroundImg: '', //背景图片
    headPortrait: '', //店铺头像
    rubiksCubeType: 0, //类型
    name: '店铺名称', //店铺名称
    Discount: '在线支付满150减30，满100减20', //优惠信息
  },
})

componentProperties.set('entertheshop', {
  component: 'entertheshop',
  text: '单元格',
  type: '1-13',
  active: true,
  style: 'entertheshopstyle',
  setStyle: {
    text: '单元格',
    icon: '', // 左侧图标
    shopName: '左侧标题',
    copywriting: '右侧内容',
    type: '10',
    http: {},
  },
})

componentProperties.set('notice', {
  component: 'notice',
  text: '公告',
  type: '1-7',
  active: true,
  style: 'noticestyle',
  setStyle: {
    text: '公告',
    noticeText: '请填写内容，如果过长，将会在手机上滚动显示', //内容
    backColor: 'rgb(255, 248, 233)', //背景颜色
    textColor: 'rgba(100, 101, 102)', //文字颜色
    // 新增：多条滚动/方向/速度/前导图标
    noticeList: ['请填写公告内容1', '请填写公告内容2'], //多条公告
    scrollDirection: 'left', //滚动方向: left/up
    scrollSpeed: 50, //滚动速度 (数值越大越慢)
    leadIcon: 'volume-o', //前导图标 (vant图标名)
    showLeadIcon: true, //是否显示前导图标
    multiMode: false, //是否多公告模式
  },
})

componentProperties.set('videoss', {
  component: 'videoss',
  text: '视频',
  type: '1-8',
  active: true,
  style: 'videostyle',
  setStyle: {
    text: '视频',
    src: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4', // 视频地址
    coverUrl: null, // 封面地址
    autoplay: false, // 是否自动播放
    // 新增：循环/静音/控件开关
    loop: false, //是否循环播放
    muted: false, //是否静音
    showControls: true, //是否显示控件
    playsinline: true, //是否内联播放(iOS)
  },
})

componentProperties.set('custommodule', {
  component: 'custommodule',
  text: '自定义模块',
  type: 'demo',
  active: true,
  style: 'custommodulestyle',
  setStyle: {
    text: '自定义模块',
    demo:'自定义内容',
    img:'https://img2.baidu.com/it/u=1905875968,4289754134&fm=26&fmt=auto&gp=0.jpg'
  },
})

componentProperties.set('communitypowder', {
  component: 'communitypowder',
  text: '社群涨粉',
  type: '1-14',
  active: true,
  style: 'communitypowderstyle',
  setStyle: {
    text: '社群涨粉',
    mainImg: '', //入口图片
    qrcodeImg: '', //二维码
    title: '标题', //标题
    describe: '辅助描述', //描述
    buttonName: '立即添加', //按钮名称
    backColor: 'rgb(255, 255, 255)', //背景颜色
  },
})

componentProperties.set('storenotecard', {
  component: 'storenotecard',
  text: '文章模块',
  type: '2-2',
  active: true,
  style: 'storenotecardstyle',
  setStyle: {
    text: '文章模块',
    name: '这里显示专题名称', //专题名称
    commodityType: 0, // 选择模板
    moditystyle: 0, // 卡片样式选择
    borderRadius: 0, // 图片边角
    textWeight: 400, // 标题粗细
    noteLabels: true, // 笔记标签
    readingNumber: true, // 阅读数
    praisePoints: true, //点赞数
    viewMore1: true, //更多1
    viewMore2: true, //更多2
    imageList: [],
    positions: 'bottom', //标题位置
    linktype: '10',
    http: {},
    // 新增：标签编辑/点赞阅读数可填/多图与作者
    tags: ['标签1', '标签2'], //标签列表
    showTags: true, //是否显示标签
    customReadCount: 999, //自定义阅读数
    customPraiseCount: 999, //自定义点赞数
    useCustomCount: false, //是否使用自定义计数
    author: '', //作者名称
    authorAvatar: '', //作者头像
    showAuthor: false, //是否显示作者
    multiImage: false, //是否多图模式
    publishTime: '', //发布时间
    showTime: false, //是否显示时间
  },
})

componentProperties.set('crowdoperation', {
  component: 'crowdoperation',
  text: '人群运营',
  type: '1-17',
  active: true,
  style: 'crowdoperationstyle',
  setStyle: {
    text: '人群运营',
  },
})

componentProperties.set('personalizedrecommendation', {
  component: 'personalizedrecommendation',
  text: '个性化推荐',
  type: '1-18',
  active: true,
  style: 'personalizedrecommendationstyle',
  setStyle: {
    text: '个性化推荐',
  },
})

componentProperties.set('onlineservice', {
  component: 'onlineservice',
  text: '在线客服',
  type: '1-19',
  active: true,
  style: 'onlineservicestyle',
  setStyle: {
    text: '在线客服',
  },
})

componentProperties.set('investigate', {
  component: 'investigate',
  text: '表单模块',
  type: '2-3',
  active: true,
  style: 'investigatestyle',
  setStyle: {
    text: '表单模块',
    title: '表单模块',
    jsonData: [], //value1为sass显示内容，value2为前端显示内容
    // 新增：日期/开关/评分/必填校验/提交按钮样式
    submitText: '提交', //提交按钮文案
    submitBgColor: '#1989fa', //提交按钮背景色
    submitTextColor: '#ffffff', //提交按钮文字颜色
    submitBtnRadius: 20, //提交按钮圆角
    requiredMark: true, //是否显示必填标记
  },
})

componentProperties.set('tabBar', {
  component: 'tabBar',
  text: '底部导航',
  type: '1-5',
  active: true,
  style: 'tabBarStyle',
  setStyle: {
    text: '底部导航',
    activeColor: '#1989fa',
    inactiveColor: '#7d7e80',
    isShowBorder: true,
    iconWidth: '25',
    iconHeight: '25',
    fontSize: '14',
    Highlight: 0,
    iconList: [],
    // 新增：徽标配置
    showBadge: false, //是否支持徽标
  },
})

componentProperties.set('follow', {
  component: 'follow',
  text: '关注公众号',
  type: '1-15',
  active: true,
  style: 'followStyle',
  setStyle: {
    text: '关注公众号',
    heade: 'https://imgs.starfirelink.com/miniShop//logo_1618466110849.png',
    followName: '公众号名称',
    followAppId: '',
    // 新增：关注按钮切换/历史文章/简介
    isFollowed: false, //是否已关注
    followBtnText: '关注公众号', //关注按钮文字
    followedBtnText: '已关注', //已关注按钮文字
    description: '', //公众号简介
    showDescription: false, //是否显示简介
    historyArticles: [], //历史文章列表
    showHistoryArticles: false, //是否显示历史文章
    articleCount: 3, //显示文章数量
  },
})

componentProperties.set('suspension', {
  component: 'suspension',
  text: '悬浮按钮',
  type: '1-16',
  active: true,
  style: 'suspensionstyle',
  setStyle: {
    text: '悬浮按钮',
    linktype: '10',
    http: {},
    // 新增：位置偏移/FAB展开菜单/透明度
    iconUrl: 'https://imgs.starfirelink.com/vue-fire-start-h5/shop-peison/icon_back_36.png', //按钮图标
    positionX: 30, //水平位置(距右侧px)
    positionY: 10, //垂直位置(距底部%)
    offsetX: 0, //水平偏移(px)
    offsetY: 0, //垂直偏移(px)
    opacity: 1, //透明度 (0-1)
    fabEnabled: false, //是否启用FAB展开菜单
    fabItems: [], //FAB菜单项 [{icon, text, linktype, http}]
    fabDirection: 'up', //展开方向: up/down/left/right
    btnSize: 48, //按钮大小(px)
    borderRadius: '50%', //按钮圆角
  },
})

// 页面设置默认值（在home/index.vue中使用）
componentProperties.set('pageSetupDefaults', {
  name: '页面标题',
  details: '',
  isPerson: false,
  isBack: true,
  titleHeight: 35,
  bgColor: 'rgba(249, 249, 249, 10)',
  bgImg: '',
  // 新增：渐变背景/平铺覆盖/标题栏字色/外边距
  bgType: 'color', //背景类型: color/image/gradient
  gradientStart: '#667eea', //渐变起始色
  gradientEnd: '#764ba2', //渐变结束色
  gradientDirection: 'to bottom', //渐变方向
  bgSize: 'cover', //背景尺寸: cover/contain/auto (平铺/覆盖)
  bgRepeat: 'no-repeat', //背景重复: no-repeat/repeat/repeat-x/repeat-y
  titleTextColor: '#333333', //标题栏字色
  titleBgColor: '#ffffff', //标题栏背景色
  pageMarginTop: 0, //页面上边距
  pageMarginBottom: 0, //页面下边距
  pageMarginLeft: 0, //页面左边距
  pageMarginRight: 0, //页面右边距
  version: 'V2.0.0', //数据版本号，用于导入时版本迁移
})

export default componentProperties
