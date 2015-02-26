// THIS DOCUMENT NEEDS CLEAN UP!

// TODO: Rewrite to: toggleVideo
var animateVideoUp = function() { 
  $('.video_holder').animate({'height':'10vh' }, 540)    
  $('#video_frame').animate({'width': '22vh' }, 540)         
  $('#video_frame').animate({'margin-right': '20px' }, 540)    
  $('#video_frame').css({"float": "right"})       
}

var animateVideoDown = function() { 
  $('.video_holder').animate({'height':'60vh' }, 400)    
  $('#video_frame').animate({'width': '100%' }, 540, function() { $('#video_frame').css({"float": "inherit"}) } )
  $('#video_frame').animate({'margin-right': '0' }, 100)            
}

//Hide Sections 
var hideCreateMovie = function() {
  if( $('.video_uploader_container').is(':visible') ) {
    $('.video_uploader_container').fadeOut('fast');
  }
}

var hidePublishMovie = function () {
  if ( $('.video_publish_container').is(':visible') ) {
    $('.video_publish_container').fadeOut('fast')        
  }
}

var hideSettingsMovie = function () {
  //if ( $('.video_describe_container').is(':visible') ) {
  //  $('.video_describe_container').fadeOut('fast');    
  //}
}

var hideDescribeMovie = function () {
  if ( $('.video_describe_container').is(':visible') ) {
    $('.video_describe_container').fadeOut('fast');    
  }
}

var hideDescribeAdvancedMovie = function() {
  if ( $('.video_describe_advanced').is(':visible') ) {
    $('.video_describe_advanced').fadeOut('fast');    
  }
}

var hideVideoContainer = function () {
  if ( $('.select_videos').is(':visible') ) {
    $('.select_videos').fadeOut('fast')
  }
}

var hideMarqersRightMenu = function () {
  if ( $(".marqers_container").is(':visible' ) ) {
    $('.marqers_container').fadeOut('fast')
    $('#timeLineContainer').fadeOut('fast')
  }
}

var showMarqersRightMenu = function () {
  if ( $(".marqers_container").is(':hidden' ) ) {
    $('.marqers_container').fadeIn('fast')
    $('#timeLineContainer').fadeIn('fast')
  }
}

var hideChannels = function() {
  if ( !$(".channels_container").is(':hidden' ) ) {
    $('.channels_container').fadeOut('fast')
    $('.menu_editor').fadeOut('fast')
  }  
}

var showChannels = function() {
  if ( $(".channels_container").is(':hidden' ) ) {
    $('.channels_container').fadeIn('fast')
    $('.menu_editor').fadeIn('fast')
  }  
}

var showHelpers = function () {
  if( $('.helpers').is(":hidden") ) {
    $('.helpers').fadeIn('fast')
  }
}

var hideHelpers = function () {
  if( $('.helpers').is(":visible") ) {
    $('.helpers').fadeOut('fast')
  }
}


// ### Sections
var showCreateMovie = function( force ) { 
  $('.navigation .btn').removeClass('btn-material-pink')
  $('.navigation .btn').addClass('btn-material-blue-grey')

  if( $('.video_uploader_container').is(':visible') ) {
    $('.video_uploader_container').fadeOut('fast');
    $('#video_frame').animate({'opacity':'1'})
    if (controlsAreVisible) $('#nabu_controls').fadeIn('fast')   
  }else{
    //$('#butt-down').trigger('click')
    $('.video_uploader_container').fadeIn('slow')
    $('.video_describe_container').hide()
    $('#video_frame').animate({'opacity':'0.4'})
    $('#nabu_controls').fadeOut('slow')    
    $('.select_videos').fadeIn()
    $('#create_butt').removeClass('btn-material-blue-grey')
    $('#create_butt').addClass('btn-material-pink')
    //Show/hide helpers
    $('.bubble').fadeOut('fast',function(){
      setTimeout(function(){$('.upload_helper').fadeIn('fast');}, 300)
    })

    hideMarqersRightMenu()
    hideChannels()
    showHelpers()
    showVideosAlways()
    setTimeOut( function() { margin_select_video() }, 500)
    //$('.big-play').addClass('hidden')
  }
  
  if( $('.video_publish_container').is(':visible') ) {
     $('.video_publish_container').fadeOut('fast')
     $('.video_uploader_container').fadeIn('fast') 
  }
  
  setTimeout( function() { $('.leprograms').shapeshift( shapeshiftOptions() ) }, 300 );  
}

// $('.navigation .btn').removeClass('btn-material-pink')
// $('.navigation .btn').addClass('btn-material-blue-grey')

var showDescribeMovie = function( with_upload ) { 
  $('.navigation .btn').removeClass('btn-material-pink')
  $('.navigation .btn').addClass('btn-material-blue-grey')

  if ( with_upload == true ) {
    $('.show_upload').show();
    $('.bottom_buttons').hide()
  }else{
    $('.show_upload').hide();
    $('.bottom_buttons').show()
  }

  if ( $('.video_describe_container').is(':visible') ) {
    $('.video_describe_container').fadeOut('fast');    
    if (controlsAreVisible) $('#nabu_controls').fadeIn('fast') 
    $('#video_frame').animate({'opacity':'1'})
    //$('.select_videos').fadeIn()
  }else{
    //$('#butt-up').trigger('click')
    $('.video_describe_container').fadeIn('slow')        
    $('.video_uploader_container').hide()
    //$('.select_videos').hide()
    $('#nabu_controls').fadeOut('slow')
    $('#describe_butt').removeClass('btn-material-blue-grey')
    $('#describe_butt').addClass('btn-material-pink')
    
    // attach save
    $('#save_movie').unbind('click')
    $('#save_movie').click( function() { 
      $('#save_movie').removeClass('btn-material-pink')
      $('#save_movie').addClass('btn-material-yellow')      
      postMetaData() 
    })
    
    hideMarqersRightMenu()
    hideChannels()
    showHelpers()
    showVideosAlways()
    setTimeOut( function() { margin_select_video() }, 600)

    $('#advanced').unbind('click')
    $('#advanced').click( showDescribeAdvancedMovie )

    $('#close_button').unbind('click')
    $('#close_button').click( showDescribeMovie )
    
    //Show/hide helpers
    $('.bubble').fadeOut('fast',function(){
      setTimeout(function(){$('.describe_helper').fadeIn('fast');}, 300)
    })
    
    
    //$('.big-play').addClass('hidden')
  } 
  
  if($('.video_publish_container').is(':visible') ){
     $('.select_videos').fadeIn('fast')
     $('.video_publish_container').fadeOut('fast') 
  } 
}

var showPublishMovie = function() { 
  $('.navigation .btn').removeClass('btn-material-pink')
  $('.navigation .btn').addClass('btn-material-blue-grey')
    
  if ( $('.video_publish_container').is(':visible') ) {
    $('.video_publish_container').fadeOut('fast')        
    $('#publish_butt').removeClass('btn-material-pink')
    $('#publish_butt').addClass('btn-material-blue-grey')    
    $('#video_frame').animate({'opacity':'1'})
  }else{
    $('.video_publish_container').fadeIn('fast')
    

    $('#publish_butt').removeClass('btn-material-blue-grey')
    $('#publish_butt').addClass('btn-material-pink')
  }
  
  hideCreateMovie()
  hideVideoContainer()
  hideDescribeAdvancedMovie()
  hideDescribeMovie()
  hideMarqersRightMenu()  
  showChannels()
  // showMenuEditor()
  
  showHelpers()
  showVideosAlways()
    
  setTimeout( function () {
    showVideosAlways()
    showHelpers()
    margin_select_video()
  },
  500)

  
  //Show/hide helpers
  $('.bubble').fadeOut('fast',function() {  
    setTimeout(function(){$('.publish_helper').fadeIn('fast');}, 300)
  })
  
}
  
var showDescribeAdvancedMovie = function() {
  $('.select_videos').fadeOut('fast', function() {
    $('.describe_movie_advanced').fadeIn('fast')
  })
}

var showSettingsMovie = function() { 
  $('.navigation .btn').removeClass('btn-material-pink')
  $('.navigation .btn').addClass('btn-material-blue-grey')
  
  $('#settings_butt').removeClass('btn-material-blue-grey')
  $('#settings_butt').addClass('btn-material-pink')
  
  hideCreateMovie()
  hideVideoContainer()
  hideDescribeMovie()
  hideDescribeAdvancedMovie()
  hidePublishMovie()
  hideHelpers()
  hideChannels()
  setTimeout( function () { showMarqersRightMenu() }, 500)  
}

var showVideosAlways = function() {
  if($('.describe_movie_advanced').is(':visible')) {
    $('.describe_movie_advanced').fadeOut('fast', function() {
      $('.select_videos').fadeIn('fast')
    })
  }
}