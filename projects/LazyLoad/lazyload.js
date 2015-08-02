

function showImg($el) {
	setTimeout(function(){
		$el.attr('src',$el.attr('data-src'));
	},2000);
}

function checkShow() {

}

var LazyLoad = {
	// LazyLoad组件使用接口
	one:function($selectors,callback){
		this._add($selectors,callback);
		this._init();
	},

	_queue: [],
	_isBind: false,

    // 将需要懒加载的元素及其回调函数放入队列
	_add:function($selectors,callback){
		var _lazyload = this;
		$selectors.each(function(){
			$cur = $(this);
			var o = {
				el:$cur,
				cb:callback
			};
			_lazyload._queue.push(o);
		});
	},
	// 初始化LazyLoad组件，
	_init:function(){
		if(!this._isBind){
			this._bind();
		}
		this._roll();
	},
	// 绑定window的scroll事件处理
	_bind:function(){
		var _lazyload = this,
			timer = null,
			interval = 40;
		// setTimeout作用：函数截流，debounce，只对最后一次的滚动事件进行处理
		$(window).on('scroll',function(){
			timer && clearTimeout(timer);
			timer = setTimeout(function(){
				_lazyload._roll();
			},interval);
			this._isBind = true;
		});
		this._roll();
	},
	// 遍历队列中的元素，如果元素出现，就执行其对应的回调函数
	_roll:function(){
		var _lazyload = this;
		var arrTemp = [];
		for(var i = 0;i<this._queue.length;i++){
			var item = this._queue[i];
			console.log(this.isShow(item.el));
			if(this.isShow(item.el)){
				item.cb(item.el);
			}
			else{
				arrTemp.push(item);
			}
		}
		this._queue = arrTemp;
	},
	//判断元素是否出现
	isShow:function($el) {
	var offsetH = $el.offset().top, //元素相对于文档的高度
		winH = $(window).height(),
		scrollH = $(document).scrollTop();
	return offsetH > winH + scrollH ? false : true;
}


};
var $img = $('.container img');
var $footer = $('.footer');
LazyLoad.one($img,showImg);
LazyLoad.one($footer,function(){
	setTimeout(function(){
		$footer.css('background-color','red');
	},2000);
})