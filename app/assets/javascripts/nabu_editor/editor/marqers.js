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
    //    mapi.deleteMarqer({
  //        marqer: marqer,
  //        success: function(response) {
  //            console.log("deletion gelukt!", response);
  //            preview();
  //        },
  //        failure: function(response) {
  //            console.log("deletion faal!", response);
  //        }
  //    });
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
  
}

var updateMarqersFromTimeLine = function( marqers ) {
  $.each( marqers, function() { 
    //updateMarqerFromTimeLine( marqer.event, marquer.ui )
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

var preview = function( _m ) {
  if ( _m === undefined ) _m = marqers;
  console.log("reset marqers", $('#feedback').val());
  resetMarqers();
  setMarqers( _m, pop.duration() );
  convertMarqersIntoTrackevents( _m );  
}

  
   // *****************************************************************************
    // SAVE
    // *****************************************************************************
var save = function() {
  var mapi = new MarduqApi();

  $('.save-butt').append('<span class="loader"></span>');

  // split in new marqers and existing marqers
  var newMarqers = [];
  var savedMarqers = [];
  $.each(m, function(key, value) {
      if (value.remote_id !== undefined && value.remote_id != "-1") {
          savedMarqers.push(value);
      } else {
          newMarqers.push(value);
      }
  });

  var saved = 1;

  function checkSaveComplete(_num) {
      console.log("check save", _num, m);
      if (_num >= m.length) {
          console.log("save complete!");

          // auto reload, to avoid colissions     
          // location.reload();
      }
  }

  $.each(savedMarqers, function(key, savedMarqer) {
      var marqer = {};
      marqer.remote_id = savedMarqer.remote_id;
      marqer.program_id = program_id;
      marqer.type = savedMarqer.type;
      marqer. in = savedMarqer. in ;
      marqer.out = savedMarqer.out;
      marqer.marqeroptions = savedMarqer.marqeroptions;
      marqer.title = savedMarqer.marqeroptions.title.value;

      mapi.updateMarqer({
          marqer: marqer,
          success: function(response) {
              console.log("update gelukt!", response);
              checkSaveComplete( saved++ );
          },
          failure: function(response) {
              console.log("update faal!", response);
              checkSaveComplete( saved++ );
          }
      });
  });

  $.each(newMarqers, function(key, newMarqer) {
      var marqer = {};
      marqer.program_id = program_id;
      marqer.type = newMarqer.type;
      marqer. in = newMarqer. in ;
      marqer.out = newMarqer.out;
      marqer.marqeroptions = newMarqer.marqeroptions;
      marqer.title = newMarqer.marqeroptions.title.value;

      mapi.createMarqer({
          marqer: marqer,
          success: function(response) {
              console.log("creation gelukt!", response);
              checkSaveComplete( saved++ );
          },
          failure: function(response) {
              console.log("creation faal!", response);
              checkSaveComplete( saved++ );
          }
      });
  });

  // reload location
  // location.reload();
  // preview()
}