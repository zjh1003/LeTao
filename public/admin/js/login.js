$(function(){

    init();
    function init(){

        $(".btn_login").on("click",function(e){

            e.preventDefault();

            var userName = $("#inputUserName3").val();
            var password = $("#inputPassword3").val();

            var loginObj={
                username : userName,
                password : password
            }
            // console.log(loginObj);
            $.post("/employee/employeeLogin",loginObj,function(res){
                // console.log(res);
                if(res.success){
                    location.href = "./index.html";
                }else{
                    alert(res.message);
                }
                
            });

        })

    }


})