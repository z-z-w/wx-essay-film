var postsData = require('../../data/posts-data.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    posts: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      posts: postsData.postList
    });
  },

  onPostTap(event) {
    //target指的是当前点击的组件  currentTarget指的是事件捕获的组件
    //加上0是防止postid为0是解析成false而不是0
    var postId = event.currentTarget.dataset.postid || event.target.dataset.postid || 0;
    wx.navigateTo({
      url: './post-detail/post-detail?id=' + postId
    })
  }
})