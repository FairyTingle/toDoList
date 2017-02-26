
var MyTodoList = (function() {
    /*初始化*/
    var codes = {               //设置三种便签的代号
            "1": "#short-term",
            "2": "#long-term",
            "3": "#temporary-term"
        };
/************************刷新后，读取local里的data数组********************************/
        var MyTodoList = function() {
        var _this = this;//利用MyTodoList声明一个新对象

        $('#datepicker').datepicker();//利用jquery ui的#datepicker获得日期

        _this.data = JSON.parse(localStorage.getItem('key')) || {};//将本地存储的数据转对象
//        重新载入后，遍历所有的属性，将每个属性的值存进便签
        for (var property in _this.data) {
            if (_this.data.hasOwnProperty(property)) {
                _this.generateElement({
                    id: property,
                    code: _this.data[property].code,
                    title: _this.data[property].title,
                    date: _this.data[property].date,
                    description: _this.data[property].description
                });
            }
        }

/*********设置点击添加内容，并将内容存入data对象中，以便存入localStorage*****/
        /*获得按钮同辈选定的input元素的内容*/
        $('#addItem').click(function() {
            var title = $(this).siblings('.addTitle').val(),
                description = $(this).siblings('.addDescriptions').val(),
                date = $(this).siblings('.addDate').val(),
                id = Date.now() + '';//整型变量转换为字符串
            _this.generateElement({ //传入内容对象，添加至内容
                id: id,
                code: "1",
                title: title,
                date: date,
                description: description
            });
            /********将内容存入local******/
            _this.data[id] = {
                code: "1",
                title: title,
                date: date,
                description: description
            };
            _this.persistData();
            /*清空按钮同辈input元素里的数据*/
            $(this).siblings('.addTitle').val('');
                $(this).siblings('.addDescriptions').val('');
                $(this).siblings('.addDate').val('');
        });

        /********更换计划所处标签位置************/
        $.each(codes, function(index, value) {
            $(value).droppable({
                drop: function(event, i) {
                    var element = i.helper,
                        id = element.attr('id'),
                        item = _this.data[id];
                    item.code = index;//这里是引用，改变其原来值
                    _this.removeElement({
                        id: id
                    });
                    _this.generateElement({
                        id: id,
                        code: item.code,
                        title: item.title,
                        date: item.date,
                        description: item.description
                    });
                    _this.persistData();
                }
            });
        });
/**************选择body里面的todo-task下的remove（点击x键）************************/
    $('body').on('click', '.todo-task .remove', function() {
        var id = $(this).parent().attr('id');/*提取stringObject.substring(start,stop)*/
        _this.removeElement({
            id: id
        });
        delete _this.data[id];
        _this.persistData();
    });
/****************清空按钮设置函数**************************************/
    $('.btndel').on('click',function() {
        $('.todo-task').remove('');
        _this.data={};
        _this.persistData();
    });
/******将对象转成JSON字符串，以便存入storage,直接转会显示object*******/
    MyTodoList.prototype.persistData = function() {
        localStorage.setItem('key', JSON.stringify(this.data));//转字符
    };
/*************给删除区域添加drop效果*******/
        $("#delete-div").droppable({
            drop: function(event, ui) {   //event表示事件对象，ui是一个对象，有很多属性总之如下。
                console.log(ui);console.log(event);
                var element = ui.draggable,//ui.helper ui.draggable - 指向用于被拖动的helper元素的jQuery对象
                    id = element.attr('id');
                _this.removeElement({
                    id: id
                });
                delete _this.data[id];//删除存入storage的data对象的此快
                _this.persistData();//更新
            }
        });

    };
/****************添加内容generateElement*******************************/
    MyTodoList.prototype.generateElement = function(params) {
        /*根据代号，获得需要添加内容的便签元素*/
        var parent = $(codes[params.code]),
            needAdded;

        needAdded = $("<div />", {
            "class":"todo-task",
            "id":params.id,
            "data": params.id
        });
        $("<div />", {
            "class":"remove",
            "text": 'X'
        }).appendTo(needAdded);

        $("<div />", {
            "class":"task-header",
            "text": params.title
        }).appendTo(needAdded);

        $("<div />", {
            "class":"task-date",
            "text": params.date
        }).appendTo(needAdded);

        $("<div />", {
            "class":"task-description",
            html: "<p>"+params.description+"</p>"
        }).appendTo(needAdded);

        needAdded.appendTo(parent);
        /*******在生成内容快的同时，添加块可拖动******/
        needAdded.draggable({
            opacity: 0.5,
            start: function () {
                $("#delete-div").show('fast');
            },//当拖动时，回收站快显示。
            stop: function () {
                $("#delete-div").hide('fast');

            }
        });
    };
    /*****************删除便签函数**************************/
    MyTodoList.prototype.removeElement = function(params) {
        $("#" +params.id).remove();
    };
    return MyTodoList;
})();
//自调用，而后return重置函数
