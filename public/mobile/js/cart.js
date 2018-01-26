$(function () {

    init();

    var data;
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
                        queryCart(function (res) {

                            var html = template("listTmp", { data: res });
                            $("#OA_task_2").html(html);



                            mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
                        })
                    }
                }
            }
        });

    }


    //计算总价
    $("#OA_task_2").on("change",".listCheck", function () {

        var checkList = $("#OA_task_2 .listCheck:checked");
        // console.log(checkList.length);
        
        var totalPrice = 0;
        for(var i=0;i<checkList.length;i++){

            // console.log($(checkList[i]).parents(".mui-table-view-cell")[0].dataset.obj);
            var jsonStr = $(checkList[i]).parents(".mui-table-view-cell")[0].dataset.obj;
            var obj = JSON.parse(jsonStr);
            // console.log(obj);
            var price = obj.price;
            var num = obj.num;

            totalPrice += price*num;

            
        }

       var total = (Math.floor(totalPrice*100))/100;

        $(".total_money").text(total);

    })


    //删除购物车
    $("#OA_task_2").on("tap",".deleteBtn",function(){
        var that = this;
        mui.confirm("确定删除吗?","提示",["是","否"],function(a){
            if(a.index==0){//是
                var jsonStr = $(that).parents(".mui-table-view-cell")[0].dataset.obj;
                var obj = JSON.parse(jsonStr);
                var id = obj.id;
                // console.log(id);
                var arr = [id];
                var objId = {
                    "id":arr
                }
                $.get("/cart/deleteCart",objId,function(res){
                    // console.log(res);
                    if(res.success){
                        mui("#refreshContainer").pullRefresh().pulldownLoading();
                    }
                })

            }else{
                //否
            }
        })
    })

    //编辑购物车
    $("#OA_task_2").on("tap",".editBtn",function(){
        var that = this;
        var jsonStr = $(that).parents(".mui-table-view-cell")[0].dataset.obj;
        var obj = JSON.parse(jsonStr);

         obj.sizeArr = getSize(obj.productSize);
        // console.log(sizeArr);
        // console.log(obj);
        
        var html = template("editTmp",obj);

        // 因为mui.confirm 会把空格或者回车直接渲染成 br标签  所以我们最好提前把空格或者回车处理掉 
      //  替换掉所有的回车
      html = html.replace(/\n/g, "");
        mui.confirm(html,"编辑",["确定","取消"],function(a){
            if(a.index==0){//确定

                var updateObj = {
                    id:obj.id,
                    size:$(".goods_size span.active").html(),
                    num:$(".mui-numbox-input").val()
                }

                $.post("/cart/updateCart",updateObj,function(res){
                // console.log(res);
                if(res.sucess){
                    
                    mui("#refreshContainer").pullRefresh().pulldownLoading();
                }

                })
            }
        });

          // 初始化数字输入框
      mui(".mui-numbox").numbox();
    })

    $("body").on("tap",".goods_size span",function(){
        $(this).addClass("active").siblings().removeClass("active");
    })

    //把模板的value转为json对象的形式
    // template.helper("在插件中使用的方法名","我们在js里面定义的方法")
    template.helper("objToJson", function (value) {
        return JSON.stringify(value);
    })




    //查看购物车,判断登录
    function queryCart(callback) {
        $.get("/cart/queryCart", function (res) {
            // console.log(res);
            if (res.error && res.error == 400) {
                location.href = "./user/login.html?returnURL=" + location.href;
            } else {
                //已经登录
                callback && callback(res);
            }
        });

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