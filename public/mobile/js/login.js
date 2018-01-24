
$(function () {

    init();
    function init() {

        //给登录按钮注册点击事件
        $(".login_btn").on("tap", function () {

            //获取用户名和密码 长度为6
            var userName = $(".username").val();
            var pwd = $(".password").val();

            if(userName.length<6){
                mui.toast("用户名错误");
                return;
            }
            if(pwd.length<6){
                mui.toast("密码错误");
                return;
            }
            
           $.post("/user/login",{username:userName,password:pwd},function(res){
                // console.log(res);
                if(res.error&&res.error==403){
                    mui.toast(res.message);
                }else{
                    //判断跳转页面,商品详情或者主页
                    var returnUrl = $.getQueryString('returnURL');
                    if(returnUrl){
                        location.href = returnUrl;
                    }else{
                        location.href = "../index.html";
                    }
                }
                
           })
            

        })


    }

    //免费注册
    $(".register").on("tap",function(){
        location.href = "../user/register.html";
    })

})