/* globals

marqers
program
MarduqApi
resetMarqers
setMarqers
pop
program_id (check this)
m
createTrackLine
mapi
aMarqerIsUpdating
convertMarqersIntoTrackevents
*/

// getMarqers( program_id )
// - type and name are mandatory
// - event makes sure it goed on the right place in the tracks
// - force-add ensures the marqer is added on the bottom of the track
// - stramien_id and set_marqer define having a set or stramien
var createNewMarqer = function( type, name, event, forceAdd, stramien_id, set_marqer ) {
  // create a new marqer from a drag/drop
  m = new window[ type ]

  if (event  != undefined ) {
    m.in = ( ( event.pageX - $('#tracks').offset().left ) / $('#tracks').width() ) * pop.duration()
  }

  m.out = m.in + ( 0.12 * pop.duration() )
  m.program_id = program.id;
  m.marqeroptions = m.defaultvalues;

  // check for stramien
  if ( stramien_id != undefined && stramien_id != "undefined" && stramien_id != null ) {
    var stramien = getStramienById( stramien_id )
    m.marqeroptions = stramien.marqeroptions

  }else if( set_marqer != undefined ) {
    m.marqeroptions = set_marqer.marqeroptions // JSON.stringify
    m.in = set_marqer.in
    m.out = set_marqer.out
    m.name = set_marqer.title  + "_copy"
    m.title = set_marqer.title
  }else{
    // do nothing
  }

  // check for tracklines
  if (set_marqer != undefined ) {
    // do nothing, track is already defined in the set
  }else if ( forceAdd ) {
    // force it, track line is on the bottom
    m.marqeroptions.track = createTrackLine().index() - 1
  }else if(event) {
    // get the track from the event
    m.marqeroptions.track = $(event.target).index()
  }

  // set name
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
      console.log('Marqer creation failed', resp)
    }
  })
}

// Stramien helper
var getStramienById = function( _id ) {
  var result = null
  var all_strata = marqer_stramienen.own_strata.concat( marqer_stramienen.shared_strata, marqer_stramienen.global_strata )
  $.each(all_strata, function(i, stramien) {
    if (stramien._id.$oid == _id) {
      result = stramien
    }
  })
  return result
}

// MarqerSetHelper
var saveMarqersAsSet = function( marqer_set_id ) {
  if ( marqer_set_id == undefined ) {
    // make new set
    var data = {}
    data.title = "none"
    data.description = "none"
    data.name = "none"
    data.marqers = JSON.stringify(marqers)

    $.post('/marqerset/', data, function(res) {
      console.log("your set was saved")
      console.log("got response: ", res)
    })

  }else{
    // update set ?
  }
}

var createMarqersFromSet = function( marqer_set_id ) {
  // delete marqers and wait for confirm
  //

  // get marqer set
  $.get('/marqerset/' + marqer_set_id, function( marqer_set ){
    // generate
    $.each( JSON.parse(marqer_set.marqers), function( k, _m ){
      setTimeout( function() {
        createNewMarqer( _m.type, _m.title, undefined, false, undefined, _m )
      }, 200*k )
    });
  });
}

var updateMarqer = function( marqer ) {
  console.log("updateMarqer", marqer )
  $('#load_indicator.glyphicon').css("opacity", 1)
  mapi.updateMarqer({
    marqer: marqer,
    success: function(){
      console.log('yuy')
      $('#load_indicator.glyphicon').css("opacity", 0)
      preview()
      aMarqerIsUpdating = false
    },
    fail: function(resp) {
      console.log('helaas pindakaas')
      aMarqerIsUpdating = false
    },
    done: function(resp) {
      aMarqerIsUpdating = false
    }
   })
};

/* depricated
// updateMarqers()
var updateMarqerFromTimeLine = function( e, u ) {
  // updateMarqer(m)
}

var updateMarqersFromTimeLine = function( marqers ) {
  $.each( marqers, function() {
    // updateMarqerFromTimeLine( marqer.event, marquer.ui )
  })
}
*/

var deleteMarqer = function ( marqer ) {
  marqer.remote_id = marqer.id // failsave
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

// this function is now redundant, look in nabu\app\assets\javascripts\marduq\marqers
// remove after testing
var getMarqerById = function( id ) {
  var marqer = null
  $.each( marqers, function(i, m) {
    if ( m.id == id ) marqer = m
  })
  return marqer
}

// var convertMarqersIntoTrackevents( m ) // find me in user_interface.js

// *****************************************************************************
// PREVIEW
// *****************************************************************************

// yes, this redraws everything it gets from the server
var preview = function( _m, force ) {

  // only update when checked or forced
  if ( !$('#auto_preview').prop('checked') && force == undefined ) return;

  if ( _m === undefined ) _m = marqers;
  console.log("reset marqers", $('#feedback').val());
  resetMarqers();
  setMarqers( _m, pop.duration() );
  convertMarqersIntoTrackevents( _m );
}
