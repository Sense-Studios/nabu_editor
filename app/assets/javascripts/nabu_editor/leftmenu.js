$(document).ready(function() {
   
   $
   
   
  //toggle nav width
  var widthtoggle = 0; 
  $('.user_image_wrapper').click( function() { window.open("https://nl.gravatar.com", '_blank' ) } )
  $('.user_image_wrapper').css('cursor','pointer')

  $(".hide_left_menu").click(function(){

    //toggle nav width
    if(widthtoggle == 0) {
      $(".user_description").fadeOut('fast');
      $(".menu-item").fadeOut('fast');
      $("nav").css("width", "100px");
      $(".navigation > .btn > a").css("opacity", "0");
      $(".navigation > .btn > span").delay(400).queue(function(next){ $(this).addClass("smallnavicon"); next(); });
      $(".user_image_wrapper").addClass("user_image_small");
      $(".user_name").addClass("user_name_gone");
      $(".logout > a > p").addClass("hide_logout");
      $(".logout > a > span").addClass("logout_button_show");
      $("nav > h4").addClass("email_hide");
      $(".hide_left_menu > span").addClass("hide_left_menu_button");
      $(".logo:nth-child(2)").addClass("hide_logo");
      //check side divs width to fit contentwrapper nice
        var document_width = $(document).width();
        var nav_width = "100"
        var right_menu_width = $("nav").width();
        var content_wrapper_width = document_width - nav_width - right_menu_width;
        console.log(content_wrapper_width);
        $(".contentwrapper").css("width", content_wrapper_width.toFixed(0) - 2);
      
      $(".user_description").delay(50).queue(function(next){ $(this).fadeIn(); next(); });
      $(".menu-item").delay(50).queue(function(next){ $(this).fadeIn(); next(); });
      setTimeout(resize_aspect_ratio, 500);
      widthtoggle = 1; 
    }
    else if (widthtoggle == 1){
      $(".user_description").fadeOut('fast');
      $(".menu-item").fadeOut('fast');
      $("nav").css("width", "20%");
      $(".navigation > .btn > a").css("opacity", "1");
      $(".navigation > .btn > span").removeClass("smallnavicon");
      $(".user_image_wrapper").removeClass("user_image_small");
      $(".user_name").removeClass("user_name_gone");
      $(".logout > a > p").removeClass("hide_logout");
      $(".logout > a > span").removeClass("logout_button_show");
      $("nav > h4").removeClass("email_hide");
      $(".hide_left_menu > span").removeClass("hide_left_menu_button");
      $(".logo:nth-child(2)").removeClass("hide_logo");
      $('.contentwrapper').css("width", "");
      $(".user_description").delay(100).queue(function(next){ $(this).fadeIn(); next(); });
      $(".menu-item").delay(100).queue(function(next){ $(this).fadeIn(); next(); });
      setTimeout(resize_aspect_ratio, 500);
      widthtoggle = 0;
    }
    // update shapeshift
    setTimeout( function() { if ( $(".leprograms").is(":visible") ) $(".leprograms").trigger("ss-rearrange")           } , 300 );
    setTimeout( function() { if ( $(".leprograms").is(":visible") ) $('.leprograms').shapeshift(shapeshiftOptions()   )} , 700 );
  });   
});