const app = getApp()
Page({
  data: {
    bottom_height: 0,
    requestUrl: app.globalData.baseUrl,
    all_List: [],
    List: []
  },
  onLoad: function (options) {
    const res = wx.getSystemInfoSync()
    this.setData({
      bottom_height: 54 + res.screenHeight - res.safeArea.bottom
    })
    console.log(res);
  },
  onShow: function () {
    this.getTabBar().init()
    wx.request({
      url: this.data.requestUrl + '/getList',
      method: 'GET',
      success: (res) => {
        console.log(res.data);
        const { data } = res.data
        this.data.all_List = data.calendarList
        const list = []
        for (let item of this.data.all_List) {
          if (item.status === 1)
            list.push(item)
        }
        this.setData({
          List: list
        })
      }
    })
  },
  onClick(e) {
    let list = []
    if (e.detail.index == 0) {//代办 1
      for (let item of this.data.all_List) {
        if (item.status === 1)
          list.push(item)
      }
      this.setData({
        List: list
      })
    } else { // 过期 0
      for (let item of this.data.all_List) {
        if (item.status === 0)
          list.push(item)
      }
      this.setData({
        List: list
      })
    }
    console.log(e);
  },
})