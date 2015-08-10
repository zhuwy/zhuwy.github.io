// Shell module for SPA

// global var: $ ,spa

spa.shell = (function() {
	// -------------Begin Module Scope Variables
	var configMap = {
		anchor_schema_map: {
			chat: {
				opened: true,
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
		+ '<div class="spa-shell-modal"></div>',		
	},
	stateMap = {	
		anchor_map: {}, //Store the current anchor values in a map
	},
	// 缓存jquery元素，
	jqueryMap = {},
	copyAnchorMap,setJqueryMap,changeAnchorPart,onHashchange,setChatAnchor,initModule;

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
			_s_chat_previous, _s_chat_proposed, s_chat_proposed,
			anchor_map_proposed,
			is_ok = true,
			anchor_map_previous = copyAnchorMap();

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
				case 'opened':
					is_ok = spa.chat.setSliderPosition( 'opened' );
				break;
				case 'closed':
					is_ok = spa.chat.setSliderPosition( 'closed' );
				break;
				default:
					spa.chat.setSliderPosition( 'closed' );
					delete anchor_map_proposed.chat;
					$.uriAnchor.setAnchor(anchor_map_proposed);
			}
		}

		if (!is_ok) {
			if (anchor_map_previous) {
				$.uriAnchor.setAnchor(anchor_map_previous, null, true);
				stateMap.anchor_map = anchor_map_previous;
			} else {
				delete anchor_map_proposed.chat;
				$.uriAnchor.setAnchor(anchor_map_proposed, null, true);
			}
		}

		return false;
	}

	setJqueryMap = function(){
		var $container = stateMap.$container;

		jqueryMap = {
			$container: $container
		};
	};
	
	setChatAnchor = function ( position_type ){
 		return changeAnchorPart({ chat : position_type });
};
	

	$.uriAnchor.configModule({
		schema_map : configMap.anchor_schema_map
	});


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


		//configure uriAnchor to use our schema
		$.uriAnchor.configModule({
			schema_map: configMap.anchor_schema_map
		});

		//configure and initialize feature module
		spa.chat.configModule({
			set_chat_anchor: setChatAnchor,
			chat_model: spa.model.chat,
			people_model: spa.model.people
		});
		spa.chat.initModule(jqueryMap.$container);


		$(window).bind('hashchange',onHashchange).trigger('hashchange');
		
	};
	return {initModule:initModule};
}());