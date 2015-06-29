/* globals
stopScreenEditor
getMarqerById
updateMarqer
deleteMarqer
convertSeconds
preview
HandlebarsTemplates
ace
keysEnabled
MarduqApi
*/

/////
/// MARQER MODAL RENDERER (for the editor)
////////////////_______________________________________________________________________

// Modal Translation Helper
var translateKey = function(key) {
  var returnkey = key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
  var translations = {
    'title': 'Titel',
    'css': 'Opmaak(css)',
    'classes': 'Classen',
    'html': 'Markup(html)',
    'original': 'Origineel',
    'position': 'Positie',
    'image': 'Plaatje',
    'audio': 'Geluidje',
    'url': 'Link',
    'rss_url': 'RSS-Feed',
    'target': 'Doel',
    'code': 'Code',
    'number': 'Nummer',
    'hashtags': '#Hashtags',
    'person': '@Persoon',
    'help': 'Informatie',
    'time': 'tijd',
    'mp3': 'mp3',
    'radio': 'radio'
  };

  var trykey = null;
  trykey = translations[key];
  if ( trykey !== null ) returnkey = trykey;
  return trykey;
};

var showMarqerInfoFromTrackEvent = function( e, that ) {
  // stop it!
  stopScreenEditor();

  // set the header
  $('.modal-title').html( '<span>' + $(that).data('name') + '</span>' );

  // clear the body
  $('#marqer_editor_dialog .modal-body-editors').html('');
  $('#marqer_editor_dialog .modal-body-editors-advanced').html('');

  // render in/out editor
  // html += renderInOutEditor( that )
  var someMarqer = getMarqerById( $(that).data('remote_id') );

  // this is needed for some depricated
  // issues from the old days, right now we only use
  // remote ids
  someMarqer.remote_id = someMarqer.id;

  // failsafe
  if ( someMarqer === null ) {
    console.log("WARNING: marqer not found");
    return;
  }

  // traverse through the option/value pairs of the marqer
  $.each( someMarqer.marqeroptions, function(key, element ) {

    // set context for parser,
    // find the templates in /assets/javascripts/templates
    var context = {
      key: key,
      element: element,
      label: translateKey(key), //key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
      rand_id: (+new Date()) // use remote id ?
    };

    console.log("--> render marqer elements KEY: ", key );

    // extra's (unit renders a value after a textfield)
    if ( element.unit ) context.unit = element.unit;

    // render the output through handlebars, http://handlebarsjs.com/ => /dir/file(object)
    // find the templates in /assets/javascripts/templates
    var output = '';
    var output_advanced = '';
    try {
      if ( element.advanced ) {
        output_advanced = HandlebarsTemplates[ element.type ](context);
      }else{
        output = HandlebarsTemplates[ element.type ](context);
      }
      
    } catch (err) {
      console.log('WARNING: marqer edit element render not found in Handlebars! ' + key + ", " + element.type + ", " + err);
      return;
    }

    // attach the output to the form
    $('#marqer_editor_dialog .modal-body-editors').append( output );
    $('#marqer_editor_dialog .modal-body-editors-advanced').append( output_advanced );

    // start post rendering, after the html has been appended
    postRender( someMarqer, context );
    
    // show the tab
    // $('#myTab a[href="#geavanceerd"]').tab('show');
    setTimeout( $('#myTab a[href="#instellingen"]').tab('show'), 100 );
  });
  
  //
  convertSeconds('#time_field');

  // set the change handlers
  $('#marqer_editor_dialog input.form-control').on('input', function(e) {
    if ( $(this).hasClass("list-input" ) ) return;
    someMarqer.marqeroptions[$(this).attr('data-key')].value = $(this).val();
  });

  $('#marqer_editor_dialog input.form-control').change(function(e) {
    if ( $(this).hasClass("list-input" ) ) return;
    someMarqer.marqeroptions[$(this).attr('data-key')].value = $(this).val();
  });

  $('#marqer_editor_dialog textarea.form-control').on('input', function(e) {
    someMarqer.marqeroptions[$(this).attr('data-key')].value = $(this).val();
  });

  $('#marqer_editor_dialog select.form-control').change(function(e) {
    someMarqer.marqeroptions[$(this).attr('data-key')].value = $(this).val();
  });

  // attach save
  $('#modal_save_button').unbind('click');
  $('#modal_save_button').click( function(e){ 
    updateMarqer(someMarqer);
    setTimeout( function(){ preview(); }, 400 );
  });

  // attach delete // depricated
  $('#modal_delete_button').unbind('click');
  $('#modal_delete_button').click( function(e){ deleteMarqer(someMarqer) });

  // show the modal
  $('#marqer_editor_dialog').modal('toggle');

  // give the track event a 'selected' state
  // selectTrackEvent(this)
  $('#marqer_editor_dialog').bind('hidden', function() { keysEnabled = true } );
};

  //////
  /// POST RENDER
  //////////___________________________________________________________________________

  // post render contains functions that are initialized
  // AFTER the HTML is appended, it then proceeds to add
  // interaction and callbacks to that element based on its key


var postRender = function( someMarqer, context ) {

  var key = context.key;
  var element = context.element;

  var post_renders = {
    text: function() {
      // there is nothing needed here
    },

    code: function() {
      // https://github.com/ajaxorg/ace/issues/1518
      ace.config.set('basePath', '/assets/ace');
      
      // http://stackoverflow.com/questions/14053820/how-to-set-the-source-path-in-ace-editor
      ace.config.set("modePath", "/assets/ace");
      ace.config.set("workerPath", "/assets/ace");
      ace.config.set("themePath", "/assets/ace");

      var editor = ace.edit( key + "_editor" );
      editor.setTheme("ace/theme/twilight");
      editor.getSession().setMode("ace/mode/" + element.language );
      editor.setValue( element.value );
      editor.on("change", function(e){
        element.value = editor.getValue();
      });
    },

    // select
    select: function() {
      $('#' + key + '_field option[value="' + element.value +'"]').attr("selected", "selected");
      $('#' + key + '_field').change(function() {
        setTimeout(preview, 100);
      }); 
      setTimeout( function() {
        $('.dropdown_select').dropdown();
        $('.dropdownjs ul li').click(function() {
          var selectedvalue = $(this).attr('value');
          var selected = $(this).parent().parent().prev('.dropdown_select');
          setTimeout( function() {
            $(selected[0]).find('option').removeAttr('selected');
            $(selected[0]).val($(selected[0]).find('option[value="' + selectedvalue + '"]').val()).trigger('change');
            $(selected[0]).find('option[value="' + selectedvalue + '"]').attr('selected', 'selected');
          }, 200);
        });
      }, 300);
    },
    
    // select
    selectObject: function() {
      $('#' + key + '_field option[value="' + element.value +'"]').attr("selected", "selected");
      $('#' + key + '_field').change(function() {
        setTimeout(preview, 100);
      }); 
      setTimeout( function() {
        $('.dropdown_select').dropdown();
        $('.dropdownjs ul li').click(function() {
          var selectedvalue = $(this).attr('value');
          var selected = $(this).parent().parent().prev('.dropdown_select');
          setTimeout( function() {
            $(selected[0]).find('option').removeAttr('selected');
            $(selected[0]).val($(selected[0]).find('option[value="' + selectedvalue + '"]').val()).trigger('change');
            $(selected[0]).find('option[value="' + selectedvalue + '"]').attr('selected', 'selected');
          }, 300);
        });
      }, 400);   
    },

    radio: function() {
      $("input[name=target][value=" + element.value + "]").prop('checked', true);
    },

    // colorpicker
    colorpicker: function() {
      console.log("has colopicker: ", key, element, context );
      $('#' + context.rand_id ).colorpicker( {'format':'rgba'} )
      $('#' + context.rand_id ).colorpicker().on('changeColor', function(ev) {
          // this is a remarkably stupid way to do this          
          //console.log(ev.color.toRGB());
          var tmp = ev.color.toRGB();
          var c = 'rgba('+tmp.r+','+tmp.g+','+tmp.b+','+tmp.a+')';
          someMarqer.marqeroptions[key].value = c;
      });
      
      // remove the colorpicker
      $('#marqer_editor_dialog').on('hidden.bs.modal', function () {
        $('#' + context.rand_id ).remove();
      })
    },

    // Number steppers
    number: function() {
      $('#' + key + '_field').change(function() {
        // preview();
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
          // console.log("I has this: ", $(this));
          // holder= $(this);
          // current.flag1 = $(this).find('input:eq(3)').val();
          // current.flag2 = $(this).find('input:eq(4)').val();
          item_array.push( current );
        });

        someMarqer.elements.items.value = item_array;
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

      // add
      $(".add_list").click( function() {
        appendItemToList( "", "", false );
      });

      // has list elements
      $.each( context.element.value, function( key, value ) { appendItemToList( value.title, value.url, value.blank ) });
    },

    // file browser, handler further down
    file: function() {}
  };

  // File upload
  // Needs refactoring
  // this way it only works for 1 file field :-/
  if (element.type == "file") {
    console.log("I'm a: ", element);
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
          max_file_size: 12000000,
          progress_bar_target: $('.ui_progress_bars')
          //allow_multiple_files: false,
          //remove_completed_progress_bar: false
        });

        // Upload start
        $('#fileholder_' + key).bind('s3_uploads_start', function(e) {
            console.log("upload start ... ");
            $('#placeholder_image').html('<p>Bestand wordt geupload ... </p>')
        });

        // Upload complete
        console.log('bind s3_upload_complete', key, $('#fileholder_' + key))
        $('#fileholder_' + key).bind("s3_upload_complete", function(e, content) {
          console.log("upload complete!");
          // $('#placeholder_image')

          // create asset with image
          var assetData = {};

          // this is a little dirty, but the fastest for now
          var t = {
            'audio': 'Audio',
            'image': 'Image'
          }[key];

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

          // show it in the editors
          if (key == 'image') {
            $('#imageholder_' + key + ' img').attr( 'src', content.url  );
          }
          if (key == 'audio') {
            $('#imageholder_' + key + ' img').remove();
            $('#audio_controls audio').remove();
            $("<audio controls></audio>").attr({
                'src': content.url,
                'volume':0.4
            }).appendTo('#audio_controls');
          }

          $('#placeholder_image').remove();

          // throw it to the element
          someMarqer.marqeroptions[key].value = content.url;
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
