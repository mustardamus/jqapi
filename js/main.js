$(document).ready(function() {
  var navigation_el = $('#navigation').load('navigation.html', function() { //load the navigation (not static because it gets generated with the api scraping)
    
    var search_el = $('#search');
    var search_field = $('#search-field', search_el).focus();
    var content_el = $('#content');
    var static_el = $('#static-list');
    var searchHeight = search_el.innerHeight();

    function resizeLayout() {
      var winh = $(window).height();
      
      static_el.height(winh - searchHeight);
      content_el.height(winh);
      search_field.width(search_el.width() - 8);
    }

    resizeLayout();
    $(window).resize(function() { resizeLayout(); });
    
    
    $('.sub:odd', static_el).addClass('odd');
    
    
    function keepKeys() {
      search_field.focus();
      $('.selected', static_el).removeClass('selected');
    }
    
    $('.category > span', static_el).toggle(function() {
      keepKeys();
      $(this).parent().addClass('open').children('ul').show().children('li:first').addClass('selected');
    }, function() {
      keepKeys();
      $(this).parent().removeClass('open').children('ul').hide();
    });
    
    
    var mouse_x = 0;
    var has_focus = true;
    
    search_field
      .focus(function() { has_focus = true; })
      .blur(function() { has_focus = false; });
    
    function isOverNavigation() {
      if(mouse_x <= navigation_el.width() || has_focus) return true;
      else return false;
    }

    
    function handleKey(key) {
      if(isOverNavigation()) {
        search_field.focus();
        
        if($('.selected').length) {
          var sel = 'selected';
          var selel =  $('.'+sel);
        
          if(key == 'up' && selel.prev().length) selel.removeClass(sel).prev().addClass(sel);
          if(key == 'down' && selel.next().length) selel.removeClass(sel).next().addClass(sel);
          if(key == 'enter') selel.children('a').trigger('click');
        } else { //no selected field
          var catsel = 'cat-selected';
          var cat = $('.category', static_el);
          var cats = $('.'+catsel, static_el);
          
          if(cats.length) { //a category is already selected
            if(key == 'up') cats.removeClass(catsel).prev().addClass(catsel);
            if(key == 'down') cats.removeClass(catsel).next().addClass(catsel);
            if(key == 'enter') cats.removeClass(catsel).children('span').trigger('click').parent().find('.sub:first').addClass('selected');
          } else { //no category selected
            if(key == 'up') cat.last().addClass(catsel);
            if(key == 'down') cat.first().addClass(catsel);
          }
        }
      }
    }
    
    $(window).keyup(function(event) {
      //console.log(event.keyCode);
      
      switch(event.keyCode) {
        case 27: search_field.val('').focus(); break;   //ESC
        case 38: handleKey('up'); break;
        case 40: handleKey('down'); break;
        case 13: handleKey('enter'); break;
      }
    }).mousemove(function(event) {
      mouse_x = event.pageX;
    });
    
    
    function loadPage(link) {
      $('.sub', static_el).removeClass('selected');
      link.parent().addClass('selected');
      
      content_el.html('<div id="loader"></div>').load(link.attr('href'), function() {
        
      });
    }
    
    $('.sub a', static_el).click(function() {
      loadPage($(this));
      return false;
    });
  });
});