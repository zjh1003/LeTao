$(function(){

    var firstCateObj = {
        page : 1,
        pageSize : 4
    }

init();
function init(){

    queryTopCategoryPaging();
}

//获取一级菜单数据
function queryTopCategoryPaging(){
    $.get("/category/queryTopCategoryPaging",firstCateObj,function(res){
        // console.log(res);
        //  <tr><td>1</td><td>户外馆</td></tr>
        var dataArr = ["<tr><th>序号</th><th>分类名称</th></tr>"];
        for(var i=0;i<res.rows.length;i++){
            dataArr.push("<tr><td>"+ res.rows[i].id +"</td><td>"+ res.rows[i].categoryName +"</td></tr>");
        }
        $(".lt_table").html(dataArr.join(""));
    })


}

})