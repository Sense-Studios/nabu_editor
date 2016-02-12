/* global
available_themes
menus
mount_point
*/

//ERROR MESSAGES!
var slugEmpty         = t.publish.missing_slug;
var slugInUse         = t.publish.slug_in_use;
var slugHasSpaces     = t.publish.slug_has_spaces;
var channelNameEmpty  = t.publish.no_channel_name;
var newMenuName       = t.publish.new_menu

// some placeholders
var all_channels      = {}
var currentChannel    = null
var currentMenu       = null
var canSave           = true;

//Timer for channel saves
var typingTimer;                //timer identifier
var doneTypingInterval = 1500;  //time in ms

////////////////////////////////////////////////////////////////////////////////
// Initializer
////////////////////////////////////////////////////////////////////////////////
function initializePublisher() {

  // get themes
  $.get('/channel/themes.json', function(data) {
    console.log("Publish got themes: ", data);
    all_channels = data

    if(typeof data =='object') {

      buildChannelSelector()
      buildThemesSelector()
      initializeDropdowns();

    }else{
      if(data === false){
         console.log('Channel selector json not json');
      } else {
        console.log('Channel selector json not received');
      }
    }
  });
}

function initializeDropdowns() {
  console.log('Publish initialize, dropdowns');

  // initialize the dropdowns
  $(".dropdown_select").dropdown();
  $(".dropdown_select_small").dropdown();

  // initialize the colorpickers
  $('.primary-color').colorpicker({'align': 'right'});
  $('.secundair-color').colorpicker({'align': 'right'});
  $('.mobile-background-color').colorpicker({'align': 'right'});

  // initialize drop downs and deligate to selects
  $('.dropdownjs ul li').click(function() {
    var selectedvalue = $(this).attr('value');
    var selected = $(this).parent().parent().prev('.dropdown_select');

    // deletegate selects
    $( selected[0] ).find('option').removeAttr('selected');
    $( selected[0] ).val( $(selected[0]).find('option[value="' + selectedvalue + '"]').val()).trigger('change');
    $( selected[0] ).find('option[value="' + selectedvalue + '"]').attr('selected', 'selected');
  });

  buildChannelSelector()

  $('#menu_selector').next().find('ul').find('li').click( function(){
    if ( currentChannel == undefined || currentChannel == null ) {
      setMenudata("")
      return;
    }

    currentChannel.menu = $(this).attr('value')
    setMenudata( currentChannel.menu );
    updateChannel('frommenu selector');
  });

  $('#theme_selector').next().find('ul').find('li').click(function(){ updateChannel('themeselector');});
  $('#startvideo_selector').next().find('ul').find('li').click(function(){ updateChannel('startvideo_selectro');});

  // initially set it disabled
  disableDropdownsAndFields()
}

function buildChannelSelector() {
  console.log("(re)build channel")

  // reset and build channel selector
  var $select = $('#channel_selector');
  $select.find('option').remove();
  $select.append("<option value='Kies een kanaal'>" + t.channels.choose_channel + "</option>");

  if(!$.isEmptyObject( all_channels )) {
    $.each(all_channels,function(key, channel)  {
      $select.append('<option value=' + channel._id.$oid + '>' + channel.title + '</option>');
    });
  }

  console.log("should re-init? ", $('#channel_selector').attr('data-dropdownjs'), $select.data("dropdownjs") )

  // if  ( $select.data("dropdownjs") ) {
  if ( $('#channel_selector').attr('data-dropdownjs') == "true" || $select.data("dropdownjs") ) {
    console.log("CLEANING THE FUCK UP")
    $select.data("dropdownjs", false);
    $select.next().remove();
  }

  $select.dropdown(); // re-init the selector

  // re-Enable drop downs
  $('#channel_selector').next().find('ul').find('li').click( function() {
    var selectedvalue = $(this).attr('value');
    console.log("click the channel, change the station", selectedvalue)
    canSave = false;

    if( selectedvalue == 'Kies een kanaal' ) {
      resetAllDropDownsAndFields()
      disableDropdownsAndFields()
      currentChannel = null
      canSave = true;
    } else {
      fillAllDropDownsAndFields( selectedvalue )
      //enableDropdownsAndFields()
    }
  });

  if ( currentChannel != null ) autoSelect( $('#channel_selector'), currentChannel._id.$oid )
  canSave = true
}

function buildThemesSelector() {
    var $select = $('#theme_selector');
  $select.find('option').remove();
  $select.append("<option value='Kies een thema'>" + t.channels.choose_theme + "</option>");

  if(!$.isEmptyObject( available_themes )) {
    $.each(available_themes,function(key, theme)  {
      $select.append('<option value=' + theme + '>' + theme + '</option>');
    });
  }

  if ( currentChannel != null ) autoSelect( $('#theme_selector'), currentChannel.theme )
  $('#theme_selector').dropdown();
}

// load all channels from the server
function updateChannels( closure ) {
  canSave = false
  $.get('/channel/themes.json', function(data) {
    console.log("Publish got themes: ", data);
    all_channels = data
    buildChannelSelector()
    if ( closure !== undefined ) closure()
  })
}

// rename this to redrawMenu
function fillAllDropDownsAndFields( channel_id ) {

  console.log("fill all dropdownsandfields: ", channel_id )

  if (channel_id === undefined ) channel_id = $('#channel_selector').val()
  var selectedvalue = channel_id
  var hasChannel = false
  canSave = false;

  $.each( all_channels, function(key,channel) {
    if( channel._id.$oid == selectedvalue ) {
      hasChannel = true
      currentChannel = channel
      currentChannel.id = channel._id.$oid

      autoSelect( $('#menu_selector'), channel.menu )
      setMenudata( channel.menu ) // update menu
      autoSelect( $('#theme_selector'), channel.theme )
      autoSelect( $('#startvideo_selector'), channel.home_program )

      $('#channel_title').val( channel.title );
      $('#channel_slug').val( channel.slug );

      if(channel.logo) {
        $('.logo-image-preview').attr("src", channel.logo).css({'background-color': 'rgba(255,255,255,0.99)'});
        $('.uploader_overlay span').css({"color": "#FFF"});
      } else {
        $('.logo-image-preview').attr("src", "/assets/nabu_editor/blank_image.png").removeAttr('style');
        $('.uploader_overlay span').css({"color": "#616161"});
      }

      $('.logo-image-preview').hide().delay(400).fadeIn('slow', function() {
        $('.logopreview').height( $('.logo-image-preview').height() + 20 );
      });

      $('.primary-color input').val( channel.main_color ).trigger('keyup');
      $('.secundair-color input').val( channel.support_color ).trigger('keyup');
      $('.mobile-background-color input').val( channel.background_color ).trigger('keyup');
      $('#site_description').val( channel.about );
      $('#site_contact').val( channel.contact );
      $('.bekijk-website a').attr('href', '/channel/' + channel.slug );

      enableDropdownsAndFields()
    }
  });

  if (!hasChannel) {
    console.log('PUBLISH WARNING channel channel not found' )
    disableDropdownsAndFields() // disable all
    setMenudata() // empty menu
  }

  canSave = true;
}

////////////////////////////////////////////////////////////////////////////////
/// MENUS
////////////////////////////////////////////////////////////////////////////////

//Get all menu data that is needed for updateMenu()
function updateMenuData() {
  menudata = { "menu":[] };
  $('.category_item').each( function( c_key, cat ) {
    var some_category = { "name": $(this).find('.category_name').val(), "items":[] };
    $(this).find('li').each( function( i_key, item ) {
      some_category.items.push( {
        "name": $(item).find('.program_title').text(),
        "emphasize": $(item).find('.emphasize').is(':checked'),"id": $(item).prop('id'),
        "thumb": $(item).find('img').attr('src')
      });
    });

    menudata.menu.push( some_category );
  });
  // update content object on page
  $('#menu_items').val( JSON.stringify( menudata ) );
}

//Create new menu
function createNewMenu() {
  console.log('Publish create new menu!');
  $('#load_indicator').css('opacity', '1');
  $('#le_menu').addClass('hideLeMenu');
  $('.menu_name input').val('');
  $('#le_menu').empty();
  menudata = { "menu":[] };

  $.post( '/channel/menu_api/create/', {"menu": { "name": newMenuName, "items": menudata  }}, function( data ) {
      console.log('Publish create new menu!', data);

      $('#menu_selector').find('option:selected').removeAttr('selected');
      $('#menu_selector').append('<option value="' + data._id.$oid + '" selected="selected">' + data.name + '</option>');
      $('#menu_selector').next().find('ul').find('.selected').removeClass('selected');
      $('#menu_selector').next().find('ul').append('<li value="' + data._id.$oid + '" tabindex="-1" class="selected">' + data.name + '</li>');
      $('#menu_selector').next().find('input').val(data.name);
      $('.menu_name input').val(data.name);
      $('.category_item').remove();

      $('#create_category_button').attr('disabled', false);
      $('#save_menu_button').attr('disabled', false);
      $('#delete_menu_button').attr('disabled', false);
      $('.menu_name').removeClass('disabled_dropdown');
      createCategory();

      currentMenu = data._id.$oid

      setTimeout(function(){
        $('#load_indicator').css('opacity', '0');
        $('#le_menu').removeClass('hideLeMenu');
      }, 500);
  });
}

//Update menu that is selected in #menu_selector
function updateMenu() {

  $('#load_indicator').css('opacity', '1');

  updateMenuData();
  var menuNaam = $('.menu_name input').val();

  // failsafe, needs to be better
  if ( menuNaam == "Kies een menu ") return

  var id = $('#menu_selector').val();
  var menudata = $('#menu_items').val();

  $.post( '/channel/menu_api/update/' + id,  {"menu": { "name": menuNaam, "items": menudata  } } , function(data) {
    $('#load_indicator').css('opacity', '0');
  }).always(function() {
    setTimeout(function() {
      var oldName =  $('#menu_selector').find('option:selected').text();
      $('#menu_selector').find('option:selected').text(menuNaam);
      $('#menu_selector').next().find('ul').find('.selected').text(menuNaam);
      $('#menu_selector').next().find('input').val(menuNaam);
      $('#load_indicator').css('opacity', '0');
    }, 500);
  });
}

//Delete menu that is selected in #menu_selector
function deleteMenu() {
  $('#load_indicator').css('opacity', '1');

  var id = $('#menu_selector').find('option:selected').val();
  $.post( '/channel/menu_api/delete/' + id, {}, function(d) { });
  setTimeout(function() {
    $('#menu_selector').find('option:selected').remove();
    $('#menu_selector').next().find('ul').find('.selected').remove();
    $.get('/channel/menus.json', function(data) {
      if($.isEmptyObject(data)) {
        $('#menu_selector').next().find('ul').find('li').first().trigger('click');
      } else {
        $('#menu_selector').next().find('ul').find('li').first().next().trigger('click');
      }
    });

    $('#load_indicator').css('opacity', '0');
  }, 500);
}


/////////////////////////////////////////////////////////////////////////////////
// CHANNEL FUNCTIONS
/////////////////////////////////////////////////////////////////////////////////

// Create a new channel
function createChannel() {
  $('#load_indicator').css('opacity', '1');
  canSave = false;
  //get channel data to save
  var channelName     = $('#create_channel_title').val();
  var channelSlug     = $('#create_channel_slug').val();
  var primaryColor    = "#000000";
  var supportColor    = "#000000";
  var backgroundColor = "#000000";

  var channelData = {
    "slug"            : channelSlug,
    "title"           : channelName,
    "background_color": backgroundColor,
    "main_color"      : primaryColor,
    "support_color"   : supportColor,
    "menu"            : currentMenu
  };

  //Check if name and slug is longer than 1 otherwise display error
  if (channelName.length >= 1 || channelSlug.length >= 1) {
    if(channelName.length >= 1) {
      $('#create_channel_title').parent().parent().removeClass('has-error');
      $("label[for='create_channel_title']").text("Kanaal naam");
    }
    if(channelSlug.length >= 1) {
      $('#create_channel_slug').parent().parent().removeClass('has-error');
      $("label[for='create_channel_slug']").text("Kanaal slug");
    }
  }
  if(channelName.length < 1 || channelSlug.length < 1) {
    if(channelName.length < 1) {
      $('#create_channel_title').parent().parent().addClass('has-error');
      $("label[for='create_channel_title']").text(channelNameEmpty);
    }
    if(channelSlug.length < 1) {
      $('#create_channel_slug').parent().parent().addClass('has-error');
      $("label[for='create_channel_slug']").text(slugEmpty);
    }
    return;
  }

  //Create the channel
  $.post( '/channel/channel_api/create/', { "theme":  channelData }, function(data) {
    if(data.status == "fail") {
      $('#create_channel_slug').parent().parent().addClass('has-error');
      $("label[for='create_channel_slug']").text(t.publish.slug_in_use);
      setTimeout(function(){
        $('#load_indicator').css('opacity', '0');
      }, 500);
      return;
    } else {

      console.log("has created channel: ", data)
      /*
      $('#channel_selector').find('option:selected').removeAttr('selected');
      $('#channel_selector').append('<option value="' + data._id.$oid + '" selected="selected">' + data.title + '</option>');
      $('#channel_selector').next().find('ul').find('.selected').removeClass('selected');
      $('#channel_selector').next().find('ul').append('<li value="' + data._id.$oid + '" tabindex="-1" class="selected">' + data.title + '</li>');
      $('#channel_selector').next().find('input').val(data.title);

      $('#channel_title').val(data.title);
      $('#channel_slug').val(data.slug);

      if(data.logo === null) {
        $('.logo-image-preview').attr("src", "/assets/nabu_editor/blank_image.png").removeAttr('style');
        $('.uploader_overlay span').css({"color": "#616161"});
      } else {
        $('.logo-image-preview').attr("src", data[key].logo).css({'background-color': 'rgba(255,255,255,0.99)'});
        $('.uploader_overlay span').css({"color": "#FFF"});
      }
      */

      // Reset Modal
      $('#create_channel_title').val("");
      $('#create_channel_slug').val("");
      $('#create_channel_slug').parent().parent().removeClass('has-error');
      $("label[for='create_channel_slug']").text(t.channel_editor.slug);
      $('.modal').modal('hide');

      // update
      currentChannel = data

      // update the channels and fill
      updateChannels( fillAllDropDownsAndFields );

      $('#load_indicator').css('opacity', '0');
    }
  });
}

// Update channel that is selected in the #channel_selector
// called from is for testing
function updateChannel( calledfrom ) {
  console.log("Publish: update Channel", calledfrom )
  if(!canSave) {
    console.log('no can save')
    return;
  }

  var channelName   = $('#channel_title').val();
  var channelSlug   = $('#channel_slug').val();

  //Check if name and slug is longer than 1 otherwise display error
  if (channelName.length >= 1 || channelSlug.length >= 1 ) {
    if(channelName.length >= 1) {
      $('#channel_title').parent().parent().removeClass('has-error');
      $("label[for='channel_title']").text(t.channel_editor.name);
    }
    if(channelSlug.length >= 1) {
      $('#channel_slug').parent().parent().removeClass('has-error');
      $("label[for='channel_slug']").text(t.channel_editor.slug);
    }
  }
  if(channelName.length < 1 || channelSlug.length < 1) {
    if(channelName.length < 1) {
      $('#channel_title').parent().parent().addClass('has-error');
      $("label[for='channel_title']").text(channelNameEmpty);
    }
    if(channelSlug.length < 1) {
      $('#channel_slug').parent().parent().addClass('has-error');
      $("label[for='channel_slug']").text(slugEmpty);
    }
    return;
  }
  $('#load_indicator').css('opacity', '1');

  var channelId = $('#channel_selector').val();
  var channelData = getChannelData();
  channelData.settings = currentChannel.settings
  console.log("post with: ", channelData);

  $.post( '/channel/channel_api/update/' + channelId, { "theme":  channelData }, function(d) {
    if(d.status == "fail") {
      $('#channel_slug').parent().parent().addClass('has-error');
      $("label[for='channel_slug']").text(slugInUse);

      setTimeout(function(){
        $('#load_indicator').css('opacity', '0');
      }, 500);

      return;

    } else {
      var channelName = channelData.title;
      $('#channel_selector').find('option:selected').text(channelName);
      $('#channel_selector').next().find('ul').find('.selected').text(channelName);
      $('#channel_selector').next().find('input').val(channelName);
      $('.modal').modal('hide');

      setTimeout(function(){
      $('#load_indicator').css('opacity', '0');
      }, 500);

      $('#create_channel_slug').parent().parent().removeClass('has-error');
      $("label[for='create_channel_slug']").text(t.channel_editor.slug);

      setTimeout(function(){
        $('#load_indicator').css('opacity', '0');
      }, 500);

      // get new channel data
      updateChannels();
    }
  });
}

//Delete channel that is selected in the #channel_selector
function deleteChannel() {
  $('#load_indicator').css('opacity', '1');

  var channelId = $('#channel_selector').val();
  $.post( '/channel/channel_api/delete/' + channelId, {}, function(d) {
    currentChannel = null
    updateChannels()
    $('#menu_selector').next().find('ul').find('li').first().trigger('click');
    $('#channel_selector').next().find('ul').find('li').first().trigger('click');
    $('.modal').modal('hide');
  });
}

////////////////////////////////////////////////////////////////////////////////
// CLICK EVENTS
////////////////////////////////////////////////////////////////////////////////

$('#add_menu').click(function() { createNewMenu(); });
$('#delete_menu_button').click(function() { deleteMenu(); });
$('#save_menu_button').click(function() { updateMenu(); });
$('.primary-color').colorpicker().on('hidePicker.colorpicker', function(event){ updateChannel('primary color'); });

//on keyup, start the countdown
$('.channels_container :input').keyup(function(){
    clearTimeout(typingTimer);
    typingTimer = setTimeout(  doneTyping, doneTypingInterval);
});

//on keydown, clear the countdown
$('.channels_container :input').keydown(function(){
    clearTimeout(typingTimer);
});

$("#create_channel_slug, #channel_slug").on({
  keydown: function(e) {
    if (e.which === 32)
      return false;
  },
  change: function() {
    this.value = this.value.replace(/\s/g, "").toLowerCase();;
  }
});

function doneTyping() {
  updateChannel('done typing');
}


////////////////////////////////////////////////////////////////////////////////
/// HELPERS
////////////////////////////////////////////////////////////////////////////////

// helper
function getChannelData() {
  var channelName       = $('#channel_title').val();
  var slug              = $('#channel_slug').val();
  var menuId            = $('#menu_selector').val();
  var themeName         = $('#theme_selector').val();
  var homeProgram       = $('#startvideo_selector').val();
  var logo              = $('.logo-image-preview').attr('src');
  var primaryColor      = $('.primary-color input').val();
  var supportColor      = $('.secundair-color input').val();
  var backgroundColor   = $('.mobile-background-color input').val();
  var about             = $('#site_description').val();
  var contact           = $('#site_contact').val();
  var logoUrl = ((logo == "/assets/nabu_editor/blank_image.png") ? "" : logo);

  var channelData = {
    "about"           : about,
    "background_color": backgroundColor,
    "contact"         : contact,
    "description"     : about,
    "home_program"    : homeProgram,
    "logo"            : logoUrl,
    "main_color"      : primaryColor,
    "menu"            : menuId,
    "slug"            : slug,
    "support_color"   : supportColor,
    "theme"           : themeName,
    "title"           : channelName,
  };
  return channelData;
}

// helper
function autoSelect( target, value ) {
  target.val('')
  target.find('option[value="'+value+'"]').attr('selected', true)
  target.next().find('ul').find('li').removeClass('selected')
  target.next().find('ul').find('li[value="' + value + '"]').addClass('selected')
  target.next().find('input').val( target.find('option[value="'+value+'"]').text() )
}

// helper
function resetAllDropDownsAndFields() {
  $('#menu_selector option').removeAttr('selected');
  $('#menu_selector option[value="Kies een menu"]').attr("selected", "selected");
  $('#menu_selector').next().find('ul').find('li').removeClass('selected');
  $('#menu_selector').next().find('ul').find('li[value="Kies een menu"]').addClass('selected');
  var menu_value = $('#menu_selector').next().find('ul').find('li[value="Kies een menu"]').text();
  $('#menu_selector').next().find('input').val(menu_value);

  //change dropdown theme
  $('#theme_selector option').removeAttr('selected');
  $('#theme_selector option[value="Kies een thema"]').attr("selected", "selected");
  $('#theme_selector').next().find('ul').find('li').removeClass('selected');
  $('#theme_selector').next().find('ul').find('li[value="Kies een thema"]').addClass('selected');
  var theme_value = $('#theme_selector').next().find('ul').find('li[value="Kies een thema"]').text();
  $('#theme_selector').next().find('input').val(theme_value);

  //change dropdown menu
  $('#startvideo_selector option').removeAttr('selected');
  $('#startvideo_selector option[value="Kies startprogramma"]').attr("selected", "selected");
  $('#startvideo_selector').next().find('ul').find('li').removeClass('selected');
  $('#startvideo_selector').next().find('ul').find('li[value="Kies startprogramma"]').addClass('selected');
  var startvideo_value = $('#startvideo_selector').next().find('ul').find('li[value="Kies startprogramma"]').text();
  $('#startvideo_selector').next().find('input').val(startvideo_value);

  $('#channel_title').val( '' );
  $('#channel_slug').val( '' );

  $('.logo-image-preview').attr("src", "/assets/nabu_editor/blank_image.png").removeAttr('style');
  $('.logo-image-preview').hide().fadeIn('slow', function() {
    $('.logopreview').height( $('.logo-image-preview').height() + 20 );
  });

  $('.primary-color input').val( '#000000' ).trigger('keyup');
  $('.secundair-color input').val( '#000000' ).trigger('keyup');
  $('.mobile-background-color input').val( '#000000' ).trigger('keyup');
  $('#site_description').val( '' );
  $('#site_contact').val( '' );
  $('.bekijk-website a').attr('href', '/channel/' + '' );
}

// helper
function disableDropdownsAndFields() {
  $('#menu_selector').attr('disabled', true).next().addClass('disabled_dropdown');
  $('#theme_selector').attr('disabled', true).next().addClass('disabled_dropdown');
  $('#startvideo_selector').attr('disabled', true).next().addClass('disabled_dropdown');

  $('#edit_channel').attr('disabled', true);
  $('#add_menu').attr('disabled', true);

  $('.logopreview').addClass('disabled_dropdown').find('input:last-child').attr('disabled', true);

  $('.primary_color_container').addClass('disabled_dropdown');
  $('.primary-color input').attr('disabled', true);
  $('.secundair-color input').attr('disabled', true);
  $('.mobile-background-color input').attr('disabled', true);

  $('#site_description').addClass('disabled_dropdown');
  $('#site_contact').addClass('disabled_dropdown');
  $('.bekijk-website').attr('disabled', true);

  // disables the menu
  setMenudata("")
}

// helper
function enableDropdownsAndFields() {
  $('#menu_selector').attr('disabled', false).next().removeClass('disabled_dropdown');
  $('#theme_selector').attr('disabled', false).next().removeClass('disabled_dropdown');
  $('#startvideo_selector').attr('disabled', false).next().removeClass('disabled_dropdown');

  $('#edit_channel').attr('disabled', false);
  $('#add_menu').attr('disabled', false);

  $('.logopreview').removeClass('disabled_dropdown').find('input:last-child').attr('disabled', false);

  $('.primary_color_container').removeClass('disabled_dropdown');
  $('.primary-color input').attr('disabled', false);
  $('.secundair-color input').attr('disabled', false);
  $('.mobile-background-color input').attr('disabled', false);

  $('#site_description').removeClass('disabled_dropdown');
  $('#site_contact').removeClass('disabled_dropdown');
  $('.bekijk-website').attr('disabled', false);
  $('#load_indicator').css('opacity', '0');
}

// helper
function initThumbnailUploader() {
  console.log("init thumbnail uploader");

  // init uploader
  $("#preview_logo").S3Uploader( {
    max_file_size: 1258291200,
    allow_multiple_files: false,
  });

  // Start loading asset
  $('#preview_logo').bind("s3_uploads_start", function(e, content) {
    console.log("upload start ... ");
  });

  // complete, create an asset
  $('#preview_logo').bind("s3_upload_complete", function(e, content) {
    console.log("upload complete ... ", content.url, $('.logo-image-preview'), $('.logo-image-preview').attr('src') );

    // throw it to the window
    $('.logo-image-preview').attr('src', content.url);
    $('.logo-image-preview').hide().fadeIn('slow', function() {
      $('.logopreview').height( $('.logo-image-preview').height() + 20 );
      $('.uploader_overlay span').css({"color": "#FFF"});
    });

    updateChannel('imageloader');
  });
}


////////////////////////////////////////////////////////////////////////////////
/// MAIN
////////////////////////////////////////////////////////////////////////////////

initializePublisher();
initThumbnailUploader();
