$(function(){

   
    init();
    function init(){

         //切换二级菜单
        $(".showSecond").on("click",function(){
           $(".second_menu").slideToggle();
        })
        
        //切换侧边栏
        $(".toggleAside").on("click",function(){
            $(".lt_main").toggleClass("aside_show");
        })

        //退出
        $(".lt_logout").on("click",function(){
            $.get("/employee/employeeLogout",function(res){
                // console.log(res);
                if(res.success){
                    location.href = "./login.html";
                }else{
                   console.log(res);
                    
                }
            })
        })
    }


})