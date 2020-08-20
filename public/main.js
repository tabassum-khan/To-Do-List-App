const list = document.querySelector('.list');
var inputValue = document.querySelector('.input');
const add = document.querySelector('.add');

if(window.localStorage.getItem("todos") == undefined){
     var todos = [];
     window.localStorage.setItem("todos", JSON.stringify(todos));
}

var todosEX = window.localStorage.getItem("todos");
var todos = JSON.parse(todosEX);


class item{
	constructor(name){
		this.createItem(name);
	}
    createItem(name){
    	var itemBox = document.createElement('div');
        itemBox.classList.add('item');

    	var input = document.createElement('input');
    	input.type = "text";
    	input.disabled = true;
    	input.value = name;
    	input.classList.add('item_input');

    	var edit = document.createElement('i');
    	$(edit).addClass('fa fa-pencil-alt edit');
    	edit.addEventListener('click', () => this.edit(input, name));

    	var remove = document.createElement('i');
        $(remove).addClass("fa fa-trash remove");
    	remove.addEventListener('click', () => this.remove(itemBox, name));

    	list.appendChild(itemBox);

        itemBox.appendChild(input);
        itemBox.appendChild(edit);
        itemBox.appendChild(remove);

    }

    edit(input, name){
        if(input.disabled == true){
            console.log(input.disabled);
            input.disabled = !input.disabled;
            
            let edit_icon = $(input).next();
            $(edit_icon).removeClass("fa-pencil-alt");
            $(edit_icon).addClass("fa-check");

            let parent_item = $(input).parent();
            parent_item.addClass("edit_mode");
            $(input).addClass("edit_mode");
        }
    	else{
            input.disabled = !input.disabled;
            
            let edit_icon = $(input).next();
            $(edit_icon).removeClass("fa-check");
            $(edit_icon).addClass("fa-pencil-alt");
            
            let parent_item = $(input).parent();
            parent_item.removeClass("edit_mode");
            $(input).removeClass("edit_mode");

            let indexof = todos.indexOf(name);
            todos[indexof] = input.value;
            window.localStorage.setItem("todos", JSON.stringify(todos));
        }
    }

    remove(itemBox, name){
        itemBox.parentNode.removeChild(itemBox);
        let index = todos.indexOf(name);
        todos.splice(index, 1);
        window.localStorage.setItem("todos", JSON.stringify(todos));
    }
}

add.addEventListener('click', check);

window.addEventListener('keydown', (e) => {
	if(e.which == 13){
		check();
	}
})

function check(){
	if(inputValue.value != ""){
		new item(inputValue.value);
        todos.push(inputValue.value);
        window.localStorage.setItem("todos", JSON.stringify(todos));
		inputValue.value = "";
	}
}


for (var v = 0 ; v < todos.length ; v++){
    new item(todos[v]);
}


// new item("sport");