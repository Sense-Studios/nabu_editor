/* globals
init_draggables
*/

// main
$(function() {
  // initialize everything drag and drop
  init_draggables();

  // initialize drag/ scrubber
  setInterval( function() {
    var l = $('.playhead').width();
    $('#scrubber').css({'left': l + 'px'} );
  }, 25 );
});