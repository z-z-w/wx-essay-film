const app = getApp();
const util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inTheaters: {},
    comingSoon: {},
    top250: {},
    searchResult: {},
    containerShow: true,
    searchPannelShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var inTheaterUrl = app.globalData.doubanBase + '/v2/movie/in_theaters' + "?start=0&count=3";
    var comingSoonUrl = app.globalData.doubanBase + '/v2/movie/coming_soon' + "?start=0&count=3";
    var top250Url = app.globalData.doubanBase + '/v2/movie/top250' + "?start=0&count=3";
    
    this.getMovieListData(inTheaterUrl, 'inTheaters', "正在热映");
    this.getMovieListData(comingSoonUrl, 'comingSoon', "即将上映");
    this.getMovieListData(top250Url, 'top250', "Top250");
  },

  onMoreTap(event){
    let category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: 'more-movie/more-movie?category=' + category,
    })
  },

  onMovieTap(event) {
    let movieId = event.currentTarget.dataset.movieid
    wx.navigateTo({
      url: 'movie-detail/movie-detail?id=' + movieId,
    })
  },

  getMovieListData(url, settedKey, category) {
    var that = this;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        'Content-Type': 'json'
      },
      success(res) {
        that.processDoubanData(res.data, settedKey, category);
      },
      fail(err) {
        console.log(err);
      }
    })
  },


  processDoubanData(moviesDouban, settedKey, category) {
    let movies = [];
    for (let subject of moviesDouban.subjects) {
      let title = subject.title;
      if(title.length >= 6) {
        title = title.substring(0,6) + '...';
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
    let readyData = {};
    readyData[settedKey] = {
      movies: movies,
      category: category
    };
    this.setData(readyData);
  },

  onCancelImgTap(event) {
    console.log(event);
    this.setData({
      containerShow: true,
      searchPanelShow: false,
      searchResult: {}
    })
  },

  onBingFocus(event) {
    this.setData({
      containerShow: false,
      searchPanelShow: true
    })
  },

  onBingConfirm(event) {
    let text = event.detail.value;
    let searchUrl = app.globalData.doubanBase + '/v2/movie/search?q=' + text;
    this.getMovieListData(searchUrl, 'searchResult', '');
  }
})