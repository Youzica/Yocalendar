const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    requestUrl: app.globalData.baseUrl,
    params: {
      appid: 'appid填写位置',
      secret: '秘钥填写位置',
      access_token: '',
      openid: ''
    },
    touchS: 0,
    touchE: 0,
    fadeName: 'fade-left',
    show: true,
    currentYear: new Date().getFullYear(),
    currentMonth: new Date().getMonth(),
    minDate: new Date(2023, 9, 1).getTime(),
    maxDate: new Date(2023, 9, 31).getTime(),
  },
  onShow: function () {
    this.getTabBar().init()
    // 获取access_token
    wx.request({
      url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + this.data.params.appid + '&secret=' + this.data.params.secret + '',
      method: 'GET',
      success: (res) => {
        this.data.params.access_token = res.data.access_token
      }
    })
    // 不应该这么做  需要登录的时候才调用login更新个人code信息
    // 登录接口  获取code值 进而获取openId等唯一标识
    wx.login({
      success: (res) => {
        wx.request({
          url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + this.data.params.appid + '&secret=' + this.data.params.secret + '&js_code=' + res.code + '&grant_type=authorization_code',
          success: (ress) => {
            this.data.params.openid = ress.data.openid
            // 参数信息保存后台
            wx.request({
              url: this.data.requestUrl+'/postCode',
              method:'POST',
              data:this.data.params,
              success:(res)=>{
              }
            })
          }
        })
      },
    })

  },
  // 点击日历日期按钮
  onClickCalendar(e) {
    wx.navigateTo({
      url: '/pages/form/index?time=' + e.detail,
    })
  },
  onStart(e) {
    let sx = e.touches[0].clientX
    this.data.touchS = sx
    this.data.touchE = sx
  },
  onMove(e) {
    let sx = e.touches[0].clientX;
    this.data.touchE = sx
  },
  onEnd(e) {
    let start = this.data.touchS
    let end = this.data.touchE
    if (end == 0) {
      start = 0
    }
    if (start < end - 80) {
      console.log(1234);
      this.onClickLeft()
    } else if (start > end + 80) {
      console.log(4321);
      this.onClickRight()
    } else {
      console.log('点击')
    }
  },

  onClickLeft() {
    wx.nextTick(() => {
      const Month = this.data.currentMonth - 1
      if (Month < new Date().getMonth()) {
        wx.showToast({
          title: 'o(≧口≦)o  您不能再后退啦！',
          icon: 'none'
        })
      } else {
        this.setData({
          show: false,
          fadeName: 'fade-right'
        })
        if (Month == new Date().getMonth()) {
          this.getMonth(this.data.currentYear, Month, new Date().getDate())
        } else {
          this.getMonth(this.data.currentYear, Month)
        }
        setTimeout(() => {
          this.setData({
            fadeName: 'fade-left',
            show: true
          })
        }, 400)
      }
    })
  },
  onClickRight() {
    this.setData({
      show: false,
      fadeName: 'fade-left'
    })
    this.getMonth(this.data.currentYear, this.data.currentMonth + 1)
    setTimeout(() => {
      this.setData({
        fadeName: 'fade-right',
        show: true
      })
    }, 400)
  },
  onLoad() {
    // 年月日
    this.getMonth()
    wx.getSetting({
      withSubscriptions: true,
      success: (res) => {
        // console.log(res);
        if (res.subscriptionsSetting.mainSwitch) { //打开订阅消息
          if (res.subscriptionsSetting.itemSettings != null) {  //总是  不在询问

          } else {
            // wx.showModal({
            //   title: '提示',
            //   content: '请授权开通服务通知',
            //   showCancel: true,
            //   success: (rs) => {
            //     if (rs.cancel) {

            //     }
            //     if (rs.confirm) {

            //     }
            //   }
            // })
          }
        }
      }
    })
  },

  // 获取日期信息
  getMonth(year, month, day) {
    let date = new Date()
    let maxDay = null, Day = null
    const Year = year ? year : date.getFullYear()
    const Month = month ? month : date.getMonth()
    // 当前日期
    if (Month == this.data.currentMonth) {
      Day = day ? day : date.getDate()
    } else {
      Day = day ? day : 1
    }
    // 获取当月最大日期
    date.setMonth(Month + 1)
    date.setDate(0)
    maxDay = date.getDate()
    // console.log(maxDay);
    // console.log(Day);
    this.setData({
      currentMonth: Month,
      minDate: new Date(Year, Month, Day).getTime(),
      maxDate: new Date(Year, Month, maxDay).getTime()
    })
  },
})
