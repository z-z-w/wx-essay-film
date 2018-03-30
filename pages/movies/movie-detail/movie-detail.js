const app = getApp();
const util = require('../../../utils/util.js');
import {Movie} from './class/Movie.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    movie: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let movieId = options.id;
    let url = app.globalData.doubanBase + '/v2/movie/subject/' + movieId;
    let movie = new Movie(url);
    movie.getMovieData((movie) => {
      this.setData({
        movie: movie
      })
    })
  },

  viewMoviePostImg(e) {
    let src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: [src] // 需要预览的图片http链接列表
    })
  },
  
})