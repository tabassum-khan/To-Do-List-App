
let storage = window.localStorage;
var active = [];
var completed = [];

$(document).ready(function(){

    ajaxGET("active");

    //prevent default action of the form
    $("#todoForm").submit(function(e){
        e.preventDefault();
        ajaxAdd();

        $(".input").val("");
    });

    var li = $(".panel li");

    li.each(function(i){
        if (i != 0){
            $(this).on("click", function(e){
                $(".active").removeClass("active");
                $(this).addClass("active");
    
                var id = $(this).attr("id");
                $(".list").empty();
    
                ajaxGET(id);
            });
        }
    });

});

function ajaxGET(id){  
    console.log("Id of panel element: " + id);

    $.ajax({
        type: "GET",
        url: "/api/get/todos",

        success: function(data){
            displayData(id, data);
        }
    });
}

function displayData(id, data){
    active = data.active;
    completed = data.completed;

    console.log("Active: " + active);
    console.log("Completed: " + completed);

    storage.setItem("active", JSON.stringify(active));
    storage.setItem("completed", JSON.stringify(completed));    


    if (id === "active"){
        for (var i=0; i<active.length; i++)
            new item(active[i], "active");
    }
    else if (id === "completed"){
        for (var i=0; i<completed.length; i++)
            new item(completed[i], "completed");

        changeCompletedItems();
    }
    else if (id === "all"){
        for (var i=0; i<active.length; i++)
            new item(active[i], "active");

        for (var i=0; i<completed.length; i++)
            new item(completed[i], "completed");

        changeCompletedItems();
    }

    changeActiveItem(active.length);
}

function changeCompletedItems(){

}


function ajaxAdd(){

    var todo = {item: $(".input").val()};
    console.log("Adding item " + todo.item + "...");

    $.ajax({
        type: "POST", 
        url: "/api/add",
        data: todo,

        success: function(data){
            active = data.active;
            storage.setItem("active", JSON.stringify(active));

            new item(active[active.length-1], "active");

            changeActiveItem(active.length);
        }
    });
}


class item{
    constructor(input_val, className){
        this.createItem(input_val, className);
        const prev_val = "";
        const new_val = "";
    }

    createItem(input_val, className){
        let list = $(".list");

        //Adding item div
        let item = $("<div></div>");
        item.addClass("item");
        item.addClass(className);
        list.append(item);
        

        let item_input = $("<input></input>");
        item_input.attr("type", "text");
        item_input.val(input_val);
        item_input.prop("disabled", true);  
        item_input.addClass("item_input");
        item.append(item_input);

        if (className != "completed"){
            let edit = $("<i></i>");
            edit.addClass("fa fa-pencil-alt edit");
            item.append(edit);

            //add eventlisteners to edit element
            edit.on("click", (e) => this.editItem(e.target) );

            let remove = $("<i></i>");
            remove.addClass("fa fa-trash remove");
            item.append(remove);

            //add eventlisteners to remove element
            remove.on("click", (e) => this.removeItem(e.target) );
        }
    }

    editItem(target){
        console.log("Editing Element..");

        //get input and parent element
        const item_input = $(target.previousSibling);
        const item = $(target.parentElement);

        if (item_input.prop("disabled") == true)    {
            this.prev_val = item_input.val();

            //enabling item_input
            item_input.prop("disabled", false);
            
            //add edit_mode to item_input and item
            item_input.addClass("edit_mode");
            item.addClass("edit_mode");
    
            //replace pencil with check
            $(target).removeClass("fa-pencil-alt");
            $(target).addClass("fa-check");
        }
        else{
            this.new_val = item_input.val();

            //disabled item_input
            item_input.prop("disabled", true);
            
            //remove edit_mode from item_input and item
            item_input.removeClass("edit_mode");
            item.removeClass("edit_mode");
    
            //replace pencil with check
            $(target).removeClass("fa-check");
            $(target).addClass("fa-pencil-alt");

            ajaxEdit(this.prev_val, this.new_val);
        }
    }


    removeItem(target){
        console.log("Removing Element..");

        //get parent element
        const item = $(target).parent();
        
        //save the value of input
        const item_val = item[0].firstElementChild.value;
        console.log(item_val);

        //remove parent element
        item.remove();
        
        ajaxRemove(item_val);
    }   

}//end item class


function ajaxEdit(prev_val, new_val){
    console.log("Editing Item " + prev_val +" to " +new_val +"...");

    $.ajax({
        type: "POST",
        url: "/api/edit",
        data: {
            prev_val: prev_val,
            new_val: new_val
        },

        success: function(data){
            active= data.active;
            storage.setItem("active", JSON.stringify(active));
        }
    });
}

function ajaxRemove(item_val){
    console.log("Removing item "+ item_val+"..");

    $.ajax({
        type: "DELETE",
        url: "/api/remove",
        data: {item_val : item_val},

        success: function(data){
            active = data.active;
            storage.setItem("active", JSON.stringify(active));

            completed = data.completed;
            storage.setItem("completed", JSON.stringify(completed));

            changeActiveItem(active.length);            
        }
    });
}


function changeActiveItem(length){
    $("#active_item").text(length + " items pending");

    if (length > 0){
        $("#active_item").addClass("pending");
    }
    else{
        $("#active_item").removeClass("pending");
    }
}