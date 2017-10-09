/*Site Navigation Js Start Here*/
// Load More
$(document).ready(function () {
    // Load the first 3 list items from another HTML file
    //$('#currentgame').load('externalList.html li:lt(3)');
    $('#currentgame li:lt(4)').show();
    $('.loadMore').click(function () {
        // $(this).parent().siblings('ul li:lt(10)').show();
        $('#currentgame li:lt(10)').show();
        $(this).hide();
        $(this).siblings('a').show();
    });
    $('.showLess').click(function () {
        // $(this).parent().siblings('ul li').not(':lt(4)').hide();
        $('#currentgame li').not(':lt(4)').hide();
        $(this).siblings('a').show();
        $(this).hide();
    });
});

$(document).ready(function () {    
    $('.invitationlist li:lt(3)').show();
    $('.loadMore2').click(function () {       
        $('.invitationlist li:lt(10)').show();
        $(this).hide();
        $(this).siblings('a').show();
    });
    $('.showLess2').click(function () {       
        $('.invitationlist li').not(':lt(3)').hide();
        $(this).siblings('a').show();
        $(this).hide();
    });
});
$(document).ready(function () {    
    $('.categorybox:lt(3)').show();
    $('.loadMore3').click(function () {       
        $('.categorybox:lt(10)').show();
        $(this).hide();
        $(this).siblings('a').show();
    });
    $('.showLess3').click(function () {       
        $('.categorybox').not(':lt(3)').hide();
        $(this).siblings('a').show();
        $(this).hide();
    });
});

// $(document).ready(function () {
//     // Load the first 3 list items from another HTML file
//     //$('#currentgame').load('externalList.html li:lt(3)');
//     $('.invitationlist li:lt(3)').show();
//     $('.loadMore').click(function () {
//         $('.invitationlist li:lt(10)').show();
//         $('.loadMore').hide();
//         $('.showLess').show();
//     });
//     $('.showLess').click(function () {
//         $('.invitationlist li').not(':lt(3)').hide();
//         $('.loadMore').show();
//         $('.showLess').hide();
//     });
// });

jQuery(document).ready(function($){

//   if (screen.width < 1025) {
//     $('#currentgame ul').owlCarousel({
//         loop:false,
//         autoPlay: false,
//         margin:10,
//         pagination:false,
//         autoWidth:true,
//         itemsTablet : [768, 2.5],
//         itemsDesktop : [1024, 3.2],
//         responsive:{
//             0:{
//                 items:1,
//             },
//             600:{
//                 items:2,
//                 nav:false
//             },
//             1000:{
//                 items:3,
//             }
//         }
//     })
// }  

// if (screen.width < 1023) {
//     $('.invitationlist').owlCarousel({
//         loop:false,
//         autoPlay: false,
//         margin:10,
//         pagination:false,
//         autoWidth:true,
//         itemsTablet : [768, 2.5],
//         responsive:{
//             0:{
//                 items:1,
//             },
//             600:{
//                 items:2,
//                 nav:false
//             },
//             1000:{
//                 items:3,
//             }
//         }
//     })
// }

// if (screen.width < 1024) {
//     $('.blog').owlCarousel({
//         loop:false,
//         autoPlay: false,
//         margin:10,
//         pagination:false,
//         autoWidth:true,
//         itemsMobile : [479,1.05],
//         itemsTablet : [768, 2.1],
//         responsive:{
//             0:{
//                 items:1,
//             },
//             600:{
//                 items:2,
//                 nav:false
//             },
//             1000:{
//                 items:3,
//             }
//         }
//     })
// }

// start game btn

// game option
$('.friendsslider').owlCarousel({
    slideSpeed : 3000,
    autoPlay: true,
    loop:true,
    pagination:false,
    navigation:true,
    // autoWidth:true,
    itemsMobile : [479,1.5],
    itemsTablet : [768, 2.5],
    responsive:{
        0:{
            items:2.5,
        },
        600:{
            items:5,
            nav:false
        }
    }
})

$(".chancat").click(function() {
    $(".preference").slideToggle("slow");

    $(this).toggleClass("active");

    if ($(this).find('.chancat-text').text() == "Close")
     $(this).find('.chancat-text').text("Change Category Preference")        
 else
     $(this).find('.chancat-text').text("Close");

});



});

//------------------------------------------------------------------------------------------------------------------------------------------

// Dashboard tabbing
$(document).ready(function(){

  $('ul.tabbing li').click(function(){
    var tab_id = $(this).attr('data-tab');

    $('ul.tabbing li').removeClass('active');
    $('.tab-content').removeClass('active');

    $(this).addClass('active');
    $("#"+tab_id).addClass('active');
})

})


jQuery(function(){

    var minimized_elements = $('p.minimize');
    
    minimized_elements.each(function(){    
        var t = $(this).text();        
        if(t.length < 108) return;
        
        $(this).html(
            t.slice(0,108)+'<span>... </span><a href="#" class="more">More</a>'+
            '<span style="display:none;">'+ t.slice(108,t.length)+' <a href="#" class="less">Less</a></span>'
            );
        
    }); 
    
});