/*globals
pop
showMarqerInfoFromTrackEvent
deleteMarqer
updateMarqer
getMarqerById
program
secondsToSMPTE
doControl
createNewMarqer
preview
seekTo
marqers
mapi
*/

////
// TrackEvent Handlers
/////_________________________________________________________________

var ids = 1000000; // local id start
var createTrackEvent = function( marqer, trackline, select_id ) {
  console.log("MARQER", marqer);
  // get the necc. information from the marqer
  var name, type, remote_id, l, w;
  if ( marqer !== undefined ) {
    try{
      if ( marqer.marqeroptions.title.value != '') {
        name = marqer.marqeroptions.title.value;
      }else{
        name = marqer.name;
      }
    }catch(e){
      name = marqer.name;
    }

    type = marqer.type;
    remote_id = marqer.id;
    l = ( ( marqer.in / pop.duration() ) * 100 ) + '%';
    w = ( ( ( marqer.out - marqer.in ) / pop.duration() ) * 100 ) + '%';
  }else{
    // failsafe and user scolding
    alert(t.user_interface.alert);
    return;
  }

  // create a local id, this is very temporary
  ids++;

  // create the trackevent element
  // TODO build this in HAMLbars
  var html = '';
  html += '<div class="trackeventcontainer">';
  html += ' <div class="marqer_item trackevent btn-material-burgundy-transperant" data-remote_id="'+remote_id+'" id="'+ ids + '" data-type='+type+' data-name="'+name+'" style="left: '+l+'; width: '+w+';">';
  html += '  <ul class="nav nav-tabs">';
  html += '   <li class="dropdown">';
  html += '    <span class="glyphicon glyphicon-menu-hamburger" aria="" hidden="true"></span>';
  html += '     <a class="dropdown-toggle" href="#" data-toggle="dropdown" data-target="#"></a>';
  html += '     <ul class="dropdown-menu">';

  if ( marqer.marqeroptions.position != undefined && marqer.marqeroptions.original != undefined ) {
    html += '     <li><a class="position_button" data-remote_id="'+remote_id+'" href="javascript:"><span class="glyphicon glyphicon-modal-window ignore_events"/>' + t.user_interface.place + '</a></li>';
  }

  html += '      <li><a class="edit_button" data-remote_id="'+remote_id+'" href="javascript:"><span class="glyphicon glyphicon-pencil ignore_events"/>' + t.user_interface.edit + '</a></li>';
  html += '      <li><a class="stratum_button" data-remote_id="'+remote_id+'" href="javascript:"><span class="glyphicon glyphicon-save ignore_events"/>' + t.user_interface.prefab + '</a></li>';
  html += '      <li><a class="delete_button" data-remote_id="'+remote_id+'" href="javascript:"><span class="glyphicon glyphicon-trash ignore_events"/>' + t.user_interface.delete + '</a></li>';
  html += '     </ul>';
  html += '    </li>';
  html += '   </ul>';
  // if marqer.track.hasposition?
  // --> setPosition?
  html += '<p>&nbsp&nbsp' + name;
  // html += '   <small> ' + $(ui.draggable).data('type') + '</small>';
  html += '</p></div>';
  html += '</div>';

  trackline.append( html );                              // append it to the trackline
  console.log("SET TRACK: ", trackline.index(), marqer.type, marqer.marqeroptions.track );
  marqer.marqeroptions.track = trackline.index();        // add track index to marqer
  addInteractionToTrackEvent( ids );                     // add interaction to it
  if ( select_id == marqer.id ) selectMarqer( marqer );  // autoselect it
  createTimeLineWithNumbers() // might not be drawn yet
};

var addInteractionToTrackEvent = function() {
  // console.log("ADD INTERACTION TO TRACKEVENT @#################### ZOOOOOOOOOMMMMMMM @################################")
  $( ".trackevent" ).resizable({
    handles: 'e,w',
    containment: "parent",
    start: function( event, ui ) {
      if ( $('.trackeventcontainer .dropdown').hasClass('open') ) event.preventDefault();
    },
    stop: function( event, ui ) {
      initiateUpdateMarqer( event, ui );
    }
  });

  $(".trackevent").mousedown(function(event) {
    $(this).draggable('option', { helper : event.altKey ? 'clone' : 'original'});

  }).draggable({
    // axis: "x",
    // containment: "parent",
    // TODO, put this in somekind of options object
    // normal: snap: '.trackline,.trackevent',
    // with_snapping: snap: '.trackline,.trackevent',
    snap: '.trackline,.trackevent',
    snapMode: 'inner',
    containment: '.zoomContainer',
    cursorAt: { bottom : 24 },
    start: function( event, ui ) {
      if ( $('.trackeventcontainer .dropdown').hasClass('open') ) event.preventDefault();
      if ( event.altKey ) {
        clearTimeout( saveTimeout );
        $(this).addClass('clone_marqer');
      }
    },
    drag: function( event, ui ) {},
    stop: function( event, ui ) {
      if ( !event.altKey ) initiateUpdateMarqer( event, ui );
    }
  });

  // console.log("CONTAINMENT @#################### ZOOOOOOOOOMMMMMMM @################################")

  // Edit-button
  $('#' + ids + ' .edit_button').click(function( e ) {
    showMarqerInfoFromTrackEvent( e, $(this).closest('.trackevent') );
  });

  // Position-button
  $('#' + ids + ' .position_button').click(function( e ) {
    startScreenEditor( e, $(this).closest('.trackevent') );
  });

  // Save-button
  $('#' + ids + ' .stratum_button').click(function( e ) {
    var m = getMarqerById( $(this).closest('.trackevent').data("remote_id") )
    saveMarqerStratum( m )
  });

  // Delete-button
  $('#' + ids + ' .delete_button').click(function( e ) {
    if ( confirm(t.user_interface.confirm_delete) ) {
      deleteMarqer( getMarqerById( $(this).data('remote_id') ) );
    }
  });
};

////
// Trackline duplicate functie
/////_________________________________________________________________

var cloneMarqerFromTrackEvent = function( event, ui ) {

  // context
  var clone_m = new window[ $( ui.helper.context ).data("type") ]
  var original_m = getMarqerById( $( ui.helper.context ).data("remote_id") )

  clone_m.program_id = program.id;

  // make sure to break reference
  clone_m.marqeroptions = JSON.parse( JSON.stringify( original_m.marqeroptions ) );
  clone_m.title = original_m.title;
  clone_m.name = original_m.name;
  clone_m.marqeroptions.title.value = original_m.marqeroptions.title.value;

  // if drop on trackling
  clone_m.marqeroptions.track = $(event.target).index();

  // if drop on trackling
  //clone_m.marqeroptions.track
  var l, w, t;
  if ( $(event.target).hasClass("trackline") ) {
    clone_m.marqeroptions.track = $(event.target).index();
    l = $( ui.helper[0] ).position().left;
    w = $( ui.helper[0] ).width();
    t = $('#tracks').width();

    clone_m.in = ( l / t )* pop.duration();
    clone_m.out = ( ( l + w ) / t ) * pop.duration();

  }else{
    clone_m.marqeroptions.track = $('.trackline').length;
    l = $( ui.helper.context ).position().left;
    w = $( ui.helper.context ).width();
    t = $('#tracks').width();

    clone_m.in = ( l / t )* pop.duration();
    clone_m.out = ( ( l + w ) / t ) * pop.duration();
  }

  // create a copy
  mapi.createMarqer({
    marqer: clone_m,
    success: function( marqer ) {
      // add it to the local marqers (note that this can cause discrepencies between the server!)
      // now post the marqeroptons
      marqer.remote_id = marqer.id;
      marqers.push( marqer );

      // update the event with a new id
      // $( ui.helper.context ).data("remote_id", marqer.id)
      preview();
    },
    fail: function(resp) {
      console.log('helaas pindakaas');
    }
  });
};

////
// TrackLine Key handler
/////_________________________________________________________________

var keysEnabled = false;
var saveTimeout;

var initEditorKeys = function() {
  $(document).unbind('keydown');
  $(document).keydown( function( key ) {
    if ( !keysEnabled ) return;
    //console.log("Key code", key.keyCode, 'alt',  key.altKey, 'shift', key.shiftKey, 'ctrl', key.ctrlKey);
    key.preventDefault();

    /*
      left: move left 1px
      right: move right 1px
      up: select track-1
      down: select track+1
      alt + left, lengthen left
      alt + right, lengthen right
      alt + up, duplicate up ?
      alt + down, duplicate down ?
      shift + left: move left + 10 // or move left x/ view width
      shift + right: move left + 10 // or move left x/ view width
      alt + shift + left: lengthen left + 10 // or move left x/ view width
      alt + shift + right: lengthen left + 10 // or move left x/ view width
      i set in
      o set out
      s goto start
      e goto end
      [ goto in
      ] goto out
      , move 1 frame back
      . move 1 frame forwared
      shift + , move 1 secod back
      shift + . move 1 second forwar
      space: togglePlay
      home: goto start
      end: goto end
      enter: options menu
      tab: placing menu
      del: delete
    */

    // if ( last_selected_marqer_item_id == undefined || last_selected_marqer_item_id = -1 ) { select the first }
    // if selected_marqer_item;
    var step = 1;
    var time_step = 1/25;
    var do_update = false;
    if ( key.shiftKey ) step = 10; // width / 8
    if ( key.shiftKey ) time_step = 1; // width / 8

    switch(key.keyCode) {
      case 38:               // up
        if ( key.altKey ) {
          //duplicateMarqer(id, track - 1)
          console.log("no duplicate yet");
        }else{
          clearTimeout( saveTimeout );
          updateSelectedMarqer();
          selectSibling(-1);
        }
        break;

      case 40: // down
        if ( key.altKey ) {
          //duplicateMarqer(id, track - 1)
          console.log("no duplicate yet");
        }else{
          clearTimeout( saveTimeout );
          updateSelectedMarqer();
          selectSibling(1);
        }
        break;

      case 39: // right
        if ( key.altKey ) {
          var newpos = (selected_marqer_item.position().left + selected_marqer_item.width()) - step;
          selected_marqer_item.css('width', newpos - selected_marqer_item.position().left + 'px' );
          selected_marqer_item.css('left', "+=" + step + 'px' );
        }else{
          selected_marqer_item.css('left','+='+step+'px');
        }

        if ( key.ctrlKey ) {
          // move outpoint
        }

        // failsafe: don't get bigger then the tracks
        if ( selected_marqer_item.position().left < 0 ) selected_marqer_item.css('left', '0px');
        if ( selected_marqer_item.width() > ( $('#tracks').width() - selected_marqer_item.position().left ) ) {
          selected_marqer_item.css('width', $('#tracks').width() - selected_marqer_item.position().left + 'px' );
        }

        do_update = true;
        break;

      case 37: // left
        if ( key.altKey ) {
          var newpos = selected_marqer_item.position().left - step;
          selected_marqer_item.css('width', selected_marqer_item.position().left - newpos + selected_marqer_item.width() +'px'  );
          selected_marqer_item.css('left', newpos + 'px' );
        }else{
          selected_marqer_item.css('left','-='+step+'px');
        }

        if ( key.ctrlKey ) {
          // move outpoint ?
        }

        // failsafe: don't get bigger then the tracks
        if ( selected_marqer_item.position().left < 0 ) selected_marqer_item.css('left', '0px');
        if ( selected_marqer_item.width() > ( $('#tracks').width() - selected_marqer_item.position().left ) ) {
          selected_marqer_item.css('width', $('#tracks').width() - selected_marqer_item.position().left + 'px' );
        }

        do_update = true;
        break;

      case 13: // enter
        keysEnabled = false;
        selected_marqer_item.find('.edit_button').trigger('click');
        break;

      case 32: // space
        doControl('playPause');
        break;

      case 9:  // tab
        keysEnabled = false;
        selected_marqer_item.find('.position_button').trigger('click');
        break;

      case 36: // home
        selected_marqer_item.css('left',0);
        do_update = true;
        break;

      case 35: // end
        selected_marqer_item.css('left', $('#tracks').width() - selected_marqer_item.width() + 'px' );
        do_update = true;
        break;

      case 83: // s (tart)
        pop.currentTime(0)
        break;

      case 69: // e (nd)
        pop.currentTime( pop.duration() )
        break;

      case 46:  // del
        selected_marqer_item.find('.delete_button').trigger('click');
        //do_update = true;
        break;

      case 73:  // i
        if (  $('#scrubber').position().left > ( selected_marqer_item.position().left + selected_marqer_item.width() ) ) {
          alert(t.user_interface.in_out);
          return;
        }
        selected_marqer_item.css('width', ( selected_marqer_item.position().left - $('#scrubber').position().left ) + selected_marqer_item.width() +'px'  );
        selected_marqer_item.css('left', $('#scrubber').css('left'));
        setTimeout( function() { updateSelectedMarqer() }, 200 );
        break;

      case 79:  // o
        if (  $('#scrubber').position().left < selected_marqer_item.position().left ) {
          alert(t.user_interface.out_in);
          return;
        }
        selected_marqer_item.css('width', $('#scrubber').position().left - selected_marqer_item.position().left + 'px' );
        setTimeout( function() { updateSelectedMarqer() }, 200 );
        break;

      case 188: // ,
        if (pop.currentTime() - time_step < 0 ) return;
        doControl('seekTo', pop.currentTime() - time_step );
        break;

      case 190: // .
        if (pop.currentTime() + time_step > pop.duration() ) return;
        doControl('seekTo', pop.currentTime() + time_step );
        break;

      case 219: // [
        var m = getMarqerById( selected_marqer_item.data('remote_id') );
        doControl('seekTo', m.in );
        updateSelectedMarqer();
        break;

      case 221: // ]
        var m = getMarqerById( selected_marqer_item.data('remote_id') );
        doControl('seekTo', m.out );
        updateSelectedMarqer();
        break;

      case 186: // ] on azerty
        var m = getMarqerById( selected_marqer_item.data('remote_id') );
        doControl('seekTo', m.out );
        updateSelectedMarqer();
        break;

      case 57: // ç on azerty
        var m = getMarqerById( selected_marqer_item.data('remote_id') );
        doControl('seekTo', m.out );
        updateSelectedMarqer();
        break;

      case 70:  // f
        selected_marqer_item.css( 'left', "1px" );
        selected_marqer_item.css( 'width', ( $('#tracks').width() - 1 ) + 'px' );
        do_update = true;
        break;

      default:
        break;
    }

    // set the save timeout
    clearTimeout( saveTimeout );
    if ( do_update )saveTimeout = setTimeout( function() { console.log("UPDATE TIMEOUT"); updateSelectedMarqer() }, 1000 );
  });
};

$('.zoomContainer').focusin( function() { keysEnabled = true }  );
$('.zoomContainer').focusout( function() { keysEnabled = false } );
initEditorKeys();

// more helpers
var updateSelectedMarqer = function() {
  // fake an event and ui
  // ui.helper.context == element
  // event.target == trackline
  if ( selected_marqer_item == undefined || selected_marqer_item == null ) return;
  var ui = { helper: { context: selected_marqer_item } };
  var event = { target: selected_marqer_item.parent().parent() };
  console.log("initiate update", event, ui);
  initiateUpdateMarqer( event, ui );
};

// temp, this should select
// a (semi) logical 'next' and 'previous' trackevent
var selectSibling = function(_dir) {
  var current_index = -1;
  var c = 0;
  if (selected_marqer_item == undefined) {
    current_index = 0;
  }else{
    $('.trackeventcontainer').find('.marqer_item').each(function(k, value) {
      if ( $(value).data("remote_id") == selected_marqer_item.data("remote_id") ) { current_index = c }
      c++;
    });
  }

  // now select the next one
  if ( current_index != -1 ) {
    current_index += _dir;
    if ( current_index == $('.trackeventcontainer').find('.marqer_item').length ) current_index = 0;
    if ( current_index == -1 ) current_index = $('.trackeventcontainer').find('.marqer_item').length - 1;

    // now set it
    selected_marqer_item = $($('.trackeventcontainer').find('.marqer_item')[current_index]);
    selected_marqer_item.trigger('mousedown');
    last_selected_marqer_item_id = selected_marqer_item.data('remote_id');
  }
};

////
// TrackLine Handlers
/////_________________________________________________________________

var createTrackLine = function ( marqer ) {
  var html = "";
  var id = 'trackline_' + Math.round((Math.random() * 100000));
  html += '<div id="'+id+'" class="trackline ui-droppable btn-material-grey-400"></div>';
  //html += '<div class="trackline_expander"></div>';
  $('#tracks').append( html );
  addInteractionToTrackLine( id );
  return $( '#' + id );
};

// highlight selected trackeventcontainers
var last_selected_marqer_item_id = -1;
var selected_marqer_item = null;

var setTrackLineSelection = function() {

  if ( last_selected_marqer_item_id != -1 ) {
    $('.trackeventcontainer .marqer_item').each( function( i, value ) {
      if (last_selected_marqer_item_id == $(value).data("remote_id") ) {
        $(value).removeClass("btn-material-burgundy-transperant");
        $(value).addClass("btn-material-burgundy-highlight-transperant");
        selected_marqer_item = $(value);
      }
    });
  }

  //$('.trackeventcontainer .marqer_item').unbind('mousedown');
  $('.trackeventcontainer .marqer_item').mousedown( function() {
    $('.trackeventcontainer .marqer_item').removeClass("btn-material-burgundy-highlight-transperant");
    $('.trackeventcontainer .marqer_item').addClass("btn-material-burgundy-transperant");
    $(this).removeClass("btn-material-burgundy-transperant");
    $(this).addClass("btn-material-burgundy-highlight-transperant");
    last_selected_marqer_item_id = $(this).data("remote_id");
    selected_marqer_item = $(this);
    keysEnabled = true;
  });

};

// helper, add interaction to freshly created tracklines
var addInteractionToTrackLine = function( id ) {

  // just (re-)do it for all tracklines, but should exempt if Id is given
  $("#tracks").sortable({
    axis: "y",
    stop: function() {
      $('.trackevent').each( function(k, v) {
        var m = getMarqerById( $(v).data("remote_id") )
        m.remote_id = $(v).data("remote_id")
        m.marqeroptions.track = $(v).parent().parent().index()
        updateMarqer(m);
      })
    }
  })

  $(".trackline").droppable({
    accept: ".plugin, .trackevent",
    drop: function( event, ui ) {
      droppedOnTrackLine( event, ui );
    }
  });
};

// helper, select marqer by ID
var selectMarqerById = function (_id) {
  $('.trackeventcontainer .marqer_item').each( function( i, value ) {
    $('.trackeventcontainer .marqer_item').removeClass("btn-material-burgundy-highlight-transperant");
    $('.trackeventcontainer .marqer_item').addClass("btn-material-burgundy-transperant");
    if (_id == $(value).data("remote_id") ) {
      $(value).removeClass("btn-material-burgundy-transperant");
      $(value).addClass("btn-material-burgundy-highlight-transperant");
      selected_marqer_item = $(value);
    }
  });
};

////
// Handle Plugin Drops
/////_________________________________________________________________

// helpers that determine the order of droppables

var wasDroppedOnTrackline = false;
var droppedOnTrackLine = function (event, ui) {
  console.log(" ### DROP ### 1. droppedonttrackline", event, ui);
  wasDroppedOnTrackline = true;

  // from where came the marqer
  if ( $(ui.draggable.context).hasClass('plugin') ) {
    createNewMarqer( $(ui.draggable).data('type'), $(ui.draggable).data('name'), event, null, $(ui.draggable).data('stramien') );

  }else if ( $(ui.draggable.context).hasClass('clone_marqer') ) {
    console.log("ignore this, we need cloning");
    cloneMarqerFromTrackEvent( event, ui );

  }else{
    initiateUpdateMarqer( event, ui );
  }
};

var droppedOnTracks = function (event, ui) {
  setTimeout( function() {
    console.log(" ### DROP ###  2. droppedonttracks", wasDroppedOnTrackline);
    if ( wasDroppedOnTrackline ) {
      wasDroppedOnTrackline = false;
      return;
    }

    wasDroppedOnTrackline = false;
    if ( event.altKey ) {
      console.log("ignore this, we need cloning");
      cloneMarqerFromTrackEvent( event, ui );
    }else{
      createNewMarqer( $(ui.draggable).data('type'), $(ui.draggable).data('name'), event, true, $(ui.draggable).data('stramien') );
    }
  }, 200 );
};

// does not work, without a sense layer on other then Video _type
var droppedOnScreen = function(event, ui) {
  console.log(" ### DROP ###  3. droppedonscreen", event, ui);
  createNewMarqer( $(ui.draggable).data('type'), $(ui.draggable).data('name'), event, true );
};

// --------------
//  CONVERT TRACK DATA to MARQERS
// __________________________________________

// converts displayed values to 'real' values
// per event
var aMarqerIsUpdating = false;
var initiateUpdateMarqer = function( event, ui ) {
  if (aMarqerIsUpdating) return;
  aMarqerIsUpdating = true;

  var m = getMarqerById( $( ui.helper.context ).data('remote_id') );
  var l = $( ui.helper.context ).position().left;
  var w = $( ui.helper.context ).width();
  var t = $('#tracks').width();

  m.in = ( l / t )* pop.duration();
  m.out = ( ( l + w ) / t ) * pop.duration();
  m.remote_id = m.id;

  console.log("initiateUpdateMarqer called on: ", m, "with", event.type);

  // if dropped outside the trackline, add one
  if ( event.type == "drop" || event.type == "dragstop" ) {
    if ( $(event.target).hasClass("trackline") ) {
      m.marqeroptions.track = $(event.target).index();
    }else{
      m.marqeroptions.track = $('.trackline').length - 1;
    }
  }

  // go go go ...
  updateMarqer(m);
  wasDroppedOnTrackline = false;
};

// --------------
//  SCRUBBAR
// __________________________________________

var createTimeLineWithNumbers = function() {

  var timeline = $('.timeline_canvas')[0];
  //$('.timeline_canvas').css('height', '25px')
  //$('.timeline_canvas').css('width', $('#tracks').width() + 'px')
  timeline.height = 25;
  timeline.width = $('#tracks').width();
  //var freq = 24;

  var context = timeline.getContext( "2d" ),
      //inc = $('#tracks').width() / pop.duration() / freq,
      heights = [ 6, 2, 2 ],
      textWidth = context.measureText( secondsToSMPTE( 0 ) ).width + 10,
      lastTimeDisplayed = -textWidth / 2,
      lastP = 0;

  context.clearRect ( 0 , 0 , timeline.width, timeline.height );
  context.translate( 0.5, 0.5 );
  context.font = '10px sans-serif';
  context.beginPath();
  context.imageSmoothingEnabled = true;

  for ( var i = 0, l = pop.duration(); i < l; i ++ ) {
    var p = i * ( timeline.width / pop.duration() );
    if ( ( p - lastP ) > textWidth/4 ) {
      context.moveTo( -~p - ( textWidth / 2 ), 0 );
      context.lineTo( -~p - ( textWidth / 2 ), heights[ i % 3 ] );
      lastP = p;
    }

    if ( ( p - lastTimeDisplayed ) > textWidth ) {
      context.fillText( secondsToSMPTE( i ), -~p - ( textWidth / 2 ) , 21 );
      lastTimeDisplayed = p;
    }
  }

  context.stroke();
  context.closePath();
};

var scrubberClicked = false;
var createScrubbar = function() {

  if ( pop === null || isNaN(pop.duration()) ) return;

  //var scrubber = $('#scrubber');
  //createTimeLineWithNumbers();

  // Add Interaction
  var duration = parseInt(program.meta.moviedescription.duration_in_ms) / 1000; // TODO: make sure a duration in s is also included  
  try {
    duration = pop.duration();
  }catch(e){}
  var container = $('#timeLineContainer');
  var scrollLeft = 0;

  $('.timeline_canvas').click(function(event) {
    doControl('pause', 0);
    $('#scrubber').css('left', ( event.pageX - ( container.offset().left - scrollLeft ) ) + "px");
    pop.currentTime( ( $('#scrubber').position().left / container.width() ) * duration );
  });

  $(document).mousemove( function( event ) {
    if ( scrubberClicked ) {
      if ( event.pageX > ( container.offset().left - scrollLeft ) && event.pageX < ( ( container.offset().left - scrollLeft ) + container.width() ) ) {
        $('#scrubber').css('left', ( event.pageX - ( container.offset().left - scrollLeft ) ) + "px" );
        pop.currentTime( (  $('#scrubber').position().left / container.width() ) * duration );
      } else {
        if ( event.pageX <= ( container.offset().left - scrollLeft ) ) {
          $('#scrubber').css('left', 0);
          pop.currentTime( 0 );
        } else {
          $('#scrubber').css('left', container.width() );
          pop.currentTime( duration );
        }
      }
    }
  });

  $('.timeline_canvas').mousemove( function( event ) {
    //scrollLeft = $('#timeLineContainer').offset().left;
  });

  $('.timeline_canvas').mousedown( function( event ) {
    doControl('pause', 0);
    scrubberClicked = true;
    $('#scrubber').css('left',  event.pageX - ( container.offset().left - scrollLeft ) );
    pop.currentTime( ( $('#scrubber').position().left / container.width() ) * duration );
  });

  $(document).mouseup( function() {
    scrubberClicked = false;
  });
};

////
// SCREEN EDITOR ( Setup for the Screen editor )
/////_________________________________________________________________
var keySafeTimeout;
var startScreenEditor = function( event, ui ) {

  // is this even picked up
  keysEnabled = false; // make room for the screen editor keys

  console.log("start screen editing ", ui.hasClass('is-selected-for-screen-editor') );
  console.log(event, ui);

  if ( ui.hasClass('is-selected-for-screen-editor') ) {
    stopScreenEditor( event, ui );
    return;
  }

  stopScreenEditor( event, ui );

  ui.addClass('is-selected-for-screen-editor');
  ui.removeClass('btn-material-burgundy');
  ui.addClass('btn-material-yellow');

  var currentMarqer = getMarqerById( $(event.target).data('remote_id') );

  // add the editor
  var html = '';
  html += '<div id="screen_editor" tabindex="0">';
  html += '<div class="button btn btn-material-burgundy close_button" id="close_screen_editor"><span class="glyphicon glyphicon-remove"></span><a href="javascript:"></a></div>';
  html += '<div class="button btn btn-material-burgundy grid_button" id="toggle_grid"><span class="glyphicon glyphicon-th"></span><a href="javascript:"></a></div>';
  html += '<div class="se_drag_container ui-widget-content">';
  html += '<div class="se_content_container">';
  html += '</div></div></div>';
  $('#video_frame').prepend(html); // add se editor

  // set stored values to se_drag_container  if any
  // recalculate for size ( once )
  // get parameters
  if ( currentMarqer.marqeroptions.position.value != '' && currentMarqer.marqeroptions.original.value != '' ) {
    var c = { 'width': $('#video_frame').width(), 'height': $('#video_frame').height() };
    var p = JSON.parse( currentMarqer.marqeroptions.position.value );
    var o = JSON.parse( currentMarqer.marqeroptions.original.value );
    var f = { left: 0, top: 0, width: 0, height: 0 };
    var ft = 0;

    // adjust horizontal factor, and movement
    if ( ( ( o.width / o.height ) - ( c.width / c.height ) ) > 0 ) {
      ft = ( c.width / o.width );
      f.left = ( p.left * ft );
      f.top = ( p.top * ft ) + ( ( c.height - ( o.height * ft ) ) / 2 );
    }else{
      ft = ( c.height / o.height );
      f.left = ( p.left * ft )+ ( ( c.width - ( o.width * ft ) ) / 2 );
      f.top = p.top * ft;
    }

    // keep aspect on size
    f.width = p.width * ft;
    f.height = p.height * ft;

    // assign it to the wrapper
    $( ".se_drag_container" ).css({
      'left': f.left + 'px',
      'top': f.top + 'px',
      'width': f.width + 'px',
      'height': f.height + 'px'
    });

    // update tekst elements
    //var mult = 1;
    //$('.se_content_container').children().fitText( 2.0 );
    //$('.se_content_container h1').fitText( 0.8 );
    //$('.se_content_container h2').fitText( 1.0 );
    //$('.se_content_container h3').fitText( 1.4 );
    //$('.se_content_container h4').fitText( 2.0 );
    //$('.se_content_container h5').fitText( 2.2 );
    //$('.se_content_container h6').fitText( 2.6 );
    //$('.se_content_container li').fitText( 1.9 );
  }

  // add the grid
  $('#screen_editor').append( createGrid() );

  // add Title safe
  // TODO
  //function initResize() {
    //if($('.se_drag_container').hasClass("ui-resizable")) return;

    $('.se_drag_container').resizable({
      // grid: [ $('.grid_cell').width()/4, $('.grid_cell').height()/4 ],
      // aspectRatio: true
      handles: "n, e, s, w, ne, se, sw, nw",
      stop: function( event, ui ) {
        updatePosition( event, ui );
      }

    }).draggable({
      containment: "#video_frame",
      snapMode: 'inner',
      snap: '.grid_cell',
      stop: function( event, ui ) {
        updatePosition( event, ui );
      }
    });
  //}

  // seems to need scoping
  // http://stackoverflow.com/questions/26239357/jquery-resizable-is-very-slow-if-many-divs-are-added
  //$('.se_drag_container').mouseenter(function() {
  //  initResize();
  //})

  //$.window .keypress
  //$('.se_drag_container')

  var updatePosition = function( event, ui ) {
    var se = $(event.target);
    console.log("has se: ", se);
    var obj = {
      top: se.offset().top - $('#video_frame').offset().top,
      left: se.offset().left - $('#video_frame').offset().left,
      width: se.width(),
      height: se.height()
    };
    var vt = $('#video_frame');
    var vid = {
      width: vt.width(),
      height: vt.height()
    };

    var p = JSON.stringify(obj);
    var v = JSON.stringify(vid);

    console.log("has values: ", p, v);
    currentMarqer.marqeroptions.position.value = p;
    currentMarqer.marqeroptions.original.value = v;
    currentMarqer.remote_id = currentMarqer.id;

    console.log("SET INITIAL BACK TO FALSE")
    // if type is FreeImageMarqer ... ?
    // extend this to a global update function ... ?
    currentMarqer.marqeroptions.initial = {"type":"hidden", "value": false};

    // go go go ...
    updateMarqer(currentMarqer);
  };

  // add close
  $('#close_screen_editor').click(function() {stopScreenEditor()});
  $('#toggle_grid').click( function() { $('.snapping_grid').toggle() } );
  $(document).keydown( function(e) {
    e.preventDefault(); // prevent the default action (scroll / move caret)

    var d = 1;
    var u = false; // update or not (?)
    if (e.shiftKey) d = 10;
    console.log("################### ", e.which )
    switch(e.which) {

      case 37: // left
        $( ".se_drag_container" ).css("left", "-=" + d);
        u = true;
        break;

      case 52: // left
        $( ".se_drag_container" ).css("left", "-=" + d);
        u = true;
        break;

      case 38: // up
        $( ".se_drag_container" ).css("top", "-=" + d);
        u = true;
        break;

      case 56: // up
        $( ".se_drag_container" ).css("top", "-=" + d);
        u = true;
        break;

      case 39: // right
        $( ".se_drag_container" ).css("left", "+=" + d);
        u = true;
        break;

      case 54: // right
        $( ".se_drag_container" ).css("left", "+=" + d);
        u = true;
        break;

      case 40: // down
        $( ".se_drag_container" ).css("top", "+=" + d);
        u = true;
        break;

      case 50: // down
        $( ".se_drag_container" ).css("top", "+=" + d);
        u = true;
        break;

      case 70: // F
        // full video frame!
        $( ".se_drag_container" ).css({
          "top": -2, // Ow god. Why?!
          "left": -2,
          "width": $('#video_frame').width(),
          "height": $('#video_frame').height()
        });
        u = true;
        break;

      case 82: // F
        // (hard) reset
        $( ".se_drag_container" ).css({
          "top": "50px",
          "left": "50px",
          "width": "320px",
          "height": "240px",
        });
        u = true;
        break;


      case 13: // enter
        stopScreenEditor();
        break;

      case 27: // esc
        stopScreenEditor();
        break;

      default: return;
    }

    clearTimeout( keySafeTimeout );
    keySafeTimeout = setTimeout( function() {
      var fakeEvent = { target: ".se_drag_container" };
      updatePosition( fakeEvent );
    }, 400 );
  });

  // stop this on out-click
  $('#screen_editor').focusout( function() { stopScreenEditor(); } );
  $('#screen_editor').focusin( function() {} );
  keysEnabled = false;
};

var createGrid = function() {
  var grid = "";
  grid += '<div class="snapping_grid" style="width:'+$('#video_frame').width()+'px;height:'+$('#video_frame').height()+'px">';

  var sizes = [
    4,4,1,2,2,2,2,2,2,1,4,4,
    4,4,1,2,2,2,2,2,2,1,4,4,
    5,5,3,0,0,0,0,0,0,3,5,5,
    5,5,3,0,0,0,0,0,0,3,5,5,
    5,5,3,0,0,0,0,0,0,3,5,5,
    5,5,3,0,0,0,0,0,0,3,5,5,
    5,5,3,0,0,0,0,0,0,3,5,5,
    5,5,3,0,0,0,0,0,0,3,5,5,
    4,4,1,2,2,2,2,2,2,1,4,4,
    4,4,1,2,2,2,2,2,2,1,4,4
  ];

  var sizes_BROKEN = [
    4,4,1,2,2,2,2,2,2,2,2,2,2,1,4,4,
    5,5,3,0,0,0,0,0,0,0,0,0,0,3,5,5,
    5,5,3,0,0,0,0,0,0,0,0,0,0,3,5,5,
    5,5,3,0,0,0,0,0,0,0,0,0,0,3,5,5,
    5,5,3,0,0,0,0,0,0,0,0,0,0,3,5,5,
    5,5,3,0,0,0,0,0,0,0,0,0,0,3,5,5,
    5,5,3,0,0,0,0,0,0,0,0,0,0,3,5,5,
    5,5,3,0,0,0,0,0,0,0,0,0,0,3,5,5,
    4,4,1,2,2,2,2,2,2,2,2,2,2,1,4,4
  ];

  var n = sizes.length;

  function getSize(num){
    var size = { 'width':0, 'height':0 };

    switch( sizes[num] ) {
      case 0:
        size = { 'width':'12.5%', 'height':'12.5%' };
        break;

      case 1:
        size = { 'width':'6.25%', 'height':'6.25%' };
        break;

      case 2:
        size = { 'width':'12.5%', 'height':'6.25%' };
        break;

      case 3:
        size = { 'width':'6.25%', 'height':'12.5%' };
        break;

      case 4:
        size = { 'width':'3.125%', 'height':'6.25%' };
        break;

      case 5:
        size = { 'width':'3.125%', 'height':'12.5%' };
        break;

      default:
        size = { 'width':'12.5%', 'height':'12.5%' };
        break;
    }

    return size;
  }

  for ( var i = 0; i < n; i++ ) grid += '<div class="grid_cell" style="width:'+getSize(i).width+';height:'+getSize(i).height+';">&nbsp</div>';
  grid += '</div> <!-- end grid -->';
  return grid;
};

var stopScreenEditor = function() {
  $('.is-selected-for-screen-editor').removeClass('btn-material-yellow');
  $('.is-selected-for-screen-editor').addClass('btn-material-burgundy');
  $('.is-selected-for-screen-editor').removeClass('is-selected-for-screen-editor');
  $('#screen_editor').remove();
  $(document).unbind('keydown');
  initEditorKeys();
  keysEnabled = true;
};

////
// MARQER STRATUM HANDLERS
/////_________________________________________________________________

var saveMarqerStratum = function( m ) {

  var data = {
    type: m.type,
    label: m.title,
    name: m.marqeroptions.title.value,
    marqeroptions: JSON.stringify(m.marqeroptions)
  }

  // save
  $.post('/marqerstratum/', data, function() {
    updateStramienen()
  }).fail(function() {
    console.log("saving stratum failed")
  })
}


////
// CREATE TRACKEVENTS FROM CURRENT MARQER DATA
/////_________________________________________________________________

var convertMarqersIntoTrackevents = function( m, select_id ) {
  $('#tracks').html('');

  if ( m === undefined ) m = program.marqers;
  $.each( m, function( i, marqer ) {
    if ( marqer.marqeroptions.track !== null && marqer.marqeroptions.track !== undefined && marqer.marqeroptions.track !== -1 ) {

      // make tracks untill track number is met, allows for multiple trackevents per track
      if ( ( $('.trackline').length - 1 ) < marqer.marqeroptions.track ) {
        while( ( $('.trackline').length - 1 ) < marqer.marqeroptions.track ) createTrackLine();
      }

      var addTrack = $( '#' + $('.trackline:eq('+marqer.marqeroptions.track+')').attr('id') );
      createTrackEvent( marqer, addTrack, select_id );
    }else{
      // marqer has no track data, add it to the bottom
      createTrackEvent( marqer, createTrackLine(), select_id );
    }
  });

  // finally create one extra trackline
  createTrackLine()
  $('.trackline').last().css({'opacity': 0.4, 'height':'10px'})

  // initiate selector
  setTrackLineSelection();
};

////
// INITS
/////_________________________________________________________________

var init_draggables = function() {
  addInteractionToTrackEvent();

  // Tracks
  $( "#tracks" ).disableSelection();
  $( "#tracks" ).droppable({
    accept: ".plugin,.clone_marqer",
    drop: function( event, ui ) {
      console.log("drop on tracks");
      droppedOnTracks(event, ui);
    }
  });

  // Tracklines
  addInteractionToTrackLine();

  // Screen
  $( "#video_container" ).droppable({
    accept: ".plugin",
    drop: function( event, ui ) {
      droppedOnScreen(event, ui);
    }
  });
};
