$(function () {

    history();


    //历史记录
    function history() {

        //点击搜索按钮,把输入的值存入本地存储
        $(".searchBtn").on("tap", function () {

            var txt = $(".searchTxt").val();
            console.log(txt);

            //判断输入的是不是空字符
            if (!$.trim(txt)) {
                console.log("空字符");
                return;
            }

            var arr = (localStorage.getItem("historyItems") && JSON.parse(localStorage.getItem("historyItems"))) || [];

            //判断数组里是否有和输入框相同的字符串,如果有不添加
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] == txt) {
                    // splice 删除数组(索引,要删除几个)
                    arr.splice(i, 1);
                }
            }

            //如果有相同的 删除完再添加
            arr.unshift(txt);

            localStorage.setItem("historyItems", JSON.stringify(arr));

            //跳转到搜索结果页面
            location.href = "./searchResult.html?key="+txt;
        })

        //获取本地存储,渲染页面
        getLocalStorage();
        function getLocalStorage() {

            var arr = (localStorage.getItem("historyItems") && JSON.parse(localStorage.getItem("historyItems"))) || [];

            var str = "";
            for (var i = 0; i < arr.length; i++) {
                str += " <li>" + arr[i] + "<a data-index=" + i + " class='removeItem' href = 'javascript:;' ><span class='mui-icon mui-icon-closeempty'></span></a ></li >";
            }

            $("ul").html(str);

            //如果是空数组,显示没有搜索记录,否则反之
            if (arr.length > 0) {
                $(".history_none").hide();
            } else {
                $(".history_msg").hide();
            }
        }

        //清空记录
        $(".clearHistory").on("tap", function () {
            localStorage.removeItem("historyItems");
            location.reload();
        })

        //单独删除某一条记录
        //记录是动态添加的,要用事件委托的方法注册事件
        $(".history_msg ul").on("tap", ".removeItem", function (e) {
            // console.log(e);
            var aDom = e.target;
            var index = $(aDom).parent().data("index");
            // console.log(index);

            var arr = (localStorage.getItem("historyItems") && JSON.parse(localStorage.getItem("historyItems"))) || [];
            //删除点击的索引对应的数组内容
            arr.splice(index, 1);

            //重新遍历并储存
            var str = "";
            for (var i = 0; i < arr.length; i++) {
                str += " <li>" + arr[i] + "<a data-index=" + i + " class='removeItem' href = 'javascript:;' ><span class='mui-icon mui-icon-closeempty'></span></a ></li >";
            }

            $("ul").html(str);

            localStorage.setItem("historyItems", JSON.stringify(arr));

            location.reload();

        })

    }

})