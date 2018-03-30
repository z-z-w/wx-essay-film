const app = getApp();
const util = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    movies: [],
    requestUrl: '',
    totalCount: 0,
    isEmpty: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let category = options.category;
    let dataUrl = "";
    wx.setNavigationBarTitle({
      title: category
    });
    switch (category) {
      case '正在热映':
        dataUrl = app.globalData.doubanBase + '/v2/movie/in_theaters';
        break;
      case '即将上映':
        dataUrl = app.globalData.doubanBase + '/v2/movie/coming_soon';
        break;
      case 'Top250':
        dataUrl = app.globalData.doubanBase + '/v2/movie/top250';
        break;
    };
    this.setData({
      requestUrl: dataUrl
    });
    util.http(dataUrl, this.processDoubanData);
  },


  onReachBottom(event) {
    let nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
    util.http(nextUrl, this.processDoubanData);
    wx.showLoading({
      title: '加载中...',
    })
  },

  onPullDownRefresh(event) {
    let refreshUrl = this.data.requestUrl;
    this.setData({
      movies: []
    });
    util.http(refreshUrl, this.processDoubanData);
    wx.showNavigationBarLoading();
  },

  processDoubanData(moviesDouban) {
    let movies = [];
    for (let subject of moviesDouban.subjects) {
      let title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + '...';
      }
      let temp = {
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id,
        stars: util.convertToStarArray(subject.rating.stars)
      }
      movies.push(temp);
    }
    let totalMovies = [];
    //判断是否是要绑定新加载的数据
    // if (!this.data.isEmpty) {
      totalMovies = this.data.movies.concat(movies);
    // } else {
    //   totalMovies = movies;
    //   this.setData({
    //     isEmpty: false
    //   });
    // }
    let count = this.data.totalCount + 20; 
    this.setData({
      movies: totalMovies,
      totalCount: count
    });
    wx.hideLoading();
    wx.hideNavigationBarLoading();
  },

  onMovieTap(event) {
    let movieId = event.currentTarget.dataset.movieid
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id=' + movieId,
    })
  },


})