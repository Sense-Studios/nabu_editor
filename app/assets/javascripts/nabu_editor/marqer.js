$(document).ready(function () {

  var clicked = 0; 
  $(".marqer_category_title").click(function(){
    var curheight = $(this).parent().height();
      if(curheight > 50){
        $(this).parent().css("height", "40px");
        $(this).parent().css("box-shadow", "");
        $(this).parent().css("z-index", "");
        $(".glyphicon", this).css('-webkit-transform','rotate(0deg)');
        $(".glyphicon", this).css('-moz-transform','rotate(0deg)');
        $(".glyphicon", this).css('transform','rotate(0deg)');
         $('.marqer_category_title').parent().css("overflow", "hidden");
      }
      else {
        if (clicked == 1){
          $(".marqer_category_title").parent().css("height", "40px");
          $(this).parent().css("box-shadow", "");
          $(this).parent().css("z-index", "");
          $(".glyphicon-rotate").css('-webkit-transform','rotate(0deg)');
          $(".glyphicon-rotate").css('-moz-transform','rotate(0deg)');
          $(".glyphicon-rotate").css('transform','rotate(0deg)');
          $('.marqer_category_title').parent().css("overflow", "hidden");
        }
          var count = $(this).parent().children().length;
          var divHeight = count * 40;
          $(this).parent().css("height", divHeight);
          $(this).parent().css("box-shadow", "none");
          $(this).parent().css("z-index", "9999999999999999");
          $(".glyphicon", this).css('-webkit-transform','rotate(90deg)');
          $(".glyphicon", this).css('-moz-transform','rotate(90deg)');
          $(".glyphicon", this).css('transform','rotate(90deg)');
          clicked = 1; 
          $(this)
            .parent()
            .delay(500)
            .queue( function(next){ 
              $(this).css("overflow", "visible"); 
              next(); 
          });
      }
  }); 
})