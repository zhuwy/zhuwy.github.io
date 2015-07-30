$(document).ready(function(){
	
	$('.option').click(function(){
		if($(this).hasClass("selected"))
			return;
		$('.selected').removeClass("selected");
		$(this).addClass("selected");
		var boardtext = $("div.selected > span").html();
		$(".board").html(boardtext);
	})
});