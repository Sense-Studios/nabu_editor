/* globals
save_marqers
available_marqers
categories
*/

var firstrun = false;

// helper
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

// helper
var marqer_plugin = function( name, type, icon, version, stramien ) {
  var html = '';
  html += '<div class="plugin btn btn-material-white marqer_item" data-stramien="'+stramien+'" data-version="'+version+'" data-name="'+name+'" data-type="'+type+'">';
  html += ' <span class="marqer_item_title">'+name+'</span>';
  html += '</div>';
  return html;
};

// helper
var marqer_stratum_plugin = function( name, type, icon, version, stramien ) {
  var html = '';
  html += '<div class="plugin btn btn-material-white marqer_item" data-stramien="'+stramien+'" data-version="'+version+'" data-name="'+name+'" data-type="'+type+'">';
  html += ' <span class="marqer_item_title">'+name+'</span> &nbsp;&nbsp;';
  //html += ' <a class=""><span class="glyphicon glyphicon-pencil"></a>'
  html += ' <a href="javascript:" class="stramien_share_button active"><i class="glyphicon glyphicon-share"></i></a>&nbsp;'  
  html += ' <a href="javascript:" class="stramien_info_button"><span class="glyphicon glyphicon-info-sign"></span></a>&nbsp;'
  html += ' <a href="javascript:" class="stramien_delete_button danger"><span class="glyphicon glyphicon-trash"></span></a>'
  html += '</div>';
  return html;
};

// marqermenu
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

// stramienenmenu
var marqer_stramienen = []
var updateStramienen = function() {
  $('.marqers_stratum_holder').html('')
  marqer_stramienen = []
  $.get('/'+mount_point+'/marqerstrata', function(d) {
    marqer_stramienen = d
    $.each( marqer_stramienen.reverse(), function( key, mrqr ) {
      mrqr.marqeroptions = JSON.parse(mrqr.marqeroptions)
      $('.marqers_stratum_holder').append( marqer_stratum_plugin( mrqr.name, mrqr.type, null, null, mrqr['_id']['$oid'] ) );
    });

    initStramienButtons();
    initDragDroppablePlugins();
  })
}
var fillStramienMenu = function( srch ) {
  var listing = []
  if ( srch == undefined || srch == null || srch == "" ) {
    listing = marqer_stramienen
  }else{
    $.each( marqer_stramienen, function(k, val) {
      console.log(val.name.toLowerCase(), val.name.toLowerCase().indexOf( srch ))
      if ( val.name.toLowerCase().indexOf( srch.toLowerCase() ) != -1 ) {
        listing.push(val)
      }
    })
  }

  // reset and fill
  $('.marqers_stratum_holder').html('')
  $.each( listing, function( key, mrqr ) {
    $('.marqers_stratum_holder').prepend( marqer_stratum_plugin( mrqr.name, mrqr.type, null, null, mrqr['_id']['$oid'] ) );
  });

  initStramienButtons();
  initDragDroppablePlugins();
}

var initStramienButtons = function() {
  $('.marqer_item .stramien_info_button').unbind('click');
  $('.marqer_item .stramien_info_button').click( function() {
    alert("Marqer Stratum\n - based on type: " + $(this).parent().data("type") + "\n - stratum name: " + $(this).parent().data("name") )
  });

  $('.marqer_item .stramien_delete_button').unbind('click');
  $('.marqer_item .stramien_delete_button').click( function() {
    if ( confirm(t.right_menu.delete_marqer) ) {
      var id = $(this).parent().data("stramien")
      $.post('/'+mount_point+'/deletestratum/' + id).success( function(d) {
        console.log("destruction said:", d)
        $('#zoek_marqer_stramien').val('')
        updateStramienen()

      }).fail(function(e){
        console.log("fail! ", e)

      }).done(function(e){
        console.log("done! ", e)
      })
    }
  })
}

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
  var html = '<div style="background-color:white;border:1px solid black;opacity:0.8" class="btn btn-material-white long-shadow-4">'+$(e.currentTarget).data('name')+'</div>';
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
  $('#zoek_marqer').keyup( function() { fillMenu( $(this).val() ); });
  $('#zoek_marqer').focusin( function() { keysEnabled = false; })

  $('#zoek_marqer_stramien').keyup( function() { fillStramienMenu( $(this).val() ); });
  $('#zoek_marqer_stramien').focusin( function() { keysEnabled = false; })
};

// ####################################################################
// #### Initialize rightmenu
// ####################################################################

$(document).ready(function () {
  fillMenu();
  addMenuInteraction();
  initDragDroppablePlugins();
  initSearch();
  updateStramienen();

  // note that the save_marqers function is located in 'editor/marqers.js'
  // $('#save_marqers').click( save_marqers );
});
