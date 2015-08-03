// Shell module for SPA

// global var: $ ,spa

spa.shell = (function() {
	// -------------Begin Module Scope Variables
	var configMap = {
		main_html: String() 
		+ '<div class="spa-shell-head">' 
		 + '<div class="spa-shell-head-logo"></div>' 
		 + '<div class="spa-shell-head-acct"></div>' 
		 + '<div class="spa-shell-head-search"></div>' 
		+ '</div>' 
		+ '<div class="spa-shell-main">' 
		 + '<div class="spa-shell-main-nav"></div>' 
		 + '<div class="spa-shell-main-content"></div>' 
		+ '</div>' 
		+ '<div class="spa-shell-foot"></div>' 
		+ '<div class="spa-shell-chat"></div>' 
		+ '<div class="spa-shell-modal"></div>',
		chat_extend_time : 250,
		chat_retract_time : 300,
		chat_extend_height:450,
		chat_retract_height:15,
		chat_extended_title : 'Click to retract',
		chat_retracted_title :  'Click to extend'
	},
	stateMap = {
		$container:null,
		is_chat_retracted : true
	},
	// 缓存jquery元素，
	jqueryMap = {},
	setJqueryMap,toggleChat,initModule;

	setJqueryMap = function(){
		var $container = stateMap.$container;
		jqueryMap = {
			$container:$container,
			$chat : $container.find('.spa-shell-chat')
		};
	};
	// Purpose: Extends or Retracts chat slider
	// Arguments: 
	//		* do_extend - if true, extend slider; if false retracts
	//      * callback  - optional function to execute at end of animation
	// State : sets stateMap.is_chat_retracted
	//			* true - slider is retracted
	//          * false - slider is extended
	// Returns : 
	// 		* true - slider animation activated
	// 		* false - slider animation not activated
	toggleChat = function(do_extend,callback){
		var px_chat_ht = jqueryMap.$chat.height(),
			is_open = px_chat_ht === configMap.chat_extend_height,
			is_closed = px_chat_ht === configMap.chat_retract_height,
			is_sliding = !is_open && !is_closed;

		// 避免extend和retract冲突
		if(is_sliding){
			return false;
		}
		if(do_extend){
			jqueryMap.$chat.animate(
				{height : configMap.chat_extend_height},
				configMap.chat_extend_time,
				function(){
					jqueryMap.$chat.attr('title',configMap.chat_extended_title);
					stateMap.is_chat_retracted = false;
					if(callback){callback(configMap.$chat);
				}
			});
			return true;
		}
		jqueryMap.$chat.animate(
				{height : configMap.chat_retract_height},
				configMap.chat_retract_time,
				function(){
					jqueryMap.$chat.attr('title',configMap.chat_retracted_title);
					stateMap.is_chat_retracted = true;
					if(callback){callback(configMap.$chat);
				}
			});
		return true;
	};

	onClickChat = function(event) {
		toggleChat(stateMap.is_chat_retracted);
		return false;
	}

	initModule = function($container){
		// load HTML and map jQuery collections
		stateMap.$container = $container;
		$container.html(configMap.main_html);
		setJqueryMap();

		stateMap.is_chat_retracted = true;
		// click() 相当于on('click',onClickChat)
		jqueryMap.$chat.attr('title',configMap.chat_retracted_title).click(onClickChat);

		
	};
	return {initModule:initModule};
}());