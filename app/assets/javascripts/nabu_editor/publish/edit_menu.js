/* global
showChannelContainer
*/

// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

var menudata;
var programs;
var clicked = 0;

console.log(" ### GOT MENU DATA: ", menudata);
console.log(" ### GOT PROGRAMS : ", programs);

// #############################################################################
// ### Helpers
// #############################################################################

// ### CREATE
function createCategory() {
  console.log("CREATE category");

  // header
  var cat = "";
  cat += '<li class="category_item">';
  cat += '<span class="handle_icon"></span>';
  cat += '<input type="text" class="category_name" placeholder="Typ categorienaam">';
  cat += '<button class="delete_category btn btn-material-custom-darkgrey">';
  cat += '<span class="glyphicon glyphicon-remove"></span>';
  cat += '<a id="remove_categorie"></a>';
  cat += '</button>';
  cat += '<button class="toggle_category btn btn-material-custom-darkgrey">';
  cat += '<span class="glyphicon glyphicon-triangle-right"></span>';
  cat += '<a id="toggle_categorie"></a>';
  cat += '</button>';
  cat += '<div class="clear"></div>';

  // list holder
  var category_id = Math.round( Math.random() * 1000000 );
  cat += '<ul class="category menu-editor ui-state-default drop ui-sortable" id="' + category_id + '"></ul>';
  cat += '<div class="categorydrop ui-state-default dropper" ><div>' + t.publish.drag + '</div></div>';

  $('#le_menu').prepend(cat);

  // ### Init categories
  $('.category_item').each( function( key, value) {
    $( value ).find( '.delete_category ').unbind('click');
    $( value ).find( '.delete_category ').click( function() {
      $(this).closest('.category_item').remove();
    })
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
  updateMenuData();
  // re-init draggables
  setDraggables();
}

// ### LOAD/ Parse
function loadMenuFromData() {
  console.log('has menudatu: ', menudata );
  if ( menudata.menu === undefined || $.isEmptyObject(menudata.menu) ) return;
  console.log('menu loaded');

  // render data
  $.each( menudata.menu, function( key, value ) {
    var cat = "";

    // header
    cat += '<li class="category_item">';
    cat += '<input type="text" class="category_name" placeholder="Nieuwe categorie">';
    cat += '<button class="delete_category btn btn-material-custom-darkgrey pull-right">';
    cat += '<span class="glyphicon glyphicon-remove"></span>';
    cat += '<a id="remove_categorie"></a>';
    cat += '</button>';
    cat += '<div class="clear"></div>';

    // list holder
    var category_id = Math.round( Math.random() * 1000000 );
    cat += '<ul class="category menu-editor ui-state-default drop ui-sortable" id="'+category_id+'"></ul>';

    // add the category
    $('#le_menu').append(cat);

    // now start adding items
    $.each( value.items, function( item_key, item_value ) {
      // lookup info from programs list
      $.each( programs, function( p_key, p_value ) {
        if ( p_value.id == item_value.id ) {
          //console.log("has match:", p_value.id, p_value.title );
          var dataTarget = Math.round( Math.random() * 1000000 );
          var some_item = "";
          some_item += '<li class="ui-state-default available_program_item ui-draggable not_new" id="' + p_value.id + '" style="display: block;"> data-target="' + dataTarget + '"';
          some_item += '';
          some_item += '<img alt="4" class="thumbnail pull-left" height="32px" src="' + p_value.meta.moviedescription.thumbnail + '">';
          some_item += '<span class="program_title">';
          some_item += '  <strong>';
          some_item += p_value.title;
          some_item += '  </strong>';
          some_item += '</span>';
          some_item += '<br>';
          some_item += '<small class="program_title">';
          some_item += p_value.tags.join(', ');
          some_item += '</small>';
          some_item += '<button class="btn btn-material-white pull-right item_delete_button" id="' + dataTarget  + '">';
          some_item += '<span class="glyphicon glyphicon-remove"></span';
          some_item += '<a id="remove_categorie" ></a>';
          some_item += '</button>';
          if ( item_value.emphasize ) {
            some_item += '<div class="togglebutton"><label>' + t.publish.enlarge + '<input class="emphasize" type="checkbox" /></label></div>';
          }else{
            some_item += '<div class="togglebutton"><label>' + t.publish.enlarge + '<input class="emphasize" type="checkbox" checked /></label></div>';
          }
          some_item += '</div></li>';

          $('#' + category_id ).append(some_item);
        }
      });
    });

    // hook up the delete button
    $('.item_delete_button').unbind('click');
    $('.item_delete_button').click( function() {
      var parentItem = $(this).parent().parent();
      var parentItemCount = parentItem.children().length;

      if(parentItemCount == 1)
      {
        $(parentItem).parent().append('<div class="categorydrop ui-state-default dropper" ><div>' + t.publish.drag + '</div></div>');
        $(parentItem).removeAttr('style');
      }
      console.log('try to delete');
      var itemID = $(this).attr('id');
      console.log(itemID);
      $('*[data-target="' + itemID + '"]').remove();

    });
  });
}

// ### Set and append al menu data when a menu is selected in the menu
function setMenudata( Menudata ) {
  $('#le_menu').addClass('hideLeMenu');
  var menuNaam = $('#menu_selector').val();
  if(Menudata === "" || Menudata == "Kies een menu" || menuNaam == "Kies een menu") {
    $('.menu_name input').val("");
    $('#le_menu').empty().removeClass('hideLeMenu');
    $('#create_category_button').attr('disabled', true);
    $('#save_menu_button').attr('disabled', true);
    $('#delete_menu_button').attr('disabled', true);
    $('.menu_name').addClass('disabled_dropdown');
    return;
  }

  setTimeout(function(){
    var jsonMenu = '/channel/menus/' + Menudata + '.json';
    $.get(jsonMenu, function(menudata) {
      $('.menu_name input').val(menudata.name);

      console.log('has menu data: ', menudata);
      var menus = 0;
      console.log('define menus: ', menus);
      try {
        menus = JSON.parse(menudata.items);
        console.log('parse succes menus: ', menus);

      } catch(err) {
        console.log(err);
        menus = menudata.items;
        console.log('parse error menus: ', menus);
      }

      $('.category_item').remove();
      $('#create_category_button').attr('disabled', false);
      $('#save_menu_button').attr('disabled', false);
      $('#delete_menu_button').attr('disabled', false);
      $('.menu_name').removeClass('disabled_dropdown');

      console.log('if length menus: ', menus.length);
      if(menus) {
        $.each(menus.menu,function(key, value) {

          // header
          var menu = "";
          menu += '<li class="category_item">';
          menu += '<span class="handle_icon"></span>';
          menu += '<input type="text" class="category_name" placeholder="Typ categorienaam" value="' + menus.menu[key].name + '">';
          menu += '<button class="delete_category btn btn-material-custom-darkgrey">';
          menu += '<span class="glyphicon glyphicon-remove"></span>';
          menu += '<a id="remove_categorie"></a>';
          menu += '</button>';
          menu += '<button class="toggle_category btn btn-material-custom-darkgrey" >';
          menu += '<span class="glyphicon glyphicon-triangle-right"></span>';
          menu += '<a id="toggle_categorie"></a>';
          menu += '</button>';
          menu += '<div class="clear"></div>';

          // list holder
          var category_id = Math.round( Math.random() * 1000000 );
          menu += '<ul class="category menu-editor ui-state-default drop ui-sortable" id="'+category_id+'"></ul>';
          menu += '<div class="categorydrop ui-state-default dropper" ><div>' + t.publish.drag + '</div></div>';

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
              var item_id = Math.round( Math.random() * 1000000 );
              console.log('item id: ', item_id)
              var some_item = "";
              some_item += '<li class="new-item ui-state-default available_program_item ui-draggable not_new" id="' + menuItem[key].id  + '" style="display: list-item;"  data-target="' + item_id + '">';
              some_item += '<img alt="4" class="pull-left" height="32px" src="' + menuItem[key].thumb + '">';
              some_item += '<div class="program_container">';
              some_item += '<p class="program_title">';
              some_item += shortText;
              some_item += '</p>';
              some_item += '</div>';
              some_item += '<button class="btn btn-material-white pull-right item_delete_button" id="' + item_id  + '">';
              some_item += '<span class="glyphicon glyphicon-remove"></span>';
              some_item += '<a id="remove_categorie"></a>';
              some_item += '</button>';
              if ( menuItem[key].emphasize === false) {
                some_item += '<div class="togglebutton"><label>' + t.publish.enlarge + '<input class="emphasize" type="checkbox" /></label></div>';
              }else{
                some_item += '<div class="togglebutton"><label>' + t.publish.enlarge + '<input class="emphasize" type="checkbox" checked /></label></div>';
              }
              some_item += '</div></li>';
              var prependDiv = '#' + category_id;
              $(prependDiv).append(some_item);
              $.material.init();
            });
            // hook up the delete button
            $('.item_delete_button').unbind('click');
            $('.item_delete_button').click( function() {
              var parentItem = $(this).parent().parent();
              var parentItemCount = parentItem.children().length;

              if(parentItemCount == 1) {
                $(parentItem).parent().append('<div class="categorydrop ui-state-default dropper" ><div>' + t.publish.drag + '</div></div>');
                $(parentItem).removeAttr('style');
              }

              console.log('try to delete');
              var itemID = $(this).attr('id');
              console.log(itemID);
              $('*[data-target="' + itemID + '"]').remove();
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

// ### SAVE, Depricated, is now handled through rails
function exportAndSaveMenu() {
  updateMenuData();
  $('.edit_menu').submit();
  //$.post( "/admin/menu", {"menu": JSON.stringify( menudata ) }, function( data ) {
  //  console.log("post menu was a succes: ", data )
  //})
}

function updateMenuData() {
  menudata = { "menu":[] };
  $('.category_item').each( function( c_key, cat ) {
    var some_category = { "name": $(this).find('.category_name').val(), "items":[] };
    $(this).find('li').each( function( i_key, item ) {
      console.log($(item).prop('id'));
      some_category.items.push( { "name": $(item).find('.program_title').text(), "emphasize": $(item).find('.emphasize').is(':checked'),"id": $(item).prop('id') } );
    });

    menudata.menu.push( some_category );
  });

  // update content object on page
  $('#menu_items').val( JSON.stringify( menudata ) );
}

function setDraggables() {
    // ### Set Draggables
  $( "#all_available li" ).draggable({
    connectToSortable: ".category",
    helper: "clone",
    revert: "invalid",
    dropOnEmpty: true,
    zIndex: 9001,
    addClasses: true,
    sort: function(event, ui) {
      ui.helper.css( {'top' : ui.position.top + $(window).scrollTop() + 'px'} ); // firefox fix
      updateMenuData();
    },
    stop: function(event, ui) {
      updateMenuData();
    }
  });

  // ### Set sortable menu-items
  $( "#le_menu" ).sortable({
    items : '.category_item',
    dropOnEmpty: true,
    sort: function(event, ui) {
      ui.helper.css({'top' : ui.position.top + $(window).scrollTop() + 'px'}); // firefox fix
    },
    stop: function(event, ui) {
      updateMenuData();

    }
  });

  // ### Set Sortable categories
  $( ".category" ).sortable({
    connectWith: ".drop",
    dropOnEmpty: true,
    receive: function(event, ui) {
      var temp_id;
      if (ui.helper !== null ) {
        temp_id = ui.helper['context'].id;
      }else{
        temp_id = ui.item.id;
      }
      initMenuItem( $(this).data().uiSortable.currentItem, temp_id );
    },
    remove: function(event, ui) {
      var removedElement = $(this).children().length;
      if(removedElement === 0) {
        $(this).parent().append('<div class="categorydrop ui-state-default dropper" ><div>' + t.publish.drag + '</div></div>');
        $(this).removeAttr('style');
      }
    },
    sort: function(event, ui) {
      ui.helper.css({'top' : ui.position.top + $(window).scrollTop() + 'px'});  // firefox fix
    },
    stop: function(event, ui) {
      updateMenuData();

    }
  });

  $( ".category" ).droppable({
    accept: '.new-item',
    drop: function( event, ui ) {
      var itemCount = $(this).children().length - 1;
      if(itemCount == 1 || itemCount === 0){
        $(this).parent().find(".categorydrop").remove();
        $(this).parent().find('.category').css('padding','0px 10px 10px 10px');
      }
    }
  });
}

// #############################################################################
// ### ACTION HELPERS
// #############################################################################

function initMenuItem( currentItem, id ) {
  if ( currentItem === undefined || !currentItem.hasClass('not_new') ) {
    var dataTarget = Math.round( Math.random() * 1000000 );
    currentItem.prop('id', id );
    currentItem.append('<button class="btn btn-material-white pull-right item_delete_button" id="' + dataTarget + '"><span class="glyphicon glyphicon-remove"></span><a id="remove_categorie"></a></button><div class="togglebutton"><label>' + t.publish.enlarge + '<input class="emphasize" type="checkbox" /></label></div>');
    currentItem.attr('data-target', dataTarget);
    currentItem.find('.program_dragger').remove();
    currentItem.addClass('not_new');
    currentItem.find('.item_delete_button').unbind('click');
    currentItem.find('.item_delete_button').click( function() {
      var parentItem = $(this).parent().parent();
      var parentItemCount = parentItem.children().length;

      if(parentItemCount == 1)
      {
        $(parentItem).parent().append('<div class="categorydrop ui-state-default dropper" ><div>' + t.publish.drag + '</div></div>');
        $(parentItem).removeAttr('style');
      }
      console.log('try to delete');
      var itemID = $(this).attr('id');
      console.log(itemID);
      $('*[data-target="' + itemID + '"]').remove();
    });
    $.material.init();
  }
}

function updatePrograms( _programs ) {
  var programs = _programs;
  $('#all_available').html('')
  $.each( _programs, function( i, p ) {
    var item_id = Math.round( Math.random() * 1000000 );
    var item = ''
    item += '<li class="new-item ui-state-default available_program_item ui-draggable" id="' + p.id + '" data-target="' + item_id + '">';
    item += '  <img alt="Mqdefault" class="pull-left menu_video_image" height="32px" src="' + p.thumbnail + '">';
    item += '  <div class="program_container">';
    item += '    <p class="program_title">' + p.title + '</p>';
    item += '  </div>';
    item += '  <div class="program_dragger"></div>';
    item += '</li>';
    $('#all_available').append( item );
  });
}

// ### Main
$(function() {

  console.log("INIT MENU");

  // ### Fill Menu
  loadMenuFromData();

  // ### set all draggables
  setDraggables();

  // ### Init categories
  $('.category_item').each( function( key, value) {
    $( value ).find( '.delete_category ').click( function() {
      $(this).closest('.category_item').remove();
    });
  });

  // #############
  // ### Search
  // #############

  $('#available_program_search').on('input', function(e) {
    var filtrz = $('#available_program_search').val().toLowerCase();
    $('#all_available li').each( function(key, value) {
      if (  $(value).find('.program_tags').text().toLowerCase().indexOf( filtrz ) != -1 || $(value).find('.program_title').text().toLowerCase().indexOf( filtrz ) != -1 ) {
        $(value).show();
      }else{
        $(value).hide();
      }
    });
  });

  // ########################
  // ### Save ( and Export )
  // ########################

  $('#save_menu_button').click( exportAndSaveMenu );
  $('#create_category_button').click( createCategory );

});


// #############################################################################
// ### CLOSE OVERLAY AND SHOW MENU CONTAINER
// #############################################################################

$('#hide_menu_container_overlay').click(function() {
  showChannelContainer();
  //TODO: Create new category if empty

  //createCategory();
  console.log('menudata menu', menudata.menu);

  $.get('/channel/menus.json', function(data) {
      if(typeof data =='object') {
        if($.isEmptyObject(data)) {
          setTimeout(function(){
            console.log('create channel');
            createNewMenu();
          },500)
        }
      }
    });
});
