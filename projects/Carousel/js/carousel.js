function Carousel($carousel){
	this.$carousel = $carousel;
	this.init();
} 
Carousel.prototype = {
	init: function() {
		this.attachEl();
		this.bind();
		this.autoPlay();
	},
	// 保存DOM节点
	attachEl: function() {
		var $c = this.$c = this.$carousel;
		this.$nav = $c.find('.nav');
		this.$prev = $c.find('.prev');
		this.$next = $c.find('.next');
		this.$circles = $c.find('.circle');
		this.$imgUl = $c.find('.content ul');

		this.imgWidth = this.$imgUl.find('li').outerWidth(true);
		this.idx = 0;
	},
	// 绑定事件
	bind: function() {
		// 获取当前对象，供事件回调函数中使用
		var _carousel = this;
		// 点击prev按钮
		this.$prev.on('click', function(e) {
			/* Act on the event */
			_carousel.goPrev(1);
		});
		// 点击next按钮
		this.$next.on('click', function(e) {
			/* Act on the event */
			_carousel.goNext(1);
		});
		// 点击nav中的circle
		this.$circles.on('click', function(event) {
			/* Act on the event */
			// 1. 获取当前图片的idx
			// 2. 获取目标图片的idx
			// 切换图片
			var curIdx = _carousel.$nav.find('.active').parent().index(),
				desIdx = $(this).parent().index();
			if (curIdx > desIdx) {
				_carousel.goPrev(curIdx - desIdx);
			}
			if (curIdx < desIdx) {
				_carousel.goNext(desIdx - curIdx);
			}
		});

	},
	autoPlay: function() {},
	goPrev: function(i) {
		//console.log('goPrev');
		// i== 1：把最后一张图片放到最前面，然后整体右移i个图片宽度
		i = i || 1;
		this.$imgUl.css('left', -(i * this.imgWidth));
		for (var k = 0; k < i; k++) {
			this.$imgUl.find('li').first().before(this.$imgUl.find('li').last());
		}
		this.$imgUl.animate({
				'left': 0,
			},
			400,
			function() {
				/* stuff to do after animation is complete */
			});
		this.setIndex(this.$imgUl.find('li').first().attr('data-idx'));
	},
	goNext: function(i) {
		//console.log('goNext');
		// i== 1 ：图片ul整体左移一个图片宽度，再把ul中第一个li元素放到最后
		i = i || 1;
		var _carousel = this;
		this.$imgUl.animate({
				'left': 0 - this.imgWidth * i
			},
			400,
			function() {
				/* stuff to do after animation is complete */
				//console.log(this);
				for (var k = 0; k < i; k++) {
					$(this).find('li').last().after($(this).find('li').first());
				}

				$(this).css({
					'left': 0
				});
				// setIndex调用为什么要写在animation的回调函数中？
				// 因为回调函数会在goNext执行完之后再执行（js是单线程，函数进入队列排队执行）
				// 所以如果写在goNext中，那么li元素就还没有调换位置，那么取到的idx就不对了
				_carousel.setIndex($(this).find('li').first().attr('data-idx'));
			}
		);
		
		
	},
	// 设置this.idx为当前图片的idx
	setIndex:function(idx) {
		this.idx = idx;
		//
		this.setNavStyle(idx);

	},
	getIndex:function() {
		return this.idx;
	},
	setNavStyle:function(idx) {
		// 清除当前active circle的active class
		// 添加idx circle的active class
		this.$circles.removeClass('active').eq(idx).addClass('active');
	}
}
$('.mod-carousel').each(function() {
	var obj = new Carousel($(this));
});