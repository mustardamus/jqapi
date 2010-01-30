$(document).ready(function() {
  var navigation_el = $('#navigation').load('navigation.html', function() { //load the navigation (not static because it gets generated with the api scraping)
    
    var search_el = $('#search');
    var search_field = $('#search-field', search_el).focus();
    var content_el = $('#content');
    var static_el = $('#static-list');
    var searchHeight = search_el.innerHeight();
    var results = jQuery('<ul>', { id: 'results' }).insertBefore(static_el);

    function resizeLayout() {
      var winh = $(window).height();
      
      static_el.height(winh - searchHeight);
      results.height(winh - searchHeight);
      content_el.height(winh);
      search_field.width(search_el.width() - 8);
    }

    resizeLayout();
    $(window).resize(function() { resizeLayout(); });
    
    
    function zebraItems(parent) {
      $('.sub:odd', parent).addClass('odd');
    }
    zebraItems(static_el);
    
    
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
        
        if($('.selected:visible').length) {
          var sel = 'selected';
          var selel =  $('.'+sel);
        
          if(key == 'up' && selel.prev().length) selel.removeClass(sel).prev().addClass(sel);
          if(key == 'down' && selel.next().length) selel.removeClass(sel).next().addClass(sel);
          if(key == 'enter') loadPage(selel.children('a'), false);
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
    
    function checkKey(key, rval) {
      switch(key) {
        case 27: search_field.val('').focus(); results.hide(); static_el.show(); if(!rval) return false; break;   //ESC
        case 38: handleKey('up'); if(!rval) return false; break;
        case 40: handleKey('down'); if(!rval) return false; break;
        case 13: handleKey('enter'); if(!rval) return false; break;
      }
      
      return true;
    }
    
    $(window).keyup(function(event) {
      checkKey(event.keyCode, true);
    }).mousemove(function(event) {
      mouse_x = event.pageX;
    });
    
    
    function loadPage(link, clicked) {
      if(clicked) {
        $('.sub').removeClass('selected');
        link.parent().addClass('selected');
        search_field.focus();
      }
      
      content_el.html('<div id="loader"></div>').load(link.attr('href'), function() {
        //load examples / format stuff
      });
    }
    
    $('.sub a', static_el).click(function() {
      loadPage($(this), true);
      return false;
    });
    
    
    search_field.keyup(function(event) {
      if(!checkKey(event.keyCode, false)) return false;

      var term = search_field.val();

      results.html('');
      
      if(term.length) {
        results.show();
        static_el.hide();
        
        var last_pos = 100;
        var winner = $;
        
        $('.searchable', static_el).each(function() {
          var el = $(this);
          var daddy = el.parent().parent();
          var name = el.text();
          var pos = name.toLowerCase().indexOf(term.toLowerCase());
          
          if(pos != -1) {
            if(results.text().indexOf(name) == -1) {
              var lastli = jQuery('<li>', {
                'class': 'sub',
                html: daddy.html()
              }).appendTo(results);
              
              if(pos < last_pos) last_pos = pos; winner = lastli;
            }
          }
        });
        
        results.prepend(winner).children('li:first').addClass('selected');
        zebraItems(results);
        
      } else { //empty search
        results.hide();
        static_el.show();
      }
    });    
  });
});