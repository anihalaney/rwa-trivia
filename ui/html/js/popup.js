jQuery(document).ready(function($){
	//open popup
	$('.cd-popup-trigger').on('click', function(event){
		event.preventDefault();
		popupID = $(this).attr('href').split('#')[1];
		$(".cd-popup[id='"+popupID+"']").addClass('is-visible');
		$("body").addClass('no-scroll');
	});
	
	//close popup
	$('.cd-popup').on('click', function(event){
		if( $(event.target).is('.cd-popup-close') || $(event.target).is('.cd-popup') ) {
			event.preventDefault();
			$(this).removeClass('is-visible');
			$("body").removeClass('no-scroll');
		}
	});
	//close popup when clicking the esc keyboard button
	$(document).keyup(function(event){
    	if(event.which=='27'){
    		$('.cd-popup').removeClass('is-visible');
    		$("body").removeClass('no-scroll');
	    }
    });
});