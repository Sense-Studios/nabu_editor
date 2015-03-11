/* globals

marqers
program
MarduqApi
resetMarqers
setMarqers
pop
program_id (check this)
*/

// getMarqers( program_id )

var createNewMarqer = function( type, name, event ) {
  // create a new marqer
  m = new window[ type ]
  m.in = ( ( event.pageX - $('#tracks').offset().left ) / $('#tracks').width() ) * pop.duration()
  m.out = m.in + ( 0.38 * pop.duration() )
  m.program_id = program.id;
  m.marqeroptions = m.defaultvalues;
  m.title = name;
  
  // create a copy
  mapi.createMarqer({
    marqer: m,
    success: function( marqer ) {      
      // add it to the local marqers (note that this can cause discrepencies between the server!)
      marqers.push( marqer )            
      preview()
    },
    fail: function(resp) {
      console.log('helaas pindakaas')
    }
  })
}

var updateMarqer = function( marqer ) {
  console.log("updateMarqer", marqer )
  mapi.updateMarqer({ 
    marqer: marqer, 
    success: function(){ 
      console.log('yuy') 
      preview()
    },
    fail: function(resp) {
      console.log('helaas pindakaas')
    }
   })
};

// updateMarqers()
var updateMarqerFromTimeLine = function( e, u ) {
  // updateMarqer(m)
}

var updateMarqersFromTimeLine = function( marqers ) {
  $.each( marqers, function() { 
    // updateMarqerFromTimeLine( marqer.event, marquer.ui )
  })
}

var deleteMarqer = function ( marqer ) {  
  mapi.deleteMarqer( { 
    marqer: marqer, 
    failure: function(e) {
      console.log('delete marqer fail: ', e)
    },
    success: function(e) {
      console.log('yuy')
      var kill = -1
      $.each(marqers, function(i, m) {
        if (m.id == marqer.id) kill = i             
      })
      if (kill != -1) marqers.splice( kill, 1)
      preview()
    }
   })  
};

var getMarqerById = function( id ) {
  var marqer = null
  $.each( marqers, function(i, m) {
    if ( m.id == id ) marqer = m
  })
  return marqer
}

// var convertMarqersIntoTrackevents( m ) // find me in UI

// *****************************************************************************
// PREVIEW
// *****************************************************************************

// yes, this redraws everything it gets from the server
var preview = function( _m ) {
  if ( _m === undefined ) _m = marqers;
  console.log("reset marqers", $('#feedback').val());
  resetMarqers();
  setMarqers( _m, pop.duration() );
  convertMarqersIntoTrackevents( _m );  
}