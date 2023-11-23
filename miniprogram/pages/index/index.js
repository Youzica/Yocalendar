const app = getApp()
Page({
  data: {
    bottom_height: 0,
    requestUrl: app.globalData.baseUrl,
    all_List: [],
    List: [],
    doList: [],
    outDateList: [],
    barIndex: 0,
  },
  onLoad: function (options) {
    const res = wx.getSystemInfoSync()
    this.setData({
      bottom_height: 54 + res.screenHeight - res.safeArea.bottom
    })
    this.getData()
  },
  onPullDownRefresh: function () {
    console.log('下拉刷新');
    // 每次+5条数据
    this.onRefresh();
  },
  onRefresh: function () {
    // 获取数据
    this.getData()
  },
  onReachBottom: function () {
    console.log('触底加载');
    // 页面触底时执行
  },
  onShow: function () {
    this.getTabBar().init()
  },
  getData() {
    //导航条加载动画
    wx.showNavigationBarLoading();
    wx.request({
      url: this.data.requestUrl + '/getList',
      method: 'GET',
      success: (res) => {
        console.log('ListData', res.data);
        const { data } = res.data
        this.data.all_List = data.calendarList
        const doList = [], outList = []
        for (let item of this.data.all_List) {
          if (item.status === 1)
            doList.push(item)
          else {
            outList.push(item)
          }
        }
        this.setData({
          doList: doList,
          outDateList: outList
        })
        wx.stopPullDownRefresh();
        wx.hideNavigationBarLoading();
      }
    })
  },
  changeTitle(e) {
    let list = []
    if (e.detail.index == 0) {//代办 1

    } else { // 过期 0

    }
    this.setData({
      List: list,
      barIndex: e.detail.index
    })
    console.log(this.data.barIndex);
  },
})