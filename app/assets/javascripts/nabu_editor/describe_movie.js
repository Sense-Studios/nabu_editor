/* global
program
MarduqApi
save
program_id
pop
m
*/

// *****************************************************************************
//  Parse & Set
// *****************************************************************************

// so the program meta is moved to the local metadata
// on change, the local object is changed and (re-) parsed to allow
// fow live update, only on save, is the metadata sent to the server
// and stored, and the page is reset

// get all the info out of the program meta container
// and past it into the website

function setDataFromProgram() {
  
  console.log("SETTING DATA FROM PROGRAM")
  
    // this is a new program, appearently, set meta data to descriptor
  if ( program.meta === "" || program.meta === null || program.meta === undefined ) {
    
    console.log("ignoring empty meta info")
    console.log("this should be handled by the server!!")
    // injectMetadata( id )
    
    //console.log("no meta info found on program, setting it .. ");
    
    //// fill with the data from the asset
    //metaData.moviedescription.title = program.program_items[0].asset.title;
    //metaData.moviedescription.description = program.program_items[0].asset.description;
    //metaData.moviedescription.tags = program.program_items[0].asset.tags.join(',');
    //metaData.moviedescription.thumbnail = program.program_items[0].asset.thumbnail_url;
    
    //// set it
    //program.meta = metaData;

    //// quickly fill the fields
    //initTextField( $('#title'), metaData.moviedescription, "title" );
    //initTextField( $('#description'),  metaData.moviedescription, "description"  );
    //// initTextField( $('#in-point'), metaData.moviedescription, "in-point"  );
    //// initTextField( $('#out-point'), metaData.moviedescription, "out-point" );
    //initTextField( $('#tags'), metaData.moviedescription, "tags" );
    
    //// inject default marqers
    //injectMarqers();
  
  }else{    
    metaData = program.meta;
  }
  
  console.log("doublecheck program data:")
  console.log(" -- ", program.program_items[0].asset.title )
  console.log(" -- ", program.program_items[0].asset.description )
  console.log(" -- ", program.program_items[0].asset.tags )
  console.log(" -- ", program.program_items[0].asset.thumbnail_url )

  console.log("setting metadata:")
  console.log(" -- ", metaData.moviedescription.title )
  console.log(" -- ", metaData.moviedescription.description )
  console.log(" -- ", metaData.moviedescription.tags )
  console.log(" -- ", metaData.moviedescription.thumbnail )  
  
  // Tab1: set Movie Info Tab
  // initTextField( $('#title'), program.program_items[0].asset, "title" );
  // initTextField( $('#description'),  program.program_items[0].asset, "description"  );
  // initTextField( $('#tags'), program.program_items[0].asset, "tags" );

  initTextField( $('#title'), metaData.moviedescription, "title" );
  initTextField( $('#description'),  metaData.moviedescription, "description"  );
  initTextField( $('#tags'), metaData.moviedescription, "tags" );
  // initTextField( $('#in-point'), metaData.moviedescription, "in-point"  );
  // initTextField( $('#out-point'), metaData.moviedescription, "out-point" );
  // alert('<iframe src="http://nabu.sense-studios.com/'+ program.id +'" allowFullscreen="true" scrolling="no"></iframe>')
  $('textarea#program_embed').text('<iframe src="http://nabu.sense-studios.com/' + program.id + '" allowFullscreen="true" scrolling="no"></iframe>' );
  $('textarea#program_url').text('http://nabu.sense-studios.com/' + program.id);

  
  // add the pictiures
  $('.image-picker').html('')                                                //reset
  $('.thumbnail-image-preview').attr('src', 'http://placehold.it/640x360')   // reset
    
  // each thumbnail in the asset  
  if ( program.program_items[0].asset._type == "Video" ) {
    var cn = 0
    $.each( program.program_items[0].asset.thumbnails.medium, function( key, value ) { 
      $('.image-picker').append('<option data-img-src="' + value + '" value="1" > Thumbnail </option>');
      cn++;
    });
  }
    
  if ( program.program_items[0].asset._type == "Youtube" || program.program_items[0].asset._type == "Vimeo" ) {
    $('.image-picker').append('<option data-img-src="' + program.program_items[0].asset.thumbnail_url + '" value="1" > Thumbnail </option>') 
  }
  
  // add the current, floating thumbnail
  // $('.image-picker').append('<option data-img-src="' + program.program_items[0].asset.thumbnail_url + '" value="1" > Thumbnail </option>') 
  
  // initialize the thumbnails
  $(".image-picker").imagepicker({            
    //clicked: function(e) {      
    //  console.log('updating thumbnail', $(this).find('option:selected').attr('data-img-src'))
    //  metaData.moviedescription.thumbnail = $(this).find('option:selected').attr('data-img-src');      
    //  postMetaData() // fuck it and safe
    //}
  }); 
   
  // image picker click doesn't work, so I had to rewrite it here, bitches
  $('.image_picker_image').unbind('click')
  $('.image_picker_image').click( function() {
    metaData.moviedescription.thumbnail = $(this).attr('src'); 
    
    // should be wrapped in a more commen 'updating' state
    $('.leprograms').find('.selected').animate({'opacity':0.4}, 600); 
    postMetaData() // fuck it and safe
  })

  // ### Tab2: set Player Options
  setOptions( movie_options_checkboxes, metaData.player_options  );
  initTextField( $('#pop_under_program'),  metaData.player_options, "pop_under_target" );

  // Tab3: set On Movie End
  $('input[name="on-movie-end"][value="'+ metaData.on_movie_end.set +'"]').attr("checked", "checked");
  $('input[name="on-movie-end"]').change(function(e) { metaData.on_movie_end.set = $('input[name="on-movie-end"]:checked').val(); });
  initTextField( $('#linked-page'),  metaData.on_movie_end, "linked_page" );
  initTextField( $('#movie-end-text'),  metaData.on_movie_end, "shown_text" );
  initTextField( $('#next-program'),  metaData.on_movie_end, "next_program_id" );  
  setOptions( movie_end_checkboxes, metaData.on_movie_end  );
  
  // ###  Tab4 set Social
  initTextField( $('#social-title'),  metaData.social, "title" );
  initTextField( $('#social-url'),  metaData.social, "url" );
  initTextField( $('#social-description'),  metaData.social, "description" );
  initTextField( $('#social-subject'),  metaData.social, "subject" );
  initTextField( $('#social-body'),  metaData.social, "body"  );
  setOptions( social_checkboxes, metaData.social  );
    
  // activate autofill social from movie data
  $('#autofill').click(function() {
    $('#social-title').val( metaData.moviedescription.title );
    $('#social-url').val( "http://" + location.hostname + "/" + program_id );
    $('#social-description').val( metaData.moviedescription.description );
    $('#social-subject').val( metaData.moviedescription.title );
    $('#social-body').val( metaData.moviedescription.description );
    
    metaData.social.title = metaData.moviedescription.title;
    metaData.social.url = "http://" + location.hostname + "/" + program_id;
    metaData.social.description = metaData.moviedescription.description;
    metaData.social.subject = metaData.moviedescription.title;
    metaData.social.body = metaData.moviedescription.description;
  });

  // Tab5 set Advanced

  // set images, if any
  if ( metaData.advanced.show_image_before_url !== "" ) {
    $('#img_holder_before_movie_image').html('');
    $('#img_holder_before_movie_image').append("<img style='max-height:255px' src='" + metaData.advanced.show_image_before_url + "'/>");
  }
  
  if ( metaData.advanced.show_image_during_url !== "" ) {    
    $('#img_holder_branded_logo_image').html('');
    $('#img_holder_branded_logo_image').append("<img style='max-height:255px;' src='" + metaData.advanced.show_image_during_url + "' />");
  }
    
  if ( metaData.advanced.show_image_after_url !== "" ) {
    $('#img_holder_after_movie_image').html('');
    $('#img_holder_after_movie_image').append("<img style='max-height:255px;' src='" + metaData.advanced.show_image_after_url + "'/>");    
  }
  
  // set checkboxes
  setOptions( advanced_checkboxes, metaData.advanced );
  
  // init uploaders  
  // init_s3_uploader( '#before_movie_image', '#img_holder_before_movie_image', '#delete_before_movie_image', "show_image_before_url" );
  // init_s3_uploader( '#branded_logo_image', '#img_holder_branded_logo_image', '#delete_branded_logo_image', "show_image_during_url"  );
  // init_s3_uploader( '#after_movie_image', '#img_holder_after_movie_image', '#delete_after_movie_image', "show_image_after_url" );
  
  // first time parsing of the meta data object
  // so all checkboxes etc. will concurr
  
  updateMetaData();
}

// for now I wire up all the different elements, 
// but of course we could agree upon one data object
// that holds everything, but as this will prolly
// be debated a lot, I choose flexibility over code
// convenience
function updateMetaData() {
  
  // player data
  // switches the player on and off whil checking the boxes
  // Move to player options, although these are needed to show realtime what its gonna be?
  metaData.player_options.scrubbar === "true" ? $('#scrubbar').show() : $('#scrubbar').hide();
  metaData.player_options.time === "true"  ? $(".current_time").show() : $(".current_time").hide();
  metaData.player_options.duration === "true"  ? $(".duration").show() : $(".duration").hide();
  metaData.player_options.time === "false"  && metaData.player_options.duration === "false" ? $("#time").hide() : $("#time").show();     // if neither, hide the time div
  metaData.player_options.time === "true"  && metaData.player_options.duration === "true" ? $(".devider").show() : $(".devider").hide(); // if both, show the devider
  metaData.player_options.quality === "true"  ? $("#butt-togglequality").show() : $("#butt-togglequality").hide();
  metaData.player_options.fullscreen === "true"  ? $("#butt-togglefullscreen").show() : $("#butt-togglefullscreen").hide();
  metaData.player_options.seek === "true"  ? $(".seek").show() : $(".seek").hide();
  metaData.player_options.volume === "true"  ? $(".volume").show() : $(".volume").hide();
  metaData.player_options.mute === "true"  ? $(".mute").show() : $(".mute").hide();  
  metaData.player_options.show_big_play === "true"  ? $(".big-play").show() : $(".big-play").hide();
  
  // bring this back ?
  //metaData.player_options.title === "true"  ? $("#video_frame .title").show() : $("#video_frame .title").hide();
  
  // depricated
  metaData.player_options.showscores === "true"  ? $(".MTScoreMarqer").fadeIn() : $(".MTScoreMarqer").fadeOut();

  
  // takes out the scrubbar
  if ( metaData.player_options.allow_scrubbing === "true" ) {
    $('.progress').css({'pointer-events':'all'});
    $('.progress').css({'cursor':'all'});
  }else{
    $('.progress').css({'pointer-events':'none'});
    $('.progress').css({'cursor':'none'})  ;  
  }  
}

// #############################################################################
//  Helpers
// #############################################################################

// S3 Uploader
function init_s3_uploader( target, img_holder, delete_button, meta_adress ) {  
  // post, activate delete button
  // TODO, use delete_button
  
  console.log("init uploader", target );
  
  // activate the s3 uploader
  $( target ).S3Uploader({
    max_file_size: 1258291200
    // progress_bar_target: $('.js_progress_bars'),
    // allow_multiple_files: false,
    // remove_completed_progress_bar: false
  });
  
  // Upload start
  $( target ).bind('s3_uploads_start', function(e) {
    console.log("start upload");
    // we could add a loader here, but ...
  });
      
  // Upload complete, show image, write it in metadata
  $( target ).bind("s3_upload_complete", function(e, content) {                          
    metaData.advanced[ meta_adress ] = content.url;
    $( img_holder ).html('');
    $( img_holder ).append("<img style='max-height:255px' src='" + content.url + "'/>");
  });
}

// Boolean conversion Helper
function toBool( _str ) {
  return (_str=="true") ? true : false;
}

function initTextField( field, branche, key ) {
  field.val( branche[key] );
  field.change( function(e) {
    console.log("changed!");
    branche[key] = field.val();
  });
}

// Option Helper
function setOptions( _opt, target  ) {    
  
  $.each( _opt, function(key, value) {
    value[1].prop('checked', toBool( target[ value[0] ] ) ); 
    
    // attach change handlers
    value[1].change( function(e) { 
      if ( $(this).is(':checked') ) {
       target[value[0]] = "true";
      }else{
       target[value[0]] = "false";
      }
      updateMetaData();
    });
  });
}

// Post Helper, SAVE, save
function postMetaData( noreload ) {
    console.log("#### POST META DATA program, noreload:", noreload);
  
    // reset the warning
    window.onbeforeunload = null;
  
    // set the api
    var mapi = new MarduqApi();
    var saveprogram = {};
    
    // force the current values to the program
    saveprogram.id = program.id;
    saveprogram.title = $('#title').val();
    saveprogram.descriptions = $('#description').val();
    saveprogram.tags = $('#tags').val();              
    
    // and save all the meta info too    
    saveprogram.meta = metaData;

    // show which movie is updating
    $('.leprograms').find('.selected').animate({'opacity':0.4}, 600); 
    
    console.log(" ##### Save, Post meta data for program: ");
    console.log( program );

    mapi.updateProgram({
      program: saveprogram,
      success: function( response ){
        console.log("update gelukt!", response, !noreload);

        // reset the save button
        $('#save_movie').removeClass('btn-material-yellow')
        $('#save_movie').addClass('btn-material-pink')
          
        // reload programs
        setPrograms()        
      },
      failure: function( response ){
        console.log("update faal!", response);
        alert("something went wrong during save, usually this error occurs when you try to save twice. Please reload the page.");
      }
    });
}

// #############################################################################
//  Update and warning
// #############################################################################

// To-JSON helper
function updateJson() {
  var md = JSON.stringify( metaData );
  $('#feedback').val( md );  
  if ( md != formerMetaData ) {
    //alert("data has changed")    
    dataHasChanges = true;
    //$('#save-all-button-top').removeClass('disabled')
    //$('#save-all-button-bottom').removeClass('disabled')
  }
  
  formerMetaData = md;
}

// ### Shows a warning on pageleave
function doWarning() {    
  if (dataHasChanges) {
    var msg = "You have unsaved changes! Are you sure you want to leave the page?";
    return msg;
  }
}

// #############################################################################
//  S3 Thumbnail uploader
// #############################################################################

function initThumbnailUploader() {
  
  console.log("init thumbnail uploader");
  
  // init uploader
  $("#preview_thumbnail").S3Uploader( {
    max_file_size: 1258291200,
    allow_multiple_files: false,
  });
  
  // Start loading asset
  $('#preview_thumbnail').bind("s3_uploads_start", function(e, content) {
    console.log("upload start ... ");
    $('.leprograms').find('.selected').animate({'opacity':0.4}, 600);
  });
  
  // complete, create an asset
  $('#preview_thumbnail').bind("s3_upload_complete", function(e, content) {
    console.log("upload complete ... ");
    
    // create asset with image
    var assetData = {};
  
    // this is a little dirty, but the fastest for now           
    var type = "Image"; // default
    if (content.filetype.toLowerCase().indexOf('audio') != -1) type = "Audio";
    if (content.filetype.toLowerCase().indexOf('video') != -1) type = "Video";

    assetData._type = type;
    assetData.original_url = content.url;
    assetData.original_filename = content.filename;
    assetData.s3_key = content.s3_key;
    assetData.title = "custom thumbnail bij " + $('#title').val();
    assetData.description = "thumbnail for " + $('#title').val();
    assetData.tags = "thumbnail";
  
    // throw it into the marduq API
    var mapi = new MarduqApi();
    mapi.createAsset({
      asset: assetData,
      success: function(response) {
          console.log("SAVE: create assset had succes !", response);
      },
      failure: function(response) {
          console.log("SAVE: create asset FAIL !!", response);
      }
    });
      
    // select and set it in the data
    metaData.moviedescription.thumbnail = content.url;

    // throw it to the window
    $('.thumbnail-image-preview').attr('src', content.url)

    // fuck it and save
    postMetaData()
  });
}

// #############################################################################
//  Initializer, entry point
// #############################################################################

// check for save
var dataHasChanges = false;
var formerMetaData = "";

// helper, waits for the program to load, then starts the site
function loadProgram() {
  
  // wait for a program to be available
  if ( program === undefined ) {
    setTimeout( loadProgram, 500 );
    return;
  }
  
  // create the program from save
  console.log("call setting data from program")
  setDataFromProgram();
    
  // update the dataobject
  formerMetaData = JSON.stringify( metaData );
  setInterval( updateJson, 500 );
  
  // set the warning script
  window.onbeforeunload = doWarning;
}

function initDescribe() {
  
  // this can be done more neatly
  // but this is a quick and flexible fix
  // should be rewritten with a naming convention 
  // or put the jquery objects directly into the meta info
  if (program === undefined) return;
  
  // handle saving
  $('#save-all-button-top').click( function(e) { postMetaData() } );  
  $('#save-all-button-bottom').click( function(e) { postMetaData() } );  
  
  // for ze thumbnails
  initThumbnailUploader();

  // wait for the program to load
  loadProgram();
}
