(function() {
	$('#setting').click(function() {
		$('#settings').slideToggle(600,'swing');
		return false;
	});
})();


/***************** Smooth Scrolling ******************/

$(function() {

	$('a[href*=#]:not([href=#])').click(function() {
		if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {

			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
			if (target.length) {
				$('html,body').animate({
					scrollTop: target.offset().top
				}, 800);
				return false;
			}
		}
	});

});

$(document).ready(function(){
	var offset = 500;
	var duration = 800;
	$(window).scroll(function() {
		if($(this).scrollTop() > offset) {
			$('.back-to-top').fadeIn(50);
		}
		else {
			$('.back-to-top').fadeOut(50);
		}
	});
	$('.back-to-top').click(function(event) {
		event.preventDefault();
		$('html,body').animate({
			scrollTop: 0
		}, duration);
		return false;
	})
});
