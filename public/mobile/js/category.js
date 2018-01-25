$(function(){

    mui('.mui-scroll-wrapper').scroll({
        deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    });

    queryTopCategory();

    function queryTopCategory(){

        $.get("/category/queryTopCategory",function(res){
            console.log(res);
            var rows = res.rows;
            var html = "";
            for(var i=0;i<rows.length;i++){
                html += "<li data-index="+rows[i].id+">"+ rows[i].categoryName +"</li>"
               
            }
            $(".lt_main_left ul").html(html);
        })

    }


    $(".lt_main_left").on("tap","li",function(e){
        // console.log(e.target.dataset.index);
        var id = e.target.dataset.index;
        $.get("/category/querySecondCategory",{id:id},function(res){
            console.log(res);
            var rows = res.rows;
            var html = "";
            for(var i=0;i<rows.length;i++){
                html += "<li><a href='#'><img src='"+ rows[i].brandLogo +"' alt=''><span> "+ rows[i].brandName +" </span></a></li>"; 
            }
            $(".mui-scroll ul").html(html);
        })

    })


})