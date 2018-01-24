$(function () {

    /* 
页面功能分析:
0 建议所有的变量都放在代码的最前面 function的前面 
1 下拉刷新  复杂数据的渲染建议使用模版引擎 
  a 页面初始化 
    1 先构造请求参数 
      a 根据url上的参数 key->proName 产品名称
        1 
      b 去查看api文档
  b 点击搜索按钮
    1 获取商品名称
    2 把名称赋值给 全局查询参数对象 QueryObj.proName
    3 手动触发 下拉刷新 
      因为下拉刷新组件里面 已经包含了请求数据的代码 
  c 点击排序的按钮
    1 切换 箭头方向
    2 需要知道点击的是谁 是价格还是数量
    3 根据箭头的方向来判断 是升序还是降序 1升序，2降序
    4 手动触发 下拉刷新 

 2 上拉加载下一页
    1 计算总页数 TotalPage
      a 查看返回值 
        count 总条数 pageSize 页容量 
                          6/4=1.2333
                 count=6    pageSize   =3   
        总页数 =Math.ceil(count/pageSize)
        TotalPage=Math.ceil(count/pageSize);
    2 拿当前页 QueryObj.page和TotalPage
      a 如果超过了 返回 不执行
      b 不超过-> QueryObj.page++ 然后再发送请求 
  3 点击商品页面跳转
    1 最简单 点击a标签 href属性写上 路径就可以了
    2 在mui中 上拉刷新和下拉加载组件中   a标签的跳转被禁止
    3 因为我们只是在做移动web 不是app 所以还是需要a标签的跳转功能
    4 给a标签绑定一个tap事件
        location.href=a.href;
 */
    // console.log($.getQueryString("key"));

    //ajax请求参数对象
    var QueryObj = {
        proName: $.getQueryString("key"),
        brandId: "",
        price: "",
        num: "",
        page: "1",
        pageSize: "4"
    };

    var totalPages = 1;//总页数

    init();

    //下拉刷新,上拉加载
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
                        QueryObj.page = 1;
                        //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                        queryProduct(function (res) {

                            var html = template("mt", res);
                            $(".goodsList").html(html);
                            //结束下拉刷新
                            mui('#refreshContainer').pullRefresh().endPulldownToRefresh();

                            //重置
                            mui('#refreshContainer').pullRefresh().refresh(true);
                        });
                    }
                },
                up: {
                    height: 50,//可选.默认50.触发上拉加载拖动距离
                    auto: true,//可选,默认false.自动上拉加载一次
                    contentrefresh: "正在加载...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
                    contentnomore: '没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
                    callback: function () {

                        if (QueryObj.page >= totalPages) {
                            //如果没有更多的数据传入,显示没有更多的数据了
                            mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
                            return;
                        } else {
                            QueryObj.page++;
                            queryProduct(function (res) {
                                var html = template("mt", res);
                                $(".goodsList").append(html);

                                mui('#refreshContainer').pullRefresh().endPullupToRefresh();
                            })
                        }

                    }
                }
            }
        });

        //点击搜索,重新加载
        $(".searchBtn").on("tap", function () {
            var txt = $(".searchTxt").val();
            // console.log(txt);
            QueryObj.proName = txt;
            // 手动启用刷新组件
            mui("#refreshContainer").pullRefresh().pulldownLoading();
        })

        //点击根据条件筛选,价格销量
        $(".condition > a").on("tap", function (e) {
            // console.log(e.target);
            var aDom = e.target;

            var sortName = aDom.dataset.sort;
            // console.log(sort);

            //切换字体图标
            $(aDom).find(".fa").toggleClass("fa-angle-down fa-angle-up")

            //升序,降序
            var sort = 1;
            if ($(aDom).find(".fa").hasClass("fa-angle-down")) {
                sort = 2;
            } else {
                sort = 1;
            }


            QueryObj.num = "";
            QueryObj.price = "";
            QueryObj[sortName] = sort;
            // 手动启用刷新组件
            mui("#refreshContainer").pullRefresh().pulldownLoading();
        })
    }



    // queryProduct();
    //从后台获取数据 $.get("url","请求参数","回调函数")
    function queryProduct(callback) {
        // console.log(QueryObj);

        $.get("/product/queryProduct", QueryObj, function (res) {
            console.log(res);

            callback && callback(res);

            //计算总页数
            // var totalSize = res.count;
            totalPages = Math.ceil(res.count / QueryObj.pageSize);
            // console.log(totalPages);

        })

    }


    //点击a 标签调到商品详情页面
    // $(".goodsList").on("tap","a",function(e){
    //     // console.log(e.target);
    //     location.href = e.target.href;
    // })

})


