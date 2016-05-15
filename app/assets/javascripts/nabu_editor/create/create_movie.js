/* globals
MarduqApi
utils/parseYoutubeDuration
app/t (translations)
app/client_id
app/log
setPrograms
setProgram
mount_point
*/

var mapi = new MarduqApi();   // Marduq Api
var c = 0;                    // counter
var select_was = "s3_direct"; // type of assets, defaults to s3
var checkedbox;               // determines the asset type
var statecheckinterval;       // holder zencoder state interval
var currentAssetData = {};    // holder
var new_program_id = null;    // holder
var new_asset_id = null;      // holder
var new_asset_job_id = null;   // holder
// var new_video = null;      // not used

var saveComplete = function( resp ) {
  console.log( "Save Complete, resp: ", resp) ;
  if ( resp === undefined ) resp = { 'id': new_program_id }; // failsafe
  injectMetadata( resp.id );
};

// helper to inject (initial) metadata into the program
var injectMetadata = function(id) {
  console.log("inject metadata in ", id );
  $.get( '/'+ mount_point +'/inject_metadata/' + id, function( resp ) {
    console.log("meta data injected: ", resp);
    setPrograms();          // reload programs
    setProgram( resp.id );  // set current program
  });
};

// this is actually the 'save' function, but it's not really saving
var doCreateProgram = function() {

  // get the information of the select object
  console.log("save with: ", checkedbox, $('input[name="input_select"]:checked').val(), currentAssetData );

  // clear the input box
  $('#link_url').val('')

  // determine the type
  var tp = currentAssetData._type.toLowerCase()
  if ( tp !== null && ( tp == "youtube" || tp == "vimeo" || tp == "kaltura" || tp == "ooyala" || tp == "streamone" ) ) {
    console.log( "create asset and with prepared data: ", currentAssetData, currentAssetData.id );
    mapi.createAsset({
      asset: currentAssetData,
      success: function( response ){
        console.log("SAVE: create assset had succes !", response);
        createProgramWithAsset( response );
      },
      failure: function( response ){
        console.log("SAVE: create asset FAIL !!", response);
      }
    });

    // TODO, manage archive function through cloning

    // For now we simply ignore this option.
    // }else if ( $('input[name="input_select"]:checked').val() == "archive" ) {

    // this works for an archived element
    // don't duplicate the asset, make a new program with the existing one
    // console.log("create program with predefined asset", currentAssetData);
    // createProgramWithAsset( currentAssetData );

  }else{

    // the s3 upload should have made asset already, all we need to do
    // update the asset one more time, maybe the information has changed
    // during transcoding
    // then we can open the describe page ( AFTER saving )

    // update the current asset, and use that
    currentAssetData.title = $('#title').val(),
    currentAssetData.description = $('#description').val(),
    currentAssetData.tags = $('#tags').val(),
    currentAssetData.client_id = client_id; // it seems we are listing videos, so inject this
    currentAssetData.id = new_asset_id;     // this was saved when the asset was created
    currentAssetData.thumbnail_url = $("#video-thumbnails").find("option[value='" + $("#video-thumbnails").val() + "']").data('img-src');

    // some feedback
    console.log("S3 upload: update asset with: ", currentAssetData );

    // upload the asset through the M-api
    mapi.updateAsset({
      asset: currentAssetData,
      success: function( response ){
        console.log("SAVE: Update assset had succes !", response);
        saveComplete( response )
      },
      failure: function( response ){
        console.log("SAVE: Update asset FAIL !!", response);
      }
    });
  }
}

// ### Interface
// Check given input, and search for information accordingly
function checkInput( directupdate ) {
  checkedbox = "check";
  if ($(".link_checkbox").is(':checked')) {
    checkedbox = $("#link_url").val();
  }
  else if ($(".upload_checkbox").is(':checked')) {
    checkedbox = "s3_direct";
  }

  console.log( "check input", $('input[name="input_select"]:checked').val(), select_was, checkedbox, checkedbox.length );

  // refresh this, except for uploads
  if ( select_was != "s3_direct" ) {
    $('#title').val("");
    $('#description').val("");
    $('#tags').val("");
  }

  // set orignal select
  select_was = $('input[name="input_select"]:checked').val();

  // clear the inputs and image picker
  $('.image_picker_selector').remove();
  $('.image_picker_option').remove();
  $('#youtube-group').removeClass('has-success').removeClass('has-error');
  $('#vimeo-group').removeClass('has-success').removeClass('has-error');

  // hide the save button, when input is being given
  $('#save_button').addClass('disabled');


  // ******************************************************************
  //  Call upon the YOUTUBE api
  // ******************************************************************

  if ( checkedbox.indexOf("youtu") >= 0 ) {

    // TODO: Move these to the Options file
    var yt30_api_key = "AIzaSyAF_fb0l1J8BrhGVE2xby5QM5sX7l1RLKQ";
    var yt30_api_url = "https://www.googleapis.com/youtube/v3/";
    var ytid = youtube_parser( checkedbox );

    // youtube_parser returned a false, skip.
    if (ytid == -1 ) return;

    // call the Youtube api through AJAX
    $.ajax({
      url: yt30_api_url + "videos?part=snippet,contentDetails&id=" + ytid + "&key=" + yt30_api_key,
      dataType: "json",
      type: "GET",
    }).done( function(data) {
      console.log("youtube api done")

    }).success( function(data){
      console.log("youtube api succes!", data);

      // We've found the youtube video, now fill the description with it
      $('#title').val( data.items[0].snippet.title );
      $('#description').val( data.items[0].snippet.description );
      $('#tags').val("");

      //$('#video-thumbnails').append('<option class="image_picker_option" data-img-src="'+data.items[0].snippet.thumbnails.medium.url+'" value="1">page 1</option>');
      //$(".image-picker").imagepicker();
      // autosave (?)
      // $('#save_button').removeClass('disabled');

      // Also dump it into the assetData
      currentAssetData = {
        original_url: "http://www.youtube.com/watch?v=" + ytid,
        title: data.items[0].snippet.title,
        description: data.items[0].snippet.description,
        thumbnail_url: data.items[0].snippet.thumbnails.medium.url,
        duration_in_ms: parseYoutubeDuration( data.items[0].contentDetails.duration ) * 1000,

        // note that we can retreive more thumbndails through
        // https://i1.ytimg.com/vi/<youtube-id>/3.jpg ( 1-4.jpg )
        // AND
        // https://i.ytimg.com/vi/aO2p4LjDI7c/ [ default | high | maxres | medium | standard ] .jpg

        thumbnails: {
           // "maxres": data.items[0].snippet.thumbnails.maxres.url,
           // "standard": data.items[0].snippet.thumbnails.standard.url
           "default": data.items[0].snippet.thumbnails.default.url,
           "high": data.items[0].snippet.thumbnails.high.url,
           "medium": data.items[0].snippet.thumbnails.medium.url
        },
        tags: "",
        duration: parseYoutubeDuration( data.items[0].contentDetails.duration ), // given as PT34M36S, in seconds
        _type: "Youtube"
      };

      console.log("created data: ", currentAssetData, "start saving");
      doCreateProgram();    // save the program
      showDescribeMovie();  // start describing

    }).error( function(e) {
      console.log("fail:", e);
      $('#youtube-group').removeClass('has-success').removeClass('has-error').addClass('has-error');
    });
  }

  // ******************************************************************
  //  Call upon the VIMEO api
  // ******************************************************************

  if ( checkedbox.indexOf("vimeo") >= 0 ) {

    // Example URL: http://vimeo.com/api/v2/video/89027544.json
    // MOVE these to options
    var vim20_api_url = "http://vimeo.com/api/v2/video/";
    var vimid = vimeo_parser( checkedbox );

    // if the vimeo parsing returns -1, return this
    if (vimid == -1 ) return;

    // get the info from the vimeo api
    $.ajax({
      url: vim20_api_url + vimid + ".json",
      dataType: "json",
      type: "GET",
    }).done( function(data){
      console.log("vimeo is done")

    }).success( function(data){
      console.log("succes!", data);
      $('#vimeo-group').removeClass('has-success').removeClass('has-error').addClass('has-success');

      // We've found the vimeo video, now fill the description with it
      $('#title').val( data[0].title );
      $('#description').val( data[0].description );
      $('#tags').val( data[0].tags );
      $('#thumbnails').append('<option class="image_picker_option" data-img-src="'+data[0].thumbnail_medium+'" value="1">page 1</option>');
      $(".image-picker").imagepicker();
      $('#save_button').removeClass('disabled');

      // aaand dump into the asset object
      currentAssetData = {
        original_url: "http://vimeo.com/" + vimid,
        title: data[0].title,
        description: data[0].description,
        tags: data[0].tags,
        thumbnail_url: data[0].thumbnail_large,
        duration: data[0].duration,
        duration_in_ms: data[0].duration*1000,
        _type: "Vimeo"
      };

      doCreateProgram();    // save the program
      showDescribeMovie();  // start describing

    }).error( function(e) {
      console.log("fail:", e);
      $('#vimeo-group').removeClass('has-success').removeClass('has-error').addClass('has-error');
    });
  }

  // ******************************************************************
  //  Call upon the KALTURA api
  // ******************************************************************

  if ( checkedbox.length == 10 && checkedbox.substring(1, 2) == "_" ) { // || checkedbox.indexOf("kaltura") >= 0 ) {

    console.log("KALTURA HAS:" + checkedbox )
    //console.log( "parse kaltura url " + kaltura_parser(checkedbox) )

    // var entryId = kaltura_parser(checkedbox)
    var entryId = checkedbox
    if (entryId === null ) {
      console.log("no match")
      return;
    }

    $('.video_uploader_container').hide()

    // Talk to our own API
    // kaltura/api/entry_id ?
    console.log("I get Kaltura", entryId)
    $.get('/admin/kaltura_api/' + entryId, function(entry) {

      // We've found the kaltura video, now fill the description with it
      $('#title').val( entry.name );
      $('#description').val( entry.description );
      $('#tags').val( entry.tags );

      // needs to wait aout a bit
      $('#thumbnails').append('<option class="image_picker_option" data-img-src="'+entry.thumbnailUrl+'" value="1">page 1</option>');
      $(".image-picker").imagepicker();
      $('#save_button').removeClass('disabled');

      currentAssetData = {
        // entry_id: kaltura_parser[7],
        // uiconf_id: kaltura_parser[9],
        // partner_id: kaltura_parser[7],

        original_url: entryId,
        title: entry.name,
        description: entry.description,
        tags: entry.tags,
        thumbnail_url: entry.thumbnailUrl,
        duration: entry.duration,
        duration_in_ms: entry.msDuration,
        _type: "Kaltura"
      };

      console.log("ALL GO")
      doCreateProgram();    // save the program
      showDescribeMovie();  // start describing

    }).fail( function() {
      alert("Something went wrong with uploading the video.")
      $('.video_uploader_container').fadeIn('slow')
    })
  }

  // ******************************************************************
  //  Call upon the OOYALA api
  // ******************************************************************
  // EzZ2hrMjE6USq-Py5sUrH5nblMp8Vt4R

  console.log("--->", checkedbox, checkedbox.length, checkedbox.length == 32)
  if ( checkedbox.length == 32 ) {

    console.log("Ooyala HAS:" + checkedbox )
    //console.log( "parse kaltura url " + kaltura_parser(checkedbox) )

    // var entryId = kaltura_parser(checkedbox)
    var content_id = checkedbox
    if (content_id === null ) {
      console.log("no match")
      return;
    }

    $('.video_uploader_container').hide()

    // Talk to our own API
    // kaltura/api/entry_id ?
    console.log("I get Ooyala", content_id)
    $.get('/admin/ooyala_api/' + content_id, function(entry) {

      // We've found the kaltura video, now fill the description with it
      $('#title').val( entry.title );
      $('#description').val( entry.description );
      $('#tags').val( entry.labels );

      // needs to wait aout a bit
      $('#thumbnails').append('<option class="image_picker_option" data-img-src="'+entry.preview_image_url+'" value="1">page 1</option>');
      $(".image-picker").imagepicker();
      $('#save_button').removeClass('disabled');

      currentAssetData = {
        original_url: content_id,
        title: entry.name,
        description: entry.description,
        tags: "", //entry.labels,
        thumbnail_url: entry.preview_image_url,
        duration: entry.duration/1000,
        duration_in_ms: entry.duration,
        _type: "Ooyala"
      };

      console.log("ALL GO")
      doCreateProgram();    // save the program
      showDescribeMovie();  // start describing

    }).fail( function() {
      alert("Something went wrong with uploading the video.")
      $('.video_uploader_container').fadeIn('slow')
    })
  }

  // ******************************************************************
  //  Call upon the STREAMONE api
  // ******************************************************************

  // TjxJ0IROipM1
  if ( checkedbox.length == 12 ) {

    console.log("StreamOne HAS:" + checkedbox )
    //console.log( "parse kaltura url " + kaltura_parser(checkedbox) )

    // var entryId = kaltura_parser(checkedbox)
    var content_id = checkedbox
    if (content_id === null ) {
      console.log("no match")
      return;
    }

    $('.video_uploader_container').hide()

    // Talk to our own API
    // directly:
    // var account_id = "f7hMI-BeA8oT"
    // var so_url = "https://content.streamonecloud.net/playlist/account=" + account_id + "/item=" + content_id + "/playlist.json"

    console.log("I get StreamONe", content_id)
    //var account_id = "f7hMI-BeA8oT"
    //var so_url = "https://content.streamonecloud.net/playlist/account=" + account_id + "/item=" + content_id + "/playlist.json"
    $.get('/admin/streamone_api/' + content_id, function(entry) {

      // We've found the kaltura video, now fill the description with it
      $('#title').val( entry.items[0].title );
      $('#description').val( entry.items[0].description );
      $('#tags').val( "" );

      // needs to wait aout a bit
      $('#thumbnails').append('<option class="image_picker_option" data-img-src="'+entry.items[0].poster+'" value="1">page 1</option>');
      $(".image-picker").imagepicker();
      $('#save_button').removeClass('disabled');

      currentAssetData = {
        original_url: content_id,
        title: entry.items[0].title,
        description: entry.items[0].description, //entry.description,
        tags: "", //entry.labels,
        thumbnail_url: entry.items[0].poster,
        duration: (entry.items[0].duration),
        duration_in_ms: ((entry.items[0].duration)*6000),
        _type: "Streamone"
      };

      console.log("ALL GO", currentAssetData)
      doCreateProgram();    // save the program
      showDescribeMovie();  // start describing

    }).fail( function() {
      alert("Something went wrong with uploading the video.")
      $('.video_uploader_container').fadeIn('slow')
    })
  }


  // ******************************************************************
  //  Call upon the MARDUQ api
  // ******************************************************************

  if ( $('input[name="input_select"]:checked').val() == "archive" ) {

    // failsafe, this multipupdating, and might overload the thumbnails
    if ( directupdate == "skip") return;

    // get the asset from the archive, and show it's information
    var asset = {};
    asset.id = $('#asset-from-archive').val();
    mapi.getAsset({
      asset: asset,
      success: function( data ) {
        $('#title').val( data.title );
        $('#description').val( data.description );
        $('#tags').val( data.tags );

        // should have type now
        console.log("has type", data, data._type);

        currentAssetData = {
          title: data.title,
          description: data.description,
          tags: data.tags,
          id: data.id
        };

        // only marduq assets have thumbnails in the object,
        // for youtube and vimeo, these should be looked up :-/
        // maybe put a default thumbnail in an asset?
        if ( data._type == "Video" ) {
          $.each( data.thumbnails.small, function(key, value ) {
            $('#video-thumbnails').append('<option class="image_picker_option" data-img-src="'+value+'" value="'+key+'">page '+key+'</option>');
          });
          currentAssetData.thumbnail_url = data.thumbnails.small[0];

        }else{
          $('#video-thumbnails').append('<option class="image_picker_option" data-img-src="'+data.thumbnail_url+'" value="1">page 1</option>');
        }

        $(".image-picker").imagepicker({
          clicked: function(e) { currentAssetData.thumbnail_url = $(this).find('option:selected').attr('data-img-src'); }
        });

        $('#save_button').removeClass('disabled');
        currentAssetData._type = data._type;


      },
      failure: function( response ) {
        alert("Something went wrong with adding the archived video.")
      }
    });
  }

  // Note that the uploaders has its own saving gate
}


// ******************************************************************
//  HELPERS, parsers
// ******************************************************************

// ### utuub parser
function youtube_parser(url) {
  //if ( url.indexOf('feature=player_embedded&') != -1 ) url = url.split('feature=player_embedded&').join(''); // quickfix
  //if ( url.indexOf('feature=player_detailpage&') != -1 ) url = url.split('feature=player_detailpage&').join(''); // quickfix
  // https://www.youtube.com/watch?feature=player_detailpage&v=I96ywF6016k
  // https://www.youtube.com/watch?feature=player_embedded&v=I96ywF6016k
  // var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/; // // match group 7
  var regExp = /^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/;
  var match = url.match(regExp);
  if (match&&match[2].length==11){
    return match[2];
  }else{
    $('#youtube-group').removeClass('has-success').removeClass('has-error').addClass('has-error');
    return -1;
  }
}

// ### vimeo parser
function vimeo_parser( url ) {
  var match = /vimeo.*\/(\d+)/i.exec( url );
  if ( match ) {
    return match[1];
  }else{
    $('#vimeo-group').removeClass('has-success').removeClass('has-error').addClass('has-error');
    return -1;
  }
}

function kaltura_parser( url ) {
  //var kobject = {}
  //// http://www.kaltura.com/index.php/extwidget/preview/partner_id/1901361/uiconf_id/28529602/entry_id/1_58ch1qja/embed/legacy?
    // http://www.kaltura.com/index.php/extwidget/preview/partner_id/1901361/uiconf_id/28529602/entry_id/1_58ch1qja/embed/legacy?
    // http://www.kaltura.com/p/1901361/thumbnail/entry_id/1_x7kyq7v5
    // http://www.kaltura.com/p/1901361/thumbnail/entry_id/1_olfv9f86
    // http://www.kaltura.com/p/1901361/thumbnail/entry_id/1_wp08q1zn

    // http://cdnapi.kaltura.com/index.php/extwidget/openGraph/wid/1_olfv9f86

  var regExp = /entry_id\/([0-9a-zA-Z_]+)/;
  var match = url.match(regExp);
  console.log("has match!: ", match)
  return match[1]
}

// ### Create a program from an asset
function createProgramWithAsset( asset ) {
  console.log( "create programitem and program with asset, id: ", asset.id, "asset:", asset );

  // failsafe; inject client id in asset
  asset.client_id = client_id;

  mapi.createProgramWithAsset({
    asset: asset,
    success: function( response ){
       console.log("createProgramWithAsset succes!", response);

      if ( $('input[name="input_select"]:checked').val() != "s3_direct" ) {
        // if we don't need to go to zencoder
        saveComplete( response )

      }else{

        // this is an upload!
        // wait for transcoding complete
        console.log(" ###### WAIT FOR PROGRAM COMPLETE", response );
        new_program_id = response.id;
      }
    },
    failure: function( response ){
      console.log("faal!!", response);
    }
  });
}

var updateProgramAfterZencoding = function( video, zen_data ) {

  // at this point, their has been a save for the asset
  // a new program has been created and an asset has been filled
  // now we can start filling out the details, and refresh
  // evertyhing.

  console.log("start making a program after zencoding")
  console.log( new_program_id )
  console.log( video )
  console.log( zen_data )
  //$('.show_upload h4').text('zencoding done!')
  $('.create_movie_hider').fadeOut('slow')
  $('.video_describe_container #close_button').fadeIn('slow')

  // https://app.zencoder.com/api/v2/jobs/145849040.json?api_key=a845e5e6788c1dc6a6b9af2bd2ce7488
  $.get('https://app.zencoder.com/api/v2/jobs/'+new_asset_job_id+'.json?api_key=a845e5e6788c1dc6a6b9af2bd2ce7488', function( response ) {

    console.log("got info from zencoder:", response)
    var updateAsset = {}
    updateAsset.id = new_asset_id
    updateAsset.title = $('#title').val();
    updateAsset.descriptions = $('#description').val();
    updateAsset.tags = $('#tags').val();

    console.log("################################### INJECT TIME::: ", response.job.input_media_file.duration_in_ms)
    updateAsset.duration = response.job.input_media_file.duration_in_ms/1000
    updateAsset.duration_in_ms = response.job.input_media_file.duration_in_ms

    //// get thumbnail (first medium sized tn)
    //var thumbnail = null
    //$.each( response.job.thumbnails, function( i, tn ) {
    //  if ( tn.group_label == "medium" && thumbnail === null ) {
    //    thumbnail =
    //  }
    //}
    // this only works in this bucket :-/
    // updateAsset.thumbnail_url =

    mapi.updateAsset({
      asset: updateAsset,
      success: function( response ){
        console.log("update success")
        saveComplete( response )
        $('.show_upload').fadeOut('fast')
      },
      failure: function( response ){
        console.log("update asset failed, ", response)
      }
    })
  })
}


// ### Shows a warning on pageleave
function setWarning() {
  window.onbeforeunload = function() {
    var msg = "upload not complete" // t.javascript.upload_not_complete;
    alert(msg);
    return msg;
  };
}

// ### Disables other input while transcoding
function disableInput() {
  console.log("disbalbeInput is depricated")
//  $('input[name="input_select"]').attr("disabled", true);
//  $('#youtube_url').attr("disabled", true);
//  $('#vimeo_url').attr("disabled", true);
//  $('#asset-from-archive').attr("disabled", true);
//  $(".btn-file").attr("disabled", true);
}

// ### Check the state of a video
function checkState( video ) {

  // remove warning
  window.onbeforeunload = null;


  // This video is encoding, let's ask Zencoder how we're doing
  // https://app.zencoder.com/docs/api/jobs/progress
  // GET https://app.zencoder.com/api/v2/jobs/1234/progress.json?api_key=asdf1234
  // GET https://app.zencoder.com/api/v2/jobs/1234/progress.xml?api_key=asdf1234
  // GET https://app.zencoder.com/api/v2/jobs/1234/progress.js?api_key=asdf1234&callback=asdf
  // {
  //   "state": "processing",
  //   "progress": 32.34567345,
  //   "input": {
  //     "id": 1234,
  //     "state": "finished"
  //   },
  //   "outputs": [
  //     {
  //       "id": 4567,
  //       "state": "processing",
  //       "current_event": "Transcoding",
  //       "current_event_progress": 25.0323,
  //       "progress": 35.23532
  //     },
  //     {
  //       "id": 4568,
  //       "state": "processing",
  //       "current_event": "Uploading",
  //       "current_event_progress": 82.32,
  //       "progress": 95.3223
  //     }
  //   ]
  // }

  new_asset_job_id = video.job_id
  $.get("https://app.zencoder.com/api/v2/jobs/" + video.job_id + "/progress.json?api_key=a845e5e6788c1dc6a6b9af2bd2ce7488", function(zen_data) {

    // Valid states include: pending, waiting, processing, finished, failed, and cancelled.
    console.log("Zencode said: ", zen_data.state);

    if ( zen_data.state == "pending" || zen_data.state == "waiting"  ) {
      // -- VIDEO IS WAITING ---
      if (!$('.js_progress_bars .progress .bar').hasClass('progress-bar-info')) $('.js_progress_bars .progress .bar').addClass('progress-bar-info');
      $('.js_progress_bars .progress .bar').text( t.zencode.waiting_for_transcoding );
      $('.show_upload h4').text( t.zencode.patience )

    } else if( zen_data.state == "processing" ) {
      // -- VIDEO IS TRANSCODING ---
      if (!$('.js_progress_bars .progress .bar').hasClass('progress-bar-warning')) $('.js_progress_bars .progress .bar').addClass('progress-bar-warning progress-bar-striped active');
      $('.js_progress_bars .progress .bar').css( {'width': zen_data.progress + "%"} );
      $('.js_progress_bars .progress .bar').text( Math.floor( zen_data.progress ) +"%");
      $('.show_upload h4').text(t.zencode.converting + Math.floor( zen_data.progress ) +'%' )

    } else if ( zen_data.state == "finished" ) {
      // -- VIDEO HAS FINISHED ENCODING! ---

      // stop checking the state
      clearInterval(statecheckinterval);

      // remove active bar
      $('.js_progress_bars .progress').removeClass("active").removeClass("progress-striped");
      $('.js_progress_bars .progress .bar').css({'width': "100%"} );
      $('.js_progress_bars .progress .bar').text( "transcoding complete");//t.javascript.transcoding_complete  );
      $('.show_upload h4').text(t.zencode.finished)
      $('#upload_url').val('')
      showDescribeMovie()
      updateProgramAfterZencoding( video, zen_data )

    } else if ( zen_data.state == "cancelled" ) {
      // -- VIDEO WAS CANCELLED ---
      clearInterval(statecheckinterval);
      $('.js_progress_bars .progress').removeClass("active").removeClass("progress-striped").addClass("progress-bar-danger");
      $('.js_progress_bars .progress .bar').text(t.zencode.transcoding_cancelled);
      $('.show_upload h4').text(t.zencode.converting_cancelled)
      $('#upload_url').val('')

    } else if ( zen_data.state == "failed" ) {
      // -- VIDEO HAS FAILED ---
      clearInterval(statecheckinterval);
      $('.js_progress_bars .progress').removeClass("active").removeClass("progress-striped").addClass("progress-bar-danger");
      $('.js_progress_bars .progress .bar').text(t.zencode.transcoding_failed); //t.javascript.transcoding_failed );
      $('.show_upload h4').text(t.zencode.converting_failed)
      log("warning", "transcoding has failed!");
      $('#upload_url').val('')
    }

  }).fail(function(e) {
    //Betere tekst!!
    //omzetserver werkt niet, zie 'Help'
    alert( "FAILURE: Zencoder Unreachable!" ) //t.javascript.zencoder_unreachable );
    log("error", "zencoder could not be reached for a state!");
  });
}


// ******************************************************************
//  UPLOADER
// ******************************************************************
function initS3Oploader() {
  var provideFeedback = function ( file ) {
    $(".feedback").val( file.name );
    return true;
  };

  $("#s3-uploader").S3Uploader( {
    //max_file_size: 1258291200,
    progress_bar_target: $('.js_progress_bars'),
    allow_multiple_files: false,
    remove_completed_progress_bar: false,
    before_add: provideFeedback
  });

  // Upload start
  $('#s3-uploader').bind('s3_uploads_start', function(e) {

    // reset the program
    setProgram(-1)

    // clear any and all input if available
    $('#title').val('')
    $('#description').val('')
    $('#tags').val('')

    // show the uploader, while we allow the user to input data
    showDescribeMovie( true );
    console.log("S3 HAS has an event, ", e)

    // hide everything else
    $('.create_movie_hider').fadeIn('fast')
    $('.show_upload h4').text(t.uploader.progress)
    $('.video_describe_container #close_button').fadeOut('fast')
  });

  // Start Transcoding
  $('#s3-uploader').bind("s3_upload_complete", function(e, content) {
    // content:
    /*
    Object
      url: "https://marduq-3.s3.amazonaws.com/uploads%2F139587…-6f350850deb218d1363a8be18f577c22%2Fbg_tester.jpg",
      filepath: "/uploads%2F1395877077615-ppj63bo60yxy9zfr-6f350850deb218d1363a8be18f577c22%2Fbg_tester.jpg",
      s3_key: "uploads/1395877077615-ppj63bo60yxy9zfr-6f350850deb218d1363a8be18f577c22/bg_tester.jpg",
      filename: "bg_tester.jpg",
      filesize: 1024340…
    }

      filename: "bg_tester.jpg"
      filepath: "/uploads%2F1395877077615-ppj63bo60yxy9zfr-6f350850deb218d1363a8be18f577c22%2Fbg_tester.jpg"
      filesize: 1024340
      filetype: "image/jpeg"
      lastModifiedDate: Tue Jan 21 2014 16:29:03 GMT+0100 (W. Europe Standard Time)
      s3_key: "uploads/1395877077615-ppj63bo60yxy9zfr-6f350850deb218d1363a8be18f577c22/bg_tester.jpg"
      unique_id: "ppj63bo60yxy9zfr"
      url: "https://marduq-3.s3.amazonaws.com/uploads%2F1395877077615-ppj63bo60yxy9zfr-6f350850deb218d1363a8be18f577c22%2Fbg_tester.jpg"
    */

    // crete the video object
    var video = {};
    video.original_url = content.url;
    video.original_filename = content.filename;
    video.title = $('#title').val();
    video.description = $('#description').val();
    video.tags = $('#tags').val();
    video.s3_key = content.s3_key;

    // holder for use elsewhere
    videoholder = video;

    // call upon the api to upload the video, after it is available on Amazon
    mapi.uploadVideo({
      video: video,
      success: function( video ) {
        c = 0;
        statecheckinterval = setInterval( checkState, 6000, video );     // set an interval to check the state of encoding
        checkState( video );                                             // start checking state of video encoding, for the first time
        setWarning();                                                    // add warning to page close, untill transcoding is complete
        disableInput();                                                  // disable the input, we have uploaded, now you better make an asset
        new_asset_id = video.id;                                         // another holder
        video.client_id = client_id;                                     // it seems we are listing videos, so inject this
        createProgramWithAsset( video );                                 // Be sure to create the program, program item and asset in advance
      },

      failure: function( response ) {
        console.log("Amazon s3 Error: ", response);
        clearInterval(statecheckinterval);
      }
    }); // end api
  }); // end bind

  $('#s3-uploader').bind("s3_upload_failed", function(e) {
    $('.upload').before('<div class="alert alert-warning"> #{content.filename} ' + t.uploader.failed + ': #{content.error_thrown}"</div>');
    alert(t.uploader.failed)
  });
}

// ******************************************************************
//  INIT
// ******************************************************************
function initCreate() {

  //Initialize S3 Uploader
  initS3Oploader();

  // but excessive, but this is click and change handling,
  // should give nice and direct user feedback
  $('#link_url').on('input',function(e) { $('input[name="input_select"][value="link"]').prop("checked", true); checkInput() } );
  $('#link_url').click( function(e) { $('input[name="input_select"][value="link"]').prop("checked", true); checkInput() } );
  $('#asset-from-archive').click(function(e) { $('input[name="input_select"][value="archive"]').prop("checked", true); checkInput( "skip" ) } );
  $('#asset-from-archive').change(function(e) { $('input[name="input_select"][value="archive"]').prop("checked", true); checkInput( "ignore" ) } );
  $('#file').click(function(e) { $('input[name="input_select"][value="s3_direct"]').prop("checked", true); checkInput( "ignore" ) } );

  $('#save_button').click( doCreateProgram );
  $('#save_button').addClass('disabled');
}
