$(function () {


  init();
  function init() {

    mui.init({
      pullRefresh: {
        container: "#refreshContainer",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
        down: {
          height: 50,//可选,默认50.触发下拉刷新拖动距离,
          auto: true,//可选,默认false.首次加载自动下拉刷新一次
          contentdown: "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
          contentover: "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
          contentrefresh: "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
          callback: function () {
            queryProductDetail(function (res) {

              res.sizeArr = getSize(res.size);

              var html = template("mainTmp", res);
              $(".mui-scroll").html(html);

              //轮播图
              var gallery = mui('.mui-slider');
              gallery.slider({
                interval: 1500//自动轮播周期，若为0则不自动播放，默认为0；
              });

              // 输入框的初始化
              mui(".mui-numbox").numbox();

              mui('#refreshContainer').pullRefresh().endPulldownToRefresh();

            });
          }
        }
      }
    });

  }


  //选择尺寸 排他
  $(".mui-scroll").on("tap",".goods_size span",function(){
    // console.log(123);
    $(this).addClass("active").siblings().removeClass("active");
  })

  //加入购物车
  $(".add_cart").on("tap",function(){
  /*  1 判断有没有选中尺码
    2 判断数量的值是否合法 
    3 再去做添加到购物车 */

    if($(".goods_size span.active").length<1){
      mui.toast("请选择尺码");
        return;
    }

    if($(".mui-numbox-input").val()<1){
      mui.toast("请选择数量");
      return;
    }

    var dataObj = {
      productId:$.getQueryString("id"),
      num:$(".mui-numbox-input").val(),
      size:$(".goods_size span.active").text()
    }

    $.post("/cart/addCart",dataObj,function(res){
        // console.log(res);
        if(res.error&&res.error==400){
            location.href = "./user/login.html?returnURL="+location.href;
        }else{
          mui.confirm("是否去购物车查看?","添加购物车成功",["是","否"],function(a){
          // console.log(a);
          //index=0==>是  index=0==>否
            if(a.index==0){
                location.href = "./cart.html";
            }else{
              
            }
          })
        }
        
    })
    

  })

  //请求数据
  // queryProductDetail();
  function queryProductDetail(callback) {

    var id = $.getQueryString("id");
    // console.log(id);

    $.get("/product/queryProductDetail", "id=" + id, function (res) {
      // console.log(res);
      callback && callback(res);
    })
  }

  //物品尺寸size
  function getSize(str) {

    var arr = [];
    var startSize = str.split("-")[0];
    var endSize = str.split("-")[1];
    for (var i = startSize; i <= endSize; i++) {
      arr.push(i);
    }
    return arr;
  }

})