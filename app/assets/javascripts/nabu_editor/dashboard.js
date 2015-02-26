// neccesary variables 
// TODO, make these NOT neccessary
var agent
var debug = true
var remoting = false
var pop = null
var program = null
var log = function(a, b, c) {}
var fullscreen = false
var is_embedded = false
var controlsAreVisible = false
var describe_initialized = false
var controls_initialized = false
// REACT reference  
window.filter_table = "not set"

// ### Overrides
// override function nabu/assets/javasctipt/marduq/player.js
function popOnLoadStart() {
  $('#video_frame').fadeIn('slow')  
  if (!describe_initialized ) initDescribe()
  describe_initialized = true
}

// override function nabu/assets/javasctipt/marduq/player.js
function popCanPlay() {
  $('#nabu_controls').fadeIn('slow')  
  initControls()   
  if (controls_initialized) controlsAreVisible = true  
  controls_initialized = true
  $('.playhead').css('width','0');
  margin_select_video();
}

var doSelectMovie = function(id) {
  setProgram( id );
  if ( $('.video_uploader_container').is(':visible') ) showCreateMovie();
  $(".contentwrapper").animate({ scrollTop: 0 }, "slow");
  setTimeout( function() { $('.leprograms').shapeshift( shapeshiftOptions() ) }, 100 );  
}

var doShowMovie = function(id) {  
  setProgram( id );
  if ( $('.video_uploader_container').is(':visible') ) showCreateMovie();
  if ( $('.video_describe_container').is(':visible') ) showDescribeMovie();  
  //if ( $('.describe_movie_advanced').is(':visible') ) showDescribeMovie();  
  if ( $('.editor_container').is(':visible') ) showSettingsMovie();
  if ( $('.video_publish_container').is(':visible') ) showPublishMovie();  
  $(".contentwrapper").animate({ scrollTop: 0 }, "slow");
  setTimeout( function() { $('.leprograms').shapeshift( shapeshiftOptions() ) }, 100 );
}

var doDescribeMovie = function(id) {
  setProgram( id );
  if ( $('.video_uploader_container').is(':visible') ) showCreateMovie();
  if ( !$('.video_describe_container').is(':visible') ) showDescribeMovie();  
  //if ( $('.describe_movie_advanced').is(':visible') ) showDescribeMovie();  
  if ( $('.editor_container').is(':visible') ) showSettingsMovie();
  if ( $('.video_publish_container').is(':visible') ) showPublishMovie();  
  $(".contentwrapper").animate({ scrollTop: 0 }, "slow");
  //showDescribeMovie();
  setTimeout( function() { $('.leprograms').shapeshift( shapeshiftOptions() ) }, 100 );
}

var doTimeLineEditMovie = function(id) {
  setProgram( id );
  if ( $('.video_uploader_container').is(':visible') ) showCreateMovie();
  if ( $('.video_describe_container').is(':visible') ) showDescribeMovie();  
  //if ( $('.describe_movie_advanced').is(':visible') ) showDescribeMovie();  
  if ( !$('.editor_container').is(':visible') ) showSettingsMovie();
  if ( $('.video_publish_container').is(':visible') ) showPublishMovie();  
  $(".contentwrapper").animate({ scrollTop: 0 }, "slow");
  //showSettingsMovie();
  setTimeout( function() { $('.leprograms').shapeshift( shapeshiftOptions() ) }, 100 );
}

var doPublishMovie = function(id) {
  setProgram( id );
  if ( $('.video_uploader_container').is(':visible') ) showCreateMovie();
  if ( $('.video_describe_container').is(':visible') ) showDescribeMovie();  
  //if ( $('.describe_movie_advanced').is(':visible') ) showDescribeMovie();  
  if ( $('.editor_container').is(':visible') ) showSettingsMovie();
  if ( !$('.video_publish_container').is(':visible') ) showPublishMovie();  
  $(".contentwrapper").animate({ scrollTop: 0 }, "slow");
  //showPublishMovie();  
  setTimeout( function() { $('.leprograms').shapeshift( shapeshiftOptions() ) }, 100 );
}

var doDeleteMovie = function(id) {
  setProgram(-1);
  $.ajax({
    url: '/marduq_api/programs/' + id,
    type: 'DELETE',
    success: function() { setPrograms() },
    done: function() {}
  });
}

//Slide down videos if NABU_CONTROLS
//are visible
var margin_select_video = function() {
  if($('#nabu_controls').is(':visible')) {
    $('.select_videos').css("margin-top", "40px");
  } else {
    $('.select_videos').css("margin-top", "0px");
  }
}

setTimeout(margin_select_video(), 800)
// ### Helpers
// update current program
var setProgram = function( id ) {  
  
  if ( program !== null && program.id === id ) return;    
  
  $('#video_frame').fadeOut('fast');
  $('#nabu_controls').fadeOut('slow');
  $('.big-play').addClass('hidden');
  $('#video_frame').animate({'opacity':'1'});
  setTimeout(margin_select_video(), 500) 
  
  if ( program == -1 ) {
    $('.video_uploader_container').fadeOut('slow');
    $('.playhead').css('width','0');
    return;
  }     
  
  $.get('/marduq_api/programs/'+id, function(p) {
    program = p;    
    getPlayer( program, "#video_frame", agent.technology, agent.videotype, null );            
    controlsAreVisible = false;
    setMarqerAfterPopInits()
  });
}

function setMarqerAfterPopInits() {
  console.log("set marqers after in point", program.marqers )
  if ( pop === null || isNaN( pop.duration() ) ) {
    setTimeout( function( mrqs ) { setMarqerAfterPopInits() }, 300 )
  }else{
    resetMarqers()
    setMarqers( program.marqers, pop.duration() );
  }
}

// update all programs
function setPrograms() {
  console.log( "Update Programs: /editor3/get_programs/" )
  // MOUNT_POINTS !!
  $.get( '/editor3/get_programs/', function( resp ) {    
    // update react
    console.log( "Update programs Succes" );
    console.log( resp );
    filter_table.setProps( {'programs': resp } );

    // reset the selected program, if it was updating
    setTimeout( function() { $('.leprograms').find('.selected').animate({'opacity':1}, 200); }, 250 );

  });
};

// update shapeshift
var shapeshiftOptions = function() {  
  var a_w = $('.video_search_wrapper').width()
  var c_w = $('.program_container').width()
  var numColums = Math.floor( a_w / c_w )
  var roomLeft = a_w - ( c_w * numColums )
  var gutterX = Math.floor( roomLeft / ( numColums - 1 ) )   
  return { enableDrag: false, gutterX: gutterX, gutterY: (gutterX/2), paddingX: 20 }
}

function resize_aspect_ratio() {
  var width = $(".video_holder").width();
  var height = width * (9/16);
  $(".video_holder").css({
    "height": height.toFixed(0) + 'px'
  });
}

// ### Main
$(document).ready(function() {
  agent = checkUserAgent()  
  setTimeout(margin_select_video(), 1000)
  // Keep aspect ratio
  $(window).resize(function() {
        resize_aspect_ratio();
      
        var document_width = $(document).width();
        var nav_width = $("nav").width();
        var right_menu_width = $(".right_menu").width();
        var content_wrapper_width = document_width - nav_width - right_menu_width;

        $(".contentwrapper").css("width", content_wrapper_width.toFixed(0) - 2);
      
      // Keep shapeshifter
      setTimeout( function() { $('.leprograms').shapeshift(shapeshiftOptions())} , 800 ); ;
  }).resize();
  
  // Initialize Programs
  setTimeout( function() { $('.leprograms').shapeshift(shapeshiftOptions()); $('.leprograms').fadeIn('slow'); } , 800 ); ;
  
  // Initialize big-play
  $('#nabu_controls').hide();
  $('.big-play').click( function() { 
    $('.big-play').addClass('hidden')    
    doControl('play');
    setTimeout(margin_select_video(), 800) 
  })
  
  

  // TODO: also on swipe up and down
  // rewrite this with a class (?)
  $('#butt-up').click( animateVideoUp )
  $('#butt-down').click( animateVideoDown )  
  
  // Hide the sections  
  $('.video_describe_container').hide()
  $('.video_publish_container').hide()
  $('.describe_movie_advanced').hide()
  $('#timeLineContainer').hide()
  $('.channels_container').hide()
  
  
  //Hide the helpers
  $('.describe_helper').hide()
  $('.publish_helper').hide()
  
  
  /////////////////////////////////////////////////
  //HIDE TESTERS FOR MARQERS FOR TEST PURPOSE ONLY!
  /////////////////////////////////////////////////
  $('.marqers_container').hide();
  
  //Hide the helpers when clicked
  $('.readed').click(function() {
    $(this).parent().fadeOut('fast',function(){
      $(this).addClass('hidden');
    })
  })
});
