$(document).ready(function() {
  $('#navigation').load('navigation.html', function() { //load the navigation (not static because it gets generated with the api scraping)
    
    
    var search_el = $('#search');
    var search_field = $('#search-field', search_el);
    var content_el = $('#content');
    var static_el = $('#static-list');
    var searchHeight = search_el.height();

    function resizeLayout() {
      var win = $(window);
      var winh = win.height();
      
      static_el.height(winh - searchHeight);
      content_el.height(winh);
      search_field.width(win.width());
    }

    resizeLayout();
    $(window).resize(function() { resizeLayout(); });
    
    
    
  });
});