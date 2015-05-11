/* globals
save_marqers

*/
var firstrun = false

var category_header = function( title, id ) {
  var html = '';
  html += '<div class="btn marqer_category transition">';
  html += ' <button class="btn btn-material-burgundy marqer_category_title" id=' + id + '>';
  html += '  <span class="glyphicon glyphicon-triangle-right glyphicon-rotate"></span>';
  html += '  <span class="category_title">' + title + '</span>';
  html += ' </button>';
  html += '</div>';
  return html;
};

var marqer_plugin = function( name, type, icon, version ) {
  var html = '';
  html += '<div class="plugin btn btn-material-white marqer_item" data-version="'+version+'" data-name="'+name+'" data-type="'+type+'">';
  html += ' <span class="marqer_item_title">'+name+'</span>';
  html += '</div>';
  return html;
};


var fillMenu = function( srch ) {   
  $('.marqers_holder').html(''); // reset
  if ( srch === undefined || srch == "" ) {
    $.each( categories, function( key, cat ) {
      $('.marqers_holder').append( category_header( cat.title, cat.id) );
    });  
    $.each( available_marqers, function( key, mrqr ) {
      $('#' + mrqr.category ).after( marqer_plugin( mrqr.name, mrqr.type, mrqr.icon, mrqr.version ) );
    });
    addMenuInteraction();
    
  }else{    
    $.each( available_marqers, function( key, mrqr ) {
      if ( mrqr.name.toLowerCase().indexOf( srch.toLowerCase() ) != -1 ) {      
        $('.marqers_holder').append( marqer_plugin( mrqr.name, mrqr.type, mrqr.icon, mrqr.version ) + "<br/>" );
      }
    });    
  }
  
  initDragDroppablePlugins();
};

var addMenuInteraction = function() { 
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
          $(this).parent().delay(500).queue( function(next){               
              $(this).css("overflow", "visible"); 
              next();
          });
      }
  });
};

var dragHelper = function( e, u ) {
  var html = '<div style="background-color:white;border:1px solid black;opacity:0.8" class="btn btn-material-white long-shadow-4">'+$(e.currentTarget).data('type')+'</div>';
  return html;
};

var initDragDroppablePlugins = function() {
  $(".plugin").draggable({
    helper: dragHelper,
    cursorAt: { bottom : 24, left: 10 }
  });
};

// attach search
var initSearch = function() { 
  $('#zoek_marqer').keyup( function()  {
    fillMenu( $(this).val() );
  });
};

// ####################################################################
// #### Initialize rightmenu
// ####################################################################

$(document).ready(function () {  
  fillMenu();
  addMenuInteraction();
  initDragDroppablePlugins();
  initSearch();
  
  // note that the save_marqers function is located in 'editor/marqers.js'
  // $('#save_marqers').click( save_marqers );
});