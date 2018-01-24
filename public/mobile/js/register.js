
$(function(){

    init();

    function init(){
     
        /* 点击注册
    1 验证手机号码  找正则
    2 判断密码1 长度 不能少于6
    3 判断密码2  密码1==密码2
    4 判断认证码 长度 6位 
    
    点击获取认证码
    1 先判断是否发送 判断按钮有没有 某个class .mui-disabled
    2 如果 正在发送或者在倒计时中  return
    3 改变文字提示-> 正在发送
    4 发送请求ajax
    5 成功之后 开启定时器 
    6 定时器到了之后 清楚定时器  */
    
    $(".register_btn").on("tap",function(){

        var userName = $(".username").val();
        var pwd = $(".password1").val();
        var pwd_sure =  $(".password2").val();
        var code = $(".code_txt").val();
        // var isCheck = 

        //判断手机
        if(!checkPhone(userName)){
            mui.toast("手机号码有误");
            return;
        }

        //密码
        if(pwd.length<6){
            mui.toast("密码错误");
            return;
        }

        //确认密码
        if(pwd_sure!=pwd){
            mui.toast("确认密码与密码不一致");
            return;
        }

        //验证码
        if(code.length<6){
            mui.toast("验证码错误");
            return;
        }

    })

       



    }

    //正则验证手机号码
    function checkPhone(phone) {
        var phoneReg = /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/;
        //电话  
    
        if (!phoneReg.test(phone)) {
          // 不满足
          return false;
        } else {
          return true;
        }
    
      }


})