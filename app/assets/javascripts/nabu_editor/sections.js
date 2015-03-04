/* globals
controlsAreVisible
margin_select_video
shapeshiftOptions
postMetaData

*/

// THIS DOCUMENT NEEDS CLEAN UP!

// TODO: Rewrite to: toggleVideo
var animateVideoUp = function() { 
  $('.video_holder').animate({'height':'10vh' }, 540);  
  $('#video_frame').animate({'width': '22vh' }, 540);        
  $('#video_frame').animate({'margin-right': '20px' }, 540);
  $('#video_frame').css({"float": "right"});
};

var animateVideoDown = function() { 
  $('.video_holder').animate({'height':'60vh' }, 400);
  $('#video_frame').animate({'width': '100%' }, 540, function() { $('#video_frame').css({"float": "inherit"}) } );
  $('#video_frame').animate({'margin-right': '0' }, 100);
};

//Hide Sections 
var hideCreateMovie = function() {
  if( $('.video_uploader_container').is(':visible') ) {
    $('.video_uploader_container').fadeOut('fast');
  }
};

var hidePublishMovie = function () {
  if ( $('.video_publish_container').is(':visible') ) {
    $('.video_publish_container').fadeOut('fast');       
  }
};

var hideDescribeMovie = function () {
  if ( $('.video_describe_container').is(':visible') ) {
    $('.video_describe_container').fadeOut('fast');    
  }
};

var hideDescribeAdvancedMovie = function() {
  if ( $('.describe_movie_advanced').is(':visible') ) {
    $('.describe_movie_advanced').fadeOut('fast');    
  }
};

var hideVideoContainer = function () {
  if ( $('.select_videos').is(':visible') ) {
    $('.select_videos').fadeOut('fast');
  }
};

// TODO rename this, it handles all elements
var hideMarqersRightMenu = function () {
  if ( $(".marqers_container").is(':visible' ) ) {
    $('.marqers_container').fadeOut('fast');
    $('#timeLineContainer').fadeOut('fast');
    $('#screen').fadeOut('fast');
  }
};

// TODO rename this, it handles all elements
var showMarqersRightMenu = function () {
  if ( $(".marqers_container").is(':hidden' ) ) {
    $('.marqers_container').fadeIn('fast');
    $('#timeLineContainer').fadeIn('fast');
    $('#screen').fadeIn('fast');
    setTimeout( function() { createScrubbar() }, 600 );
  }
};

var hideChannels = function() {
  if ( $(".menu_editor").is(':visible' ) ) {
    $('.channels_container').fadeOut('fast');
    $('.menu_editor').fadeOut('fast');
  }  
};

var showChannels = function() {
  if ( $(".menu_editor").is(':hidden' ) ) {
    $('.menu_editor').fadeIn('fast');
  }  
};

var showHelpers = function () {
  if( $('.helpers').is(":hidden") ) {
    $('.helpers').fadeIn('fast');
  }
};

var hideHelpers = function () {
  if( $('.helpers').is(":visible") ) {
    $('.helpers').fadeOut('fast');
  }
};



  // ###########################################
  // ### TOGGLE CHANNELS SCREEN WITH OVERLAY
  // ###########################################

function hideChannelContainer() {
  $('#publish_menu_container_overlay').fadeIn();
  $('.helpers').fadeIn('fast');
  $('.channels_container').hide("slide", { direction: "right" }, 500);
};

function showChannelContainer() {
  $('#publish_menu_container_overlay').fadeOut();
  $('.helpers').fadeOut('fast');
  $('.channels_container').show("slide", { direction: "right" }, 500);
  $('.video_publish_container').fadeOut('fast');
  $('#video_frame').css('opacity', '1');
  animateVideoUp();
};

// ### Sections
var showCreateMovie = function( force, with_upload ) { 
  $('.navigation .btn').removeClass('btn-material-pink');
  $('.navigation .btn').addClass('btn-material-blue-grey');

  if( $('.video_uploader_container').is(':visible') ) {
    $('.video_uploader_container').fadeOut('fast');
    $('#video_frame').animate({'opacity':'1'});
    if (controlsAreVisible) $('#nabu_controls').fadeIn('fast');  

  }else{
    //$('#butt-down').trigger('click')
    $('.video_uploader_container').fadeIn('slow');
    $('.video_describe_container').hide();
    $('#video_frame').animate({'opacity':'0.4'});
    $('#nabu_controls').fadeOut('slow');
    $('.select_videos').fadeIn();
    $('#create_butt').removeClass('btn-material-blue-grey');
    $('#create_butt').addClass('btn-material-pink');
    
    //Show/hide helpers
    $('.bubble').fadeOut('fast',function(){
      setTimeout(function(){$('.upload_helper').fadeIn('fast');}, 300);
    });

    
    hideMarqersRightMenu();
    hideChannels();
    showHelpers();
    showVideosAlways();
    hideChannelContainer();
    animateVideoDown();        
    //$('.big-play').addClass('hidden')
  }
  
  setTimeout( function() { margin_select_video() }, 500);
  
  if( $('.video_publish_container').is(':visible') ) {
     $('.video_publish_container').fadeOut('fast');
     $('.video_uploader_container').fadeIn('fast') ;
  }
  
  setTimeout( function() { $('.leprograms').shapeshift( shapeshiftOptions() ) }, 800 );  
};

// $('.navigation .btn').removeClass('btn-material-pink')
// $('.navigation .btn').addClass('btn-material-blue-grey')

var showDescribeMovie = function( with_upload ) { 
  
  console.log("show descibr movie");
  
  $('.navigation .btn').removeClass('btn-material-pink');
  $('.navigation .btn').addClass('btn-material-blue-grey');

  if ( with_upload == true ) {
    $('.show_upload').show();
    $('.bottom_buttons').hide();
  }else{
    $('.show_upload').hide();
    $('.bottom_buttons').show();
  }

  if ( $('.video_describe_container').is(':visible') ) {
    $('.video_describe_container').fadeOut('fast');    
    if (controlsAreVisible) $('#nabu_controls').fadeIn('fast'); 
    $('#video_frame').animate({'opacity':'1'});
    //$('.select_videos').fadeIn()

  }else{
    //$('#butt-up').trigger('click')
    $('.video_describe_container').fadeIn('slow');
    $('.video_uploader_container').hide();
    //$('.select_videos').hide()
    $('#nabu_controls').fadeOut('slow');
    $('#describe_butt').removeClass('btn-material-blue-grey');
    $('#describe_butt').addClass('btn-material-pink');
    
    // attach save
    $('#save_movie').unbind('click');
    $('#save_movie').click( function() { 
      $('#save_movie').removeClass('btn-material-pink');
      $('#save_movie').addClass('btn-material-yellow');      
      postMetaData(); 
    })
    
    hideChannelContainer();
    hideMarqersRightMenu();
    hideChannels();
    showHelpers();
    showVideosAlways();
    animateVideoDown();    

    $('#advanced').unbind('click');
    $('#advanced').click( showDescribeAdvancedMovie );

    $('#close_button').unbind('click');
    $('#close_button').click( function() {      
      showDescribeMovie();
    });
    
    
    //Show/hide helpers
    $('.bubble').fadeOut('fast',function(){
      setTimeout(function(){$('.describe_helper').fadeIn('fast');}, 300);
    });
    
    
    //$('.big-play').addClass('hidden')
  } 
  
  setTimeout( function() { margin_select_video() }, 600);
  
  if($('.video_publish_container').is(':visible') ){
     $('.select_videos').fadeIn('fast');
     $('.video_publish_container').fadeOut('fast') ;
  } 
}
  
var showDescribeAdvancedMovie = function() {
  $('.select_videos').fadeOut('fast', function() {
    $('.describe_movie_advanced').fadeIn('fast');
  });
};


var showSettingsMovie = function() { 
  $('.navigation .btn').removeClass('btn-material-pink');
  $('.navigation .btn').addClass('btn-material-blue-grey');
  
  $('#settings_butt').removeClass('btn-material-blue-grey');
  $('#settings_butt').addClass('btn-material-pink');
  
  hideChannels();
  hideChannelContainer();
  hideCreateMovie();
  hideVideoContainer();
  hideDescribeMovie();
  hideDescribeAdvancedMovie();
  hidePublishMovie();
  hideHelpers();
  animateVideoDown();
  
  setTimeout( function () { showMarqersRightMenu() }, 500);  
  if (controlsAreVisible) $('#nabu_controls').fadeIn('fast');    
  setTimeout( function() { margin_select_video() }, 500);
};

var showPublishMovie = function() { 
  $('.navigation .btn').removeClass('btn-material-pink');
  $('.navigation .btn').addClass('btn-material-blue-grey');
    
  if ( $('.video_publish_container').is(':visible') ) {
    $('.video_publish_container').fadeOut('fast');       
    $('#publish_butt').removeClass('btn-material-pink');
    $('#publish_butt').addClass('btn-material-blue-grey');
    $('#video_frame').animate({'opacity':'1'});
  }else{
    $('.video_publish_container').fadeIn('fast');
    $('#publish_butt').removeClass('btn-material-blue-grey');
    $('#publish_butt').addClass('btn-material-pink');
  }
  $('.video_publish_container').fadeIn('fast');
  
  hideCreateMovie();
  hideVideoContainer();
  hideDescribeAdvancedMovie();
  hideDescribeMovie();
  hideMarqersRightMenu();
  showChannels();
  animateVideoDown();
  hideChannelContainer()
  // showMenuEditor()
  
  showHelpers();

    
  setTimeout( function () {
    showHelpers();
    margin_select_video();
  }, 500);

  
  //Show/hide helpers
  $('.bubble').fadeOut('fast',function() {  
    setTimeout(function(){$('.publish_helper').fadeIn('fast');}, 300);
  });
};

var showVideosAlways = function() {
  if($('.describe_movie_advanced').is(':visible')) {
    $('.describe_movie_advanced').fadeOut('fast', function() {
      $('.select_videos').fadeIn('fast');
    });
  } else {
    $('.select_videos').fadeIn('fast');
  }
};