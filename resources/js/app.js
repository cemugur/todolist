var base_url = window.location.origin;
var csrf= document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    
//sorting tasks 
    var el = document.getElementById('todolist');
    var csrf= document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    var sortable = new Sortable(el, {
        onEnd: function (evt) {
            $.ajax({
                url: base_url+'/todo',
                type: 'PUT',
                dataType: 'json',
                data: { "_token": csrf, "oldIndex": evt.oldIndex, "newIndex": evt.newIndex },
                success: function (id) {}
            });
        }
    });
//toggle dark and light theme
    $('#changeTheme').click(function(){
        $(this).toggleClass("moon sun");
        $('body').toggleClass("light dark");
        if ($(this).hasClass('sun')) {
            $(this).attr('src', base_url+'/imgs/icon-sun.svg');
        } else  {
            $(this).attr('src', base_url+'/imgs/icon-moon.svg');
        }
    });
    $('#confirmoverlay').click(function(){
        $("#confirmbox").hide();
        $("#confirmoverlay").hide();
    });
//creating new task
    $(document).on("keypress", "input", function(e){
        if(e.which == 13){
            var task = $(this).val();
            if(task.length<=3 || task.length>=255) {
                var message='A task should be <br> <b>minimum 5, maximum 255</b><br> characters';
                Alert.render(message,'alert');
            } else { 
                $.ajax({
                    url: base_url+'/todo',
                    type: 'POST',
                    dataType: 'json',
                    data: { "_token": csrf, "task": task },
                    success: function (result) {
                        let id=result.data.id;
                        $('input').val('');
                        var newTask='<li class="undone" taskID="'+id+'"><div class="dot"><div class="checked"></div></div><div class="txt">'+task+'</div><img src="'+base_url+'/imgs/icon-cross.svg" alt="cross" class="del" draggable="false"></li>';
                        $( "ul.list" ).prepend(newTask);
                        $('#counter').html($('.undone').length);
                        var message='<b>Task created successfuly :)</b>';
                        Alert.render(message,'alert');
                        setTimeout(function(){ $("#confirmbox").hide();$("#confirmoverlay").hide();}, 800);
                    }, 
                    error:function (result) {
                        var json = $.parseJSON(JSON.stringify(result));
                        Alert.render(json.responseJSON.errors.task[0],'alert');
                    }
                });
            }
        }
    });
// Todo list filters
//All, Active and Completed, 
    $('.link').click(function(){
        $('.link').removeClass( "active");
        $(this).addClass( "active");
        var filterID=$(this).attr( "filter");
        
        if(filterID=='done') {
            $("ul.list li").filter('.done').show();
            $("ul.list li").filter('.undone').hide();
        }
        else if(filterID=='undone'){
            $("ul.list li").filter('.undone').show();
            $("ul.list li").filter('.done').hide();
        }
        else {
            $("ul.list li").filter('.undone').show();
            $("ul.list li").filter('.done').show();
        }
    }); 

//Task marked and unmarked functions ////////////
// Showing alert before process
    $('body').on('click', '.dot, .del, .all', function(){
        var methodType="DELETE";
        if($(this).hasClass('all')){ //remove all completed tasks from the list
            $('#confirmbox').attr( "taskID",'all'); //task id saving for the next function
            $('#confirmbox').attr( "method","DELETE"); //determine what will do with the task
            var message=' <b>Are you sure to remove all completed tasks?</b>';
            Alert.render(message,'confirm','all');
        } else {
            var taskID = $(this).parent("li").attr("taskID");
            if($(this).hasClass('dot')) { //Checked or unchecked task
                var status = $(this).parent("li").attr("class");
                var task = $(this).next().text();
                var message='"'+task+'" <br><br> <b>Will be marked as done?</b>';
                if(status=="done"){
                    var message='"'+task+'" <br><br> <b>Will be marked as NOT done?</b>';
                }
                methodType="PATCH";
            } else if($(this).hasClass('del')) { //remove the task from the list
                var status = $(this).parent("li").attr("class");
                var task = $(this).prev().text();
                var message='"'+task+'" <br><br> <b>Do you want to DELETE?</b>';
            }
        }
        //task id and method saving for the next function
        $('#confirmbox').attr( "taskID",taskID).attr( "method",methodType); 
        Alert.render(message,'confirm');
    });
    $('.alert-no').click(function(){ 
        Alert.no()
    });
    $('.alert-ok').click(function(){ 
        Alert.ok()
    });

    function CustomAlert(){
        this.render = function(message=null,alertType='confirm'){
            $(".confirmboxbody").html(message); //message adding to alert box
            //Getting screen values and arranging alert box width and position 
            var winW = window.innerWidth; 
            var winH = window.innerHeight;
            var left= (winW>500) ? (winW/2)-200+"px" : left=(winW*0.05)+"px";
            $("#confirmbox").css({"display": "block","left":left,"top":"100px"});
            $("#confirmoverlay").css({"display": "block", "height": winH+"px"});
            //adding button according to alert type confirm or alert
            if(alertType=='confirm') {
                $(".confirm").show();
                $(".alert").hide();
            } else {
                $(".confirm").hide();
                $(".alert").show();
            }
        }
        this.ok = function(){
            $("#confirmbox").hide();
            $("#confirmoverlay").hide();
            var taskID=$('#confirmbox').attr( "taskID");
            var methodType=$('#confirmbox').attr( "method");
            var csrf= document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            $.ajax({
                url: base_url+'/todo/'+taskID,
                type: methodType,
                dataType: 'json',
                data: { "_token": csrf },
                success: function (data) {
                    if(methodType=='DELETE'){
                        if(taskID=='all'){
                            $('.done').remove();
                        } else {
                            $("li[taskID='"+taskID+"']" ).remove();
                        }
                    } else {
                        $("li[taskID='"+taskID+"']" ).toggleClass("undone done");
                    }
                    $('#counter').html($('.undone').length);

                    var filterID=$('.link.active').attr( "filter");
                    if(filterID=='done'){
                        $("ul.list li").filter('.done').show();
                        $("ul.list li").filter('.undone').hide();
                    } else if(filterID=='undone'){
                        $("ul.list li").filter('.done').hide();
                        $("ul.list li").filter('.undone').show();
                    } else {
                        $("ul.list li").filter('.done').show();
                        $("ul.list li").filter('.undone').show();
                    }
                    

                },
                error: function (result) {
                    var json = $.parseJSON(JSON.stringify(result));
                    Alert.render(json.responseJSON.errors,'alert');
                }
            });
            
        }
        this.no = function(){
            $("#confirmbox").hide();
            $("#confirmoverlay").hide();     
        }
    }
    var Alert = new CustomAlert();