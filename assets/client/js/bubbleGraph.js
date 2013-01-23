$(function() {	
	$("li[data-list-item-type='brick']").click(function(e) {
		e.stopPropagation();
		var $this = $(this);
		$this.find("ul,dl").first().toggle();
	});
	
	$("li[data-list-item-type='brickProperty']").click(function(e) {
		e.stopPropagation();
		var $this = $(this);
		$this.find("ul,dl").first().toggle();
	});
});