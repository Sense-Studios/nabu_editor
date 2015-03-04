var showMarqerInfoFromTrackEvent = function( e, that ) {
  
  // set the header
  $('.modal-title').html( '<span>' + $(that).data('name') + ' <small> '+$(that).data('type')+' </small></span>' )
  
  // clear the body
  $('#marqer_editor_dialog .modal-body').html('')    
  
  // render in/out editor
  // html += renderInOutEditor( that ) 

  var someMarqer = getMarqerById( $(that).data('remote_id') )
  
  // this is needed for some depricated
  // issues from the old days, right now we only use
  // remote ids
  someMarqer.remote_id = someMarqer.id
  
  // failsafe
  if ( someMarqer === null ) {
    console.log("WARNING: marqer nog found")
    return;
  }

  // traverse through the option/value pairs of the marqer
  $.each( someMarqer.marqeroptions, function(key, element ) {
    
    // set context for parser, 
    // find the templates in /assets/javascripts/templates    
    var context = {
      key: key,
      element: element,
      label: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
      rand_id: (+new Date()) // use remote id ?
    };

    // extra's (unit renders a value after a textfield)
    if ( element.unit ) context.unit = element.unit;

    // render the output through handlebars, http://handlebarsjs.com/ => /dir/file(object)
    // find the templates in /assets/javascripts/templates        
    var output = ''
    try {
      output = HandlebarsTemplates['marduq/editor/' + element.type](context);
    } catch (err) {
      // console.log('WARNING: marqer edit element render not found in Handlebars! ' + key + ", " + element.type + ", " + err);
      return
    }

    // attach the output to the form
    $('#marqer_editor_dialog .modal-body').append( output )

    // start post rendering, after the html has been appended
    postRender( someMarqer, context )
  });
  
  // set the change handlers            
  $('input.form-control').on('input', function(e) {
    if ( $(this).hasClass("list-input" ) ) return;
    someMarqer.marqeroptions[$(this).attr('data-key')].value = $(this).val();
  });    
  $('input.form-control').change(function(e) {     
    if ( $(this).hasClass("list-input" ) ) return;
    someMarqer.marqeroptions[$(this).attr('data-key')].value = $(this).val();
  });
  $('textarea.form-control').on('input', function(e) {
    someMarqer.marqeroptions[$(this).attr('data-key')].value = $(this).val();
  });
  $('select.form-control').change(function(e) {
    someMarqer.marqeroptions[$(this).attr('data-key')].value = $(this).val();
  });
  
  // attach save and delete
  $('#modal_save_button').unbind('click')
  $('#modal_save_button').click( function(e){ updateMarqer(someMarqer) })
  $('#modal_delete_button').unbind('click')
  $('#modal_delete_button').click( function(e){ deleteMarqer(someMarqer) })

  // show the modal
  $('#marqer_editor_dialog').modal('toggle'); 
  
  // give the track event a 'selected' state
  // selectTrackEvent(this)
}

var postRender = function( someMarqer, context ) {
  
  //////
  /// POST RENDER
  //////////___________________________________________________________________________

  // post render contains functions that are initialized
  // AFTER the HTML is appended, it then proceeds to add 
  // interaction and callbacks to that element  
  
  var key = context.key
  var element = context.element
  
  var post_renders = {
    text: function() {
      // there is nothing here
    },
    
    code: function() {
      // there is nothing here
    },

    // select
    select: function() {
        $('#' + key + '_field').val( element.value );
        $('#' + key + '_field').change(function() {
            setTimeout(preview, 400);
        });
    },
  
    // colorpicker
    colorpicker: function() {
      $('#' + context.rand_id).colorpicker();
      $('#' + context.rand_id).colorpicker().on('changeColor', function(ev) {
          var c = "rgb(" + ev.color.toRGB().r + "," + ev.color.toRGB().b + "," + ev.color.toRGB().b + ")";
          someMarqer.elements[$('#' + context.rand_id).find('input').attr('data-key')].value = c;
      });
    },
  
    // Number steppers
    number: function() {        
      $('#' + key + '_field').change(function() {
        preview();
      }); // don't hammer the server :p
    },
    
    // title/ Url lists (for menus and such)
    list: function() {

      function updateList() {
        var item_array = [];
        $.each( $('li.list-input-item'), function( key, value ) {
          var current = {};
  
          // TODO, make it that you can add more input
          current.title = $(this).find('input:eq(0)').val();
          current.url = $(this).find('input:eq(1)').val();
          current.blank = $(this).find('input:eq(2)').prop("checked");    // hamlbars needs a 'truish' var
          console.log("I has this: ", $(this));
          holder= $(this);
          // current.flag1 = $(this).find('input:eq(3)').val();
          // current.flag2 = $(this).find('input:eq(4)').val();
          item_array.push( current );
        });
  
        someMarqer.elements["items"].value = item_array;  
      }
      
      function appendItemToList( title, url, blank ) {                           
        context.item = { "title": title, "url": url, "blank": true  };
        context.key = "item_";   
        var list_item = HandlebarsTemplates['marduq/editor/list_item']( context);          
        $('ul.list').append( list_item );                                                                         // append with this id          
        $('input.list-input').on('input', function(e) { updateList() } );                                         // update
        $('input.list-input').on('change', function(e) { updateList() } );       
        $(".delete_list_item").click( function(e) { $(this).parent().parent().parent().remove(); updateList(); }) // delete
      }              

      console.log('set click')
      // add 
      $(".add_list").click( function() { 
        appendItemToList( "", "", false ) 
        console.log('append')
      });

      // has list elements
      $.each( context.element.value, function( key, value ) { appendItemToList( value.title, value.url, value.blank ) });
      
    },
  
    // file browser, handler further down
    file: function() {}
  }
  
  // Needs refactoring
  // this way it only works for 1 file field :-/
  if (element.type == "file") {
    // ajax in a form
    $.ajax({
      url: '/admin/s3_upload',
      method: 'get',
      success: function(data) {
        // append the upload form                  
        $('#marqer_editor_dialog').find('#fileholder_' + key).append(data);

        // post, activate delete button
        // TODO

        // activate the s3 uploader
        $('#fileholder_' + key).S3Uploader({
          max_file_size: 1258291200
            //progress_bar_target: $('.js_progress_bars'),
            //allow_multiple_files: false,
            //remove_completed_progress_bar: false
        });

        // Upload start
        $('#fileholder_' + key).bind('s3_uploads_start', function(e) {
            console.log("upload start ... ");
            $('#imageholder_image').html('<p>Plaatje wordt geupload ... </p>')
        });

        // Upload complete
        $('#fileholder_' + key).bind("s3_upload_complete", function(e, content) {
          console.log("upload complete!");

          // create asset with image
          var assetData = {};

          // this is a little dirty, but the fastest for now           
          var t = "Image"; // default
          if (content.filetype.toLowerCase().indexOf('audio') != -1) t = "Audio";
          if (content.filetype.toLowerCase().indexOf('video') != -1) t = "Video";
          assetData._type = t;
          assetData.original_url = content.url;
          assetData.original_filename = content.filename;
          assetData.s3_key = content.s3_key;
          assetData.title = "";
          assetData.description = "";
          assetData.tags = "";

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

          // show it in the editor
          $('#imageholder_' + key).html('');
          $('#imageholder_' + key).append("<img style='max-height:255px' src='" + content.url + "'/>");          
          
          // throw it to the element
          someMarqer.marqeroptions.image.value = content.url;
          preview();
        });
      },
      fail: function(data) {
        console.log('FAIL');
      }
    });
  }
  
  // now execute!
  console.log( 'post render, ', element.type )
  try { 
    post_renders[ element.type ]()
  }catch(e){
    console.log( element.type, " had no post render functions")
  }
}

var renderInOutEditor = function( e, that ) { 
  // ### add in and output editors
  var context = {
    "trackEventStart": 10, //Math.round( trackEventObject.options.start* 100 ) / 100,
    "trackEventEnd": 20, //Math.round( trackEventObject.options.end * 100 ) / 100    
  };
  
  return HandlebarsTemplates['marduq/editor/in_out_editor'](context);
  
  //// ### add skip to functionality  
  //$( ".btn-skip-to-in" ).click( function() { pop.currentTime( Number( $('#editor_in_point').val() ) + 0.1 ); });
  //$( ".btn-skip-to-out" ).click( function() { pop.currentTime( Number( $('#editor_out_point').val() ) - 0.1 ); });

  //// ### (Not used) add automatic updates
  ////clearInterval( in_out_update_interval )
  ////in_out_update_interval = setInterval( function() {
  ////  $("#editor_in_point").val( currentTrackEvent.start )
  ////  $("#editor_out_point").val( currentTrackEvent.end )
  ////}, 1000 )
  
  //// ### on inpoint change
  //$("#editor_in_point").change( function(e){ 
  //  trackEventObject.options.start = $("#editor_in_point").val();
  //  trackEventObject.start = $("#editor_in_point").val();  
  //  currentTrackEvent.start = $("#editor_in_point").val();
  //  var newLeft = ( parseInt( $("#editor_in_point").val(), 10 ) / pop.duration() ) * $('#timeLineContainer').width();
  //  $( trackEventObject.element ).css('left', newLeft + 'px');
  //});
  
  //// ### on outpoint change
  //$("#editor_out_point").change( function(){             
  //  trackEventObject.options.end = $("#editor_out_point").val();
  //  trackEventObject.end = $("#editor_out_point").val();
  //  currentTrackEvent.end = $("#editor_out_point").val();
  //  var newWidth = ( ( parseInt( $("#editor_out_point").val(), 10 ) - parseInt( $("#editor_in_point").val(), 10 ) ) / pop.duration() ) * $('#timeLineContainer').width();
  //  $( trackEventObject.element ).css('width', newWidth + 'px');
  //});
}

