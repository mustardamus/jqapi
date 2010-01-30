$(document).ready(function() {
  $('#navigation').load('navigation.html', function() { //load the navigation (not static because it gets generated with the api scraping)
    
    
    var search_el = $('#search');
    var search_field = $('#search-field', search_el);
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
    
    
    $('.category', static_el).toggle(function() {
      $(this).addClass('open').children('ul').show();
    }, function() {
      $(this).removeClass('open').children('ul').hide();
    });
  });
});