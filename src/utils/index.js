class utils {
  /**
   *
   * 时间戳转换日期
   *
   * @param {String} value 传入的时间戳
   * @param {String} String 返回的时间
   */
  formatDate(value) {
    let date = new Date(value)
    let y = date.getFullYear()
    let MM = date.getMonth() + 1
    MM = MM < 10 ? '0' + MM : MM
    let d = date.getDate()
    d = d < 10 ? '0' + d : d
    let h = date.getHours()
    h = h < 10 ? '0' + h : h
    let m = date.getMinutes()
    m = m < 10 ? '0' + m : m
    let s = date.getSeconds()
    s = s < 10 ? '0' + s : s
    return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s
  }

  /**
   * 循环对象
   *
   * @param {Object|Array} obj 传入的值
   * @param {Function} fn 为每个项调用的回调
   */
  forEach(obj, fn) {
    if (obj === null || typeof obj === 'undefined') return

    // 如果还没有可写的东西，就强制一个数组
    if (typeof obj !== 'object') obj = [obj]

    if (this.isArray(obj)) {
      // 数组循环
      for (var i = 0, l = obj.length; i < l; i++) {
        fn.call(null, obj[i], i, obj)
      }
    } else {
      // 对象循环
      for (var key in obj) {
        /* 是否具有键 */
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          fn.call(null, obj[key], key, obj)
        }
      }
    }
  }

  /**
   * 确定值是否为数组
   *
   * @param {Object} val 传入的值
   * @returns {boolean} 如果值是数组，则为True，否则为false
   */
  isArray(val) {
    return Object.prototype.toString.call(val) === '[object Array]'
  }

  /**
   * 确定值是否为对象
   *
   * @param {Object} obj 传入的对象
   * @returns {String} 返回类型
   */
  getObjClass(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1)
  }

  /**
   * 深度克隆
   *
   * @param {Object} obj 传入需要克隆的对象
   * @returns {Object} 返回克隆好的对象
   */
  deepClone(obj) {
    let result
    let objClass = this.getObjClass(obj)

    if (objClass === 'Object') {
      result = {}
    } else if (objClass === 'Array') {
      result = []
    } else {
      return obj // 如果是其他数据类型不复制，直接将数据返回
    }

    // 遍历目标对象
    for (let key in obj) {
      let value = obj[key]
      result[key] = this.deepClone(value)
    }

    return result
  }


  /**
   * 递归合并两个对象
   *
   * @param {*} target
   * @param {*} sources
   * @return {*}
   * @memberof Common
   */
  assiginObj(target, sources) {
    let obj = target
    if (typeof target != 'object' || typeof sources != 'object' || typeof target) {
      return sources // 如果其中一个不是对象 就返回sources
    }
    for (let key in sources) {
      if (target.hasOwnProperty(key)) {
        obj[key] = this.assiginObj(target[key], sources[key])
      } else {
        // 不存在就直接添加
        obj[key] = sources[key]
      }
    }
    return obj
  }

  /**
   * F16 新增：字段补全 —— 以默认模板为基准，用导入数据覆盖，缺失字段用默认值补齐。
   * 用于导入旧版本 JSON 时做版本迁移，保证新版本新增的字段不会缺失导致渲染异常。
   *
   * @param {Object} defaults 默认模板(来自 componentProperties)
   * @param {Object} data 导入的数据
   * @returns {Object} 补全后的新对象(导入值优先，默认值兜底)
   */
  completeFields(defaults, data) {
    // 默认值不是对象则直接返回导入值(导入值为 undefined 时用默认值)
    if (this.getObjClass(defaults) !== 'Object') {
      return data === undefined ? defaults : data
    }
    // 导入数据缺失或非对象，直接深拷贝默认值
    if (this.getObjClass(data) !== 'Object') {
      return this.deepClone(defaults)
    }
    const result = {}
    // 以默认模板的字段为基准补全
    for (let key in defaults) {
      if (data.hasOwnProperty(key)) {
        const dv = defaults[key]
        const iv = data[key]
        if (this.getObjClass(dv) === 'Object' && this.getObjClass(iv) === 'Object') {
          // 嵌套对象递归补全
          result[key] = this.completeFields(dv, iv)
        } else {
          // 其它类型(含数组)优先使用导入值
          result[key] = iv
        }
      } else {
        // 导入数据缺失该字段，用默认值补齐(深拷贝避免引用共享)
        result[key] = this.deepClone(defaults[key])
      }
    }
    // 保留导入数据中默认模板没有的额外字段，避免丢失自定义数据
    for (let key in data) {
      if (!result.hasOwnProperty(key)) {
        result[key] = data[key]
      }
    }
    return result
  }
}

export default new utils()
