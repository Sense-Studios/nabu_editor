var videoconsole = function() {
  
  var feedbackLog = ""
  var currentTime = 0
  
  var ready = function() {
    console.log("videoconsole ready")
    setInteraction();
    connectToPopcorn();
  }
  
  var setInteraction = function() {       
    var setDrag = function() {
      //$('#video_console').draggable()      
    }
    
    var setInput = function() {
      
    }
    
    var setScroll = function() {
      
    }
        
    setDrag()
    setInput()
    setScroll()
  }
  
  var connectToPopcorn = function() {
   // if program && pop 
  }
  
  // Command helpers
  var helpText = "use this command line tool to add or edit video, for all commands type 'list'"
  var commandHelp = [
    {'command':'help', 'description':'shows a help tekst'},
    {'command':'list', 'description':'shows this list with commands'}
  ]
  
  
  
  // Finally the command listing
  var doCommand = function( cmd, options ) {
  
    switch( cmd ) {        
      case "help":
        break;
                
      case "clear":
        break;

      case "list":
        break;      

      case "link":
        break;      

      case "sub":
        break;  
      
      case "wiki":
        break;      
    

      default:
        console.log(" # VIDEOCONSOLE: Syntax Error: " + cmd + ", " + options )
    } 
  }
  
  // On document loaded
  $( ready() )
}

// start
videoconsole();