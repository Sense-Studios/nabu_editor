var canSave = true;

//ERROR MESSAGES!
var slugEmpty         = "Kanaal slug ontbreekt";
var slugInUse         = "Kanaal slug is al ingebruik";
var slugHasSpaces     = "Kanaal slug mag geen spaties bevatten"
var channelNameEmpty  = "Kanaal naam ontbreekt";


//Timer for channel saves
var typingTimer;                //timer identifier
var doneTypingInterval = 1500;  //time in ms


$.get('http://nabu.sense-studios.com/channel/themes.json', function(data) {

  if(typeof data =='object')
  {
    var $select = $('#channel_selector');
    $select.find('option').remove();  
    $select.append('<option>Kies een channel</option>');
    $.each(data,function(key, value) 
    {
      $select.append('<option value=' + data[key]._id.$oid + '>' + data[key].title + '</option>');
    });
    
    var $selectTheme = $('#theme_selector');
    $selectTheme.find('option').remove();
    $selectTheme.append('<option>Kies een thema</option>');
    $.each(available_themes,function(key, value) 
    {
      $selectTheme.append('<option value=' + available_themes[key] + '>' + available_themes[key] + '</option>');
    });
    //Set when everything is done
    setTimeout( function() {
      $(".dropdown_select").dropdown();
      $(".dropdown_select_small").dropdown();
      $('.primary-color').colorpicker({'align': 'right'});
      $('.secundair-color').colorpicker({'align': 'right'});
      $('.dropdownjs ul li').click(function() {
        var selectedvalue = $(this).attr('value');
        var selected = $(this).parent().parent().prev('.dropdown_select');
        setTimeout(function() {
            $(selected[0]).find('option').removeAttr('selected');
            $(selected[0]).val($(selected[0]).find('option[value="' + selectedvalue + '"]').val()).trigger('change');
            $(selected[0]).find('option[value="' + selectedvalue + '"]').attr('selected', 'selected');
        }, 100);
      });
      
      $('#channel_selector').next().find('ul').find('li').click(function(){
        var selectedvalue = $(this).attr('value');
        var canSave = false;
        $.get('http://nabu.sense-studios.com/channel/themes.json', function(data) {
          $.each(data,function(key,value)
          {
            if(data[key]._id.$oid == selectedvalue) {
              ///////////////////////////////////
              ///CHANGE ALL DROPDOWNS AND INPUTS
              ///////////////////////////////////
              //change dropdown menu
              $('#menu_selector option').removeAttr('selected');
              $('#menu_selector option[value="' + data[key].menu +'"]').attr("selected", "selected");
              $('#menu_selector').next().find('ul').find('li').removeClass('selected');
              $('#menu_selector').next().find('ul').find('li[value="' + data[key].menu + '"]').addClass('selected');
              var menu_value = $('#menu_selector').next().find('ul').find('li[value="' + data[key].menu + '"]').text();
              $('#menu_selector').next().find('input').val(menu_value);
              $('#menu_selector').next().find('ul').find('li').click(function(){ 
                updateMenuData();
                updateChannel();
              });
              
              
              //change dropdown theme
              $('#theme_selector option').removeAttr('selected');
              $('#theme_selector option[value="' + data[key].theme +'"]').attr("selected", "selected");
              $('#theme_selector').next().find('ul').find('li').removeClass('selected');
              $('#theme_selector').next().find('ul').find('li[value="' + data[key].theme + '"]').addClass('selected');
              var theme_value = $('#theme_selector').next().find('ul').find('li[value="' + data[key].theme + '"]').text();
              $('#theme_selector').next().find('input').val(theme_value);
              $('#theme_selector').next().find('ul').find('li').click(function(){ 
                updateChannel();
              });
              
              
              
              //change dropdown menu
              $('#startvideo_selector option').removeAttr('selected');
              $('#startvideo_selector option[value="' + data[key].home_program +'"]').attr("selected", "selected");
              $('#startvideo_selector').next().find('ul').find('li').removeClass('selected');
              $('#startvideo_selector').next().find('ul').find('li[value="' + data[key].home_program + '"]').addClass('selected');
              var startvideo_value = $('#startvideo_selector').next().find('ul').find('li[value="' + data[key].home_program + '"]').text();
              $('#startvideo_selector').next().find('input').val(startvideo_value); 
              $('#startvideo_selector').next().find('ul').find('li').click(function(){
                updateChannel();
              });   
  
  
  
              $('#channel_title').val( data[key].title );
              $('#channel_slug').val( data[key].slug );
              
              if(data[key].logo) {
                $('.logo-image-preview').attr("src", data[key].logo).css({'background-color': 'rgba(255,255,255,0.99)'});
              } else {
                $('.logo-image-preview').attr("src", "/assets/nabu_editor/blank_image.png").removeAttr('style');
              }
              $('.logo-image-preview').hide().fadeIn('slow', function() {
                $('.logopreview').height( $('.logo-image-preview').height() + 20 );
              });
              
              $('.primary-color input').val( data[key].main_color ).trigger('keyup');
              $('.secundair-color input').val( data[key].support_color ).trigger('keyup');
              $('#site_description').val( data[key].about );
              $('#site_contact').val( data[key].contact );
              $('.bekijk-website a').attr('href', 'http://nabu.sense-studios.com/channel/' + data[key].slug );
              
              
              
  
              
  
              
              
              canSave = true;
              /////////////////////////////////////////////////
              ///GET THE MENUS AND SET THEM IN THE MENU EDITOR
              /////////////////////////////////////////////////
              var Menudata = data[key].menu;
              setMenudata(Menudata); 
            }
          });
        });

      });
      $('#menu_selector').next().find('ul').find('li').click(function(){ 
        /////////////////////////////////////////////////
        ///GET THE MENUS AND SET THEM IN THE MENU EDITOR
        /////////////////////////////////////////////////
        var Menudata = $(this).attr('value');
        setMenudata(Menudata); 
      });
    }, 600);
  }
  else
  {
    if(data ===false)
    {
       console.log('Channel selector json not json');
    }
    else
    {
      console.log('Channel selector json not received');
    }
  }
  
});



//Set and append al menu data when a menu is selected
function setMenudata(Menudata){
  $('#le_menu').addClass('hideLeMenu');
  if(Menudata === "" || Menudata == "Kies een menu") {
    $('.menu_name input').val("");
    $('#le_menu').empty().removeClass('hideLeMenu');
    return;
  }
  setTimeout(function(){ 
    var jsonMenu = 'http://nabu.sense-studios.com/channel/menus/' + Menudata + '.json';
    $.get(jsonMenu, function(menudata) {
      $('.menu_name').remove();
      var menuName = "";
      menuName += '<div class="menu_name">';
      menuName += '<input type="text" placeholder="Typ hier de menu naam" value="' + menudata.name + '" >';
      menuName += '</div>';
      $('#le_menu').before(menuName);
      
      menus = JSON.parse(menudata.items);
      $('.category_item').remove();
      if(menus.menu.length > 0) {
        $.each(menus.menu,function(key, value) {

            // header
            var menu = "";
            menu += '<li class="category_item">';
            menu += '<span class="handle_icon"></span>';
            menu += '<input type="text" class="category_name" placeholder="Typ categorienaam" value=' + menus.menu[key].name + '>';
            menu += '<button class="delete_category btn btn-material-custom-darkgrey">';
            menu += '<span class="glyphicon glyphicon-remove"></span';
            menu += '<a id="remove_categorie"></a>';
            menu += '</button>';
            menu += '<button class="toggle_category btn btn-material-custom-darkgrey">';
            menu += '<span class="glyphicon glyphicon-triangle-right"></span';
            menu += '<a id="toggle_categorie"></a>';
            menu += '</button>';
            menu += '<div class="clear"></div>';
            
            // list holder
            var category_id = Math.round( Math.random() * 1000000 );
            menu += '<ul class="category menu-editor ui-state-default drop ui-sortable" id="'+category_id+'"></ul>';
            menu += '<div class="categorydrop ui-state-default dropper" ><div>sleep hier een video uit de linkerkolom</div></div>';
            
            $('#le_menu').append(menu);
          
            // ### Init categories
            $('.category_item').each( function( key, value) {            
              $( value ).find( '.delete_category ').unbind('click');
              $( value ).find( '.delete_category ').click( function() {
                $(this).closest('.category_item').remove();
              });
            });
            
            //
            $(".toggle_category").click(function(){
              var curheight = $(this).parent().height();
              if(curheight >= 145){
                $(this).parent().animate({height: "50px"}, 300);
                $('span', this).css({'transform': 'rotate(0deg)', '-webkit-transform': 'rotate(0deg)'});
              }
              else {
                $(this).parent().css('height', 'auto');
                var clickeddiv = $(this).parent().height();
                $(this).parent().css('height', '50px');
                $('span', this).css({'transform': 'rotate(90deg)', '-webkit-transform': 'rotate(90deg)'});
                $(this).parent().animate({height: clickeddiv}, 300, function() {
                  $(this).css({height: 'auto'});
                });
                clicked = 1; 
              }
            }); 
            
            $(".category_item:not(:first) .toggle_category").trigger('click');
            // re-init draggables
            setDraggables();
          
        
          
          var menuItem = menus.menu[key].items;
          if(menuItem.length > 0) {
            $('#' + category_id).next().remove();
            $('#' + category_id).css('padding', '0px 10px 10px 10px');
          }
          
          if(menuItem.length > 0) {
            $.each(menuItem,function(key,value){
              var title = menuItem[key].name;
              var shortText = jQuery.trim(title).substring(0, 38).split(" ").slice(0, -1).join(" ") + "...";    
          
              var some_item = "";
              some_item += '<li class="new-item ui-state-default available_program_item ui-draggable not_new" id="' + menuItem[key].id  + '" style="display: list-item;">';
              some_item += '<img alt="4" class="pull-left" height="32px" src="' + menuItem[key].thumb + '">';
              some_item += '<div class="program_container">';
              some_item += '<p class="program_title">';
              some_item += shortText;
              some_item += '</p>';
              some_item += '</div>';
              some_item += '<button class="delete_category btn btn-material-white pull-right item_delete_button" id="' + menuItem[key].id  + '">';
              some_item += '<span class="glyphicon glyphicon-remove"></span>';
              some_item += '<a id="remove_categorie"></a>';
              some_item += '</button>';
              if ( menuItem[key].emphasize === false) {
                some_item += '<div class="togglebutton"><label>Vergroot<input class="emphasize" type="checkbox" /></label></div>';
              }else{
                some_item += '<div class="togglebutton"><label>Vergroot<input class="emphasize" type="checkbox" checked /></label></div>';
              }
              some_item += '</div></li>';
              var prependDiv = '#' + category_id;
              $(prependDiv).append(some_item);
              $.material.init();
            });
            // hook up the delete button
            $('.item_delete_button').click( function() {
              var parentItem = $(this).parent().parent();
              var parentItemCount = parentItem.children().length;
              
              if(parentItemCount == 1) 
              {
                $(parentItem).parent().append('<div class="categorydrop ui-state-default dropper" ><div>sleep hier een video uit de linkerkolom</div></div>');
                $(parentItem).removeAttr('style');
              }
              
              $(this).parent().remove();
            }); 
          } 
        });
      } else {
        createCategory();
      }

      $('#le_menu').removeClass('hideLeMenu');
    }); 
  }, 200); 
}


//Get channel data that is needed to update an channel
function getChannelData() {
  var channelName   = $('#channel_title').val();
  var slug          = $('#channel_slug').val();
  var menuName      = $('#menu_selector').val();
  var themeName     = $('#theme_selector').val();
  var homeProgram   = $('#startvideo_selector').val();
  var logo          = $('.logo-image-preview').attr('src');
  var primaryColor  = $('.primary-color input').val();
  var supportColor  = $('.secundair-color input').val();
  var about         = $('#site_description').val();
  var contact       = $('#site_contact').val();

  var logoUrl = ((logo == "/assets/nabu_editor/blank_image.png") ? "" : logo);
  
  var channelData = {
    "about"           : about,
    "background_color": primaryColor,
    "contact"         : contact,
    "description"     : about,
    "home_program"    : homeProgram,
    "logo"            : logoUrl,
    "main_color"      : primaryColor,
    "menu"            : menuName,
    "slug"            : slug,
    "support_color"   : supportColor,
    "theme"           : themeName,
    "title"           : channelName,

  };
  return channelData;
}


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


//////////////////
//MENU FUNCTIONS
//////////////////

//Create new menu
function createNewMenu() {
  $('#load_indicator').css('opacity', '1');
  $('#le_menu').addClass('hideLeMenu');
  $('.menu_name input').val('');
  $('#le_menu').empty();
  createCategory();

  $.post( '/channel/menu_api/create/', {"menu": { "name": "New Menu", "items": ""  }}, function( data ) {
      
      $('#menu_selector').find('option:selected').removeAttr('selected');
      $('#menu_selector').append('<option value="' + data._id.$oid + '" selected="selected">' + data.name + '</option>');
      $('#menu_selector').next().find('ul').find('.selected').removeClass('selected');
      $('#menu_selector').next().find('ul').append('<li value="' + data._id.$oid + '" tabindex="-1" class="selected">' + data.name + '</li>');
      $('#menu_selector').next().find('input').val(data.name);
      $('.menu_name input').val(data.name);
      
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
    $('#menu_selector').next().find('ul').find('li').first().next().trigger('click');
    $('#load_indicator').css('opacity', '0');
  }, 500);
}


//////////////////
//CHANNEL FUNCTIONS
//////////////////

//Create a new channel
function createChannel() {
  $('#load_indicator').css('opacity', '1');
  canSave = false;
  //get channel data to save
  var channelName   = $('#create_channel_title').val();
  var channelSlug   = $('#create_channel_slug').val();
  var primaryColor  = "#FFFFFF";
  var supportColor  = "#000000";
  
  var channelData = {
    "slug"            : channelSlug,
    "title"           : channelName,
    "background_color": primaryColor,
    "main_color"      : primaryColor,
    "support_color"   : supportColor,
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
      $("label[for='create_channel_slug']").text("Kanaal slug bestaat al");
      setTimeout(function(){
        $('#load_indicator').css('opacity', '0');
      }, 500);
      return;
    } else {
      $('#channel_selector').find('option:selected').removeAttr('selected');
      $('#channel_selector').append('<option value="' + data._id.$oid + '" selected="selected">' + data.title + '</option>');
      $('#channel_selector').next().find('ul').find('.selected').removeClass('selected');
      $('#channel_selector').next().find('ul').append('<li value="' + data._id.$oid + '" tabindex="-1" class="selected">' + data.title + '</li>');
      $('#channel_selector').next().find('input').val(data.title);
      
      $('#channel_title').val(data.title);
      $('#channel_slug').val(data.slug);
      if(data.logo === null) {
        $('.logo-image-preview').attr("src", "/assets/nabu_editor/blank_image.png").removeAttr('style');
      } else {
        $('.logo-image-preview').attr("src", data[key].logo).css({'background-color': 'rgba(255,255,255,0.99)'});
      }
      $('.primary-color input').val(data.main_color).trigger('keyup');
      $('.secundair-color input').val(data.support_color).trigger('keyup');
      $('#site_description').val(data.about);
      $('#site_description').val(data.contact);
      
      
      $('#create_channel_title').val("");
      $('#create_channel_slug').val("");
      
      $('#theme_selector').next().find('ul').find('li').first().trigger('click');
      $('#startvideo_selector').next().find('ul').find('li').first().trigger('click');
      
      $('.modal').modal('hide');
      setTimeout(function(){
        canSave = true;
        var menus = $('#menu_selector').next().find('ul').children().length;
        if(menus <= 1) {
          $('#add_menu').trigger('click');
        }
        else {
          $('#menu_selector').next().find('ul').find('li').first().next().trigger('click');
        }
      }, 300);
      $('#create_channel_slug').parent().parent().removeClass('has-error');
      $("label[for='create_channel_slug']").text("Kanaal slug");
      $('.modal').modal('hide');
      setTimeout(function(){
        $('#load_indicator').css('opacity', '0');
      }, 500);
    }
  });
}


//Update channel that is selected in the #channel_selector
function updateChannel() {
  if(!canSave) {
    return;
  }
  var channelName   = $('#channel_title').val();
  var channelSlug   = $('#channel_slug').val();
  
  //Check if name and slug is longer than 1 otherwise display error
  if (channelName.length >= 1 || channelSlug.length >= 1 ) {
    if(channelName.length >= 1) {
      $('#channel_title').parent().parent().removeClass('has-error');
      $("label[for='channel_title']").text("Kanaal naam");
    }
    if(channelSlug.length >= 1) {
      $('#channel_slug').parent().parent().removeClass('has-error');
      $("label[for='channel_slug']").text("Kanaal slug");
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
  console.log(channelData);
  console.log('test');
  
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
      $("label[for='create_channel_slug']").text("Kanaal slug");
      setTimeout(function(){
        $('#load_indicator').css('opacity', '0');
      }, 500);
    }
  });

}


//Delete channel that is selected in the #channel_selector
function deleteChannel() {
  $('#load_indicator').css('opacity', '1');
  
  var channelId = $('#channel_selector').val();
  $.post( '/channel/channel_api/delete/' + channelId, {}, function(d) {
    console.log(d);
    setTimeout(function(){
      $('#channel_selector').find('option:selected').remove();
      $('#channel_selector').next().find('ul').find('.selected').remove();
      $('#channel_selector').next().find('ul').find('li').first().next().trigger('click');
      $('#load_indicator').css('opacity', '0');
    }, 300);
    $('.modal').modal('hide');
  });
}


///////////////////////
// CLICK EVENTS
//////////////////////
$('#add_menu').click(function() {
  createNewMenu();
});

$('#delete_menu_button').click(function() {
  deleteMenu();
});

$('#save_menu_button').click(function(){
  updateMenu();  
});


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
    this.value = this.value.replace(/\s/g, "");
  }
});

function doneTyping() {
  updateChannel();
}


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
    });
    updateChannel();

  });
      

}

initThumbnailUploader();




