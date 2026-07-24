const componentProperties = new Map()

// 数据版本  每次修改组件数据  需要对版本进行修改
// 本轮增量增强后版本升级为 V2.0.0，导入旧数据时按此版本做字段补全/迁移
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
    // F7 新增：左侧图标（iconfont 类名或图片链接，最长 100 字符）
    leftIcon: '',
    // F7 新增：小标题（描述）渐变开关及渐变色配置
    descGradient: false, //描述是否使用渐变文字
    descGradientStart: 'rgb(255, 106, 0)', //渐变起始色
    descGradientEnd: 'rgb(238, 0, 255)', //渐变结束色
    descGradientAngle: 90, //渐变角度(0-360)
    more: {    //查看更多
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
    // F4 新增：Mock 商品编辑器相关配置
    columns: 2, //列数(1-4)
    cardShadow: false, //卡片是否显示阴影
    buttonText: '马上抢', //按钮文案(最长 8 字符)
    mockList: [
      // Mock 商品数据，供右侧编辑器直接编辑
      { title: '示例商品名称', price: '99.00', img: '' },
      { title: '示例商品名称', price: '199.00', img: '' },
    ],
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
    // F3 新增：Swiper 增强配置
    autoplay: true, //是否自动播放
    autoplayDelay: 3000, //自动播放间隔(ms，500-10000)
    effect: 'slide', //过渡效果: slide/fade/cube/coverflow/flip
    showArrow: false, //是否显示左右箭头
    loop: true, //是否循环播放
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
    // F11 新增：大图卡片样式与图标形状、角标
    cardStyle: false, //是否启用大图卡片样式
    iconShape: 'square', //图标形状: square(方形)/circle(圆形)/round(圆角)
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
    // F9 新增：图片比例与圆角
    borderRadius: 0, //图片圆角(px)
    aspectRatio: '1:1', //图片比例: 1:1 / 4:3 / 16:9 / 3:4
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
    // F12 新增：线型/渐变/文字图标/缩进
    lineStyle: 'solid', //线型: solid(实线)/dashed(虚线)/double(双线)/gradient(渐变)
    gradientStart: 'rgb(255, 106, 0)', //渐变起始色(lineStyle=gradient 时生效)
    gradientEnd: 'rgb(238, 0, 255)', //渐变结束色
    indent: 0, //左右缩进(px, 0-50)
    showText: false, //是否显示中间文字
    lineText: '', //中间文字内容(最长 20 字符)
    textIcon: '', //文字前图标(iconfont 类名)
    textColor: 'rgb(150, 151, 153)', //文字颜色
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
    // F6 新增：多条滚动/方向/速度/前导图标
    noticeList: ['请填写公告内容一', '请填写公告内容二'], //多条公告，每条最长 50 字符
    direction: 'horizontal', //滚动方向: horizontal(横向)/vertical(纵向)
    speed: 40, //滚动速度(px/s 或秒，10-200)
    leadingIcon: 'volume-o', //前导图标(vant 图标名)
    showLeadingIcon: true, //是否显示前导图标
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
    coverUrl:null, // 封面地址
    autoplay: false, // 是否自动播放
    // F2 新增：循环/静音/控件开关
    loop: false, // 是否循环播放
    muted: false, // 是否静音
    controls: true, // 是否显示控件
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
    // F14 新增：标签编辑/点赞阅读可填/多图与作者
    articleList: [
      // 文章数据，供右侧编辑器编辑
      {
        title: '示例文章标题',
        labels: ['推荐'], //标签列表，每个最长 8 字符
        readCount: 1234, //阅读数(数字)
        praiseCount: 88, //点赞数(数字)
        author: '作者名称', //作者(最长 12 字符)
        authorAvatar: '', //作者头像
        images: [], //多图列表(图片链接)
      },
    ],
    authorEditable: true, //是否显示作者
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
    // F8 新增：字段增强/提交按钮样式
    // fields 描述表单项，type 支持: input/textarea/date/switch/rate/radio
    fields: [
      {
        label: '姓名', //字段标题(最长 20 字符)
        type: 'input', //字段类型
        required: true, //是否必填
        placeholder: '请输入姓名',
        options: [], //radio 类型的选项
        value: '', //默认值
      },
    ],
    submitText: '提交', //提交按钮文案(最长 10 字符)
    submitBgColor: '#155bd4', //提交按钮背景色
    submitTextColor: '#ffffff', //提交按钮文字颜色
    submitRadius: 4, //提交按钮圆角(px)
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
    iconList: [
      // F5 新增：默认给出可增删的 Tab 项，支持编辑图标与徽标
      // badge 为徽标内容(空则不显示，可为数字或短文本，最长 4 字符)
      { text: '首页', icon: '', activeIcon: '', badge: '', linktype: '10', http: {} },
      { text: '我的', icon: '', activeIcon: '', badge: '', linktype: '10', http: {} },
    ],
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
    // F13 新增：关注按钮切换/历史文章/简介
    showFollowBtn: true, //是否显示关注按钮
    followBtnText: '关注', //关注按钮文案(最长 6 字符)
    followedBtnText: '已关注', //已关注文案
    isFollowed: false, //预览态：是否已关注(用于按钮切换演示)
    intro: '这里是公众号简介，介绍公众号的定位与内容。', //简介(最长 60 字符)
    showIntro: true, //是否显示简介
    showHistory: true, //是否显示历史文章
    historyList: [
      // 历史文章列表
      { title: '示例历史文章一', cover: '', http: {} },
      { title: '示例历史文章二', cover: '', http: {} },
    ],
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
    // F10 新增：位置偏移/FAB 展开菜单/透明度
    position: 'right-bottom', //基础位置: right-bottom/left-bottom/right-top/left-top
    offsetX: 20, //水平偏移(px, 0-200)
    offsetY: 80, //垂直偏移(px, 0-400)
    opacity: 100, //透明度(0-100)
    mainIcon: '', //主按钮图标
    fabMode: false, //是否启用 FAB 展开菜单
    fabDirection: 'up', //展开方向: up/down/left/right
    menuList: [
      // FAB 展开子菜单，每项可配图标/文案/链接
      { icon: '', text: '菜单一', linktype: '10', http: {} },
      { icon: '', text: '菜单二', linktype: '10', http: {} },
    ],
  },
})

export default componentProperties
