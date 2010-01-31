$(document).ready(function() {
  var navigation_el = $('#navigation').load('navigation.html', function() { //load the navigation (not static because it gets generated with the api scraping)
    
    var search_el = $('#search');
    var search_field = $('#search-field', search_el).focus();
    var content_el = $('#content');
    var static_el = $('#static-list');
    var search_height = search_el.innerHeight();
    var results = jQuery('<ul>', { id: 'results' }).insertBefore(static_el);

    function resizeLayout() {
      var winh = $(window).height();
      
      static_el.height(winh - search_height);
      results.height(winh - search_height);
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
        $('.arguement:odd', content_el).addClass('arguement-odd');
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
              
              if(pos < last_pos) {
                last_pos = pos;
                winner = lastli;
              }
            }
          }
        });
        
        results.prepend(winner).highlight(term, true, 'highlight').children('li:first').addClass('selected');
        zebraItems(results);
      } else { //empty search
        results.hide();
        static_el.show();
      }
    });    
  });
  
  
  
  $('#feedback').click(function() {
    var link = $(this).attr('href');
    var fwindow = $('#feedback-window');
    var foverlay = $('#feedback-overlay');
    
    if(!fwindow.length) {
      var bod = $('body');
      var win = $(window);
      var winw = win.width();
      var winh = win.height();
      
      fwindow = jQuery('<div>', {
        id: 'feedback-window',
        css: { left: (winw - 920) / 2, height: winh - 100 },
        html: jQuery('<iframe>', { src: link })
      }).appendTo(bod);
      
      foverlay = jQuery('<div>', {
        id: 'feedback-overlay',
        css: { width: winw, height: winh },
        click: function() {
          $(this).fadeOut('fast');
          fwindow.fadeOut('fast');
        }
      }).appendTo(bod);
    }
    
    foverlay.fadeIn('fast');
    fwindow.fadeIn('fast');
    
    return false;
  });
});