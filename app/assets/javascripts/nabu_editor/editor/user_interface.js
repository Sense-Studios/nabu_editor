////
// TrackEvent Handlers
/////_________________________________________________________________

var ids = 1000000 // local id start
var createTrackEvent = function( marqer, trackline, select_id ) {
  
  // get the necc. information from the marqer
  var name, type, remote_id, l, w
  if ( marqer !== undefined ) {
    try{
      if ( marqer.marqeroptions.title.value != '') {
        name = marqer.marqeroptions.title.value
      }else{
        name = marqer.name
      }
    }catch(e){
      name = marqer.name
    }
    
    type = marqer.type
    remote_id = marqer.id
    l = ( ( marqer.in / pop.duration() ) * 100 ) + '%'
    w = ( ( ( marqer.out - marqer.in ) / pop.duration() ) * 100 ) + '%'       
  }else{
    // failsafe and user scolding
    alert('You are being an idiot. You need a marqer object to create a trackEvent')
    return;
  }

  // create a local id  
  ids++

  // create the trackevent element
  var html = '';
  html += '<div class="trackeventcontainer">';
  html += ' <div class="marqer_item trackevent btn-material-burgundy-transperant" data-remote_id="'+remote_id+'" id="'+ ids + '" data-type='+type+' data-name="'+name+'" style="left: '+l+'; width: '+w+';">';
  html += '  <ul class="nav nav-tabs">';
  html += '   <li class="dropdown">';
  html += '    <span class="glyphicon glyphicon-menu-hamburger" aria="" hidden="true"></span>';
  html += '     <a class="dropdown-toggle" href="#" data-toggle="dropdown" data-target="#"></a>';
  html += '     <ul class="dropdown-menu">';
  
  if ( marqer.marqeroptions.position != undefined && marqer.marqeroptions.original != undefined ) {
    html += '      <li><a class="position_button" data-remote_id="'+remote_id+'" href="javascript:"><span class="glyphicon glyphicon-modal-window ignore_events"/>Plaats</a></li>';
  }
  
  html += '      <li><a class="edit_button" data-remote_id="'+remote_id+'" href="javascript:"><span class="glyphicon glyphicon-pencil ignore_events"/>Bewerk</a></li>';
  html += '      <li><a class="delete_button" data-remote_id="'+remote_id+'" href="javascript:"><span class="glyphicon glyphicon-trash ignore_events"/>Verwijder</a></li>';  
  html += '     </ul>'
  html += '    </li>'
  html += '   </ul>';  
  // if marqer.track.hasposition? 
  // --> setPosition?  
  html += '<p>&nbsp&nbsp' + name
  // html += '   <small> ' + $(ui.draggable).data('type') + '</small>';
  html += '</p></div>';
  html += '</div>';

  trackline.append( html );                             // append it to the trackline
  marqer.marqeroptions.track = trackline.index()        // add track index to marqer    
  addInteractionToTrackEvent( ids );                    // add interaction to it    
  if ( select_id == marqer.id ) selectMarqer( marqer )  // autoselect it
};

var selectMarqer = function() { // Depricated
  console.log(' DEPRICATED: Select Marqer');
}

var deleteTrackEvent = function( trackevent ) { // Depricated
  console.log(' DEPRICATED: Delete Track Event');
};

var addInteractionToTrackEvent = function() {
  
  $( ".trackevent" ).resizable({
    handles: 'e,w',
    containment: "parent",
    start: function( event, ui ) {      
      if ( $('.trackeventcontainer .dropdown').hasClass('open') ) event.preventDefault()      
    },
    stop: function( event, ui ) {             
      initiateUpdateMarqer( event, ui )
    }
  });
  
  $( ".trackevent" ).draggable({
    // axis: "x",
    // containment: "parent",
    snap: '.trackline',
    snapMode: 'inner',
    containment: '#tracks',    
    cursorAt: { bottom : 24 },
    start: function( event, ui ) {      
      if ( $('.trackeventcontainer .dropdown').hasClass('open') ) event.preventDefault();      
    },
    drag: function( event, ui ) {},
    stop: function( event, ui ) { 
      initiateUpdateMarqer( event, ui )      
    }
  });

  // Edit-button
  $('#' + ids + ' .edit_button').click(function( e ) {       
    showMarqerInfoFromTrackEvent( e, $(this).closest('.trackevent') )
  })
  
  // Position-button
  $('#' + ids + ' .position_button').click(function( e ) {       
    startScreenEditor( e, $(this).closest('.trackevent') )
  })
  
  // Delete-button
  $('#' + ids + ' .delete_button').click(function( e ) {       
    if ( confirm("Weet je zeker dat je deze Marqer wilt VERWIJDEREN ?") ) {
      deleteMarqer( getMarqerById( $(this).data('remote_id') ) )
    }
  })
};

////
// TrackLine Handlers
/////_________________________________________________________________

var createTrackLine = function ( marqer ) {
  var html = ""
  var id = 'trackline_' + Math.round((Math.random() * 100000))
  html += '<div id="'+id+'" class="trackline ui-droppable btn-material-grey-400"></div>'
  $('#tracks').append( html );
  addInteractionToTrackLine( id );
  return $( '#' + id );
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
    accept: ".plugin, .trackevent",
    drop: function( event, ui ) {       
      droppedOnTrackLine( event, ui );           
    }
  });
}

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
    createNewMarqer( $(ui.draggable).data('type'), $(ui.draggable).data('name'), event )
  }else{    
    initiateUpdateMarqer( event, ui )
  }
}

var droppedOnTracks = function (event, ui) {
  setTimeout( function() {
    console.log(" ### DROP ###  2. droppedonttracks", wasDroppedOnTrackline);
    if ( wasDroppedOnTrackline ) {
      wasDroppedOnTrackline = false;
      return; 
    }
  
    wasDroppedOnTrackline = false;
    createNewMarqer( $(ui.draggable).data('type'), $(ui.draggable).data('name'), event, true );
  }, 200 );
};

// does not work, without a sense layer on other then Video _type
var droppedOnScreen = function(event, ui) {
  console.log(" ### DROP ###  3. droppedonscreen", event, ui);
  createNewMarqer( $(ui.draggable).data('type'), $(ui.draggable).data('name'), event, true );
};

var aMarqerIsUpdating = false
var initiateUpdateMarqer = function( event, ui ) {
  if (aMarqerIsUpdating) return;
  aMarqerIsUpdating = true
  var m = getMarqerById( $( ui.helper.context ).data('remote_id') )      
  var l = $( ui.helper.context ).position().left
  var w = $( ui.helper.context ).width()
  var t = $('#tracks').width()
  m.in = ( l / t )* pop.duration()
  m.out = ( ( l + w ) / t ) * pop.duration()
  m.remote_id = m.id 
  
  console.log("HAS INITIATE UPDATE", event.type)
  // if dropped outside the trackline, add one
  if ( event.type == "drop" || event.type == "dragstop" ) {
    if ( $(event.target).hasClass("trackline") ) {
      m.marqeroptions.track = $(event.target).index()
    }else{
      m.marqeroptions.track = $('.trackline').length
    }
  }
  
  // go go go ... 
  updateMarqer(m)
  wasDroppedOnTrackline = false;
}

// --------------
//  SCRUBBAR
// __________________________________________

var createTimeLineWithNumbers = function() {
  
  var timeline = $('.timeline_canvas')[0]
  //$('.timeline_canvas').css('height', '25px')
  //$('.timeline_canvas').css('width', $('#tracks').width() + 'px')
  timeline.height = 25;
  timeline.width = $('#tracks').width();
  var freq = 24

  var context = timeline.getContext( "2d" ),
      inc = $('#tracks').width() / pop.duration() / freq,      
      heights = [ 6, 2, 2 ]
      textWidth = context.measureText( secondsToSMPTE( 0 ) ).width + 10,      
      lastTimeDisplayed = -textWidth / 2;
      lastP = 0

  context.clearRect ( 0 , 0 , timeline.width, timeline.height );  
  context.translate( 0.5, 0.5 );
  context.font = '10px sans-serif';
  context.beginPath();
  context.imageSmoothingEnabled = true;  
  
  for ( var i = 0, l = pop.duration(); i < l; i ++ ) {
    var p = i * ( timeline.width / pop.duration() )
    if ( ( p - lastP ) > textWidth/4 ) {
      context.moveTo( -~p - ( textWidth / 2 ), 0 ); 
      context.lineTo( -~p - ( textWidth / 2 ), heights[ i % 3 ] );
      lastP = p
    }
    
    if ( ( p - lastTimeDisplayed ) > textWidth ) {      
      context.fillText( secondsToSMPTE( i ), -~p - ( textWidth / 2 ) , 21 );
      lastTimeDisplayed = p;
    }
  }

  context.stroke();
  context.closePath();
}

var scrubberClicked = false
var createScrubbar = function() {
  
  if ( pop === null || isNaN(pop.duration()) ) return;
  
  var scrubber = $('#scrubber')
  createTimeLineWithNumbers()
  
  // Add Interaction    
  var duration = program.meta.moviedescription.duration_in_ms / 1000 // TODO: make sure a duration in s is also included
  try {
    duration = pop.duration()
  }catch(e){}
  var container = $('#timeLineContainer')
  var scrollLeft = 0  

  $('.timeline_canvas').click(function(event) {
    doControl('pause', 0)
    $('#scrubber').css('left', ( event.pageX - ( container.offset().left - scrollLeft ) ) + "px");      
    pop.currentTime( ( $('#scrubber').position().left / container.width() ) * duration );
  });

  $(document).mousemove( function( event ) {
    if ( scrubberClicked ) {
      if ( event.pageX > ( container.offset().left - scrollLeft ) && event.pageX < ( ( container.offset().left - scrollLeft ) + container.width() ) ) {
        $('#scrubber').css('left', ( event.pageX - ( container.offset().left - scrollLeft ) ) + "px" )
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
  })

  $('.timeline_canvas').mousemove( function( event ) {      
    //scrollLeft = $('#timeLineContainer').offset().left;    
  });
  
  $('.timeline_canvas').mousedown( function( event ) {
    doControl('pause', 0)
    scrubberClicked = true;    
    $('#scrubber').css('left',  event.pageX - ( container.offset().left - scrollLeft ) );    
    pop.currentTime( ( $('#scrubber').position().left / container.width() ) * duration );
  });
  
  $(document).mouseup( function() {                
    scrubberClicked = false;
  });
}

////
// SCREEN EDITOR ( Setup for the Screen editor )
/////_________________________________________________________________

var startScreenEditor = function( event, ui ) {
  console.log("start screen editing ", ui.hasClass('is-selected-for-screen-editor') )
  console.log(event, ui)
  
  if ( ui.hasClass('is-selected-for-screen-editor') ) {
    stopStreenEditor( event, ui )
    return
  }
  
  stopStreenEditor( event, ui )
  
  ui.addClass('is-selected-for-screen-editor')  
  ui.removeClass('btn-material-burgundy')
  ui.addClass('btn-material-yellow')
  
  var currentMarqer = getMarqerById( $(event.target).data('remote_id') );

  // add the editor
  var html = '';
  html += '<div id="screen_editor">';
  html += '<div class="button btn btn-material-burgundy close_button" id="close_screen_editor"><span class="glyphicon glyphicon-remove"></span><a href="javascript:"></a></div>';
  html += '<div class="button btn btn-material-burgundy grid_button" id="toggle_grid"><span class="glyphicon glyphicon-th"></span><a href="javascript:"></a></div>';
  html += '<div class="se_drag_container ui-widget-content">';
  html += '<div class="se_content_container">';

  if ( currentMarqer.marqeroptions.image !== undefined && currentMarqer.marqeroptions.image !== null ) {
    html += "<img width='100%' height='100%' src='"+currentMarqer.marqeroptions.image.value+"'/>";
  } else if ( currentMarqer.marqeroptions.html !== undefined && currentMarqer.marqeroptions.html !== null ) {
    html += "<style>" + currentMarqer.marqeroptions.css.value + "</style>";    
    html += "<div width='100%' height='100%' class=" + currentMarqer.marqeroptions.classes.value + ">" +currentMarqer.marqeroptions.html.value + "</div>";
    
  }else{
    html += currentMarqer.marqeroptions.title.value;
  }

  html += '</div></div></div>';
  $('#video_frame').prepend(html); // add se editor  

  // set stored values to se_drag_container  if any
  // recalculate for size ( once )
  // get parameters
  if ( currentMarqer.marqeroptions.position.value != '' && currentMarqer.marqeroptions.original.value != '' ) {
    var c = { 'width': $('#video_frame').width(), 'height': $('#video_frame').height() }      
    var p = JSON.parse( currentMarqer.marqeroptions.position.value );
    var o = JSON.parse( currentMarqer.marqeroptions.original.value );      
    var f = { left: 0, top: 0, width: 0, height: 0 }
    var ft = 0
  
    // adjust horizontal factor, and movement    
    if ( ( ( o.width / o.height ) - ( c.width / c.height ) ) > 0 ) {
      ft = ( c.width / o.width );
      f.left = ( p.left * ft );
      f.top = ( p.top * ft ) + ( ( c.height - ( o.height * ft ) ) / 2 );
    }else{
      ft = ( c.height / o.height )
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
    })
    
    // update tekst elements
    var mult = 1
    $('.se_content_container').children().fitText( 2.0 );
    $('.se_content_container h1').fitText( 0.8 );
    $('.se_content_container h2').fitText( 1.0 );
    $('.se_content_container h3').fitText( 1.4 );
    $('.se_content_container h4').fitText( 2.0 );    
    $('.se_content_container h5').fitText( 2.2 );
    $('.se_content_container h6').fitText( 2.6 );
    $('.se_content_container li').fitText( 1.9 );
  }

  // add the grid
  $('#screen_editor').append( createGrid() )

  // add Title safe
  // TODO
  
  $('.se_drag_container').resizable({    
    // grid: [ $('.grid_cell').width()/4, $('.grid_cell').height()/4 ],
    // aspectRatio: true
    stop: function( event, ui ) { 
      updatePosition( event, ui )
    } 

  }).draggable({
    containment: "#video_frame",        
    snapMode: 'inner',    
    snap: '.grid_cell',        

    stop: function( event, ui ) { 
      updatePosition( event, ui )
    } 
  })
  
  //$.window .keypress 
  //$('.se_drag_container')
  
  var updatePosition = function( event, ui ) {
    var se = $(event.target)    
    var obj = {
      top: se.offset().top,
      left: se.offset().left - $('#video_frame').offset().left,
      width: se.width(),
      height: se.height()
    }
    var vt = $('#video_frame')
    var vid = {
      width: vt.width(),
      height: vt.height()
    }
    
    var p = JSON.stringify(obj)
    var v = JSON.stringify(vid)
    currentMarqer.marqeroptions.position.value = p
    currentMarqer.marqeroptions.original.value = v    
    currentMarqer.remote_id = currentMarqer.id

    // go go go ...       
    updateMarqer(currentMarqer)
  }
  
  // add close
  $('#close_screen_editor').click(function() {stopStreenEditor()})
  $('#toggle_grid').click( function() { $('.snapping_grid').toggle() } )
  $(window).keydown( function(e) { 
    e.preventDefault(); // prevent the default action (scroll / move caret)     
    var d = 1
    var u = false
    if (e.shiftKey) d = 10
    switch(e.which) {
      case 37: // left        
        $( ".se_drag_container" ).css("left", "-=" + d)
        u = true;
        break;

      case 52: // left        
        $( ".se_drag_container" ).css("left", "-=" + d)
        u = true;
        break;
        
      case 38: // up
        $( ".se_drag_container" ).css("top", "-=" + d)
        u = true;
        break;

      case 56: // up
        $( ".se_drag_container" ).css("top", "-=" + d)
        u = true;
        break;

      case 39: // right
        $( ".se_drag_container" ).css("left", "+=" + d)
        u = true;
        break;
        
      case 54: // right
        $( ".se_drag_container" ).css("left", "+=" + d)
        u = true;
        break;

      case 40: // down
        $( ".se_drag_container" ).css("top", "+=" + d)
        u = true;
        break;

      case 50: // down
        $( ".se_drag_container" ).css("top", "+=" + d)
        u = true;
        break;
      
      case 13: // enter
        stopStreenEditor();
        break
      
      case 27: // esc
        stopStreenEditor();
        break

      default: return;
    }    
  })
}
var createGrid = function() { 
  var grid = ""
  grid += '<div class="snapping_grid" style="width:'+$('#video_frame').width()+'px;height:'+$('#video_frame').height()+'px">'
  var w = '12.5%'

  //var w = '25%'
  //var n = 16
  
  var sizes = [
    4,4,1,2,2,2,2,2,2,1,4,4,
    5,5,3,0,0,0,0,0,0,3,5,5,
    5,5,3,0,0,0,0,0,0,3,5,5,
    5,5,3,0,0,0,0,0,0,3,5,5,
    5,5,3,0,0,0,0,0,0,3,5,5,
    5,5,3,0,0,0,0,0,0,3,5,5,
    5,5,3,0,0,0,0,0,0,3,5,5,
    5,5,3,0,0,0,0,0,0,3,5,5,
    4,4,1,2,2,2,2,2,2,1,4,4
  ]
  
  var n = sizes.length
  
  function getSize(num){
    var size = { 'width':0, 'height':0 }
    
    switch( sizes[num] ) {
      case 0:
        size = { 'width':'12.5%', 'height':'12.5%' }
        break;

      case 1:
        size = { 'width':'6.25%', 'height':'6.25%' }
        break;

      case 2:
        size = { 'width':'12.5%', 'height':'6.25%' }
        break;

      case 3:
        size = { 'width':'6.25%', 'height':'12.5%' }
        break;

      case 4:
        size = { 'width':'3.125%', 'height':'6.25%' }
        break;
        
      case 5:
        size = { 'width':'3.125%', 'height':'12.5%' }
        break;

      default:
        size = { 'width':'12.5%', 'height':'12.5%' }
        break;
    }

    return size
  }
  
  for ( var i=0;i<n;i++ ) grid += '<div class="grid_cell" style="width:'+getSize(i).width+';height:'+getSize(i).height+';">&nbsp</div>'        
  grid += '</div> <!-- end grid -->'
  return grid;
}
var stopStreenEditor = function() {
  $(window).unbind('keydown')
  $('.is-selected-for-screen-editor').removeClass('btn-material-yellow');
  $('.is-selected-for-screen-editor').addClass('btn-material-burgundy');
  $('.is-selected-for-screen-editor').removeClass('is-selected-for-screen-editor');
  $('#screen_editor').remove()
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
  
  // Tracks
  $( "#tracks" ).disableSelection();  
  $( "#tracks" ).droppable({
    accept: ".plugin",
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