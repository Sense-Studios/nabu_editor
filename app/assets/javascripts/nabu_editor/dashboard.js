/* globals
initControls
initDescribe
showCreateMovie
showDescribeMovie
showPublishMovie
showSettingsMovie

checkUserAgent
setDataFromProgram
getPlayer
resetMarqers
setMarqers
animateVideoUp
animateVideoDown
doControl

filter_table
mount_point
*/

// neccesary variables 
// TODO, make these NOT neccessary

var agent;
var debug = true;
var remoting = false;
var pop = null;
var program = null;
var log = function(a, b, c) {};
var fullscreen = false;
var is_embedded = false;
var controlsAreVisible = false;
var describe_initialized = false;
var controls_initialized = false;
var aspect_ratio;
var aspect_height = 9;
var aspect_width = 16;
var smallvideo = false;
var visible_container;
var wasReallyPlaying = false

// REACT reference  
window.filter_table = "not set yet";

// ### Overrides
// override function nabu/assets/javasctipt/marduq/player.js
var popOnLoadStart = function() {
  console.log("POP ON LOAD START")
  $('#video_frame').fadeIn('slow'); 
  // failsafe
  setTimeout( function() { $('#video_frame').css('opacity', 1)}, 800 )
  if (!describe_initialized ) initDescribe();
  describe_initialized = true;
};

// override function nabu/assets/javasctipt/marduq/player.js
var popCanPlay = function () {
  console.log("POP CAN PLAY")
  $('#nabu_controls').fadeIn('slow');   
  initControls(); 
  controlsAreVisible = true;  
  controls_initialized = true;
  $('.playhead').css('width','0');
  margin_select_video();
};

var doSelectMovie = function(id) {
  setProgram( id );
  if ( $('.video_uploader_container').is(':visible') ) showCreateMovie();
  $(".contentwrapper").animate({ scrollTop: 0 }, "slow");
  setTimeout( function() { if ( $('.leprograms').is(":visible") ) $('.leprograms').shapeshift( shapeshiftOptions() ) }, 100 );  
};

var doShowMovie = function(id) {  
  setProgram( id );
  if ( $('.video_uploader_container').is(':visible') ) showCreateMovie();
  if ( $('.video_describe_container').is(':visible') ) showDescribeMovie();  
  //if ( $('.describe_movie_advanced').is(':visible') ) showDescribeMovie();  
  if ( $('.editor_container').is(':visible') ) showSettingsMovie();
  if ( $('.video_publish_container').is(':visible') ) showPublishMovie();  
  $(".contentwrapper").animate({ scrollTop: 0 }, "slow");
  setTimeout( function() { if ( $('.leprograms').is(":visible") ) $('.leprograms').shapeshift( shapeshiftOptions() ) }, 100 );
};

var doDescribeMovie = function(id) {
  setProgram( id );
  if ( $('.video_uploader_container').is(':visible') ) showCreateMovie();
  if ( !$('.video_describe_container').is(':visible') ) showDescribeMovie();  
  //if ( $('.describe_movie_advanced').is(':visible') ) showDescribeMovie();  
  if ( $('.editor_container').is(':visible') ) showSettingsMovie();
  if ( $('.video_publish_container').is(':visible') ) showPublishMovie();  
  $(".contentwrapper").animate({ scrollTop: 0 }, "slow");
  //showDescribeMovie();
  setTimeout( function() { if ( $('.leprograms').is(":visible") ) $('.leprograms').shapeshift( shapeshiftOptions() ) }, 100 );
};

var doTimeLineEditMovie = function(id) {
  setProgram( id );
  if ( $('.video_uploader_container').is(':visible') ) showCreateMovie();
  if ( $('.video_describe_container').is(':visible') ) showDescribeMovie();  
  //if ( $('.describe_movie_advanced').is(':visible') ) showDescribeMovie();  
  if ( !$('.editor_container').is(':visible') ) showSettingsMovie();
  if ( $('.video_publish_container').is(':visible') ) showPublishMovie();  
  $(".contentwrapper").animate({ scrollTop: 0 }, "slow");
  //showSettingsMovie();
  setTimeout( function() { if ( $('.leprograms').is(":visible") ) $('.leprograms').shapeshift( shapeshiftOptions() ) }, 100 );
};

var doPublishMovie = function(id) {
  setProgram( id );
  if ( $('.video_uploader_container').is(':visible') ) showCreateMovie();
  if ( $('.video_describe_container').is(':visible') ) showDescribeMovie();  
  //if ( $('.describe_movie_advanced').is(':visible') ) showDescribeMovie();  
  if ( $('.editor_container').is(':visible') ) showSettingsMovie();
  if ( !$('.video_publish_container').is(':visible') ) showPublishMovie();  
  $(".contentwrapper").animate({ scrollTop: 0 }, "slow");
  //showPublishMovie();  
  setTimeout( function() { if ( $('.leprograms').is(":visible") ) $('.leprograms').shapeshift( shapeshiftOptions() ) }, 100 );
};

var doCopyMovie = function(id) {
  $.ajax({
    url: '/marduq_api/programs/copy/',
    type: 'POST',    
    data: {'program': id },
    success: function() { setPrograms() },
    done: function() {}
  });
}

var doDeleteMovie = function(id) {
  setProgram(-1);
  $.ajax({
    url: '/marduq_api/programs/' + id,
    type: 'DELETE',
    success: function() { setPrograms() },
    done: function() {}
  });
};

//Slide down videos if NABU_CONTROLS
//are visible
var margin_select_video = function() {
  if($('#nabu_controls').is(':visible')) {
    $('.select_videos').css("margin-top", "40px");
    $('#publish_menu_container').css("margin-top", "40px");
    $('.zoominContainer').css("top", "40px");
  } else {
    $('.select_videos').css("margin-top", "0px");
    $('#publish_menu_container').css("margin-top", "0px");
    $('.zoominContainer').css("top", "0px");
  }
};

//resize aspect ratio on selectlist change
var resize_aspect_ration_change = function() {
  aspect_ratio = $('.dropdown_select_ratio').val();
  var arr = aspect_ratio.split(':');
  aspect_width = arr[0];
  aspect_height = arr[1];  
  resize_aspect_ratio();
}

setTimeout( margin_select_video(), 800 );

// ### Helpers
// update current program
var setProgram = function( id ) {  
  console.log("set program: ", id )
  if ( program !== null && program.id === id ) return;      
  
  $('#video_frame').fadeOut('fast');
  $('#nabu_controls').fadeOut('slow');
  $('.big-play').addClass('hidden');
  $('#video_frame').animate({'opacity':'1'});
  setTimeout(margin_select_video(), 500);
  
  if ( id == -1 || id == "-1") {
    $('.video_uploader_container').fadeOut('slow');
    $('.playhead').css('width','0');
    return;
  }     
  
  // add id to url
  window.location.hash = "i" + id;
  
  // retreive the program from the server
  
  // #######################################################
  // ### THIS NEEDS TO BE FUCKING SCOPED with CLIENT ID !!!!
  // #######################################################
  
  $.get('/marduq_api/programs/'+id, function(p) {
    program = p;    
    getPlayer( program, "#video_frame", agent.technology, agent.videotype, null );            
    controlsAreVisible = false;
    setMarqerAfterPopInits();
    setDataFromProgram();
    setDisabledStatesLeftMenu();
    setSocial()
    if(!smallvideo) {
      setTimeout( resize_aspect_ratio, 200);   
    } 
  });
};

function setDisabledStatesLeftMenu() {
  if( pop === null ) {
    $("#describe_butt").addClass("disabled");
    $("#settings_butt").addClass("disabled");
    console.log("add disabled");
  }else {
    $("#describe_butt").removeClass("disabled");
    $("#settings_butt").removeClass("disabled");
    console.log("remove disabled");
  }
}

function setDisabledStatePublish() {
  console.log("aantal movies = " + $('.program_container').length);
  if($('.program_container').length == 0 ) {
    $("#publish_butt").addClass("disabled");
  } else {
    $("#publish_butt").removeClass("disabled");
  }
}

// wait for pop and set marqers
function setMarqerAfterPopInits() {  
  if ( pop === null || isNaN( pop.duration() ) ) {
    setTimeout( function( mrqs ) { setMarqerAfterPopInits(); setDisabledStatesLeftMenu(); }, 300 );
  }else{
    resetMarqers();
    setMarqers( program.marqers, pop.duration() );
    convertMarqersIntoTrackevents()    
  }
}

// update all programs
function setPrograms() {
  console.log( "Update Programs: /editor3/get_programs/" );
  
  $.get( '/'+mount_point+'/get_programs/', function( resp ) {    
    // update react
    console.log( "Update programs Succes" );
    console.log( resp );
    filter_table.setProps( {'programs': resp } );
    updatePrograms( resp ) // for edit_menu.js, or the publish menu list

    // reset the selected program, if it was updating
    setTimeout( function() { 
      $('.leprograms').find('.selected').animate({'opacity':1}, 200); 
      setDisabledStatePublish();
    }, 500 );
  });
  
}

// update shapeshift
var shapeshiftOptions = function() {  
  var a_w = $('.video_search_wrapper').width();
  var c_w = $('.program_container').width();
  var numColums = Math.floor( a_w / c_w );
  var roomLeft = a_w - ( c_w * numColums );
  var gutterX = Math.floor( roomLeft / ( numColums - 1 ) ); 
  return { enableDrag: false, gutterX: gutterX, gutterY: (gutterX/2), paddingX: 20 };
};

// keep video aspect ratio
function resize_aspect_ratio() {
  console.log("resize aspect ", $('#video_frame').hasClass('fullscreen'))
  if ( $('#video_frame').hasClass('fullscreen') ) {
    $(".video_holder").css({"height": "100%"});
    return;
  }
  var width = $(".video_holder").width();
  var height = width * (aspect_height/aspect_width);
  var fixedheight = height.toFixed(0);
  $(".video_holder").css({
    "height": fixedheight + 'px'
  });
  
  // failsafe for laggy servers (looking at you kaltura)
  setTimeout( function() { 
    if ( $('#video_frame').css('display') == 'none' ) {
      //$('#video_frame').css('display', 'block')
      $('#video_frame').fadeIn('slow');
    }
  }, 500 );
  
  updateMarqerBottomControls(fixedheight)  ;
}

function updateMarqerBottomControls( fh ) {
  if ( fh === undefined ) fh = $('.video_holder').height();
  $('.zoomContainer').css('height', $(document).height() - fh - 42 + 'px');
  $('#tracks').css('height', $(document).height() - fh - 64 + 'px');
  //$('.add_track_area').css('height', $(document).height() - fh - 40 + 'px');
}

function checkURLForPresets() {
  if ( window.location.hash.substring(0,2) == '#i' ) {
    setProgram( window.location.hash.substring(2) );
    showCreateMovie( false );
  }
}

// ### Main
var original_width = $(document).width();
$(document).ready(function() {
  //set var aspect_ratio
  console.log('ready aspect ratio' + aspect_ratio);
  
  $('.logopreview img').change(function(){
    setLogoHeight();
  });
  
  setDisabledStatesLeftMenu();
  setDisabledStatePublish();
  
  // check out the user
  agent = checkUserAgent();
  setTimeout( function() { margin_select_video(); }, 1000);             // fail safe
  setTimeout( function() { $('#video_frame').css('opacity', 1)}, 1500 ) // fail safer
  
  // Keep aspect ratio
  $(window).resize(function() {

    // always move editor
    updateMarqerBottomControls() 

    // Quickfix
    if ( original_width == $(document).width() ) return;
    original_width = $(document).width();

    resize_aspect_ratio();
    var document_width = $(document).width();
    var nav_width = $("nav").width();
    var right_menu_width = $(".right_menu").width();
    var content_wrapper_width = document_width - nav_width - right_menu_width;
    $(".contentwrapper").css("width", content_wrapper_width.toFixed(0) - 2);
  
    // Keep shapeshifter
    setTimeout( function() { if ( $('.leprograms').is(":visible") ) $('.leprograms').shapeshift(shapeshiftOptions())} , 800 );
  }).resize();
  
  // Initialize Programs
  setTimeout( function() { $('.leprograms').shapeshift(shapeshiftOptions()); $('.leprograms').fadeIn('slow'); } , 800 );
  
  // Initialize big-play
  $('#nabu_controls').hide();
  $('.big-play').click( function() { 
    $('.big-play').addClass('hidden');    
    doControl('play');
    setTimeout( function() { margin_select_video() }, 800);
  });
  
  // TODO: also on swipe up and down
  // rewrite this with a class (?)
  $('#butt-up').click( animateVideoUp );
  $('#butt-down').click( animateVideoDown );
  //$('.video_holder').on('swipedown',function(){alert("swipedown..");} );
  //$('.video_holder').on('swipeup',function(){alert("swipedown..");} );
  
  //Material design dropdowns hides the selectlist and shows a UL with listitems
  //The selectlist wont change 
  //This will make it to work for all of them.
  $('.dropdownjs ul li').click(function(){
      var selectedvalue = $(this).attr('value');
      var selected = $(this).parent().parent().prev('.dropdown_select');
      setTimeout(function() {
          $(selected[0]).find('option').removeAttr('selected')
          $(selected[0]).val($(selected[0]).find('option[value="' + selectedvalue + '"]').val()).trigger('change');
          $(selected[0]).find('option[value="' + selectedvalue + '"]').attr('selected', 'selected');
      }, 100);
  });

  $(document).on('change','.dropdown_select_ratio',function(){
    if(!smallvideo) {
      resize_aspect_ration_change() 
    }
  });

  // Hide the sections  
  $('.video_describe_container').hide();
  $('.video_publish_container').hide();
  $('.describe_movie_advanced').hide();
  $('.zoomContainer').hide();
  $('.channels_container').hide();
  
  // Hide the helpers
  $('.describe_helper').hide();
  $('.publish_helper').hide();
    
  /////////////////////////////////////////////////
  //HIDE TESTERS FOR MARQERS FOR TEST PURPOSE ONLY!
  /////////////////////////////////////////////////
  $('.marqers_container').hide();
  
  //Hide the helpers when clicked
  $('.readed').click(function() {
    $(this).parent().fadeOut('fast',function(){
      $(this).addClass('hidden');
    });
  });
  
  // listen for fullscreen, and discard the max height from aspect ratio
  document.addEventListener("fullscreenchange", delayedScreenChange, false);      
  document.addEventListener("webkitfullscreenchange", delayedScreenChange, false);
  document.addEventListener("mozfullscreenchange", delayedScreenChange, false);
  resize_aspect_ratio()
  
  // set the bottom part of the editor
  updateMarqerBottomControls
  
  // check for hash &c
  checkURLForPresets()
});

var delayedScreenChange = function() {
  setTimeout( function() { resize_aspect_ratio() }, 200 );
}
