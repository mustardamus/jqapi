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
      $(this).parent().addClass('open').children('ul').show();
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
        var sel = 'selected';
        
        if($('.selected:visible').length) {
          var selel =  $('.'+sel);
        
          if(key == 'up' && selel.prev().length) selel.removeClass(sel).prev().addClass(sel);
          if(key == 'down' && selel.next().length) selel.removeClass(sel).next().addClass(sel);
          if(key == 'enter') $.bbq.pushState({ p: getMethodName(selel.children('a')) });
        } else { //no selected field
          var catsel = 'cat-selected';
          var cat = $('.category', static_el);
          var cats = $('.'+catsel, static_el);
          
          if(cats.length) { //a category is already selected
            if(key == 'up') cats.removeClass(catsel).prev().addClass(catsel);
            if(key == 'down') cats.removeClass(catsel).next().addClass(catsel);
            if(key == 'enter') cats.removeClass(catsel).children('span').trigger('click');
          } else { //no category selected
            var subvis = $('.sub:visible', static_el);
            
            if(subvis.length) {
              if(key == 'up') subvis.filter(':last').addClass(sel);
              if(key == 'down') subvis.filter(':first').addClass(sel);
            } else {
              if(key == 'up') cat.last().addClass(catsel);
              if(key == 'down') cat.first().addClass(catsel);
            }
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
    
    
    function generateWorkingDemos() {
      $('code.demo-code', content_el).each(function() {
        var el = $(this);
        var demo = el.parent().parent().find('.code-demo');
        
        var source = el.html()
                        .replace(/<\/?a.*?>/ig, '')
                        .replace(/<\/?strong.*?>/ig, '')
                        .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
                        .replace(/&amp;/g, '&')
                        .replace('/scripts/jquery-1.4.js', 'js/jquery.min.js')
                        .replace(/<script>([^<])/g, '<script>window.onload = (function(){\ntry{$1')
                        .replace(/([^>])<\/sc/g, '$1\n}catch(e){}});</sc')
                        .replace('</head>', '<style>html,body{border:0; margin:0; padding:10px; background: #FFE0BB;}</style></head>');
        
        var iframe = jQuery('<iframe>', {
          src: 'blank.html',
          width: '100%',
          css: {
            height: demo.attr('rel') || 125,
            border: 'none'
          }
        }).get(0);
        
        demo.html(iframe);
        var doc = iframe.contentDocument || (iframe.contentWindow && iframe.contentWindow.document) || iframe.document || null;
        
        if(doc != null) {
          doc.open();
          doc.write(source);
          doc.close();
        }
      });
    }
    
    function loadPage(link) {
      content_el.html('<div id="loader"></div>').load(link.attr('href'), function() {
        document.title = 'jQAPI - Alternative jQuery Documentation - ' + link.children('span:first').text();
        
        
        $('.arguement:odd', content_el).addClass('arguement-odd');
        if($('p.desc', content_el).text().length <= 13) $('p.desc', content_el).remove();
        $('img', content.el).attr('src', function() { return $(this).attr('src').substr(1); });
        
        $('.signatures', content_el).each(function() {
          var winner = 0;
          var arg = $(this).find('.arguement');

          arg.children('strong').each(function() {
            var width = $(this).width();
            if(width > winner) winner = width;
          });

          arg.css('padding-left', winner + 50);
        });
        
        
        generateWorkingDemos();
        pageTracker._trackPageview(getMethodName(link));
      });
    }
    
    
    function markLinkSelected(link) {
      $('.sub').removeClass('selected');
      link.parent().addClass('selected');
      search_field.focus();
    }
    
    function getMethodName(link) {
      var href = link.attr('href');
      return href.substr(5, href.length - 16);
    }
    
    function bindItemClicks(list) {
      $('.sub a', list).click(function() {
        var el = $(this);

        markLinkSelected(el);
        $.bbq.pushState({ p: getMethodName(el) });

        return false;
      });
    }
    bindItemClicks(static_el);

    
    $(window).bind('hashchange', function(event) {
      var state = event.getState();
      
      if(state.p) loadPage($('.sub a[href*="/' + state.p + '/"]:first'));
    }).trigger('hashchange');
    
    
    search_field.keyup(function(event) {
      if(!checkKey(event.keyCode, false)) return false;

      search_field.doTimeout('text-type', 300, function() {
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
          bindItemClicks(results);
        } else { //empty search
          results.hide();
          static_el.show();
        }
      });
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
  
  $('#feedback-trigger').click(function() {
    $('#feedback').trigger('click');
    return false;
  });
});