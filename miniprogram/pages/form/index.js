const app = getApp()
// pages/form/index.js
Page({
  data: {
    requestUrl: app.globalData.baseUrl,
    show: false,
    Time: null, // 接收传递的日期信息
    formData: {
      remindTime: new Date().getHours() + ':' + (new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()),
      title: '',
      content: '',
      status: 1
    },
    minHour: 0,
    maxHour: 23,
  },
  onLoad(options) {
    // console.log(app.globalData.baseUrl);
    this.data.Time = this.GetDateData(options.time)
  },
  showPopup() {
    this.setData({
      show: true
    })
  },
  onClose() {
    this.setData({ show: false });
  },
  onConfirm(e) {
    this.setData({
      ['formData.remindTime']: e.detail,
    });
    this.onClose()

  },
  onChange(e) {
    // 参数  e.currentTarget.dataset['name']
    switch (e.currentTarget.dataset['name']) {
      case 'title':
        console.log('title');
        this.data.formData.title = e.detail
        break
      case 'content':
        this.data.formData.content = e.detail
        break
    }
  },
  // 确认提交
  formSubmit() {
    const that = this
    this.data.formData.Time = this.data.Time
    console.log(this.data.formData);
    wx.request({
      url: that.data.requestUrl + '/post',
      method: 'POST',
      data: that.data.formData,
      success: (res) => {
        const { data } = res
        if (data.code === 0) {
          wx.requestSubscribeMessage({
            tmplIds: ['模板ID填写位置'],
            success: (res) => {
              console.log(res);
              wx.showToast({
                title: '提交成功！',
              })
              wx.request({
                url: this.data.requestUrl + '/getList',
                method: 'GET',
                success: (res) => {
                  const { data } = res.data
                  // console.log(data.maxId);
                  // 下发信息
                  // wx.request({
                  //   url: this.data.requestUrl + '/sendMsg?maxId=' + data.maxId,
                  //   method: 'GET',
                  //   success: (res) => {
                  //     console.log(res);
                  //   }
                  // })
                }
              })
              setTimeout(() => {
                wx.navigateBack()
              }, 1000)
            }
          })
        }
      }
    })
  },
  GetDateData(arg) {
    let time = new Date(arg)
    const year = time.getFullYear()
    const month = time.getMonth() + 1
    const day = time.getDate()
    return year + '-' + month + '-' + day
  }
})
