$(document).ready(function(){
	// var $firstcell = $('.row-1.col-1');
	// console.log($firstcell);
	var isMoving = false;
	$('.arrow.right').on('click',function(){
		// console.log('right');

		var $row1col1 = $('.row-1.col-1'),
			$row1col2 = $('.row-1.col-2'),
			$row1col3 = $('.row-1.col-3');

		$('.row-1').animate({
				left:"+=202"
			},
			500,
			function(){
				if($(this).hasClass('col-3')){
					$(this).animate({top:-202},50,function(){
						$(this).animate({left:-202},50,function(){
							$(this).animate({top:0},50,function(){
								$(this).animate({left:0},500,function(){
									$row1col3.removeClass('col-3').addClass('col-1');
									$row1col2.removeClass('col-2').addClass('col-3');
									$row1col1.removeClass('col-1').addClass('col-2');
								});
							});
						});
						
					});

				}
		});
	});
	$('.arrow.left').on('click',function(){
		if(!isMoving){
			// console.log('left');
			isMoving = true;
			var $row1col3 = $('.row-1.col-3'),
				$row1col1 = $('.row-1.col-1'),
				$row1col2 = $('.row-1.col-2'),
				$cell_copy = $('.row-1.col-1').clone();


			$cell_copy.css({
				"left":606

			});

			$row1col3.after($cell_copy);

			var left = $cell_copy.css("left");

			$('.row-1').animate({
					left:"-=202"
				},1500,function(){
					$row1col1.remove();
					$row1col3.removeClass('col-3').addClass('col-2');
					$row1col2.removeClass('col-2').addClass('col-1');
					$cell_copy.removeClass('col-1').addClass('col-3');
					isMoving = false;
			});
			}


	});
});


var NineCellGame = (function(){
	var row_num = 3,col_num = 3,
		cell_width = 80,cell_height = 80,
		center_cell_width = 100,center_cell_height = 100,
        isMoving = false,
		bindEvent,initModule;

	bindEvent = function(){
		$('.arrow-right').on('click',function(){
			if(!isMoving){
				isMoving = true;
                var rowClass = $(this).attr('class').match(/row\-\d/)[0];

                var $oldLeftCell = $('.left-cell.'+rowClass+'.col-2'),
                    $oldCenterCell = $('.center-cell.'+rowClass+'.col-2'),
                    $oldRightCell = $('.right-cell.'+rowClass+'.col-2');
                //var color = $(leftCellClassName).css("background-color");

                var $newLeftCell = $oldLeftCell.clone(),
                    $newCenterCell = $oldCenterCell.clone(),
                    $newRightCell = $oldRightCell.clone();

                $newLeftCell.css({
                    "background-color":$oldRightCell.css("background-color"),
                    "left":-80
                });
                $newCenterCell.css({
                    "background-color":$oldLeftCell.css("background-color"),
                    "left":-100
                });
                $newRightCell.css({
                    "background-color":$oldCenterCell.css("background-color"),
                    "left":-80
                });
                $('.left-container').append($newLeftCell);
                $('.center-container').append($newCenterCell);
                $('.right-container').append($newRightCell);
                console.log($('.left-container .'+rowClass+',.center-container .'+rowClass+',.right-container .'+rowClass));
                //right shift
                var center_shift = "+=100";
                var side_shift = "+=80";
                // $('.left-container .'+rowClass+',.center-container .'+rowClass+',.right-container .'+rowClass).animate({
                //     left: $(this).hasClass('center-cell') ? center_shift : side_shift
                // },1500,function(){
                //     console.log($(this).width());
                //     $oldLeftCell.remove();
                //     $oldCenterCell.remove();
                //     $oldRightCell.remove();


                // });
                //
                $('.left-container .'+rowClass).animate({
                    left: "+=80"
                },1500,function(){
                    $oldLeftCell.remove();
                    isMoving = false;
                });
                $('.center-container .'+rowClass).animate({
                    left: "+=100"
                },1500,function(){
                    $oldCenterCell.remove();
                });
                $('.right-container .'+rowClass).animate({
                    left: "+=80"
                },1500,function(){
                    $oldRightCell.remove();
                });

                
                $('.left-cell.'+rowClass+'.col-1').removeClass('col-1').addClass('col-2');
                $('.left-cell.'+rowClass+'.col-0').removeClass('col-0').addClass('col-1');
                $newLeftCell.removeClass('col-2').addClass('col-0');

                
                var $oldcol1 = $('.center-cell.'+rowClass+'.col-1');
                var $oldcol0 = $('.center-cell.'+rowClass+'.col-0');
                $oldcol1.removeClass('col-1').addClass('col-2');
                $oldcol0.removeClass('col-0').addClass('col-1');
                $newCenterCell.removeClass('col-2').addClass('col-0');


                $('.right-cell.'+rowClass+'.col-1').removeClass('col-1').addClass('col-2');
                $('.right-cell.'+rowClass+'.col-0').removeClass('col-0').addClass('col-1');
                $newRightCell.removeClass('col-2').addClass('col-0');


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

    	//create center cell
    	for(var i = 0;i<col_num;i++){
    		for(var j = 0;j<row_num;j++){
    			var $new_cell = $('<div>c</div>');
    			var className = "cell center-cell row-"+i+" col-"+j;
    			$new_cell.addClass(className);
    			$new_cell.css({
    				"width":center_cell_width,
    				"height":center_cell_height,
    				"background-color":"red",
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
    			$new_cell = $('<div>tc</div>');
    			className = "cell top-cell row-"+i+" col-"+j;
    			$new_cell.addClass(className);
    			$new_cell.css({
    				"width":cell_width,
    				"height":cell_height,
    				"background-color":"yellow",
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
    			$new_cell = $('<div>rc</div>');
    			className = "cell right-cell row-"+i+" col-"+j;

    			$new_cell.addClass(className);
    			$new_cell.css({
    				"width":cell_width,
    				"height":cell_height,
    				"background-color":"blue",
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
    			$new_cell = $('<div>bc</div>');
    			className = "cell bottom-cell row-"+i+" col-"+j;

    			$new_cell.addClass(className);
    			$new_cell.css({
    				"width":cell_width,
    				"height":cell_height,
    				"background-color":"green",
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
    			$new_cell = $('<div>lc</div>');
    			className = "cell left-cell row-"+i+" col-"+j;

    			$new_cell.addClass(className);
    			$new_cell.css({
    				"width":cell_width,
    				"height":cell_height,
    				"background-color":"pink",
    				"border":"solid 1px #DDD",
    				"position":"absolute",
    				"top": i*center_cell_width+(center_cell_width-cell_width)/2,
    				"left": j*cell_width
    				// "right": 0

    			});
    			$left_container.append($new_cell);
    		}
    	}

    	//create top-arrow

    	//create right arrow
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
    	//create bottem arrow

    	//create down arrow
    	bindEvent();
    }
	return {
		initModule:initModule
	};
}());
