/* globals
controlsAreVisible
margin_select_video
shapeshiftOptions
postMetaData

*/
var marqerToggled;

// THIS DOCUMENT NEEDS CLEAN UP!

// TODO: Rewrite to: toggleVideo
var animateVideoUp = function() {
  smallvideo = true;

  var opacity = 0;
  toggle_overlays( opacity );

  marqerToggled = 0;
  toggleMarqers( marqerToggled );

  var smallHeight = ( 200 / aspect_width ) * aspect_height
  $('.videowrapper').animate({
  	'height': smallHeight + 'px',
  	'width': '200px',
  	'margin-right': '20px'
  }, 540);

  $('.videowrapper').css('margin-top', '1%');
  $('.videowrapper').css("float", "right");
  $('.videowrapper .ui-resizable-se').hide()
  $('#nabu_controls_background').hide()

  setTimeout( function() {
    $('.small_video_description').fadeIn('slow');
  }, 600);

  questionsOnResize()
};

var animateVideoDown = function() {
  smallvideo = false;

  var opacity = 1;
  toggle_overlays( opacity );

  marqerToggled = 1;
  toggleMarqers( marqerToggled );

  resize_aspect_ration_change();

  var bigHeight = ( 640 / aspect_width ) * aspect_height
  $('.videowrapper').css("float", "none");
  $('.videowrapper').animate({'height': bigHeight + 'px', 'width': '640px'}, 240, function() {
  	$('.videowrapper').css('margin', '2% auto');
  });
  $('#nabu_controls_background').show()

  $('.videowrapper .ui-resizable-se').show()
  $('.small_video_description').fadeOut('fast');
  questionsOnResize()
};

var toggle_overlays = function( opacity ) {
  $('.video_uploader_container').fadeOut();
  $('.video_describe_container').fadeOut();
  $('.video_publish_container').fadeOut();
}

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

var hideQuestionsMovie = function () {
  if ( $('.questions_container').is(':visible') ) {
    $('.questions_container').fadeOut('fast');
  }
}

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
    $('.zoomContainer').fadeOut('fast');
    $('.tracklineOptionsContainer').fadeOut('fast');
    $('#screen').fadeOut('fast');
  }
  keysEnabled = false;
};

var showMarqerEditor = function () {
  if ( $(".marqers_container").is(':hidden' ) ) {
    $('.marqers_container').fadeIn('fast');
    $('.zoomContainer').fadeIn('fast');
    $('.tracklineOptionsContainer').fadeIn('fast');
    $('#screen').fadeIn('fast');
    setTimeout( function() { createScrubbar() }, 600 );
    setTimeout( function() { preview() }, 1200 );
  }
};

//var once = false
var qonce = false
var showQuestions = function () {
  if (!qonce) initQuestions(); qonce = true
  generateQuesionsFromProgram();

  if ( $(".questions_container").is(':hidden' ) ) {
    $('.questions_container').fadeIn('fast');
  }
}

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

var toggleMarqers = function( marqerToggled ) {
  if(marqerToggled == 1) {
    $('.marqer').fadeIn();
  } else if(marqerToggled == 0) {
    $('.marqer').fadeOut();
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
  animateVideoUp();
  setTimeout(function() {
    var logoHeight = $('.logopreview img').height();
    $('.logopreview').height(logoHeight);
  }, 500);

};

// ### Sections
var showCreateMovie = function( force, with_upload ) {
  $('.navigation .btn').removeClass('btn-material-pink');
  $('.navigation .btn').addClass('btn-material-blue-grey');

  if( $('.video_uploader_container').is(':visible') ) {
    $('.video_uploader_container').fadeOut('fast');
    if (controlsAreVisible) $('#nabu_controls').fadeIn('fast');

  }else{
    $('#butt-down').trigger('click');
    $('.video_uploader_container').fadeIn('slow');
    $('.video_describe_container').hide();
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
    hideQuestionsMovie();
    marqerToggled = 0;
    toggleMarqers( marqerToggled );
    if ($('.video_frame').height() > 150) {
      animateVideoDown();
    };
  }

  setTimeout( function() { margin_select_video() }, 500);

  if( $('.video_publish_container').is(':visible') ) {
     $('.video_publish_container').fadeOut('fast');
     $('.video_uploader_container').fadeIn('fast') ;
  }

  setTimeout( function() { try { $('.leprograms').shapeshift( shapeshiftOptions() ) } catch(e){} }, 800 );
};

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

  }else{
    $('#butt-down').trigger('click');
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
    hideQuestionsMovie();
    hideChannels();
    showHelpers();
    showVideosAlways();
    marqerToggled = 0;
    toggleMarqers( marqerToggled );
    if ($('.video_frame').height() > 150) animateVideoDown();

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

// show settings
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
  hideQuestionsMovie();
  hidePublishMovie();
  hideHelpers();
  marqerToggled = 1;
  toggleMarqers( marqerToggled );
  if ($('.video_frame').height() > 150) {
    animateVideoDown();
  }

  setTimeout( function () { showMarqerEditor() }, 500);
  if (controlsAreVisible) $('#nabu_controls').fadeIn('fast');
  setTimeout( function() { margin_select_video() }, 500);
};

// show Movietrader/ Questisons, channels etc.
var showQuestionsMovie = function() {
  $('.navigation .btn').removeClass('btn-material-pink');
  $('.navigation .btn').addClass('btn-material-blue-grey');

  $('#questions_butt').removeClass('btn-material-blue-grey');
  $('#questions_butt').addClass('btn-material-pink');

  hideChannels();
  hideChannelContainer();
  hideCreateMovie();
  hideVideoContainer();
  hideDescribeMovie();
  hideDescribeAdvancedMovie();
  hidePublishMovie();
  hideHelpers();
  hideMarqersRightMenu();

  marqerToggled = 1;
  toggleMarqers( marqerToggled );

  if ($('.video_frame').height() > 150) {
    animateVideoDown();
  }

  setTimeout( function () { showQuestions() }, 500);
  if (controlsAreVisible) $('#nabu_controls').fadeIn('fast');
  setTimeout( function() {margin_select_video() }, 500);
}

// publish movies menu, channels etc.
var showPublishMovie = function() {
  $('.navigation .btn').removeClass('btn-material-pink');
  $('.navigation .btn').addClass('btn-material-blue-grey');

  if ( $('.video_publish_container').is(':visible') ) {
    $('.video_publish_container').fadeOut('fast');
    $('#publish_butt').removeClass('btn-material-pink');
    $('#publish_butt').addClass('btn-material-blue-grey');
  }else{
    $('#butt-down').trigger('click');
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
  hideQuestionsMovie();
  showChannels();

  if ($('.video_frame').height() > 150) {
    animateVideoDown();
  }
  marqerToggled = 0;
  toggleMarqers( marqerToggled );
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
