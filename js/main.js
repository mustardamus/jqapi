jqapi = function() {
  var elements = {};
  
  var values = {
    searchHeight:   null,
    selected:       'selected',
    category:       'category',
    open:           'open',
    catSelected:    'cat-selected',
    sub:            'sub',
    hasFocus:       true,
    loader:         '<div id="loader"></div>',
    title:          'jQAPI - Alternative jQuery Documentation - '
  };
  
  var keys = {
    enter:  13,
    escape: 27,
    up:     38,
    down:   40,
    array:  [12, 27, 38, 40]
  }
  
  
  function initialize() {
    elements = {
      search:         $('#search-field'),
      searchWrapper:  $('#search'),
      content:        $('#content'),
      list:           $('#static-list'),
      window:         $(window),
      results:        null,
      category:       null
    };
    
    elements.results    = jQuery('<ul>', { id: 'results' }).insertBefore(elements.list);
    elements.category   = $('.category', elements.list);
    values.searchHeight = elements.searchWrapper.innerHeight();

    elements.window.resize(function() {
      var winH =  elements.window.height();
      var listH = winH - values.searchHeight;
      
      elements.list.height(listH);
      elements.results.height(listH);
      elements.content.height(winH);
      elements.search.width(elements.searchWrapper.width() - 8);
    })
    .mousemove(function(event) {
      if(event.pageX < elements.list.width()) searchFocus();
    })
    .keydown(function(event) {
      if(event.keyCode == keys.escape) {
        elements.search.val('').focus();
        elements.results.hide();
        elements.list.show();
      }
    })
    .trigger('resize'); //trigger resize event to initially set sizes
    
    elements.search.keyup(function(event) {
      if($.inArray(event.keyCode, keys.array)) {
        handleKey(event.keyCode);
        return false;
      }
    })
    .focus(function() {
      values.hasFocus = true;
    })
    .blur(function() {
      values.hasFocus = false;
    });
    
    $('.'+values.category+' > span', elements.list).toggle(function() {
      clearSelected();
      searchFocus();
      $(this).parent().addClass(values.open).children('ul').show();
    }, function() {
      clearSelected();
      searchFocus();
      $(this).parent().removeClass(values.open).children('ul').hide();
    });
    
    $('.sub a').live('click', function() {
      var el = $(this);
      
      clearSelected();
      searchFocus();
      el.parent().addClass(values.selected);
      $.bbq.pushState({ p: urlMethodName(el) });
      
      return false;
    });
    
    $(window).bind('hashchange', function(event) {
      var state = event.getState();
      
      if(state.p) loadPage($('.sub a[href*="/' + state.p + '/"]:first'));
    }).trigger('hashchange');
    
    zebraItems(elements.list); //zebra the items in the static list
  } //-initialize
  
  
  function searchFocus() {
    elements.search.focus();
  } //-searchFocus
  
  
  function zebraItems(list) {
    $('.sub:odd', list).addClass('odd');
  } //-zebraItems
  
  
  function clearSelected() {
    $('.'+values.selected).removeClass(values.selected);
  } //-clearSelected
  
  
  function handleKey(key) {
    if(values.hasFocus) {
      var selVis = $('.'+values.selected+':visible');
      
      if(selVis.length) {
        if(key == keys.up && selVis.prev().length)    selVis.removeClass(values.selected).prev().addClass(values.selected);
        if(key == keys.down && selVis.next().length)  selVis.removeClass(values.selected).next().addClass(values.selected);
        if(key == keys.enter)                         $.bbq.pushState({ p: urlMethodName(selVis.children('a')) });
      } else { //no visible selected item
        var catSel = $('.'+values.catSelected, elements.list);
        
        if(catSel.length) { //a category is selected
          if(key == keys.up)    catSel.removeClass(values.catSelected).prev().addClass(values.catSelected);
          if(key == keys.down)  catSel.removeClass(values.catSelected).next().addClass(values.catSelected);
          if(key == keys.enter) catSel.removeClass(values.catSelected).children('span').trigger('click');
        } else { //no category selected
          var subVis = $('.'+values.sub+':visible', elements.list);
          
          if(subVis.length) { //there are visible subs in the static list
            if(key == keys.up)    subVis.filter(':last').addClass(values.selected);
            if(key == keys.down)  subVis.filter(':first').addClass(values.selected);
          } else { //only categories are shown
            if(key == keys.up)    elements.category.last().addClass(values.catSelected);
            if(key == keys.down)  elements.category.first().addClass(values.catSelected);
          }
        }
      }
    }
  } //-handleKey
  
  
  function urlMethodName(link) {
    var href = link.attr('href');
    return href.substr(5, href.length - 16);
  } //-urlMethodName
  
  
  function loadPage(link) {
    elements.content.html(values.loader).load(link.attr('href'), function() {
      document.title = values.title + link.children('span:first').text();
      pageTracker._trackPageview(urlMethodName(link));
      formatArticle();
    });
  } //-loadPage
  
  
  function formatArticle() {
    var pDesc = $('p.desc', elements.content);
    
    $('.arguement:odd', elements.content).addClass('arguement-odd');
    if(pDesc.text().length <= 13) pDesc.remove();
    $('img', elements.content).attr('src', function() { return $(this).attr('src').substr(1); });
    
    $('.signatures', elements.content).each(function() {
      var winner = 0;
      var arg = $(this).find('.arguement');

      arg.children('strong').each(function() {
        var width = $(this).width();
        if(width > winner) winner = width;
      });

      arg.css('padding-left', winner + 50);
    });
    
    buildDemos();
  } //-formatArticle
  
  
  function buildDemos() {
    $('code.demo-code', elements.content).each(function() {
      var el = $(this);
      var demo = el.parent().parent().find('.code-demo');
      
      var source = el.html()
                     .replace(/<\/?a.*?>/ig, '').replace(/<\/?strong.*?>/ig, '')
                     .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
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
  } //-buildDemos
  
  
  return {
    initialize: initialize
  }
}();

$(document).ready(function() {
  var navigation_el = $('#navigation').load('navigation.html', function() { //load the navigation (not static because it gets generated with the api scraping)
    
    jqapi.initialize();
    
    var search_el = $('#search');
    var search_field = $('#search-field', search_el).focus();
    var content_el = $('#content');
    var static_el = $('#static-list');
    var search_height = search_el.innerHeight();
    var results = jQuery('<ul>', { id: 'results' }).insertBefore(static_el);
    
    
    /*search_field.keyup(function(event) {
      //if(!checkKey(event.keyCode, false)) return false;

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
          //bindItemClicks(results);
        } else { //empty search
          results.hide();
          static_el.show();
        }
      });
    });    */
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