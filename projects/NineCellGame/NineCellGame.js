var NineCellGame = (function(){
	var row_num = 3,col_num = 3,
        current_step = 0,total_step = 20,
		cell_width = 30,cell_height = 30,
		center_cell_width = 100,center_cell_height = 100,
        shiftTime = 1000,
        isMoving = false,colorSet,
		getRandomColor, checkGameFinished,refreshAllColor,
        horizontalShift, verticalShift, bindEvent,initModule;


    colorSet = ["rgb(226,59,65)","rgb(224,203,97)","rgb(72,163,210)","rgb(91,178,122)"];

    refreshGame = function(){
        current_step = 0;
        $('.step-board').text(current_step+"/"+total_step);
        $('.cell').each(function(){
            $(this).css({
                "background-color":getRandomColor(0,3)
            });
        });
    };

    getRandomColor = function (min, max) {
        return colorSet[Math.floor(Math.random() * (max - min + 1)) + min];
    };

    checkGameFinished = function(){
        var flag = true;
        var $center_cell = $('.center-cell');
        var color = $('.center-cell.row-1.col-1').css("background-color");
        $center_cell.each(function(index){
            // console.log("color:"+color);
            // console.log($(this).css("background-color"));
            if($(this).css("background-color") !== color) { flag = false; }
        });
        if(current_step <= total_step){
            if(flag) {
                alert("congratulation! you win");
                refreshGame();
                return;
            }
            else{
                if(current_step == total_step){
                    alert("Sorry! you lose");
                    refreshGame();
                }
            }
        }

    };

    horizontalShift = function(rowClass,direction){
        $('.step-board').text(++current_step+'/'+total_step);
        var colClass = direction == 'left' ? '.col-0' : '.col-2';

        var $oldLeftCell = $('.left-cell.'+rowClass+colClass),
            $oldCenterCell = $('.center-cell.'+rowClass+colClass),
            $oldRightCell = $('.right-cell.'+rowClass+colClass);
                //var color = $(leftCellClassName).css("background-color");

        var $newLeftCell = $oldLeftCell.clone(),
            $newCenterCell = $oldCenterCell.clone(),
            $newRightCell = $oldRightCell.clone();

        $newLeftCell.css({
            "background-color": direction == 'left' ? $oldCenterCell.css("background-color") : $oldRightCell.css("background-color"),
            "left": direction == 'left' ? col_num*cell_width : -1*cell_width
        });
        $newCenterCell.css({
            "background-color": direction == 'left' ? $oldRightCell.css("background-color") : $oldLeftCell.css("background-color"),
            "left": direction == 'left' ? col_num*center_cell_width : -1*center_cell_width
        });
        $newRightCell.css({
            "background-color": direction == 'left' ? $oldLeftCell.css("background-color") : $oldCenterCell.css("background-color"),
            "left": direction == 'left' ? col_num*cell_width : -1*cell_width
        });
        $('.left-container').append($newLeftCell);
        $('.center-container').append($newCenterCell);
        $('.right-container').append($newRightCell);

        $('.left-container .'+rowClass).animate(
            {
                left: direction == 'left' ? "-="+cell_width : "+="+cell_width
            },shiftTime,function(){
                $oldLeftCell.remove();
                isMoving = false;
        });
        $('.center-container .' + rowClass).animate({
            left: direction == 'left' ? "-="+center_cell_width : "+="+center_cell_width
        }, shiftTime, function() {
            $oldCenterCell.remove();
        });
        $('.right-container .' + rowClass).animate({
            left: direction == 'left' ? "-="+cell_width : "+="+cell_width
        }, shiftTime, function() {
            $oldRightCell.remove();
            // if (isGameFinished()) {
            //     console.log("Success");
            // } else {
            //     console.log("Not Success");
            // }
            checkGameFinished();
        });

        if(direction == "left"){
            $('.left-cell.'+rowClass+'.col-1').removeClass('col-1').addClass('col-0');
            $('.left-cell.'+rowClass+'.col-2').removeClass('col-2').addClass('col-1');
            $newLeftCell.removeClass('col-0').addClass('col-2');

            

            $('.center-cell.'+rowClass+'.col-1').removeClass('col-1').addClass('col-0');
            $('.center-cell.'+rowClass+'.col-2').removeClass('col-2').addClass('col-1');
            $newCenterCell.removeClass('col-0').addClass('col-2');


            $('.right-cell.'+rowClass+'.col-1').removeClass('col-1').addClass('col-0');
            $('.right-cell.'+rowClass+'.col-2').removeClass('col-2').addClass('col-1');
            $newRightCell.removeClass('col-0').addClass('col-2');
        }
        else {
            $('.left-cell.'+rowClass+'.col-1').removeClass('col-1').addClass('col-2');
            $('.left-cell.'+rowClass+'.col-0').removeClass('col-0').addClass('col-1');
            $newLeftCell.removeClass('col-2').addClass('col-0');

            

            $('.center-cell.'+rowClass+'.col-1').removeClass('col-1').addClass('col-2');
            $('.center-cell.'+rowClass+'.col-0').removeClass('col-0').addClass('col-1');
            $newCenterCell.removeClass('col-2').addClass('col-0');


            $('.right-cell.'+rowClass+'.col-1').removeClass('col-1').addClass('col-2');
            $('.right-cell.'+rowClass+'.col-0').removeClass('col-0').addClass('col-1');
            $newRightCell.removeClass('col-2').addClass('col-0');    
        }
        
    };
    verticalShift = function(colClass,direction){
        $('.step-board').text(++current_step+"/"+total_step);
        var rowClass = direction == 'up' ? '.row-0' : '.row-2';

        var $oldTopCell = $('.top-cell'+rowClass+"."+colClass),
            $oldCenterCell = $('.center-cell'+rowClass+"."+colClass),
            $oldBottomCell = $('.bottom-cell'+rowClass+"."+colClass);
                //var color = $(leftCellClassName).css("background-color");

        var $newTopCell = $oldTopCell.clone(),
            $newCenterCell = $oldCenterCell.clone(),
            $newBottomCell = $oldBottomCell.clone();

        $newTopCell.css({
            "background-color": direction == 'up' ? $oldCenterCell.css("background-color") : $oldBottomCell.css("background-color"),
            "top": direction == 'up' ? 3*cell_height : -1*cell_height
        });
        $newCenterCell.css({
            "background-color": direction == 'up' ? $oldBottomCell.css("background-color") : $oldTopCell.css("background-color"),
            "top": direction == 'up' ? 3*center_cell_height : -1*center_cell_height
        });
        $newBottomCell.css({
            "background-color": direction == 'up' ? $oldTopCell.css("background-color") : $oldCenterCell.css("background-color"),
            "top": direction == 'up' ? 3*cell_height : -1*cell_height
        });
        $('.top-container').append($newTopCell);
        $('.center-container').append($newCenterCell);
        $('.bottom-container').append($newBottomCell);

        $('.top-container .'+colClass).animate({
            top: direction == 'up' ? "-="+cell_height : "+="+cell_height
        },shiftTime,function(){
            $oldTopCell.remove();
            isMoving = false;
        });
        $('.center-container .'+colClass).animate({
            top: direction == 'up' ? "-="+center_cell_height : "+="+center_cell_height
        },shiftTime,function(){
            $oldCenterCell.remove();
        });
        $('.bottom-container .'+colClass).animate({
            top: direction == 'up' ? "-="+cell_height : "+="+cell_height
        },shiftTime,function(){
            $oldBottomCell.remove();
            // if(isGameFinished()){console.log("Success");}
            // else{console.log("Not Success");}
            checkGameFinished();
            
        });

        if(direction == "up"){
            $('.top-cell.'+colClass+'.row-1').removeClass('row-1').addClass('row-0');
            $('.top-cell.'+colClass+'.row-2').removeClass('row-2').addClass('row-1');
            $newTopCell.removeClass('row-0').addClass('row-2');

            

            $('.center-cell.'+colClass+'.row-1').removeClass('row-1').addClass('row-0');
            $('.center-cell.'+colClass+'.row-2').removeClass('row-2').addClass('row-1');
            $newCenterCell.removeClass('row-0').addClass('row-2');


            $('.bottom-cell.'+colClass+'.row-1').removeClass('row-1').addClass('row-0');
            $('.bottom-cell.'+colClass+'.row-2').removeClass('row-2').addClass('row-1');
            $newBottomCell.removeClass('row-0').addClass('row-2');
        }
        else {
            $('.top-cell.'+colClass+'.row-1').removeClass('row-1').addClass('row-2');
            $('.top-cell.'+colClass+'.row-0').removeClass('row-0').addClass('row-1');
            $newTopCell.removeClass('row-2').addClass('row-0');

            

            $('.center-cell.'+colClass+'.row-1').removeClass('row-1').addClass('row-2');
            $('.center-cell.'+colClass+'.row-0').removeClass('row-0').addClass('row-1');
            $newCenterCell.removeClass('row-2').addClass('row-0');


            $('.bottom-cell.'+colClass+'.row-1').removeClass('row-1').addClass('row-2');
            $('.bottom-cell.'+colClass+'.row-0').removeClass('row-0').addClass('row-1');
            $newBottomCell.removeClass('row-2').addClass('row-0');    
        }
        
    };
	bindEvent = function(){
        $('.refresh').on('click',function(){
            refreshGame();
        });
        $('.arrow-up').on('click',function(){
            if(!isMoving){
                isMoving = true;
                var colClass = $(this).attr('class').match(/col\-\d/)[0];
                verticalShift(colClass,"up");
            }
        });
        $('.arrow-down').on('click',function(){
            if(!isMoving){
                isMoving = true;
                var colClass = $(this).attr('class').match(/col\-\d/)[0];
                verticalShift(colClass,"down");
            }
        });
        $('.arrow-left').on('click',function(){
            if(!isMoving){
                isMoving = true;
                var rowClass = $(this).attr('class').match(/row\-\d/)[0];
                horizontalShift(rowClass,"left");
            }
        });
		$('.arrow-right').on('click',function(){
			if(!isMoving){
				isMoving = true;
                var rowClass = $(this).attr('class').match(/row\-\d/)[0];

                horizontalShift(rowClass,"right");
                // var $oldLeftCell = $('.left-cell.'+rowClass+'.col-2'),
                //     $oldCenterCell = $('.center-cell.'+rowClass+'.col-2'),
                //     $oldRightCell = $('.right-cell.'+rowClass+'.col-2');
                // //var color = $(leftCellClassName).css("background-color");

                // var $newLeftCell = $oldLeftCell.clone(),
                //     $newCenterCell = $oldCenterCell.clone(),
                //     $newRightCell = $oldRightCell.clone();

                // $newLeftCell.css({
                //     "background-color":$oldRightCell.css("background-color"),
                //     "left":-80
                // });
                // $newCenterCell.css({
                //     "background-color":$oldLeftCell.css("background-color"),
                //     "left":-100
                // });
                // $newRightCell.css({
                //     "background-color":$oldCenterCell.css("background-color"),
                //     "left":-80
                // });
                // $('.left-container').append($newLeftCell);
                // $('.center-container').append($newCenterCell);
                // $('.right-container').append($newRightCell);
                // console.log($('.left-container .'+rowClass+',.center-container .'+rowClass+',.right-container .'+rowClass));
                
                // // var center_shift = "+=100";
                // // var side_shift = "+=80";
                // // $('.left-container .'+rowClass+',.center-container .'+rowClass+',.right-container .'+rowClass).animate({
                // //     left: $(this).hasClass('center-cell') ? center_shift : side_shift
                // // },1500,function(){
                // //     console.log($(this).width());
                // //     $oldLeftCell.remove();
                // //     $oldCenterCell.remove();
                // //     $oldRightCell.remove();


                // // });
                // ////right shift
                // $('.left-container .'+rowClass).animate({
                //     left: "+=80"
                // },1500,function(){
                //     $oldLeftCell.remove();
                //     isMoving = false;
                // });
                // $('.center-container .'+rowClass).animate({
                //     left: "+=100"
                // },1500,function(){
                //     $oldCenterCell.remove();
                // });
                // $('.right-container .'+rowClass).animate({
                //     left: "+=80"
                // },1500,function(){
                //     $oldRightCell.remove();
                // });

                
                // $('.left-cell.'+rowClass+'.col-1').removeClass('col-1').addClass('col-2');
                // $('.left-cell.'+rowClass+'.col-0').removeClass('col-0').addClass('col-1');
                // $newLeftCell.removeClass('col-2').addClass('col-0');

                
                // var $oldcol1 = $('.center-cell.'+rowClass+'.col-1');
                // var $oldcol0 = $('.center-cell.'+rowClass+'.col-0');
                // $oldcol1.removeClass('col-1').addClass('col-2');
                // $oldcol0.removeClass('col-0').addClass('col-1');
                // $newCenterCell.removeClass('col-2').addClass('col-0');


                // $('.right-cell.'+rowClass+'.col-1').removeClass('col-1').addClass('col-2');
                // $('.right-cell.'+rowClass+'.col-0').removeClass('col-0').addClass('col-1');
                // $newRightCell.removeClass('col-2').addClass('col-0');


    		}
			//console.log($(this).attr('class'));
			
		});
	};
    initModule = function(){
    	// store dom object
    	var $main = $('.main'),
    		$center_container = $('.center-container'),
    		$top_container = $('.top-container'),
    		$right_container = $('.right-container'),
    		$bottom_container = $('.bottom-container'),
    		$left_container = $('.left-container'),
    		$top_arrow_container = $('.top-arrow-container'),
    		$right_arrow_container = $('.right-arrow-container'),
    		$bottom_arrow_container = $('.bottom-arrow-container'),
    		$left_arrow_container = $('.left-arrow-container');

        //initial step board
        $('.step-board').text(current_step+"/"+total_step);
    	//create center cell
    	for(var i = 0;i<col_num;i++){
    		for(var j = 0;j<row_num;j++){
    			var $new_cell = $('<div></div>');
    			var className = "cell center-cell row-"+i+" col-"+j;
    			$new_cell.addClass(className);
    			$new_cell.css({
    				"width":center_cell_width,
    				"height":center_cell_height,
    				"background-color":getRandomColor(0,3),
    				"border":"solid 1px #DDD",
    				"position":"absolute",
    				"top": i*center_cell_width,
    				"left": j*center_cell_width
    			});
    			$center_container.append($new_cell);
    		}
    	}
    	//create top cell
    	for(var i = 0;i<col_num;i++){
    		for(var j = 0;j<row_num;j++){
    			$new_cell = $('<div></div>');
    			className = "cell top-cell row-"+i+" col-"+j;
    			$new_cell.addClass(className);
    			$new_cell.css({
    				"width":cell_width,
    				"height":cell_height,
    				"background-color":getRandomColor(0,3),
    				"border":"solid 1px #DDD",
    				"position":"absolute",
    				"top": i*cell_width,
    				"left": j*center_cell_width+(center_cell_width-cell_width)/2
    			});
    			$top_container.append($new_cell);
    		}
    	}
    	//create right cell
    	for(var i = 0;i<col_num;i++){
    		for(var j = 0;j<row_num;j++){
    			$new_cell = $('<div></div>');
    			className = "cell right-cell row-"+i+" col-"+j;

    			$new_cell.addClass(className);
    			$new_cell.css({
    				"width":cell_width,
    				"height":cell_height,
    				"background-color":getRandomColor(0,3),
    				"border":"solid 1px #DDD",
    				"position":"absolute",
    				"top": i*center_cell_width+(center_cell_width-cell_width)/2,
    				"left": j*cell_width
    				// "right": 0

    			});
    			$right_container.append($new_cell);
    		}
    	}
    	//create bottom cell
    	for(var i = 0;i<col_num;i++){
    		for(var j = 0;j<row_num;j++){
    			$new_cell = $('<div></div>');
    			className = "cell bottom-cell row-"+i+" col-"+j;

    			$new_cell.addClass(className);
    			$new_cell.css({
    				"width":cell_width,
    				"height":cell_height,
    				"background-color":getRandomColor(0,3),
    				"border":"solid 1px #DDD",
    				"position":"absolute",
    				"top": i*cell_width,
    				"left": j*center_cell_width+(center_cell_width-cell_width)/2
    			});
    			$bottom_container.append($new_cell);
    		}
    	}	
    	//create left cell
    	for(var i = 0;i<col_num;i++){
    		for(var j = 0;j<row_num;j++){
    			$new_cell = $('<div></div>');
    			className = "cell left-cell row-"+i+" col-"+j;

    			$new_cell.addClass(className);
    			$new_cell.css({
    				"width":cell_width,
    				"height":cell_height,
    				"background-color":getRandomColor(0,3),
    				"border":"solid 1px #DDD",
    				"position":"absolute",
    				"top": i*center_cell_width+(center_cell_width-cell_width)/2,
    				"left": j*cell_width
    				// "right": 0

    			});
    			$left_container.append($new_cell);
    		}
    	}

    	//create arrow in bottom-arrow container
        for(var i = 0;i<col_num;i++){
            var $down_arrow = $('<div></div>'),$up_arrow = $('<div></div>');
            var downArrowClassName = "arrow arrow-down col-"+i,upArrowClassName="arrow arrow-up col-"+i;

            $down_arrow.addClass(downArrowClassName);
            $up_arrow.addClass(upArrowClassName);

            $down_arrow.css({
                "top":0,
                "left":(i+1)*center_cell_height-10-32
            });
            $up_arrow.css({
                "top":0,
                "left":10+i*center_cell_height
            });
            $bottom_arrow_container.append($up_arrow);
            $bottom_arrow_container.append($down_arrow);

        }
    	//create right-arrow container
    	for(var i = 0;i<col_num;i++){
    		var $right_arrow = $('<div></div>'),$left_arrow = $('<div></div>');
    		var rightArrowClassName = "arrow arrow-right row-"+i,leftArrowClassName="arrow arrow-left row-"+i;

    		$right_arrow.addClass(rightArrowClassName);
    		$left_arrow.addClass(leftArrowClassName);

    		$right_arrow.css({
    			"left":0,
    			"top":10+i*center_cell_height
    		});
    		$left_arrow.css({
    			"left":0,
    			"top":(i+1)*center_cell_height-10-32
    		});
    		$right_arrow_container.append($right_arrow);
    		$right_arrow_container.append($left_arrow);

    	}

    	bindEvent();
    }
	return {
		initModule:initModule
	};
}());
