$.get('http://nabu.sense-studios.com/channel/themes.json', function(data) {

  
  if(typeof data =='object')
  {
    var $select = $('#channel_selector');
    $select.find('option').remove();  
    $select.append('<option>Kies een thema</option>');
    $.each(data,function(key, value) 
    {
      $select.append('<option value=' + data[key]._id.$oid + '>' + data[key].title + '</option>');
    });

    //Set when everything is done
    setTimeout( function() {
      $(".dropdown_select").dropdown();
      $(".dropdown_select_small").dropdown();
      $('.demo2').colorpicker({'align': 'right'});
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
            
            
            //change dropdown theme
            $('#theme_selector option').removeAttr('selected');
            $('#theme_selector option[value="' + data[key].theme +'"]').attr("selected", "selected");
            $('#theme_selector').next().find('ul').find('li').removeClass('selected');
            $('#theme_selector').next().find('ul').find('li[value="' + data[key].theme + '"]').addClass('selected');
            $('#theme_selector').next().find('input').val(data[key].theme);
            
            
            //change dropdown menu
            $('#startvideo_selector option').removeAttr('selected');
            $('#startvideo_selector option[value="' + data[key].home_program +'"]').attr("selected", "selected");
            $('#startvideo_selector').next().find('ul').find('li').removeClass('selected');
            $('#startvideo_selector').next().find('ul').find('li[value="' + data[key].home_program + '"]').addClass('selected');
            var startvideo_value = $('#menu_selector').next().find('ul').find('li[value="' + data[key].home_program + '"]').text();
            $('#startvideo_selector').next().find('input').val(menu_value);        


            if(data[key].logo) {
              $('.thumbnail-image-preview').attr("src", data[key].logo).css('background-color', '#FFF');
            } else {
              $('.thumbnail-image-preview').attr("src", "/assets/nabu_editor/blank_image.png").removeAttr('style');
            }
            $('.thumbnail-image-preview').load(function() {
              var height = $(".logopreview img").height();
              $('.logopreview').height(height);
            });
            $('.colorpicker-element input').val( data[key].main_color ).trigger('keyup');
            $('#site_description').val( data[key].about );
            $('#site_contact').val( data[key].contact );
            $('.bekijk-website a').attr('href', 'http://nabu.sense-studios.com/channel/' + data[key].slug );
            
            
            
            
            
            /////////////////////////////////////////////////
            ///GET THE MENUS AND SET THEM IN THE MENU EDITOR
            /////////////////////////////////////////////////
            var Menudata = data[key].menu;
            setMenudata(Menudata); 
          }
        });
      });
      
      $('#menu_selector').next().find('ul').find('li').click(function(){
        console.log('test');
        var selectedvalue = $(this).attr('value');
        $.each(data,function(key,value)
        {
          if(data[key].menu == selectedvalue) {
            var Menudata = data[key].menu;
            setMenudata(Menudata); 
          }
        });
        
      
      });
      
    }, 1000);
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

function setMenudata(Menudata){
  $('#le_menu').addClass('hideLeMenu');
  setTimeout(function(){ 
    var jsonMenu = 'http://nabu.sense-studios.com/channel/menus/' + Menudata + '.json';
    $.get(jsonMenu, function(menudata) {
      menus = JSON.parse(menudata.items);
      $('.category_item').remove();
      $.each(menus.menu,function(key, value) {
          console.log("CREATE category");
          console.log(menus.menu[key]);
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
          
          $('#le_menu').prepend(menu);
        
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
          // re-init draggables
          setDraggables();
        
      
        
        var menuItem = menus.menu[key].items;
        if(menuItem.length > 0) {
          $('#' + category_id).next().remove();
          $('#' + category_id).css('padding', '0px 10px 10px 10px');
        }
        $.each(menuItem,function(key,value){
          var some_item = "";
          some_item += '<li class="new-item ui-state-default available_program_item ui-draggable not_new" id="' + menuItem[key].id  + '" style="display: list-item;">';
          some_item += '<img alt="4" class="pull-left" height="32px" src="' + menuItem[key].thumb + '">';
          some_item += '<div class="program_container">';
          some_item += '<p class="program_title">';
          some_item += menuItem[key].name;
          some_item += '</p>';
          some_item += '</div>';
          some_item += '<button class="delete_category btn btn-material-white pull-right item_delete_button">';
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
          $(prependDiv).prepend(some_item);
          $.material.init();
              // hook up the delete button
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
        
      });

      $('#le_menu').removeClass('hideLeMenu');
    }); 
  }, 200); 
}


