var update = function() {
  // walk through the tracklines and 
  // stack them back into marqers
}

var convertMarqersIntoTrackevents = function( m, select_id ) {
  $('#tracks').html('') // reset
  if ( m === undefined ) m = program.marqers  
  $.each( m, function( i, marqer ) {     
    // right now we create a trackline for every marqer, that is a bit to much
    createTrackEvent( marqer, createTrackLine(), select_id )
  })
}

////
// TrackEvent Handlers
/////_________________________________________________________________

var ids = 1000000 // local id
var createTrackEvent = function( marqer, trackline, select_id ) {
  
  // get the necc. infor from the marqer
  var name, type, remote_id, l, w
  if ( marqer !== undefined ) {
    name = marqer.title
    type = marqer.type
    remote_id = marqer.id
    l = ( ( marqer.in / pop.duration() ) * 100 ) + '%'
    w = ( ( ( marqer.out - marqer.in ) / pop.duration() ) * 100 ) + '%'       
  }else{
    alert('you need a marqer object to create a trackEvent')
    return;
  }

  // create a local id  
  ids++

  // create the element
  var html = '';
  html += '<div class="trackeventcontainer">';
  html += ' <div class="marqer_item trackevent btn-material-burgundy" data-remote_id="'+remote_id+'" id="'+ ids + '" data-type='+type+' data-name="'+name+'" style="left: '+l+'; width: '+w+';">';
  html += '  <p>'  
  html += '   <a class="edit_button" data-remote_id="'+remote_id+'" href="javascript:"><span class="glyphicon glyphicon-pencil"/> </a>';
  html += '   <a class="delete_button" data-remote_id="'+remote_id+'" href="javascript:"><span class="glyphicon glyphicon-trash"/> </a>';
  html += '&nbsp&nbsp' + name
  // html += '   <small> ' + $(ui.draggable).data('type') + '</small>';
  html += '</p></div>';
  html += '</div>';

  console.log("add to t", t)

  // append it to the trackline
  trackline.append( html );
  
  // add interaction to it
  addInteractionToTrackEvent( ids );
  
  // autoselect it?
  if ( select_id == marqer.id ) selectMarqer( marqer )
};

var selectMarqer = function() {
  
}

var deleteTrackEvent = function( trackevent ) {
  console.log('DELETE!');
};

var holder
var addInteractionToTrackEvent = function() {
  
  // make it resizable
  $( ".trackevent" ).resizable({
    handles: 'e,w',
    containment: "parent",
    stop: function( event, ui ) {             
      var m = getMarqerById( $( ui.helper.context ).data('remote_id') )      
      var l = $( ui.helper.context ).position().left
      var w = $( ui.helper.context ).width()
      var t = $('#tracks').width()
      m.in = ( l / t )* pop.duration()
      m.out = ( ( l + w ) / t ) * pop.duration()
      m.remote_id = m.id
      updateMarqer(m)
    }
  });
  
  // make this droppable ?!
  $( ".trackevent" ).draggable({
    // axis: "x",
    // containment: "parent",
    snap: '.trackline',
    snapMode: 'inner',
    containment: '#tracks',
    cursorAt: { bottom : 24 },
    start: function( event, ui ) {
      // save original trackline?
    },
    stop: function( event, ui ) { 
      var m = getMarqerById( $( ui.helper.context ).data('remote_id') )      
      var l = $( ui.helper.context ).position().left
      var w = $( ui.helper.context ).width()
      var t = $('#tracks').width()
      m.in = ( l / t )* pop.duration()
      m.out = ( ( l + w ) / t ) * pop.duration()
      m.remote_id = m.id
      updateMarqer(m)
    }
  });

  $('#' + ids + ' .edit_button').click(function( e ) {       
    showMarqerInfoFromTrackEvent( e, $(this).parent().parent() )
  })
  
  $('#' + ids + ' .delete_button').click(function( e ) {       
    deleteMarqer( getMarqerById( $(this).data('remote_id') ) )
  })

};

////
// TrackLine Handlers
/////_________________________________________________________________

var createTrackLine = function ( marqer ) {
  console.log("create trackline (with trackevent, should be optional) ");
  var html = ""
  var id = 'trackline_' + Math.round((Math.random() * 100000))
  html += '<div id="'+id+'" class="trackline ui-droppable btn-material-grey-400"></div>'
  $('#tracks').append(html)
  addInteractionToTrackLine( id )  
  return $('#' + id)
};

var setTrackLineSelection = function() {  
  $('.trackeventcontainer .marqer_item').unbind('click');
    $('.trackeventcontainer .marqer_item').click(function(){
    $('.marqer_item').removeClass("marqer_item_selected");
    $(this).addClass("marqer_item_selected");
  });
};

var addInteractionToTrackLine = function( id ) {  
  // just (re-)do it for all tracklines
  $(".trackline").droppable({
    accept: ".plugin",
    drop: function( event, ui ) { 
      console.log('drop on trackline');
      droppedOnTrackLine( event, ui );      
    }
  });
}

////
// Handle Plugin Drops
/////_________________________________________________________________

// helpers that determine the order of droppables
// Trackline is first
var wasDroppedOnTrackline = false;
var droppedOnTrackLine = function (event, ui) {
  console.log(" 1. droppedonttrackline", event, ui);
  wasDroppedOnTrackline = true;
  
  // with a marqer comes a trackevent
  createNewMarqer( $(ui.draggable).data('type'), $(ui.draggable).data('name'), event )
}

var droppedOnTracks = function (event, ui) {
  console.log(" 2. droppedonttracks");
  if ( wasDroppedOnTrackline ) {
    wasDroppedOnTrackline = false;
    return; 
  }

  wasDroppedOnTrackline = false;
  createNewMarqer( $(ui.draggable).data('type'), $(ui.draggable).data('name'), event );
};

var droppedOnScreen = function(event, ui) {
  console.log(" 3. droppedonscreen", event, ui);
  createNewMarqer( $(ui.draggable).data('type'), $(ui.draggable).data('name'), event );
};

/* marqer_screen_container */

var scrubberClicked = false
var createScrubbar = function() {
  
  if ( pop === null || isNaN(pop.duration()) ) return;
  
  var scrubber = $('#scrubber')
  var timeline = $('.timeline_canvas')[0]
  timeline.height = "25";
  timeline.width = $('#tracks').width();
  var freq = 24
  
  var context = timeline.getContext( "2d" ),
      inc = $('#tracks').width() / pop.duration() / freq,
      heights = [ 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
      textWidth = context.measureText( secondsToSMPTE( 5 ) ).width,
      lastTimeDisplayed = -textWidth / 2;

  // translate will make the time ticks thin  
  context.translate( 0.5, 0.5 );
  context.beginPath();

  for ( var i = 1, l = pop.duration() * freq; i < l; i++ ) {
    var position = i * inc;
    context.moveTo( -~position, 0 );
    context.lineTo( -~position, heights[ i % freq ] );

    if ( i % freq === 0 && ( position - lastTimeDisplayed ) > textWidth ) {
      lastTimeDisplayed = position;
      context.fillText( secondsToSMPTE( i / freq ), -~position - ( textWidth / 2 ), 21 );
    }
  }
  context.stroke();
  context.closePath();
  
  // Add interaction
  $('.timeline_canvas').click(function(event) {
    $('#scrubber').css('left',  event.pageX - $('#tracks').offset().left );
    pop.currentTime(( ( event.pageX - $('#tracks').offset().left  ) /  $('#tracks').width() ) * pop.duration() );
  });
}

////
// INITS
/////_________________________________________________________________

var init_draggables = function() {

  // Tracks
  $( "#tracks" ).sortable({
    axis: "y",    
    start: function() {},
    end: function() {}
  });

  // Trackevents
  // $( ".trackevent" ).toggle({}) // select ?
  addInteractionToTrackEvent(); 

  // Tracklines
  addInteractionToTrackLine
  
  // Tracks
  $( "#tracks" ).disableSelection();  
  $( "#tracks" ).droppable({
    accept: ".plugin",
    drop: function( event, ui ) {      
      console.log("drop on tracks");     
      droppedOnTracks(event, ui);
    }
  });
  
  // Screen
  $( "#screen" ).droppable({
    accept: ".plugin",
    drop: function( event, ui ) {
      droppedOnScreen(event, ui);
    }
  });
  
  
  // Thingables
  //$( "#sortable" ).sortable();
  //$( "#sortable" ).disableSelection();
  //$( "#resizable" ).resizable().draggable();  
  //$( "#draggable" ).draggable();
  //$( "#droppable" ).droppable({
  //  drop: function( event, ui ) {
  //    $( this )
  //      .addClass( "ui-state-highlight" )
  //      .find( "p" )
  //        .html( "Dropped!" );
  //  }
  //});    
};