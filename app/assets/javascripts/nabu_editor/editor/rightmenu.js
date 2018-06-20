/* globals
save_marqers
available_marqers
categories
*/

var firstrun = false;
var marqer_stramienen = []
var currentMarqerStramien
var mss = []

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
  html += '<div class="plugin btn btn-material-white marqer_item"  title="'+name+'" alt="'+name+'" data-stramien="'+stramien+'" data-version="'+version+'" data-name="'+name+'" data-type="'+type+'">';
  html += ' <span class="marqer_item_title">'+name+'</span>';
  html += '</div>';
  return html;
};

// helper
var marqer_stratum_plugin = function( index, name, type, icon, version, stramien, allow_delete ) {
  var html = '';
  html += '<div class="plugin btn btn-material-white marqer_stratum_item" title="'+name+'" alt="'+name+'"';
  html += '" data-local-id="' + index + '"';
  html += '" data-stramien="' + stramien + '"';
  html += '" data-version="' + version + '"';
  html += '" data-name="' + name + '"';
  html += '" data-type="' + type + '"';
  html += '" data-local="'+allow_delete;
  html += '" alt="'+name+'" title="'+name+'" >';

  html += ' <span class="marqer_stratum_item_title"><small>' + name + '</small></span> &nbsp;&nbsp;';
  html += ' <a href="javascript:" class="stramien_info_button"><span class="glyphicon glyphicon-info-sign"></span></a>&nbsp;'

  // TODO doublecheck a delete request on the server!!
  if ( allow_delete ) html += ' <a href="javascript:" class="stramien_delete_button danger"><span class="glyphicon glyphicon-trash"></span></a>'
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

var updateStramienen = function() {
  $('.marqers_stratum_holder').html('')
  $('.marqers_global_stratum_holder').html('')
  $('.marqers_shared_stratum_holder').html('')
  marqer_stramienen = {}
  $.get('/marqerstrata/', function(d) {
    marqer_stramienen = d
    $.each( marqer_stramienen.own_strata, function( key, mrqr ) {
      mrqr.marqeroptions = JSON.parse(mrqr.marqeroptions)
      //console.log( mrqr.name, mrqr['_id']['$oid'] )
      $('.marqers_stratum_holder').append( marqer_stratum_plugin( key, mrqr.name, mrqr.type, null, null, mrqr['_id']['$oid'], true ) );
    });

    $.each( marqer_stramienen.global_strata, function( key, mrqr ) {
      mrqr.marqeroptions = JSON.parse(mrqr.marqeroptions)
      $('.marqers_global_stratum_holder').append( marqer_stratum_plugin( key, mrqr.name, mrqr.type, null, null, mrqr['_id']['$oid'] ) );
    });

    $.each( marqer_stramienen.shared_strata, function( key, mrqr ) {
      mrqr.marqeroptions = JSON.parse(mrqr.marqeroptions)
      $('.marqers_shared_stratum_holder').append( marqer_stratum_plugin( key, mrqr.name, mrqr.type, null, null, mrqr['_id']['$oid'] ) );
    });

    mss = []
    mss = mss.concat( marqer_stramienen.own_strata,  marqer_stramienen.shared_strata, marqer_stramienen.global_strata )
    initStramienButtons();
    initDragDroppablePlugins();
  })
}

var fillStramienMenu = function( srch, subset, target ) {
  var listing = [];
  console.log("updatemenu: ", srch, subset, target );

  if ( srch == undefined || srch == null || srch == "" ) {
    listing = marqer_stramienen[subset]
  }else{
    $.each( marqer_stramienen[subset], function( k, stratum ) {
      if ( stratum.name.toLowerCase().indexOf( srch.toLowerCase() ) != -1 ) {
        listing.push(stratum)
      }
    })
  }

  // reset and fill
  target.html('')
  $.each( listing, function( key, mrqr ) {
    // console.log("update through listing")
    target.append( marqer_stratum_plugin( key, mrqr.name, mrqr.type, null, null, mrqr['_id']['$oid'], subset == 'own_strata' ) );
  });

  initStramienButtons();
  initDragDroppablePlugins();
}

var addMenuInteraction = function() {
  var clicked = 0;
  $(".marqer_category_title").click(function(){
    var curheight = $(this).parent().height();
      if( curheight > 50 ){
        $(this).parent().css("height", "40px");
        $(this).parent().css("box-shadow", "");
        $(this).parent().css("z-index", "");
        $(".glyphicon", this).css('-webkit-transform','rotate(0deg)');
        $(".glyphicon", this).css('-moz-transform','rotate(0deg)');
        $(".glyphicon", this).css('transform','rotate(0deg)');
         $('.marqer_category_title').parent().css("overflow", "hidden");
      } else {

        if ( clicked == 1 ){
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
      };
  });

  // add new marqerstramien
  $('#import_marqerstratum_button').unbind('click')
  $('#import_marqerstratum_button').click( function() {
    $('#marqer_stratum_modal .tokenscreen').show()
    $('#marqer_stratum_modal .update_token').hide()
    $('#marqer_stratum_modal h4.modal-title').text('Import Prefab from token')
    $('#marqer_stratum_modal').modal()
  });
};

var initStramienButtons = function( isLocal ) {

  // reset and build clickhandler
  $('.marqer_stratum_item .stramien_info_button').unbind('click');
  $('.marqer_stratum_item .stramien_info_button').click( function() {

    // join all stramiens together
    var stramien_id = $(this).parent().data("stramien")
    $.each( mss, function(key, ms) { if ( ms._id.$oid == stramien_id ) currentMarqerStramien = ms })

    // set both inputs and none inputs
    $('#marqer_stratum_modal .stratum_type').text( currentMarqerStramien.type );
    $('#marqer_stratum_modal input.stratum_name').val( currentMarqerStramien.name )
    $('#marqer_stratum_modal .noninput.stratum_name').text( currentMarqerStramien.name )
    $('#marqer_stratum_modal textarea.description').val( currentMarqerStramien.description )
    $('#marqer_stratum_modal .noninput.description').text( currentMarqerStramien.description )
    $('#marqer_stratum_modal input.author').val( currentMarqerStramien.author )
    $('#marqer_stratum_modal .noninput.author').text( currentMarqerStramien.author )

    // Get token or get refresh button
    if ( currentMarqerStramien.token == "" ) {
      $('#marqer_stratum_modal .token').text( "" )
      $('#marqer_stratum_modal .token').hide()
      $('#marqer_stratum_modal .refreshtoken').show()
    }else{
      $('#marqer_stratum_modal .token').text( currentMarqerStramien.token )
      $('#marqer_stratum_modal .token').show()
      $('#marqer_stratum_modal .refreshtoken').hide()
    }

    // set number of shares
    $('#marqer_stratum_modal .shares').text( currentMarqerStramien.shares.length )

    // show the modal
    $('#marqer_stratum_modal .tokenscreen').hide()
    $('#marqer_stratum_modal .update_token').show()

    // only edit local
    if ( $(this).parent().data("local") == true ) {
      $('#marqer_stratum_modal h4.modal-title').text('Edit Marqer Prefab')
      $('#update_stramien').show()
      $('#marqer_stratum_modal textarea').show()
      $('#marqer_stratum_modal input').show()
      $('#marqer_stratum_modal .noninput').hide()
      $('#marqer_stratum_modal .tokeninteraction').show()
    }else{
      $('#marqer_stratum_modal h4.modal-title').text('Show Marqer Prefab')
      $('#update_stramien').hide()
      $('#marqer_stratum_modal textarea').hide()
      $('#marqer_stratum_modal input').hide()
      $('#marqer_stratum_modal .noninput').show()
      $('#marqer_stratum_modal .tokeninteraction').hide()
    }

    // show modal
    $('#marqer_stratum_modal').modal()
  });

  $('.marqer_stratum_item .stramien_delete_button').unbind('click');
  $('.marqer_stratum_item .stramien_delete_button').click( function() {
    if ( confirm(t.right_menu.delete_marqer) ) {
      var id = $(this).parent().data("stramien")

      // TODO (2nd) make sure to doublecheck the user id before deletion
      $.post('/deletestratum/' + id).success( function(d) {
        console.log("destruction said:", d)
        $('#zoek_marqer_stramien').val('')
        $('#zoek_global_marqer_stramien').val('')
        $('#zoek_shared_marqer_stramien').val('')
        updateStramienen()

      }).fail(function(e){
        console.log("fail! ", e)

      }).done(function(e){
        console.log("done! ", e)
      })
    }
  })
}

// ####################################################################
// #### Modal helpers (interaction)
// ####################################################################

var refreshToken = function() {
  console.log("refresh token", currentMarqerStramien._id.$oid )
  var url = "/marqerstratumtoken/" + currentMarqerStramien._id.$oid
  $.get( url, function(d) {
    $('#marqer_stratum_modal .token').text( d.token )
    $('#marqer_stratum_modal .token').show()
    $('#marqer_stratum_modal .refreshtoken').hide()
  })
}

var postToken = function() {
  $('#marqer_stratum_modal').modal('toggle');
  var url = '/marqerstratumtoken/' + $('textarea.given-token').val()
  $.post( url, {}, function() {
    updateStramienen()
  }).fail(function() {
    console.log("posting token failed")
  })
}

var updateStramien = function() {
  // remove token
  $('#marqer_stratum_modal').modal('toggle');

  // save
  $.post('/marqerstratum/update/', {
    id: currentMarqerStramien._id.$oid,
    name: $('#marqer_stratum_modal .stratum_name').val(),
    author: $('#marqer_stratum_modal .author').val(),
    description: $('#marqer_stratum_modal .description').val()

  }, function() {
    updateStramienen()
  }).fail(function() {
    console.log("saving stratum failed")
  })
}

// ####################################################################
// #### Drag/ Drop helper
// ####################################################################

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

  $('#zoek_marqer_stramien').focusin( function() { keysEnabled = false; })
  $('#zoek_marqer_stramien').keyup( function() {
    fillStramienMenu( $(this).val(), "own_strata", $(".marqers_stratum_holder") );
  });

  $('#zoek_shared_marqer_stramien').focusin( function() { keysEnabled = false; })
  $('#zoek_shared_marqer_stramien').keyup( function() {
    fillStramienMenu( $(this).val(), "shared_strata", $(".marqers_shared_stratum_holder") );
  });

  $('#zoek_global_marqer_stramien').focusin( function() { keysEnabled = false;})
  $('#zoek_global_marqer_stramien').keyup( function() {
    fillStramienMenu( $(this).val(), "global_strata", $(".marqers_global_stratum_holder") );
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
  updateStramienen();

  // note that the save_marqers function is located in 'editor/marqers.js'
  // $('#save_marqers').click( save_marqers );
});
