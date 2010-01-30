$(document).ready(function() {
  $('#navigation').load('navigation.html', function() { //load the navigation (not static because it gets generated with the api scraping)
    
    
    var search_el = $('#search');
    var content_el = $('#content');
    var static_el = $('#static-list');
    var searchHeight = search_el.height();

    function resizeLayout() {
      var winh = $(window).height();
      
      static_el.height(winh - searchHeight);
      content_el.height(winh);
    }

    resizeLayout();
    $(window).resize(function() { resizeLayout(); });
    
    
    
  });
});