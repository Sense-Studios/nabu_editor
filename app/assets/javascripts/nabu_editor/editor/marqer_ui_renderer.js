/* globals
stopScreenEditor > user_interface.js
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
  return t.marqer_ui[key]
/*
  var returnkey = key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
  var translations = {
    'title':    'Titel',
    'css':      'CSS3, Opmaak',
    'classes':  'Classen',
    'html':     'HTML5, Hypertext Markup',
    'original': 'Origineel',
    'position': 'Positie',
    'image':    'Plaatje',
    'audio':    'Geluidje',
    'url':      'Link',
    'rss_url':  'RSS-Feed',
    'target':   'Doel',
    'code':     'Code',
    'number':   'Nummer',
    'hashtags': '#Hashtags',
    'person':   '@Persoon',
    'help':     'Informatie',
    'time':     'tijd',
    'mp3':      'mp3',
    'radio':    'radio',
    'jsx':      'React JSX, JavaScriptXml'
  };

  var trykey = null;
  trykey = translations[key];
  if ( trykey !== null ) returnkey = trykey;
  return trykey;
*/
};

var showMarqerInfoFromTrackEvent = function( e, that ) {

  stopScreenEditor();  // stop screen editing!
  keysEnabled = false; // and enable the keyboard for other things!

  // set the header
  $('.modal-title').html( '<span>' + $(that).data('name') + '</span>' );

  // clear the body
  $('#marqer_editor_dialog .modal-body-editors').html('');
  $('#marqer_editor_dialog .modal-body-editors-advanced').html('');

  // render in/out editor
  // html += renderInOutEditor( that )
  var someMarqer = getMarqerById( $(that).data('remote_id') );

  // failsafe
  if ( someMarqer === null ) {
    console.log("WARNING: marqer not found");
    return;
  }

  // this is needed for some depricated
  // issues from the old days, right now we only use
  // remote_id, every id is remote in the cloud
  someMarqer.remote_id = someMarqer.id;

  // traverse through the option/value pairs of the marqer
  $.each( someMarqer.marqeroptions, function(key, element ) {

    // set context for parser,
    // find the templates in /assets/javascripts/templates
    var context = {
      key: key,
      element: element,
      //label: translateKey(key),  //key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
      rand_id: (+new Date())     // or use remote_id, or utils.guid
    };

    // available keys
    // add position?

    console.log(" Editor: Render UI Element for key: ", key );

    if ( element.label !== undefined ) context.label = element.label    // assign label if any
    if ( element.unit ) context.unit = element.unit; // extra's (unit renders a value after a textfield)
    if ( element.step ) context.step = element.step; // for numbers, allows setting of stepping (increase/ decrease)

    var output = '';
    var output_advanced = '';
    try {
      if ( element.advanced ) {
        output_advanced = HandlebarsTemplates[ element.type ](context);
      }else{
        output = HandlebarsTemplates[ element.type ](context);
      }

    } catch (err) {
      // console.log('WARNING: marqer edit element render not found in Handlebars! ' + key + ", " + element.type + ", " + err);
      return;
    }

    // attach the output to the form
    $('#marqer_editor_dialog .modal-body-editors').append( output );
    $('#marqer_editor_dialog .modal-body-editors-advanced').append( output_advanced );

    // start post rendering, after the html has been appended
    postRender( someMarqer, context );
  });

  //
  convertSeconds('#time_field');

  // show the tab
  $('#myTab a[href="#instellingen"]').tab('show')

  // set the change handlers
  $('#marqer_editor_dialog input.form-control').on('input', function(e) {
    if ( $(this).attr('data-key') === undefined || $(this).hasClass("list-input" ) ) return;
    someMarqer.marqeroptions[$(this).attr('data-key')].value = $(this).val();
  });

  $('#marqer_editor_dialog input.form-control').change(function(e) {
    if ( $(this).attr('data-key') === undefined || $(this).hasClass("list-input") ) return;
    console.log("update key: ", $(this), $(this).attr('data-key'))
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
  // interaction and callbacks to that element based on the marqers original key

var postRender = function( someMarqer, context ) {

  var key = context.key;
  var element = context.element;

  var post_renders = {
    text: function() {},

    code: function() {
      // https://github.com/ajaxorg/ace/issues/1518
      ace.config.set('basePath', '/ace');
      // http://stackoverflow.com/questions/14053820/how-to-set-the-source-path-in-ace-editor
      ace.config.set("modePath", "/ace");
      ace.config.set("workerPath", "/ace");
      ace.config.set("themePath", "/ace");

      var editor = ace.edit( key + "_editor" );
      editor.setTheme("ace/theme/twilight");
      editor.$blockScrolling = Infinity
      editor.getSession().setMode("ace/mode/" + element.language );
      if ( element.wordwrap ) editor.getSession().setUseWrapMode(true);
      editor.setValue( element.value );
      editor.on("change", function(e){
        element.value = editor.getValue();
      });

      // large? --> stylessheets/admin.css .ace_editor
      if (element.large) $('#'+ key + "_editor").css('height', '480px');
    },

    // select
    select: function() {
      $('#' + key + '_field option[value="' + element.value +'"]').attr("selected", "selected");
      $('#' + key + '_field').change(function() {
        setTimeout(preview, 100);
      });
      setTimeout( function() {
        $('.dropdown_select').dropdown_select();
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
        $('.dropdown_select').dropdown_select();
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

        // Select file
        $('#file_upload_button').click(function() { $('#fileholder_' + key + ' input[type=file]').trigger('click') })


        // Upload start
        $('#fileholder_' + key).bind('s3_uploads_start', function(e) {
            console.log("upload start ... ");
            $('.filecontent').html('').append('<br><p>' + t.marqer_ui.uploading + ' ... </p>')
            someMarqer.marqeroptions.initial = {"type":"hidden", "value": true}
        });


        // Upload complete
        console.log('bind s3_upload_complete', key, $('#fileholder_' + key))

        // UPLOAD COMPLETE
        $('#fileholder_' + key).bind("s3_upload_complete", function(e, content) {
          console.log("upload complete!");
          // $('#placeholder_image')

          // create asset with image
          var assetData = {};

          // this is a little dirty, but the fastest for now
          //var t = {
          //  'audio': 'Audio',
          //  'image': 'Image',
          //  'document': 'Document'
          //}[key];

          //console.log(">>>>>", t, key)
          //console.log(e, content)

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

          console.log("determine key ", key.toLowerCase())

          element.isImage = false
          element.isAudio = false
          element.isDocument = false

          // show it in the editors
          if ( ["png", "jpg", "gif", "peg"].includes(content.url.substr(-3).toLowerCase()) ) {
            $('.filecontent').html('')
            $('.filecontent').append('<div class="thumbnail col-md-12" id="imageholder_{{key}}"><img style="max-height:255px" src="'+content.url+'"/></div>')
            element.isImage = true
          }

          if ( ["mp3"].includes(content.url.substr(-3).toLowerCase())) {
            $('.filecontent').html('')
            $('.filecontent').append('<audio controls volume=0.4 src="'+content.url+'"/>')
            element.isAudio = true
          }

          if ( ["pdf","xls","doc"].includes(content.url.substr(-3).toLowerCase())) {
            $('.filecontent').html('')
            $('.filecontent').append('<br/><p><a href="' + content.url + '" target="_blank">download document ('+content.url.substr(-3)+')</a></p>')
            element.isDocument = true
          }

          // $('#placeholder_image').remove();

          if ( !element.isImage && !element.isAudio && !element.isDocument ) {
            $('.filecontent').html('<div><strong>Could not determine filetype: ('+content.url.substr(-3)+')</strong></div><br> ' +content.url+ '<br><br><a href="'+content.url+'" target="_blank">download file</a>')
          }

          // throw it to the element
          console.log('i has a file', key, content.url )
          someMarqer.marqeroptions[key].value = content.url;

          // save and preview
          preview();
        });
      },
      fail: function(data) {
        console.log('FAIL');
      }
    });
  }

  // now execute!
  try {
    post_renders[ element.type ]()
    console.log( ' Editor: post render key, element type: ',key, element.type )
  }catch(e){
    //console.log( element.type, " had no post render functions")
  }

  //and whatever
  // console.log("########## disable keys!")
  keysEnabled = false
}

var renderInOutEditor = function( e, that ) {
  // ### add in and output editors
  var context = {
    "trackEventStart": 10, //Math.round( trackEventObject.options.start* 100 ) / 100,
    "trackEventEnd": 20, //Math.round( trackEventObject.options.end * 100 ) / 100
  };

  return HandlebarsTemplates['marduq/editor/in_out_editor'](context);
}
