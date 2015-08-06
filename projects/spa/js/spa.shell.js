// Shell module for SPA

// global var: $ ,spa

spa.shell = (function() {
	// -------------Begin Module Scope Variables
	var configMap = {
		anchor_schema_map: {
			chat: {
				open: true,
				closed: true
			}
		},
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
		$container: null,
		anchor_map: {}, //Store the current anchor values in a map
		is_chat_retracted: true
	},
	// 缓存jquery元素，
	jqueryMap = {},
	copyAnchorMap,setJqueryMap,changeAnchorPart,onHashchange,toggleChat,initModule;

	// Returns copy of stored anchor map

	copyAnchorMap = function(){
		return $.extend(true, {}, stateMap.anchor_map);	
	};

	changeAnchorPart = function(arg_map){
		var anchor_map_revise = copyAnchorMap(),
			bool_return = true,
			key_name,key_name_dependent;

        // Begin merge changes into anchor map
		KEYVAL:
		for(key_name in arg_map){
			if(arg_map.hasOwnProperty(key_name)) {
				// skip dependent keys during iteration
				if(key_name.indexOf('_') === 0) { continue KEYVAL;}
				// update independent key value
				anchor_map_revise[key_name] = arg_map[key_name];
				// update matching dependent key
				key_name_dependent = '_' + key_name;
				if(arg_map[key_name_dependent]) {
					anchor_map_revise[key_name_dependent] = arg_map[key_name_dependent];
				}
				else {
					delete anchor_map_revise[key_name_dependent];
					delete anchor_map_revise['_s'+key_name_dependent];
				}
			}
		}

		// Begin attempt to update URI; revert if not successful
		try {
			$.uriAnchor.setAnchor(anchor_map_revise);
		}
		catch (error) {
			// replace URI with existing state
			$.uriAnchor.setAnchor(stateMap.anchor_map,null,true);
			bool_return = false;
		}
		return bool_return;
	};

	onHashchange = function(event) {
		var 
			anchor_map_previous = copyAnchorMap(),
			anchor_map_proposed,
			_s_chat_previous,
			_s_chat_proposed,
			s_chat_proposed;

		// attempt to parse anchor
		try {
			anchor_map_proposed = $.uriAnchor.makeAnchorMap();
		}
		catch(error) {
			$.uriAnchor.setAnchor(anchor_map_previous,null,true);
			return false;
		}
		stateMap.anchor_map = anchor_map_proposed;

		_s_chat_previous = anchor_map_previous._s_chat;
		_s_chat_proposed = anchor_map_proposed._s_chat;

		// Begin adjust chat component if changed
		if(!anchor_map_previous || (_s_chat_previous !== _s_chat_proposed)) {
			s_chat_proposed = anchor_map_proposed.chat;
			switch(s_chat_proposed) {
				case 'open':
					toggleChat(true);
				break;
				case 'close':
					toggleChat(false);
				break;
				default:
					toggleChat(false);
					delete anchor_map_proposed.chat;
					$.uriAnchor.setAnchor(anchor_map_proposed);
			}
		}

		return false;
	}

	setJqueryMap = function(){
		var $container = stateMap.$container;

		jqueryMap = {
			$container: $container,
			$chat: $container.find('.spa-shell-chat')
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
			{
				height: configMap.chat_retract_height
			},
			configMap.chat_retract_time,
			function() {
				jqueryMap.$chat.attr('title', configMap.chat_retracted_title);
				stateMap.is_chat_retracted = true;
				if (callback) {
					callback(configMap.$chat);
				}
			});
		return true;
	};

	onClickChat = function(event) {
		//toggleChat(stateMap.is_chat_retracted);
		changeAnchorPart({
			chat: (stateMap.is_chat_retracted ? 'open':'closed')
		});
		return false;
	}

	initModule = function($container){
		// load HTML and map jQuery collections
		stateMap.$container = $container;
		$container.html(configMap.main_html);
		setJqueryMap();

		stateMap.is_chat_retracted = true;
		// click() 相当于on('click',onClickChat) 绑定click事件
		jqueryMap.$chat.attr('title',configMap.chat_retracted_title).click(onClickChat);
		$.uriAnchor.configModule({
			schema_map: configMap.anchor_schema_map
		});

		$(window).bind('hashchange',onHashchange).trigger('hashchange');
		
	};
	return {initModule:initModule};
}());