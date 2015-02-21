
  // TEST
  /*
  var sequence
  function setUpSequence() {
      if (pop != null) {
        
        // create our sequence
        sequence = Popcorn.sequence(
        "video_frame",
        [
            { src: "http://videos.mozilla.org/serv/webmademovies/atultroll.webm", in: 0, out: 3 },
            { src: "http://videos.mozilla.org/serv/webmademovies/justintime.ogv", in: 174, out: 180 },
            { src: "http://videos.mozilla.org/serv/webmademovies/popcornplug.ogv", in: 0, out: 6 }
        ]);
        
        // play popcorn
        sequence.play();
                
        //sequence.code({
        //    start: 0,
        //    end: 2,
        //    text: "footnote",
        //    target: "foo"
        //});
        
        // get popcorn object of first video
        // console.log( sequence.eq( 0 ) );
        
        //exec something at 4 seconds
        // sequence.exec( 4, function() {
        //    console.log( "AT 4 SECONDS" );
        //});
      }else{
        setTimeout(function() {setUpSequence()}, 500)
      }
    }
  
  setUpSequence()
  */
  
/* ########################################*/
  
/*  
-# set up interact tests
:javascript
  interact('.dragme')
  .draggable({
    onstart: function (event) {      
    },
    onmove: function (event) {
      var target = event.target;
      target.x = (target.x|0) + event.dx;
      target.y = (target.y|0) + event.dy;
      target.style.webkitTransform = target.style.transform = 'translate(' + target.x + 'px, ' + target.y + 'px)';
    },
    onend: function (event) {      
    }
  })
  .inertia(true)
  .restrict({
    drag: "parent",
    endOnly: true
  });
  
*/