/**
 * Created by wijay on 2016/10/13.
 * dependencies:avalon 1.4.x/bootstrap/jquery
 * template:
 *    <div ms-controller="page" ms-widget="pager,?,$opts">
         <ul class="pagination" ms-if="pageCount>1">
             <li ms-click="homePage()" ms-class="{{currentPage==1?'disabled':''}}"><a href="##">首页</a></li>
             <li ms-click="lastPage()" ms-class="{{currentPage==1?'disabled':''}}"><a href="##">上一页</a></li>
             <li><a href="##" ms-if="firstDotShow">...</a></li>
             <li ms-repeat="showArr" ms-click="goTomodel(el)"><a href="##" ms-text="el" ms-class="{{el==currentPage?'current':''}}"></a></li>
             <li><a href="##" ms-if="lastDotShow">...</a></li>
             <li ms-click="nextPage()" ms-class="{{currentPage==pageCount?'disabled':''}}"><a href="##">下一页</a></li>
             <li ms-click="endPage()" ms-class="{{currentPage==pageCount?'disabled':''}}"><a href="##">尾页</a></li>
         </ul>
     </div>
 */
define(["avalon"],function (avalon) {
    //必须 在avalon.ui上注册一个函数，它有三个参数，分别为容器元素，data， vmodels
    avalon.ui["pager"] =function (element, data, vmodels) {
        var innerHTML = element.innerHTML;
        //由于innerHTML要依赖许多widget后来添加的新属性，这时如果被扫描肯定报“不存在”错误
        //因此先将它清空
        avalon.clearHTML(element);
        var model=avalon.define(data.pagerId,function (vm) {
            avalon.mix(vm,data.pagerOptions);
            // vm.pageCount=data.pagerOptions.pageCount;
            vm.currentPage=1;
            vm.pageArr=[];
            vm.showArr=[];
            vm.lastDis=true;
            vm.nextDis=false;
            vm.firstDotShow=false;
            vm.lastDotShow=false;
            vm.getPages=function () {
                model.pageArr=avalon.range(1,this.pageCount+1);
                model.showPage();
                // model.cb();
            };
            vm.showPage=function () {
                var count=this.pageCount;
                var current=model.currentPage;
                if (count<6){
                    model.showArr=model.pageArr;
                    model.firstDotShow=false;
                    model.lastDotShow=false;
                }else if(current<4){
                    model.showArr=avalon.range(1,6);
                    model.firstDotShow=false;
                    model.lastDotShow=true;
                }else if(current>count-3){
                    model.showArr=avalon.range(count-4,count+1);
                    model.firstDotShow=true;
                    model.lastDotShow=false;
                }else{
                    model.showArr=avalon.range(current-2,current+3);
                    model.firstDotShow=true;
                    model.lastDotShow=true;
                }
                this.cb(current);
            };
            vm.lastPage=function () {
                if (model.currentPage>1){
                    model.currentPage--;
                }
            };
            // var that =this;
            vm.nextPage=function () {
                if(model.currentPage<model.pageCount){
                    console.log(that)
                    model.currentPage++;
                }
            };
            vm.homePage=function () {
                model.currentPage=1;
            };
            vm.endPage=function () {
                model.currentPage=model.pageCount;
            };
            vm.goToModel=function (index) {
                model.currentPage=index;
            }
            vm.$watch('currentPage',function () {
                this.showPage();
            });
        });
        model.$init=function() {
            //初始化
            element.innerHTML = innerHTML;
            model.getPages();
            avalon.scan(element, [model].concat(vmodels))
        };
        // model.nextTick(function(){})
        return model;//必须返回avalon
    }
    avalon.ui["pager"].defaults = {
        pageCount:1
        //里面定义的内容均可以在实例化后进行修改
    };
    return avalon ;  //必须返回avalon
})