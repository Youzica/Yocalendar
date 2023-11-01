Component({
  data: {
    active: 0,
    list: [{
        icon: 'home-o',
        text: '主页',
        name: 'home',
        url: '/pages/index/index'
      },
      {
        icon: 'search',
        text: '列表',
        name: 'list',
        url: '/pages/list/index'
      },  
      {
        icon: 'setting-o',
        text: '我的',
        name: 'my',
        url: '/pages/my/index'
      }
    ]
  },

  methods: {
    onChange(event) {
      this.setData({
        active: event.detail
      });
      wx.switchTab({
        url: this.data.list[event.detail].url,
      });
    },

    init() {
      const page = getCurrentPages().pop();
      this.setData({
        active: this.data.list.findIndex(item => item.url === `/${page.route}`)
      });
    }
  }
});