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

// ##############
// ### Helpers
// ##############

// ### CREATE
function createCategory() {
  console.log("CREATE category");
  
  // header
  var cat = "";
  cat += '<li class="category_item">';
  cat += '<span class="handle_icon"></span>';
  cat += '<input type="text" class="category_name" placeholder="Typ categorienaam">';
  cat += '<button class="delete_category btn btn-material-custom-darkgrey">';
  cat += '<span class="glyphicon glyphicon-remove"></span';
  cat += '<a id="remove_categorie"></a>';
  cat += '</button>';
  cat += '<button class="toggle_category btn btn-material-custom-darkgrey">';
  cat += '<span class="glyphicon glyphicon-triangle-right"></span';
  cat += '<a id="toggle_categorie"></a>';
  cat += '</button>';
  cat += '<div class="clear"></div>';
  
  // list holder
  var category_id = Math.round( Math.random() * 1000000 );
  cat += '<ul class="category menu-editor ui-state-default drop ui-sortable" id="'+category_id+'"></ul>';
  cat += '<div class="categorydrop ui-state-default dropper" ><div>sleep hier een video uit de linkerkolom</div></div>';
  
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
  // re-init draggables
  setDraggables();
}

// ### LOAD/ Parse
function loadMenuFromData() {
  console.log('has menudatu: ', menudata );
  if ( menudata.menu === undefined ) return;
  
  // render data
  $.each( menudata.menu, function( key, value ) {
    var cat = "";
    
    // header
    cat += '<li class="category_item">';
    cat += '<input type="text" class="category_name" placeholder="Nieuwe categorie">';
    cat += '<button class="delete_category btn btn-material-custom-darkgrey pull-right">';
    cat += '<span class="glyphicon glyphicon-remove"></span';
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
          
          var some_item = "";
          some_item += '<li class="ui-state-default available_program_item ui-draggable not_new" id="' + p_value.id + '" style="display: block;">';
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
          some_item += '<button class="delete_category btn btn-material-white pull-right item_delete_button">';
          some_item += '<span class="glyphicon glyphicon-remove"></span';
          some_item += '<a id="remove_categorie" ></a>';
          some_item += '</button>';
          if ( item_value.emphasize ) {
            some_item += '<div class="togglebutton"><label>Vergroot<input class="emphasize" type="checkbox" /></label></div>';
          }else{
            some_item += '<div class="togglebutton"><label>Vergroot<input class="emphasize" type="checkbox" checked /></label></div>';
          }
          some_item += '</div></li>';
          
          $('#' + category_id ).append(some_item);
        }
      });
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
      
      var itemID = $(this).attr('id');
      $(this).closest(itemID).remove();
      
    });
  });
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
        $(this).parent().append('<div class="categorydrop ui-state-default dropper" ><div>sleep hier een video uit de linkerkolom</div></div>');
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

// ##########################
// ### ACTION HELPERS
// ##########################

function initMenuItem( currentItem, id ) { 
  if ( currentItem === undefined || !currentItem.hasClass('not_new') ) {
    currentItem.prop('id', id );
    currentItem.append('<button class="delete_category btn btn-material-white pull-right item_delete_button" id="' + id + '"><span class="glyphicon glyphicon-remove"></span><a id="remove_categorie"></a></button><div class="togglebutton"><label>Vergroot<input class="emphasize" type="checkbox" /></label></div>');
    currentItem.find('.program_dragger').remove();
    currentItem.addClass('not_new');
    currentItem.find('.item_delete_button').click( function() {
      var parentItem = $(this).parent().parent();
      var parentItemCount = parentItem.children().length;
      
      if(parentItemCount == 1) 
      {
        $(parentItem).parent().append('<div class="categorydrop ui-state-default dropper" ><div>sleep hier een video uit de linkerkolom</div></div>');
        $(parentItem).removeAttr('style');
      }
      
      $(this).parent().remove();
    });
    $.material.init();
  }
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


  // ###################################
  // ### CLOSE OVERLAY AND SHOW MENU CONTAINER
  // ###################################

  $('#hide_menu_container_overlay').click(function() {
    showChannelContainer();
    //TODO: Create new category if empty
    createCategory();
  });
  

  

  


  
  
