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

// ### Sections
var showCreateMovie = function( force ) { 
  $('.navigation .btn').removeClass('btn-material-pink')
  $('.navigation .btn').addClass('btn-material-blue-grey')

  if( $('.video_uploader_container').is(':visible') ) {
    $('.video_uploader_container').fadeOut('fast');
    $('#video_frame').animate({'opacity':'1'})
    $('#nabu_controls').fadeIn('fast')   
  }else{
    //$('#butt-down').trigger('click')
    $('.video_uploader_container').fadeIn('slow')
    $('#video_frame').animate({'opacity':'0.4'})
    $('#nabu_controls').fadeOut('slow')
    $('.video_describe_container').hide()
     $('.select_videos').fadeIn()
    $('#create_butt').removeClass('btn-material-blue-grey')
    $('#create_butt').addClass('btn-material-pink')
    //Show/hide helpers
    $('.bubble').fadeOut('fast',function(){
      setTimeout(function(){$('.upload_helper').fadeIn('fast');}, 300)
    })
    
    showVideosAlways()
    //$('.big-play').addClass('hidden')
  }
  
  if( $('.video_publish_container').is(':visible') ) {
     $('.video_publish_container').fadeOut('fast')
     $('.video_uploader_container').fadeIn('fast') 
  }
}

// $('.navigation .btn').removeClass('btn-material-pink')
// $('.navigation .btn').addClass('btn-material-blue-grey')

var showDescribeMovie = function() { 
  $('.navigation .btn').removeClass('btn-material-pink')
  $('.navigation .btn').addClass('btn-material-blue-grey')

  if ( $('.video_describe_container').is(':visible') ) {
    $('.video_describe_container').fadeOut('fast');    
    $('#nabu_controls').fadeIn('fast') 
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
    
    showVideosAlways()

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
  $('#publish_butt').removeClass('btn-material-blue-grey')
  $('#publish_butt').addClass('btn-material-pink')
  
  if ( $('.video_describe_container').is(':visible') ) {
    $('.video_publish_container').fadeOut('fast')
  }else{
    $('.video_publish_container').fadeIn('fast')
  }
  
  showVideosAlways()
  
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
  $('.helpers').fadeOut('fast',function() {
    $('.marqers_container').fadeIn('fast')
  })
  $('.select_videos').fadeOut('fast',function() {
    $('.editor_container').fadeIn('fast')
  })
  
  if($('.video_uploader_container').is(":visible")) {
    $(".video_uploader_container").fadeOut('fast')
  }
  
}

var showVideosAlways = function() {
  if($('.describe_movie_advanced').is(':visible')) {
    $('.describe_movie_advanced').fadeOut('fast', function() {
      $('.select_videos').fadeIn('fast')
    })
  }
}