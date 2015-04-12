/* globals
init_draggables
*/

// main
$(function() {
  // initialize everything drag and drop
  init_draggables();
  // initialize drag/ scrubber
  // Safe fails with play, scrubbing and stuff
  
  var t = 0
  var ui_update = 200
  var ease = 'linear'
  setInterval( function() {
    try {
      var l = ( pop.currentTime() / pop.duration() ) * $('#timeLineContainer').width()     
      //$('#scrubber').animate({'left': l + 'px'}, ui_update, ease );
      $('#scrubber').css({'left': l + 'px'} );
    }catch(e){
      // console.log("boom")
      // no pop and or no video
    } 
  }, ui_update );  
  
  // timeline zooming
  // move to browser rendertick
  var orig = $('#timeLineContainer').width();  
  var ct = 0
  $('#zoom').on("change mousemove", function() {    
    $('#timeLineContainer').css('width', orig * $('#zoom').val() + 'px')
    createTimeLineWithNumbers()
    var newpos = $('#scrubber').position().left - ( $('.zoomContainer').width() / 2 )    
    if ( newpos <= 0 ) newpos = 0    
    $('.zoomContainer').scrollLeft( newpos )
  })
  
  // move to browser rendertick
  setInterval( function() { 
    if (!$('#follow_scrubbar').is(':checked')) return;
    newpos = $('#scrubber').position().left - ( $('.zoomContainer').width() / 2 )    
    $('.zoomContainer').scrollLeft( newpos )
    //$('.zoomContainer').animate({scrollLeft: newpos }, ui_update, ease );
    //$('html, body').animate({scrollLeft: $(currentElement).offset().left}, 800);
  }, ui_update )
  
  // refresh on click
  $('#refresh_marqers').click(function() { preview() });
  $('#remove_all_marqers').click(function() { 
    if ( confirm("Weet je zeker dat je ALLE Marqers wilt VERWIJDEREN ?") ) {
      $.each(marqers, function(i, m) { deleteMarqer(m) } );
      marqers = [];
    }
  });
});