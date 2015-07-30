function Todo(id) {
	// body...
	this.ref = document.getElementById(id);
	this.id = id;
	this.itemsWrap = this.ref.querySelector('.todo-items');
	this.activeNumWrap = this.ref.querySelector('.active-num');
	this.todoClear = this.ref.querySelector('.todo-clear');
	this.completeWrap = this.ref.querySelector('.complete-wrap');
	this.completeNumWrap = this.ref.querySelector('.complete-num');
	this.items = {};
	this.index = 0;

	this.init();
}
Todo.prototype.init = function() {
	// 初始化对象
	//console.log(this);
	var _todo = this;
	// 绑定添加item的事件
	var input = this.ref.querySelector('input');
	input.addEventListener('keydown', function(e) {
		//console.log(this);
		if (e.keyCode !== 13 || input.value.trim() === '') return;
		else {
			_todo.add(this.value);
			this.value = '';
		}
	}, false);
	// 切换所有item状态
	this.ref.querySelector('.todo-toggle').addEventListener('click', function(e) {
		// body...
		var items = _todo.items;
		if (this.className.indexOf('complete') === -1) {
			for (id in items) {
				if (!items[id].isActive) continue;
				else items[id].switchStatus();
			}
			this.className += ' complete';
		} else {
			for (id in items) {
				if (items[id].isActive) continue;
				else items[id].switchStatus();
			}
			this.className = this.className.replace(' complete', '');
		}
	}, false);
	// 切换视图事件
	var switchWrap = this.ref.querySelector('.todo-filters');
	var switches = switchWrap.querySelectorAll('.switch');

	switchWrap.addEventListener('click',function(e){
		var className = e.target.className;
		if(className.indexOf('switch') === -1) return;

		for(var i = 0 ;i<switches.length;i++){
			switches[i].className = switches[i].className.replace(' current','');
		}

		var view = 'all';
		if(className.indexOf('active') > -1){
			view = 'active';
		}else if(className.indexOf('complete') > -1){
			view = 'complete';
		}
		_todo.switchView(view);
		if(e.target.className.indexOf('current') === -1){
			e.target.className += ' current';
		}
	},false);
};

Todo.prototype.add = function(text) {
	// body...
	// 1.添加DOM元素
	// 2.items中添加item	
	var id = this.id + '-item' + this.index++;
	var newItem = new TodoItem(id, text, this);
	this.items[id] = newItem;
	this.refresh();
};
Todo.prototype.remove = function(item_dom) {
	// body...
	// 1.删除DOM元素
	// 2.items中删除item
	delete this.items[item_dom.id];
	this.itemsWrap.removeChild(item_dom);
	this.refresh();
};
Todo.prototype.switchView = function(view) {
	// body...
	if(view === 'all'){
		for(var id in this.items){
			this.items[id].show();
		}
	}
	else{
		var activeShow = (view === 'active' ? true : false);
		for(var id in this.items){
			if(this.items[id].isActive === activeShow){
				this.items[id].show();
			}
			else{
				this.items[id].hide();
			}
		}
	}

};
Todo.prototype.refresh = function() {
	// body...
	var items = this.items;

	var activeNum = 0,
		completeNum = 0;
	for (var key in items) {
		if (items[key].isActive) {
			activeNum++;
		} else {
			completeNum++;
		}
	}
	this.activeNumWrap.innerText = activeNum;
	this.completeNumWrap.innerText = completeNum;

	if (completeNum === 0) {
		this.todoClear.style.display = 'none';
	} else {
		this.todoClear.style.display = 'block';
	}
};

function TodoItem(id, text, todoIntance) {
	// body...
	this.ref = null;
	this.id = id;
	this.text = text;
	this.todoIntance = todoIntance;
	this.isActive = true;

	this.init();
}
TodoItem.prototype.init = function() {
	//新增DOM节点
	var ele = document.createElement('li');
	ele.className = 'todo-item';
	ele.id = this.id;
	ele.innerHTML += '<div class="status"></div>';
	ele.innerHTML += '<span class="item-text">' + this.text + '</span>';
	ele.innerHTML += '<div class="delete"></div>';
	this.ref = ele;


	//插入DOM节点，放在所有item最前面
	var wrap = this.todoIntance.itemsWrap;
	wrap.insertBefore(ele, wrap.firstChild);

	var _todo = this.todoIntance;
	var _todo_item = this;
	//绑定删除事件
	ele.querySelector('.delete').addEventListener('click', function(e) {
		_todo.remove(ele);
	}, false);
	//绑定状态切换事件
	ele.querySelector('.status').addEventListener('click', function(e) {
		_todo_item.switchStatus();
	}, false);

};

TodoItem.prototype.switchStatus = function() {
	// body...
	this.isActive = !this.isActive;
	if (this.isActive) {
		this.ref.className = this.ref.className.replace(' done', '');
	} else {
		this.ref.className += ' done';
	}
	this.todoIntance.refresh();
};
TodoItem.prototype.hide = function() {
	// body...
	if(this.ref.style.display !== 'none'){
		this.ref.style.display = 'none';
	}

}
TodoItem.prototype.show = function() {
	// body...
	if(this.ref.style.display === 'none'){
		this.ref.style.display = 'block';
	}
}